<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getCycleReportChart } from '#/api/genchuan/industry/chargePark/inspectOp/inspectReport/cycleReport';
import StatsFourVisualization from '#/genchuan-components/stats/StatsFourVisualization.vue';

import { formatRate, getMockChartData } from './data';

const emit = defineEmits(['metricFilter', 'stationFilter', 'trendFilter']);

const state = reactive({
  cardList: [
    { title: '正常设备数', value: 0, desc: '设备状态', status: 'normalDeviceNum', color: '#2fbf71' },
    { title: '异常设备数', value: 0, desc: '设备异常', status: 'abnormalDeviceNum', color: '#e95f5f' },
    { title: '巡检任务数', value: 0, desc: '任务总量', status: 'inspectTaskNum', color: '#2f80ed' },
    { title: '任务完成率', value: '0%', desc: '任务闭环', status: 'taskCompleteRate', color: '#27ae60' },
    { title: '油车占位待处置数', value: 0, desc: '待处置占位', status: 'oilWaitHandleNum', color: '#f2994a' },
    { title: '处置完成率', value: '0%', desc: '占位处置', status: 'oilHandleCompleteRate', color: '#9b51e0' },
    { title: '巡检人员在岗数', value: 0, desc: '在岗人员', status: 'inspectUserOnlineNum', color: '#00a8cc' },
    { title: '资产正常数', value: 0, desc: '正常资产', status: 'assetNormalNum', color: '#219653' },
    { title: '库存预警数', value: 0, desc: '预警库存', status: 'stockWarnNum', color: '#eb5757' },
  ],
  mapData: [],
  barData: [],
  lineData: [],
});

const mapConfig = {
  markerIcons: {
    normal: '/static/imgs/dataHub/map/marker-blue.png',
    yellow: '/static/imgs/dataHub/map/marker-yellow.png',
    red: '/static/imgs/dataHub/map/marker-red.png',
  },
  statusIconMap: {
    green: 'normal',
    orange: 'yellow',
    red: 'red',
    blue: 'normal',
    gray: 'normal',
  },
  statusKeyMap: {
    正常设备: 'green',
    异常设备: 'red',
    人员在岗: 'orange',
  },
  infoWindowConfig: {
    title: 'stationName',
    fields: [
      { key: 'regionName', label: '所属区域' },
      { key: 'statusName', label: '当前状态', bold: true },
      { key: 'abnormalDeviceNum', label: '异常设备数' },
      { key: 'inspectUserOnlineNum', label: '在岗人数' },
    ],
  },
};

function getMarkerStatusName(item) {
  if (item.deviceStatus === '异常设备') return '异常设备';
  if (item.userOnlineStatus === '人员在岗') return '人员在岗';
  return '正常设备';
}

const mapViewData = computed(() =>
  state.mapData.map((item) => ({
    id: item.id,
    stationName: item.stationName,
    regionName: item.regionName,
    abnormalDeviceNum: item.abnormalDeviceNum,
    inspectUserOnlineNum: item.inspectUserOnlineNum,
    statusName: getMarkerStatusName(item),
    coordinate: `${item.longitude},${item.latitude}`,
  })),
);

const pieChartOptions = computed(() => [
  {
    label: '设备状态占比',
    value: 'device-status',
    data: [
      { name: '正常设备', value: Number(state.cardList[0].value || 0) },
      { name: '异常设备', value: Number(state.cardList[1].value || 0) },
    ],
  },
  {
    label: '任务处置占比',
    value: 'task-handle',
    data: [
      { name: '巡检任务数', value: Number(state.cardList[2].value || 0) },
      { name: '油车待处置', value: Number(state.cardList[4].value || 0) },
      { name: '库存预警', value: Number(state.cardList[8].value || 0) },
    ],
  },
]);

const barLineChartOptions = computed(() => [
  {
    label: '各场站异常/任务/占位',
    value: 'station-compare',
    type: 'bar',
    data: {
      xAxis: state.barData.map((item) => item.stationName),
      series: state.barData.map((item) => item.abnormalDeviceNum),
    },
  },
  {
    label: '设备更新趋势',
    value: 'device-trend',
    type: 'line',
    data: {
      xAxis: state.lineData.map((item) => item.date),
      series: state.lineData.map((item) => item.deviceUpdateNum),
    },
  },
]);

function normalizeChartData(data) {
  const chartData =
    data?.cardData || data?.mapData || data?.barData || data?.lineData ? data : getMockChartData();
  const cardData = chartData.cardData || {};

  state.cardList[0].value = cardData.normalDeviceNum ?? 0;
  state.cardList[1].value = cardData.abnormalDeviceNum ?? 0;
  state.cardList[2].value = cardData.inspectTaskNum ?? 0;
  state.cardList[3].value = formatRate(cardData.taskCompleteRate);
  state.cardList[4].value = cardData.oilWaitHandleNum ?? 0;
  state.cardList[5].value = formatRate(cardData.oilHandleCompleteRate);
  state.cardList[6].value = cardData.inspectUserOnlineNum ?? 0;
  state.cardList[7].value = cardData.assetNormalNum ?? 0;
  state.cardList[8].value = cardData.stockWarnNum ?? 0;
  state.mapData = Array.isArray(chartData.mapData) ? chartData.mapData : [];
  state.barData = Array.isArray(chartData.barData) ? chartData.barData : [];
  state.lineData = Array.isArray(chartData.lineData) ? chartData.lineData : [];
}

async function fetchChartData() {
  try {
    const response = await getCycleReportChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取周期报表统计失败，使用静态数据', error);
    normalizeChartData(getMockChartData());
  }
}

function handleCardClick(card) {
  if (card?.status) emit('metricFilter', card.status);
}

function handleBarLineClick(payload) {
  if (payload?.chartType === 'bar' && payload?.data?.name) {
    emit('stationFilter', payload.data.name);
  }
  if (payload?.chartType === 'line' && payload?.data?.name) {
    emit('trendFilter', payload.data.name);
  }
}

onMounted(fetchChartData);
</script>

<template>
  <StatsFourVisualization
    :cards="state.cardList"
    :show-map-toggle="true"
    :map-data="mapViewData"
    :map-config="mapConfig"
    :pie-chart-options="pieChartOptions"
    :bar-line-chart-options="barLineChartOptions"
    @card-click="handleCardClick"
    @bar-line-click="handleBarLineClick"
  />
</template>

<style scoped>
:deep(.stats-four-visualization) {
  min-height: 280px;
  gap: 12px;
}

:deep(.cards-section) {
  display: flex;
  flex-shrink: 0;
  flex-flow: row wrap;
  gap: 8px;
  align-content: stretch;
  width: min(420px, 42%);
  min-width: 360px;
  height: 280px;
  padding: 4px;
  overflow: hidden;
}

:deep(.cards-section .stat-card) {
  box-sizing: border-box;
  flex: 1 1 calc(33.333% - 6px);
  min-width: 0;
  min-height: 0;
  padding: 6px 10px;
}

:deep(.cards-section .card-value) {
  font-size: 20px;
}

:deep(.right-section) {
  min-width: 0;
}

:deep(.charts-section) {
  gap: 10px;
}

:deep(.pie-chart-area) {
  flex: 0 0 24%;
  min-width: 170px;
}

:deep(.bar-line-chart-area) {
  flex: 1 1 0;
  min-width: 260px;
}
</style>
