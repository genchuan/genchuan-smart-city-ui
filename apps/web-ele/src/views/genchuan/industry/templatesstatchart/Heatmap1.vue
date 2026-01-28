<script setup>
import {defineProps, nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import * as echarts from 'echarts';

import {
  fetchSupplyDemandHeatmapData
} from '#/api/genchuan/industry/parkingmgmt/overview/GlobalOverview.ts';

const props = defineProps({
  baseFontScale: {
    type: Number,
    default: 1,
  },
  refreshKey: {
    type: Number,
    default: 0,
  },
  heatmapConfig: {
    type: Object,
    default: () => ({
      min: -10,
      max: 10,
      gridHeight: '60%',
      gridTop: '10%',
      color: ['#1E90FF', '#FFFF00', '#FF4500']
    })
  }
});

const chartRef = ref(null);
const myChart = ref(null);
const chartData = ref({
  hours: [],
  days: [],
  data: []
});

const vwToPx = (vw) => {
  return window.innerWidth * (vw / 100) * props.baseFontScale;
};

const makeOption = () => {
  return {
    tooltip: {
      trigger: 'item', // 显式指定触发方式（热力图必须用item）
      triggerOn: 'mousemove|click', // 鼠标移动/点击都触发
      position: 'top',
      textStyle: {fontSize: vwToPx(0.6), color: '#000'}, // 确保文字可见
      backgroundColor: 'rgba(255,255,255,0.9)', // 增加背景色，避免透明看不到
      borderColor: '#ccc',
      borderWidth: 1,
      // 通过索引获取区域/时段名称（热力图data是[xIndex,yIndex,value]）
      formatter: (params) => {
        // 先判断数据是否有效
        if (!params || !params.data || params.data.length < 3) {
          return '暂无数据';
        }
        const [xIndex, yIndex, value] = params.data;
        // 通过索引获取对应的区域/时段名称
        const region = chartData.value.hours[xIndex] || '未知区域';
        const timePeriod = chartData.value.days[yIndex] || '未知时段';
        // 确保value是数字（避免原数据中'-'导致的判断错误）
        const numValue = Number(value);
        let gapDesc = '';
        if (numValue > 0) {
          gapDesc = `需大于供，缺口${numValue}`;
        } else if (numValue < 0) {
          gapDesc = `供大于求，盈余${Math.abs(numValue)}`;
        } else {
          gapDesc = '供需平衡';
        }
        return `
          <div style="text-align: left; padding: 4px 8px;">
            <div><strong>区域：</strong>${region}</div>
            <div><strong>时段：</strong>${timePeriod}</div>
            <div><strong>状态：</strong>${gapDesc}</div>
          </div>
        `;
      }
    },
    grid: {
      height: props.heatmapConfig.gridHeight,
      top: props.heatmapConfig.gridTop
    },
    xAxis: {
      type: 'category',
      name: '停车场区域',
      nameTextStyle: {
        color: '#fff',
        fontSize: vwToPx(0.7)
      },
      data: chartData.value.hours,
      splitArea: {show: true},
      axisLabel: {
        color: '#fff',
        fontSize: vwToPx(0.65)
      }
    },
    yAxis: {
      type: 'category',
      name: '时段维度',
      nameTextStyle: {
        color: '#fff',
        fontSize: vwToPx(0.7)
      },
      data: chartData.value.days,
      splitArea: {show: true},
      axisLabel: {
        color: '#fff',
        fontSize: vwToPx(0.65)
      }
    },
    visualMap: {
      min: props.heatmapConfig.min,
      max: props.heatmapConfig.max,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '8',
      text: ['需大于求', '供大于求'],
      textStyle: {
        color: '#fff',
        fontSize: vwToPx(0.6)
      },
      inRange: {color: props.heatmapConfig.color}
    },
    series: [
      {
        name: '区域供需缺口分布',
        type: 'heatmap',
        data: chartData.value.data,
        label: {
          show: true,
          fontSize: vwToPx(0.6)
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
};

const getChartData = async () => {
  try {
    chartData.value = await fetchSupplyDemandHeatmapData({});

    if (!myChart.value) {
      myChart.value = echarts.init(chartRef.value);
    }
    myChart.value.setOption(makeOption(), true);
  } catch (error) {
    console.error('区域供需缺口热力图数据请求失败:', error);
  }
};

const handleResize = () => {
  nextTick(() => {
    myChart.value && myChart.value.resize();
  });
};

watch(
  [() => chartData.value, () => props.refreshKey, () => props.heatmapConfig],
  () => {
    if (myChart.value && chartData.value.hours.length > 0) {
      myChart.value.setOption(makeOption(), true);
    }
  },
  {deep: true}
);

onMounted(() => {
  getChartData();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  myChart.value && myChart.value.dispose();
  myChart.value = null;
});
</script>

<template>
  <div
    class="supply-demand-heatmap-container"
    ref="chartRef"
  ></div>
</template>

<style scoped>
.supply-demand-heatmap-container {
  width: 100%;
  height: 100%;
  min-height: 27vh;
  //background: steelblue;
}
</style>
