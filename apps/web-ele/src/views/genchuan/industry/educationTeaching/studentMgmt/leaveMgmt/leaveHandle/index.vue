<script setup>
import { computed, reactive, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import LeaveDetailDrawer from './components/leaveDetail.vue';
import {
  getLeaveHandlePage,
  createLeaveHandle,
  updateLeaveHandle,
  confirmLeaveHandle,
  handleLeaveHandle,
  exportLeaveHandle,
  getLeaveHandleDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/leaveMgmt/leaveHandle/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useApplyFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/leaveMgmt/leaveHandle/form.js';

const getStatusType = (status) => {
  const map = { '待确认': 'warning', '待办理': 'primary', '已离校': 'success' };
  return map[status] || 'info';
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

// ---------- 抽屉 ----------
const [Drawer, drawerApi] = useVbenDrawer({ modal: false, footer: false, onCancel: () => drawerApi.close() });

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
const confirmId = ref(null);
const handleId = ref(null);

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const merged = {
      ...searchParams.value,
      ...tagFilters.value,
    };
    const params = {
      ...merged,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    if (params.createTime && Array.isArray(params.createTime) && params.createTime.length === 2) {
      params.createTimeStart = params.createTime[0];
      params.createTimeEnd = params.createTime[1];
      delete params.createTime;
    } else if (params.createTime && typeof params.createTime === 'string') {
      params.createTimeStart = params.createTime;
      params.createTimeEnd = params.createTime;
      delete params.createTime;
    }
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    const res = await getLeaveHandlePage(params);
    dataObj.total = res.total || 0;
    dataObj.list = res.list || [];
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取离校记录失败，请检查网络或联系管理员');
    return dataObj;
  } finally {
    dataObj.loading = false;
  }
};

// ========== 表格实例 ==========
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

// ========== 核心修复：强制重置分页到第一页并刷新 ==========
function resetPageAndQuery() {
  // 使用 commitProxy('reload') 重置分页并重新加载
  if (gridApi.commitProxy) {
    gridApi.commitProxy('reload');
  } else if (gridApi.reload) {
    gridApi.reload();
  } else {
    // 兜底方案：手动重置 dataObj.currentPage 并调用 query
    dataObj.currentPage = 1;
    gridApi.query();
  }
  // 确保界面分页显示第一页
  dataObj.currentPage = 1;
}

// 手动刷新（保持当前页码）
function handleRefresh() {
  gridApi.query();
}

// 重置所有筛选条件
function handleReset() {
  searchParams.value = {};
  tagFilters.value = {};
  resetPageAndQuery();
}

async function handleExport() {
  const loading = ElLoading.service({ text: '正在导出...' });
  try {
    const data = await exportLeaveHandle(searchParams.value);
    downloadFileFromBlobPart({ fileName: `${textObj.excelName}.xls`, source: data });
    ElMessage.success('导出成功');
  } catch (error) { console.error('导出失败:', error); ElMessage.error('导出失败'); }
  finally { loading.close(); }
}

function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  applyDrawerApi.open();
}
function handleEdit(row) {
  isEditMode.value = true;
  currentEditId.value = row.id;
  applyDrawerApi.open();
}
async function handleConfirm(row) {
  if (row.status !== '待确认') return ElMessage.warning('只有待确认状态的记录可以确认');
  try {
    await ElMessageBox.confirm(`确认家长已确认学号"${row.studentId}"的离校申请？确认后状态将变为“待办理”。`, '确认', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' });
    const loading = ElLoading.service({ text: '确认中...' });
    try {
      const res = await confirmLeaveHandle({ id: row.id, parentConfirmTime: Date.now() });
      if (res && res !== false) { ElMessage.success('确认成功'); handleRefresh(); }
      else { ElMessage.error('确认失败'); }
    } finally { loading.close(); }
  } catch { }
}
async function handleHandle(row) {
  if (row.status !== '待办理') return ElMessage.warning('只有待办理状态的记录可以办理');
  try {
    await ElMessageBox.confirm(`确认办理学号"${row.studentId}"的离校手续？办理后将自动完成退宿，状态变更为“已离校”。`, '办理', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' });
    const loading = ElLoading.service({ text: '办理中...' });
    try {
      const res = await handleLeaveHandle({
        id: row.id,
        handleUser: '当前用户',
        handleTime: Date.now(),
        checkoutTime: Date.now(),
        checkoutStatus: '已退宿',
      });
      if (res && res !== false) { ElMessage.success('办理成功'); handleRefresh(); }
      else { ElMessage.error('办理失败'); }
    } finally { loading.close(); }
  } catch { }
}

// 申请表单
const [ApplyForm, applyFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: isEditMode.value ? '保存中...' : '申请中...' });
    try {
      let res;
      const submitData = { ...values, status: values.status || '待确认' };
      if (isEditMode.value) res = await updateLeaveHandle({ ...submitData, id: currentEditId.value });
      else res = await createLeaveHandle(submitData);
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
          const detail = await getLeaveHandleDetail({ id: currentEditId.value });
          await applyFormApi.setValues({
            studentId: detail.studentId,
            leaveTime: detail.leaveTime,
            leaveAddress: detail.leaveAddress,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          applyDrawerApi.close();
        }
      } else {
        await applyFormApi.setValues({ status: '待确认' });
      }
    }
  },
});

const leaveDetailDrawerRef = ref(null);
function handleOpenDetail(row) {
  dataObj.detailObj = row;
  leaveDetailDrawerRef.value.open();
}

// 高级查询表单
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: (values) => {
    searchParams.value = { ...values };
    drawerApi.close();
    resetPageAndQuery(); // 查询时重置页码
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => { delete v.rules; return v; }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// 筛选标签相关函数
function getFieldLabel(field) {
  const map = { status: '状态', creator: '创建人', createTime: '创建时间', studentId: '学号' };
  return map[field] || field;
}
function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

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
  resetPageAndQuery();
}

function clearFilters() {
  tagFilters.value = {};
  resetPageAndQuery();
}

function removeFilterTag(field) {
  delete tagFilters.value[field];
  resetPageAndQuery();
}

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
  } else if (type === 'createTime') {
    handleFilterTagClick('createTime', value);
  }
};

onMounted(() => {
  window.addEventListener('leave-chart-filter', handleChartFilter);
});
onUnmounted(() => {
  window.removeEventListener('leave-chart-filter', handleChartFilter);
});
</script>

<template>
  <div class="park-lot-table-new">
    <LeaveDetailDrawer ref="leaveDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh"/>
    <Drawer title="搜索"><QueryForm/></Drawer>
    <ApplyDrawer :title="isEditMode ? textObj.editText : textObj.applyText"><ApplyForm/></ApplyDrawer>
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
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <span style="width: 30px; display: inline-block;"></span>
        </div>
      </template>

      <template #studentId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">{{ row.studentId }}</el-text>
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
      <template #leaveTime="{ row }"><el-text>{{ formatTimestamp(row.leaveTime) }}</el-text></template>
      <template #parentConfirmTime="{ row }"><el-text>{{ formatTimestamp(row.parentConfirmTime) }}</el-text></template>
      <template #handleTime="{ row }"><el-text>{{ formatTimestamp(row.handleTime) }}</el-text></template>
      <template #checkoutTime="{ row }"><el-text>{{ formatTimestamp(row.checkoutTime) }}</el-text></template>
      <template #updateTime="{ row }"><el-text>{{ formatTimestamp(row.updateTime) }}</el-text></template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '待确认'" content="编辑" icon-name="Edit" @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '待确认'" content="确认" icon-name="Check" @click="handleConfirm(row)"/>
          <IconButton v-if="row.status === '待办理'" content="办理" icon-name="EditPen" @click="handleHandle(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
