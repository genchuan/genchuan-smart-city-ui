<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { getReserveChartData } from '#/api/genchuan/industry/chargePark/carService/reserveService/reserveList/index.js';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['refresh']);

const state = reactive({
  cardList: [
    { title: '预约总量', value: 0, color: '#4A90E2', key: 'totalReserveCount' },
    { title: '预约成功率', value: '0%', color: '#50E3C2', key: 'reserveSuccessRate' },
  ],
  trendList: [],
  typeCountList: [],
});

const lineChartRef = ref(null);
const barChartRef = ref(null);
let lineChart = null;
let barChart = null;

const fetchChartData = async () => {
  try {
    const data = await getReserveChartData({ timeRange: '近30天' });
    if (data) {
      state.cardList[0].value = data.totalReserveCount ?? 0;
      let rate = data.reserveSuccessRate ?? 0;
      const percent = rate <= 1 ? (rate * 100).toFixed(1) : rate;
      state.cardList[1].value = `${percent}%`;
      state.trendList = data.reserveTrendList || [];
      state.typeCountList = data.reserveTypeCountList || [];
      initCharts();
    }
  } catch (error) {
    console.error('获取预约统计数据失败', error);
    ElMessage.error('加载统计图表失败');
  }
};

const getLineOption = () => ({
  backgroundColor: 'transparent',
  title: { text: '预约量趋势（近30天）', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', formatter: '{b}<br/>预约数量: {c} 单' },
  xAxis: { type: 'category', data: state.trendList.map(item => item.date), axisLabel: { rotate: state.trendList.length > 8 ? 30 : 0 } },
  yAxis: { type: 'value', name: '预约数量（单）' },
  series: [{
    name: '预约数量', type: 'line', data: state.trendList.map(item => item.count ?? 0), smooth: true,
    lineStyle: { width: 3, color: '#4A90E2' },
    areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(74,144,226,0.3)' }, { offset: 1, color: 'rgba(74,144,226,0.05)' }
      ]) },
    symbol: 'circle', symbolSize: 6,
  }]
});

const getBarOption = () => ({
  backgroundColor: 'transparent',
  title: { text: '预约类型分布', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: { type: 'category', data: state.typeCountList.map(item => item.type || item.reserveType) },
  yAxis: { type: 'value', name: '预约数量' },
  series: [{
    name: '数量', type: 'bar', data: state.typeCountList.map(item => item.count),
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
        const date = state.trendList[params.dataIndex]?.date;
        if (date) emit('refresh', { date });
      }
    });
  }
  if (barChartRef.value) {
    if (barChart) barChart.dispose();
    barChart = echarts.init(barChartRef.value);
    barChart.setOption(getBarOption());
    barChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const typeItem = state.typeCountList[params.dataIndex];
        const type = typeItem?.type || typeItem?.reserveType;
        if (type) emit('refresh', { reserveType: type });
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
  if (card.key === 'totalReserveCount') emit('refresh', { totalReserveCount: true });
  else if (card.key === 'reserveSuccessRate') emit('refresh', { reserveSuccessRate: true });
};

const refreshStats = () => {
  fetchChartData();
};

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('resize', handleResize);
    // 监听表格操作触发的刷新事件
    window.addEventListener('reserve-stats-refresh', refreshStats);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('reserve-stats-refresh', refreshStats);
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
  border-left: 4px solid #4a90e2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.card-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.card-title { font-size: 13px; color: #6e7e91; font-weight: 600; }
.card-indicator { width: 8px; height: 8px; border-radius: 50%; }
.card-body { flex:1; display: flex; align-items: center; }
.card-value { font-size: 22px; font-weight: 700; }
.right-section { flex:1; display: flex; gap: 16px; height: 320px; }
.chart-box { flex:1; height: 100%; border-radius: 8px;   background-color: var(--el-bg-color, #fff);box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.chart-container { width: 100%; height: 100%; }
</style>
