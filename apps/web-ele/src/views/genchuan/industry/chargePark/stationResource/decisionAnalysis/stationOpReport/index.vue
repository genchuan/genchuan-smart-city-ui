<script setup>
import { computed, nextTick, ref } from 'vue';

import CustomizeTable from './customize/index.vue';
import StationOpReportStats from './day/gateChart.vue';
import DayTable from './day/index.vue';
import HalfTable from './half/index.vue';
import MontlyTable from './montly/index.vue';
import SeasonTable from './season/index.vue';
import WeekTable from './week/index.vue';
import YearTable from './year/index.vue';

import '#/genchuan-components/page/index.scss';

const showStats = ref(true);
const activeName = ref('全部');
const tableRef = ref(null);

const reportCycleTabs = [
  { label: '全部', value: '', component: DayTable },
  { label: '日报', value: '日报', component: DayTable },
  { label: '周报', value: '周报', component: WeekTable },
  { label: '月报', value: '月报', component: MontlyTable },
  { label: '季报', value: '季报', component: SeasonTable },
  { label: '半年报', value: '半年报', component: HalfTable },
  { label: '年报', value: '年报', component: YearTable },
  { label: '自定义报表', value: '自定义报表', component: CustomizeTable },
];

const activeReportCycle = computed(
  () =>
    reportCycleTabs.find((item) => item.label === activeName.value)?.value ??
    '',
);

const showStatsValue = computed(() => showStats.value);

function toggleStats() {
  showStats.value = !showStats.value;
}

function getCurrentTableRef() {
  const activeIndex = reportCycleTabs.findIndex(
    (item) => item.label === activeName.value,
  );
  if (activeIndex === -1) return null;

  if (Array.isArray(tableRef.value)) {
    return tableRef.value[activeIndex] || null;
  }
  return tableRef.value || null;
}

async function tabChange(tabName) {
  const tab = reportCycleTabs.find((item) => item.label === tabName);
  await nextTick();
  const currentTable = getCurrentTableRef();
  currentTable?.handleStatsFilter?.('reportCycle', tab?.value || '');
}
</script>

<template>
  <div class="common-index station-op-report-page">
    <StationOpReportStats
      v-if="showStats"
      :report-cycle="activeReportCycle || '全部'"
    />

    <el-tabs
      v-model="activeName"
      class="common-tabs"
      type="card"
      @tab-change="tabChange"
    >
      <el-tab-pane
        v-for="item in reportCycleTabs"
        :key="item.label"
        :name="item.label"
      >
        <template #label>
          <div class="table-first">
            <span>{{ item.label }}</span>
          </div>
        </template>
        <component
          :is="item.component"
          v-if="activeName === item.label"
          :key="item.label"
          ref="tableRef"
          :active-report-cycle="item.value"
          :show-stats="showStatsValue"
          :toggle-stats="toggleStats"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.station-op-report-page {
  :deep(.rule-chart-box) {
    margin-bottom: 0.5rem;
  }
}
</style>
