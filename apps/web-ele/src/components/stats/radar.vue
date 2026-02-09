<!-- /components/stats/radar.vue -->
<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

// 仅保留核心必选配置
const props = defineProps({
  // 图表标题
  title: { type: String, default: '数据统计' },
  // 雷达图指标名称数组
  indicatorNames: { type: Array, required: true },
  // 数据系列（[{name: '名称', data: [数值]}]）
  seriesData: { type: Array, required: true },
  // 雷达图形状：'polygon' 多边形，'circle' 圆形
  shape: { type: String, default: 'polygon' },
  // 雷达图半径（百分比或像素）
  radius: { type: String, default: '75%' },
  // 是否显示面积
  area: { type: Boolean, default: true },
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

    // 构建雷达图指标
    const indicators = props.indicatorNames.map((name) => ({
      name,
      max: 100, // 默认最大值为100，实际项目中可能需要根据数据动态计算
    }));

    // 核心配置（雷达图特有配置）
    const option = {
      title: { text: props.title, left: 'center' },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 10,
        left: 'center',
        data: props.seriesData.map((item) => item.name),
      },
      radar: {
        indicator: indicators,
        shape: props.shape,
        radius: props.radius,
        axisName: {
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
        splitArea: {
          areaStyle: {
            color: ['rgba(250, 250, 250, 0.2)', 'rgba(200, 200, 200, 0.1)'],
          },
        },
      },
      color: ['#4a90e2', '#FF6B6B', '#FFD166', '#06D6A0'], // 扩展配色适配多系列
      series: [
        {
          type: 'radar',
          emphasis: {
            lineStyle: {
              width: 4,
            },
          },
          data: props.seriesData.map((seriesItem, index) => ({
            name: seriesItem.name,
            value: seriesItem.data,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
              width: 2,
              color:
                seriesItem.color ||
                ['#4a90e2', '#FF6B6B', '#FFD166', '#06D6A0'][index % 4],
            },
            itemStyle: {
              color:
                seriesItem.color ||
                ['#4a90e2', '#FF6B6B', '#FFD166', '#06D6A0'][index % 4],
            },
            areaStyle: props.area
              ? {
                  color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                    {
                      offset: 0,
                      color: `${seriesItem.color || ['#4a90e2', '#FF6B6B', '#FFD166', '#06D6A0'][index % 4]}80`,
                    },
                    {
                      offset: 1,
                      color: `${seriesItem.color || ['#4a90e2', '#FF6B6B', '#FFD166', '#06D6A0'][index % 4]}10`,
                    },
                  ]),
                }
              : null,
          })),
        },
      ],
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
  [
    () => props.indicatorNames,
    () => props.seriesData,
    () => props.shape,
    () => props.radius,
    () => props.area,
  ],
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
  <!-- 雷达图容器：强制设置基础宽高，避免尺寸为0 -->
  <div ref="chartRef" class="park-type-chart"></div>
</template>
