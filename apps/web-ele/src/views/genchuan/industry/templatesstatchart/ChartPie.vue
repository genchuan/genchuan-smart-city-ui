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
    required: false,
    default: () => ({ legend: [], series: [] }),
  },
  title: {
    type: String,
    default: '通用数据占比分布',
  },
  height: {
    type: String,
    default: '100%',
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
const chartContainer = ref(null);
let chartInstance = null;

// 选中项高亮颜色
const selectedHighlightColors = [
  'rgba(255,107,107,0.8)',
  'rgba(255,165,0,0.8)',
  'rgba(78,205,196,0.8)',
  'rgba(69,183,209,0.8)',
  'rgba(150,206,180,0.8)',
  'rgba(177,156,217,0.8)',
  'rgba(255,215,0,0.8)',
];
// 普通项基础颜色
const normalColors = [
  '#FF6B6B',
  '#FFA500',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#B19CD9',
  '#FFD700',
];

// vw 单位转 px（适配不同屏幕）
const vwToPx = (vw) => {
  return window.innerWidth * (vw / 100) * props.baseFontScale;
};

// 构建ECharts饼图配置项
const buildChartOption = () => {
  const titleFontSize = vwToPx(0.8);
  const tooltipFontSize = vwToPx(0.65);

  const formattedData = props.data.legend.map((name, index) => {
    const isSelected = props.activeIndices.includes(index);
    const value = props.data.series[0]?.data[index] || 0;
    const itemColor = isSelected
      ? selectedHighlightColors[index % selectedHighlightColors.length]
      : normalColors[index % normalColors.length];

    return {
      name,
      value,
      selected: isSelected,
      itemStyle: {
        color: itemColor,
        borderColor: isSelected ? '#FFFFFF' : 'rgba(18, 26, 64, 0.9)',
        borderWidth: 2,
        borderRadius: 4,
        shadowBlur: isSelected ? 15 : 2,
        shadowOffsetX: 0,
        shadowColor: isSelected
          ? 'rgba(0, 102, 255, 0.6)'
          : 'rgba(0, 102, 255, 0.2)',
      },
    };
  });

  return {
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
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: props.data.series[0]?.name || '数据统计',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '55%'],
        avoidLabelOverlap: true,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: vwToPx(0.8),
            fontWeight: 'bold',
            color: '#ffffff',
          },
          itemStyle: {
            shadowBlur: 25,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 153, 255, 0.9)',
          },
        },
        labelLine: {
          show: false,
        },
        data: formattedData,
      },
    ],
  };
};

// 初始化/更新饼图
const renderChart = () => {
  if (!chartContainer.value) return;

  if (!chartInstance) {
    chartInstance = echarts.init(chartContainer.value);
    chartInstance.on('click', (params) => {
      emits('pieClick', params.dataIndex, params.data);
    });
  }

  const chartOption = buildChartOption();
  chartInstance.setOption(chartOption, true);
};

// 深度监听数据变化，实时更新图表
watch(
  [() => props.data, () => props.baseFontScale, () => props.activeIndices],
  () => {
    renderChart();
  },
  {immediate: true, deep: true},
);

// 窗口尺寸变化适配
const handleResize = () => {
  if (!chartInstance) return;
  chartInstance.resize();
  renderChart();
};

onMounted(() => {
  renderChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<template>
  <div class="chart-pie-container" ref="chartContainer"></div>
</template>

<style scoped>
.chart-pie-container {
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>
