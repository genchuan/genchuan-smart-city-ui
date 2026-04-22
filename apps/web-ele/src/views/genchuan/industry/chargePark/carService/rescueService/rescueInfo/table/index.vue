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
  batchDispatchRescue,
  dispatchRescue,
  claimRescue,
  updateRescueProgress,
  transferRescue,
  evaluateRescue,
  archiveRescue,
  getRescueUserList,
  uploadFile,
  completeRescue,
} from '#/api/genchuan/industry/chargePark/carService/rescueService/rescueInfo/index.js';
import { useFormSchema, useGridColumns } from './data';
import RescueDetailDrawer from './detail.vue';

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

const props = defineProps({ secondShow: Boolean });
const checkedIds = ref([]);
const handleRowCheckboxChange = ({ records }) => {
  checkedIds.value = records.map((item) => item.id);
};
const dataObj = reactive({
  detailObj: {},
  total: 0,
  list: [],
  serachObj: {},
  currentPage: 1,
  pageSize: 10,
});

// ==================== 用户映射：用户名 -> 用户ID ====================
const allUserMap = ref(new Map());      // userId -> userName
const userNameToIdMap = ref(new Map()); // userName -> userId

// 获取所有用户（用于名称与ID互转）
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

// ==================== 获取表格数据 ====================
const getTableData = async (pageObj) => {
  const params = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.serachObj,
  };

  // 处理创建时间区间
  if (dataObj.serachObj.createTime && Array.isArray(dataObj.serachObj.createTime)) {
    params.createTimeBegin = dataObj.serachObj.createTime[0];
    params.createTimeEnd = dataObj.serachObj.createTime[1];
    delete params.createTime;
  }

  // 多状态筛选（来自图表卡片点击 statusList）
  if (dataObj.serachObj.statusList && Array.isArray(dataObj.serachObj.statusList)) {
    params.status = dataObj.serachObj.statusList.join(',');
    delete params.statusList;
  }
  // 单个状态筛选
  else if (dataObj.serachObj.status) {
    params.status = dataObj.serachObj.status;
  }

  // 派发时间区间（图表钻取）
  if (dataObj.serachObj.dispatchTimeRange && Array.isArray(dataObj.serachObj.dispatchTimeRange)) {
    const [startDate, endDate] = dataObj.serachObj.dispatchTimeRange;
    if (startDate && endDate) {
      const startTimestamp = new Date(`${startDate} 00:00:00`).getTime();
      const endTimestamp = new Date(`${endDate} 23:59:59`).getTime();
      params.dispatchTimeBegin = startTimestamp;
      params.dispatchTimeEnd = endTimestamp;
    }
    delete params.dispatchTimeRange;
  }

  // 区域筛选
  if (dataObj.serachObj.bounds) {
    params.north = dataObj.serachObj.bounds.north;
    params.south = dataObj.serachObj.bounds.south;
    params.east = dataObj.serachObj.bounds.east;
    params.west = dataObj.serachObj.bounds.west;
    delete params.bounds;
  }

  const res = await getRescueInfoPage(params);
  dataObj.total = res.total;
  dataObj.list = (res.list || []).map((v) => ({
    ...v,
    createTime: formatTimestamp(v.createTime),
    updateTime: formatTimestamp(v.updateTime),
    dispatchTime: formatTimestamp(v.dispatchTime),
    finishTime: formatTimestamp(v.finishTime),
  }));
  return dataObj;
};

// ==================== 搜索表单 ====================
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

// 重置所有筛选条件
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

// 查询提交（关键：将 userName 转换为 userId）
async function onSubmit(values, isReset = false) {
  if (isReset) {
    await resetAllFilters();
  } else {
    const formValues = { ...values };
    if (formValues.userName) {
      const userId = getUserIdByUserName(formValues.userName);
      if (userId) {
        formValues.userId = userId;
      } else {
        ElMessage.warning(`未找到用户“${formValues.userName}”，请检查用户名`);
        return;
      }
      delete formValues.userName;
    }
    dataObj.serachObj = { ...formValues };
    // 清空图表钻取和快捷筛选的显示标签
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

// 清除单个筛选字段（支持删除 statusList 中的单个状态）
const handleClearField = async (fieldName, valueToRemove = null) => {
  const newSearchObj = { ...dataObj.serachObj };

  if (fieldName === 'statusList' && valueToRemove) {
    // 删除状态列表中的某一个状态
    const currentList = newSearchObj.statusList || [];
    const filteredList = currentList.filter(s => s !== valueToRemove);
    if (filteredList.length === 0) {
      delete newSearchObj.statusList;
    } else {
      newSearchObj.statusList = filteredList;
    }
    // 如果 statusList 被清空，同时清理旧的单个 status（如果有）
    if (newSearchObj.status && !filteredList.length) delete newSearchObj.status;
  } else {
    // 普通字段直接删除
    delete newSearchObj[fieldName];
    // 如果删除的是 status 字段，同时清理 statusList 避免冲突
    if (fieldName === 'status') delete newSearchObj.statusList;
    if (fieldName === 'statusList') delete newSearchObj.status;
  }

  // 同步清除对应的快捷筛选显示变量
  if (fieldName === 'rescueType') filterRescueType.value = '';
  if (fieldName === 'status' || fieldName === 'statusList') chartStatusListFilter.value = '';
  if (fieldName === 'archiveStatus') filterArchiveStatus.value = '';
  if (fieldName === 'userId') filterUserId.value = '';
  if (fieldName === 'rescueUserId') filterRescueUserId.value = '';
  if (fieldName === 'dispatchTimeRange') chartDateFilter.value = '';
  if (fieldName === 'id') chartIdFilter.value = '';
  if (fieldName === 'bounds') chartBoundsFilter.value = false;

  dataObj.serachObj = newSearchObj;

  // 同步更新搜索表单的值（仅对非 statusList 字段）
  if (fieldName !== 'statusList') {
    const currentFormValues = await QueryFormApi.getValues();
    const newFormValues = { ...currentFormValues };
    delete newFormValues[fieldName];
    await QueryFormApi.setValues(newFormValues, false);
  }

  dataObj.currentPage = 1;
  gridApi.query();
};

// 获取搜索条件标签列表（将 statusList 拆分为独立标签）
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

  // 多状态列表拆分为独立标签
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

// ==================== 表格组件 ====================
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
  batchDispatchForm.rescueUserId = '';
  batchDispatchForm.dispatchRemark = '';
  batchDispatchDrawerApi.open();
};
async function confirmBatchDispatch() {
  if (!batchDispatchForm.rescueUserId) return ElMessage.warning('请选择救援人员');
  await batchDispatchRescue({ ids: checkedIds.value, ...batchDispatchForm });
  ElMessage.success('批量派发成功');
  batchDispatchDrawerApi.close();
  checkedIds.value = [];
  handleRefresh();
}

// 认领
const handleClaim = async (row) => {
  await confirm('确认认领该救援任务吗？');
  await claimRescue(row.id);
  ElMessage.success('认领成功');
  handleRefresh();
};

// 更新进度
const progressForm = reactive({ progress: '', photo: null });
let currentProgressRow = null;
const openProgressDrawer = (row) => {
  progressForm.progress = '';
  progressForm.photo = null;
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
  });
  ElMessage.success('更新进度成功');
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
  evaluateForm.score = 5;
  evaluateForm.evaluateContent = '';
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

// 完成救援
const handleComplete = async (row) => {
  await confirm('确认完成该救援任务吗？');
  await completeRescue(row.id);
  ElMessage.success('救援任务已完成');
  gridApi.reload();
  window.dispatchEvent(new CustomEvent('rescue-data-changed'));
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

// 图表钻取筛选标签（兼容旧显示，现在主要用 activeFilters）
const chartStatusListFilter = ref('');
const chartDateFilter = ref('');
const chartIdFilter = ref('');
const chartBoundsFilter = ref(false);

// 处理图表刷新事件（来自 chart.vue）
const handleChartRefresh = (filters) => {
  const newSearchObj = { ...dataObj.serachObj };

  // 移除原有的状态相关字段，避免冲突
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

  // 保留其他非图表筛选条件
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

// 快捷筛选标签
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
  if (filterUserId.value === userId) {
    handleClearField('userId');
  } else {
    dataObj.serachObj.userId = userId;
    filterUserId.value = userId;
    gridApi.query();
  }
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

// 地址定位
const handleLocationClick = (location) => {
  if (!location) return;
  window.dispatchEvent(new CustomEvent('locate-address', { detail: location }));
};

// 评价详情
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
      <!-- 筛选标签栏 -->
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

          <!-- 兼容旧版独立显示的图表钻取标签（如果未拆分到 activeFilters 中，可保留） -->
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

      <!-- 工具栏按钮 -->
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="批量派发"
            icon-name="send"
            :disabled="isEmpty(checkedIds)"
            @click="openBatchDispatchDrawer"
          />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列模板 -->
      <template #id="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.id }}</el-text>
      </template>
      <template #user_name="{ row }">
        <el-text @click="handleUserClick(row.userId)" type="primary" style="cursor: pointer">
          {{ row.userName || '-' }}
        </el-text>
      </template>
      <template #location="{ row }">
        <el-text @click="handleLocationClick(row.location)" type="primary" style="cursor: pointer">
          {{ row.location || '-' }}
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
            <IconButton content="完成" icon-name="Check" @click="handleComplete(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
          <template v-else-if="row.status === '已完成'">
            <IconButton content="评价" icon-name="star" @click="openEvaluateDrawer(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
            <IconButton content="归档" icon-name="folder" @click="handleArchive(row)" />
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
          <el-rate v-model="evaluateForm.score" :max="5" show-text />
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
</style>
