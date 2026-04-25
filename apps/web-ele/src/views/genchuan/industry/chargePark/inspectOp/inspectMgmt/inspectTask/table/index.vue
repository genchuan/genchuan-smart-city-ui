<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getInspectPlanDetail } from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectPlan';
import {
  exportInspectTask,
  getInspectTaskDetail,
  getInspectTaskPage,
  transferInspectTask,
} from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectTask';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import {
  detailFields as inspectPlanDetailFields,
  normalizeInspectPlanRow,
} from '../../inspectPlan/table/data';
import StatusConfirmDialog from '../components/StatusConfirmDialog.vue';
import TaskActionDialog from '../components/TaskActionDialog.vue';
import {
  detailFields,
  filterMockList,
  getArchiveTagType,
  getPlanName,
  getProgressStatus,
  getTaskStatusLabel,
  getTaskStatusTagType,
  getTaskTypeTagType,
  getUserName,
  isTaskStatusLabel,
  loadTaskUserOptions,
  normalizeInspectTaskRow,
  textObj,
  useGridColumns,
  userOptions,
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
const planDetailDrawerRef = ref(null);
const actionDialogRef = ref(null);
const statusConfirmDialogRef = ref(null);
const currentTransferRow = ref({});
const checkedIds = ref([]);
const checkedRows = ref([]);
const filterPlanId = ref('');
const filterUserId = ref('');
const filterTaskType = ref('');
const filterStatus = ref('');
const filterStatusGroup = ref('');
const filterArchive = ref('');
const filterTrendTime = ref('');

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  planDetailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
  useStaticData: false,
});

const currentPageStats = computed(() => {
  const pendingCount = dataObj.list.filter(
    (item) => !isTaskStatusLabel(item.status, '已完成'),
  ).length;
  const finishedCount = dataObj.list.filter((item) =>
    isTaskStatusLabel(item.status, '已完成'),
  ).length;
  const archiveCount = dataObj.list.filter((item) => item.isArchive).length;

  return {
    archiveCount,
    finishedCount,
    pendingCount,
  };
});

function buildQueryParams(page) {
  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    planId: filterPlanId.value || dataObj.searchParams.planId,
    userId: filterUserId.value || dataObj.searchParams.userId,
    taskType: filterTaskType.value || dataObj.searchParams.taskType,
    status:
      filterStatusGroup.value === '待处理'
        ? undefined
        : filterStatus.value || dataObj.searchParams.status,
    statusGroup: filterStatusGroup.value || undefined,
    isArchive:
      filterArchive.value === ''
        ? dataObj.searchParams.isArchive
        : filterArchive.value,
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
    const response = await getInspectTaskPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];

    // if (list.length === 0 && !pageResult?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    dataObj.useStaticData = false;
    dataObj.total = pageResult.total || 0;
    dataObj.list = list.map((item) => normalizeInspectTaskRow(item));
  } catch (error) {
    console.error('获取巡检任务数据失败，使用静态数据:', error);
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

const transferFormSchema = [
  {
    fieldName: 'targetUserId',
    label: '巡检人员',
    component: 'Select',
    componentProps: {
      placeholder: '请选择新的巡检人员',
      clearable: true,
      filterable: true,
      options: userOptions,
    },
    rules: 'required',
  },
  {
    fieldName: 'transferReason',
    label: '转派理由',
    component: 'Input',
    componentProps: {
      placeholder: '请输入转派理由',
      maxlength: 255,
      rows: 4,
      showWordLimit: true,
      type: 'textarea',
    },
    rules: 'required',
  },
];

const [TransferForm, transferFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: transferFormSchema,
  showDefaultActions: false,
});

const [TransferDrawer, transferDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    transferDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await transferFormApi.validate();
    if (!valid) return;

    const values = await transferFormApi.getValues();
    try {
      await transferInspectTask({
        id: currentTransferRow.value.id,
        targetUserId: values.targetUserId,
        transferReason: values.transferReason,
      });
      ElMessage.success('任务转派成功');
      transferDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error('巡检任务转派失败:', error);
      ElMessage.error('转派失败，请稍后重试');
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    currentTransferRow.value = transferDrawerApi.getData() || {};
    await transferFormApi.resetForm();
    await transferFormApi.setValues({
      targetUserId: undefined,
      transferReason: '',
    });
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
    const data = await exportInspectTask(buildQueryParams(dataObj));
    downloadFileFromBlobPart({ fileName: textObj.excelAllName, source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}

function handleBatchDispatch() {
  const rows = checkedRows.value;
  if (isEmpty(rows)) {
    ElMessage.warning('请先勾选待派发任务');
    return;
  }
  const invalidRows = rows.filter(
    (item) => !isTaskStatusLabel(item.status, '待派发'),
  );
  if (invalidRows.length > 0) {
    ElMessage.warning('批量派发只支持待派发任务');
    return;
  }
  actionDialogRef.value?.open('batchDispatch', {
    ids: checkedIds.value,
  });
}

function handleDispatch(row) {
  actionDialogRef.value?.open('dispatch', { row });
}

function handleProgress(row) {
  actionDialogRef.value?.open('progress', { row });
}

function handleTransfer(row) {
  transferDrawerApi.setData(row).open();
}

function handleClaim(row) {
  statusConfirmDialogRef.value?.open('claim', row);
}

function handleArchive(row) {
  if (row.isArchive) {
    ElMessage.info('当前任务已归档');
    return;
  }
  statusConfirmDialogRef.value?.open('archive', row);
}

function onSubmit(values) {
  dataObj.searchParams = { ...values };
  filterTrendTime.value = '';
  filterStatusGroup.value = '';
  gridApi.reload();
  drawerApi.close();
}

async function handleOpenDetail(row) {
  try {
    const response = await getInspectTaskDetail(row.id);
    dataObj.detailObj = normalizeInspectTaskRow(response || row);
  } catch (error) {
    console.error('获取巡检任务详情失败，使用行数据:', error);
    dataObj.detailObj = row;
  }
  detailDrawerRef.value?.open();
}

// async function buildPlanDetail(row) {
//   const response = await getInspectPlanDetail(row.planId);
//   return normalizeInspectPlanRow(response || row);
// }

async function handlePlanClick(row) {
  try {
    const response = await getInspectPlanDetail(row.planId);
    dataObj.planDetailObj = normalizeInspectPlanRow(response || row);
  } catch (error) {
    console.error('获取巡检计划详情失败，使用行数据:', error);
    dataObj.planDetailObj = row;
  }
  planDetailDrawerRef.value?.open();
}

function handleProgressDetail(row) {
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

function handleUserClick(userId) {
  if (!userId) return;
  filterUserId.value =
    Number(filterUserId.value) === Number(userId) ? '' : userId;
  gridApi.query();
}

function handleTaskTypeClick(taskType) {
  filterTaskType.value = filterTaskType.value === taskType ? '' : taskType;
  gridApi.query();
}

function handleStatusClick(status) {
  filterStatusGroup.value = '';
  filterStatus.value = filterStatus.value === status ? '' : status;
  filterTrendTime.value = '';
  gridApi.query();
}

function handleArchiveClick(isArchive) {
  filterArchive.value = filterArchive.value === isArchive ? '' : isArchive;
  gridApi.query();
}

function cancelFilter(type) {
  const clearMap = {
    archive: () => {
      filterArchive.value = '';
    },
    planId: () => {
      filterPlanId.value = '';
    },
    status: () => {
      filterStatus.value = '';
      filterStatusGroup.value = '';
    },
    taskType: () => {
      filterTaskType.value = '';
    },
    trendTime: () => {
      filterTrendTime.value = '';
    },
    userId: () => {
      filterUserId.value = '';
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
      if (filter.value === '待处理') {
        filterStatus.value = '';
        filterStatusGroup.value = '待处理';
      } else {
        filterStatus.value = filter.value;
        filterStatusGroup.value = '';
      }
      filterTrendTime.value = '';
    }
    if (filter.type === 'taskType') {
      filterTaskType.value = filter.value;
    }
    if (filter.type === 'trendTime') {
      filterTrendTime.value = filter.value;
    }
    gridApi.query();
  },
  { deep: true },
);

onMounted(() => {
  loadTaskUserOptions();
});
</script>

<template>
  <div class="park-lot-table-new">
    <DetailDrawer
      ref="detailDrawerRef"
      :data="dataObj.detailObj"
      :fields="detailFields"
      :title="`巡检任务 ${dataObj.detailObj.id || ''} 详情`"
    />
    <DetailDrawer
      ref="planDetailDrawerRef"
      :data="dataObj.planDetailObj"
      :fields="inspectPlanDetailFields"
      :title="`${dataObj.planDetailObj.name || '\u5de1\u68c0\u8ba1\u5212'}\u8be6\u60c5`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <TransferDrawer title="转派巡检任务">
      <TransferForm />
    </TransferDrawer>

    <Grid>
      <template #table-title>
        <div class="inspect-task-filter-tags">
          <ElTag
            v-if="filterPlanId"
            closable
            type="primary"
            @close="cancelFilter('planId')"
          >
            关联计划：{{ getPlanName(filterPlanId) }}
          </ElTag>
          <ElTag
            v-if="filterUserId"
            closable
            type="success"
            @close="cancelFilter('userId')"
          >
            巡检人员：{{ getUserName(filterUserId) }}
          </ElTag>
          <ElTag
            v-if="filterTaskType"
            closable
            type="warning"
            @close="cancelFilter('taskType')"
          >
            任务类型：{{ filterTaskType }}
          </ElTag>
          <ElTag
            v-if="filterStatus || filterStatusGroup"
            closable
            type="danger"
            @close="cancelFilter('status')"
          >
            任务状态：{{ filterStatusGroup || filterStatus }}
          </ElTag>
          <ElTag
            v-if="filterArchive !== ''"
            closable
            type="info"
            @close="cancelFilter('archive')"
          >
            归档状态：{{ filterArchive ? '是' : '否' }}
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
            content="批量派发"
            icon-name="Promotion"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchDispatch"
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
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <template #planName="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handlePlanClick(row)"
        >
          {{ row.planName }}
        </el-text>
      </template>

      <template #taskType="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getTaskTypeTagType(row.taskType)"
          @click="handleTaskTypeClick(row.taskType)"
        >
          {{ row.taskType }}
        </ElTag>
      </template>

      <template #userName="{ row }">
        <el-text
          v-if="row.userId"
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleUserClick(row.userId)"
        >
          {{ row.userName }}
        </el-text>
        <span v-else>-</span>
      </template>

      <template #status="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getTaskStatusTagType(row.status)"
          @click="handleStatusClick(row.status)"
        >
          {{ getTaskStatusLabel(row.status) }}
        </ElTag>
      </template>

      <template #progress="{ row }">
        <el-progress
          style="cursor: pointer"
          :percentage="row.progress"
          :status="getProgressStatus(row.progress)"
          @click="handleProgressDetail(row)"
        />
      </template>

      <template #archiveText="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getArchiveTagType(row.isArchive)"
          @click="handleArchiveClick(row.isArchive)"
        >
          {{ row.archiveText }}
        </ElTag>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="isTaskStatusLabel(row.status, '待派发')"
            content="派发"
            icon-name="Promotion"
            @click="handleDispatch(row)"
          />
          <IconButton
            v-if="isTaskStatusLabel(row.status, '待认领')"
            content="认领"
            icon-name="CircleCheckFilled"
            @click="handleClaim(row)"
          />
          <IconButton
            v-if="isTaskStatusLabel(row.status, '处理中')"
            content="更新进度"
            icon-name="EditPen"
            @click="handleProgress(row)"
          />
          <IconButton
            v-if="isTaskStatusLabel(row.status, '处理中')"
            content="转派"
            icon-name="Switch"
            @click="handleTransfer(row)"
          />
          <IconButton
            v-if="isTaskStatusLabel(row.status, '已完成')"
            content="归档"
            icon-name="FolderChecked"
            @click="handleArchive(row)"
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
            本页统计：任务 {{ dataObj.list.length }} 条；待处理
            {{ currentPageStats.pendingCount }} 条；已完成
            {{ currentPageStats.finishedCount }} 条；已归档
            {{ currentPageStats.archiveCount }} 条
          </span>
        </div>
        <div v-if="dataObj.totalShow" class="common-total-bottom">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>

    <TaskActionDialog ref="actionDialogRef" @success="handleRefresh" />
    <StatusConfirmDialog
      ref="statusConfirmDialogRef"
      @success="handleRefresh"
    />
  </div>
</template>

<style scoped>
.inspect-task-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.inspect-task-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}
</style>
