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
  data: {
    type: Object,
    default: () => ({
      legend: [],
      series: [],
    }),
  },
  title: {
    type: String,
    default: '通用数据占比分布',
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
const emits = defineEmits(['pieClick']);
const chartRef = ref(null);
const chartInstance = ref(null);

// 转换vw单位为px（适配不同屏幕）
const vwToPx = (vw) => {
  return window.innerWidth * (vw / 100) * props.baseFontScale;
};

const colorScheme = [
  '#E53935',
  '#FF9800',
  '#FFC107',
  '#4CAF50',
  '#5C6BC0',
  '#26A69A',
  '#78909C',
];

const initChart = () => {
  // 避免实例重复创建导致样式异常
  if (!chartInstance.value) {
    chartInstance.value = echarts.init(chartRef.value);
  }

  const titleFontSize = vwToPx(0.8);
  const tooltipFontSize = vwToPx(0.65);
  const labelFontSize = vwToPx(0.7);

  const formattedSeries = props.data.series.map((seriesItem) => {
    const formattedData = seriesItem.data.map((item, index) => {
      const isSelected = props.activeIndices.includes(index);
      if (typeof item === 'object' && item.name) {
        return {
          ...item,
          selected: isSelected,
          itemStyle: {
            borderRadius: 6,
            borderColor: isSelected ? '#00CCFF' : 'rgba(18, 26, 64, 0.9)',
            borderWidth: isSelected ? 3 : 2,
            shadowBlur: isSelected ? 15 : 2,
            shadowColor: isSelected
              ? 'rgba(0, 102, 255, 0.6)'
              : 'rgba(0, 102, 255, 0.2)',
            shadowOffsetX: 0,
          },
        };
      }
      return {
        name: props.data.legend[index] || `类目${index + 1}`,
        value: item,
        selected: isSelected,
        itemStyle: {
          borderRadius: 6,
          borderColor: isSelected ? '#FFFFFF' : 'rgba(18, 26, 64, 0.9)',
          borderWidth: isSelected ? 3 : 2,
          shadowBlur: isSelected ? 15 : 2,
          shadowColor: isSelected
            ? 'rgba(0, 102, 255, 0.6)'
            : 'rgba(0, 102, 255, 0.2)',
          shadowOffsetX: 0,
        },
      };
    });
    return { ...seriesItem, data: formattedData };
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
    legend: {
      show: false,
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(18, 26, 64, 0.9)',
      borderColor: 'rgba(0, 196, 255, 0.4)',
      borderWidth: 1,
      textStyle: {
        color: '#e6f7ff',
        fontSize: tooltipFontSize,
      },
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    series: formattedSeries.map((item) => ({
      ...item,
      type: 'pie',
      radius: '66%',
      center: ['50%', '52%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'inside',
        color: '#e6f7ff',
        fontSize: labelFontSize,
        formatter: '{b}',
      },
      labelLine: {
        show: true,
        length: 6,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.5)',
        },
      },
      emphasis: {
        scale: true,
        itemStyle: {
          shadowBlur: 15,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 102, 255, 0.6)',
        },
      },
      color: colorScheme,
    })),
  };

  chartInstance.value.setOption(option, true);
  setTimeout(() => chartInstance.value?.resize(), 0);

  // 防止点击事件重复绑定
  chartInstance.value.off('click');
  chartInstance.value.on('click', (params) => {
    emits('pieClick', params.dataIndex, params.data);
  });
};

// 监听数据/缩放比例/选中项变化，重新渲染图表
watch(
  [() => props.data, () => props.baseFontScale, () => props.activeIndices],
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
  const labelFontSize = vwToPx(0.7);

  chartInstance.value.setOption({
    title: {
      textStyle: { fontSize: titleFontSize },
    },
    tooltip: {
      textStyle: { fontSize: tooltipFontSize },
    },
    series: [
      {
        label: { fontSize: labelFontSize },
      },
    ],
  });

  chartInstance.value.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance.value?.dispose();
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
