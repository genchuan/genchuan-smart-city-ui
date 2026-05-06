<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

const props = defineProps({
  title: { type: String, default: '数据统计' },
  xData: { type: Array, required: true },
  seriesData: { type: Array, required: true },
  yName: { type: String, default: '' },
});

const emit = defineEmits(['barClick']);

const chartRef = ref(null);
let chartInstance = null;
let resizeTimer = null;

const debounce = (fn, delay = 300) => {
  return (...args) => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => fn.apply(this, args), delay);
  };
};

const generateColors = (seriesCount) => {
  const defaultColors = [
    '#50c48a',
    '#f5a623',
    '#f15a6e',
    '#8b5cf6',
    '#34b7eb',
    '#ff9a9e',
    '#6c5ce7',
  ];

  if (seriesCount <= defaultColors.length) {
    return defaultColors.slice(0, seriesCount);
  }

  const colors = [...defaultColors];
  for (let i = defaultColors.length; i < seriesCount; i++) {
    const hue = (i * 35) % 360;
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
};

const checkContainerValid = () => {
  if (!chartRef.value) return false;
  const rect = chartRef.value.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

const initChart = async () => {
  await nextTick();

  if (!checkContainerValid()) {
    console.warn('ECharts container is invalid, retry later');
    setTimeout(initChart, 200);
    return;
  }

  if (chartInstance) {
    try {
      chartInstance.dispose();
    } catch (error) {
      console.warn('Failed to dispose ECharts instance', error);
    }
    chartInstance = null;
  }

  try {
    chartInstance = echarts.init(chartRef.value);
    const colorPalette = generateColors(props.seriesData.length);

    const option = {
      title: {
        text: props.title,
        left: 'center',
        textStyle: { fontSize: 15, fontWeight: 300, color: '#6E7E91' },
      },
      tooltip: { trigger: 'axis' },
      legend: {
        top: 30,
        left: 'center',
        textStyle: { fontSize: 12, color: '#6E7E91' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        backgroundColor: 'transparent',
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: props.xData,
        axisLabel: {
          color: '#9AA8B7',
          fontSize: 11,
          rotate: props.xData.length > 4 ? 30 : 0,
        },
        axisLine: { lineStyle: { color: '#E8F4FD' } },
        axisTick: { lineStyle: { color: '#E8F4FD' } },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        name: props.yName,
        axisLabel: { color: '#9AA8B7', fontSize: 11 },
        axisLine: { lineStyle: { color: '#9AA8B7' } },
        axisTick: { lineStyle: { color: '#E8F4FD' } },
        splitLine: {
          lineStyle: { color: '#F0F6FC', type: 'dashed' },
        },
      },
      color: colorPalette,
      series: props.seriesData.map((seriesItem) => ({
        name: seriesItem.name,
        type: 'bar',
        data: seriesItem.data,
        label: {
          show: true,
          position: 'top',
          color: '#6E7E91',
          fontSize: 12,
          formatter: '{c}',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(74, 144, 226, 0.3)',
          },
        },
        barWidth: 25,
      })),
    };

    chartInstance.setOption(option, {
      notMerge: false,
      lazyUpdate: false,
    });

    chartInstance.off('click');
    chartInstance.on('click', (params) => {
      if (params.componentType === 'series' && params.data) {
        const areaName = params.name;
        if (areaName) {
          emit('barClick', areaName);
        }
      }
    });
  } catch (error) {
    console.error('Failed to initialize ECharts', error);
    chartInstance = null;
  }
};

watch(
  [() => props.xData, () => props.seriesData, () => props.title],
  () => {
    if (chartRef.value) {
      initChart();
    }
  },
  { deep: true, immediate: false },
);

const resizeHandler = debounce(() => {
  if (chartInstance && checkContainerValid()) {
    chartInstance.resize();
  }
});

onMounted(() => {
  nextTick(() => {
    initChart();
    window.addEventListener('resize', resizeHandler);
  });
});

onUnmounted(() => {
  clearTimeout(resizeTimer);
  window.removeEventListener('resize', resizeHandler);
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<template>
  <div
    ref="chartRef"
    style="
      min-width: 200px !important;
      max-width: 100%;
      height: 330px;
      background-color: hsl(var(--card));
      border-radius: 8px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
    "
  ></div>
</template>
