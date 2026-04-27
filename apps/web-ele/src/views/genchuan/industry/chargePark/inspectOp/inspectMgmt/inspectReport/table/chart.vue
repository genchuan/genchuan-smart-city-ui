<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getInspectReportChart } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectReport';
import Columnar from '#/components/stats/columnar.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';
import { formatDate } from '#/utils/genchuan/formatTime';

import { getMockChartData } from './data';

const emit = defineEmits(['statusFilter', 'trendFilter', 'typeFilter']);

const state = reactive({
  cardList: [
    {
      title: '待审核数',
      value: 0,
      desc: '待确认上报',
      status: '待审核',
      color: '#f59e0b',
    },
    {
      title: '处置完成率',
      value: '0%',
      desc: '已完成处置',
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
    name: '上报量',
    data: state.trendData.map((item) => item.reportCount),
    color: '#2f80ed',
  },
]);
const typeXData = computed(() => state.typeData.map((item) => item.typeName));
const typeSeriesData = computed(() => [
  {
    name: '上报数量',
    data: state.typeData.map((item) => item.count),
  },
]);

function normalizeTrendData(trendData) {
  if (!Array.isArray(trendData)) return [];

  const trendMap = new Map();
  for (const item of trendData) {
    if (!item || item.time === undefined || item.time === null) continue;

    const timeText = String(item.time);
    let timestamp = null;
    if (/^\d{10}$/.test(timeText)) {
      timestamp = Number(timeText) * 1000;
    } else if (/^\d{13}$/.test(timeText)) {
      timestamp = Number(timeText);
    }
    const time = timestamp ? formatDate(timestamp, 'YYYY-MM-DD') : timeText;
    const reportCount = Number(item.reportCount ?? item.count ?? 0);

    trendMap.set(time, (trendMap.get(time) || 0) + reportCount);
  }

  return [...trendMap.entries()].map(([time, reportCount]) => ({
    time,
    reportCount,
  }));
}

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

  state.cardList[0].value = cardData.waitAuditCount ?? 0;
  state.cardList[1].value = formatRate(cardData.processFinishRate);
  state.trendData = normalizeTrendData(chartData.trendData);
  state.typeData = Array.isArray(chartData.typeData) ? chartData.typeData : [];
}

async function fetchChartData() {
  try {
    const response = await getInspectReportChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取巡检上报统计失败，使用静态数据:', error);
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
      title="上报量趋势"
      :series-data="trendSeriesData"
      :x-data="trendXData"
      y-name="上报数"
      @line-click="handleTrendClick"
    />
    <Columnar
      class="park-type-chart"
      title="上报类型分布"
      :series-data="typeSeriesData"
      :x-data="typeXData"
      y-name="上报数"
      @bar-click="handleTypeClick"
    />
  </div>
</template>
