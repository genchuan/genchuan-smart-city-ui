<script lang="ts" setup>
import type { UploadUserFile } from 'element-plus';

import type { GroupAccountLog, GroupInfoRow, OperatorInfo } from '../data';

import type { GroupInfoDetailVO } from '#/api/genchuan/industry/chargePark/userMerchant/groupClient/groupInfo';

import { computed, ref } from 'vue';

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
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { GroupInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/groupClient/groupInfo';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import {
  buildActiveFilterTags,
  type ActiveFilterTag,
} from '#/views/genchuan/industry/chargePark/userMerchant/utils/filterTags';

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
  contact: '',
  groupType: '',
  phone: '',
  status: '',
});
const searchParams = ref<Record<string, any>>({});

const drillFilterConfigs = {
  contact: {
    label: '联系人',
    type: 'info',
  },
  groupType: {
    label: '集团类型',
    type: 'success',
  },
  phone: {
    formatter: (value: any) => maskPhone(String(value)),
    label: '联系手机号',
    type: 'primary',
  },
  status: {
    label: '集团状态',
    type: 'warning',
  },
} as const;

const searchFilterConfigs = {
  contact: {
    label: '联系人',
    type: 'info',
  },
  groupType: {
    label: '集团类型',
    type: 'success',
  },
  name: {
    label: '集团名称',
    type: 'info',
  },
  registerTime: {
    formatter: (value: any[]) => value.join(' 至 '),
    label: '注册时间',
    type: 'danger',
  },
  status: {
    label: '集团状态',
    type: 'warning',
  },
} as const;
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

const activeFilterTags = computed<ActiveFilterTag[]>(() =>
  buildActiveFilterTags([
    {
      configs: drillFilterConfigs,
      source: 'drill',
      values: drillFilters.value,
    },
    {
      configs: searchFilterConfigs,
      source: 'search',
      values: searchParams.value,
    },
  ]),
);

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

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  async onOpenChange() {},
});

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
  schema: useSearchSchema().map((item) => ({
    ...item,
    rules: undefined,
  })),
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
  formValues: Record<string, any> = {},
) {
  const queryValues = {
    ...searchParams.value,
    ...formValues,
  };

  const result = await GroupInfoApi.getGroupInfoPage({
    ...buildGroupInfoQueryParams(queryValues, drillFilters.value),
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
  gridOptions: {
    columns: useGridColumns(),
    layouts: [['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
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
  showSearchForm: false,
});

/** 刷新表格 - 同时清除所有快捷筛选 */
function handleRefresh() {
  drillFilters.value = {
    contact: '',
    groupType: '',
    phone: '',
    status: '',
  };
  return gridApi.reload();
}

/** 联动刷新页面 */
async function handleReloadPage() {
  detailCache.clear();
  await handleRefresh();
  await props.reloadStats?.();
}

/** 重置筛选条件 */
async function resetSearch() {
  searchParams.value = {};
  drillFilters.value = {
    contact: '',
    groupType: '',
    phone: '',
    status: '',
  };
  await queryFormApi.resetForm();
  return gridApi.reload();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  searchParams.value = {
    ...searchParams.value,
    ...values,
  };
  drillFilters.value = {
    contact: '',
    groupType: '',
    phone: '',
    status: '',
  };
  await syncQueryFormValues();
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

/** 导出当前列表 */
async function handleExport() {
  try {
    await GroupInfoApi.exportGroupInfo(
      buildGroupInfoQueryParams(searchParams.value, drillFilters.value),
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
  try {
    await confirm(`确认${status === '正常' ? '启用' : '禁用'}${row.name}吗？`);
  } catch {
    return;
  }

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

/** 打开搜索抽屉 */
async function handleSerachShow() {
  drawerApi.open();
  await syncQueryFormValues();
}

async function syncQueryFormValues() {
  await queryFormApi.resetForm();
  await queryFormApi.setValues(searchParams.value);
}

/** 按联系人筛选 */
function handleFilterContact(contact: string) {
  drillFilters.value.contact =
    drillFilters.value.contact === contact ? '' : contact;
  gridApi.reload();
}

/** 按手机号筛选 */
function handleFilterPhone(phone: string) {
  drillFilters.value.phone = drillFilters.value.phone === phone ? '' : phone;
  gridApi.reload();
}

/** 按集团类型筛选 */
function handleFilterGroupType(groupType: string) {
  drillFilters.value.groupType =
    drillFilters.value.groupType === groupType ? '' : groupType;
  gridApi.reload();
}

/** 按集团状态筛选 */
function handleFilterStatus(status: GroupInfoRow['status']) {
  drillFilters.value.status =
    drillFilters.value.status === status ? '' : status;
  gridApi.reload();
}

/** 取消联系人筛选 */
function handleCancelContactFilter() {
  drillFilters.value.contact = '';
  gridApi.reload();
}

/** 取消手机号筛选 */
function handleCancelPhoneFilter() {
  drillFilters.value.phone = '';
  gridApi.reload();
}

/** 取消集团类型筛选 */
function handleCancelGroupTypeFilter() {
  drillFilters.value.groupType = '';
  gridApi.reload();
}

/** 取消集团状态筛选 */
function handleCancelStatusFilter() {
  drillFilters.value.status = '';
  gridApi.reload();
}

/** 移除筛选标签 */
async function handleRemoveFilterTag(tag: ActiveFilterTag) {
  if (tag.source === 'drill') {
    if (tag.key === 'contact') {
      handleCancelContactFilter();
    } else if (tag.key === 'phone') {
      handleCancelPhoneFilter();
    } else if (tag.key === 'groupType') {
      handleCancelGroupTypeFilter();
    } else if (tag.key === 'status') {
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
      <Grid>
        <template #table-title>
          <div
            class="tabel-tabs"
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              align-items: center;
            "
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
            <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
            <IconButton
              content="导入"
              icon-name="Upload"
              @click="() => (importDialogVisible = true)"
            />
            <IconButton
              content="导出"
              icon-name="download"
              @click="handleExport"
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

        <template #name="{ row }">
          <el-text
            class="common-align"
            type="primary"
            style="cursor: pointer"
            @click="handleDetail(row)"
          >
            {{ row.name }}
          </el-text>
        </template>

        <template #contact="{ row }">
          <el-text
            class="common-align"
            type="primary"
            style="cursor: pointer"
            @click="handleFilterContact(row.contact)"
          >
            {{ row.contact }}
          </el-text>
        </template>

        <template #phone="{ row }">
          <el-text
            class="common-align"
            type="primary"
            style="cursor: pointer"
            @click="handleFilterPhone(row.phone)"
          >
            {{ maskPhone(row.phone) }}
          </el-text>
        </template>

        <template #groupType="{ row }">
          <el-text
            class="common-align"
            type="primary"
            style="cursor: pointer"
            @click="handleFilterGroupType(row.groupType)"
          >
            {{ row.groupType }}
          </el-text>
        </template>

        <template #status="{ row }">
          <ElTag
            :type="getStatusTagType(row.status)"
            style="cursor: pointer"
            @click="handleFilterStatus(row.status)"
          >
            {{ row.status }}
          </ElTag>
        </template>

        <template #walletBalance="{ row }">
          <el-text
            class="common-align"
            type="primary"
            style="cursor: pointer"
            @click="handleOpenAccount(row)"
          >
            {{ row.walletBalance.toFixed(2) }}
          </el-text>
        </template>

        <template #auditorName="{ row }">
          <el-text
            v-if="row.auditorName !== '-'"
            class="common-align"
            type="primary"
            style="cursor: pointer"
            @click="handleOpenOperator(row, 'auditor')"
          >
            {{ row.auditorName }}
          </el-text>
          <span v-else>{{ row.auditorName }}</span>
        </template>

        <template #creator="{ row }">
          <el-text
            class="common-align"
            type="primary"
            style="cursor: pointer"
            @click="handleOpenOperator(row, 'creator')"
          >
            {{ row.creator }}
          </el-text>
        </template>

        <template #actions="{ row }">
          <div class="table-toolbar-tools">
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleDetail(row)"
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
              v-if="row.status === '正常'"
              content="编辑"
              icon-name="Edit"
              @click="handleEdit(row)"
            />
            <IconButton
              v-if="row.status === '正常'"
              content="禁用"
              icon-name="Close"
              @click="handleToggleStatus(row, '禁用')"
            />
            <IconButton
              v-if="row.status === '禁用'"
              content="启用"
              icon-name="Check"
              @click="handleToggleStatus(row, '正常')"
            />
          </div>
        </template>
      </Grid>
    </div>

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

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
      <div class="import-tip">下载模板后上传文件即可。</div>
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
