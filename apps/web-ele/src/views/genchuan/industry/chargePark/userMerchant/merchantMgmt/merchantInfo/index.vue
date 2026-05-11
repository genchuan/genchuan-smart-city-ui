<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';

import { MerchantInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';
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
    const data = await MerchantInfoApi.getMerchantInfoChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载商户统计失败');
    console.error('[merchantInfo] load stats failed:', error);
  }
}

const statsData = computed(() => {
  const data = statsDataSource.value;

  return {
    ...data,
    cards: data.cards.map((item, index) => ({
      ...item,
      onClick:
        index === 0 ? handleFilterAllMerchants : handleFilterRecentMerchants,
    })),
    charts: data.charts.map((item) => {
      if (item.type === 'line') {
        return {
          ...item,
          onClick: (params: { name: string }) =>
            handleFilterByMonth(params.name),
        };
      }

      if (item.type === 'bar') {
        return {
          ...item,
          onClick: (params: { name: string }) =>
            handleFilterByMerchantType(params.name),
        };
      }

      return item;
    }),
  };
});

/** 钻取全部商户列表 */
async function handleFilterAllMerchants() {
  await tableRef.value?.resetSearch();
}

/** 钻取近30天新增商户 */
async function handleFilterRecentMerchants() {
  await tableRef.value?.setSearchValues({
    registerTime: [
      dayjs().subtract(30, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ],
  });
}

/** 按月份钻取商户列表 */
async function handleFilterByMonth(month: string) {
  await tableRef.value?.setSearchValues({
    registerTime: [
      dayjs(`${month}-01`).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      dayjs(`${month}-01`).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
    ],
  });
}

/** 按商户类型钻取列表 */
async function handleFilterByMerchantType(merchantType: string) {
  await tableRef.value?.setSearchValues({ merchantType });
}

onMounted(() => {
  void loadStats();
});
</script>

<template>
  <Page auto-content-height class="merchant-info-page">
    <div class="common-index merchant-info-index">
      <div v-show="showStats" class="merchant-info-stats">
        <StatsVisualization :data="statsData" />
      </div>
      <div class="merchant-info-table-wrap">
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
.merchant-info-page {
  height: 100%;
}

:deep(.merchant-info-page .vben-page-content) {
  height: 100%;
}

.merchant-info-index {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.merchant-info-stats {
  flex-shrink: 0;
  height: 280px;
  overflow: hidden;
}

.merchant-info-table-wrap {
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
