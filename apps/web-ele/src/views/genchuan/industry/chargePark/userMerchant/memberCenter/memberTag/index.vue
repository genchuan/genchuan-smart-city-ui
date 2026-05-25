<script lang="ts" setup>
import type { UploadUserFile } from 'element-plus';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  MemberTagPageReqVO,
  MemberTagVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberTag';
import type { MemberUserApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import type {
  ActiveFilterTag,
  FilterTagConfig,
} from '#/views/genchuan/industry/chargePark/userMerchant/memberCenter/utils';

import { computed, h, nextTick, onMounted, ref } from 'vue';

import { confirm, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElButton, ElDialog, ElLoading, ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { MemberTagApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberTag';
import { getUserPage } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { downloadFileIfValid } from '#/views/genchuan/industry/chargePark/userMerchant/utils/download';

import PageTabsShell from '../../components/PageTabsShell.vue';
import MemberStatsVisualization from '../components/MemberStatsVisualization.vue';
import { formatMemberStatus, getMemberStatusTagType } from '../memberUser/data';
import {
  buildActiveFilterTags,
  cleanQueryParams,
  formatDateTimeValue,
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
const importDialogVisible = ref(false);
const importFileList = ref<UploadUserFile[]>([]);
const selectedTag = ref<MemberTagVO>();
const tagUserDialogVisible = ref(false);

const tagUserDialogTitle = computed(() =>
  selectedTag.value?.name
    ? `${selectedTag.value.name}会员列表`
    : '标签会员列表',
);

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

async function handleImportTags() {
  const file = importFileList.value[0]?.raw;

  if (!file) {
    ElMessage.warning('请先上传导入文件');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '会员标签导入中...',
  });

  try {
    await MemberTagApi.importMemberTag(file);
    importDialogVisible.value = false;
    importFileList.value = [];
    ElMessage.success('导入成功');
    handleRefresh();
  } catch (error) {
    ElMessage.error('导入失败');
    console.error('[memberTag] import failed:', error);
  } finally {
    loadingInstance.close();
  }
}

async function handleDownloadTemplate() {
  try {
    const data = await MemberTagApi.importMemberTagTemplate();
    await downloadFileIfValid({
      fileName: '会员标签导入模板.xlsx',
      source: data,
    });
    ElMessage.success('模板下载成功');
  } catch (error) {
    ElMessage.error('模板下载失败');
    console.error('[memberTag] download template failed:', error);
  }
}

function handleImportDialogClosed() {
  importFileList.value = [];
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

  const tag = await getTagByName(name);

  if (!tag) {
    ElMessage.warning('未找到对应会员标签');
    return;
  }

  await handleOpenTagUsers(tag);
}

async function getTagByName(name: string) {
  const result = await MemberTagApi.getMemberTagPage({
    name,
    pageNo: 1,
    pageSize: 100,
  });

  return result.list?.find((item) => item.name === name) || result.list?.[0];
}

async function handleOpenTagUsers(row: MemberTagVO) {
  selectedTag.value = row;
  tagUserDialogVisible.value = true;
  await nextTick();
  tagUserGridApi.reload();
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

const [TagUserGrid, tagUserGridApi] = useVbenVxeGrid({
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
        field: 'tagNames',
        title: '会员标签',
        minWidth: 140,
        formatter: ({ row }) =>
          Array.isArray(row.tagNames)
            ? row.tagNames.join('、') || '-'
            : row.tagNames || row.tagIds || '-',
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
          if (!selectedTag.value?.id) {
            return {
              list: [],
              total: 0,
            };
          }

          return await getUserPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            tagIds: [Number(selectedTag.value.id)],
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

    <MemberStatsVisualization
      v-if="showStats"
      :data="statsData"
      @card-click="handleStatsCardClick"
      @pie-click="handleStatsPieClick"
    />

    <PageTabsShell title="会员标签">
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
                content="导入"
                icon-name="Upload"
                @click="() => (importDialogVisible = true)"
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
                v-if="isEnabledStatus(row.status)"
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
          <template #tagName="{ row }">
            <ElButton link type="primary" @click="handleOpenTagUsers(row)">
              {{ row.name || '-' }}
            </ElButton>
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

        <ElDialog
          v-model="importDialogVisible"
          title="导入会员标签"
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
            <ElButton type="primary" @click="handleImportTags">
              开始导入
            </ElButton>
          </template>
        </ElDialog>

        <ElDialog
          v-model="tagUserDialogVisible"
          :title="tagUserDialogTitle"
          width="960px"
        >
          <div class="member-tag-user-dialog">
            <TagUserGrid />
          </div>
        </ElDialog>
      </div>
    </PageTabsShell>
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

.member-tag-user-dialog {
  min-height: 420px;
}
</style>
