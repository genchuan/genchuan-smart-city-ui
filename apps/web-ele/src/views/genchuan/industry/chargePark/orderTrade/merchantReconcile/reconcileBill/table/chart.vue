<script setup>
import { onMounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getReconcileBillChart } from '#/api/genchuan/industry/chargePark/orderTrade/merchantReconcile/index.js';
import Card from '#/components/stats/card.vue';

const emit = defineEmits(['filter-change']);

const state = reactive({
  cardList: [
    { title: '待对账数', value: 0, color: '#FF6B6B', status: 'pending' },
    { title: '异常数', value: 0, color: '#E74C3C', status: 'abnormal' },
    { title: '已确认数', value: 0, color: '#13ce66', status: 'reconciled' },
    { title: '确认率', value: 0, color: '#4A90E2', suffix: '%', status: null },
  ],
  trendData: [],
});

const handleCardClick = (status) => {
  emit('filter-change', { status: status || null });
};

const handleLineChartClick = (params) => {
  if (params && params.name) {
    emit('filter-change', {
      billDateStart: params.name + ' 00:00:00',
      billDateEnd: params.name + ' 23:59:59',
    });
  }
};

const lineChartRef = ref(null);
let lineChartInstance = null;

const fetchReconcileBillChartData = async () => {
  try {
    const res = await getReconcileBillChart();
    state.cardList[0].value = res.cardData?.pendingCount || res.pendingCount || 0;
    state.cardList[1].value = res.cardData?.disputedCount || res.disputedCount || 0;
    state.cardList[2].value = res.cardData?.confirmedCount || res.confirmedCount || 0;
    state.cardList[3].value = res.cardData?.confirmRate || res.confirmRate || 0;
    state.trendData =
      res.trendData && res.trendData.length > 0
        ? res.trendData
        : [
            { date: '2026-04-27', count: 10 },
          ];
    updateChart();
  } catch (error) {
    console.error('获取对账单图表数据失败:', error);
    state.cardList[0].value = 1;
    state.cardList[1].value = 0;
    state.cardList[2].value = 0;
    state.cardList[3].value = 0;
    state.trendData = [
      { date: '2026-04-27', count: 10 },
    ];
    updateChart();
  }
};

const initChart = () => {
  if (!lineChartRef.value) return;

  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    title: {
      text: '对账趋势',
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
        name: '对账数',
        type: 'line',
        smooth: true,
        data: state.trendData.map((item) => item.count),
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

const updateChart = () => {
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
  fetchReconcileBillChartData().then(() => {
    initChart();
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
.park-chart-box {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: hsl(var(--card));
  border-radius: 8px;
}

.chart-box-left {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  grid-template-rows: repeat(2, 1fr) !important;
  gap: 16px !important;
  flex-shrink: 0;
  width: 40%;
  max-width: 400px;
}

.chart-box-left :deep(.left-card) {
  width: 100% !important;
  flex-shrink: 0;
}

.chart-box-left :deep(.stat-card) {
  width: 100% !important;
  height: 150px !important;
  min-width: unset !important;
  max-width: unset !important;
}

.simple-bar-chart {
  width: 100%;
  height: 200px;
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}
</style>
