<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

import { getInfoPublishChart } from '#/api/genchuan/industry/industrialpark/investmentMgmt/resourceMgmt/infoPublish';

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({
      cards: [],
      barData: [],
      lineData: [],
    }),
  },
});

const emit = defineEmits(['cardClick', 'barClick', 'lineClick']);

const barChartRef = ref(null);
const lineChartRef = ref(null);
const barChartInstance = ref(null);
const lineChartInstance = ref(null);

const statsData = ref({
  cards: [],
  barData: [],
  lineData: [],
});

/** 图表静态数据（参照接口文档格式） */
const mockChartData = {
  cards: [
    { title: '发布总数', value: 32, color: '#4A90E2', type: 'totalCount' },
    { title: '咨询数', value: 156, color: '#50E3C2', type: 'consultCount' },
    { title: '响应数', value: 148, color: '#FF9F40', type: 'responseCount' },
    { title: '下架数', value: 8, color: '#A17FE0', type: 'offlineCount' },
  ],
  // 柱状图数据：各类型信息咨询数
  barData: [
    { typeName: '场地', type: 0, count: 68 },
    { typeName: '政策', type: 1, count: 52 },
    { typeName: '服务', type: 2, count: 36 },
  ],
  // 折线图数据：每日咨询数（近7天）
  lineData: [
    { date: '05-09', consultCount: 18 },
    { date: '05-10', consultCount: 24 },
    { date: '05-11', consultCount: 31 },
    { date: '05-12', consultCount: 22 },
    { date: '05-13', consultCount: 28 },
    { date: '05-14', consultCount: 19 },
    { date: '05-15', consultCount: 14 },
  ],
};

const fetchStatsData = async () => {
  try {
    const response = await getInfoPublishChart();
    const data = response?.data || response;

    if (data) {
      statsData.value.cards = [
        { title: '发布总数', value: data.totalCount || 0, color: '#4A90E2', type: 'totalCount' },
        { title: '咨询数', value: data.consultCount || 0, color: '#50E3C2', type: 'consultCount' },
        { title: '响应数', value: data.responseCount || 0, color: '#FF9F40', type: 'responseCount' },
        { title: '下架数', value: data.offlineCount || 0, color: '#A17FE0', type: 'offlineCount' },
      ];

      // 使用API返回的图表数据或静态数据
      statsData.value.barData = data.barData || mockChartData.barData;
      statsData.value.lineData = data.lineData || mockChartData.lineData;
    } else {
      useMockData();
    }
  } catch (error) {
    console.error('获取统计数据失败:', error);
    useMockData();
  }
};

const useMockData = () => {
  statsData.value = mockChartData;
};

/** 初始化柱状图 - 各类型咨询数（参照couponMgmt样式） */
const initBarChart = () => {
  if (!barChartRef.value) return;

  if (barChartInstance.value) {
    barChartInstance.value.dispose();
  }

  const chartInstance = echarts.init(barChartRef.value);
  barChartInstance.value = chartInstance;

  const barData = statsData.value.barData || [];
  const xAxisData = barData.map((item) => item.typeName);
  const countData = barData.map((item) => item.count);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '各类型咨询数',
      left: 'center',
      top: 10,
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
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
        name: '咨询数',
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

  chartInstance.on('click', (params) => {
    emit('barClick', barData[params.dataIndex]?.type);
  });
};

/** 初始化折线图 - 每日咨询数（参照couponMgmt样式） */
const initLineChart = () => {
  if (!lineChartRef.value) return;

  if (lineChartInstance.value) {
    lineChartInstance.value.dispose();
  }

  const chartInstance = echarts.init(lineChartRef.value);
  lineChartInstance.value = chartInstance;

  const lineData = statsData.value.lineData || [];
  const xAxisData = lineData.map((item) => item.date);
  const consultData = lineData.map((item) => item.consultCount);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '每日咨询趋势',
      left: 'center',
      top: 10,
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
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
      formatter: '{b}: 咨询{c}次',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '20%',
      containLabel: true,
      backgroundColor: 'transparent',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLabel: {
        color: '#6E7E91',
        fontSize: 11,
        rotate: 30,
        interval: 'auto',
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
        name: '咨询数',
        type: 'line',
        data: consultData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#FF9F40',
          width: 3,
        },
        itemStyle: {
          color: '#FF9F40',
          borderWidth: 2,
          borderColor: '#fff',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 159, 64, 0.3)' },
            { offset: 1, color: 'rgba(255, 159, 64, 0.05)' },
          ]),
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(255, 159, 64, 0.5)',
          },
        },
      },
    ],
  };

  chartInstance.setOption(option);

  chartInstance.on('click', (params) => {
    emit('lineClick', lineData[params.dataIndex]?.date);
  });
};

const initCharts = () => {
  initBarChart();
  initLineChart();
};

const handleResize = () => {
  if (barChartInstance.value) {
    barChartInstance.value.resize();
  }
  if (lineChartInstance.value) {
    lineChartInstance.value.resize();
  }
};

watch(
  () => statsData.value,
  () => {
    initCharts();
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  fetchStatsData().then(() => {
    initCharts();
  });
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (barChartInstance.value) {
    barChartInstance.value.dispose();
  }
  if (lineChartInstance.value) {
    lineChartInstance.value.dispose();
  }
});

const handleCardClick = (card) => {
  emit('cardClick', card.type);
};
</script>

<template>
  <div class="info-publish-stats">
    <!-- 左侧：卡片区域 -->
    <div class="chart-box-left">
      <div
        v-for="(card, index) in statsData.cards"
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
        </div>
      </div>
    </div>

    <!-- 右侧：图表区域 -->
    <div class="charts-wrapper">
      <!-- 柱状图：各类型咨询数 -->
      <div class="type-chart" ref="barChartRef"></div>
      <!-- 折线图：每日咨询趋势 -->
      <div class="trend-chart" ref="lineChartRef"></div>
    </div>
  </div>
</template>

<style scoped>
.info-publish-stats {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: auto;
  min-height: 280px;
  padding-bottom: 0.5rem;
  overflow: hidden;
}

/* 左侧卡片区 - 参照siteMgmt紧凑布局（2行×2列） */
.chart-box-left {
  display: flex;
  flex-shrink: 0;
  flex-flow: row wrap;
  gap: 4px;
  align-content: stretch;
  width: 320px;
  height: 280px;
  overflow: hidden;
}

.stat-card {
  box-sizing: border-box;
  display: flex;
  flex: 1 1 calc(50% - 2px);
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  padding: 4px 8px;
  cursor: pointer;
  background-color: var(--el-bg-color, #fff);
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
  margin-bottom: 4px;
}

.card-title {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: #6e7e91;
}

.card-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-value {
  font-size: 20px;
  font-weight: 600;
  color: #4a90e2;
}

/* 右侧图表区 */
.charts-wrapper {
  position: relative;
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  height: 280px;
}

/* 柱状图 */
.type-chart {
  flex: 0 0 35%;
  min-width: 0;
  height: 280px;
}

/* 折线图 */
.trend-chart {
  flex: 1;
  min-width: 0;
  height: 280px;
  margin-left: 0 !important;
}
</style>
