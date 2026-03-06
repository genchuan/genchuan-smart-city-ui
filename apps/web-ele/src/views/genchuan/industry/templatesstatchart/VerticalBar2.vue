<script setup>
import {
  defineEmits,
  defineProps,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';

import * as echarts from 'echarts';

const props = defineProps({
  xAxis: {
    type: Array,
    default: () => [],
  },
  series: {
    type: Array,
    default: () => [],
  },
  unit: {
    type: String,
    default: '个',
  },
  title: {
    type: String,
    default: '柱状图',
  },
  baseFontScale: {
    type: Number,
    default: 1,
  },
  activeIndices: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits(['barClick']);
const chartRef = ref(null);
const chartInstance = ref(null);

const vwToPx = (vw) => {
  return window.innerWidth * (vw / 100) * props.baseFontScale;
};

const getGridTop = () => {
  const titleFontSize = vwToPx(0.8);
  const topPercent = (titleFontSize * 15) / (window.innerHeight * 0.01);
  return `${Math.max(2, Math.min(15, topPercent))}%`;
};

const initChart = () => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }

  const titleFontSize = vwToPx(0.8);
  const tooltipFontSize = vwToPx(0.65);
  const axisLabelFontSize = vwToPx(0.6);

  chartInstance.value = echarts.init(chartRef.value);

  chartInstance.value.on('click', (params) => {
    if (params.componentType === 'series') {
      emits('barClick', params.dataIndex, props.xAxis[params.dataIndex]);
    }
  });

  const option = {
    animation: false,
    backgroundColor: 'transparent',
    title: {
      text: props.title,
      textStyle: {
        fontSize: titleFontSize,
        color: '#FFD166',
      },
      left: 'center',
      top: 0,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(18, 26, 64, 0.9)',
      borderColor: 'rgba(0, 196, 255, 0.4)',
      borderWidth: 1,
      textStyle: {
        color: '#E6F7FF',
        fontSize: tooltipFontSize,
      },
      formatter: (params) => {
        let res = `${params[0].name}<br/>`;
        params.forEach((item) => {
          res += `${item.seriesName}：${item.value} ${props.unit}<br/>`;
        });
        return res;
      },
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '2%',
      top: '20%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: props.xAxis,
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 196, 255, 0.4)',
        },
      },
      axisLabel: {
        color: '#ccc',
        fontSize: axisLabelFontSize,
        rotate: props.xAxis.length > 3 ? 30 : 0,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 196, 255, 0.4)',
        },
      },
      axisLabel: {
        color: '#ccc',
        fontSize: axisLabelFontSize,
        formatter: `{value} ${props.unit}`,
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 196, 255, 0.15)',
        },
      },
    },
    series: props.series.map((item) => {
      const colorGradients = [
        [
          { offset: 0, color: '#00ccff' },
          { offset: 1, color: '#0066ff' },
        ],
        [
          { offset: 0, color: '#4ECDC4' },
          { offset: 1, color: '#1A9885' },
        ],
        [
          { offset: 0, color: '#FFA500' },
          { offset: 1, color: '#E67E22' },
        ],
        [
          { offset: 0, color: '#96CEB4' },
          { offset: 1, color: '#58B19F' },
        ],
      ];
      const activeColors = ['#c272e1'];
      const labelFontSize = vwToPx(0.6);

      return {
        ...item,
        type: 'bar',
        barWidth: '50%',
        label: {
          show: true,
          position: 'top',
          color: '#e6f7ff',
          fontSize: labelFontSize,
          fontWeight: '600',
          formatter: `{c} ${props.unit}`,
        },
        itemStyle: {
          color: (params) => {
            if (props.activeIndices.includes(params.dataIndex)) {
              return activeColors[params.dataIndex % activeColors.length];
            }
            return new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              colorGradients[params.dataIndex % colorGradients.length],
            );
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 102, 255, 0.5)',
          },
          label: {
            color: '#fff',
            fontSize: labelFontSize + 2,
            shadowBlur: 5,
            shadowColor: 'rgba(0,0,0,0.7)',
          },
        },
      };
    }),
  };

  chartInstance.value.setOption(option);
};

watch(
  [
    () => props.xAxis,
    () => props.series,
    () => props.baseFontScale,
    () => props.activeIndices,
  ],
  () => {
    if (chartInstance.value) {
      initChart();
    }
  },
  { deep: true },
);

const handleResize = () => {
  if (!chartInstance.value) return;

  const titleFontSize = vwToPx(0.8);
  const tooltipFontSize = vwToPx(0.65);
  const axisLabelFontSize = vwToPx(0.6);
  const gridTop = getGridTop();
  const labelFontSize = vwToPx(0.6);

  chartInstance.value.setOption({
    title: { textStyle: { fontSize: titleFontSize } },
    tooltip: { textStyle: { fontSize: tooltipFontSize } },
    grid: { top: gridTop },
    xAxis: { axisLabel: { fontSize: axisLabelFontSize } },
    yAxis: { axisLabel: { fontSize: axisLabelFontSize } },
    series: props.series.map(() => ({
      label: { fontSize: labelFontSize },
    })),
  });

  chartInstance.value.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
});
</script>

<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>
