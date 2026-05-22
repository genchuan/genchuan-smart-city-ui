<script setup>
import { computed, reactive, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import DormCheckDetailDrawer from './components/dormCheckDetail.vue';
import {
  getDormCheckPage,
  createDormCheck,
  recheckDormCheck,
  pushDormCheck,
  exportDormCheck,
  getDormCheckDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/dormMgmt/dormCheck/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useCheckFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/dormMgmt/dormCheck/form.js';

const getStatusType = (status) => {
  const map = { '正常': 'success', '异常': 'danger' };
  return map[status] || 'info';
};
const getCheckStatusType = (checkStatus) => {
  const map = { '正常': 'success', '迟到': 'warning', '未到': 'danger' };
  return map[checkStatus] || 'info';
};
const getAbnormalTypeColor = (abnormalType) => {
  const map = { '无': 'success', '晚归': 'warning', '未归': 'danger' };
  return map[abnormalType] || 'info';
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
const [CheckDrawer, checkDrawerApi] = useVbenDrawer({ modal: false, footer: false, onCancel: () => checkDrawerApi.close() });

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
let currentCheckStudentIds = [];

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
    const res = await getDormCheckPage(params);
    dataObj.total = res.total || 0;
    dataObj.list = res.list || [];
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取考勤记录失败，请检查网络或联系管理员');
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
    const data = await exportDormCheck(searchParams.value);
    downloadFileFromBlobPart({ fileName: `${textObj.excelName}.xls`, source: data });
    ElMessage.success('导出成功');
  } catch (error) { console.error('导出失败:', error); ElMessage.error('导出失败'); }
  finally { loading.close(); }
}

async function handleBatchRecheck() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一个考勤记录');
  const abnormalRows = checkedRows.value.filter(row => row.status === '异常');
  if (abnormalRows.length === 0) return ElMessage.warning('请选择状态为【异常】的记录进行补卡');
  try {
    await ElMessageBox.confirm(`确认补卡选中的 ${abnormalRows.length} 条异常记录？补卡后状态将变为正常。`, '批量补卡确认', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' });
    const loading = ElLoading.service({ text: '补卡中...' });
    try {
      const ids = abnormalRows.map(row => row.id);
      const res = await recheckDormCheck({ ids });
      if (res && res !== false) { ElMessage.success('批量补卡成功'); handleRefresh(); }
      else { ElMessage.error('批量补卡失败'); }
    } finally { loading.close(); }
  } catch { }
}

async function handleBatchPush() {
  if (checkedIds.value.length === 0) return ElMessage.warning('请至少选择一个考勤记录');
  const rows = checkedRows.value;
  if (rows.length === 0) return;
  await ElMessageBox.confirm(`确认推送选中的 ${rows.length} 条考勤记录？推送后家长可见。`, '批量推送确认', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' });
  const loading = ElLoading.service({ text: '推送中...' });
  try {
    const ids = rows.map(row => row.id);
    const pushTime = Date.now();
    const res = await pushDormCheck({ ids, pushTime });
    if (res && res !== false) { ElMessage.success('批量推送成功'); handleRefresh(); }
    else { ElMessage.error(res?.msg || '批量推送失败'); }
  } catch (error) { console.error('推送失败:', error); ElMessage.error(error?.message || '批量推送失败'); }
  finally { loading.close(); }
}

function handleBatchCheck() {
  if (checkedRows.value.length === 0) { ElMessage.warning('请至少选择一个考勤记录（用于提取学号）'); return; }
  const studentIds = [...new Set(checkedRows.value.map(row => row.studentId).filter(id => id))];
  if (studentIds.length === 0) { ElMessage.warning('勾选的记录中没有有效的学号'); return; }
  currentCheckStudentIds = studentIds;
  checkFormApi.resetForm();
  checkFormApi.setValues({ checkTime: Date.now() });
  checkDrawerApi.open();
}

async function handleRecheck(row) {
  if (row.status !== '异常') return ElMessage.warning('只有异常状态的记录可以补卡');
  try {
    await ElMessageBox.confirm(`确认补卡学号 ${row.studentId} 的考勤记录？补卡后状态将变为正常。`, '补卡确认', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' });
    const loading = ElLoading.service({ text: '补卡中...' });
    try {
      const res = await recheckDormCheck({ ids: [row.id] });
      if (res && res !== false) { ElMessage.success('补卡成功'); handleRefresh(); }
      else { ElMessage.error('补卡失败'); }
    } finally { loading.close(); }
  } catch { }
}

async function handlePush(row) {
  await ElMessageBox.confirm(`确认推送学号 ${row.studentId} 的考勤记录？`, '推送确认', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' });
  const loading = ElLoading.service({ text: '推送中...' });
  try {
    const pushTime = Date.now();
    const res = await pushDormCheck({ ids: [row.id], pushTime });
    if (res && res !== false) { ElMessage.success('推送成功'); handleRefresh(); }
    else { ElMessage.error('推送失败'); }
  } catch (error) { console.error('推送失败:', error); ElMessage.error(error?.message || '推送失败'); }
  finally { loading.close(); }
}

const [CheckForm, checkFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '打卡中...' });
    try {
      const res = await createDormCheck({
        studentIds: currentCheckStudentIds,
        checkTime: values.checkTime,
      });
      if (res && res !== false) {
        ElMessage.success(`打卡成功，共 ${currentCheckStudentIds.length} 人`);
        checkDrawerApi.close();
        handleRefresh();
      } else { ElMessage.error(res?.msg || '打卡失败'); }
    } catch (error) { console.error('打卡失败:', error); ElMessage.error(error?.message || '打卡失败'); }
    finally { loading.close(); }
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'checkTime',
      label: '考勤时间',
      component: 'DatePicker',
      componentProps: { placeholder: '请选择考勤时间', type: 'datetime', format: 'YYYY-MM-DD HH:mm:ss', valueFormat: 'x' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入备注', type: 'textarea', rows: 3 },
      labelWidth: '100',
    },
  ],
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

const dormCheckDetailDrawerRef = ref(null);
function handleOpenDetail(row) {
  dataObj.detailObj = row;
  dormCheckDetailDrawerRef.value.open();
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
    checkStatus: '考勤状态',
    abnormalType: '异常类型',
    status: '状态',
    creator: '创建人',
    createTime: '创建时间',
    studentId: '学号',
    className: '班级',
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
const showChart = ref(true);
const toggleChart = () => { showChart.value = !showChart.value; };
defineExpose({ handleFilterTagClick, clearFilters });

// ========== 监听图表自定义事件 ==========
const handleChartFilter = (event) => {
  const { type, value } = event.detail;
  if (type === 'checkStatus') {
    handleFilterTagClick('checkStatus', value);
  } else if (type === 'className') {
    handleFilterTagClick('className', value);
  }
};

onMounted(() => {
  window.addEventListener('dorm-check-chart-filter', handleChartFilter);
});
onUnmounted(() => {
  window.removeEventListener('dorm-check-chart-filter', handleChartFilter);
});
</script>

<template>
  <div class="park-lot-table-new">
    <DormCheckDetailDrawer ref="dormCheckDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh"/>
    <Drawer title="搜索"><QueryForm/></Drawer>
    <CheckDrawer :title="textObj.checkText"><CheckForm/></CheckDrawer>

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
          <IconButton content="打卡" icon-name="Checked" @click="handleBatchCheck"/>
          <IconButton content="补卡" icon-name="EditPen" @click="handleBatchRecheck"/>
          <IconButton content="推送" icon-name="Promotion" @click="handleBatchPush"/>
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
      <template #checkStatus="{ row }">
        <el-tag :type="getCheckStatusType(row.checkStatus)" @click="handleFilterTagClick('checkStatus', row.checkStatus)" style="cursor: pointer;">{{ row.checkStatus }}</el-tag>
      </template>
      <template #abnormalType="{ row }">
        <el-tag :type="getAbnormalTypeColor(row.abnormalType)" @click="handleFilterTagClick('abnormalType', row.abnormalType)" style="cursor: pointer;">{{ row.abnormalType }}</el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)" @click="handleFilterTagClick('status', row.status)" style="cursor: pointer;">{{ row.status }}</el-tag>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary" style="cursor: pointer;">{{ row.creator || '-' }}</el-text>
      </template>
      <template #createTime="{ row }">
        <el-text>{{ formatTimestamp(row.createTime) }}</el-text>
      </template>
      <template #checkTime="{ row }"><el-text>{{ formatTimestamp(row.checkTime) }}</el-text></template>
      <template #repairTime="{ row }"><el-text>{{ formatTimestamp(row.repairTime) }}</el-text></template>
      <template #pushTime="{ row }"><el-text>{{ formatTimestamp(row.pushTime) }}</el-text></template>
      <template #updateTime="{ row }"><el-text>{{ formatTimestamp(row.updateTime) }}</el-text></template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton v-if="row.status === '异常'" content="补卡" icon-name="EditPen" @click="handleRecheck(row)"/>
          <IconButton content="推送" icon-name="Promotion" @click="handlePush(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
