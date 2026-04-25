<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';

import * as echarts from 'echarts';

import { getPlateIdentifyChart } from '#/api/genchuan/industry/chargePark/vehiclePass/enterMgmt/plateIdentify';

const props = defineProps({
  parkId: { type: Number, default: null },
});

const chartData = reactive({
  cards: [
    {
      title: '识别成功率',
      value: '0%',
      desc: '今日识别准确度',
      color: '#4A90E2',
    },
    {
      title: '平均识别时长',
      value: '0s',
      desc: '识别响应速度',
      color: '#50E3C2',
    },
  ],
  charts: [
    {
      type: 'line',
      title: '识别成功率趋势',
      xAxis: [],
      series: [],
    },
    {
      type: 'bar',
      title: '各场站识别量',
      xAxis: [],
      series: [],
    },
  ],
  hasData: false,
});

const chartRefs = ref({});
const chartInstances = ref({});

async function loadChartData() {
  try {
    const endTime = new Date();
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - 7);

    const params = {
      startTime: startTime.toISOString().split('T')[0],
      endTime: endTime.toISOString().split('T')[0],
      stationId: props.parkId,
    };

    const res = await getPlateIdentifyChart(params);

    // Always update card values
    if (res?.cardData) {
      chartData.cards[0].value = res.cardData.successRate
        ? `${res.cardData.successRate}%`
        : '0%';
      chartData.cards[1].value = res.cardData.avgDuration
        ? `${res.cardData.avgDuration}s`
        : '0s';
    }

    // Check if there's chart data
    const hasChartData =
      res &&
      (res.successRateTrend?.length > 0 ||
        res.stationIdentifyCount?.length > 0);

    if (hasChartData) {
      chartData.charts[0].xAxis = (res.successRateTrend || []).map(
        (item) => item.date,
      );
      chartData.charts[0].series = (res.successRateTrend || []).map(
        (item) => item.rate,
      );

      chartData.charts[1].xAxis = (res.stationIdentifyCount || []).map(
        (item) => item.stationName,
      );
      chartData.charts[1].series = (res.stationIdentifyCount || []).map(
        (item) => item.count,
      );

      chartData.hasData = true;
      await nextTick();
      initCharts();
    } else {
      chartData.hasData = false;
    }
  } catch (error) {
    console.error('加载图表数据失败:', error);
    chartData.hasData = false;
  }
}

function initCharts() {
  chartData.charts.forEach((chart, index) => {
    const chartRef = chartRefs.value[`chart-${index}`];
    if (!chartRef) return;

    if (chartInstances.value[`chart-${index}`]) {
      chartInstances.value[`chart-${index}`].dispose();
    }

    const chartInstance = echarts.init(chartRef);
    chartInstances.value[`chart-${index}`] = chartInstance;

    const option = getChartOption(chart);
    chartInstance.setOption(option);
  });
}

function getChartOption(chart) {
  const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B'];

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: chart.title,
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500, color: '#6E7E91' },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
    },
    color: freshColors,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '40px',
      containLabel: true,
      backgroundColor: 'transparent',
    },
    xAxis: {
      type: 'category',
      boundaryGap: chart.type === 'bar',
      data: chart.xAxis,
      axisLabel: { color: '#9AA8B7', fontSize: 11 },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
      axisTick: { lineStyle: { color: '#E8F4FD' } },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#9AA8B7', fontSize: 11 },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
      axisTick: { lineStyle: { color: '#E8F4FD' } },
      splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
    },
    series: [
      {
        name: chart.title,
        type: chart.type,
        data: chart.series,
        smooth: chart.type === 'line',
        lineStyle: chart.type === 'line' ? { width: 3 } : undefined,
        symbol: chart.type === 'line' ? 'circle' : undefined,
        symbolSize: chart.type === 'line' ? 6 : undefined,
        itemStyle: {
          borderRadius: chart.type === 'bar' ? [4, 4, 0, 0] : undefined,
        },
        label: {
          show: chart.type === 'bar',
          position: 'top',
          color: '#6E7E91',
          fontSize: 12,
        },
      },
    ],
  };

  return option;
}

function handleResize() {
  Object.values(chartInstances.value).forEach((chartInstance) => {
    chartInstance.resize();
  });
}

// 监听 parkId 变化
watch(
  () => props.parkId,
  () => {
    loadChartData();
  },
  { immediate: true },
);

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  Object.values(chartInstances.value).forEach((chartInstance) => {
    chartInstance.dispose();
  });
});
</script>

<template>
  <div class="chart-box">
    <!-- 左侧卡片区域 -->
    <div class="box-left">
      <div
        v-for="(card, index) in chartData.cards"
        :key="`card-${index}`"
        class="left-card"
        :style="{ borderLeftColor: card.color }"
      >
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <div
            class="card-indicator"
            :style="{ backgroundColor: card.color }"
          ></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: card.color }">
            {{ card.value }}
          </div>
          <div class="card-desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧图表区域 -->
    <div v-if="chartData.hasData" class="chart-wrapper">
      <div
        v-for="(chart, index) in chartData.charts"
        :key="`chart-${index}`"
        class="chart-container"
      >
        <div
          :ref="(el) => (chartRefs.value[`chart-${index}`] = el)"
          style="width: 100%; height: 100%"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 覆盖全局样式
@media (min-width: 1200px) {
  .chart-box .chart-wrapper {
    min-width: 0 !important;
    margin-left: 0 !important;
  }

  .chart-box .chart-wrapper .chart-container {
    min-width: 0 !important;
  }
}

.chart-box {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  width: 100% !important;
  padding-right: 15px;
  padding-bottom: 0.5rem;
  padding-left: 15px;

  .box-left {
    display: flex !important;
    flex: 0 0 auto !important;
    flex-direction: column;
    gap: 12px;
    min-width: 280px !important;
    max-width: 320px !important;
    margin-top: 10px !important;

    .left-card {
      display: flex;
      flex-direction: column;
      height: 102px;
      padding: 16px 14px;
      overflow: hidden;
      cursor: pointer;
      border-left: 4px solid #4a90e2;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
        transform: translateY(-2px);
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        .card-title {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.3;
          color: #606266;
        }

        .card-indicator {
          flex-shrink: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
      }

      .card-body {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;

        .card-value {
          margin-bottom: 4px;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
        }

        .card-desc {
          font-size: 12px;
          line-height: 1;
          color: #909399;
        }
      }
    }
  }

  .chart-wrapper {
    display: flex !important;
    flex: 1 !important;
    gap: 15px;
    min-width: 0 !important;
    max-width: none !important;
    margin: 0 !important;

    .chart-container {
      flex: 1;
      min-width: 0;
      height: 330px;
      padding: 10px;
      background-color: hsl(var(--card));
      border-radius: 8px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
    }
  }
}
</style>
