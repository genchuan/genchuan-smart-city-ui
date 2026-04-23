<script lang="ts" setup>
import type { UploadUserFile } from 'element-plus';

import type { OperatorInfo, UserRow } from '../data';

import type { UserInfoDetailVO } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userInfo';

import { computed, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import dayjs from 'dayjs';
import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElLoading,
  ElMessage,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { UserInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userInfo';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import {
  buildUserInfoQueryParams,
  buildUserRowFromApi,
  formatAuditLogs,
  formatCars,
  formatWalletLogs,
  getOperatorDetail,
  maskPhone,
  textObj,
  useCreateSchema,
  useEditSchema,
  useGridColumns,
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

const checkedIds = ref<number[]>([]);
const currentCars = ref<UserRow['cars']>([]);
const currentWalletLogs = ref<UserRow['walletLogs']>([]);
const detailCache = new Map<number, UserInfoDetailVO>();
const detailObj = ref<UserRow>();
const formData = ref<UserRow>();
const formMode = ref<'create' | 'edit'>('create');
const formSource = ref<UserInfoDetailVO>();
const importDialogVisible = ref(false);
const importFileList = ref<UploadUserFile[]>([]);
const operatorDetail = ref<OperatorInfo>();
const operatorDialogVisible = ref(false);
const vehicleDialogVisible = ref(false);
const walletDialogVisible = ref(false);
const detailDrawerRef = ref<null | { open: () => void }>(null);

const detailFields = ref([
  { key: 'nickname', label: '用户昵称' },
  { key: 'maskedPhone', label: '绑定手机号' },
  {
    key: 'userType',
    label: '用户类型',
    type: 'tag',
    tagType: () => 'primary',
  },
  {
    key: 'status',
    label: '用户状态',
    type: 'tag',
    tagType: (value: string) => (value === '正常' ? 'success' : 'danger'),
  },
  { key: 'registerTime', label: '注册时间' },
  { key: 'loginTime', label: '最后登录时间' },
  { key: 'walletDisplay', label: '钱包余额' },
  { key: 'walletLogsSummary', label: '钱包流水' },
  { key: 'carDisplay', label: '绑定车辆数' },
  { key: 'carsSummary', label: '绑定车辆信息' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updater', label: '最后更新人' },
  { key: 'updateTime', label: '最后更新时间' },
  // { key: 'auditLogsSummary', label: '审计日志' },
  // { key: 'auditSummary', label: '日志摘要' },
  { key: 'remark', label: '备注' },
]);

const gridColumns = useGridColumns().map((item: any) => {
  if (item.field === 'creator' || item.field === 'updater') {
    return {
      ...item,
      slots: {
        default: item.field,
      },
    };
  }

  return item;
});

const detailData = computed(() => {
  if (!detailObj.value) {
    return null;
  }

  return {
    ...detailObj.value,
    maskedPhone: maskPhone(detailObj.value.phone),
    walletDisplay: `${detailObj.value.walletBalance.toFixed(2)} 元`,
    walletLogsSummary: formatWalletLogs(detailObj.value.walletLogs),
    carDisplay: `${detailObj.value.carCount} 辆`,
    carsSummary: formatCars(detailObj.value.cars),
    auditLogsSummary: formatAuditLogs(detailObj.value.auditLogs),
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
  schema: useCreateSchema(),
  showDefaultActions: false,
});

/** 获取用户详情 */
async function fetchUserDetail(
  row: UserRow,
  errorMessage = '加载用户详情失败',
) {
  const cachedDetail = detailCache.get(row.id);

  if (cachedDetail) {
    return {
      row: buildUserRowFromApi(cachedDetail, row),
      source: cachedDetail,
    };
  }

  const loadingInstance = ElLoading.service({
    target: '.user-info-table',
    text: '加载中...',
  });

  try {
    const data = await UserInfoApi.getUserInfo(row.id);
    detailCache.set(row.id, data);

    return {
      row: buildUserRowFromApi(data, row),
      source: data,
    };
  } catch (error) {
    ElMessage.error(errorMessage);
    console.error('[userInfo] load detail failed:', error);
    return null;
  } finally {
    loadingInstance.close();
  }
}

/** 查询用户列表 */
async function queryUserInfoPage(
  { page }: any,
  formValues: Record<string, any>,
) {
  const result = await UserInfoApi.getUserInfoPage({
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...buildUserInfoQueryParams(formValues),
  });

  const list = Array.isArray(result?.list) ? result.list : [];

  return {
    list: list.map((item) => buildUserRowFromApi(item)),
    total: result?.total || 0,
  };
}

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  width: 500,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    const values = (await formApi.getValues()) as Record<string, string>;
    const loadingInstance = ElLoading.service({
      target: '.user-info-table',
      text: formMode.value === 'create' ? '保存中...' : '更新中...',
    });

    try {
      if (formMode.value === 'create') {
        await UserInfoApi.createUserInfo({
          nickname: values.nickname || '',
          phone: values.phone || '',
          userType: values.userType || '',
          status: '正常',
          registerTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          remark: values.remark || '',
          walletBalance: 0,
          carCount: 0,
        });
        ElMessage.success('新增成功');
      } else if (formData.value) {
        await UserInfoApi.updateUserInfo({
          id: formData.value.id,
          nickname: values.nickname || '',
          phone: formSource.value?.phone || formData.value.phone,
          userType: formSource.value?.userType || formData.value.userType,
          status: formSource.value?.status || formData.value.status,
          registerTime: formData.value.registerTime,
          loginTime:
            formData.value.loginTime === '-'
              ? undefined
              : formData.value.loginTime,
          walletBalance:
            formSource.value?.walletBalance ?? formData.value.walletBalance,
          carCount: formSource.value?.carCount ?? formData.value.carCount,
          remark: values.remark || '',
          reserve1: formSource.value?.reserve1,
          reserve2: formSource.value?.reserve2,
        });
        ElMessage.success('编辑成功');
      }

      await handleReloadPage();
      formDrawerApi.close();
    } catch (error) {
      ElMessage.error(formMode.value === 'create' ? '新增失败' : '编辑失败');
      console.error('[userInfo] save failed:', error);
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
      formApi.resetForm();
      await formApi.setValues({
        remark: '',
        userType: '个人用户',
      });
      return;
    }

    if (formData.value) {
      await formApi.setValues({
        nickname: formData.value.nickname,
        remark: formData.value.remark,
      });
    }
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useSearchSchema(),
  },
  gridOptions: {
    columns: gridColumns,
    layouts: [['Form'], ['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    keepSource: true,
    height: 'auto',
    proxyConfig: {
      ajax: {
        query: queryUserInfoPage,
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

/** 刷新表格 */
function handleRefresh() {
  return gridApi.query();
}

/** 联动刷新页面 */
async function handleReloadPage() {
  checkedIds.value = [];
  detailCache.clear();
  await handleRefresh();
  await props.reloadStats?.();
}

/** 重置筛选条件 */
async function resetSearch() {
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

/** 按状态钻取列表 */
async function handleFilterStatus(status: UserRow['status']) {
  await gridApi.formApi.setValues({ status });
  await handleRefresh();
}

/** 按手机号钻取列表 */
async function handleFilterPhone(phone: string) {
  await gridApi.formApi.setValues({ phone });
  await handleRefresh();
}

/** 按用户类型钻取列表 */
async function handleFilterUserType(userType: string) {
  await gridApi.formApi.setValues({ userType });
  await handleRefresh();
}

defineExpose({
  recalculateLayout,
  resetSearch,
  setSearchValues,
});

/** 导出当前列表 */
async function handleExport() {
  const formValues = await gridApi.formApi.getValues();

  try {
    await UserInfoApi.exportUserInfo(buildUserInfoQueryParams(formValues));
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error('[userInfo] export failed:', error);
  }
}

/** 打开新增抽屉 */
function handleCreate() {
  formMode.value = 'create';
  formData.value = undefined;
  formSource.value = undefined;
  formApi.setState(() => ({
    schema: useCreateSchema(),
  }));
  formDrawerApi.setData(null).open();
}

/** 打开编辑抽屉 */
async function handleEdit(row: UserRow) {
  const detail = await fetchUserDetail(row);

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

/** 更新用户状态 */
async function handleToggleStatus(row: UserRow, status: UserRow['status']) {
  const loadingInstance = ElLoading.service({
    target: '.user-info-table',
    text: status === '正常' ? '启用中...' : '禁用中...',
  });

  try {
    await (status === '正常'
      ? UserInfoApi.enableUserInfo({
          ids: [row.id],
        })
      : UserInfoApi.disableUserInfo({
          ids: [row.id],
        }));

    ElMessage.success(`${status === '正常' ? '启用' : '禁用'}用户成功`);
    await handleReloadPage();
  } catch (error) {
    ElMessage.error(`${status === '正常' ? '启用' : '禁用'}失败`);
    console.error('[userInfo] toggle status failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开操作人员弹窗 */
async function handleOpenOperator(row: UserRow, field: 'creator' | 'updater') {
  const currentOperator =
    field === 'creator' ? row.creatorInfo : row.updaterInfo;

  if (currentOperator) {
    operatorDetail.value = currentOperator;
    operatorDialogVisible.value = true;
    return;
  }

  const detail = await fetchUserDetail(row, '加载操作人员详情失败');

  if (!detail) {
    return;
  }

  operatorDetail.value =
    field === 'creator'
      ? detail.row.creatorInfo || getOperatorDetail(detail.row.creator)
      : detail.row.updaterInfo || getOperatorDetail(detail.row.updater);
  operatorDialogVisible.value = true;
}

/** 打开详情抽屉 */
async function handleDetail(row: UserRow) {
  const detail = await fetchUserDetail(row);

  if (!detail) {
    return;
  }

  detailObj.value = detail.row;
  detailDrawerRef.value?.open();
}

/** 打开钱包明细弹窗 */
async function handleOpenWallet(row: UserRow) {
  const detail = await fetchUserDetail(row, '加载钱包明细失败');

  if (!detail) {
    return;
  }

  currentWalletLogs.value = detail.row.walletLogs;
  walletDialogVisible.value = true;
}

/** 打开车辆明细弹窗 */
async function handleOpenCars(row: UserRow) {
  const detail = await fetchUserDetail(row, '加载车辆明细失败');

  if (!detail) {
    return;
  }

  currentCars.value = detail.row.cars;
  vehicleDialogVisible.value = true;
}

/** 批量禁用所选用户 */
async function handleDisableBatch() {
  try {
    await confirm('确认禁用所选用户吗？');
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.user-info-table',
    text: '批量禁用中...',
  });

  try {
    await UserInfoApi.disableUserInfo({
      ids: checkedIds.value,
    });
    ElMessage.success('批量禁用成功');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('批量禁用失败');
    console.error('[userInfo] batch disable failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 同步勾选记录 */
function handleRowCheckboxChange({ records }: { records: UserRow[] }) {
  checkedIds.value = records.map((item) => item.id);
}

/** 下载导入模板 */
function handleDownloadTemplate() {
  const blob = new Blob(
    [
      '用户昵称,绑定手机号,用户类型,备注\n示例用户,13812345678,个人用户,导入模板示例',
    ],
    { type: 'text/csv;charset=utf-8;' },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = '用户信息导入模板.csv';
  link.click();
  URL.revokeObjectURL(url);
}

/** 导入用户数据 */
async function handleImportUsers() {
  const file = importFileList.value[0]?.raw;

  if (!file) {
    ElMessage.warning('请先上传导入文件');
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.user-info-table',
    text: '导入中...',
  });

  try {
    await UserInfoApi.importUserInfo(file);
    importDialogVisible.value = false;
    importFileList.value = [];
    ElMessage.success('导入成功');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('导入失败');
    console.error('[userInfo] import failed:', error);
  } finally {
    loadingInstance.close();
  }
}
</script>

<template>
  <div class="user-info-table">
    <div class="user-info-grid-wrap">
      <Grid table-title="用户信息列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '新增用户',
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
                label: '批量禁用',
                type: 'danger',
                icon: ACTION_ICON.DELETE,
                disabled: isEmpty(checkedIds),
                onClick: handleDisableBatch,
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

        <template #nickname="{ row }">
          <ElButton type="primary" link @click="handleDetail(row)">
            {{ row.nickname }}
          </ElButton>
        </template>

        <template #phone="{ row }">
          <ElButton type="primary" link @click="handleFilterPhone(row.phone)">
            {{ maskPhone(row.phone) }}
          </ElButton>
        </template>

        <template #userType="{ row }">
          <ElButton
            type="primary"
            link
            @click="handleFilterUserType(row.userType)"
          >
            {{ row.userType }}
          </ElButton>
        </template>

        <template #status="{ row }">
          <ElButton type="primary" link @click="handleFilterStatus(row.status)">
            <ElTag :type="row.status === '正常' ? 'success' : 'danger'">
              {{ row.status }}
            </ElTag>
          </ElButton>
        </template>

        <template #walletBalance="{ row }">
          <ElButton type="primary" link @click="handleOpenWallet(row)">
            {{ row.walletBalance.toFixed(2) }}
          </ElButton>
        </template>

        <template #carCount="{ row }">
          <ElButton type="primary" link @click="handleOpenCars(row)">
            {{ row.carCount }}
          </ElButton>
        </template>

        <template #creator="{ row }">
          <ElButton
            type="primary"
            link
            @click="handleOpenOperator(row, 'creator')"
          >
            {{ row.creator }}
          </ElButton>
        </template>

        <template #updater="{ row }">
          <ElButton
            type="primary"
            link
            @click="handleOpenOperator(row, 'updater')"
          >
            {{ row.updater }}
          </ElButton>
        </template>

        <template #actions="{ row }">
          <TableAction
            :actions="[
              {
                label: '详情',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.VIEW,
                onClick: handleDetail.bind(null, row),
              },
              {
                label: '编辑',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.EDIT,
                ifShow: () => row.status === '正常',
                onClick: handleEdit.bind(null, row),
              },
              {
                label: row.status === '正常' ? '禁用' : '启用',
                type: row.status === '正常' ? 'danger' : 'primary',
                link: true,
                icon:
                  row.status === '正常'
                    ? ACTION_ICON.DELETE
                    : ACTION_ICON.AUDIT,
                popConfirm: {
                  title: `确认${row.status === '正常' ? '禁用' : '启用'}${row.nickname}吗？`,
                  confirm: handleToggleStatus.bind(
                    null,
                    row,
                    row.status === '正常' ? '禁用' : '正常',
                  ),
                },
              },
              {
                label: '查看',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.VIEW,
                onClick: handleDetail.bind(null, row),
              },
            ]"
          />
        </template>
      </Grid>
    </div>

    <FormDrawer :title="formData?.id ? textObj.editText : textObj.addText">
      <Form class="mx-4" />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="detailFields"
      :title="detailObj ? `${detailObj.nickname}详情` : '用户详情'"
    />

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

    <ElDialog v-model="importDialogVisible" title="导入用户" width="520px">
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
        <ElButton type="primary" @click="handleImportUsers">开始导入</ElButton>
      </template>
    </ElDialog>

    <ElDialog v-model="walletDialogVisible" title="用户钱包明细" width="720px">
      <ElTable :data="currentWalletLogs" border>
        <ElTableColumn prop="time" label="时间" min-width="170" />
        <ElTableColumn prop="type" label="类型" min-width="100" />
        <ElTableColumn prop="amount" label="金额" min-width="100" />
        <ElTableColumn prop="afterBalance" label="变更后余额" min-width="120" />
      </ElTable>
    </ElDialog>

    <ElDialog v-model="vehicleDialogVisible" title="绑定车辆列表" width="720px">
      <ElTable :data="currentCars" border>
        <ElTableColumn prop="plateNo" label="车牌号码" min-width="140" />
        <ElTableColumn prop="plateColor" label="车牌颜色" min-width="100" />
        <ElTableColumn prop="carType" label="车辆类型" min-width="120" />
        <ElTableColumn prop="status" label="绑定状态" min-width="100" />
      </ElTable>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.user-info-table,
.user-info-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.user-info-table {
  display: flex;
  flex-direction: column;
}

.user-info-grid-wrap {
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
