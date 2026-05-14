<!-- ==================== chart.vue ==================== -->
<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { getEnergyAlarmChart } from '#/api/genchuan/industry/industrialpark/energyMgmt/energyAnalyze/energyAlarm/index.js';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['refresh']);

const state = reactive({
  cardList: [
    { title: '预警总数', value: 0, color: '#4A90E2', key: 'totalAlarm', filter: {} },
    { title: '处置数', value: 0, color: '#50E3C2', key: 'handledAlarm', filter: { handleResult: '已处置' } },
    { title: '未处置数', value: 0, color: '#F5A623', key: 'unhandledAlarm', filter: { handleResult: '未处置' } },
    { title: '能耗节约量(kWh)', value: 0, color: '#D0024B', key: 'totalSaveEnergy', filter: {} },
  ],
  alarmTypePieData: [],
  handleResultPieData: [],
});

const typePieChartRef = ref(null);
const resultPieChartRef = ref(null);
let typePieChart = null;
let resultPieChart = null;

const fetchChartData = async () => {
  try {
    const data = await getEnergyAlarmChart({ timeRange: '近30天' });
    if (data) {
      state.cardList[0].value = data.totalAlarm ?? 0;
      state.cardList[1].value = data.handledAlarm ?? 0;
      state.cardList[2].value = data.unhandledAlarm ?? 0;
      state.cardList[3].value = (data.totalSaveEnergy ?? 0).toFixed(1);
      state.alarmTypePieData = data.alarmTypePie || [];
      state.handleResultPieData = data.handleResultPie || [];
      initPieCharts();
    }
  } catch (error) {
    console.error('获取预警态势失败', error);
    ElMessage.error('加载预警图表失败');
  }
};

const getPieOption = (data, title) => ({
  backgroundColor: 'transparent',
  title: { text: title, left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
  series: [{
    type: 'pie',
    radius: '55%',
    center: ['50%', '55%'],
    data: data,
    emphasis: { scale: true },
    label: { show: true, formatter: '{b}: {d}%' },
  }],
});

const initPieCharts = () => {
  if (typePieChartRef.value) {
    if (typePieChart) typePieChart.dispose();
    typePieChart = echarts.init(typePieChartRef.value);
    typePieChart.setOption(getPieOption(state.alarmTypePieData, '预警类型占比'));
    typePieChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const alarmType = params.name;
        if (alarmType) emit('refresh', { alarmType });
      }
    });
  }
  if (resultPieChartRef.value) {
    if (resultPieChart) resultPieChart.dispose();
    resultPieChart = echarts.init(resultPieChartRef.value);
    resultPieChart.setOption(getPieOption(state.handleResultPieData, '处置结果占比'));
    resultPieChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const handleResult = params.name;
        if (handleResult) emit('refresh', { handleResult });
      }
    });
  }
};

const handleCardClick = (index) => {
  const card = state.cardList[index];
  const filter = { ...card.filter };
  if (card.key === 'totalAlarm' || card.key === 'totalSaveEnergy') {
    emit('refresh', {});
  } else {
    emit('refresh', filter);
  }
};

const refresh = () => { fetchChartData(); };
defineExpose({ refresh });

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('alarm-stats-refresh', refresh);
    window.addEventListener('resize', () => {
      typePieChart?.resize();
      resultPieChart?.resize();
    });
  });
});

onUnmounted(() => {
  window.removeEventListener('alarm-stats-refresh', refresh);
  typePieChart?.dispose();
  resultPieChart?.dispose();
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
        <div ref="typePieChartRef" class="chart-container"></div>
      </div>
      <div class="chart-box">
        <div ref="resultPieChartRef" class="chart-container"></div>
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
