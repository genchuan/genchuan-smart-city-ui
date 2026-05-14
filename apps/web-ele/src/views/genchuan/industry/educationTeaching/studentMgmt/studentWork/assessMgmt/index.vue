<script setup>
import { computed, reactive, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import AssessDetailDrawer from './components/assessDetail.vue';
import {
  getAssessMgmtPage,
  createAssessMgmt,
  updateAssessMgmt,
  publishAssessMgmt,
  exportAssessMgmt,
  getAssessMgmtDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/assessMgmt/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
  useCreateFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/assessMgmt/form.js';

// 辅助函数
const getStatusType = (status) => {
  const map = { '未发布': 'warning', '已发布': 'success' };
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
  const map = { className: '班级', assessType: '考评类型', status: '状态', creator: '创建人', createTime: '创建时间', cycle: '周期' };
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
    const res = await getAssessMgmtPage(params);
    dataObj.total = res.total || 0;
    dataObj.list = res.list || [];
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取考评列表失败，请检查网络或联系管理员');
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
    const data = await exportAssessMgmt(searchParams.value);
    downloadFileFromBlobPart({ fileName: '考评管理列表.xls', source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally { loading.close(); }
}

async function handleBatchPublish() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一条考评记录');
  const selectedRows = checkedRows.value.filter(row => row.status === '未发布');
  if (selectedRows.length === 0) return ElMessage.warning('请选择状态为【未发布】的考评记录');
  try {
    await ElMessageBox.confirm(`确认发布选中的 ${selectedRows.length} 条考评记录？发布后将同步至学生端。`, '批量发布确认', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' });
    const loading = ElLoading.service({ text: '发布中...' });
    try {
      const ids = selectedRows.map(row => row.id);
      const res = await publishAssessMgmt({ ids });
      if (res && res !== false) {
        ElMessage.success('批量发布成功');
        handleRefresh();
      } else { ElMessage.error('批量发布失败'); }
    } finally { loading.close(); }
  } catch { }
}

function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  createDrawerApi.open();
}

function handleEdit(row) {
  if (row.status !== '未发布') return ElMessage.warning('只有未发布状态的考评记录可以编辑');
  isEditMode.value = true;
  currentEditId.value = row.id;
  createDrawerApi.open();
}

async function handlePublish(row) {
  if (row.status !== '未发布') return ElMessage.warning('只有未发布状态的考评记录可以发布');
  try {
    await ElMessageBox.confirm(`确认发布考评记录（班级：${row.className}，类型：${row.assessType}）？发布后将同步至学生端。`, '发布确认', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' });
    const loading = ElLoading.service({ text: '发布中...' });
    try {
      const res = await publishAssessMgmt({ ids: [row.id] });
      if (res && res !== false) {
        ElMessage.success('发布成功');
        handleRefresh();
      } else { ElMessage.error('发布失败'); }
    } finally { loading.close(); }
  } catch { }
}

const [CreateForm, createFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    if (!isEditMode.value) {
      const exist = dataObj.list.some(item => item.className === values.className && item.cycle === values.cycle && item.assessType === values.assessType);
      if (exist) { ElMessage.error('该班级在当前周期已存在相同类型的考评记录'); return; }
    } else {
      const exist = dataObj.list.some(item => item.id !== currentEditId.value && item.className === values.className && item.cycle === values.cycle && item.assessType === values.assessType);
      if (exist) { ElMessage.error('该班级在当前周期已存在相同类型的考评记录'); return; }
    }
    const loading = ElLoading.service({ text: isEditMode.value ? '更新中...' : '保存中...' });
    try {
      let res;
      if (isEditMode.value) {
        res = await updateAssessMgmt({ ...values, id: currentEditId.value });
      } else {
        res = await createAssessMgmt({ ...values, status: values.status || '未发布' });
      }
      if (res && res !== false) {
        ElMessage.success(isEditMode.value ? '更新成功' : '录入成功');
        createDrawerApi.close();
        handleRefresh();
      } else { ElMessage.error(isEditMode.value ? '更新失败' : '录入失败'); }
    } finally { loading.close(); }
  },
  layout: 'horizontal',
  schema: useCreateFormSchema(isEditMode.value),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
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
          const detail = await getAssessMgmtDetail({ id: currentEditId.value });
          await createFormApi.setValues({
            className: detail.className,
            assessType: detail.assessType,
            cycle: detail.cycle,
            score: detail.score,
            assessUser: detail.assessUser,
            status: detail.status,
            remark: detail.remark,
          });
        } catch (error) {
          console.error('加载详情失败', error);
          ElMessage.error('加载详情失败，请检查网络或联系管理员');
          createDrawerApi.close();
        }
      } else {
        await createFormApi.setValues({ status: '未发布' });
      }
    }
  },
});

const assessDetailDrawerRef = ref(null);
function handleOpenDetail(row) {
  dataObj.detailObj = row;
  assessDetailDrawerRef.value.open();
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
  } else if (type === 'className') {
    handleFilterTagClick('className', value);
  } else if (type === 'cycle') {
    handleFilterTagClick('cycle', value);
  }
};

onMounted(() => {
  window.addEventListener('assess-chart-filter', handleChartFilter);
});

onUnmounted(() => {
  window.removeEventListener('assess-chart-filter', handleChartFilter);
});
</script>

<template>
  <div class="tools-table-new">
    <AssessDetailDrawer ref="assessDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh"/>
    <Drawer title="搜索"><QueryForm/></Drawer>
    <CreateDrawer :title="isEditMode ? '编辑考评记录' : '录入考评'"><CreateForm/></CreateDrawer>
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
          <IconButton content="录入" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="发布" icon-name="Promotion" @click="handleBatchPublish"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange"/>
          <span style="width: 30px; display: inline-block;"></span>
        </div>
      </template>

      <template #className="{ row }">
        <el-text @click="handleFilterTagClick('className', row.className)" type="primary"
                 style="cursor: pointer;">{{ row.className }}
        </el-text>
      </template>
      <template #assessType="{ row }">
        <el-text @click="handleFilterTagClick('assessType', row.assessType)" type="primary"
                 style="cursor: pointer;">{{ row.assessType }}
        </el-text>
      </template>
      <template #publishTime="{ row }">
        <el-text>{{ formatTimestamp(row.publishTime) }}</el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)"
                @click="handleFilterTagClick('status', row.status)" style="cursor: pointer;">
          {{ row.status }}
        </el-tag>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary"
                 style="cursor: pointer;">{{ row.creator || '-' }}
        </el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))"
                 type="primary" style="cursor: pointer;">{{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>
      <template #updateTime="{ row }">
        <el-text>{{ formatTimestamp(row.updateTime) }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '未发布'" content="编辑" icon-name="Edit"
                      @click="handleEdit(row)"/>
          <IconButton v-if="row.status === '未发布'" content="发布" icon-name="Promotion"
                      @click="handlePublish(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
