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

// 异常人数柱状图钻取 -> 打开该班级异常学生明细弹窗
const handleAbnormalBarClick = (drillInfo) => {
  console.log('异常人数柱状图钻取:', drillInfo);
  const currentTable = getCurrentTableRef();
  if (currentTable) {
    currentTable.handleStatsFilter('abnormalBar', drillInfo.className);
  }
};

// 在寝率柱状图钻取 -> 打开该班级考勤全量数据明细弹窗
const handleInDormRateBarClick = (drillInfo) => {
  console.log('在寝率柱状图钻取:', drillInfo);
  const currentTable = getCurrentTableRef();
  if (currentTable) {
    currentTable.handleStatsFilter('inDormRateBar', drillInfo.className);
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
      @abnormal-bar-click="handleAbnormalBarClick"
      @in-dorm-rate-bar-click="handleInDormRateBarClick"
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
