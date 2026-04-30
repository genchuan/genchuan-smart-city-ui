<script lang="ts" setup>
import type { CreditConfigRow } from '../data';

import type { CreditConfigVO } from '#/api/genchuan/industry/chargePark/userMerchant/creditMgmt/creditConfig';

import { computed, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';

import dayjs from 'dayjs';
import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { CreditConfigApi } from '#/api/genchuan/industry/chargePark/userMerchant/creditMgmt/creditConfig';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import {
  buildCreditConfigQueryParams,
  buildCreditConfigRowFromApi,
  detailFields,
  formatApplyRecords,
  formatAuditLogs,
  getStatusTagType,
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

const detailCache = new Map<number, CreditConfigVO>();
const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<CreditConfigRow>();
const drillFilters = ref({
  configType: '',
  levelThreshold: '',
  ruleDesc: '',
  status: '',
});
const searchParams = ref<Record<string, any>>({});
const formData = ref<CreditConfigRow>();
const formMode = ref<'create' | 'edit'>('create');
const formSource = ref<CreditConfigVO>();

const detailData = computed(() => {
  if (!detailObj.value) {
    return null;
  }

  return {
    ...detailObj.value,
    applySummary: formatApplyRecords(detailObj.value.applyRecords),
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

/** 格式化提交时间 */
function formatSubmitTime(value?: string) {
  if (!value || value === '-') {
    return undefined;
  }

  return dayjs(value).isValid()
    ? dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    : value;
}

/** 校验信用规则唯一性 */
async function validateRuleDescUnique(ruleDesc: string, currentId?: number) {
  const result = await CreditConfigApi.getCreditConfigPage({
    pageNo: 1,
    pageSize: 9999,
    ruleDesc,
  });
  const list = Array.isArray(result?.list) ? result.list : [];

  return !list.some(
    (item) =>
      item.ruleDesc === ruleDesc && Number(item.id) !== Number(currentId || 0),
  );
}

/** 获取信用配置详情 */
async function fetchCreditConfigDetail(
  row: CreditConfigRow,
  errorMessage = '加载信用配置详情失败',
) {
  const cachedDetail = detailCache.get(row.id);

  if (cachedDetail) {
    return {
      row: buildCreditConfigRowFromApi(cachedDetail, row),
      source: cachedDetail,
    };
  }

  const loadingInstance = ElLoading.service({
    target: '.credit-config-table',
    text: '加载中...',
  });

  try {
    const data = await CreditConfigApi.getCreditConfig(row.id);
    detailCache.set(row.id, data);

    return {
      row: buildCreditConfigRowFromApi(data, row),
      source: data,
    };
  } catch (error) {
    ElMessage.error(errorMessage);
    console.error('[creditConfig] load detail failed:', error);
    return null;
  } finally {
    loadingInstance.close();
  }
}

/** 查询信用配置列表 */
async function queryCreditConfigPage(
  { page }: { page: { currentPage: number; pageSize: number } },
  formValues: Record<string, any> = {},
) {
  const queryValues = {
    ...searchParams.value,
    ...formValues,
    levelThreshold: drillFilters.value.levelThreshold,
    ruleDesc: drillFilters.value.ruleDesc,
    status: drillFilters.value.status,
  };
  const isConfigTypeDrill = !!drillFilters.value.configType;
  const result = await CreditConfigApi.getCreditConfigPage({
    pageNo: isConfigTypeDrill ? 1 : page.currentPage,
    pageSize: isConfigTypeDrill ? 9999 : page.pageSize,
    ...buildCreditConfigQueryParams(queryValues),
  });

  const sourceList = Array.isArray(result?.list) ? result.list : [];
  const mappedList = sourceList.map((item) =>
    buildCreditConfigRowFromApi(item),
  );
  const filteredList = drillFilters.value.configType
    ? mappedList.filter(
        (item) => item.configType === drillFilters.value.configType,
      )
    : mappedList;

  if (isConfigTypeDrill) {
    return {
      list: filteredList.slice(
        (page.currentPage - 1) * page.pageSize,
        page.currentPage * page.pageSize,
      ),
      total: filteredList.length,
    };
  }

  return {
    list: filteredList,
    total: Number(result?.total || 0),
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

    const values = (await formApi.getValues()) as Record<string, string>;
    const ruleDesc = (values.ruleDesc || '').trim();
    const levelThreshold = (values.levelThreshold || '').trim();
    const remark = (values.remark || '').trim();

    if (!(await validateRuleDescUnique(ruleDesc, formData.value?.id))) {
      ElMessage.warning('该信用规则已存在');
      return;
    }

    const loadingInstance = ElLoading.service({
      target: '.credit-config-table',
      text: formMode.value === 'create' ? '保存中...' : '更新中...',
    });

    try {
      if (formMode.value === 'create') {
        await CreditConfigApi.createCreditConfig({
          levelThreshold,
          remark,
          ruleDesc,
          status: '未生效',
        });
        ElMessage.success('新增成功');
      } else if (formData.value) {
        await CreditConfigApi.updateCreditConfig({
          id: formData.value.id,
          levelThreshold,
          remark,
          reserve1: formSource.value?.reserve1,
          reserve2: formSource.value?.reserve2,
          ruleDesc,
          status: formSource.value?.status || formData.value.status,
          effectTime: formatSubmitTime(
            formSource.value?.effectTime || formData.value.effectTime,
          ),
        });
        ElMessage.success('编辑成功');
      }

      await handleReloadPage();
      formDrawerApi.close();
    } catch (error) {
      ElMessage.error(formMode.value === 'create' ? '新增失败' : '编辑失败');
      console.error('[creditConfig] save failed:', error);
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
        remark: '',
      });
      return;
    }

    if (formData.value) {
      await formApi.setValues({
        levelThreshold: formData.value.levelThreshold,
        remark: formData.value.remark,
        ruleDesc: formData.value.ruleDesc,
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
        query: queryCreditConfigPage,
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
    configType: '',
    levelThreshold: '',
    ruleDesc: '',
    status: '',
  };
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
  searchParams.value = {};
  drillFilters.value = {
    configType: '',
    levelThreshold: '',
    ruleDesc: '',
    status: '',
  };
  await queryFormApi.resetForm();
  return gridApi.query();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  searchParams.value = {
    ...searchParams.value,
    ...values,
  };
  drillFilters.value = {
    configType: '',
    levelThreshold: '',
    ruleDesc: '',
    status: '',
  };
  await queryFormApi.setValues(searchParams.value);
  return gridApi.query();
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
async function handleEdit(row: CreditConfigRow) {
  const detail = await fetchCreditConfigDetail(row);

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
async function handleDetail(row: CreditConfigRow) {
  const detail = await fetchCreditConfigDetail(row);

  if (!detail) {
    return;
  }

  detailObj.value = detail.row;
  detailDrawerRef.value?.open();
}

/** 启用信用配置 */
async function handleEnable(row: CreditConfigRow) {
  const loadingInstance = ElLoading.service({
    target: '.credit-config-table',
    text: '生效中...',
  });

  try {
    await CreditConfigApi.enableCreditConfig({
      ids: [row.id],
    });
    ElMessage.success('信用配置已生效');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('生效失败');
    console.error('[creditConfig] enable failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 禁用信用配置 */
async function handleDisable(row: CreditConfigRow) {
  try {
    await confirm('确认禁用当前信用配置吗？');
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    target: '.credit-config-table',
    text: '禁用中...',
  });

  try {
    await CreditConfigApi.disableCreditConfig({
      ids: [row.id],
    });
    ElMessage.success('信用配置已禁用');
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('禁用失败');
    console.error('[creditConfig] disable failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开搜索抽屉 */
async function handleSerachShow() {
  drawerApi.open();
  await queryFormApi.setValues(searchParams.value);
}

/** 按规则筛选 */
function handleFilterRuleDesc(ruleDesc: string) {
  drillFilters.value.ruleDesc =
    drillFilters.value.ruleDesc === ruleDesc ? '' : ruleDesc;
  gridApi.query();
}

/** 按等级阈值筛选 */
function handleFilterLevelThreshold(levelThreshold: string) {
  drillFilters.value.levelThreshold =
    drillFilters.value.levelThreshold === levelThreshold ? '' : levelThreshold;
  gridApi.query();
}

/** 按配置状态筛选 */
function handleFilterStatus(status: CreditConfigRow['status']) {
  drillFilters.value.status =
    drillFilters.value.status === status ? '' : status;
  gridApi.query();
}

/** 取消规则筛选 */
function handleCancelRuleDescFilter() {
  drillFilters.value.ruleDesc = '';
  gridApi.query();
}

/** 取消等级阈值筛选 */
function handleCancelLevelThresholdFilter() {
  drillFilters.value.levelThreshold = '';
  gridApi.query();
}

/** 取消配置状态筛选 */
function handleCancelStatusFilter() {
  drillFilters.value.status = '';
  gridApi.query();
}
</script>

<template>
  <div class="credit-config-table">
    <div class="credit-config-grid-wrap">
      <Grid>
        <template #table-title>
          <div
            class="tabel-tabs"
            style="
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              gap: 10px;
            "
          >
            <ElTag
              v-if="drillFilters.ruleDesc"
              type="info"
              closable
              style="height: 32px; margin: 4px 0; line-height: 32px"
              @close="handleCancelRuleDescFilter"
            >
              加减分规则：{{ drillFilters.ruleDesc }}
            </ElTag>
            <ElTag
              v-if="drillFilters.levelThreshold"
              type="primary"
              closable
              style="height: 32px; margin: 4px 0; line-height: 32px"
              @close="handleCancelLevelThresholdFilter"
            >
              等级阈值：{{ drillFilters.levelThreshold }}
            </ElTag>
            <ElTag
              v-if="drillFilters.status"
              type="warning"
              closable
              style="height: 32px; margin: 4px 0; line-height: 32px"
              @close="handleCancelStatusFilter"
            >
              配置状态：{{ drillFilters.status }}
            </ElTag>
          </div>
        </template>

        <template #toolbar-tools>
          <div class="common-toolbar-tools">
            <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
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

        <template #ruleDesc="{ row }">
          <el-text
            class="common-align"
            type="primary"
            style="cursor: pointer"
            @click="handleFilterRuleDesc(row.ruleDesc)"
          >
            {{ row.ruleDesc }}
          </el-text>
        </template>

        <template #levelThreshold="{ row }">
          <el-text
            class="common-align"
            type="primary"
            style="cursor: pointer"
            @click="handleFilterLevelThreshold(row.levelThreshold)"
          >
            {{ row.levelThreshold }}
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

        <template #actions="{ row }">
          <div class="table-toolbar-tools">
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleDetail(row)"
            />
            <IconButton
              content="编辑"
              icon-name="Edit"
              @click="handleEdit(row)"
            />
            <IconButton
              v-if="row.status === '未生效'"
              content="生效"
              icon-name="Check"
              @click="handleEnable(row)"
            />
            <IconButton
              v-if="row.status === '已生效'"
              content="禁用"
              icon-name="Close"
              @click="handleDisable(row)"
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
      :fields="detailFields"
      :title="detailObj ? `${detailObj.configType}详情` : '信用配置详情'"
    />
  </div>
</template>

<style scoped lang="scss">
.credit-config-table,
.credit-config-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.credit-config-table {
  display: flex;
  flex-direction: column;
}

.credit-config-grid-wrap {
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
