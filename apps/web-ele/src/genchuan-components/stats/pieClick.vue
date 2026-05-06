<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

const props = defineProps({
  data: {
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

const emit = defineEmits(['pieClick']);

const chartRef = ref(null);
let chartInstance = null;
let resizeTimer = null;

const parkTypeColors = [
  '#409EFF',
  '#13ce66',
  '#67C23A',
  '#E6A23C',
  '#9C27B0',
  '#F56C6C',
];

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
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>数量：{c}<br/>占比：{d}%',
        textStyle: { fontSize: 12 },
      },
      legend: {
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        textStyle: { fontSize: 12, color: '#6E7E91' },
        itemWidth: 10,
        formatter: (name) =>
          name.length > 6 ? `${name.slice(0, 6)}...` : name,
      },
      series: [
        {
          type: 'pie',
          radius: ['30%', '60%'],
          center: ['50%', '50%'],
          label: {
            show: true,
            position: 'outside',
            formatter: '{d}%',
            fontSize: 12,
            color: '#6E7E91',
            lineHeight: 20,
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 8,
            smooth: false,
            lineStyle: { color: '#aaa', width: 1, type: 'solid' },
          },
          data: props.data,
          itemStyle: {
            color: (params) =>
              parkTypeColors[params.dataIndex % parkTypeColors.length],
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold',
              color: '#6E7E91',
            },
          },
        },
      ],
    };

    chartInstance.setOption(option, { notMerge: false, lazyUpdate: false });

    chartInstance.off('click');
    chartInstance.on('click', (params) => {
      if (params.componentType === 'series' && params.data) {
        const payload = {
          name: params.name,
          value: params.value,
          percent: params.percent,
        };
        emit('pieClick', payload);
      }
    });
  } catch (error) {
    console.error('ECharts 初始化失败', error);
    chartInstance = null;
  }
};

watch(
  () => props.data,
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
