<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';

import { MerchantSendCouponApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantSendCoupon';
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
    const data = await MerchantSendCouponApi.getMerchantSendCouponChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载商户发券统计失败');
    console.error('[merchantSendCoupon] load stats failed:', error);
  }
}

const statsData = computed(() => {
  const data = statsDataSource.value;

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

onMounted(() => {
  void loadStats();
});
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
          :reload-stats="loadStats"
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
  height: 280px;
  overflow: hidden;
}

.merchant-send-coupon-table-wrap {
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
