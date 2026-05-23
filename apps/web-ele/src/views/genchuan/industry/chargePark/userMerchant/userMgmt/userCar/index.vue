<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { UserCarApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userCar';
import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';

import PageTabsShell from '../../components/PageTabsShell.vue';
import { buildStatsDataFromApi } from './data';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

type TableInstance = {
  recalculateLayout: () => Promise<void> | void;
  resetSearch: () => Promise<void> | void;
  setSearchValues: (values: Record<string, any>) => Promise<void> | void;
};

const tableRef = ref<null | TableInstance>(null);
const showStats = ref(true);
const statsDataSource = ref(buildStatsDataFromApi());

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
    const data = await UserCarApi.getUserCarChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载用户车辆统计失败');
    console.error('[userCar] load stats failed:', error);
  }
}

const statsData = computed(() => statsDataSource.value);

/** 钻取已绑定车辆 */
async function handleFilterBoundCars() {
  await tableRef.value?.setSearchValues({
    status: '已绑定',
  });
}

/** 钻取已审核通过车辆 */
async function handleFilterApprovedCars() {
  await tableRef.value?.setSearchValues({
    status: '已绑定',
  });
}

/** 按车辆类型钻取列表 */
async function handleFilterByCarType(carType: string) {
  await tableRef.value?.setSearchValues({ carType });
}

onMounted(() => {
  void loadStats();
});
</script>

<template>
  <div class="common-index">
    <StatsVisualization
      v-if="showStats"
      :data="statsData"
      @bar-click="({ name }) => handleFilterByCarType(name)"
      @card-click="
        ({ index }) =>
          index === 0 ? handleFilterBoundCars() : handleFilterApprovedCars()
      "
    />
    <PageTabsShell title="用户车辆">
      <Table
        ref="tableRef"
        :reload-stats="loadStats"
        :show-stats="showStats"
        :toggle-stats="toggleStats"
      />
    </PageTabsShell>
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
</style>
