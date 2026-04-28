<script lang="ts" setup>
import type {
  CarProfileInfo,
  OperatorInfo,
  PlateAuthRow,
  UserProfileInfo,
  UserSelectOption,
} from '../data';

import type { PlateAuthDetailVO } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/plateAuth';
import type { UserCarDetailVO } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userCar';

import { computed, nextTick, onMounted, ref } from 'vue';

import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElImage,
  ElInput,
  ElLoading,
  ElMessage,
  ElRadioButton,
  ElRadioGroup,
  ElTag,
} from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { PlateAuthApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/plateAuth';
import { UserCarApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userCar';
import { UserInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userInfo';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import {
  buildPlateAuthQueryParams,
  buildPlateAuthRowFromApi,
  buildUserProfileLookup,
  buildUserSelectOptions,
  formatAuthLogs,
  getCarProfile,
  getOperatorDetail,
  getUserProfile,
  maskPhone,
  detailFields as plateAuthDetailFields,
  useGridColumns,
  userOptions,
  useSearchSchema,
} from '../data';

interface BatchAuditState {
  mode: 'approve' | 'reject';
  remark: string;
}

const props = withDefaults(
  defineProps<{
    reloadStats?: () => Promise<void> | void;
    showStats?: boolean;
    toggleStats?: () => void;
  }>(),
  {
    reloadStats: async () => {},
    showStats: false,
    toggleStats: () => {},
  },
);

const batchAuditDialogVisible = ref(false);
const batchAuditState = ref<BatchAuditState>({
  mode: 'approve',
  remark: '',
});
const checkedIds = ref<number[]>([]);
const checkedRows = ref<PlateAuthRow[]>([]);
const currentCarProfile = ref<CarProfileInfo | null>(null);
const currentUserProfile = ref<null | UserProfileInfo>(null);
const detailCache = new Map<number, PlateAuthDetailVO>();
const carDetailCache = new Map<number, UserCarDetailVO>();
const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<PlateAuthRow>();
const operatorDetail = ref<null | OperatorInfo>(null);
const operatorDialogVisible = ref(false);
const rejectDialogVisible = ref(false);
const rejectReason = ref('');
const rejectRow = ref<PlateAuthRow>();
const userDialogVisible = ref(false);
const userProfileLookup = ref<Record<number, Partial<UserProfileInfo>>>({});
const userSelectOptions = ref<UserSelectOption[]>(userOptions);
const vehicleDialogVisible = ref(false);

const detailData = computed(() => {
  if (!detailObj.value) {
    return null;
  }

  return {
    ...detailObj.value,
    authLogsSummary: formatAuthLogs(detailObj.value.authLogs),
    maskedPhone: maskPhone(detailObj.value.phone),
  };
});

/** 查询认证列表 */
async function queryPlateAuthPage(
  { page }: any,
  formValues: Record<string, any>,
) {
  const result = await PlateAuthApi.getPlateAuthPage({
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...buildPlateAuthQueryParams(formValues),
  });

  const list = Array.isArray(result?.list) ? result.list : [];

  return {
    list: list.map((item) =>
      buildPlateAuthRowFromApi(item, {}, userProfileLookup.value),
    ),
    total: result?.total || 0,
  };
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useSearchSchema(userSelectOptions.value),
  },
  gridOptions: {
    columns: useGridColumns(),
    layouts: [['Form'], ['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: queryPlateAuthPage,
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});

/** 加载所属用户下拉 */
async function loadUserOptions() {
  try {
    const result = await UserInfoApi.getUserInfoPage({
      pageNo: 1,
      pageSize: 200, // 最多200
    });
    const list = Array.isArray(result?.list) ? result.list : [];

    userSelectOptions.value = buildUserSelectOptions(
      list.map((item) => ({
        label: item.nickname,
        phone: item.phone,
        remark: item.remark,
        userType: item.userType,
        value: Number(item.id ?? 0),
      })),
    );
    userProfileLookup.value = buildUserProfileLookup(userSelectOptions.value);
  } catch (error) {
    console.error('[plateAuth] load user options failed:', error);
    userSelectOptions.value = buildUserSelectOptions(userSelectOptions.value);
    userProfileLookup.value = buildUserProfileLookup(userSelectOptions.value);
  }

  await gridApi.formApi.updateSchema([
    {
      fieldName: 'userId',
      componentProps: {
        options: userSelectOptions.value,
      },
    },
  ]);

  await handleRefresh();
}

/** 获取车辆详情 */
async function fetchUserCarDetail(
  carId: number,
  errorMessage = '加载车辆详情失败',
) {
  const cachedDetail = carDetailCache.get(carId);

  if (cachedDetail) {
    return cachedDetail;
  }

  try {
    const data = await UserCarApi.getUserCar(carId);
    carDetailCache.set(carId, data);
    return data;
  } catch (error) {
    ElMessage.error(errorMessage);
    console.error('[plateAuth] load car detail failed:', error);
    return null;
  }
}

/** 获取认证详情 */
async function fetchPlateAuthDetail(
  row: PlateAuthRow,
  errorMessage = '加载认证详情失败',
) {
  const cachedDetail = detailCache.get(row.id);

  if (cachedDetail) {
    const nextRow = buildPlateAuthRowFromApi(
      cachedDetail,
      row,
      userProfileLookup.value,
    );
    return {
      row: nextRow,
      source: cachedDetail,
    };
  }

  const loadingInstance = ElLoading.service({
    target: '.plate-auth-table',
    text: '加载中...',
  });

  try {
    const data = await PlateAuthApi.getPlateAuth(row.id);
    const carId = Number(data.carId ?? row.carId ?? 0);
    const carDetail = carId
      ? await fetchUserCarDetail(carId, errorMessage)
      : null;
    const nextSource: PlateAuthDetailVO = carDetail
      ? {
          ...data,
          carInfo: {
            bindTime: carDetail.bindTime,
            carType: carDetail.carType,
            id: carDetail.id,
            plateColor: carDetail.plateColor,
            plateNo: carDetail.plateNo,
            status: carDetail.status,
            userId: carDetail.userId,
          },
          userInfo: data.userInfo || carDetail.userInfo,
        }
      : data;

    detailCache.set(row.id, nextSource);

    return {
      row: buildPlateAuthRowFromApi(nextSource, row, userProfileLookup.value),
      source: nextSource,
    };
  } catch (error) {
    ElMessage.error(errorMessage);
    console.error('[plateAuth] load detail failed:', error);
    return null;
  } finally {
    loadingInstance.close();
  }
}

/** 刷新表格 */
function handleRefresh() {
  return gridApi.query();
}

/** 联动刷新页面 */
async function handleReloadPage() {
  checkedIds.value = [];
  checkedRows.value = [];
  detailCache.clear();
  carDetailCache.clear();
  gridApi.grid?.clearCheckboxRow?.();
  await handleRefresh();
  await props.reloadStats?.();
}

/** 重置筛选条件 */
async function resetSearch() {
  checkedIds.value = [];
  checkedRows.value = [];
  await gridApi.formApi.resetForm();
  await handleRefresh();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  await gridApi.formApi.setValues(values);
  await handleRefresh();
}

/** 重新计算表格布局 */
async function recalculateLayout() {
  await gridApi.grid?.recalculate?.(true);
  await gridApi.grid?.refreshScroll?.();
}

defineExpose({
  recalculateLayout,
  resetSearch,
  setSearchValues,
});

onMounted(async () => {
  await nextTick();
  await loadUserOptions();
});

/** 导出当前列表 */
async function handleExport() {
  const formValues = await gridApi.formApi.getValues();

  try {
    await PlateAuthApi.exportPlateAuth(buildPlateAuthQueryParams(formValues));
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error('[plateAuth] export failed:', error);
  }
}

/** 同步勾选记录 */
function handleRowCheckboxChange({ records }: { records: PlateAuthRow[] }) {
  checkedIds.value = records.map((item) => item.id);
  checkedRows.value = records;
}

/** 打开批量审核弹窗 */
function handleOpenBatchAudit() {
  const pendingRows = checkedRows.value.filter(
    (item) => item.status === '待审核',
  );

  if (pendingRows.length === 0) {
    ElMessage.warning('请先勾选待审核的认证记录');
    return;
  }

  batchAuditState.value = {
    mode: 'approve',
    remark: '',
  };
  batchAuditDialogVisible.value = true;
}

/** 确认批量审核 */
async function handleConfirmBatchAudit() {
  const pendingRows = checkedRows.value.filter(
    (item) => item.status === '待审核',
  );

  if (pendingRows.length === 0) {
    ElMessage.warning('当前选中项中没有待审核记录');
    return;
  }

  if (
    batchAuditState.value.mode === 'reject' &&
    batchAuditState.value.remark.trim().length < 10
  ) {
    ElMessage.warning('驳回理由不能少于 10 个字');
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.plate-auth-table',
    text: '批量审核中...',
  });
  const currentMode = batchAuditState.value.mode;

  try {
    await PlateAuthApi.batchAuditPlateAuth({
      auditRemark: batchAuditState.value.remark.trim() || undefined,
      auditResult: currentMode === 'approve' ? '通过' : '驳回',
      ids: pendingRows.map((item) => item.id),
    });
    batchAuditDialogVisible.value = false;
    batchAuditState.value = {
      mode: 'approve',
      remark: '',
    };
    ElMessage.success(
      currentMode === 'approve' ? '批量审核通过成功' : '批量驳回成功',
    );
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('批量审核失败');
    console.error('[plateAuth] batch audit failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 单条审核通过 */
async function handleApprove(row: PlateAuthRow) {
  const loadingInstance = ElLoading.service({
    target: '.plate-auth-table',
    text: '审核中...',
  });

  try {
    await PlateAuthApi.approvePlateAuth({
      auditRemark: '行驶证信息无误，认证通过',
      ids: [row.id],
    });
    ElMessage.success('审核通过');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('审核通过失败');
    console.error('[plateAuth] approve failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开驳回弹窗 */
function handleOpenReject(row: PlateAuthRow) {
  rejectReason.value = '';
  rejectRow.value = row;
  rejectDialogVisible.value = true;
}

/** 确认驳回认证 */
async function handleConfirmReject() {
  if (rejectReason.value.trim().length < 10) {
    ElMessage.warning('驳回理由不能少于 10 个字');
    return;
  }

  if (!rejectRow.value) {
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.plate-auth-table',
    text: '驳回中...',
  });

  try {
    await PlateAuthApi.rejectPlateAuth({
      auditRemark: rejectReason.value.trim(),
      ids: [rejectRow.value.id],
    });
    rejectDialogVisible.value = false;
    rejectReason.value = '';
    rejectRow.value = undefined;
    ElMessage.success('认证已驳回');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('驳回失败');
    console.error('[plateAuth] reject failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 重新发起认证 */
async function handleReauth(row: PlateAuthRow) {
  const loadingInstance = ElLoading.service({
    target: '.plate-auth-table',
    text: '重新认证中...',
  });

  try {
    await PlateAuthApi.reauthPlateAuth({
      ids: [row.id],
    });
    ElMessage.success('已重新发起认证');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('重新认证失败');
    console.error('[plateAuth] reauth failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开详情抽屉 */
async function handleDetail(row: PlateAuthRow) {
  const detail = await fetchPlateAuthDetail(row);

  if (!detail) {
    return;
  }

  detailObj.value = detail.row;
  detailDrawerRef.value?.open();
}

/** 打开用户详情弹窗 */
async function handleOpenUser(row: PlateAuthRow) {
  const loadingInstance = ElLoading.service({
    target: '.plate-auth-table',
    text: '加载中...',
  });

  try {
    const data = await UserInfoApi.getUserInfo(row.userId);
    currentUserProfile.value = {
      nickname: data.nickname || row.userName,
      phone: maskPhone(data.phone || row.phone),
      remark: data.remark || row.userInfo?.remark || '',
      userType: data.userType || row.userInfo?.userType || '-',
    };
  } catch (error) {
    currentUserProfile.value =
      row.userInfo ||
      getUserProfile(
        row.userId,
        row.userName,
        undefined,
        userProfileLookup.value,
      );
    currentUserProfile.value = {
      ...currentUserProfile.value,
      phone: maskPhone(currentUserProfile.value.phone),
    };
    ElMessage.error('加载用户详情失败');
    console.error('[plateAuth] load user profile failed:', error);
  } finally {
    loadingInstance.close();
  }

  userDialogVisible.value = true;
}

/** 打开车辆详情弹窗 */
async function handleOpenCar(row: PlateAuthRow) {
  const detail = await fetchPlateAuthDetail(row, '加载车辆详情失败');

  if (!detail) {
    return;
  }

  currentCarProfile.value =
    detail.row.carInfo || getCarProfile(detail.row.carId, detail.row.plateNo);
  vehicleDialogVisible.value = true;
}

/** 打开操作人员弹窗 */
async function handleOpenOperator(row: PlateAuthRow) {
  if (!row.auditorName || row.auditorName === '-') {
    return;
  }

  if (row.auditorInfo) {
    operatorDetail.value = row.auditorInfo;
    operatorDialogVisible.value = true;
    return;
  }

  const detail = await fetchPlateAuthDetail(row, '加载操作人员详情失败');

  if (!detail) {
    return;
  }

  operatorDetail.value =
    detail.row.auditorInfo ||
    getOperatorDetail(detail.row.auditorName, undefined, detail.row.auditorId);
  operatorDialogVisible.value = true;
}
</script>

<template>
  <div class="plate-auth-table">
    <div class="plate-auth-grid-wrap">
      <Grid table-title="车牌认证列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '导出',
                type: 'primary',
                icon: ACTION_ICON.DOWNLOAD,
                onClick: handleExport,
              },
              {
                label: '批量审核',
                type: 'primary',
                icon: ACTION_ICON.AUDIT,
                disabled: checkedIds.length === 0,
                onClick: handleOpenBatchAudit,
              },
              {
                label: props.showStats ? '隐藏统计' : '显示统计',
                type: 'primary',
                icon: props.showStats
                  ? 'lucide:chevron-up'
                  : 'lucide:chevron-down',
                onClick: props.toggleStats,
              },
            ]"
          />
        </template>

        <template #userName="{ row }">
          <ElButton type="primary" link @click="handleOpenUser(row)">
            {{ row.userName }}
          </ElButton>
        </template>

        <template #plateNo="{ row }">
          <ElButton type="primary" link @click="handleOpenCar(row)">
            {{ row.plateNo }}
          </ElButton>
        </template>

        <template #drivingLicense="{ row }">
          <ElImage
            :preview-src-list="[row.drivingLicense]"
            :preview-teleported="true"
            :src="row.drivingLicense"
            fit="cover"
            style="width: 68px; height: 42px; border-radius: 4px"
          />
        </template>

        <template #status="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ status: row.status })"
          >
            <ElTag
              :type="
                row.status === '已认证'
                  ? 'success'
                  : row.status === '待审核'
                    ? 'warning'
                    : 'danger'
              "
            >
              {{ row.status }}
            </ElTag>
          </ElButton>
        </template>

        <template #auditorName="{ row }">
          <ElButton
            v-if="row.auditorName !== '-'"
            type="primary"
            link
            @click="handleOpenOperator(row)"
          >
            {{ row.auditorName }}
          </ElButton>
          <span v-else>{{ row.auditorName }}</span>
        </template>

        <template #actions="{ row }">
          <TableAction
            :actions="[
              {
                label: '查看',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.VIEW,
                onClick: handleDetail.bind(null, row),
              },
              {
                label: '通过',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.status === '待审核',
                onClick: handleApprove.bind(null, row),
              },
              {
                label: '驳回',
                type: 'danger',
                link: true,
                icon: ACTION_ICON.DELETE,
                ifShow: () => row.status === '待审核',
                onClick: handleOpenReject.bind(null, row),
              },
              {
                label: '重新认证',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.status === '已驳回',
                onClick: handleReauth.bind(null, row),
              },
            ]"
          />
        </template>
      </Grid>
    </div>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="plateAuthDetailFields"
      :title="detailObj ? `${detailObj.plateNo}认证详情` : '车牌认证详情'"
    />

    <ElDialog v-model="batchAuditDialogVisible" title="批量审核" width="520px">
      <ElRadioGroup v-model="batchAuditState.mode">
        <ElRadioButton value="approve">批量通过</ElRadioButton>
        <ElRadioButton value="reject">批量驳回</ElRadioButton>
      </ElRadioGroup>
      <ElInput
        v-model="batchAuditState.remark"
        :maxlength="200"
        :placeholder="
          batchAuditState.mode === 'reject'
            ? '请输入统一驳回理由，不少于 10 个字'
            : '请输入审核备注'
        "
        :rows="4"
        show-word-limit
        style="margin-top: 16px"
        type="textarea"
      />
      <template #footer>
        <ElButton @click="batchAuditDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleConfirmBatchAudit">
          确认
        </ElButton>
      </template>
    </ElDialog>

    <ElDialog v-model="rejectDialogVisible" title="驳回认证" width="520px">
      <ElInput
        v-model="rejectReason"
        :rows="4"
        maxlength="200"
        placeholder="请输入驳回理由，不少于 10 个字"
        show-word-limit
        type="textarea"
      />
      <template #footer>
        <ElButton @click="rejectDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleConfirmReject">确认</ElButton>
      </template>
    </ElDialog>

    <ElDialog v-model="userDialogVisible" title="用户详情" width="520px">
      <ElDescriptions v-if="currentUserProfile" :column="1" border>
        <ElDescriptionsItem label="用户昵称">
          {{ currentUserProfile.nickname }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="绑定手机号">
          {{ currentUserProfile.phone }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="用户类型">
          {{ currentUserProfile.userType }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="备注">
          {{ currentUserProfile.remark }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>

    <ElDialog v-model="vehicleDialogVisible" title="车辆详情" width="520px">
      <ElDescriptions v-if="currentCarProfile" :column="1" border>
        <ElDescriptionsItem label="车牌号码">
          {{ currentCarProfile.plateNo }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="车牌颜色">
          {{ currentCarProfile.plateColor }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="车辆类型">
          {{ currentCarProfile.carType }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="绑定状态">
          {{ currentCarProfile.status }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="绑定时间">
          {{ currentCarProfile.bindTime }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>

    <ElDialog
      v-model="operatorDialogVisible"
      title="操作人员详情"
      width="520px"
    >
      <ElDescriptions v-if="operatorDetail" :column="1" border>
        <ElDescriptionsItem label="姓名">
          {{ operatorDetail.name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="账号">
          {{ operatorDetail.account }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="角色">
          {{ operatorDetail.role }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="部门">
          {{ operatorDetail.dept }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="手机号">
          {{ operatorDetail.phone }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.plate-auth-table,
.plate-auth-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.plate-auth-table {
  display: flex;
  flex-direction: column;
}

.plate-auth-grid-wrap {
  flex: 1;
}

:deep(.vxe-grid) {
  height: 100% !important;
}

:deep(.vxe-grid--layout-body-wrapper),
:deep(.vxe-grid--layout-body-content-wrapper),
:deep(.vxe-grid--table-container),
:deep(.vxe-grid--table-wrapper) {
  min-height: 0;
}
</style>
