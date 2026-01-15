<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup>
import {
  defineEmits,
  defineProps,
  ref,
  watch,
  onMounted,
  onUnmounted
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
  barMaxWidth: {
    type: Number,
    default: 30
  }
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
      formatter: '{a}: {c}',
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
        rotate: props.xAxis.length > 4 ? 30 : 0,
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
      // ✅ 修改点1：【多系列专用配色】固定2套主渐变（完美适配入库+出库双系列）
      // 入库=天蓝色渐变  出库=翠绿色渐变 区分度极高，符合大屏配色规范
      const colorGradients = [
        [{offset: 0, color: '#00ccff'}, {offset: 1, color: '#0066ff'}], // 入库-蓝色系
        [{offset: 0, color: '#4ECDC4'}, {offset: 1, color: '#1A9885'}]  // 出库-绿色系
      ];
      const activeColors = ['#c272e1']; // 高亮色保留不变
      const labelFontSize = vwToPx(0.6);

      return {
        ...item,
        type: 'bar',
        barWidth: '60%',
        barMaxWidth: props.barMaxWidth,
        label: {
          show: false,
          position: 'top',
          color: '#e6f7ff',
          fontSize: labelFontSize,
          fontWeight: '600',
          formatter: `{c} ${props.unit}`,
        },
        itemStyle: {
          color: (params) => {
            // 高亮逻辑保留不变
            if (props.activeIndices.includes(params.dataIndex)) {
              return activeColors[0];
            }
            // ✅ 修改点2：【核心修复】按【系列下标】取色 → 同系列同色，不同系列不同色
            // params.seriesIndex 0=入库系列 1=出库系列
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, colorGradients[params.seriesIndex % colorGradients.length]);
          },
          borderRadius: [4, 4, 0, 0], // 保留顶部圆角
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 102, 255, 0.5)',
            borderColor: '#fff', // 保留hover白色边框
            borderWidth: 1
          },
          label: {
            show: false,
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
  {deep: true},
);

const handleResize = () => {
  if (!chartInstance.value) return;

  const titleFontSize = vwToPx(0.8);
  const tooltipFontSize = vwToPx(0.65);
  const axisLabelFontSize = vwToPx(0.6);
  const gridTop = getGridTop();
  const labelFontSize = vwToPx(0.6);

  chartInstance.value.setOption({
    title: {textStyle: {fontSize: titleFontSize}},
    tooltip: {textStyle: {fontSize: tooltipFontSize}},
    grid: {top: gridTop},
    xAxis: {axisLabel: {fontSize: axisLabelFontSize}},
    yAxis: {axisLabel: {fontSize: axisLabelFontSize}},
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

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>
