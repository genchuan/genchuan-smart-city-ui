<template>
  <div class="park-lot-table-new">
    <Grid>
      <!-- 顶部筛选标签 -->
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <el-tag
            v-for="filter in activeFilters"
            :key="filter.field"
            type="primary"
            closable
            @close="handleClearField(filter.field)"
          >
            {{ filter.label }}
          </el-tag>
          <el-button v-if="activeFilters.length" link type="primary" @click="clearAllFilters">清空全部</el-button>
        </div>
      </template>

      <!-- 工具栏按钮 -->
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="筛选" icon-name="search" @click="searchDrawerApi.open()" />
          <!-- 新增展开/收缩按钮 -->
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="刷新" icon-name="refresh" @click="handleRefresh" />
        </div>
      </template>

      <!-- 列模板 -->
      <template #id="{ row }">
        <el-text @click="openDetail(row)" type="primary">{{ row.id }}</el-text>
      </template>
      <template #userName="{ row }">
        <el-text @click="handleUserClick(row.userId, row.userName)" type="primary" style="cursor: pointer">
          {{ row.userName || '-' }}
        </el-text>
      </template>
      <template #queryLocation="{ row }">
        <el-text @click="locateAddress(row.queryLocation)" type="primary" style="cursor: pointer">
          {{ row.queryLocationName || row.queryLocation || '-' }}
        </el-text>
      </template>
      <template #stationCount="{ row }">
        <el-text @click="openResultDialog(row, false)" type="primary" style="cursor: pointer">
          {{ row.stationCount }}
        </el-text>
      </template>
      <template #emptyStationCount="{ row }">
        <el-text @click="openResultDialog(row, true)" type="primary" style="cursor: pointer">
          {{ row.emptyStationCount }}
        </el-text>
      </template>
      <!-- 场站视图列槽 -->
      <template #rowIndex="{ row }">{{ row.rowIndex }}</template>
      <template #stationName="{ row }">
        <el-text @click="openStationDialogByRow(row)" type="primary" style="cursor: pointer">
          {{ row.stationName || row.deviceName || '-' }}
        </el-text>
      </template>
      <template #distance="{ row }">
        <span v-if="row.distance != null">{{ row.distance.toFixed(2) }} km</span>
        <span v-else>-</span>
      </template>
      <template #hasEmpty="{ row }">
        <el-tag :type="row.hasEmpty ? 'success' : 'danger'" size="small">
          {{ row.hasEmpty ? '有空位' : '无空位' }}
        </el-tag>
      </template>
      <template #stationActions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="导航" icon-name="location" @click="handleStationNavigate(row)" />
          <IconButton content="预订" icon-name="calendar" @click="handleStationReserve(row)" />
        </div>
      </template>
    </Grid>

    <!-- 搜索抽屉 -->
    <SearchDrawer title="搜索">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <!-- 详情抽屉（查询日志详情） -->
    <DetailDrawer ref="detailDrawerRef" :detail-data="currentDetail" />

    <!-- 场站详情抽屉（场站视图下点击场站名/详情按钮） -->
    <StationDetailDrawer ref="stationDetailRef" :station="currentStation" />

    <!-- 查询结果明细抽屉：点击"周边场站数"/"空位场站数"数字时从右侧滑出 -->
    <el-drawer v-model="resultDialogVisible" :title="resultDialogTitle" size="55%" append-to-body>
      <el-table v-loading="resultDialogLoading" :data="resultDialogList" border stripe height="100%" empty-text="该次查询没有返回任何场站">
        <el-table-column prop="stationId" label="场站ID" width="80" />
        <el-table-column prop="stationName" label="场站名称" min-width="180" show-overflow-tooltip />
        <el-table-column label="经纬度" width="180">
          <template #default="{ row }">{{ row.lon }}, {{ row.lat }}</template>
        </el-table-column>
        <el-table-column label="距离" width="100">
          <template #default="{ row }">{{ row.distanceKm != null ? Number(row.distanceKm).toFixed(2) + ' km' : '-' }}</template>
        </el-table-column>
        <el-table-column label="空位状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.hasEmpty ? 'success' : 'danger'" size="small">{{ row.hasEmpty ? '有空位' : '无空位' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="空位 / 总数" width="120">
          <template #default="{ row }">{{ row.emptyCount ?? 0 }} / {{ row.totalCount ?? 0 }}</template>
        </el-table-column>
      </el-table>
    </el-drawer>

    <!-- 用户详情抽屉：点击列表"用户"列时拉真实用户详情显示 -->
    <UserDetailDrawer ref="userDetailDrawerRef" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage, ElLoading, ElDrawer, ElTable, ElTableColumn, ElTag, ElButton } from 'element-plus';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import {
  getNearStationPage,
  navigateNearStation,
  reserveNearStation,
  getNearStationResult,
  getUserDetail,
  getUserList,
} from '#/api/genchuan/industry/chargePark/carService/carGuide/nearStation/index.js';
import { useFormSchema, useGridColumns, useStationGridColumns } from './data';
import DetailDrawer from './detail.vue';
import StationDetailDrawer from './StationDetailDrawer.vue';
import UserDetailDrawer from './userDetail.vue';

// 新增 props 和 emit
const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },   // 新增
});
const emit = defineEmits(['refreshChart', 'arrow-change']); // 新增 arrow-change

// 新增：触发箭头切换事件
const arrowChange = () => {
  emit('arrow-change');
};

// ==================== 用户映射 ====================
const allUserMap = ref(new Map());
const userNameToIdMap = ref(new Map());

async function fetchAllUsers() {
  try {
    const users = await getUserList();
    allUserMap.value.clear();
    userNameToIdMap.value.clear();
    (users || []).forEach(user => {
      const userId = user.userId;
      const userName = user.userName || user.nickname;
      if (userId && userName) {
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

// ==================== 视图模式 ====================
// 'queries' = 查询日志(默认),'stations' = 场站列表(卡片/柱状图钻取后)
const viewMode = ref('queries');
const stationViewState = reactive({
  stations: [],          // 全部场站
  refLon: null,
  refLat: null,
  filter: null,          // 'all' | 'hasEmpty' | { distanceFrom, distanceTo }
  filterLabel: '',       // 顶部 chip 显示用
});

// ==================== 搜索参数管理 ====================
const searchParams = reactive({});

// Haversine 公里距离（前端距离过滤用）
const haversineKm = (lon1, lat1, lon2, lat2) => {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

const getTableData = async ({ page }) => {
  // ====== 场站视图(钻取后) ======
  if (viewMode.value === 'stations') {
    const all = stationViewState.stations || [];
    const { refLon, refLat, filter } = stationViewState;
    // 保留 raw distance 用于过滤,避免和 chart 桶边界(也是 raw)对不上
    let list = all.map(s => {
      const [lon, lat] = (s.coordinate || '').split(',').map(parseFloat);
      const distance = (refLon != null && refLat != null && !Number.isNaN(lon) && !Number.isNaN(lat))
        ? haversineKm(refLon, refLat, lon, lat) : null;
      return { ...s, distance };
    });
    if (filter === 'hasEmpty') list = list.filter(s => s.hasEmpty);
    else if (filter && typeof filter === 'object' && filter.distanceFrom != null && filter.distanceTo != null) {
      list = list.filter(s => s.distance != null && s.distance >= filter.distanceFrom - 1e-6 && s.distance <= filter.distanceTo + 1e-6);
    }
    list.sort((a, b) => (a.distance ?? 1e9) - (b.distance ?? 1e9));
    list = list.map((s, i) => ({ ...s, rowIndex: i + 1 }));
    const total = list.length;
    const start = (page.currentPage - 1) * page.pageSize;
    return { total, list: list.slice(start, start + page.pageSize) };
  }

  // ====== 查询日志视图(默认) ======
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...searchParams,
  };

  // 后端 NearStationPageReqVO 只支持 userId(精确) + queryTime(LocalDateTime[]);其它都前端筛
  const userNameFilter = (params.userName || '').trim().toLowerCase();
  const queryLocationFilter = (params.queryLocation || '').trim().toLowerCase();
  delete params.userName;
  delete params.queryLocation;
  // queryTime 用逗号串接,适配后端 LocalDateTime[] 多值绑定
  if (Array.isArray(params.queryTime) && params.queryTime.length === 2) {
    params.queryTime = `${params.queryTime[0]},${params.queryTime[1]}`;
  }

  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === null || params[key] === '') {
      delete params[key];
    }
  });

  // 前端做模糊筛选时拉大 pageSize,一次取够再过滤+分页
  const hasClientFilter = userNameFilter || queryLocationFilter;
  if (hasClientFilter) {
    params.pageNo = 1;
    params.pageSize = 200;
  }

  const res = await getNearStationPage(params);
  let list = res.list || [];
  let total = res.total;

  if (hasClientFilter) {
    list = list.filter(item => {
      const uname = String(item.userName || getUserNameById(item.userId) || item.userId || '').toLowerCase();
      const loc = String(item.queryLocationName || item.queryLocation || '').toLowerCase();
      if (userNameFilter && !uname.includes(userNameFilter)) return false;
      if (queryLocationFilter && !loc.includes(queryLocationFilter)) return false;
      return true;
    });
    total = list.length;
    const pStart = (page.currentPage - 1) * page.pageSize;
    list = list.slice(pStart, pStart + page.pageSize);
  }

  list = list.map(item => ({
    ...item,
    queryTime: formatTimestamp(item.queryTime),
    createTime: formatTimestamp(item.createTime),
    updateTime: formatTimestamp(item.updateTime),
    userName: item.userName || getUserNameById(item.userId),
  }));
  return { total, list };
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    proxyConfig: { ajax: { query: getTableData } },
    rowConfig: { keyField: 'id', isHover: true },
    toolbarConfig: { refresh: false, search: false },
    showOverflow: true,
  },
  showSearchForm: false,
});

// 搜索抽屉
const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 500,
  onCancel: () => searchDrawerApi.close(),
});

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
  Object.keys(searchParams).forEach(key => delete searchParams[key]);
  await QueryFormApi.resetFields();
  gridApi.reload();
  searchDrawerApi.close();
};

async function onSubmit(values, isReset = false) {
  if (isReset) {
    await resetAllFilters();
    return;
  }
  // userName / queryLocation 不再硬转换/卡死,作为前端模糊关键字保留在 searchParams,由 getTableData 客户端筛选
  Object.keys(searchParams).forEach(key => delete searchParams[key]);
  Object.assign(searchParams, { ...values });

  gridApi.reload();
  searchDrawerApi.close();
}

const handleClearField = async (fieldName) => {
  if (fieldName === '__stationView') {
    switchToQueryView();
    return;
  }
  delete searchParams[fieldName];
  // distanceFrom 这种"复合"过滤需要把同组其他字段一起清掉
  if (fieldName === 'distanceFrom') {
    delete searchParams.distanceTo;
    delete searchParams.distanceRange;
    delete searchParams.refLon;
    delete searchParams.refLat;
  }
  const currentFormValues = await QueryFormApi.getValues();
  if (currentFormValues[fieldName] !== undefined) {
    const newFormValues = { ...currentFormValues };
    delete newFormValues[fieldName];
    await QueryFormApi.setValues(newFormValues, false);
  }
  gridApi.reload();
};

const clearAllFilters = () => {
  if (viewMode.value === 'stations') {
    switchToQueryView();
    return;
  }
  Object.keys(searchParams).forEach(key => delete searchParams[key]);
  gridApi.reload();
};

const addQuickFilter = (field, value, label) => {
  if (searchParams[field] !== undefined && searchParams[field] === value) {
    return;
  }
  searchParams[field] = value;
  gridApi.reload();
  ElMessage.success(`已添加筛选：${label}`);
};

const activeFilters = computed(() => {
  const filters = [];
  if (viewMode.value === 'stations') {
    filters.push({ label: `场站视图：${stationViewState.filterLabel}`, field: '__stationView' });
    return filters;
  }
  if (searchParams.userName) {
    filters.push({ label: `用户：${searchParams.userName}`, field: 'userName' });
  }
  if (searchParams.userId) {
    filters.push({ label: `用户：${getUserNameById(searchParams.userId)}`, field: 'userId' });
  }
  if (searchParams.queryLocation) {
    filters.push({ label: `查询位置：${searchParams.queryLocation}`, field: 'queryLocation' });
  }
  if (searchParams.queryTime && Array.isArray(searchParams.queryTime)) {
    const start = searchParams.queryTime[0]?.substring(0, 10) || '';
    const end = searchParams.queryTime[1]?.substring(0, 10) || '';
    filters.push({ label: `查询时间：${start} 至 ${end}`, field: 'queryTime' });
  }
  if (searchParams.stationCount) {
    filters.push({ label: `周边场站数：${searchParams.stationCount}`, field: 'stationCount' });
  }
  if (searchParams.hasEmpty === true) {
    filters.push({ label: '有空位场站', field: 'hasEmpty' });
  }
  if (searchParams.distanceFrom != null && searchParams.distanceTo != null) {
    filters.push({ label: `距离区间：${searchParams.distanceRange || `${searchParams.distanceFrom.toFixed(1)}-${searchParams.distanceTo.toFixed(1)}km`}`, field: 'distanceFrom' });
  }
  if (searchParams.stationId) {
    filters.push({ label: `场站ID：${searchParams.stationId}`, field: 'stationId' });
  }
  return filters;
});

// 详情抽屉
const detailDrawerRef = ref(null);
const currentDetail = ref({});
const openDetail = (row) => {
  currentDetail.value = row;
  detailDrawerRef.value.open();
};

// 用户详情抽屉（点击行的"用户"列时拉系统用户详情，样式与充停地图保持一致）
const userDetailDrawerRef = ref(null);
const handleUserClick = async (userId) => {
  if (!userId) {
    ElMessage.warning('用户ID不存在');
    return;
  }
  try {
    const userDetail = await getUserDetail(userId);
    userDetailDrawerRef.value?.open(userDetail);
  } catch (error) {
    console.error('获取用户详情失败', error);
    ElMessage.error('获取用户详情失败');
  }
};

// 导航
const handleNavigate = async (row) => {
  const loading = ElLoading.service({ text: '正在获取导航地址...' });
  try {
    const res = await navigateNearStation({ id: row.id });
    let url = null;
    if (typeof res === 'string') url = res;
    else if (res && typeof res === 'object') url = res.data || res.url || null;
    if (url && typeof url === 'string' && url.trim()) {
      const finalUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(finalUrl, '_blank');
      ElMessage.success('已打开导航');
    } else {
      ElMessage.warning('未获取到有效的导航地址');
    }
  } catch (error) {
    console.error('导航失败:', error);
    ElMessage.error('导航失败，请稍后重试');
  } finally {
    loading.close();
  }
};

// 预订
const handleReserve = async (row) => {
  const loading = ElLoading.service({ text: '正在跳转预约服务...' });
  try {
    const res = await reserveNearStation({ id: row.id });
    let url = null;
    if (typeof res === 'string') url = res;
    else if (res && typeof res === 'object') url = res.data || res.url || null;
    if (url && typeof url === 'string' && url.trim()) {
      const finalUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
      window.open(finalUrl, '_blank');
      ElMessage.success('已打开预订页面');
    } else {
      ElMessage.warning('未获取到预订页面地址');
    }
  } catch (error) {
    console.error('预订失败:', error);
    ElMessage.error('预订失败，请稍后重试');
  } finally {
    loading.close();
  }
};

const handleRefresh = () => {
  gridApi.reload();
  emit('refreshChart');
};

const locateAddress = (address) => {
  window.dispatchEvent(new CustomEvent('near-station-locate', { detail: address }));
};

// 查询结果明细弹窗（点击列表"周边场站数"/"空位场站数"列）
const resultDialogVisible = ref(false);
const resultDialogTitle = ref('');
const resultDialogLoading = ref(false);
const resultDialogList = ref([]);
const openResultDialog = async (row, onlyHasEmpty) => {
  if (!row?.id) return;
  resultDialogTitle.value = onlyHasEmpty
    ? `查询 #${row.id} 返回的有空位场站（${row.emptyStationCount} 个）`
    : `查询 #${row.id} 返回的周边场站（${row.stationCount} 个）`;
  resultDialogList.value = [];
  resultDialogVisible.value = true;
  resultDialogLoading.value = true;
  try {
    const res = await getNearStationResult({ nearStationId: row.id, onlyHasEmpty });
    resultDialogList.value = res || [];
  } catch (err) {
    ElMessage.error('加载查询结果明细失败');
    console.error(err);
  } finally {
    resultDialogLoading.value = false;
  }
};

// 场站视图：导航（高德地图 URI，与后端 carservice.navigate.map-url-template 同一服务商；
// 高德格式：to=lng,lat,name & from=lng,lat,name，coordinate=gaode 表示用高德坐标系）
const handleStationNavigate = (row) => {
  const [lon, lat] = (row.coordinate || '').split(',').map(parseFloat);
  if (Number.isNaN(lon) || Number.isNaN(lat)) {
    ElMessage.warning('该场站缺少坐标，无法导航');
    return;
  }
  const params = new URLSearchParams({
    to: `${lon},${lat},${row.stationName || '场站'}`,
    mode: 'car',
    policy: '1',
    src: 'genchuan',
    coordinate: 'gaode',
    callnative: '0',
  });
  // 起点：钻取时透传过来的当前位置 refLon/refLat
  const refLon = stationViewState.refLon;
  const refLat = stationViewState.refLat;
  if (refLon != null && refLat != null) {
    params.set('from', `${refLon},${refLat},我的位置`);
  }
  window.open(`https://uri.amap.com/navigation?${params.toString()}`, '_blank');
};

// 场站视图：预订（项目内部 router.push 跳转到预约列表页，带 stationId / stationName 作为 query）
const router = useRouter();
const handleStationReserve = (row) => {
  if (!row.id) {
    ElMessage.warning('该场站缺少ID，无法预订');
    return;
  }
  router.push({
    path: '/chargePark/carService/reserveService/reserveList',
    query: {
      stationId: String(row.id),
      stationName: row.stationName || row.deviceName || '',
    },
  });
};

// 场站详情抽屉（场站视图下点击场站名 / 详情按钮）
const stationDetailRef = ref(null);
const currentStation = ref(null);
const openStationDialogByRow = (row) => {
  currentStation.value = {
    id: row.id,
    deviceName: row.stationName || row.deviceName,
    stationName: row.stationName || row.deviceName,
    coordinate: row.coordinate,
    statusName: row.hasEmpty ? '有空位' : '无空位',
    hasEmpty: !!row.hasEmpty,
    emptyStationCount: row.emptyStationCount ?? 0,
    stationCount: row.stationCount ?? 0,
    address: row.address || '',
  };
  setTimeout(() => stationDetailRef.value?.open(), 50);
};

// 切到"场站视图":换列、装数据、reload
const switchToStationView = (stations, refLon, refLat, filter, filterLabel) => {
  viewMode.value = 'stations';
  stationViewState.stations = stations || [];
  stationViewState.refLon = refLon;
  stationViewState.refLat = refLat;
  stationViewState.filter = filter;
  stationViewState.filterLabel = filterLabel || '';
  gridApi.setGridOptions({ columns: useStationGridColumns() });
  gridApi.reload();
};

// 切回"查询日志视图"
const switchToQueryView = () => {
  viewMode.value = 'queries';
  Object.keys(searchParams).forEach(key => delete searchParams[key]);
  gridApi.setGridOptions({ columns: useGridColumns() });
  gridApi.reload();
};

const handleChartRefresh = (event) => {
  const filters = event.detail || {};

  // 柱状图柱形点击 → 场站视图,按距离桶过滤
  if (filters.distanceFrom != null && filters.distanceTo != null) {
    switchToStationView(
      filters.stations,
      filters.refLon,
      filters.refLat,
      { distanceFrom: filters.distanceFrom, distanceTo: filters.distanceTo },
      `距离区间：${filters.distanceRange}`
    );
    ElMessage.success(`已筛选距离 ${filters.distanceRange} 内的场站`);
    return;
  }
  // 周边场站数卡片 → 场站视图,展示全部场站
  if (filters.cardType === 'totalStation') {
    switchToStationView(filters.stations, filters.refLon, filters.refLat, 'all', '周边全部场站');
    ElMessage.info('已展示全部场站');
    return;
  }
  // 空位场站数卡片 → 场站视图,仅有空位
  if (filters.cardType === 'emptyStation') {
    switchToStationView(filters.stations, filters.refLon, filters.refLat, 'hasEmpty', '有空位场站');
    ElMessage.success('已筛选有空位场站');
    return;
  }
};

onMounted(() => {
  fetchAllUsers();
  window.addEventListener('near-station-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('near-station-chart-refresh', handleChartRefresh);
});
</script>
