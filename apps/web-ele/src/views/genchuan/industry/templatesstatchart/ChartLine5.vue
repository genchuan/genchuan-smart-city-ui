<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({
      xAxis: [],
      series: [],
      predictXAxis: [],
    }),
  },
  yAxisName: {
    type: String,
    default: '',
  },
  showGrid: {
    type: Boolean,
    default: true,
  },
  showArea: {
    type: Boolean,
    default: false,
  },
  baseFontScale: {
    type: Number,
    default: 1,
  },
  title: {
    type: String,
    default: '趋势图',
  },
});

const chartRef = ref(null);
let chartInstance = null;

// 转换vw为px（适配不同屏幕）
const vwToPx = (vw) => {
  return window.innerWidth * (vw / 100) * props.baseFontScale;
};

// 初始化图表
const initChart = () => {
  if (chartInstance) {
    chartInstance.dispose();
  }

  // 计算字体大小
  const tooltipFontSize = vwToPx(0.65);
  const legendFontSize = vwToPx(0.7);
  const axisLabelFontSize = vwToPx(0.6);
  const yAxisNameFontSize = vwToPx(0.7);
  const titleFontSize = vwToPx(0.8);

  chartInstance = echarts.init(chartRef.value);
  const option = getChartOption(
    tooltipFontSize,
    legendFontSize,
    axisLabelFontSize,
    yAxisNameFontSize,
    titleFontSize
  );
  chartInstance.setOption(option);
};

// 获取图表配置项（修复百分号判断逻辑）
const getChartOption = (
  tooltipFontSize,
  legendFontSize,
  axisLabelFontSize,
  yAxisNameFontSize,
  titleFontSize
) => {
  // 提取公共判断逻辑，增加容错，避免重复代码
  const needPercent = typeof props.yAxisName === 'string' && props.yAxisName.includes('%');

  return {
    backgroundColor: 'transparent',
    title: {
      text: props.title,
      textStyle: {
        fontSize: titleFontSize,
        color: '#FFD166',
      },
      left: 'center',
      top: vwToPx(0.5),
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(0, 30, 60, 0.8)',
      borderColor: 'rgba(0, 204, 255, 0.3)',
      borderWidth: 1,
      textStyle: {
        color: '#ccc',
        fontSize: tooltipFontSize,
      },
      formatter: (params) => {
        let res = `<strong>${params[0].axisValue}</strong>`;
        params.forEach((param) => {
          res += `<br/>${param.seriesName}：${param.value}`;
        });
        return res;
      },
    },
    legend: {
      show: false,
      top: '26%',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: legendFontSize,
      },
      itemStyle: {
        borderWidth: 2,
      },
      itemSize: 20,
      data: props.data.series.map((item) => ({
        name: item.name,
        icon: 'circle',
      })),
    },
    grid: {
      left: '15%',
      right: '5%',
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
        rotate: 30,
        interval: 5,
        formatter: (value) => value,
      },
      axisTick: {
        interval: 0,
        lineStyle: {
          color: '#ccc',
        },
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: props.yAxisName,
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
      axisLabel: {
        color: '#ccc',
        fontSize: axisLabelFontSize,
        formatter(value) {
          return needPercent ? `${value}%` : `${value}`;
        },
      },
      splitLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
    },
    series: props.data.series.map((item, index) => {
      const colors = ['#13ce66', '#ff7d00', '#ff4949', '#722ed1'];

      return {
        name: item.name,
        type: item.type || 'line',
        data: item.data,
        symbol: 'circle',
        symbolSize: 6,
        smooth: true,
        showSymbol: false,
        emphasis: {
          showSymbol: true,
        },
        lineStyle: {
          width: 3,
          color: colors[index % colors.length],
          type: item.lineStyle?.type || 'solid',
        },
        itemStyle: {
          color: colors[index % colors.length],
        },
        areaStyle: props.showArea
          ? {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {offset: 0, color: `${colors[index % colors.length]}80`},
                {offset: 1, color: `${colors[index % colors.length]}00`},
              ],
            },
          }
          : undefined,
        markPoint: {
          data: [
            {
              name: '峰值',
              type: 'max',
              valueFormatter: (value) =>
                `峰值: ${needPercent ? `${value}%` : `${value}`}`,
              itemStyle: {
                color: '#ff0000',
                borderColor: '#fff',
                borderWidth: 2,
              },
            },
            {
              name: '谷值',
              type: 'min',
              valueFormatter: (value) =>
                `谷值: ${needPercent ? `${value}%` : `${value}`}`,
              itemStyle: {
                color: '#1890ff',
                borderColor: '#fff',
                borderWidth: 2,
              },
            },
          ],
          symbol: 'pin',
          symbolSize: 20,
          label: {
            show: false,
          },
        },
      };
    }),
  };
};

// 窗口自适应
const handleResize = () =>
  {
    if (!chartInstance) return;

    // 重新计算适配字体
    const tooltipFontSize = vwToPx(0.65);
    const legendFontSize = vwToPx(0.7);
    const axisLabelFontSize = vwToPx(0.6);
    const titleFontSize = vwToPx(0.8);

    chartInstance.setOption({
      title: {textStyle: {fontSize: titleFontSize}},
      tooltip: {textStyle: {fontSize: tooltipFontSize}},
      legend: {textStyle: {fontSize: legendFontSize}},
      xAxis: {axisLabel: {fontSize: axisLabelFontSize}},
      yAxis: {
        axisLabel: {fontSize: axisLabelFontSize},
      },
    });

    // 图表自适应缩放
    chartInstance.resize();
  }
;

// 监听数据变化
watch(
  [() => props.data, () => props.baseFontScale, () => props.title],
  () => {
    nextTick(() => {
      initChart();
    });
  },
  {deep: true}
);

// 生命周期：初始化&销毁
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
