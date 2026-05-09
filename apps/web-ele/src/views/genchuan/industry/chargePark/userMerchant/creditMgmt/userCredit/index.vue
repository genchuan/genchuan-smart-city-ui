<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { UserCreditApi } from '#/api/genchuan/industry/chargePark/userMerchant/creditMgmt/userCredit';
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
    const data = await UserCreditApi.getUserCreditChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载用户信用统计失败');
    console.error('[userCredit] load stats failed:', error);
  }
}

const statsData = computed(() => {
  const data = statsDataSource.value;

  return {
    ...data,
    cards: data.cards.map((item, index) => ({
      ...item,
      onClick: index === 0 ? handleFilterAllCredits : handleFilterLowCredits,
    })),
    charts: data.charts.map((item) => ({
      ...item,
      onClick:
        item.type === 'pie'
          ? (params: { name: string }) => handleFilterByLevel(params.name)
          : undefined,
    })),
  };
});

/** 钻取全部信用列表 */
async function handleFilterAllCredits() {
  await tableRef.value?.resetSearch();
}

/** 钻取低信用用户列表 */
async function handleFilterLowCredits() {
  await tableRef.value?.setSearchValues({
    creditScore: '0,69',
  });
}

/** 按信用等级钻取列表 */
async function handleFilterByLevel(level: string) {
  await tableRef.value?.setSearchValues({
    creditLevel: level,
  });
}

onMounted(() => {
  void loadStats();
});
</script>

<template>
  <Page auto-content-height class="user-credit-page">
    <div class="common-index user-credit-index">
      <div v-show="showStats" class="user-credit-stats">
        <StatsVisualization :data="statsData" />
      </div>
      <div class="user-credit-table-wrap">
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
.user-credit-page {
  height: 100%;
}

:deep(.user-credit-page .vben-page-content) {
  height: 100%;
}

.user-credit-index {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.user-credit-stats {
  flex-shrink: 0;
  height: 280px;
  overflow: hidden;
}

.user-credit-table-wrap {
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
