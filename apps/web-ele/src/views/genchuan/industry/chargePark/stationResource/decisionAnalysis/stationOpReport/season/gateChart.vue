<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import * as pageApi from '#/api/genchuan/industry/chargePark/stationResource/decisionAnalysis/stationOpReport/index.js';
import StatsMap from '#/genchuan-components/Map/index.vue';
import BarClick from '#/genchuan-components/stats/barClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import DrillDownDetailDrawer from '../components/DrillDownDetailDrawer.vue';
import { pageConfig, REPORT_TYPE } from './data.js';

const props = defineProps({
  reportCycle: {
    type: String,
    default: undefined,
  },
});

const loading = ref(false);
const chartData = ref({});
const drillDownDrawerRef = ref(null);

const reportPeriodMap = {
  day: '日报',
  week: '周报',
  montly: '月报',
  season: '季报',
  half: '半年报',
  year: '年报',
  customize: '自定义报表',
};

const allReportCycles = [
  '日报',
  '周报',
  '月报',
  '季报',
  '半年报',
  '年报',
  '自定义报表',
];

function currentReportPeriod() {
  if (props.reportCycle !== undefined) {
    return props.reportCycle;
  }
  return reportPeriodMap[REPORT_TYPE] || REPORT_TYPE;
}

function hasChartContent(data = {}) {
  return Boolean(
    Object.keys(data.cardData || {}).length > 0 ||
    data.mapData?.length ||
    data.stationMapList?.length ||
    data.stationMapData?.length ||
    data.mapList?.length ||
    data.stationList?.length ||
    data.lineData?.length ||
    data.areaStationBarData?.length ||
    data.areaBarData?.length ||
    data.stationTypeBarData?.length ||
    data.typeBarData?.length ||
    data.stationOrderCountBarData?.length ||
    data.stationOrderBarData?.length ||
    data.stationRecoverFinishBarData?.length ||
    data.stationRecoveryRateBarData?.length ||
    data.recoveryRateBarData?.length ||
    data.barData?.length,
  );
}

function mergeCardData(target = {}, source = {}) {
  const result = { ...target };
  Object.entries(source).forEach(([key, value]) => {
    const current = result[key];
    if (typeof value === 'number' && typeof current === 'number') {
      result[key] = current + value;
    } else if (typeof value === 'number' && current === undefined) {
      result[key] = value;
    } else if (current === undefined) {
      result[key] = value;
    }
  });
  return result;
}

function mergeChartData(list) {
  let result = {};
  for (const item of list) {
    result = {
      ...result,
      cardData: mergeCardData(result.cardData, item.cardData),
      mapData: [...(result.mapData || []), ...pickMapList(item)],
      lineData: [...(result.lineData || []), ...(item.lineData || [])],
      areaStationBarData: [
        ...(result.areaStationBarData || []),
        ...(item.areaStationBarData || []),
      ],
      areaBarData: [...(result.areaBarData || []), ...(item.areaBarData || [])],
      stationTypeBarData: [
        ...(result.stationTypeBarData || []),
        ...(item.stationTypeBarData || []),
      ],
      typeBarData: [...(result.typeBarData || []), ...(item.typeBarData || [])],
      stationOrderCountBarData: [
        ...(result.stationOrderCountBarData || []),
        ...(item.stationOrderCountBarData || []),
      ],
      stationOrderBarData: [
        ...(result.stationOrderBarData || []),
        ...(item.stationOrderBarData || []),
      ],
      stationRecoverFinishBarData: [
        ...(result.stationRecoverFinishBarData || []),
        ...(item.stationRecoverFinishBarData || []),
      ],
      stationRecoveryRateBarData: [
        ...(result.stationRecoveryRateBarData || []),
        ...(item.stationRecoveryRateBarData || []),
      ],
      recoveryRateBarData: [
        ...(result.recoveryRateBarData || []),
        ...(item.recoveryRateBarData || []),
      ],
      barData: [...(result.barData || []), ...(item.barData || [])],
    };
  }
  return result;
}

async function loadAllCycleChart() {
  const response = await pageApi.getStationOpReportChart({
    reportCycle: '全部',
  });
  if (hasChartContent(response)) return response;

  const cycleCharts = await Promise.all(
    allReportCycles.map(async (reportCycle) => {
      try {
        return (
          (await pageApi.getStationOpReportChart({
            reportCycle,
          })) || {}
        );
      } catch {
        return {};
      }
    }),
  );
  return mergeChartData(cycleCharts);
}

function pickList(keys) {
  for (const key of keys) {
    const value = chartData.value?.[key];
    if (Array.isArray(value) && value.length > 0) return value;
  }
  return [];
}

function pickMapList(source = chartData.value) {
  const keys = [
    'mapData',
    'stationMapList',
    'stationMapData',
    'stationMap',
    'mapList',
    'stationList',
    'stationData',
  ];
  for (const key of keys) {
    const value = source?.[key];
    if (Array.isArray(value) && value.length > 0) return value;
  }
  return [];
}

function pickValue(item, keys, fallback = 0) {
  for (const key of keys) {
    const value = getFieldValue(item, key);
    if (value !== undefined && value !== null) return value;
  }
  return fallback;
}

function getFieldValue(item, key) {
  if (!item || !key) return undefined;
  if (!String(key).includes('.')) return item[key];
  let result = item;
  for (const part of String(key).split('.')) {
    result = result?.[part];
  }
  return result;
}

function pickText(item, keys, fallback = '', extraSources = []) {
  const sources = [
    item,
    ...extraSources.filter(
      (source) =>
        source && typeof source === 'object' && !Array.isArray(source),
    ),
  ];
  for (const source of sources) {
    for (const key of keys) {
      const value = getFieldValue(source, key);
      if (value !== undefined && value !== null && value !== '') return value;
    }
  }
  return fallback;
}

function pickSourceObjects(item, keys) {
  return keys
    .flatMap((key) => {
      const value = getFieldValue(item, key);
      return Array.isArray(value) ? value : [value];
    })
    .filter(
      (value) => value && typeof value === 'object' && !Array.isArray(value),
    );
}

function getMapSourceObjects(item) {
  return pickSourceObjects(item, [
    'stationInfo',
    'station',
    'stationVO',
    'stationData',
    'stationDetail',
    'siteInfo',
    'parkInfo',
    'areaInfo',
    'area',
    'region',
  ]);
}

function normalizeCoordinateValue(value) {
  if (Array.isArray(value) && value.length >= 2) {
    return `${value[0]},${value[1]}`;
  }

  if (value && typeof value === 'object') {
    const lng = pickText(value, [
      'longitude',
      'lng',
      'lon',
      'x',
      'mapLongitude',
      'mapLng',
      'stationLongitude',
      'stationLng',
      'gcj02Lng',
      'bdLng',
    ]);
    const lat = pickText(value, [
      'latitude',
      'lat',
      'y',
      'mapLatitude',
      'mapLat',
      'stationLatitude',
      'stationLat',
      'gcj02Lat',
      'bdLat',
    ]);
    return lng !== '' && lat !== '' ? `${lng},${lat}` : '';
  }

  if (typeof value === 'string') {
    return value.trim().replace('，', ',');
  }

  return value === undefined || value === null ? '' : `${value}`;
}

function getCoordinate(item) {
  const sources = [item, ...getMapSourceObjects(item)];
  const directKeys = [
    'coordinate',
    'coordinateInfo',
    'coordinates',
    'mapCoordinate',
    'mapCoordinates',
    'lngLat',
    'latLng',
    'longitudeLatitude',
    'location',
    'position',
    'point',
    'geoPoint',
    'center',
    'centerPoint',
  ];
  for (const source of sources) {
    const directCoordinate = normalizeCoordinateValue(
      pickText(source, directKeys),
    );
    if (directCoordinate) return directCoordinate;
  }

  const lng = pickText(
    item,
    [
      'longitude',
      'lng',
      'lon',
      'x',
      'mapLongitude',
      'mapLng',
      'stationLongitude',
      'stationLng',
      'gcj02Lng',
      'bdLng',
    ],
    '',
    sources.slice(1),
  );
  const lat = pickText(
    item,
    [
      'latitude',
      'lat',
      'y',
      'mapLatitude',
      'mapLat',
      'stationLatitude',
      'stationLat',
      'gcj02Lat',
      'bdLat',
    ],
    '',
    sources.slice(1),
  );
  return lng !== '' && lat !== '' ? `${lng},${lat}` : '';
}

function isValidCoordinate(coordinate) {
  const [lng, lat] = `${coordinate}`.split(',').map(Number);
  return Number.isFinite(lng) && Number.isFinite(lat);
}

const chartCards = computed(() => {
  const cardData = chartData.value?.cardData || {};
  return (pageConfig.chart?.cards || []).map(([key, title], index) => ({
    key,
    title,
    value: cardData[key] ?? 0,
    color: ['#13ce66', '#4ECDC4', '#FFB020', '#FF6B6B'][index % 4],
  }));
});

const mapData = computed(() =>
  pickMapList()
    .map((item, index) => {
      const sourceObjects = getMapSourceObjects(item);
      const coordinate = getCoordinate(item);
      const stationNo = pickText(
        item,
        [
          'stationNo',
          'stationCode',
          'station_code',
          'siteNo',
          'siteCode',
          'parkNo',
          'parkCode',
          'geoCode',
          'code',
        ],
        '',
        sourceObjects,
      );
      const stationId = pickText(
        item,
        ['stationId', 'station_id', 'siteId', 'parkId', 'id'],
        '',
        sourceObjects,
      );
      const stationName = pickText(
        item,
        [
          'stationName',
          'station_name',
          'siteName',
          'parkName',
          'name',
          'station',
          'locationName',
          'pointName',
        ],
        '',
        sourceObjects,
      );
      const locationName = pickText(
        item,
        [
          'locationName',
          'stationName',
          'station_name',
          'siteName',
          'parkName',
          'name',
          'areaName',
        ],
        '场站资源',
        sourceObjects,
      );
      const stationCount = pickText(
        item,
        [
          'stationCount',
          'totalStationCount',
          'coverStationCount',
          'count',
          'value',
        ],
        '',
        sourceObjects,
      );
      const spaceCount = pickText(
        item,
        [
          'spaceCount',
          'parkingSpaceCount',
          'parkingCount',
          'spaceTotal',
          'totalSpace',
          'totalSpaceCount',
          'availableSpaceCount',
        ],
        '',
        sourceObjects,
      );
      const statusName = pickText(
        item,
        [
          'statusName',
          'stationStatus',
          'operateStatus',
          'operationStatus',
          'status',
        ],
        '正常',
        sourceObjects,
      );

      return {
        ...item,
        areaName: pickText(
          item,
          [
            'areaName',
            'regionName',
            'districtName',
            'area.name',
            'region.name',
          ],
          '',
          sourceObjects,
        ),
        coordinate,
        geoCode: pickText(
          item,
          [
            'geoCode',
            'stationNo',
            'stationCode',
            'stationId',
            'siteNo',
            'siteCode',
            'parkNo',
            'parkCode',
            'id',
            'code',
          ],
          `station-report-map-${index}`,
          sourceObjects,
        ),
        locationName,
        orderCount: pickText(
          item,
          ['orderCount', 'totalOrderCount'],
          '',
          sourceObjects,
        ),
        revenue: pickText(
          item,
          ['revenue', 'totalRevenue', 'amount'],
          '',
          sourceObjects,
        ),
        spaceCount,
        stationCount,
        stationId,
        stationName,
        stationNo,
        stationStatus: statusName,
        stationType: pickText(
          item,
          ['stationType', 'typeName', 'type', 'stationTypeName'],
          '',
          sourceObjects,
        ),
        statusName,
      };
    })
    .filter((item) => isValidCoordinate(item.coordinate)),
);

const mapInfoWindowConfig = {
  title: 'locationName',
  fields: [
    { key: 'geoCode', label: '场站编码' },
    { key: 'areaName', label: '片区' },
    { key: 'stationName', label: '场站' },
    { key: 'coordinate', label: '坐标' },
    { key: 'stationCount', label: '场站数' },
    { key: 'spaceCount', label: '车位数' },
    { key: 'orderCount', label: '订单量', bold: true },
    { key: 'revenue', label: '营收' },
    { key: 'statusName', label: '状态' },
  ],
};

const areaBarList = computed(() => {
  const list = pickList(['areaStationBarData', 'areaBarData']);
  if (list.length > 0) return list;
  return (chartData.value?.barData || []).filter((item) => item.areaName);
});

const stationTypeBarList = computed(() => {
  const list = pickList(['stationTypeBarData', 'typeBarData']);
  if (list.length > 0) return list;
  return (chartData.value?.barData || []).filter((item) => item.stationType);
});

const stationOrderBarList = computed(() => {
  const list = pickList(['stationOrderCountBarData', 'stationOrderBarData']);
  if (list.length > 0) return list;
  return (chartData.value?.barData || []).filter(
    (item) => item.stationName && item.orderCount !== undefined,
  );
});

const recoveryBarList = computed(() => {
  const list = pickList([
    'stationRecoverFinishBarData',
    'stationRecoveryRateBarData',
    'recoveryRateBarData',
  ]);
  if (list.length > 0) return list;
  return (chartData.value?.barData || []).filter(
    (item) =>
      item.stationName &&
      (item.recoveryRate !== undefined || item.recoverFinish !== undefined),
  );
});

function createBarXData(list, nameKeys) {
  return list.map((item) => pickValue(item, nameKeys, '未知'));
}

function createBarSeriesData(list, valueKeys, name) {
  return [
    {
      data: list.map((item) => pickValue(item, valueKeys)),
      name,
      type: 'bar',
      barWidth: '30%',
    },
  ];
}

const areaBarXData = computed(() =>
  createBarXData(areaBarList.value, ['areaName']),
);
const areaBarSeriesData = computed(() =>
  createBarSeriesData(areaBarList.value, ['stationCount'], '片区场站数'),
);

const typeBarXData = computed(() =>
  createBarXData(stationTypeBarList.value, ['stationType', 'typeName', 'name']),
);
const typeBarSeriesData = computed(() =>
  createBarSeriesData(
    stationTypeBarList.value,
    ['stationCount', 'value'],
    '类型场站数',
  ),
);

const orderBarXData = computed(() =>
  createBarXData(stationOrderBarList.value, ['stationName', 'name']),
);
const orderBarSeriesData = computed(() =>
  createBarSeriesData(
    stationOrderBarList.value,
    ['orderCount', 'value'],
    '订单量',
  ),
);

const recoveryBarXData = computed(() =>
  createBarXData(recoveryBarList.value, ['stationName', 'name']),
);
const recoveryBarSeriesData = computed(() =>
  createBarSeriesData(
    recoveryBarList.value,
    ['recoveryRate', 'recoverFinish', 'value'],
    '追缴完成率(%)',
  ),
);

const lineXData = computed(() =>
  (chartData.value?.lineData || []).map((item) => item.date),
);

const lineSeriesData = computed(() => [
  {
    data: (chartData.value?.lineData || []).map((item) => item.orderCount ?? 0),
    name: '订单量',
    type: 'line',
    smooth: true,
  },
  {
    data: (chartData.value?.lineData || []).map(
      (item) => item.expandProgress ?? 0,
    ),
    name: '拓展进度',
    type: 'line',
    smooth: true,
  },
  {
    data: (chartData.value?.lineData || []).map(
      (item) => item.permissionUseCount ?? 0,
    ),
    name: '权限使用次数',
    type: 'line',
    smooth: true,
  },
]);

const hasCards = computed(() => chartCards.value.length > 0);
const hasMap = computed(() => mapData.value.length > 0);
const hasAreaBar = computed(() => areaBarXData.value.length > 0);
const hasTypeBar = computed(() => typeBarXData.value.length > 0);
const hasOrderBar = computed(() => orderBarXData.value.length > 0);
const hasRecoveryBar = computed(() => recoveryBarXData.value.length > 0);
const hasLine = computed(() => lineXData.value.length > 0);

const barChartPanels = computed(() =>
  [
    {
      drillType: 'areaStationBar',
      hasData: hasAreaBar.value,
      seriesData: areaBarSeriesData.value,
      title: '各片区场站数分布',
      xData: areaBarXData.value,
      yName: '数量',
    },
    {
      drillType: 'stationTypeBar',
      hasData: hasTypeBar.value,
      seriesData: typeBarSeriesData.value,
      title: '各类型场站数分布',
      xData: typeBarXData.value,
      yName: '数量',
    },
    {
      drillType: 'stationOrderBar',
      hasData: hasOrderBar.value,
      seriesData: orderBarSeriesData.value,
      title: '各场站订单量分布',
      xData: orderBarXData.value,
      yName: '数量',
    },
    {
      drillType: 'recoveryRateBar',
      hasData: hasRecoveryBar.value,
      seriesData: recoveryBarSeriesData.value,
      title: '各场站追缴完成率',
      xData: recoveryBarXData.value,
      yName: '完成率(%)',
    },
  ].filter((item) => item.hasData),
);

const firstBarPanel = computed(() => barChartPanels.value[0]);
const secondBarPanel = computed(() =>
  hasMap.value ? barChartPanels.value[0] : barChartPanels.value[1],
);
const firstChartUsesMap = computed(() => hasMap.value);
const firstChartUsesBar = computed(() => !hasMap.value && firstBarPanel.value);

async function loadChart() {
  loading.value = true;
  try {
    const reportCycle = currentReportPeriod();
    chartData.value =
      reportCycle === '全部'
        ? await loadAllCycleChart()
        : ((await pageApi.getStationOpReportChart({
            ...(reportCycle ? { reportCycle } : {}),
          })) ?? {});
  } finally {
    loading.value = false;
  }
}

onMounted(loadChart);

watch(
  () => props.reportCycle,
  () => {
    loadChart();
  },
);

function openDrillDown(info) {
  drillDownDrawerRef.value?.open({
    reportCycle: currentReportPeriod() || '全部',
    ...info,
  });
}

function handleCardClick(card) {
  openDrillDown({
    source: 'card',
    drillType: card.key,
    drillLabel: card.title,
    drillName: card.title,
    drillValue: card.value,
  });
}

function handleBarClick(drillType, drillLabel, drillValue) {
  openDrillDown({
    source: 'chart',
    drillType,
    drillLabel,
    drillName: drillValue,
    drillValue,
  });
}

function handleLineClick(info) {
  openDrillDown({
    source: 'chart',
    drillType: 'trendLine',
    drillLabel: info?.seriesName || '周期订单及业务趋势',
    drillName: info?.categoryName,
    drillValue: info?.value,
  });
}

function handleMapMarkerClick(marker) {
  openDrillDown({
    source: 'map',
    drillType: 'mapStation',
    drillLabel: '地图场站',
    drillName:
      marker?.stationName ||
      marker?.locationName ||
      marker?.stationNo ||
      marker?.geoCode,
    drillValue: 1,
    row: marker || {},
  });
}
</script>

<template>
  <div v-loading="loading" class="rule-chart-box">
    <div v-if="hasCards" class="chart-box-left">
      <div
        v-for="item in chartCards"
        :key="item.key"
        class="stat-card"
        :style="{ borderLeftColor: item.color || '#4A90E2' }"
        @click="handleCardClick(item)"
      >
        <div class="card-header">
          <h3 class="card-title">{{ item.title }}</h3>
          <div
            class="card-indicator"
            :style="{ backgroundColor: item.color || '#4A90E2' }"
          ></div>
        </div>
        <div class="card-body">
          <div class="card-value">{{ item.value }}</div>
          <div v-if="item.desc" class="card-desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>

    <div class="charts-wrapper">
      <div v-if="firstChartUsesMap" class="chart-area">
        <StatsMap
          :data="mapData"
          :info-window-config="mapInfoWindowConfig"
          class="chart-panel-inner"
          @marker-click="handleMapMarkerClick"
        />
      </div>

      <div v-else-if="firstChartUsesBar" class="chart-area">
        <BarClick
          class="chart-panel-inner"
          :title="firstBarPanel.title"
          :x-data="firstBarPanel.xData"
          :series-data="firstBarPanel.seriesData"
          :y-name="firstBarPanel.yName"
          @bar-click="
            handleBarClick(firstBarPanel.drillType, firstBarPanel.title, $event)
          "
        />
      </div>

      <div v-if="secondBarPanel" class="chart-area">
        <BarClick
          class="chart-panel-inner"
          :title="secondBarPanel.title"
          :x-data="secondBarPanel.xData"
          :series-data="secondBarPanel.seriesData"
          :y-name="secondBarPanel.yName"
          @bar-click="
            handleBarClick(
              secondBarPanel.drillType,
              secondBarPanel.title,
              $event,
            )
          "
        />
      </div>

      <div v-if="hasLine" class="chart-area line-chart-area">
        <LineChartClick
          class="chart-panel-inner"
          title="周期订单及业务趋势"
          :x-data="lineXData"
          :series-data="lineSeriesData"
          y-name="数量"
          @line-click="handleLineClick"
        />
      </div>
    </div>
  </div>
  <DrillDownDetailDrawer ref="drillDownDrawerRef" />
</template>

<style scoped lang="scss">
.rule-chart-box {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: auto;
  min-height: 280px;
  padding-bottom: 0.5rem;
  overflow: hidden;
}

.chart-box-left {
  display: flex;
  flex-shrink: 0;
  flex-flow: row wrap;
  gap: 4px;
  align-content: stretch;
  width: 480px;
  height: 280px;
  padding: 4px;
  overflow: hidden;
}

.stat-card {
  box-sizing: border-box;
  display: flex;
  flex: 1 1 calc(33.333% - 3px);
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  padding: 4px 8px;
  cursor: pointer;
  background-color: var(--el-bg-color, #fff);
  border-left: 4px solid;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.card-title {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: #6e7e91;
}

.card-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-value {
  font-size: 20px;
  font-weight: 600;
  color: #4a90e2;
}

.card-desc {
  margin-top: 2px;
  font-size: 11px;
  color: #909399;
}

.charts-wrapper {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 1 1 0;
  align-items: center;
  min-width: 0;
  height: 280px;
  padding: 4px;
}

.chart-area {
  position: relative;
  box-sizing: border-box;
  flex: 0 0 28%;
  min-width: 0;
  height: 272px;
}

.line-chart-area {
  flex: 1;
  height: 272px;
}

:deep(.chart-panel-inner) {
  width: 100% !important;
  height: 100% !important;
  min-height: 272px !important;
  border-radius: 0 !important;
}

:deep(.chart-panel-inner > div) {
  height: 100% !important;
}
</style>
