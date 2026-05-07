<script setup>
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';
import { ElMessage, ElLoading } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import {
  getRescueInfoPage,
  exportRescueInfoExcel,
  exportRescueInfoPdf,
  batchDispatchRescue,
  dispatchRescue,
  claimRescue,
  updateRescueProgress,
  transferRescue,
  evaluateRescue,
  archiveRescue,
  getRescueUserList,
  uploadFile,
} from '#/api/genchuan/industry/chargePark/carService/rescueService/rescueInfo/index.js';
import { useFormSchema, useGridColumns } from './data';
import RescueDetailDrawer from './detail.vue';
import { loadTMap } from '#/utils/genchuan/useTMap.ts';
import { requestClient } from '#/api/request';

// 搜索抽屉
const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 500,
  onCancel: () => searchDrawerApi.close(),
});

// 派发抽屉
const [DispatchDrawer, dispatchDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  width: 500,
  title: '派发救援任务',
  onCancel: () => dispatchDrawerApi.close(),
  onConfirm: () => confirmDispatch(),
});

// 批量派发抽屉
const [BatchDispatchDrawer, batchDispatchDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  width: 500,
  title: '批量派发',
  onCancel: () => batchDispatchDrawerApi.close(),
  onConfirm: () => confirmBatchDispatch(),
});

// 更新进度抽屉
const [ProgressDrawer, progressDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  width: 500,
  title: '更新救援进度',
  onCancel: () => progressDrawerApi.close(),
  onConfirm: () => confirmProgress(),
});

// 转派抽屉
const [TransferDrawer, transferDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  width: 500,
  title: '转派救援任务',
  onCancel: () => transferDrawerApi.close(),
  onConfirm: () => confirmTransfer(),
});

// 评价抽屉
const [EvaluateDrawer, evaluateDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  width: 500,
  title: '救援评价',
  onCancel: () => evaluateDrawerApi.close(),
  onConfirm: () => confirmEvaluate(),
});

// 评价详情抽屉
const [EvaluateDetailDrawer, evaluateDetailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 500,
  title: '评价详情',
  onCancel: () => evaluateDetailDrawerApi.close(),
});

// 用户详情抽屉
const [UserDetailDrawer, userDetailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 500,
  title: '用户详情',
  onCancel: () => userDetailDrawerApi.close(),
});

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },  // 新增
});
const emit = defineEmits(['arrow-change']);     // 新增

const arrowChange = () => {
  emit('arrow-change');
};

const currentUserDetail = ref({});

async function getUserDetail(userId) {
  try {
    const res = await requestClient.get('/system/user/get', { params: { id: userId } });
    return res;
  } catch (error) {
    console.error('获取用户详情失败', error);
    throw error;
  }
}

async function openUserDetail(userId) {
  if (!userId) return;
  try {
    const detail = await getUserDetail(userId);
    currentUserDetail.value = detail || {};
    userDetailDrawerApi.open();
  } catch (error) {
    ElMessage.error('获取用户详情失败');
  }
}

const checkedIds = ref([]);
const checkedRows = ref([]);
const handleRowCheckboxChange = ({ records }) => {
  checkedRows.value = records || [];
  checkedIds.value = checkedRows.value.map((item) => item.id);
};
const dataObj = reactive({
  detailObj: {},
  total: 0,
  list: [],
  serachObj: {},
  currentPage: 1,
  pageSize: 10,
});

// 用户映射
const allUserMap = ref(new Map());
const userNameToIdMap = ref(new Map());

async function fetchAllUsers() {
  try {
    const users = await getRescueUserList();
    allUserMap.value.clear();
    userNameToIdMap.value.clear();
    users.forEach(user => {
      const userId = user.userId;
      const userName = user.userName || user.nickname;
      if (userName) {
        allUserMap.value.set(userId, userName);
        if (!userNameToIdMap.value.has(userName)) {
          userNameToIdMap.value.set(userName, userId);
        }
      }
    });
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
}

function getUserIdByUserName(userName) {
  if (!userName) return null;
  return userNameToIdMap.value.get(userName);
}

function getUserNameById(userId) {
  if (!userId) return '';
  return allUserMap.value.get(userId) || userId;
}

// 逆地理编码
const geocodeCache = new Map();

async function reverseGeocode(lng, lat) {
  const key = `${lng},${lat}`;
  if (geocodeCache.has(key)) return geocodeCache.get(key);
  try {
    const TMap = await loadTMap();
    const geocoder = new TMap.service.Geocoder();
    const result = await geocoder.reverse({ location: new TMap.LatLng(lat, lng) });
    const address = result.result?.address || `${lat},${lng}`;
    geocodeCache.set(key, address);
    return address;
  } catch (error) {
    console.error('逆地理编码失败', error);
    return `${lat},${lng}`;
  }
}

async function enhanceListWithLocationName(list) {
  if (!list || list.length === 0) return list;
  const promises = list.map(async (item) => {
    if (!item.location || item.locationName) return item;
    const coords = item.location.split(',');
    if (coords.length === 2) {
      const lng = parseFloat(coords[0]);
      const lat = parseFloat(coords[1]);
      if (!isNaN(lng) && !isNaN(lat)) {
        const address = await reverseGeocode(lng, lat);
        item.locationName = address;
      } else {
        item.locationName = item.location;
      }
    } else {
      item.locationName = item.location;
    }
    return item;
  });
  return Promise.all(promises);
}

const getTableData = async (pageObj) => {
  const params = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.serachObj,
  };

  if (dataObj.serachObj.createTime && Array.isArray(dataObj.serachObj.createTime)) {
    params.createTime = dataObj.serachObj.createTime;
  }

  if (dataObj.serachObj.location) {
    params.locationName = dataObj.serachObj.location;
    delete params.location;
  }

  if (dataObj.serachObj.statusList && Array.isArray(dataObj.serachObj.statusList)) {
    params.status = dataObj.serachObj.statusList.join(',');
    delete params.statusList;
  } else if (dataObj.serachObj.status) {
    params.status = dataObj.serachObj.status;
  }

  if (dataObj.serachObj.dispatchTimeRange && Array.isArray(dataObj.serachObj.dispatchTimeRange)) {
    const [startDate, endDate] = dataObj.serachObj.dispatchTimeRange;
    if (startDate && endDate) {
      params.createTime = [`${startDate} 00:00:00`, `${endDate} 23:59:59`];
    }
    delete params.dispatchTimeRange;
  }

  if (dataObj.serachObj.bounds) {
    params.north = dataObj.serachObj.bounds.north;
    params.south = dataObj.serachObj.bounds.south;
    params.east = dataObj.serachObj.bounds.east;
    params.west = dataObj.serachObj.bounds.west;
    delete params.bounds;
  }

  const res = await getRescueInfoPage(params);
  const rawList = (res.list || []).map((v) => ({
    ...v,
    createTime: formatTimestamp(v.createTime),
    updateTime: formatTimestamp(v.updateTime),
    dispatchTime: formatTimestamp(v.dispatchTime),
    finishTime: formatTimestamp(v.finishTime),
  }));

  const enhancedList = await enhanceListWithLocationName(rawList);

  dataObj.total = res.total;
  dataObj.list = enhancedList;
  return dataObj;
};

// 搜索表单
const [QueryForm, QueryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema()
    .filter((v) => v.isSearch)
    .map((v) => {
      delete v.rules;
      return v;
    }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      QueryFormApi.resetForm();
      QueryFormApi.submitForm();
    }
  },
});

const resetAllFilters = async () => {
  dataObj.serachObj = {};
  chartStatusListFilter.value = '';
  chartDateFilter.value = '';
  chartIdFilter.value = '';
  chartBoundsFilter.value = false;
  filterRescueType.value = '';
  filterStatus.value = '';
  filterArchiveStatus.value = '';
  filterUserId.value = '';
  filterRescueUserId.value = '';
  await QueryFormApi.resetFields();
  dataObj.currentPage = 1;
  gridApi.query();
  searchDrawerApi.close();
};

async function onSubmit(values, isReset = false) {
  if (isReset) {
    await resetAllFilters();
  } else {
    const formValues = { ...values };
    dataObj.serachObj = { ...formValues };
    chartStatusListFilter.value = '';
    chartDateFilter.value = '';
    chartIdFilter.value = '';
    chartBoundsFilter.value = false;
    filterRescueType.value = '';
    filterStatus.value = '';
    filterArchiveStatus.value = '';
    filterUserId.value = '';
    filterRescueUserId.value = '';
    dataObj.currentPage = 1;
    gridApi.query();
    searchDrawerApi.close();
  }
}

const handleClearField = async (fieldName, valueToRemove = null) => {
  const newSearchObj = { ...dataObj.serachObj };

  if (fieldName === 'statusList' && valueToRemove) {
    const currentList = newSearchObj.statusList || [];
    const filteredList = currentList.filter(s => s !== valueToRemove);
    if (filteredList.length === 0) {
      delete newSearchObj.statusList;
    } else {
      newSearchObj.statusList = filteredList;
    }
    if (newSearchObj.status && !filteredList.length) delete newSearchObj.status;
  } else {
    delete newSearchObj[fieldName];
    if (fieldName === 'status') delete newSearchObj.statusList;
    if (fieldName === 'statusList') delete newSearchObj.status;
  }

  if (fieldName === 'rescueType') filterRescueType.value = '';
  if (fieldName === 'status' || fieldName === 'statusList') chartStatusListFilter.value = '';
  if (fieldName === 'archiveStatus') filterArchiveStatus.value = '';
  if (fieldName === 'userId') filterUserId.value = '';
  if (fieldName === 'rescueUserId') filterRescueUserId.value = '';
  if (fieldName === 'dispatchTimeRange') chartDateFilter.value = '';
  if (fieldName === 'id') chartIdFilter.value = '';
  if (fieldName === 'bounds') chartBoundsFilter.value = false;

  dataObj.serachObj = newSearchObj;

  if (fieldName !== 'statusList') {
    const currentFormValues = await QueryFormApi.getValues();
    const newFormValues = { ...currentFormValues };
    delete newFormValues[fieldName];
    await QueryFormApi.setValues(newFormValues, false);
  }

  dataObj.currentPage = 1;
  gridApi.query();
};

const activeFilters = computed(() => {
  const filters = [];
  const searchObj = dataObj.serachObj;

  if (searchObj.userId) {
    const userName = getUserNameById(searchObj.userId);
    filters.push({ label: `用户：${userName}`, field: 'userId', value: searchObj.userId });
  }
  if (searchObj.rescueType) {
    filters.push({ label: `救援类型：${searchObj.rescueType}`, field: 'rescueType', value: searchObj.rescueType });
  }
  if (searchObj.location) {
    filters.push({ label: `救援位置：${searchObj.location}`, field: 'location', value: searchObj.location });
  }
  if (searchObj.archiveStatus) {
    filters.push({ label: `归档状态：${searchObj.archiveStatus}`, field: 'archiveStatus', value: searchObj.archiveStatus });
  }
  if (searchObj.rescueUserId) {
    const userName = getUserNameById(searchObj.rescueUserId);
    filters.push({ label: `救援人员：${userName || searchObj.rescueUserId}`, field: 'rescueUserId', value: searchObj.rescueUserId });
  }
  if (searchObj.createTime && searchObj.createTime.length === 2) {
    const start = searchObj.createTime[0]?.substring(0, 10) || '';
    const end = searchObj.createTime[1]?.substring(0, 10) || '';
    filters.push({ label: `创建时间：${start} 至 ${end}`, field: 'createTime', value: searchObj.createTime });
  }
  if (searchObj.dispatchTimeRange && searchObj.dispatchTimeRange.length === 2) {
    filters.push({ label: `派发时间：${searchObj.dispatchTimeRange[0]}`, field: 'dispatchTimeRange', value: searchObj.dispatchTimeRange });
  }
  if (searchObj.id) {
    filters.push({ label: `救援ID：${searchObj.id}`, field: 'id', value: searchObj.id });
  }
  if (searchObj.bounds) {
    filters.push({ label: '区域筛选（地图范围）', field: 'bounds', value: true });
  }

  if (searchObj.statusList && Array.isArray(searchObj.statusList)) {
    searchObj.statusList.forEach(status => {
      filters.push({
        label: `救援状态：${status}`,
        field: 'statusList',
        value: status,
        isStatusItem: true
      });
    });
  } else if (searchObj.status && !searchObj.statusList) {
    filters.push({ label: `救援状态：${searchObj.status}`, field: 'status', value: searchObj.status });
  }

  return filters;
});

// 表格组件
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { 'class-name': 'common-tool-bar-config', refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  const data = await exportRescueInfoExcel(dataObj.serachObj);
  downloadFileFromBlobPart({ fileName: '救援信息记录.xls', source: data });
}

async function handleExportPdf() {
  const data = await exportRescueInfoPdf(dataObj.serachObj);
  downloadFileFromBlobPart({ fileName: '救援信息记录.pdf', source: data });
}

const rescueUserList = ref([]);
async function fetchRescueUsers() {
  rescueUserList.value = (await getRescueUserList()) || [];
}
fetchRescueUsers();

const detailDrawerRef = ref(null);
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
};

// 派发
const dispatchForm = reactive({ rescueUserId: '', dispatchRemark: '' });
let currentDispatchRow = null;
const openDispatchDrawer = (row) => {
  dispatchForm.rescueUserId = '';
  dispatchForm.dispatchRemark = '';
  currentDispatchRow = row;
  dispatchDrawerApi.open();
};
async function confirmDispatch() {
  if (!dispatchForm.rescueUserId) return ElMessage.warning('请选择救援人员');
  await dispatchRescue({ id: currentDispatchRow.id, ...dispatchForm });
  ElMessage.success('派发成功');
  dispatchDrawerApi.close();
  handleRefresh();
}

// 批量派发
const batchDispatchForm = reactive({ rescueUserId: '', dispatchRemark: '' });
const openBatchDispatchDrawer = () => {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个待派发的救援任务');
  // 仅"待派发"状态可以批量派发，其它状态后端会拒绝
  const invalid = checkedRows.value.filter((r) => r.status !== '待派发');
  if (invalid.length) {
    return ElMessage.warning('只能批量派发"待派发"状态的任务，请取消勾选其它状态');
  }
  batchDispatchForm.rescueUserId = '';
  batchDispatchForm.dispatchRemark = '';
  batchDispatchDrawerApi.open();
};
async function confirmBatchDispatch() {
  if (!batchDispatchForm.rescueUserId) return ElMessage.warning('请选择救援人员');
  try {
    await batchDispatchRescue({ ids: checkedIds.value, ...batchDispatchForm });
    ElMessage.success('批量派发成功');
    batchDispatchDrawerApi.close();
    checkedIds.value = [];
    checkedRows.value = [];
    handleRefresh();
  } catch (err) {
    const msg = err?.response?.data?.msg || err?.msg || err?.message || '批量派发失败';
    ElMessage.error(msg);
  }
}

// 认领
const handleClaim = async (row) => {
  await confirm('确认认领该救援任务吗？');
  await claimRescue(row.id);
  ElMessage.success('认领成功');
  handleRefresh();
};

// 更新进度
const progressForm = reactive({
  progress: '',
  photo: null,
  complete: false,
});
let currentProgressRow = null;
const openProgressDrawer = (row) => {
  progressForm.progress = '';
  progressForm.photo = null;
  progressForm.complete = false;
  currentProgressRow = row;
  progressDrawerApi.open();
};
async function confirmProgress() {
  if (!progressForm.progress) return ElMessage.warning('请填写救援进度');
  let photoUrl = '';
  if (progressForm.photo) {
    const loading = ElLoading.service({ text: '上传照片中...' });
    try {
      const res = await uploadFile(progressForm.photo);
      photoUrl = res;
    } catch (error) {
      ElMessage.error(error.message || '照片上传失败');
      loading.close();
      return;
    } finally {
      loading.close();
    }
  }
  await updateRescueProgress({
    id: currentProgressRow.id,
    progress: progressForm.progress,
    photo: photoUrl,
    complete: progressForm.complete,
  });
  ElMessage.success(progressForm.complete ? '更新进度并完成救援' : '更新进度成功');
  progressDrawerApi.close();
  handleRefresh();
}

// 转派
const transferForm = reactive({ newRescueUserId: '', transferReason: '' });
let currentTransferRow = null;
const openTransferDrawer = (row) => {
  transferForm.newRescueUserId = '';
  transferForm.transferReason = '';
  currentTransferRow = row;
  transferDrawerApi.open();
};
async function confirmTransfer() {
  if (!transferForm.newRescueUserId) return ElMessage.warning('请选择新救援人员');
  if (!transferForm.transferReason) return ElMessage.warning('请填写转派理由');
  await transferRescue({ id: currentTransferRow.id, ...transferForm });
  ElMessage.success('转派成功');
  transferDrawerApi.close();
  handleRefresh();
}

// 评价
const evaluateForm = reactive({ score: 5, evaluateContent: '' });
let currentEvaluateRow = null;
const openEvaluateDrawer = (row) => {
  evaluateForm.score = row.score ?? 5;
  evaluateForm.evaluateContent = row.evaluateContent ?? '';
  currentEvaluateRow = row;
  evaluateDrawerApi.open();
};
async function confirmEvaluate() {
  if (!evaluateForm.score) return ElMessage.warning('请填写评分');
  await evaluateRescue({ id: currentEvaluateRow.id, ...evaluateForm });
  ElMessage.success('评价成功');
  evaluateDrawerApi.close();
  handleRefresh();
}

// 归档
const handleArchive = async (row) => {
  await confirm('确认归档该救援记录吗？');
  await archiveRescue(row.id);
  ElMessage.success('归档成功');
  handleRefresh();
};

// 处理时长钻取
const filterByDuration = (duration) => {
  if (!duration || typeof duration !== 'number') return;
  const min = Math.max(0, Math.floor(duration * 0.85));
  const max = Math.ceil(duration * 1.15);
  dataObj.serachObj.handleDurationMin = min;
  dataObj.serachObj.handleDurationMax = max;
  delete dataObj.serachObj.statusList;
  gridApi.query();
};

// 图表钻取
const chartStatusListFilter = ref('');
const chartDateFilter = ref('');
const chartIdFilter = ref('');
const chartBoundsFilter = ref(false);

const handleChartRefresh = (filters) => {
  const newSearchObj = { ...dataObj.serachObj };

  delete newSearchObj.status;
  delete newSearchObj.statusList;

  if (filters?.statusList) {
    newSearchObj.statusList = [...filters.statusList];
    chartStatusListFilter.value = filters.statusList.join('、');
  } else if (filters?.status) {
    newSearchObj.status = filters.status;
    chartStatusListFilter.value = filters.status;
  } else if (filters?.id) {
    newSearchObj.id = filters.id;
    chartIdFilter.value = String(filters.id);
  } else if (filters?.date) {
    newSearchObj.dispatchTimeRange = [filters.date, filters.date];
    chartDateFilter.value = filters.date;
  } else if (filters?.bounds) {
    newSearchObj.bounds = filters.bounds;
    chartBoundsFilter.value = true;
  }

  const preserveFields = ['userId', 'rescueType', 'archiveStatus', 'location', 'createTime', 'rescueUserId'];
  preserveFields.forEach(field => {
    if (dataObj.serachObj[field]) newSearchObj[field] = dataObj.serachObj[field];
  });

  dataObj.serachObj = newSearchObj;
  dataObj.currentPage = 1;
  gridApi.query();
};

const onGlobalRefresh = (event) => handleChartRefresh(event.detail);
onMounted(() => {
  window.addEventListener('rescue-chart-refresh', onGlobalRefresh);
  fetchAllUsers();
});
onUnmounted(() => {
  window.removeEventListener('rescue-chart-refresh', onGlobalRefresh);
});

const handleSerachShow = () => searchDrawerApi.open();
const handleFullShow = () => screenfull.toggle();

// 快捷筛选
const filterRescueType = ref('');
const handleRescueTypeClick = (type) => {
  if (filterRescueType.value === type) {
    handleClearField('rescueType');
  } else {
    dataObj.serachObj.rescueType = type;
    filterRescueType.value = type;
    gridApi.query();
  }
};

const filterStatus = ref('');
const handleStatusClick = (status) => {
  if (filterStatus.value === status) {
    handleClearField('status');
  } else {
    dataObj.serachObj.status = status;
    filterStatus.value = status;
    gridApi.query();
  }
};

const filterArchiveStatus = ref('');
const handleArchiveStatusClick = (archiveStatus) => {
  if (filterArchiveStatus.value === archiveStatus) {
    handleClearField('archiveStatus');
  } else {
    dataObj.serachObj.archiveStatus = archiveStatus;
    filterArchiveStatus.value = archiveStatus;
    gridApi.query();
  }
};

const filterUserId = ref('');
const handleUserClick = (userId) => {
  if (!userId) return;
  openUserDetail(userId);
};

const filterRescueUserId = ref('');
const handleRescueUserClick = (userId) => {
  if (!userId) return;
  if (filterRescueUserId.value === userId) {
    handleClearField('rescueUserId');
  } else {
    dataObj.serachObj.rescueUserId = userId;
    filterRescueUserId.value = userId;
    gridApi.query();
  }
};

const handleLocationClick = (location) => {
  if (!location) return;
  window.dispatchEvent(new CustomEvent('locate-address', { detail: location }));
};

const currentEvaluateDetail = ref({});
const handleEvaluateClick = (row) => {
  currentEvaluateDetail.value = row;
  evaluateDetailDrawerApi.open();
};

defineExpose({ handleRefresh, handleChartRefresh });
</script>

<template>
  <div class="park-lot-table-new">
    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <template v-for="filter in activeFilters" :key="filter.field + (filter.value || '')">
            <el-tag
              type="primary"
              closable
              @close="
                filter.isStatusItem
                  ? handleClearField('statusList', filter.value)
                  : handleClearField(filter.field)
              "
            >
              {{ filter.label }}
            </el-tag>
          </template>

          <el-tag v-if="chartStatusListFilter && !activeFilters.some(f => f.field === 'statusList')" type="warning" closable @close="() => handleClearField('statusList')">
            状态筛选：{{ chartStatusListFilter }}
          </el-tag>
          <el-tag v-if="chartDateFilter && !activeFilters.some(f => f.field === 'dispatchTimeRange')" type="primary" closable @close="() => handleClearField('dispatchTimeRange')">
            派发时间：{{ chartDateFilter }}
          </el-tag>
          <el-tag v-if="chartIdFilter && !activeFilters.some(f => f.field === 'id')" type="info" closable @close="() => handleClearField('id')">
            救援ID：{{ chartIdFilter }}
          </el-tag>
          <el-tag v-if="chartBoundsFilter && !activeFilters.some(f => f.field === 'bounds')" type="danger" closable @close="() => handleClearField('bounds')">
            区域筛选（地图范围）
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="批量派发"
            icon-name="Promotion"
            :disabled="isEmpty(checkedIds)"
            @click="openBatchDispatchDrawer"
          />
          <IconButton content="导出 Excel" icon-name="download" @click="handleExport" />
          <IconButton content="导出 PDF" icon-name="document" @click="handleExportPdf" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <!-- 新增展开/收缩按钮 -->
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列模板（保持原样） -->
      <template #id="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.id }}</el-text>
      </template>
      <template #user_name="{ row }">
        <el-text @click="handleUserClick(row.userId)" type="primary" style="cursor: pointer">
          {{ row.userName || '-' }}
        </el-text>
      </template>
      <template #location="{ row }">
        <el-text
          @click="handleLocationClick(row.location)"
          type="primary"
          style="cursor: pointer"
          :title="row.locationName || row.location"
        >
          {{ row.locationName || row.location || '-' }}
        </el-text>
      </template>
      <template #rescue_type="{ row }">
        <el-tag @click="handleRescueTypeClick(row.rescueType)" style="cursor: pointer">
          {{ row.rescueType }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="
            row.status === '待派发'
              ? 'warning'
              : row.status === '待认领'
                ? 'info'
                : row.status === '处理中'
                  ? 'primary'
                  : 'success'
          "
          @click="handleStatusClick(row.status)"
          style="cursor: pointer"
        >
          {{ row.status }}
        </el-tag>
      </template>
      <template #rescue_user_name="{ row }">
        <el-text
          v-if="row.rescueUserName"
          @click="handleRescueUserClick(row.rescueUserId)"
          type="primary"
          style="cursor: pointer"
        >
          {{ row.rescueUserName }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #handle_duration="{ row }">
        <el-text @click="filterByDuration(row.handleDuration)" type="primary" style="cursor: pointer">
          {{ row.handleDuration ? `${row.handleDuration}秒` : '-' }}
        </el-text>
      </template>
      <template #score="{ row }">
        <el-text v-if="row.score" @click="handleEvaluateClick(row)" type="primary" style="cursor: pointer">
          {{ row.score }}分
        </el-text>
        <span v-else>-</span>
      </template>
      <template #archive_status="{ row }">
        <el-tag
          :type="row.archiveStatus === '已归档' ? 'success' : 'info'"
          @click="handleArchiveStatusClick(row.archiveStatus)"
          style="cursor: pointer"
        >
          {{ row.archiveStatus || '未归档' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-if="row.status === '待派发'">
            <IconButton content="派发" icon-name="Promotion" @click="openDispatchDrawer(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
          <template v-else-if="row.status === '待认领'">
            <IconButton content="认领" icon-name="check" @click="handleClaim(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
          <template v-else-if="row.status === '处理中'">
            <IconButton content="更新进度" icon-name="edit" @click="openProgressDrawer(row)" />
            <IconButton content="转派" icon-name="share" @click="openTransferDrawer(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
          <template v-else-if="row.status === '已完成'">
            <IconButton
              :content="row.status !== '已完成' ? '仅已完成可评价' : row.archiveStatus === '已归档' ? '已归档不可评价' : '评价'"
              :disabled="row.status !== '已完成' || row.archiveStatus === '已归档'"
              icon-name="star"
              @click="openEvaluateDrawer(row)"
            />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
            <IconButton
              :content="row.archiveStatus === '已归档' ? '已归档' : '归档'"
              :disabled="row.archiveStatus === '已归档'"
              icon-name="folder"
              @click="row.archiveStatus !== '已归档' && handleArchive(row)"
            />
          </template>
        </div>
      </template>
    </Grid>

    <!-- 搜索抽屉 -->
    <SearchDrawer title="搜索">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <RescueDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" title="救援详情" />

    <DispatchDrawer>
      <el-form :model="dispatchForm" label-width="100px">
        <el-form-item label="救援人员" required>
          <el-select v-model="dispatchForm.rescueUserId" placeholder="请选择" filterable>
            <el-option
              v-for="item in rescueUserList"
              :key="item.userId"
              :label="item.nickname || item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="派发备注">
          <el-input v-model="dispatchForm.dispatchRemark" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
    </DispatchDrawer>

    <BatchDispatchDrawer>
      <el-form :model="batchDispatchForm" label-width="100px">
        <el-form-item label="救援人员" required>
          <el-select v-model="batchDispatchForm.rescueUserId" placeholder="请选择" filterable>
            <el-option
              v-for="item in rescueUserList"
              :key="item.userId"
              :label="item.nickname || item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="派发备注">
          <el-input v-model="batchDispatchForm.dispatchRemark" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
    </BatchDispatchDrawer>

    <ProgressDrawer>
      <el-form :model="progressForm" label-width="100px">
        <el-form-item label="救援进度" required>
          <el-input
            v-model="progressForm.progress"
            type="textarea"
            rows="3"
            placeholder="如：已到达现场、正在处理"
          />
        </el-form-item>
        <el-form-item label="现场照片">
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="true"
            :limit="1"
            :on-change="(file) => { progressForm.photo = file.raw }"
          >
            <el-button type="primary">上传照片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="标记为已完成">
          <el-checkbox v-model="progressForm.complete">本次更新同时收尾，将任务标记为已完成</el-checkbox>
          <div class="form-tip">勾选后系统将自动计算完成时间与处理时长</div>
        </el-form-item>
      </el-form>
    </ProgressDrawer>

    <TransferDrawer>
      <el-form :model="transferForm" label-width="100px">
        <el-form-item label="新救援人员" required>
          <el-select v-model="transferForm.newRescueUserId" placeholder="请选择" filterable>
            <el-option
              v-for="item in rescueUserList"
              :key="item.userId"
              :label="item.nickname || item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="转派理由" required>
          <el-input v-model="transferForm.transferReason" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
    </TransferDrawer>

    <EvaluateDrawer>
      <el-form :model="evaluateForm" label-width="100px">
        <el-form-item label="评分" required>
          <el-rate v-model="evaluateForm.score" :max="5" show-text :texts="['很差', '失望', '一般', '满意', '惊喜']" />
        </el-form-item>
        <el-form-item label="评价内容">
          <el-input v-model="evaluateForm.evaluateContent" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
    </EvaluateDrawer>

    <EvaluateDetailDrawer>
      <div class="detail-card">
        <div class="detail-card-row">
          <div class="detail-row-left">评分：</div>
          <div class="detail-row-right">{{ currentEvaluateDetail.score }}分</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">评价内容：</div>
          <div class="detail-row-right">{{ currentEvaluateDetail.evaluateContent || '无' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">评价时间：</div>
          <div class="detail-row-right">{{ currentEvaluateDetail.updateTime || '-' }}</div>
        </div>
      </div>
    </EvaluateDetailDrawer>

    <UserDetailDrawer>
      <div class="detail-card">
        <div class="detail-card-row">
          <div class="detail-row-left">用户ID：</div>
          <div class="detail-row-right">{{ currentUserDetail.id || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">用户名：</div>
          <div class="detail-row-right">{{ currentUserDetail.userName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">昵称：</div>
          <div class="detail-row-right">{{ currentUserDetail.nickname || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">手机号：</div>
          <div class="detail-row-right">{{ currentUserDetail.mobile || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">邮箱：</div>
          <div class="detail-row-right">{{ currentUserDetail.email || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">状态：</div>
          <div class="detail-row-right">{{ currentUserDetail.status === 0 ? '正常' : '禁用' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建时间：</div>
          <div class="detail-row-right">{{ formatTimestamp(currentUserDetail.createTime) || '-' }}</div>
        </div>
      </div>
    </UserDetailDrawer>
  </div>
</template>

<style scoped>
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 200px;
}
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.detail-row-left {
  width: 100px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  word-break: break-all;
}
.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
