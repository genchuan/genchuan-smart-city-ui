<script lang="ts" setup>
import type { UploadUserFile } from 'element-plus';

import type {
  OperatorInfo,
  UserCarRow,
  UserProfileInfo,
  UserSelectOption,
} from '../data';

import type { UserCarDetailVO } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userCar';

import { computed, nextTick, onMounted, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';

import dayjs from 'dayjs';
import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElInput,
  ElLoading,
  ElMessage,
  ElTag,
} from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { UserCarApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userCar';
import { UserInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userInfo';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import {
  buildUserCarQueryParams,
  buildUserCarRowFromApi,
  buildUserSelectOptions,
  getBindingLogsSummary,
  getOperatorDetail,
  getUserProfile,
  maskPhone,
  useCreateSchema,
  useEditSchema,
  useGridColumns,
  detailFields as userCarDetailFields,
  userOptions,
  useSearchSchema,
} from '../data';

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

const currentOperatorProfile = ref<null | OperatorInfo>(null);
const currentRow = ref<UserCarRow>();
const currentUserProfile = ref<null | UserProfileInfo>(null);
const detailCache = new Map<number, UserCarDetailVO>();
const detailDrawerRef = ref<null | { open: () => void }>(null);
const drillFilters = ref({
  plateColor: '',
});
const formData = ref<UserCarRow>();
const formMode = ref<'create' | 'edit'>('create');
const formSource = ref<UserCarDetailVO>();
const importDialogVisible = ref(false);
const importFileList = ref<UploadUserFile[]>([]);
const operatorDialogVisible = ref(false);
const rejectDialogVisible = ref(false);
const rejectReason = ref('');
const rejectRow = ref<UserCarRow>();
const userDialogVisible = ref(false);
const userSelectOptions = ref<UserSelectOption[]>(userOptions);

const detailData = computed(() => {
  if (!currentRow.value) {
    return null;
  }

  return {
    ...currentRow.value,
    bindingLogsSummary: getBindingLogsSummary(currentRow.value.bindingLogs),
    maskedPhone: maskPhone(currentRow.value.phone),
  };
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 96,
  },
  layout: 'horizontal',
  schema: useCreateSchema(userSelectOptions.value),
  showDefaultActions: false,
});

/** 获取车辆详情 */
async function fetchUserCarDetail(
  row: UserCarRow,
  errorMessage = '加载车辆详情失败',
) {
  const cachedDetail = detailCache.get(row.id);

  if (cachedDetail) {
    return {
      row: buildUserCarRowFromApi(cachedDetail, row),
      source: cachedDetail,
    };
  }

  const loadingInstance = ElLoading.service({
    target: '.user-car-table',
    text: '加载中...',
  });

  try {
    const data = await UserCarApi.getUserCar(row.id);
    detailCache.set(row.id, data);

    return {
      row: buildUserCarRowFromApi(data, row),
      source: data,
    };
  } catch (error) {
    ElMessage.error(errorMessage);
    console.error('[userCar] load detail failed:', error);
    return null;
  } finally {
    loadingInstance.close();
  }
}

/** 查询车辆列表 */
async function queryUserCarPage(
  { page }: any,
  formValues: Record<string, any>,
) {
  const result = await UserCarApi.getUserCarPage({
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...buildUserCarQueryParams({
      ...formValues,
      plateColor: drillFilters.value.plateColor,
    }),
  });

  const list = Array.isArray(result?.list) ? result.list : [];

  return {
    list: list.map((item) => buildUserCarRowFromApi(item)),
    total: result?.total || 0,
  };
}

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  width: 520,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    const values = (await formApi.getValues()) as Record<string, any>;
    const loadingInstance = ElLoading.service({
      target: '.user-car-table',
      text: formMode.value === 'create' ? '保存中...' : '更新中...',
    });

    try {
      if (formMode.value === 'create') {
        await UserCarApi.createUserCar({
          bindTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          carType: values.carType || '',
          plateColor: values.plateColor || '',
          plateNo: values.plateNo || '',
          remark: values.remark || '',
          status: '待审核',
          userId: Number(values.userId || 0),
        });
        ElMessage.success('新增成功');
      } else if (formData.value) {
        await UserCarApi.updateUserCar({
          auditRemark: formSource.value?.auditRemark,
          auditorId: formSource.value?.auditorId,
          auditTime: formSource.value?.auditTime,
          bindTime: formSource.value?.bindTime || formData.value.bindTime,
          carType: values.carType || '',
          id: formData.value.id,
          plateColor: values.plateColor || '',
          plateNo: values.plateNo || '',
          remark: values.remark || '',
          reserve1: formSource.value?.reserve1,
          reserve2: formSource.value?.reserve2,
          status: formSource.value?.status || formData.value.status,
          userId: formSource.value?.userId || formData.value.userId,
        });
        ElMessage.success('编辑成功');
      }

      await handleReloadPage();
      formDrawerApi.close();
    } catch (error) {
      ElMessage.error(formMode.value === 'create' ? '新增失败' : '编辑失败');
      console.error('[userCar] save failed:', error);
    } finally {
      loadingInstance.close();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      formData.value = undefined;
      formSource.value = undefined;
      return;
    }

    if (formMode.value === 'create') {
      await formApi.resetForm();
      return;
    }

    if (formData.value) {
      await formApi.setValues({
        carType: formData.value.carType,
        plateColor: formData.value.plateColor,
        plateNo: formData.value.plateNo,
        remark: formData.value.remark,
      });
    }
  },
});

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
        query: queryUserCarPage,
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
        value: Number(item.id ?? 0),
      })),
    );
  } catch (error) {
    console.error('[userCar] load user options failed:', error);
    userSelectOptions.value = buildUserSelectOptions(userSelectOptions.value);
  }

  await formApi.updateSchema([
    {
      fieldName: 'userId',
      componentProps: {
        options: userSelectOptions.value,
      },
    },
  ]);

  await gridApi.formApi.updateSchema([
    {
      fieldName: 'userId',
      componentProps: {
        options: userSelectOptions.value,
      },
    },
  ]);
}

/** 刷新表格 */
function handleRefresh() {
  return gridApi.query();
}

/** 联动刷新页面 */
async function handleReloadPage() {
  detailCache.clear();
  await handleRefresh();
  await props.reloadStats?.();
}

/** 重置筛选条件 */
async function resetSearch() {
  drillFilters.value.plateColor = '';
  await gridApi.formApi.resetForm();
  await handleRefresh();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  const nextValues = { ...values };

  drillFilters.value.plateColor = nextValues.plateColor || '';
  delete nextValues.plateColor;

  await gridApi.formApi.setValues(nextValues);
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
    await UserCarApi.exportUserCar(
      buildUserCarQueryParams({
        ...formValues,
        plateColor: drillFilters.value.plateColor,
      }),
    );
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error('[userCar] export failed:', error);
  }
}

/** 打开新增抽屉 */
function handleCreate() {
  formMode.value = 'create';
  formData.value = undefined;
  formSource.value = undefined;
  formApi.setState(() => ({
    schema: useCreateSchema(userSelectOptions.value),
  }));
  formDrawerApi.setData(null).open();
}

/** 打开编辑抽屉 */
async function handleEdit(row: UserCarRow) {
  const detail = await fetchUserCarDetail(row);

  if (!detail) {
    return;
  }

  formMode.value = 'edit';
  formData.value = detail.row;
  formSource.value = detail.source;
  formApi.setState(() => ({
    schema: useEditSchema(),
  }));
  formDrawerApi.setData(detail.row).open();
}

/** 打开详情抽屉 */
async function handleDetail(row: UserCarRow) {
  const detail = await fetchUserCarDetail(row);

  if (!detail) {
    return;
  }

  currentRow.value = detail.row;
  detailDrawerRef.value?.open();
}

/** 打开用户详情弹窗 */
async function handleOpenUser(row: UserCarRow) {
  if (row.userInfo) {
    currentUserProfile.value = {
      ...row.userInfo,
      phone: maskPhone(row.userInfo.phone),
    };
    userDialogVisible.value = true;
    return;
  }

  const detail = await fetchUserCarDetail(row, '加载用户详情失败');

  if (!detail) {
    return;
  }

  const userProfile =
    detail.row.userInfo ||
    getUserProfile(detail.row.userId, detail.row.userName);

  currentUserProfile.value = {
    ...userProfile,
    phone: maskPhone(userProfile.phone),
  };
  userDialogVisible.value = true;
}

/** 打开操作人员弹窗 */
async function handleOpenOperator(row: UserCarRow) {
  if (!row.auditorName || row.auditorName === '-') {
    return;
  }

  if (row.auditorInfo) {
    currentOperatorProfile.value = row.auditorInfo;
    operatorDialogVisible.value = true;
    return;
  }

  const detail = await fetchUserCarDetail(row, '加载操作人员详情失败');

  if (!detail) {
    return;
  }

  currentOperatorProfile.value =
    detail.row.auditorInfo ||
    getOperatorDetail(detail.row.auditorName, undefined, detail.row.auditorId);
  operatorDialogVisible.value = true;
}

/** 审核通过车辆 */
async function handleApprove(row: UserCarRow) {
  const loadingInstance = ElLoading.service({
    target: '.user-car-table',
    text: '审核中...',
  });

  try {
    await UserCarApi.approveUserCar({
      auditRemark: '审核通过',
      ids: [row.id],
    });
    ElMessage.success('审核通过');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('审核通过失败');
    console.error('[userCar] approve failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开驳回弹窗 */
function handleOpenReject(row: UserCarRow) {
  rejectReason.value = '';
  rejectRow.value = row;
  rejectDialogVisible.value = true;
}

/** 确认驳回车辆 */
async function handleConfirmReject() {
  if (rejectReason.value.trim().length < 10) {
    ElMessage.warning('驳回理由不能少于 10 个字');
    return;
  }

  if (!rejectRow.value) {
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.user-car-table',
    text: '驳回中...',
  });

  try {
    await UserCarApi.rejectUserCar({
      auditRemark: rejectReason.value.trim(),
      ids: [rejectRow.value.id],
    });
    rejectDialogVisible.value = false;
    rejectReason.value = '';
    rejectRow.value = undefined;
    ElMessage.success('驳回成功');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('驳回失败');
    console.error('[userCar] reject failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 解绑车辆 */
async function handleUnbind(row: UserCarRow) {
  try {
    await confirm(`确认解绑车辆“${row.plateNo}”吗？`);
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.user-car-table',
    text: '解绑中...',
  });

  try {
    await UserCarApi.unbindUserCar({
      ids: [row.id],
    });
    ElMessage.success('解绑成功');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('解绑失败');
    console.error('[userCar] unbind failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 重新绑定车辆 */
async function handleRebind(row: UserCarRow) {
  const loadingInstance = ElLoading.service({
    target: '.user-car-table',
    text: '重新绑定中...',
  });

  try {
    await UserCarApi.rebindUserCar({
      ids: [row.id],
    });
    ElMessage.success('已重新发起绑定审核');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('重新绑定失败');
    console.error('[userCar] rebind failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 按车牌颜色钻取列表 */
async function handleFilterByPlateColor(plateColor: string) {
  drillFilters.value.plateColor = plateColor;
  await handleRefresh();
}

/** 下载导入模板 */
function handleDownloadTemplate() {
  const blob = new Blob(
    [
      '所属用户,车牌号码,车牌颜色,车辆类型,备注\n张三,闽C67890,蓝牌,小型车,导入模板示例',
    ],
    { type: 'text/csv;charset=utf-8;' },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = '用户车辆导入模板.csv';
  link.click();
  URL.revokeObjectURL(url);
}

/** 导入车辆数据 */
async function handleImportCars() {
  const file = importFileList.value[0]?.raw;

  if (!file) {
    ElMessage.warning('请先上传导入文件');
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.user-car-table',
    text: '导入中...',
  });

  try {
    await UserCarApi.importUserCar(file);
    importDialogVisible.value = false;
    importFileList.value = [];
    ElMessage.success('导入成功');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('导入失败');
    console.error('[userCar] import failed:', error);
  } finally {
    loadingInstance.close();
  }
}
</script>

<template>
  <div class="user-car-table">
    <div class="user-car-grid-wrap">
      <Grid table-title="用户车辆列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '新增车辆',
                type: 'primary',
                icon: ACTION_ICON.ADD,
                onClick: handleCreate,
              },
              {
                label: '导入',
                type: 'primary',
                icon: ACTION_ICON.UPLOAD,
                onClick: () => (importDialogVisible = true),
              },
              {
                label: '导出',
                type: 'primary',
                icon: ACTION_ICON.DOWNLOAD,
                onClick: handleExport,
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
          <ElButton type="primary" link @click="handleDetail(row)">
            {{ row.plateNo }}
          </ElButton>
        </template>

        <template #plateColor="{ row }">
          <ElButton
            type="primary"
            link
            @click="handleFilterByPlateColor(row.plateColor)"
          >
            {{ row.plateColor }}
          </ElButton>
        </template>

        <template #carType="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ carType: row.carType })"
          >
            {{ row.carType }}
          </ElButton>
        </template>

        <template #status="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ status: row.status })"
          >
            <ElTag
              :type="
                row.status === '已绑定'
                  ? 'success'
                  : row.status === '待审核'
                    ? 'warning'
                    : row.status === '已驳回'
                      ? 'danger'
                      : 'info'
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
                label: '重新绑定',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.status === '已解绑',
                onClick: handleRebind.bind(null, row),
              },
              {
                label: '解绑',
                type: 'danger',
                link: true,
                icon: ACTION_ICON.DELETE,
                ifShow: () => row.status === '已绑定',
                popConfirm: {
                  title: `确认解绑${row.plateNo}吗？`,
                  confirm: handleUnbind.bind(null, row),
                },
              },
              {
                label: '编辑',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.EDIT,
                ifShow: () => row.status === '待审核',
                onClick: handleEdit.bind(null, row),
              },
            ]"
          />
        </template>
      </Grid>
    </div>

    <FormDrawer :title="formMode === 'edit' ? '编辑车辆' : '新增车辆'">
      <Form class="mx-4" />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="userCarDetailFields"
      :title="currentRow ? `${currentRow.plateNo}详情` : '车辆详情'"
    />

    <ElDialog v-model="importDialogVisible" title="导入车辆" width="520px">
      <div class="import-tip">
        提供标准模板下载，上传后按文档要求模拟导入校验。
      </div>
      <div class="import-actions">
        <ElButton @click="handleDownloadTemplate">下载模板</ElButton>
      </div>
      <el-upload
        v-model:file-list="importFileList"
        drag
        :auto-upload="false"
        :limit="1"
        accept=".xls,.xlsx,.csv"
      >
        <div>点击或拖拽文件到此处上传</div>
      </el-upload>
      <template #footer>
        <ElButton @click="importDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleImportCars">开始导入</ElButton>
      </template>
    </ElDialog>

    <ElDialog v-model="rejectDialogVisible" title="驳回车辆绑定" width="520px">
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

    <ElDialog
      v-model="operatorDialogVisible"
      title="操作人员详情"
      width="520px"
    >
      <ElDescriptions v-if="currentOperatorProfile" :column="1" border>
        <ElDescriptionsItem label="姓名">
          {{ currentOperatorProfile.name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="角色">
          {{ currentOperatorProfile.role }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="手机号">
          {{ currentOperatorProfile.phone }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="邮箱">
          {{ currentOperatorProfile.email }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.user-car-table,
.user-car-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.user-car-table {
  display: flex;
  flex-direction: column;
}

.user-car-grid-wrap {
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
