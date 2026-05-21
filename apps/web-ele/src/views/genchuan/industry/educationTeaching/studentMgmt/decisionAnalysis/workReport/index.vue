<script setup>
import { ref, nextTick, onMounted, computed } from 'vue';
import Chart from './components/chart.vue';
import Table from './table/index.vue';
import '#/genchuan-components/page/index.scss';

const showStats = ref(true);
const toggleStats = () => {
  showStats.value = !showStats.value;
  if (showStats.value) chartRef.value?.refreshData();
};

const chartRef = ref(null);
const tableRef = ref(null);
const secondShow = ref(false);

const reportCycleTabs = [
  { label: '全部', value: '' },
  { label: '日报', value: '日报' },
  { label: '周报', value: '周报' },
  { label: '月报', value: '月报' },
  { label: '季报', value: '季报' },
  { label: '半年报', value: '半年报' },
  { label: '年报', value: '年报' },
  { label: '自定义报表', value: '自定义报表' },
];

const tabArray = ref(reportCycleTabs.map(tab => ({
  label: tab.label,
  value: tab.value,
  components: Table,
  showSecondary: true,
  secondShow: false,
})));

const activeName = ref(reportCycleTabs[0].label);
const showStatsValue = computed(() => showStats.value);

const getCurrentTableRef = () => {
  const activeIndex = reportCycleTabs.findIndex(t => t.label === activeName.value);
  if (activeIndex === -1) return null;
  return tableRef.value?.[activeIndex] || null;
};

const getStatTimeByReportCycle = (reportCycle) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  let statStartTime, statEndTime;
  switch (reportCycle) {
    case '日报':
      statStartTime = new Date(year, month, date, 0, 0, 0).getTime();
      statEndTime = new Date(year, month, date, 23, 59, 59).getTime();
      break;
    case '周报': {
      const dayOfWeek = now.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + mondayOffset);
      monday.setHours(0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59);
      statStartTime = monday.getTime();
      statEndTime = sunday.getTime();
      break;
    }
    case '月报':
      statStartTime = new Date(year, month, 1, 0, 0, 0).getTime();
      statEndTime = new Date(year, month + 1, 0, 23, 59, 59).getTime();
      break;
    case '季报': {
      const quarter = Math.floor(month / 3);
      const startMonth = quarter * 3;
      statStartTime = new Date(year, startMonth, 1, 0, 0, 0).getTime();
      statEndTime = new Date(year, startMonth + 3, 0, 23, 59, 59).getTime();
      break;
    }
    case '半年报': {
      const half = month < 6 ? 0 : 6;
      statStartTime = new Date(year, half, 1, 0, 0, 0).getTime();
      statEndTime = new Date(year, half + 6, 0, 23, 59, 59).getTime();
      break;
    }
    case '年报':
      statStartTime = new Date(year, 0, 1, 0, 0, 0).getTime();
      statEndTime = new Date(year, 11, 31, 23, 59, 59).getTime();
      break;
    default:
      statStartTime = new Date(now.setDate(now.getDate() - 29)).getTime();
      statEndTime = new Date().getTime();
  }
  return { statStartTime, statEndTime };
};

const tabChange = (tabName) => {
  const tab = reportCycleTabs.find(t => t.label === tabName);
  const currentTable = getCurrentTableRef();
  if (tab && currentTable) currentTable.handleStatsFilter('reportCycle', tab.value);
  if (!tab) return;
  if (tab.value === '') chartRef.value?.refreshData();
  else {
    const { statStartTime, statEndTime } = getStatTimeByReportCycle(tab.value);
    chartRef.value?.refreshData({ reportPeriod: tab.value, statStartTime, statEndTime });
  }
};

const handleCardClick = (info) => {
  const currentTable = getCurrentTableRef();
  if (currentTable) currentTable.handleFieldDrill?.(info.title, { [info.title]: info.value });
};

const handlePieClick = (info) => {
  const currentTable = getCurrentTableRef();
  if (currentTable) currentTable.handleStatsFilter?.('pie', info.name);
};

const handleRadarClick = (info) => {
  const currentTable = getCurrentTableRef();
  if (currentTable) currentTable.handleStatsFilter?.('radar', info.name);
};

const handleBarClick = (info) => {
  const currentTable = getCurrentTableRef();
  if (currentTable) currentTable.handleStatsFilter?.('bar', info);
};

const handleLineClick = (info) => {
  const currentTable = getCurrentTableRef();
  if (currentTable) currentTable.handleStatsFilter?.('line', { className: info.seriesName, date: info.categoryName });
};

onMounted(() => {
  setTimeout(() => {
    const currentTable = getCurrentTableRef();
    if (currentTable) currentTable.handleStatsFilter?.('reportCycle', reportCycleTabs[0].value);
  }, 300);
});
</script>

<template>
  <div class="common-index">
    <Chart
      v-if="showStats"
      ref="chartRef"
      @card-click="handleCardClick"
      @pie-click="handlePieClick"
      @radar-click="handleRadarClick"
      @bar-click="handleBarClick"
      @line-click="handleLineClick"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card" @tab-change="tabChange">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first"><span>{{ item.label }}</span></div>
        </template>
        <component
          :is="item.components"
          ref="tableRef"
          :second-show="item.secondShow"
          :show-stats="showStatsValue"
          :toggle-stats="toggleStats"
          :key="item.label"
          :active-report-cycle="item.value"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
