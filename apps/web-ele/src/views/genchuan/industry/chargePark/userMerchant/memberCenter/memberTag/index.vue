<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  MemberTagPageReqVO,
  MemberTagVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberTag';
import type {
  ActiveFilterTag,
  FilterTagConfig,
} from '#/views/genchuan/industry/chargePark/userMerchant/memberCenter/utils';

import { computed, onMounted, ref } from 'vue';

import { confirm, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { MemberTagApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberTag';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import StatsVisualization from '#/genchuan-components/stats/StatsVisualization.vue';

import {
  buildActiveFilterTags,
  cleanQueryParams,
  formatNormalStatus,
  isEnabledStatus,
  refreshStatsLayout,
  STATUS_ENABLED,
} from '../utils';
import {
  buildStatsDataFromApi,
  memberTagDetailFields,
  useGridColumns,
  useGridFormSchema,
} from './data';
import Form from './modules/form.vue';

import '#/genchuan-components/page/index.scss';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<MemberTagVO>();
const drillFilters = ref<Record<string, any>>({});
const searchParams = ref<Record<string, any>>({});
const statsDataSource = ref(buildStatsDataFromApi());
const showStats = ref(true);

const drillFilterConfigs: Record<string, FilterTagConfig> = {
  name: {
    label: '标签名称',
    type: 'primary',
  },
  status: {
    formatter: formatNormalStatus,
    label: '状态',
    type: 'success',
  },
};

const searchFilterConfigs: Record<string, FilterTagConfig> = {
  createTime: {
    label: '创建时间',
    type: 'danger',
  },
  name: {
    label: '标签名称',
    type: 'info',
  },
  status: {
    formatter: formatNormalStatus,
    label: '状态',
    type: 'success',
  },
};

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
});

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      clearable: true,
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onQuerySubmit,
  layout: 'horizontal',
  schema: useGridFormSchema().map((item) => ({
    ...item,
    rules: undefined,
  })),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

async function loadStats() {
  try {
    const data = await MemberTagApi.getMemberTagChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载会员标签统计失败');
    console.error('[memberTag] load stats failed:', error);
  }
}

const statsData = computed(() => statsDataSource.value);
const activeFilterTags = computed<ActiveFilterTag[]>(() =>
  buildActiveFilterTags([
    {
      configs: drillFilterConfigs,
      source: 'drill',
      values: drillFilters.value,
    },
    {
      configs: searchFilterConfigs,
      source: 'search',
      values: searchParams.value,
    },
  ]),
);

async function onQuerySubmit(values: Record<string, any>) {
  searchParams.value = { ...values };
  drillFilters.value = {};
  await handleRefresh();
  drawerApi.close();
}

function handleRefresh() {
  gridApi.reload();
  void loadStats();
}

async function toggleStats() {
  showStats.value = !showStats.value;
  await refreshStatsLayout(gridApi);
}

async function handleSearchShow() {
  drawerApi.open();
  await queryFormApi.setValues(searchParams.value);
}

function handleCreate() {
  formModalApi.setData(null).open();
}

function handleEdit(row: MemberTagVO) {
  formModalApi.setData(row).open();
}

async function handleDetail(row: MemberTagVO) {
  detailObj.value = row.id
    ? await MemberTagApi.getMemberTag(Number(row.id))
    : row;
  detailDrawerRef.value?.open();
}

async function handleToggleStatus(row: MemberTagVO) {
  const isEnable = isEnabledStatus(row.status);

  try {
    await confirm(
      isEnable ? `确认禁用【${row.name}】吗？` : `确认启用【${row.name}】吗？`,
    );
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    text: `${isEnable ? '正在禁用' : '正在启用'}${row.name}`,
  });
  try {
    await (isEnable
      ? MemberTagApi.disableMemberTag({ ids: [row.id as number] })
      : MemberTagApi.enableMemberTag({ ids: [row.id as number] }));
    ElMessage.success(`${row.name}${isEnable ? '已禁用' : '已启用'}`);
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleExport() {
  try {
    const data = await MemberTagApi.exportMemberTag(
      cleanQueryParams({
        ...searchParams.value,
        ...drillFilters.value,
      }) as MemberTagPageReqVO,
    );
    downloadFileFromBlobPart({ fileName: '会员标签.xls', source: data });
    ElMessage.success('导出成功');
  } catch {
    ElMessage.error('导出失败');
  }
}

async function handleStatsCardClick({ index }: { index: number }) {
  drillFilters.value =
    index === 0
      ? {}
      : {
          status: STATUS_ENABLED,
        };

  await handleRefresh();
}

async function handleStatsPieClick({ name }: { name: string }) {
  if (!name) {
    return;
  }

  drillFilters.value = {
    name,
  };
  await handleRefresh();
}

async function syncQueryFormValues() {
  await queryFormApi.resetForm();
  await queryFormApi.setValues(searchParams.value);
}

async function handleRemoveFilterTag(tag: ActiveFilterTag) {
  if (tag.source === 'drill') {
    const nextFilters = { ...drillFilters.value };
    delete nextFilters[tag.key];
    drillFilters.value = nextFilters;
    await handleRefresh();
    return;
  }

  const nextValues = { ...searchParams.value };
  delete nextValues[tag.key];
  searchParams.value = nextValues;
  await syncQueryFormValues();
  await handleRefresh();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const queryValues = cleanQueryParams({
            ...searchParams.value,
            ...formValues,
            ...drillFilters.value,
          }) as MemberTagPageReqVO;

          return await MemberTagApi.getMemberTagPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...queryValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<MemberTagVO>,
  showSearchForm: false,
});

onMounted(() => {
  void loadStats();
});
</script>

<template>
  <div class="common-index">
    <FormModal @success="handleRefresh" />

    <StatsVisualization
      v-if="showStats"
      :data="statsData"
      @card-click="handleStatsCardClick"
      @pie-click="handleStatsPieClick"
    />

    <div class="park-lot-table-new user-merchant-table-grid">
      <Grid>
        <template #table-title>
          <div
            class="tabel-tabs"
            style="display: flex; flex-wrap: wrap; align-items: center"
          >
            <ElTag
              v-for="tag in activeFilterTags"
              :key="`${tag.source}-${tag.key}`"
              :type="tag.type"
              closable
              style="height: 32px; margin: 4px 0; line-height: 32px"
              @close="handleRemoveFilterTag(tag)"
            >
              {{ tag.label }}：{{ tag.value }}
            </ElTag>
          </div>
        </template>

        <template #toolbar-tools>
          <div class="common-toolbar-tools">
            <IconButton
              v-access:code="['usermerchant:member-tag:create']"
              content="新增会员标签"
              icon-name="Plus"
              @click="handleCreate"
            />
            <IconButton
              v-access:code="['usermerchant:member-tag:export']"
              content="导出"
              icon-name="download"
              @click="handleExport"
            />
            <IconButton
              content="搜索"
              icon-name="search"
              @click="handleSearchShow"
            />
            <IconButton
              :content="showStats ? '隐藏统计' : '显示统计'"
              :icon-name="showStats ? 'ArrowUp' : 'ArrowDown'"
              @click="toggleStats"
            />
            <IconButton
              content="全屏"
              icon-name="FullScreen"
              @click="() => screenfull.toggle()"
            />
          </div>
        </template>
        <template #actions="{ row }">
          <div class="table-toolbar-tools">
            <IconButton
              content="查看"
              icon-name="View"
              @click="handleDetail(row)"
            />
            <IconButton
              v-access:code="['usermerchant:member-tag:update']"
              content="编辑"
              icon-name="Edit"
              @click="handleEdit(row)"
            />
            <IconButton
              v-access:code="['usermerchant:member-tag:update']"
              :content="isEnabledStatus(row.status) ? '禁用' : '启用'"
              :icon-name="isEnabledStatus(row.status) ? 'Close' : 'Check'"
              @click="handleToggleStatus(row)"
            />
          </div>
        </template>
      </Grid>

      <Drawer title="搜索">
        <QueryForm class="query-form" />
      </Drawer>

      <DetailDrawer
        ref="detailDrawerRef"
        :data="detailObj"
        :fields="memberTagDetailFields"
        :title="detailObj ? `${detailObj.name}详情` : '会员标签详情'"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.vxe-pager--wrapper) {
  justify-content: center;
}

:deep(.vxe-grid--pager-wrapper .vxe-pager) {
  position: relative;
  height: 65px;
  margin-top: 0;
}

:deep(.user-merchant-table-grid .vxe-grid--toolbar-wrapper) {
  margin-top: 0;
}

:deep(.user-merchant-table-grid .vxe-toolbar) {
  display: flex;
  align-items: center;
}

:deep(.user-merchant-table-grid .vxe-buttons--wrapper) {
  flex: 1;
  min-width: 0;
  padding-top: 0;
}

:deep(.user-merchant-table-grid .tabel-tabs) {
  flex-wrap: nowrap !important;
  gap: 8px;
  max-width: 100%;
  min-height: 32px;
  overflow: auto hidden;
  white-space: nowrap;
}

:deep(.user-merchant-table-grid .tabel-tabs .el-tag) {
  flex-shrink: 0;
}

:deep(.user-merchant-table-grid .vxe-tools--wrapper),
:deep(.user-merchant-table-grid .vxe-tools--operate) {
  position: static !important;
  flex-shrink: 0;
}

:deep(.park-chart-box) {
  height: 300px;
}

:deep(.park-chart-box .chart-box-left) {
  height: 100%;
}

:deep(.park-chart-box .stat-card) {
  flex: 1 1 0;
  min-height: 0;
}

:deep(.park-chart-box .map-wrapper),
:deep(.park-chart-box .park-type-chart),
:deep(.park-chart-box .simple-bar-chart) {
  height: 100%;
}

:deep(.rule-chart-box),
:deep(.rule-chart-box .chart-box-left),
:deep(.rule-chart-box .charts-wrapper),
:deep(.rule-chart-box .chart-area) {
  height: 300px;
}
</style>
