<script setup lang="ts">
import type {
  UserOpReportChartOption,
  UserOpReportStatsCard,
  UserOpReportStatsData,
} from '../data';

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';
import { ElOption, ElSelect } from 'element-plus';

const props = withDefaults(
  defineProps<{
    barChartOptions?: UserOpReportChartOption[];
    data?: UserOpReportStatsData;
    lineChartOptions?: UserOpReportChartOption[];
    pieChartOptions?: UserOpReportChartOption[];
  }>(),
  {
    barChartOptions: () => [],
    data: () => ({
      barData: [],
      cards: [],
      lineData: [],
      pieData: [],
    }),
    lineChartOptions: () => [],
    pieChartOptions: () => [],
  },
);

const emit = defineEmits<{
  barClick: [
    payload: {
      name: string;
      type: string;
      value: number | string;
    },
  ];
  cardClick: [
    payload: {
      card: UserOpReportStatsCard;
      type: string;
    },
  ];
  lineClick: [
    payload: {
      name: string;
      type: string;
      value: number | string;
    },
  ];
  pieClick: [
    payload: {
      name: string;
      type: string;
      value: number | string;
    },
  ];
}>();

const pieChartRef = ref<HTMLElement>();
const barChartRef = ref<HTMLElement>();
const lineChartRef = ref<HTMLElement>();
const pieChartInstance = ref<echarts.ECharts>();
const barChartInstance = ref<echarts.ECharts>();
const lineChartInstance = ref<echarts.ECharts>();

const freshColors = [
  '#4A90E2',
  '#50E3C2',
  '#FF9F40',
  '#A17FE0',
  '#FF6B8B',
  '#FFD93D',
];

const currentPieIndex = ref(0);
const currentBarIndex = ref(0);
const currentLineIndex = ref(0);

const currentPieData = computed(() =>
  getOption(props.pieChartOptions, currentPieIndex.value),
);
const currentBarData = computed(() =>
  getOption(props.barChartOptions, currentBarIndex.value),
);
const currentLineData = computed(() =>
  getOption(props.lineChartOptions, currentLineIndex.value),
);

function getOption(options: UserOpReportChartOption[], index: number) {
  if (options.length === 0) {
    return undefined;
  }

  return options[index] || options[0];
}

function getDistributionData(option?: UserOpReportChartOption) {
  return Array.isArray(option?.data) ? option.data : [];
}

function getLineData(option?: UserOpReportChartOption) {
  return Array.isArray(option?.data) ? undefined : option?.data;
}

function handlePieChange(index: number) {
  currentPieIndex.value = index;
  initPieChart();
}

function handleBarChange(index: number) {
  currentBarIndex.value = index;
  initBarChart();
}

function handleLineChange(index: number) {
  currentLineIndex.value = index;
  initLineChart();
}

function initPieChart() {
  if (!pieChartRef.value) {
    return;
  }

  pieChartInstance.value?.dispose();
  const chartData = currentPieData.value;
  const pieData = getDistributionData(chartData);

  if (!chartData || pieData.length === 0) {
    return;
  }

  const chartInstance = echarts.init(pieChartRef.value);
  pieChartInstance.value = chartInstance;
  chartInstance.setOption({
    backgroundColor: 'transparent',
    color: freshColors,
    legend: {
      bottom: '3%',
      itemHeight: 10,
      itemWidth: 10,
      left: 'center',
      orient: 'horizontal',
      textStyle: {
        color: '#6E7E91',
        fontSize: 10,
      },
      type: 'scroll',
    },
    series: [
      {
        avoidLabelOverlap: true,
        center: ['50%', '52%'],
        data: pieData,
        emphasis: {
          label: {
            fontSize: 13,
            fontWeight: 'bold',
            show: true,
          },
          scale: true,
          scaleSize: 5,
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          formatter(params: any) {
            const name =
              String(params.name).length > 4
                ? `${String(params.name).slice(0, 4)}...`
                : params.name;
            return `{name|${name}}\n{percent|${params.percent}%}`;
          },
          position: 'outside',
          rich: {
            name: {
              align: 'center',
              color: '#6E7E91',
              fontSize: 11,
              lineHeight: 16,
            },
            percent: {
              align: 'center',
              color: '#4A90E2',
              fontSize: 12,
              fontWeight: 'bold',
              lineHeight: 16,
            },
          },
          show: true,
        },
        labelLine: {
          length: 12,
          length2: 8,
          lineStyle: {
            color: '#9AA8B7',
            width: 1,
          },
          show: true,
          smooth: true,
        },
        minShowLabelAngle: 5,
        name: chartData.label,
        radius: ['35%', '55%'],
        type: 'pie',
      },
    ],
    title: {
      left: 'center',
      text: chartData.label,
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
        fontWeight: 500,
      },
      top: 10,
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      formatter: '{b}: {c} ({d}%)',
      textStyle: {
        color: '#6E7E91',
      },
      trigger: 'item',
    },
  });
  chartInstance.on('click', (params) => {
    const dataItem = pieData[Number(params.dataIndex)];
    emit('pieClick', {
      name: dataItem?.name || String(params.name || ''),
      type: chartData.value,
      value: dataItem?.type || dataItem?.name || '',
    });
  });
}

function initBarChart() {
  if (!barChartRef.value) {
    return;
  }

  barChartInstance.value?.dispose();
  const chartData = currentBarData.value;
  const barData = getDistributionData(chartData);

  if (!chartData || barData.length === 0) {
    return;
  }

  const chartInstance = echarts.init(barChartRef.value);
  barChartInstance.value = chartInstance;
  chartInstance.setOption({
    backgroundColor: 'transparent',
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
        barWidth: '40%',
        data: barData.map((item) => item.value),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(74, 144, 226, 0.3)',
          },
          label: {
            fontSize: 14,
            fontWeight: 'bold',
            show: true,
          },
        },
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { color: '#4A90E2', offset: 0 },
            { color: '#6BB3FF', offset: 1 },
          ]),
        },
        label: {
          color: '#6E7E91',
          fontSize: 12,
          formatter: '{c}',
          position: 'top',
          show: true,
        },
        name: chartData.label,
        type: 'bar',
      },
    ],
    title: {
      left: 'center',
      text: chartData.label,
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
        fontWeight: 500,
      },
      top: 10,
    },
    tooltip: {
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      formatter: '{b}: {c}',
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
          return value.length > 4 ? `${value.slice(0, 4)}...` : value;
        },
        interval: 0,
        rotate: 45,
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
      boundaryGap: true,
      data: barData.map((item) => item.name),
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
  });
  chartInstance.on('click', (params) => {
    const dataItem = barData[Number(params.dataIndex)];
    emit('barClick', {
      name: dataItem?.name || String(params.name || ''),
      type: chartData.value,
      value: dataItem?.type || dataItem?.name || '',
    });
  });
}

function initLineChart() {
  if (!lineChartRef.value) {
    return;
  }

  lineChartInstance.value?.dispose();
  const chartData = currentLineData.value;
  const lineData = getLineData(chartData);

  if (!chartData || !lineData || lineData.xAxis.length === 0) {
    return;
  }

  const chartInstance = echarts.init(lineChartRef.value);
  lineChartInstance.value = chartInstance;
  chartInstance.setOption({
    backgroundColor: 'transparent',
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
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { color: 'rgba(80, 227, 194, 0.3)', offset: 0 },
            { color: 'rgba(80, 227, 194, 0.05)', offset: 1 },
          ]),
        },
        data: lineData.series,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(80, 227, 194, 0.5)',
          },
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
          color: '#50E3C2',
        },
        lineStyle: {
          color: '#50E3C2',
          width: 3,
        },
        name: chartData.label,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        type: 'line',
      },
    ],
    title: {
      left: 'center',
      text: chartData.label,
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
        fontWeight: 500,
      },
      top: 10,
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      formatter(params: any) {
        const data = params[0];
        return `${data.name}<br/>${chartData.label}: ${data.value}`;
      },
      textStyle: {
        color: '#6E7E91',
      },
      trigger: 'axis',
    },
    xAxis: {
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 10,
        interval: 'auto',
        rotate: 45,
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
      boundaryGap: false,
      data: lineData.xAxis,
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
  });
  chartInstance.on('click', (params) => {
    emit('lineClick', {
      name: String(params.name || ''),
      type: chartData.value,
      value: lineData.fullDates?.[Number(params.dataIndex)] || params.name,
    });
  });
}

function initCharts() {
  nextTick(() => {
    initPieChart();
    initBarChart();
    initLineChart();
  });
}

function handleResize() {
  pieChartInstance.value?.resize();
  barChartInstance.value?.resize();
  lineChartInstance.value?.resize();
}

function handleCardClick(card: UserOpReportStatsCard) {
  emit('cardClick', { card, type: card.type });
}

watch(
  () => [props.pieChartOptions, props.barChartOptions, props.lineChartOptions],
  () => {
    currentPieIndex.value = 0;
    currentBarIndex.value = 0;
    currentLineIndex.value = 0;
    initCharts();
  },
  { deep: true },
);

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  pieChartInstance.value?.dispose();
  barChartInstance.value?.dispose();
  lineChartInstance.value?.dispose();
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
        @click="handleCardClick(card)"
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
      <div class="chart-area">
        <div v-if="pieChartOptions.length > 1" class="chart-select-wrapper">
          <ElSelect
            :model-value="currentPieIndex"
            class="chart-select"
            size="small"
            @change="handlePieChange"
          >
            <ElOption
              v-for="(option, idx) in pieChartOptions"
              :key="option.value"
              :label="option.label"
              :value="idx"
            />
          </ElSelect>
        </div>
        <div ref="pieChartRef" class="chart-container"></div>
      </div>

      <div class="chart-area">
        <div v-if="barChartOptions.length > 1" class="chart-select-wrapper">
          <ElSelect
            :model-value="currentBarIndex"
            class="chart-select"
            size="small"
            @change="handleBarChange"
          >
            <ElOption
              v-for="(option, idx) in barChartOptions"
              :key="option.value"
              :label="option.label"
              :value="idx"
            />
          </ElSelect>
        </div>
        <div ref="barChartRef" class="chart-container"></div>
      </div>

      <div class="chart-area line-chart-area">
        <div v-if="lineChartOptions.length > 1" class="chart-select-wrapper">
          <ElSelect
            :model-value="currentLineIndex"
            class="chart-select"
            size="small"
            @change="handleLineChange"
          >
            <ElOption
              v-for="(option, idx) in lineChartOptions"
              :key="option.value"
              :label="option.label"
              :value="idx"
            />
          </ElSelect>
        </div>
        <div ref="lineChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rule-chart-box {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: auto;
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
  height: 280px;
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
  height: 280px;
  padding: 4px;
}

.chart-area {
  position: relative;
  box-sizing: border-box;
  flex: 0 0 28%;
  min-width: 0;
  height: 272px;
}

.line-chart-area {
  flex: 1;
  height: 272px;
}

.chart-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}

.chart-select {
  width: 112px;
}

.chart-select :deep(.el-input__wrapper) {
  background-color: rgb(255 255 255 / 95%);
  box-shadow: 0 1px 4px rgb(0 0 0 / 10%);
}

.chart-select :deep(.el-input__inner) {
  font-size: 12px;
}

.chart-container {
  width: 100%;
  height: 100%;
}
</style>
