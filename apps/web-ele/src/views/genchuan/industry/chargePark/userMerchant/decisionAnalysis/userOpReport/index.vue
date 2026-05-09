<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { UserOpReportApi } from '#/api/genchuan/industry/chargePark/userMerchant/decisionAnalysis/userOpReport';

import DrillDownDetailDialog from './components/DrillDownDetailDialog.vue';
import UserOpReportStats from './components/UserOpReportStats.vue';
import { buildStatsDataFromApi } from './data';
import Table from './table/index.vue';

import '#/components/page/index.scss';

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
const statsDataSource = ref(buildStatsDataFromApi());

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
async function loadStats() {
  try {
    const data = await UserOpReportApi.getUserOpReportChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载用户运营分析失败');
    console.error('[userOpReport] load stats failed:', error);
  }
}

const statsData = computed(() => statsDataSource.value);

function openDrillDown(info: {
  drillName?: string;
  drillType: string;
  drillValue?: number | string;
}) {
  drillDownDialogRef.value?.open(info);
}

function handleStatsCardClick({
  card,
  index,
}: {
  card: Record<string, any>;
  index: number;
}) {
  const drillTypes = [
    'totalUserCount',
    'totalMemberCount',
    'avgCreditScore',
    'userGrowthRate',
  ];

  openDrillDown({
    drillName: card.title,
    drillType: drillTypes[index] || 'totalUserCount',
    drillValue: card.value,
  });
}

function handleStatsChartClick({
  chart,
  name,
  value,
}: {
  chart: Record<string, any>;
  name: string;
  value: number | string;
}) {
  openDrillDown({
    drillName: name,
    drillType: chart.type === 'line' ? 'userOpTrend' : 'userTypeDistribution',
    drillValue: value,
  });
}

async function tabChange(tabName: string) {
  const tab = reportCycleTabs.find((item) => item.label === tabName);
  await tableRef.value?.handleStatsFilter('reportType', tab?.value || '');
  await nextTick();
  await tableRef.value?.recalculateLayout();
}

onMounted(() => {
  void loadStats();
});
</script>

<template>
  <Page auto-content-height class="user-op-report-page">
    <div class="common-index user-op-report-index">
      <div v-show="showStats" class="user-op-report-stats">
        <UserOpReportStats
          :data="statsData"
          @card-click="handleStatsCardClick"
          @chart-click="handleStatsChartClick"
        />
      </div>
      <DrillDownDetailDialog ref="drillDownDialogRef" />
      <div class="user-op-report-table-wrap">
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
        <div class="user-op-report-table-panel">
          <Table
            ref="tableRef"
            :reload-stats="loadStats"
            :show-stats="showStats"
            :toggle-stats="toggleStats"
          />
        </div>
      </div>
    </div>
  </Page>
</template>

<style scoped lang="scss">
.user-op-report-page {
  height: 100%;
}

:deep(.user-op-report-page .vben-page-content) {
  height: 100%;
}

.user-op-report-index {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.user-op-report-stats {
  flex-shrink: 0;
}

.user-op-report-table-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.user-op-report-tabs {
  flex-shrink: 0;
}

.user-op-report-table-panel {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

:deep(.user-op-report-tabs .el-tabs__content) {
  display: none;
}
</style>
