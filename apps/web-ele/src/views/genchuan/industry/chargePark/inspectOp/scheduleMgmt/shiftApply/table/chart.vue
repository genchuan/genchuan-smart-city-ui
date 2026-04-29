<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getShiftApplyChart } from '#/api/genchuan/industry/chargePark/inspectOp/scheduleMgmt/shiftApply';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import { getMockChartData } from './data';

const emit = defineEmits(['statusFilter', 'trendFilter']);
const state = reactive({
  cardList: [
    {
      title: '申请量',
      value: 0,
      desc: '全部申请',
      status: '',
      color: '#2f80ed',
    },
    {
      title: '审核通过率',
      value: '0%',
      desc: '已通过申请',
      status: '已通过',
      color: '#27ae60',
    },
  ],
  trendData: [],
});
const trendXData = computed(() => state.trendData.map((item) => item.time));
const trendSeriesData = computed(() => [
  {
    name: '申请量',
    data: state.trendData.map((item) => item.applyCount),
    color: '#2f80ed',
  },
]);
function formatRate(value) {
  const numberValue = Number(value || 0);
  return numberValue <= 1
    ? `${String(Math.round(numberValue * 100))}%`
    : `${String(Math.round(numberValue))}%`;
}
function normalizeChartData(data) {
  const chartData =
    data?.trendData || data?.cardData ? data : getMockChartData();
  const cardData = chartData.cardData || {};
  state.cardList[0].value = cardData.applyCount ?? 0;
  state.cardList[1].value = formatRate(cardData.auditPassRate);
  state.trendData = Array.isArray(chartData.trendData)
    ? chartData.trendData
    : [];
}
async function fetchChartData() {
  try {
    const response = await getShiftApplyChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取换班申请统计失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }
}
function handleCardClick(card) {
  emit('statusFilter', card.status || '');
}
function handleTrendClick(payload) {
  if (payload?.categoryName) emit('trendFilter', payload.categoryName);
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
    <!-- class="simple-bar-chart" -->
    <LineChartClick
      title="申请量趋势"
      class="simple-bar-chart"
      :series-data="trendSeriesData"
      :x-data="trendXData"
      y-name="申请量"
      @line-click="handleTrendClick"
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
