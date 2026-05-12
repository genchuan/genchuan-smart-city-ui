<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { PlateAuthApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/plateAuth';
import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';
import { buildDateRangeByChartName } from '#/views/genchuan/industry/chargePark/userMerchant/utils/chartDrill';

import { buildStatsDataFromApi } from './data';
import Table from './table/index.vue';

import '#/genchuan-components/page/index.scss';

type TableInstance = {
  recalculateLayout: () => Promise<void> | void;
  resetSearch: () => Promise<void> | void;
  setSearchValues: (values: Record<string, any>) => Promise<void> | void;
};

const tableRef = ref<null | TableInstance>(null);
const showStats = ref(false);
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
    const data = await PlateAuthApi.getPlateAuthChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载认证统计失败');
    console.error('[plateAuth] load stats failed:', error);
  }
}

const statsData = computed(() => statsDataSource.value);

/** 钻取全部认证记录 */
async function handleFilterAllAuths() {
  await tableRef.value?.resetSearch();
}

/** 钻取已认证记录 */
async function handleFilterApprovedAuths() {
  await tableRef.value?.setSearchValues({ status: '已认证' });
}

/** 按月份钻取认证记录 */
async function handleFilterByMonth(month: string) {
  const range = buildDateRangeByChartName(month);

  if (!range) {
    return;
  }

  await tableRef.value?.setSearchValues({ applyTime: range });
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
      @card-click="
        ({ index }) =>
          index === 0 ? handleFilterAllAuths() : handleFilterApprovedAuths()
      "
      @line-click="({ name }) => handleFilterByMonth(name)"
    />
    <Table
      ref="tableRef"
      :reload-stats="loadStats"
      :show-stats="showStats"
      :toggle-stats="toggleStats"
    />
  </div>
</template>

<style scoped lang="scss">
@import '#/views/genchuan/industry/chargePark/userMerchant/utils/tablePager.scss';
</style>
