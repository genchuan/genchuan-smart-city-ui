<script setup>
import { computed, ref, shallowRef } from 'vue';

import Chart from './table/chart.vue';
import Table from './table/index.vue';
import { reportCycleTabs } from './table/data';

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

const showStatsValue = computed(() => showStats.value);

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

function handleMetricFilter(metricKey) {
  chartFilter.value = {
    type: 'metric',
    value: metricKey,
    filterKey: Date.now(),
  };
}

function handleStationFilter(stationName) {
  chartFilter.value = {
    type: 'station',
    value: stationName,
    filterKey: Date.now(),
  };
}

function handleTrendFilter(time) {
  chartFilter.value = {
    type: 'trendTime',
    value: time,
    filterKey: Date.now(),
  };
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
