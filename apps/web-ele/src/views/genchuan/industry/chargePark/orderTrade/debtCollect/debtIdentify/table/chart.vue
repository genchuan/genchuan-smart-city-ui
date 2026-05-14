<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getDebtIdentifyChart } from '#/api/genchuan/industry/chargePark/orderTrade/debtCollect/index.js';
import Card from '#/components/stats/card.vue';
import Columnar from '#/components/stats/columnar.vue';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['filter-change']);

// 逃费识别状态映射
const statusMap = {
  pending: { label: '待识别', type: 'warning' },
  identified: { label: '已识别', type: 'success' },
  marked: { label: '已标记（非逃费）', type: 'info' },
};

const state = reactive({
  cardList: [
    { title: '待识别数量', value: 0, color: '#13ce66' },
    { title: '识别成功率(%)', value: 0, color: '#4ECDC4' },
  ],
  trendData: [],
  typeData: [],
});

// 点击卡片事件
const handleCardClick = (index) => {
  if (index === 0) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    emit('filter-change', {
      identifyTimeStart: todayStr + ' 00:00:00',
      identifyTimeEnd: todayStr + ' 23:59:59',
      status: 'pending',
    });
  } else {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
    const start = thirtyDaysAgo.toISOString().split('T')[0] + ' 00:00:00';
    const end = today.toISOString().split('T')[0] + ' 23:59:59';
    emit('filter-change', {
      identifyTimeStart: start,
      identifyTimeEnd: end,
      status: null,
    });
  }
};

// 折线图点击事件处理
const handleLineChartClick = (params) => {
  if (params && params.name) {
    emit('filter-change', {
      identifyTimeStart: params.name + ' 00:00:00',
      identifyTimeEnd: params.name + ' 23:59:59',
      status: null,
    });
  }
};

// 柱状图点击事件处理
const handleBarChartClick = (params) => {
  if (params && params.name) {
    const statusKey = Object.keys(statusMap).find(key => statusMap[key].label === params.name);
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
    const start = thirtyDaysAgo.toISOString().split('T')[0] + ' 00:00:00';
    const end = today.toISOString().split('T')[0] + ' 23:59:59';
    emit('filter-change', {
      identifyTimeStart: start,
      identifyTimeEnd: end,
      status: statusKey || params.name,
    });
  }
};

const lineChartRef = ref(null);
let lineChartInstance = null;

// 获取逃费识别图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getDebtIdentifyChart();
    if (res.cardData) {
      state.cardList[0].value = res.cardData.waitIdentifyCount || 0;
      state.cardList[1].value = res.cardData.identifySuccessRate || 0;
    } else {
      state.cardList[0].value = res.waitIdentifyCount || 0;
      state.cardList[1].value = res.identifySuccessRate || 0;
    }
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
    state.typeData =
      res.stationData && Array.isArray(res.stationData) && res.stationData.length > 0
        ? res.stationData
        : [
            { count: 5, status: 'pending' },
            { count: 12, status: 'identified' },
            { count: 3, status: 'marked' },
          ];
    updateLineChart();
  } catch (error) {
    console.error('获取逃费识别图表数据失败:', error);
    state.cardList[0].value = 10;
    state.cardList[1].value = 90;
    state.trendData = [
      { date: '2025-04-01', count: 5 },
      { date: '2025-04-02', count: 8 },
      { date: '2025-04-03', count: 3 },
      { date: '2025-04-04', count: 10 },
      { date: '2025-04-05', count: 6 },
    ];
    state.typeData = [
      { count: 5, status: 'pending' },
      { count: 12, status: 'identified' },
      { count: 3, status: 'marked' },
    ];
    updateLineChart();
  }
};

// 初始化折线图
const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '识别数量趋势',
      left: 'center',
      textStyle: {
        color: '#6E7E81',
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
        class="left-card cursor-pointer"
        v-for="(item, index) in state.cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick(index)"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
    <Columnar
      class="simple-bar-chart"
      title="识别状态分布"
      :x-data="state.typeData.map((item) => statusMap[item.status]?.label || item.status)"
      :series-data="[
        { name: '订单数', data: state.typeData.map((item) => item.count) },
      ]"
      @bar-click="handleBarChartClick"
    />
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