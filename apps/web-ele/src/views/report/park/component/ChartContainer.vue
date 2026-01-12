<!-- ChartContainer.vue -->
<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
  height: {
    type: String,
    default: '400px',
  },
});

// 自定义防抖函数
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const chartRef = ref(null);
let chartInstance = null;

// 防抖的 resize 处理
const handleResize = debounce(() => {
  if (chartInstance) {
    chartInstance.resize();
  }
}, 200);

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;

  chartInstance = echarts.init(chartRef.value);
  chartInstance.setOption(props.options);

  // 添加 resize 监听
  window.addEventListener('resize', handleResize);
};

// 销毁图表
const destroyChart = () => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  window.removeEventListener('resize', handleResize);
};

// 监听 options 变化
watch(
  () => props.options,
  (newOptions) => {
    if (chartInstance) {
      chartInstance.setOption(newOptions);
    }
  },
  { deep: true },
);

onMounted(() => {
  nextTick(() => {
    initChart();
  });
});

onUnmounted(() => {
  destroyChart();
});
</script>

<template>
  <div class="chart-container" :style="{ height }" ref="chartRef"></div>
</template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}
</style>
