<template>
  <div class="park-lot-table-new">
    <Grid @checkbox-change="handleCheckboxChange" @checkbox-all="handleCheckAllChange">
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <el-tag v-for="filter in activeFilters" :key="filter.field" type="primary" closable @close="handleClearField(filter.field)">
            {{ filter.label }}
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="批量审核" icon-name="check" @click="openBatchAudit" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSearchShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <template #id="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.id }}</el-text>
      </template>
      <template #user_name="{ row }">
        <el-text @click="showUserDetail(row.userId)" type="primary" style="cursor: pointer">
          {{ getUserName(row.userId) }}
        </el-text>
      </template>
      <template #orderId="{ row }">
        <el-text v-if="row.orderId" @click="showOrderDetail(row.orderId)" type="primary" style="cursor: pointer">
          {{ row.orderId }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #content="{ row }">
        <el-text @click="filterByContent(row.content)" type="primary" style="cursor: pointer">
          {{ row.content }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="{ 待审核: 'warning', 待处置: 'info', 处置中: 'primary', 已完成: 'success', 已关闭: 'danger' }[row.status]"
                @click="filterByStatus(row.status)" style="cursor: pointer">
          {{ row.status }}
        </el-tag>
      </template>
      <template #audit_user_name="{ row }">
        <el-text v-if="row.auditUserId" @click="showUserDetail(row.auditUserId)" type="primary" style="cursor: pointer">
          {{ row.auditUserName || getUserName(row.auditUserId) }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #handle_user_name="{ row }">
        <el-text v-if="row.handleUserId" @click="showUserDetail(row.handleUserId)" type="primary" style="cursor: pointer">
          {{ row.handleUserName || getUserName(row.handleUserId) }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #feedbackContent="{ row }">
        <span>{{ row.feedbackContent || '-' }}</span>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-if="row.status === '待审核'">
            <IconButton content="通过" icon-name="check" @click="handleApprove(row)" />
            <IconButton content="驳回" icon-name="close" @click="openReject(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
          <template v-else-if="row.status === '待处置'">
            <IconButton content="执行" icon-name="check" @click="handleExecute(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
          <template v-else-if="row.status === '处置中'">
            <IconButton content="反馈" icon-name="Star" @click="openFeedback(row)" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
          <template v-else>
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          </template>
        </div>
      </template>
    </Grid>

    <SearchDrawer title="搜索">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <UserAppealDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" title="用户申诉详情" />

    <RejectDrawer>
      <el-form :model="rejectForm" label-width="100px">
        <el-form-item label="驳回理由" required>
          <el-input v-model="rejectForm.rejectReason" type="textarea" rows="3" placeholder="请输入驳回理由" />
        </el-form-item>
      </el-form>
    </RejectDrawer>

    <FeedbackDrawer>
      <el-form :model="feedbackForm" label-width="100px">
        <el-form-item label="反馈内容" required>
          <el-input v-model="feedbackForm.feedbackContent" type="textarea" rows="3" placeholder="请填写反馈内容" />
        </el-form-item>
      </el-form>
    </FeedbackDrawer>

    <BatchAuditDrawer>
      <el-form :model="batchAuditForm" label-width="100px">
        <el-form-item label="审核结果" required>
          <el-radio-group v-model="batchAuditForm.auditResult">
            <el-radio label="通过">通过</el-radio>
            <el-radio label="驳回">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input v-model="batchAuditForm.auditRemark" type="textarea" rows="2" placeholder="选填" />
        </el-form-item>
        <el-form-item v-if="batchAuditForm.auditResult === '驳回'" label="驳回理由" required>
          <el-input v-model="batchAuditForm.rejectReason" type="textarea" rows="3" placeholder="驳回时必填" />
        </el-form-item>
      </el-form>
    </BatchAuditDrawer>

    <el-dialog v-model="userDetailVisible" title="用户详情" width="400px">
      <p>用户ID：{{ currentUser.id }}</p>
      <p>用户名称：{{ currentUser.name }}</p>
    </el-dialog>

    <el-dialog v-model="orderDetailVisible" title="订单详情" width="600px">
      <p>订单ID：{{ currentOrderId }}</p>
      <p>（此处可嵌入订单详情组件）</p>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';
import { ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import {
  getUserAppealPage,
  exportUserAppeal,
  getUserAppealDetail,
  approveAppeal,
  rejectAppeal,
  executeAppeal,
  feedbackAppeal,
  batchAuditAppeal,
  getUserList,
} from '#/api/genchuan/industry/chargePark/carService/complaintMediate/userAppeal/index.js';
import { useFormSchema, useGridColumns } from './data';
import UserAppealDetailDrawer from './detail.vue';

const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);
const arrowChange = () => emit('arrow-change');

const dataObj = reactive({
  detailObj: {},
  total: 0,
  list: [],
  searchObj: {},
  currentPage: 1,
  pageSize: 10,
  selectedRows: [],
});

const userMap = ref(new Map());
async function fetchUserMap() {
  try {
    const users = await getUserList();
    users.forEach(user => userMap.value.set(String(user.userId), user.userName));
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
}
function getUserName(id) {
  if (id == null) return '-';
  return userMap.value.get(String(id)) || String(id);
}

const getTableData = async (pageObj) => {
  const params = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.searchObj,
  };
  if (dataObj.searchObj.submitTime && Array.isArray(dataObj.searchObj.submitTime)) {
    params.submitTime = dataObj.searchObj.submitTime;
  }
  const res = await getUserAppealPage(params);
  dataObj.total = res.total;
  dataObj.list = (res.list || []).map(v => ({
    ...v,
    createTime: formatTimestamp(v.createTime),
    updateTime: formatTimestamp(v.updateTime),
    submitTime: formatTimestamp(v.submitTime),
    auditTime: formatTimestamp(v.auditTime),
    feedbackTime: formatTimestamp(v.feedbackTime),
  }));
  return dataObj;
};

const [QueryForm, QueryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema().filter(v => v.isSearch).map(v => { delete v.rules; return v; }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      QueryFormApi.resetForm();
      QueryFormApi.submitForm();
    }
  },
});

const resetAllFilters = async () => {
  dataObj.searchObj = {};
  await QueryFormApi.resetFields();
  dataObj.currentPage = 1;
  gridApi.query();
};

async function onSubmit(values, isReset = false) {
  if (isReset) await resetAllFilters();
  else { dataObj.searchObj = { ...values }; dataObj.currentPage = 1; gridApi.query(); }
}

const handleClearField = async (fieldName) => {
  const newSearchObj = { ...dataObj.searchObj };
  delete newSearchObj[fieldName];
  dataObj.searchObj = newSearchObj;
  const currentFormValues = await QueryFormApi.getValues();
  delete currentFormValues[fieldName];
  await QueryFormApi.setValues(currentFormValues, false);
  dataObj.currentPage = 1;
  gridApi.query();
};

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchObj;
  if (obj.userId) filters.push({ label: `用户：${getUserName(obj.userId)}`, field: 'userId' });
  if (obj.orderId) filters.push({ label: `订单：${obj.orderId}`, field: 'orderId' });
  if (obj.status) filters.push({ label: `状态：${obj.status}`, field: 'status' });
  if (obj.submitTime && obj.submitTime.length === 2) {
    filters.push({ label: `提交时间：${obj.submitTime[0]} 至 ${obj.submitTime[1]}`, field: 'submitTime' });
  }
  return filters;
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns({ getUserName }),
    keepSource: true,
    proxyConfig: { ajax: { query: async ({ page }) => getTableData({ page }) } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
    checkboxConfig: { reserve: true, highlight: true, checkField: 'isSelected' },
  },
  showSearchForm: false,
});

function handleRefresh() { gridApi.query(); }
async function handleExport() {
  const data = await exportUserAppeal(dataObj.searchObj);
  downloadFileFromBlobPart({ fileName: '用户申诉记录.xls', source: data });
  ElMessage.success('导出成功');
}

const detailDrawerRef = ref(null);
const handleOpenDetail = async (row) => {
  const res = await getUserAppealDetail({ id: row.id });
  dataObj.detailObj = res;
  detailDrawerRef.value.open();
};

const handleApprove = async (row) => {
  await confirm('确认通过该申诉吗？通过后状态将变为“待处置”。');
  await approveAppeal({ id: row.id, auditRemark: '' });
  ElMessage.success('审核通过');
  handleRefresh();
};

const rejectForm = reactive({ rejectReason: '' });
let currentRejectRow = null;
const [RejectDrawer, rejectDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '驳回申诉',
  onCancel: () => rejectDrawerApi.close(),
  onConfirm: async () => {
    if (!rejectForm.rejectReason) return ElMessage.warning('请填写驳回理由');
    await rejectAppeal({ id: currentRejectRow.id, rejectReason: rejectForm.rejectReason });
    ElMessage.success('已驳回');
    rejectDrawerApi.close();
    handleRefresh();
  },
});
const openReject = (row) => {
  currentRejectRow = row;
  rejectForm.rejectReason = '';
  rejectDrawerApi.open();
};

const handleExecute = async (row) => {
  await confirm('确认认领该申诉吗？认领后状态将变为“处置中”。');
  await executeAppeal({ id: row.id });
  ElMessage.success('已认领，状态更新为处置中');
  handleRefresh();
};

const feedbackForm = reactive({ feedbackContent: '' });
let currentFeedbackRow = null;
const [FeedbackDrawer, feedbackDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '反馈处理结果',
  onCancel: () => feedbackDrawerApi.close(),
  onConfirm: async () => {
    if (!feedbackForm.feedbackContent) return ElMessage.warning('请填写反馈内容');
    await feedbackAppeal({ id: currentFeedbackRow.id, feedbackContent: feedbackForm.feedbackContent });
    ElMessage.success('反馈成功，状态已变更为已完成');
    feedbackDrawerApi.close();
    handleRefresh();
  },
});
const openFeedback = (row) => {
  currentFeedbackRow = row;
  feedbackForm.feedbackContent = '';
  feedbackDrawerApi.open();
};

const batchAuditForm = reactive({ auditResult: '通过', auditRemark: '', rejectReason: '' });
const [BatchAuditDrawer, batchAuditDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 550, title: '批量审核',
  onCancel: () => batchAuditDrawerApi.close(),
  onConfirm: async () => {
    const selectedIds = dataObj.selectedRows.map(row => row.id);
    if (selectedIds.length === 0) return ElMessage.warning('请勾选待审核的申诉记录');
    const invalidRows = dataObj.selectedRows.filter(row => row.status !== '待审核');
    if (invalidRows.length) return ElMessage.warning('只能批量审核“待审核”状态的申诉');
    if (batchAuditForm.auditResult === '驳回' && !batchAuditForm.rejectReason) {
      return ElMessage.warning('驳回时必须填写驳回理由');
    }
    await batchAuditAppeal({
      ids: selectedIds,
      auditResult: batchAuditForm.auditResult,
      auditRemark: batchAuditForm.auditRemark,
      rejectReason: batchAuditForm.rejectReason,
    });
    ElMessage.success('批量审核完成');
    batchAuditDrawerApi.close();
    handleRefresh();
    dataObj.selectedRows = [];
  },
});
const openBatchAudit = () => {
  if (dataObj.selectedRows.length === 0) return ElMessage.warning('请先勾选待审核的申诉记录');
  const invalidRows = dataObj.selectedRows.filter(row => row.status !== '待审核');
  if (invalidRows.length) return ElMessage.warning('只能批量审核“待审核”状态的申诉');
  batchAuditForm.auditResult = '通过';
  batchAuditForm.auditRemark = '';
  batchAuditForm.rejectReason = '';
  batchAuditDrawerApi.open();
};

const filterByStatus = (status) => {
  dataObj.searchObj.status = status;
  dataObj.currentPage = 1;
  gridApi.query();
};
const filterByContent = (content) => {
  dataObj.searchObj.content = content;
  dataObj.currentPage = 1;
  gridApi.query();
};

const userDetailVisible = ref(false);
const currentUser = ref({ id: '', name: '' });
const showUserDetail = (userId) => {
  if (!userId) return;
  currentUser.value = { id: userId, name: getUserName(userId) };
  userDetailVisible.value = true;
};

const orderDetailVisible = ref(false);
const currentOrderId = ref(null);
const showOrderDetail = (orderId) => {
  if (!orderId) return;
  currentOrderId.value = orderId;
  orderDetailVisible.value = true;
};

const handleChartRefresh = (event) => {
  const filters = event.detail;
  const newSearchObj = { ...dataObj.searchObj };
  if (filters?.date) {
    newSearchObj.submitTime = [filters.date, filters.date];
    delete newSearchObj.status;
  } else if (filters?.statusList) {
    if (filters.statusList.includes('待处理')) {
      newSearchObj.status = '待审核,待处置';
    } else if (filters.statusList.includes('已完成')) {
      newSearchObj.status = '已完成';
    }
    delete newSearchObj.submitTime;
  }
  dataObj.searchObj = newSearchObj;
  dataObj.currentPage = 1;
  gridApi.query();
};

const handleCheckboxChange = ({ checked, row }) => {
  if (checked) {
    if (!dataObj.selectedRows.some(r => r.id === row.id)) dataObj.selectedRows.push(row);
  } else {
    const idx = dataObj.selectedRows.findIndex(r => r.id === row.id);
    if (idx !== -1) dataObj.selectedRows.splice(idx, 1);
  }
};
const handleCheckAllChange = ({ checked, rows }) => {
  if (checked) {
    const toAdd = rows.filter(r => r.status === '待审核' && !dataObj.selectedRows.some(ex => ex.id === r.id));
    dataObj.selectedRows.push(...toAdd);
  } else {
    const currentPageIds = rows.map(r => r.id);
    dataObj.selectedRows = dataObj.selectedRows.filter(r => !currentPageIds.includes(r.id));
  }
};

const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 500,
  onCancel: () => searchDrawerApi.close(),
});
const handleSearchShow = () => searchDrawerApi.open();
const handleFullShow = () => screenfull.toggle();

onMounted(() => {
  fetchUserMap();
  window.addEventListener('user-appeal-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('user-appeal-chart-refresh', handleChartRefresh);
});
</script>
