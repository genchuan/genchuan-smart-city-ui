<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getBikeChargeOrderChart } from '#/api/genchuan/industry/chargePark/orderTrade/orderMgmt/index.js';
import Card from '#/components/stats/card.vue';

// 订单状态映射
const statusMap = {
  charging: { label: '充电中', type: 'primary' },
  pending_pay: { label: '待支付', type: 'warning' },
  paid: { label: '已支付', type: 'success' },
  completed: { label: '已完成', type: 'success' },
  cancelled: { label: '已取消', type: 'info' },
  refunding: { label: '退款中', type: 'danger' },
};

const state = reactive({
  cardList: [
    { title: '今日订单量', value: 0, color: '#13ce66' },
    { title: '今日营收', value: 0, color: '#4ECDC4' },
    { title: '今日充电量', value: 0, color: '#FF6B6B' },
  ],
  trendData: [],
  stationData: [],
});

const lineChartRef = ref(null);
let lineChartInstance = null;
const barChartRef = ref(null);
let barChartInstance = null;

// 获取订单图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getBikeChargeOrderChart();
    state.cardList[0].value = res.todayOrderCount;
    state.cardList[1].value = res.todayRevenue;
    state.cardList[2].value = res.todayChargeQuantity;
    // 如果trendData为空，使用假数据
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2025-04-01', count: 12 },
            { date: '2025-04-02', count: 15 },
            { date: '2025-04-03', count: 8 },
            { date: '2025-04-04', count: 20 },
            { date: '2025-04-05', count: 14 },
          ];
    // stationData数据结构: [{ count, status }, ...]
    state.stationData =
      res.stationData && Array.isArray(res.stationData) && res.stationData.length > 0
        ? res.stationData
        : [
            { count: 2, status: 'refunding' },
            { count: 1, status: 'completed' },
          ];
    // 更新图表
    updateLineChart();
    updateBarChart();
  } catch (error) {
    console.error('获取订单图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 50;
    state.cardList[1].value = 1500;
    state.cardList[2].value = 120;
    state.trendData = [
      { date: '2025-04-01', count: 12 },
      { date: '2025-04-02', count: 15 },
      { date: '2025-04-03', count: 8 },
      { date: '2025-04-04', count: 20 },
      { date: '2025-04-05', count: 14 },
    ];
    state.stationData = [
      { count: 2, status: 'refunding' },
      { count: 1, status: 'completed' },
    ];
    // 更新图表
    updateLineChart();
    updateBarChart();
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

// 初始化柱状图
const initBarChart = () => {
  if (!barChartRef.value) return;

  barChartInstance = echarts.init(barChartRef.value);

  const option = {
    title: {
      text: '订单状态分布',
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
      data: state.stationData.map((item) => statusMap[item?.status]?.label || item?.status || '未知'),
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
        name: '订单数',
        type: 'bar',
        data: state.stationData.map((item) => item?.count || 0),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4ECDC4' },
            { offset: 1, color: '#44A08D' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  barChartInstance.setOption(option);
};

// 更新柱状图
const updateBarChart = () => {
  if (!barChartInstance) return;

  barChartInstance.setOption({
    xAxis: {
      data: state.stationData.map((item) => statusMap[item?.status]?.label || item?.status || '未知'),
    },
    series: [
      {
        data: state.stationData.map((item) => item?.count || 0),
      },
    ],
  });
};

onMounted(() => {
  fetchOrderChartData().then(() => {
    initLineChart();
    initBarChart();
  });

  window.addEventListener('resize', () => {
    lineChartInstance?.resize();
    barChartInstance?.resize();
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
    <div ref="barChartRef"  class="simple-bar-chart"></div>
  </div>
</template>
