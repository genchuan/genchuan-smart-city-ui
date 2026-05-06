<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({
      cards: [],
      pieData: [],
      barData: [],
    }),
  },
});

const emit = defineEmits(['cardClick', 'pieClick', 'barClick']);

const pieChartRef = ref(null);
const barChartRef = ref(null);
const pieChartInstance = ref(null);
const barChartInstance = ref(null);

const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B'];

const initPieChart = () => {
  if (!pieChartRef.value) return;

  if (pieChartInstance.value) {
    pieChartInstance.value.dispose();
  }

  const chartInstance = echarts.init(pieChartRef.value);
  pieChartInstance.value = chartInstance;

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '配置类型占比',
      left: 'center',
      top: 10,
      textStyle: {
        color: '#6E7E91',
        fontSize: 16,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: {
        color: '#6E7E91',
      },
      formatter: '{b}: {c}%',
    },
    color: freshColors,
    legend: {
      orient: 'horizontal',
      bottom: 5,
      type: 'scroll',
      left: 'center',
      textStyle: {
        color: '#6E7E91',
        fontSize: 11,
      },
      itemWidth: 12,
      itemHeight: 12,
      formatter(name) {
        return name.length > 5 ? `${name.slice(0, 5)}...` : name;
      },
    },
    series: [
      {
        name: '配置类型',
        type: 'pie',
        radius: ['35%', '55%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: true,
        minShowLabelAngle: 5,
        label: {
          show: true,
          position: 'outside',
          formatter(params) {
            const name =
              params.name.length > 4
                ? `${params.name.slice(0, 4)}...`
                : params.name;
            return `{name|${name}}\n{percent|${params.value}%}`;
          },
          rich: {
            name: {
              color: '#6E7E91',
              fontSize: 11,
              lineHeight: 16,
              align: 'center',
            },
            percent: {
              color: '#4A90E2',
              fontSize: 12,
              fontWeight: 'bold',
              lineHeight: 16,
              align: 'center',
            },
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
          },
          scale: true,
          scaleSize: 5,
        },
        labelLine: {
          show: true,
          length: 12,
          length2: 8,
          smooth: true,
          lineStyle: {
            color: '#9AA8B7',
            width: 1,
          },
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff',
        },
        data: props.data.pieData || [],
      },
    ],
  };

  chartInstance.setOption(option);

  chartInstance.on('click', (params) => {
    // 从饼图数据中找到对应的type
    const pieItem = props.data.pieData.find((item) => item.name === params.name);
    if (pieItem) {
      emit('pieClick', pieItem.type);
    }
  });
};

// 初始化柱状图 - 适用范围分布
const initBarChart = () => {
  if (!barChartRef.value) return;

  if (barChartInstance.value) {
    barChartInstance.value.dispose();
  }

  const chartInstance = echarts.init(barChartRef.value);
  barChartInstance.value = chartInstance;

  const barData = props.data.barData || [];
  const xAxisData = barData.map((item) => item.scopeName || item.scope);
  const countData = barData.map((item) => item.count);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '适用范围分布',
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
      formatter: '{b}: {c}',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: '#E8F4FD',
        },
      },
      axisLabel: {
        color: '#6E7E91',
        fontSize: 12,
        interval: 0,
        rotate: xAxisData.length > 5 ? 30 : 0,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: '#6E7E91',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: '#F0F4F8',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: '配置数',
        type: 'bar',
        data: countData,
        barWidth: '50%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4A90E2' },
            { offset: 1, color: '#50E3C2' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#357ABD' },
              { offset: 1, color: '#3DCCB0' },
            ]),
          },
        },
        label: {
          show: true,
          position: 'top',
          color: '#6E7E91',
          fontSize: 12,
          fontWeight: 'bold',
        },
      },
    ],
  };

  chartInstance.setOption(option);

  // 点击事件 - 传递 scope 值用于钻取筛选
  chartInstance.on('click', (params) => {
    const item = barData[params.dataIndex];
    if (item) {
      emit('barClick', item.scope);
    }
  });
};

const initCharts = () => {
  initPieChart();
  initBarChart();
};

const handleResize = () => {
  if (pieChartInstance.value) {
    pieChartInstance.value.resize();
  }
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
  if (pieChartInstance.value) {
    pieChartInstance.value.dispose();
  }
  if (barChartInstance.value) {
    barChartInstance.value.dispose();
  }
});
</script>

<template>
  <div class="activity-chart-box">
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
      <!-- 饼图区域 -->
      <div class="activity-type-chart" ref="pieChartRef"></div>
      <!-- 柱状图区域 -->
      <div class="activity-type-chart" ref="barChartRef"></div>
    </div>
  </div>
</template>

<style scoped>
.activity-chart-box {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: auto;
  padding-bottom: 0.5rem;
  min-height: 280px;
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
  cursor: pointer;
  background-color: var(--el-bg-color, #fff);
  border-left: 4px solid;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  transition: all 0.3s ease;
  margin-bottom: 12px;
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
  color: #4A90E2;
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

.activity-type-chart {
  flex: 1;
  min-width: 0;
  height: 280px;
  margin-left: 0 !important;
}
</style>
