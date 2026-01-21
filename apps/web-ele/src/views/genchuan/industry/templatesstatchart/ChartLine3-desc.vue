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
    backgroundColor: 'transparent', // 保持透明，适配白色背景
    title: {
      text: props.title,
      textStyle: {
        fontSize: titleFontSize,
        color: '#000', // 修改：标题字体改为黑色
      },
      left: 'center',
      top: 0,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // 修改：tooltip背景改为浅白色（适配白色背景）
      borderColor: 'rgba(0, 0, 0, 0.3)', // 修改：tooltip边框改为浅黑色
      borderWidth: 1,
      textStyle: {
        color: '#000', // 修改：tooltip字体改为黑色
      },
    },
    legend: {
      data: props.data.series.map((item) => item.name),
      textStyle: {
        color: '#000', // 修改：图例字体改为黑色
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
        color: 'rgba(0, 0, 0, 0.1)', // 修改：网格线改为浅黑色（适配白色背景）
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data.xAxis,
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.3)', // 修改：x轴线改为浅黑色
        },
      },
      axisLabel: {
        color: '#000', // 修改：x轴标签字体改为黑色
        fontSize: axisLabelFontSize,
      },
    },
    yAxis: {
      type: 'value',
      name: props.yAxisName,
      nameTextStyle: {
        color: '#000', // 修改：y轴名称字体改为黑色
        fontSize: yAxisNameFontSize,
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.3)', // 修改：y轴线改为浅黑色
        },
      },
      axisLabel: {
        color: '#000', // 修改：y轴标签字体改为黑色
        fontSize: axisLabelFontSize,
        formatter: props.yAxisName.includes('%') ? '{value}%' : '{value}',
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.1)', // 修改：y轴分割线改为浅黑色
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
    title: { textStyle: { fontSize: titleFontSize, color: '#000' } }, // 同步修改resize时的标题颜色
    tooltip: { textStyle: { fontSize: tooltipFontSize, color: '#000' } }, // 同步修改resize时的tooltip字体颜色
    legend: {
      textStyle: { fontSize: legendFontSize, color: '#000' }, // 同步修改resize时的图例字体颜色
      itemWidth: vwToPx(0.6),
      itemHeight: vwToPx(0.6),
    },
    xAxis: { axisLabel: { fontSize: axisLabelFontSize, color: '#000' } }, // 同步修改resize时的x轴标签颜色
    yAxis: {
      nameTextStyle: { fontSize: yAxisNameFontSize, color: '#000' }, // 同步修改resize时的y轴名称颜色
      axisLabel: { fontSize: axisLabelFontSize, color: '#000' }, // 同步修改resize时的y轴标签颜色
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
  min-height: 30vh;
}
</style>
