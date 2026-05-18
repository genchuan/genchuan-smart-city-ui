<script setup>
import { reactive, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getOrderChart } from '#/api/genchuan/industry/chargePark/orderTrade/orderMgmt/index.js';
import Card from '#/components/stats/card.vue';
import Columnar from '#/components/stats/columnar.vue';
import * as echarts from 'echarts';

const emit = defineEmits(['filter-change']);

// 订单类型映射
const orderTypeMap = {
  temp_park: '临时停车',
  offtime_park: '错时停车',
  car_charge: '汽车充电',
  bike_charge: '两轮充电',
  share_charge: '共享充电',
};

// 获取订单类型标签
const getOrderTypeLabel = (orderType) => {
  return orderTypeMap[orderType] || orderType || '-';
};

const state = reactive({
  cardList: [
    { title: '今日订单量', value: 0, color: '#13ce66' },
    { title: '今日营收', value: 0, color: '#4ECDC4' },
    { title: '今日支付率（%）', value: 0, color: '#FF6B6B' },
  ],
  trendData: [],
  stationData: [],
});

// 点击卡片事件
const handleCardClick = () => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  emit('filter-change', {
    createOrderTimeStart: todayStr + ' 00:00:00',
    createOrderTimeEnd: todayStr + ' 23:59:59',
    orderType: null,
  });
};

// 折线图点击事件处理
const handleLineChartClick = (params) => {
  if (params && params.name) {
    emit('filter-change', {
      createOrderTimeStart: params.name + ' 00:00:00',
      createOrderTimeEnd: params.name + ' 23:59:59',
      orderType: null,
    });
  }
};

// 柱状图点击事件处理
const handleBarChartClick = (params) => {
  if (params && params.name) {
    const orderTypeKey = Object.keys(orderTypeMap).find(key => orderTypeMap[key] === params.name);
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
    const start = thirtyDaysAgo.toISOString().split('T')[0] + ' 00:00:00';
    const end = today.toISOString().split('T')[0] + ' 23:59:59';
    emit('filter-change', {
      createOrderTimeStart: start,
      createOrderTimeEnd: end,
      orderType: orderTypeKey || params.name,
    });
  }
};

const lineChartRef = ref(null);
let lineChartInstance = null;

// 获取订单图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getOrderChart();
    if (res.cardData) {
      const { trendData, typeData, cardData } = res;
      state.cardList[0].value = cardData?.todayOrderCount || 0;
      state.cardList[1].value = cardData?.todayRevenue || 0;
      state.cardList[2].value = cardData?.payRate || 0;
      state.trendData = trendData && trendData.length > 0 ? trendData : [
        { date: '2025-04-01', count: 8 },
        { date: '2025-04-02', count: 10 },
        { date: '2025-04-03', count: 12 },
        { date: '2025-04-04', count: 9 },
        { date: '2025-04-05', count: 15 },
      ];
      state.stationData = typeData && typeData.length > 0 ? typeData.map(item => ({
        name: getOrderTypeLabel(item.type),
        value: item.count
      })) : [
        { name: '临时停车', value: 20 },
        { name: '错时停车', value: 15 },
        { name: '汽车充电', value: 12 },
        { name: '两轮充电', value: 8 },
        { name: '共享充电', value: 10 },
      ];
    } else {
      state.trendData = [
        { date: '2025-04-01', count: 8 },
        { date: '2025-04-02', count: 10 },
        { date: '2025-04-03', count: 12 },
        { date: '2025-04-04', count: 9 },
        { date: '2025-04-05', count: 15 },
      ];
      state.stationData = [
        { name: '丰泽站', value: 20 },
        { name: '鲤城站', value: 15 },
        { name: '晋江站', value: 12 },
        { name: '石狮站', value: 8 },
      ];
    }
  } catch (error) {
    console.error('获取订单图表数据失败:', error);
    ElMessage.error('获取订单图表数据失败');
    state.cardList[0].value = 12;
    state.cardList[1].value = 180.0;
    state.cardList[2].value = 99.0;
    state.trendData = [
      { date: '2025-04-01', count: 8 },
      { date: '2025-04-02', count: 10 },
      { date: '2025-04-03', count: 12 },
      { date: '2025-04-04', count: 9 },
      { date: '2025-04-05', count: 15 },
    ];
    state.stationData = [
      { name: '丰泽站', value: 20 },
      { name: '鲤城站', value: 15 },
      { name: '晋江站', value: 12 },
      { name: '石狮站', value: 8 },
    ];
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
      data: state.trendData.map(item => item.date),
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
        data: state.trendData.map(item => item.count),
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: { color: '#4A90E2', width: 2 },
        itemStyle: { color: '#4A90E2' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
            { offset: 1, color: 'rgba(74, 144, 226, 0.05)' },
          ]),
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderColor: '#4A90E2',
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: 'rgba(74, 144, 226, 0.5)',
          },
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
      data: state.trendData.map(item => item.date),
    },
    series: [
      {
        data: state.trendData.map(item => item.count),
      },
    ],
  });
};

onMounted(async () => {
  await fetchOrderChartData();
  initLineChart();

  window.addEventListener('resize', () => {
    lineChartInstance?.resize();
  });
});
</script>

<template>
  <div class="park-chart-box">
    <div class="chart-box-left">
      <Card class="left-card cursor-pointer" v-for="item in state.cardList" :key="item.title" v-bind="item" @click="handleCardClick" />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart" />
    <Columnar class="simple-bar-chart" title="各场站订单量" :x-data="state.stationData.map(item => item.name)"
      :series-data="[{ name: '订单数', data: state.stationData.map(item => item.value) }]" @bar-click="handleBarChartClick" />
  </div>
</template>

<style scoped>
.chart-box-left {
  display: flex;
  gap: 16px;
  width: 100%;
  
  .left-card {
    height: 159px !important;
    flex: 1;
  }
}
</style>
