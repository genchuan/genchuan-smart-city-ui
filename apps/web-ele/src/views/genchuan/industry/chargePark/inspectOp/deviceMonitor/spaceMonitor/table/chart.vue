<script setup>
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';

import * as echarts from 'echarts';

import { getSpaceMonitorChart } from '#/api/genchuan/industry/chargePark/inspectOp/deviceMonitor/spaceMonitor';
import MapComponent from '#/genchuan-components/Map/index.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';

import {
  getMockChartData,
  getMonitorStatusLabel,
  getMonitorStatusValueByLabel,
} from './data';

const props = defineProps({
  locatedSpace: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['statusFilter', 'trendFilter']);

const state = reactive({
  cardList: [
    {
      title: '正常车位',
      value: 0,
      status: getMonitorStatusValueByLabel('正常'),
      color: '#2fbf71',
    },
    {
      title: '异常车位',
      value: 0,
      status: getMonitorStatusValueByLabel('异常'),
      color: '#e95f5f',
    },
  ],
  mapData: [],
  trendData: [],
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
      [getMonitorStatusValueByLabel('正常')]: 'green',
      [getMonitorStatusValueByLabel('异常')]: 'red',
      正常: 'green',
      异常: 'red',
      定位: 'orange',
    },
    infoWindowConfig: {
      title: 'spaceCode',
      fields: [
        { key: 'stationName', label: '所属场站' },
        // { key: 'regionName', label: '所属区域' },
        // { key: 'monitorStatus', label: '监测状态', bold: true },
      ],
    },
  },
});

const trendChartRef = ref(null);
let trendChartInstance = null;

const mapData = computed(() => {
  const baseData = state.mapData.map((item) => {
    const status = item.status ?? item.monitorStatus;

    return {
      id: item.id,
      spaceCode: item.name || item.spaceCode,
      stationName: item.stationName || '-',
      regionName: item.regionName || '-',
      monitorStatus: getMonitorStatusLabel(status),
      statusName: getMonitorStatusLabel(status),
      coordinate: `${item.lon ?? item.longitude},${item.lat ?? item.latitude}`,
    };
  });

  const s = props.locatedSpace;
  const lon = s?.longitude ?? s?.lon;
  const lat = s?.latitude ?? s?.lat;
  if (
    s == null ||
    lon === '' ||
    lat === '' ||
    lon == null ||
    lat == null
  ) {
    return baseData;
  }

  const located = {
    id: s.id || s.spaceCode,
    spaceCode: s.spaceCode || '目标车位',
    stationName: s.stationName || '-',
    regionName: s.regionName || '-',
    monitorStatus: s.monitorStatus
      ? getMonitorStatusLabel(s.monitorStatus)
      : '定位',
    statusName: '定位',
    coordinate: `${Number(lon)},${Number(lat)}`,
  };

  return [located, ...baseData.filter((item) => item.id !== located.id)];
});

const mapLocateFocusKey = computed(() => {
  const s = props.locatedSpace;
  if (!s?.locateKey) return 0;
  const lon = s.longitude ?? s.lon;
  const lat = s.latitude ?? s.lat;
  if (lon == null || lat == null || lon === '' || lat === '') return 0;
  return s.locateKey;
});

function normalizeChartData(data) {
  const chartData =
    data?.mapData || data?.trendData || data?.cardData
      ? data
      : getMockChartData();
  const cardData = chartData.cardData || {};

  state.cardList[0].value = cardData.normalSpace ?? cardData.normalCount ?? 0;
  state.cardList[1].value =
    cardData.abnormalSpace ?? cardData.abnormalCount ?? 0;
  state.mapData = Array.isArray(chartData.mapData) ? chartData.mapData : [];
  state.trendData = Array.isArray(chartData.trendData)
    ? chartData.trendData
    : [];
}

function getTrendOption() {
  return {
    backgroundColor: 'transparent',
    title: {
      text: '状态更新趋势',
      left: 'center',
      top: 5,
      textStyle: {
        color: '#596678',
        fontSize: 14,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: '#dbe7f3',
      borderWidth: 1,
      textStyle: {
        color: '#596678',
      },
    },
    legend: {
      top: 32,
      textStyle: {
        color: '#6e7e91',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '4%',
      top: 70,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: state.trendData.map((item) => item.time),
      axisLine: {
        lineStyle: {
          color: '#dbe7f3',
        },
      },
      axisLabel: {
        color: '#7b8794',
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#7b8794',
      },
      splitLine: {
        lineStyle: {
          color: '#eef3f8',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: '正常车位',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        data: state.trendData.map((item) => item.normalCount),
        itemStyle: {
          color: '#2fbf71',
        },
        lineStyle: {
          width: 3,
          color: '#2fbf71',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(47,191,113,0.22)' },
            { offset: 1, color: 'rgba(47,191,113,0.04)' },
          ]),
        },
      },
      {
        name: '异常车位',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        data: state.trendData.map((item) => item.abnormalCount),
        itemStyle: {
          color: '#e95f5f',
        },
        lineStyle: {
          width: 3,
          color: '#e95f5f',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(233,95,95,0.22)' },
            { offset: 1, color: 'rgba(233,95,95,0.04)' },
          ]),
        },
      },
    ],
  };
}
function initTrendChart() {
  if (!trendChartRef.value || state.trendData.length === 0) return;

  if (trendChartInstance) {
    trendChartInstance.dispose();
  }

  trendChartInstance = echarts.init(trendChartRef.value);
  trendChartInstance.setOption(getTrendOption());
  trendChartInstance.on('click', (params) => {
    if (params?.name) {
      emit('trendFilter', params.name);
    }
  });
}

function handleResize() {
  trendChartInstance?.resize();
}

async function fetchChartData() {
  try {
    const response = await getSpaceMonitorChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取车位状态监控看板失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }

  await nextTick();
  initTrendChart();
}

function handleCardClick(card) {
  emit('statusFilter', card.status);
}

watch(
  () => state.trendData,
  () => nextTick(initTrendChart),
  { deep: true },
);

onMounted(() => {
  fetchChartData();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (trendChartInstance) {
    trendChartInstance.dispose();
    trendChartInstance = null;
  }
});
</script>

<template>
  <div class="park-chart-box">
    <div class="chart-box-left space-cards">
      <IndicatorClick
        v-for="card in state.cardList"
        class="left-card"
        :key="card.title"
        :color="card.color"
        :status="card.status"
        :title="card.title"
        :value="card.value"
        @click="handleCardClick"
      >
      </IndicatorClick>
    </div>

    <div class="space-right-section">
      <div class="park-type-chart space-map-wrapper">
        <MapComponent
          :data="mapData"
          :info-window-config="state.mapConfig.infoWindowConfig"
          :locate-focus-key="mapLocateFocusKey"
          :marker-icons="state.mapConfig.markerIcons"
          :status-icon-map="state.mapConfig.statusIconMap"
          :status-key-map="state.mapConfig.statusKeyMap"
        />
      </div>
      <div class="simple-bar-chart space-trend-wrapper">
        <div ref="trendChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.space-cards {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
}

.left-card {
  height: 159px !important;
}

.space-right-section {
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  // gap: 20px;
  margin-left: 15px;
}

.space-map-wrapper {
  flex: 1;
  min-width: 0;
  // margin-left: 15px;
  overflow: hidden;
}

.space-trend-wrapper {
  padding: 0;
}

.chart-container {
  width: 100%;
  height: 100%;
}
</style>
