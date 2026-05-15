<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import * as areaApi from '#/api/genchuan/industry/chargePark/stationResource/areaMgmt/areaInfo/index.js';
import * as pageApi from '#/api/genchuan/industry/chargePark/stationResource/parkingSpace/spaceInfo/index.js';
import * as stationConfigApi from '#/api/genchuan/industry/chargePark/stationResource/stationMgmt/stationConfig/index.js';
import * as stationInfoApi from '#/api/genchuan/industry/chargePark/stationResource/stationMgmt/stationInfo/index.js';
import CommonDetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import IconButton from '#/genchuan-components/IconButton.vue';

import ChartDrillDrawer from '../../components/ChartDrillDrawer.vue';
import DetailDrawer from './detail.vue';
import gateChart from './gateChart.vue';
import gateMap from './gateMap.vue';
import {
  formFields,
  pageConfig,
  searchFields,
  tableColumns,
} from './table/data.js';

import '#/components/page/index.scss';

const apiName = pageConfig.apiName;
const activeName = ref(pageConfig.title);
const primaryField =
  pageConfig.primaryField ||
  pageConfig.nameField ||
  tableColumns[0]?.field ||
  'id';
const chartLoading = ref(false);
const checkedIds = ref([]);
const appliedQuery = ref({});
const suppressTableFilterChange = ref(false);
const detailObj = ref({});
const showOverview = ref(true);
const formMode = ref('create');
const formData = ref(null);

const detailDrawerRef = ref(null);
const drillDrawerRef = ref(null);
const drillDetailObj = ref({});
const drillDetailFields = ref([]);
const drillDrawerTitle = ref('关联信息');
const importDialogVisible = ref(false);
const importFile = ref(null);
const importLoading = ref(false);
const importResult = ref(null);
const importUpdateSupport = ref(false);
const chartData = ref({});
const chartDrillDrawerRef = ref(null);
const selectOptionsMap = ref({});
let refreshRunning = false;
let pendingRefreshQuery = null;

function padTime(value) {
  return String(value).padStart(2, '0');
}

function formatDateTime(value) {
  if (value === undefined || value === null || value === '') return '--';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getFullYear()}-${padTime(value.getMonth() + 1)}-${padTime(value.getDate())} ${padTime(value.getHours())}:${padTime(value.getMinutes())}:${padTime(value.getSeconds())}`;
  }
  if (typeof value === 'number' || /^\d+$/.test(String(value))) {
    const text = String(value);
    const timestamp = Number(text.length === 10 ? `${text}000` : text);
    const date = new Date(timestamp);
    if (!Number.isNaN(date.getTime())) return formatDateTime(date);
  }
  const normalized = String(value)
    .replace('T', ' ')
    .replace(/\.\d+Z?$/, '');
  const parsed = new Date(String(value).replaceAll('-', '/'));
  if (!Number.isNaN(parsed.getTime())) return formatDateTime(parsed);
  return normalized.length >= 19 ? normalized.slice(0, 19) : normalized;
}

const columnFormatters = {
  formatDateTime: ({ cellValue }) => formatDateTime(cellValue),
};

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

function getSelectFieldOptions(field) {
  if (field.apiSource) {
    return selectOptionsMap.value[field.apiSource] || [];
  }
  return normalizeOptions(field.options || []);
}

function extractPageList(result) {
  if (Array.isArray(result)) {
    return result;
  }
  return (
    result?.list || result?.rows || result?.records || result?.data?.list || []
  );
}

function buildOptionsBySource(source, result) {
  const list = extractPageList(result);
  if (source === 'AreaInfo') {
    return list.map((item) => ({
      label: item.areaNo
        ? `${item.name || item.areaName} (${item.areaNo})`
        : item.name || item.areaName || item.id || item.areaId,
      value: item.id ?? item.areaId,
    }));
  }
  if (source === 'StationConfig') {
    return list.map((item) => ({
      label:
        item.stationNo || item.configKey
          ? `${item.stationName || item.name || item.stationNo || item.configKey} (${item.stationNo || item.configKey})`
          : item.stationName || item.name || item.id || item.stationId,
      value: item.stationId ?? item.id,
    }));
  }
  if (source === 'StationInfo') {
    return list.map((item) => ({
      label: item.stationNo
        ? `${item.name || item.stationName || item.stationNo} (${item.stationNo})`
        : item.name || item.stationName || item.id || item.stationId,
      value: item.id ?? item.stationId,
    }));
  }
  return [];
}

async function loadSelectOptions() {
  const sources = [
    ...new Set(
      [...searchFields, ...formFields]
        .map((field) => field.apiSource)
        .filter(Boolean),
    ),
  ];
  if (sources.length === 0) {
    return;
  }

  const nextOptions = { ...selectOptionsMap.value };
  await Promise.all(
    sources.map(async (source) => {
      try {
        if (source === 'AreaInfo') {
          const result = await areaApi.getAreaInfoPage({
            pageNo: 1,
            pageSize: 200,
          });
          nextOptions[source] = buildOptionsBySource(source, result);
          return;
        }
        if (source === 'StationConfig') {
          const result = await stationConfigApi.getStationConfigPage({
            pageNo: 1,
            pageSize: 200,
          });
          nextOptions[source] = buildOptionsBySource(source, result);
          return;
        }
        if (source === 'StationInfo') {
          const result = await stationInfoApi.getStationInfoPage({
            pageNo: 1,
            pageSize: 200,
          });
          nextOptions[source] = buildOptionsBySource(source, result);
        }
      } catch (error) {
        console.error(`加载${source}下拉选项失败:`, error);
        nextOptions[source] = [];
      }
    }),
  );
  selectOptionsMap.value = nextOptions;
  await refreshSelectSchemas();
}
function sanitizeParams(source = {}) {
  return Object.fromEntries(
    Object.entries(source).filter(([, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== '';
    }),
  );
}

function getPlaceholder(field) {
  return (
    (field.type === 'select' || field.type === 'date' ? '请选择' : '请输入') +
    field.label
  );
}

function createSchema(fields, isSearch = false) {
  return fields.map((field) => {
    let component;
    switch (field.type) {
      case 'date': {
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

    const componentProps = {
      placeholder: getPlaceholder(field),
    };

    if (field.type === 'select') {
      Object.assign(componentProps, {
        allowClear: true,
        clearable: true,
        filterOption: true,
        options: getSelectFieldOptions(field),
        showSearch: true,
      });
    }

    if (field.type === 'number') {
      componentProps.controls = false;
    }

    if (field.type === 'date') {
      Object.assign(componentProps, {
        format: 'YYYY-MM-DD',
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
      });
    }

    if (field.type === 'textarea') {
      Object.assign(componentProps, {
        rows: 3,
        type: 'textarea',
      });
    }

    if (field.readonly) {
      componentProps.disabled = true;
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
  () => (formMode.value === 'edit' ? '编辑' : '新增') + pageConfig.title,
);
const hasMap = computed(() => true);

const chartCards = computed(() => {
  const cardData = chartData.value?.cardData || {};
  return (pageConfig.chart?.cards || []).map(
    ([key, title, status, field, suffix], index) => ({
      key,
      title,
      status,
      field,
      value: `${cardData[key] ?? 0}${suffix || ''}`,
      color: ['#13ce66', '#4ECDC4', '#FFB020', '#FF6B6B'][index % 4],
    }),
  );
});

const pieData = computed(() => {
  const [dataKey, nameField, valueField] = pageConfig.chart?.pie || [];
  return (chartData.value?.[dataKey] || []).map((item) => ({
    name: item[nameField],
    value: item[valueField] ?? 0,
  }));
});

const barXData = computed(() => {
  const [dataKey, nameField] = pageConfig.chart?.bar || [];
  return (chartData.value?.[dataKey] || []).map((item) => item[nameField]);
});

const barSeriesData = computed(() => {
  const [dataKey, , valueField, label] = pageConfig.chart?.bar || [];
  return [
    {
      data: (chartData.value?.[dataKey] || []).map(
        (item) => item[valueField] ?? 0,
      ),
      name: label || '数量',
    },
  ];
});

const lineXData = computed(() => {
  const [dataKey, nameField] = pageConfig.chart?.line || [];
  return (chartData.value?.[dataKey] || []).map((item) => item[nameField]);
});

const lineSeriesData = computed(() => {
  const [dataKey, , valueField, label] = pageConfig.chart?.line || [];
  return [
    {
      data: (chartData.value?.[dataKey] || []).map(
        (item) => item[valueField] ?? 0,
      ),
      name: label || '数量',
    },
  ];
});

const mapData = computed(() =>
  (chartData.value?.mapData || []).map((item) => ({
    ...item,
    coordinate:
      item.coordinate || [item.lng, item.lat].filter(Boolean).join(','),
    locationName: item.locationName || item.name,
    statusName: item.statusName || item.status || '正常',
  })),
);

function getCellSlotName(column) {
  if (
    column.type === 'image' ||
    column.drillType ||
    column.field === primaryField
  ) {
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

const dialogFieldCatalog = {
  areaId: [
    { key: 'areaId', label: '片区ID', section: '关联信息' },
    { key: 'name', label: '名称', section: '当前记录' },
    { key: 'province', label: '省份', section: '区域信息' },
    { key: 'city', label: '城市', section: '区域信息' },
    { key: 'district', label: '区县', section: '区域信息' },
    { key: 'status', label: '状态', section: '区域信息' },
  ],
  parentId: [
    { key: 'parentId', label: '上级片区ID', section: '关联信息' },
    { key: 'name', label: '当前片区', section: '当前记录' },
    { key: 'province', label: '省份', section: '区域信息' },
    { key: 'city', label: '城市', section: '区域信息' },
    { key: 'district', label: '区县', section: '区域信息' },
    { key: 'status', label: '状态', section: '区域信息' },
  ],
  stationId: [
    { key: 'stationName', label: '场站名称', section: '关联信息' },
    { key: 'stationNo', label: '场站编号', section: '关联信息' },
    { key: 'name', label: '名称', section: '当前记录' },
    { key: 'areaId', label: '所属片区ID', section: '归属信息' },
    { key: 'address', label: '地址', section: '归属信息' },
    { key: 'status', label: '状态', section: '运营信息' },
  ],
  stationIds: [
    { key: 'stationIds', label: '适用场站', section: '关联信息' },
    { key: 'name', label: '规则名称', section: '当前记录' },
    { key: 'status', label: '状态', section: '当前记录' },
    { key: 'startTime', label: '开始时间', section: '规则配置' },
    { key: 'endTime', label: '结束时间', section: '规则配置' },
  ],
  stationCount: [
    { key: 'areaNo', label: '片区编号', section: '当前记录' },
    { key: 'name', label: '片区名称', section: '当前记录' },
    { key: 'stationCount', label: '覆盖场站数', section: '统计指标' },
    { key: 'status', label: '状态', section: '统计指标' },
  ],
  totalSpace: [
    { key: 'stationNo', label: '场站编号', section: '关联信息' },
    { key: 'name', label: '场站名称', section: '关联信息' },
    { key: 'totalSpace', label: '总车位数', section: '统计指标' },
    { key: 'serviceType', label: '服务类型', section: '统计指标' },
    { key: 'status', label: '状态', section: '统计指标' },
  ],
  deviceId: [
    { key: 'deviceId', label: '设备ID', section: '关联信息' },
    { key: 'spaceNo', label: '车位编号', section: '关联信息' },
    { key: 'stationId', label: '所属场站ID', section: '关联信息' },
    { key: 'status', label: '状态', section: '监控信息' },
    { key: 'location', label: '定位信息', section: '监控信息' },
    { key: 'lastReportTime', label: '最近上报时间', section: '监控信息' },
  ],
  location: [
    { key: 'location', label: '定位信息', section: '地图定位' },
    { key: 'spaceNo', label: '车位编号', section: '地图定位' },
    { key: 'stationId', label: '所属场站ID', section: '地图定位' },
    { key: 'deviceId', label: '设备ID', section: '地图定位' },
    { key: 'status', label: '状态', section: '监控信息' },
    { key: 'lastReportTime', label: '最近上报时间', section: '监控信息' },
  ],
  carNo: [
    { key: 'carNo', label: '车牌号', section: '车辆信息' },
    { key: 'type', label: '名单类型', section: '车辆信息' },
    { key: 'reason', label: '细分类型', section: '车辆信息' },
    { key: 'stationIds', label: '适用场站', section: '生效信息' },
    { key: 'startTime', label: '生效时间', section: '生效信息' },
    { key: 'endTime', label: '失效时间', section: '生效信息' },
    { key: 'status', label: '状态', section: '生效信息' },
  ],
  expandStatus: [
    { key: 'id', label: '拓场编号', section: '基础信息' },
    { key: 'stationId', label: '合作场站ID', section: '基础信息' },
    { key: 'expandStatus', label: '拓场进度', section: '进度明细' },
    { key: 'debtRate', label: '追缴范围', section: '进度明细' },
    { key: 'status', label: '状态', section: '进度明细' },
    { key: 'updateTime', label: '更新时间', section: '进度明细' },
  ],
};

const fallbackDialogFields = [
  { key: primaryField, label: '主键编号', section: '当前记录' },
  { key: pageConfig.nameField, label: '名称', section: '当前记录' },
  { key: 'status', label: '状态', section: '当前记录' },
  { key: 'creator', label: '创建人', section: '审计信息' },
  { key: 'createTime', label: '创建时间', section: '审计信息' },
  { key: 'updater', label: '更新人', section: '审计信息' },
  { key: 'updateTime', label: '更新时间', section: '审计信息' },
];

function dedupeFields(fields = []) {
  const seen = new Set();
  return fields.filter((field) => {
    if (!field?.key || seen.has(field.key)) {
      return false;
    }
    seen.add(field.key);
    return true;
  });
}

function buildDialogFields(column, row) {
  const fieldKey = column.drillValueField || column.field;
  const displayFieldKey =
    column.displayField && !isEmpty(row?.[column.displayField])
      ? column.displayField
      : fieldKey;
  const dialogFields = [
    {
      key: displayFieldKey,
      label: column.drillLabel || column.label || '关联信息',
      section: '关联信息',
    },
    ...(dialogFieldCatalog[fieldKey] || []),
    ...fallbackDialogFields,
  ];

  return dedupeFields(dialogFields).filter(
    (field) => !isEmpty(row?.[field.key]),
  );
}

async function handleOpenDrillDialog(column, row) {
  drillDrawerTitle.value = column.drillLabel || column.label || '关联信息';
  drillDetailObj.value = row;
  drillDetailFields.value = buildDialogFields(column, row);
  if (isEmpty(drillDetailFields.value)) {
    drillDetailFields.value = [
      {
        key: column.drillValueField || column.field,
        label: column.drillLabel || column.label || '关联信息',
        section: '关联信息',
      },
    ];
  }
  await nextTick();
  drillDrawerRef.value?.open();
}

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

async function refreshSelectSchemas() {
  await queryFormApi.updateSchema(createSchema(searchFields, true));
  await formApi.updateSchema(createSchema(formFields, false));
}

async function handleFormConfirm() {
  const values = sanitizeParams({
    ...formData.value,
    ...formApi.form.values,
  });
  const requiredField = formFields.find(
    (field) => field.required && !values[field.field],
  );
  if (requiredField) {
    ElMessage.warning(`请填写${requiredField.label}`);
    return;
  }

  if (formMode.value === 'edit' && values.id) {
    await pageApi[`update${apiName}`](values);
    ElMessage.success('编辑成功');
  } else {
    await pageApi[`create${apiName}`](values);
    ElMessage.success('新增成功');
  }

  formDrawerApi.close();
  handleRefresh(appliedQuery.value);
}

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  onConfirm: handleFormConfirm,
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    await loadSelectOptions();
    formData.value = formDrawerApi.getData() || null;
    if (formMode.value === 'edit' && formData.value) {
      await formApi.setValues(formData.value);
    } else {
      formApi.resetForm();
    }
  },
});

function buildGridColumns() {
  return [
    { type: 'checkbox', width: 48 },
    ...tableColumns.map((column) => {
      const columnConfig = {
        field: column.field,
        minWidth: column.minWidth || 140,
        showOverflow: true,
        title: column.label,
        sortable: true,
      };
      if (column.formatter) {
        columnConfig.formatter =
          typeof column.formatter === 'string'
            ? columnFormatters[column.formatter]
            : column.formatter;
      }
      if (column.options?.length) {
        columnConfig.filters = normalizeOptions(column.options).map((item) => ({
          label: item.label,
          value: item.value,
        }));
        columnConfig.filterMultiple = false;
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
      width: 220,
    },
  ];
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: buildGridColumns(),
    filterConfig: {
      remote: true,
    },
    keepSource: true,
    pagerConfig: {
      pageSize: 10,
    },
    proxyConfig: {
      filter: false,
      ajax: {
        query: async ({ page }, formValues = {}) => {
          const explicitValues = sanitizeParams(formValues);
          const query =
            Object.keys(explicitValues).length > 0
              ? explicitValues
              : sanitizeParams(appliedQuery.value);
          return await pageApi[`get${apiName}Page`]({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...query,
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
  gridEvents: {
    checkboxAll: handleCheckboxChange,
    checkboxChange: handleCheckboxChange,
    filterChange: handleTableFilterChange,
  },
  showSearchForm: false,
});

// 监听 appliedQuery 的变化，在某些情况下自动刷新列表
watch(
  () => appliedQuery.value,
  () => {},
  { deep: true },
);

function handleCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

function getTableFilterValue(params = {}) {
  const candidates = [
    ...(Array.isArray(params.values) ? params.values : []),
    ...(Array.isArray(params.datas) ? params.datas : []),
    ...(Array.isArray(params.filterList)
      ? params.filterList.flatMap((item) => item.values || item.datas || [])
      : []),
    params.option?.data,
    params.option?.value,
  ];
  return candidates.find((value) => !isEmpty(value));
}

function handleTableFilterChange(params) {
  if (suppressTableFilterChange.value) return;
  const field = params?.column?.field;
  if (!field) return;
  const value = getTableFilterValue(params);
  if (isEmpty(value)) {
    if (!Object.prototype.hasOwnProperty.call(appliedQuery.value, field)) {
      return;
    }
    removeFilterTag(field);
    return;
  }
  applySearchPatch({ [field]: value });
}

function handleRefresh(query = appliedQuery.value) {
  pendingRefreshQuery = sanitizeParams(query);
  if (!refreshRunning) {
    runPendingRefresh();
  }
}

async function runPendingRefresh() {
  const nextQuery = pendingRefreshQuery || sanitizeParams(appliedQuery.value);
  pendingRefreshQuery = null;
  refreshRunning = true;
  try {
    const gridQuery = gridApi.query
      ? gridApi.query(nextQuery)
      : gridApi.reload?.(nextQuery);
    await Promise.all([Promise.resolve(gridQuery), loadChart(nextQuery)]);
  } finally {
    refreshRunning = false;
    if (pendingRefreshQuery) {
      nextTick(() => {
        runPendingRefresh();
      });
    }
  }
}

async function loadChart(query = appliedQuery.value) {
  if (
    !pageConfig.chart ||
    typeof pageApi[`get${apiName}Chart`] !== 'function'
  ) {
    return;
  }
  chartLoading.value = true;
  try {
    chartData.value =
      (await pageApi[`get${apiName}Chart`](sanitizeParams(query))) || {};
  } finally {
    chartLoading.value = false;
  }
}

async function handleQuerySubmit() {
  appliedQuery.value = sanitizeParams(queryFormApi.form.values || {});
  searchDrawerApi.close();
  handleRefresh(appliedQuery.value);
}

async function handleResetSearch() {
  appliedQuery.value = {};
  clearTableFilter();
  await queryFormApi.resetForm();
  searchDrawerApi.close();
  handleRefresh(appliedQuery.value);
}

function handleCreate() {
  formMode.value = 'create';
  formDrawerApi.setData(null).open();
}

function handleEdit(row) {
  formMode.value = 'edit';
  formDrawerApi.setData(row).open();
}

async function handleOpenDetail(row) {
  const detailApi = pageApi[`get${apiName}Detail`];
  const detail =
    typeof detailApi === 'function' ? (await detailApi(row.id)) || row : row;
  const nextDetail = {
    ...row,
    ...detail,
  };
  if (isEmpty(nextDetail.stationName) && !isEmpty(nextDetail.stationId)) {
    nextDetail.stationName = getOptionLabel('stationId', nextDetail.stationId);
  }
  if (isEmpty(nextDetail.qrcode)) {
    nextDetail.qrcode =
      nextDetail.qrCodeUrl || nextDetail.qrcodeUrl || nextDetail.qrCode || '';
  }
  detailObj.value = nextDetail;
  await nextTick();
  detailDrawerRef.value?.open();
}

async function handleStatusChange(action, row) {
  const label = action === 'enable' ? '启用' : '禁用';
  const actionApi = pageApi[action + apiName];

  if (typeof actionApi !== 'function') {
    ElMessage.error(`未配置${label}接口：${action}${apiName}`);
    return;
  }

  await ElMessageBox.confirm(
    `确认${label}当前${pageConfig.title}吗？`,
    '操作提示',
    {
      type: 'warning',
    },
  );

  try {
    await actionApi({ ids: [row.id] });
    ElMessage.success(`${label}成功`);
    handleRefresh();
  } catch (error) {
    const code = error?.code;
    if (code === 401) {
      ElMessage.error('登录状态已失效，请重新登录后再试');
      return;
    }
    ElMessage.error(error?.msg || error?.message || `${label}失败`);
  }
}

async function handleBind(row) {
  const { value } = await ElMessageBox.prompt('请输入关联设备ID', '绑定设备', {
    inputErrorMessage: '设备ID必须为数字',
    inputPattern: /^\d+$/,
    inputValue: row.deviceId || '',
  });
  await pageApi[`bind${apiName}`]({
    deviceId: Number(value),
    ids: [row.id],
  });
  ElMessage.success('绑定成功');
  handleRefresh(appliedQuery.value);
}

async function handleSave() {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请至少选择一条记录');
    return;
  }
  await pageApi[`save${apiName}`]({ ids: checkedIds.value });
  ElMessage.success('保存成功');
  handleRefresh(appliedQuery.value);
}

async function handleResetConfig() {
  const { value } = await ElMessageBox.prompt(
    '请输入需要重置的场站ID',
    '重置配置',
    {
      inputErrorMessage: '场站ID必须为数字',
      inputPattern: /^\d+$/,
    },
  );
  await pageApi[`reset${apiName}`]({ stationId: Number(value) });
  ElMessage.success('重置成功');
  handleRefresh(appliedQuery.value);
}

async function handleBatchSync() {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请至少选择一条记录');
    return;
  }
  await pageApi[`batchSync${apiName}`]({ ids: checkedIds.value });
  ElMessage.success('批量同步成功');
  handleRefresh(appliedQuery.value);
}

async function handleExport(extraParams = {}) {
  const exportApi = pageApi[`export${apiName}`];
  if (typeof exportApi !== 'function') return;
  const blob = await exportApi({
    ...appliedQuery.value,
    ...extraParams,
  });
  downloadFileFromBlobPart({
    fileName: pageConfig.exportName,
    source: blob,
  });
}

function handleOpenImport() {
  importFile.value = null;
  importResult.value = null;
  importUpdateSupport.value = false;
  importDialogVisible.value = true;
}

function handleImportFileChange(uploadFile) {
  importFile.value = uploadFile?.raw || uploadFile;
  importResult.value = null;
}

function handleRemoveImportFile() {
  importFile.value = null;
}

function normalizeImportResult(result) {
  const data = result?.data || result || {};
  const failureList = data.failureList || data.failures || [];
  return {
    failureCount: data.failureCount ?? failureList.length ?? 0,
    failureList,
    successCount: data.successCount ?? data.success ?? 0,
  };
}

async function handleDownloadImportTemplate() {
  const templateApi = pageApi[`get${apiName}ImportTemplate`];
  if (typeof templateApi !== 'function') {
    ElMessage.warning(`接口文档未提供${pageConfig.title}导入模板下载接口`);
    return;
  }
  const blob = await templateApi();
  downloadFileFromBlobPart({
    fileName:
      pageConfig.importTemplateName || `${pageConfig.title}导入模板.xlsx`,
    source: blob,
  });
}

async function handleImportConfirm() {
  if (!importFile.value) {
    ElMessage.warning('请先选择需要导入的 Excel 文件');
    return;
  }
  const importApi = pageApi[`import${apiName}`];
  if (typeof importApi !== 'function') {
    ElMessage.warning(`暂未配置${pageConfig.title}导入接口`);
    return;
  }
  importLoading.value = true;
  try {
    const result = await importApi(importFile.value, importUpdateSupport.value);
    importResult.value = normalizeImportResult(result);
    ElMessage.success('导入完成');
    handleRefresh();
    if (!importResult.value.failureCount) {
      importDialogVisible.value = false;
    }
  } finally {
    importLoading.value = false;
  }
}

function rowActions(row) {
  const actions = pageConfig.rowActionMap?.[row.status] ||
    pageConfig.rowActionMap?.default || ['detail'];
  if (row.realStatus === '故障' && !actions.includes('alarm')) {
    return [...actions, 'alarm'];
  }
  return actions;
}

function actionLabel(action) {
  if (action === 'enable') {
    return '启用';
  }
  return (
    {
      alarm: '告警',
      bind: '绑定',
      detail: '查看',
      disable: '禁用',
      edit: '编辑',
      exportRow: '导出',
      locate: '定位',
    }[action] || action
  );
}

function actionIcon(action) {
  return (
    {
      alarm: 'Warning',
      bind: 'Link',
      detail: 'View',
      disable: 'CircleClose',
      edit: 'Edit',
      enable: 'CircleCheck',
      exportRow: 'Download',
      locate: 'Location',
    }[action] || 'Operation'
  );
}

function actionColor(action) {
  return ['alarm', 'disable'].includes(action) ? '#F56C6C' : undefined;
}

function handleRowAction(action, row) {
  if (action === 'detail') return handleOpenDetail(row);
  if (action === 'edit') return handleEdit(row);
  if (action === 'enable' || action === 'disable')
    return handleStatusChange(action, row);
  if (action === 'bind') return handleBind(row);
  if (action === 'exportRow') return handleExport({ id: row.id });
  if (action === 'locate')
    return ElMessage.info(`已定位到记录：${row[primaryField] || row.id}`);
  if (action === 'alarm')
    return ElMessage.warning(`已触发告警：${row[primaryField] || row.id}`);
}

function clearTableFilter(field) {
  const grid = gridApi.grid;
  suppressTableFilterChange.value = true;
  try {
    if (field) {
      const column =
        grid?.getColumnByField?.(field) ||
        grid?.getColumnByField?.(String(field));
      if (column && typeof grid?.clearFilter === 'function') {
        grid.clearFilter(column);
      }
      return;
    }
    grid?.clearFilter?.();
  } catch (error) {
    console.warn('Failed to clear table filter', error);
  } finally {
    nextTick(() => {
      suppressTableFilterChange.value = false;
    });
  }
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

function findChartSourceItem(config = [], value) {
  const [dataKey, nameField] = config;
  return (chartData.value?.[dataKey] || []).find(
    (item) => String(item?.[nameField]) === String(value),
  );
}

function getChartSearchPatch(config = [], value) {
  const field = config[4] || config[3] || config[1];
  if (!field || isEmpty(value)) return {};
  const sourceRow = findChartSourceItem(config, value);
  const searchableFields = searchFields.map((item) => item.field);
  if (searchableFields.includes(field)) {
    return { [field]: sourceRow?.[field] ?? value };
  }
  const nameField = pageConfig.nameField || 'name';
  return { [nameField]: sourceRow?.[nameField] ?? sourceRow?.name ?? value };
}

function getFieldLabel(field) {
  const column =
    tableColumns.find((c) => c.field === field) ||
    searchFields.find((f) => f.field === field);
  return column?.label || field;
}

function getOptionLabel(field, value) {
  const config = searchFields.find((item) => item.field === field);
  const options = config ? getSelectFieldOptions(config) : [];
  const option = options.find(
    (item) => item.value === value || String(item.value) === String(value),
  );
  return option?.label || value;
}

function getTagDisplayText(field, value) {
  if (field === 'status') {
    if (value === 'enabled' || value === '已生效') return '已生效';
    if (value === 'disabled' || value === '已禁用') return '已禁用';
    if (value === 'wait' || value === '未生效') return '未生效';
  }
  return getOptionLabel(field, value);
}

async function removeFilterTag(field) {
  const nextQuery = { ...appliedQuery.value };
  delete nextQuery[field];
  const sanitizedQuery = sanitizeParams(nextQuery);
  appliedQuery.value = sanitizedQuery;
  clearTableFilter(field);
  handleRefresh(sanitizedQuery);
  await syncQueryForm(sanitizedQuery);
}

async function clearFilters() {
  appliedQuery.value = {};
  clearTableFilter();
  handleRefresh(appliedQuery.value);
  await syncQueryForm({});
}

function getCellDisplayText(column, row) {
  let value = column.displayField ? row?.[column.displayField] : undefined;
  if (isEmpty(value)) {
    value = row?.[column.field];
  }
  if (isEmpty(value)) {
    for (const field of column.fallbackFields || []) {
      value = row?.[field];
      if (!isEmpty(value)) break;
    }
  }
  if (column.displayField && column.field === 'stationId') {
    value = row?.[column.displayField] || getOptionLabel('stationId', value);
  }
  if (!isEmpty(value)) {
    const nextValue = Array.isArray(value) ? value.join('、') : value;
    const formatted =
      column.formatter === 'formatDateTime'
        ? formatDateTime(nextValue)
        : nextValue;
    if (column.suffix && formatted !== '--') {
      return `${formatted}${column.suffix}`;
    }
    return formatted;
  }
  if (column.field === primaryField) {
    return row?.[pageConfig.nameField] || row?.id || '--';
  }
  return '--';
}

function getImageUrl(value) {
  if (!value || value === '--') return '';
  const imageValue = Array.isArray(value) ? value[0] : value;
  if (!imageValue || imageValue === '--') return '';
  if (/^data:image\//.test(imageValue)) return imageValue;
  if (/^https?:\/\//.test(imageValue)) return imageValue;
  const baseUrl = import.meta.env.VITE_BASE_URL || '';
  return `${baseUrl}${String(imageValue).startsWith('/') ? '' : '/'}${imageValue}`;
}

function handleCardClick(item) {
  if (!item.status) {
    return openChartDrill('card', item.title, item.key, `${item.title}明细`, {
      metricValue: item.value,
      rowCount: item.value,
    });
  }
  const field = item.field || item.filterField || 'status';
  applySearchPatch({ [field]: item.status });
}

function openChartDrill(chartType, value, field, title, extra = {}) {
  chartDrillDrawerRef.value?.open({
    chartType,
    field,
    label: getFieldLabel(field),
    ...extra,
    pageTitle: pageConfig.title,
    title,
    value,
  });
}

function handleBarClick(name) {
  applySearchPatch(getChartSearchPatch(pageConfig.chart?.bar || [], name));
}

function handleLineClick(payload) {
  applySearchPatch(
    getChartSearchPatch(
      pageConfig.chart?.line || [],
      payload?.categoryName || payload?.name,
    ),
  );
}

function handlePieClick(payload) {
  applySearchPatch(
    getChartSearchPatch(pageConfig.chart?.pie || [], payload?.name),
  );
}

function getDrillValue(column, row) {
  const field = column.drillValueField || column.field;
  let value = row?.[field];
  if (isEmpty(value) && column.displayField) {
    value = row?.[column.displayField];
  }
  return value;
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
  const rawValue = getDrillValue(column, row);
  if (drillType === 'detail') {
    return handleOpenDetail(row);
  }
  if (drillType === 'filter') {
    const patch = getDrillFilterPatch(column, row);
    if (!patch) return;
    return applySearchPatch(patch);
  }
  if (drillType === 'download') {
    if (typeof rawValue === 'string' && rawValue) {
      globalThis.open?.(rawValue, '_blank');
      return;
    }
    ElMessage.success(`${column.drillLabel || column.label}下载能力已预留`);
    return;
  }
  if (drillType === 'dialog') {
    if (isEmpty(rawValue)) return;
    return handleOpenDrillDialog(column, row);
  }
}

function handleToggleOverview() {
  showOverview.value = !showOverview.value;
}

async function handleOpenSearch() {
  searchDrawerApi.open();
  await nextTick();
  await syncQueryForm(appliedQuery.value);
}

function handleFullScreen() {
  if (screenfull.isEnabled) {
    screenfull.toggle();
  }
}

onMounted(() => {
  loadChart();
  loadSelectOptions();
});
// 暴露方法给父组件，支持同名称片区筛选展示
defineExpose({
  handleFilterTagClick: (field, value) => {
    applySearchPatch({ [field]: value });
  },
  clearFilters,
});
</script>

<template>
  <div class="common-index station-resource-leaf-page">
    <div
      v-if="showOverview && (pageConfig.chart || hasMap)"
      class="station-overview"
    >
      <div class="station-chart-wrap">
        <gateChart
          v-if="pageConfig.chart"
          :cards="chartCards"
          :chart-config="pageConfig.chart"
          :title="pageConfig.title"
          :pie-data="pieData"
          :bar-x-data="barXData"
          :bar-series-data="barSeriesData"
          :line-x-data="lineXData"
          :line-series-data="lineSeriesData"
          @card-click="handleCardClick"
          @bar-click="handleBarClick"
          @line-click="handleLineClick"
          @pie-click="handlePieClick"
        />
      </div>
      <div v-if="hasMap" class="station-map-wrap">
        <gateMap :data="mapData" />
      </div>
    </div>

    <div class="park-lot-table-new" v-loading="chartLoading">
      <FormDrawer :title="drawerTitle">
        <Form />
      </FormDrawer>

      <DetailDrawer ref="detailDrawerRef" :detail-obj="detailObj" />
      <CommonDetailDrawer
        ref="drillDrawerRef"
        :title="drillDrawerTitle"
        :data="drillDetailObj"
        :fields="drillDetailFields"
        width="38%"
      />

      <ChartDrillDrawer ref="chartDrillDrawerRef" />

      <SearchDrawer title="筛选">
        <QueryForm class="query-form" @reset="handleResetSearch" />
      </SearchDrawer>

      <el-tabs v-model="activeName" class="common-tabs" type="card">
        <el-tab-pane :name="pageConfig.title">
          <template #label>
            <div class="table-first">
              <span>{{ pageConfig.title }}</span>
            </div>
          </template>
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
                  v-if="pageConfig.toolbar?.includes('create')"
                  content="新增"
                  icon-name="Plus"
                  @click="handleCreate"
                />
                <IconButton
                  v-if="pageConfig.toolbar?.includes('import')"
                  content="导入"
                  icon-name="Upload"
                  @click="handleOpenImport"
                />
                <IconButton
                  v-if="pageConfig.toolbar?.includes('export')"
                  content="导出"
                  icon-name="download"
                  @click="handleExport()"
                />
                <IconButton
                  v-if="pageConfig.toolbar?.includes('save')"
                  content="保存"
                  icon-name="Check"
                  :disabled="isEmpty(checkedIds)"
                  @click="handleSave"
                />
                <IconButton
                  v-if="pageConfig.toolbar?.includes('reset')"
                  content="重置"
                  icon-name="RefreshLeft"
                  @click="handleResetConfig"
                />
                <IconButton
                  v-if="pageConfig.toolbar?.includes('batchSync')"
                  content="批量同步"
                  icon-name="Refresh"
                  :disabled="isEmpty(checkedIds)"
                  @click="handleBatchSync"
                />
                <IconButton
                  v-if="pageConfig.toolbar?.includes('refresh')"
                  content="刷新"
                  icon-name="Refresh"
                  @click="handleRefresh"
                />
                <IconButton
                  content="筛选"
                  icon-name="search"
                  @click="handleOpenSearch"
                />
                <IconButton
                  :content="showOverview ? '收起' : '展开'"
                  :icon-name="showOverview ? 'ArrowUp' : 'ArrowDown'"
                  @click="handleToggleOverview"
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
              <el-image
                v-if="
                  column.type === 'image' &&
                  getImageUrl(getCellDisplayText(column, row))
                "
                class="common-cell-image"
                :src="getImageUrl(getCellDisplayText(column, row))"
                :preview-src-list="[
                  getImageUrl(getCellDisplayText(column, row)),
                ]"
                fit="cover"
                preview-teleported
              />
              <el-text
                v-else
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
                  :color="actionColor(action)"
                  @click="handleRowAction(action, row)"
                />
              </div>
            </template>
          </Grid>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog
      v-model="importDialogVisible"
      :title="`导入${pageConfig.title}`"
      width="520px"
      append-to-body
    >
      <div class="import-dialog-body">
        <div class="import-dialog-actions">
          <el-button type="primary" plain @click="handleDownloadImportTemplate">
            下载标准模板
          </el-button>
          <el-checkbox v-model="importUpdateSupport">
            覆盖已存在数据
          </el-checkbox>
        </div>
        <el-upload
          drag
          :auto-upload="false"
          :limit="1"
          accept=".xls,.xlsx"
          :on-change="handleImportFileChange"
          :on-remove="handleRemoveImportFile"
        >
          <div class="import-upload-text">
            <div>点击或拖拽 Excel 文件到此处</div>
            <small>仅支持 .xls、.xlsx 文件</small>
          </div>
        </el-upload>
        <div v-if="importResult" class="import-result">
          <el-alert
            :title="`导入完成：成功 ${importResult.successCount} 条，失败 ${importResult.failureCount} 条`"
            :type="importResult.failureCount ? 'warning' : 'success'"
            show-icon
            :closable="false"
          />
          <el-table
            v-if="importResult.failureList?.length"
            :data="importResult.failureList"
            border
            max-height="180"
          >
            <el-table-column prop="row" label="行号" width="80" />
            <el-table-column
              prop="name"
              :label="`${pageConfig.title}名称`"
              min-width="120"
            />
            <el-table-column prop="msg" label="错误原因" min-width="180" />
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="importLoading"
          @click="handleImportConfirm"
        >
          确认导入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.station-resource-leaf-page {
  @media (max-width: 1366px) {
    .station-overview {
      flex-wrap: wrap;
    }

    .station-chart-wrap,
    .station-map-wrap {
      flex: 1 1 100%;
      min-width: 100%;
    }

    .station-chart-wrap :deep(.park-chart-box) {
      flex-wrap: wrap;
    }
  }

  .station-overview {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    align-items: stretch;
    padding-bottom: 8px;
  }

  .station-chart-wrap {
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
  }

  .station-chart-wrap :deep(.park-chart-box) {
    display: flex;
    flex: 1 1 auto;
    flex-wrap: nowrap;
    gap: 8px;
    align-items: stretch;
    min-width: 0;
    padding: 0;
  }

  .station-map-wrap {
    display: flex;
    flex: 0 0 34%;
    min-width: 320px;
    padding: 0;
  }

  .station-map-wrap :deep(.station-map-panel) {
    width: 100%;
    height: 100%;
    min-height: 340px;
  }
}

.import-dialog-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.import-dialog-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.import-upload-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--el-text-color-regular);
  text-align: center;
}

.import-result {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.common-cell-image {
  width: 42px;
  height: 42px;
  vertical-align: middle;
  border-radius: 4px;
}
</style>
