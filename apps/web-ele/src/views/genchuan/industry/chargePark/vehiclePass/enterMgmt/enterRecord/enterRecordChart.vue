<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getEnterRecordChart } from '#/api/genchuan/industry/chargePark/vehiclePass/enterMgmt/enterRecord';

const props = defineProps({
  parkId: { type: Number, default: null },
});

const cards = reactive([
  { title: '今日入场量', value: 0, color: '#4A90E2', key: 'todayEnterCount' },
  { title: '正常入场', value: 0, color: '#50E3C2', key: 'normal' },
  { title: '异常入场', value: 0, color: '#FF6B8B', key: 'abnormal' },
  { title: '入场峰值', value: 0, color: '#FF9F40', key: 'enterPeak' },
]);

const state = reactive({
  chartData: {
    trend: [],
    typeCount: [],
  },
  hasData: false,
});

const lineChartRef = ref(null);
const barChartRef = ref(null);
let lineChartInstance = null;
let barChartInstance = null;

async function loadChartData() {
  try {
    const params = {
      stationId: props.parkId,
    };

    const res = await getEnterRecordChart(params);

    // Always update card values
    if (res?.cardData) {
      cards[0].value = res.cardData.todayEnterCount || 0;
      cards[3].value = res.cardData.enterPeak || 0;
    }

    // Check if there's chart data
    const hasChartData =
      res &&
      (res.enterCountTrend?.length > 0 || res.hourEnterCount?.length > 0);

    if (hasChartData) {
      state.chartData = {
        trend: res.enterCountTrend || [],
        typeCount: res.hourEnterCount || [],
      };
      state.hasData = true;
      await nextTick();
      initCharts();
    } else {
      state.hasData = false;
    }
  } catch (error) {
    console.error('加载图表数据失败:', error);
    state.hasData = false;
  }
}

function initLineChart() {
  if (!lineChartRef.value) return;
  if (lineChartInstance) lineChartInstance.dispose();
  lineChartInstance = echarts.init(lineChartRef.value);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '入场量趋势',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: state.chartData.trend.map((item) => item.date),
    },
    yAxis: {
      type: 'value',
      name: '入场数量',
    },
    series: [
      {
        name: '入场数量',
        type: 'line',
        data: state.chartData.trend.map((item) => item.count),
        smooth: true,
        lineStyle: { width: 3, color: '#4A90E2' },
        areaStyle: { color: 'rgba(74,144,226,0.1)' },
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
  };
  lineChartInstance.setOption(option);

  // 添加点击事件
  lineChartInstance.on('click', (params) => {
    window.dispatchEvent(
      new CustomEvent('filterByChart:enterRecord', {
        detail: { enterTime: params.name },
      }),
    );
  });
}

function initBarChart() {
  if (!barChartRef.value) return;
  if (barChartInstance) barChartInstance.dispose();
  barChartInstance = echarts.init(barChartRef.value);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '各时段入场量',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: state.chartData.typeCount.map((item) => item.hour),
    },
    yAxis: {
      type: 'value',
      name: '数量',
    },
    series: [
      {
        type: 'bar',
        data: state.chartData.typeCount.map((item) => item.count),
        itemStyle: { borderRadius: [4, 4, 0, 0], color: '#4A90E2' },
        label: { show: true, position: 'top' },
      },
    ],
  };
  barChartInstance.setOption(option);

  // 添加点击事件
  barChartInstance.on('click', (params) => {
    const today = new Date().toISOString().split('T')[0];
    window.dispatchEvent(
      new CustomEvent('filterByChart:enterRecord', {
        detail: {
          enterTime: today,
          hour: params.name,
        },
      }),
    );
  });
}

function initCharts() {
  initLineChart();
  initBarChart();
}

function handleCardClick(key) {
  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0)).getTime();
  const todayEnd = new Date(today.setHours(23, 59, 59, 999)).getTime();

  const filterMap = {
    todayEnterCount: { startTime: todayStart, endTime: todayEnd },
    normal: { status: '正常记录' },
    abnormal: { status: '异常记录' },
    enterPeak: { startTime: todayStart, endTime: todayEnd },
  };

  const filterParams = filterMap[key];
  if (filterParams) {
    window.dispatchEvent(
      new CustomEvent('filterByChart:enterRecord', { detail: filterParams }),
    );
  }
}

onMounted(() => {
  loadChartData();
  window.addEventListener('resize', () => {
    lineChartInstance?.resize();
    barChartInstance?.resize();
  });
});

onUnmounted(() => {
  lineChartInstance?.dispose();
  barChartInstance?.dispose();
});
</script>

<template>
  <div class="chart-box">
    <!-- 左侧卡片区域 -->
    <div class="box-left">
      <div
        v-for="card in cards"
        :key="card.title"
        class="left-card"
        :style="{ borderLeftColor: card.color }"
        @click="handleCardClick(card.key)"
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
        </div>
      </div>
    </div>

    <!-- 右侧图表区域 -->
    <div v-if="state.hasData" class="chart-wrapper">
      <div class="chart-container">
        <div ref="lineChartRef" style="width: 100%; height: 100%"></div>
      </div>
      <div class="chart-container">
        <div ref="barChartRef" style="width: 100%; height: 100%"></div>
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
    display: grid !important;
    flex: 0 0 auto !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    min-width: 280px !important;
    max-width: 320px !important;
    margin-top: 10px !important;

    .left-card {
      display: flex;
      flex-direction: column;
      height: 150px;
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
