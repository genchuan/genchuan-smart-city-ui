<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getReconcileBillChart } from '#/api/genchuan/industry/chargePark/orderTrade/merchantReconcile/index.js';
import Card from '#/components/stats/card.vue';

const state = reactive({
  cardList: [
    { title: '待对账数', value: 0, color: '#FF6B6B' },
    { title: '异常数', value: 0, color: '#E74C3C' },
    { title: '已确认数', value: 0, color: '#13ce66' },
    { title: '确认率', value: 0, color: '#4A90E2', suffix: '%' },
  ],
  trendData: [],
});

const lineChartRef = ref(null);
let lineChartInstance = null;

// 获取对账单图表数据
const fetchReconcileBillChartData = async () => {
  try {
    const res = await getReconcileBillChart();
    state.cardList[0].value = res.pendingCount || 0;
    state.cardList[1].value = res.disputedCount || 0;
    state.cardList[2].value = res.confirmedCount || 0;
    state.cardList[3].value = res.confirmRate || 0;
    // 如果trendData为空，使用假数据
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2026-04-01', count: 2 },
            { date: '2026-04-08', count: 1 },
            { date: '2026-04-10', count: 1 },
          ];
    // 更新折线图
    updateChart();
  } catch (error) {
    console.error('获取对账单图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 0;
    state.cardList[1].value = 0;
    state.cardList[2].value = 0;
    state.cardList[3].value = 0;
    state.trendData = [
      { date: '2026-04-01', count: 2 },
      { date: '2026-04-08', count: 1 },
      { date: '2026-04-10', count: 1 },
    ];
    // 更新折线图
    updateChart();
  }
};

// 初始化折线图
const initChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '对账趋势',
      left: 'center',
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: state.trendData.map((item) => item.date),
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
      splitLine: { lineStyle: { color: '#F3F4F6' } },
    },
    series: [
      {
        name: '对账数',
        type: 'line',
        smooth: true,
        data: state.trendData.map((item) => item.count),
        lineStyle: { color: '#4A90E2', width: 2 },
        itemStyle: { color: '#4A90E2' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
            { offset: 1, color: 'rgba(74, 144, 226, 0.05)' },
          ]),
        },
      },
    ],
  };

  lineChartInstance.setOption(option);
};

// 更新折线图
const updateChart = () => {
  if (!lineChartInstance) return;

  lineChartInstance.setOption({
    xAxis: {
      data: state.trendData.map((item) => item.date),
    },
    series: [
      {
        data: state.trendData.map((item) => item.count),
      },
    ],
  });
};

onMounted(() => {
  fetchReconcileBillChartData().then(() => {
    initChart();
  });

  window.addEventListener('resize', () => {
    lineChartInstance?.resize();
  });
});
</script>

<template>
  <div class="park-chart-box">
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
  </div>
</template>

<style scoped lang="scss">
.park-chart-box {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: hsl(var(--card));
  border-radius: 8px;
}

.chart-box-left {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  grid-template-rows: repeat(2, 1fr) !important;
  gap: 16px !important;
  flex-shrink: 0;
  width: 40%;
  max-width: 400px;
}

.chart-box-left :deep(.left-card) {
  width: 100% !important;
  flex-shrink: 0;
}

.chart-box-left :deep(.stat-card) {
  width: 100% !important;
  height: 150px !important;
  min-width: unset !important;
  max-width: unset !important;
}

.simple-bar-chart {
  width: 100%;
  height: 200px;
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}
</style>
