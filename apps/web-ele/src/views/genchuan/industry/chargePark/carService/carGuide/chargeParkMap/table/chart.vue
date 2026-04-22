<template>
  <div class="stats-four-visualization">
    <div class="cards-section">
      <div class="stat-card" :style="{ borderLeftColor: '#409eff' }" @click="handleCardClick('successRate')">
        <div class="card-header">
          <span class="card-title">查询成功率</span>
          <div class="card-indicator" :style="{ backgroundColor: '#409eff' }"></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: '#409eff' }">{{ querySuccessRate }}%</div>
        </div>
      </div>
      <div class="stat-card" :style="{ borderLeftColor: '#67c23a' }" @click="handleCardClick('avgDuration')">
        <div class="card-header">
          <span class="card-title">平均响应时长</span>
          <div class="card-indicator" :style="{ backgroundColor: '#67c23a' }"></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: '#67c23a' }">{{ avgResponseDuration }} ms</div>
        </div>
      </div>
      <div class="stat-card-placeholder"></div>
      <div class="stat-card-placeholder"></div>
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
          <div ref="heatmapChartRef" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import MapComponent from '#/views/genchuan/industry/chargePark/carService/Mapindex.vue';
import { getChargeParkMapChart } from '#/api/genchuan/industry/chargePark/carService/carGuide/chargeParkMap/index.js';

const emit = defineEmits(['refresh']);

const mapRef = ref(null);
const mapData = ref([]);
const mapConfig = {
  markerIcons: { normal: '/static/imgs/marker-green.png' },
  statusIconMap: { 空闲: 'normal', 占用: 'red', 故障: 'yellow' },
  statusKeyMap: { 空闲: 'normal', 占用: 'red', 故障: 'yellow' },
  // 修改信息窗配置，使用生成的字段
  infoWindowConfig: {
    title: 'stationName',
    fields: [
      { key: 'stationName', label: '场站名称' },
      { key: 'address', label: '地址' },
      { key: 'statusName', label: '车位状态' },
    ],
  },
};

const heatmapChartRef = ref(null);
let heatmapChart = null;
let currentHeatmapData = [];
const querySuccessRate = ref(0);
const avgResponseDuration = ref(0);

// 将热力点数据转换为网格热力图
const convertToHeatmapGrid = (points) => {
  if (!points || !points.length) return { gridData: [], bounds: null };
  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
  points.forEach(p => {
    minLon = Math.min(minLon, p.lon);
    maxLon = Math.max(maxLon, p.lon);
    minLat = Math.min(minLat, p.lat);
    maxLat = Math.max(maxLat, p.lat);
  });
  const lngSpan = maxLon - minLon;
  const latSpan = maxLat - minLat;
  const targetGrids = 15;
  const gridSizeLon = Math.max(lngSpan / targetGrids, 0.01);
  const gridSizeLat = Math.max(latSpan / targetGrids, 0.01);

  const gridMap = new Map();
  points.forEach(p => {
    const x = Math.floor((p.lon - minLon) / gridSizeLon);
    const y = Math.floor((p.lat - minLat) / gridSizeLat);
    const key = `${x},${y}`;
    gridMap.set(key, (gridMap.get(key) || 0) + 1);
  });

  const gridData = [];
  for (let [key, count] of gridMap.entries()) {
    const [x, y] = key.split(',').map(Number);
    gridData.push({ x, y, value: count });
  }
  return { gridData, bounds: { minLon, maxLon, minLat, maxLat, gridSizeLon, gridSizeLat } };
};

// 渲染热力图
const renderHeatmap = () => {
  if (!heatmapChartRef.value) return;
  if (heatmapChart) heatmapChart.dispose();

  if (!currentHeatmapData.length) {
    heatmapChart = echarts.init(heatmapChartRef.value);
    heatmapChart.setOption({
      title: { text: '暂无热力图数据', left: 'center', top: 'center' },
      xAxis: { show: false },
      yAxis: { show: false },
      series: [],
    });
    return;
  }

  const { gridData, bounds } = convertToHeatmapGrid(currentHeatmapData);
  if (!gridData.length) return;

  const xAxisData = [...new Set(gridData.map(d => d.x))].sort((a, b) => a - b);
  const yAxisData = [...new Set(gridData.map(d => d.y))].sort((a, b) => a - b);
  const data = gridData.map(d => [d.x, d.y, d.value]);
  const maxValue = Math.max(...gridData.map(d => d.value), 1);

  heatmapChart = echarts.init(heatmapChartRef.value);
  heatmapChart.setOption({
    title: { text: '车位使用热力图', left: 'center', top: 0 },
    tooltip: {
      trigger: 'item',
      formatter: (params) => `网格(${params.value[0]},${params.value[1]})<br/>使用次数: ${params.value[2]}`,
    },
    visualMap: {
      min: 0,
      max: maxValue,
      calculable: true,
      inRange: { color: ['#50a3ba', '#eac736', '#d94e5d'] },
    },
    xAxis: { type: 'category', data: xAxisData, name: '经度网格', splitArea: { show: true } },
    yAxis: { type: 'category', data: yAxisData, name: '纬度网格', splitArea: { show: true } },
    series: [{
      type: 'heatmap',
      data: data,
      emphasis: { itemStyle: { borderColor: '#333', borderWidth: 1 } },
    }],
  });

  // 热力图点击：在地图上绘制矩形圈选区域
  heatmapChart.off('click');
  heatmapChart.on('click', (params) => {
    if (params.data && bounds) {
      const x = params.data[0];
      const y = params.data[1];
      const { minLon, maxLon, minLat, maxLat, gridSizeLon, gridSizeLat } = bounds;
      const west = minLon + x * gridSizeLon;
      const east = west + gridSizeLon;
      const south = minLat + y * gridSizeLat;
      const north = south + gridSizeLat;
      const selectedBounds = { north, south, east, west };
      mapRef.value?.drawBounds(selectedBounds);
    }
  });
};

// 获取图表数据
const fetchChartData = async () => {
  try {
    const res = await getChargeParkMapChart();
    querySuccessRate.value = (res.querySuccessRate).toFixed(1);
    avgResponseDuration.value = res.avgResponseDuration || 0;
    const stationSpaceList = res.stationSpaceList || [];
    const rawHeatPoints = res.heatMapData || [];

    // 构建地图数据：补充场站名称、地址、状态
    mapData.value = stationSpaceList.map(item => {
      // 根据是否有空闲车位判断状态（假设接口返回 hasEmpty 字段，若无则默认为占用）
      const hasEmpty = item.hasEmpty !== undefined ? item.hasEmpty : false;
      const statusName = hasEmpty ? '空闲' : '占用';
      // 生成场站名称和地址（后端未提供时使用 ID 和坐标）
      const stationName = item.stationName || `场站${item.id}`;
      const address = item.address || `经度:${item.lon}, 纬度:${item.lat}`;
      return {
        id: item.id,
        deviceName: stationName,
        coordinate: `${item.lon},${item.lat}`,
        statusName,
        stationName,
        address,
        ...item,
      };
    });

    currentHeatmapData = rawHeatPoints;
    await nextTick();
    renderHeatmap();
  } catch (error) {
    console.error('获取充停地图图表数据失败', error);
    ElMessage.error('加载图表失败，请稍后重试');
  }
};

// 卡片点击
const handleCardClick = (type) => {
  emit('refresh', { cardType: type });
};

// 地图标注点击
const handleMarkerClick = (item) => {
  if (item?.id) {
    emit('refresh', { stationId: item.id });
  }
};

// 地址定位（供外部调用）
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
    ElMessage.error('地图组件未初始化');
    return;
  }

  // 经纬度字符串
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

  // 从地图数据中查找
  const normalized = address.trim().toLowerCase();
  const found = mapData.value.find(item => {
    const name = (item.stationName || item.address || '').trim().toLowerCase();
    return name === normalized || name.includes(normalized);
  });
  if (found && found.coordinate) {
    const [lng, lat] = found.coordinate.split(',');
    mapRef.value.setCenter([parseFloat(lng), parseFloat(lat)]);
    mapRef.value.setZoom(15);
    ElMessage.success(`已定位到：${found.stationName || found.address}`);
    return;
  }

  ElMessage.info(`无法定位“${address}”，请手动查找`);
};

const handleLocateEvent = (event) => {
  locateAddress(event.detail);
};

const refresh = () => {
  fetchChartData();
};

onMounted(() => {
  fetchChartData();
  window.addEventListener('resize', () => heatmapChart?.resize());
  window.addEventListener('charge-park-map-locate', handleLocateEvent);
});

onUnmounted(() => {
  heatmapChart?.dispose();
  window.removeEventListener('charge-park-map-locate', handleLocateEvent);
});

defineExpose({ refresh, locateAddress });
</script>

<style scoped>
/* 样式保持不变，略 */
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
.stat-card-placeholder {
  background: transparent;
  box-shadow: none;
  border: none;
  pointer-events: none;
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
  min-height: 200px;
}
</style>
