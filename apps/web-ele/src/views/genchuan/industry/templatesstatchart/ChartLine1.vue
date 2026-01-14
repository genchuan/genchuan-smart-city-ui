<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({ xAxis: [], series: [] }),
  },
  yAxisName: {
    type: String,
    default: '',
  },
  showGrid: {
    type: Boolean,
    default: true,
  },
  smooth: {
    type: Boolean,
    default: true,
  },
  baseFontScale: {
    type: Number,
    default: 1,
  },
  title: {
    type: String,
    default: '折线图',
  },
});

const chartRef = ref(null);
let chartInstance = null;

const vwToPx = (vw) => {
  return window.innerWidth * (vw / 100) * props.baseFontScale;
};

const initChart = () => {
  if (chartInstance) {
    chartInstance.dispose();
  }

  const tooltipFontSize = vwToPx(0.65);
  const legendFontSize = vwToPx(0.7);
  const axisLabelFontSize = vwToPx(0.6);
  const yAxisNameFontSize = vwToPx(0.7);
  const titleFontSize = vwToPx(0.8);

  chartInstance = echarts.init(chartRef.value);

  const option = {
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
      backgroundColor: 'rgba(0, 30, 60, 0.8)',
      borderColor: 'rgba(0, 204, 255, 0.3)',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: tooltipFontSize,
      },
    },
    legend: {
      data: props.data.series.map((item) => item.name),
      textStyle: {
        color: '#ccc',
        fontSize: legendFontSize,
      },
      top: '8%',
      itemWidth: vwToPx(0.6),
      itemHeight: vwToPx(0.6),
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '2%',
      containLabel: true,
      show: props.showGrid,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data.xAxis,
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)',
        },
      },
      axisLabel: {
        color: '#ccc',
        fontSize: axisLabelFontSize,
      },
    },
    yAxis: {
      type: 'value',
      name: props.yAxisName,
      nameTextStyle: {
        color: '#00ccff',
        fontSize: yAxisNameFontSize,
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)',
        },
      },
      axisLabel: {
        color: '#ccc',
        fontSize: axisLabelFontSize,
        formatter: props.yAxisName.includes('%') ? '{value}%' : '{value}',
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    series: props.data.series.map((item, index) => {
      const colors = ['#ff4949', '#722ed1', '#fac858'];
      return {
        name: item.name,
        type: 'line',
        data: item.data,
        smooth: props.smooth,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        emphasis: {
          showSymbol: true,
        },
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: colors[index % colors.length],
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: `${colors[index % colors.length]}80`,
              },
              {
                offset: 1,
                color: `${colors[index % colors.length]}00`,
              },
            ],
          },
        },
      };
    }),
  };

  chartInstance.setOption(option);
};

const handleResize = () => {
  if (!chartInstance) return;

  const tooltipFontSize = vwToPx(0.65);
  const legendFontSize = vwToPx(0.7);
  const axisLabelFontSize = vwToPx(0.6);
  const yAxisNameFontSize = vwToPx(0.7);
  const titleFontSize = vwToPx(0.8);

  chartInstance.setOption({
    title: { textStyle: { fontSize: titleFontSize } },
    tooltip: { textStyle: { fontSize: tooltipFontSize } },
    legend: {
      textStyle: { fontSize: legendFontSize },
      itemWidth: vwToPx(0.6),
      itemHeight: vwToPx(0.6),
    },
    xAxis: { axisLabel: { fontSize: axisLabelFontSize } },
    yAxis: {
      nameTextStyle: { fontSize: yAxisNameFontSize },
      axisLabel: { fontSize: axisLabelFontSize },
    },
  });

  chartInstance.resize();
};

watch(
  [() => props.data, () => props.baseFontScale, () => props.title],
  () => {
    nextTick(() => {
      initChart();
    });
  },
  { deep: true },
);

onMounted(() => {
  nextTick(() => {
    initChart();
    window.addEventListener('resize', handleResize);
  });
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="chart-container">
    <div ref="chartRef" class="chart-wrapper"></div>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
  min-height: 15vh;
}
</style>
