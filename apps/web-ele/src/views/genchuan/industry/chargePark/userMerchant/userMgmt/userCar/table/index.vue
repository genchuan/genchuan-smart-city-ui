<script lang="ts" setup>
import type { UploadUserFile } from 'element-plus';

import type {
  OperatorInfo,
  UserCarRow,
  UserProfileInfo,
  UserSelectOption,
} from '../data';

import type { UserCarDetailVO } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userCar';
import type { ActiveFilterTag } from '#/views/genchuan/industry/chargePark/userMerchant/utils/filterTags';

import { computed, nextTick, onMounted, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

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
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { UserCarApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userCar';
import { UserInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userInfo';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { downloadFileIfValid } from '#/views/genchuan/industry/chargePark/userMerchant/utils/download';
import { buildActiveFilterTags } from '#/views/genchuan/industry/chargePark/userMerchant/utils/filterTags';

import {
  buildUserCarQueryParams,
  buildUserCarRowFromApi,
  buildUserSelectOptions,
  getBindingLogsSummary,
  getOperatorDetail,
  getUserProfile,
  maskPhone,
  textObj,
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

const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});

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

// 快捷筛选变量
const filterStatus = ref('');
const filterPlateColor = ref('');
const searchParams = ref<Record<string, any>>({});

const quickFilterConfigs = {
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
  plateNo: {
    label: '车牌号码',
    type: 'primary',
  },
  status: {
    label: '绑定状态',
    type: 'warning',
  },
  userId: {
    label: '所属用户',
    type: 'info',
  },
} as const;

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

const activeFilterTags = computed<ActiveFilterTag[]>(() =>
  buildActiveFilterTags([
    {
      configs: quickFilterConfigs,
      source: 'quick',
      values: {
        plateColor: filterPlateColor.value,
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
  formValues: Record<string, any> = {},
) {
  const queryValues = {
    ...formValues,
    ...searchParams.value,
  };

  if (filterStatus.value) {
    queryValues.status = filterStatus.value;
  }

  if (filterPlateColor.value) {
    queryValues.plateColor = filterPlateColor.value;
  }

  const result = await UserCarApi.getUserCarPage({
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...buildUserCarQueryParams(queryValues),
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
  schema: useSearchSchema(userSelectOptions.value).map((item) => ({
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

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
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
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
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

  await queryFormApi.updateSchema([
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
  filterStatus.value = '';
  filterPlateColor.value = '';
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
  filterStatus.value = '';
  filterPlateColor.value = '';
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
  filterPlateColor.value = '';
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

  if (filterPlateColor.value) {
    exportValues.plateColor = filterPlateColor.value;
  }

  try {
    const data = await UserCarApi.exportUserCar(
      buildUserCarQueryParams(exportValues),
    );
    downloadFileFromBlobPart({ fileName: '用户车辆.xls', source: data });
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

/** 下载导入模板 */
async function handleDownloadTemplate() {
  try {
    const data = await UserCarApi.importUserCarTemplate();
    downloadFileIfValid({
      fileName: 'user-car-import-template.xls',
      source: data,
    });
    ElMessage.success('模板下载成功');
  } catch (error) {
    ElMessage.error('模板下载失败');
    console.error('[userCar] download template failed:', error);
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

/** 按车牌颜色筛选 */
function handleFilterPlateColor(plateColor: string) {
  filterPlateColor.value =
    filterPlateColor.value === plateColor ? '' : plateColor;
  gridApi.reload();
}

/** 取消状态筛选 */
function handleCancelStatusFilter() {
  filterStatus.value = '';
  gridApi.reload();
}

/** 取消车牌颜色筛选 */
function handleCancelPlateColorFilter() {
  filterPlateColor.value = '';
  gridApi.reload();
}

/** 移除筛选标签 */
async function handleRemoveFilterTag(tag: ActiveFilterTag) {
  if (tag.source === 'quick') {
    if (tag.key === 'status') {
      handleCancelStatusFilter();
    } else if (tag.key === 'plateColor') {
      handleCancelPlateColorFilter();
    }
    return;
  }

  const nextValues = { ...searchParams.value };
  delete nextValues[tag.key];
  searchParams.value = nextValues;
  await syncQueryFormValues();
  await handleRefresh();
}

const handleOpenDetail = (row: UserCarRow) => {
  handleDetail(row);
};
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

      <template #userName="{ row }">
        <el-text
          @click="handleOpenUser(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.userName }}
        </el-text>
      </template>

      <template #plateNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.plateNo }}
        </el-text>
      </template>

      <template #plateColor="{ row }">
        <el-text
          @click="handleFilterPlateColor(row.plateColor)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.plateColor }}
        </el-text>
      </template>

      <template #carType="{ row }">
        <el-text
          @click="setSearchValues({ carType: row.carType })"
          class="common-align"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.carType }}
        </el-text>
      </template>

      <template #status="{ row }">
        <ElTag
          @click="handleFilterStatus(row.status)"
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
        >
          {{ row.status }}
        </ElTag>
      </template>

      <template #auditorName="{ row }">
        <el-text
          v-if="row.auditorName !== '-'"
          @click="handleOpenOperator(row)"
          class="common-align"
          type="primary"
          style="cursor: pointer"
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
            v-if="row.status === '待审核'"
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            v-if="row.status === '已绑定'"
            content="解绑"
            icon-name="Close"
            @click="handleUnbind(row)"
          />
          <IconButton
            v-if="row.status === '已解绑' || row.status === '已驳回'"
            content="重新绑定"
            icon-name="RefreshRight"
            @click="handleRebind(row)"
          />
        </div>
      </template>
    </Grid>

    <FormDrawer :title="getTitle">
      <Form class="mx-4" />
    </FormDrawer>

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="userCarDetailFields"
      :title="currentRow ? `${currentRow.plateNo}详情` : '车辆详情'"
    />

    <ElDialog v-model="importDialogVisible" title="导入车辆" width="520px">
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
