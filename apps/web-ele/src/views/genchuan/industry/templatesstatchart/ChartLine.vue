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
});

const chartRef = ref(null);
let chartInstance = null;

// 转换vw为px（适配不同屏幕）
const vwToPx = (vw) => {
  return window.innerWidth * (vw / 100) * props.baseFontScale;
};

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;

  if (chartInstance) {
    chartInstance.dispose();
  }

  chartInstance = echarts.init(chartRef.value);
  const option = getChartOption();
  chartInstance.setOption(option);
};

// 获取图表配置项
const getChartOption = () => {
  const tooltipFontSize = vwToPx(0.65);
  const legendFontSize = vwToPx(0.7);
  const axisLabelFontSize = vwToPx(0.6);
  const yAxisNameFontSize = vwToPx(0.7);

  const predictStartIndex = props.data.xAxis.length - 7;
  const validPredictStartIndex =
    predictStartIndex > 0 ? predictStartIndex : props.data.xAxis.length;

  return {
    backgroundColor: 'transparent',
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
          const isPredict = param.dataIndex >= validPredictStartIndex;
          const predictTag = isPredict
            ? '<span style="background: #409eff; color: #fff; padding: 0 4px; border-radius: 2px; margin-left: 6px;">预测</span>'
            : '';
          res += `<br/>${param.seriesName}：${param.value} ${predictTag}`;
        });
        return res;
      },
    },
    legend: {
      top: '5%',
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
      top: '26%',
      left: '4%',
      right: '4%',
      bottom: '2%',
      containLabel: true,
      show: props.showGrid,
      lineStyle: {
        color: '#ccc',
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data.xAxis,
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
      axisLabel: {
        color: '#666',
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
      nameTextStyle: {
        color: '#666',
        fontSize: yAxisNameFontSize,
      },
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
      axisLabel: {
        color: '#666',
        fontSize: axisLabelFontSize,
        formatter(value) {
          return props.yAxisName.includes('%') ? `${value}%` : value;
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
          type:
            item.lineStyle?.type ||
            ((param) =>
              param.dataIndex >= validPredictStartIndex ? 'dashed' : 'solid'),
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
                  { offset: 0, color: `${colors[index % colors.length]}80` },
                  { offset: 1, color: `${colors[index % colors.length]}00` },
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
                `峰值: ${props.yAxisName.includes('%') ? `${value}%` : value}`,
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
                `谷值: ${props.yAxisName.includes('%') ? `${value}%` : value}`,
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

// 监听数据/字体缩放变化，更新图表
watch(
  () => [props.data, props.baseFontScale],
  () => {
    if (chartInstance) {
      chartInstance.setOption(getChartOption(), true);
    }
  },
  { deep: true },
);

// 窗口自适应
const handleResize = () => {
  if (!chartInstance) return;
  chartInstance.resize();
};

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
  <div class="chart-container" ref="chartRef"></div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
