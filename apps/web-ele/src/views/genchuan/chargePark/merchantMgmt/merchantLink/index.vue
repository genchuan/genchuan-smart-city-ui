<script setup lang="ts">
import type { MerchantLinkRow } from './data';

import { computed, nextTick, ref } from 'vue';

import { Page } from '@vben/common-ui';

import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';

import { buildStatsData, getMockMerchantLinks } from './data';
import Table from './table/index.vue';

import '#/components/page/index.scss';

type TableInstance = {
  recalculateLayout: () => Promise<void> | void;
  resetSearch: () => Promise<void> | void;
  setSearchValues: (values: Record<string, any>) => Promise<void> | void;
};

const tableRef = ref<null | TableInstance>(null);
const showStats = ref(false);
const links = ref<MerchantLinkRow[]>(getMockMerchantLinks());

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
  const data = buildStatsData(links.value);

  return {
    ...data,
    cards: data.cards.map((item, index) => ({
      ...item,
      onClick: index === 0 ? handleFilterLinked : handleFilterLinked,
    })),
    charts: data.charts.map((item) => ({
      ...item,
      onClick: (params: { name: string }) =>
        handleFilterByLinkType(params.name),
    })),
  };
});

/** 钻取已对接记录 */
async function handleFilterLinked() {
  await tableRef.value?.setSearchValues({ status: '已对接' });
}

/** 按对接类型钻取列表 */
async function handleFilterByLinkType(linkType: string) {
  await tableRef.value?.setSearchValues({ linkType });
}
</script>

<template>
  <Page auto-content-height class="merchant-link-page">
    <div class="common-index merchant-link-index">
      <div v-show="showStats" class="merchant-link-stats">
        <StatsVisualization :data="statsData" />
      </div>
      <div class="merchant-link-table-wrap">
        <Table
          ref="tableRef"
          v-model:links="links"
          :show-stats="showStats"
          :toggle-stats="toggleStats"
        />
      </div>
    </div>
  </Page>
</template>

<style scoped lang="scss">
.merchant-link-page {
  height: 100%;
}

:deep(.merchant-link-page .vben-page-content) {
  height: 100%;
}

.merchant-link-index {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.merchant-link-stats {
  flex-shrink: 0;
}

.merchant-link-table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
