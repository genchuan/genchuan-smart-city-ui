<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getAbnormalLeaveChart } from '#/api/genchuan/industry/chargePark/vehiclePass/leaveMgmt/abnormalLeave';

const props = defineProps({
  parkId: { type: Number, default: null },
});

const cards = reactive([
  {
    title: '待处置异常数',
    value: 0,
    desc: '等待处理',
    color: '#FF6B8B',
    key: 'waitHandleCount',
  },
  {
    title: '处置完成率',
    value: '0%',
    desc: '处置进度',
    color: '#50E3C2',
    key: 'handleCompleteRate',
  },
]);

const state = reactive({
  chartData: {
    trend: [],
    stationCount: [],
  },
  hasData: false,
});

const pieChartRef = ref(null);
const barChartRef = ref(null);
let pieChartInstance = null;
let barChartInstance = null;

async function loadChartData() {
  try {
    const params = {
      stationName: props.parkId,
    };

    const res = await getAbnormalLeaveChart(params);

    // Always update card values
    if (res?.cardData) {
      cards[0].value = res.cardData.waitHandleCount || 0;
      cards[1].value = res.cardData.handleCompleteRate
        ? `${res.cardData.handleCompleteRate}%`
        : '0%';
    }

    // Check if there's chart data
    const hasChartData =
      res &&
      (res.abnormalLeaveTrend?.length > 0 ||
        res.stationAbnormalCount?.length > 0);

    if (hasChartData) {
      state.chartData = {
        trend: res.abnormalLeaveTrend || [],
        stationCount: res.stationAbnormalCount || [],
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

function initPieChart() {
  if (!pieChartRef.value) return;
  if (pieChartInstance) pieChartInstance.dispose();
  pieChartInstance = echarts.init(pieChartRef.value);
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '异常离场趋势',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: state.chartData.trend.map((item) => item.date),
    },
    yAxis: { type: 'value', name: '异常数量' },
    series: [
      {
        name: '异常数量',
        type: 'line',
        data: state.chartData.trend.map((item) => item.count),
        smooth: true,
        lineStyle: { width: 3, color: '#FF6B8B' },
        areaStyle: { color: 'rgba(255,107,139,0.1)' },
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
  };
  pieChartInstance.setOption(option);

  // 添加点击事件 - 点击折线数据点筛选对应日期的异常离场记录
  pieChartInstance.on('click', (params) => {
    const clickedDate = params.name;
    window.dispatchEvent(
      new CustomEvent('filterByChart:abnormalLeave', {
        detail: { createTimeRange: [clickedDate, clickedDate] },
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
      text: '各场站异常数',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: state.chartData.stationCount.map((item) => item.stationName),
    },
    yAxis: { type: 'value', name: '异常数' },
    series: [
      {
        type: 'bar',
        data: state.chartData.stationCount.map((item) => item.count),
        itemStyle: { borderRadius: [4, 4, 0, 0], color: '#FF6B8B' },
        label: { show: true, position: 'top' },
      },
    ],
  };
  barChartInstance.setOption(option);

  // 添加点击事件 - 点击柱形筛选对应场站的异常离场记录
  barChartInstance.on('click', (params) => {
    const stationName = params.name;
    window.dispatchEvent(
      new CustomEvent('filterByChart:abnormalLeave', {
        detail: { stationName },
      }),
    );
  });
}

function initCharts() {
  initPieChart();
  initBarChart();
}

function handleCardClick(key) {
  const filterMap = {
    waitHandleCount: { handleStatus: '待处置' },
    handleCompleteRate: { handleStatus: '已完成' },
  };

  const filterParams = filterMap[key];
  if (filterParams) {
    window.dispatchEvent(
      new CustomEvent('filterByChart:abnormalLeave', { detail: filterParams }),
    );
  }
}

onMounted(() => {
  loadChartData();
  window.addEventListener('resize', () => {
    pieChartInstance?.resize();
    barChartInstance?.resize();
  });
});
onUnmounted(() => {
  pieChartInstance?.dispose();
  barChartInstance?.dispose();
});
</script>

<template>
  <div class="chart-box">
    <!-- 左侧卡片区域 -->
    <div class="box-left">
      <div
        v-for="card in cards"
        :key="card.key"
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
          <div class="card-desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧图表区域 -->
    <div v-if="state.hasData" class="chart-wrapper">
      <div class="chart-container">
        <div ref="pieChartRef" style="width: 100%; height: 100%"></div>
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
  align-items: flex-end;
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
    height: 330px;

    .left-card {
      display: flex;
      flex: 1;
      flex-direction: column;
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
