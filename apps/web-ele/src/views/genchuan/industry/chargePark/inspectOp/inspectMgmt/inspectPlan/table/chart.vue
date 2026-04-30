<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getInspectPlanChart } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectPlan';
import BarClick from '#/genchuan-components/stats/barClick.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import { getMockChartData, getPlanTypeLabel } from './data';

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
const typeXData = computed(() =>
  state.typeData.map((item) => getPlanTypeLabel(item.typeName)),
);
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
    normalizeChartData(response?.data || response);
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
  <div class="park-chart-box">
    <div class="chart-box-left">
      <IndicatorClick
        v-for="card in state.cardList"
        class="left-card"
        :key="card.title"
        :color="card.color"
        :desc="card.desc"
        :status="card.status"
        :title="card.title"
        :value="card.value"
        @click="handleCardClick"
      />
    </div>

    <LineChartClick
      class="simple-bar-chart"
      title="计划执行趋势"
      :series-data="trendSeriesData"
      :x-data="trendXData"
      y-name="计划数"
      @line-click="handleTrendClick"
    />
    <BarClick
      class="park-type-chart"
      title="计划类型分布"
      :series-data="typeSeriesData"
      :x-data="typeXData"
      y-name="计划数"
      @bar-click="handleTypeClick"
    />
  </div>
</template>
<style lang="scss">
.chart-box-left {
  .left-card {
    height: 159px !important;
  }
}
</style>
