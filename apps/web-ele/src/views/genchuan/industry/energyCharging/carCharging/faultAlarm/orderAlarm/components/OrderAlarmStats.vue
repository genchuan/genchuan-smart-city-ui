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
      text: '告警类型占比',
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
        name: '告警类型',
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
  const alarmData = lineData.map((item) => item.alarmCount);
  const handleData = lineData.map((item) => item.handleCount);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '订单告警数量及处理完成趋势',
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
      data: ['告警数', '处理数'],
      bottom: 0,
      textStyle: {
        color: '#6E7E91',
        fontSize: 11,
      },
      itemWidth: 12,
      itemHeight: 12,
    },
    grid: {
      left: '8%',
      right: '4%',
      bottom: '18%',
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
        rotate: 30,
        interval: 0,
        formatter(value) {
          // 只显示年月日，去掉时间部分
          return value.slice(0, 10);
        },
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
        name: '告警数',
        type: 'line',
        data: alarmData,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#4A90E2',
        },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#4A90E2',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(74, 144, 226, 0.3)',
          },
        },
      },
      {
        name: '处理数',
        type: 'line',
        data: handleData,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#50E3C2',
        },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#50E3C2',
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
    const date = xAxisData[params.dataIndex];
    emit('lineClick', date);
  });
};

const initCharts = () => {
  initPieChart();
  initLineChart();
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
  emit('cardClick', card.status);
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
  <div class="park-chart-box">
    <!-- 卡片区域 -->
    <div class="chart-box-left">
      <div
        v-for="(card, index) in data.cards"
        :key="`card-${index}`"
        class="stat-card"
        :style="{ borderLeftColor: card.color || '#13ce66' }"
        @click="handleCardClick(card)"
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
    <div class="charts-wrapper">
      <!-- 饼图区域 -->
      <div class="park-type-chart" ref="pieChartRef"></div>
      <!-- 折线图区域 -->
      <div class="simple-bar-chart" ref="lineChartRef"></div>
    </div>
  </div>
</template>

<style scoped>
.park-chart-box {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: auto;
  min-height: 300px;
  overflow: hidden;
}

.chart-box-left {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  width: 200px;
}

.stat-card {
  flex: 1;
  padding: 16px;
  cursor: pointer;
  background-color: #fff;
  border-left: 4px solid;
  border-radius: 4px;
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
  color: #303133;
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

.park-type-chart {
  flex: 0 0 35%;
  min-width: 0;
  height: 280px;
}

.simple-bar-chart {
  flex: 1;
  min-width: 0;
  height: 280px;
  margin-left: 0 !important;
}
</style>
