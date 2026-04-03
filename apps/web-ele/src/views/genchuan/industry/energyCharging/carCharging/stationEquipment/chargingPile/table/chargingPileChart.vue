<!-- charging-pile/table/chargingPileChart.vue -->
<template>
  <div class="charging-pile-visualization">
    <!-- 左侧卡片区 2x2 网格 -->
    <div class="cards-section">
      <div
        v-for="card in cards"
        :key="card.key"
        class="stat-card"
        :style="{ borderLeftColor: card.color }"
        @click="handleCardClick(card.key)"
      >
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <div class="card-indicator" :style="{ backgroundColor: card.color }"></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: card.color }">
            {{ state.cardInfo[card.key] ?? 0 }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧图表区 -->
    <div class="charts-section">
      <div class="chart-item">
        <div ref="lineChartRef" class="chart-container"></div>
      </div>
      <div class="chart-item">
        <div ref="barChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted, ref, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getChartData, getStatusCount } from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingPile/index.js';

const emit = defineEmits(['drill-down']);

const state = reactive({
  cardInfo: {
    totalCount: 0,
    enableCount: 0,
    faultCount: 0,
    disabledCount: 0,
  },
  runTimeTrend: [],
  typeBarList: [],
});

const cards = ref([
  { title: '总充电桩数', key: 'totalCount', color: '#4A90E2' },
  { title: '运行中数量', key: 'enableCount', color: '#67C23A' },
  { title: '故障数量', key: 'faultCount', color: '#F56C6C' },
  { title: '停用数量', key: 'disabledCount', color: '#E6A23C' },
]);

const lineChartRef = ref(null);
const barChartRef = ref(null);
let lineChartInstance = null;
let barChartInstance = null;

// 获取数据并更新视图
const fetchOverview = async () => {
  try {
    const [chartData, statusCounts] = await Promise.all([getChartData(), getStatusCount()]);
    const { totalCount = 0, faultCount = 0 } = chartData.cardInfo || {};
    // 从状态统计中获取已启用和已停用数量
    const statusMap = new Map((statusCounts || []).map(item => [item.pileStatus, item.count]));
    const enableCount = statusMap.get('已启用') || 0;
    const disabledCount = statusMap.get('已停用') || 0;
    state.cardInfo = {
      totalCount,
      enableCount,
      faultCount,
      disabledCount,
    };

    state.runTimeTrend = (chartData.runTimeTrendList || []).map(item => ({
      time: item.time,
      runTime: item.runTime,
    }));

    state.typeBarList = (chartData.typeBarList || []).map(item => ({
      typeName: item.typeName,
      count: item.count,
    }));

    updateLineChart();
    updateBarChart();
  } catch (error) {
    console.error('获取充电桩图表数据失败', error);
    state.cardInfo = { totalCount: 0, enableCount: 0, faultCount: 0, disabledCount: 0 };
    state.runTimeTrend = [];
    state.typeBarList = [];
    updateLineChart();
    updateBarChart();
  }
};

const getLineOption = () => {
  const xAxisData = state.runTimeTrend.map(item => item.time);
  const seriesData = state.runTimeTrend.map(item => item.runTime);
  return {
    backgroundColor: 'transparent',
    title: {
      text: '充电桩运行时长趋势',
      left: 'center',
      top: 5,
      textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 500 },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
      formatter: (params) => {
        const point = params[0];
        return `${point.axisValue}<br/>运行时长: ${point.value} 小时`;
      },
    },
    grid: { left: '8%', right: '5%', top: '18%', bottom: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: { color: '#9AA8B7', fontSize: 11, rotate: xAxisData.length > 7 ? 25 : 0 },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
      axisTick: { lineStyle: { color: '#E8F4FD' } },
    },
    yAxis: {
      type: 'value',
      name: '运行时长 (小时)',
      nameTextStyle: { color: '#9AA8B7', fontSize: 11 },
      axisLabel: { color: '#9AA8B7', fontSize: 11 },
      splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
    },
    series: [{
      name: '运行时长',
      type: 'line',
      data: seriesData,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 3, color: '#4A90E2' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
          { offset: 1, color: 'rgba(74, 144, 226, 0.05)' },
        ]),
      },
      itemStyle: { color: '#4A90E2' },
      emphasis: { focus: 'series' },
    }],
  };
};

const getBarOption = () => {
  const xAxisData = state.typeBarList.map(item => item.typeName);
  const seriesData = state.typeBarList.map(item => item.count);
  return {
    backgroundColor: 'transparent',
    title: {
      text: '各类型充电桩数量统计',
      left: 'center',
      top: 5,
      textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 500 },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
      formatter: (params) => {
        const point = params[0];
        return `${point.name}<br/>数量: ${point.value} 台`;
      },
    },
    grid: { left: '8%', right: '5%', top: '18%', bottom: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 11,
        rotate: xAxisData.length > 6 ? 25 : 0,
        interval: 0,
      },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
      axisTick: { lineStyle: { color: '#E8F4FD' } },
    },
    yAxis: {
      type: 'value',
      name: '充电桩数量 (台)',
      nameTextStyle: { color: '#9AA8B7', fontSize: 11 },
      axisLabel: { color: '#9AA8B7', fontSize: 11 },
      splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
    },
    series: [{
      name: '充电桩数量',
      type: 'bar',
      data: seriesData,
      itemStyle: { borderRadius: [4, 4, 0, 0], color: '#50E3C2' },
      label: { show: true, position: 'top', color: '#6E7E91', fontSize: 12, formatter: '{c}' },
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(80, 227, 194, 0.3)' } },
    }],
  };
};

const updateLineChart = () => {
  if (!lineChartRef.value) return;
  if (!lineChartInstance) {
    lineChartInstance = echarts.init(lineChartRef.value);
    lineChartInstance.off('click');
    lineChartInstance.on('click', (params) => {
      if (params.componentType === 'series' && params.dataIndex !== undefined) {
        const point = state.runTimeTrend[params.dataIndex];
        if (point) {
          emit('drill-down', {
            type: 'trend',
            data: { time: point.time, runTime: point.runTime },
          });
        }
      }
    });
  }
  lineChartInstance.setOption(getLineOption(), true);
  lineChartInstance.resize();
};

const updateBarChart = () => {
  if (!barChartRef.value) return;
  if (!barChartInstance) {
    barChartInstance = echarts.init(barChartRef.value);
    barChartInstance.off('click');
    barChartInstance.on('click', (params) => {
      if (params.componentType === 'series' && params.dataIndex !== undefined) {
        const typeItem = state.typeBarList[params.dataIndex];
        if (typeItem) {
          emit('drill-down', {
            type: 'type',
            data: { typeName: typeItem.typeName },
          });
        }
      }
    });
  }
  barChartInstance.setOption(getBarOption(), true);
  barChartInstance.resize();
};

const handleCardClick = (key) => {
  let statusType = '';
  switch (key) {
    case 'totalCount': statusType = 'total'; break;
    case 'enableCount': statusType = 'enable'; break;
    case 'faultCount': statusType = 'fault'; break;
    case 'disabledCount': statusType = 'disabled'; break;
    default: return;
  }
  emit('drill-down', {
    type: 'status',
    data: { statusType },
  });
};

const handleResize = () => {
  lineChartInstance?.resize();
  barChartInstance?.resize();
};

onMounted(() => {
  nextTick(() => {
    fetchOverview();
    window.addEventListener('resize', handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (lineChartInstance) {
    lineChartInstance.dispose();
    lineChartInstance = null;
  }
  if (barChartInstance) {
    barChartInstance.dispose();
    barChartInstance = null;
  }
});

defineExpose({ fetchOverview });
</script>

<style scoped lang="scss">
/* 样式保持不变 */
.charging-pile-visualization {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  width: 100%;
  height: auto;
  min-height: 340px;
  overflow: hidden;
}
.cards-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  flex-shrink: 0;
  width: 260px;
  height: 340px;
}
.stat-card {
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: #fff;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.card-title {
  font-size: 13px;
  color: #6e7e91;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
}
.card-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}
.charts-section {
  flex: 1;
  display: flex;
  gap: 20px;
  min-width: 0;
  height: 340px;
}
.chart-item {
  flex: 1;
  min-width: 0;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
