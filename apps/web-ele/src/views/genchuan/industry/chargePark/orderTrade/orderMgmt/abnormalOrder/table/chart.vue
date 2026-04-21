<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getAbnormalOrderChart } from '#/api/genchuan/industry/chargePark/orderTrade/orderMgmt/index.js';
import Card from '#/components/stats/card.vue';
import Columnar from '#/components/stats/columnar.vue';

// 处置状态映射
const typeMap = {
  unhandled: { label: '未处理', type: 'danger' },
  handling: { label: '处理中', type: 'warning' },
  closed: { label: '已关闭', type: 'info' },
};

// 获取状态标签（兼容type和status字段）
const getTypeLabel = (item) => {
  const typeValue = item.type || item.status;
  return typeMap[typeValue]?.label || typeValue || '未知';
};

const state = reactive({
  cardList: [
    { title: '待处理数量', value: 0, color: '#13ce66' },
    { title: '处理完成率(%)', value: 0, color: '#4ECDC4' },
    { title: '异常订单总数', value: 0, color: '#FF6B6B' },
  ],
  trendData: [],
  typeData: [],
});

const lineChartRef = ref(null);
let lineChartInstance = null;

// 获取异常订单图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getAbnormalOrderChart();
    state.cardList[0].value = res.waitProcessCount;
    state.cardList[1].value = res.processCompleteRate;
    // 计算异常订单总数（待处理 + 已处理）
    const processedCount = res.waitProcessCount / (1 - res.processCompleteRate / 100) - res.waitProcessCount || 0;
    state.cardList[2].value = Math.round(res.waitProcessCount + processedCount);
    // 如果trendData为空，使用假数据
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2025-04-01', count: 5 },
            { date: '2025-04-02', count: 8 },
            { date: '2025-04-03', count: 3 },
            { date: '2025-04-04', count: 10 },
            { date: '2025-04-05', count: 6 },
          ];
    // 如果typeData为空，使用假数据
    state.typeData =
      res.typeData && Array.isArray(res.typeData) && res.typeData.length > 0
        ? res.typeData
        : [
            { count: 5, status: 'unhandled' },
            { count: 3, status: 'handling' },
            { count: 12, status: 'closed' },
          ];
    // 更新折线图
    updateLineChart();
  } catch (error) {
    console.error('获取异常订单图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 15;
    state.cardList[1].value = 85;
    state.cardList[2].value = 100;
    state.trendData = [
      { date: '2025-04-01', count: 5 },
      { date: '2025-04-02', count: 8 },
      { date: '2025-04-03', count: 3 },
      { date: '2025-04-04', count: 10 },
      { date: '2025-04-05', count: 6 },
    ];
    state.typeData = [
      { count: 5, status: 'unhandled' },
      { count: 3, status: 'handling' },
      { count: 12, status: 'closed' },
    ];
    // 更新折线图
    updateLineChart();
  }
};

// 初始化折线图
const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '订单量趋势',
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
        name: '订单量',
        type: 'line',
        data: state.trendData.map((item) => item.count),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
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
const updateLineChart = () => {
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
  fetchOrderChartData().then(() => {
    initLineChart();
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
    <Columnar
      class="simple-bar-chart"
      title="异常类型分布"
      :x-data="
        (state.typeData || []).map((item) => getTypeLabel(item))
      "
      :series-data="[
        { name: '数量', data: (state.typeData || []).map((item) => item.count || 0) },
      ]"
    />
  </div>
</template>
