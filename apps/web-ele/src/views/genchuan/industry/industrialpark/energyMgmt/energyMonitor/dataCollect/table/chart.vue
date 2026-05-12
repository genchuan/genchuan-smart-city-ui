<!-- chart.vue - 能耗数据实时采集图表 -->
<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { getEnergyCollectChart } from '#/api/genchuan/industry/industrialpark/energyMgmt/energyMonitor/dataCollect/index.js';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['refresh']);

const state = reactive({
  cardList: [
    { title: '采集设备数', value: 0, color: '#4A90E2', key: 'deviceCount' },
    { title: '正常采集数', value: 0, color: '#50E3C2', key: 'normalCount' },
    { title: '异常采集数', value: 0, color: '#F5A623', key: 'exceptionCount' },
    { title: '总能耗值', value: 0, color: '#E94F6F', key: 'totalEnergy' },
  ],
  realTimeTrend: [],
  periodTrend: [],
});

const lineChartRef = ref(null);
const barChartRef = ref(null);
let lineChart = null;
let barChart = null;

const fetchChartData = async () => {
  try {
    const data = await getEnergyCollectChart({ timeRange: '最近24小时' });
    if (data) {
      state.cardList[0].value = data.deviceCount ?? 0;
      state.cardList[1].value = data.normalCount ?? 0;
      state.cardList[2].value = data.exceptionCount ?? 0;
      state.cardList[3].value = data.totalEnergy ?? 0;
      state.realTimeTrend = data.realTimeTrend || [];
      state.periodTrend = data.periodTrend || [];
      initCharts();
    }
  } catch (error) {
    console.error('获取能耗统计数据失败', error);
    ElMessage.error('加载统计图表失败');
  }
};

const getLineOption = () => ({
  backgroundColor: 'transparent',
  title: { text: '实时能耗采集趋势', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', formatter: '{b}<br/>能耗值: {c} kWh' },
  xAxis: { type: 'category', data: state.realTimeTrend.map(item => item.time), axisLabel: { rotate: 0 } },
  yAxis: { type: 'value', name: '能耗（kWh）' },
  series: [{
    name: '能耗', type: 'line', data: state.realTimeTrend.map(item => item.value), smooth: true,
    lineStyle: { width: 3, color: '#4A90E2' },
    areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(74,144,226,0.3)' }, { offset: 1, color: 'rgba(74,144,226,0.05)' }
      ]) },
    symbol: 'circle', symbolSize: 6,
  }]
});

const getBarOption = () => ({
  backgroundColor: 'transparent',
  title: { text: '分时段能耗趋势', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: { type: 'category', data: state.periodTrend.map(item => item.time) },
  yAxis: { type: 'value', name: '能耗（kWh）' },
  series: [{
    name: '能耗', type: 'bar', data: state.periodTrend.map(item => item.value),
    itemStyle: { borderRadius: [4,4,0,0], color: '#4A90E2' },
  }]
});

const initCharts = () => {
  if (lineChartRef.value) {
    if (lineChart) lineChart.dispose();
    lineChart = echarts.init(lineChartRef.value);
    lineChart.setOption(getLineOption());
    lineChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const timePoint = state.realTimeTrend[params.dataIndex]?.time;
        if (timePoint) emit('refresh', { collectTime: timePoint });
      }
    });
  }
  if (barChartRef.value) {
    if (barChart) barChart.dispose();
    barChart = echarts.init(barChartRef.value);
    barChart.setOption(getBarOption());
    barChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const period = state.periodTrend[params.dataIndex]?.time;
        if (period) emit('refresh', { period });
      }
    });
  }
};

const handleResize = () => {
  lineChart?.resize();
  barChart?.resize();
};

const handleCardClick = (index) => {
  const card = state.cardList[index];
  // 卡片钻取：按对应状态过滤设备列表
  if (card.key === 'deviceCount') emit('refresh', { allDevices: true });
  else if (card.key === 'normalCount') emit('refresh', { collectStatus: '采集正常' });
  else if (card.key === 'exceptionCount') emit('refresh', { collectStatus: '采集异常' });
  else if (card.key === 'totalEnergy') emit('refresh', { totalEnergy: true });
};

const refreshStats = () => {
  fetchChartData();
};

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('resize', handleResize);
    window.addEventListener('energy-stats-refresh', refreshStats);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('energy-stats-refresh', refreshStats);
  lineChart?.dispose();
  barChart?.dispose();
});
</script>

<template>
  <div class="stats-four-visualization">
    <div class="cards-section">
      <div v-for="(card, index) in state.cardList" :key="index" class="stat-card" :style="{ borderLeftColor: card.color, cursor: 'pointer' }" @click="handleCardClick(index)">
        <div class="card-header"><span class="card-title">{{ card.title }}</span><div class="card-indicator" :style="{ backgroundColor: card.color }"></div></div>
        <div class="card-body"><div class="card-value" :style="{ color: card.color }">{{ card.value }}</div></div>
      </div>
    </div>
    <div class="right-section">
      <div class="chart-box"><div ref="lineChartRef" class="chart-container"></div></div>
      <div class="chart-box"><div ref="barChartRef" class="chart-container"></div></div>
    </div>
  </div>
</template>

<style scoped>
.stats-four-visualization { display: flex; gap: 20px; width: 100%; min-height: 320px; }
.cards-section { display: grid; grid-template-columns: 1fr; gap: 12px; width: 260px; flex-shrink: 0; }
.stat-card { padding: 12px 14px; border-radius: 8px; border-left: 4px solid #4a90e2; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.card-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.card-title { font-size: 13px; color: #6e7e91; font-weight: 600; }
.card-indicator { width: 8px; height: 8px; border-radius: 50%; }
.card-body { flex:1; display: flex; align-items: center; }
.card-value { font-size: 22px; font-weight: 700; }
.right-section { flex:1; display: flex; gap: 16px; height: 320px; }
.chart-box { flex:1; height: 100%; border-radius: 8px; background-color: var(--el-bg-color, #fff); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.chart-container { width: 100%; height: 100%; }
</style>
