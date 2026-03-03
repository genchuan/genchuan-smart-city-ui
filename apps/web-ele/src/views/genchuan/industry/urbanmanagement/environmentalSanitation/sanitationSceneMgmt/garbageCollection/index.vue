<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import ParkDetailDrawer from './detail.vue';
import AbnormalDetailDrawer from './abnormalDetail.vue';
import Chart2 from './chart2.vue';
import {
  createGarbageCollection,
  deleteGarbageCollection,
  deleteGarbageCollectionBatch,
  exportGarbageCollectionExcel,
  getGarbageCollection,
  getGarbageCollectionPage,
  updateGarbageCollection,
  getGarbageAbnormalPage,
  getGarbageCollectionStatistics,
  deleteGarbageAbnormal,
  exportGarbageAbnormalExcel,
  updateGarbageAbnormal,
  createGarbageAbnormal,
} from '#/api/genchuan/industry/urbanmanagement/environmentalSanitation/sanitationSceneMgmt/garbageCollection/data.js';
import {
  getColumnsByStatus,
  textObj,
  useFormSchema,
  getGarbageTypeOptions,
  getPointOptions,
  getPlanStatusOptions,
  getCollectionFrequencyOptions,
  getUserOptions,
  getVehicleOptions,
  getTimePeriodOptions,
  getAreaOptions,
  useAbnormalFormSchema,
  getAbnormalTypeOptions,
  getHandleStatusOptions,
  getReviewStatusOptions,
} from '#/api/genchuan/industry/urbanmanagement/environmentalSanitation/sanitationSceneMgmt/garbageCollection/form.js';

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

const getTitle = computed(() => (formData.value?.id ? textObj.editText : textObj.addText));

// ---------- 搜索抽屉 ----------
const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => searchDrawerApi.close()
});

// 收运计划搜索字段（过滤出 searchFilter 为 true 的字段）
const planSearchSchema = useFormSchema().filter(field => field.searchFilter);
// 异常记录搜索字段（从异常表单中过滤出 searchFilter 为 true 的字段）
const abnormalSearchSchema = useAbnormalFormSchema().filter(field => field.searchFilter);

// 收运计划搜索表单
const [SearchFormPlan, planSearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async () => {
    dataObj.searchParams = await planSearchFormApi.getValues();
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: planSearchSchema,
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// 异常记录搜索表单
const [SearchFormAbnormal, abnormalSearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async () => {
    const rawValues = await abnormalSearchFormApi.getValues();
    const converted = {
      ...rawValues,
      reportBy: rawValues.reportUserId,
    };
    delete converted.reportUserId;
    dataObj.searchParams = converted;
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: abnormalSearchSchema,
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// ---------- 新增/编辑抽屉（收运计划） ----------
const formData = ref();

const [EditForm, editFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [EditDrawer, editDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel: () => editDrawerApi.close(),
  async onConfirm() {
    const formValues = await editFormApi.getValues();
    const isAdd = !formData.value?.id;

    const submitData = {
      ...formValues,
      pointIds: Array.isArray(formValues.pointIds) ? JSON.stringify(formValues.pointIds) : undefined,
      staffIds: Array.isArray(formValues.staffIds) ? JSON.stringify(formValues.staffIds) : undefined,
    };

    try {
      if (isAdd) {
        await createGarbageCollection(submitData);
      } else {
        await updateGarbageCollection({ ...submitData, id: formData.value.id });
      }
      ElMessage.success(isAdd ? '新增成功' : '编辑成功');
      handleRefresh();
      editDrawerApi.close();
    } catch (error) {
      console.error('操作失败', error);
      ElMessage.error('操作失败，请重试');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = editDrawerApi.getData();
      if (formData.value?.id) {
        try {
          const res = await getGarbageCollection(formData.value.id);
          const detail = res.data || res;
          console.log('获取到的详情数据：', detail);

          const formValues = {
            ...detail,
            totalVolume: detail.totalCollectedQuantity ?? detail.totalVolume ?? formData.value.totalVolume,
            abnormalResult: detail.abnormalDisposalResult ?? detail.abnormalResult ?? formData.value.abnormalResult,
            createBy: detail.createBy ?? formData.value?.createBy,
            pointIds: detail.pointIds ? JSON.parse(detail.pointIds) : [],
            staffIds: detail.staffIds ? JSON.parse(detail.staffIds) : [],
          };
          console.log('设置到表单的值：', formValues);
          await editFormApi.setValues(formValues);
        } catch (error) {
          console.warn('获取详情失败', error);
        }
      } else {
        editFormApi.resetForm();
      }
    }
  }
});

// ---------- 异常编辑抽屉（支持新增和编辑） ----------
const abnormalFormData = ref();

const [AbnormalEditForm, abnormalEditFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
  layout: 'horizontal',
  schema: useAbnormalFormSchema(),
  showDefaultActions: false,
});

const [AbnormalEditDrawer, abnormalEditDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel: () => abnormalEditDrawerApi.close(),
  async onConfirm() {
    const formValues = await abnormalEditFormApi.getValues();
    const submitData = {
      ...formValues,
      planId: formValues.planNo,
      reportBy: formValues.reportUserId,
    };
    delete submitData.planNo;
    delete submitData.reportUserId;

    try {
      if (!abnormalFormData.value?.id) {
        await createGarbageAbnormal(submitData);
        ElMessage.success('新增成功');
      } else {
        await updateGarbageAbnormal({ ...submitData, id: abnormalFormData.value.id });
        ElMessage.success('编辑成功');
      }
      handleRefresh();
      abnormalEditDrawerApi.close();
    } catch (error) {
      console.error('操作失败', error);
      ElMessage.error('操作失败，请重试');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const rowData = abnormalEditDrawerApi.getData();
      abnormalFormData.value = rowData;

      abnormalEditFormApi.updateSchema([
        { fieldName: 'abnormalTypeId', componentProps: { options: Array.from(optionMaps.abnormalTypeMap, ([value, label]) => ({ value, label })) } },
        { fieldName: 'handleStatus', componentProps: { options: Array.from(optionMaps.handleStatusMap, ([value, label]) => ({ value, label })) } },
        { fieldName: 'reviewStatus', componentProps: { options: Array.from(optionMaps.reviewStatusMap, ([value, label]) => ({ value, label })) } },
        { fieldName: 'areaCode', componentProps: { options: Array.from(optionMaps.areaMap, ([value, label]) => ({ value, label })) } },
        { fieldName: 'reportUserId', componentProps: { options: Array.from(optionMaps.userMap, ([value, label]) => ({ value, label })) } },
        { fieldName: 'handlerId', componentProps: { options: Array.from(optionMaps.userMap, ([value, label]) => ({ value, label })) } },
        { fieldName: 'reviewBy', componentProps: { options: Array.from(optionMaps.userMap, ([value, label]) => ({ value, label })) } },
        { fieldName: 'planNo', componentProps: { options: planNoOptions.value } },
      ]);

      if (rowData?.id) {
        const formValues = {
          ...rowData,
          planNo: rowData.planId || rowData.planNo,
          reportUserId: rowData.reportBy,
        };
        await abnormalEditFormApi.setValues(formValues);
      } else {
        abnormalEditFormApi.resetForm();
        const defaultValues = { priority: '中', ...rowData };
        await abnormalEditFormApi.setValues(defaultValues);
      }
    }
  }
});

// 计划单选项（用于异常表单的关联计划单字段）
const planNoOptions = ref([]);

function handleRefresh() {
  gridApi.query();
  loadStatistics();
}

async function handleExport() {
  try {
    const params = dataObj.searchParams || {};
    const areaCode = params.areaCode;
    let areaName = '全部区域';

    if (areaCode) {
      areaName = optionMaps.areaMap.get(areaCode);
      if (!areaName) {
        areaName = areaCode;
      }
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    let fileName = '';
    let response;

    const isAbnormal = activeName.value === '异常待处置' || activeName.value === '处置待复核';

    if (isAbnormal) {
      fileName = `整改与复核记录.xlsx`;
      response = await exportGarbageAbnormalExcel(params);
    } else {
      fileName = `垃圾收运任务_${areaName}_${dateStr}.xlsx`;
      response = await exportGarbageCollectionExcel(params);
    }

    const blob = response.data || response;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.log('【导出流程】进入 catch 块，错误对象:', error);
    const blob = error instanceof Blob ? error : (error.response?.data instanceof Blob ? error.response.data : null);
    if (blob) {
      console.log('【错误文件导出】从错误中提取到 Blob，大小:', blob.size, '类型:', blob.type);
      const fileName = textObj.excelAllName || 'export.xls';
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      console.log('【错误文件导出】下载完成');
      return;
    }

    ElMessage.error('导出失败：' + (error.message || '未知错误'));
  }
}

function handleCreate() {
  editDrawerApi.setData({ title: textObj.addText }).open();
}

function handleCreateAbnormal() {
  const defaultData = {
    priority: '中',
    reportTime: Date.now(),
  };
  if (activeName.value === '异常待处置') {
    defaultData.handleStatus = '待处置';
  } else if (activeName.value === '处置待复核') {
    defaultData.handleStatus = '待复核'; // 注意：如果后端合并，此处设置 handleStatus 即可，但表单中 reviewStatus 字段可能也需要处理，视实际情况而定
  }
  abnormalEditDrawerApi.setData(defaultData).open();
}

function handleEdit(row) {
  const isAbnormal = activeName.value === '异常待处置' || activeName.value === '处置待复核';
  if (isAbnormal) {
    abnormalEditDrawerApi.setData(row._raw || row).open();
  } else {
    editDrawerApi.setData({ title: textObj.editText, ...row }).open();
  }
}

async function handleDelete(row) {
  const isAbnormal = activeName.value === '异常待处置' || activeName.value === '处置待复核';
  const deleteApi = isAbnormal ? deleteGarbageAbnormal : deleteGarbageCollection;
  const nameField = isAbnormal ? (row.abnormalId || row.id) : row.planNo;

  const loading = ElLoading.service({ text: $t('ui.actionMessage.deleting', [nameField]) });
  try {
    await deleteApi(row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [nameField]));
    handleRefresh();
  } catch (error) {
    console.error('删除失败', error);
    ElMessage.error('删除失败：' + (error.message || '未知错误'));
  } finally {
    loading.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loading = ElLoading.service({ text: $t('ui.actionMessage.deletingBatch') });
  try {
    const isAbnormal = activeName.value === '异常待处置' || activeName.value === '处置待复核';

    if (!isAbnormal) {
      await deleteGarbageCollectionBatch(checkedIds.value);
    } else {
      const deleteApi = deleteGarbageAbnormal;
      for (const id of checkedIds.value) {
        await deleteApi(id);
      }
    }

    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } catch (error) {
    console.warn('批量删除失败', error);
    ElMessage.error('批量删除失败：' + (error.message || '未知错误'));
    checkedIds.value = [];
    handleRefresh();
  } finally {
    loading.close();
  }
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  list: [],
  searchParams: {},
});

const counts = ref({
  total: 0,
  planStatusCounts: {
    待执行: 0,
    执行中: 0,
    已完成: 0,
    异常: 0,
    待复核: 0
  }
});

const activeName = ref('全部');
const tabsData = ref([
  { label: '全部' },
  { label: '计划待执行' },
  { label: '作业进行中' },
  { label: '已完成' },
  { label: '异常待处置' },
  { label: '处置待复核' },
]);

const createLabel = (item) => {
  if (item.label === '全部') {
    return `全部 (${counts.value.total})`;
  }
  const keyMap = {
    '计划待执行': '待执行',
    '作业进行中': '执行中',
    '已完成': '已完成',
    '异常待处置': '异常',
    '处置待复核': '待复核'
  };
  const countKey = keyMap[item.label];
  return `${item.label} (${counts.value.planStatusCounts[countKey] || 0})`;
};

const gridColumns = ref(getColumnsByStatus(activeName.value));

const formatDateTime = (ts) => {
  if (!ts) return '';
  const date = typeof ts === 'number' ? new Date(ts) : new Date(ts);
  if (isNaN(date.getTime())) return ts;
  return date.toLocaleString();
};

const optionMaps = reactive({
  garbageTypeMap: new Map(),
  pointMap: new Map(),
  planStatusMap: new Map(),
  planStatusNameToId: new Map(),
  frequencyMap: new Map(),
  userMap: new Map(),
  vehicleMap: new Map(),
  timePeriodMap: new Map(),
  areaMap: new Map(),
  abnormalTypeMap: new Map(),
  handleStatusMap: new Map(),
  reviewStatusMap: new Map(),
  handleStatusNameToId: new Map(),
  reviewStatusNameToId: new Map(),
});

const buildMap = (options) => {
  const map = new Map();
  options.forEach(item => map.set(item.value, item.label));
  return map;
};

const buildNameToIdMap = (options) => {
  const map = new Map();
  options.forEach(item => map.set(item.label, item.value));
  return map;
};

function convertItem(item) {
  let pointIds = [];
  try {
    pointIds = item.pointIds ? JSON.parse(item.pointIds) : [];
  } catch {
    pointIds = Array.isArray(item.pointIds) ? item.pointIds : [];
  }
  const pointsName = pointIds.map(id => optionMaps.pointMap.get(id) || id).join(', ');

  let staffIds = [];
  try {
    staffIds = item.staffIds ? JSON.parse(item.staffIds) : [];
  } catch {
    staffIds = Array.isArray(item.staffIds) ? item.staffIds : [];
  }
  const usersName = staffIds.map(id => optionMaps.userMap.get(id) || id).join(', ');

  return {
    ...item,
    vehicleNumber: item.vehicleLicensePlate || optionMaps.vehicleMap.get(item.vehicleId) || item.vehicleId,
    garbageTypeName: optionMaps.garbageTypeMap.get(item.garbageTypeId) || item.garbageTypeId,
    planStatusName: optionMaps.planStatusMap.get(item.planStatusId) || item.planStatusId,
    createByName: optionMaps.userMap.get(item.createBy) || item.createBy,
    createBy: item.createBy,
    frequency: item.frequency,
    timePeriod: item.timePeriod,
    areaCode: optionMaps.areaMap.get(item.areaCode) || item.areaCode,
    pointsName,
    usersName,
    createTime: formatDateTime(item.createTime),
    updateTime: formatDateTime(item.updateTime),
    lastReportTime: formatDateTime(item.lastReportTime),
    completeTime: formatDateTime(item.completeTime),
  };
}

function convertAbnormalItem(item) {
  // 根据后端要求，复核状态也存放在 handleStatus 字段中，因此将 handleStatus 同时赋给两个字段
  const handleStatusValue = optionMaps.handleStatusMap.get(item.handleStatus) || item.handleStatus || '-';
  return {
    id: item.id,
    abnormalId: item.abnormalId,
    planNo: item.planId || '-',
    abnormalType: optionMaps.abnormalTypeMap.get(item.abnormalTypeId) || item.abnormalTypeName || '-',
    areaCode: optionMaps.areaMap.get(item.areaCode) || item.areaCode || '-',
    usersName: optionMaps.userMap.get(item.reportBy) || '-',
    createTime: formatDateTime(item.reportTime),
    reportTime: formatDateTime(item.reportTime),
    priority: item.priority || '-',
    handler: optionMaps.userMap.get(item.handlerId) || item.handlerId || '-',
    // 处置状态和复核状态都从同一个后端字段 handleStatus 获取
    handleStatus: handleStatusValue,
    reviewStatus: optionMaps.reviewStatusMap.get(item.handleStatus) || handleStatusValue, // 优先使用映射，若无则用原始值
    isTimeout: item.isTimeout === '是',
    reviewBy: optionMaps.userMap.get(item.reviewBy) || item.reviewBy || '-',
    updateTime: formatDateTime(item.updateTime),
    reviewTime: formatDateTime(item.reviewTime),
    _raw: item,
  };
}

const getTableData = async ({page}) => {
  try {
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      ...dataObj.searchParams,
    };

    if (activeName.value !== '全部') {
      if (activeName.value === '异常待处置' || activeName.value === '处置待复核') {
        if (activeName.value === '异常待处置') {
          params.handleStatus = '待处置';
        } else if (activeName.value === '处置待复核') {
          params.handleStatus = '待复核'; // 使用 handleStatus 参数查询复核状态
        }
      } else {
        const statusMap = {
          '计划待执行': '待执行',
          '作业进行中': '执行中',
          '已完成': '已完成'
        };
        const statusName = statusMap[activeName.value];
        if (statusName && optionMaps.planStatusNameToId) {
          const statusId = optionMaps.planStatusNameToId.get(statusName);
          if (statusId) {
            params.planStatusId = statusId;
          }
        }
      }
    }

    let res;
    const isAbnormal = activeName.value === '异常待处置' || activeName.value === '处置待复核';
    if (isAbnormal) {
      res = await getGarbageAbnormalPage(params);
    } else {
      res = await getGarbageCollectionPage(params);
    }

    if (res && res.code === 0 && res.data && Array.isArray(res.data.list)) {
      let list;
      if (isAbnormal) {
        list = res.data.list.map(convertAbnormalItem);
      } else {
        list = res.data.list.map(convertItem);
      }
      list = list.filter(item => !item.deleted);
      dataObj.total = res.data.total || 0;
      dataObj.list = list;
      return dataObj;
    } else if (res && typeof res === 'object' && Array.isArray(res.list)) {
      let list;
      if (isAbnormal) {
        list = res.list.map(convertAbnormalItem);
      } else {
        list = res.list.map(convertItem);
      }
      list = list.filter(item => !item.deleted);
      dataObj.total = res.total || 0;
      dataObj.list = list;
      return dataObj;
    } else {
      throw new Error('接口返回格式异常');
    }
  } catch (error) {
    console.error('获取数据失败', error);
    ElMessage.error('数据加载失败，请重试');
    dataObj.total = 0;
    dataObj.list = [];
    return dataObj;
  }
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: {ajax: {query: getTableData}},
    rowConfig: {keyField: 'id', isHover: true},
    pagerConfig: dataObj,
    toolbarConfig: {refresh: true, search: true},
    showOverflow: true,
  },
  gridEvents: {checkboxAll: handleRowCheckboxChange, checkboxChange: handleRowCheckboxChange},
  showSearchForm: false,
});

watch(activeName, (newVal) => {
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) {
    gridApi.xGrid.refreshColumn();
  } else {
    gridApi.setGridOptions?.({ columns: gridColumns.value });
  }
  dataObj.searchParams = {};
  searchDrawerApi.close();

  if (parkDetailDrawerRef.value) {
    parkDetailDrawerRef.value.close();
  }
  if (abnormalDetailDrawerRef.value) {
    abnormalDetailDrawerRef.value.close();
  }

  handleRefresh();
});

const handleClick = () => gridApi.query();

const isAbnormalSearch = ref(false);

const handleSerachShow = () => {
  isAbnormalSearch.value = activeName.value === '异常待处置' || activeName.value === '处置待复核';
  if (isAbnormalSearch.value) {
    abnormalSearchFormApi.resetForm();
  } else {
    planSearchFormApi.resetForm();
  }
  searchDrawerApi.open();
};

const handleFullShow = () => screenfull.toggle();

const parkDetailDrawerRef = ref(null);
const abnormalDetailDrawerRef = ref(null);

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  if (activeName.value === '异常待处置' || activeName.value === '处置待复核') {
    abnormalDetailDrawerRef.value.open();
  } else {
    parkDetailDrawerRef.value.open();
  }
};

const arrowChange = () => emit('arrow-change');

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

async function loadStatistics() {
  try {
    const res = await getGarbageCollectionStatistics();
    if (res && res.total !== undefined && res.planStatusCounts) {
      counts.value = res;
    } else {
      console.warn('统计接口返回异常', res);
    }
  } catch (error) {
    console.error('加载统计失败', error);
    ElMessage.error('加载统计信息失败');
  }
}

const loadOptions = async () => {
  try {
    const [
      garbageTypeRes,
      pointRes,
      planStatusRes,
      frequencyRes,
      userRes,
      vehicleRes,
      timePeriodRes,
      areaRes,
      abnormalTypeRes,
      handleStatusRes,
      reviewStatusRes,
    ] = await Promise.all([
      getGarbageTypeOptions(),
      getPointOptions(),
      getPlanStatusOptions(),
      getCollectionFrequencyOptions(),
      getUserOptions(),
      getVehicleOptions(),
      getTimePeriodOptions(),
      getAreaOptions(),
      getAbnormalTypeOptions(),
      getHandleStatusOptions(),
      getReviewStatusOptions(),
    ]);

    const extractData = (res) => {
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      console.warn('返回数据格式异常', res);
      return [];
    };

    const garbageTypeOptions = extractData(garbageTypeRes);
    const pointOptions = extractData(pointRes);
    const planStatusOptions = extractData(planStatusRes);
    const userOptions = extractData(userRes);
    const vehicleOptions = extractData(vehicleRes);
    const areaOptions = extractData(areaRes);

    const frequencyOptions = extractData(frequencyRes).map(item => ({
      label: item.label,
      value: item.label
    }));
    const timePeriodOptions = extractData(timePeriodRes).map(item => ({
      label: item.label,
      value: item.label
    }));

    const abnormalTypeOptions = extractData(abnormalTypeRes);
    const handleStatusOptions = extractData(handleStatusRes).map(item => ({
      label: item.label,
      value: item.label
    }));
    const reviewStatusOptions = extractData(reviewStatusRes).map(item => ({
      label: item.label,
      value: item.label
    }));

    optionMaps.garbageTypeMap = buildMap(garbageTypeOptions);
    optionMaps.pointMap = buildMap(pointOptions);
    optionMaps.planStatusMap = buildMap(planStatusOptions);
    optionMaps.userMap = buildMap(userOptions);
    optionMaps.vehicleMap = buildMap(vehicleOptions);
    optionMaps.areaMap = buildMap(areaOptions);
    optionMaps.frequencyMap = buildMap(frequencyOptions);
    optionMaps.timePeriodMap = buildMap(timePeriodOptions);
    optionMaps.abnormalTypeMap = buildMap(abnormalTypeOptions);
    optionMaps.handleStatusMap = buildMap(handleStatusOptions);
    optionMaps.reviewStatusMap = buildMap(reviewStatusOptions);

    optionMaps.planStatusNameToId = buildNameToIdMap(planStatusOptions);
    optionMaps.handleStatusNameToId = buildNameToIdMap(handleStatusOptions);
    optionMaps.reviewStatusNameToId = buildNameToIdMap(reviewStatusOptions);

    console.log('映射已构建', optionMaps);

    try {
      const planRes = await getGarbageCollectionPage({pageSize: 100});
      const planList = planRes.data?.list || planRes.list || [];
      planNoOptions.value = planList.map(item => ({label: item.planNo, value: item.planNo}));
    } catch (err) {
      console.warn('加载计划单选项失败', err);
      planNoOptions.value = [];
    }

    editFormApi.updateSchema([
      {fieldName: 'garbageTypeId', componentProps: {options: garbageTypeOptions}},
      {fieldName: 'pointIds', componentProps: {options: pointOptions}},
      {fieldName: 'planStatusId', componentProps: {options: planStatusOptions}},
      {fieldName: 'frequency', componentProps: {options: frequencyOptions}},
      {fieldName: 'staffIds', componentProps: {options: userOptions}},
      {fieldName: 'vehicleId', componentProps: {options: vehicleOptions}},
      {fieldName: 'timePeriod', componentProps: {options: timePeriodOptions}},
      {fieldName: 'areaCode', componentProps: {options: areaOptions}},
      {fieldName: 'createBy', componentProps: {options: userOptions}},
    ]);

    planSearchFormApi.updateSchema([
      {fieldName: 'garbageTypeId', componentProps: {options: garbageTypeOptions}},
      {fieldName: 'areaCode', componentProps: {options: areaOptions}},
      {fieldName: 'frequency', componentProps: {options: frequencyOptions}},
      {fieldName: 'vehicleId', componentProps: {options: vehicleOptions}},
      {fieldName: 'planStatusId', componentProps: {options: planStatusOptions}},
    ]);

    abnormalSearchFormApi.updateSchema([
      {fieldName: 'abnormalTypeId', componentProps: {options: abnormalTypeOptions}},
      {fieldName: 'areaCode', componentProps: {options: areaOptions}},
      {fieldName: 'reportUserId', componentProps: {options: userOptions}},
      {fieldName: 'handleStatus', componentProps: {options: handleStatusOptions}},
      {fieldName: 'reviewStatus', componentProps: {options: reviewStatusOptions}},
      {fieldName: 'priority', componentProps: {options: [{ label: '高', value: '高' }, { label: '中', value: '中' }, { label: '低', value: '低' }]}},
    ]);

  } catch (error) {
    console.error('加载选项数据失败', error);
    ElMessage.error('加载选项数据失败，请刷新重试');
  } finally {
    handleRefresh();
  }
};

onMounted(() => {
  loadOptions();
  loadStatistics();
});
</script>

<template>
  <div class="park-lot-table-new">
    <EditDrawer :title="getTitle">
      <EditForm/>
    </EditDrawer>

    <AbnormalEditDrawer title="编辑异常">
      <AbnormalEditForm/>
    </AbnormalEditDrawer>

    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      title="收运计划详情"
    />
    <AbnormalDetailDrawer
      ref="abnormalDetailDrawerRef"
      :detail-obj="dataObj.detailObj._raw || dataObj.detailObj"
      title="异常详情"
    />

    <SearchDrawer title="搜索">
      <SearchFormPlan
        v-if="!isAbnormalSearch"
        class="query-form"
      />
      <SearchFormAbnormal
        v-else
        class="query-form"
      />
    </SearchDrawer>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs" v-if="props.secondShow">
          <el-tabs v-model="activeName" @tab-change="handleClick">
            <el-tab-pane
              v-for="item in tabsData"
              :key="item.label"
              :label="createLabel(item)"
              :name="item.label"
            />
          </el-tabs>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            v-if="activeName !== '异常待处置' && activeName !== '处置待复核'"
            content="新增"
            icon-name="Plus"
            @click="handleCreate"
          />
          <IconButton
            v-if="activeName === '异常待处置' || activeName === '处置待复核'"
            content="新增异常"
            icon-name="Plus"
            @click="handleCreateAbnormal"
          />
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow"/>
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow"/>
          <IconButton
            :content="showChart ? '隐藏图表' : '显示图表'"
            icon-name="PieChart"
            @click="toggleChart"
          />
        </div>
      </template>

      <template #planNo="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.planNo }}</el-text>
      </template>

      <template #abnormalId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.abnormalId }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)"/>
          <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)"/>
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="dataObj.totalShow = !dataObj.totalShow">
          <el-icon>
            <ArrowDown v-if="!dataObj.totalShow"/>
            <ArrowUp v-else/>
          </el-icon>
          <span v-if="activeName !== '异常待处置' && activeName !== '处置待复核'">
            本页统计：计划总数 {{ dataObj.list.length }}；待执行 {{ dataObj.list.filter(v => v.planStatusName === '待执行').length }}；执行中 {{ dataObj.list.filter(v => v.planStatusName === '执行中').length }}；已完成 {{ dataObj.list.filter(v => v.planStatusName === '已完成').length }}
          </span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <div v-if="showChart && activeName !== '全部'" class="bottom-chart-wrapper">
            <Chart2 :active-name="activeName" :data-list="dataObj.apilist"/>
          </div>
        </div>
      </template>
    </Grid>
  </div>
</template>
