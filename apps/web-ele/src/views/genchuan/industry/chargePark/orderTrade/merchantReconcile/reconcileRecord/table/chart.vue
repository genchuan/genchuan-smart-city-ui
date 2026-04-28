<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getReconcileRecordChart } from '#/api/genchuan/industry/chargePark/orderTrade/merchantReconcile/index.js';
import Card from '#/components/stats/card.vue';

const state = reactive({
  cardList: [
    { title: '未匹配数', value: 0, color: '#FF6B6B' },
    { title: '总记录数', value: 0, color: '#4ECDC4' },
    { title: '匹配率', value: 0, color: '#13ce66', suffix: '%' },
  ],
  trendData: [],
});

const lineChartRef = ref(null);
let lineChartInstance = null;

// 获取对账记录图表数据
const fetchReconcileRecordChartData = async () => {
  try {
    const res = await getReconcileRecordChart();
    state.cardList[0].value = res.unmatchedCount || 0;
    state.cardList[1].value = res.totalCount || 0;
    state.cardList[2].value = res.matchRate || 0;
    // 如果trendData为空，使用假数据
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2026-04-01', count: 2 },
            { date: '2026-04-08', count: 1 },
            { date: '2026-04-10', count: 1 },
            { date: '2026-04-26', count: 10 },
          ];
    // 更新折线图
    updateChart();
  } catch (error) {
    console.error('获取对账记录图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 3;
    state.cardList[1].value = 15;
    state.cardList[2].value = 80;
    state.trendData = [
      { date: '2026-04-01', count: 2 },
      { date: '2026-04-08', count: 1 },
      { date: '2026-04-10', count: 1 },
      { date: '2026-04-26', count: 10 },
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
  fetchReconcileRecordChartData().then(() => {
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
  background-color: #fff;
  border-radius: 8px;
}

.chart-box-left {
  display: grid !important;
  grid-template-columns: 1fr !important;
  grid-template-rows: repeat(3, 1fr) !important;
  gap: 16px !important;
  flex-shrink: 0;
  width: 30%;
}

.chart-box-left :deep(.left-card) {
  width: 100% !important;
  flex-shrink: 0;
}

.chart-box-left :deep(.stat-card) {
  width: 100% !important;
  height: 100px !important;
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
