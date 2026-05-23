<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  MemberGroupPageReqVO,
  MemberGroupVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberGroup';
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
import { MemberGroupApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberGroup';
import {
  getUserCount,
  getUserPage,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import PageTabsShell from '../../components/PageTabsShell.vue';
import MemberStatsVisualization from '../components/MemberStatsVisualization.vue';
import { formatMemberStatus, getMemberStatusTagType } from '../memberUser/data';
import {
  buildActiveFilterTags,
  cleanQueryParams,
  formatDateTimeValue,
  formatLifecycleStatus,
  isEnabledStatus,
  refreshStatsLayout,
} from '../utils';
import {
  buildStatsDataFromApi,
  memberGroupDetailFields,
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
const detailObj = ref<MemberGroupVO>();
const drillFilters = ref<Record<string, any>>({});
const searchParams = ref<Record<string, any>>({});
const statsDataSource = ref(buildStatsDataFromApi());
const showStats = ref(true);
const groupUserCountCache = new Map<number, number>();
const groupUserDialogVisible = ref(false);
const selectedGroup = ref<MemberGroupVO>();

const groupUserDialogTitle = computed(() =>
  selectedGroup.value?.name
    ? `${selectedGroup.value.name}会员列表`
    : '分组会员列表',
);

const drillFilterConfigs: Record<string, FilterTagConfig> = {
  name: {
    label: '分组名称',
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
  name: {
    label: '分组名称',
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
    const data = await MemberGroupApi.getMemberGroupChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载会员分组统计失败');
    console.error('[memberGroup] load stats failed:', error);
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
  groupUserCountCache.clear();
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

function handleEdit(row: MemberGroupVO) {
  formModalApi.setData(row).open();
}

async function handleDetail(row: MemberGroupVO) {
  const detail = row.id
    ? await MemberGroupApi.getMemberGroup(Number(row.id))
    : row;
  detailObj.value = {
    ...detail,
    groupUserCount: await getGroupUserCount(detail),
  };
  detailDrawerRef.value?.open();
}

async function handleToggleStatus(row: MemberGroupVO) {
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
      ? MemberGroupApi.disableMemberGroup({ ids: [row.id as number] })
      : MemberGroupApi.enableMemberGroup({ ids: [row.id as number] }));
    ElMessage.success(`${row.name}${isEnable ? '已禁用' : '已生效'}`);
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleStatsCardClick({ index }: { index: number }) {
  if (index === 0) {
    drillFilters.value = {};
    await handleRefresh();
    return;
  }

  selectedGroup.value = undefined;
  groupUserDialogVisible.value = true;
  await nextTick();
  groupUserGridApi.reload();
}

async function handleStatsPieClick({ name }: { name: string }) {
  if (!name) {
    return;
  }

  const group = await getGroupByName(name);

  if (!group) {
    ElMessage.warning('未找到对应会员分组');
    return;
  }

  await handleOpenGroupUsers(group);
}

function getDirectGroupUserCount(row: MemberGroupVO) {
  const value =
    row.groupUserCount ??
    row.userCount ??
    row.memberUserCount ??
    row.memberCount;
  const count = Number(value);

  return Number.isFinite(count) ? count : undefined;
}

async function getGroupUserCount(row: MemberGroupVO) {
  const directCount = getDirectGroupUserCount(row);

  if (directCount !== undefined) {
    return directCount;
  }

  if (!row.id) {
    return 0;
  }

  const groupId = Number(row.id);
  const cachedCount = groupUserCountCache.get(groupId);

  if (cachedCount !== undefined) {
    return cachedCount;
  }

  const count = await getUserCount({ groupId });
  groupUserCountCache.set(groupId, count);

  return count;
}

async function appendGroupUserCounts(list: MemberGroupVO[] = []) {
  return await Promise.all(
    list.map(async (item) => ({
      ...item,
      groupUserCount: await getGroupUserCount(item),
    })),
  );
}

async function getGroupByName(name: string) {
  const result = await MemberGroupApi.getMemberGroupPage({
    name,
    pageNo: 1,
    pageSize: 100,
  });

  return result.list?.find((item) => item.name === name) || result.list?.[0];
}

async function handleOpenGroupUsers(row: MemberGroupVO) {
  selectedGroup.value = {
    ...row,
    groupUserCount: await getGroupUserCount(row),
  };
  groupUserDialogVisible.value = true;
  await nextTick();
  groupUserGridApi.reload();
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

const [GroupUserGrid, groupUserGridApi] = useVbenVxeGrid({
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
        field: 'groupName',
        title: '会员分组',
        minWidth: 120,
        formatter: ({ row }) => row.groupName || row.groupId || '-',
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
          const queryValues = selectedGroup.value?.id
            ? { groupId: Number(selectedGroup.value.id) }
            : {};

          return await getUserPage({
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
          }) as MemberGroupPageReqVO;

          const result = await MemberGroupApi.getMemberGroupPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...queryValues,
          });

          return {
            ...result,
            list: await appendGroupUserCounts(result.list || []),
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
  } as VxeTableGridOptions<MemberGroupVO>,
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
      @card-click="handleStatsCardClick"
      @pie-click="handleStatsPieClick"
    />

    <PageTabsShell title="会员分组">
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
                v-access:code="['usermerchant:member-group:create']"
                content="新增会员分组"
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
                v-access:code="['usermerchant:member-group:update']"
                content="编辑"
                icon-name="Edit"
                @click="handleEdit(row)"
              />
              <IconButton
                v-access:code="['usermerchant:member-group:update']"
                :content="isEnabledStatus(row.status) ? '禁用' : '生效'"
                :icon-name="isEnabledStatus(row.status) ? 'Close' : 'Check'"
                @click="handleToggleStatus(row)"
              />
            </div>
          </template>
          <template #groupName="{ row }">
            <ElButton link type="primary" @click="handleOpenGroupUsers(row)">
              {{ row.name || '-' }}
            </ElButton>
          </template>
          <template #groupUserCount="{ row }">
            <ElButton link type="primary" @click="handleOpenGroupUsers(row)">
              {{ row.groupUserCount ?? 0 }}
            </ElButton>
          </template>
        </Grid>

        <Drawer title="搜索">
          <QueryForm class="query-form" />
        </Drawer>

        <DetailDrawer
          ref="detailDrawerRef"
          :data="detailObj"
          :fields="memberGroupDetailFields"
          :title="detailObj ? `${detailObj.name}详情` : '会员分组详情'"
        />

        <ElDialog
          v-model="groupUserDialogVisible"
          :title="groupUserDialogTitle"
          width="960px"
        >
          <div class="member-group-user-dialog">
            <GroupUserGrid />
          </div>
        </ElDialog>
      </div>
    </PageTabsShell>
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

.member-group-user-dialog {
  min-height: 420px;
}
</style>
