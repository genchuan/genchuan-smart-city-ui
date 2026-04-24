<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getCycleReportChart } from '#/api/genchuan/industry/chargePark/inspectOp/inspectReport/cycleReport';
import MapComponent from '#/genchuan-components/Map/index.vue';
import Columnar from '#/components/stats/columnar.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import { formatRate, getMockChartData } from './data';

const emit = defineEmits(['metricFilter', 'stationFilter', 'trendFilter']);

const state = reactive({
  cardList: [
    {
      title: '正常设备数',
      value: 0,
      desc: '设备状态',
      status: 'normalDeviceNum',
      color: '#2fbf71',
    },
    {
      title: '异常设备数',
      value: 0,
      desc: '设备异常',
      status: 'abnormalDeviceNum',
      color: '#e95f5f',
    },
    {
      title: '巡检任务数',
      value: 0,
      desc: '任务总量',
      status: 'inspectTaskNum',
      color: '#2f80ed',
    },
    {
      title: '任务完成率',
      value: '0%',
      desc: '任务闭环',
      status: 'taskCompleteRate',
      color: '#27ae60',
    },
    {
      title: '油车占位待处置数',
      value: 0,
      desc: '待处置占位',
      status: 'oilWaitHandleNum',
      color: '#f2994a',
    },
    {
      title: '处置完成率',
      value: '0%',
      desc: '占位处置',
      status: 'oilHandleCompleteRate',
      color: '#9b51e0',
    },
    {
      title: '巡检人员在岗数',
      value: 0,
      desc: '在岗人员',
      status: 'inspectUserOnlineNum',
      color: '#00a8cc',
    },
    {
      title: '资产正常数',
      value: 0,
      desc: '正常资产',
      status: 'assetNormalNum',
      color: '#219653',
    },
    {
      title: '库存预警数',
      value: 0,
      desc: '预警库存',
      status: 'stockWarnNum',
      color: '#eb5757',
    },
  ],
  mapData: [],
  barData: [],
  lineData: [],
  mapConfig: {
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
  },
});

function getMarkerStatusName(item) {
  if (item.deviceStatus === '\u5F02\u5E38\u8BBE\u5907')
    return '\u5F02\u5E38\u8BBE\u5907';
  if (item.userOnlineStatus === '\u4EBA\u5458\u5728\u5C97')
    return '\u4EBA\u5458\u5728\u5C97';
  return '\u6B63\u5E38\u8BBE\u5907';
}

const mapData = computed(() =>
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

const barXData = computed(() => state.barData.map((item) => item.stationName));
const barSeriesData = computed(() => [
  {
    name: '异常设备数',
    data: state.barData.map((item) => item.abnormalDeviceNum),
  },
  {
    name: '巡检任务类型分布',
    data: state.barData.map((item) => item.taskTypeNum),
  },
  {
    name: '油车占位场站分布',
    data: state.barData.map((item) => item.oilOccupyNum),
  },
]);

const lineXData = computed(() => state.lineData.map((item) => item.date));
const lineSeriesData = computed(() => [
  {
    name: '设备状态更新趋势',
    data: state.lineData.map((item) => item.deviceUpdateNum),
    color: '#2f80ed',
  },
  {
    name: '巡检任务处理时效趋势',
    data: state.lineData.map((item) => item.taskHandleTime),
    color: '#27ae60',
  },
  {
    name: '上报量趋势',
    data: state.lineData.map((item) => item.reportNum),
    color: '#eb5757',
  },
]);

function normalizeChartData(data) {
  const chartData =
    data?.cardData || data?.mapData || data?.barData || data?.lineData
      ? data
      : getMockChartData();
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
  emit('metricFilter', card.status);
}

function handleBarClick(stationName) {
  emit('stationFilter', stationName);
}

function handleLineClick(payload) {
  if (payload?.categoryName) {
    emit('trendFilter', payload.categoryName);
  }
}

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="cycle-report-visualization">
    <div class="cards-section">
      <IndicatorClick
        v-for="card in state.cardList"
        :key="card.title"
        :color="card.color"
        :desc="card.desc"
        :status="card.status"
        :title="card.title"
        :value="card.value"
        @click="handleCardClick"
      />
    </div>

    <div class="charts-section">
      <div class="map-wrapper">
        <MapComponent
          :data="mapData"
          :info-window-config="state.mapConfig.infoWindowConfig"
          :marker-icons="state.mapConfig.markerIcons"
          :status-icon-map="state.mapConfig.statusIconMap"
          :status-key-map="state.mapConfig.statusKeyMap"
        />
      </div>

      <div class="chart-wrapper">
        <Columnar
          title="各场站设备异常/任务/占位分布"
          :series-data="barSeriesData"
          :x-data="barXData"
          y-name="数量"
          class="chart-fill"
          @bar-click="handleBarClick"
        />
      </div>

      <div class="chart-wrapper chart-line">
        <LineChartClick
          title="设备更新/任务时效/上报量趋势"
          :series-data="lineSeriesData"
          :x-data="lineXData"
          y-name="趋势值"
          class="chart-fill"
          @line-click="handleLineClick"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cycle-report-visualization {
  display: flex;
  align-items: stretch;
  gap: 20px;
  width: 100%;
  min-height: 540px;
}

.cards-section {
  display: grid;
  flex-shrink: 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: 12px;
  width: 420px;
  min-width: 0;
  height: 540px;
}

.charts-section {
  display: grid;
  flex: 1 1 0;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: minmax(250px, 1fr) minmax(270px, 1fr);
  gap: 20px;
  min-width: 0;
  min-height: 540px;
  height: 540px;
}

.map-wrapper {
  min-width: 0;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.chart-wrapper {
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.chart-line {
  grid-column: 1 / span 2;
}

.chart-wrapper :deep(.chart-fill) {
  width: 100%;
  min-width: 0 !important;
  max-width: 100% !important;
  height: 100% !important;
}
</style>
