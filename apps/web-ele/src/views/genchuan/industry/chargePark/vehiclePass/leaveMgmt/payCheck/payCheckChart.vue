<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getPayCheckChart } from '#/api/genchuan/industry/chargePark/vehiclePass/leaveMgmt/payCheck';

const props = defineProps({
  parkId: { type: Number, default: null },
});

const cards = reactive([
  {
    title: '核验成功率',
    value: '0%',
    desc: '支付核验准确度',
    color: '#4A90E2',
    key: 'checkSuccessRate',
  },
  {
    title: '平均核验时长',
    value: '0s',
    desc: '核验响应速度',
    color: '#50E3C2',
    key: 'avgCheckDuration',
  },
]);

const state = reactive({
  chartData: {
    trend: [],
  },
  hasData: false,
});

const pieChartRef = ref(null);
let pieChartInstance = null;

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

    const res = await getPayCheckChart(params);

    // Always update card values
    if (res?.cardData) {
      cards[0].value = res.cardData.checkSuccessRate
        ? `${res.cardData.checkSuccessRate}%`
        : '0%';
      cards[1].value = res.cardData.avgCheckDuration
        ? `${res.cardData.avgCheckDuration}s`
        : '0s';
    }

    // Check if there's chart data
    const hasChartData = res?.checkSuccessTrend?.length > 0;

    if (hasChartData) {
      state.chartData = {
        trend: res.checkSuccessTrend || [],
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
      text: '核验成功率趋势',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis', formatter: '{b}<br/>{a}: {c}%' },
    xAxis: {
      type: 'category',
      data: state.chartData.trend.map((item) => item.date),
    },
    yAxis: { type: 'value', name: '成功率(%)', min: 90, max: 100 },
    series: [
      {
        name: '核验成功率',
        type: 'line',
        data: state.chartData.trend.map((item) => item.rate),
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
  // 暂时不需要柱状图
}

function initCharts() {
  initPieChart();
}

function handleCardClick(key) {
  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0)).getTime();
  const todayEnd = new Date(today.setHours(23, 59, 59, 999)).getTime();

  const filterMap = {
    checkSuccessRate: { startTime: todayStart, endTime: todayEnd },
    avgCheckDuration: { startTime: todayStart, endTime: todayEnd },
  };

  const filterParams = filterMap[key];
  if (filterParams) {
    window.dispatchEvent(
      new CustomEvent('filterByChart', { detail: filterParams }),
    );
  }
}

onMounted(() => {
  loadChartData();
  window.addEventListener('resize', () => {
    pieChartInstance?.resize();
  });
});
onUnmounted(() => {
  pieChartInstance?.dispose();
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
