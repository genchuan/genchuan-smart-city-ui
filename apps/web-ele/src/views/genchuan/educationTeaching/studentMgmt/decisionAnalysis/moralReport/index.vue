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
  { label: '全部', value: '' },
  { label: '日报', value: '日报' },
  { label: '周报', value: '周报' },
  { label: '月报', value: '月报' },
  { label: '季报', value: '季报' },
  { label: '半年报', value: '半年报' },
  { label: '年报', value: '年报' },
  { label: '自定义报表', value: '自定义报表' },
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

const tabChange = (tabName) => {
  const tab = reportCycleTabs.find((t) => t.label === tabName);
  const currentTable = getCurrentTableRef();
  if (tab && currentTable) {
    currentTable.handleStatsFilter('reportCycle', tab.value);
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
  // 传递给表格组件，打开德育明细弹窗
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
