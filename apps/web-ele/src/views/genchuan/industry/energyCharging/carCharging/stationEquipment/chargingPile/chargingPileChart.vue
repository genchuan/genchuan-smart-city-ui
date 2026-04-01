<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { ElDialog, ElTable, ElTableColumn } from 'element-plus';
import { getChartData, getRunTimeTrend } from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingPile/index.js';

const props = defineProps({
  stationId: { type: Number, default: null },
});

const state = reactive({
  cardList: [
    { title: '总充电桩数', value: 0, color: '#4A90E2', key: 'total' },
    { title: '运行中数量', value: 0, color: '#50E3C2', key: 'running' },
    { title: '故障数量', value: 0, color: '#FF6B8B', key: 'fault' },
    { title: '停用数量', value: 0, color: '#FF9F40', key: 'disabled' },
  ],
  chartData: {
    runTimeTrend: [],
    typeCount: [],
    statusCount: { total: 0, running: 0, fault: 0, disabled: 0 },
  },
});

const lineChartRef = ref(null);
const barChartRef = ref(null);
let lineChartInstance = null;
let barChartInstance = null;

// 钻取明细弹窗
const detailDialogVisible = ref(false);
const detailData = ref([]);
const detailTitle = ref('');

async function loadChartData() {
  const res = await getChartData({ stationId: props.stationId, tenantId: 1 });
  state.chartData = res.data;
  state.cardList.forEach(card => {
    card.value = state.chartData.statusCount[card.key] || 0;
  });
  initCharts();
}

function initLineChart() {
  if (!lineChartRef.value) return;
  if (lineChartInstance) lineChartInstance.dispose();
  lineChartInstance = echarts.init(lineChartRef.value);
  const option = {
    title: { text: '充电桩运行时长趋势', left: 'center', top: 10, textStyle: { fontSize: 14, fontWeight: 500, color: '#6E7E91' } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: state.chartData.runTimeTrend.map(item => item.time) },
    yAxis: { type: 'value', name: '运行时长(分钟)' },
    series: [{
      name: '运行时长',
      type: 'line',
      data: state.chartData.runTimeTrend.map(item => item.runTime),
      smooth: true,
      lineStyle: { width: 3, color: '#4A90E2' },
      areaStyle: { color: 'rgba(74,144,226,0.1)' },
      symbol: 'circle',
      symbolSize: 6,
    }],
  };
  lineChartInstance.setOption(option);
  lineChartInstance.off('click');
  lineChartInstance.on('click', async (params) => {
    if (params.componentType === 'series') {
      const time = state.chartData.runTimeTrend[params.dataIndex].time;
      detailTitle.value = `${time} 运行时长明细`;
      const res = await getRunTimeTrend({ timeType: 'day', startTime: time, endTime: time, tenantId: 1 });
      detailData.value = res.data;
      detailDialogVisible.value = true;
    }
  });
}

function initBarChart() {
  if (!barChartRef.value) return;
  if (barChartInstance) barChartInstance.dispose();
  barChartInstance = echarts.init(barChartRef.value);
  const option = {
    title: { text: '各类型充电桩数量统计', left: 'center', top: 10, textStyle: { fontSize: 14, fontWeight: 500, color: '#6E7E91' } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: state.chartData.typeCount.map(item => item.type) },
    yAxis: { type: 'value', name: '数量' },
    series: [{
      type: 'bar',
      data: state.chartData.typeCount.map(item => item.count),
      itemStyle: { borderRadius: [4, 4, 0, 0], color: '#4A90E2' },
      label: { show: true, position: 'top' },
    }],
  };
  barChartInstance.setOption(option);
  barChartInstance.off('click');
  barChartInstance.on('click', async (params) => {
    if (params.componentType === 'series') {
      const type = state.chartData.typeCount[params.dataIndex].type;
      window.dispatchEvent(new CustomEvent('filterByType', { detail: { model: type } }));
    }
  });
}

function initCharts() {
  initLineChart();
  initBarChart();
}

function handleCardClick(key) {
  let params = {};
  if (key === 'total') {
    params = { pileStatus: undefined, faultFlag: undefined };
  } else if (key === 'running') {
    params = { pileStatus: '已启用', faultFlag: undefined };
  } else if (key === 'fault') {
    params = { pileStatus: undefined, faultFlag: 1 };
  } else if (key === 'disabled') {
    params = { pileStatus: '已停用', faultFlag: undefined };
  }
  window.dispatchEvent(new CustomEvent('filterByStatus', { detail: params }));
}

function handleResize() {
  lineChartInstance?.resize();
  barChartInstance?.resize();
}

function handleRefreshChart() {
  loadChartData();
}

onMounted(() => {
  nextTick(() => {
    loadChartData();
  });
  window.addEventListener('resize', handleResize);
  window.addEventListener('refreshChart', handleRefreshChart);
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('refreshChart', handleRefreshChart);
  lineChartInstance?.dispose();
  barChartInstance?.dispose();
});
</script>

<template>
  <div class="stats-four-visualization">
    <div class="cards-section">
      <div
        v-for="card in state.cardList"
        :key="card.title"
        class="stat-card"
        :style="{ borderLeftColor: card.color }"
        @click="handleCardClick(card.key)"
      >
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <div class="card-indicator" :style="{ backgroundColor: card.color }"></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: card.color }">{{ card.value }}</div>
        </div>
      </div>
    </div>

    <div class="right-section">
      <div class="charts-section">
        <div class="pie-chart-area">
          <div ref="lineChartRef" class="chart-container"></div>
        </div>
        <div class="pie-chart-area">
          <div ref="barChartRef" class="chart-container"></div>
        </div>
      </div>
    </div>

    <el-dialog v-model="detailDialogVisible" :title="detailTitle" width="800px">
      <el-table :data="detailData" border>
        <el-table-column prop="pileCode" label="设备编号" />
        <el-table-column prop="pileName" label="型号" />
        <el-table-column prop="runTime" label="运行时长(分钟)" />
      </el-table>
    </el-dialog>
  </div>
</template>

<style scoped>
.stats-four-visualization {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  width: 100%;
  min-height: 320px;
  overflow: hidden;
}
.cards-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  flex-shrink: 0;
  gap: 12px;
  width: 260px;
  height: 320px;
}
.stat-card {
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 4px solid;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: all 0.3s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}
.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.card-title {
  font-size: 13px;
  color: #6e7e91;
  font-weight: 600;
}
.card-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.card-value {
  font-size: 22px;
  font-weight: 700;
}
.right-section {
  flex: 1;
  min-width: 0;
  height: 320px;
}
.charts-section {
  display: flex;
  flex: 1;
  gap: 20px;
  height: 100%;
}
.pie-chart-area {
  flex: 1;
  height: 100%;
}
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
