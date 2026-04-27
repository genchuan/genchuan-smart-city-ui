<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getAssetCheckChart } from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/assetCheck';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import { getMockChartData } from './data';

const emit = defineEmits(['statusFilter', 'trendFilter']);

const state = reactive({
  cardList: [
    {
      title: '盘点数',
      value: 0,
      desc: '全部盘点',
      status: '',
      color: '#2f80ed',
    },
    {
      title: '盘点完成率',
      value: '0%',
      desc: '已完成盘点',
      status: '已完成',
      color: '#27ae60',
    },
  ],
  trendData: [],
});

const trendXData = computed(() => state.trendData.map((item) => item.time));
const trendSeriesData = computed(() => [
  {
    name: '盘点进度',
    data: state.trendData.map((item) => item.progress),
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

  state.cardList[0].value = cardData.checkCount ?? 0;
  state.cardList[1].value = formatRate(cardData.checkFinishRate);
  state.trendData = Array.isArray(chartData.trendData)
    ? chartData.trendData
    : [];
}

async function fetchChartData() {
  try {
    const response = await getAssetCheckChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取资产盘点统计失败，使用静态数据:', error);
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

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="park-chart-box">
    <div class="chart-box-left">
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

    <LineChartClick
      class="simple-bar-chart"
      title="盘点进度趋势"
      :series-data="trendSeriesData"
      :x-data="trendXData"
      y-name="进度(%)"
      @line-click="handleTrendClick"
    />
  </div>
</template>
