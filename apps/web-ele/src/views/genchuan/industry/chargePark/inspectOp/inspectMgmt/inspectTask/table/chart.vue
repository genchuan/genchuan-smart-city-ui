<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getInspectTaskChart } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectTask';
import BarClick from '#/genchuan-components/stats/barClick.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import { getMockChartData } from './data';

const emit = defineEmits(['statusFilter', 'trendFilter', 'typeFilter']);

const state = reactive({
  cardList: [
    {
      title: '待处理任务数',
      value: 0,
      desc: '待派发/待认领/处理中',
      status: '处理中',
      color: '#f59e0b',
    },
    {
      title: '已完成任务数',
      value: 0,
      desc: '已完成',
      status: '已完成',
      color: '#27ae60',
    },
  ],
  typeData: [],
  trendData: [],
});

const typeXData = computed(() => state.typeData.map((item) => item.typeName));
const typeSeriesData = computed(() => [
  {
    name: '任务数量',
    data: state.typeData.map((item) => item.count),
  },
]);
const trendXData = computed(() => state.trendData.map((item) => item.time));
const trendSeriesData = computed(() => [
  {
    name: '平均处理时效',
    data: state.trendData.map((item) => item.avgHandleTime),
    color: '#2f80ed',
  },
]);

function normalizeChartData(data) {
  const chartData =
    data?.typeData || data?.trendData || data?.cardData
      ? data
      : getMockChartData();
  const cardData = chartData.cardData || {};

  state.cardList[0].value = cardData.waitTaskCount ?? 0;
  state.cardList[1].value = cardData.finishTaskCount ?? 0;
  state.typeData = Array.isArray(chartData.typeData) ? chartData.typeData : [];
  state.trendData = Array.isArray(chartData.trendData)
    ? chartData.trendData
    : [];
}

async function fetchChartData() {
  try {
    const response = await getInspectTaskChart();
    normalizeChartData(response);
  } catch (error) {
    console.error('获取巡检任务统计失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }
}

function handleCardClick(card) {
  emit('statusFilter', card.status);
}

function handleTypeClick(typeName) {
  emit('typeFilter', typeName);
}

function handleTrendClick(payload) {
  if (payload?.categoryName) {
    emit('trendFilter', payload.categoryName);
  }
}

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="inspect-task-visualization">
    <div class="cards-section">
      <IndicatorClick
        v-for="card in state.cardList"
        :key="card.title"
        :color="card.color"
        :desc="card.desc"
        :status="card.status"
        :title="card.title"
        :value="card.value"
        @click="handleCardClick"
      />
    </div>

    <div class="charts-section">
      <div class="chart-wrapper">
        <BarClick
          title="任务类型分布"
          :series-data="typeSeriesData"
          :x-data="typeXData"
          y-name="任务数"
          @bar-click="handleTypeClick"
        />
      </div>
      <div class="chart-wrapper">
        <LineChartClick
          title="任务处理时效"
          :series-data="trendSeriesData"
          :x-data="trendXData"
          y-name="分钟"
          @line-click="handleTrendClick"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.inspect-task-visualization {
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
  gap: 12px;
  width: 240px;
  height: 320px;
}

.charts-section {
  display: grid;
  flex: 1 1 0;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 20px;
  min-width: 0;
  height: 320px;
}

.chart-wrapper {
  min-width: 0;
  height: 100%;
}
</style>
