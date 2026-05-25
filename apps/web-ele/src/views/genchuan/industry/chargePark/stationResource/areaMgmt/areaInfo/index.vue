<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import * as pageApi from '#/api/genchuan/industry/chargePark/stationResource/areaMgmt/areaInfo/index.js';
import * as stationApi from '#/api/genchuan/industry/chargePark/stationResource/stationMgmt/stationInfo/index.js';
import { getAreaTree } from '#/api/system/area';
import { getSimpleUserList } from '#/api/system/user';
import CommonDetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import IconButton from '#/genchuan-components/IconButton.vue';

import ChartDrillDrawer from '../../components/ChartDrillDrawer.vue';
import { detailFields as stationDetailFields } from '../../stationMgmt/stationInfo/table/data.js';
import { downloadImportTemplateFallback } from '../../utils/importTemplate.js';
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
const chartData = ref({});
const chartDrillDrawerRef = ref(null);
const areaTreeData = ref([]);
const userOptions = ref([]);
const importDialogVisible = ref(false);
const importFile = ref(null);
const importFileList = ref([]);
const importLoading = ref(false);
const importResult = ref(null);
const importUpdateSupport = ref(false);
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

const stationListFields = stationDetailFields.filter((field) =>
  [
    'address',
    'areaId',
    'bindTime',
    'bindUserId',
    'name',
    'operateType',
    'stationNo',
    'status',
    'type',
    'userId',
  ].includes(field.key),
);

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

function getSelectOptions(field) {
  if (field.apiSource === 'SystemUser') {
    return userOptions.value;
  }
  return normalizeOptions(field.options || []);
}

function extractPageList(result) {
  if (Array.isArray(result)) {
    return result;
  }
  return result?.list || result?.data?.list || [];
}

// 验证手机号格式
function validatePhone(phone) {
  const phoneReg = /^1[3-9]\d{9}$/;
  const telReg = /^0\d{2,3}-?\d{7,8}$/;
  return phoneReg.test(phone) || telReg.test(phone);
}

// 验证片区编号唯一性
async function validateAreaNo(areaNo, currentId) {
  if (!areaNo) return true;
  try {
    const result = await pageApi.getAreaInfoPage({
      pageNo: 1,
      pageSize: 1,
      areaNo,
    });
    const exists = result?.list?.some(
      (item) => item.areaNo === areaNo && item.id !== currentId,
    );
    return !exists;
  } catch {
    return true;
  }
}

// 加载省市区树，用于表单选择“所属行政区划”。
async function loadAreaTree() {
  try {
    const result = await getAreaTree();
    areaTreeData.value = result || [];
  } catch (error) {
    console.error('加载地区树数据失败:', error);
  }
}

function findAreaPath(id, data = areaTreeData.value, path = []) {
  for (const item of data || []) {
    const currentPath = [...path, item];
    if (item.id === id) {
      return currentPath;
    }
    const childPath = findAreaPath(id, item.children, currentPath);
    if (childPath) {
      return childPath;
    }
  }
  return null;
}

function getDistrictByAreaId(areaId) {
  const path = findAreaPath(areaId);
  return (path || [])
    .map((item) => item.name)
    .filter(Boolean)
    .join('');
}

function findAreaIdByDistrict(district, data = areaTreeData.value, path = []) {
  if (!district) return null;

  for (const item of data || []) {
    const currentPath = [...path, item];
    const fullName = currentPath
      .map((node) => node.name)
      .filter(Boolean)
      .join('');
    if (district === fullName || district === item.name) {
      return item.id;
    }
    const childId = findAreaIdByDistrict(district, item.children, currentPath);
    if (childId) {
      return childId;
    }
  }
  return null;
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
  // 如果字段配置中有placeholder，优先使用
  if (field.placeholder) {
    return field.placeholder;
  }
  const selectLikeTypes = ['areaSelect', 'date', 'select'];
  return (
    (selectLikeTypes.includes(field.type) ? '请选择' : '请输入') + field.label
  );
}

function createSchema(fields, isSearch = false) {
  return fields.map((field) => {
    let component = 'Input';
    switch (field.type) {
      case 'areaSelect': {
        component = 'ApiTreeSelect';

        break;
      }
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
      // No default
    }

    const componentProps = {
      placeholder: getPlaceholder(field),
    };

    if (field.type === 'select') {
      Object.assign(componentProps, {
        allowClear: true,
        clearable: true,
        filterOption: true,
        options: getSelectOptions(field),
        showSearch: true,
      });
    }

    if (field.type === 'areaSelect') {
      Object.assign(componentProps, {
        api: getAreaTree,
        childrenField: 'children',
        clearable: true,
        labelField: 'name',
        valueField: 'id',
      });
    }

    if (field.type === 'number') {
      Object.assign(componentProps, {
        controls: false,
        min: 0,
        precision: 0,
      });
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
  (chartData.value?.areaMapList || []).map((item) => ({
    ...item,
    lng: item.lng === undefined ? item.lon : item.lng,
    coordinate:
      item.coordinate ||
      [item.lon === undefined ? item.lng : item.lon, item.lat]
        .filter(Boolean)
        .join(','),
    locationName: item.locationName || item.name,
    statusName: item.statusName || item.status || '正常',
  })),
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

const dialogFieldCatalog = {
  stationCount: [
    { key: 'areaNo', label: '片区编号', section: '当前记录' },
    { key: 'name', label: '片区名称', section: '当前记录' },
    { key: 'stationCount', label: '覆盖场站数', section: '统计指标' },
    { key: 'status', label: '状态', section: '统计指标' },
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
  const dialogFields = [
    {
      key: fieldKey,
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
    content: '筛选',
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

  // 必填字段校验
  const requiredField = formFields.find(
    (field) => field.required && !values[field.field],
  );
  if (requiredField) {
    ElMessage.warning(`请填写${requiredField.label}`);
    return;
  }

  // 片区编号唯一性校验
  if (values.areaNo) {
    const isUnique = await validateAreaNo(values.areaNo, values.id);
    if (!isUnique) {
      ElMessage.warning('片区编号已存在，请使用其他编号');
      return;
    }
  }

  // 联系电话格式校验
  if (values.phone && !validatePhone(values.phone)) {
    ElMessage.warning('请输入正确的联系电话格式（手机号或座机号）');
    return;
  }

  if (values.districtAreaId) {
    values.district = getDistrictByAreaId(values.districtAreaId);
    delete values.districtAreaId;
  }
  if (!values.district) {
    ElMessage.warning('请选择所属行政区划');
    return;
  }
  delete values.bindUserId;
  delete values.bindTime;

  try {
    if (formMode.value === 'edit' && values.id) {
      await pageApi[`update${apiName}`](values);
      ElMessage.success('编辑成功');
    } else {
      await pageApi[`create${apiName}`](values);
      ElMessage.success('新增成功');
    }

    formDrawerApi.close();
    handleRefresh();
  } catch (error) {
    ElMessage.error(error.message || '操作失败');
  }
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

    await loadAreaTree();
    formData.value = formDrawerApi.getData() || null;
    if (formMode.value === 'edit' && formData.value) {
      formData.value.districtAreaId = findAreaIdByDistrict(
        formData.value.district,
      );
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
      };

      // 添加formatter支持
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
    await Promise.all([
      Promise.resolve(gridApi.query(nextQuery)),
      loadChart(nextQuery),
    ]);
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
  const rawQuery = queryFormApi.form.values || {};

  appliedQuery.value = sanitizeParams(rawQuery);
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
  detailObj.value = {
    ...row,
    ...detail,
  };
  if (!isEmpty(detailObj.value.userId)) {
    detailObj.value.userId = getOptionLabel('userId', detailObj.value.userId);
  }
  if (!isEmpty(detailObj.value.bindUserId)) {
    detailObj.value.bindUserId = getOptionLabel(
      'bindUserId',
      detailObj.value.bindUserId,
    );
  }
  await nextTick();
  detailDrawerRef.value?.open();
}

async function handleStatusChange(action, row) {
  const label =
    action === 'enable' ? (row.status === '已禁用' ? '启用' : '生效') : '禁用';
  const actionApi = pageApi[action + apiName];

  if (typeof actionApi !== 'function') {
    ElMessage.error(`未配置${label}接口：${action}${apiName}`);
    return;
  }

  await ElMessageBox.confirm(
    `确认${label}当前${pageConfig.title}吗？`,
    '操作提示',
    {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
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
    id: row.id,
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

function resetImportState() {
  importFile.value = null;
  importFileList.value = [];
  importResult.value = null;
  importUpdateSupport.value = false;
}

function handleOpenImport() {
  resetImportState();
  importDialogVisible.value = true;
}

function handleImportFileChange(uploadFile) {
  importFile.value = uploadFile?.raw || uploadFile;
  importFileList.value = uploadFile ? [uploadFile] : [];
  importResult.value = null;
}

function handleRemoveImportFile() {
  importFile.value = null;
  importFileList.value = [];
}

function handleImportFileExceed(files) {
  const file = files?.[0];
  if (!file) return;
  const rawFile = file.raw || file;
  importFile.value = rawFile;
  importFileList.value = [
    {
      name: rawFile.name || file.name || '导入文件',
      raw: rawFile,
      status: 'ready',
      uid: Date.now(),
    },
  ];
  importResult.value = null;
}

function normalizeImportResult(result) {
  const data = result?.data || result || {};
  const fallbackMessage =
    data.msg ||
    data.message ||
    data.errorMsg ||
    data.error ||
    result?.msg ||
    result?.message ||
    result?.errorMsg ||
    result?.error ||
    '';
  const rawFailureData =
    data.failureList ||
    data.failures ||
    data.errorList ||
    data.errors ||
    data.failMsgs ||
    (fallbackMessage ? [fallbackMessage] : []);
  const rawFailureList = Array.isArray(rawFailureData)
    ? rawFailureData
    : Object.values(rawFailureData || {});
  const failureList = rawFailureList.map((item, index) => {
    if (typeof item === 'string') {
      return { msg: item, row: index + 1 };
    }
    return {
      ...item,
      msg:
        item.msg ||
        item.message ||
        item.errorMsg ||
        item.reason ||
        item.failReason ||
        item.error ||
        fallbackMessage ||
        '导入失败',
      name:
        item.name ||
        item.stationName ||
        item.areaName ||
        item.ruleName ||
        item.spaceNo ||
        item.rowName ||
        '',
      row: item.row || item.rowNum || item.line || item.index || index + 1,
    };
  });
  return {
    failureCount:
      data.failureCount ??
      data.failCount ??
      data.errorCount ??
      failureList.length ??
      0,
    failureList,
    successCount: data.successCount ?? data.success ?? data.successNum ?? 0,
  };
}

async function handleDownloadImportTemplate() {
  const templateApi = pageApi[`get${apiName}ImportTemplate`];
  const fileName = pageConfig.importTemplateName || '片区信息导入模板.xlsx';
  if (typeof templateApi !== 'function') {
    downloadImportTemplateFallback({ fields: formFields, fileName });
    return;
  }
  try {
    const blob = await templateApi();
    downloadFileFromBlobPart({
      fileName,
      source: blob,
    });
  } catch {
    downloadImportTemplateFallback({ fields: formFields, fileName });
  }
}

async function handleImportConfirm() {
  if (!importFile.value) {
    ElMessage.warning('请先选择需要导入的 Excel 文件');
    return;
  }
  importLoading.value = true;
  try {
    const result = await pageApi[`import${apiName}`](
      importFile.value,
      importUpdateSupport.value,
    );
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
  return (
    pageConfig.rowActionMap?.[row.status] ||
    pageConfig.rowActionMap?.default || ['detail']
  );
}

function actionLabel(action, row) {
  if (action === 'enable') {
    return row.status === '已禁用' ? '启用' : '生效';
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
  const options = config ? getSelectOptions(config) : [];
  const option = options.find(
    (item) => item.value === value || String(item.value) === String(value),
  );
  return option?.label || value;
}

function getTagDisplayText(field, value) {
  return getOptionLabel(field, value);
}

function getCellDisplayText(column, row) {
  let value = row?.[column.field];
  if (column.field === 'userId' || column.field === 'bindUserId') {
    value =
      row?.[`${column.field}Name`] ||
      row?.[column.field.replace(/Id$/, 'Name')] ||
      getOptionLabel(column.field, value);
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

async function removeFilterTag(field) {
  const nextQuery = { ...appliedQuery.value };
  delete nextQuery[field];
  const sanitizedQuery = sanitizeParams(nextQuery);
  appliedQuery.value = sanitizedQuery;
  clearTableFilter(field);
  handleRefresh(sanitizedQuery);
  await syncQueryForm(sanitizedQuery);
}

async function openDrillDrawer(title, data, fields) {
  drillDrawerTitle.value = title;
  drillDetailObj.value = data;
  drillDetailFields.value = fields;
  await nextTick();
  drillDrawerRef.value?.open();
}

async function handleOpenStationList(row = {}) {
  const areaId = row?.id || row?.areaId;
  let list = [];
  if (!isEmpty(areaId)) {
    const result = await stationApi.getStationInfoPage({
      areaId,
      pageNo: 1,
      pageSize: 20,
    });
    list = extractPageList(result);
  }
  return openDrillDrawer(
    row?.name ? `${row.name}下属场站列表` : '片区下属场站列表',
    list.length > 0 ? list : [{ ...row, areaId, stationNo: '暂无场站明细' }],
    list.length > 0
      ? stationListFields
      : [
          { key: 'areaNo', label: '片区编号', section: '片区信息' },
          { key: 'name', label: '片区名称', section: '片区信息' },
          { key: 'stationCount', label: '覆盖场站数', section: '统计信息' },
          { key: 'stationNo', label: '明细状态', section: '统计信息' },
        ],
  );
}

async function handleOpenAllStationList() {
  const result = await stationApi.getStationInfoPage({
    pageNo: 1,
    pageSize: 20,
  });
  const list = extractPageList(result);
  return openDrillDrawer(
    '覆盖场站列表',
    list.length > 0 ? list : [{ stationNo: '暂无场站明细' }],
    list.length > 0
      ? stationListFields
      : [{ key: 'stationNo', label: '明细状态', section: '统计信息' }],
  );
}

async function handleCardClick(item) {
  if (item.status === 'allAreas') {
    appliedQuery.value = {};
    await queryFormApi.resetForm();
    handleRefresh();
    return;
  }
  if (item.status === 'stationList') {
    return handleOpenAllStationList();
  }
  if (!item.status) return;
  applySearchPatch({ status: item.status });
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
  if (drillType === 'stationList') {
    return handleOpenStationList(row);
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

async function handleMapMarkerClick(item) {
  const id = item?.id || item?.areaId;
  if (isEmpty(id)) return;
  return handleOpenDetail({ ...item, id });
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

async function loadUserOptions() {
  try {
    const result = await getSimpleUserList();
    userOptions.value = extractPageList(result).map((item) => ({
      label: item.nickname
        ? `${item.nickname}${item.username ? ` (${item.username})` : ''}`
        : item.username || item.name || item.id || item.userId,
      value: item.id ?? item.userId,
    }));
    await refreshSelectSchemas();
  } catch (error) {
    console.error('加载用户选项失败:', error);
  }
}

onMounted(() => {
  loadChart();
  loadUserOptions();
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
        <gateMap :data="mapData" @marker-click="handleMapMarkerClick" />
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
                  style="height: 32px; margin: 4px 8px 4px 0; line-height: 32px"
                  @close="removeFilterTag(key)"
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
                  :content="actionLabel(action, row)"
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
      @closed="resetImportState"
      title="导入片区信息"
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
          v-model:file-list="importFileList"
          drag
          :auto-upload="false"
          :limit="1"
          accept=".xls,.xlsx"
          :on-change="handleImportFileChange"
          :on-exceed="handleImportFileExceed"
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
            <el-table-column prop="name" label="片区名称" min-width="120" />
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
</style>
