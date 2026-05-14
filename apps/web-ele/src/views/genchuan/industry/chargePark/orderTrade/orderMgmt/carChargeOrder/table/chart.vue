<script setup>
import { onMounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import { getCarChargeOrderChart } from '#/api/genchuan/industry/chargePark/orderTrade/orderMgmt/index.js';
import Card from '#/components/stats/card.vue';
import Columnar from '#/components/stats/columnar.vue';

const emit = defineEmits(['filter-change']);

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

// 点击卡片事件 - 查询今日数据
const handleCardClick = () => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  emit('filter-change', {
    createOrderTimeStart: todayStr + ' 00:00:00',
    createOrderTimeEnd: todayStr + ' 23:59:59',
    stationName: null,
  });
};

// 折线图点击事件处理
const handleLineChartClick = (params) => {
  if (params && params.name) {
    emit('filter-change', {
      createOrderTimeStart: params.name + ' 00:00:00',
      createOrderTimeEnd: params.name + ' 23:59:59',
      stationName: null,
    });
  }
};

// 柱状图点击事件处理
const handleBarChartClick = (params) => {
  if (params && params.name) {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
    const start = thirtyDaysAgo.toISOString().split('T')[0] + ' 00:00:00';
    const end = today.toISOString().split('T')[0] + ' 23:59:59';
    emit('filter-change', {
      createOrderTimeStart: start,
      createOrderTimeEnd: end,
      stationName: params.name,
    });
  }
};

// 获取订单图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getCarChargeOrderChart();
    if (res.cardData) {
      state.cardList[0].value = res.cardData.todayOrderCount || 0;
      state.cardList[1].value = res.cardData.todayRevenue || 0;
      state.cardList[2].value = res.cardData.todayChargeQuantity || 0;
    } else {
      state.cardList[0].value = res.todayOrderCount || 0;
      state.cardList[1].value = res.todayRevenue || 0;
      state.cardList[2].value = res.todayChargeQuantity || 0;
    }
    state.trendData = res.trendData && res.trendData.length > 0 ? res.trendData : [
      { date: '2025-04-01', count: 12 },
      { date: '2025-04-02', count: 15 },
      { date: '2025-04-03', count: 8 },
      { date: '2025-04-04', count: 20 },
      { date: '2025-04-05', count: 14 },
    ];
    state.stationData = res.stationData && Array.isArray(res.stationData) && res.stationData.length > 0 ? res.stationData : [
      { station: '晋安湖公园东侧场站', count: 25 },
      { station: '仓山万达地下停车场', count: 18 },
    ];
    updateLineChart();
  } catch (error) {
    console.error('获取订单图表数据失败:', error);
    ElMessage.error('获取订单图表数据失败');
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
      { station: '晋安湖公园东侧场站', count: 25 },
      { station: '仓山万达地下停车场', count: 18 },
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

  lineChartInstance.getZr().on('click', (e) => {
    const pointInPixel = [e.offsetX, e.offsetY];
    const pointInGrid = lineChartInstance.convertFromPixel({ seriesIndex: 0 }, pointInPixel);
    const xIndex = pointInGrid[0];
    if (xIndex >= 0 && xIndex < state.trendData.length) {
      const clickedData = state.trendData[xIndex];
      handleLineChartClick({ name: clickedData.date, value: clickedData.count });
    }
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
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
    <Columnar
      class="simple-bar-chart"
      title="订单状态分布"
      :x-data="state.stationData.map((item) => item.station)"
      :series-data="[
        { name: '订单数', data: state.stationData.map((item) => item.count) },
      ]"
      @bar-click="handleBarChartClick"
    />
  </div>
</template>
