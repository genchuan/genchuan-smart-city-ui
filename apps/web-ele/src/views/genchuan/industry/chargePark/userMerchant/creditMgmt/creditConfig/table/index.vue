<script lang="ts" setup>
import type { CreditConfigRow } from '../data';

import type { CreditConfigVO } from '#/api/genchuan/industry/chargePark/userMerchant/creditMgmt/creditConfig';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import dayjs from 'dayjs';
import { ElButton, ElLoading, ElMessage, ElTag } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { CreditConfigApi } from '#/api/genchuan/industry/chargePark/userMerchant/creditMgmt/creditConfig';
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
});
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
  formValues: Record<string, any>,
) {
  const isConfigTypeDrill = !!drillFilters.value.configType;
  const result = await CreditConfigApi.getCreditConfigPage({
    pageNo: isConfigTypeDrill ? 1 : page.currentPage,
    pageSize: isConfigTypeDrill ? 9999 : page.pageSize,
    ...buildCreditConfigQueryParams(formValues),
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
  drillFilters.value.configType = '';
  await gridApi.formApi.resetForm();
  await handleRefresh();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  const nextValues = { ...values };

  drillFilters.value.configType = nextValues.configType || '';
  delete nextValues.configType;

  await gridApi.formApi.resetForm();
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
</script>

<template>
  <div class="credit-config-table">
    <div class="credit-config-grid-wrap">
      <Grid table-title="信用配置列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '新增配置',
                type: 'primary',
                icon: ACTION_ICON.ADD,
                onClick: handleCreate,
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

        <template #ruleDesc="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ ruleDesc: row.ruleDesc })"
          >
            {{ row.ruleDesc }}
          </ElButton>
        </template>

        <template #levelThreshold="{ row }">
          <ElButton
            type="primary"
            link
            @click="setSearchValues({ levelThreshold: row.levelThreshold })"
          >
            {{ row.levelThreshold }}
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
                label: '编辑',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.EDIT,
                onClick: handleEdit.bind(null, row),
              },
              {
                label: '生效',
                type: 'primary',
                link: true,
                icon: ACTION_ICON.AUDIT,
                ifShow: () => row.status === '未生效',
                onClick: handleEnable.bind(null, row),
              },
              {
                label: '禁用',
                type: 'danger',
                link: true,
                icon: ACTION_ICON.DELETE,
                ifShow: () => row.status === '已生效',
                popConfirm: {
                  title: `确认禁用当前信用配置吗？`,
                  confirm: handleDisable.bind(null, row),
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
