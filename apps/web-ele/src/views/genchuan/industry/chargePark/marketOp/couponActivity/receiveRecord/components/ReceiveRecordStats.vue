<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({
      cards: [],
      lineData: [],
    }),
  },
});

const emit = defineEmits(['cardClick', 'lineClick']);

const lineChartRef = ref(null);
const lineChartInstance = ref(null);

const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B'];

// 初始化折线图 - 领用量趋势
const initLineChart = () => {
  if (!lineChartRef.value) return;

  if (lineChartInstance.value) {
    lineChartInstance.value.dispose();
  }

  const chartInstance = echarts.init(lineChartRef.value);
  lineChartInstance.value = chartInstance;

  const lineData = props.data.lineData || [];
  const xAxisData = lineData.map((item) => item.date);
  const countData = lineData.map((item) => item.count);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '领用记录趋势（近30天）',
      left: 'center',
      top: 10,
      textStyle: {
        color: '#6E7E91',
        fontSize: 16,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: {
        color: '#6E7E91',
      },
      formatter: (params) => {
        const data = params[0];
        return `${data.name}<br/>领用量: ${data.value}`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '20%',
      containLabel: true,
      backgroundColor: 'transparent',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 11,
        rotate: 45,
        interval: 'auto',
      },
      axisLine: {
        lineStyle: {
          color: '#E8F4FD',
        },
      },
      axisTick: {
        lineStyle: {
          color: '#E8F4FD',
        },
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 11,
      },
      axisLine: {
        lineStyle: {
          color: '#E8F4FD',
        },
      },
      axisTick: {
        lineStyle: {
          color: '#E8F4FD',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#F0F6FC',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: '领用量',
        type: 'line',
        data: countData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#4A90E2',
          width: 3,
        },
        itemStyle: {
          color: '#4A90E2',
          borderWidth: 2,
          borderColor: '#fff',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
            { offset: 1, color: 'rgba(74, 144, 226, 0.05)' },
          ]),
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(74, 144, 226, 0.5)',
          },
        },
        label: {
          show: false,
        },
      },
    ],
  };

  chartInstance.setOption(option);

  // 点击事件
  chartInstance.on('click', (params) => {
    emit('lineClick', lineData[params.dataIndex]?.date);
  });
};

const initCharts = () => {
  initLineChart();
};

const handleResize = () => {
  if (lineChartInstance.value) {
    lineChartInstance.value.resize();
  }
};

const handleCardClick = (card) => {
  emit('cardClick', card.type, card.value);
};

watch(
  () => props.data,
  () => {
    initCharts();
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (lineChartInstance.value) {
    lineChartInstance.value.dispose();
  }
});
</script>

<template>
  <div class="receive-record-chart-box">
    <!-- 卡片区域 -->
    <div class="chart-box-left">
      <div
        v-for="(card, index) in data.cards"
        :key="`card-${index}`"
        class="stat-card"
        :style="{ borderLeftColor: card.color || '#4A90E2' }"
        @click="handleCardClick(card)"
      >
        <div class="card-header">
          <h3 class="card-title">{{ card.title }}</h3>
          <div
            class="card-indicator"
            :style="{ backgroundColor: card.color || '#4A90E2' }"
          ></div>
        </div>
        <div class="card-body">
          <div class="card-value">{{ card.value }}</div>
          <div class="card-desc" v-if="card.desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-wrapper">
      <!-- 折线图区域 - 领用量趋势 -->
      <div class="receive-record-trend-chart" ref="lineChartRef"></div>
    </div>
  </div>
</template>

<style scoped>
.receive-record-chart-box {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: auto;
  padding-bottom: 0.5rem;
  overflow: hidden;
}

.common-index .park-chart-box .chart-box-left {
  margin-left: 0 !important;
}

.chart-box-left {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: space-between;
  width: 266px;
  height: 280px;
}

.stat-card {
  flex: 1;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  background-color: var(--el-bg-color, #fff);
  border-left: 4px solid;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  transition: all 0.3s ease;
}

.stat-card:last-child {
  margin-bottom: 0;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #6e7e91;
}

.card-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-value {
  font-size: 28px;
  font-weight: 600;
  color: rgb(74 144 226);
}

.card-desc {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.charts-wrapper {
  position: relative;
  display: flex;
  flex: 1 1 0;
  min-width: 0;
}

.receive-record-trend-chart {
  flex: 1;
  min-width: 0;
  height: 280px;
  margin-left: 0 !important;
}
</style>
