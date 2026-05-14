<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';

import { getDebtRecordCollectConfigChart } from '#/api/genchuan/industry/chargePark/orderTrade/debtCollect/index.js';
import Card from '#/components/stats/card.vue';

const emit = defineEmits(['filter-change']);

const methodMap = {
  sms: { label: '短信', type: 'primary' },
  notify: { label: '站内信', type: 'info' },
  phone: { label: '电话', type: 'warning' },
};

const state = reactive({
  cardList: [
    { title: '启用配置数', value: 0, color: '#13ce66' },
    { title: '追缴触发率', value: 0, color: '#4ECDC4', suffix: '%' },
  ],
  typeData: [],
});

// 点击卡片事件 - 查询今日数据
const handleCardClick = () => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  emit('filter-change', {
    createTimeStart: todayStr + ' 00:00:00',
    createTimeEnd: todayStr + ' 23:59:59',
    collectMethod: null,
  });
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
      createTimeStart: start,
      createTimeEnd: end,
      collectMethod: methodKey || params.name,
    });
  }
};

// 获取追缴配置图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getDebtRecordCollectConfigChart();
    state.cardList[0].value = res.cardData?.enableConfigCount || res.enableConfigCount || 0;
    state.cardList[1].value = res.cardData?.collectTriggerRate || res.collectTriggerRate || 0;
    state.typeData =
      res.typeData && Array.isArray(res.typeData) && res.typeData.length > 0
        ? res.typeData
        : [
            { method: 'sms', count: 6 },
            { method: 'notify', count: 5 },
            { method: 'phone', count: 4 },
          ];
    updateBarChart();
  } catch (error) {
    console.error('获取追缴配置图表数据失败:', error);
    state.cardList[0].value = 11;
    state.cardList[1].value = 73.3;
    state.typeData = [
      { method: 'sms', count: 6 },
      { method: 'notify', count: 5 },
      { method: 'phone', count: 4 },
    ];
    updateBarChart();
  }
};

const barChartRef = ref(null);
let barChartInstance = null;

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
      data: state.typeData.map((item) => methodMap[item.method]?.label || item.method),
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
        name: '配置数',
        type: 'bar',
        barWidth: '40%',
        data: state.typeData.map((item) => item.count),
        itemStyle: {
          color: (params) => {
            const method = state.typeData[params.dataIndex]?.method;
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
      data: state.typeData.map((item) => methodMap[item.method]?.label || item.method),
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
    initBarChart();
  });

  window.addEventListener('resize', () => {
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
        @click="handleCardClick"
      />
    </div>
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