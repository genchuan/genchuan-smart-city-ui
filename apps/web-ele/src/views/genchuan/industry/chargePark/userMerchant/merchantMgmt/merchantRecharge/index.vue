<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';

import { MerchantRechargeApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantRecharge';
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
    const data = await MerchantRechargeApi.getMerchantRechargeChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载商户充值统计失败');
    console.error('[merchantRecharge] load stats failed:', error);
  }
}

const statsData = computed(() => {
  const data = statsDataSource.value;

  return {
    ...data,
    cards: data.cards.map((item, index) => ({
      ...item,
      onClick: index === 0 ? handleFilterAll : handleFilterSuccess,
    })),
    charts: data.charts.map((item) => ({
      ...item,
      onClick: (params: { name: string }) => handleFilterByMonth(params.name),
    })),
  };
});

/** 钻取全部充值记录 */
async function handleFilterAll() {
  await tableRef.value?.resetSearch();
}

/** 钻取已生效记录 */
async function handleFilterSuccess() {
  await tableRef.value?.setSearchValues({ status: '已生效' });
}

/** 按月份钻取充值记录 */
async function handleFilterByMonth(month: string) {
  await tableRef.value?.setSearchValues({
    payTime: [
      dayjs(`${month}-01`).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      dayjs(`${month}-01`).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
    ],
  });
}

onMounted(() => {
  void loadStats();
});
</script>

<template>
  <Page auto-content-height class="merchant-recharge-page">
    <div class="common-index merchant-recharge-index">
      <div v-show="showStats" class="merchant-recharge-stats">
        <StatsVisualization :data="statsData" />
      </div>
      <div class="merchant-recharge-table-wrap">
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
.merchant-recharge-page {
  height: 100%;
}

:deep(.merchant-recharge-page .vben-page-content) {
  height: 100%;
}

.merchant-recharge-index {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.merchant-recharge-stats {
  flex-shrink: 0;
}

.merchant-recharge-table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
