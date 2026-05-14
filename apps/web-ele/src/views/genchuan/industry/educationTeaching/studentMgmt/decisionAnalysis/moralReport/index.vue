<script setup>
import { ref, nextTick, onMounted, computed } from 'vue';

import Chart from './components/chart.vue';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

const showStats = ref(true);
const toggleStats = () => {
  showStats.value = !showStats.value;
  if (showStats.value) {
    chartRef.value?.refreshData();
  }
};

const drillDownDialogRef = ref(null);
const chartRef = ref(null);

const reportCycleTabs = [
  {label: '全部', value: ''},
  {label: '日报', value: '日报'},
  {label: '周报', value: '周报'},
  {label: '月报', value: '月报'},
  {label: '季报', value: '季报'},
  {label: '半年报', value: '半年报'},
  {label: '年报', value: '年报'},
  {label: '自定义报表', value: '自定义报表'},
];

const tabArray = ref(
  reportCycleTabs.map((tab) => ({
    label: tab.label,
    value: tab.value,
    components: Table,
    showSecondary: true,
    secondShow: false,
  })),
);

const activeName = ref(reportCycleTabs[0].label);
const secondShow = ref(false);
const tableRef = ref(null);

const changeArrowStatus = () => {
  secondShow.value = !secondShow.value;
  tabArray.value.forEach((v) => {
    v.secondShow = secondShow.value;
  });
};

const showStatsValue = computed(() => showStats.value);

const getCurrentTableRef = () => {
  const activeIndex = reportCycleTabs.findIndex((t) => t.label === activeName.value);
  if (activeIndex === -1) return null;
  if (Array.isArray(tableRef.value)) {
    return tableRef.value[activeIndex] &&
    typeof tableRef.value[activeIndex].handleStatsFilter === 'function'
      ? tableRef.value[activeIndex]
      : null;
  }
  return tableRef.value && typeof tableRef.value.handleStatsFilter === 'function'
    ? tableRef.value
    : null;
};

// 根据报表周期生成统计时段字符串（与图表组件内部逻辑保持一致）
const getStatisticalPeriodByReportCycle = (reportPeriod) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const pad = (n) => String(n).padStart(2, '0');

  switch (reportPeriod) {
    case '日报':
      const todayStr = `${year}-${pad(month)}-${pad(date)}`;
      return `${todayStr} 至 ${todayStr}`;
    case '周报': {
      const dayOfWeek = now.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + mondayOffset);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const format = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      return `${format(monday)} 至 ${format(sunday)}`;
    }
    case '月报': {
      const firstDay = `${year}-${pad(month)}-01`;
      const lastDay = `${year}-${pad(month)}-${new Date(year, month, 0).getDate()}`;
      return `${firstDay} 至 ${lastDay}`;
    }
    case '季报': {
      const quarter = Math.ceil(month / 3);
      const firstMonth = (quarter - 1) * 3 + 1;
      const lastMonth = quarter * 3;
      const firstDay = `${year}-${pad(firstMonth)}-01`;
      const lastDay = `${year}-${pad(lastMonth)}-${new Date(year, lastMonth, 0).getDate()}`;
      return `${firstDay} 至 ${lastDay}`;
    }
    case '半年报': {
      const half = month <= 6 ? 1 : 2;
      const firstMonth = half === 1 ? 1 : 7;
      const lastMonth = half === 1 ? 6 : 12;
      const firstDay = `${year}-${pad(firstMonth)}-01`;
      const lastDay = `${year}-${pad(lastMonth)}-${new Date(year, lastMonth, 0).getDate()}`;
      return `${firstDay} 至 ${lastDay}`;
    }
    case '年报':
      return `${year}-01-01 至 ${year}-12-31`;
    case '自定义报表':
    default:
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      const formatDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      return `${formatDate(start)} 至 ${formatDate(end)}`;
  }
};

const tabChange = (tabName) => {
  const tab = reportCycleTabs.find((t) => t.label === tabName);
  const currentTable = getCurrentTableRef();
  if (tab && currentTable) {
    currentTable.handleStatsFilter('reportCycle', tab.value);
  }

  // 图表组件刷新：根据选中的报表周期生成统计时段并传参
  if (!tab) return;
  const reportCycleValue = tab.value;
  if (reportCycleValue === '') {
    // “全部”标签：让图表使用内部默认参数（月报）
    chartRef.value?.refreshData();
  } else {
    const statisticalPeriod = getStatisticalPeriodByReportCycle(reportCycleValue);
    chartRef.value?.refreshData({
      reportPeriod: reportCycleValue,
      statisticalPeriod,
    });
  }
};

const openDrillDialogAndFilter = async (drillType, drillValue, drillName, reportCycle) => {
  if (drillDownDialogRef.value) {
    drillDownDialogRef.value.open({
      drillType,
      drillValue,
      drillName,
      reportCycle,
    });
  }
  await nextTick();
  const currentTable = getCurrentTableRef();
  if (currentTable) {
    currentTable.handleStatsFilter(drillType, drillValue);
  }
};

// 柱状图钻取：班级德育得分排名 -> 跳转班级德育明细弹窗
const handleRankBarClick = (drillInfo) => {
  console.log('班级排名柱状图钻取:', drillInfo);
  const currentTable = getCurrentTableRef();
  if (currentTable) {
    currentTable.handleStatsFilter('classRankBar', drillInfo.className);
  }
};

// 柱状图钻取：各校区文明班级数量 -> 筛选该校区文明班级列表
const handleCampusBarClick = (drillInfo) => {
  console.log('校区文明班级柱状图钻取:', drillInfo);
  const currentTable = getCurrentTableRef();
  if (currentTable) {
    currentTable.handleStatsFilter('campusBar', drillInfo.campus);
  }
};

onMounted(() => {
  setTimeout(() => {
    const currentTable = getCurrentTableRef();
    if (currentTable) {
      currentTable.handleStatsFilter('reportCycle', reportCycleTabs[0].value);
    }
  }, 300);
});
</script>

<template>
  <div class="common-index">
    <Chart
      v-if="showStats"
      ref="chartRef"
      @rank-bar-click="handleRankBarClick"
      @campus-bar-click="handleCampusBarClick"
    />
    <el-tabs v-model="activeName" class="common-tabs" type="card" @tab-change="tabChange">
      <el-tab-pane v-for="item in tabArray" :key="item.label" :name="item.label">
        <template #label>
          <div class="table-first">
            <span>{{ item.label }}</span>
          </div>
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
