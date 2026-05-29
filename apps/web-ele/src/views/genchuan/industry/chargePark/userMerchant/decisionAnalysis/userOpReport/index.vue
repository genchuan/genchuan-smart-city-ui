<script setup lang="ts">
import type { UserOpReportChartReqVO } from '#/api/genchuan/industry/chargePark/userMerchant/decisionAnalysis/userOpReport';

import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { UserOpReportApi } from '#/api/genchuan/industry/chargePark/userMerchant/decisionAnalysis/userOpReport';

import DrillDownDetailDialog from './components/DrillDownDetailDialog.vue';
import UserOpReportStats from './components/UserOpReportStats.vue';
import { buildTopStatsDataFromApi } from './data';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

type TableInstance = {
  handleStatsFilter: (type: string, value?: string) => Promise<void> | void;
  recalculateLayout: () => Promise<void> | void;
  resetSearch: () => Promise<void> | void;
  setSearchValues: (values: Record<string, any>) => Promise<void> | void;
};

const activeName = ref('全部');
const drillDownDialogRef = ref<InstanceType<typeof DrillDownDetailDialog>>();
const tableRef = ref<null | TableInstance>(null);
const showStats = ref(true);
const statsDataSource = ref(buildTopStatsDataFromApi());
const currentChartParams = ref<UserOpReportChartReqVO>();

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

function buildChartParams(params: Partial<UserOpReportChartReqVO> = {}) {
  const chartParams: UserOpReportChartReqVO = {
    tenantId: params.tenantId || 1,
  };

  if (params.reportCycle) {
    chartParams.reportCycle = params.reportCycle;
  }

  if (params.statEndTime) {
    chartParams.statEndTime = params.statEndTime;
  }

  if (params.statStartTime) {
    chartParams.statStartTime = params.statStartTime;
  }

  return chartParams;
}

/** 等待布局稳定后再重算表格 */
function waitForLayoutStable() {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

/** 切换统计区显隐 */
const toggleStats = async () => {
  showStats.value = !showStats.value;

  await nextTick();
  await waitForLayoutStable();
  await tableRef.value?.recalculateLayout();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('resize'));
  }
};

/** 加载统计数据 */
async function loadStats(params?: Partial<UserOpReportChartReqVO>) {
  try {
    const chartParams = buildChartParams(params);
    const data = await UserOpReportApi.getUserOpReportChart(chartParams);
    currentChartParams.value = chartParams;
    statsDataSource.value = buildTopStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildTopStatsDataFromApi();
    ElMessage.error('加载用户运营分析失败');
    console.error('[userOpReport] load stats failed:', error);
  }
}

const statsData = computed(() => statsDataSource.value);
const pieChartOptions = computed(() => statsDataSource.value.pieChartOptions);
const barChartOptions = computed(() => statsDataSource.value.barChartOptions);
const lineChartOptions = computed(() => statsDataSource.value.lineChartOptions);

function openDrillDown(info: {
  drillName?: string;
  drillType: string;
  drillValue?: number | string;
}) {
  drillDownDialogRef.value?.open({
    ...info,
    reportCycle: currentChartParams.value?.reportCycle,
    statEndTime: currentChartParams.value?.statEndTime,
    statStartTime: currentChartParams.value?.statStartTime,
  });
}

async function handleStatsCardClick({
  card,
  type,
}: {
  card: Record<string, any>;
  type: string;
}) {
  openDrillDown({
    drillName: card.title,
    drillType: type,
    drillValue: type,
  });
  await nextTick();
  await tableRef.value?.handleStatsFilter('card', type);
}

function handlePieClick(info: {
  name: string;
  type: string;
  value: number | string;
}) {
  openDrillDown({
    drillName: info.name,
    drillType: info.type,
    drillValue: info.value,
  });
}

function handleBarClick(info: {
  name: string;
  type: string;
  value: number | string;
}) {
  openDrillDown({
    drillName: info.name,
    drillType: info.type,
    drillValue: info.value,
  });
}

function handleLineClick(info: {
  name: string;
  type: string;
  value: number | string;
}) {
  openDrillDown({
    drillName: info.name,
    drillType: info.type,
    drillValue: info.value,
  });
}

async function tabChange(tabName: string) {
  const tab = reportCycleTabs.find((item) => item.label === tabName);
  const reportCycle = tab?.value || '';
  await tableRef.value?.handleStatsFilter('reportCycle', reportCycle);
  await nextTick();
  await tableRef.value?.recalculateLayout();
}

onMounted(() => {
  void loadStats();
});
</script>

<template>
  <div class="common-index">
    <UserOpReportStats
      v-if="showStats"
      :data="statsData"
      :bar-chart-options="barChartOptions"
      :line-chart-options="lineChartOptions"
      :pie-chart-options="pieChartOptions"
      @card-click="handleStatsCardClick"
      @pie-click="handlePieClick"
      @bar-click="handleBarClick"
      @line-click="handleLineClick"
    />
    <DrillDownDetailDialog ref="drillDownDialogRef" />
    <el-tabs
      v-model="activeName"
      class="common-tabs user-op-report-tabs"
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
      </el-tab-pane>
    </el-tabs>
    <Table
      ref="tableRef"
      :reload-stats="loadStats"
      :show-stats="showStats"
      :toggle-stats="toggleStats"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.vxe-pager--wrapper) {
  justify-content: center;
}

:deep(.vxe-grid--pager-wrapper .vxe-pager) {
  position: relative;
  height: 65px;
  margin-top: 0;
}

:deep(.user-merchant-table-grid .vxe-grid--toolbar-wrapper) {
  margin-top: 0;
}

:deep(.user-merchant-table-grid .vxe-toolbar) {
  display: flex;
  align-items: center;
}

:deep(.user-merchant-table-grid .vxe-buttons--wrapper) {
  flex: 1;
  min-width: 0;
  padding-top: 0;
}

:deep(.user-merchant-table-grid .tabel-tabs) {
  flex-wrap: nowrap !important;
  gap: 8px;
  max-width: 100%;
  min-height: 32px;
  overflow: auto hidden;
  white-space: nowrap;
}

:deep(.user-merchant-table-grid .tabel-tabs .el-tag) {
  flex-shrink: 0;
}

:deep(.user-merchant-table-grid .vxe-tools--wrapper),
:deep(.user-merchant-table-grid .vxe-tools--operate) {
  position: static !important;
  flex-shrink: 0;
}

:deep(.park-chart-box) {
  height: 300px;
}

:deep(.park-chart-box .chart-box-left) {
  height: 100%;
}

:deep(.park-chart-box .stat-card) {
  flex: 1 1 0;
  min-height: 0;
}

:deep(.park-chart-box .map-wrapper),
:deep(.park-chart-box .park-type-chart),
:deep(.park-chart-box .simple-bar-chart) {
  height: 100%;
}

:deep(.rule-chart-box),
:deep(.rule-chart-box .chart-box-left),
:deep(.rule-chart-box .charts-wrapper),
:deep(.rule-chart-box .chart-area) {
  height: 300px;
}

:deep(.user-op-report-tabs .el-tabs__content) {
  display: none;
}
</style>
