<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({
      cards: [],
      charts: [],
    }),
  },
});

const chartRefs = ref({});
const chartInstances = ref({});

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
      left: 'center', // 水平居中
      textStyle: {
        color: '#6E7E91',
        fontSize: 12,
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

    <!-- 图表区域：给chart-card添加动态类名区分图表类型 -->
    <div class="charts-container">
      <div
        v-for="(chart, index) in data.charts"
        :key="`chart-${index}`"
        class="chart-card"
        :class="{
          'chart-card-non-ring': chart.type !== 'pie', // 非圆环图（pie）添加类名
          'chart-card-ring': chart.type === 'pie', // 圆环图添加类名
        }"
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
/* 媒体查询：极小屏（< 768px）适配 */
@media (max-width: 767px) {
  .stats-visualization {
    flex-flow: column wrap;
    gap: 12px; /* 原20px → 12px */
    max-height: none; /* 小屏取消最大高度限制 */
    padding: 1vw;
  }

  .cards-container {
    flex: 0 0 100%;
    min-width: 100%;
    max-width: 100%;
  }

  .charts-container {
    flex: 0 0 100%;
    grid-template-columns: 1fr;
    min-width: 100%;
    max-height: none;
  }

  /* 小屏下所有图表宽度一致 */
  .chart-card-non-ring,
  .chart-card-ring {
    min-width: 100%;
  }

  .chart-container {
    height: 280px; /* 小屏适当加高，保证清晰 */
  }
}

/* 大屏适配（> 1200px） */
@media (min-width: 1200px) {
  .stats-visualization {
    gap: 20px;
    max-height: 580px;
    padding: 12px 20px; /* 原20px → 12px（垂直），降低高度 */
  }

  .cards-container {
    flex: 0 0 320px;
    min-width: 320px;
    max-width: 320px;
  }

  /* 大屏下非圆环图宽度更大 */
  .chart-card-non-ring {
    min-width: 420px;
  }

  .chart-card-ring {
    min-width: 320px;
  }
}

.stats-visualization {
  display: flex;
  flex-flow: row nowrap;
  gap: 2vw;
  align-items: stretch;
  width: 100%;
  min-width: 0;

  /* 限制最大高度，避免过高 */
  max-height: 600px;
  padding: 1vw 2vw; /* 减少垂直padding（上下1vw，左右保持2vw） */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

/* 卡片容器：缩小内部垂直间距，降低整体高度 */
.cards-container {
  display: flex;
  flex: 0 0 clamp(280px, 25vw, 320px);
  flex-direction: column;
  gap: 12px; /* 原20px → 12px，缩小卡片间垂直间距 */
  min-width: 280px;
  max-width: 320px;
}

/* 卡片样式：减少垂直内边距，缩小单张卡片高度 */
.stat-card {
  position: relative;
  min-width: 0;
  padding: 12px 20px; /* 原20px → 12px，减少垂直padding */
  border-left: 4px solid #4a90e2;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(74 144 226 / 10%);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 16px 0 rgb(74 144 226 / 15%);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px; /* 原12px → 8px，缩小标题与内容间距 */
}

.card-title {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 500;
  color: #6e7e91;
  white-space: nowrap;
}

.card-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 4px; /* 原8px → 4px，缩小数值与描述间距 */
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  color: #4a90e2;
}

.card-desc {
  font-size: 12px;
  color: #9aa8b7;
}

/* 图表容器：调整grid布局，区分不同类型图表宽度；缩小垂直间距 */
.charts-container {
  display: grid;
  flex: 1 0 auto;

  /* 基础列宽：适配圆环图，非圆环图通过类名调整 */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-flow: dense; /* 优化网格布局，填补空白 */
  gap: 12px; /* 原20px → 12px，缩小图表卡片间垂直间距 */
  min-width: 300px;

  /* 限制图表区域最大高度，降低整体高度 */
  max-height: 560px;
  overflow-y: auto; /* 极端情况出现滚动，保证展示清晰 */
}

/* 圆环图表（pie）：保持默认宽度 */
.chart-card-ring {
  grid-column: span 1;
}

/* 图表卡片样式：减少垂直内边距，缩小卡片高度 */
.chart-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: 12px 20px; /* 原20px → 12px，减少垂直padding */
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgb(74 144 226 / 10%);
}

/* 非圆环图（line/bar）：宽度稍大 */
.chart-card-non-ring {
  grid-column: span 2; /* 占1列（基础列宽更大） */
  min-width: 380px; /* 比圆环图最小宽度大 */
}

/* 圆环图（pie）：宽度统一 */
.chart-card-ring {
  grid-column: span 1;
  min-width: 320px; /* 基础宽度 */
}

/* 图表容器：固定高度，缩小整体高度，保证展示清晰 */
.chart-container {
  width: 100%;
  height: 260px; /* 固定高度（原100%无具体值，现设260px缩小高度） */
}

/* 核心布局：缩小整体垂直内边距、间距，降低整体高度 */
</style>
