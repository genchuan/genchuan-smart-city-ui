<script setup>
import { computed, reactive, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import RepairDetailDrawer from './components/repairDetail.vue';
import {
  getRepairMgmtPage,
  createRepairMgmt,
  assignRepairMgmt,
  feedbackRepairMgmt,
  acceptRepairMgmt,
  updateRepairMgmt,
  exportRepairMgmt,
  getRepairMgmtDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/dormMgmt/repairMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useApplyFormSchema,
  useFeedbackFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/dormMgmt/repairMgmt/form.js';

const getStatusType = (status) => {
  const map = { '待派单': 'warning', '维修中': 'primary', '已维修': 'success' };
  return map[status] || 'info';
};
const getCheckStatusType = (checkStatus) => {
  const map = { '未验收': 'danger', '已验收': 'success' };
  return map[checkStatus] || 'info';
};
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
const getDateFromTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// ---------- 标签筛选 ----------
const tagFilters = ref({});

// 核心修改：支持空值清除筛选，使用 gridApi.query()
function handleFilterTagClick(field, value) {
  if (!field) return;
  if (value === '' || value === null || value === undefined) {
    if (tagFilters.value[field] !== undefined) delete tagFilters.value[field];
  } else {
    const existing = tagFilters.value[field];
    if (existing !== undefined) {
      if (Array.isArray(existing) && existing.length === 1 && existing[0] === value) {
        delete tagFilters.value[field];
      } else if (!Array.isArray(existing) && existing === value) {
        delete tagFilters.value[field];
      } else {
        tagFilters.value[field] = value;
      }
    } else {
      tagFilters.value[field] = value;
    }
  }
  gridApi.query(); // 改为 query()
}

function clearFilters() {
  tagFilters.value = {};
  gridApi.query();
}

function removeFilterTag(field) {
  delete tagFilters.value[field];
  gridApi.query();
}

function getFieldLabel(field) {
  const map = {
    dormNum: '宿舍号',
    repairType: '报修类型',
    checkStatus: '验收状态',
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
  };
  return map[field] || field;
}
function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// ---------- 抽屉 ----------
const [Drawer, drawerApi] = useVbenDrawer({ modal: false, footer: false, onCancel: () => drawerApi.close() });
const [FeedbackDrawer, feedbackDrawerApi] = useVbenDrawer({ modal: false, footer: false, onCancel: () => feedbackDrawerApi.close() });

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  loading: false,
});

const gridColumns = ref(getColumns());
const checkedIds = ref([]);
const checkedRows = ref([]);

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const isEditMode = ref(false);
const currentEditId = ref(null);
const assignIds = ref([]);
const feedbackIds = ref([]);
const assignVisible = ref(false);
const assignRepairUser = ref('');
const currentAssignIds = ref([]);

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      dormNum: tagFilters.value.dormNum,
      repairType: tagFilters.value.repairType,
      status: tagFilters.value.status,
      creator: tagFilters.value.creator,
      checkStatus: tagFilters.value.checkStatus,
    };
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key];
    });
    const res = await getRepairMgmtPage(params);
    dataObj.total = res.total || 0;
    dataObj.list = res.list || [];
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取报修列表失败，请检查网络或联系管理员');
    return dataObj;
  } finally {
    dataObj.loading = false;
  }
};

function handleRefresh() { gridApi.query(); }
function handleReset() { searchParams.value = {}; tagFilters.value = {}; gridApi.query(); }

async function handleExport() {
  const loading = ElLoading.service({ text: '正在导出...' });
  try {
    const data = await exportRepairMgmt(searchParams.value);
    downloadFileFromBlobPart({ fileName: `${textObj.excelName}.xls`, source: data });
    ElMessage.success('导出成功');
  } catch (error) { console.error('导出失败:', error); ElMessage.error('导出失败'); }
  finally { loading.close(); }
}

async function handleBatchAssign() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一个报修记录');
  const pendingRows = checkedRows.value.filter(row => row.status === '待派单');
  if (pendingRows.length === 0) return ElMessage.warning('请选择状态为【待派单】的记录进行派单');
  currentAssignIds.value = pendingRows.map(row => row.id);
  assignRepairUser.value = '';
  assignVisible.value = true;
}
async function submitAssign() {
  if (!assignRepairUser.value || !assignRepairUser.value.trim()) { ElMessage.warning('请输入维修人姓名'); return; }
  const loading = ElLoading.service({ text: '派单中...' });
  try {
    const res = await assignRepairMgmt({ ids: currentAssignIds.value, repairUser: assignRepairUser.value.trim() });
    if (res && res !== false) { ElMessage.success('派单成功'); assignVisible.value = false; handleRefresh(); }
    else { ElMessage.error('派单失败'); }
  } finally { loading.close(); }
}

async function handleBatchFeedback() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一个报修记录');
  const repairingRows = checkedRows.value.filter(row => row.status === '维修中');
  if (repairingRows.length === 0) return ElMessage.warning('请选择状态为【维修中】的记录进行反馈');
  feedbackIds.value = repairingRows.map(row => row.id);
  feedbackFormApi.resetForm();
  feedbackDrawerApi.open();
}

function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  applyDrawerApi.open();
}
function handleEdit(row) {
  if (row.status !== '待派单') return ElMessage.warning('只有待派单状态的报修可以编辑');
  isEditMode.value = true;
  currentEditId.value = row.id;
  applyDrawerApi.open();
}
async function handleAssign(row) {
  if (row.status !== '待派单') return ElMessage.warning('只有待派单状态的报修可以派单');
  currentAssignIds.value = [row.id];
  assignRepairUser.value = '';
  assignVisible.value = true;
}
async function handleFeedback(row) {
  if (row.status !== '维修中') return ElMessage.warning('只有维修中状态的报修可以反馈');
  feedbackIds.value = [row.id];
  feedbackFormApi.resetForm();
  feedbackDrawerApi.open();
}
async function handleAccept(row) {
  if (row.status !== '已维修') return ElMessage.warning('只有已维修状态的报修可以验收');
  if (row.checkStatus === '已验收') return ElMessage.warning('该报修已验收，不可重复验收');
  try {
    await ElMessageBox.confirm(`确认验收报修（宿舍 ${row.dormNum}）？验收后验收状态将变为“已验收”。`, '验收确认', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' });
    const loading = ElLoading.service({ text: '验收中...' });
    try {
      const res = await acceptRepairMgmt({ id: row.id });
      if (res && res !== false) { ElMessage.success('验收成功'); handleRefresh(); }
      else { ElMessage.error('验收失败'); }
    } finally { loading.close(); }
  } catch { }
}

// 申请表单
const [ApplyForm, applyFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: isEditMode.value ? '保存中...' : '提交中...' });
    try {
      let res;
      if (isEditMode.value) res = await updateRepairMgmt({ ...values, id: currentEditId.value });
      else res = await createRepairMgmt({ ...values, status: values.status || '待派单' });
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '编辑成功' : '申请成功');
        applyDrawerApi.close();
        handleRefresh();
      } else { ElMessage.error(isEditMode.value ? '编辑失败' : '申请失败'); }
    } finally { loading.close(); }
  },
  layout: 'horizontal',
  schema: useApplyFormSchema(isEditMode.value),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

const [ApplyDrawer, applyDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => applyDrawerApi.close(),
  async onOpenChange(isOpen) {
    if (isOpen) {
      await applyFormApi.resetForm();
      if (isEditMode.value && currentEditId.value) {
        try {
          const detail = await getRepairMgmtDetail({ id: currentEditId.value });
          await applyFormApi.setValues({
            dormNum: detail.dormNum,
            repairType: detail.repairType,
            applyTime: detail.applyTime,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          applyDrawerApi.close();
        }
      } else {
        await applyFormApi.setValues({ applyTime: Date.now(), status: '待派单' });
      }
    }
  },
});

// 反馈表单
const [FeedbackForm, feedbackFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '提交反馈...' });
    try {
      const res = await feedbackRepairMgmt({ ids: feedbackIds.value, feedbackContent: values.feedbackContent });
      if (res && res !== false) { ElMessage.success('反馈成功'); feedbackDrawerApi.close(); handleRefresh(); }
      else { ElMessage.error('反馈失败'); }
    } finally { loading.close(); }
  },
  layout: 'horizontal',
  schema: useFeedbackFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

const repairDetailDrawerRef = ref(null);
function handleOpenDetail(row) {
  dataObj.detailObj = row;
  repairDetailDrawerRef.value.open();
}

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: (values) => {
    searchParams.value = { ...values };
    drawerApi.close();
    gridApi.query();
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => { delete v.rules; return v; }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: { ajax: { query: getTableData } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: { checkboxAll: handleRowCheckboxChange, checkboxChange: handleRowCheckboxChange },
  showSearchForm: false,
});

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');
const showChart = ref(true);
const toggleChart = () => { showChart.value = !showChart.value; };
defineExpose({ handleFilterTagClick, clearFilters });

// ========== 监听图表自定义事件 ==========
const handleChartFilter = (event) => {
  const { type, value } = event.detail;
  if (type === 'status') {
    handleFilterTagClick('status', value);
  } else if (type === 'repairType') {
    handleFilterTagClick('repairType', value);
  } else if (type === 'checkStatus') {
    handleFilterTagClick('checkStatus', value);
  }
};

onMounted(() => {
  window.addEventListener('repair-chart-filter', handleChartFilter);
});
onUnmounted(() => {
  window.removeEventListener('repair-chart-filter', handleChartFilter);
});
</script>

<template>
  <div class="park-lot-table-new">
    <RepairDetailDrawer ref="repairDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh"/>
    <Drawer title="搜索"><QueryForm/></Drawer>
    <ApplyDrawer :title="isEditMode ? textObj.editText : textObj.applyText"><ApplyForm/></ApplyDrawer>
    <FeedbackDrawer :title="textObj.feedbackText"><FeedbackForm/></FeedbackDrawer>

    <el-dialog v-model="assignVisible" title="派单" width="400px">
      <el-form label-width="80px">
        <el-form-item label="维修人">
          <el-input v-model="assignRepairUser" placeholder="请输入维修人姓名" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAssign">确认派单</el-button>
      </template>
    </el-dialog>

    <Grid>
      <template #table-title>
        <ElTag
          v-for="(value, field) in tagFilters"
          :key="field"
          type="success"
          closable
          @close="removeFilterTag(field)"
          style="height: 32px; margin: 4px 8px 4px 0; line-height: 32px"
        >
          {{ getFieldLabel(field) }}: {{ getTagDisplayText(field, value) }}
        </ElTag>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="申请" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="派单" icon-name="User" @click="handleBatchAssign"/>
          <IconButton content="反馈" icon-name="EditPen" @click="handleBatchFeedback"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <span style="width: 30px; display: inline-block;"></span>
        </div>
      </template>

      <template #dormNum="{ row }">
        <el-text @click="handleFilterTagClick('dormNum', row.dormNum)" type="primary" style="cursor: pointer;">{{ row.dormNum }}</el-text>
      </template>
      <template #repairType="{ row }">
        <el-text @click="handleFilterTagClick('repairType', row.repairType)" type="primary" style="cursor: pointer;">{{ row.repairType }}</el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)" @click="handleFilterTagClick('status', row.status)" style="cursor: pointer;">{{ row.status }}</el-tag>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary" style="cursor: pointer;">{{ row.creator || '-' }}</el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))" type="primary" style="cursor: pointer;">{{ formatTimestamp(row.createTime) }}</el-text>
      </template>
      <template #applyTime="{ row }"><el-text>{{ formatTimestamp(row.applyTime) }}</el-text></template>
      <template #dispatchTime="{ row }"><el-text>{{ formatTimestamp(row.dispatchTime) }}</el-text></template>
      <template #feedbackTime="{ row }"><el-text>{{ formatTimestamp(row.feedbackTime) }}</el-text></template>
      <template #checkTime="{ row }"><el-text>{{ formatTimestamp(row.checkTime) }}</el-text></template>
      <template #updateTime="{ row }"><el-text>{{ formatTimestamp(row.updateTime) }}</el-text></template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '待派单'" content="编辑" icon-name="Edit" @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '待派单'" content="派单" icon-name="User" @click="handleAssign(row)"/>
          <IconButton v-if="row.status === '维修中'" content="反馈" icon-name="EditPen" @click="handleFeedback(row)"/>
          <IconButton v-if="row.status === '已维修'" content="验收" icon-name="Check" @click="handleAccept(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
