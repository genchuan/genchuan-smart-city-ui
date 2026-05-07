<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({
      cards: [],
      barData: [],
    }),
  },
});

const emit = defineEmits(['cardClick', 'barClick']);

const barChartRef = ref(null);
const barChartInstance = ref(null);

const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B'];

const initBarChart = () => {
  if (!barChartRef.value) return;

  if (barChartInstance.value) {
    barChartInstance.value.dispose();
  }

  const chartInstance = echarts.init(barChartRef.value);
  barChartInstance.value = chartInstance;

  const barData = props.data.barData || [];
  const xAxisData = barData.map((item) => item.name);
  const countData = barData.map((item) => item.value);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '券包类型分布',
      left: 'center',
      top: 10,
      textStyle: {
        color: '#6E7E91',
        fontSize: 16,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: {
        color: '#6E7E91',
      },
      axisPointer: {
        type: 'shadow',
      },
      formatter: '{b}: {c}',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '20%',
      containLabel: true,
      backgroundColor: 'transparent',
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: xAxisData,
      axisLabel: {
        color: '#6E7E91',
        fontSize: 12,
        interval: 0,
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
    series: [
      {
        name: '券包数量',
        type: 'bar',
        data: countData,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4A90E2' },
            { offset: 1, color: '#50E3C2' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '40%',
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
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
      },
    ],
  };

  chartInstance.setOption(option);

  // 点击事件 - 传递type值
  chartInstance.on('click', (params) => {
    const barItem = props.data.barData[params.dataIndex];
    if (barItem) {
      emit('barClick', barItem.type);
    }
  });
};

const initCharts = () => {
  initBarChart();
};

const handleResize = () => {
  if (barChartInstance.value) {
    barChartInstance.value.resize();
  }
};

const handleCardClick = (card) => {
  emit('cardClick', card);
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
  if (barChartInstance.value) {
    barChartInstance.value.dispose();
  }
});
</script>

<template>
  <div class="package-chart-box">
    <!-- 卡片区域 -->
    <div class="chart-box-left">
      <div
        v-for="(card, index) in data.cards"
        :key="`card-${index}`"
        class="stat-card"
        :style="{ borderLeftColor: card.color || '#4A90E2' }"
        @click="handleCardClick(card)"
      >
        <div class="card-header">
          <h3 class="card-title">{{ card.title }}</h3>
          <div
            class="card-indicator"
            :style="{ backgroundColor: card.color || '#4A90E2' }"
          ></div>
        </div>
        <div class="card-body">
          <div class="card-value">{{ card.value }}</div>
          <div class="card-desc" v-if="card.desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-wrapper">
      <!-- 柱状图区域 -->
      <div class="package-type-chart" ref="barChartRef"></div>
    </div>
  </div>
</template>

<style scoped>
.package-chart-box {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: auto;
  min-height: 280px;
  padding-bottom: 0.5rem;
  overflow: hidden;
}

.chart-box-left {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  height: 280px;
}

.stat-card {
  flex: 1;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  background-color: var(--el-bg-color, #fff);
  border-left: 4px solid;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  transition: all 0.3s ease;
}

.stat-card:last-child {
  margin-bottom: 0;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
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
  color: #6e7e91;
}

.card-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-value {
  font-size: 28px;
  font-weight: 600;
  color: #4a90e2;
}

.card-desc {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.charts-wrapper {
  position: relative;
  display: flex;
  flex: 1 1 0;
  min-width: 0;
}

.package-type-chart {
  flex: 1;
  min-width: 0;
  height: 280px;
  margin-left: 0 !important;
}
</style>
