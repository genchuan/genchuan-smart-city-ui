<script setup>
import { computed, onMounted, reactive, shallowRef } from 'vue';

import { getFenceMgmtChart } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/fenceMgmt';
import MapComponent from '#/genchuan-components/Map/index.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';

import {
  getMockChartData,
  normalizeFenceMgmtRow,
  parseFenceArea,
} from './data';

const emit = defineEmits(['alarmFilter', 'mapFilter', 'statusFilter']);

const activeFence = shallowRef(null);
const state = reactive({
  cardList: [
    {
      title: '围栏数',
      value: 0,
      desc: '全部电子围栏',
      filterType: 'all',
      color: '#2f80ed',
    },
    {
      title: '告警触发数',
      value: 0,
      desc: '越界告警累计',
      filterType: 'alarmed',
      color: '#e74c3c',
    },
  ],
  mapData: [],
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
      已生效: 'green',
      未生效: 'orange',
      失效: 'red',
    },
    infoWindowConfig: {
      title: 'fenceName',
      fields: [
        { key: 'statusName', label: '围栏状态', bold: true },
        // { key: 'alarmCount', label: '告警触发数' },
        { key: 'areaPointCount', label: '区域点位数' },
      ],
    },
  },
});

function getFenceCenterCoordinate(area) {
  const points = parseFenceArea(area);
  if (points.length === 0) return '';
  const total = points.reduce(
    (acc, point) => ({
      lng: acc.lng + point.lng,
      lat: acc.lat + point.lat,
    }),
    { lng: 0, lat: 0 },
  );
  const centerLng = total.lng / points.length;
  const centerLat = total.lat / points.length;
  return `${centerLng},${centerLat}`;
}

const mapMarkerData = computed(() =>
  state.mapData
    .map((item) => {
      const points = parseFenceArea(item.area);
      const coordinate = getFenceCenterCoordinate(item.area);
      if (!coordinate) return null;
      return {
        id: item.id,
        fenceName: item.name || `围栏${item.id}`,
        statusName: item.status || '-',
        alarmCount: item.alarmCount ?? 0,
        areaPointCount: points.length,
        areaPoints: points,
        coordinate,
      };
    })
    .filter(Boolean),
);

function normalizeMapData(mapData) {
  if (!Array.isArray(mapData)) return [];
  return mapData.map((item, index) =>
    normalizeFenceMgmtRow({
      ...item,
      id: item.id || index + 1,
    }),
  );
}

function normalizeChartData(data) {
  const chartData = data?.mapData || data?.cardData ? data : getMockChartData();
  const cardData = chartData.cardData || {};

  state.cardList[0].value = cardData.fenceCount ?? 0;
  state.cardList[1].value = cardData.alarmCount ?? 0;
  state.mapData = normalizeMapData(chartData.mapData);
  activeFence.value = state.mapData[0] || null;
}

async function fetchChartData() {
  try {
    const response = await getFenceMgmtChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取电子围栏统计失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }
}

function handleCardClick(card) {
  if (card.filterType === 'alarmed') {
    emit('alarmFilter');
    return;
  }
  emit('statusFilter', '');
}

function handleFenceClick(item) {
  activeFence.value = item;
  emit('mapFilter', item);
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
        :status="card.filterType"
        :title="card.title"
        :value="card.value"
        @click="handleCardClick"
      />
    </div>

    <div class="fence-map-section">
      <div class="map-title">围栏区域分布</div>
      <MapComponent
        :data="mapMarkerData"
        :info-window-config="state.mapConfig.infoWindowConfig"
        :marker-icons="state.mapConfig.markerIcons"
        :status-icon-map="state.mapConfig.statusIconMap"
        :status-key-map="state.mapConfig.statusKeyMap"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.park-chart-box {
  display: flex;
  flex-wrap: nowrap !important;
  align-items: stretch;
}

.fence-map-section {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  height: 320px;
  margin-left: 15px;
  overflow: hidden;
}

.fence-map-section :deep(.map-container) {
  width: 100%;
  height: 100%;
}

.map-title {
  position: absolute;
  top: 12px;
  left: 16px;
  z-index: 2;
  padding: 4px 8px;
  font-size: 14px;
  color: #4b5563;
  background: rgb(255 255 255 / 88%);
  border-radius: 4px;
}

.chart-box-left {
  .left-card {
    height: 159px !important;
  }
}
</style>
