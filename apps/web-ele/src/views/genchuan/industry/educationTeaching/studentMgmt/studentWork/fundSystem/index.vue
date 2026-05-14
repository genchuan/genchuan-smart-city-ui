<script setup>
import { computed, reactive, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import FundDetailDrawer from './components/fundDetail.vue';
import {
  getFundSystemPage,
  createFundSystem,
  updateFundSystem,
  auditFundSystem,
  exportFundSystem,
  getFundSystemDetail,
  getStudentOptions,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/fundSystem/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
  useCreateFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/fundSystem/form.js';

const getStatusType = (status) => {
  const map = { '待审核': 'warning', '已汇总': 'success' };
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
const formatMoney = (amount) => {
  if (amount === null || amount === undefined) return '-';
  return `¥${parseFloat(amount).toFixed(2)}`;
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
  const map = { grade: '年级', fundType: '资助类型', status: '状态', creator: '创建人', createTime: '创建时间' };
  return map[field] || field;
}
function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// ---------- 原有变量 ----------
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

const activeName = ref('全部');
const gridColumns = ref(getColumnsByStatus(activeName.value));
const checkedIds = ref([]);
const checkedRows = ref([]);

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const isEditMode = ref(false);
const currentEditId = ref(null);

const studentOptions = ref([]);
const loadStudentOptions = async () => {
  const res = await getStudentOptions();
  studentOptions.value = res;
};

const createFormSchema = computed(() => {
  const schema = useCreateFormSchema();
  const studentField = schema.find(item => item.fieldName === 'studentId');
  if (studentField) studentField.componentProps.options = studentOptions.value;
  return schema;
});

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      ...tagFilters.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    const res = await getFundSystemPage(params);
    dataObj.total = res.total || 0;
    dataObj.list = res.list || [];
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取资助申请列表失败，请检查网络或联系管理员');
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
    const data = await exportFundSystem(searchParams.value);
    downloadFileFromBlobPart({ fileName: '资助系统列表.xls', source: data });
    ElMessage.success('导出成功');
  } catch (error) { console.error('导出失败:', error); ElMessage.error('导出失败'); }
  finally { loading.close(); }
}

// 批量审核
async function handleBatchAudit() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一条资助申请');
  const selectedRows = checkedRows.value.filter(row => row.status === '待审核');
  if (selectedRows.length === 0) return ElMessage.warning('请选择状态为【待审核】的资助申请');
  try {
    await ElMessageBox.confirm(`确认审核选中的 ${selectedRows.length} 条资助申请？审核后状态将变为"已汇总"。`, '批量审核确认', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' });
    const loading = ElLoading.service({ text: '审核中...' });
    try {
      const ids = selectedRows.map(row => row.id);
      const res = await auditFundSystem({ ids, status: '已汇总' });
      if (res && res !== false) { ElMessage.success('批量审核成功'); handleRefresh(); }
      else { ElMessage.error('批量审核失败'); }
    } finally { loading.close(); }
  } catch { }
}

function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  createDrawerApi.open();
}
function handleEdit(row) {
  isEditMode.value = true;
  currentEditId.value = row.id;
  createDrawerApi.open();
}
async function handleAudit(row) {
  if (row.status !== '待审核') return ElMessage.warning('只有待审核状态的资助申请可以审核');
  try {
    await ElMessageBox.confirm(`确认审核资助申请（学生：${row.studentId}，类型：${row.fundType}）？审核后状态将变为"已汇总"。`, '审核确认', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' });
    const loading = ElLoading.service({ text: '审核中...' });
    try {
      const res = await auditFundSystem({ ids: [row.id], status: '已汇总' });
      if (res && res !== false) { ElMessage.success('审核成功'); handleRefresh(); }
      else { ElMessage.error('审核失败'); }
    } finally { loading.close(); }
  } catch { }
}

// 申请/编辑表单
const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: isEditMode.value ? '更新中...' : '申请中...' });
    try {
      let res;
      if (isEditMode.value) {
        res = await updateFundSystem({ ...values, id: currentEditId.value });
      } else {
        res = await createFundSystem({ ...values, status: values.status || '待审核' });
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '更新成功' : '申请成功');
        createDrawerApi.close();
        handleRefresh();
      } else { ElMessage.error(isEditMode.value ? '更新失败' : '申请失败'); }
    } finally { loading.close(); }
  },
  layout: 'horizontal',
  schema: createFormSchema,
  showCollapseButton: false,
  submitButtonOptions: { content: computed(() => isEditMode.value ? '保存' : '申请') },
});

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => createDrawerApi.close(),
  async onOpenChange(isOpen) {
    if (isOpen) {
      await createFormApi.resetForm();
      if (isEditMode.value && currentEditId.value) {
        try {
          const detail = await getFundSystemDetail({ id: currentEditId.value });
          await createFormApi.setValues({
            studentId: detail.studentId,
            fundType: detail.fundType,
            applyAmount: detail.applyAmount,
            applyTime: detail.applyTime,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          createDrawerApi.close();
        }
      } else {
        await createFormApi.setValues({ status: '待审核' });
      }
    }
  },
});

const fundDetailDrawerRef = ref(null);
function handleOpenDetail(row) {
  dataObj.detailObj = row;
  fundDetailDrawerRef.value.open();
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

watch(activeName, (newVal) => {
  tagFilters.value = {};
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) gridApi.xGrid.refreshColumn();
  else gridApi.setGridOptions?.({ columns: gridColumns.value });
  gridApi.query();
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
  } else if (type === 'grade') {
    handleFilterTagClick('grade', value);
  }
};

onMounted(() => {
  loadStudentOptions();
  window.addEventListener('fund-chart-filter', handleChartFilter);
});
onUnmounted(() => {
  window.removeEventListener('fund-chart-filter', handleChartFilter);
});
</script>

<template>
  <div class="tools-table-new">
    <FundDetailDrawer ref="fundDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh"/>
    <Drawer title="搜索"><QueryForm/></Drawer>
    <CreateDrawer :title="isEditMode ? '编辑资助申请' : '资助申请'"><CreateForm/></CreateDrawer>
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
          <IconButton content="审核" icon-name="Check" @click="handleBatchAudit"/>
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
      <template #grade="{ row }">
        <el-text @click="handleFilterTagClick('grade', row.grade)" type="primary" style="cursor: pointer;">{{ row.grade }}</el-text>
      </template>
      <template #fundType="{ row }">
        <el-text @click="handleFilterTagClick('fundType', row.fundType)" type="primary" style="cursor: pointer;">{{ row.fundType }}</el-text>
      </template>
      <template #applyAmount="{ row }"><el-text>{{ formatMoney(row.applyAmount) }}</el-text></template>
      <template #applyTime="{ row }"><el-text>{{ formatTimestamp(row.applyTime) }}</el-text></template>
      <template #auditTime="{ row }"><el-text>{{ formatTimestamp(row.auditTime) }}</el-text></template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)" @click="handleFilterTagClick('status', row.status)" style="cursor: pointer;">{{ row.status }}</el-tag>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary" style="cursor: pointer;">{{ row.creator || '-' }}</el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))" type="primary" style="cursor: pointer;">{{ formatTimestamp(row.createTime) }}</el-text>
      </template>
      <template #updateTime="{ row }"><el-text>{{ formatTimestamp(row.updateTime) }}</el-text></template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '待审核'" content="编辑" icon-name="Edit" @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '待审核'" content="审核" icon-name="Check" @click="handleAudit(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
