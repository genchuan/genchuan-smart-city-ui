<script setup>
import { computed, nextTick, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import * as pageApi from '#/api/genchuan/industry/chargePark/stationResource/decisionAnalysis/stationOpReport/index.js';
import IconButton from '#/genchuan-components/IconButton.vue';
import '#/components/page/index.scss';

import DetailDrawer from './detail.vue';
import {
  REPORT_TYPE,
  formFields,
  pageConfig,
  searchFields,
  tableColumns,
} from './data.js';

const primaryField =
  pageConfig.primaryField ||
  pageConfig.nameField ||
  tableColumns[0]?.field ||
  'id';
const appliedQuery = ref({});
const detailObj = ref({});
const generating = ref(false);
const detailDrawerRef = ref(null);

const reportPeriodMap = {
  day: '日报',
  week: '周报',
  montly: '月报',
  season: '季报',
  half: '半年报',
  year: '年报',
  customize: '自定义报表',
};

function currentReportPeriod() {
  return reportPeriodMap[REPORT_TYPE] || REPORT_TYPE;
}

function normalizeOptions(options = []) {
  return options.map((item) => {
    if (typeof item === 'object' && item !== null) {
      return {
        label: item.label ?? item.value,
        value: item.value ?? item.label,
      };
    }
    return {
      label: item,
      value: item,
    };
  });
}

function sanitizeParams(source = {}) {
  return Object.fromEntries(
    Object.entries(source).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  );
}

function createSchema(fields, isSearch = false) {
  return fields.map((field) => {
    const component =
      field.type === 'select'
        ? 'Select'
        : field.type === 'number'
          ? 'InputNumber'
          : field.type === 'date' || field.type === 'datetime'
            ? 'DatePicker'
            : 'Input';

    const componentProps = {
      placeholder:
        (field.type === 'select' ||
        field.type === 'date' ||
        field.type === 'datetime'
          ? '请选择'
          : '请输入') + field.label,
    };

    if (field.type === 'select') {
      Object.assign(componentProps, {
        allowClear: true,
        filterOption: true,
        options: normalizeOptions(field.options || []),
        showSearch: true,
      });
    }

    if (field.type === 'number') {
      componentProps.controls = false;
    }

    if (field.type === 'date' || field.type === 'datetime') {
      Object.assign(componentProps, {
        format:
          field.type === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
        showTime: field.type === 'datetime',
        type: field.type === 'datetime' ? 'datetime' : 'date',
        valueFormat:
          field.type === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
      });
    }

    return {
      component,
      componentProps,
      fieldName: field.field,
      label: field.label,
      labelWidth: isSearch ? 100 : 110,
      rules: !isSearch && field.required ? 'required' : undefined,
    };
  });
}

const drawerTitle = computed(
  () => pageConfig.generateButtonText || '生成' + pageConfig.title,
);

function getCellSlotName(column) {
  if (column.drillType || column.field === primaryField) {
    return 'cell_' + column.field;
  }
  return '';
}

const interactiveColumns = computed(() =>
  tableColumns
    .map((column) => ({
      ...column,
      slotName: getCellSlotName(column),
    }))
    .filter((column) => column.slotName),
);

const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  appendToMain: true,
  footer: false,
  modal: false,
  onCancel() {
    searchDrawerApi.close();
  },
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
  handleSubmit: handleQuerySubmit,
  layout: 'horizontal',
  schema: createSchema(searchFields, true),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
  resetButtonOptions: {
    content: '重置',
  },
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 110,
  },
  layout: 'horizontal',
  schema: createSchema(formFields, false),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm: handleGenerate,
  async onOpenChange(isOpen) {
    if (!isOpen || !pageConfig.enableGenerate) return;
    formApi.resetForm();
    await formApi.setValues({
      reportCycle: currentReportPeriod(),
    });
  },
});

function buildGridColumns() {
  return [
    ...tableColumns.map((column) => {
      const columnConfig = {
        field: column.field,
        minWidth: column.minWidth || 140,
        showOverflow: true,
        title: column.label,
        sortable: true,
      };
      if (column.formatter) {
        columnConfig.formatter = column.formatter;
      }
      const slotName = getCellSlotName(column);
      if (slotName) {
        columnConfig.slots = { default: slotName };
      }
      return columnConfig;
    }),
    {
      fixed: 'right',
      slots: { default: 'actions' },
      title: '操作',
      width: 180,
    },
  ];
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: buildGridColumns(),
    keepSource: true,
    pagerConfig: {
      pageSize: 10,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          return await pageApi.getStationOpReportPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            reportCycle: currentReportPeriod(),
            ...appliedQuery.value,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    showOverflow: true,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
  },
  showSearchForm: false,
});

// 监听 appliedQuery 的变化，在某些情况下自动刷新列表
watch(
  () => appliedQuery.value,
  () => {},
  { deep: true },
);

function handleRefresh() {
  gridApi.query();
}

async function handleQuerySubmit() {
  appliedQuery.value = sanitizeParams(queryFormApi.form.values || {});
  searchDrawerApi.close();
  handleRefresh();
}

async function handleResetSearch() {
  appliedQuery.value = {};
  await queryFormApi.resetForm();
  searchDrawerApi.close();
  handleRefresh();
}

function handleOpenSearch() {
  searchDrawerApi.open();
}

function handleOpenGenerate() {
  if (!pageConfig.enableGenerate) return;
  formDrawerApi.open();
}

async function handleGenerate() {
  if (!pageConfig.enableGenerate) return;
  const values = sanitizeParams(formApi.form.values || {});
  const requiredField = formFields.find(
    (field) => field.required && !values[field.field],
  );
  if (requiredField) {
    ElMessage.warning(`请填写${requiredField.label}`);
    return;
  }

  generating.value = true;
  try {
    await pageApi.createStationOpReport({
      ...values,
      reportCycle: values.reportCycle || currentReportPeriod(),
    });
    ElMessage.success('报表生成成功');
    formDrawerApi.close();
    handleRefresh();
  } finally {
    generating.value = false;
  }
}

async function handleExport(extraParams = {}, isRowExport = false) {
  try {
    await ElMessageBox.confirm(
      isRowExport ? '确认导出当前报表记录吗？' : '确认导出当前筛选结果吗？',
      '导出确认',
      { type: 'warning' },
    );
  } catch {
    return;
  }

  const blob = await pageApi.exportStationOpReport({
    reportCycle: currentReportPeriod(),
    ...appliedQuery.value,
    ...extraParams,
  });
  downloadFileFromBlobPart({
    fileName: pageConfig.exportName,
    source: blob,
  });
  ElMessage.success('导出成功');
}

async function handleOpenDetail(row) {
  detailObj.value = (await pageApi.getStationOpReportDetail(row.id)) || row;
  await nextTick();
  detailDrawerRef.value?.open();
}

function rowActions(row) {
  return (
    pageConfig.rowActionMap?.[row.reportCycle] ||
    pageConfig.rowActionMap?.default || ['detail', 'exportRow']
  );
}

function handleRowAction(action, row) {
  if (action === 'detail') return handleOpenDetail(row);
  if (action === 'exportRow') return handleExport({ id: row.id }, true);
}

function actionLabel(action) {
  return (
    {
      detail: '查看',
      exportRow: '导出',
    }[action] || action
  );
}

function actionIcon(action) {
  return (
    {
      detail: 'View',
      exportRow: 'download',
    }[action] || 'Operation'
  );
}

function getFieldLabel(field) {
  const column =
    tableColumns.find((c) => c.field === field) ||
    searchFields.find((f) => f.field === field);
  return column?.label || field;
}

function getTagDisplayText(field, value) {
  if (field === 'status') {
    if (value === 'enabled' || value === '已生效') return '已生效';
    if (value === 'disabled' || value === '已禁用') return '已禁用';
    if (value === 'wait' || value === '未生效') return '未生效';
  }
  return value;
}

function removeFilterTag(field) {
  const nextQuery = { ...appliedQuery.value };
  delete nextQuery[field];
  appliedQuery.value = nextQuery;
  try {
    queryFormApi.setValues(nextQuery);
  } catch (e) {
    console.warn('Failed to set form values', e);
  }
  nextTick(() => {
    handleRefresh();
  });
}

function clearFilters() {
  appliedQuery.value = {};
  queryFormApi.resetForm();
  handleRefresh();
}

function getCellDisplayText(column, row) {
  const value = row?.[column.field];
  if (!isEmpty(value)) {
    return Array.isArray(value) ? value.join('、') : value;
  }
  if (column.field === primaryField) {
    return row?.[pageConfig.nameField] || row?.id || '--';
  }
  return '--';
}

async function applySearchPatch(patch) {
  const nextQuery = sanitizeParams({
    ...appliedQuery.value,
    ...patch,
  });
  appliedQuery.value = nextQuery;
  try {
    await queryFormApi.setValues(nextQuery);
  } catch (e) {
    console.warn('Failed to set form values', e);
  }
  await nextTick();
  handleRefresh();
}

async function handleCellDrill(column, row) {
  const drillType =
    column.drillType || (column.field === primaryField ? 'detail' : '');
  const rawValue = row?.[column.drillValueField || column.field];
  if (drillType === 'detail') {
    return handleOpenDetail(row);
  }
  if (drillType === 'filter') {
    if (isEmpty(rawValue)) return;
    return applySearchPatch({ [column.drillField || column.field]: rawValue });
  }
  if (drillType === 'dialog') {
    await handleOpenDetail(row);
    ElMessage.success(
      (column.drillLabel || column.label || '明细') + '弹窗已打开',
    );
  }
}

function handleFullScreen() {
  if (screenfull.isEnabled) {
    screenfull.toggle();
  }
}
// 暴露方法给父组件，支持同名称片区筛选展示
defineExpose({
  handleFilterTagClick: (field, value) => {
    applySearchPatch({ [field]: value });
  },
  clearFilters,
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer
      v-if="pageConfig.enableGenerate"
      :title="drawerTitle"
      :confirm-loading="generating"
    >
      <Form />
    </FormDrawer>

    <DetailDrawer ref="detailDrawerRef" :detail-obj="detailObj" />

    <SearchDrawer title="筛选">
      <QueryForm class="query-form" @reset="handleResetSearch" />
    </SearchDrawer>

    <Grid>
      <template #table-title>
        <div
          v-if="Object.keys(appliedQuery).length > 0"
          class="filter-tags-container"
          style="display: flex; flex-wrap: wrap; align-items: center"
        >
          <el-tag
            v-for="(val, key) in appliedQuery"
            :key="key"
            type="success"
            closable
            @close="removeFilterTag(key)"
            style="height: 32px; margin: 4px 8px 4px 0; line-height: 32px"
          >
            {{ getFieldLabel(key) }}: {{ getTagDisplayText(key, val) }}
          </el-tag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            v-if="pageConfig.enableGenerate"
            :content="pageConfig.generateButtonText"
            icon-name="DocumentAdd"
            @click="handleOpenGenerate"
          />
          <IconButton
            content="筛选"
            icon-name="search"
            @click="handleOpenSearch"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport()"
          />
          <IconButton
            content="刷新"
            icon-name="Refresh"
            @click="handleRefresh"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullScreen"
          />
        </div>
      </template>

      <template
        v-for="column in interactiveColumns"
        :key="column.field"
        #[column.slotName]="{ row }"
      >
        <el-text
          class="common-align"
          type="primary"
          @click="handleCellDrill(column, row)"
        >
          {{ getCellDisplayText(column, row) }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-for="action in rowActions(row)"
            :key="action"
            :content="actionLabel(action)"
            :icon-name="actionIcon(action)"
            @click="handleRowAction(action, row)"
          />
        </div>
      </template>
    </Grid>
  </div>
</template>
