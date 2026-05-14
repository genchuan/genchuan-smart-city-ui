<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getRefundApplyChart } from '#/api/genchuan/industry/chargePark/orderTrade/refundMgmt/index.js';
import Card from '#/components/stats/card.vue';

const emit = defineEmits(['filter-change']);

const statusMap = {
  pending_audit: { label: '待审核', type: 'warning' },
  pending_exec: { label: '待执行', type: 'primary' },
  rejected: { label: '已拒绝', type: 'danger' },
  completed: { label: '已完成', type: 'success' },
};

const state = reactive({
  cardList: [
    { title: '待审核数', value: 0, color: '#FF6B6B', status: 'pending_audit' },
    { title: '审核通过率', value: 0, color: '#4ECDC4', suffix: '%', status: null },
  ],
  trendData: [],
  typeData: [],
});

// 点击卡片事件
const handleCardClick = (status) => {
  emit('filter-change', {
    applyTimeStart: null,
    applyTimeEnd: null,
    status: status || null,
  });
};

// 折线图点击事件处理
const handleLineChartClick = (params) => {
  if (params && params.name) {
    emit('filter-change', {
      applyTimeStart: params.name + ' 00:00:00',
      applyTimeEnd: params.name + ' 23:59:59',
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
      applyTimeStart: start,
      applyTimeEnd: end,
      status: statusKey || params.name,
    });
  }
};

const lineChartRef = ref(null);
let lineChartInstance = null;

const barChartRef = ref(null);
let barChartInstance = null;

// 获取退款申请图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getRefundApplyChart();
    state.cardList[0].value = res.cardData?.waitAuditCount || res.waitAuditCount || 0;
    state.cardList[1].value = res.cardData?.auditPassRate || res.auditPassRate || 0;
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2026-04-27', count: 15 },
            { date: '2026-04-28', count: 1 },
            { date: '2026-05-08', count: 2 },
          ];
    state.typeData =
      res.typeData && Array.isArray(res.typeData) && res.typeData.length > 0
        ? res.typeData
        : [
            { count: 8, status: 'pending_audit' },
            { count: 3, status: 'pending_exec' },
            { count: 2, status: 'rejected' },
            { count: 5, status: 'completed' },
          ];
    updateLineChart();
    updateBarChart();
  } catch (error) {
    console.error('获取退款申请图表数据失败:', error);
    state.cardList[0].value = 8;
    state.cardList[1].value = 27.8;
    state.trendData = [
      { date: '2026-04-27', count: 15 },
      { date: '2026-04-28', count: 1 },
      { date: '2026-05-08', count: 2 },
    ];
    state.typeData = [
      { count: 8, status: 'pending_audit' },
      { count: 3, status: 'pending_exec' },
      { count: 2, status: 'rejected' },
      { count: 5, status: 'completed' },
    ];
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
      text: '退款申请趋势',
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
      text: '申请状态分布',
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
      data: state.typeData.map((item) => statusMap[item.status]?.label || item.status),
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
        barWidth: '40%',
        data: state.typeData.map((item) => item.count),
        itemStyle: {
          color: (params) => {
            const status = state.typeData[params.dataIndex]?.status;
            return statusMap[status]?.color || '#4A90E2';
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
      data: state.typeData.map((item) => statusMap[item.status]?.label || item.status),
    },
    series: [
      {
        data: state.typeData.map((item) => item.count),
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
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick(item.status)"
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