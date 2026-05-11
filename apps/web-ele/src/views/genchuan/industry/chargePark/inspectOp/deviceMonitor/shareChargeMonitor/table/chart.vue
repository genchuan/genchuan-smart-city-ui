<script setup>
import { computed, onMounted, reactive } from 'vue';

import { getShareChargeMonitorChart } from '#/api/genchuan/industry/chargePark/inspectOp/deviceMonitor/shareChargeMonitor';
import MapComponent from '#/genchuan-components/Map/index.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import {
  getMockChartData,
  getMonitorStatusLabel,
  getMonitorStatusValueByLabel,
} from './data';

const props = defineProps({
  locatedDevice: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['statusFilter', 'trendFilter']);

const state = reactive({
  cardList: [
    {
      title: '正常设备',
      value: 0,
      desc: '运行稳定',
      status: getMonitorStatusValueByLabel('正常'),
      color: '#2fbf71',
    },
    {
      title: '异常设备',
      value: 0,
      desc: '待关注',
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
      正常: 'green',
      异常: 'red',
      定位: 'orange',
    },
    infoWindowConfig: {
      title: 'deviceCode',
      fields: [
        { key: 'stationName', label: '所属场站' },
        // { key: 'regionName', label: '所属区域' },
        // { key: 'monitorStatus', label: '监测状态', bold: true },
      ],
    },
  },
});

const mapData = computed(() => {
  const baseData = state.mapData.map((item) => ({
    id: item.id,
    deviceCode: item.name || item.deviceCode,
    stationName: item.stationName || '-',
    regionName: item.regionName || '-',
    monitorStatus: getMonitorStatusLabel(item.status || item.monitorStatus),
    statusName: getMonitorStatusLabel(item.status || item.monitorStatus),
    coordinate: `${item.lon ?? item.longitude},${item.lat ?? item.latitude}`,
  }));

  const d = props.locatedDevice;
  const lon = d?.longitude ?? d?.lon;
  const lat = d?.latitude ?? d?.lat;
  if (
    d == null ||
    lon === '' ||
    lat === '' ||
    lon == null ||
    lat == null
  ) {
    return baseData;
  }

  const located = {
    id: d.id || d.deviceCode || d?.deviceId,
    deviceCode: d.deviceCode || '目标设备',
    stationName: d.stationName || '-',
    regionName: d.regionName || '-',
    monitorStatus: d.monitorStatus || '定位',
    statusName: '定位',
    coordinate: `${Number(lon)},${Number(lat)}`,
  };

  return [located, ...baseData.filter((item) => item.id !== located.id)];
});

const mapLocateFocusKey = computed(() => {
  const d = props.locatedDevice;
  if (!d?.locateKey) return 0;
  const lon = d.longitude ?? d.lon;
  const lat = d.latitude ?? d.lat;
  if (lon == null || lat == null || lon === '' || lat === '') return 0;
  return d.locateKey;
});

const trendXData = computed(() => state.trendData.map((item) => item.time));
const trendSeriesData = computed(() => [
  {
    name: '正常设备',
    data: state.trendData.map((item) => item.normalCount),
  },
  {
    name: '异常设备',
    data: state.trendData.map((item) => item.abnormalCount),
  },
]);

function normalizeChartData(data) {
  const chartData =
    data?.mapData || data?.trendData || data?.cardData
      ? data
      : getMockChartData();
  const cardData = chartData.cardData || {};

  state.cardList[0].value = cardData.normalDevice ?? cardData.normalCount ?? 0;
  state.cardList[1].value =
    cardData.abnormalDevice ?? cardData.abnormalCount ?? 0;
  state.mapData = Array.isArray(chartData.mapData) ? chartData.mapData : [];
  state.trendData = Array.isArray(chartData.trendData)
    ? chartData.trendData
    : [];
}

async function fetchChartData() {
  try {
    const response = await getShareChargeMonitorChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取共享充电监测看板失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }
}

function handleCardClick(card) {
  emit('statusFilter', card.status);
}

function handleTrendClick(payload) {
  if (payload?.categoryName) {
    emit('trendFilter', payload.categoryName);
  }
}

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div class="park-chart-box">
    <div class="chart-box-left">
      <IndicatorClick
        v-for="card in state.cardList"
        class="left-card"
        :key="card.title"
        :color="card.color"
        :desc="card.desc"
        :status="card.status"
        :title="card.title"
        :value="card.value"
        @click="handleCardClick"
      />
    </div>

    <div class="monitor-right-section">
      <div class="park-type-chart monitor-map-wrapper">
        <MapComponent
          :data="mapData"
          :info-window-config="state.mapConfig.infoWindowConfig"
          :locate-focus-key="mapLocateFocusKey"
          :marker-icons="state.mapConfig.markerIcons"
          :status-icon-map="state.mapConfig.statusIconMap"
          :status-key-map="state.mapConfig.statusKeyMap"
        />
      </div>
      <LineChartClick
        class="simple-bar-chart"
        title="状态更新趋势"
        :series-data="trendSeriesData"
        :x-data="trendXData"
        y-name="设备数"
        @line-click="handleTrendClick"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.monitor-right-section {
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  // gap: 20px;
  margin-left: 15px;
}

.monitor-map-wrapper {
  flex: 1;
  min-width: 0;
  // margin-left: 15px;
  overflow: hidden;
}

.chart-box-left {
  .left-card {
    height: 159px !important;
  }
}
</style>
