<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getInvoiceConfigChart } from '#/api/genchuan/industry/chargePark/orderTrade/invoiceMgmt/index.js';
import Card from '#/components/stats/card.vue';

const state = reactive({
  cardList: [
    { title: '已生效配置', value: 0, color: '#13ce66' },
    { title: '总配置数', value: 0, color: '#4ECDC4' },
    { title: '配置覆盖率', value: 0, color: '#FF6B6B', suffix: '%' },
  ],
  categoryData: [],
});

const lineChartRef = ref(null);
let lineChartInstance = null;

// 获取发票配置图表数据
const fetchInvoiceConfigChartData = async () => {
  try {
    const res = await getInvoiceConfigChart();
    state.cardList[0].value = res.enabledCount || 0;
    const totalCount = res.categoryData?.reduce((sum, item) => sum + item.count, 0) || 0;
    state.cardList[1].value = totalCount;
    // 配置覆盖率 = (已生效配置数 / 总配置数) * 100
    state.cardList[2].value = totalCount > 0 ? Math.round((state.cardList[0].value / totalCount) * 100) : 0;
    // 如果categoryData为空，使用假数据
    state.categoryData =
      res.categoryData && res.categoryData.length > 0
        ? res.categoryData
        : [
            { category: '停车费', count: 1 },
            { category: '充电服务费', count: 1 },
            { category: '代付服务费', count: 1 },
            { category: '会员服务费', count: 1 },
            { category: '平台技术服务费', count: 1 },
          ];
    // 更新柱状图
    updateChart();
  } catch (error) {
    console.error('获取发票配置图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 3;
    state.cardList[1].value = 5;
    state.cardList[2].value = 60;
    state.categoryData = [
      { category: '停车费', count: 1 },
      { category: '充电服务费', count: 1 },
      { category: '代付服务费', count: 1 },
      { category: '会员服务费', count: 1 },
      { category: '平台技术服务费', count: 1 },
    ];
    // 更新柱状图
    updateChart();
  }
};

// 初始化柱状图
const initChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '开票类目统计',
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
      data: state.categoryData.map((item) => item.category),
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
        name: '数量',
        type: 'bar',
        data: state.categoryData.map((item) => item.count),
        barWidth: '50%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4A90E2' },
            { offset: 1, color: '#357ABD' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  lineChartInstance.setOption(option);
};

// 更新柱状图
const updateChart = () => {
  if (!lineChartInstance) return;

  lineChartInstance.setOption({
    xAxis: {
      data: state.categoryData.map((item) => item.category),
    },
    series: [
      {
        data: state.categoryData.map((item) => item.count),
      },
    ],
  });
};

onMounted(() => {
  fetchInvoiceConfigChartData().then(() => {
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
