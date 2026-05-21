<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';

import { getDebtRecordCollectTrackChart } from '#/api/genchuan/industry/chargePark/orderTrade/debtCollect/index.js';
import Card from '#/components/stats/card.vue';

const emit = defineEmits(['filter-change']);

const methodMap = {
  sms: { label: '短信', type: 'primary' },
  notify: { label: '站内信', type: 'info' },
  phone: { label: '电话', type: 'warning' },
};

const state = reactive({
  cardList: [
    { title: '待追缴数', value: 0, color: '#FF6B6B' },
    { title: '追缴完成率', value: 0, color: '#4ECDC4', suffix: '%' },
  ],
  trendData: [],
  methodData: [],
});

// 点击卡片事件
const handleCardClick = (index) => {
  // 待追缴数(index=0)：搜索状态为待追缴
  // 追缴完成率(index=1)：搜索状态为已完成
  if (index === 0) {
    emit('filter-change', {
      status: 'pending',
    });
  } else {
    emit('filter-change', {
      status: 'completed',
    });
  }
};

// 折线图点击事件处理
const handleLineChartClick = (params) => { 
  if (params && params.name) {
    emit('filter-change', {
      collectTimeStart: params.name + ' 00:00:00',
      collectTimeEnd: params.name + ' 23:59:59',
      collectMethod: null,
      status: null,
    });
  }
};

// 柱状图点击事件处理
const handleBarChartClick = (params) => {
  if (params && params.name) {
    const methodKey = Object.keys(methodMap).find(key => methodMap[key].label === params.name);
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
    const start = thirtyDaysAgo.toISOString().split('T')[0] + ' 00:00:00';
    const end = today.toISOString().split('T')[0] + ' 23:59:59';
    emit('filter-change', {
      collectTimeStart: start,
      collectTimeEnd: end,
      collectMethod: methodKey || params.name,
      status: null,
    });
  }
};

// 获取追缴跟踪图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getDebtRecordCollectTrackChart();
    state.cardList[0].value = res.cardData?.waitCollectCount || res.waitCollectCount || 0;
    state.cardList[1].value = res.cardData?.collectCompleteRate || res.collectCompleteRate || 0;
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
    state.methodData =
      res.methodData && Array.isArray(res.methodData) && res.methodData.length > 0
        ? res.methodData
        : [
            { method: 'sms', count: 7 },
            { method: 'notify', count: 4 },
            { method: 'phone', count: 4 },
          ];
    updateLineChart();
    updateBarChart();
  } catch (error) {
    console.error('获取追缴跟踪图表数据失败:', error);
    state.cardList[0].value = 2;
    state.cardList[1].value = 20;
    state.trendData = [
      { date: '2025-04-01', count: 5 },
      { date: '2025-04-02', count: 8 },
      { date: '2025-04-03', count: 3 },
      { date: '2025-04-04', count: 12 },
      { date: '2025-04-05', count: 6 },
    ];
    state.methodData = [
      { method: 'sms', count: 7 },
      { method: 'notify', count: 4 },
      { method: 'phone', count: 4 },
    ];
    updateLineChart();
    updateBarChart();
  }
};

const lineChartRef = ref(null);
let lineChartInstance = null;

const barChartRef = ref(null);
let barChartInstance = null;

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

  lineChartInstance.on('click', (params) => {
    handleLineChartClick(params);
  });
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
      text: '追缴方式分布',
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
      data: state.methodData.map((item) => methodMap[item.method]?.label || item.method),
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
        name: '追缴数',
        type: 'bar',
        barWidth: '40%',
        data: state.methodData.map((item) => item.count),
        itemStyle: {
          color: (params) => {
            const method = state.methodData[params.dataIndex]?.method;
            return methodMap[method]?.color || '#4A90E2';
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  barChartInstance.setOption(option);

  barChartInstance.on('click', (params) => {
    handleBarChartClick(params);
  });
};

// 更新柱状图
const updateBarChart = () => {
  if (!barChartInstance) return;

  barChartInstance.setOption({
    xAxis: {
      data: state.methodData.map((item) => methodMap[item.method]?.label || item.method),
    },
    series: [
      {
        data: state.methodData.map((item) => item.count),
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
        class="left-card cursor-pointer"
        v-for="(item, index) in state.cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick(index)"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
    <div ref="barChartRef" class="simple-bar-chart"></div>
  </div>
</template>

<style scoped lang="scss">
.left-card {
  flex:1;
  width: 330px;

  :deep(.stat-card) {
    flex:1;
  }
}
</style>