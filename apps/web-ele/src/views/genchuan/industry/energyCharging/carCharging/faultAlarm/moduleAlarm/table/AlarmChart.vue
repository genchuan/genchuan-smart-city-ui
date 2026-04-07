<!-- module-alarm/chart.vue -->
<template>
  <div class="charging-pile-visualization">
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
            {{ cardData[card.key] ?? 0 }}
          </div>
        </div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-item">
        <div ref="barChartRef" class="chart-container"></div>
      </div>
      <div class="chart-item">
        <div ref="lineChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted, ref, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getChartData } from '#/api/genchuan/industry/energyCharging/carCharging/faultAlarm/moduleAlarm/index.js';

const emit = defineEmits(['drill-down']);

const cardData = reactive({
  totalCount: 0,
  unrepairedCount: 0,
  repairedCount: 0,
});

const cards = ref([
  { title: '总告警数', key: 'totalCount', color: '#4A90E2' },
  { title: '未修复告警数', key: 'unrepairedCount', color: '#F56C6C' },
  { title: '已修复告警数', key: 'repairedCount', color: '#67C23A' },
]);

const barData = ref([]);      // { name: 模块名, value: 数量 }
const lineData = ref([]);     // { date, repairTime }

const barChartRef = ref(null);
const lineChartRef = ref(null);
let barChartInstance = null;
let lineChartInstance = null;

const fetchChartData = async () => {
  try {
    const res = await getChartData({});
    const { totalCount, unrepairedCount, repairedCount, barData: bar, lineData: line } = res;
    cardData.totalCount = totalCount || 0;
    cardData.unrepairedCount = unrepairedCount || 0;
    cardData.repairedCount = repairedCount || 0;
    barData.value = bar || [];
    lineData.value = line || [];
    updateBarChart();
    updateLineChart();
  } catch (error) {
    console.error('获取图表数据失败', error);
  }
};

const getBarOption = () => {
  const xAxisData = barData.value.map(item => item.name);
  const seriesData = barData.value.map(item => item.value);
  return {
    backgroundColor: 'transparent',
    title: {
      text: '各模块告警数量统计',
      left: 'center',
      top: 5,
      textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '8%', right: '5%', top: '18%', bottom: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: { color: '#9AA8B7', fontSize: 11, rotate: xAxisData.length > 6 ? 25 : 0, interval: 0 },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
    },
    yAxis: {
      type: 'value',
      name: '告警数量 (条)',
      nameTextStyle: { color: '#9AA8B7', fontSize: 11 },
      axisLabel: { color: '#9AA8B7' },
      splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
    },
    series: [{
      name: '告警数量',
      type: 'bar',
      data: seriesData,
      itemStyle: { borderRadius: [4, 4, 0, 0], color: '#3cb9e6' },
      label: { show: true, position: 'top', color: '#4584cf' },
    }],
  };
};

const getLineOption = () => {
  const xAxisData = lineData.value.map(item => item.date);
  const seriesData = lineData.value.map(item => item.repairTime);
  return {
    backgroundColor: 'transparent',
    title: {
      text: '模块告警修复时长趋势',
      left: 'center',
      top: 5,
      textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis', formatter: params => `${params[0].axisValue}<br/>修复时长: ${params[0].value} 小时` },
    grid: { left: '8%', right: '5%', top: '18%', bottom: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: { color: '#9AA8B7', fontSize: 11, rotate: xAxisData.length > 7 ? 25 : 0 },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
    },
    yAxis: {
      type: 'value',
      name: '修复时长 (小时)',
      nameTextStyle: { color: '#9AA8B7', fontSize: 11 },
      axisLabel: { color: '#9AA8B7' },
      splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
    },
    series: [{
      name: '修复时长',
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
    }],
  };
};

const updateBarChart = () => {
  if (!barChartRef.value) return;
  if (!barChartInstance) {
    barChartInstance = echarts.init(barChartRef.value);
    barChartInstance.off('click');
    barChartInstance.on('click', (params) => {
      if (params.componentType === 'series' && params.dataIndex !== undefined) {
        const item = barData.value[params.dataIndex];
        if (item) {
          emit('drill-down', { type: 'bar', data: { moduleName: item.name } });
        }
      }
    });
  }
  barChartInstance.setOption(getBarOption(), true);
  barChartInstance.resize();
};

const updateLineChart = () => {
  if (!lineChartRef.value) return;
  if (!lineChartInstance) {
    lineChartInstance = echarts.init(lineChartRef.value);
    lineChartInstance.off('click');
    lineChartInstance.on('click', (params) => {
      if (params.componentType === 'series' && params.dataIndex !== undefined) {
        const point = lineData.value[params.dataIndex];
        if (point) {
          emit('drill-down', { type: 'line', data: { date: point.date } });
        }
      }
    });
  }
  lineChartInstance.setOption(getLineOption(), true);
  lineChartInstance.resize();
};

const handleCardClick = (key) => {
  let statusType = '';
  if (key === 'totalCount') statusType = 'total';
  else if (key === 'unrepairedCount') statusType = 'unrepaired';
  else if (key === 'repairedCount') statusType = 'repaired';
  else return;
  emit('drill-down', { type: 'card', data: { statusType } });
};

const handleResize = () => {
  barChartInstance?.resize();
  lineChartInstance?.resize();
};

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('resize', handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  barChartInstance?.dispose();
  lineChartInstance?.dispose();
});

defineExpose({ fetchChartData });
</script>

<style scoped lang="scss">
/* 完全复用充电桩图表的样式 */
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
}
.card-value {
  font-size: 24px;
  font-weight: 700;
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
