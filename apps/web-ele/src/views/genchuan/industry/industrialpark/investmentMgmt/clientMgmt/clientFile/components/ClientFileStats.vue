<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';

import { getClientFileChart } from '#/api/genchuan/industry/industrialpark/investmentMgmt/clientMgmt/clientFile';

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

const statsData = ref({
  cards: [],
  pieData: [],
  barData: [],
});

/** 图表静态数据（参照接口文档格式） */
const mockChartData = {
  cards: [
    { title: '客户总数', value: 89, color: '#4A90E2', type: 'totalClient' },
    { title: '潜在数', value: 32, color: '#50E3C2', type: 'potentialCount' },
    { title: '意向数', value: 28, color: '#FF9F40', type: 'intentCount' },
    { title: '签约数', value: 29, color: '#A17FE0', type: 'signCount' },
  ],
  // 饼图数据：需求类型占比
  pieData: [
    { name: '场地', value: 65, type: 0 },
    { name: '政策', value: 15, type: 1 },
    { name: '服务', value: 9, type: 2 },
  ],
  // 柱状图数据：客户规模占比
  barData: [
    { name: '微型企业', value: 25 },
    { name: '小型企业', value: 35 },
    { name: '中型企业', value: 20 },
    { name: '大型企业', value: 9 },
  ],
};

const fetchStatsData = async () => {
  try {
    const response = await getClientFileChart();
    const data = response?.data || response;

    if (data) {
      statsData.value.cards = [
        { title: '客户总数', value: data.totalClient || 0, color: '#4A90E2', type: 'totalClient' },
        { title: '潜在数', value: data.potentialCount || 0, color: '#50E3C2', type: 'potentialCount' },
        { title: '意向数', value: data.intentCount || 0, color: '#FF9F40', type: 'intentCount' },
        { title: '签约数', value: data.signCount || 0, color: '#A17FE0', type: 'signCount' },
      ];

      // 使用API返回的图表数据或静态数据
      statsData.value.pieData = data.demandTypeList || mockChartData.pieData;
      statsData.value.barData = data.scaleTypeList || mockChartData.barData;
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

/** 初始化饼图 - 客户需求类型占比（规则配置样式：外部标签+引导线+底部图例） */
const initPieChart = () => {
  if (!pieChartRef.value) return;

  if (pieChartInstance.value) {
    pieChartInstance.value.dispose();
  }

  const chartInstance = echarts.init(pieChartRef.value);
  pieChartInstance.value = chartInstance;

  const pieData = statsData.value.pieData || [];
  const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40'];

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '需求类型占比',
      left: 'center',
      top: 10,
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
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
        name: '需求类型',
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
        data: pieData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: freshColors[index],
          },
        })),
      },
    ],
  };

  chartInstance.setOption(option);

  chartInstance.on('click', (params) => {
    emit('pieClick', pieData[params.dataIndex]?.type, params.name);
  });
};

/** 初始化柱状图 - 客户规模占比（参照InfoPublishStats样式） */
const initBarChart = () => {
  if (!barChartRef.value) return;

  if (barChartInstance.value) {
    barChartInstance.value.dispose();
  }

  const chartInstance = echarts.init(barChartRef.value);
  barChartInstance.value = chartInstance;

  const barData = statsData.value.barData || [];
  const xAxisData = barData.map((item) => item.name);
  const countData = barData.map((item) => item.value);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '客户规模占比',
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
        fontSize: 11,
        interval: 0,
        rotate: 20,
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
        name: '客户数量',
        type: 'bar',
        data: countData,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4A90E2' },
            { offset: 1, color: '#50E3C2' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '45%',
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
    emit('barClick', barData[params.dataIndex]?.name);
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
  if (pieChartInstance.value) {
    pieChartInstance.value.dispose();
  }
  if (barChartInstance.value) {
    barChartInstance.value.dispose();
  }
});

const handleCardClick = (card) => {
  emit('cardClick', card.type);
};
</script>

<template>
  <div class="client-file-stats">
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
      <!-- 饼图：需求类型占比 -->
      <div class="pie-chart" ref="pieChartRef"></div>
      <!-- 柱状图：客户规模占比 -->
      <div class="scale-chart" ref="barChartRef"></div>
    </div>
  </div>
</template>

<style scoped>
.client-file-stats {
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

/* 饼图 */
.pie-chart {
  flex: 0 0 35%;
  min-width: 0;
  height: 280px;
}

/* 柱状图 */
.scale-chart {
  flex: 1;
  min-width: 0;
  height: 280px;
  margin-left: 0 !important;
}
</style>
