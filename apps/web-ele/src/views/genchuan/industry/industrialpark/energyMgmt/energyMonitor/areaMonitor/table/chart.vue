<!-- chart.vue - 分区能耗分布态势（左侧卡片 + 中间双柱状图 + 右侧地图） -->
<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { getAreaMonitorChart } from '#/api/genchuan/industry/industrialPark/energyMgmt/energyMonitor/areaMonitor/index.js';
import { ElMessage } from 'element-plus';
import MapComponent from './Mapindex.vue';

const emit = defineEmits(['refresh']);

const state = reactive({
  cardList: [
    { title: '区域总数', value: 0, color: '#4A90E2', key: 'totalAreas' },
    { title: '正常能耗区域', value: 0, color: '#50E3C2', key: 'normalCount' },
    { title: '异常能耗区域', value: 0, color: '#F5A623', key: 'exceptionCount' },
    { title: '总能耗(kWh)', value: 0, color: '#D0024B', key: 'totalEnergy' },
  ],
  // 地图标记数据
  mapData: [],
  mapConfig: {
    infoWindowConfig: {
      title: 'name',
      fields: [
        { key: 'name', label: '区域名称' },
        { key: 'energy', label: '能耗总量(kWh)' },
        { key: 'statusText', label: '能耗状态' },
      ],
    },
  },
  // 柱状图数据
  areaEnergyData: [],
  unitEnergyData: [],
});

const mapRef = ref(null);
const barChartRef = ref(null);      // 能耗总量柱状图
const unitBarChartRef = ref(null); // 单位面积能耗柱状图
let barChart = null;
let unitBarChart = null;

// 获取图表数据（含地图）
const fetchChartData = async () => {
  try {
    const data = await getAreaMonitorChart({ timeRange: '近30天' });
    if (data) {
      // 卡片数据
      state.cardList[0].value = data.totalAreas ?? 0;
      state.cardList[1].value = data.normalCount ?? 0;
      state.cardList[2].value = data.exceptionCount ?? 0;
      state.cardList[3].value = (data.totalEnergy ?? 0).toFixed(1);

      // 柱状图数据
      state.areaEnergyData = data.areaEnergyBar || [];
      state.unitEnergyData = data.unitEnergyBar || [];

      // 地图数据：转换为标记所需格式
      state.mapData = (data.areaMapData || []).map(item => ({
        id: item.areaId,
        areaId: item.areaId,
        coordinate: `${item.lon},${item.lat}`,
        name: item.name,
        energy: item.energy,
        status: item.status,      // 'normal' 或 'exception'
        statusText: item.status === 'normal' ? '正常能耗' : '能耗异常',
      }));

      // 初始化图表
      initBarCharts();
    }
  } catch (error) {
    console.error('获取分区能耗统计数据失败', error);
    ElMessage.error('加载统计图表失败');
  }
};

// 能耗总量柱状图配置
const getEnergyBarOption = () => ({
  backgroundColor: 'transparent',
  title: { text: '各区域能耗总量', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}<br/>能耗总量: {c} kWh' },
  xAxis: { type: 'category', data: state.areaEnergyData.map(item => item.name), axisLabel: { rotate: state.areaEnergyData.length > 4 ? 25 : 0 } },
  yAxis: { type: 'value', name: '能耗总量(kWh)' },
  series: [{
    name: '能耗总量', type: 'bar', data: state.areaEnergyData.map(item => item.value),
    itemStyle: { borderRadius: [4,4,0,0], color: '#4A90E2' },
  }]
});

// 单位面积能耗柱状图配置
const getUnitBarOption = () => ({
  backgroundColor: 'transparent',
  title: { text: '各区域单位面积能耗', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}<br/>单位能耗: {c} kWh/㎡' },
  xAxis: { type: 'category', data: state.unitEnergyData.map(item => item.name), axisLabel: { rotate: state.unitEnergyData.length > 4 ? 25 : 0 } },
  yAxis: { type: 'value', name: '单位能耗(kWh/㎡)' },
  series: [{
    name: '单位面积能耗', type: 'bar', data: state.unitEnergyData.map(item => item.value),
    itemStyle: { borderRadius: [4,4,0,0], color: '#F5A623' },
  }]
});

const initBarCharts = () => {
  if (barChartRef.value) {
    if (barChart) barChart.dispose();
    barChart = echarts.init(barChartRef.value);
    barChart.setOption(getEnergyBarOption());
    // 点击柱状图钻取筛选
    barChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const areaName = state.areaEnergyData[params.dataIndex]?.name;
        if (areaName) emit('refresh', { areaName });
      }
    });
  }
  if (unitBarChartRef.value) {
    if (unitBarChart) unitBarChart.dispose();
    unitBarChart = echarts.init(unitBarChartRef.value);
    unitBarChart.setOption(getUnitBarOption());
    unitBarChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const areaName = state.unitEnergyData[params.dataIndex]?.name;
        if (areaName) emit('refresh', { areaName });
      }
    });
  }
};

// 地图标记点击 → 打开区域详情
const handleMarkerClick = (item) => {
  if (item?.areaId) {
    emit('refresh', { areaId: item.areaId });
  }
};

// 卡片点击筛选
const handleCardClick = (index) => {
  const card = state.cardList[index];
  if (card.key === 'exceptionCount') emit('refresh', { energyStatus: '能耗异常' });
  else if (card.key === 'normalCount') emit('refresh', { energyStatus: '正常能耗' });
  else if (card.key === 'totalAreas') emit('refresh', {});
  else if (card.key === 'totalEnergy') emit('refresh', {});
};

// 刷新方法（供外部调用）
const refresh = () => {
  fetchChartData();
};

defineExpose({ refresh });

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('area-stats-refresh', refresh);
    window.addEventListener('resize', () => {
      barChart?.resize();
      unitBarChart?.resize();
      mapRef.value?.resize();
    });
  });
});

onUnmounted(() => {
  window.removeEventListener('area-stats-refresh', refresh);
  barChart?.dispose();
  unitBarChart?.dispose();
});
</script>

<template>
  <div class="stats-four-visualization">
    <!-- 左侧：卡片区（固定宽度） -->
    <div class="cards-section">
      <div
        v-for="(card, index) in state.cardList"
        :key="index"
        class="stat-card"
        :style="{ borderLeftColor: card.color, cursor: 'pointer' }"
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

    <!-- 中间：两个柱状图并排 -->
    <div class="middle-charts">
      <div class="chart-box">
        <div ref="barChartRef" class="chart-container"></div>
      </div>
      <div class="chart-box">
        <div ref="unitBarChartRef" class="chart-container"></div>
      </div>
    </div>

    <!-- 右侧：地图 -->
    <div class="right-map">
      <MapComponent
        ref="mapRef"
        :data="state.mapData"
        :marker-icons="{
          normal: '/static/imgs/dataHub/map/marker-blue.png',
          exception: '/static/imgs/dataHub/map/marker-red.png'
        }"
        :status-icon-map="{ normal: 'normal', exception: 'exception' }"
        status-key="status"
        :info-window-config="state.mapConfig.infoWindowConfig"
        @marker-click="handleMarkerClick"
      />
    </div>
  </div>
</template>

<style scoped>
/* 整体容器：一行三列，高度与原设计一致（min-height: 320px） */
.stats-four-visualization {
  display: flex;
  gap: 20px;
  width: 100%;
  min-height: 320px;
}

/* 左侧卡片区：宽度260px，竖排4个卡片 */
.cards-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 260px;
  flex-shrink: 0;
}

.stat-card {
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.2s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
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

/* 中间双柱状图区：等宽并排，各占一半 */
.middle-charts {
  flex: 1;
  display: flex;
  gap: 16px;
  min-width: 0; /* 防止溢出 */
}
.chart-box {
  flex: 1;
  background-color: var(--el-bg-color, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 8px;
  display: flex;
  flex-direction: column;
}
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1;
}

/* 右侧地图区：固定宽度400px */
.right-map {
  width: 400px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f7fa;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
</style>
