<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getAssetInfoChart } from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/assetInfo';
import BarClick from '#/genchuan-components/stats/barClick.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';

import { getMockChartData } from './data';

const emit = defineEmits(['statusFilter', 'typeFilter']);

const state = reactive({
  cardList: [
    {
      title: '总资产',
      value: 0,
      desc: '全部资产',
      status: '',
      color: '#2f80ed',
    },
    {
      title: '正常资产',
      value: 0,
      desc: '状态正常',
      status: '正常',
      color: '#27ae60',
    },
  ],
  typeData: [],
});

const typeXData = computed(() => state.typeData.map((item) => item.typeName));
const typeSeriesData = computed(() => [
  {
    name: '资产数量',
    data: state.typeData.map((item) => item.count),
  },
]);

function normalizeChartData(data) {
  const chartData =
    data?.typeData || data?.cardData ? data : getMockChartData();
  const cardData = chartData.cardData || {};

  state.cardList[0].value = cardData.totalAsset ?? 0;
  state.cardList[1].value = cardData.normalAsset ?? 0;
  state.typeData = Array.isArray(chartData.typeData) ? chartData.typeData : [];
}

async function fetchChartData() {
  try {
    const response = await getAssetInfoChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取资产信息统计失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }
}

function handleCardClick(card) {
  emit('statusFilter', card.status || '');
}

function handleTypeClick(typeName) {
  emit('typeFilter', typeName);
}

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="asset-info-visualization">
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
          title="资产类型分布"
          :series-data="typeSeriesData"
          :x-data="typeXData"
          y-name="资产数"
          @bar-click="handleTypeClick"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.asset-info-visualization {
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
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
  min-width: 0;
  height: 320px;
}

.chart-wrapper {
  min-width: 0;
  height: 100%;
}
</style>
