<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { getRescueChartData } from '#/api/genchuan/industry/chargePark/carService/rescueService/rescueInfo/index.js';
import MapComponent from './Mapindex.vue';
import { ElMessage, ElLoading } from 'element-plus';
import { loadTMap } from '#/utils/genchuan/useTMap.ts';

const emit = defineEmits(['refresh']);

const state = reactive({
  cardList: [
    { title: '待派发', value: 0, color: '#FF9F40', statusKeys: ['待派发'] },
    { title: '待认领', value: 0, color: '#FFB347', statusKeys: ['待认领'] },
    { title: '救援完成率', value: '0%', color: '#50E3C2', statusKeys: ['已完成'] },
  ],
  mapData: [],
  mapConfig: {
    statusIconMap: {},
    statusKeyMap: {},
    infoWindowConfig: {
      title: 'id',
      fields: [
        { key: 'status', label: '状态' },
        { key: 'location', label: '位置' },
      ],
    },
  },
  trendList: [],
  totalCount: 0,
});

const lineChartRef = ref(null);
let lineChartInstance = null;
const mapRef = ref(null);

// 逆地理编码缓存
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

async function batchReverseGeocode(points) {
  const promises = points.map(async (point) => {
    const address = await reverseGeocode(point.lon, point.lat);
    return { ...point, address };
  });
  return Promise.all(promises);
}

const fetchChartData = async () => {
  const loading = ElLoading.service({ text: '加载地图数据...', background: 'rgba(0,0,0,0.3)' });
  try {
    const data = await getRescueChartData({ timeRange: '近30天' });
    if (data) {
      state.cardList[0].value = data.waitDispatchCount ?? 0;
      state.cardList[1].value = data.waitClaimCount ?? 0;
      let finishRateValue = data.finishRate ?? 0;
      if (finishRateValue > 0 && finishRateValue <= 1) {
        finishRateValue = (finishRateValue * 100).toFixed(1);
      }
      state.cardList[2].value = `${finishRateValue}%`;
      state.trendList = data.trendList || [];

      const rawList = data.rescueLocationList || [];
      const enhancedList = await batchReverseGeocode(rawList);
      state.mapData = enhancedList.map(item => ({
        id: item.id,
        deviceName: `救援任务${item.id}`,
        coordinate: `${item.lon},${item.lat}`,
        status: item.status,
        location: item.address,
      }));
      initLineChart();
    }
  } catch (error) {
    console.error('获取救援统计图表数据失败', error);
    ElMessage.error('加载统计图表失败，请稍后重试');
    initLineChart();
  } finally {
    loading.close();
  }
};

const getLineOption = () => ({
  backgroundColor: 'transparent',
  title: {
    text: '救援数量趋势（近30天）',
    left: 'center',
    top: 10,
    textStyle: { color: '#6E7E91', fontSize: 14 },
  },
  tooltip: { trigger: 'axis', formatter: '{b}<br/>救援数量: {c} 单' },
  xAxis: {
    type: 'category',
    data: state.trendList.map((item) => item.date),
    axisLabel: { rotate: state.trendList.length > 8 ? 30 : 0 },
  },
  yAxis: { type: 'value', name: '救援数量（单）' },
  series: [
    {
      name: '救援数量',
      type: 'line',
      data: state.trendList.map((item) => item.count ?? 0),
      smooth: true,
      lineStyle: { width: 3, color: '#4A90E2' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(74,144,226,0.3)' },
          { offset: 1, color: 'rgba(74,144,226,0.05)' },
        ]),
      },
      symbol: 'circle',
      symbolSize: 6,
    },
  ],
});

const initLineChart = () => {
  if (!lineChartRef.value) return;
  if (lineChartInstance) lineChartInstance.dispose();
  if (state.trendList.length === 0) {
    lineChartInstance = echarts.init(lineChartRef.value);
    lineChartInstance.setOption({
      title: { text: '暂无数据', left: 'center', top: 'center' },
      xAxis: { show: false },
      yAxis: { show: false },
      series: [],
    });
    return;
  }
  lineChartInstance = echarts.init(lineChartRef.value);
  lineChartInstance.setOption(getLineOption());
};

const handleResize = () => lineChartInstance?.resize();

const handleCardClick = (index) => {
  const card = state.cardList[index];
  if (card?.statusKeys) emit('refresh', { statusList: card.statusKeys });
};

const handleMarkerClick = (item) => {
  console.log('点击了地图标记点:', item);
};

const handleAreaFilter = async () => {
  if (!mapRef.value) return;
  try {
    if (typeof mapRef.value.getBounds === 'function') {
      const bounds = await mapRef.value.getBounds();
      if (bounds?.north !== undefined) {
        emit('refresh', { bounds });
        return;
      }
    }
    if (typeof mapRef.value.getCenter === 'function' && typeof mapRef.value.getZoom === 'function') {
      const center = await mapRef.value.getCenter();
      const zoom = await mapRef.value.getZoom();
      if (center?.lng !== undefined) {
        const offset = 0.02 * (20 - zoom);
        emit('refresh', {
          bounds: {
            north: center.lat + offset,
            south: center.lat - offset,
            east: center.lng + offset,
            west: center.lng - offset,
          },
        });
        return;
      }
    }
    ElMessage.warning('当前地图组件不支持区域筛选');
  } catch (error) {
    ElMessage.error('获取地图范围失败');
  }
};

// 地址定位（增强：支持经纬度字符串和地址文本，并添加临时标记）
const locateAddress = async (address) => {
  if (!address) {
    ElMessage.warning('地址为空');
    return;
  }

  let retries = 0;
  const maxRetries = 20;
  while (!mapRef.value && retries < maxRetries) {
    await new Promise(resolve => setTimeout(resolve, 100));
    retries++;
  }

  if (!mapRef.value) {
    ElMessage.error('地图组件未初始化，无法定位');
    return;
  }

  // 解析经纬度坐标
  const coordMatch = address.match(/^([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)$/);
  if (coordMatch) {
    const lngNum = parseFloat(coordMatch[1]);
    const latNum = parseFloat(coordMatch[2]);
    if (!isNaN(lngNum) && !isNaN(latNum)) {
      mapRef.value.setCenter([lngNum, latNum]);
      mapRef.value.setZoom(15);
      // 添加红色临时标记
      mapRef.value.addTempMarker(lngNum, latNum, `查询位置: ${address}`);
      ElMessage.success(`已定位到坐标：${lngNum}, ${latNum}`);
      return;
    }
  }

  // 尝试匹配地图数据中的位置名称
  const normalizedAddress = address.trim().toLowerCase();
  const found = state.mapData.find(item => {
    const itemLocation = item.location?.trim().toLowerCase() || '';
    return itemLocation === normalizedAddress || itemLocation.includes(normalizedAddress);
  });

  if (found && found.coordinate) {
    const [lng, lat] = found.coordinate.split(',');
    const lngNum = parseFloat(lng);
    const latNum = parseFloat(lat);
    if (!isNaN(lngNum) && !isNaN(latNum)) {
      mapRef.value.setCenter([lngNum, latNum]);
      mapRef.value.setZoom(15);
      mapRef.value.addTempMarker(lngNum, latNum, found.location || found.deviceName);
      ElMessage.success(`已定位到：${found.location || found.deviceName}`);
      return;
    }
  }

  ElMessage.info(`无法自动定位“${address}”，请在地图上手动查找`);
};

const refresh = () => {
  fetchChartData();
};

const handleDataChange = () => {
  fetchChartData();
};

// 监听周边场站列表页触发的定位事件
const handleNearStationLocate = (event) => {
  const address = event.detail;
  if (address) locateAddress(address);
};

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('resize', handleResize);
    window.addEventListener('rescue-data-changed', handleDataChange);
    // 监听周边场站定位事件
    window.addEventListener('near-station-locate', handleNearStationLocate);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('rescue-data-changed', handleDataChange);
  window.removeEventListener('near-station-locate', handleNearStationLocate);
  lineChartInstance?.dispose();
});

defineExpose({ locateAddress, refresh });
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
          <div ref="lineChartRef" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-four-visualization {
  display: flex;
  gap: 20px;
  width: 100%;
  min-height: 320px;
}
.cards-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 260px;
  flex-shrink: 0;
}
.stat-card {
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 4px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.card-title {
  font-size: 13px;
  color: #6e7e91;
  font-weight: 600;
}
.card-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.card-body {
  flex: 1;
  display: flex;
  align-items: center;
}
.card-value {
  font-size: 22px;
  font-weight: 700;
}
.right-section {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 320px;
}
.map-wrapper {
  position: relative;
  width: 50%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}
.charts-section {
  display: flex;
  flex: 1;
  height: 100%;
}
.bar-line-chart-area {
  flex: 1;
  height: 100%;
  width: 100%;
}
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
