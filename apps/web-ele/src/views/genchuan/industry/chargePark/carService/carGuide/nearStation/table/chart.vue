<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import MapComponent from '#/views/genchuan/industry/chargePark/carService/Mapindex.vue';
import { ElLoading, ElMessage } from 'element-plus';
import { loadTMap } from '#/utils/genchuan/useTMap.ts';
import { getNearStationChart } from '#/api/genchuan/industry/chargePark/carService/carGuide/nearStation/index.js';
import StationDetailDrawer from './StationDetailDrawer.vue';

const emit = defineEmits(['refresh']);

const state = reactive({
  cardList: [
    { title: '周边场站数', value: 0, color: '#409EFF', cardType: 'totalStation' },
    { title: '空位场站数', value: 0, color: '#67C23A', cardType: 'emptyStation' },
  ],
  mapData: [],
  distanceList: [],
  mapConfig: {
    statusIconMap: {},
    statusKeyMap: {},
    infoWindowConfig: {
      title: 'deviceName',
      fields: [
        { key: 'statusName', label: '空位状态' },
        { key: 'coordinate', label: '坐标' },
      ],
    },
  },
});

const barChartRef = ref(null);
let barChartInstance = null;
const mapRef = ref(null);
const stationDetailRef = ref(null);
const currentStation = ref(null);

// 同步拿一个"立刻可用"的位置：localStorage 缓存 → 默认。不阻塞首屏
const NEAR_STATION_LOC_KEY = 'near-station:current-location';
const DEFAULT_LOCATION = { lon: 117.4, lat: 24.9 };
const readCachedLocation = () => {
  try {
    const raw = localStorage.getItem(NEAR_STATION_LOC_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (cached.lon != null && cached.lat != null && Date.now() - (cached.savedAt || 0) < 24 * 3600 * 1000) {
      return { lon: cached.lon, lat: cached.lat };
    }
  } catch {}
  return null;
};

// 异步拿浏览器真实位置（GPS 慢，最多等 8s），拿到后写缓存
const fetchFreshLocation = () => new Promise((resolve) => {
  if (!navigator.geolocation) return resolve(null);
  navigator.geolocation.getCurrentPosition(
    pos => {
      const loc = { lon: pos.coords.longitude, lat: pos.coords.latitude };
      try { localStorage.setItem(NEAR_STATION_LOC_KEY, JSON.stringify({ ...loc, savedAt: Date.now() })); } catch {}
      resolve(loc);
    },
    () => resolve(null),
    { timeout: 8000, maximumAge: 300_000, enableHighAccuracy: false }
  );
});

// Haversine 公里距离
const haversineKm = (lon1, lat1, lon2, lat2) => {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

// 基于"当前位置 → 各场站"的真实距离，以最近/最远为左右两端，等分 6 段
const buildDynamicBuckets = (stations, refLon, refLat) => {
  const dists = stations
    .filter(s => s.lon != null && s.lat != null)
    .map(s => haversineKm(refLon, refLat, +s.lon, +s.lat));
  if (!dists.length) return [];
  const minD = Math.min(...dists);
  const maxD = Math.max(...dists);
  const BUCKET_COUNT = 6;
  // 所有场站距离一致时,只产生一个桶,不强凑空桶
  if (maxD - minD < 1e-6) {
    return [{ from: minD, to: maxD, range: `${minD.toFixed(1)}km`, count: dists.length }];
  }
  const step = (maxD - minD) / BUCKET_COUNT;
  const fmt = (v) => v.toFixed(1);
  const buckets = [];
  for (let i = 0; i < BUCKET_COUNT; i++) {
    const from = minD + step * i;
    const to = i === BUCKET_COUNT - 1 ? maxD : minD + step * (i + 1);
    // 第一个桶左闭(包含最近场站),其它桶左开右闭
    const count = dists.filter(d => (i === 0 ? d >= from - 1e-9 : d > from) && d <= to + 1e-9).length;
    // 横轴只标桶的右边界(该桶内场站距离 ≤ 此值)
    buckets.push({ from, to, range: `${fmt(to)}km`, count });
  }
  return buckets;
};

const currentLocation = ref({ lon: 117.4, lat: 24.9 });

// 缓存最后一次拿到的场站列表(原始 lon/lat),用于 GPS 后台刷新时本地重算桶,不再发后端
let lastStationsRaw = [];

// 用给定位置重算柱状图(纯前端,O(N))
const recomputeBuckets = (lon, lat) => {
  if (!lastStationsRaw.length) return;
  state.distanceList = buildDynamicBuckets(lastStationsRaw, lon, lat);
  initBarChart();
};

const fetchChartData = async () => {
  // 立刻拿到一个可用位置,不等 GPS
  const initial = readCachedLocation() || DEFAULT_LOCATION;
  currentLocation.value = initial;

  // 第一阶段:卡片+地图+柱状图先渲染出来(用 initial 位置)
  try {
    const data = await getNearStationChart({ lon: initial.lon, lat: initial.lat });
    if (!data) return;
    state.cardList[0].value = data.totalStationCount ?? 0;
    state.cardList[1].value = data.emptyStationCount ?? 0;

    const stations = data.stationLocationList || [];
    lastStationsRaw = stations;
    state.mapData = stations
      .filter(s => s.lon != null && s.lat != null)
      .map((s, idx) => ({
        id: s.id ?? idx,
        deviceName: s.stationName || `场站${s.id ?? idx}`,
        stationName: s.stationName || `场站${s.id ?? idx}`,
        coordinate: `${s.lon},${s.lat}`,
        status: s.hasEmpty ? 'free' : 'busy',
        statusName: s.hasEmpty ? '有空位' : '无空位',
        hasEmpty: !!s.hasEmpty,
        emptyStationCount: s.emptySpace ?? 0,
        stationCount: s.spaceTotal ?? 0,
        address: s.address || '',
      }));
    state.distanceList = buildDynamicBuckets(stations, initial.lon, initial.lat);
    initBarChart();
  } catch (error) {
    console.error('获取周边场站统计数据失败', error);
    ElMessage.error('加载图表失败，请稍后重试');
    initBarChart();
  }

  // 第二阶段:后台异步拿真实 GPS,拿到后用同一份场站数据重算柱状图(无 loading mask、不发后端)
  fetchFreshLocation().then((fresh) => {
    if (!fresh) return;
    // 与初始位置差异 < 0.5km 就不重算,避免没必要的闪烁
    const moved = haversineKm(initial.lon, initial.lat, fresh.lon, fresh.lat);
    if (moved < 0.5) return;
    currentLocation.value = fresh;
    recomputeBuckets(fresh.lon, fresh.lat);
  });
};

const getBarOption = () => ({
  backgroundColor: 'transparent',
  title: { text: '场站距离分布', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', formatter: '{b}<br/>场站数量: {c} 个' },
  grid: { left: 50, right: 20, top: 50, bottom: 30 },
  xAxis: {
    type: 'category',
    data: state.distanceList.map(d => d.range || d.label || ''),
    name: '距离区间',
    axisLabel: { rotate: 30 },
  },
  yAxis: { type: 'value', name: '场站数量' },
  series: [{
    name: '场站数量',
    type: 'bar',
    data: state.distanceList.map(d => d.count ?? 0),
    barMaxWidth: 36,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#67C23A' },
        { offset: 1, color: 'rgba(103,194,58,0.3)' },
      ]),
    },
    cursor: 'pointer',
  }],
});

const initBarChart = () => {
  if (!barChartRef.value) return;
  if (barChartInstance) barChartInstance.dispose();
  barChartInstance = echarts.init(barChartRef.value);
  if (!state.distanceList.length) {
    barChartInstance.setOption({
      title: { text: '暂无距离分布数据', left: 'center', top: 'center', textStyle: { color: '#909399', fontSize: 14 } },
      xAxis: { show: false }, yAxis: { show: false }, series: [],
    });
    return;
  }
  barChartInstance.setOption(getBarOption());
  barChartInstance.off('click');
  barChartInstance.on('click', (params) => {
    if (params.componentType === 'series') {
      const bucket = state.distanceList[params.dataIndex];
      if (!bucket) return;
      // 透传桶范围 + 当前位置参考点 + 全部场站列表，让列表切到"场站视图"按距离过滤
      emit('refresh', {
        distanceFrom: bucket.from,
        distanceTo: bucket.to,
        distanceRange: bucket.range,
        refLon: currentLocation.value.lon,
        refLat: currentLocation.value.lat,
        stations: state.mapData,
      });
    }
  });
};

const handleResize = () => barChartInstance?.resize();

const handleCardClick = (index) => {
  const card = state.cardList[index];
  if (!card?.cardType) return;
  emit('refresh', {
    cardType: card.cardType,
    stations: state.mapData,
    refLon: currentLocation.value.lon,
    refLat: currentLocation.value.lat,
  });
};

const handleMarkerClick = (item) => {
  if (!item) return;
  currentStation.value = item;
  nextTick(() => stationDetailRef.value?.open());
};

// 接收表格"定位地址"事件
const geocodeCache = new Map();
async function reverseGeocode(lng, lat) {
  const key = `${lng},${lat}`;
  if (geocodeCache.has(key)) return geocodeCache.get(key);
  try {
    const TMap = await loadTMap();
    const geocoder = new TMap.service.Geocoder();
    const result = await geocoder.reverse({ location: new TMap.LatLng(lat, lng) });
    const addr = result.result?.address || `${lat},${lng}`;
    geocodeCache.set(key, addr);
    return addr;
  } catch {
    return `${lat},${lng}`;
  }
}

const locateAddress = async (address) => {
  if (!address) return ElMessage.warning('地址为空');
  let retries = 0;
  while (!mapRef.value && retries < 20) { await new Promise(r => setTimeout(r, 100)); retries++; }
  if (!mapRef.value) return ElMessage.error('地图组件未初始化，无法定位');
  const m = address.match(/^([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)$/);
  if (m) {
    const lng = parseFloat(m[1]);
    const lat = parseFloat(m[2]);
    if (!isNaN(lng) && !isNaN(lat)) {
      mapRef.value.setCenter([lng, lat]);
      mapRef.value.setZoom(15);
      return ElMessage.success(`已定位到坐标：${lng}, ${lat}`);
    }
  }
  ElMessage.info(`无法自动定位"${address}"，请在地图上手动查找`);
};

const handleLocate = (event) => locateAddress(event.detail);

const refresh = () => fetchChartData();

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('resize', handleResize);
    window.addEventListener('near-station-locate', handleLocate);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('near-station-locate', handleLocate);
  barChartInstance?.dispose();
});

defineExpose({ refresh, locateAddress });
</script>

<template>
  <div class="stats-four-visualization">
    <div class="cards-section">
      <div
        v-for="(card, index) in state.cardList"
        :key="`card-${index}`"
        class="stat-card"
        :style="{ borderLeftColor: card.color }"
        @click="handleCardClick(index)"
      >
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <div class="card-indicator" :style="{ backgroundColor: card.color }"></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: card.color }">{{ card.value }}</div>
        </div>
      </div>
    </div>
    <div class="right-section">
      <div class="map-wrapper">
        <MapComponent
          ref="mapRef"
          :data="state.mapData"
          :marker-icons="{ normal: '/static/imgs/dataHub/map/marker-blue.png' }"
          :status-icon-map="state.mapConfig.statusIconMap"
          :status-key-map="state.mapConfig.statusKeyMap"
          :info-window-config="state.mapConfig.infoWindowConfig"
          @marker-click="handleMarkerClick"
        />
      </div>
      <div class="charts-section">
        <div class="bar-line-chart-area">
          <div ref="barChartRef" class="chart-container"></div>
        </div>
      </div>
    </div>

    <StationDetailDrawer ref="stationDetailRef" :station="currentStation" />
  </div>
</template>

<style scoped>
.stats-four-visualization { display: flex; gap: 20px; width: 100%; min-height: 320px; }
.cards-section { display: grid; grid-template-columns: 1fr; gap: 12px; width: 220px; flex-shrink: 0; }
.stat-card { padding: 12px 14px; border-radius: 8px; border-left: 4px solid; box-shadow: 0 2px 8px rgba(0,0,0,0.08); cursor: pointer; transition: all 0.2s ease; }
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
.card-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.card-title { font-size: 13px; color: #6e7e91; font-weight: 600; }
.card-indicator { width: 8px; height: 8px; border-radius: 50%; }
.card-body { flex: 1; display: flex; align-items: center; }
.card-value { font-size: 22px; font-weight: 700; }
.right-section { position: relative; display: flex; flex: 1; min-height: 320px; }
.map-wrapper { position: relative; width: 50%; height: 100%; border-radius: 8px; overflow: hidden; }
.charts-section { display: flex; flex: 1; height: 100%; }
.bar-line-chart-area { flex: 1; height: 100%; width: 100%; }
.chart-container { width: 100%; height: 100%; }
</style>
