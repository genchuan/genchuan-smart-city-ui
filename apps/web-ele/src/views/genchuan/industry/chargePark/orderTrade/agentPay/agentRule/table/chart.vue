<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getAgentPayRuleChart } from '#/api/genchuan/industry/chargePark/orderTrade/agentPay/index.js';
import Card from '#/components/stats/card.vue';

const emit = defineEmits(['filter-change']);

const agentTypeMap = {
  merchant: '商户代付',
  enterprise: '企业代付',
  public: '公益代付',
};

const getAgentTypeLabel = (agentType) => {
  return agentTypeMap[agentType] || agentType;
};

const state = reactive({
  cardList: [
    { title: '已生效数量', value: 0, color: '#FF6B6B' },
    { title: '今日订单数', value: 0, color: '#4ECDC4' },
  ],
  useDistData: [],
});

// 点击卡片事件
const handleCardClick = () => {
  emit('filter-change', {
    agentType: null,
    status: null,
  });
};

// 柱状图点击事件处理
const handleBarChartClick = (params) => {
  if (params && params.name) {
    const agentTypeKey = Object.keys(agentTypeMap).find(key => agentTypeMap[key] === params.name);
    emit('filter-change', {
      agentType: agentTypeKey || null,
      status: null,
    });
  }
};

const lineChartRef = ref(null);
let lineChartInstance = null;

const fetchOrderChartData = async () => {
  try {
    const res = await getAgentPayRuleChart();
    state.cardList[0].value = res.cardData?.enabledCount || res.enabledCount || 0;
    state.cardList[1].value = res.cardData?.todayOrderCount || res.todayOrderCount || 0;
    state.useDistData =
      res.useDistData && res.useDistData.length > 0
        ? res.useDistData
        : [
            { agent_type: 'merchant', count: 5 },
            { agent_type: 'public', count: 3 },
            { agent_type: 'enterprise', count: 2 },
          ];
    updateChart();
  } catch (error) {
    console.error('获取代付规则图表数据失败:', error);
    state.cardList[0].value = 7;
    state.cardList[1].value = 0;
    state.useDistData = [
      { agent_type: 'merchant', count: 5 },
      { agent_type: 'public', count: 3 },
      { agent_type: 'enterprise', count: 2 },
    ];
    updateChart();
  }
};

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

  lineChartInstance.on('click', (params) => {
    handleBarChartClick(params);
  });
};

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
        class="left-card cursor-pointer"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
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