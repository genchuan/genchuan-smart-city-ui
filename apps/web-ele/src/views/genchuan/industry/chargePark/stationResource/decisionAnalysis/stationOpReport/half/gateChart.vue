<script setup>
import { computed, onMounted, ref } from 'vue';

import * as pageApi from '#/api/genchuan/industry/chargePark/stationResource/decisionAnalysis/stationOpReport/index.js';
import StatsMap from '#/genchuan-components/Map/index.vue';
import BarClick from '#/genchuan-components/stats/barClick.vue';
import IndicatorClick from '#/genchuan-components/stats/indicatorClick.vue';
import LineChartClick from '#/genchuan-components/stats/lineChartClick.vue';

import { pageConfig, REPORT_TYPE } from './data.js';

const loading = ref(false);
const chartData = ref({});

const reportPeriodMap = {
  day: '日报',
  week: '周报',
  montly: '月报',
  season: '季报',
  half: '半年报',
  year: '年报',
  customize: '自定义报表',
};

function currentReportPeriod() {
  return reportPeriodMap[REPORT_TYPE] || REPORT_TYPE;
}

function pickList(keys) {
  for (const key of keys) {
    const value = chartData.value?.[key];
    if (Array.isArray(value) && value.length > 0) return value;
  }
  return [];
}

function pickValue(item, keys, fallback = 0) {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null) return item[key];
  }
  return fallback;
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
  (chartData.value?.mapData || []).map((item, index) => ({
    ...item,
    coordinate:
      item.coordinate ||
      (item.longitude && item.latitude
        ? `${item.longitude},${item.latitude}`
        : ''),
    geoCode: item.geoCode || item.id || `station-report-map-${index}`,
    locationName:
      item.locationName || item.stationName || item.areaName || '场站资源',
    statusName: item.statusName || item.status || '正常',
  })),
);

const mapInfoWindowConfig = {
  title: 'locationName',
  fields: [
    { key: 'areaName', label: '片区' },
    { key: 'stationName', label: '场站' },
    { key: 'stationCount', label: '场站数', bold: true },
    { key: 'spaceCount', label: '车位数' },
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

async function loadChart() {
  loading.value = true;
  try {
    chartData.value =
      (await pageApi.getStationOpReportChart({
        reportCycle: currentReportPeriod(),
      })) || {};
  } finally {
    loading.value = false;
  }
}

onMounted(loadChart);
</script>

<template>
  <div v-loading="loading" class="park-chart-box">
    <div v-if="hasCards" class="chart-box-left">
      <IndicatorClick
        v-for="item in chartCards"
        :key="item.key"
        :title="item.title"
        :value="item.value"
        :color="item.color"
      />
    </div>

    <div class="charts-wrapper">
      <div v-if="hasMap" class="chart-wrapper map-wrapper">
        <StatsMap
          :data="mapData"
          :info-window-config="mapInfoWindowConfig"
          class="chart-panel-inner"
        />
      </div>

      <div v-if="hasAreaBar" class="chart-wrapper">
        <BarClick
          class="chart-panel-inner"
          title="各片区场站数分布"
          :x-data="areaBarXData"
          :series-data="areaBarSeriesData"
          y-name="数量"
        />
      </div>

      <div v-if="hasTypeBar" class="chart-wrapper">
        <BarClick
          class="chart-panel-inner"
          title="各类型场站数分布"
          :x-data="typeBarXData"
          :series-data="typeBarSeriesData"
          y-name="数量"
        />
      </div>

      <div v-if="hasOrderBar" class="chart-wrapper">
        <BarClick
          class="chart-panel-inner"
          title="各场站订单量分布"
          :x-data="orderBarXData"
          :series-data="orderBarSeriesData"
          y-name="数量"
        />
      </div>

      <div v-if="hasRecoveryBar" class="chart-wrapper">
        <BarClick
          class="chart-panel-inner"
          title="各场站追缴完成率"
          :x-data="recoveryBarXData"
          :series-data="recoveryBarSeriesData"
          y-name="完成率(%)"
        />
      </div>

      <div v-if="hasLine" class="chart-wrapper line-wrapper">
        <LineChartClick
          class="chart-panel-inner"
          title="周期订单及业务趋势"
          :x-data="lineXData"
          :series-data="lineSeriesData"
          y-name="数量"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.park-chart-box {
  display: grid;
  grid-template-columns: 480px repeat(2, minmax(320px, 1fr));
  gap: 12px;
  align-items: start;
  width: 100%;
  min-height: 280px;
  overflow: visible;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, minmax(320px, 1fr));

    .chart-box-left {
      grid-column: 1 / -1;
      width: 100%;
      min-width: 0;
      max-width: 100%;
    }

    .line-wrapper {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    .chart-box-left,
    .line-wrapper {
      grid-column: 1;
    }
  }

  .chart-box-left {
    display: flex !important;
    flex: 0 0 480px !important;
    flex-flow: row wrap;
    grid-column: 1;
    gap: 4px;
    align-content: stretch;
    width: 480px;
    min-width: 480px;
    max-width: 480px;
    height: auto;
    min-height: 280px;
    padding: 4px;
    overflow: visible;

    :deep(.stat-card) {
      box-sizing: border-box;
      display: flex;
      flex: 1 1 calc(33.333% - 3px);
      flex-direction: column;
      justify-content: center;
      min-width: 0;
      height: auto !important;
      min-height: 64px !important;
      padding: 4px 8px;
      border-radius: 4px;
    }

    :deep(.card-header) {
      margin-bottom: 4px;
    }

    :deep(.card-title) {
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
      line-height: 16px;
      white-space: nowrap;
    }

    :deep(.card-indicator) {
      flex: 0 0 6px;
      width: 6px;
      height: 6px;
    }

    :deep(.card-value) {
      margin-bottom: 2px;
      font-size: 20px;
      line-height: 1.1;
    }

    :deep(.card-desc) {
      font-size: 11px;
    }
  }

  .charts-wrapper {
    display: contents;
  }

  .chart-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    height: 280px;
    min-height: 280px;
  }

  .line-wrapper {
    grid-column: 1 / -1;
    height: 320px;
    min-height: 320px;
  }

  :deep(.chart-panel-inner) {
    flex: 1 1 auto;
    width: 100%;
    height: 280px !important;
    min-height: 280px !important;
  }

  .line-wrapper :deep(.chart-panel-inner) {
    height: 320px !important;
    min-height: 320px !important;
  }
}
</style>
