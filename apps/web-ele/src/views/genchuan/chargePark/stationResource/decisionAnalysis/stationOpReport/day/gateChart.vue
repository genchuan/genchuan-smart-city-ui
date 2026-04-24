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
  return (chartData.value?.barData || []).map((item) => item['areaName'] || item['stationType'] || '未知');
});

const barSeriesData = computed(() => {
  return [
    {
      data: (chartData.value?.barData || []).map(
        (item) => item['stationCount'] ?? 0,
      ),
      name: '各片区场站数量',
      type: 'bar',
      barWidth: '30%',
    },
  ];
});

// 2. 各类型场站数量
const typeBarXData = computed(() => {
  return (chartData.value?.stationTypeBarData || []).map((item) => item['stationType'] || '未知');
});

const typeBarSeriesData = computed(() => {
  return [
    {
      data: (chartData.value?.stationTypeBarData || []).map(
        (item) => item['stationCount'] ?? 0,
      ),
      name: '各类型场站数量',
      type: 'bar',
      barWidth: '30%',
    },
  ];
});

// 3. 各场站订单量
const orderBarXData = computed(() => {
  return (chartData.value?.stationOrderCountBarData || []).map((item) => item['stationName'] || '未知');
});

const orderBarSeriesData = computed(() => {
  return [
    {
      data: (chartData.value?.stationOrderCountBarData || []).map(
        (item) => item['orderCount'] ?? 0,
      ),
      name: '各场站订单量',
      type: 'bar',
      barWidth: '30%',
    },
  ];
});

// 4. 追缴成功率分布
const recoverBarXData = computed(() => {
  return (chartData.value?.stationRecoverFinishBarData || []).map((item) => item['stationName'] || '未知');
});

const recoverBarSeriesData = computed(() => {
  return [
    {
      data: (chartData.value?.stationRecoverFinishBarData || []).map(
        (item) => item['recoverFinish'] ?? 0,
      ),
      name: '追缴成功率(%)',
      type: 'bar',
      barWidth: '30%',
    },
  ];
});

const lineXData = computed(() => {
  const [dataKey, nameField] = pageConfig.chart?.line || [];
  return (chartData.value?.[dataKey] || []).map((item) => item[nameField]);
});

const lineSeriesData = computed(() => {
  const [dataKey, , valueField, label] = pageConfig.chart?.line || [];
  // 根据需求，可能需要展示多条折线（订单趋势、拓场进度趋势、权限使用趋势）
  return [
    {
      data: (chartData.value?.[dataKey] || []).map(
        (item) => item['orderCount'] ?? 0,
      ),
      name: '订单量',
      type: 'line',
      smooth: true,
    },
    {
      data: (chartData.value?.[dataKey] || []).map(
        (item) => item['expandProgress'] ?? 0,
      ),
      name: '拓场进度',
      type: 'line',
      smooth: true,
    },
    {
      data: (chartData.value?.[dataKey] || []).map(
        (item) => item['permissionUseCount'] ?? 0,
      ),
      name: '权限使用量',
      type: 'line',
      smooth: true,
    }
  ];
});

// 动态计算图表数量和flex值
const hasCards = computed(() => chartCards.value.length > 0);
const hasBar = computed(() => barXData.value.length > 0);
const hasLine = computed(() => lineXData.value.length > 0);

// 计算图表总数（不包括卡片）
const chartCount = computed(() => {
  let count = 0;
  if (hasBar.value) count++;
  if (hasLine.value) count++;
  return count;
});

// 动态计算每个图表的flex值
const chartFlex = computed(() => {
  return 'calc(50% - 6px) !important'; // 固定一行两个图表
});

async function loadChart() {
  loading.value = true;
  try {
    const params = {
      reportCycle: '日报',
      // The backend expects reportStartTime and reportEndTime
      // In a real application, these might come from a date picker component.
      // For now, we pass them as undefined to let the backend use defaults or 
      // we can add logic to compute today's start and end time.
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

    <!-- 柱状图1：各片区场站数量 -->
    <div v-if="hasBar" class="chart-wrapper" :style="{ flex: chartFlex }">
      <BarClick
        class="chart-panel-inner"
        title="各片区场站数量分布"
        :x-data="barXData"
        :series-data="barSeriesData"
        y-name="数量"
      />
    </div>

    <!-- 柱状图2：各类型场站数量 -->
    <div v-if="typeBarXData.length > 0" class="chart-wrapper" :style="{ flex: chartFlex }">
      <BarClick
        class="chart-panel-inner"
        title="各类型场站数量分布"
        :x-data="typeBarXData"
        :series-data="typeBarSeriesData"
        y-name="数量"
      />
    </div>

    <!-- 柱状图3：各场站订单量 -->
    <div v-if="orderBarXData.length > 0" class="chart-wrapper" :style="{ flex: chartFlex }">
      <BarClick
        class="chart-panel-inner"
        title="各场站订单量分布"
        :x-data="orderBarXData"
        :series-data="orderBarSeriesData"
        y-name="数量"
      />
    </div>

    <!-- 柱状图4：追缴成功率分布 -->
    <div v-if="recoverBarXData.length > 0" class="chart-wrapper" :style="{ flex: chartFlex }">
      <BarClick
        class="chart-panel-inner"
        title="各场站追缴成功率分布"
        :x-data="recoverBarXData"
        :series-data="recoverBarSeriesData"
        y-name="百分比(%)"
      />
    </div>

    <!-- 折线图：动态flex -->
    <div v-if="hasLine" class="chart-wrapper" :style="{ flex: chartFlex }">
      <LineChartClick
        class="chart-panel-inner"
        title="周期订单及业务趋势"
        :x-data="lineXData"
        :series-data="lineSeriesData"
        y-name="数值"
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
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    flex: 1 1 100% !important;
    gap: 12px;
    width: 100%;
    min-width: 100%;
    max-width: 100%;

    :deep(.stat-card) {
      height: 100% !important;
      min-height: 150px;
    }
  }

  .chart-wrapper {
    position: relative;
    display: flex;
    flex: 1 1 calc(50% - 6px) !important;
    flex-direction: column;
    min-width: calc(50% - 6px);
    max-width: calc(50% - 6px);
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
