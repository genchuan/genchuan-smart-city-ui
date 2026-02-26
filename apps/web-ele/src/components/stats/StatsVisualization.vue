<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

import IconButton from '#/components/common/IconButton.vue';

import MapComponent from '../Map/index.vue';

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({
      cards: [],
      charts: [],
    }),
  },
  showMapToggle: {
    type: Boolean,
    default: false,
  },
  mapData: {
    type: Array,
    default: () => [],
  },
});

const chartRefs = ref({});
const chartInstances = ref({});
const showMap = ref(false);
const toggleView = () => {
  showMap.value = !showMap.value;
  // 当切换回图表视图时，重新初始化图表
  if (!showMap.value) {
    // 使用nextTick确保DOM已经更新
    setTimeout(() => {
      initCharts();
    }, 0);
  }
};

const initCharts = () => {
  props.data.charts.forEach((chart, index) => {
    const chartRef = chartRefs.value[`chart-${index}`];
    if (!chartRef) return;

    if (chartInstances.value[`chart-${index}`]) {
      chartInstances.value[`chart-${index}`].dispose();
    }

    const chartInstance = echarts.init(chartRef);
    chartInstances.value[`chart-${index}`] = chartInstance;

    const option = getChartOption(chart);
    chartInstance.setOption(option);
  });
};

const getChartOption = (chart) => {
  const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B'];

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: chart.title,
      left: 'center',
      textStyle: {
        color: '#6E7E91',
        fontSize: 16,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: chart.type === 'pie' ? 'item' : 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: {
        color: '#6E7E91',
      },
    },
    color: freshColors,
  };

  if (chart.type === 'pie') {
    option.legend = {
      orient: 'horizontal',
      bottom: 0,
      // right: 0,
      type: 'scroll', // 启用滚动模式
      left: 'center', // 水平居中
      textStyle: {
        color: '#6E7E91',
        fontSize: 12,
      },
      // 图例项换行适配
      itemWidth: 10, // 每个图例项宽度，避免挤在一起
      formatter(name) {
        // 名称过长时截断
        return name.length > 6 ? `${name.slice(0, 6)}...` : name;
      },
    };
    option.series = [
      {
        name: chart.title,
        type: 'pie',
        radius: ['30%', '60%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#6E7E91',
          },
        },
        labelLine: {
          show: false,
        },
        data: chart.data,
      },
    ];
  } else if (chart.type === 'line' || chart.type === 'bar') {
    option.grid = {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      backgroundColor: 'transparent',
    };
    option.xAxis = {
      type: 'category',
      boundaryGap: chart.type === 'bar',
      data: chart.xAxis,
      axisLabel: {
        show: chart.showXAxisLabel !== false,
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
    };
    option.yAxis = {
      type: 'value',
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
    };
    option.series = [
      {
        name: chart.title,
        type: chart.type,
        data: chart.series,
        itemStyle: {
          borderRadius: chart.type === 'bar' ? [4, 4, 0, 0] : undefined,
        },
        smooth: chart.type === 'line',
        lineStyle:
          chart.type === 'line'
            ? {
                width: 3,
              }
            : undefined,
        symbol: chart.type === 'line' ? 'circle' : undefined,
        symbolSize: chart.type === 'line' ? 6 : undefined,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(74, 144, 226, 0.3)',
          },
        },
      },
    ];
  }

  return option;
};

const handleResize = () => {
  Object.values(chartInstances.value).forEach((chartInstance) => {
    chartInstance.resize();
  });
};

watch(
  () => props.data,
  () => {
    initCharts();
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  Object.values(chartInstances.value).forEach((chartInstance) => {
    chartInstance.dispose();
  });
});
</script>

<template>
  <div class="park-chart-box">
    <!-- 卡片区域 -->
    <div class="chart-box-left">
      <div
        v-for="(card, index) in data.cards"
        :key="`card-${index}`"
        class="stat-card"
        :style="{
          borderLeftColor: card.color || '#13ce66',
        }"
      >
        <div class="card-header">
          <h3 class="card-title">{{ card.title }}</h3>
          <div
            class="card-indicator"
            :style="{ backgroundColor: card.color || '#13ce66' }"
          ></div>
        </div>
        <div class="card-body">
          <div class="card-value">{{ card.value }}</div>
          <div class="card-desc" v-if="card.desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 图表/地图区域 -->
    <div v-if="!showMap" class="charts-wrapper">
      <!-- 地图/图表切换按钮 -->
      <div v-if="showMapToggle" class="toggle-container">
        <IconButton
          :content="showMap ? '图表' : '地图'"
          icon-name="Switch"
          @click="toggleView"
          class="toggle-button"
        />
      </div>
      <div
        v-for="(chart, index) in data.charts"
        :key="`chart-${index}`"
        :class="{
          'simple-bar-chart': chart.type !== 'pie', // 非圆环图（pie）添加类名
          'park-type-chart': chart.type === 'pie', // 圆环图添加类名
        }"
        :ref="(el) => (chartRefs[`chart-${index}`] = el)"
      ></div>
    </div>
    <!-- 地图区域 -->
    <div v-else class="map-wrapper">
      <!-- 地图/图表切换按钮 -->
      <div v-if="showMapToggle" class="toggle-container">
        <IconButton
          :content="showMap ? '图表' : '地图'"
          icon-name="Switch"
          @click="toggleView"
          class="toggle-button"
        />
      </div>
      <MapComponent :data="mapData" />
    </div>
  </div>
</template>

<style scoped>
.park-chart-box {
  display: flex;
  flex-wrap: nowrap; /* 强制不换行 */
  gap: 20px;
  width: 100%;
  height: 350px;
  overflow: hidden; /* 防止内容溢出 */
}

.chart-box-left {
  display: flex;
  flex-shrink: 0; /* 防止卡片区域被压缩 */
  flex-direction: column;
  gap: 16px;
  width: 200px;
}

.charts-wrapper {
  position: relative;
  display: flex;
  flex: 1 1 0; /* 允许收缩和增长 */
  gap: 20px;
  min-width: 0; /* 允许内容收缩到小于内容宽度 */
}

.map-wrapper {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  height: 330px;
}

.toggle-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1999;
}

.toggle-button {
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
}

.simple-bar-chart,
.park-type-chart {
  flex: 1;
  min-width: 0;
  height: 300px;
}
</style>
