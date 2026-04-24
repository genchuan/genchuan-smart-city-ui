<script setup>
import { computed, onMounted, ref } from 'vue';

import * as pageApi from '#/api/genchuan/chargePark/stationResource/decisionAnalysis/stationOpReport/index.js';
import BarClick from '#/genchuan-components/stats/barClick.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import { pageConfig, REPORT_TYPE } from './data.js';

const loading = ref(false);
const chartData = ref({});

const chartCards = computed(() => {
  const cardData = chartData.value?.cardData || {};
  return (pageConfig.chart?.cards || []).map(([key, title], index) => ({
    key,
    title,
    value: cardData[key] ?? 0,
    color: ['#13ce66', '#4ECDC4', '#FFB020', '#FF6B6B'][index % 4],
  }));
});

const barXData = computed(() => {
  const [dataKey, nameField] = pageConfig.chart?.bar || [];
  return (chartData.value?.[dataKey] || []).map((item) => item[nameField]);
});

const barSeriesData = computed(() => {
  const [dataKey, , valueField, label] = pageConfig.chart?.bar || [];
  return [
    {
      data: (chartData.value?.[dataKey] || []).map(
        (item) => item[valueField] ?? 0,
      ),
      name: label || '数量',
    },
  ];
});

const lineXData = computed(() => {
  const [dataKey, nameField] = pageConfig.chart?.line || [];
  return (chartData.value?.[dataKey] || []).map((item) => item[nameField]);
});

const lineSeriesData = computed(() => {
  const [dataKey, , valueField, label] = pageConfig.chart?.line || [];
  return [
    {
      data: (chartData.value?.[dataKey] || []).map(
        (item) => item[valueField] ?? 0,
      ),
      name: label || '数量',
    },
  ];
});

// 动态计算图表数量和flex值
const hasCards = computed(() => chartCards.value.length > 0);
const hasBar = computed(
  () => pageConfig.chart?.bar && barXData.value.length > 0,
);
const hasLine = computed(
  () => pageConfig.chart?.line && lineXData.value.length > 0,
);

// 计算图表总数（不包括卡片）
const chartCount = computed(() => {
  let count = 0;
  if (hasBar.value) count++;
  if (hasLine.value) count++;
  return count;
});

// 动态计算每个图表的flex值
const chartFlex = computed(() => {
  if (chartCount.value === 0) return '0';
  if (chartCount.value === 1) return '3.5 !important'; // 单个图表占满剩余空间
  return '1.75 !important'; // 两个图表平分
});

async function loadChart() {
  loading.value = true;
  try {
    const params = {
      reportCycle: '季报',
      reportStartTime: undefined, 
      reportEndTime: undefined
    };
    chartData.value =
      (await pageApi.getStationOpReportChart(params)) ||
      {};
  } finally {
    loading.value = false;
  }
}

onMounted(loadChart);
</script>

<template>
  <div v-loading="loading" class="park-chart-box">
    <!-- 卡片区：固定flex: 1 -->
    <div v-if="hasCards" class="chart-box-left" style="flex: 1 !important">
      <IndicatorClick
        v-for="item in chartCards"
        :key="item.key"
        :title="item.title"
        :value="item.value"
        :color="item.color"
      />
    </div>

    <!-- 柱状图：动态flex -->
    <div v-if="hasBar" class="chart-wrapper" :style="{ flex: chartFlex }">
      <BarClick
        class="chart-panel-inner"
        :title="`${pageConfig.title}分布`"
        :x-data="barXData"
        :series-data="barSeriesData"
        y-name="金额"
      />
    </div>

    <!-- 折线图：动态flex -->
    <div v-if="hasLine" class="chart-wrapper" :style="{ flex: chartFlex }">
      <LineChartClick
        class="chart-panel-inner"
        :title="`${pageConfig.title}趋势`"
        :x-data="lineXData"
        :series-data="lineSeriesData"
        y-name="金额"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.park-chart-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;

  .chart-box-left {
    display: grid !important;
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    min-width: 280px;
    max-width: 320px;

    :deep(.stat-card) {
      height: 100% !important;
      min-height: 150px;
    }
  }

  .chart-wrapper {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    height: 340px;
    min-height: 340px;
  }

  :deep(.chart-panel-inner) {
    flex: 1 1 auto;
    width: 100%;
    height: 340px !important;
    min-height: 340px !important;
  }
}
</style>
