<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

// 定义组件属性（简化并适配车场类型场景）
const props = defineProps({
  // 车场类型数据（默认填充漳州车场类型数据）
  data: {
    type: Array,
    default: () => [
      { name: '商业停车场', value: 58 },
      { name: '公共停车场', value: 42 },
      { name: '小区停车场', value: 35 },
      { name: '办公停车场', value: 18 },
      { name: '文旅停车场', value: 15 },
      { name: '医疗停车场', value: 8 },
    ],
  },
  // 是否显示标题
  showTitle: {
    type: Boolean,
    default: true,
  },
  // 标题文本
  titleText: {
    type: String,
    default: '漳州车场类型占比',
  },
});

// 图表实例引用
const chartRef = ref(null);
let chartInstance = null;
// 防抖计时器（用于resize）
let resizeTimer = null;

// 漳州车场类型专属配色（贴合业务视觉）
const parkTypeColors = [
  '#409EFF', // 商业停车场-蓝色
  '#13ce66', // 公共停车场-绿色
  '#67C23A', // 小区停车场-青绿色
  '#E6A23C', // 办公停车场-橙色
  '#9C27B0', // 文旅停车场-紫色
  '#F56C6C', // 医疗停车场-红色
];

// 防抖函数：避免频繁resize触发
const debounce = (fn, delay = 300) => {
  return (...args) => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => fn.apply(this, args), delay);
  };
};

// 检查容器尺寸是否有效
const checkContainerSize = (container) => {
  if (!container) return false;
  const rect = container.getBoundingClientRect();
  // 宽高都大于0才视为有效
  return rect.width > 0 && rect.height > 0;
};

// 初始化车场类型占比图表（重构核心逻辑）
const initChart = async () => {
  // 等待DOM渲染完成（关键：解决重新进入时DOM未加载的问题）
  await nextTick();

  const container = chartRef.value;
  // 1. 校验容器是否存在+尺寸是否有效
  if (!container || !checkContainerSize(container)) {
    console.warn('ECharts容器不存在或尺寸为0，跳过初始化');
    // 尺寸无效时延迟重试（适配父容器异步渲染）
    setTimeout(initChart, 200);
    return;
  }

  // 2. 销毁旧实例（避免实例冲突）
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }

  try {
    // 3. 创建新实例（包裹try-catch，避免初始化失败）
    chartInstance = echarts.init(container);

    // 计算总计
    const total = props.data.reduce((sum, item) => sum + item.value, 0);

    // 组装图表配置
    const option = {
      title: props.showTitle
        ? {
            text: props.titleText,
            left: 'center',
            top: 10,
            textStyle: {
              fontSize: 14,
              fontWeight: 300,
              color: '#303133',
            },
          }
        : null,
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>数量：{c} 个<br/>占比：{d}%',
        textStyle: {
          fontSize: 12,
        },
      },
      legend: {
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        textStyle: {
          fontSize: 12,
          color: '#6E7E91',
        },
        itemWidth: 10,
        formatter: (name) => {
          return name.length > 6 ? `${name.slice(0, 6)}...` : name;
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['30%', '60%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          labelLine: {
            show: false,
            position: 'center',
          },
          data: props.data,
          itemStyle: {
            color: (params) =>
              parkTypeColors[params.dataIndex % parkTypeColors.length],
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold',
              color: '#6E7E91',
            },
          },
        },
      ],
    };

    // 4. 设置配置（强制覆盖，避免配置残留）
    chartInstance.setOption(option, {
      notMerge: false,
      lazyUpdate: false,
    });
  } catch (error) {
    console.error('ECharts初始化失败：', error);
    chartInstance = null;
  }
};

// 监听数据变化，重新渲染（增加守卫）
watch(
  () => props.data,
  () => {
    // 确保组件未卸载且DOM已渲染
    if (chartRef.value) {
      initChart();
    }
  },
  { deep: true, immediate: false }, // 关闭immediate，避免挂载前触发
);

// 窗口自适应（防抖+实例有效性校验）
const resizeHandler = debounce(() => {
  // 实例存在+容器有效才执行resize
  if (chartInstance && checkContainerSize(chartRef.value)) {
    chartInstance.resize();
  }
});

// 生命周期（优化）
onMounted(() => {
  // 挂载后异步初始化，确保DOM就绪
  nextTick(() => {
    initChart();
    window.addEventListener('resize', resizeHandler);
  });
});

onUnmounted(() => {
  // 清理所有监听和实例
  clearTimeout(resizeTimer);
  window.removeEventListener('resize', resizeHandler);
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<template>
  <!-- 车场类型占比圆环图：确保容器有明确宽高 -->
  <div ref="chartRef" style="min-width: 200px !important; max-width: 100%; height: 330px; background-color: hsl(var(--card)); border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);"></div>
</template>
