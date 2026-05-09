<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';

import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

type StatsCard = {
  color?: string;
  desc?: string;
  title: string;
  value: number | string;
};

type StatsChart = {
  color?: string[];
  data?: Array<{ name: string; value: number | string }>;
  series?: Array<number | string>;
  title: string;
  type: 'bar' | 'line' | 'pie' | string;
  xAxis?: string[];
};

type StatsData = {
  cards: StatsCard[];
  charts: StatsChart[];
};

const props = withDefaults(
  defineProps<{
    data?: StatsData;
  }>(),
  {
    data: () => ({
      cards: [],
      charts: [],
    }),
  },
);

const emit = defineEmits<{
  refresh: [
    payload:
      | {
          card: StatsCard;
          index: number;
          type: 'card';
        }
      | {
          chart: StatsChart;
          chartType: string;
          name: string;
          type: 'chart';
          value: unknown;
        },
  ];
}>();

const chartRefs = ref<Record<string, HTMLElement | null>>({});
const chartInstances = new Map<string, echarts.ECharts>();
let renderFrame = 0;

function setChartRef(
  el: ComponentPublicInstance | Element | null,
  index: number,
) {
  const element = el && '$el' in el ? el.$el : el;
  chartRefs.value[`chart-${index}`] =
    element instanceof HTMLElement ? element : null;
}

function cancelRenderSchedule() {
  if (renderFrame && typeof window !== 'undefined') {
    window.cancelAnimationFrame(renderFrame);
  }

  renderFrame = 0;
}

function disposeCharts() {
  chartInstances.forEach((instance) => instance.dispose());
  chartInstances.clear();
}

function getChartOption(chart: StatsChart) {
  const freshColors = chart.color || [
    '#4A90E2',
    '#50E3C2',
    '#FF9F40',
    '#A17FE0',
    '#FF6B8B',
  ];

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    color: freshColors,
    grid: {
      bottom: '3%',
      containLabel: true,
      left: '3%',
      right: '4%',
    },
    title: {
      left: 'center',
      text: chart.title,
      textStyle: {
        color: '#6E7E91',
        fontSize: 16,
        fontWeight: 500,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      trigger: chart.type === 'pie' ? 'item' : 'axis',
    },
  };

  if (chart.type === 'line' || chart.type === 'bar') {
    option.xAxis = {
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 11,
      },
      axisLine: {
        lineStyle: {
          color: '#E8F4FD',
        },
      },
      boundaryGap: chart.type === 'bar',
      data: chart.xAxis || [],
      type: 'category',
    };
    option.yAxis = {
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          color: '#F0F6FC',
          type: 'dashed',
        },
      },
      type: 'value',
    };
    option.series = [
      {
        data: chart.series || [],
        itemStyle: {
          borderRadius: chart.type === 'bar' ? [4, 4, 0, 0] : undefined,
        },
        label: {
          color: '#6E7E91',
          formatter: '{c}',
          position: 'top',
          show: chart.type === 'bar',
        },
        lineStyle:
          chart.type === 'line'
            ? {
                width: 3,
              }
            : undefined,
        name: chart.title,
        smooth: chart.type === 'line',
        symbol: chart.type === 'line' ? 'circle' : undefined,
        symbolSize: chart.type === 'line' ? 6 : undefined,
        type: chart.type,
      },
    ];
  }

  return option;
}

function bindChartClick(instance: echarts.ECharts, chart: StatsChart) {
  instance.off('click');
  instance.on('click', (params) => {
    emit('refresh', {
      chart,
      chartType: chart.type,
      name: String(params.name || ''),
      type: 'chart',
      value: params.value,
    });
  });
}

function initCharts() {
  const charts = props.data?.charts || [];

  chartInstances.forEach((instance, key) => {
    const index = Number(key.replace('chart-', ''));
    if (!charts[index] || !chartRefs.value[key]) {
      instance.dispose();
      chartInstances.delete(key);
    }
  });

  charts.forEach((chart, index) => {
    const key = `chart-${index}`;
    const chartRef = chartRefs.value[key];
    if (
      !chartRef ||
      chartRef.clientWidth === 0 ||
      chartRef.clientHeight === 0
    ) {
      return;
    }

    let instance = chartInstances.get(key);
    if (!instance || instance.isDisposed()) {
      instance = echarts.init(chartRef);
      chartInstances.set(key, instance);
    }

    instance.setOption(getChartOption(chart), true);
    instance.resize();
    bindChartClick(instance, chart);
  });
}

function scheduleRenderCharts() {
  void nextTick(() => {
    if (typeof window === 'undefined') {
      initCharts();
      return;
    }

    cancelRenderSchedule();
    renderFrame = window.requestAnimationFrame(() => {
      renderFrame = window.requestAnimationFrame(() => {
        renderFrame = 0;
        initCharts();
      });
    });
  });
}

function handleCardClick(card: StatsCard, index: number) {
  emit('refresh', {
    card,
    index,
    type: 'card',
  });
}

function handleResize() {
  chartInstances.forEach((instance) => instance.resize());
}

watch(
  () => props.data,
  () => {
    scheduleRenderCharts();
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  scheduleRenderCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  cancelRenderSchedule();
  window.removeEventListener('resize', handleResize);
  disposeCharts();
});
</script>

<template>
  <div class="park-chart-box">
    <div class="chart-box-left">
      <div
        v-for="(card, index) in data.cards"
        :key="`card-${index}`"
        class="stat-card user-info-clickable-card"
        :style="{ borderLeftColor: card.color || '#13ce66' }"
        @click="handleCardClick(card, index)"
      >
        <div class="card-header">
          <h3 class="card-title">{{ card.title }}</h3>
          <div
            class="card-indicator"
            :style="{ backgroundColor: card.color || '#13ce66' }"
          ></div>
        </div>
        <div class="card-body">
          <div class="card-value">{{ card.value }}</div>
          <div v-if="card.desc" class="card-desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>

    <div class="charts-wrapper">
      <div
        v-for="(chart, index) in data.charts"
        :key="`chart-${index}`"
        :ref="(el) => setChartRef(el, index)"
        :class="{
          'simple-bar-chart': chart.type !== 'pie',
          'park-type-chart': chart.type === 'pie',
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.park-chart-box {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  width: 100%;
  height: auto;
  min-height: 280px;
  overflow: hidden;
}

.chart-box-left {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 16px;
  width: 200px;
}

.park-chart-box .chart-box-left .user-info-clickable-card {
  cursor: pointer;
}

.charts-wrapper {
  position: relative;
  display: flex;
  flex: 1 1 0;
  gap: 20px;
  min-width: 0;
}

.simple-bar-chart,
.park-type-chart {
  flex: 1;
  min-width: 0;
  height: 280px;
  cursor: pointer;
}
</style>
