<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  indicator: {
    type: Array,
    default: () => [],
  },
  series: {
    type: Array,
    default: () => [],
  },
  showTitle: {
    type: Boolean,
    default: true,
  },
  titleText: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['radarClick']);

const chartRef = ref(null);
let chartInstance = null;
let resizeTimer = null;

const debounce = (fn, delay = 300) => {
  return (...args) => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => fn.apply(this, args), delay);
  };
};

const checkContainerSize = (container) => {
  if (!container) return false;
  const rect = container.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

const initChart = async () => {
  await nextTick();

  const container = chartRef.value;
  if (!container || !checkContainerSize(container)) {
    setTimeout(initChart, 200);
    return;
  }

  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }

  try {
    chartInstance = echarts.init(container);

    const option = {
      title: props.showTitle
        ? {
          text: props.titleText,
          left: 'center',
          top: 10,
          textStyle: { fontSize: 15, fontWeight: 300, color: '#6E7E91' },
        }
        : null,
      tooltip: { trigger: 'item' },
      legend: {
        data: props.series.map(s => s.name),
        left: 'center',
        bottom: 0,
        textStyle: { fontSize: 12, color: '#6E7E91' },
        itemWidth: 10,
      },
      radar: {
        indicator: props.indicator,
        shape: 'circle',
        name: { textStyle: { fontSize: 12, color: '#606266' } },
        splitArea: { areaStyle: { color: ['rgba(64, 158, 255, 0.1)'] } },
      },
      series: [
        {
          type: 'radar',
          data: props.series.map(s => ({ name: s.name, value: s.value })),
          areaStyle: { opacity: 0.3 },
          lineStyle: { width: 2 },
          symbolSize: 6,
        },
      ],
    };
    chartInstance.setOption(option);

    chartInstance.off('click');
    chartInstance.on('click', (params) => {
      if (params.componentType === 'series') {
        emit('radarClick', { name: params.name });
      }
    });
  } catch (error) {
    console.error('ECharts初始化失败：', error);
    chartInstance = null;
  }
};

watch(
  () => [props.indicator, props.series],
  () => {
    if (chartRef.value) initChart();
  },
  { deep: true },
);

const resizeHandler = debounce(() => {
  if (chartInstance && checkContainerSize(chartRef.value)) {
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
      min-width: 200px;
      max-width: 100%;
      height: 330px;
      background-color: hsl(var(--card));
      border-radius: 8px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
    "
  ></div>
</template>
