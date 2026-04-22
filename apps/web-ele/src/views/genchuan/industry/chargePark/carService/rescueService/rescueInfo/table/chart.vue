<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { getRescueChartData } from '#/api/genchuan/industry/chargePark/carService/rescueService/rescueInfo/index.js';
import MapComponent from '#/views/genchuan/industry/chargePark/carService/Mapindex.vue';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['refresh']);

const state = reactive({
  cardList: [
    { title: '待救援数', value: 0, color: '#FF9F40', statusKeys: ['待派发', '待认领'] },
    { title: '救援完成率', value: '0%', color: '#50E3C2', statusKeys: ['已完成'] },
  ],
  mapData: [],
  mapConfig: {
    statusIconMap: { 待派发: 'yellow', 待认领: 'yellow', 处理中: 'red', 已完成: 'normal' },
    statusKeyMap: { 待派发: 'yellow', 待认领: 'yellow', 处理中: 'red', 已完成: 'normal' },
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

// 获取图表数据
const fetchChartData = async () => {
  try {
    const data = await getRescueChartData({ timeRange: '近30天' });
    if (data) {
      state.cardList[0].value = data.waitRescueCount ?? 0;
      let finishRateValue = data.finishRate ?? 0;
      if (finishRateValue > 0 && finishRateValue <= 1) {
        finishRateValue = (finishRateValue * 100).toFixed(1);
      }
      state.cardList[1].value = `${finishRateValue}%`;
      state.trendList = data.trendList || [];

      const rawList = data.rescueLocationList || [];
      state.mapData = rawList.map(item => ({
        id: item.id,
        deviceName: `救援任务${item.id}`,
        coordinate: `${item.lon},${item.lat}`,
        statusName: item.status,
        location: item.location,
      }));
      initLineChart();
    }
  } catch (error) {
    console.error('获取救援统计图表数据失败', error);
    ElMessage.error('加载统计图表失败，请稍后重试');
    initLineChart();
  }
};

// 折线图配置
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
  lineChartInstance.on('click', (params) => {
    if (params.componentType === 'series') {
      const date = state.trendList[params.dataIndex]?.date;
      if (date) emit('refresh', { date });
    }
  });
};

const handleResize = () => lineChartInstance?.resize();

const handleCardClick = (index) => {
  const card = state.cardList[index];
  if (card?.statusKeys) emit('refresh', { statusList: card.statusKeys });
};

const handleMarkerClick = (item) => {
  if (item?.id) emit('refresh', { id: item.id });
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

// 地址定位（增强：支持经纬度字符串和地址文本）
const locateAddress = async (address) => {
  if (!address) {
    ElMessage.warning('地址为空');
    return;
  }

  // 等待地图组件就绪
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

  // 1. 判断是否为经纬度字符串（格式如 "118.189567,24.512345" 或 "118.189567, 24.512345"）
  const coordMatch = address.match(/^([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)$/);
  if (coordMatch) {
    const lngNum = parseFloat(coordMatch[1]);
    const latNum = parseFloat(coordMatch[2]);
    if (!isNaN(lngNum) && !isNaN(latNum)) {
      mapRef.value.setCenter([lngNum, latNum]);
      mapRef.value.setZoom(15);
      ElMessage.success(`已定位到坐标：${lngNum}, ${latNum}`);
      return;
    }
  }

  // 2. 否则作为地址文本处理：从现有地图数据中查找坐标
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
      ElMessage.success(`已定位到：${found.location}`);
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

const handleLocateAddress = (event) => {
  const address = event.detail;
  if (address) locateAddress(address);
};

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('resize', handleResize);
    window.addEventListener('rescue-data-changed', handleDataChange);
    window.addEventListener('locate-address', handleLocateAddress);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('rescue-data-changed', handleDataChange);
  window.removeEventListener('locate-address', handleLocateAddress);
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
      <div class="stat-card-placeholder" v-for="i in 2" :key="`placeholder-${i}`"></div>
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
/* 样式保持不变，略... */
.stats-four-visualization {
  display: flex;
  gap: 20px;
  width: 100%;
  min-height: 320px;
  overflow: hidden;
}
.cards-section {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto ;
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
}
.map-wrapper {
  position: relative;
  width: 50%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}
.area-filter-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
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
