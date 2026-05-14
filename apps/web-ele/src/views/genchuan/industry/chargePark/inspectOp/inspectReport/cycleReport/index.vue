<script setup>
import { computed, nextTick, ref, shallowRef } from 'vue';

import DrillDetailDrawer from './components/DrillDetailDrawer.vue';
import Chart from './table/chart.vue';
import { reportCycleTabs } from './table/data';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

const activeName = ref(reportCycleTabs[0].label);
const secondShow = shallowRef(false);
const chartFilter = shallowRef(null);
const showStats = shallowRef(true);

const tabArray = ref(
  reportCycleTabs.map((tab) => ({
    label: tab.label,
    value: tab.value,
    components: Table,
    showSecondary: true,
    secondShow: false,
  })),
);

const drillDetailDrawerRef = ref(null);

const showStatsValue = computed(() => showStats.value);

const activeReportCycleValue = computed(() => {
  const row = tabArray.value.find((t) => t.label === activeName.value);
  return row?.value ?? '';
});

function changeArrowStatus() {
  secondShow.value = !secondShow.value;
  tabArray.value = tabArray.value.map((item) => ({
    ...item,
    secondShow: secondShow.value,
  }));
}

function toggleStats() {
  showStats.value = !showStats.value;
}

function openDrillDrawer(payload) {
  nextTick(() => {
    drillDetailDrawerRef.value?.open({
      ...payload,
      activeReportCycle: activeReportCycleValue.value,
    });
  });
}

function handleMetricFilter(metricKey) {
  // chartFilter.value = {
  //   type: 'metric',
  //   value: metricKey,
  //   filterKey: Date.now(),
  // };
  openDrillDrawer({ source: 'card', cardKey: metricKey });
}

function handleStationFilter(payload) {
  const stationName =
    typeof payload === 'string' ? payload : (payload?.stationName ?? '');
  const barChartKey =
    typeof payload === 'object' ? payload?.barChartKey : undefined;
  // chartFilter.value = {
  //   type: 'station',
  //   value: stationName,
  //   barChartKey,
  //   filterKey: Date.now(),
  // };
  openDrillDrawer({
    source: 'bar',
    stationName,
    barChartKey,
  });
}

function handleTrendFilter(payload) {
  const trendDate =
    typeof payload === 'string' ? payload : (payload?.trendDate ?? '');
  const lineChartKey =
    typeof payload === 'object' ? payload?.lineChartKey : undefined;
  // chartFilter.value = {
  //   type: 'trendTime',
  //   value: trendDate,
  //   lineChartKey,
  //   filterKey: Date.now(),
  // };
  openDrillDrawer({
    source: 'line',
    trendDate,
    lineChartKey,
  });
}
</script>

<template>
  <div class="common-index">
    <Chart
      v-if="showStats"
      @metric-filter="handleMetricFilter"
      @station-filter="handleStationFilter"
      @trend-filter="handleTrendFilter"
    />
    <div class="icon-change">
      <el-icon
        v-if="secondShow"
        class="tabel-tab-icon"
        @click="changeArrowStatus"
      >
        <ArrowDown />
      </el-icon>
      <el-icon
        v-if="!secondShow"
        class="tabel-tab-icon"
        @click="changeArrowStatus"
      >
        <ArrowUp />
      </el-icon>
    </div>
    <DrillDetailDrawer ref="drillDetailDrawerRef" />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane
        v-for="item in tabArray"
        :key="item.label"
        lazy
        :name="item.label"
      >
        <template #label>
          <div class="table-first">
            <span>{{ item.label }}</span>
          </div>
        </template>
        <component
          :is="item.components"
          :key="item.label"
          :active-report-cycle="item.value"
          :chart-filter="chartFilter"
          :second-show="item.secondShow"
          :show-stats="showStatsValue"
          :toggle-stats="toggleStats"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
