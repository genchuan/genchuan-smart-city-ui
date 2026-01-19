<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      cards: [],
      charts: [],
    }),
  },
});

const chartRefs = ref({});
const chartInstances = ref({});

// 初始化所有图表
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

// 获取图表配置项
const getChartOption = (chart) => {
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: chart.title,
      left: 'center',
      textStyle: {
        color: '#333',
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: chart.type === 'pie' ? 'item' : 'axis',
    },
  };

  if (chart.type === 'pie') {
    option.legend = {
      orient: 'vertical',
      bottom: 0,
      right: 0,
      textStyle: {
        color: '#666',
      },
    };
    option.series = [
      {
        name: chart.title,
        type: 'pie',
        radius: ['30%', '60%'],
        center: ['45%', '45%'],
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
    };
    option.xAxis = {
      type: 'category',
      boundaryGap: chart.type === 'bar',
      data: chart.xAxis,
    };
    option.yAxis = {
      type: 'value',
    };
    option.series = [
      {
        name: chart.title,
        type: chart.type,
        data: chart.series,
      },
    ];
  }

  return option;
};

// 处理窗口大小变化
const handleResize = () => {
  Object.values(chartInstances.value).forEach((chartInstance) => {
    chartInstance.resize();
  });
};

// 监听数据变化
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
  <div class="stats-visualization">
    <!-- 卡片区域 -->
    <div class="cards-container">
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

    <!-- 图表区域 -->
    <div class="charts-container">
      <div
        v-for="(chart, index) in data.charts"
        :key="`chart-${index}`"
        class="chart-card"
      >
        <div
          class="chart-container"
          :ref="(el) => (chartRefs[`chart-${index}`] = el)"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-visualization {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  position: relative;
  padding: 20px;
  background-color: #fff;
  border-left: 4px solid #13ce66;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 8%);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 16px 0 rgb(0 0 0 / 12%);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.card-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.card-desc {
  font-size: 12px;
  color: #999;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.chart-card {
  height: 300px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 8%);
}

.chart-container {
  width: 100%;
  height: 100%;
}
</style>
