<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getInvoiceAuditChart } from '#/api/genchuan/industry/chargePark/orderTrade/invoiceMgmt/index.js';
import Card from '#/components/stats/card.vue';

const emit = defineEmits(['filter-change']);

const state = reactive({
  cardList: [
    { title: '待审核数', value: 0, color: '#FF6B6B', status: 'pending' },
    { title: '审核通过率', value: 0, color: '#4ECDC4', suffix: '%', status: null },
  ],
  trendData: [],
});

// 点击卡片事件
const handleCardClick = (status) => {
  emit('filter-change', {
    status: status || null,
  });
};

// 折线图点击事件处理
const handleLineChartClick = (params) => {
  if (params && params.name) {
    emit('filter-change', {
      createTimeStart: params.name + ' 00:00:00',
      createTimeEnd: params.name + ' 23:59:59',
    });
  }
};

const lineChartRef = ref(null);
let lineChartInstance = null;

const fetchInvoiceAuditChartData = async () => {
  try {
    const res = await getInvoiceAuditChart();
    state.cardList[0].value = res.cardData?.pendingCount || res.pendingCount || 0;
    state.cardList[1].value = res.cardData?.approveRate || res.approveRate || 0;
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2026-04-27', count: 10 },
          ];
    updateLineChart();
  } catch (error) {
    console.error('获取发票审核图表数据失败:', error);
    state.cardList[0].value = 3;
    state.cardList[1].value = 60;
    state.trendData = [
      { date: '2026-04-27', count: 10 },
    ];
    updateLineChart();
  }
};

const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '审核趋势',
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
        name: '审核数',
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
  fetchInvoiceAuditChartData().then(() => {
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

<style scoped lang="scss">
.left-card {
  flex:1;
  width: 330px;

  :deep(.stat-card) {
    flex:1;
  }
}
</style>