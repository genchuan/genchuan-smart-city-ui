<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getDebtRecordChart } from '#/api/genchuan/industry/chargePark/orderTrade/debtCollect/index.js';
import Card from '#/components/stats/card.vue';

const emit = defineEmits(['filter-change']);

const state = reactive({
  cardList: [
    { title: '欠费总额(元)', value: 0, color: '#13ce66' },
    { title: '追缴完成率(%)', value: 0, color: '#4ECDC4' },
  ],
  trendData: [],
});

// 点击卡片事件
const handleCardClick = (index) => {
  // 欠费总额(index=0)：不进行筛选
  // 追缴完成率(index=1)：筛选状态为已完成，不需要传递时间
  if (index === 1) {
    emit('filter-change', {
      status: 'completed',
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

const lineChartRef = ref(null);
let lineChartInstance = null;

// 获取逃费记录图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getDebtRecordChart();
    if (res.cardData) {
      state.cardList[0].value = res.cardData.totalArrearAmount || 0;
      state.cardList[1].value = res.cardData.collectCompleteRate || 0;
    } else {
      state.cardList[0].value = res.totalArrearAmount || 0;
      state.cardList[1].value = res.collectCompleteRate || 0;
    }
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2025-04-01', count: 3 },
            { date: '2025-04-02', count: 5 },
            { date: '2025-04-03', count: 2 },
            { date: '2025-04-04', count: 7 },
            { date: '2025-04-05', count: 4 },
          ];
    updateLineChart();
  } catch (error) {
    console.error('获取逃费记录图表数据失败:', error);
    state.cardList[0].value = 375;
    state.cardList[1].value = 33.3;
    state.trendData = [
      { date: '2025-04-01', count: 3 },
      { date: '2025-04-02', count: 5 },
      { date: '2025-04-03', count: 2 },
      { date: '2025-04-04', count: 7 },
      { date: '2025-04-05', count: 4 },
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