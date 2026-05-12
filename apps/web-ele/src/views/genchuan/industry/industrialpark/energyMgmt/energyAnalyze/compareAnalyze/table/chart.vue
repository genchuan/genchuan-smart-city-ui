<!-- chart.vue - 能耗对比分析态势（同比/环比差值柱状图 + 同比/环比趋势折线图） -->
<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { getCompareChart } from '#/api/genchuan/industry/industrialPark/energyMgmt/energyAnalyze/compareAnalyze/index.js';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['refresh']);

const state = reactive({
  yoyDiffBar: [],     // 同比差值柱状图数据 [{ month, value }]
  momDiffBar: [],     // 环比差值柱状图数据
  yoyTrendLine: [],   // 同比趋势 [{ month, lastYear, thisYear }]
  momTrendLine: [],   // 环比趋势 [{ month, lastMonth, thisMonth }]
});

const yoyDiffChartRef = ref(null);
const momDiffChartRef = ref(null);
const yoyTrendChartRef = ref(null);
const momTrendChartRef = ref(null);
let yoyDiffChart = null;
let momDiffChart = null;
let yoyTrendChart = null;
let momTrendChart = null;

// 获取图表数据
const fetchChartData = async () => {
  try {
    const data = await getCompareChart({ timeRange: '近6个月' });
    if (data) {
      state.yoyDiffBar = data.yoyDiffBar || [];
      state.momDiffBar = data.momDiffBar || [];
      state.yoyTrendLine = data.yoyTrendLine || [];
      state.momTrendLine = data.momTrendLine || [];
      initCharts();
    }
  } catch (error) {
    console.error('获取对比图表数据失败', error);
    ElMessage.error('加载图表失败');
  }
};

// 同比差值柱状图配置
const getYoyDiffOption = () => ({
  backgroundColor: 'transparent',
  title: { text: '同比能耗差值', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', formatter: '{b}<br/>能耗差值: {c} kWh' },
  xAxis: { type: 'category', data: state.yoyDiffBar.map(item => item.month), axisLabel: { rotate: 30 } },
  yAxis: { type: 'value', name: '能耗差值(kWh)' },
  series: [{
    name: '同比差值', type: 'bar', data: state.yoyDiffBar.map(item => item.value),
    itemStyle: { borderRadius: [4,4,0,0], color: '#4A90E2' },
  }]
});

// 环比差值柱状图配置
const getMomDiffOption = () => ({
  backgroundColor: 'transparent',
  title: { text: '环比能耗差值', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', formatter: '{b}<br/>能耗差值: {c} kWh' },
  xAxis: { type: 'category', data: state.momDiffBar.map(item => item.month), axisLabel: { rotate: 30 } },
  yAxis: { type: 'value', name: '能耗差值(kWh)' },
  series: [{
    name: '环比差值', type: 'bar', data: state.momDiffBar.map(item => item.value),
    itemStyle: { borderRadius: [4,4,0,0], color: '#F5A623' },
  }]
});

// 同比趋势折线图配置
const getYoyTrendOption = () => ({
  backgroundColor: 'transparent',
  title: { text: '能耗同比趋势', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis' },
  legend: { data: ['去年同期', '今年同期'], left: 'left' },
  xAxis: { type: 'category', data: state.yoyTrendLine.map(item => item.month) },
  yAxis: { type: 'value', name: '能耗总量(kWh)' },
  series: [
    { name: '去年同期', type: 'line', data: state.yoyTrendLine.map(item => item.lastYear), smooth: true, color: '#909399' },
    { name: '今年同期', type: 'line', data: state.yoyTrendLine.map(item => item.thisYear), smooth: true, color: '#67C23A' }
  ]
});

// 环比趋势折线图配置
const getMomTrendOption = () => ({
  backgroundColor: 'transparent',
  title: { text: '能耗环比趋势', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis' },
  legend: { data: ['上月同期', '本月同期'], left: 'left' },
  xAxis: { type: 'category', data: state.momTrendLine.map(item => item.month) },
  yAxis: { type: 'value', name: '能耗总量(kWh)' },
  series: [
    { name: '上月同期', type: 'line', data: state.momTrendLine.map(item => item.lastMonth), smooth: true, color: '#909399' },
    { name: '本月同期', type: 'line', data: state.momTrendLine.map(item => item.thisMonth), smooth: true, color: '#E6A23C' }
  ]
});

// 柱状图钻取
const handleBarClick = (chartType, params) => {
  if (params.componentType === 'series') {
    const month = params.name;
    emit('refresh', { compareTime: month });
  }
};

// 折线图钻取
const handleLineClick = (chartType, params) => {
  if (params.componentType === 'series') {
    const month = params.name;
    emit('refresh', { compareTime: month });
  }
};

const initCharts = () => {
  if (yoyDiffChartRef.value) {
    if (yoyDiffChart) yoyDiffChart.dispose();
    yoyDiffChart = echarts.init(yoyDiffChartRef.value);
    yoyDiffChart.setOption(getYoyDiffOption());
    yoyDiffChart.on('click', (params) => handleBarClick('yoyDiff', params));
  }
  if (momDiffChartRef.value) {
    if (momDiffChart) momDiffChart.dispose();
    momDiffChart = echarts.init(momDiffChartRef.value);
    momDiffChart.setOption(getMomDiffOption());
    momDiffChart.on('click', (params) => handleBarClick('momDiff', params));
  }
  if (yoyTrendChartRef.value) {
    if (yoyTrendChart) yoyTrendChart.dispose();
    yoyTrendChart = echarts.init(yoyTrendChartRef.value);
    yoyTrendChart.setOption(getYoyTrendOption());
    yoyTrendChart.on('click', (params) => handleLineClick('yoyTrend', params));
  }
  if (momTrendChartRef.value) {
    if (momTrendChart) momTrendChart.dispose();
    momTrendChart = echarts.init(momTrendChartRef.value);
    momTrendChart.setOption(getMomTrendOption());
    momTrendChart.on('click', (params) => handleLineClick('momTrend', params));
  }
};

const refresh = () => {
  fetchChartData();
};

defineExpose({ refresh });

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('resize', () => {
      yoyDiffChart?.resize();
      momDiffChart?.resize();
      yoyTrendChart?.resize();
      momTrendChart?.resize();
    });
  });
});

onUnmounted(() => {
  yoyDiffChart?.dispose();
  momDiffChart?.dispose();
  yoyTrendChart?.dispose();
  momTrendChart?.dispose();
});
</script>

<template>
  <div class="stats-four-visualization">
    <!-- 一行四列固定高度布局，仿分区能耗分布态势高度 -->
    <div class="charts-row">
      <div class="chart-card">
        <div ref="yoyDiffChartRef" class="chart-container"></div>
      </div>
      <div class="chart-card">
        <div ref="momDiffChartRef" class="chart-container"></div>
      </div>
      <div class="chart-card">
        <div ref="yoyTrendChartRef" class="chart-container"></div>
      </div>
      <div class="chart-card">
        <div ref="momTrendChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-four-visualization {
  width: 100%;
  min-height: 320px; /* 与分区能耗分布态势高度一致 */
}
.charts-row {
  display: flex;
  gap: 16px;
  width: 100%;
  height: 320px; /* 固定高度，与 min-height 匹配 */
}
.chart-card {
  flex: 1;
  background-color: var(--el-bg-color, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 8px;
  display: flex;
  flex-direction: column;
  min-width: 0; /* 防止内容溢出 */
}
.chart-container {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>
