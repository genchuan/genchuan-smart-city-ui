<script setup lang="ts">
import type { MerchantSendCouponRow } from './data';

import { computed, nextTick, ref } from 'vue';

import { Page } from '@vben/common-ui';
import dayjs from 'dayjs';

import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';

import { buildStatsData, getMockMerchantCoupons } from './data';
import Table from './table/index.vue';

import '#/components/page/index.scss';

type TableInstance = {
  recalculateLayout: () => Promise<void> | void;
  resetSearch: () => Promise<void> | void;
  setSearchValues: (values: Record<string, any>) => Promise<void> | void;
};

const tableRef = ref<null | TableInstance>(null);
const showStats = ref(false);
const coupons = ref<MerchantSendCouponRow[]>(getMockMerchantCoupons());

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

const statsData = computed(() => {
  const data = buildStatsData(coupons.value);

  return {
    ...data,
    cards: data.cards.map((item, index) => ({
      ...item,
      onClick: index === 0 ? handleFilterAll : handleFilterExecuted,
    })),
    charts: data.charts.map((item) => ({
      ...item,
      onClick: (params: { name: string }) => handleFilterByMonth(params.name),
    })),
  };
});

/** 钻取全部发券记录 */
async function handleFilterAll() {
  await tableRef.value?.resetSearch();
}

/** 钻取已执行发券记录 */
async function handleFilterExecuted() {
  await tableRef.value?.setSearchValues({ status: '已执行' });
}

/** 按月份钻取发券记录 */
async function handleFilterByMonth(month: string) {
  await tableRef.value?.setSearchValues({
    execTime: [
      dayjs(`${month}-01`).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      dayjs(`${month}-01`).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
    ],
  });
}
</script>

<template>
  <Page auto-content-height class="merchant-send-coupon-page">
    <div class="common-index merchant-send-coupon-index">
      <div v-show="showStats" class="merchant-send-coupon-stats">
        <StatsVisualization :data="statsData" />
      </div>
      <div class="merchant-send-coupon-table-wrap">
        <Table
          ref="tableRef"
          v-model:coupons="coupons"
          :show-stats="showStats"
          :toggle-stats="toggleStats"
        />
      </div>
    </div>
  </Page>
</template>

<style scoped lang="scss">
.merchant-send-coupon-page {
  height: 100%;
}

:deep(.merchant-send-coupon-page .vben-page-content) {
  height: 100%;
}

.merchant-send-coupon-index {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.merchant-send-coupon-stats {
  flex-shrink: 0;
}

.merchant-send-coupon-table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
