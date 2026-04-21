<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getDebtRecordCollectTrackChart } from '#/api/genchuan/industry/chargePark/orderTrade/debtCollect/index.js';
import Card from '#/components/stats/card.vue';
import Columnar from '#/components/stats/columnar.vue';

// 追缴方式映射
const methodMap = {
  sms: { label: '短信', type: 'primary' },
  phone: { label: '电话', type: 'warning' },
  wechat: { label: '微信', type: 'success' },
  mail: { label: '邮件', type: 'info' },
};

const state = reactive({
  cardList: [
    { title: '待追缴数', value: 0, color: '#FF6B6B' },
    { title: '追缴完成率', value: 0, color: '#4ECDC4', suffix: '%' },
    { title: '追缴总数', value: 0, color: '#13ce66' },
  ],
  trendData: [],
  methodData: [],
});

const lineChartRef = ref(null);
let lineChartInstance = null;

// 获取追缴跟踪图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getDebtRecordCollectTrackChart();
    state.cardList[0].value = res.waitCollectCount;
    state.cardList[1].value = res.collectCompleteRate;
    // 追缴总数通过趋势数据计算
    state.cardList[2].value = res.trendData?.reduce((sum, item) => sum + item.count, 0) || 0;
    // 如果trendData为空，使用假数据
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2025-04-01', count: 5 },
            { date: '2025-04-02', count: 8 },
            { date: '2025-04-03', count: 3 },
            { date: '2025-04-04', count: 12 },
            { date: '2025-04-05', count: 6 },
          ];
    // 如果methodData为空，使用假数据
    state.methodData =
      res.methodData && Array.isArray(res.methodData) && res.methodData.length > 0
        ? res.methodData
        : [
            { method: 'sms', count: 4 },
            { method: 'phone', count: 1 },
            { method: 'wechat', count: 2 },
          ];
    // 更新折线图
    updateLineChart();
  } catch (error) {
    console.error('获取追缴跟踪图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 2;
    state.cardList[1].value = 20;
    state.cardList[2].value = 10;
    state.trendData = [
      { date: '2025-04-01', count: 5 },
      { date: '2025-04-02', count: 8 },
      { date: '2025-04-03', count: 3 },
      { date: '2025-04-04', count: 12 },
      { date: '2025-04-05', count: 6 },
    ];
    state.methodData = [
      { method: 'sms', count: 4 },
      { method: 'phone', count: 1 },
      { method: 'wechat', count: 2 },
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
      text: '追缴数量趋势',
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
      title="追缴方式分布"
      :x-data="
        state.methodData.map(
          (item) => methodMap[item.method]?.label || item.method,
        )
      "
      :series-data="[
        { name: '追缴数', data: state.methodData.map((item) => item.count) },
      ]"
    />
  </div>
</template>
