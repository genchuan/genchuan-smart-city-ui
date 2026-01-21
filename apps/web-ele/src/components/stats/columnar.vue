<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

// 仅保留核心必选配置
const props = defineProps({
  // 图表标题
  title: { type: String, default: '数据统计' },
  // X轴类目（如区域/类型）
  xData: { type: Array, required: true },
  // 数据系列（[{name: '名称', data: [数值]}]）
  seriesData: { type: Array, required: true },
  // 宽高（默认适配常用尺寸）
  width: { type: String, default: '600px' },
  height: { type: String, default: '400px' },
  // Y轴名称
  yName: { type: String, default: '数量' },
});

const chartRef = ref(null);
let chartInstance = null;

// 初始化图表（极简配置）
const initChart = () => {
  if (!chartRef.value) return;

  // 销毁旧实例
  if (chartInstance) chartInstance.dispose();

  // 创建实例
  chartInstance = echarts.init(chartRef.value);

  // 核心配置（只保留必要项）
  const option = {
    title: { text: props.title, left: 'center' },
    tooltip: { trigger: 'axis' }, // 仅保留基础提示框
    legend: { bottom: 10, left: 'center' }, // 图例固定在底部居中
    grid: {
      left: '5%',
      right: '5%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: { type: 'category', data: props.xData },
    yAxis: { type: 'value', name: props.yName },
    series: props.seriesData.map((item, idx) => ({
      name: item.name,
      type: 'bar',
      data: item.data,
      // 固定配色（简洁易区分）
      itemStyle: { color: ['#409EFF', '#67C23A', '#E6A23C'][idx % 3] },
    })),
  };

  chartInstance.setOption(option);
};

// 监听数据变化重绘
watch([() => props.xData, () => props.seriesData], initChart, { deep: true });

// 窗口自适应
const resize = () => chartInstance && chartInstance.resize();

// 生命周期
onMounted(() => {
  initChart();
  window.addEventListener('resize', resize);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  chartInstance && chartInstance.dispose();
});
</script>

<template>
  <!-- 简单柱状图容器 -->
  <div ref="chartRef" class="simple-bar-chart" :style="{ width, height }"></div>
</template>

<style scoped>
.simple-bar-chart {
  display: inline-block;
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
