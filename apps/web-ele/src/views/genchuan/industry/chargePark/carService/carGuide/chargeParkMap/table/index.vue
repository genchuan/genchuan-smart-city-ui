<!-- chargeParkMap/table/index.vue -->
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

      <!-- 列模板（保持原有） -->
      <template #id="{ row }">
        <el-text @click="openDetail(row)" type="primary">{{ row.id }}</el-text>
      </template>
      <template #userName="{ row }">
        <el-text @click="handleUserClick(row.userId, row.userName)" type="primary" style="cursor: pointer">
          {{ row.userName || '-' }}
        </el-text>
      </template>
      <template #queryLocation="{ row }">
        <el-text
          @click="locateAddress({ coord: row.queryLocation, name: row.queryLocationName })"
          type="primary"
          style="cursor: pointer"
          :title="row.queryLocation"
        >
          {{ row.queryLocationName || row.queryLocation || '-' }}
        </el-text>
      </template>
      <template #resultCount="{ row }">
        <el-text @click="openResultDrawer(row)" type="primary" style="cursor: pointer">
          {{ row.resultCount }}
        </el-text>
      </template>
      <template #responseDuration="{ row }">
        <el-text @click="addQuickFilter('responseDuration', row.responseDuration, `响应时长: ${row.responseDuration}ms`)" type="primary" style="cursor: pointer">
          {{ row.responseDuration }} ms
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="导航" icon-name="location" @click="openResultDrawer(row, 'navigate')" />
          <IconButton content="预订" icon-name="calendar" @click="openResultDrawer(row, 'reserve')" />
        </div>
      </template>
    </Grid>

    <!-- 搜索抽屉 -->
    <SearchDrawer title="搜索">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <!-- 查询详情抽屉 -->
    <DetailDrawer ref="detailDrawerRef" :detail-data="currentDetail" />

    <!-- 用户详情抽屉 -->
    <UserDetailDrawer ref="userDetailDrawerRef" />

    <!-- 查询结果明细抽屉：点击列表"查询结果数 / 导航 / 预订"时从右侧滑出，每个场站行有独立操作 -->
    <el-drawer v-model="resultDrawerVisible" :title="resultDrawerTitle" size="65%" append-to-body>
      <el-table v-loading="resultDrawerLoading" :data="resultDrawerList" border stripe height="100%" empty-text="该次查询没有返回任何场站">
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
        <el-table-column label="空位 / 总数" width="110">
          <template #default="{ row }">{{ row.emptyCount ?? 0 }} / {{ row.totalCount ?? 0 }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleResultStationNavigate(row)">导航</el-button>
            <el-button type="primary" size="small" link @click="handleResultStationReserve(row)">预订</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

    <!-- 场站详情抽屉（点击地图标注时打开，样式对齐项目内 detail-card 模式） -->
    <StationDetailDrawer title="场站详情">
      <div class="detail-card">
        <div class="detail-card-row"><div class="detail-row-left">场站名称：</div><div class="detail-row-right">{{ stationDetailData.stationName || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">坐标：</div><div class="detail-row-right">{{ stationDetailData.coordinate || '-' }}</div></div>
        <div class="detail-card-row">
          <div class="detail-row-left">车位状态：</div>
          <div class="detail-row-right">
            <el-tag :type="stationDetailData.statusName === '空闲' ? 'success' : 'danger'" size="small">{{ stationDetailData.statusName || '-' }}</el-tag>
          </div>
        </div>
        <div class="detail-card-row"><div class="detail-row-left">空闲车位数：</div><div class="detail-row-right">{{ stationDetailData.emptySpace ?? '-' }}</div></div>
      </div>
    </StationDetailDrawer>
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
  getChargeParkMapPage,
  navigateChargeParkMap,
  getUserList,
  getUserDetail,
  getChargeParkMapResult,
} from '#/api/genchuan/industry/chargePark/carService/carGuide/chargeParkMap/index.js';
import { useFormSchema, useGridColumns } from './data';
import DetailDrawer from './detail.vue';
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

// ==================== 搜索参数管理 ====================
const searchParams = reactive({});

const getTableData = async ({ page }) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...searchParams,
  };

  // userName / bounds / minResultCount 都是前端筛选(后端不识别)
  const userNameFilter = (params.userName || '').trim().toLowerCase();
  const bounds = searchParams.bounds;
  const minResultCount = params.minResultCount;
  delete params.userName;
  delete params.bounds;
  delete params.minResultCount;

  // 表单里的 queryLocation 字段映射到后端的 queryLocationName(模糊匹配 query_location_name)
  if (params.queryLocation) {
    params.queryLocationName = params.queryLocation;
    delete params.queryLocation;
  }

  // 后端 ChargeParkMapPageReqVO.queryTime 是 LocalDateTime[],用逗号串接 Spring 才能正确绑定
  if (searchParams.queryTime && Array.isArray(searchParams.queryTime) && searchParams.queryTime.length === 2) {
    params.queryTime = `${searchParams.queryTime[0]},${searchParams.queryTime[1]}`;
  }

  if (params.userId) {
    params.userId = Number(params.userId);
  }

  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === null || params[key] === '') {
      delete params[key];
    }
  });

  // 有前端过滤时拉大 pageSize 一次取够
  const needClientFilter = userNameFilter || bounds || minResultCount;
  if (needClientFilter) {
    params.pageNo = 1;
    params.pageSize = 200;
  }

  const res = await getChargeParkMapPage(params);
  let list = res.list || [];
  let total = res.total;
  if (needClientFilter) {
    list = list.filter(v => {
      const uname = String(getUserNameById(v.userId) ?? v.userId ?? '').toLowerCase();
      if (userNameFilter && !uname.includes(userNameFilter)) return false;
      if (minResultCount != null && (v.resultCount || 0) < minResultCount) return false;
      if (bounds) {
        const parts = (v.queryLocation || '').split(',');
        if (parts.length !== 2) return false;
        const lon = parseFloat(parts[0]); const lat = parseFloat(parts[1]);
        if (Number.isNaN(lon) || Number.isNaN(lat)) return false;
        if (lon < bounds.west || lon > bounds.east || lat < bounds.south || lat > bounds.north) return false;
      }
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

  const formValues = { ...values };

  // userName 改为前端模糊过滤（保留在 searchParams 里供 getTableData 使用，不转 userId）

  Object.keys(searchParams).forEach(key => delete searchParams[key]);
  Object.assign(searchParams, formValues);

  gridApi.reload();
  searchDrawerApi.close();
}

const handleClearField = async (fieldName) => {
  delete searchParams[fieldName];
  const currentFormValues = await QueryFormApi.getValues();
  if (currentFormValues[fieldName] !== undefined) {
    const newFormValues = { ...currentFormValues };
    delete newFormValues[fieldName];
    await QueryFormApi.setValues(newFormValues, false);
  }
  gridApi.reload();
};

const clearAllFilters = () => {
  Object.keys(searchParams).forEach(key => delete searchParams[key]);
  gridApi.reload();
};

const addQuickFilter = (field, value, label) => {
  if (searchParams[field] !== undefined) {
    delete searchParams[field];
  }
  searchParams[field] = value;
  gridApi.reload();
  ElMessage.success(`已添加筛选：${label}`);
};

const userDetailDrawerRef = ref(null);
const handleUserClick = async (userId, userName) => {
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

const activeFilters = computed(() => {
  const filters = [];
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
  if (searchParams.resultCount) {
    filters.push({ label: `结果数：${searchParams.resultCount}`, field: 'resultCount' });
  }
  if (searchParams.responseDuration) {
    filters.push({ label: `响应时长：${searchParams.responseDuration}ms`, field: 'responseDuration' });
  }
  if (searchParams.stationId) {
    filters.push({ label: `场站ID：${searchParams.stationId}`, field: 'stationId' });
  }
  if (searchParams.bounds) {
    const b = searchParams.bounds;
    filters.push({ label: `区域：经度${b.west.toFixed(3)}~${b.east.toFixed(3)}，纬度${b.south.toFixed(3)}~${b.north.toFixed(3)}`, field: 'bounds' });
  }
  if (searchParams.minResultCount) {
    filters.push({ label: `查询成功（结果数 ≥ ${searchParams.minResultCount}）`, field: 'minResultCount' });
  }
  return filters;
});

const detailDrawerRef = ref(null);
const currentDetail = ref({});
const openDetail = (row) => {
  currentDetail.value = row;
  detailDrawerRef.value.open();
};

// ==================== 导航功能 ====================
const handleNavigate = async (row) => {
  const loading = ElLoading.service({ text: '正在获取导航地址...' });
  try {
    const params = { id: row.id };
    if (row.stationId) {
      params.stationId = row.stationId;
    }
    const res = await navigateChargeParkMap(params);

    let url = null;
    if (typeof res === 'string') {
      url = res;
    } else if (res && typeof res === 'object') {
      url = res.data || res.url || null;
    }

    if (url && typeof url === 'string' && url.trim()) {
      const finalUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(finalUrl, '_blank');
      ElMessage.success('已打开导航');
    } else {
      console.error('导航地址无效:', res);
      ElMessage.warning('未获取到有效的导航地址');
    }
  } catch (error) {
    console.error('导航失败:', error);
    ElMessage.error('导航失败，请稍后重试');
  } finally {
    loading.close();
  }
};

// ==================== 预订功能 ====================
// 充停地图记录中没有具体场站/车位字段（一次搜索往往对应多个场站），
// 直接当前页跳转到预约列表页，由用户在那边手动选择目标场站/车位发起预约
const router = useRouter();
const handleReserve = (row) => {
  router.push({
    path: '/chargePark/carService/reserveService/reserveList',
    query: row?.id ? { sourceQueryId: row.id } : {},
  });
};

const handleRefresh = () => {
  gridApi.reload();
  emit('refreshChart');
};

const locateAddress = (address) => {
  if (!address) return;
  window.dispatchEvent(new CustomEvent('charge-park-map-locate', { detail: address }));
};

// 计算近 7 天时间区间字符串
const buildRecent7Days = () => {
  const fmt = (d) => {
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  const end = new Date();
  end.setHours(23, 59, 59, 0);
  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return [fmt(start), fmt(end)];
};

// 查询结果明细抽屉（点击列表"查询结果数 / 导航 / 预订"时，从右侧滑出展示该次查询返回的场站列表）
const resultDrawerVisible = ref(false);
const resultDrawerTitle = ref('');
const resultDrawerLoading = ref(false);
const resultDrawerList = ref([]);
const openResultDrawer = async (row, intent = '') => {
  if (!row?.id) return;
  const intentLabel = intent === 'navigate' ? '请选择要导航的场站' : intent === 'reserve' ? '请选择要预订的场站' : '场站明细';
  resultDrawerTitle.value = `查询 #${row.id}（${row.resultCount} 个）— ${intentLabel}`;
  resultDrawerList.value = [];
  resultDrawerVisible.value = true;
  resultDrawerLoading.value = true;
  try {
    const res = await getChargeParkMapResult({ chargeParkMapId: row.id });
    resultDrawerList.value = res || [];
  } catch (err) {
    ElMessage.error('加载查询结果明细失败');
    console.error(err);
  } finally {
    resultDrawerLoading.value = false;
  }
};

// WGS84(GPS) → GCJ-02(高德/火星坐标) 转换：浏览器 geolocation 返回 WGS84，传给高德前必须先转
const wgs84ToGcj02 = (lng, lat) => {
  const PI = Math.PI;
  const a = 6378245.0;
  const ee = 0.00669342162296594323;
  const x = lng - 105.0;
  const y = lat - 35.0;
  let dLat = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  dLat += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
  dLat += ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0;
  dLat += ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) * 2.0) / 3.0;
  let dLng = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  dLng += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
  dLng += ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0;
  dLng += ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) * 2.0) / 3.0;
  const radLat = (lat / 180.0) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI);
  dLng = (dLng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI);
  return { lng: lng + dLng, lat: lat + dLat };
};

// 抽屉内某个场站的"导航" → 高德 URI（起点取用户当前位置，终点是选中场站）
const handleResultStationNavigate = (station) => {
  if (station.lon == null || station.lat == null) {
    ElMessage.warning('该场站缺少坐标，无法导航');
    return;
  }
  const buildUrl = (fromParam) => {
    const params = new URLSearchParams({
      to: `${station.lon},${station.lat},${station.stationName || '场站'}`,
      mode: 'car',
      policy: '1',
      src: 'genchuan',
      coordinate: 'gaode',
      callnative: '0',
    });
    if (fromParam) params.set('from', fromParam);
    return `https://uri.amap.com/navigation?${params.toString()}`;
  };

  // 先在用户手势内打开占位窗口，避免异步后弹窗被拦截
  const win = window.open('about:blank', '_blank');
  if (!navigator.geolocation) {
    if (win) win.location.href = buildUrl();
    else window.open(buildUrl(), '_blank');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { longitude, latitude } = pos.coords;
      const gcj = wgs84ToGcj02(longitude, latitude);
      const fromParam = `${gcj.lng.toFixed(6)},${gcj.lat.toFixed(6)},我的位置`;
      const url = buildUrl(fromParam);
      if (win) win.location.href = url;
      else window.open(url, '_blank');
    },
    (err) => {
      console.warn('获取当前位置失败，将由高德自行定位:', err?.message);
      ElMessage.warning('未能获取当前位置，请在打开的高德页面手动选择起点');
      const url = buildUrl();
      if (win) win.location.href = url;
      else window.open(url, '_blank');
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
  );
};

// 抽屉内某个场站的"预订" → 项目内跳预约列表，自动打开新增弹窗预填场站
const handleResultStationReserve = (station) => {
  if (!station.stationId) {
    ElMessage.warning('该场站缺少ID，无法预订');
    return;
  }
  resultDrawerVisible.value = false;
  router.push({
    path: '/chargePark/carService/reserveService/reserveList',
    query: {
      stationId: String(station.stationId),
      stationName: station.stationName || '',
    },
  });
};

// 场站详情抽屉（点击地图标注 → 弹出该场站基本信息，样式对齐项目内 detail-card 模式）
const stationDetailData = ref({});
const [StationDetailDrawer, stationDetailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 500,
  onCancel: () => stationDetailDrawerApi.close(),
});

const handleChartRefresh = (event) => {
  const filters = event.detail || {};
  // 场站标注点击 → 弹出场站详情
  if (filters.stationDetail) {
    stationDetailData.value = filters.stationDetail;
    stationDetailDrawerApi.open();
    return;
  }
  // 卡片点击 → 列表过滤近 7 天明细
  if (filters.cardType === 'successRate' || filters.cardType === 'avgDuration') {
    Object.keys(searchParams).forEach(key => delete searchParams[key]);
    searchParams.queryTime = buildRecent7Days();
    gridApi.reload();
    ElMessage.success(filters.cardType === 'successRate' ? '已展示近 7 天查询成功率明细' : '已展示近 7 天平均响应时长明细');
    return;
  }
  // 热力图区域点击 → 列表过滤 queryLocation 落在该 bbox 内
  if (filters.bounds) {
    Object.keys(searchParams).forEach(key => delete searchParams[key]);
    searchParams.bounds = filters.bounds;
    gridApi.reload();
    ElMessage.success('已筛选该区域内的查询');
    return;
  }
  if (filters.stationId) {
    addQuickFilter('stationId', filters.stationId, `场站ID: ${filters.stationId}`);
  }
};

onMounted(() => {
  fetchAllUsers();
  window.addEventListener('charge-park-map-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('charge-park-map-chart-refresh', handleChartRefresh);
});

defineExpose({ handleRefresh });
</script>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 200px;
  max-height: 70vh;
  overflow-y: auto;
}
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none; }
}
.detail-row-left {
  width: 110px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  word-break: break-all;
  padding-right: 10px;
}
</style>
