<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';

import { UserInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userInfo';
// import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';

import { buildStatsDataFromApi } from './data';
import UserInfoChart from './table/chart.vue';
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
    const data = await UserInfoApi.getUserInfoChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载用户统计失败');
    console.error('[userInfo] load stats failed:', error);
  }
}

const statsData = computed(() => statsDataSource.value);

type ChartRefreshPayload =
  | {
      chartType: string;
      name: string;
      type: 'chart';
    }
  | {
      index: number;
      type: 'card';
    };

async function handleChartRefresh(payload: ChartRefreshPayload) {
  if (payload.type === 'card') {
    if (payload.index === 0) {
      await handleFilterAllUsers();
      return;
    }

    await handleFilterRecentUsers();
    return;
  }

  if (!payload.name) {
    return;
  }

  if (payload.chartType === 'line') {
    await handleFilterByMonth(payload.name);
    return;
  }

  if (payload.chartType === 'bar') {
    await handleFilterByUserType(payload.name);
  }
}

/** 钻取全部用户列表 */
async function handleFilterAllUsers() {
  await tableRef.value?.resetSearch();
}

/** 钻取近 30 天新增用户 */
async function handleFilterRecentUsers() {
  await tableRef.value?.setSearchValues({
    registerTime: [
      dayjs().subtract(30, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ],
  });
}

/** 按月份钻取用户列表 */
async function handleFilterByMonth(month: string) {
  await tableRef.value?.setSearchValues({
    registerTime: [
      dayjs(`${month}-01`).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      dayjs(`${month}-01`).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
    ],
  });
}

/** 按用户类型钻取列表 */
async function handleFilterByUserType(userType: string) {
  await tableRef.value?.setSearchValues({ userType });
}

onMounted(() => {
  void loadStats();
});
</script>

<template>
  <Page auto-content-height class="user-info-page">
    <div class="common-index user-info-index">
      <div v-if="showStats" class="user-info-stats">
        <!--
          原公共统计组件留存：
          <StatsVisualization :data="statsData" />
          该组件暂未消费卡片/图表点击事件，所以本页改为参考 rescueInfo 使用局部图表组件。
        -->
        <UserInfoChart :data="statsData" @refresh="handleChartRefresh" />
      </div>
      <div class="user-info-table-wrap">
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
.user-info-page {
  height: 100%;
}

:deep(.user-info-page .vben-page-content) {
  height: 100%;
}

.user-info-index {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.user-info-stats {
  flex-shrink: 0;
  height: 280px;
  overflow: hidden;
}

.user-info-table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
