<script setup>
import { computed, ref } from 'vue';

import CustomizeGateChart from './customize/gateChart.vue';
import CustomizeTable from './customize/index.vue';
import DayGateChart from './day/gateChart.vue';
import DayTable from './day/index.vue';
import HalfGateChart from './half/gateChart.vue';
import HalfTable from './half/index.vue';
import MontlyGateChart from './montly/gateChart.vue';
import MontlyTable from './montly/index.vue';
import SeasonGateChart from './season/gateChart.vue';
import SeasonTable from './season/index.vue';
import WeekGateChart from './week/gateChart.vue';
import WeekTable from './week/index.vue';
import YearGateChart from './year/gateChart.vue';
import YearTable from './year/index.vue';

import '#/components/page/index.scss';

const activeName = ref('日报');
const tabs = [
  { label: '日报', component: DayTable, gateChart: DayGateChart },
  { label: '周报', component: WeekTable, gateChart: WeekGateChart },
  { label: '月报', component: MontlyTable, gateChart: MontlyGateChart },
  { label: '季报', component: SeasonTable, gateChart: SeasonGateChart },
  { label: '半年报', component: HalfTable, gateChart: HalfGateChart },
  { label: '年报', component: YearTable, gateChart: YearGateChart },
  {
    label: '自定义报表',
    component: CustomizeTable,
    gateChart: CustomizeGateChart,
  },
];

const currentTab = computed(
  () => tabs.find((item) => item.label === activeName.value) || tabs[0],
);
</script>

<template>
  <div class="common-index">
    <component :is="currentTab.gateChart" />
    <el-tabs v-model="activeName" class="common-tabs" type="card">
      <el-tab-pane v-for="item in tabs" :key="item.label" :name="item.label">
        <template #label>{{ item.label }}</template>
        <component :is="item.component" v-if="activeName === item.label" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
