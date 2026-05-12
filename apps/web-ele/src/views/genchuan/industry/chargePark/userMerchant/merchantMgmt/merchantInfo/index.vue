<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';

import { MerchantInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/merchantMgmt/merchantInfo';
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
    const data = await MerchantInfoApi.getMerchantInfoChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载商户统计失败');
    console.error('[merchantInfo] load stats failed:', error);
  }
}

const statsData = computed(() => statsDataSource.value);

async function handleMerchantInfoCardClick({ index }: { index: number }) {
  if (index === 0) {
    await handleFilterAllMerchants();
    return;
  }

  await handleFilterRecentMerchants();
}

async function handleMerchantInfoLineClick({ name }: { name: string }) {
  await handleFilterByMonth(name);
}

async function handleMerchantInfoBarClick({ name }: { name: string }) {
  await handleFilterByMerchantType(name);
}

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
  const range = buildDateRangeByChartName(month);

  if (!range) {
    return;
  }

  await tableRef.value?.setSearchValues({ registerTime: range });
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
  <div class="common-index">
    <StatsVisualization
      v-if="showStats"
      :data="statsData"
      @bar-click="handleMerchantInfoBarClick"
      @card-click="handleMerchantInfoCardClick"
      @line-click="handleMerchantInfoLineClick"
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
