<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({
      cards: [],
      pieData: [],
      lineData: [],
    }),
  },
});

const emit = defineEmits(['cardClick', 'pieClick', 'lineClick']);

const pieChartRef = ref(null);
const lineChartRef = ref(null);
const pieChartInstance = ref(null);
const lineChartInstance = ref(null);

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
      text: '退款状态占比',
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
      formatter: '{b}: {c} ({d}%)',
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
        name: '退款状态',
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
            return `{name|${name}}\n{percent|${params.percent}%}`;
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

  // 点击事件
  chartInstance.on('click', (params) => {
    emit('pieClick', params.name);
  });
};

const initLineChart = () => {
  if (!lineChartRef.value) return;

  if (lineChartInstance.value) {
    lineChartInstance.value.dispose();
  }

  const chartInstance = echarts.init(lineChartRef.value);
  lineChartInstance.value = chartInstance;

  const lineData = props.data.lineData || [];
  const xAxisData = lineData.map((item) => item.date);
  const applyData = lineData.map((item) => item.applyCount);
  const completeData = lineData.map((item) => item.completeCount);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '每日退款申请及完成数量趋势',
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
    },
    legend: {
      data: ['退款申请数', '退款完成数'],
      bottom: 0,
      textStyle: {
        color: '#6E7E91',
        fontSize: 11,
      },
      itemWidth: 12,
      itemHeight: 12,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '50px',
      containLabel: true,
      backgroundColor: 'transparent',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 11,
        rotate: xAxisData.length > 8 ? 30 : 0,
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
        name: '退款申请数',
        type: 'line',
        data: applyData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#4A90E2',
        },
        itemStyle: {
          color: '#4A90E2',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
            { offset: 1, color: 'rgba(74, 144, 226, 0.05)' },
          ]),
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(74, 144, 226, 0.3)',
          },
        },
      },
      {
        name: '退款完成数',
        type: 'line',
        data: completeData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#50E3C2',
        },
        itemStyle: {
          color: '#50E3C2',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(80, 227, 194, 0.3)' },
            { offset: 1, color: 'rgba(80, 227, 194, 0.05)' },
          ]),
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(80, 227, 194, 0.3)',
          },
        },
      },
    ],
  };

  chartInstance.setOption(option);

  // 点击事件
  chartInstance.on('click', (params) => {
    emit('lineClick', xAxisData[params.dataIndex]);
  });
};

const initCharts = () => {
  nextTick(() => {
    initPieChart();
    initLineChart();
  });
};

const handleResize = () => {
  if (pieChartInstance.value) {
    pieChartInstance.value.resize();
  }
  if (lineChartInstance.value) {
    lineChartInstance.value.resize();
  }
};

const handleCardClick = (card) => {
  emit('cardClick', card.type);
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
  if (lineChartInstance.value) {
    lineChartInstance.value.dispose();
  }
});
</script>

<template>
  <div class="order-refund-stats">
    <!-- 卡片区域 -->
    <div class="stats-cards">
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
          <div class="card-value" :style="{ color: card.color || '#4A90E2' }">
            {{ card.value }}
          </div>
          <div class="card-desc" v-if="card.desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="stats-charts">
      <!-- 饼图区域 -->
      <div class="chart-item pie-chart" ref="pieChartRef"></div>
      <!-- 折线图区域 -->
      <div class="chart-item line-chart" ref="lineChartRef"></div>
    </div>
  </div>
</template>

<style scoped>
.order-refund-stats {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: auto;
  min-height: 300px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
}

/* 卡片区域样式 */
.stats-cards {
  display: grid;
  flex-shrink: 0;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 260px;
  height: 300px;
  padding-bottom: 8px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  border-left: 4px solid #4a90e2;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  color: #6e7e91;
  white-space: nowrap;
}

.card-indicator {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}

.card-value {
  margin-bottom: 4px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
}

.card-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  line-height: 1.3;
  color: #9aa8b7;
  white-space: nowrap;
}

/* 图表区域样式 */
.stats-charts {
  display: flex;
  flex: 1;
  min-width: 0;
  height: 300px;
}

.chart-item {
  height: 100%;
}

.pie-chart {
  flex: 0 0 40%;
  min-width: 0;
}

.line-chart {
  flex: 1;
  min-width: 0;
}
</style>
