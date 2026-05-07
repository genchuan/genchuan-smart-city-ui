<template>
  <div class="park-lot-table-new">
    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <el-tag v-for="filter in activeFilters" :key="filter.field" type="primary" closable @close="handleClearField(filter.field)">
            {{ filter.label }}
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <template #id="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.id }}</el-text>
      </template>
      <template #user_name="{ row }">
        <el-text @click="() => { handleClearField('userId'); dataObj.searchObj.userId = row.userId; gridApi.query(); }" type="primary" style="cursor: pointer">
          {{ getUserName(row.userId) }}
        </el-text>
      </template>
      <template #start_location="{ row }">
        <el-text @click="handleLocationClick(row, 'start')" type="primary" style="cursor: pointer">
          {{ row.startLocationName || row.startLocation || '-' }}
        </el-text>
      </template>
      <template #end_location="{ row }">
        <el-text @click="handleLocationClick(row, 'end')" type="primary" style="cursor: pointer">
          {{ row.endLocationName || row.endLocation || '-' }}
        </el-text>
      </template>
      <template #path_length="{ row }">
        <el-text @click="filterByPathLength(row.pathLength)" type="primary" style="cursor: pointer">{{ row.pathLength ? `${row.pathLength}米` : '-' }}</el-text>
      </template>
      <template #expect_duration="{ row }">
        <el-text @click="filterByDuration(row.expectDuration)" type="primary" style="cursor: pointer">{{ row.expectDuration ? `${row.expectDuration}秒` : '-' }}</el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="导航" icon-name="location" @click="handleNavigate(row)" />
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
        </div>
      </template>
    </Grid>

    <SearchDrawer title="搜索"><QueryForm class="query-form" /></SearchDrawer>
    <PathPlanDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" title="路径规划详情" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';
import { ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import {
  getPathPlanPage,
  exportPathPlanExcel,
  getPathPlanDetail,
  navigatePathPlan,
  getUserList,
} from '#/api/genchuan/industry/chargePark/carService/reverseFindCar/pathPlan/index.js';
import { useFormSchema, useGridColumns } from './data';
import PathPlanDetailDrawer from './detail.vue';

const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);

const arrowChange = () => {
  emit('arrow-change');
};

const dataObj = reactive({
  detailObj: {},
  total: 0,
  list: [],
  searchObj: {},
  currentPage: 1,
  pageSize: 10,
});

// 用户映射
const userMap = ref(new Map());
async function fetchUserMap() {
  try {
    const users = await getUserList();
    users.forEach(user => userMap.value.set(user.userId, user.userName));
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
}
function getUserName(id) { return userMap.value.get(id) || id; }

// 获取表格数据
const getTableData = async (pageObj) => {
  const page = pageObj.page;
  const userNameFilter = String(dataObj.searchObj.userName || '').trim().toLowerCase();
  const hasClientFilter = !!userNameFilter;

  const params = {
    pageNo: hasClientFilter ? 1 : page.currentPage,
    pageSize: hasClientFilter ? 200 : page.pageSize,
    ...dataObj.searchObj,
  };
  delete params.userName;
  if (Array.isArray(params.planTime) && params.planTime.length === 2) {
    params.planTime = `${params.planTime[0]},${params.planTime[1]}`;
  }
  const successOnly = !!params._successOnly;
  delete params._successOnly;

  const res = await getPathPlanPage(params);
  let list = res.list || [];
  let total = res.total;
  if (successOnly) { list = list.filter(v => (v.pathLength || 0) > 0); total = list.length; }
  // 客户端按用户名模糊匹配
  if (hasClientFilter) {
    list = list.filter(item => {
      const uname = String(item.userName || getUserName(item.userId) || item.userId || '').toLowerCase();
      return uname.includes(userNameFilter);
    });
    total = list.length;
    const pStart = (page.currentPage - 1) * page.pageSize;
    list = list.slice(pStart, pStart + page.pageSize);
  }
  dataObj.total = total;
  dataObj.list = list.map(v => ({
    ...v,
    createTime: formatTimestamp(v.createTime),
    updateTime: formatTimestamp(v.updateTime),
    planTime: formatTimestamp(v.planTime),
  }));
  return dataObj;
};

// 计算近 N 天时间区间
const getRecentDaysRange = (days) => {
  const fmt = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  return [fmt(start), fmt(end)];
};

// 搜索表单
const [QueryForm, QueryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema().filter(v => v.isSearch).map(v => { delete v.rules; return v; }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: { content: '重置', onClick: () => { QueryFormApi.resetForm(); QueryFormApi.submitForm(); } },
});

const resetAllFilters = async () => {
  dataObj.searchObj = {};
  await QueryFormApi.resetFields();
  dataObj.currentPage = 1;
  gridApi.query();
};

async function onSubmit(values, isReset = false) {
  if (isReset) await resetAllFilters();
  else { dataObj.searchObj = { ...values }; dataObj.currentPage = 1; gridApi.query(); }
}

const handleClearField = async (fieldName) => {
  const newSearchObj = { ...dataObj.searchObj };
  delete newSearchObj[fieldName];
  dataObj.searchObj = newSearchObj;
  const currentFormValues = await QueryFormApi.getValues();
  delete currentFormValues[fieldName];
  await QueryFormApi.setValues(currentFormValues, false);
  dataObj.currentPage = 1;
  gridApi.query();
};

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchObj;
  if (obj.userId) filters.push({ label: `用户：${getUserName(obj.userId)}`, field: 'userId' });
  if (obj.userName) filters.push({ label: `用户名称：${obj.userName}`, field: 'userName' });
  if (obj.startLocation) filters.push({ label: `起点：${obj.startLocation}`, field: 'startLocation' });
  if (obj.endLocation) filters.push({ label: `终点：${obj.endLocation}`, field: 'endLocation' });
  if (obj.planTime && obj.planTime.length === 2) filters.push({ label: `规划时间：${obj.planTime[0]} 至 ${obj.planTime[1]}`, field: 'planTime' });
  return filters;
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns({ getUserName }),
    keepSource: true,
    proxyConfig: { ajax: { query: async ({ page }) => getTableData({ page }) } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  showSearchForm: false,
});

function handleRefresh() {
  gridApi.query();
  window.dispatchEvent(new CustomEvent('path-plan-data-changed'));
}

async function handleExport() {
  try {
    const data = await exportPathPlanExcel(dataObj.searchObj);
    downloadFileFromBlobPart({ fileName: '路径规划记录.xls', source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败', error);
    ElMessage.error('导出失败，请稍后重试');
  }
}

const detailDrawerRef = ref(null);
const handleOpenDetail = async (row) => {
  const res = await getPathPlanDetail({ id: row.id });
  dataObj.detailObj = res;
  detailDrawerRef.value.open();

  let pathPoints = res.pathPoints;
  let startCoord = res.startCoord;
  let endCoord = res.endCoord;

  if ((!pathPoints || pathPoints.length === 0) && res.startLocation && res.endLocation) {
    const startArr = res.startLocation.split(',').map(Number);
    const endArr = res.endLocation.split(',').map(Number);
    if (startArr.length === 2 && endArr.length === 2) {
      pathPoints = [startArr, endArr];
      startCoord = { lng: startArr[0], lat: startArr[1] };
      endCoord = { lng: endArr[0], lat: endArr[1] };
    }
  }

  if (pathPoints && pathPoints.length > 0) {
    window.dispatchEvent(new CustomEvent('draw-path-plan', {
      detail: {
        id: res.id,
        pathPoints: pathPoints,
        startCoord: startCoord || { lng: pathPoints[0][0], lat: pathPoints[0][1] },
        endCoord: endCoord || { lng: pathPoints[pathPoints.length-1][0], lat: pathPoints[pathPoints.length-1][1] },
        pathLength: res.pathLength,
        expectDuration: res.expectDuration,
        highlight: true
      }
    }));
  }
};

const handleNavigate = async (row) => {
  try {
    // 后端 CommonResult<String> 解包后 res 直接是 URL 字符串
    const res = await navigatePathPlan({ id: row.id });
    const url = typeof res === 'string' ? res : (res?.data || res?.navigateUrl);
    if (url) {
      window.open(url, '_blank');
      ElMessage.success('正在跳转导航...');
    } else {
      ElMessage.warning('导航地址获取失败');
    }
  } catch (error) {
    console.error('导航失败', error);
    ElMessage.error('导航失败，请稍后重试');
  }
};

const handleLocationClick = (row, type) => {
  const coord = type === 'start' ? row.startLocation : row.endLocation;
  if (!coord) {
    ElMessage.warning('坐标为空');
    return;
  }
  window.dispatchEvent(new CustomEvent('locate-address', { detail: coord }));

  let startCoord = null;
  let endCoord = null;
  let pathPoints = [];

  if (row.startLocation && row.endLocation) {
    const startArr = row.startLocation.split(',').map(Number);
    const endArr = row.endLocation.split(',').map(Number);
    if (startArr.length === 2 && endArr.length === 2) {
      pathPoints = [startArr, endArr];
      startCoord = { lng: startArr[0], lat: startArr[1] };
      endCoord = { lng: endArr[0], lat: endArr[1] };
    }
  }

  if (pathPoints.length > 0) {
    window.dispatchEvent(new CustomEvent('draw-path-plan', {
      detail: {
        id: row.id,
        pathPoints: pathPoints,
        startCoord,
        endCoord,
        pathLength: row.pathLength,
        expectDuration: row.expectDuration,
        highlight: true
      }
    }));
  }
};

const filterByPathLength = (length) => {
  if (!length || typeof length !== 'number') return;
  const min = Math.max(0, Math.floor(length * 0.85));
  const max = Math.ceil(length * 1.15);
  dataObj.searchObj.pathLengthMin = min;
  dataObj.searchObj.pathLengthMax = max;
  dataObj.currentPage = 1;
  gridApi.query();
};

const filterByDuration = (duration) => {
  if (!duration || typeof duration !== 'number') return;
  const min = Math.max(0, Math.floor(duration * 0.85));
  const max = Math.ceil(duration * 1.15);
  dataObj.searchObj.expectDurationMin = min;
  dataObj.searchObj.expectDurationMax = max;
  dataObj.currentPage = 1;
  gridApi.query();
};

function findRowByCoordinates(startCoord, endCoord) {
  const isSamePoint = (p1, p2) => {
    return Math.abs(p1[0] - p2[0]) < 0.000001 && Math.abs(p1[1] - p2[1]) < 0.000001;
  };
  for (const row of dataObj.list) {
    const startArr = row.startLocation ? row.startLocation.split(',').map(Number) : null;
    const endArr = row.endLocation ? row.endLocation.split(',').map(Number) : null;
    if (startArr && endArr && isSamePoint(startArr, [startCoord.lng, startCoord.lat]) && isSamePoint(endArr, [endCoord.lng, endCoord.lat])) {
      return row;
    }
  }
  return null;
}

function highlightTableRow(rowId) {
  try {
    const gridInstance = gridApi.getGridInstance?.();
    if (gridInstance && typeof gridInstance.setCurrentRow === 'function') {
      gridInstance.clearCurrentRow();
      gridInstance.setCurrentRow(rowId);
      gridInstance.scrollToRow(rowId);
    } else {
      const rows = document.querySelectorAll('.vxe-table--body tbody tr');
      rows.forEach(row => {
        const firstCell = row.querySelector('td:first-child');
        if (firstCell && firstCell.innerText.trim() === String(rowId)) {
          row.classList.add('vxe-row--current');
          row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          row.classList.remove('vxe-row--current');
        }
      });
    }
  } catch (e) {
    console.warn('表格高亮失败', e);
  }
}

const handleChartRefresh = (event) => {
  const filters = event.detail;
  if (filters?.pathCoordinates) {
    const { startCoord, endCoord } = filters.pathCoordinates;
    const matchedRow = findRowByCoordinates(startCoord, endCoord);
    if (matchedRow) {
      window.dispatchEvent(new CustomEvent('draw-path-plan', {
        detail: {
          id: matchedRow.id,
          pathPoints: [[startCoord.lng, startCoord.lat], [endCoord.lng, endCoord.lat]],
          startCoord,
          endCoord,
          pathLength: matchedRow.pathLength,
          expectDuration: matchedRow.expectDuration,
          highlight: true
        }
      }));
      highlightTableRow(matchedRow.id);
      ElMessage.success(`已定位到路径规划ID: ${matchedRow.id}`);
    } else {
      ElMessage.warning('当前页未找到匹配的路径，请尝试扩大搜索范围');
    }
    return;
  }
  // 卡片点击：自动按近 7 天筛选
  if (filters?.totalPlanCount || filters?.planSuccessRate) {
    const newSearchObj = { planTime: getRecentDaysRange(7) };
    if (filters.planSuccessRate) newSearchObj._successOnly = true;
    dataObj.searchObj = newSearchObj;
    dataObj.currentPage = 1;
    gridApi.query();
    return;
  }
  const newSearchObj = { ...dataObj.searchObj };
  if (filters?.date) newSearchObj.planTime = [`${filters.date} 00:00:00`, `${filters.date} 23:59:59`];
  dataObj.searchObj = newSearchObj;
  dataObj.currentPage = 1;
  gridApi.query();
};

onMounted(() => {
  fetchUserMap();
  window.addEventListener('path-plan-chart-refresh', handleChartRefresh);
});
onUnmounted(() => window.removeEventListener('path-plan-chart-refresh', handleChartRefresh));

const handleSerachShow = () => searchDrawerApi.open();
const handleFullShow = () => screenfull.toggle();

const [SearchDrawer, searchDrawerApi] = useVbenDrawer({ modal: false, appendToMain: true, footer: false, width: 500, onCancel: () => searchDrawerApi.close() });
</script>
