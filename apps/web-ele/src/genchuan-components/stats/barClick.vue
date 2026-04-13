<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  title: { type: String, default: '数据统计' },
  xData: { type: Array, required: true },
  seriesData: { type: Array, required: true },
  yName: { type: String, default: '' },
});

// 定义事件
const emit = defineEmits(['barClick']);

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

// 动态生成颜色数组，确保多系列时每个系列有不同的颜色
const generateColors = (seriesCount) => {
  // 预设优雅配色方案（可根据需要扩展）
  const defaultColors = [
    '#50c48a', // 绿色
    '#f5a623', // 橙色
    '#f15a6e', // 粉色
    '#8b5cf6', // 紫色
    '#34b7eb', // 天蓝
    '#ff9a9e', // 浅粉
    '#6c5ce7'  // 深紫
  ];

  if (seriesCount <= defaultColors.length) {
    return defaultColors.slice(0, seriesCount);
  }

  // 如果系列数量超出预设颜色，动态生成互补色
  const colors = [...defaultColors];
  for (let i = defaultColors.length; i < seriesCount; i++) {
    // 使用HSL生成差异化颜色
    const hue = (i * 35) % 360;
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
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

    // 动态生成与系列数量匹配的颜色数组
    const seriesCount = props.seriesData.length;
    const colorPalette = generateColors(seriesCount);

    const option = {
      title: {
        text: props.title,
        left: 'center',
        textStyle: { fontSize: 15, fontWeight: 300, color: '#6E7E91' },
      },
      tooltip: { trigger: 'axis' },
      legend: {
        top: 30,
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
        boundaryGap: true,
        data: props.xData,
        axisLabel: {
          color: '#9AA8B7',
          fontSize: 11,
          rotate: props.xData.length > 4 ? 30 : 0,
        },
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
        splitLine: {
          lineStyle: { color: '#F0F6FC', type: 'dashed' },
        },
      },
      // 关键修改：使用动态生成的调色板，确保多系列时每个系列颜色不同
      color: colorPalette,
      series: props.seriesData.map((seriesItem) => ({
        name: seriesItem.name,
        type: 'bar',
        data: seriesItem.data,
        label: {
          show: true,
          position: 'top',
          color: '#6E7E91',
          fontSize: 12,
          formatter: '{c}',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(74, 144, 226, 0.3)',
          },
        },
        barWidth: 25,
      })),
    };

    chartInstance.setOption(option, {
      notMerge: false,
      lazyUpdate: false,
    });

    // 绑定点击事件
    chartInstance.off('click');
    chartInstance.on('click', (params) => {
      if (params.componentType === 'series' && params.data) {
        const areaName = params.name;
        if (areaName) {
          emit('barClick', areaName);
        }
      }
    });
  } catch (error) {
    console.error('ECharts初始化失败：', error);
    chartInstance = null;
  }
};

// 监听数据变化重绘
watch(
  [() => props.xData, () => props.seriesData, () => props.title],
  () => {
    if (chartRef.value) {
      initChart();
    }
  },
  { deep: true, immediate: false }
);

// 窗口自适应
const resizeHandler = debounce(() => {
  if (chartInstance && checkContainerValid()) {
    chartInstance.resize();
  }
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
  <div
    ref="chartRef"
    style="
      min-width: 200px !important;
      max-width: 100%;
      height: 330px;
      background-color: hsl(var(--card));
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    "
  ></div>
</template>
