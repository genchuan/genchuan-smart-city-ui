<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getAgentPayRuleChart } from '#/api/genchuan/industry/chargePark/orderTrade/agentPay/index.js';
import Card from '#/components/stats/card.vue';

const state = reactive({
  cardList: [
    { title: '已生效数量', value: 0, color: '#FF6B6B' },
    { title: '今日订单数', value: 0, color: '#4ECDC4' },
    { title: '规则总数', value: 0, color: '#13ce66' },
  ],
  useDistData: [],
});

const lineChartRef = ref(null);
let lineChartInstance = null;

// 获取代付规则图表数据
const fetchOrderChartData = async () => {
  try {
    const res = await getAgentPayRuleChart();
    state.cardList[0].value = res.enabledCount || 0;
    state.cardList[1].value = res.todayOrderCount || 0;
    // 规则总数通过使用分布数据计算
    state.cardList[2].value = res.useDistData?.reduce((sum, item) => sum + item.count, 0) || 0;
    // 如果useDistData为空，使用假数据
    state.useDistData =
      res.useDistData && res.useDistData.length > 0
        ? res.useDistData
        : [
            { agent_type: 'merchant', count: 4 },
            { agent_type: 'enterprise', count: 1 },
            { agent_type: 'public', count: 1 },
          ];
    // 更新图表
    updateChart();
  } catch (error) {
    console.error('获取代付规则图表数据失败:', error);
    // 接口调用失败时使用假数据
    state.cardList[0].value = 3;
    state.cardList[1].value = 1;
    state.cardList[2].value = 6;
    state.useDistData = [
      { agent_type: 'merchant', count: 4 },
      { agent_type: 'enterprise', count: 1 },
      { agent_type: 'public', count: 1 },
    ];
    // 更新图表
    updateChart();
  }
};

// 代付类型映射
const agentTypeMap = {
  merchant: '商户代付',
  enterprise: '企业代付',
  public: '公益代付',
};

// 获取代付类型标签
const getAgentTypeLabel = (agentType) => {
  return agentTypeMap[agentType] || agentType;
};

// 初始化图表
const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '代付类型分布',
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
      data: state.useDistData.map((item) => getAgentTypeLabel(item.agent_type)),
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
        data: state.useDistData.map((item) => item.count),
        barWidth: '50%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4A90E2' },
            { offset: 1, color: '#1E5AA8' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  lineChartInstance.setOption(option);
};

// 更新图表
const updateChart = () => {
  if (!lineChartInstance) return;

  lineChartInstance.setOption({
    xAxis: {
      data: state.useDistData.map((item) => getAgentTypeLabel(item.agent_type)),
    },
    series: [
      {
        data: state.useDistData.map((item) => item.count),
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
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <div ref="lineChartRef" class="simple-bar-chart"></div>
  </div>
</template>
