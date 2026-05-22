<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  MemberSignPageReqVO,
  MemberSignVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberSign';
import type { MemberUserApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import type {
  ActiveFilterTag,
  FilterTagConfig,
} from '#/views/genchuan/industry/chargePark/userMerchant/memberCenter/utils';

import { computed, onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { MemberLevelApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberLevel';
import { MemberSignApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberSign';
import {
  getUser,
  getUserPage,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import MemberStatsVisualization from '../components/MemberStatsVisualization.vue';
import { memberUserDetailFields } from '../memberUser/data';
import {
  buildActiveFilterTags,
  buildDateRangeByChartName,
  buildTodayDateRange,
  cleanQueryParams,
  formatRecordStatus,
  getRecordStatusTagType,
  refreshStatsLayout,
} from '../utils';
import {
  buildStatsDataFromApi,
  memberSignDetailFields,
  useGridColumns,
  useGridFormSchema,
} from './data';

import '#/genchuan-components/page/index.scss';

const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<MemberSignVO>();
const userDetailDrawerRef = ref<null | { open: () => void }>(null);
const userDetailObj = ref<MemberUserApi.User>();
const drillFilters = ref<Record<string, any>>({});
const searchParams = ref<Record<string, any>>({});
const statsDataSource = ref(buildStatsDataFromApi());
const showStats = ref(true);
const userNameCache = new Map<number, string>();

const drillFilterConfigs: Record<string, FilterTagConfig> = {
  createTime: {
    label: '签到时间',
    type: 'primary',
  },
  levelName: {
    label: '会员等级',
    type: 'warning',
  },
  signDate: {
    label: '签到日期',
    type: 'primary',
  },
  status: {
    formatter: formatRecordStatus,
    label: '状态',
    type: 'success',
  },
};

const searchFilterConfigs: Record<string, FilterTagConfig> = {
  createTime: {
    label: '签到时间',
    type: 'danger',
  },
  status: {
    formatter: formatRecordStatus,
    label: '状态',
    type: 'success',
  },
  userId: {
    label: '用户',
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
    const data = await MemberSignApi.getMemberSignChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载会员签到统计失败');
    console.error('[memberSign] load stats failed:', error);
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

async function loadAllPages<T>(
  getPage: (params: {
    pageNo: number;
    pageSize: number;
  }) => Promise<{ list?: T[]; total?: number }>,
) {
  const pageSize = 200;
  const firstPage = await getPage({ pageNo: 1, pageSize });
  const total = Number(firstPage.total ?? firstPage.list?.length ?? 0);
  const pageCount = Math.ceil(total / pageSize);
  const list = [...(firstPage.list || [])];

  if (pageCount > 1) {
    const restPages = await Promise.all(
      Array.from({ length: pageCount - 1 }, (_, index) =>
        getPage({ pageNo: index + 2, pageSize }),
      ),
    );

    list.push(...restPages.flatMap((page) => page.list || []));
  }

  return list;
}

async function getLevelIdByName(levelName: string) {
  const levels = await loadAllPages((params) =>
    MemberLevelApi.getMemberLevelPage(params),
  );
  const level = levels.find((item) => item.name === levelName);

  return level?.id;
}

async function getUserIdsByLevelName(levelName: string) {
  const levelId = await getLevelIdByName(levelName);

  if (!levelId) {
    return [];
  }

  const users = await loadAllPages((params) =>
    getUserPage({
      ...params,
      levelId,
    }),
  );

  return users
    .map((item) => Number(item.id))
    .filter((id) => Number.isFinite(id));
}

function getSignUserDisplay(row: MemberSignVO) {
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

async function getSignUserName(userId?: number) {
  if (!userId) {
    return '';
  }

  const cachedName = userNameCache.get(userId);
  if (cachedName) {
    return cachedName;
  }

  try {
    const user = await getUser(userId);
    const userName = getMemberUserDisplay(user, userId);
    userNameCache.set(userId, userName);
    return userName;
  } catch (error) {
    console.warn('[memberSign] load user name failed:', error);
    return `用户 ${userId}`;
  }
}

async function appendSignUserName<T extends MemberSignVO>(row: T) {
  if (!row.userId) {
    return row;
  }

  return {
    ...row,
    userName: await getSignUserName(Number(row.userId)),
  };
}

async function appendSignUserNames<T extends MemberSignVO>(list: T[] = []) {
  const userIds = [
    ...new Set(
      list
        .map((item) => item.userId)
        .filter((item): item is number => item !== undefined && item !== null)
        .map(Number),
    ),
  ];

  await Promise.all(userIds.map((userId) => getSignUserName(userId)));

  return list.map((item) => ({
    ...item,
    userName: item.userId
      ? userNameCache.get(Number(item.userId)) || getSignUserDisplay(item)
      : getSignUserDisplay(item),
  }));
}

async function queryMemberSignPage(
  params: MemberSignPageReqVO & { levelName?: string },
) {
  const { levelName, pageNo = 1, pageSize = 20, ...signParams } = params;

  if (!levelName) {
    const result = await MemberSignApi.getMemberSignPage(params);

    return {
      ...result,
      list: await appendSignUserNames(result.list || []),
    };
  }

  const userIds = await getUserIdsByLevelName(levelName);

  if (userIds.length === 0) {
    return {
      list: [],
      total: 0,
    };
  }

  if (signParams.userId && !userIds.includes(Number(signParams.userId))) {
    return {
      list: [],
      total: 0,
    };
  }

  if (signParams.userId) {
    const result = await MemberSignApi.getMemberSignPage({
      ...signParams,
      pageNo,
      pageSize,
    });

    return {
      ...result,
      list: await appendSignUserNames(result.list || []),
    };
  }

  const userIdSet = new Set(userIds);
  const allSignList = await loadAllPages((pageParams) =>
    MemberSignApi.getMemberSignPage({
      ...signParams,
      ...pageParams,
    }),
  );
  const filteredList = allSignList.filter((item) =>
    userIdSet.has(Number(item.userId)),
  );
  const start = (Number(pageNo) - 1) * Number(pageSize);
  const end = start + Number(pageSize);

  return {
    list: await appendSignUserNames(filteredList.slice(start, end)),
    total: filteredList.length,
  };
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
          }) as MemberSignPageReqVO & { levelName?: string };

          return await queryMemberSignPage({
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
  } as VxeTableGridOptions<MemberSignVO>,
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
    const { levelName: _levelName, ...exportParams } = cleanQueryParams({
      ...searchParams.value,
      ...drillFilters.value,
    }) as MemberSignPageReqVO & { levelName?: string };
    const data = await MemberSignApi.exportMemberSign(
      exportParams as MemberSignPageReqVO,
    );
    downloadFileFromBlobPart({ fileName: '会员签到.xls', source: data });
    ElMessage.success('导出成功');
  } catch {
    ElMessage.error('导出失败');
  }
}

async function handleDetail(row: MemberSignVO) {
  const detail = row.id
    ? await MemberSignApi.getMemberSign(Number(row.id))
    : row;
  detailObj.value = await appendSignUserName(detail);
  detailDrawerRef.value?.open();
}

async function handleUserDetail(row: MemberSignVO) {
  if (!row.userId) {
    return;
  }

  try {
    userDetailObj.value = await getUser(Number(row.userId));
    userDetailDrawerRef.value?.open();
  } catch (error) {
    ElMessage.error('加载会员详情失败');
    console.error('[memberSign] load user detail failed:', error);
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

async function handleStatsCardClick({ index }: { index: number }) {
  drillFilters.value = {
    signDate: buildTodayDateRange(),
    ...(index === 1 ? { status: 1 } : {}),
  };

  await handleRefresh();
}

async function handleStatsLineClick({ name }: { name: string }) {
  const range = buildDateRangeByChartName(name);

  if (!range) {
    return;
  }

  drillFilters.value = {
    signDate: range,
  };
  await handleRefresh();
}

async function handleStatsBarClick({ name }: { name: string }) {
  if (!name) {
    return;
  }

  drillFilters.value = {
    levelName: name,
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
      @bar-click="handleStatsBarClick"
      @card-click="handleStatsCardClick"
      @line-click="handleStatsLineClick"
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
              v-access:code="['usermerchant:member-sign:export']"
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
            {{ getSignUserDisplay(row) }}
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
          </div>
        </template>
      </Grid>

      <Drawer title="搜索">
        <QueryForm class="query-form" />
      </Drawer>

      <DetailDrawer
        ref="detailDrawerRef"
        :data="detailObj"
        :fields="memberSignDetailFields"
        :title="detailObj ? `签到记录 ${detailObj.id}` : '签到详情'"
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
