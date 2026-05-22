<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  MemberLevelPageReqVO,
  MemberLevelVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberLevel';
import type { MemberUserApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import type {
  ActiveFilterTag,
  FilterTagConfig,
} from '#/views/genchuan/industry/chargePark/userMerchant/memberCenter/utils';

import { computed, h, nextTick, onMounted, ref } from 'vue';

import { confirm, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { ElButton, ElDialog, ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { MemberLevelApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberLevel';
import {
  getUserCount,
  getUserPage,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import MemberStatsVisualization from '../components/MemberStatsVisualization.vue';
import { formatMemberStatus, getMemberStatusTagType } from '../memberUser/data';
import {
  buildActiveFilterTags,
  cleanQueryParams,
  formatDateTimeValue,
  formatLifecycleStatus,
  isEnabledStatus,
  refreshStatsLayout,
  STATUS_ENABLED,
} from '../utils';
import {
  buildStatsDataFromApi,
  memberLevelDetailFields,
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
const detailObj = ref<MemberLevelVO>();
const drillFilters = ref<Record<string, any>>({});
const searchParams = ref<Record<string, any>>({});
const statsDataSource = ref(buildStatsDataFromApi());
const showStats = ref(true);
const levelUserCountCache = new Map<number, number>();
const levelUserDialogVisible = ref(false);
const selectedLevel = ref<MemberLevelVO>();

const levelUserDialogTitle = computed(() =>
  selectedLevel.value?.name
    ? `${selectedLevel.value.name}会员列表`
    : '等级会员列表',
);

const drillFilterConfigs: Record<string, FilterTagConfig> = {
  name: {
    label: '等级名称',
    type: 'primary',
  },
  status: {
    formatter: formatLifecycleStatus,
    label: '状态',
    type: 'success',
  },
};

const searchFilterConfigs: Record<string, FilterTagConfig> = {
  createTime: {
    label: '创建时间',
    type: 'danger',
  },
  levelValue: {
    label: '等级数值',
    type: 'warning',
  },
  name: {
    label: '等级名称',
    type: 'info',
  },
  status: {
    formatter: formatLifecycleStatus,
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
    const data = await MemberLevelApi.getMemberLevelChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载会员等级统计失败');
    console.error('[memberLevel] load stats failed:', error);
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
  levelUserCountCache.clear();
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

function handleEdit(row: MemberLevelVO) {
  formModalApi.setData(row).open();
}

async function handleDetail(row: MemberLevelVO) {
  const detail = row.id
    ? await MemberLevelApi.getMemberLevel(Number(row.id))
    : row;
  detailObj.value = {
    ...detail,
    levelUserCount: await getLevelUserCount(detail),
  };
  detailDrawerRef.value?.open();
}

async function handleToggleStatus(row: MemberLevelVO) {
  const isEnable = isEnabledStatus(row.status);

  try {
    await confirm(
      isEnable ? `确认禁用【${row.name}】吗？` : `确认生效【${row.name}】吗？`,
    );
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    text: `${isEnable ? '正在禁用' : '正在生效'}${row.name}`,
  });
  try {
    await (isEnable
      ? MemberLevelApi.disableMemberLevel({ ids: [row.id as number] })
      : MemberLevelApi.enableMemberLevel({ ids: [row.id as number] }));
    ElMessage.success(`${row.name}${isEnable ? '已禁用' : '已生效'}`);
    handleRefresh();
  } finally {
    loadingInstance.close();
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

async function handleStatsBarClick({ name }: { name: string }) {
  if (!name) {
    return;
  }

  const level = await getLevelByName(name);

  if (!level) {
    ElMessage.warning('未找到对应会员等级');
    return;
  }

  await handleOpenLevelUsers(level);
}

function getDirectLevelUserCount(row: MemberLevelVO) {
  const value =
    row.levelUserCount ??
    row.userCount ??
    row.memberUserCount ??
    row.memberCount;
  const count = Number(value);

  return Number.isFinite(count) ? count : undefined;
}

async function getLevelUserCount(row: MemberLevelVO) {
  const directCount = getDirectLevelUserCount(row);

  if (directCount !== undefined) {
    return directCount;
  }

  if (!row.id) {
    return 0;
  }

  const levelId = Number(row.id);
  const cachedCount = levelUserCountCache.get(levelId);

  if (cachedCount !== undefined) {
    return cachedCount;
  }

  const count = await getUserCount({ levelId });
  levelUserCountCache.set(levelId, count);

  return count;
}

async function appendLevelUserCounts(list: MemberLevelVO[] = []) {
  return await Promise.all(
    list.map(async (item) => ({
      ...item,
      levelUserCount: await getLevelUserCount(item),
    })),
  );
}

async function getLevelByName(name: string) {
  const result = await MemberLevelApi.getMemberLevelPage({
    name,
    pageNo: 1,
    pageSize: 100,
  });

  return result.list?.find((item) => item.name === name) || result.list?.[0];
}

async function handleOpenLevelUsers(row: MemberLevelVO) {
  selectedLevel.value = {
    ...row,
    levelUserCount: await getLevelUserCount(row),
  };
  levelUserDialogVisible.value = true;
  await nextTick();
  levelUserGridApi.reload();
}

function getMemberUserDisplay(row: MemberUserApi.User) {
  return row.nickname || row.name || row.mobile || `会员${row.id}`;
}

function renderMemberStatus(status?: number | string) {
  return h(
    ElTag,
    {
      type: getMemberStatusTagType(status),
    },
    () => formatMemberStatus(status),
  );
}

const [LevelUserGrid, levelUserGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      {
        field: 'id',
        title: '会员 ID',
        minWidth: 100,
      },
      {
        field: 'nickname',
        title: '用户',
        minWidth: 160,
        formatter: ({ row }) => getMemberUserDisplay(row),
      },
      {
        field: 'mobile',
        title: '手机号',
        minWidth: 130,
        formatter: ({ cellValue }) => cellValue || '-',
      },
      {
        field: 'levelName',
        title: '会员等级',
        minWidth: 120,
        formatter: ({ row }) => row.levelName || row.levelId || '-',
      },
      {
        field: 'status',
        title: '状态',
        minWidth: 90,
        slots: {
          default: ({ row }) => renderMemberStatus(row.status),
        },
      },
      {
        field: 'createTime',
        title: '开通时间',
        minWidth: 160,
        formatter: ({ cellValue }) => formatDateTimeValue(cellValue),
      },
      {
        field: 'expireTime',
        title: '到期时间',
        minWidth: 160,
        formatter: ({ cellValue }) => formatDateTimeValue(cellValue),
      },
    ],
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          if (!selectedLevel.value?.id) {
            return {
              list: [],
              total: 0,
            };
          }

          return await getUserPage({
            levelId: Number(selectedLevel.value.id),
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
    },
  } as VxeTableGridOptions<MemberUserApi.User>,
  showSearchForm: false,
});

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
          }) as MemberLevelPageReqVO;

          const result = await MemberLevelApi.getMemberLevelPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...queryValues,
          });

          return {
            ...result,
            list: await appendLevelUserCounts(result.list || []),
          };
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
  } as VxeTableGridOptions<MemberLevelVO>,
  showSearchForm: false,
});

onMounted(() => {
  void loadStats();
});
</script>

<template>
  <div class="common-index">
    <FormModal @success="handleRefresh" />

    <MemberStatsVisualization
      v-if="showStats"
      :data="statsData"
      @bar-click="handleStatsBarClick"
      @card-click="handleStatsCardClick"
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
              v-access:code="['usermerchant:member-level:create']"
              content="新增等级"
              icon-name="Plus"
              @click="handleCreate"
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
              v-access:code="['usermerchant:member-level:update']"
              content="编辑"
              icon-name="Edit"
              @click="handleEdit(row)"
            />
            <IconButton
              v-access:code="['usermerchant:member-level:update']"
              :content="isEnabledStatus(row.status) ? '禁用' : '生效'"
              :icon-name="isEnabledStatus(row.status) ? 'Close' : 'Check'"
              @click="handleToggleStatus(row)"
            />
          </div>
        </template>
        <template #levelName="{ row }">
          <ElButton link type="primary" @click="handleOpenLevelUsers(row)">
            {{ row.name || '-' }}
          </ElButton>
        </template>
        <template #levelUserCount="{ row }">
          <ElButton link type="primary" @click="handleOpenLevelUsers(row)">
            {{ row.levelUserCount ?? 0 }}
          </ElButton>
        </template>
      </Grid>

      <Drawer title="搜索">
        <QueryForm class="query-form" />
      </Drawer>

      <DetailDrawer
        ref="detailDrawerRef"
        :data="detailObj"
        :fields="memberLevelDetailFields"
        :title="detailObj ? `${detailObj.name}详情` : '会员等级详情'"
      />

      <ElDialog
        v-model="levelUserDialogVisible"
        :title="levelUserDialogTitle"
        width="960px"
      >
        <div class="member-level-user-dialog">
          <LevelUserGrid />
        </div>
      </ElDialog>
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

.member-level-user-dialog {
  min-height: 420px;
}
</style>
