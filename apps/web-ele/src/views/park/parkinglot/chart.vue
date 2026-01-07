<script setup>
import {
  defineEmits,
  defineProps,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';

import * as echarts from 'echarts';

// 定义Props
const props = defineProps({
  parkName: { type: String, required: false, default: '智慧停车场' },
  initData: {
    type: Object,
    required: false,
    default: () => ({
      pieData: [
        { value: 128, name: '已占用车位' },
        { value: 72, name: '空闲车位' },
      ],
      barData: {
        areas: ['A区', 'B区', 'C区', 'D区', 'E区'],
        occupied: [28, 25, 30, 22, 23],
        free: [12, 15, 10, 18, 17],
      },
      lineData: {
        hours: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        usageRate: [
          20, 18, 15, 12, 10, 12, 18, 35, 55, 60, 65, 70, 75, 70, 65, 75, 80,
          85, 80, 70, 60, 45, 30, 25,
        ],
      },
    }),
  },
});

// 定义Emits
const emit = defineEmits(['refreshData', 'chartLoaded']);

// 图表引用和实例
const pieChartRef = ref(null);
const barChartRef = ref(null);
const lineChartRef = ref(null);
let pieChart = null;
let barChart = null;
let lineChart = null;

// 使用父组件传递的初始数据
const parkingData = ref(props.initData);

// 核心修复：封装初始化函数，增加DOM校验和延时处理
const initChart = (refEl, option) => {
  // 1. 校验DOM元素是否存在
  if (!refEl) return null;

  // 2. 销毁已有实例，避免重复创建
  const chartInstance = echarts.getInstanceByDom(refEl);
  if (chartInstance) {
    chartInstance.dispose();
  }

  // 3. 创建新实例并设置配置
  const chart = echarts.init(refEl);
  chart.setOption(option);

  // 4. 强制刷新尺寸（关键：解决首次尺寸为0的问题）
  setTimeout(() => {
    chart.resize();
  }, 100);

  return chart;
};

// 初始化所有图表（基于修复后的initChart）
const initAllCharts = async () => {
  // 关键修复：使用nextTick确保DOM完全渲染后再初始化
  await nextTick();
  // 饼图初始化
  if (pieChartRef.value) {
    pieChart = initChart(pieChartRef.value, {
      tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c}个 ({d}%)' },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['已占用车位', '空闲车位'],
      },
      series: [
        {
          name: '车位状态',
          type: 'pie',
          radius: ['40%', '70%'],
          data: parkingData.value.pieData,
          color: ['#e53935', '#43a047'],
        },
      ],
    });
  }

  // 柱状图初始化
  if (barChartRef.value) {
    barChart = initChart(barChartRef.value, {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['已占用', '空闲'] },
      xAxis: [{ type: 'category', data: parkingData.value.barData.areas }],
      yAxis: [{ type: 'value', name: '车位数' }],
      series: [
        {
          name: '已占用',
          type: 'bar',
          data: parkingData.value.barData.occupied,
          color: '#e53935',
        },
        {
          name: '空闲',
          type: 'bar',
          data: parkingData.value.barData.free,
          color: '#43a047',
        },
      ],
    });
  }

  // 折线图初始化
  if (lineChartRef.value) {
    lineChart = initChart(lineChartRef.value, {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: parkingData.value.lineData.hours,
      },
      yAxis: { type: 'value', name: '使用率(%)', max: 100, min: 0 },
      series: [
        {
          name: '车位使用率',
          type: 'line',
          smooth: true,
          data: parkingData.value.lineData.usageRate,
          color: '#4285f4',
        },
      ],
    });
  }
};

// 监听props变化，更新数据
watch(
  () => props.initData,
  (newVal) => {
    parkingData.value = newVal;
    initAllCharts();
  },
  { deep: true },
);

const init = () => {};
const resize = () => {
  pieChart?.resize();
  barChart?.resize();
  lineChart?.resize();
};
// 生命周期：挂载时初始化（增加延时兜底）
onMounted(() => {
  initAllCharts();
  // 监听窗口大小变化，确保图表自适应
  window.addEventListener('resize', resize);
});

// 生命周期：卸载时销毁
onUnmounted(() => {
  window.removeEventListener('resize', resize);
  pieChart?.dispose();
  barChart?.dispose();
  lineChart?.dispose();
});
defineExpose({
  resize,
});
</script>

<template>
  <div class="parking-container">
    <!-- 给图表容器添加明确的最小尺寸，避免尺寸为0 -->
    <div class="chart-grid">
      <!-- 车位占比饼图 -->
      <div class="chart-item">
        <h3>车位使用占比</h3>
        <div ref="pieChartRef" class="chart-box"></div>
      </div>
      <!-- 区域车位柱状图 -->
      <div class="chart-item">
        <h3>各区域车位使用情况</h3>
        <div ref="barChartRef" class="chart-box"></div>
      </div>
      <!-- 24小时使用率折线图 -->
      <div class="chart-item full-width">
        <h3>24小时车位使用率趋势</h3>
        <div ref="lineChartRef" class="chart-box"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.parking-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  /* 确保容器本身有尺寸 */
  width: 100%;
  height: 100%;
}
.parking-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
.chart-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  /* 明确网格容器尺寸 */
  height: 100%;
  width: 100%;
}
.chart-item {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 确保每个图表项有最小尺寸 */
  width: 100%;
  height: 100%;
}
.full-width {
  grid-column: 1 / 3;
}
/* 核心：给图表容器设置明确的宽高 */
.chart-box {
  width: 100%;
  height: 100%;
  min-height: 300px; /* 最小高度兜底 */
}
.refresh-btn {
  grid-column: 1 / 3;
  padding: 10px 20px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
