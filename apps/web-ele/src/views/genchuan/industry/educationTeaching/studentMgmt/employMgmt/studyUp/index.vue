<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import StudyUpDetailDrawer from './components/studyUpDetail.vue';
import {
  getStudyUpPage,
  selectStudyUp,
  planStudyUp,
  recordStudyUp,
  exportStudyUp,
  getStudyUpDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/employMgmt/studyUp/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useSelectFormSchema,
  usePlanFormSchema,
  useRecordFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/employMgmt/studyUp/form.js';

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// ---------- 标签筛选 ----------
const tagFilters = ref({});

// ---------- 抽屉 ----------
const [Drawer, drawerApi] = useVbenDrawer({ modal: false, footer: false, onCancel: () => drawerApi.close() });
const [SelectDrawer, selectDrawerApi] = useVbenDrawer({ modal: false, footer: false, onCancel: () => selectDrawerApi.close() });
const [PlanDrawer, planDrawerApi] = useVbenDrawer({ modal: false, footer: false, onCancel: () => planDrawerApi.close() });
const [RecordDrawer, recordDrawerApi] = useVbenDrawer({ modal: false, footer: false, onCancel: () => recordDrawerApi.close() });

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
const currentEditId = ref(null);
const currentSelectRow = ref(null);
const currentPlanRow = ref(null);
const currentRecordRow = ref(null);

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
const getStatusType = (status) => {
  const map = { '待规划': 'warning', '已规划': 'success' };
  return map[status] || 'info';
};

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
    const res = await getStudyUpPage(params);
    dataObj.total = res.total || 0;
    dataObj.list = res.list || [];
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取升学记录失败，请检查网络或联系管理员');
    return dataObj;
  } finally {
    dataObj.loading = false;
  }
};

// ========== 表格实例（提前定义，确保 gridApi 可用） ==========
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
  if (gridApi.commitProxy) {
    gridApi.commitProxy('reload');
  } else if (gridApi.reload) {
    gridApi.reload();
  } else {
    dataObj.currentPage = 1;
    gridApi.query();
  }
  dataObj.currentPage = 1; // 确保界面分页显示第一页
}

function handleRefresh() {
  gridApi.query(); // 手动刷新保持当前页码
}

function handleReset() {
  searchParams.value = {};
  tagFilters.value = {};
  resetPageAndQuery();
}

async function handleExport() {
  const loading = ElLoading.service({ text: '正在导出...' });
  try {
    const data = await exportStudyUp(searchParams.value);
    downloadFileFromBlobPart({ fileName: `${textObj.excelName}.xls`, source: data });
    ElMessage.success('导出成功');
  } catch (error) { console.error('导出失败:', error); ElMessage.error('导出失败'); }
  finally { loading.close(); }
}

function handleSelect(row) {
  if (row.status !== '待规划') return ElMessage.warning('只有待规划状态的学生可以选择院校');
  currentSelectRow.value = row;
  selectFormApi.resetForm();
  selectDrawerApi.open();
}
function handlePlan(row) {
  if (row.status !== '待规划') return ElMessage.warning('只有待规划状态的学生可以进行规划');
  currentPlanRow.value = row;
  planFormApi.resetForm();
  planDrawerApi.open();
}
function handleRecord(row) {
  if (row.status !== '已规划') return ElMessage.warning('只有已规划状态的学生可以记录跟踪');
  currentRecordRow.value = row;
  recordFormApi.resetForm();
  recordDrawerApi.open();
}

// 选择表单
const [SelectForm, selectFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '保存中...' });
    try {
      const res = await selectStudyUp({ id: currentSelectRow.value.id, studentId: currentSelectRow.value.studentId, ...values });
      if (res && res !== false) { ElMessage.success('选择成功'); selectDrawerApi.close(); handleRefresh(); }
      else { ElMessage.error('选择失败'); }
    } finally { loading.close(); }
  },
  layout: 'horizontal',
  schema: useSelectFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '确认' },
});

// 规划表单
const [PlanForm, planFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '保存中...' });
    try {
      const res = await planStudyUp({ id: currentPlanRow.value.id, planContent: values.planContent, planTime: Date.now() });
      if (res && res !== false) { ElMessage.success('规划成功'); planDrawerApi.close(); handleRefresh(); }
      else { ElMessage.error('规划失败'); }
    } finally { loading.close(); }
  },
  layout: 'horizontal',
  schema: usePlanFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

// 跟踪记录表单
const [RecordForm, recordFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '保存中...' });
    try {
      const res = await recordStudyUp({ id: currentRecordRow.value.id, recordTime: Date.now(), remark: values.remark });
      if (res && res !== false) { ElMessage.success('记录成功'); recordDrawerApi.close(); handleRefresh(); }
      else { ElMessage.error('记录失败'); }
    } finally { loading.close(); }
  },
  layout: 'horizontal',
  schema: useRecordFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

const studyUpDetailDrawerRef = ref(null);
function handleOpenDetail(row) {
  dataObj.detailObj = row;
  studyUpDetailDrawerRef.value.open();
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

// 筛选标签相关函数（使用 resetPageAndQuery）
function getFieldLabel(field) {
  const map = {
    schoolType: '院校类型',
    schoolName: '院校名称',
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
    studentId: '学号',
    intention: '升学意向',
  };
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
  resetPageAndQuery(); // 筛选时重置页码
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
defineExpose({ handleFilterTagClick, clearFilters });

// ========== 监听图表自定义事件 ==========
const handleChartFilter = (event) => {
  const { type, value } = event.detail;
  if (type === 'status') {
    handleFilterTagClick('status', value);
  } else if (type === 'schoolName') {
    handleFilterTagClick('schoolName', value);
  } else if (type === 'intention') {
    handleFilterTagClick('intention', value);
  } else if (type === 'schoolType') {
    handleFilterTagClick('schoolType', value);
  } else if (type === 'createTime') {
    handleFilterTagClick('createTime', value);
  }
};

onMounted(() => {
  window.addEventListener('studyup-chart-filter', handleChartFilter);
});
onUnmounted(() => {
  window.removeEventListener('studyup-chart-filter', handleChartFilter);
});
</script>

<template>
  <div class="park-lot-table-new">
    <StudyUpDetailDrawer ref="studyUpDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh"/>
    <Drawer title="搜索"><QueryForm/></Drawer>
    <SelectDrawer title="选择目标院校"><SelectForm/></SelectDrawer>
    <PlanDrawer title="升学规划"><PlanForm/></PlanDrawer>
    <RecordDrawer title="跟踪记录"><RecordForm/></RecordDrawer>
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
      <template #schoolName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">{{ row.schoolName || '-' }}</el-text>
      </template>
      <template #schoolType="{ row }">
        <el-text @click="handleFilterTagClick('schoolType', row.schoolType)" type="primary" style="cursor: pointer;">{{ row.schoolType || '-' }}</el-text>
      </template>
      <template #planContent="{ row }">
        <el-text>{{ row.planContent?.substring(0, 50) || '-' }}{{ row.planContent?.length > 50 ? '...' : '' }}</el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)" @click="handleFilterTagClick('status', row.status)" style="cursor: pointer">{{ row.status }}</el-tag>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary" style="cursor: pointer">{{ row.creator || '-' }}</el-text>
      </template>
      <template #createTime="{ row }">
        <el-text>{{ formatTimestamp(row.createTime) }}</el-text>
      </template>
      <template #planTime="{ row }"><el-text>{{ formatTimestamp(row.planTime) }}</el-text></template>
      <template #recordTime="{ row }"><el-text>{{ formatTimestamp(row.recordTime) }}</el-text></template>
      <template #updateTime="{ row }"><el-text>{{ formatTimestamp(row.updateTime) }}</el-text></template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '待规划'" content="选择" icon-name="Select" @click="handleSelect(row)"/>
          <IconButton v-if="row.status === '待规划'" content="规划" icon-name="Edit" @click="handlePlan(row)"/>
          <IconButton v-if="row.status === '已规划'" content="记录" icon-name="Checked" @click="handleRecord(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
