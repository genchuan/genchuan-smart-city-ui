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
import type { ActiveFilterTag } from '#/views/genchuan/industry/chargePark/userMerchant/utils/filterTags';

import { computed, nextTick, onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

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
  ElText,
} from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { PlateAuthApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/plateAuth';
import { UserCarApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userCar';
import { UserInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userInfo';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { buildActiveFilterTags } from '#/views/genchuan/industry/chargePark/userMerchant/utils/filterTags';

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

// 快捷筛选变量
const filterStatus = ref('');
const searchParams = ref<Record<string, any>>({});

const quickFilterConfigs = {
  status: {
    label: '认证状态',
    type: 'warning',
  },
} as const;

const searchFilterConfigs = {
  applyTime: {
    formatter: (value: any[]) => value.join(' 至 '),
    label: '申请时间',
    type: 'danger',
  },
  plateNo: {
    label: '车牌号码',
    type: 'primary',
  },
  status: {
    label: '认证状态',
    type: 'warning',
  },
  userId: {
    label: '所属用户',
    type: 'info',
  },
} as const;

const activeFilterTags = computed<ActiveFilterTag[]>(() =>
  buildActiveFilterTags([
    {
      configs: quickFilterConfigs,
      source: 'quick',
      values: {
        status: filterStatus.value,
      },
    },
    {
      configs: searchFilterConfigs,
      source: 'search',
      values: searchParams.value,
    },
  ]),
);

// 搜索抽屉
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  async onOpenChange() {},
});

// 搜索表单
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onQuerySubmit,
  layout: 'horizontal',
  schema: useSearchSchema(userSelectOptions.value).map((v: any) => {
    delete v.rules;
    return { ...v };
  }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

/** 搜索表单提交 */
async function onQuerySubmit(values: Record<string, any>) {
  searchParams.value = { ...values };
  await handleRefresh();
  drawerApi.close();
}

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
  formValues: Record<string, any> = {},
) {
  const queryValues = {
    ...formValues,
    ...searchParams.value,
  };

  if (filterStatus.value) {
    queryValues.status = filterStatus.value;
  }

  const result = await PlateAuthApi.getPlateAuthPage({
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...buildPlateAuthQueryParams(queryValues),
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
  gridOptions: {
    columns: useGridColumns(),
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
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
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

  await queryFormApi.updateSchema([
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
  filterStatus.value = '';
  return gridApi.reload();
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
  searchParams.value = {};
  checkedIds.value = [];
  checkedRows.value = [];
  filterStatus.value = '';
  await queryFormApi.resetForm();
  return gridApi.reload();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  searchParams.value = {
    ...searchParams.value,
    ...values,
  };
  filterStatus.value = '';
  void syncQueryFormValues();
  return gridApi.reload();
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
  const exportValues = {
    ...searchParams.value,
  };

  if (filterStatus.value) {
    exportValues.status = filterStatus.value;
  }

  try {
    const data = await PlateAuthApi.exportPlateAuth(
      buildPlateAuthQueryParams(exportValues),
    );
    downloadFileFromBlobPart({ fileName: '车牌认证.xls', source: data });
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

/** 打开搜索抽屉 */
async function handleSerachShow() {
  drawerApi.open();
  await syncQueryFormValues();
}

async function syncQueryFormValues() {
  await queryFormApi.resetForm();
  await queryFormApi.setValues(searchParams.value);
}

/** 按状态筛选 */
function handleFilterStatus(status: string) {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.reload();
}

/** 取消状态筛选 */
function handleCancelStatusFilter() {
  filterStatus.value = '';
  gridApi.reload();
}

/** 移除筛选标签 */
async function handleRemoveFilterTag(tag: ActiveFilterTag) {
  if (tag.source === 'quick') {
    if (tag.key === 'status') {
      handleCancelStatusFilter();
    }
    return;
  }

  const nextValues = { ...searchParams.value };
  delete nextValues[tag.key];
  searchParams.value = nextValues;
  await syncQueryFormValues();
  await handleRefresh();
}

const handleOpenDetail = (row: PlateAuthRow) => {
  handleDetail(row);
};

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
  <div class="park-lot-table-new user-merchant-table-grid">
    <Grid>
      <template #table-title>
        <div
          class="tabel-tabs"
          style="display: flex; flex-wrap: wrap; align-items: center"
        >
          <ElTag
            v-for="tag in activeFilterTags"
            :key="`${tag.source}-${tag.key}`"
            :type="tag.type"
            closable
            style="height: 32px; margin: 4px 0; line-height: 32px"
            @close="handleRemoveFilterTag(tag)"
          >
            {{ tag.label }}：{{ tag.value }}
          </ElTag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="批量审核"
            :disabled="isEmpty(checkedIds)"
            icon-name="Check"
            @click="handleOpenBatchAudit"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="props.toggleStats"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="() => screenfull.toggle()"
          />
        </div>
      </template>

      <template #userName="{ row }">
        <ElText
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleOpenUser(row)"
        >
          {{ row.userName }}
        </ElText>
      </template>

      <template #plateNo="{ row }">
        <ElText
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleOpenCar(row)"
        >
          {{ row.plateNo }}
        </ElText>
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
        <ElTag
          :type="
            row.status === '已认证'
              ? 'success'
              : row.status === '待审核'
                ? 'warning'
                : 'danger'
          "
          style="cursor: pointer"
          @click="handleFilterStatus(row.status)"
        >
          {{ row.status }}
        </ElTag>
      </template>

      <template #auditorName="{ row }">
        <ElText
          v-if="row.auditorName !== '-'"
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleOpenOperator(row)"
        >
          {{ row.auditorName }}
        </ElText>
        <span v-else>{{ row.auditorName }}</span>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            v-if="row.status === '待审核'"
            content="通过"
            icon-name="Check"
            @click="handleApprove(row)"
          />
          <IconButton
            v-if="row.status === '待审核'"
            content="驳回"
            icon-name="Close"
            @click="handleOpenReject(row)"
          />
          <IconButton
            v-if="row.status === '已驳回'"
            content="重新认证"
            icon-name="RefreshRight"
            @click="handleReauth(row)"
          />
        </div>
      </template>
    </Grid>

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

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
.table-title-wrap {
  display: flex;
  gap: 12px;
  align-items: center;
}

.table-title-text {
  font-size: 16px;
  font-weight: 500;
}

.status-filter-tags {
  display: flex;
  gap: 8px;
}

.status-tag {
  cursor: pointer;
}

.query-form {
  padding: 16px;
}
</style>
