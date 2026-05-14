<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

type StatsCard = {
  color?: string;
  desc?: string;
  title: string;
  value: number | string;
};

type StatsChart = {
  series: Array<number | string>;
  title: string;
  type: 'bar' | 'line' | 'pie' | string;
  xAxis: string[];
};

const props = defineProps<{
  data: {
    cards: StatsCard[];
    charts: StatsChart[];
  };
}>();

const emit = defineEmits<{
  cardClick: [
    payload: {
      card: StatsCard;
      index: number;
    },
  ];
  chartClick: [
    payload: {
      chart: StatsChart;
      name: string;
      value: number | string;
    },
  ];
}>();

const chartRefs = ref<Record<string, HTMLElement | null>>({});
const chartInstances = ref<Record<string, echarts.ECharts>>({});

const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B'];

function getChartOption(chart: StatsChart) {
  const isBar = chart.type === 'bar';
  const isLine = chart.type === 'line';

  if (!isBar && !isLine) {
    return {
      backgroundColor: 'transparent',
      color: freshColors,
      series: [],
      title: {
        left: 'center',
        text: chart.title,
        textStyle: {
          color: '#6E7E91',
          fontSize: 14,
          fontWeight: 500,
        },
        top: 10,
      },
    };
  }

  return {
    backgroundColor: 'transparent',
    color: freshColors,
    grid: {
      backgroundColor: 'transparent',
      bottom: '8%',
      containLabel: true,
      left: '3%',
      right: '4%',
      top: '18%',
    },
    series: [
      {
        barWidth: isBar ? '40%' : undefined,
        data: chart.series,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(74, 144, 226, 0.3)',
          },
          label: {
            fontSize: 14,
            fontWeight: 'bold',
            show: isBar,
          },
        },
        itemStyle: {
          borderRadius: isBar ? [4, 4, 0, 0] : undefined,
          color: isBar
            ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { color: '#4A90E2', offset: 0 },
                { color: '#6BB3FF', offset: 1 },
              ])
            : '#50E3C2',
        },
        label: {
          color: '#6E7E91',
          fontSize: 12,
          formatter: '{c}',
          position: 'top',
          show: isBar,
        },
        lineStyle: isLine
          ? {
              color: '#50E3C2',
              width: 3,
            }
          : undefined,
        name: chart.title,
        smooth: isLine,
        symbol: isLine ? 'circle' : undefined,
        symbolSize: isLine ? 6 : undefined,
        type: chart.type,
      },
    ],
    title: {
      left: 'center',
      text: chart.title,
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
        fontWeight: 500,
      },
      top: 10,
    },
    tooltip: {
      axisPointer: {
        type: isBar ? 'shadow' : 'line',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: {
        color: '#6E7E91',
      },
      trigger: 'axis',
    },
    xAxis: {
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 10,
        formatter(value: string) {
          return value.length > 6 ? `${value.slice(0, 6)}...` : value;
        },
        interval: isBar ? 0 : 'auto',
        rotate: chart.xAxis.length > 6 ? 35 : 0,
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
      boundaryGap: isBar,
      data: chart.xAxis,
      splitLine: {
        show: false,
      },
      type: 'category',
    },
    yAxis: {
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
      type: 'value',
    },
  };
}

function disposeChart(index: number) {
  const chartKey = `chart-${index}`;
  chartInstances.value[chartKey]?.dispose();
  delete chartInstances.value[chartKey];
}

function initCharts() {
  props.data.charts.forEach((chart, index) => {
    const chartKey = `chart-${index}`;
    const chartRef = chartRefs.value[chartKey];

    if (!chartRef) {
      return;
    }

    disposeChart(index);

    const chartInstance = echarts.init(chartRef);
    chartInstances.value[chartKey] = chartInstance;
    chartInstance.setOption(getChartOption(chart));
    chartInstance.on('click', (params) => {
      const dataIndex = Number(params.dataIndex ?? -1);

      if (dataIndex < 0) {
        return;
      }

      emit('chartClick', {
        chart,
        name: chart.xAxis[dataIndex] || String(params.name || ''),
        value: chart.series[dataIndex] ?? chart.xAxis[dataIndex] ?? '',
      });
    });
  });
}

function refreshCharts() {
  nextTick(() => {
    initCharts();
  });
}

function handleResize() {
  Object.values(chartInstances.value).forEach((chartInstance) => {
    chartInstance.resize();
  });
}

function handleCardClick(card: StatsCard, index: number) {
  emit('cardClick', { card, index });
}

watch(
  () => props.data,
  () => {
    refreshCharts();
  },
  { deep: true },
);

onMounted(() => {
  refreshCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  Object.values(chartInstances.value).forEach((chartInstance) => {
    chartInstance.dispose();
  });
  chartInstances.value = {};
});
</script>

<template>
  <div class="rule-chart-box">
    <div class="chart-box-left">
      <button
        v-for="(card, index) in data.cards"
        :key="`card-${index}`"
        class="stat-card"
        :style="{ borderLeftColor: card.color || '#4A90E2' }"
        type="button"
        @click="handleCardClick(card, index)"
      >
        <div class="card-header">
          <h3 class="card-title">{{ card.title }}</h3>
          <span
            class="card-indicator"
            :style="{ backgroundColor: card.color || '#4A90E2' }"
          ></span>
        </div>
        <div class="card-body">
          <div class="card-value">{{ card.value }}</div>
          <div v-if="card.desc" class="card-desc">{{ card.desc }}</div>
        </div>
      </button>
    </div>

    <div class="charts-wrapper">
      <div
        v-for="(chart, index) in data.charts"
        :key="`chart-${index}`"
        class="chart-area"
        :class="{ 'line-chart-area': chart.type === 'line' }"
        :ref="(el) => (chartRefs[`chart-${index}`] = el as HTMLElement | null)"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.rule-chart-box {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 280px;
  min-height: 280px;
  padding-bottom: 0.5rem;
  overflow: hidden;
}

.chart-box-left {
  display: flex;
  flex-shrink: 0;
  flex-flow: row wrap;
  gap: 4px;
  align-content: stretch;
  width: 480px;
  height: 100%;
  padding: 4px;
  overflow: hidden;
}

.stat-card {
  box-sizing: border-box;
  display: flex;
  flex: 1 1 calc(33.333% - 3px);
  flex-direction: column;
  justify-content: center;
  min-width: 120px;
  min-height: 0;
  padding: 4px 8px;
  text-align: left;
  cursor: pointer;
  background-color: var(--el-bg-color, #fff);
  border: 0;
  border-left: 4px solid;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.card-title {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: 500;
  color: #6e7e91;
  white-space: nowrap;
}

.card-indicator {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.card-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.card-value {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 20px;
  font-weight: 600;
  color: #4a90e2;
  white-space: nowrap;
}

.card-desc {
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  color: #909399;
  white-space: nowrap;
}

.charts-wrapper {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 1 1 0;
  align-items: center;
  min-width: 0;
  height: 100%;
  padding: 4px;
}

.chart-area {
  position: relative;
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
  height: 100%;
}

.line-chart-area {
  flex: 1.15;
}
</style>
