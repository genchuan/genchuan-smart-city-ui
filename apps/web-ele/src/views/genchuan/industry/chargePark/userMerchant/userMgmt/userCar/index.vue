<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { UserCarApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userCar';
import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';

import { buildStatsDataFromApi } from './data';
import Table from './table/index.vue';

import '#/components/page/index.scss';

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
    const data = await UserCarApi.getUserCarChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载用户车辆统计失败');
    console.error('[userCar] load stats failed:', error);
  }
}

const statsData = computed(() => {
  const data = statsDataSource.value;

  return {
    ...data,
    cards: data.cards.map((item, index) => ({
      ...item,
      onClick: index === 0 ? handleFilterBoundCars : handleFilterApprovedCars,
    })),
    charts: data.charts.map((item) => {
      if (item.type === 'bar') {
        return {
          ...item,
          onClick: (params: { name: string }) =>
            handleFilterByCarType(params.name),
        };
      }

      return item;
    }),
  };
});

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
  <Page auto-content-height class="user-car-page">
    <div class="common-index user-car-index">
      <div v-show="showStats" class="user-car-stats">
        <StatsVisualization :data="statsData" />
      </div>
      <div class="user-car-table-wrap">
        <Table
          ref="tableRef"
          :reload-stats="loadStats"
          :show-stats="showStats"
          :toggle-stats="toggleStats"
        />
      </div>
    </div>
  </Page>
</template>

<style scoped lang="scss">
.user-car-page {
  height: 100%;
}

:deep(.user-car-page .vben-page-content) {
  height: 100%;
}

.user-car-index {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.user-car-stats {
  flex-shrink: 0;
  height: 280px;
  overflow: hidden;
}

.user-car-table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

:deep(.park-chart-box) {
  min-height: 280px;
}

:deep(.simple-bar-chart),
:deep(.park-type-chart) {
  height: 280px;
}
</style>
