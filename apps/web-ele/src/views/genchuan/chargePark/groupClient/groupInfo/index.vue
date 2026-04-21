<script setup lang="ts">
import type { GroupInfoRow } from './data';

import { computed, nextTick, ref } from 'vue';

import { Page } from '@vben/common-ui';
import dayjs from 'dayjs';

import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';

import { buildAuditLogs, buildStatsData, getMockGroups } from './data';
import Table from './table/index.vue';

import '#/components/page/index.scss';

type TableInstance = {
  recalculateLayout: () => Promise<void> | void;
  resetSearch: () => Promise<void> | void;
  setSearchValues: (values: Record<string, any>) => Promise<void> | void;
};

const tableRef = ref<null | TableInstance>(null);
const showStats = ref(false);
const groups = ref<GroupInfoRow[]>(
  getMockGroups().map((item) => ({
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

const statsData = computed(() => {
  const data = buildStatsData(groups.value);

  return {
    ...data,
    cards: data.cards.map((item, index) => ({
      ...item,
      onClick: index === 0 ? handleFilterAllGroups : handleFilterRecentGroups,
    })),
    charts: data.charts.map((item) => ({
      ...item,
      onClick: (params: { name: string }) => handleFilterByMonth(params.name),
    })),
  };
});

/** 钻取全部集团列表 */
async function handleFilterAllGroups() {
  await tableRef.value?.resetSearch();
}

/** 钻取近 30 天新增集团 */
async function handleFilterRecentGroups() {
  await tableRef.value?.setSearchValues({
    registerTime: [
      dayjs().subtract(30, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ],
  });
}

/** 按月份钻取集团列表 */
async function handleFilterByMonth(month: string) {
  await tableRef.value?.setSearchValues({
    registerTime: [
      dayjs(`${month}-01`).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      dayjs(`${month}-01`).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
    ],
  });
}
</script>

<template>
  <Page auto-content-height class="group-info-page">
    <div class="common-index group-info-index">
      <div v-show="showStats" class="group-info-stats">
        <StatsVisualization :data="statsData" />
      </div>
      <div class="group-info-table-wrap">
        <Table
          ref="tableRef"
          v-model:groups="groups"
          :show-stats="showStats"
          :toggle-stats="toggleStats"
        />
      </div>
    </div>
  </Page>
</template>

<style scoped lang="scss">
.group-info-page {
  height: 100%;
}

:deep(.group-info-page .vben-page-content) {
  height: 100%;
}

.group-info-index {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.group-info-stats {
  flex-shrink: 0;
}

.group-info-table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
