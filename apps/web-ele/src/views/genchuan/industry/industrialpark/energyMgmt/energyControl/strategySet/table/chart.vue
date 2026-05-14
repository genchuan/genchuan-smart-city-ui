<!-- chart.vue -->
<!-- 路径: src/views/genchuan/industry/industrialPark/energyMgmt/energyControl/strategySet/table/chart.vue -->
<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { getStrategyChart } from '#/api/genchuan/industry/industrialpark/energyMgmt/energyControl/strategySet/index.js';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['refresh']);

const state = reactive({
  cardList: [
    { title: '策略总数', value: 0, color: '#4A90E2', key: 'totalStrategy', filter: {} },
    { title: '启用数', value: 0, color: '#50E3C2', key: 'enableStrategy', filter: { strategyStatus: '已启用' } },
    { title: '节能总量(kWh)', value: 0, color: '#F5A623', key: 'totalSaveEnergy', filter: {} },
    { title: '节能率(%)', value: 0, color: '#D0024B', key: 'totalSaveRate', filter: {} },
  ],
  saveTrendData: [],      // 节能效果趋势
  energyDownTrendData: [], // 能耗下降趋势
});

const saveTrendChartRef = ref(null);
const energyDownChartRef = ref(null);
let saveTrendChart = null;
let energyDownChart = null;

const fetchChartData = async () => {
  try {
    const data = await getStrategyChart({ timeRange: '近30天' });
    if (data) {
      state.cardList[0].value = data.totalStrategy ?? 0;
      state.cardList[1].value = data.enableStrategy ?? 0;
      state.cardList[2].value = (data.totalSaveEnergy ?? 0).toFixed(1);
      state.cardList[3].value = (data.totalSaveRate ?? 0).toFixed(1);
      state.saveTrendData = data.saveTrendLine || [];
      state.energyDownTrendData = data.energyDownTrendLine || [];
      initLineCharts();
    }
  } catch (error) {
    console.error('获取策略执行效果失败', error);
    ElMessage.error('加载策略图表失败');
  }
};

const getLineOption = (data, title, yAxisName, lineColor) => ({
  backgroundColor: 'transparent',
  title: { text: title, left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', formatter: '{b}<br/>{c}' },
  xAxis: { type: 'category', data: data.map(item => item.date), axisLabel: { rotate: 30 } },
  yAxis: { type: 'value', name: yAxisName },
  series: [{
    data: data.map(item => item.value),
    type: 'line',
    smooth: true,
    lineStyle: { color: lineColor, width: 2 },
    areaStyle: { opacity: 0.1, color: lineColor },
    symbol: 'circle',
    symbolSize: 6,
  }],
});

const initLineCharts = () => {
  if (saveTrendChartRef.value) {
    if (saveTrendChart) saveTrendChart.dispose();
    saveTrendChart = echarts.init(saveTrendChartRef.value);
    saveTrendChart.setOption(getLineOption(state.saveTrendData, '节能效果趋势', '节能总量(kWh)', '#4A90E2'));
    saveTrendChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const date = state.saveTrendData[params.dataIndex]?.date;
        if (date) emit('refresh', { executeTime: date });
      }
    });
  }
  if (energyDownChartRef.value) {
    if (energyDownChart) energyDownChart.dispose();
    energyDownChart = echarts.init(energyDownChartRef.value);
    energyDownChart.setOption(getLineOption(state.energyDownTrendData, '能耗下降趋势', '下降量(kWh)', '#F5A623'));
    energyDownChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const date = state.energyDownTrendData[params.dataIndex]?.date;
        if (date) emit('refresh', { executeTime: date });
      }
    });
  }
};

const handleCardClick = (index) => {
  const card = state.cardList[index];
  const filter = { ...card.filter };
  emit('refresh', filter);
};

const refresh = () => { fetchChartData(); };
defineExpose({ refresh });

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('strategy-stats-refresh', refresh);
    window.addEventListener('resize', () => {
      saveTrendChart?.resize();
      energyDownChart?.resize();
    });
  });
});

onUnmounted(() => {
  window.removeEventListener('strategy-stats-refresh', refresh);
  saveTrendChart?.dispose();
  energyDownChart?.dispose();
});
</script>

<template>
  <div class="stats-four-visualization">
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
    <div class="middle-charts">
      <div class="chart-box">
        <div ref="saveTrendChartRef" class="chart-container"></div>
      </div>
      <div class="chart-box">
        <div ref="energyDownChartRef" class="chart-container"></div>
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
.middle-charts {
  flex: 1;
  display: flex;
  gap: 16px;
  min-width: 0;
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
</style>
