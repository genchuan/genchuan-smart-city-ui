<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

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
  // 图表宽高（适配数据看板）
  width: {
    type: String,
    default: '350px',
  },
  height: {
    type: String,
    default: '350px',
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

// 漳州车场类型专属配色（贴合业务视觉）
const parkTypeColors = [
  '#409EFF', // 商业停车场-蓝色
  '#13ce66', // 公共停车场-绿色
  '#67C23A', // 小区停车场-青绿色
  '#E6A23C', // 办公停车场-橙色
  '#9C27B0', // 文旅停车场-紫色
  '#F56C6C', // 医疗停车场-红色
];

// 初始化车场类型占比图表
const initChart = () => {
  if (!chartRef.value) return;

  // 销毁旧实例
  if (chartInstance) {
    chartInstance.dispose();
  }

  // 创建新实例
  chartInstance = echarts.init(chartRef.value);

  // 计算总计
  const total = props.data.reduce((sum, item) => sum + item.value, 0);

  // 组装图表配置（专属车场类型样式，图例调整到底部）
  const option = {
    // 标题（适配车场类型场景）
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
    // 提示框（优化车场数据展示格式）
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>数量：{c} 个<br/>占比：{d}%',
      textStyle: {
        fontSize: 12,
      },
    },
    // 图例调整到底部水平排列（核心修改）
    legend: {
      orient: 'horizontal', // 水平排列
      left: 'center', // 水平居中
      bottom: 0, // 距离底部10px
      textStyle: {
        fontSize: 12,
        color: '#6E7E91',
      },
      // 图例项换行适配
      itemWidth: 10, // 每个图例项宽度，避免挤在一起
      formatter: (name) => {
        // 图例名称过长时省略
        return name.length > 6 ? `${name.slice(0, 6)}...` : name;
      },
    },
    // 系列配置（调整圆环位置，适配底部图例）
    series: [
      {
        type: 'pie',
        radius: ['30%', '60%'], // 优化圆环比例
        center: ['50%', '50%'], // 上移圆环，给底部图例预留空间
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
          borderRadius: 6, // 圆角更圆润
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

  chartInstance.setOption(option);
};

// 监听数据变化，重新渲染
watch(
  () => props.data,
  () => initChart(),
  { deep: true },
);

// 窗口自适应
const resizeHandler = () => {
  chartInstance && chartInstance.resize();
};

// 生命周期
onMounted(() => {
  initChart();
  window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler);
  chartInstance && chartInstance.dispose();
  chartInstance = null;
});
</script>

<template>
  <!-- 车场类型占比圆环图 -->
  <div
    ref="chartRef"
    class="park-type-chart"
    :style="{
      width: width || '350px',
      height: height || '350px',
    }"
  ></div>
</template>

<style scoped>
.park-type-chart {
  display: inline-block;
  box-sizing: border-box;
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
</style>
