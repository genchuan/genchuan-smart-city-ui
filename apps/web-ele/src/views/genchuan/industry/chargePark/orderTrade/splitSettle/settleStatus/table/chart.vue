<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getSplitRateStatusChart } from '#/api/genchuan/industry/chargePark/orderTrade/splitSettle/index.js';
import Card from '#/components/stats/card.vue';

const emit = defineEmits(['filter-change']);

const statusMap = {
  normal: { label: '正常', type: 'success' },
  abnormal: { label: '异常', type: 'danger' },
};

const state = reactive({
  cardList: [
    { title: '完成率', value: 0, color: '#4ECDC4', suffix: '%', status: null },
    { title: '异常率', value: 0, color: '#FF6B6B', suffix: '%', status: 'abnormal' },
    { title: '正常数量', value: 0, color: '#13ce66', status: 'normal' },
  ],
  statusData: [],
});

// 点击卡片事件
const handleCardClick = (status) => {
  emit('filter-change', {
    status: status || null,
  });
};

// 柱状图点击事件处理
const handleBarChartClick = (params) => {
  if (params && params.name) {
    const statusKey = params.name === '正常' ? 'normal' : 'abnormal';
    emit('filter-change', {
      status: statusKey,
    });
  }
};

const lineChartRef = ref(null);
let lineChartInstance = null;

const fetchSettleStatusChartData = async () => {
  try {
    const res = await getSplitRateStatusChart();
    state.cardList[0].value = res.cardData?.completeRate || res.completeRate || 0;
    state.cardList[1].value = res.cardData?.abnormalRate || res.abnormalRate || 0;
    const normalData = res.statusData?.find(item => item.status === 'normal');
    state.cardList[2].value = normalData?.count || 0;
    state.statusData =
      res.statusData && res.statusData.length > 0
        ? res.statusData
        : [
            { status: 'normal', count: 9 },
            { status: 'abnormal', count: 1 },
          ];
    updateLineChart();
  } catch (error) {
    console.error('获取结算状态图表数据失败:', error);
    state.cardList[0].value = 90;
    state.cardList[1].value = 10;
    state.cardList[2].value = 9;
    state.statusData = [
      { status: 'normal', count: 9 },
      { status: 'abnormal', count: 1 },
    ];
    updateLineChart();
  }
};

const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '结算状态分布',
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
      formatter: (params) => {
        const data = params[0];
        return `<div style="padding: 8px;">
          <div style="font-weight: 500;">${data.name}</div>
          <div>数量：${data.value} 个</div>
        </div>`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: state.statusData.map((item) => item.status === 'normal' ? '正常' : '异常'),
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
    },
    yAxis: {
      type: 'value',
      name: '数量',
      nameTextStyle: { color: '#6E7E91', fontSize: 12 },
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
      splitLine: { lineStyle: { color: '#F3F4F6' } },
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        data: state.statusData.map((item) => ({
          value: item.count,
          itemStyle: {
            color: item.status === 'normal' 
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#4ECDC4' },
                  { offset: 1, color: '#44A08D' },
                ])
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#FF6B6B' },
                  { offset: 1, color: '#EE5A24' },
                ]),
          },
        })),
        barWidth: '50%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
      },
    ],
  };

  lineChartInstance.setOption(option);

  lineChartInstance.on('click', (params) => {
    handleBarChartClick(params);
  });
};

const updateLineChart = () => {
  if (!lineChartInstance) return;

  lineChartInstance.setOption({
    xAxis: {
      data: state.statusData.map((item) => item.status === 'normal' ? '正常' : '异常'),
    },
    series: [
      {
        data: state.statusData.map((item) => ({
          value: item.count,
          itemStyle: {
            color: item.status === 'normal' 
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#4ECDC4' },
                  { offset: 1, color: '#44A08D' },
                ])
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#FF6B6B' },
                  { offset: 1, color: '#EE5A24' },
                ]),
          },
        })),
      },
    ],
  });
};

onMounted(() => {
  fetchSettleStatusChartData().then(() => {
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
        class="left-card cursor-pointer"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick(item.status)"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
  </div>
</template>