<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getGateOpenChart } from '#/api/genchuan/industry/chargePark/vehiclePass/specialPass/gateOpen';

const props = defineProps({
  parkId: { type: Number, default: null },
});

const cards = reactive([
  {
    title: '申请量',
    value: 0,
    desc: '累计申请次数',
    color: '#4A90E2',
    key: 'applyCount',
  },
  {
    title: '审批通过率',
    value: '0%',
    desc: '审核通过比例',
    color: '#50E3C2',
    key: 'auditPassRate',
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
    const endTime = new Date();
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - 7);

    const params = {
      startTime: Math.floor(startTime.getTime() / 1000).toString(),
      endTime: Math.floor(endTime.getTime() / 1000).toString(),
      stationId: props.parkId,
    };

    const res = await getGateOpenChart(params);

    // Always update card values
    if (res?.cardData) {
      cards[0].value = res.cardData.applyCount || 0;
      cards[1].value = res.cardData.auditPassRate
        ? `${res.cardData.auditPassRate}%`
        : '0%';
    }

    // Check if there's chart data
    const hasChartData =
      res &&
      (res.openApplyTrend?.length > 0 || res.stationOpenCount?.length > 0);

    if (hasChartData) {
      state.chartData = {
        trend: res.openApplyTrend || [],
        stationCount: res.stationOpenCount || [],
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
      text: '开闸申请趋势',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: state.chartData.trend.map((item) => item.date),
    },
    yAxis: { type: 'value', name: '申请量' },
    series: [
      {
        name: '申请量',
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
  pieChartInstance.setOption(option);
}

function initBarChart() {
  if (!barChartRef.value) return;
  if (barChartInstance) barChartInstance.dispose();
  barChartInstance = echarts.init(barChartRef.value);
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '各场站开闸量',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: state.chartData.stationCount.map((item) => item.stationName),
    },
    yAxis: { type: 'value', name: '开闸量' },
    series: [
      {
        type: 'bar',
        data: state.chartData.stationCount.map((item) => item.count),
        itemStyle: { borderRadius: [4, 4, 0, 0], color: '#4A90E2' },
        label: { show: true, position: 'top' },
      },
    ],
  };
  barChartInstance.setOption(option);
}

function initCharts() {
  initPieChart();
  initBarChart();
}

function handleCardClick(key) {
  window.dispatchEvent(
    new CustomEvent('filterByStatus', { detail: { status: key } }),
  );
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
      <div ref="pieChartRef" class="chart-container"></div>
      <div ref="barChartRef" class="chart-container"></div>
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
