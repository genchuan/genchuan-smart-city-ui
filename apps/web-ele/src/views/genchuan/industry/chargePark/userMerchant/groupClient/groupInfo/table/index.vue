<script lang="ts" setup>
import type { UploadUserFile } from 'element-plus';

import type { GroupAccountLog, GroupInfoRow, OperatorInfo } from '../data';

import type { GroupInfoDetailVO } from '#/api/genchuan/industry/chargePark/userMerchant/groupClient/groupInfo';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import dayjs from 'dayjs';
import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElInput,
  ElLoading,
  ElMessage,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { GroupInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/groupClient/groupInfo';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import {
  buildGroupInfoQueryParams,
  buildGroupRowFromApi,
  formatAccountLogs,
  formatAuditLogs,
  formatCars,
  getOperatorDetail,
  detailFields as groupInfoDetailFields,
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

const accountDialogVisible = ref(false);
const currentAccountLogs = ref<GroupAccountLog[]>([]);
const detailCache = new Map<number, GroupInfoDetailVO>();
const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<GroupInfoRow>();
const drillFilters = ref({
  phone: '',
});
const formData = ref<GroupInfoRow>();
const formMode = ref<'create' | 'edit'>('create');
const formSource = ref<GroupInfoDetailVO>();
const importDialogVisible = ref(false);
const importFileList = ref<UploadUserFile[]>([]);
const operatorDetail = ref<OperatorInfo>();
const operatorDialogVisible = ref(false);
const rejectDialogVisible = ref(false);
const rejectReason = ref('');
const rejectRow = ref<GroupInfoRow>();

const detailData = computed(() => {
  if (!detailObj.value) {
    return undefined;
  }

  return {
    ...detailObj.value,
    maskedPhone: maskPhone(detailObj.value.phone),
    walletDisplay: `${detailObj.value.walletBalance.toFixed(2)} 元`,
    accountSummary: formatAccountLogs(detailObj.value.accountLogs),
    carSummary: formatCars(detailObj.value.cars),
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

/** 获取集团详情 */
async function fetchGroupDetail(
  row: GroupInfoRow,
  errorMessage = '加载集团详情失败',
) {
  const cachedDetail = detailCache.get(row.id);

  if (cachedDetail) {
    return {
      row: buildGroupRowFromApi(cachedDetail, row),
      source: cachedDetail,
    };
  }

  const loadingInstance = ElLoading.service({
    target: '.group-info-table',
    text: '加载中...',
  });

  try {
    const data = await GroupInfoApi.getGroupInfo(row.id);
    detailCache.set(row.id, data);

    return {
      row: buildGroupRowFromApi(data, row),
      source: data,
    };
  } catch (error) {
    ElMessage.error(errorMessage);
    console.error('[groupInfo] load detail failed:', error);
    return null;
  } finally {
    loadingInstance.close();
  }
}

/** 查询集团列表 */
async function queryGroupInfoPage(
  { page }: any,
  formValues: Record<string, any>,
) {
  const result = await GroupInfoApi.getGroupInfoPage({
    ...buildGroupInfoQueryParams(formValues, {
      phone: drillFilters.value.phone,
    }),
    pageNo: page.currentPage,
    pageSize: page.pageSize,
  });

  const list = Array.isArray(result?.list) ? result.list : [];

  return {
    list: list.map((item) => buildGroupRowFromApi(item)),
    total: result?.total || 0,
  };
}

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
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
      target: '.group-info-table',
      text: formMode.value === 'create' ? '保存中...' : '更新中...',
    });

    try {
      if (formMode.value === 'create') {
        await GroupInfoApi.createGroupInfo({
          address: values.address || '',
          contact: values.contact || '',
          groupType: values.groupType || '',
          name: values.name || '',
          phone: values.phone || '',
          registerTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          remark: values.remark || '',
          status: '待审核',
          walletBalance: 0,
        });
        ElMessage.success('新增成功');
      } else if (formData.value) {
        await GroupInfoApi.updateGroupInfo({
          address: values.address || '',
          contact: values.contact || '',
          groupType: formSource.value?.groupType || formData.value.groupType,
          id: formData.value.id,
          name: formSource.value?.name || formData.value.name,
          phone: values.phone || '',
          registerTime:
            formSource.value?.registerTime || formData.value.registerTime,
          remark: values.remark || '',
          reserve1: formSource.value?.reserve1,
          reserve2: formSource.value?.reserve2,
          status: formSource.value?.status || formData.value.status,
          walletBalance:
            formSource.value?.walletBalance ?? formData.value.walletBalance,
        });
        ElMessage.success('编辑成功');
      }

      await handleReloadPage();
      formDrawerApi.close();
    } catch (error) {
      ElMessage.error(formMode.value === 'create' ? '新增失败' : '编辑失败');
      console.error('[groupInfo] save failed:', error);
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
      await formApi.setValues({
        groupType: '企业单位',
        remark: '',
      });
      return;
    }

    if (formData.value) {
      await formApi.setValues({
        address: formData.value.address,
        contact: formData.value.contact,
        phone: formData.value.phone,
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
    columns: useGridColumns(),
    layouts: [['Form'], ['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    keepSource: true,
    height: 'auto',
    proxyConfig: {
      ajax: {
        query: queryGroupInfoPage,
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
  drillFilters.value.phone = '';
  await gridApi.formApi.resetForm();
  await handleRefresh();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  const nextValues = { ...values };

  drillFilters.value.phone = nextValues.phone || '';
  delete nextValues.phone;

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

/** 导出当前列表 */
async function handleExport() {
  const formValues = await gridApi.formApi.getValues();

  try {
    await GroupInfoApi.exportGroupInfo(
      buildGroupInfoQueryParams(formValues, {
        phone: drillFilters.value.phone,
      }),
    );
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error('[groupInfo] export failed:', error);
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

/** 按手机号钻取列表 */
async function handleFilterByPhone(phone: string) {
  drillFilters.value.phone = phone;
  await gridApi.formApi.resetForm();
  await handleRefresh();
}

/** 打开编辑抽屉 */
async function handleEdit(row: GroupInfoRow) {
  const detail = await fetchGroupDetail(row);

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

/** 审核通过集团 */
async function handleApprove(row: GroupInfoRow) {
  const loadingInstance = ElLoading.service({
    target: '.group-info-table',
    text: '审核中...',
  });

  try {
    await GroupInfoApi.approveGroupInfo({
      auditRemark: '集团信息无误，审核通过',
      ids: [row.id],
    });
    ElMessage.success('集团审核通过');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('审核通过失败');
    console.error('[groupInfo] approve failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开驳回弹窗 */
function handleOpenReject(row: GroupInfoRow) {
  rejectReason.value = '';
  rejectRow.value = row;
  rejectDialogVisible.value = true;
}

/** 确认驳回集团 */
async function handleConfirmReject() {
  if (rejectReason.value.trim().length < 10) {
    ElMessage.warning('驳回理由不能少于 10 个字');
    return;
  }

  if (!rejectRow.value) {
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.group-info-table',
    text: '驳回中...',
  });

  try {
    await GroupInfoApi.rejectGroupInfo({
      auditRemark: rejectReason.value.trim(),
      ids: [rejectRow.value.id],
    });
    rejectDialogVisible.value = false;
    rejectReason.value = '';
    rejectRow.value = undefined;
    ElMessage.success('集团已驳回');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('驳回失败');
    console.error('[groupInfo] reject failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 启用或禁用集团 */
async function handleToggleStatus(
  row: GroupInfoRow,
  status: GroupInfoRow['status'],
) {
  const loadingInstance = ElLoading.service({
    target: '.group-info-table',
    text: status === '正常' ? '启用中...' : '禁用中...',
  });

  try {
    await (status === '正常'
      ? GroupInfoApi.enableGroupInfo({
          ids: [row.id],
        })
      : GroupInfoApi.disableGroupInfo({
          ids: [row.id],
        }));

    ElMessage.success(`${status === '正常' ? '启用' : '禁用'}成功`);
    await handleReloadPage();
  } catch (error) {
    ElMessage.error(`${status === '正常' ? '启用' : '禁用'}失败`);
    console.error('[groupInfo] toggle status failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开详情抽屉 */
async function handleDetail(row: GroupInfoRow) {
  const detail = await fetchGroupDetail(row);

  if (!detail) {
    return;
  }

  detailObj.value = detail.row;
  detailDrawerRef.value?.open();
}

/** 打开操作人员弹窗 */
async function handleOpenOperator(
  row: GroupInfoRow,
  field: 'auditor' | 'creator',
) {
  const currentOperator =
    field === 'auditor' ? row.auditorInfo : row.creatorInfo;
  const currentName = field === 'auditor' ? row.auditorName : row.creator;
  const currentId = field === 'auditor' ? row.auditorId : row.creatorId;

  if (!currentName || currentName === '-') {
    return;
  }

  if (currentOperator) {
    operatorDetail.value = currentOperator;
    operatorDialogVisible.value = true;
    return;
  }

  const detail = await fetchGroupDetail(row, '加载操作人员详情失败');

  if (!detail) {
    return;
  }

  operatorDetail.value =
    field === 'auditor'
      ? detail.row.auditorInfo ||
        getOperatorDetail(
          detail.row.auditorName,
          undefined,
          detail.row.auditorId,
        )
      : detail.row.creatorInfo ||
        getOperatorDetail(detail.row.creator, undefined, detail.row.creatorId);

  if (!operatorDetail.value) {
    operatorDetail.value = getOperatorDetail(currentName, undefined, currentId);
  }

  operatorDialogVisible.value = true;
}

/** 打开账户明细弹窗 */
async function handleOpenAccount(row: GroupInfoRow) {
  const detail = await fetchGroupDetail(row, '加载账户明细失败');

  if (!detail) {
    return;
  }

  currentAccountLogs.value = detail.row.accountLogs;
  accountDialogVisible.value = true;
}

/** 下载导入模板 */
function handleDownloadTemplate() {
  const blob = new Blob(
    [
      '集团名称,联系人,联系手机号,集团类型,地址,备注\n示例集团,张三,13812345678,企业单位,福建省泉州市示例地址,导入模板示例',
    ],
    { type: 'text/csv;charset=utf-8;' },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = '集团信息导入模板.csv';
  link.click();
  URL.revokeObjectURL(url);
}

/** 导入集团数据 */
async function handleImportGroups() {
  const file = importFileList.value[0]?.raw;

  if (!file) {
    ElMessage.warning('请先上传导入文件');
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.group-info-table',
    text: '导入中...',
  });

  try {
    await GroupInfoApi.importGroupInfo(file);
    importDialogVisible.value = false;
    importFileList.value = [];
    ElMessage.success('导入成功');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('导入失败');
    console.error('[groupInfo] import failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 获取集团状态标签颜色 */
function getStatusTagType(status: GroupInfoRow['status']) {
  switch (status) {
    case '已驳回':
    case '禁用': {
      return 'danger';
    }
    case '待审核': {
      return 'warning';
    }
    case '正常': {
      return 'success';
    }
    default: {
      return 'info';
    }
  }
}
</script>

<template>
  <div class="group-info-table">
    <div class="group-info-grid-wrap">
      <Grid table-title="集团信息列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '新增集团',
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

        <template #name="{ row }">
          <ElButton type="primary" link @click="handleDetail(row)">
            {{ row.name }}
          </ElButton>
        </template>

        <template #contact="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ contact: row.contact })"
          >
            {{ row.contact }}
          </ElButton>
        </template>

        <template #phone="{ row }">
          <ElButton type="primary" link @click="handleFilterByPhone(row.phone)">
            {{ maskPhone(row.phone) }}
          </ElButton>
        </template>

        <template #groupType="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ groupType: row.groupType })"
          >
            {{ row.groupType }}
          </ElButton>
        </template>

        <template #status="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ status: row.status })"
          >
            <ElTag :type="getStatusTagType(row.status)">
              {{ row.status }}
            </ElTag>
          </ElButton>
        </template>

        <template #walletBalance="{ row }">
          <ElButton type="primary" link @click="handleOpenAccount(row)">
            {{ row.walletBalance.toFixed(2) }}
          </ElButton>
        </template>

        <template #auditorName="{ row }">
          <ElButton
            v-if="row.auditorName !== '-'"
            type="primary"
            link
            @click="handleOpenOperator(row, 'auditor')"
          >
            {{ row.auditorName }}
          </ElButton>
          <span v-else>{{ row.auditorName }}</span>
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
                label: '编辑',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.EDIT,
                ifShow: () => row.status === '正常',
                onClick: handleEdit.bind(null, row),
              },
              {
                label: '禁用',
                type: 'danger',
                link: true,
                icon: ACTION_ICON.DELETE,
                ifShow: () => row.status === '正常',
                popConfirm: {
                  title: `确认禁用${row.name}吗？`,
                  confirm: handleToggleStatus.bind(null, row, '禁用'),
                },
              },
              {
                label: '启用',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.status === '禁用',
                popConfirm: {
                  title: `确认启用${row.name}吗？`,
                  confirm: handleToggleStatus.bind(null, row, '正常'),
                },
              },
            ]"
          />
        </template>
      </Grid>
    </div>

    <FormDrawer
      :title="formMode === 'edit' ? textObj.editText : textObj.addText"
    >
      <Form class="mx-4" />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="groupInfoDetailFields"
      :title="detailObj ? `${detailObj.name}详情` : '集团详情'"
    />

    <ElDialog v-model="importDialogVisible" title="导入集团" width="520px">
      <div class="import-tip">
        提供标准模板下载，上传后按文档要求调用真实导入接口。
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
        <ElButton type="primary" @click="handleImportGroups">
          开始导入
        </ElButton>
      </template>
    </ElDialog>

    <ElDialog v-model="rejectDialogVisible" title="驳回集团" width="520px">
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

    <ElDialog v-model="accountDialogVisible" title="集团账户明细" width="720px">
      <ElTable :data="currentAccountLogs" border>
        <ElTableColumn prop="time" label="时间" min-width="170" />
        <ElTableColumn prop="type" label="类型" min-width="110" />
        <ElTableColumn prop="amount" label="金额" min-width="100" />
        <ElTableColumn prop="afterBalance" label="变更后余额" min-width="120" />
      </ElTable>
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
.group-info-table,
.group-info-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.group-info-table {
  display: flex;
  flex-direction: column;
}

.group-info-grid-wrap {
  flex: 1;
}

.import-actions,
.import-tip {
  margin-bottom: 12px;
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
