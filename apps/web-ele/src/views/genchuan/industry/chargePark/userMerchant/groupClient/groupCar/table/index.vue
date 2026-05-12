<script lang="ts" setup>
import type { UploadUserFile } from 'element-plus';

import type {
  GroupCarRow,
  GroupProfileInfo,
  GroupSelectOption,
  OperatorInfo,
} from '../data';

import type { GroupCarDetailVO } from '#/api/genchuan/industry/chargePark/userMerchant/groupClient/groupCar';
import type { ActiveFilterTag } from '#/views/genchuan/industry/chargePark/userMerchant/utils/filterTags';

import { computed, nextTick, onMounted, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import dayjs from 'dayjs';
import {
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElInput,
  ElLoading,
  ElMessage,
  ElTag,
} from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { GroupCarApi } from '#/api/genchuan/industry/chargePark/userMerchant/groupClient/groupCar';
import { GroupInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/groupClient/groupInfo';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { downloadFileIfValid } from '#/views/genchuan/industry/chargePark/userMerchant/utils/download';
import { buildActiveFilterTags } from '#/views/genchuan/industry/chargePark/userMerchant/utils/filterTags';

import {
  buildGroupCarQueryParams,
  buildGroupCarRowFromApi,
  buildGroupSelectOptions,
  getBindingLogsSummary,
  getGroupProfile,
  getOperatorDetail,
  detailFields as groupCarDetailFields,
  groupOptions,
  maskPhone,
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

const currentGroupProfile = ref<GroupProfileInfo | null>(null);
const currentOperatorProfile = ref<null | OperatorInfo>(null);
const currentRow = ref<GroupCarRow>();
const detailCache = new Map<number, GroupCarDetailVO>();
const detailDrawerRef = ref<null | { open: () => void }>(null);
const drillFilters = ref({
  plateColor: '',
  status: '',
});
const searchParams = ref<Record<string, any>>({});

const drillFilterConfigs = {
  plateColor: {
    label: '车牌颜色',
    type: 'success',
  },
  status: {
    label: '绑定状态',
    type: 'warning',
  },
} as const;

const searchFilterConfigs = {
  bindTime: {
    formatter: (value: any[]) => value.join(' 至 '),
    label: '绑定时间',
    type: 'danger',
  },
  carType: {
    label: '车辆类型',
    type: 'info',
  },
  groupId: {
    label: '所属集团',
    type: 'info',
  },
  plateNo: {
    label: '车牌号码',
    type: 'primary',
  },
  status: {
    label: '绑定状态',
    type: 'warning',
  },
} as const;
const formData = ref<GroupCarRow>();
const formMode = ref<'create' | 'edit'>('create');
const formSource = ref<GroupCarDetailVO>();
const groupDetailCache = new Map<number, GroupProfileInfo>();
const groupDialogVisible = ref(false);
const groupSelectOptions = ref<GroupSelectOption[]>(groupOptions);
const importDialogVisible = ref(false);
const importFileList = ref<UploadUserFile[]>([]);
const operatorDialogVisible = ref(false);
const rejectDialogVisible = ref(false);
const rejectReason = ref('');
const rejectRow = ref<GroupCarRow>();

const detailData = ref();

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
  schema: useCreateSchema(groupSelectOptions.value),
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
  schema: useSearchSchema(groupSelectOptions.value).map((item) => ({
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

function resolveGroupName(groupId: number, groupName?: string) {
  if (groupName) {
    return groupName;
  }

  return (
    groupSelectOptions.value.find((item) => item.value === groupId)?.label ||
    getGroupProfile(groupId).name
  );
}

/** 获取车辆详情 */
async function fetchGroupCarDetail(
  row: GroupCarRow,
  errorMessage = '加载集团车辆详情失败',
) {
  const cachedDetail = detailCache.get(row.id);

  if (cachedDetail) {
    return {
      row: buildGroupCarRowFromApi(cachedDetail, row),
      source: cachedDetail,
    };
  }

  const loadingInstance = ElLoading.service({
    target: '.group-car-table',
    text: '加载中...',
  });

  try {
    const data = await GroupCarApi.getGroupCar(row.id);
    detailCache.set(row.id, data);

    return {
      row: buildGroupCarRowFromApi(data, {
        ...row,
        groupName: resolveGroupName(
          Number(data.groupId ?? row.groupId),
          data.groupName || row.groupName,
        ),
      }),
      source: data,
    };
  } catch (error) {
    ElMessage.error(errorMessage);
    console.error('[groupCar] load detail failed:', error);
    return null;
  } finally {
    loadingInstance.close();
  }
}

/** 查询车辆列表 */
async function queryGroupCarPage(
  { page }: any,
  formValues: Record<string, any> = {},
) {
  const queryValues = {
    ...formValues,
    ...searchParams.value,
    ...drillFilters.value,
  };

  const result = await GroupCarApi.getGroupCarPage({
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...buildGroupCarQueryParams(queryValues),
  });

  const list = Array.isArray(result?.list) ? result.list : [];

  return {
    list: list.map((item) => {
      const groupId = Number(item.groupId ?? 0);

      return buildGroupCarRowFromApi(item, {
        groupId,
        groupName: resolveGroupName(groupId, item.groupName),
      });
    }),
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
      target: '.group-car-table',
      text: formMode.value === 'create' ? '保存中...' : '更新中...',
    });

    try {
      if (formMode.value === 'create') {
        await GroupCarApi.createGroupCar({
          bindTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          carType: values.carType || '',
          groupId: Number(values.groupId || 0),
          plateColor: values.plateColor || '',
          plateNo: values.plateNo || '',
          remark: values.remark || '',
          status: '待审核',
        });
        ElMessage.success('新增成功');
      } else if (formData.value) {
        await GroupCarApi.updateGroupCar({
          auditRemark: formSource.value?.auditRemark,
          auditorId: formSource.value?.auditorId,
          auditTime: formSource.value?.auditTime,
          bindTime: formSource.value?.bindTime || formData.value.bindTime,
          carType: values.carType || '',
          groupId: formSource.value?.groupId || formData.value.groupId,
          id: formData.value.id,
          plateColor: values.plateColor || '',
          plateNo: values.plateNo || '',
          remark: values.remark || '',
          reserve1: formSource.value?.reserve1,
          reserve2: formSource.value?.reserve2,
          status: formSource.value?.status || formData.value.status,
        });
        ElMessage.success('编辑成功');
      }

      await handleReloadPage();
      formDrawerApi.close();
    } catch (error) {
      ElMessage.error(formMode.value === 'create' ? '新增失败' : '编辑失败');
      console.error('[groupCar] save failed:', error);
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
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: queryGroupCarPage,
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
  },
  showSearchForm: false,
});

/** 加载所属集团下拉 */
async function loadGroupOptions() {
  try {
    const result = await GroupInfoApi.getGroupInfoPage({
      pageNo: 1,
      pageSize: 200,
    });
    const list = Array.isArray(result?.list) ? result.list : [];

    groupSelectOptions.value = buildGroupSelectOptions(
      list.map((item) => ({
        label: item.name,
        value: Number(item.id ?? 0),
      })),
    );
  } catch (error) {
    console.error('[groupCar] load group options failed:', error);
    groupSelectOptions.value = buildGroupSelectOptions(
      groupSelectOptions.value,
    );
  }

  await formApi.updateSchema([
    {
      fieldName: 'groupId',
      componentProps: {
        options: groupSelectOptions.value,
      },
    },
  ]);

  await queryFormApi.updateSchema([
    {
      fieldName: 'groupId',
      componentProps: {
        options: groupSelectOptions.value,
      },
    },
  ]);

  await handleRefresh();
}

/** 刷新表格 - 同时清除所有快捷筛选 */
function handleRefresh() {
  drillFilters.value = {
    plateColor: '',
    status: '',
  };
  return gridApi.reload();
}

/** 联动刷新页面 */
async function handleReloadPage() {
  detailCache.clear();
  groupDetailCache.clear();
  await handleRefresh();
  await props.reloadStats?.();
}

/** 重置筛选条件 */
async function resetSearch() {
  searchParams.value = {};
  drillFilters.value = {
    plateColor: '',
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
    plateColor: '',
    status: '',
  };
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
  await loadGroupOptions();
});

/** 导出当前列表 */
async function handleExport() {
  try {
    const data = await GroupCarApi.exportGroupCar(
      buildGroupCarQueryParams({
        ...searchParams.value,
        ...drillFilters.value,
      }),
    );
    downloadFileFromBlobPart({ fileName: '集团车辆.xls', source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error('[groupCar] export failed:', error);
  }
}

/** 打开新增抽屉 */
function handleCreate() {
  formMode.value = 'create';
  formData.value = undefined;
  formSource.value = undefined;
  formApi.setState(() => ({
    schema: useCreateSchema(groupSelectOptions.value),
  }));
  formDrawerApi.setData(null).open();
}

/** 打开编辑抽屉 */
async function handleEdit(row: GroupCarRow) {
  const detail = await fetchGroupCarDetail(row);

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
async function handleDetail(row: GroupCarRow) {
  const detail = await fetchGroupCarDetail(row);

  if (!detail) {
    return;
  }

  currentRow.value = detail.row;
  detailData.value = {
    ...detail.row,
    bindingLogsSummary: getBindingLogsSummary(detail.row.bindingLogs),
  };
  detailDrawerRef.value?.open();
}

/** 打开集团详情弹窗 */
async function handleOpenGroup(row: GroupCarRow) {
  const cachedProfile = groupDetailCache.get(row.groupId);

  if (cachedProfile) {
    currentGroupProfile.value = cachedProfile;
    groupDialogVisible.value = true;
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.group-car-table',
    text: '加载中...',
  });

  try {
    const detail = await GroupInfoApi.getGroupInfo(row.groupId);
    const profile = getGroupProfile(row.groupId, row.groupName, {
      contact: detail.contact,
      groupType: detail.groupType,
      name: detail.name,
      phone: detail.phone,
      remark: detail.remark,
    });

    groupDetailCache.set(row.groupId, profile);
    currentGroupProfile.value = profile;
    groupDialogVisible.value = true;
  } catch (error) {
    currentGroupProfile.value =
      row.groupInfo || getGroupProfile(row.groupId, row.groupName);
    groupDialogVisible.value = true;
    console.error('[groupCar] load group profile failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开操作人员弹窗 */
async function handleOpenOperator(row: GroupCarRow) {
  if (!row.auditorName || row.auditorName === '-') {
    return;
  }

  if (row.auditorInfo) {
    currentOperatorProfile.value = row.auditorInfo;
    operatorDialogVisible.value = true;
    return;
  }

  const detail = await fetchGroupCarDetail(row, '加载操作人员详情失败');

  if (!detail) {
    return;
  }

  currentOperatorProfile.value =
    detail.row.auditorInfo ||
    getOperatorDetail(detail.row.auditorName, undefined, detail.row.auditorId);
  operatorDialogVisible.value = true;
}

/** 审核通过车辆 */
async function handleApprove(row: GroupCarRow) {
  const loadingInstance = ElLoading.service({
    target: '.group-car-table',
    text: '审核中...',
  });

  try {
    await GroupCarApi.approveGroupCar({
      auditRemark: '审核通过',
      ids: [row.id],
    });
    ElMessage.success('审核通过');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('审核通过失败');
    console.error('[groupCar] approve failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开驳回弹窗 */
function handleOpenReject(row: GroupCarRow) {
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
    target: '.group-car-table',
    text: '驳回中...',
  });

  try {
    await GroupCarApi.rejectGroupCar({
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
    console.error('[groupCar] reject failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 解绑车辆 */
async function handleUnbind(row: GroupCarRow) {
  try {
    await confirm(`确认解绑${row.plateNo}吗？`);
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.group-car-table',
    text: '解绑中...',
  });

  try {
    await GroupCarApi.unbindGroupCar({
      ids: [row.id],
    });
    ElMessage.success('解绑成功');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('解绑失败');
    console.error('[groupCar] unbind failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 重新绑定车辆 */
async function handleRebind(row: GroupCarRow) {
  const loadingInstance = ElLoading.service({
    target: '.group-car-table',
    text: '重新绑定中...',
  });

  try {
    await GroupCarApi.rebindGroupCar({
      ids: [row.id],
    });
    ElMessage.success('已重新发起绑定审核');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('重新绑定失败');
    console.error('[groupCar] rebind failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 按车牌颜色钻取列表 */
function handleFilterByPlateColor(plateColor: string) {
  drillFilters.value.plateColor =
    drillFilters.value.plateColor === plateColor ? '' : plateColor;
  gridApi.reload();
}

/** 下载导入模板 */
async function handleDownloadTemplate() {
  try {
    const data = await GroupCarApi.importGroupCarTemplate();
    downloadFileIfValid({
      fileName: 'group-car-import-template.xls',
      source: data,
    });
    ElMessage.success('模板下载成功');
  } catch (error) {
    ElMessage.error('模板下载失败');
    console.error('[groupCar] download template failed:', error);
  }
}

/** 导入车辆数据 */
async function handleImportCars() {
  const file = importFileList.value[0]?.raw;

  if (!file) {
    ElMessage.warning('请先上传导入文件');
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.group-car-table',
    text: '导入中...',
  });

  try {
    await GroupCarApi.importGroupCar(file);
    importDialogVisible.value = false;
    importFileList.value = [];
    ElMessage.success('导入成功');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('导入失败');
    console.error('[groupCar] import failed:', error);
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

/** 按绑定状态筛选 */
function handleFilterStatus(status: GroupCarRow['status']) {
  drillFilters.value.status =
    drillFilters.value.status === status ? '' : status;
  gridApi.reload();
}

/** 取消车牌颜色筛选 */
function handleCancelPlateColorFilter() {
  drillFilters.value.plateColor = '';
  gridApi.reload();
}

/** 取消绑定状态筛选 */
function handleCancelStatusFilter() {
  drillFilters.value.status = '';
  gridApi.reload();
}

/** 移除筛选标签 */
async function handleRemoveFilterTag(tag: ActiveFilterTag) {
  if (tag.source === 'drill') {
    if (tag.key === 'plateColor') {
      handleCancelPlateColorFilter();
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

      <template #groupName="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleOpenGroup(row)"
        >
          {{ row.groupName }}
        </el-text>
      </template>

      <template #plateNo="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleDetail(row)"
        >
          {{ row.plateNo }}
        </el-text>
      </template>

      <template #plateColor="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleFilterByPlateColor(row.plateColor)"
        >
          {{ row.plateColor }}
        </el-text>
      </template>

      <template #carType="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="setSearchValues({ carType: row.carType })"
        >
          {{ row.carType }}
        </el-text>
      </template>

      <template #status="{ row }">
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
          style="cursor: pointer"
          @click="handleFilterStatus(row.status)"
        >
          {{ row.status }}
        </ElTag>
      </template>

      <template #auditorName="{ row }">
        <el-text
          v-if="row.auditorName !== '-'"
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleOpenOperator(row)"
        >
          {{ row.auditorName }}
        </el-text>
        <span v-else>{{ row.auditorName }}</span>
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
            v-if="row.status === '已绑定'"
            content="解绑"
            icon-name="Close"
            @click="handleUnbind(row)"
          />
          <IconButton
            v-if="row.status === '已解绑'"
            content="重新绑定"
            icon-name="RefreshRight"
            @click="handleRebind(row)"
          />
          <IconButton
            v-if="row.status === '待审核'"
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
        </div>
      </template>
    </Grid>

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <FormDrawer :title="formMode === 'edit' ? '编辑车辆' : '新增车辆'">
      <Form class="mx-4" />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="groupCarDetailFields"
      :title="currentRow ? `${currentRow.plateNo}详情` : '车辆详情'"
    />

    <ElDialog v-model="importDialogVisible" title="导入集团车辆" width="520px">
      <div class="import-container">
        <div class="template-section">
          <div class="section-title">1. 下载导入模板</div>
          <div class="section-content">
            <p class="tip-text">
              请使用系统提供的模板格式导入数据，确保数据格式正确
            </p>
            <ElButton type="primary" @click="handleDownloadTemplate">
              下载导入模板
            </ElButton>
          </div>
        </div>

        <div class="upload-section">
          <div class="section-title">2. 上传数据文件</div>
          <div class="section-content">
            <el-upload
              v-model:file-list="importFileList"
              drag
              :auto-upload="false"
              :limit="1"
              accept=".xls,.xlsx,.csv"
            >
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 .xls、.xlsx、.csv 格式文件
                </div>
              </template>
            </el-upload>
          </div>
        </div>
      </div>
      <template #footer>
        <ElButton @click="importDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleImportCars"> 开始导入 </ElButton>
      </template>
    </ElDialog>

    <ElDialog
      v-model="rejectDialogVisible"
      title="驳回集团车辆绑定"
      width="520px"
    >
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

    <ElDialog v-model="groupDialogVisible" title="集团详情" width="520px">
      <ElDescriptions v-if="currentGroupProfile" :column="1" border>
        <ElDescriptionsItem label="集团名称">
          {{ currentGroupProfile.name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系人">
          {{ currentGroupProfile.contact }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系手机号">
          {{ maskPhone(currentGroupProfile.phone) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="集团类型">
          {{ currentGroupProfile.groupType }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="备注">
          {{ currentGroupProfile.remark }}
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
        <ElDescriptionsItem label="账号">
          {{ currentOperatorProfile.account }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="角色">
          {{ currentOperatorProfile.role }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="部门">
          {{ currentOperatorProfile.dept }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="手机号">
          {{ currentOperatorProfile.phone }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.import-actions,
.import-tip {
  margin-bottom: 12px;
}

.import-container {
  padding: 20px;
}

.template-section,
.upload-section {
  margin-bottom: 24px;
}

.section-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.section-content {
  padding-left: 16px;
}

.tip-text {
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
}
</style>
