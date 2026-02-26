<!-- /components/stats/line.vue -->
<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

// 仅保留核心必选配置
const props = defineProps({
  // 图表标题
  title: { type: String, default: '数据统计' },
  // X轴类目（如时间/日期/区域）
  xData: { type: Array, required: true },
  // 数据系列（[{name: '名称', data: [数值]}]）
  seriesData: { type: Array, required: true },
  // Y轴名称
  yName: { type: String, default: '数量' },
  // 是否平滑曲线（扩展配置，贴合折线图特性）
  smooth: { type: Boolean, default: true },
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

    // 核心配置（贴合折线图特性，保持和柱状图一致的样式风格）
    const option = {
      title: { text: props.title, left: 'center' },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }, // 保持和柱状图一致的指示器风格
      },
      legend: { top: 40, left: 'center' },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        backgroundColor: 'transparent',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false, // 折线图关闭边界间隙，更贴合趋势展示
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
            color: '#9AA8B7',
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
      color: ['#4a90e2', '#FF6B6B', '#FFD166', '#06D6A0'], // 扩展配色适配多系列
      series: props.seriesData.map((seriesItem) => ({
        name: seriesItem.name,
        type: 'line', // 折线图核心类型
        smooth: props.smooth, // 平滑曲线配置
        data: seriesItem.data.map((value, idx) => ({ value })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: `rgba(${seriesItem.color ? seriesItem.color.replace('#', '') : '74,144,226'}, 0.3)`,
          },
        },
        lineStyle: {
          width: 2, // 折线宽度
          color: seriesItem.color || '#4a90e2', // 支持自定义系列颜色
        },
        itemStyle: {
          color: seriesItem.color || '#4a90e2', // 拐点颜色
          borderWidth: 2,
        },
        areaStyle: {
          // 渐变面积填充（折线图特色）
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `${seriesItem.color || '#4a90e2'}80` },
            { offset: 1, color: `${seriesItem.color || '#4a90e2'}10` },
          ]),
        },
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
  [() => props.xData, () => props.seriesData, () => props.smooth],
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
  <!-- 折线图容器：强制设置基础宽高，避免尺寸为0 -->
  <div ref="chartRef" style="min-width: 200px !important; max-width: 100%; height: 330px; background-color: hsl(var(--card)); border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);"></div>
</template>
