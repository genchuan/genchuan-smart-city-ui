<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getInspectPlanChart } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectPlan';
import BarClick from '#/genchuan-components/stats/barClick.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import { getMockChartData } from './data';

const emit = defineEmits(['statusFilter', 'trendFilter', 'typeFilter']);

const state = reactive({
  cardList: [
    {
      title: '计划数',
      value: 0,
      desc: '全部计划',
      status: '',
      color: '#2f80ed',
    },
    {
      title: '执行完成率',
      value: '0%',
      desc: '已完成计划',
      status: '已完成',
      color: '#27ae60',
    },
  ],
  trendData: [],
  typeData: [],
});

const trendXData = computed(() => state.trendData.map((item) => item.time));
const trendSeriesData = computed(() => [
  {
    name: '创建计划',
    data: state.trendData.map((item) => item.createCount),
    color: '#2f80ed',
  },
  {
    name: '完成计划',
    data: state.trendData.map((item) => item.finishCount),
    color: '#27ae60',
  },
]);
const typeXData = computed(() => state.typeData.map((item) => item.typeName));
const typeSeriesData = computed(() => [
  {
    name: '计划数量',
    data: state.typeData.map((item) => item.count),
  },
]);

function formatRate(value) {
  const numberValue = Number(value || 0);
  if (numberValue <= 1) {
    return `${Math.round(numberValue * 100)}%`;
  }
  return `${Math.round(numberValue)}%`;
}

function normalizeChartData(data) {
  const chartData =
    data?.trendData || data?.typeData || data?.cardData
      ? data
      : getMockChartData();
  const cardData = chartData.cardData || {};

  state.cardList[0].value = cardData.planCount ?? 0;
  state.cardList[1].value = formatRate(cardData.finishRate);
  state.trendData = Array.isArray(chartData.trendData)
    ? chartData.trendData
    : [];
  state.typeData = Array.isArray(chartData.typeData) ? chartData.typeData : [];
}

async function fetchChartData() {
  try {
    const response = await getInspectPlanChart();
    normalizeChartData(response);
  } catch (error) {
    console.error('获取巡检计划统计失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }
}

function handleCardClick(card) {
  emit('statusFilter', card.status || '');
}

function handleTrendClick(payload) {
  if (payload?.categoryName) {
    emit('trendFilter', payload.categoryName);
  }
}

function handleTypeClick(typeName) {
  emit('typeFilter', typeName);
}

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="inspect-plan-visualization">
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
        <LineChartClick
          title="计划执行趋势"
          :series-data="trendSeriesData"
          :x-data="trendXData"
          y-name="计划数"
          @line-click="handleTrendClick"
        />
      </div>
      <div class="chart-wrapper">
        <BarClick
          title="计划类型分布"
          :series-data="typeSeriesData"
          :x-data="typeXData"
          y-name="计划数"
          @bar-click="handleTypeClick"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.inspect-plan-visualization {
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
