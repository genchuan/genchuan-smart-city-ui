<script setup>
import { computed, onMounted, reactive, shallowRef, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  batchAuditShiftApply,
  exportShiftApply,
  getShiftApplyDetail,
  getShiftApplyPage,
  reapplyShiftApply,
} from '#/api/genchuan/industry/chargePark/inspectOp/scheduleMgmt/shiftApply';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import StatusConfirmDialog from '../components/StatusConfirmDialog.vue';
import {
  detailFields,
  filterMockList,
  getStatusLabel,
  getStatusTagType,
  getUserName,
  isStatusLabel,
  loadScheduleUserOptions,
  normalizeShiftApplyRow,
  textObj,
  useBatchAuditFormSchema,
  useGridColumns,
  useReapplyFormSchema,
  useSearchFormSchema,
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  chartFilter: { type: Object, default: null },
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
const detailDrawerRef = shallowRef(null);
const statusConfirmDialogRef = shallowRef(null);
const actionType = shallowRef('batchAudit');
const actionRow = shallowRef({});
const checkedIds = shallowRef([]);
const checkedRows = shallowRef([]);
const filterApplyUserName = shallowRef('');
const filterTargetUserName = shallowRef('');
const filterOldDate = shallowRef('');
const filterNewDate = shallowRef('');
const filterStatus = shallowRef('');
const filterAuditUserId = shallowRef('');
const filterTrendTime = shallowRef('');
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
const currentPageStats = computed(() => ({
  pendingCount: dataObj.list.filter((item) =>
    isStatusLabel(item.status, '待审核'),
  ).length,
  passedCount: dataObj.list.filter((item) =>
    isStatusLabel(item.status, '已通过'),
  ).length,
  rejectedCount: dataObj.list.filter((item) =>
    isStatusLabel(item.status, '已驳回'),
  ).length,
}));
const actionTitle = computed(() =>
  actionType.value === 'reapply' ? textObj.reapplyText : textObj.batchAuditText,
);
const [ActionForm, actionFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useBatchAuditFormSchema(),
  showDefaultActions: false,
});
const [ActionDrawer, actionDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    actionDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await actionFormApi.validate();
    if (!valid) return;
    const values = await actionFormApi.getValues();
    if (actionType.value === 'batchAudit') {
      await submitBatchAudit(values);
      return;
    }
    await submitReapply(values);
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    const formData = actionDrawerApi.getData() || {};
    await actionFormApi.resetForm();
    await actionFormApi.setValues(formData);
  },
});
function buildQueryParams(page) {
  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    applyUserName: filterApplyUserName.value,
    targetUserName: filterTargetUserName.value,
    oldDate:
      filterOldDate.value ||
      dataObj.searchParams.oldDateRange ||
      dataObj.searchParams.oldDate,
    newDate:
      filterNewDate.value ||
      dataObj.searchParams.newDateRange ||
      dataObj.searchParams.newDate,
    status: filterStatus.value || dataObj.searchParams.status,
    auditUserId: filterAuditUserId.value || dataObj.searchParams.auditUserId,
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
    const response = await getShiftApplyPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];
    // if (list.length === 0 && !pageResult?.total)
    // throw new Error('接口返回数据为空');
    dataObj.useStaticData = false;
    dataObj.total = pageResult.total || 0;
    dataObj.list = list.map((item) => normalizeShiftApplyRow(item));
  } catch (error) {
    console.error('获取换班申请数据失败，使用静态数据:', error);
    getPagedMockData(queryParams, page);
  }
  return dataObj;
}
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
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
  submitButtonOptions: { content: '查询' },
});
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'id', isHover: true },
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
    const data = await exportShiftApply(buildQueryParams(dataObj));
    downloadFileFromBlobPart({ fileName: textObj.excelAllName, source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}
async function handleBatchAudit() {
  const pendingRows = checkedRows.value.filter((item) =>
    isStatusLabel(item.status, '待审核'),
  );
  if (pendingRows.length === 0) {
    ElMessage.warning('请选择待审核的申请数据');
    return;
  }
  checkedRows.value = pendingRows;
  checkedIds.value = pendingRows.map((item) => item.id);
  actionType.value = 'batchAudit';
  await actionFormApi.setState({ schema: useBatchAuditFormSchema() });
  actionDrawerApi.setData({ auditResult: '通过', auditRemark: '' }).open();
}
async function submitBatchAudit(values) {
  const auditRemark = String(values.auditRemark || '');
  if (values.auditResult === '驳回' && auditRemark.length < 10) {
    ElMessage.warning('驳回理由不能少于10个字');
    return;
  }
  try {
    await batchAuditShiftApply({
      ids: checkedIds.value,
      auditResult: values.auditResult === '通过' ? '2' : '3',
      auditRemark: values.auditRemark,
    });
    ElMessage.success('批量审核成功');
    actionDrawerApi.close();
    handleRefresh();
  } catch (error) {
    console.error(error);
    ElMessage.error('批量审核失败');
  }
}
async function submitReapply(values) {
  try {
    await reapplyShiftApply({
      id: actionRow.value.id,
      newRemark: values.newRemark,
    });
    ElMessage.success('重新申请成功');
    actionDrawerApi.close();
    handleRefresh();
  } catch (error) {
    console.error(error);
    ElMessage.error('重新申请失败');
  }
}
function onSubmit(values) {
  dataObj.searchParams = { ...values };
  filterOldDate.value = '';
  filterNewDate.value = '';
  filterTrendTime.value = '';
  gridApi.reload();
  drawerApi.close();
}
async function handleOpenDetail(row) {
  try {
    const response = await getShiftApplyDetail(row.id);
    const detail = response?.id ? response : response?.data || response;
    dataObj.detailObj = normalizeShiftApplyRow(detail || row);
  } catch (error) {
    console.error('获取换班申请详情失败，使用行数据:', error);
    dataObj.detailObj = row;
  }
  detailDrawerRef.value?.open();
}
function handleApprove(row) {
  statusConfirmDialogRef.value?.open('approve', row);
}
function handleReject(row) {
  statusConfirmDialogRef.value?.open('reject', row);
}
function handleConfirm(row) {
  statusConfirmDialogRef.value?.open('confirm', row);
}
async function handleReapply(row) {
  actionRow.value = row;
  actionType.value = 'reapply';
  await actionFormApi.setState({ schema: useReapplyFormSchema() });
  actionDrawerApi
    .setData({
      applyUserName: row.applyUserName,
      targetUserName: row.targetUserName,
      newRemark: '',
    })
    .open();
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
function handleUserClick(row, type) {
  dataObj.detailObj = {
    ...row,
    titleName: type === 'target' ? row.targetUserName : row.applyUserName,
  };
  detailDrawerRef.value?.open();
}
function handleOldDateClick(date) {
  filterOldDate.value = filterOldDate.value === date ? '' : date;
  filterTrendTime.value = '';
  gridApi.query();
}
function handleNewDateClick(date) {
  filterNewDate.value = filterNewDate.value === date ? '' : date;
  filterTrendTime.value = '';
  gridApi.query();
}
function handleStatusClick(status) {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
}
function handleAuditUserClick(auditUserId) {
  if (!auditUserId) return;
  filterAuditUserId.value =
    Number(filterAuditUserId.value) === Number(auditUserId) ? '' : auditUserId;
  gridApi.query();
}
function cancelFilter(type) {
  const clearMap = {
    applyUserName: () => {
      filterApplyUserName.value = '';
    },
    auditUserId: () => {
      filterAuditUserId.value = '';
    },
    newDate: () => {
      filterNewDate.value = '';
    },
    oldDate: () => {
      filterOldDate.value = '';
    },
    status: () => {
      filterStatus.value = '';
    },
    targetUserName: () => {
      filterTargetUserName.value = '';
    },
    trendTime: () => {
      filterTrendTime.value = '';
    },
  };
  clearMap[type]?.();
  gridApi.query();
}
watch(
  () => props.chartFilter,
  (filter) => {
    if (!filter) return;
    if (filter.type === 'status') filterStatus.value = filter.value;
    if (filter.type === 'trendTime') {
      filterTrendTime.value = filter.value;
      filterOldDate.value = '';
      filterNewDate.value = '';
    }
    gridApi.query();
  },
  { deep: true },
);

onMounted(() => {
  loadScheduleUserOptions();
});
</script>

<template>
  <div class="park-lot-table-new">
    <ActionDrawer :title="actionTitle"><ActionForm /></ActionDrawer>
    <DetailDrawer
      ref="detailDrawerRef"
      :data="dataObj.detailObj"
      :fields="detailFields"
      :title="`${
        dataObj.detailObj.titleName ||
        dataObj.detailObj.applyUserName ||
        '换班申请'
      }详情`"
    />
    <Drawer title="搜索"><QueryForm class="query-form" /></Drawer>
    <Grid>
      <template #table-title>
        <div class="shift-apply-filter-tags">
          <ElTag
            v-if="filterApplyUserName"
            closable
            type="success"
            @close="cancelFilter('applyUserName')"
          >
            申请人：{{ filterApplyUserName }}
          </ElTag>
          <ElTag
            v-if="filterTargetUserName"
            closable
            type="primary"
            @close="cancelFilter('targetUserName')"
          >
            换班对象：{{ filterTargetUserName }}
          </ElTag>
          <ElTag
            v-if="filterOldDate"
            closable
            type="warning"
            @close="cancelFilter('oldDate')"
          >
            原日期：{{ filterOldDate }}
          </ElTag>
          <ElTag
            v-if="filterNewDate"
            closable
            type="info"
            @close="cancelFilter('newDate')"
          >
            新日期：{{ filterNewDate }}
          </ElTag>
          <ElTag
            v-if="filterStatus"
            closable
            type="danger"
            @close="cancelFilter('status')"
          >
            申请状态：{{ getStatusLabel(filterStatus) }}
          </ElTag>
          <ElTag
            v-if="filterAuditUserId"
            closable
            type="success"
            @close="cancelFilter('auditUserId')"
          >
            审核人：{{ getUserName(filterAuditUserId) }}
          </ElTag>
          <ElTag
            v-if="filterTrendTime"
            closable
            type="primary"
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
            icon-name="Select"
            @click="handleBatchAudit"
          /><IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          /><IconButton
            content="搜索"
            icon-name="search"
            @click="handleSearchShow"
          /><IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #applyUserName="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleUserClick(row, 'apply')"
        >
          {{ row.applyUserName }}
        </el-text>
      </template>
      <template #targetUserName="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleUserClick(row, 'target')"
        >
          {{ row.targetUserName }}
        </el-text>
      </template>
      <template #oldDateStr="{ row }">
        <!--  class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleOldDateClick(row.oldDate)" -->
        <el-text
        >
          {{ row.oldDateStr }}
        </el-text>
      </template>
      <template #newDateStr="{ row }">
        <!--  class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleNewDateClick(row.newDate)" -->
        <el-text
        >
          {{ row.newDateStr }}
        </el-text>
      </template>
      <template #status="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getStatusTagType(row.status)"
          @click="handleStatusClick(row.status)"
        >
          {{ getStatusLabel(row.status) }}
        </ElTag>
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
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="isStatusLabel(row.status, '待审核')"
            content="通过"
            icon-name="Select"
            @click="handleApprove(row)"
          />
          <IconButton
            v-if="isStatusLabel(row.status, '待审核')"
            content="驳回"
            icon-name="CloseBold"
            @click="handleReject(row)"
          />
          <IconButton
            v-if="isStatusLabel(row.status, '已通过')"
            content="确认"
            icon-name="Check"
            @click="handleConfirm(row)"
          />
          <IconButton
            v-if="isStatusLabel(row.status, '已驳回')"
            content="重新申请"
            icon-name="RefreshRight"
            @click="handleReapply(row)"
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
            本页统计：申请 {{ dataObj.list.length }} 条；待审核
            {{ currentPageStats.pendingCount }} 条；已通过
            {{ currentPageStats.passedCount }} 条；已驳回
            {{ currentPageStats.rejectedCount }} 条
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
  </div>
</template>

<style scoped>
.shift-apply-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.shift-apply-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}
</style>
