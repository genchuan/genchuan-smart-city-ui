<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getInspectOpReportChart } from '#/api/genchuan/industry/chargePark/inspectOp/decisionAnalysis/inspectOpReport';
import BarClick from '#/genchuan-components/stats/barClick.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import { formatRate, getMockChartData } from './data';

const emit = defineEmits(['metricFilter', 'taskFilter', 'trendFilter']);
const state = reactive({
  cardList: [
    {
      title: '任务完成率',
      value: '0%',
      desc: '全部任务',
      metricKey: 'taskFinishRate',
      color: '#2f80ed',
    },
    {
      title: '报表处理率',
      value: '0%',
      desc: '全部上报',
      metricKey: 'reportProcessRate',
      color: '#27ae60',
    },
    {
      title: '告警处置率',
      value: '0%',
      desc: '告警处置',
      metricKey: 'alarmHandleRate',
      color: '#f2994a',
    },
    {
      title: '巡检效率',
      value: '0%',
      desc: '巡检效能',
      metricKey: 'inspectEfficiency',
      color: '#eb5757',
    },
  ],
  trendData: [],
  taskData: [],
});
const trendXData = computed(() => state.trendData.map((item) => item.time));
const trendSeriesData = computed(() => [
  {
    name: '任务数',
    data: state.trendData.map((item) => item.taskCount),
    color: '#2f80ed',
  },
  {
    name: '上报数',
    data: state.trendData.map((item) => item.reportCount),
    color: '#27ae60',
  },
  {
    name: '告警数',
    data: state.trendData.map((item) => item.alarmCount),
    color: '#eb5757',
  },
]);
const taskXData = computed(() => state.taskData.map((item) => item.taskType));
const taskSeriesData = computed(() => [
  { name: '任务数', data: state.taskData.map((item) => item.count) },
]);
function normalizeChartData(data) {
  const chartData =
    data?.trendData || data?.taskData || data?.cardData
      ? data
      : getMockChartData();
  const cardData = chartData.cardData || {};
  state.cardList[0].value = formatRate(cardData.taskFinishRate);
  state.cardList[1].value = formatRate(cardData.reportProcessRate);
  state.cardList[2].value = formatRate(cardData.alarmHandleRate);
  state.cardList[3].value = formatRate(cardData.inspectEfficiency);
  state.trendData = Array.isArray(chartData.trendData)
    ? chartData.trendData
    : [];
  state.taskData = Array.isArray(chartData.taskData) ? chartData.taskData : [];
}
async function fetchChartData() {
  try {
    const response = await getInspectOpReportChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取运维运营分析失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }
}
function handleCardClick(card) {
  emit('metricFilter', card.metricKey);
}
function handleTrendClick(payload) {
  if (payload?.categoryName) emit('trendFilter', payload.categoryName);
}
function handleTaskClick(taskType) {
  emit('taskFilter', taskType);
}
onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="inspect-report-visualization">
    <div class="cards-section">
      <IndicatorClick
        v-for="card in state.cardList"
        :key="card.title"
        :color="card.color"
        :desc="card.desc"
        :status="card.metricKey"
        :title="card.title"
        :value="card.value"
        @click="handleCardClick"
      />
    </div>
    <div class="chart-wrapper">
      <LineChartClick
        title="运维运营趋势"
        :series-data="trendSeriesData"
        :x-data="trendXData"
        y-name="任务数"
        @line-click="handleTrendClick"
      />
    </div>
    <div class="chart-wrapper task-chart">
      <BarClick
        title="运维任务分布"
        :series-data="taskSeriesData"
        :x-data="taskXData"
        y-name="任务数"
        @bar-click="handleTaskClick"
      />
    </div>
  </div>
</template>

<style scoped>
.inspect-report-visualization {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  width: 100%;
  min-height: 320px;
  overflow: hidden;
}

.cards-section {
  display: grid;
  flex-shrink: 0;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  width: 360px;
  height: 320px;
}

.chart-wrapper {
  flex: 1 1 0;
  min-width: 0;
  height: 320px;
}

.task-chart {
  flex: 0.9 1 0;
}
</style>
