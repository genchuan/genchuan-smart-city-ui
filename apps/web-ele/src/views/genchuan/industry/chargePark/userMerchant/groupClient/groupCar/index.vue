<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { GroupCarApi } from '#/api/genchuan/industry/chargePark/userMerchant/groupClient/groupCar';
import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';

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
    const data = await GroupCarApi.getGroupCarChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载集团车辆统计失败');
    console.error('[groupCar] load stats failed:', error);
  }
}

const statsData = computed(() => statsDataSource.value);

/** 钻取已绑定车辆 */
async function handleFilterBoundCars() {
  await tableRef.value?.setSearchValues({ status: '已绑定' });
}

/** 钻取已审核通过车辆 */
async function handleFilterApprovedCars() {
  await tableRef.value?.setSearchValues({ status: '已绑定' });
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
