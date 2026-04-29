<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getInspectUserChart } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectUser';
import BarClick from '#/genchuan-components/stats/barClick.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';

import { getMockChartData } from './data';

const emit = defineEmits(['areaFilter', 'onlineFilter', 'statusFilter']);

const state = reactive({
  cardList: [
    {
      title: '人员数',
      value: 0,
      desc: '全部巡检人员',
      filterType: 'all',
      color: '#2f80ed',
    },
    {
      title: '在线人员数',
      value: 0,
      desc: '当前在线人员',
      filterType: 'online',
      color: '#27ae60',
    },
  ],
  areaData: [],
});

const areaXData = computed(() => state.areaData.map((item) => item.areaName));
const areaSeriesData = computed(() => [
  {
    name: '人员数量',
    data: state.areaData.map((item) => item.count),
  },
]);

function normalizeAreaData(areaData) {
  if (!Array.isArray(areaData)) return [];
  return areaData.map((item) => ({
    areaName: item.areaName || item.area || '-',
    count: Number(item.count || item.userCount || 0),
  }));
}

function normalizeChartData(data) {
  const chartData =
    data?.areaData || data?.cardData ? data : getMockChartData();
  const cardData = chartData.cardData || {};

  state.cardList[0].value = cardData.userCount ?? 0;
  state.cardList[1].value = cardData.onlineUserCount ?? 0;
  state.areaData = normalizeAreaData(chartData.areaData);
}

async function fetchChartData() {
  try {
    const response = await getInspectUserChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取巡检人员统计失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }
}

function handleCardClick(card) {
  if (card.status === 'online') {
    emit('onlineFilter', '1');
    return;
  }
  emit('statusFilter', '');
}

function handleAreaClick(areaName) {
  if (areaName) {
    emit('areaFilter', areaName);
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
        :status="card.filterType"
        :title="card.title"
        :value="card.value"
        @click="handleCardClick"
      />
    </div>

    <BarClick
      class="simple-bar-chart"
      title="人员区域分布"
      :series-data="areaSeriesData"
      :x-data="areaXData"
      y-name="人员数"
      @bar-click="handleAreaClick"
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
