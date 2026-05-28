<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getHandoverLogChart } from '#/api/genchuan/industry/chargePark/inspectOp/scheduleMgmt/handoverLog';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import { getHandoverStatusOptionValue, getMockChartData } from './data';

const emit = defineEmits(['statusFilter', 'trendFilter']);

const state = reactive({
  cardList: [
    {
      title: '日志数',
      value: 0,
      desc: '全部日志',
      status: '',
      color: '#2f80ed',
    },
    {
      title: '确认率',
      value: '0%',
      desc: '已确认日志',
      status: getHandoverStatusOptionValue('已确认'),
      color: '#27ae60',
    },
  ],
  trendData: [],
});

const trendXData = computed(() => state.trendData.map((item) => item.time));
const trendSeriesData = computed(() => [
  {
    name: '日志数量',
    data: state.trendData.map((item) => item.logCount),
    color: '#2f80ed',
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
    data?.trendData || data?.cardData ? data : getMockChartData();
  const cardData = chartData.cardData || {};

  state.cardList[0].value = cardData.logCount ?? 0;
  state.cardList[1].value = formatRate(cardData.confirmRate);
  state.trendData = Array.isArray(chartData.trendData)
    ? chartData.trendData
    : [];
}

async function fetchChartData() {
  try {
    const response = await getHandoverLogChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取交接日志统计失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }
}

function handleCardClick(card) {
  emit('statusFilter', card.status || '');
}

function handleTrendClick(payload) {
  if (payload?.categoryName) {
    // const time = new Date(`${payload.categoryName} 00:00:00`)?.getTime();
    emit('trendFilter', payload.categoryName);
  }
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
      title="日志量趋势"
      class="simple-bar-chart"
      :series-data="trendSeriesData"
      :x-data="trendXData"
      y-name="日志数"
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
