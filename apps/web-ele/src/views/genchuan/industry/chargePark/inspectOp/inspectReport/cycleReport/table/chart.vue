<script setup>
import { computed, onMounted, reactive } from 'vue';
import dayjs from 'dayjs';

import { getCycleReportChart } from '#/api/genchuan/industry/chargePark/inspectOp/inspectReport/cycleReport';
import StatsFourVisualization from '#/genchuan-components/stats/StatsFourVisualization.vue';

import { formatRate, getMockChartData } from './data';

const emit = defineEmits(['metricFilter', 'stationFilter', 'trendFilter']);

const state = reactive({
  cardList: [
    { title: '正常设备数', value: 0, desc: '设备状态', status: 'deviceNormal', color: '#2fbf71' },
    { title: '异常设备数', value: 0, desc: '设备异常', status: 'deviceAbnormal', color: '#e95f5f' },
    { title: '巡检任务数', value: 0, desc: '任务总量', status: 'inspectTask', color: '#2f80ed' },
    { title: '任务完成率', value: '0%', desc: '任务闭环', status: 'taskComplete', color: '#27ae60' },
    { title: '油车占位待处置数', value: 0, desc: '待处置占位', status: 'oilWaitHandle', color: '#f2994a' },
    { title: '处置完成率', value: '0%', desc: '占位处置', status: 'oilHandleComplete', color: '#9b51e0' },
    { title: '巡检人员在岗数', value: 0, desc: '在岗人员', status: 'inspectUserOnline', color: '#00a8cc' },
    { title: '资产正常数', value: 0, desc: '正常资产', status: 'assetNormal', color: '#219653' },
    { title: '库存预警数', value: 0, desc: '预警库存', status: 'stockWarn', color: '#eb5757' },
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

/** 场站维度柱状图：下拉切换指标（与接口 barData 字段一致） */
const barChartOptions = computed(() => {
  const rows = state.barData;
  return [
    {
      label: '场站-异常设备数',
      value: 'station-abnormalDeviceNum',
      type: 'bar',
      data: {
        xAxis: rows.map((item) => item.stationName),
        series: rows.map((item) => Number(item.abnormalDeviceNum ?? 0)),
      },
    },
    {
      label: '场站-巡检任务数',
      value: 'station-taskTypeNum',
      type: 'bar',
      data: {
        xAxis: rows.map((item) => item.stationName),
        series: rows.map((item) => Number(item.taskTypeNum ?? 0)),
      },
    },
    {
      label: '场站-油车占位数',
      value: 'station-oilOccupyNum',
      type: 'bar',
      data: {
        xAxis: rows.map((item) => item.stationName),
        series: rows.map((item) => Number(item.oilOccupyNum ?? 0)),
      },
    },
  ];
});

/** 时间维度折线图：下拉切换指标（与接口 lineData 字段一致） */
const lineChartOptions = computed(() => {
  const rows = state.lineData;
  return [
    {
      label: '日期-设备更新数',
      value: 'date-deviceUpdateNum',
      type: 'line',
      data: {
        xAxis: rows.map((item) => item.date ?? item.time),
        series: rows.map((item) => Number(item.deviceUpdateNum ?? 0)),
      },
    },
    {
      label: '日期-任务处理时长',
      value: 'date-taskHandleTime',
      type: 'line',
      data: {
        xAxis: rows.map((item) => item.date ?? item.time),
        series: rows.map((item) => Number(item.taskHandleTime ?? 0)),
      },
    },
    {
      label: '日期-填报数',
      value: 'date-reportNum',
      type: 'line',
      data: {
        xAxis: rows.map((item) => item.date ?? item.time),
        series: rows.map((item) => Number(item.reportNum ?? 0)),
      },
    },
  ];
});

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
  state.lineData = Array.isArray(chartData.lineData) ? chartData.lineData?.map(v => {
    return {
      ...v,
      date: dayjs(v.date).format('YYYY-MM-DD'),
    }
  }) : [];
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
  const name = payload?.data?.name;
  if (!name) return;
  const slot = payload.chartSlot;
  if (slot === 'bar' || (!slot && payload.chartType === 'bar')) {
    emit('stationFilter', name);
    return;
  }
  if (slot === 'line' || (!slot && payload.chartType === 'line')) {
    emit('trendFilter', name);
  }
}

onMounted(fetchChartData);
</script>

<template>
  <StatsFourVisualization
    charts-mode="bar-line"
    :cards="state.cardList"
    :show-map-toggle="true"
    :map-data="mapViewData"
    :map-config="mapConfig"
    :bar-chart-options="barChartOptions"
    :line-chart-options="lineChartOptions"
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

:deep(.charts-section--bar-line-mode) {
  flex: 1 1 0;
  min-width: 0;
}

:deep(.dual-bar-chart-area),
:deep(.dual-line-chart-area) {
  flex: 1 1 0;
  min-width: 200px;
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
