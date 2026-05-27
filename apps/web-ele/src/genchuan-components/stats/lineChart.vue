<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

// 仅保留核心必选配置
const props = defineProps({
  // 图表标题
  title: { type: String, default: '数据统计' },
  // X轴类目（如时间/日期/区域）
  xData: { type: Array, required: true },
  // 数据系列（[{name: '名称', data: [数值], color?: '自定义颜色'}]）
  seriesData: { type: Array, required: true },
  // Y轴名称
  yName: { type: String, default: '数量' },
  // 是否平滑曲线
  smooth: { type: Boolean, default: true },
});

const chartRef = ref(null);
let chartInstance = null;
let resizeTimer = null;

// 防抖函数
const debounce = (fn, delay = 300) => {
  return (...args) => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => fn.apply(this, args), delay);
  };
};

// 检查容器尺寸是否有效
const checkContainerValid = () => {
  if (!chartRef.value) return false;
  const rect = chartRef.value.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

// 初始化图表
const initChart = async () => {
  await nextTick();

  if (!checkContainerValid()) {
    console.warn('ECharts容器无效，200ms后重试');
    setTimeout(initChart, 200);
    return;
  }

  if (chartInstance) {
    try {
      chartInstance.dispose();
    } catch (error) {
      console.warn('销毁旧ECharts实例失败：', error);
    }
    chartInstance = null;
  }

  try {
    chartInstance = echarts.init(chartRef.value);

    // 预置色板（用于自动分配不同颜色）
    const defaultColors = ['#4a90e2', '#FF6B6B', '#FFD166', '#06D6A0'];

    const option = {
      title: {
        text: props.title,
        left: 'center',
        textStyle: { fontSize: 15, fontWeight: 300, color: '#6E7E91' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        top: 40,
        left: 'center',
        textStyle: { fontSize: 12, color: '#6E7E91' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        backgroundColor: 'transparent',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: props.xData,
        axisLabel: { color: '#9AA8B7', fontSize: 11 },
        axisLine: { lineStyle: { color: '#E8F4FD' } },
        axisTick: { lineStyle: { color: '#E8F4FD' } },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        name: props.yName,
        axisLabel: { color: '#9AA8B7', fontSize: 11 },
        axisLine: { lineStyle: { color: '#9AA8B7' } },
        axisTick: { lineStyle: { color: '#E8F4FD' } },
        splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
      },
      // 核心修改点：为每条折线自动分配不同颜色
      series: props.seriesData.map((seriesItem, idx) => {
        // 若用户未提供颜色，则从色板中按索引取色（循环使用）
        const seriesColor = seriesItem.color || defaultColors[idx % defaultColors.length];
        return {
          name: seriesItem.name,
          type: 'line',
          smooth: props.smooth,
          data: seriesItem.data,          // 直接使用数据数组，无需额外包装
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: `rgba(${parseInt(seriesColor.slice(1,3), 16)}, ${parseInt(seriesColor.slice(3,5), 16)}, ${parseInt(seriesColor.slice(5,7), 16)}, 0.3)`,
            },
          },
          lineStyle: { width: 2, color: seriesColor },
          itemStyle: { color: seriesColor, borderWidth: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${seriesColor}80` },
              { offset: 1, color: `${seriesColor}10` },
            ]),
          },
        };
      }),
    };

    chartInstance.setOption(option, { notMerge: false, lazyUpdate: false });
  } catch (error) {
    console.error('ECharts初始化失败：', error);
    chartInstance = null;
  }
};

// 监听数据变化重绘
watch(
  [() => props.xData, () => props.seriesData, () => props.smooth],
  () => {
    if (chartRef.value) initChart();
  },
  { deep: true, immediate: false }
);

// 窗口自适应
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
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<template>
  <div ref="chartRef" style="min-width: 200px !important; max-width: 100%; height: 330px; background-color: hsl(var(--card)); border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);"></div>
</template>
