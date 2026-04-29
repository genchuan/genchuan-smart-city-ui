<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

// 仅保留核心必选配置
const props = defineProps({
  // 图表标题
  title: { type: String, default: '数据统计' },
  // X轴类目（如区域/类型）
  xData: { type: Array, required: true },
  // 数据系列（[{name: '名称', data: [数值]}]）
  seriesData: { type: Array, required: true },
  // Y轴名称
  yName: { type: String, default: '数量' },
});

const chartRef = ref(null);
let chartInstance = null;
let resizeTimer = null; // 防抖计时器

// 防抖函数：避免频繁resize触发
const debounce = (fn, delay = 300) => {
  return (...args) => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => fn.apply(this, args), delay);
  };
};

// 检查容器尺寸是否有效（核心：避免宽高为0）
const checkContainerValid = () => {
  if (!chartRef.value) return false;
  const rect = chartRef.value.getBoundingClientRect();
  // 宽高都大于0才视为有效容器
  return rect.width > 0 && rect.height > 0;
};

// 初始化图表（重构核心逻辑）
const initChart = async () => {
  // 等待DOM渲染完成（解决重新进入时DOM未加载的问题）
  await nextTick();

  // 1. 校验容器有效性，无效则延迟重试
  if (!checkContainerValid()) {
    console.warn('ECharts容器无效（不存在/尺寸为0），200ms后重试');
    setTimeout(initChart, 200);
    return;
  }

  // 2. 安全销毁旧实例
  if (chartInstance) {
    try {
      chartInstance.dispose();
    } catch (error) {
      console.warn('销毁旧ECharts实例失败：', error);
    }
    chartInstance = null;
  }

  try {
    // 3. 创建新实例（包裹try-catch避免初始化异常）
    chartInstance = echarts.init(chartRef.value);

    // 核心配置
    const option = {
      title: { text: props.title, left: 'center' },
      tooltip: { trigger: 'axis' },
      legend: { top: 10, left: 10 },
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
        },
        axisLine: {
          lineStyle: {
            color: '#E8F4FD',
          },
        },
        axisTick: {
          lineStyle: {
            color: '#E8F4FD',
          },
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        name: props.yName,
        axisLabel: {
          color: '#9AA8B7',
          fontSize: 11,
        },
        axisLine: {
          lineStyle: {
            color: '#E8F4FD',
          },
        },
        axisTick: {
          lineStyle: {
            color: '#E8F4FD',
          },
        },
        splitLine: {
          lineStyle: {
            color: '#F0F6FC',
            type: 'dashed',
          },
        },
      },
      color: ['#4a90e2'],
      series: props.seriesData.map((seriesItem) => ({
        name: seriesItem.name,
        type: 'bar',
        data: seriesItem.data.map((value, idx) => ({ value })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(74, 144, 226, 0.3)',
          },
        },
        barWidth: 30,
      })),
    };

    // 4. 强制设置配置（避免配置残留）
    chartInstance.setOption(option, {
      notMerge: false,
      lazyUpdate: false,
    });
  } catch (error) {
    console.error('ECharts初始化失败：', error);
    chartInstance = null;
  }
};

// 监听数据变化重绘（增加守卫，避免无效触发）
watch(
  [() => props.xData, () => props.seriesData],
  () => {
    // 仅当组件已挂载、容器有效时才重绘
    if (chartRef.value) {
      initChart();
    }
  },
  { deep: true, immediate: false }, // 关闭immediate，避免挂载前触发
);

// 窗口自适应（防抖+实例有效性校验）
const resizeHandler = debounce(() => {
  if (chartInstance && checkContainerValid()) {
    chartInstance.resize();
  }
});

// 生命周期（优化渲染时机）
onMounted(() => {
  // 挂载后异步初始化，确保DOM完全就绪
  nextTick(() => {
    initChart();
    window.addEventListener('resize', resizeHandler);
  });
});

onUnmounted(() => {
  // 彻底清理所有资源，避免内存泄漏
  clearTimeout(resizeTimer);
  window.removeEventListener('resize', resizeHandler);
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<template>
  <!-- 简单柱状图容器：强制设置基础宽高，避免尺寸为0 -->
  <div ref="chartRef" class="simple-bar-chart"></div>
</template>
