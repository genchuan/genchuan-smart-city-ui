<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

const props = defineProps({
  // 图表类型：bar/pie/heatmap
  type: {
    type: String,
    required: true,
    validator: (val) => ['bar', 'heatmap', 'pie'].includes(val),
  },
  // 图表数据
  data: {
    type: Object,
    required: true,
  },
  // 图表宽度
  width: {
    type: String,
    default: '100%',
  },
  // 图表高度
  height: {
    type: String,
    default: '400px',
  },
  // 图表标题
  title: {
    type: String,
    default: '',
  },
  // 图表颜色主题
  color: {
    type: Array,
    default: () => ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'],
  },
});

const chartRef = ref(null);
let chartInstance = null;

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;
  // 销毁已有实例
  if (chartInstance) {
    chartInstance.dispose();
  }
  // 创建新实例
  chartInstance = echarts.init(chartRef.value);
  // 渲染图表
  renderChart();
};

// 渲染图表
const renderChart = () => {
  const option = getChartOption();
  chartInstance.setOption(option, true);
};

// 获取图表配置项
const getChartOption = () => {
  const baseOption = {
    title: {
      text: props.title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'item',
      textStyle: {
        fontSize: 12,
      },
    },
    color: props.color,
  };

  switch (props.type) {
    case 'bar': {
      return {
        ...baseOption,
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: props.data.xAxisData || [],
          axisLabel: {
            interval: 0,
            rotate: 30,
          },
        },
        yAxis: {
          type: 'value',
          name: props.data.yAxisName || '车次数',
        },
        series: [
          {
            name: props.data.seriesName || '数量',
            type: 'bar',
            data: props.data.seriesData || [],
            barWidth: '60%',
          },
        ],
      };
    }
    case 'heatmap': {
      return {
        ...baseOption,
        visualMap: {
          min: 0,
          max: props.data.maxValue || 10_000,
          type: 'piecewise',
          orient: 'horizontal',
          left: 'center',
          bottom: '10%',
        },
        series: [
          {
            name: props.data.seriesName || '车流密度',
            type: 'heatmap',
            data: props.data.seriesData || [],
          },
        ],
      };
    }
    case 'pie': {
      return {
        ...baseOption,
        series: [
          {
            name: props.data.seriesName || '占比',
            type: 'pie',
            radius: ['40%', '70%'],
            data: props.data.seriesData || [],
            label: {
              formatter: '{b}: {c} ({d}%)',
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
    }
    default: {
      return baseOption;
    }
  }
};

// 监听数据变化重新渲染
watch(
  () => [props.data, props.title, props.color],
  () => {
    if (chartInstance) renderChart();
  },
  { deep: true },
);

// 窗口自适应
const resizeHandler = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

// 生命周期
onMounted(() => {
  initChart();
  window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler);
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<template>
  <div ref="chartRef" class="chart-container" :style="{ width, height }"></div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
