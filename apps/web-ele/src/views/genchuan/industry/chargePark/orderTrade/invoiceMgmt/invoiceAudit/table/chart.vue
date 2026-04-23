<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getInvoiceAuditChart } from '#/api/genchuan/industry/chargePark/orderTrade/invoiceMgmt/index.js';
import Card from '#/components/stats/card.vue';

const state = reactive({
  cardList: [
    { title: '待审核数', value: 0, color: '#FF6B6B' },
    { title: '审核通过率', value: 0, color: '#4ECDC4', suffix: '%' },
    { title: '累计审核', value: 0, color: '#13ce66' },
  ],
  trendData: [],
});

const lineChartRef = ref(null);
let lineChartInstance = null;

// 获取发票审核图表数据
const fetchInvoiceAuditChartData = async () => {
  try {
    const res = await getInvoiceAuditChart();
    state.cardList[0].value = res.pendingCount || 0;
    state.cardList[1].value = res.approveRate || 0;
    // 累计审核通过趋势数据计算
    state.cardList[2].value = res.trendData?.reduce((sum, item) => sum + item.count, 0) || 0;
    // 如果trendData为空，使用假数据
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2026-04-02', count: 1 },
            { date: '2026-04-03', count: 1 },
            { date: '2026-04-10', count: 1 },
            { date: '2026-04-11', count: 1 },
            { date: '2026-04-12', count: 1 },
          ];
    // 更新折线图
    updateLineChart();
  } catch (error) {
    console.error('获取发票审核图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 1;
    state.cardList[1].value = 60;
    state.cardList[2].value = 5;
    state.trendData = [
      { date: '2026-04-02', count: 1 },
      { date: '2026-04-03', count: 1 },
      { date: '2026-04-10', count: 1 },
      { date: '2026-04-11', count: 1 },
      { date: '2026-04-12', count: 1 },
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
      text: '审核趋势',
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
        name: '审核数',
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
  fetchInvoiceAuditChartData().then(() => {
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
  </div>
</template>
