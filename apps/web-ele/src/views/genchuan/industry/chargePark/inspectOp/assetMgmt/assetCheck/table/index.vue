<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createAssetCheck,
  exportAssetCheck,
  getAssetCheckDetail,
  getAssetCheckPage,
} from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/assetCheck';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import ProgressDialog from '../components/ProgressDialog.vue';
import StatusConfirmDialog from '../components/StatusConfirmDialog.vue';
import {
  detailFields,
  filterMockList,
  getCheckStatusLabel,
  getCheckStatusTagType,
  getCheckTypeLabel,
  getCheckTypeTagType,
  getProgressStatus,
  getUserName,
  isCheckStatusLabel,
  normalizeAssetCheckRow,
  textObj,
  useFormSchema,
  useGridColumns,
  useSearchFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  chartFilter: {
    type: Object,
    default: null,
  },
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

const detailDrawerRef = ref(null);
const statusConfirmDialogRef = ref(null);
const progressDialogRef = ref(null);
const formData = ref({});
const checkedIds = ref([]);
const checkedRows = ref([]);
const filterType = ref('');
const filterStatus = ref('');
const filterCreator = ref('');
const filterExecuteUserId = ref('');
const filterTrendTime = ref('');

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
  useStaticData: false,
});

const currentPageStats = computed(() => {
  const waitingCount = dataObj.list.filter((item) =>
    isCheckStatusLabel(item.status, '待盘点'),
  ).length;
  const runningCount = dataObj.list.filter((item) =>
    isCheckStatusLabel(item.status, '盘点中'),
  ).length;
  const finishedCount = dataObj.list.filter((item) =>
    isCheckStatusLabel(item.status, '已完成'),
  ).length;

  return {
    waitingCount,
    runningCount,
    finishedCount,
  };
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    const values = await formApi.getValues();
    try {
      await createAssetCheck({
        ...values,
        progress: 0,
        status: '待盘点',
      });
      ElMessage.success('新增成功');
      formDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error(error);
      ElMessage.error('发起盘点失败');
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    formData.value = formDrawerApi.getData() || {};
    await formApi.resetForm();
    await formApi.setValues(formData.value);
  },
});

function buildQueryParams(page) {
  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    type: filterType.value || dataObj.searchParams.type,
    status: filterStatus.value || dataObj.searchParams.status,
    creator: filterCreator.value || dataObj.searchParams.creator,
    updater:
      filterExecuteUserId.value || dataObj.searchParams.updater,
    trendTime: filterTrendTime.value,
  };
}

function getPagedMockData(params, page) {
  const filteredList = filterMockList(params);
  dataObj.useStaticData = true;
  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
}

async function getTableData({ page }) {
  dataObj.currentPage = page.currentPage;
  dataObj.pageSize = page.pageSize;
  const queryParams = buildQueryParams(page);

  try {
    const response = await getAssetCheckPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];

    // if (list.length === 0 && !pageResult?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    dataObj.useStaticData = false;
    dataObj.total = pageResult.total || 0;
    dataObj.list = list.map((item) => normalizeAssetCheckRow(item));
  } catch (error) {
    console.error('获取资产盘点数据失败，使用静态数据:', error);
    getPagedMockData(queryParams, page);
  }

  return dataObj;
}

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useSearchFormSchema().map((item) => {
    delete item.rules;
    return { ...item };
  }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: dataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

function handleRowCheckboxChange({ records }) {
  checkedRows.value = records;
  checkedIds.value = records.map((item) => item.id);
}

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  try {
    const data = await exportAssetCheck(buildQueryParams(dataObj));
    downloadFileFromBlobPart({ fileName: textObj.excelAllName, source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}

async function handleCreate() {
  formDrawerApi
    .setData({
      checkTime: Date.now(),
      progress: 0,
      status: '待盘点',
    })
    .open();
}

function handleExecute(row) {
  statusConfirmDialogRef.value?.open('execute', row);
}

function handleUpdateProgress(row) {
  progressDialogRef.value?.open(row);
}

function handleConfirm(row) {
  statusConfirmDialogRef.value?.open('confirm', row);
}

function onSubmit(values) {
  dataObj.searchParams = { ...values };
  filterTrendTime.value = '';
  gridApi.reload();
  drawerApi.close();
}

async function handleOpenDetail(row) {
  try {
    const response = await getAssetCheckDetail(row.id);
    const detail = response?.id ? response : response?.data || response;
    dataObj.detailObj = normalizeAssetCheckRow(detail || row);
  } catch (error) {
    console.error('获取资产盘点详情失败，使用行数据:', error);
    dataObj.detailObj = row;
  }
  detailDrawerRef.value?.open();
}

function handleResultDetail(row) {
  dataObj.detailObj = row;
  detailDrawerRef.value?.open();
}

function handleSearchShow() {
  drawerApi.open();
}

function handleFullShow() {
  screenfull.toggle();
}

function changeTotalShow() {
  dataObj.totalShow = !dataObj.totalShow;
}

function handleTypeClick(type) {
  filterType.value = filterType.value === type ? '' : type;
  gridApi.query();
}

function handleStatusClick(status) {
  filterStatus.value = filterStatus.value === status ? '' : status;
  filterTrendTime.value = '';
  gridApi.query();
}

function handleCreatorClick(creator) {
  filterCreator.value = filterCreator.value === creator ? '' : creator;
  gridApi.query();
}

function handleExecutorClick(updater) {
  filterExecuteUserId.value =
    Number(filterExecuteUserId.value) === Number(updater)
      ? ''
      : updater;
  gridApi.query();
}

function cancelFilter(type) {
  const clearMap = {
    creator: () => {
      filterCreator.value = '';
    },
    updater: () => {
      filterExecuteUserId.value = '';
    },
    status: () => {
      filterStatus.value = '';
    },
    trendTime: () => {
      filterTrendTime.value = '';
    },
    type: () => {
      filterType.value = '';
    },
  };

  clearMap[type]?.();
  gridApi.query();
}

watch(
  () => props.chartFilter,
  (filter) => {
    if (!filter) return;
    if (filter.type === 'status') {
      filterStatus.value = filter.value;
      filterTrendTime.value = '';
    }
    if (filter.type === 'trendTime') {
      filterTrendTime.value = filter.value;
    }
    gridApi.query();
  },
  { deep: true },
);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="textObj.addText">
      <Form />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="dataObj.detailObj"
      :fields="detailFields"
      :title="`盘点单${dataObj.detailObj.id || ''}详情`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="asset-check-filter-tags">
          <ElTag
            v-if="filterType"
            closable
            type="success"
            @close="cancelFilter('type')"
          >
            盘点类型：{{ getCheckTypeLabel(filterType) }}
          </ElTag>
          <ElTag
            v-if="filterStatus"
            closable
            type="warning"
            @close="cancelFilter('status')"
          >
            盘点状态：{{ getCheckStatusLabel(filterStatus) }}
          </ElTag>
          <ElTag
            v-if="filterCreator"
            closable
            type="primary"
            @close="cancelFilter('creator')"
          >
            发起人员：{{ filterCreator }}
          </ElTag>
          <ElTag
            v-if="filterExecuteUserId"
            closable
            type="info"
            @close="cancelFilter('updater')"
          >
            执行人员：{{ filterExecuteUserId }}
          </ElTag>
          <ElTag
            v-if="filterTrendTime"
            closable
            type="danger"
            @close="cancelFilter('trendTime')"
          >
            趋势时间：{{ filterTrendTime }}
          </ElTag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="盘点" icon-name="Plus" @click="handleCreate" />
          <IconButton
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
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <template #type="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getCheckTypeTagType(row.type)"
          @click="handleTypeClick(row.type)"
        >
          {{ getCheckTypeLabel(row.type) }}
        </ElTag>
      </template>

      <template #progress="{ row }">
        <el-progress
          style="cursor: pointer"
          :percentage="row.progress"
          :status="getProgressStatus(row.progress)"
          @click="handleResultDetail(row)"
        >
          <span>{{ row.progressText }}</span>
        </el-progress>
      </template>

      <template #status="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getCheckStatusTagType(row.status)"
          @click="handleStatusClick(row.status)"
        >
          {{ getCheckStatusLabel(row.status) }}
        </ElTag>
      </template>

      <template #creator="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleCreatorClick(row.creator)"
        >
          {{ row.creator }}
        </el-text>
      </template>

      <template #updater="{ row }">
        <el-text
          v-if="row.updater"
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleExecutorClick(row.updater)"
        >
          {{ row.updater }}
        </el-text>
        <span v-else>-</span>
      </template>

      <template #result="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleResultDetail(row)"
        >
          {{ row.result }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="isCheckStatusLabel(row.status, '待盘点')"
            content="执行"
            icon-name="CircleCheckFilled"
            @click="handleExecute(row)"
          />
          <IconButton
            v-if="isCheckStatusLabel(row.status, '盘点中')"
            content="更新进度"
            icon-name="Edit"
            @click="handleUpdateProgress(row)"
          />
          <IconButton
            v-if="isCheckStatusLabel(row.status, '已完成')"
            content="确认"
            icon-name="Select"
            @click="handleConfirm(row)"
          />
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon v-if="!dataObj.totalShow" class="tabel-tab-icon">
            <ArrowDown />
          </el-icon>
          <el-icon v-if="dataObj.totalShow" class="tabel-tab-icon">
            <ArrowUp />
          </el-icon>
          <span>
            本页统计：盘点 {{ dataObj.list.length }} 条；待盘点
            {{ currentPageStats.waitingCount }} 条；盘点中
            {{ currentPageStats.runningCount }} 条；已完成
            {{ currentPageStats.finishedCount }} 条
          </span>
        </div>
        <div v-if="dataObj.totalShow" class="common-total-bottom">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>

    <StatusConfirmDialog
      ref="statusConfirmDialogRef"
      @success="handleRefresh"
    />
    <ProgressDialog ref="progressDialogRef" @success="handleRefresh" />
  </div>
</template>

<style scoped>
.asset-check-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.asset-check-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}
</style>
