<script lang="ts" setup>
import type { UserCreditRow, UserProfileInfo, UserSelectOption } from '../data';

import type { UserCreditDetailVO } from '#/api/genchuan/industry/chargePark/userMerchant/creditMgmt/userCredit';

import { computed, onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElLoading,
  ElMessage,
  ElTag,
} from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { UserCreditApi } from '#/api/genchuan/industry/chargePark/userMerchant/creditMgmt/userCredit';
import { UserInfoApi } from '#/api/genchuan/industry/chargePark/userMerchant/userMgmt/userInfo';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import {
  buildUserCreditQueryParams,
  buildUserCreditRowFromApi,
  buildUserSelectOptions,
  detailFields,
  formatAuditLogs,
  formatChangeRecords,
  getCreditLevelTagType,
  maskPhone,
  useGridColumns,
  useSearchSchema,
} from '../data';

const props = withDefaults(
  defineProps<{
    reloadStats?: () => Promise<void> | void;
    showStats?: boolean;
    toggleStats?: () => void;
  }>(),
  {
    reloadStats: async () => {},
    showStats: false,
    toggleStats: () => {},
  },
);

let loadUserProfilesPromise: null | Promise<void> = null;

const currentUser = ref<UserCreditRow>();
const detailCache = new Map<number, UserCreditDetailVO>();
const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<UserCreditRow>();
const drillFilters = ref<{
  creditLevel?: string;
  creditScore?: number | string;
}>({});
const searchParams = ref<Record<string, any>>({});
const userDialogVisible = ref(false);
const userProfileMap = ref<Record<number, UserProfileInfo>>({});
const userSelectOptions = ref<UserSelectOption[]>([]);

const detailData = computed(() => {
  if (!detailObj.value) {
    return null;
  }

  return {
    ...detailObj.value,
    auditLogsSummary: formatAuditLogs(detailObj.value.auditLogs),
    changeSummary: formatChangeRecords(detailObj.value.changeRecords),
    maskedPhone: maskPhone(detailObj.value.phone),
  };
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  async onOpenChange() {},
});

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onQuerySubmit,
  layout: 'horizontal',
  schema: useSearchSchema(userSelectOptions.value).map((item) => ({
    ...item,
    rules: undefined,
  })),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

/** 搜索表单提交 */
async function onQuerySubmit(values: Record<string, any>) {
  searchParams.value = { ...values };
  await handleRefresh();
  drawerApi.close();
}

/** 加载用户选项 */
async function loadUserProfiles() {
  const result = await UserInfoApi.getUserInfoPage({
    pageNo: 1,
    pageSize: 9999,
  });
  const list = Array.isArray(result?.list) ? result.list : [];
  const profiles = list
    .map((item) => ({
      id: Number(item.id ?? 0),
      nickname: item.nickname || '',
      phone: item.phone || '',
      userType: item.userType || '',
    }))
    .filter((item) => item.id > 0 && item.nickname);
  const nextUserProfileMap: Record<number, UserProfileInfo> = {};

  for (const item of profiles) {
    nextUserProfileMap[item.id] = item;
  }

  userProfileMap.value = nextUserProfileMap;
  userSelectOptions.value = buildUserSelectOptions(profiles);
  queryFormApi.setState({
    schema: useSearchSchema(userSelectOptions.value).map((item) => ({
      ...item,
      rules: undefined,
    })),
  });
}

/** 确保用户选项已加载 */
async function ensureUserProfilesLoaded() {
  if (userSelectOptions.value.length > 0) {
    return;
  }

  if (!loadUserProfilesPromise) {
    loadUserProfilesPromise = loadUserProfiles()
      .catch((error) => {
        console.error('[userCredit] load user profiles failed:', error);
      })
      .finally(() => {
        loadUserProfilesPromise = null;
      });
  }

  await loadUserProfilesPromise;
}

/** 获取用户信用详情 */
async function fetchUserCreditDetail(
  row: UserCreditRow,
  errorMessage = '加载用户信用详情失败',
) {
  const cachedDetail = detailCache.get(row.id);

  if (cachedDetail) {
    return {
      row: buildUserCreditRowFromApi(
        cachedDetail,
        row,
        userProfileMap.value[row.userId],
      ),
      source: cachedDetail,
    };
  }

  const loadingInstance = ElLoading.service({
    target: '.user-credit-table',
    text: '加载中...',
  });

  try {
    const data = await UserCreditApi.getUserCredit(row.id);
    detailCache.set(row.id, data);

    return {
      row: buildUserCreditRowFromApi(
        data,
        row,
        userProfileMap.value[Number(data.userId ?? row.userId)],
      ),
      source: data,
    };
  } catch (error) {
    ElMessage.error(errorMessage);
    console.error('[userCredit] load detail failed:', error);
    return null;
  } finally {
    loadingInstance.close();
  }
}

/** 查询用户信用列表 */
async function queryUserCreditPage(
  { page }: { page: { currentPage: number; pageSize: number } },
  formValues: Record<string, any> = {},
) {
  await ensureUserProfilesLoaded();

  const queryValues = {
    ...searchParams.value,
    ...formValues,
  };

  if (drillFilters.value.creditLevel) {
    queryValues.creditLevel = drillFilters.value.creditLevel;
  }

  const result = await UserCreditApi.getUserCreditPage({
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...buildUserCreditQueryParams(queryValues, drillFilters.value),
  });
  const list = Array.isArray(result?.list) ? result.list : [];

  return {
    list: list.map((item) =>
      buildUserCreditRowFromApi(
        item,
        undefined,
        userProfileMap.value[Number(item.userId ?? 0)],
      ),
    ),
    total: Number(result?.total || 0),
  };
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    layouts: [['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    keepSource: true,
    height: 'auto',
    proxyConfig: {
      ajax: {
        query: queryUserCreditPage,
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  },
  showSearchForm: false,
});

/** 刷新表格 - 同时清除所有快捷筛选 */
function handleRefresh() {
  drillFilters.value = {};
  return gridApi.query();
}

/** 联动刷新页面 */
async function handleReloadPage() {
  detailCache.clear();
  await handleRefresh();
  await props.reloadStats?.();
}

/** 重置筛选条件 */
async function resetSearch() {
  searchParams.value = {};
  drillFilters.value = {};
  await queryFormApi.resetForm();
  return gridApi.query();
}

/** 设置筛选条件 */
async function setSearchValues(values: Record<string, any>) {
  searchParams.value = {
    ...searchParams.value,
    ...values,
  };
  drillFilters.value = {};
  await queryFormApi.setValues(searchParams.value);
  return gridApi.query();
}

/** 重新计算表格布局 */
async function recalculateLayout() {
  await gridApi.grid?.recalculate?.(true);
  await gridApi.grid?.refreshScroll?.();
}

defineExpose({
  recalculateLayout,
  resetSearch,
  setSearchValues,
});

/** 导出当前列表 */
async function handleExport() {
  try {
    await UserCreditApi.exportUserCredit(
      buildUserCreditQueryParams(searchParams.value, drillFilters.value),
    );
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
    console.error('[userCredit] export failed:', error);
  }
}

/** 打开用户详情弹窗 */
function handleOpenUser(row: UserCreditRow) {
  currentUser.value = row;
  userDialogVisible.value = true;
}

/** 按信用分钻取列表 */
function handleFilterByScore(score: number) {
  drillFilters.value.creditScore =
    drillFilters.value.creditScore === score ? undefined : score;
  gridApi.query();
}

/** 按信用等级钻取列表 */
function handleFilterByLevel(level: UserCreditRow['creditLevel']) {
  drillFilters.value.creditLevel =
    drillFilters.value.creditLevel === level ? undefined : level;
  gridApi.query();
}

/** 打开详情抽屉 */
async function handleDetail(row: UserCreditRow) {
  const detail = await fetchUserCreditDetail(row);

  if (!detail) {
    return;
  }

  detailObj.value = detail.row;
  detailDrawerRef.value?.open();
}

/** 发送低信用提醒 */
async function handleRemind(row: UserCreditRow) {
  const loadingInstance = ElLoading.service({
    target: '.user-credit-table',
    text: '提醒中...',
  });

  try {
    await UserCreditApi.remindUserCredit({
      ids: [row.id],
    });
    ElMessage.success(`已向 ${row.userName} 发送信用提醒`);
    await handleReloadPage();
  } catch (error) {
    ElMessage.error('提醒失败');
    console.error('[userCredit] remind failed:', error);
  } finally {
    loadingInstance.close();
  }
}

/** 打开搜索抽屉 */
async function handleSerachShow() {
  drawerApi.open();
  await queryFormApi.setValues(searchParams.value);
}

/** 取消信用分筛选 */
function handleCancelScoreFilter() {
  drillFilters.value.creditScore = undefined;
  gridApi.query();
}

/** 取消信用等级筛选 */
function handleCancelLevelFilter() {
  drillFilters.value.creditLevel = undefined;
  gridApi.query();
}

onMounted(() => {
  void ensureUserProfilesLoaded();
});
</script>

<template>
  <div class="user-credit-table">
    <div class="user-credit-grid-wrap">
      <Grid>
        <template #table-title>
          <div
            class="tabel-tabs"
            style="
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              gap: 10px;
            "
          >
            <ElTag
              v-if="drillFilters.creditScore"
              type="primary"
              closable
              style="height: 32px; margin: 4px 0; line-height: 32px"
              @close="handleCancelScoreFilter"
            >
              信用分：{{ drillFilters.creditScore }}
            </ElTag>
            <ElTag
              v-if="drillFilters.creditLevel"
              type="warning"
              closable
              style="height: 32px; margin: 4px 0; line-height: 32px"
              @close="handleCancelLevelFilter"
            >
              信用等级：{{ drillFilters.creditLevel }}
            </ElTag>
          </div>
        </template>

        <template #toolbar-tools>
          <div class="common-toolbar-tools">
            <IconButton
              content="导出"
              icon-name="download"
              @click="handleExport"
            />
            <IconButton
              content="搜索"
              icon-name="search"
              @click="handleSerachShow"
            />
            <IconButton
              :content="props.showStats ? '隐藏统计' : '显示统计'"
              :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
              @click="props.toggleStats"
            />
            <IconButton
              content="全屏"
              icon-name="FullScreen"
              @click="() => screenfull.toggle()"
            />
          </div>
        </template>

        <template #userName="{ row }">
          <el-text
            class="common-align"
            type="primary"
            style="cursor: pointer"
            @click="handleOpenUser(row)"
          >
            {{ row.userName }}
          </el-text>
        </template>

        <template #creditScore="{ row }">
          <el-text
            class="common-align"
            type="primary"
            style="cursor: pointer"
            @click="handleFilterByScore(row.creditScore)"
          >
            {{ row.creditScore }}
          </el-text>
        </template>

        <template #creditLevel="{ row }">
          <ElTag
            :type="getCreditLevelTagType(row.creditLevel)"
            style="cursor: pointer"
            @click="handleFilterByLevel(row.creditLevel)"
          >
            {{ row.creditLevel }}
          </ElTag>
        </template>

        <template #actions="{ row }">
          <div class="table-toolbar-tools">
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleDetail(row)"
            />
            <IconButton
              v-if="row.creditStatus === '低信用'"
              content="提醒"
              icon-name="Warning"
              @click="handleRemind(row)"
            />
          </div>
        </template>
      </Grid>
    </div>

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="detailFields"
      :title="detailObj ? `${detailObj.userName}信用详情` : '信用详情'"
    />

    <ElDialog v-model="userDialogVisible" title="用户详情" width="520px">
      <ElDescriptions v-if="currentUser" :column="1" border>
        <ElDescriptionsItem label="用户名称">
          {{ currentUser.userName }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="联系电话">
          {{ maskPhone(currentUser.phone) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="用户类型">
          {{ currentUser.userType }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="信用等级">
          {{ currentUser.creditLevel }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="信用分">
          {{ currentUser.creditScore }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="更新时间">
          {{ currentUser.updateTime }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.user-credit-table,
.user-credit-grid-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.user-credit-table {
  display: flex;
  flex-direction: column;
}

.user-credit-grid-wrap {
  flex: 1;
}

:deep(.vxe-grid) {
  height: 100% !important;
}

:deep(.vxe-grid--layout-body-wrapper),
:deep(.vxe-grid--layout-body-content-wrapper),
:deep(.vxe-grid--table-container),
:deep(.vxe-grid--table-wrapper) {
  min-height: 0;
}
</style>
