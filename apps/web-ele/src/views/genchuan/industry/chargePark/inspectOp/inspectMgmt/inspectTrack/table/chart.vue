<script setup>
import { computed, onMounted, reactive } from 'vue';

import { ElTag } from 'element-plus';

import { getInspectTrackChart } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectTrack';
import MapPanel from '#/genchuan-components/Map/index.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import {
  formatDuration,
  formatTrendTime,
  getMockChartData,
  getTrackStatusTagType,
  parseTrackPoints,
} from './data';

const emit = defineEmits(['mapFilter', 'trendFilter', 'userFilter']);

const state = reactive({
  cardList: [
    {
      title: '巡检里程',
      value: '0 km',
      desc: '累计巡检里程',
      status: '',
      color: '#2f80ed',
    },
    {
      title: '巡检时长',
      value: '0 分钟',
      desc: '累计巡检时长',
      status: '',
      color: '#27ae60',
    },
  ],
  mapData: [],
  trendData: [],
});

const trendXData = computed(() => state.trendData.map((item) => item.time));
const trendSeriesData = computed(() => [
  {
    name: '巡检里程',
    data: state.trendData.map((item) => item.totalMileage),
    color: '#2f80ed',
  },
]);

const markerData = computed(() =>
  state.mapData
    .map((item) => {
      const points = parseTrackPoints(item.points);
      const firstPoint = points[0];
      if (!firstPoint) return null;
      return {
        id: item.id || item.userId,
        coordinate: `${firstPoint.lon},${firstPoint.lat}`,
        locationName: `${item.userName || '巡检人员'}轨迹`,
        geoCode: item.id ? `轨迹 ${item.id}` : `人员 ${item.userId}`,
        statusName: item.status || '正常',
        areaName: item.area || '-',
        layerTypeName: '巡检轨迹',
        adminCode: item.userName || '-',
        checkResultName: item.status === '异常' ? '未通过' : '通过',
      };
    })
    .filter(Boolean),
);

function normalizeMapData(mapData) {
  if (!Array.isArray(mapData)) return [];
  return mapData.map((item, index) => ({
    ...item,
    id: item.id || index + 1,
    points: item.points || item.trackPoints || item.track_point_list,
    status: item.status || item.statusName || '正常',
    area: item.area || item.areaName || '-',
  }));
}

function normalizeTrendData(trendData) {
  if (!Array.isArray(trendData)) return [];
  return trendData.map((item) => {
    const trackTime = item.time ?? item.trackTime ?? item.track_time;
    return {
      trackTime: String(trackTime ?? ''),
      time: item.time,
      totalMileage: Number(item.totalMileage ?? item.mileage ?? 0),
    };
  });
}

function normalizeChartData(data) {
  const chartData =
    data?.mapData || data?.trendData || data?.cardData
      ? data
      : getMockChartData();
  const cardData = chartData.cardData || {};
  const focusUserId = cardData.focusUserId || chartData.mapData?.[0]?.userId;
  const focusUserName =
    cardData.focusUserName || chartData.mapData?.[0]?.userName;

  state.cardList[0].value = `${Number(cardData.totalMileage || 0).toFixed(2)} km`;
  state.cardList[0].desc = focusUserName
    ? `点击筛选 ${focusUserName}`
    : '累计巡检里程';
  state.cardList[0].status = focusUserId ? String(focusUserId) : '';
  state.cardList[1].value = formatDuration(cardData.totalDuration || 0);
  state.cardList[1].desc = focusUserName
    ? `点击筛选 ${focusUserName}`
    : '累计巡检时长';
  state.cardList[1].status = focusUserId ? String(focusUserId) : '';
  state.mapData = normalizeMapData(chartData.mapData);
  state.trendData = normalizeTrendData(chartData.trendData);
}

async function fetchChartData() {
  try {
    const response = await getInspectTrackChart();
    normalizeChartData(response?.data || response);
  } catch (error) {
    console.error('获取巡检轨迹统计失败，使用静态数据:', error);
    normalizeChartData(getMockChartData());
  }
}

function handleCardClick(card) {
  if (card.status) {
    emit('userFilter', Number(card.status));
  }
}

function handleTrendClick(payload) {
  const trendItem = state.trendData[payload?.dataIndex];
  const trackTime = trendItem?.trackTime || payload?.categoryName;
  if (trackTime) {
    emit('trendFilter', trackTime);
  }
}

function handleMapItemClick(item) {
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
        :status="card.status"
        :title="card.title"
        :value="card.value"
        @click="handleCardClick"
      />
    </div>

    <div class="park-type-chart inspect-track-map-section">
      <div class="map-title">巡检轨迹展示</div>
      <MapPanel
        :data="markerData"
        :info-window-config="{
          title: 'locationName',
          fields: [
            { key: 'geoCode', label: '轨迹标识' },
            { key: 'statusName', label: '轨迹状态', bold: true },
            { key: 'areaName', label: '所属片区' },
            { key: 'adminCode', label: '巡检人员' },
          ],
        }"
      />
      <div class="map-track-list">
        <ElTag
          v-for="item in state.mapData.slice(0, 4)"
          :key="item.id"
          class="track-tag"
          effect="plain"
          :type="getTrackStatusTagType(item.status)"
          @click="handleMapItemClick(item)"
        >
          {{ item.userName || '巡检人员' }} {{ item.status }}
        </ElTag>
      </div>
    </div>

    <LineChartClick
      class="simple-bar-chart"
      title="巡检里程趋势"
      :series-data="trendSeriesData"
      :x-data="trendXData"
      x-axis-label-font-style="italic"
      y-name="公里"
      @line-click="handleTrendClick"
    />
  </div>
</template>

<style lang="scss">
.chart-box-left{
  .left-card {
    height: 159px !important;
  }
}
.inspect-track-map-section {
  position: relative;
  flex: 1.1 1 0;
  min-width: 0;
  margin-left: 15px;
  overflow: hidden;
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

.map-track-list {
  position: absolute;
  right: 12px;
  bottom: 12px;
  left: 12px;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.track-tag {
  cursor: pointer;
  background: rgb(255 255 255 / 90%);
}

</style>
