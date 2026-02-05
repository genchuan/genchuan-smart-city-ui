<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup>
import {
  defineProps,
  ref,
  watch,
  onMounted,
  onUnmounted,
  computed
} from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  // 基础数据配置
  xAxis: {
    type: Array,
    default: () => []
  },
  series: {
    type: Array,
    default: () => []
  },

  // 显示配置
  unit: {
    type: String,
    default: '个'
  },
  title: {
    type: String,
    default: '柱状图'
  },
  showLegend: {
    type: Boolean,
    default: true
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  labelPosition: {
    type: String,
    default: 'insideTop'
  },

  // 样式配置
  baseFontScale: {
    type: Number,
    default: 1
  },
  barMaxWidth: {
    type: Number,
    default: 30
  },
  barWidth: {
    type: [String, Number],
    default: '60%'
  },
  borderRadius: {
    type: [Number, Array],
    default: () => [4, 4, 0, 0]
  },

  // 颜色配置
  colors: {
    type: Array,
    default: () => [
      { offset: 0, color: '#00ccff' }, { offset: 1, color: '#0066ff' },    // 蓝色渐变
      { offset: 0, color: '#4ECDC4' }, { offset: 1, color: '#1A9885' },    // 绿色渐变
      { offset: 0, color: '#FF9966' }, { offset: 1, color: '#FF5500' }     // 橙色渐变
    ]
  },

  // 图表布局配置
  grid: {
    type: Object,
    default: () => ({
      left: '2%',
      right: '2%',
      bottom: '2%',
      top: '20%',
      containLabel: true
    })
  }
});

const chartRef = ref(null);
const chartInstance = ref(null);

// 计算属性：安全的数据
const safeXAxis = computed(() => props.xAxis || []);
const safeSeries = computed(() => props.series || []);
const safeColors = computed(() => {
  if (!Array.isArray(props.colors) || props.colors.length === 0) {
    return [
      { offset: 0, color: '#00ccff' }, { offset: 1, color: '#0066ff' }
    ];
  }
  return props.colors;
});

// 工具函数
const vwToPx = (vw) => {
  return window.innerWidth * (vw / 100) * props.baseFontScale;
};

// 颜色生成器
const getColorGradient = (seriesIndex) => {
  // 将颜色配置转换为echarts渐变格式
  const gradientColors = [];
  for (let i = 0; i < safeColors.value.length; i += 2) {
    if (i + 1 < safeColors.value.length) {
      gradientColors.push([safeColors.value[i], safeColors.value[i + 1]]);
    }
  }

  if (gradientColors.length === 0) {
    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: '#00ccff' },
      { offset: 1, color: '#0066ff' }
    ]);
  }

  const colorIndex = seriesIndex % gradientColors.length;
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, gradientColors[colorIndex]);
};

// 初始化图表
const initChart = () => {
  try {
    if (chartInstance.value) {
      chartInstance.value.dispose();
    }

    if (!chartRef.value) {
      console.error('图表容器未找到');
      return;
    }

    const titleFontSize = vwToPx(0.8);
    const tooltipFontSize = vwToPx(0.65);
    const axisLabelFontSize = vwToPx(0.6);
    const labelFontSize = vwToPx(0.6);

    chartInstance.value = echarts.init(chartRef.value);

    // 构建图表配置
    const option = {
      animation: false,
      backgroundColor: 'transparent',

      // 标题配置
      title: {
        text: props.title,
        textStyle: {
          fontSize: titleFontSize,
          color: '#FFD166',
        },
        left: 'center',
        top: 0,
      },

      // 提示框配置
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(18, 26, 64, 0.9)',
        borderColor: 'rgba(0, 196, 255, 0.4)',
        borderWidth: 1,
        padding: [8, 12],
        textStyle: {
          color: '#e6f7ff',
          fontSize: tooltipFontSize,
          fontWeight: 500,
        },
        formatter: (params) => {
          return `${params.seriesName}: ${params.value} ${props.unit}`;
        },
      },

      // 图例配置
      legend: {
        show: props.showLegend && safeSeries.value.length > 1,
        top: '10%',
        textStyle: {
          color: '#ccc',
          fontSize: vwToPx(0.5),
        },
        itemWidth: 12,
        itemHeight: 12,
      },

      // 网格配置
      grid: {
        ...props.grid,
        top: props.showLegend && safeSeries.value.length > 1 ? '22%' : '20%',
      },

      // X轴配置
      xAxis: {
        type: 'category',
        data: safeXAxis.value,
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 196, 255, 0.4)',
          },
        },
        axisLabel: {
          color: '#ccc',
          fontSize: axisLabelFontSize,
          rotate: safeXAxis.value.length > 4 ? 30 : 0,
        },
      },

      // Y轴配置
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

      // 系列配置
      series: safeSeries.value.map((item, index) => {
        const defaultLabelFormatter = `{c}`;

        return {
          ...item,
          type: 'bar',
          barWidth: props.barWidth,
          barMaxWidth: props.barMaxWidth,
          label: {
            show: props.showLabel,
            position: props.labelPosition,
            color: '#e6f7ff',
            fontSize: labelFontSize,
            fontWeight: '600',
            formatter: defaultLabelFormatter,
          },
          itemStyle: {
            color: getColorGradient(index),
            borderRadius: Array.isArray(props.borderRadius)
              ? props.borderRadius
              : [props.borderRadius, props.borderRadius, 0, 0],
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 102, 255, 0.5)',
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              show: props.showLabel,
              color: '#fff',
              fontSize: labelFontSize + 2,
              shadowBlur: 5,
              shadowColor: 'rgba(0,0,0,0.7)',
            },
          },
        };
      }),
    };

    chartInstance.value.setOption(option, true);

  } catch (error) {
    console.error('初始化图表失败:', error);
  }
};

// 监听数据变化
watch(
  [
    () => safeXAxis.value,
    () => safeSeries.value,
    () => props.baseFontScale,
    () => props.showLabel,
    () => props.showLegend,
  ],
  () => {
    if (chartInstance.value) {
      initChart();
    }
  },
  { deep: true }
);

// 监听窗口大小变化
const handleResize = () => {
  if (!chartInstance.value) return;

  try {
    const titleFontSize = vwToPx(0.8);
    const tooltipFontSize = vwToPx(0.65);
    const axisLabelFontSize = vwToPx(0.6);
    const labelFontSize = vwToPx(0.6);

    chartInstance.value.setOption({
      title: { textStyle: { fontSize: titleFontSize } },
      tooltip: { textStyle: { fontSize: tooltipFontSize } },
      legend: { textStyle: { fontSize: vwToPx(0.5) } },
      xAxis: { axisLabel: { fontSize: axisLabelFontSize } },
      yAxis: { axisLabel: { fontSize: axisLabelFontSize } },
      series: safeSeries.value.map(() => ({
        label: { fontSize: labelFontSize },
        emphasis: { label: { fontSize: labelFontSize + 2 } }
      }))
    });

    chartInstance.value.resize();
  } catch (error) {
    console.error('调整图表大小失败:', error);
  }
};

// 提供公共方法
const resizeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
};

const disposeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
};

// 生命周期
onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  disposeChart();
});

// 暴露公共方法
defineExpose({
  resizeChart,
  disposeChart,
  getInstance: () => chartInstance.value
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>
