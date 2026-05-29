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

import DrillDownDetailDrawer from '../components/DrillDownDetailDrawer.vue';
import {
  formFields,
  pageConfig,
  REPORT_TYPE,
  searchFields,
  tableColumns,
} from './data.js';
import DetailDrawer from './detail.vue';

import '#/components/page/index.scss';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  showStats: {
    type: Boolean,
    default: false,
  },
  toggleStats: {
    type: Function,
    default: () => {},
  },
  activeReportCycle: {
    type: String,
    default: undefined,
  },
});

const primaryField =
  pageConfig.primaryField ||
  pageConfig.nameField ||
  tableColumns[0]?.field ||
  'id';
const appliedQuery = ref({});
const detailObj = ref({});
const generating = ref(false);
const detailDrawerRef = ref(null);
const drillDownDrawerRef = ref(null);

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
  if (props.activeReportCycle !== undefined) {
    return props.activeReportCycle;
  }
  return reportPeriodMap[REPORT_TYPE] || REPORT_TYPE;
}

function normalizeReportCycle(value) {
  return value === '全部' ? '' : value || '';
}

function getReportCycleParams(value = currentReportPeriod()) {
  return { reportCycle: normalizeReportCycle(value) };
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
    let component;
    switch (field.type) {
      case 'date':
      case 'datetime': {
        component = 'DatePicker';
        break;
      }
      case 'number': {
        component = 'InputNumber';
        break;
      }
      case 'select': {
        component = 'Select';
        break;
      }
      default: {
        component = 'Input';
      }
    }

    const isDateType = field.type === 'date' || field.type === 'datetime';
    const componentProps = {
      placeholder:
        field.type === 'select' || isDateType
          ? `请选择${field.label}`
          : `请输入${field.label}`,
    };

    if (field.type === 'select') {
      Object.assign(componentProps, {
        allowClear: true,
        clearable: true,
        filterOption: true,
        options: normalizeOptions(field.options || []),
        showSearch: true,
      });
    }

    if (field.type === 'number') {
      componentProps.controls = false;
    }

    if (isDateType) {
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

const generateButtonText = computed(() => {
  const cycle = currentReportPeriod();
  if (cycle) return `生成${cycle}`;
  return '生成报表';
});

const drawerTitle = computed(
  () => generateButtonText.value || `生成${pageConfig.title}`,
);

function getCellSlotName(column) {
  if (column.drillType || column.field === primaryField) {
    return `cell_${column.field}`;
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
      reportCycle: currentReportPeriod() || reportPeriodMap[REPORT_TYPE],
    });
  },
});

function buildGridColumns() {
  return [
    ...tableColumns.map((column) => {
      const columnConfig = {
        ...column,
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
            ...getReportCycleParams(),
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
  handleRefresh(appliedQuery.value);
}

async function handleResetSearch() {
  appliedQuery.value = {};
  await queryFormApi.resetForm();
  searchDrawerApi.close();
  handleRefresh(appliedQuery.value);
}

async function handleOpenSearch() {
  searchDrawerApi.open();
  await nextTick();
  await syncQueryForm({
    ...appliedQuery.value,
    ...getReportCycleParams(),
  });
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

  const startTime = values.reportStartTime
    ? new Date(String(values.reportStartTime).replaceAll('-', '/')).getTime()
    : Number.NaN;
  const endTime = values.reportEndTime
    ? new Date(String(values.reportEndTime).replaceAll('-', '/')).getTime()
    : Number.NaN;
  if (
    !Number.isNaN(startTime) &&
    !Number.isNaN(endTime) &&
    startTime > endTime
  ) {
    ElMessage.warning('报表开始时间不能晚于报表结束时间');
    return;
  }

  generating.value = true;
  try {
    await pageApi.createStationOpReport(
      sanitizeParams({
        ...values,
        reportEndTime: Number.isNaN(endTime) ? undefined : endTime,
        reportCycle:
          values.reportCycle ||
          currentReportPeriod() ||
          reportPeriodMap[REPORT_TYPE],
        reportStartTime: Number.isNaN(startTime) ? undefined : startTime,
        statPeriod: [values.reportStartTime, values.reportEndTime]
          .filter(Boolean)
          .join(' - '),
      }),
    );
    ElMessage.success('生成成功');
    formDrawerApi.close();
    handleRefresh();
  } finally {
    generating.value = false;
  }
}

async function handleExport(extraParams = {}, isRowExport = false) {
  try {
    await ElMessageBox.confirm(
      isRowExport ? '确认导出当前记录？' : '确认导出当前列表？',
      '导出确认',
      {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
      },
    );
  } catch {
    return;
  }

  const blob = await pageApi.exportStationOpReport({
    ...getReportCycleParams(),
    ...appliedQuery.value,
    ...extraParams,
  });
  downloadFileFromBlobPart({
    fileName: pageConfig.exportName,
    source: blob,
  });
  ElMessage.success('导出成功');
  handleRefresh();
}

async function handleOpenDetail(row) {
  const detail = (await pageApi.getStationOpReportDetail(row.id)) || row;
  detailObj.value = {
    ...row,
    ...detail,
  };
  if (isEmpty(detailObj.value.status)) {
    detailObj.value.status =
      detailObj.value.generateStatus || detailObj.value.statusName;
  }
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
    if (value === '生成中') return '生成中';
    if (value === '生成成功') return '生成成功';
    if (value === '生成失败') return '生成失败';
  }
  return value;
}

async function removeFilterTag(field) {
  const nextQuery = { ...appliedQuery.value };
  delete nextQuery[field];
  appliedQuery.value = sanitizeParams(nextQuery);
  await syncQueryForm(appliedQuery.value);
  handleRefresh(appliedQuery.value);
}

async function clearFilters() {
  appliedQuery.value = {};
  await syncQueryForm({});
  handleRefresh(appliedQuery.value);
}

function getCellDisplayText(column, row) {
  let value = row?.[column.field];
  if (column.field === 'generateStatus') {
    value = row?.generateStatus;
  }
  if (!isEmpty(value)) {
    return Array.isArray(value) ? value.join(', ') : value;
  }
  if (column.field === primaryField) {
    return row?.[pageConfig.nameField] || row?.id || '--';
  }
  return '--';
}

async function syncQueryForm(values = {}) {
  const nextValues = sanitizeParams(values);
  try {
    await queryFormApi.resetForm();
    if (!isEmpty(nextValues)) {
      await queryFormApi.setValues(nextValues);
    }
  } catch (error) {
    console.warn('Failed to set form values', error);
  }
}
function applySearchPatch(patch) {
  const nextQuery = sanitizeParams({
    ...appliedQuery.value,
    ...patch,
  });
  appliedQuery.value = nextQuery;
  handleRefresh(nextQuery);
  nextTick(() => {
    syncQueryForm(nextQuery);
  });
}

function getDrillValue(column, row) {
  const field = column.drillValueField || column.field;
  let value = row?.[field];
  if (isEmpty(value) && column.displayField) {
    value = row?.[column.displayField];
  }
  return value;
}

function getDrillRowCountValue(column, row) {
  if (column.drillCountField) {
    return row?.[column.drillCountField];
  }
  if (column.field === 'revenue') {
    return row?.orderCount ?? row?.totalOrderCount ?? row?.revenue;
  }
  const field = column.drillValueField || column.field;
  return row?.[field];
}

function getDrillFilterPatch(column, row) {
  const field = column.drillField || column.field;
  const candidates = [
    column.drillValueField,
    column.field,
    field,
    column.displayField,
  ].filter(Boolean);

  if (field.endsWith('Id')) {
    candidates.push(field.replace(/Id$/, 'ID'));
  } else if (field.endsWith('Name')) {
    candidates.push(field.replace(/Name$/, 'Id'));
  }

  for (const key of new Set(candidates)) {
    const value = row?.[key];
    if (!isEmpty(value)) {
      return { [field]: value };
    }
  }

  const value = getDrillValue(column, row);
  if (isEmpty(value)) return null;
  return { [field]: value };
}

async function handleCellDrill(column, row) {
  const drillType =
    column.drillType || (column.field === primaryField ? 'detail' : '');
  if (drillType === 'detail') {
    return handleOpenDetail(row);
  }
  if (drillType === 'filter') {
    const patch = getDrillFilterPatch(column, row);
    if (!patch) return;
    return applySearchPatch(patch);
  }
  if (drillType === 'dialog') {
    drillDownDrawerRef.value?.open({
      source: 'table',
      drillType: column.field,
      drillLabel: column.drillLabel || column.label,
      drillName: row?.[pageConfig.nameField] || row?.reportCycle,
      drillValue: getDrillValue(column, row),
      drillCountValue: getDrillRowCountValue(column, row),
      reportCycle: normalizeReportCycle(
        row?.reportCycle || currentReportPeriod(),
      ),
      reportId: row?.id,
      row,
    });
  }
}

function handleFullScreen() {
  if (screenfull.isEnabled) {
    screenfull.toggle();
  }
}

function handleStatsFilter(type, value) {
  if (type !== 'reportCycle') return;
  const nextQuery = { ...appliedQuery.value };
  const reportCycle = normalizeReportCycle(value);
  if (reportCycle) {
    nextQuery.reportCycle = reportCycle;
  } else {
    delete nextQuery.reportCycle;
  }
  appliedQuery.value = nextQuery;
  handleRefresh(appliedQuery.value);
}

watch(
  () => props.activeReportCycle,
  (value, oldValue) => {
    if (value === undefined || value === oldValue) return;
    handleStatsFilter('reportCycle', value);
  },
);

defineExpose({
  handleFilterTagClick: (field, value) => {
    applySearchPatch({ [field]: value });
  },
  handleStatsFilter,
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
    <DrillDownDetailDrawer ref="drillDownDrawerRef" />

    <SearchDrawer title="筛选条件">
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
            :content="generateButtonText"
            icon-name="DocumentAdd"
            @click="handleOpenGenerate"
          />
          <IconButton
            content="查询"
            icon-name="search"
            @click="handleOpenSearch"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport()"
          />
          <IconButton
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="props.toggleStats"
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
