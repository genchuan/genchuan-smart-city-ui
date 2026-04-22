<template>
  <div class="stats-four-visualization">
    <div class="cards-section">
      <div class="stat-card" :style="{ borderLeftColor: '#409eff' }" @click="handleCardClick('totalStation')">
        <div class="card-header">
          <span class="card-title">周边场站数</span>
          <div class="card-indicator" :style="{ backgroundColor: '#409eff' }"></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: '#409eff' }">{{ totalStationCount }}</div>
        </div>
      </div>
      <div class="stat-card" :style="{ borderLeftColor: '#67c23a' }" @click="handleCardClick('emptyStation')">
        <div class="card-header">
          <span class="card-title">空位场站数</span>
          <div class="card-indicator" :style="{ backgroundColor: '#67c23a' }"></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: '#67c23a' }">{{ emptyStationCount }}</div>
        </div>
      </div>
    </div>

    <div class="right-section">
      <div class="map-wrapper">
        <MapComponent
          ref="mapRef"
          :data="mapData"
          :marker-icons="mapConfig.markerIcons"
          :status-icon-map="mapConfig.statusIconMap"
          :status-key-map="mapConfig.statusKeyMap"
          :info-window-config="mapConfig.infoWindowConfig"
          @marker-click="handleMarkerClick"
        />
      </div>
      <div class="charts-section">
        <div class="bar-line-chart-area">
          <div ref="barChartRef" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- 场站详情弹窗 -->
  <StationDetailDrawer ref="stationDetailDrawerRef" :station="currentStation" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import MapComponent from './Mapindex.vue';
import StationDetailDrawer from './StationDetailDrawer.vue';
import { getNearStationChart } from '#/api/genchuan/industry/chargePark/carService/carGuide/nearStation/index.js';

const emit = defineEmits(['refresh']);

const mapRef = ref(null);
const mapData = ref([]);
const mapConfig = {
  markerIcons: { normal: '/static/imgs/marker-green.png', yellow: '/static/imgs/marker-yellow.png', red: '/static/imgs/marker-red.png' },
  statusIconMap: { 有空位: 'normal', 无空位: 'red' },
  statusKeyMap: { 有空位: 'normal', 无空位: 'red' },
  infoWindowConfig: { title: 'deviceName', fields: [{ key: 'address', label: '地址' }] },
};

const barChartRef = ref(null);
let barChart = null;
const totalStationCount = ref(0);
const emptyStationCount = ref(0);
const distanceCountList = ref([]);

// 场站详情弹窗
const stationDetailDrawerRef = ref(null);
const currentStation = ref(null);

const fetchChartData = async () => {
  try {
    const res = await getNearStationChart();
    totalStationCount.value = res.totalStationCount || 0;
    emptyStationCount.value = res.emptyStationCount || 0;

    const stationLocationList = res.stationLocationList || [];
    mapData.value = stationLocationList.map(item => ({
      id: item.id,
      deviceName: `场站${item.id}`,
      coordinate: `${item.lon},${item.lat}`,
      statusName: item.emptyStationCount > 0 ? '有空位' : '无空位',
      stationCount: item.stationCount,
      emptyStationCount: item.emptyStationCount,
      address: item.address || '',
    }));

    distanceCountList.value = res.distanceCountList || [];
    renderBarChart();
  } catch (error) {
    console.error('获取周边场站图表数据失败', error);
    ElMessage.error('加载图表失败，请稍后重试');
  }
};

const renderBarChart = () => {
  if (!barChartRef.value) return;
  if (barChart) barChart.dispose();
  barChart = echarts.init(barChartRef.value);

  // 空数据处理：后端未返回距离分布数据时显示提示信息
  if (!distanceCountList.value || distanceCountList.value.length === 0) {
    barChart.setOption({
      title: {
        text: '暂无距离分布数据',
        left: 'center',
        top: 'center',
        textStyle: { color: '#999', fontSize: 14 }
      },
      xAxis: { show: false },
      yAxis: { show: false },
      series: [],
    });
    return;
  }

  // 正常渲染柱状图
  barChart.setOption({
    title: { text: '场站距离分布', left: 'center' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: distanceCountList.value.map(d => d.distance), name: '距离区间' },
    yAxis: { type: 'value', name: '场站数量' },
    series: [{
      name: '场站数',
      type: 'bar',
      data: distanceCountList.value.map(d => d.count),
      itemStyle: { color: '#409eff', borderRadius: [4, 4, 0, 0] },
    }],
  });

  // 柱状图点击钻取：发射距离区间筛选事件
  barChart.on('click', (params) => {
    if (params.componentType === 'series') {
      const distanceRange = distanceCountList.value[params.dataIndex]?.distance;
      if (distanceRange) {
        emit('refresh', { distanceRange });
      }
    }
  });
};

const handleCardClick = (type) => {
  if (type === 'totalStation') {
    // 周边场站数卡片：清除所有筛选，展示全部记录
    emit('refresh', { cardType: 'totalStation', action: 'clearAll' });
  } else if (type === 'emptyStation') {
    // 空位场站数卡片：筛选有空位场站
    emit('refresh', { cardType: 'emptyStation' });
  }
};

const handleMarkerClick = (item) => {
  // 地图标注点击 → 打开场站详情弹窗
  currentStation.value = item;
  stationDetailDrawerRef.value?.open();
};

// 地图定位功能（支持经纬度字符串和场站名称）
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

  // 判断是否为经纬度字符串
  const coordMatch = address.match(/^([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)$/);
  if (coordMatch) {
    const lng = parseFloat(coordMatch[1]);
    const lat = parseFloat(coordMatch[2]);
    if (!isNaN(lng) && !isNaN(lat)) {
      mapRef.value.setCenter([lng, lat]);
      mapRef.value.setZoom(15);
      ElMessage.success(`已定位到坐标：${lng}, ${lat}`);
      return;
    }
  }

  // 尝试匹配场站名称或地址
  const normalized = address.trim().toLowerCase();
  const found = mapData.value.find(item => {
    const name = (item.deviceName || item.address || '').trim().toLowerCase();
    return name === normalized || name.includes(normalized);
  });
  if (found && found.coordinate) {
    const [lng, lat] = found.coordinate.split(',');
    mapRef.value.setCenter([parseFloat(lng), parseFloat(lat)]);
    mapRef.value.setZoom(15);
    ElMessage.success(`已定位到：${found.deviceName || found.address}`);
    return;
  }

  ElMessage.info(`无法自动定位“${address}”，请在地图上手动查找`);
};

const handleLocateEvent = (event) => {
  locateAddress(event.detail);
};

const refresh = () => {
  fetchChartData();
};

onMounted(() => {
  fetchChartData();
  window.addEventListener('resize', () => barChart?.resize());
  window.addEventListener('near-station-locate', handleLocateEvent);
});
onUnmounted(() => {
  barChart?.dispose();
  window.removeEventListener('near-station-locate', handleLocateEvent);
});

defineExpose({ refresh, locateAddress });
</script>

<style scoped>
.stats-four-visualization {
  display: flex;
  gap: 20px;
  width: 100%;
  min-height: 320px;
  overflow: hidden;
  margin-bottom: 20px;
}
.cards-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 12px;
  width: 260px;
  height: 320px;
  flex-shrink: 0;
}
.stat-card {
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
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
  justify-content: center;
  flex-direction: column;
}
.card-value {
  font-size: 22px;
  font-weight: 700;
}
.right-section {
  position: relative;
  display: flex;
  flex: 1;
  height: 320px;
  gap: 20px;
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
  border: 1px solid #ebeef5;
  border-radius: 8px;
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
