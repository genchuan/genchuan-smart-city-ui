<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  title: { type: String, default: '数据统计' },
  xData: { type: Array, required: true },        // 类目数据（如班级）
  seriesData: { type: Array, required: true },   // [{ name, data }]
  yName: { type: String, default: '' },          // 数值轴名称（X轴名称）
});

const emit = defineEmits(['barClick']);
const chartRef = ref(null);
let chartInstance = null;
let resizeTimer = null;

// 防抖
const debounce = (fn, delay = 300) => {
  return (...args) => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => fn.apply(this, args), delay);
  };
};

const checkContainerValid = () => {
  if (!chartRef.value) return false;
  const rect = chartRef.value.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

const initChart = async () => {
  await nextTick();
  if (!checkContainerValid()) {
    setTimeout(initChart, 200);
    return;
  }
  if (chartInstance) {
    try { chartInstance.dispose(); } catch(e) {}
    chartInstance = null;
  }

  try {
    chartInstance = echarts.init(chartRef.value);

    // 每个柱子不同渐变色
    const colorPalette = [
      ['#00ccff', '#0066ff'],
      ['#4ECDC4', '#1A9885'],
      ['#FFA500', '#E67E22'],
      ['#96CEB4', '#58B19F'],
      ['#F7B05E', '#F29B2E'],
      ['#B088F9', '#8650E6'],
    ];

    const option = {
      title: { text: props.title, left: 'center', textStyle: { fontSize: 15, fontWeight: 300, color: '#6E7E91' } },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { show: false },
      grid: { left: '3%', right: '10%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'value',
        name: props.yName,
        nameTextStyle: { color: '#9AA8B7', fontSize: 11 },
        axisLabel: { color: '#9AA8B7', fontSize: 11 },
        splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
      },
      yAxis: {
        type: 'category',
        data: props.xData,
        axisLabel: { color: '#9AA8B7', fontSize: 11, rotate: props.xData.length > 4 ? 30 : 0 },
        axisLine: { lineStyle: { color: '#E8F4FD' } },
      },
      series: props.seriesData.map((seriesItem) => ({
        name: seriesItem.name,
        type: 'bar',
        data: seriesItem.data.map((value, idx) => ({
          value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: colorPalette[idx % colorPalette.length][0] },
              { offset: 1, color: colorPalette[idx % colorPalette.length][1] },
            ]),
          },
        })),
        label: { show: true, position: 'right', color: '#6E7E91', fontSize: 12, formatter: '{c}' },
        barWidth: 25,
      })),
    };

    chartInstance.setOption(option);

    // 点击事件
    chartInstance.on('click', (params) => {
      if (params.componentType === 'series') {
        const category = props.xData[params.dataIndex];
        emit('barClick', category, params.dataIndex);
      }
    });
  } catch (error) {
    console.error('ECharts初始化失败：', error);
    chartInstance = null;
  }
};

watch(
  [() => props.xData, () => props.seriesData],
  () => {
    if (chartRef.value) initChart();
  },
  {deep: true}
);

const resizeHandler = debounce(() => {
  if (chartInstance && checkContainerValid()) chartInstance.resize();
});

onMounted(() => {
  nextTick(() => {
    initChart();
    window.addEventListener('resize', resizeHandler);
  });
});

onUnmounted(() => {
  clearTimeout(resizeTimer);
  window.removeEventListener('resize', resizeHandler);
  if (chartInstance) chartInstance.dispose();
});
</script>

<template>
  <div ref="chartRef"
       style="min-width: 200px; width: 100%; height: 330px; background: hsl(var(--card)); border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);"></div>
</template>
