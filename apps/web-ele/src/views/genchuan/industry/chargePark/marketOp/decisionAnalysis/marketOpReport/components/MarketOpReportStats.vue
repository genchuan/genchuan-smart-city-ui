<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import * as echarts from 'echarts';
import { ElOption, ElSelect } from 'element-plus';

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({
      cards: [],
      pieData: [],
      barData: [],
      lineData: [],
    }),
  },
  // 饼图选项列表，用于下拉切换
  pieChartOptions: {
    type: Array,
    default: () => [],
    // 格式: [{ label: '规则类型占比', value: 'ruleType', data: [...] }, ...]
  },
  // 柱状图选项列表，用于下拉切换
  barChartOptions: {
    type: Array,
    default: () => [],
    // 格式: [{ label: '活动类型分布', value: 'activityType', data: [...] }, ...]
  },
  // 折线图选项列表，用于下拉切换
  lineChartOptions: {
    type: Array,
    default: () => [],
    // 格式: [{ label: '活动参与趋势', value: 'joinTrend', data: {...} }, ...]
  },
});

const emit = defineEmits([
  'cardClick',
  'pieClick',
  'barClick',
  'lineClick',
  'pieChartChange',
  'barChartChange',
  'lineChartChange',
]);

const pieChartRef = ref(null);
const barChartRef = ref(null);
const lineChartRef = ref(null);
const pieChartInstance = ref(null);
const barChartInstance = ref(null);
const lineChartInstance = ref(null);

const freshColors = [
  '#4A90E2',
  '#50E3C2',
  '#FF9F40',
  '#A17FE0',
  '#FF6B8B',
  '#FFD93D',
];

// 当前选中的图表索引
const currentPieIndex = ref(0);
const currentBarIndex = ref(0);
const currentLineIndex = ref(0);

// 计算当前选中的饼图数据
const currentPieData = computed(() => {
  if (props.pieChartOptions.length === 0) return null;
  const index = currentPieIndex.value;
  if (index < 0 || index >= props.pieChartOptions.length) {
    return props.pieChartOptions[0];
  }
  return props.pieChartOptions[index];
});

// 计算当前选中的柱状图数据
const currentBarData = computed(() => {
  if (props.barChartOptions.length === 0) return null;
  const index = currentBarIndex.value;
  if (index < 0 || index >= props.barChartOptions.length) {
    return props.barChartOptions[0];
  }
  return props.barChartOptions[index];
});

// 计算当前选中的折线图数据
const currentLineData = computed(() => {
  if (props.lineChartOptions.length === 0) return null;
  const index = currentLineIndex.value;
  if (index < 0 || index >= props.lineChartOptions.length) {
    return props.lineChartOptions[0];
  }
  return props.lineChartOptions[index];
});

// 饼图切换
const handlePieChange = (index) => {
  currentPieIndex.value = index;
  emit('pieChartChange', props.pieChartOptions[index]);
  initPieChart();
};

// 柱状图切换
const handleBarChange = (index) => {
  currentBarIndex.value = index;
  emit('barChartChange', props.barChartOptions[index]);
  initBarChart();
};

// 折线图切换
const handleLineChange = (index) => {
  currentLineIndex.value = index;
  emit('lineChartChange', props.lineChartOptions[index]);
  initLineChart();
};

// 初始化饼图
const initPieChart = () => {
  if (!pieChartRef.value) return;

  if (pieChartInstance.value) {
    pieChartInstance.value.dispose();
    pieChartInstance.value = null;
  }

  const chartData = currentPieData.value;
  if (!chartData || !chartData.data || chartData.data.length === 0) return;

  const chartInstance = echarts.init(pieChartRef.value);
  pieChartInstance.value = chartInstance;

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: chartData.label || '分布统计',
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
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '18%',
      containLabel: true,
    },
    legend: {
      orient: 'horizontal',
      bottom: '3%',
      type: 'scroll',
      left: 'center',
      textStyle: {
        color: '#6E7E91',
        fontSize: 10,
      },
      itemWidth: 10,
      itemHeight: 10,
      formatter(name) {
        return name.length > 4 ? `${name.slice(0, 4)}...` : name;
      },
    },
    series: [
      {
        name: chartData.label || '分布统计',
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
        data: chartData.data,
      },
    ],
  };

  chartInstance.setOption(option);

  // 点击事件 - 钻取
  chartInstance.on('click', (params) => {
    const dataItem = chartData.data[params.dataIndex];
    emit('pieClick', {
      type: chartData.value,
      name: dataItem?.name,
      value: dataItem?.type || dataItem?.name,
    });
  });
};

// 初始化柱状图
const initBarChart = () => {
  if (!barChartRef.value) return;

  if (barChartInstance.value) {
    barChartInstance.value.dispose();
    barChartInstance.value = null;
  }

  const chartData = currentBarData.value;
  if (!chartData || !chartData.data || chartData.data.length === 0) return;

  const chartInstance = echarts.init(barChartRef.value);
  barChartInstance.value = chartInstance;

  const barData = chartData.data;
  const xAxisData = barData.map((item) => item.name);
  const countData = barData.map((item) => item.value);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: chartData.label || '分布统计',
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
      bottom: '8%',
      top: '18%',
      containLabel: true,
      backgroundColor: 'transparent',
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: xAxisData,
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 10,
        rotate: 45,
        interval: 0,
        formatter: function(value) {
          if (value.length > 4) {
            return value.substring(0, 4) + '...';
          }
          return value;
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
        name: chartData.label || '数量',
        type: 'bar',
        data: countData,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4A90E2' },
            { offset: 1, color: '#6BB3FF' },
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

  // 点击事件 - 钻取
  chartInstance.on('click', (params) => {
    const dataItem = barData[params.dataIndex];
    emit('barClick', {
      type: chartData.value,
      name: dataItem?.name,
      value: dataItem?.type || dataItem?.name,
      // 如果有 categoryId（兑换类目场景），也一起传递
      ...(dataItem?.categoryId ? { categoryId: dataItem.categoryId } : {}),
    });
  });
};

// 初始化折线图
const initLineChart = () => {
  if (!lineChartRef.value) return;

  if (lineChartInstance.value) {
    lineChartInstance.value.dispose();
    lineChartInstance.value = null;
  }

  const chartData = currentLineData.value;
  if (
    !chartData ||
    !chartData.data ||
    !chartData.data.xAxis ||
    chartData.data.xAxis.length === 0
  )
    return;

  const chartInstance = echarts.init(lineChartRef.value);
  lineChartInstance.value = chartInstance;

  const xAxisData = chartData.data.xAxis;
  const seriesData = chartData.data.series;

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: chartData.label || '趋势统计',
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
      formatter: (params) => {
        const data = params[0];
        return `${data.name}<br/>${chartData.label}: ${data.value}`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '18%',
      containLabel: true,
      backgroundColor: 'transparent',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 10,
        rotate: 45,
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
        name: chartData.label || '数值',
        type: 'line',
        data: seriesData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#50E3C2',
          width: 3,
        },
        itemStyle: {
          color: '#50E3C2',
          borderWidth: 2,
          borderColor: '#fff',
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
            shadowColor: 'rgba(80, 227, 194, 0.5)',
          },
        },
        label: {
          show: false,
        },
      },
    ],
  };

  chartInstance.setOption(option);

  // 点击事件 - 钻取
  chartInstance.on('click', (params) => {
    emit('lineClick', {
      type: chartData.value,
      name: params.name,
      value: chartData.data.fullDates?.[params.dataIndex] || params.name,
    });
  });
};

const initCharts = () => {
  nextTick(() => {
    initPieChart();
    initBarChart();
    initLineChart();
  });
};

const handleResize = () => {
  pieChartInstance.value?.resize();
  barChartInstance.value?.resize();
  lineChartInstance.value?.resize();
};

const handleCardClick = (card) => {
  emit('cardClick', card.type);
};

// 监听数据变化
watch(
  () => props.pieChartOptions,
  () => {
    initPieChart();
  },
  { deep: true },
);

watch(
  () => props.barChartOptions,
  () => {
    initBarChart();
  },
  { deep: true },
);

watch(
  () => props.lineChartOptions,
  () => {
    initLineChart();
  },
  { deep: true },
);

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  pieChartInstance.value?.dispose();
  barChartInstance.value?.dispose();
  lineChartInstance.value?.dispose();
});
</script>

<template>
  <div class="rule-chart-box">
    <!-- 卡片区域 - 两列布局 -->
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
      <!-- 饼图区域 - 带切换下拉框 -->
      <div class="chart-area">
        <div v-if="pieChartOptions.length > 1" class="chart-select-wrapper">
          <ElSelect
            :model-value="currentPieIndex"
            size="small"
            class="chart-select"
            @change="handlePieChange"
          >
            <ElOption
              v-for="(option, idx) in pieChartOptions"
              :key="idx"
              :label="option.label"
              :value="idx"
            />
          </ElSelect>
        </div>
        <div ref="pieChartRef" class="chart-container"></div>
      </div>

      <!-- 柱状图区域 - 带切换下拉框 -->
      <div class="chart-area">
        <div v-if="barChartOptions.length > 1" class="chart-select-wrapper">
          <ElSelect
            :model-value="currentBarIndex"
            size="small"
            class="chart-select"
            @change="handleBarChange"
          >
            <ElOption
              v-for="(option, idx) in barChartOptions"
              :key="idx"
              :label="option.label"
              :value="idx"
            />
          </ElSelect>
        </div>
        <div ref="barChartRef" class="chart-container"></div>
      </div>

      <!-- 折线图区域 - 带切换下拉框 -->
      <div class="chart-area line-chart-area">
        <div v-if="lineChartOptions.length > 1" class="chart-select-wrapper">
          <ElSelect
            :model-value="currentLineIndex"
            size="small"
            class="chart-select"
            @change="handleLineChange"
          >
            <ElOption
              v-for="(option, idx) in lineChartOptions"
              :key="idx"
              :label="option.label"
              :value="idx"
            />
          </ElSelect>
        </div>
        <div ref="lineChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rule-chart-box {
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
  flex-flow: row wrap;
  gap: 4px;
  align-content: stretch;
  width: 480px;
  height: 280px;
  padding: 4px;
  overflow: hidden;
}

.stat-card {
  box-sizing: border-box;
  display: flex;
  flex: 1 1 calc(33.333% - 3px);
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

.card-desc {
  margin-top: 2px;
  font-size: 11px;
  color: #909399;
}

.charts-wrapper {
  position: relative;
  display: flex;
  flex: 1 1 0;
  align-items: center;
  min-width: 0;
  height: 280px;
  padding: 4px;
  box-sizing: border-box;
}

.chart-area {
  position: relative;
  flex: 0 0 28%;
  min-width: 0;
  height: 272px;
  box-sizing: border-box;
}

.line-chart-area {
  flex: 1;
  height: 272px;
}

.chart-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}

.chart-select {
  width: 100px;
}

.chart-select :deep(.el-input__wrapper) {
  background-color: rgb(255 255 255 / 95%);
  box-shadow: 0 1px 4px rgb(0 0 0 / 10%);
}

.chart-select :deep(.el-input__inner) {
  font-size: 12px;
}

.chart-container {
  width: 100%;
  height: 100%;
}
</style>
