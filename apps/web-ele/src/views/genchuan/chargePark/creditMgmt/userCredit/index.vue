<script setup lang="ts">
import type { UserCreditRow } from './data';

import { computed, nextTick, ref } from 'vue';

import { Page } from '@vben/common-ui';

import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';

import { buildAuditLogs, buildStatsData, getMockCredits } from './data';
import Table from './table/index.vue';

import '#/components/page/index.scss';

type TableInstance = {
  recalculateLayout: () => Promise<void> | void;
  resetSearch: () => Promise<void> | void;
  setSearchValues: (values: Record<string, any>) => Promise<void> | void;
};

const tableRef = ref<null | TableInstance>(null);
const showStats = ref(false);
const credits = ref<UserCreditRow[]>(
  getMockCredits().map((item) => ({
    ...item,
    auditLogs: item.auditLogs?.length ? item.auditLogs : buildAuditLogs(item),
  })),
);

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

const statsData = computed(() => buildStatsData(credits.value));
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
          v-model:credits="credits"
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
}

.user-credit-table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
