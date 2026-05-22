<script lang="ts" setup>
import type { UploadUserFile } from 'element-plus';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberUserApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import type {
  ActiveFilterTag,
  FilterTagConfig,
} from '#/views/genchuan/industry/chargePark/userMerchant/memberCenter/utils';

import { computed, onMounted, ref } from 'vue';

import { confirm, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElButton, ElDialog, ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  disableUser,
  enableUser,
  exportUser,
  getUserChart,
  getUserPage,
  importUser,
  importUserTemplate,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { downloadFileIfValid } from '#/views/genchuan/industry/chargePark/userMerchant/utils/download';

import MemberStatsVisualization from '../components/MemberStatsVisualization.vue';
import { buildActiveFilterTags, refreshStatsLayout } from '../utils';
import {
  buildDateRangeByChartName,
  buildMemberUserQueryParams,
  buildRecentMemberRange,
  buildStatsDataFromApi,
  formatMemberStatus,
  isMemberEnabled,
  memberUserDetailFields,
  useGridColumns,
  useGridFormSchema,
} from './data';
import Form from './modules/form.vue';

import '#/genchuan-components/page/index.scss';

const searchParams = ref<Record<string, any>>({});
const drillFilters = ref<Record<string, any>>({});
const statsDataSource = ref(buildStatsDataFromApi());
const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<MemberUserApi.User>();
const showStats = ref(true);
const importDialogVisible = ref(false);
const importFileList = ref<UploadUserFile[]>([]);

const drillFilterConfigs: Record<string, FilterTagConfig> = {
  createTime: {
    label: '注册时间',
    type: 'primary',
  },
};

const searchFilterConfigs: Record<string, FilterTagConfig> = {
  createTime: {
    label: '注册时间',
    type: 'danger',
  },
  groupId: {
    label: '会员分组',
    type: 'warning',
  },
  levelId: {
    label: '会员等级',
    type: 'warning',
  },
  loginDate: {
    label: '登录时间',
    type: 'danger',
  },
  mobile: {
    label: '手机号',
    type: 'info',
  },
  nickname: {
    label: '会员昵称',
    type: 'info',
  },
  status: {
    formatter: formatMemberStatus,
    label: '状态',
    type: 'success',
  },
  tagIds: {
    label: '会员标签',
    type: 'primary',
  },
};

function getMemberUserDisplay(row: MemberUserApi.User) {
  return row.nickname || row.name || row.mobile || `会员${row.id}`;
}

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

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
    const data = await getUserChart();
    statsDataSource.value = buildStatsDataFromApi(data);
  } catch (error) {
    statsDataSource.value = buildStatsDataFromApi();
    ElMessage.error('加载会员统计失败');
    console.error('[memberUser] load stats failed:', error);
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

function handleEdit(row: MemberUserApi.User) {
  formModalApi.setData(row).open();
}

function handleViewDetail(row: MemberUserApi.User) {
  detailObj.value = row;
  detailDrawerRef.value?.open();
}

async function handleToggleStatus(row: MemberUserApi.User) {
  const isEnable = isMemberEnabled(row.status);
  const name = row.nickname || row.mobile || `会员${row.id}`;

  try {
    await confirm(
      isEnable ? `确认禁用【${name}】吗？` : `确认启用【${name}】吗？`,
    );
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    text: `${isEnable ? '正在禁用' : '正在启用'}${name}`,
  });

  try {
    await (isEnable
      ? disableUser({ ids: [row.id as number] })
      : enableUser({ ids: [row.id as number] }));
    ElMessage.success(`${name}${isEnable ? '已禁用' : '已启用'}`);
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleExport() {
  try {
    const data = await exportUser(
      buildMemberUserQueryParams({
        ...searchParams.value,
        ...drillFilters.value,
      }),
    );
    downloadFileFromBlobPart({ fileName: '会员用户.xls', source: data });
    ElMessage.success('导出成功');
  } catch {
    ElMessage.error('导出失败');
  }
}

async function handleImportUsers() {
  const file = importFileList.value[0]?.raw;

  if (!file) {
    ElMessage.warning('请先上传导入文件');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '会员导入中...',
  });

  try {
    await importUser(file);
    importDialogVisible.value = false;
    importFileList.value = [];
    ElMessage.success('导入成功');
    handleRefresh();
  } catch (error) {
    ElMessage.error('导入失败');
    console.error('[memberUser] import failed:', error);
  } finally {
    loadingInstance.close();
  }
}

async function handleDownloadTemplate() {
  try {
    const data = await importUserTemplate();
    await downloadFileIfValid({
      fileName: '会员导入模板.xlsx',
      source: data,
    });
    ElMessage.success('模板下载成功');
  } catch (error) {
    ElMessage.error('模板下载失败');
    console.error('[memberUser] download template failed:', error);
  }
}

function handleImportDialogClosed() {
  importFileList.value = [];
}

async function handleFilterAllMembers() {
  searchParams.value = {};
  drillFilters.value = {};
  await queryFormApi.resetForm();
  await handleRefresh();
}

async function handleFilterRecentMembers() {
  drillFilters.value = {
    createTime: buildRecentMemberRange(),
  };
  await handleRefresh();
}

async function handleStatsCardClick({ index }: { index: number }) {
  if (index === 0) {
    await handleFilterAllMembers();
    return;
  }

  await handleFilterRecentMembers();
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

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const queryValues = buildMemberUserQueryParams({
            ...searchParams.value,
            ...formValues,
            ...drillFilters.value,
          });

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
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<MemberUserApi.User>,
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
              v-access:code="['usermerchant:member-user:create']"
              content="新增会员"
              icon-name="Plus"
              @click="handleCreate"
            />
            <IconButton
              content="导入"
              icon-name="Upload"
              @click="() => (importDialogVisible = true)"
            />
            <IconButton
              v-access:code="['usermerchant:member-user:export']"
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
            @click="handleViewDetail(row)"
          >
            {{ getMemberUserDisplay(row) }}
          </el-text>
        </template>

        <template #actions="{ row }">
          <div class="table-toolbar-tools">
            <IconButton
              content="详情"
              icon-name="View"
              @click="handleViewDetail(row)"
            />
            <IconButton
              v-if="isMemberEnabled(row.status)"
              v-access:code="['usermerchant:member-user:update']"
              content="编辑"
              icon-name="Edit"
              @click="handleEdit(row)"
            />
            <IconButton
              v-access:code="['usermerchant:member-user:update']"
              :content="isMemberEnabled(row.status) ? '禁用' : '启用'"
              :icon-name="isMemberEnabled(row.status) ? 'Close' : 'Check'"
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
        :fields="memberUserDetailFields"
        :title="
          detailObj
            ? `${detailObj.nickname || detailObj.mobile}详情`
            : '会员详情'
        "
      />

      <ElDialog
        v-model="importDialogVisible"
        title="导入会员"
        width="520px"
        @closed="handleImportDialogClosed"
      >
        <div class="import-container">
          <div class="template-section">
            <div class="section-title">1. 下载导入模板</div>
            <div class="section-content">
              <p class="tip-text">
                请使用系统提供的模板格式导入数据，确保数据格式正确
              </p>
              <ElButton type="primary" @click="handleDownloadTemplate">
                下载导入模板
              </ElButton>
            </div>
          </div>

          <div class="upload-section">
            <div class="section-title">2. 上传数据文件</div>
            <div class="section-content">
              <el-upload
                v-model:file-list="importFileList"
                drag
                :auto-upload="false"
                :limit="1"
                accept=".xls,.xlsx,.csv"
              >
                <div class="el-upload__text">
                  将文件拖到此处，或 <em>点击上传</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    支持 .xls、.xlsx、.csv 格式文件
                  </div>
                </template>
              </el-upload>
            </div>
          </div>
        </div>
        <template #footer>
          <ElButton @click="importDialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="handleImportUsers">
            开始导入
          </ElButton>
        </template>
      </ElDialog>
    </div>
  </div>
</template>

<style scoped lang="scss">
.import-container {
  padding: 20px;
}

.template-section,
.upload-section {
  margin-bottom: 24px;
}

.section-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.section-content {
  padding-left: 16px;
}

.tip-text {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
}

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
