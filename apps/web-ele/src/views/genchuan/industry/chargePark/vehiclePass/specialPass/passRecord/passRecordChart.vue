<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getPassRecordChart } from '#/api/genchuan/industry/chargePark/vehiclePass/specialPass/passRecord';

const props = defineProps({
  parkId: { type: Number, default: null },
});

const cards = reactive([
  {
    title: '今日放行量',
    value: 0,
    desc: '今日累计放行次数',
    color: '#4A90E2',
    key: 'todayPassCount',
  },
  {
    title: '异常放行占比',
    value: '0%',
    desc: '异常放行比例',
    color: '#F56C6C',
    key: 'abnormalPassRate',
  },
]);

const state = reactive({
  chartData: {
    trend: [],
  },
  hasData: false,
});

const trendChartRef = ref(null);
let trendChartInstance = null;

async function loadChartData() {
  try {
    const params = {
      stationId: props.parkId,
    };

    const res = await getPassRecordChart(params);

    // 更新卡片数据
    if (res?.cardData) {
      cards[0].value = res.cardData.todayPassCount || 0;
      cards[1].value = res.cardData.abnormalPassRate
        ? `${res.cardData.abnormalPassRate}%`
        : '0%';
    }

    // 检查是否有图表数据
    const hasChartData = res && res.passCountTrend?.length > 0;

    if (hasChartData) {
      state.chartData = {
        trend: res.passCountTrend || [],
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

function initTrendChart() {
  if (!trendChartRef.value) return;
  if (trendChartInstance) trendChartInstance.dispose();
  trendChartInstance = echarts.init(trendChartRef.value);
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '放行量趋势',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>{a}: {c}次',
    },
    xAxis: {
      type: 'category',
      data: state.chartData.trend.map((item) => item.date),
      axisLabel: {
        rotate: 30,
      },
    },
    yAxis: {
      type: 'value',
      name: '放行数量',
      minInterval: 1,
    },
    series: [
      {
        name: '放行数量',
        type: 'line',
        data: state.chartData.trend.map((item) => item.count),
        smooth: true,
        lineStyle: { width: 3, color: '#4A90E2' },
        areaStyle: { color: 'rgba(74,144,226,0.1)' },
        symbol: 'circle',
        symbolSize: 8,
      },
    ],
  };
  trendChartInstance.setOption(option);

  // 添加点击事件
  trendChartInstance.on('click', (params) => {
    const date = params.name;
    window.dispatchEvent(
      new CustomEvent('filterByChart:passRecord', {
        detail: {
          status: 'trendDate',
          date: date,
        },
      }),
    );
  });
}

function initCharts() {
  initTrendChart();
}

function handleCardClick(key) {
  let filterParams = { status: key };

  // 根据卡片类型设置不同的筛选参数
  if (key === 'todayPassCount') {
    // 今日放行量：筛选今天的记录
    const today = new Date();
    const startTime = new Date(today.setHours(0, 0, 0, 0)).getTime().toString();
    const endTime = new Date(today.setHours(23, 59, 59, 999)).getTime().toString();
    filterParams = { status: 'todayPass', startTime, endTime };
  } else if (key === 'abnormalPassRate') {
    // 异常放行占比：筛选异常记录
    filterParams = { status: 'abnormalPass' };
  }

  window.dispatchEvent(
    new CustomEvent('filterByChart:passRecord', { detail: filterParams }),
  );
}

onMounted(() => {
  loadChartData();
  window.addEventListener('resize', () => {
    trendChartInstance?.resize();
  });
});

onUnmounted(() => {
  trendChartInstance?.dispose();
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
        <div ref="trendChartRef" style="width: 100%; height: 100%"></div>
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
  align-items: flex-end;
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
    height: 330px;

    .left-card {
      display: flex;
      flex-direction: column;
      flex: 1;
      flex: 1;
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
