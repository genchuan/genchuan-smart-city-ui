<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getOilMonitorChart } from '#/api/genchuan/industry/chargePark/inspectOp/deviceMonitor/oilMonitor';
import BarClick from '#/genchuan-components/stats/barClick.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import { getMockChartData, getStationName } from './data';

const emit = defineEmits(['statusFilter', 'stationFilter', 'trendFilter']);

const state = reactive({
  cardList: [
    {
      title: '待处置占位数',
      value: 0,
      desc: '待处理',
      status: '未处理',
      color: '#e95f5f',
    },
    {
      title: '处置完成率',
      value: '0%',
      desc: '已关闭',
      status: '已关闭',
      color: '#2fbf71',
    },
  ],
  trendData: [],
  stationData: [],
});

const trendXData = computed(() => state.trendData.map((item) => item.time));
const trendSeriesData = computed(() => [
  {
    name: '占位识别数',
    data: state.trendData.map((item) => item.identifyCount),
  },
]);
const stationXData = computed(() =>
  state.stationData.map((item) => item.stationName),
);
const stationSeriesData = computed(() => [
  {
    name: '占位数',
    data: state.stationData.map((item) => item.count),
  },
]);

function normalizeChartData(data) {
  const chartData =
    data?.trendData || data?.stationData || data?.cardData
      ? data
      : getMockChartData();
  const cardData = chartData.cardData || {};
  const finishRate = Number(cardData.processFinishRate ?? 0);

  state.cardList[0].value = cardData.waitProcessCount ?? 0;
  state.cardList[1].value = `${Number((finishRate * 100).toFixed(0))}%`;
  state.trendData = Array.isArray(chartData.trendData)
    ? chartData.trendData
    : [];
  state.stationData = Array.isArray(chartData.stationData)
    ? chartData.stationData.map((item) => ({
        ...item,
        stationName: item.stationName || getStationName(item.stationId),
      }))
    : [];
}

async function fetchChartData() {
  try {
    const response = await getOilMonitorChart();
    normalizeChartData(response);
  } catch (error) {
    console.error('获取油车占位监测看板失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }
}

function handleCardClick(card) {
  emit('statusFilter', card.status);
}

function handleTrendClick(payload) {
  if (payload?.categoryName) {
    emit('trendFilter', payload.categoryName);
  }
}

function handleStationClick(stationName) {
  const station = state.stationData.find(
    (item) => item.stationName === stationName,
  );
  if (station) {
    emit('stationFilter', station);
  }
}

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="oil-monitor-visualization">
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
      <div class="chart-panel">
        <LineChartClick
          title="占位监测趋势"
          :series-data="trendSeriesData"
          :x-data="trendXData"
          y-name="占位数"
          @line-click="handleTrendClick"
        />
      </div>
      <div class="chart-panel">
        <BarClick
          title="各场站占位数"
          :series-data="stationSeriesData"
          :x-data="stationXData"
          y-name="占位数"
          @bar-click="handleStationClick"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.oil-monitor-visualization {
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
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  min-width: 0;
  height: 320px;
}

.chart-panel {
  min-width: 0;
  height: 100%;
}
</style>
