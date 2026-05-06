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
import MapComponent from './Mapindex.vue';
import { getChargeParkMapChart } from '#/api/genchuan/industry/chargePark/carService/carGuide/chargeParkMap/index.js';

const emit = defineEmits(['refresh']);

const mapRef = ref(null);
const mapData = ref([]);
const mapConfig = {
  markerIcons: { normal: '/static/imgs/marker-green.png' },
  statusIconMap: { 空闲: 'normal', 占用: 'red', 故障: 'yellow' },
  statusKeyMap: { 空闲: 'normal', 占用: 'red', 故障: 'yellow' },
  infoWindowConfig: {
    title: 'stationName',
    fields: [
      { key: 'stationName', label: '场站名称' },
      { key: 'statusName', label: '车位状态' },
      { key: 'emptySpace', label: '空闲车位数' },
    ],
  },
};

const heatmapChartRef = ref(null);
let heatmapChart = null;
let currentHeatmapPoints = [];
const querySuccessRate = ref(0);
const avgResponseDuration = ref(0);

// 渲染热力图
const renderHeatmap = () => {
  if (!heatmapChartRef.value) return;
  if (heatmapChart) heatmapChart.dispose();

  if (!currentHeatmapPoints.length) {
    heatmapChart = echarts.init(heatmapChartRef.value);
    heatmapChart.setOption({
      title: { text: '暂无热力图数据', left: 'center', top: 'center' },
      xAxis: { show: false },
      yAxis: { show: false },
      series: [],
    });
    return;
  }

  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
  currentHeatmapPoints.forEach(p => {
    minLon = Math.min(minLon, p.lon);
    maxLon = Math.max(maxLon, p.lon);
    minLat = Math.min(minLat, p.lat);
    maxLat = Math.max(maxLat, p.lat);
  });

  const lonMargin = (maxLon - minLon) * 0.1;
  const latMargin = (maxLat - minLat) * 0.1;
  minLon -= lonMargin;
  maxLon += lonMargin;
  minLat -= latMargin;
  maxLat += latMargin;

  // 网格大小按点数自适应：12 个点用 ~10x10 网格，色块就足够大；点多时再细分
  const gridSize = Math.max(8, Math.min(20, Math.ceil(Math.sqrt(currentHeatmapPoints.length) * 3)));
  const stepX = (maxLon - minLon) / gridSize;
  const stepY = (maxLat - minLat) / gridSize;

  // 每个 cell 记录"使用率累加和"与"点数",最终取均值,避免落点多寡放大单元
  const sumGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
  const cntGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));

  currentHeatmapPoints.forEach(p => {
    const x = Math.floor((p.lon - minLon) / stepX);
    const y = Math.floor((p.lat - minLat) / stepY);
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      sumGrid[y][x] += p.value;
      cntGrid[y][x] += 1;
    }
  });

  const seriesData = [];
  let maxValue = 0;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cnt = cntGrid[i][j];
      if (cnt > 0) {
        const val = sumGrid[i][j] / cnt;
        seriesData.push([j, i, +val.toFixed(3)]);
        maxValue = Math.max(maxValue, val);
      }
    }
  }

  const xAxisData = Array.from({ length: gridSize }, (_, i) => (minLon + i * stepX).toFixed(4));
  const yAxisData = Array.from({ length: gridSize }, (_, i) => (minLat + i * stepY).toFixed(4));

  heatmapChart = echarts.init(heatmapChartRef.value);
  heatmapChart.setOption({
    title: { text: '车位使用热力图', left: 'center', top: 0 },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        if (params.data) {
          const pct = (params.data[2] * 100).toFixed(0);
          return `经度: ${xAxisData[params.data[0]]}<br/>纬度: ${yAxisData[params.data[1]]}<br/>使用率: ${pct}%`;
        }
        return '';
      },
    },
    // 使用率天然 0~1,固定标尺让色阶含义稳定:0%(冷)→50%(中)→100%(热)
    visualMap: {
      min: 0,
      max: 1,
      calculable: true,
      orient: 'vertical',
      left: 8,
      bottom: 20,
      text: ['100%', '0%'],
      inRange: { color: ['#50a3ba', '#eac736', '#d94e5d'] },
    },
    xAxis: { type: 'category', data: xAxisData, name: '经度', splitArea: { show: true } },
    yAxis: { type: 'category', data: yAxisData, name: '纬度', splitArea: { show: true } },
    series: [{
      type: 'heatmap',
      data: seriesData,
      emphasis: { itemStyle: { borderColor: '#333', borderWidth: 1 } },
    }],
  });

  heatmapChart.off('click');
  heatmapChart.on('click', (params) => {
    if (params.data && params.data.length >= 3) {
      const xIdx = params.data[0];
      const yIdx = params.data[1];
      const west = parseFloat(xAxisData[xIdx]);
      const east = parseFloat(xAxisData[xIdx + 1] || xAxisData[xIdx]);
      const south = parseFloat(yAxisData[yIdx]);
      const north = parseFloat(yAxisData[yIdx + 1] || yAxisData[yIdx]);
      if (!isNaN(west) && !isNaN(east) && !isNaN(south) && !isNaN(north)) {
        mapRef.value?.drawBounds({ north, south, east, west });
        // 同时通知列表按这个 bbox 过滤 queryLocation
        emit('refresh', { bounds: { north, south, east, west } });
      }
    }
  });
};

// 获取图表数据
const fetchChartData = async () => {
  try {
    const res = await getChargeParkMapChart();
    querySuccessRate.value = res.querySuccessRate.toFixed(1);
    avgResponseDuration.value = res.avgResponseDuration || 0;
    const stationSpaceList = res.stationSpaceList || [];
    const rawHeatPoints = res.heatMapData || [];

    mapData.value = stationSpaceList.map((item, index) => {
      const emptySpace = item.emptySpace || 0;
      const statusName = emptySpace > 0 ? '空闲' : '占用';
      const stationName = item.stationName || `场站${index + 1}`;
      const id = `station_${index}_${item.lon}_${item.lat}`;
      const coordinate = `${item.lon},${item.lat}`;
      return {
        id: id,
        stationId: id,
        deviceName: stationName,
        coordinate: coordinate,
        statusName,
        stationName,
        emptySpace,
        lon: item.lon,
        lat: item.lat,
        ...item,
      };
    });

    currentHeatmapPoints = rawHeatPoints
      .filter(p => p.lon != null && p.lat != null && !Number.isNaN(Number(p.lon)) && !Number.isNaN(Number(p.lat)))
      .map(p => ({
        lon: Number(p.lon),
        lat: Number(p.lat),
        value: p.value !== undefined ? Number(p.value) : 1,
      }));

    await nextTick();
    renderHeatmap();
  } catch (error) {
    console.error('获取充停地图图表数据失败', error);
    ElMessage.error('加载图表失败，请稍后重试');
  }
};

const handleCardClick = (type) => {
  emit('refresh', { cardType: type });
};

// 地图标注点击 → 通知列表打开"场站详情"弹窗
const handleMarkerClick = (item) => {
  if (!item) return;
  emit('refresh', { stationDetail: {
    stationName: item.stationName,
    statusName: item.statusName,
    emptySpace: item.emptySpace,
    coordinate: item.coordinate,
    lon: item.lon,
    lat: item.lat,
  }});
};

// 地址定位（支持坐标字符串、{ coord, name } 对象、或地址名称）
const locateAddress = async (input) => {
  if (!input) {
    ElMessage.warning('地址为空');
    return;
  }
  // 支持 { coord, name } 形式：coord 用于解析经纬度,name 作为 marker 标签
  const coordStr = typeof input === 'object' ? (input.coord || '') : input;
  const displayName = typeof input === 'object' ? (input.name || input.coord || '') : input;

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

  const coordMatch = coordStr.match?.(/^([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)$/);
  if (coordMatch) {
    const lng = parseFloat(coordMatch[1]);
    const lat = parseFloat(coordMatch[2]);
    if (!isNaN(lng) && !isNaN(lat)) {
      mapRef.value.setCenter([lng, lat]);
      mapRef.value.setZoom(15);
      mapRef.value.addTempMarker(lng, lat, `查询位置: ${displayName}`);
      ElMessage.success(`已定位到：${displayName}`);
      return;
    }
  }

  const queryStr = String(displayName || coordStr).trim().toLowerCase();
  const found = mapData.value.find(item => {
    const name = (item.stationName || '').trim().toLowerCase();
    return name === queryStr || (queryStr && name.includes(queryStr));
  });
  if (found && found.coordinate) {
    const [lng, lat] = found.coordinate.split(',');
    const lngNum = parseFloat(lng);
    const latNum = parseFloat(lat);
    if (!isNaN(lngNum) && !isNaN(latNum)) {
      mapRef.value.setCenter([lngNum, latNum]);
      mapRef.value.setZoom(15);
      mapRef.value.addTempMarker(lngNum, latNum, found.stationName);
      ElMessage.success(`已定位到：${found.stationName}`);
      return;
    }
  }

  ElMessage.info(`无法定位"${displayName}"，请手动查找`);
};

const handleLocateEvent = (event) => {
  locateAddress(event.detail);
};

const refresh = () => {
  fetchChartData();
};

const handleResize = () => {
  heatmapChart?.resize();
  mapRef.value?.resize();
};

onMounted(() => {
  fetchChartData();
  window.addEventListener('resize', handleResize);
  window.addEventListener('charge-park-map-locate', handleLocateEvent);
});

onUnmounted(() => {
  heatmapChart?.dispose();
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('charge-park-map-locate', handleLocateEvent);
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
  grid-template-columns: 1fr;
  gap: 12px;
  width: 260px;
  flex-shrink: 0;
}
.stat-card {
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 4px solid;
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
  height: 320px;
  gap: 0;               /* 间隔改为 0，地图与热力图紧贴 */
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
