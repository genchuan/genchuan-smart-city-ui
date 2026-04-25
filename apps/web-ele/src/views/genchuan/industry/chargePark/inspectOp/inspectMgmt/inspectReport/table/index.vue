<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportInspectReport,
  getInspectReportDetail,
  getInspectReportPage,
} from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectReport';
import { getInspectTaskDetail } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectTask';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import {
  detailFields as inspectTaskDetailFields,
  normalizeInspectTaskRow,
} from '../../inspectTask/table/data';
import ReportAuditDialog from '../components/ReportAuditDialog.vue';
import ReportProcessDrawer from '../components/ReportProcessDrawer.vue';
import StatusConfirmDialog from '../components/StatusConfirmDialog.vue';
import {
  buildTrendReportTimeRange,
  detailFields,
  filterInspectReportRows,
  filterMockList,
  getReportStatusLabel,
  getReportStatusTagType,
  getReportTypeLabel,
  getReportTypeTagType,
  getTaskName,
  getUserName,
  isReportStatusLabel,
  normalizeInspectReportRow,
  textObj,
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
const taskDetailDrawerRef = ref(null);
const auditDialogRef = ref(null);
const processDrawerRef = ref(null);
const statusConfirmDialogRef = ref(null);
const checkedIds = ref([]);
const checkedRows = ref([]);
const filterTaskId = ref('');
const filterType = ref('');
const filterStatus = ref('');
const filterCreator = ref('');
const filterAuditUserId = ref('');
const filterProcessUserId = ref('');
const filterTrendTime = ref('');

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  taskDetailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
  useStaticData: false,
});

const currentPageStats = computed(() => {
  const waitAuditCount = dataObj.list.filter((item) =>
    isReportStatusLabel(item.status, '待审核'),
  ).length;
  const waitProcessCount = dataObj.list.filter((item) =>
    isReportStatusLabel(item.status, '待处置'),
  ).length;
  const finishedCount = dataObj.list.filter((item) =>
    isReportStatusLabel(item.status, '已完成'),
  ).length;

  return {
    finishedCount,
    waitAuditCount,
    waitProcessCount,
  };
});

function buildQueryParams(page) {
  const trendReportTimeRange = buildTrendReportTimeRange(filterTrendTime.value);

  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    taskId: filterTaskId.value || dataObj.searchParams.taskId,
    type: filterType.value || dataObj.searchParams.type,
    status: filterStatus.value || dataObj.searchParams.status,
    creator: filterCreator.value || dataObj.searchParams.creator,
    auditUserId: filterAuditUserId.value || dataObj.searchParams.auditUserId,
    processUserId:
      filterProcessUserId.value || dataObj.searchParams.processUserId,
    reportTime:
      trendReportTimeRange ||
      dataObj.searchParams.reportTimeRange ||
      dataObj.searchParams.reportTime,
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
    const response = await getInspectReportPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];

    // if (list.length === 0 && !pageResult?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    const normalizedList = list.map((item) => normalizeInspectReportRow(item));
    const visibleList = filterTrendTime.value
      ? filterInspectReportRows(normalizedList, {
          ...queryParams,
          reportTime: undefined,
          reportTimeRange: undefined,
        })
      : normalizedList;

    dataObj.useStaticData = false;
    dataObj.total = filterTrendTime.value
      ? visibleList.length
      : pageResult.total || 0;
    dataObj.list = visibleList;
  } catch (error) {
    console.error('获取巡检上报数据失败，使用静态数据:', error);
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
    const data = await exportInspectReport(buildQueryParams(dataObj));
    downloadFileFromBlobPart({ fileName: textObj.excelAllName, source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}

function handleBatchAudit() {
  const rows = checkedRows.value;
  if (isEmpty(rows)) {
    ElMessage.warning('请先勾选待审核上报');
    return;
  }
  const invalidRows = rows.filter(
    (item) => !isReportStatusLabel(item.status, '待审核'),
  );
  if (invalidRows.length > 0) {
    ElMessage.warning('批量审核只支持待审核上报');
    return;
  }
  auditDialogRef.value?.open('batchAudit', {
    ids: checkedIds.value,
  });
}

function handleApprove(row) {
  statusConfirmDialogRef.value?.open('approve', row);
}

function handleReject(row) {
  auditDialogRef.value?.open('reject', { row });
}

function handleProcess(row) {
  processDrawerRef.value?.open(row);
}

function onSubmit(values) {
  dataObj.searchParams = { ...values };
  filterTrendTime.value = '';
  gridApi.reload();
  drawerApi.close();
}

async function handleOpenDetail(row) {
  try {
    const response = await getInspectReportDetail(row.id);
    dataObj.detailObj = normalizeInspectReportRow(response || row);
  } catch (error) {
    console.error('获取巡检上报详情失败，使用行数据:', error);
    dataObj.detailObj = row;
  }
  detailDrawerRef.value?.open();
}

async function handleTaskClick(row) {
  if (!row.taskId) return;
  try {
    const response = await getInspectTaskDetail(row.taskId);
    dataObj.taskDetailObj = normalizeInspectTaskRow(response || row);
  } catch (error) {
    console.error('获取巡检任务详情失败，使用行数据:', error);
    dataObj.taskDetailObj = normalizeInspectTaskRow({
      id: row.taskId,
      planName: row.taskName,
      status: row.status,
      creator: row.creator,
      createTime: row.createTime,
      updateTime: row.updateTime,
    });
  }
  taskDetailDrawerRef.value?.open();
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
  filterTrendTime.value = '';
  gridApi.query();
}

function handleStatusClick(status) {
  filterStatus.value = filterStatus.value === status ? '' : status;
  filterTrendTime.value = '';
  gridApi.query();
}

function handleCreatorClick(creator) {
  if (!creator || creator === '-') return;
  filterCreator.value = filterCreator.value === creator ? '' : creator;
  gridApi.query();
}

function handleAuditUserClick(userId) {
  if (!userId) return;
  filterAuditUserId.value =
    Number(filterAuditUserId.value) === Number(userId) ? '' : userId;
  gridApi.query();
}

function handleProcessUserClick(userId) {
  if (!userId) return;
  filterProcessUserId.value =
    Number(filterProcessUserId.value) === Number(userId) ? '' : userId;
  gridApi.query();
}

function cancelFilter(type) {
  const clearMap = {
    auditUserId: () => {
      filterAuditUserId.value = '';
    },
    creator: () => {
      filterCreator.value = '';
    },
    processUserId: () => {
      filterProcessUserId.value = '';
    },
    status: () => {
      filterStatus.value = '';
    },
    taskId: () => {
      filterTaskId.value = '';
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
    if (filter.type === 'type') {
      filterType.value = filter.value;
    }
    if (filter.type === 'trendTime') {
      filterTrendTime.value = filter.value;
    }
    gridApi.reload();
  },
  { deep: true },
);
</script>

<template>
  <div class="park-lot-table-new">
    <DetailDrawer
      ref="detailDrawerRef"
      :data="dataObj.detailObj"
      :fields="detailFields"
      :title="`巡检上报 ${dataObj.detailObj.id || ''} 详情`"
    />
    <DetailDrawer
      ref="taskDetailDrawerRef"
      :data="dataObj.taskDetailObj"
      :fields="inspectTaskDetailFields"
      :title="`${dataObj.taskDetailObj.taskName || dataObj.taskDetailObj.planName || '巡检任务'}详情`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="inspect-report-filter-tags">
          <ElTag
            v-if="filterTaskId"
            closable
            type="primary"
            @close="cancelFilter('taskId')"
          >
            关联任务：{{ getTaskName(filterTaskId) }}
          </ElTag>
          <ElTag
            v-if="filterType"
            closable
            :type="getReportTypeTagType(filterType)"
            @close="cancelFilter('type')"
          >
            问题类型：{{ getReportTypeLabel(filterType) }}
          </ElTag>
          <ElTag
            v-if="filterStatus"
            closable
            :type="getReportStatusTagType(filterStatus)"
            @close="cancelFilter('status')"
          >
            上报状态：{{ getReportStatusLabel(filterStatus) }}
          </ElTag>
          <ElTag
            v-if="filterCreator"
            closable
            type="success"
            @close="cancelFilter('creator')"
          >
            上报人：{{ filterCreator }}
          </ElTag>
          <ElTag
            v-if="filterAuditUserId"
            closable
            type="warning"
            @close="cancelFilter('auditUserId')"
          >
            审核人：{{ getUserName(filterAuditUserId) }}
          </ElTag>
          <ElTag
            v-if="filterProcessUserId"
            closable
            type="info"
            @close="cancelFilter('processUserId')"
          >
            处置人：{{ getUserName(filterProcessUserId) }}
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
          <IconButton
            content="批量审核"
            icon-name="CircleCheck"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchAudit"
          />
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
          <!-- <IconButton
            content="刷新"
            icon-name="refresh"
            @click="handleRefresh"
          /> -->
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <template #taskName="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleTaskClick(row)"
        >
          {{ row.taskName }}
        </el-text>
      </template>

      <template #type="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getReportTypeTagType(row.type)"
          @click="handleTypeClick(row.type)"
        >
          {{ getReportTypeLabel(row.type) }}
        </ElTag>
      </template>

      <template #status="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getReportStatusTagType(row.status)"
          @click="handleStatusClick(row.status)"
        >
          {{ getReportStatusLabel(row.status) }}
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

      <template #auditUserName="{ row }">
        <el-text
          v-if="row.auditUserId"
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleAuditUserClick(row.auditUserId)"
        >
          {{ row.auditUserName }}
        </el-text>
        <span v-else>-</span>
      </template>

      <template #processUserName="{ row }">
        <el-text
          v-if="row.processUserId"
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleProcessUserClick(row.processUserId)"
        >
          {{ row.processUserName }}
        </el-text>
        <span v-else>-</span>
      </template>

      <template #remark="{ row }">
        <el-text
          v-if="row.remark || row.processResult"
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleOpenDetail(row)"
        >
          {{ row.remark || row.processResult }}
        </el-text>
        <span v-else>-</span>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="isReportStatusLabel(row.status, '待审核')"
            content="通过"
            icon-name="Check"
            @click="handleApprove(row)"
          />
          <IconButton
            v-if="isReportStatusLabel(row.status, '待审核')"
            content="驳回"
            icon-name="Close"
            @click="handleReject(row)"
          />
          <IconButton
            v-if="isReportStatusLabel(row.status, '待处置')"
            content="执行"
            icon-name="EditPen"
            @click="handleProcess(row)"
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
            本页统计：上报 {{ dataObj.list.length }} 条；待审核
            {{ currentPageStats.waitAuditCount }} 条；待处置
            {{ currentPageStats.waitProcessCount }} 条；已完成
            {{ currentPageStats.finishedCount }} 条
          </span>
        </div>
        <div v-if="dataObj.totalShow" class="common-total-bottom">
          <span>全部统计：共 {{ dataObj.total }} 条；{{ textObj.total }}</span>
        </div>
      </template>
    </Grid>

    <ReportAuditDialog ref="auditDialogRef" @success="handleRefresh" />
    <ReportProcessDrawer ref="processDrawerRef" @success="handleRefresh" />
    <StatusConfirmDialog
      ref="statusConfirmDialogRef"
      @success="handleRefresh"
    />
  </div>
</template>

<style scoped>
.inspect-report-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.inspect-report-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}
</style>
