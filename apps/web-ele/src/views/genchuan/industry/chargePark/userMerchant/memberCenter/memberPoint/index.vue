<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  MemberPointCheckReqVO,
  MemberPointPageReqVO,
  MemberPointVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberPoint';
import type { MemberUserApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import type {
  ActiveFilterTag,
  FilterTagConfig,
} from '#/views/genchuan/industry/chargePark/userMerchant/memberCenter/utils';

import { computed, onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElMessageBox, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { MemberPointApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberPoint';
import {
  getUser,
  getUserPage,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import PageTabsShell from '../../components/PageTabsShell.vue';
import MemberStatsVisualization from '../components/MemberStatsVisualization.vue';
import { memberUserDetailFields } from '../memberUser/data';
import {
  buildActiveFilterTags,
  buildDateRangeByChartName,
  buildRecentDateRange,
  cleanQueryParams,
  formatRecordStatus,
  getRecordStatusTagType,
  refreshStatsLayout,
} from '../utils';
import {
  buildStatsDataFromApi,
  formatChangeAmount,
  formatChangeType,
  getChangeAmountTagType,
  isAbnormalRecord,
  memberPointDetailFields,
  useGridColumns,
  useGridFormSchema,
} from './data';

import '#/genchuan-components/page/index.scss';

const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<MemberPointVO>();
const userDetailDrawerRef = ref<null | { open: () => void }>(null);
const userDetailObj = ref<MemberUserApi.User>();
const drillFilters = ref<Record<string, any>>({});
const searchParams = ref<Record<string, any>>({});
const statsDataSource = ref(buildStatsDataFromApi());
const showStats = ref(true);
const userNameCache = new Map<number, string>();
let memberUserListCache: Promise<MemberUserApi.User[]> | undefined;

const drillFilterConfigs: Record<string, FilterTagConfig> = {
  changeAmount: {
    label: '变动金额',
    type: 'warning',
  },
  changeType: {
    formatter: formatChangeType,
    label: '变动类型',
    type: 'warning',
  },
  createTime: {
    label: '变动时间',
    type: 'primary',
  },
  status: {
    formatter: formatRecordStatus,
    label: '状态',
    type: 'success',
  },
};

const searchFilterConfigs: Record<string, FilterTagConfig> = {
  changeAmount: {
    label: '变动金额',
    type: 'warning',
  },
  changeType: {
    formatter: formatChangeType,
    label: '变动类型',
    type: 'warning',
  },
  createTime: {
    label: '时间范围',
    type: 'danger',
  },
  status: {
    formatter: formatRecordStatus,
    label: '状态',
    type: 'success',
  },
  userName: {
    label: '用户名称',
    type: 'info',
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
    const data = await MemberPointApi.getMemberPointChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载会员积分统计失败');
    console.error('[memberPoint] load stats failed:', error);
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

function getPointUserDisplay(row: MemberPointVO) {
  return (
    row.userName ||
    row.nickname ||
    row.mobile ||
    (row.userId ? `用户 ${row.userId}` : '-')
  );
}

function getMemberUserDisplay(user: MemberUserApi.User, userId: number) {
  return user.nickname || user.name || user.mobile || `用户 ${userId}`;
}

async function loadMemberUserList() {
  memberUserListCache ||= (async () => {
    const pageSize = 200;
    const firstPage = await getUserPage({
      pageNo: 1,
      pageSize,
    });
    const total = Number(firstPage.total ?? firstPage.list?.length ?? 0);
    const pageCount = Math.ceil(total / pageSize);
    const list = [...(firstPage.list || [])];

    if (pageCount > 1) {
      const restPages = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, index) =>
          getUserPage({
            pageNo: index + 2,
            pageSize,
          }),
        ),
      );

      list.push(...restPages.flatMap((page) => page.list || []));
    }

    return list;
  })().catch((error) => {
    memberUserListCache = undefined;
    throw error;
  });

  return await memberUserListCache;
}

async function getPointUserName(userId?: number) {
  if (!userId) {
    return '';
  }

  const cachedName = userNameCache.get(userId);
  if (cachedName) {
    return cachedName;
  }

  try {
    const users = await loadMemberUserList();
    const user = users.find((item) => Number(item.id) === userId);
    const userName = user
      ? getMemberUserDisplay(user, userId)
      : `用户 ${userId}`;

    userNameCache.set(userId, userName);
    return userName;
  } catch (error) {
    console.warn('[memberPoint] load member user names failed:', error);
    return `用户 ${userId}`;
  }
}

async function appendPointUserName<T extends MemberPointVO>(row: T) {
  if (!row.userId) {
    return row;
  }

  return {
    ...row,
    userName: await getPointUserName(Number(row.userId)),
  };
}

async function appendPointUserNames<T extends MemberPointVO>(list: T[] = []) {
  const userIds = [
    ...new Set(
      list
        .map((item) => item.userId)
        .filter((item): item is number => item !== undefined && item !== null)
        .map(Number),
    ),
  ];

  await Promise.all(userIds.map((userId) => getPointUserName(userId)));

  return list.map((item) => ({
    ...item,
    userName: item.userId
      ? userNameCache.get(Number(item.userId)) || getPointUserDisplay(item)
      : getPointUserDisplay(item),
  }));
}

async function getUserIdByName(userName?: string) {
  const keyword = String(userName ?? '').trim();

  if (!keyword) {
    return undefined;
  }

  const users = await loadMemberUserList();
  const user =
    users.find(
      (item) =>
        item.nickname === keyword ||
        item.name === keyword ||
        item.mobile === keyword,
    ) ||
    users.find((item) =>
      [item.nickname, item.name, item.mobile].some((value) =>
        String(value ?? '').includes(keyword),
      ),
    );

  if (!user?.id) {
    return undefined;
  }

  const userId = Number(user.id);
  userNameCache.set(userId, getMemberUserDisplay(user, userId));

  return userId;
}

async function buildPointQueryValues(
  values: MemberPointPageReqVO,
): Promise<MemberPointPageReqVO | undefined> {
  const { userName, ...queryValues } = values;

  if (!userName) {
    return queryValues;
  }

  const userId = await getUserIdByName(userName);

  if (!userId) {
    ElMessage.warning('未找到对应用户');
    return undefined;
  }

  return {
    ...queryValues,
    userId,
  };
}

async function onQuerySubmit(values: Record<string, any>) {
  searchParams.value = { ...values };
  drillFilters.value = {};
  await handleRefresh();
  drawerApi.close();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const queryValues = await buildPointQueryValues(
            cleanQueryParams({
              ...searchParams.value,
              ...formValues,
              ...drillFilters.value,
            }) as MemberPointPageReqVO,
          );

          if (!queryValues) {
            return {
              list: [],
              total: 0,
            };
          }

          const result = await MemberPointApi.getMemberPointPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...queryValues,
          });

          return {
            ...result,
            list: await appendPointUserNames(result.list || []),
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
  } as VxeTableGridOptions<MemberPointVO>,
  showSearchForm: false,
});

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

async function handleExport() {
  try {
    const queryValues = await buildPointQueryValues(
      cleanQueryParams({
        ...searchParams.value,
        ...drillFilters.value,
      }) as MemberPointPageReqVO,
    );

    if (!queryValues) {
      return;
    }

    const data = await MemberPointApi.exportMemberPoint(
      queryValues as MemberPointPageReqVO,
    );
    downloadFileFromBlobPart({ fileName: '会员积分.xls', source: data });
    ElMessage.success('导出成功');
  } catch {
    ElMessage.error('导出失败');
  }
}

async function handleDetail(row: MemberPointVO) {
  const detail = row.id
    ? await MemberPointApi.getMemberPoint(Number(row.id))
    : row;
  detailObj.value = await appendPointUserName(detail);
  detailDrawerRef.value?.open();
}

async function handleUserDetail(row: MemberPointVO) {
  if (!row.userId) {
    return;
  }

  try {
    userDetailObj.value = await getUser(Number(row.userId));
    userDetailDrawerRef.value?.open();
  } catch (error) {
    ElMessage.error('加载会员详情失败');
    console.error('[memberPoint] load user detail failed:', error);
  }
}

async function handleDrillFilter(key: string, value: unknown) {
  if (value === undefined || value === null || value === '') {
    return;
  }

  const nextFilters = { ...drillFilters.value };

  if (nextFilters[key] === value) {
    delete nextFilters[key];
  } else {
    nextFilters[key] = value;
  }

  drillFilters.value = nextFilters;
  await handleRefresh();
}

async function handleCheck(row: MemberPointVO) {
  try {
    const { value } = await ElMessageBox.prompt('请输入核查结果', '核查记录', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^\s*\S[\s\S]*$/,
      inputErrorMessage: '核查结果不能为空',
    });

    const payload: MemberPointCheckReqVO = {
      id: Number(row.id),
      checkResult: value.trim(),
    };

    await MemberPointApi.checkMemberPoint(payload);
    ElMessage.success('核查成功');
    handleRefresh();
  } catch {
    // 用户取消核查时不提示。
  }
}

async function handleStatsCardClick({ index }: { index: number }) {
  drillFilters.value =
    index === 0
      ? {}
      : {
          createTime: buildRecentDateRange(),
        };

  await handleRefresh();
}

async function handleStatsLineClick({ name }: { name: string }) {
  const range = buildDateRangeByChartName(name);

  if (!range) {
    return;
  }

  drillFilters.value = {
    createTime: range,
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

onMounted(() => {
  void loadStats();
});
</script>

<template>
  <div class="common-index">
    <MemberStatsVisualization
      v-if="showStats"
      :data="statsData"
      @card-click="handleStatsCardClick"
      @line-click="handleStatsLineClick"
    />

    <PageTabsShell title="会员积分">
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
                v-access:code="['usermerchant:member-point:export']"
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

          <template #user="{ row }">
            <el-text
              class="common-align"
              type="primary"
              style="cursor: pointer"
              @click="handleUserDetail(row)"
            >
              {{ getPointUserDisplay(row) }}
            </el-text>
          </template>

          <template #changeAmount="{ row }">
            <ElTag
              :type="getChangeAmountTagType(row.changeAmount)"
              style="cursor: pointer"
              @click="handleDrillFilter('changeAmount', row.changeAmount)"
            >
              {{ formatChangeAmount(row.changeAmount) }}
            </ElTag>
          </template>

          <template #changeType="{ row }">
            <el-text
              class="common-align"
              type="primary"
              style="cursor: pointer"
              @click="handleDrillFilter('changeType', row.changeType)"
            >
              {{ formatChangeType(row.changeType) }}
            </el-text>
          </template>

          <template #status="{ row }">
            <ElTag
              :type="getRecordStatusTagType(row.status)"
              style="cursor: pointer"
              @click="handleDrillFilter('status', row.status)"
            >
              {{ formatRecordStatus(row.status) }}
            </ElTag>
          </template>

          <template #actions="{ row }">
            <div class="table-toolbar-tools">
              <IconButton
                content="查看"
                icon-name="View"
                @click="handleDetail(row)"
              />
              <IconButton
                v-if="isAbnormalRecord(row.status)"
                v-access:code="['usermerchant:member-point:update']"
                content="核查"
                icon-name="DocumentChecked"
                color="#F56C6C"
                @click="handleCheck(row)"
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
          :fields="memberPointDetailFields"
          :title="detailObj ? `积分记录 ${detailObj.id}` : '积分记录详情'"
        />

        <DetailDrawer
          ref="userDetailDrawerRef"
          :data="userDetailObj"
          :fields="memberUserDetailFields"
          :title="
            userDetailObj
              ? `${userDetailObj.nickname || userDetailObj.mobile}详情`
              : '会员详情'
          "
        />
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
</style>
