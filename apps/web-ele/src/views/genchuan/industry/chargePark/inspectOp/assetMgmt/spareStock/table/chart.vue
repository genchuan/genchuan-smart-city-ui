<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getSpareStockChart } from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/spareStock';
import BarClick from '#/genchuan-components/stats/barClick.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import { getMockChartData, getSpareStockStatusOptionValue } from './data';

const emit = defineEmits(['spareFilter', 'statusFilter', 'trendFilter']);

const state = reactive({
  cardList: [
    {
      title: '备件库存',
      value: 0,
      desc: '当前备件库存',
      status: '',
      color: '#2f80ed',
    },
    {
      title: '补货量',
      value: 0,
      desc: '需补货备件',
      status: getSpareStockStatusOptionValue('低库存'),
      color: '#f39c12',
    },
  ],
  stockData: [],
  trendData: [],
});

const trendXData = computed(() => state.trendData.map((item) => item.time));
const trendSeriesData = computed(() => [
  {
    name: '库存数量',
    data: state.trendData.map((item) => item.stockCount),
    color: '#2f80ed',
  },
]);
const stockXData = computed(() =>
  state.stockData.map((item) => item.spareName),
);
const stockSeriesData = computed(() => [
  {
    name: '当前库存',
    data: state.stockData.map((item) => item.currentStock),
  },
]);

function normalizeChartData(data) {
  const chartData =
    data?.trendData || data?.stockData || data?.cardData
      ? data
      : getMockChartData();
  const cardData = chartData.cardData || {};

  state.cardList[0].value = cardData.spareStock ?? 0;
  state.cardList[1].value = cardData.replenishCount ?? 0;
  state.trendData = Array.isArray(chartData.trendData)
    ? chartData.trendData
    : [];
  state.stockData = Array.isArray(chartData.stockData)
    ? chartData.stockData
    : [];
}

async function fetchChartData() {
  try {
    const response = await getSpareStockChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取备件仓储统计失败，使用静态数据:', error);
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

function handleStockClick(spareName) {
  emit('spareFilter', spareName);
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
      title="库存趋势"
      :series-data="trendSeriesData"
      :x-data="trendXData"
      y-name="库存数"
      @line-click="handleTrendClick"
    />
    <BarClick
      class="park-type-chart"
      title="备件库存分布"
      :series-data="stockSeriesData"
      :x-data="stockXData"
      y-name="库存数"
      @bar-click="handleStockClick"
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
