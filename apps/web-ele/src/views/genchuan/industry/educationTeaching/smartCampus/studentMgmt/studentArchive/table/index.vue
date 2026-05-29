<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox, ElUpload } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import StudentArchiveDetailDrawer from '../components/studentArchiveDetail.vue';
import {
  getStudentArchivePage,
  createStudentArchive,
  updateStudentArchive,
  auditStudentArchive,
  maintainStudentArchive,
  exportStudentArchive,
  getStudentArchiveDetail,
  importStudentArchive,
} from '#/api/genchuan/industry/educationTeaching/smartCampus/studentMgmt/studentArchive/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useArchiveFormSchema,
  useAuditFormSchema,
  useMaintainFormSchema,
} from '#/api/genchuan/industry/educationTeaching/smartCampus/studentMgmt/studentArchive/form.js';

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// ---------- 标签筛选 ----------
const tagFilters = ref({});

// ---------- 抽屉 ----------
const [Drawer, drawerApi] = useVbenDrawer({ modal: false, footer: false, onCancel: () => drawerApi.close() });
const [ArchiveDrawer, archiveDrawerApi] = useVbenDrawer({ modal: false, footer: false, onCancel: () => archiveDrawerApi.close() });
const [AuditDrawer, auditDrawerApi] = useVbenDrawer({ modal: false, footer: false, onCancel: () => auditDrawerApi.close() });
const [MaintainDrawer, maintainDrawerApi] = useVbenDrawer({ modal: false, footer: false, onCancel: () => maintainDrawerApi.close() });

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
const currentAuditIds = ref([]);
const currentMaintainRow = ref(null);

// 时间戳格式化
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

// 状态映射（value -> label）
const statusMap = { '0': '在籍', '1': '休学', '2': '退学', '3': '异动' };
const processStatusMap = { '0': '待审核', '1': '正常', '2': '已归档' };
const getStatusLabel = (status) => statusMap[status] || status;
const getProcessStatusLabel = (status) => processStatusMap[status] || status;

const getStatusType = (status) => {
  const map = { '0': 'success', '1': 'warning', '2': 'danger', '3': 'info' };
  return map[status] || 'info';
};
const getProcessStatusType = (status) => {
  const map = { '0': 'warning', '1': 'success', '2': 'info' };
  return map[status] || 'info';
};

// 脱敏函数
const maskIdCard = (idCard) => {
  if (!idCard) return '-';
  if (idCard.length === 18) return idCard.substring(0, 6) + '********' + idCard.substring(14);
  if (idCard.length === 15) return idCard.substring(0, 6) + '******' + idCard.substring(12);
  return idCard;
};
const maskPhone = (phone) => {
  if (!phone) return '-';
  if (phone.length === 11) return phone.substring(0, 3) + '****' + phone.substring(7);
  return phone;
};

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const merged = { ...searchParams.value, ...tagFilters.value };
    const params = { ...merged, pageNo: page.currentPage, pageSize: page.pageSize };
    // 处理建档时间范围
    if (params.archiveTime && Array.isArray(params.archiveTime) && params.archiveTime.length === 2) {
      params.archiveTimeStart = params.archiveTime[0];
      params.archiveTimeEnd = params.archiveTime[1];
      delete params.archiveTime;
    }
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key];
    });
    const res = await getStudentArchivePage(params);
    dataObj.total = res.total || 0;
    dataObj.list = (res.list || []).map(item => ({
      ...item,
      idCardMask: maskIdCard(item.idCard),
      phoneMask: maskPhone(item.phone),
      parentPhoneMask: maskPhone(item.parentPhone),
      statusLabel: getStatusLabel(item.status),
      processStatusLabel: getProcessStatusLabel(item.processStatus),
    }));
    return dataObj;
  } catch (error) {
    console.error('获取数据失败:', error);
    dataObj.total = 0;
    dataObj.list = [];
    ElMessage.error('获取学籍档案失败，请检查网络或联系管理员');
    return dataObj;
  } finally {
    dataObj.loading = false;
  }
};

// 表格实例
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

function resetPageAndQuery() {
  if (gridApi.commitProxy) gridApi.commitProxy('reload');
  else if (gridApi.reload) gridApi.reload();
  else { dataObj.currentPage = 1; gridApi.query(); }
  dataObj.currentPage = 1;
}

function handleRefresh() { gridApi.query(); }
function handleReset() { searchParams.value = {}; tagFilters.value = {}; resetPageAndQuery(); }

// 导出（批量）
async function handleExport() {
  const loading = ElLoading.service({ text: '正在导出...' });
  try {
    const params = { ...searchParams.value, ...tagFilters.value };
    const data = await exportStudentArchive(params);
    downloadFileFromBlobPart({ fileName: `${textObj.excelName}.xls`, source: data });
    ElMessage.success('导出成功');
  } catch (error) { console.error('导出失败:', error); ElMessage.error('导出失败'); }
  finally { loading.close(); }
}

// 批量导入（后端未实现）
function handleImport() {
  ElMessage.info('批量导入功能后端接口待实现');
}

// 新增
function handleCreate() {
  isEditMode.value = false;
  currentEditId.value = null;
  archiveFormApi.resetForm();
  // 设置默认值：建档时间为当前时间戳，学籍状态为在籍(0)，流程状态为待审核(0)
  archiveFormApi.setValues({
    archiveTime: Date.now(),
    status: '0',
    processStatus: '0'
  });
  archiveDrawerApi.open();
}

// 编辑
async function handleEdit(row) {
  isEditMode.value = true;
  currentEditId.value = row.id;
  try {
    const detail = await getStudentArchiveDetail({ id: row.id });
    archiveFormApi.setValues({
      studentNo: detail.studentNo,
      name: detail.name,
      classId: detail.classId,
      major: detail.major,
      level: detail.level,
      studyType: detail.studyType,
      idCard: detail.idCard,
      phone: detail.phone,
      parentPhone: detail.parentPhone,
      archiveTime: detail.archiveTime,
      status: detail.status,
      processStatus: detail.processStatus,
      remark: detail.remark,
    });
    archiveDrawerApi.open();
  } catch (error) {
    console.error('加载详情失败', error);
    ElMessage.error('加载详情失败');
  }
}

// 审核（批量）
async function handleBatchAudit() {
  if (checkedIds.value.length === 0) { ElMessage.warning('请至少选择一个记录'); return; }
  const pendingRows = checkedRows.value.filter(row => row.processStatus === '0');
  if (pendingRows.length === 0) { ElMessage.warning('请选择流程状态为【待审核】的记录'); return; }
  currentAuditIds.value = pendingRows.map(row => row.id);
  auditFormApi.resetForm();
  auditDrawerApi.open();
}

// 单行审核
async function handleAudit(row) {
  if (row.processStatus !== '0') { ElMessage.warning('只有待审核状态的记录可以审核'); return; }
  currentAuditIds.value = [row.id];
  auditFormApi.resetForm();
  auditDrawerApi.open();
}

// 维护（学籍状态变更）
async function handleMaintain(row) {
  if (row.processStatus !== '1') { ElMessage.warning('只有流程状态为【正常】的记录可以维护'); return; }
  currentMaintainRow.value = row;
  maintainFormApi.resetForm();
  maintainDrawerApi.open();
}

// 导出单行
async function handleExportRow(row) {
  const loading = ElLoading.service({ text: '正在导出...' });
  try {
    const data = await exportStudentArchive({ ids: [row.id] });
    downloadFileFromBlobPart({ fileName: `${row.studentNo}_学籍档案.xls`, source: data });
    ElMessage.success('导出成功');
  } catch (error) { console.error('导出失败:', error); ElMessage.error('导出失败'); }
  finally { loading.close(); }
}

// 新增/编辑表单
const [ArchiveForm, archiveFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: isEditMode.value ? '保存中...' : '新增中...' });
    try {
      let res;
      if (isEditMode.value) {
        res = await updateStudentArchive({ ...values, id: currentEditId.value });
      } else {
        res = await createStudentArchive(values);
      }
      if (res && res.data !== false) {
        ElMessage.success(isEditMode.value ? '编辑成功' : '新增成功');
        archiveDrawerApi.close();
        handleRefresh();
      } else { ElMessage.error(isEditMode.value ? '编辑失败' : '新增失败'); }
    } finally { loading.close(); }
  },
  layout: 'horizontal',
  schema: useArchiveFormSchema(isEditMode.value),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

// 审核表单（修正：使用 processStatus 字段）
const [AuditForm, auditFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '审核中...' });
    try {
      const res = await auditStudentArchive({
        ids: currentAuditIds.value,
        processStatus: values.processStatus,
        rejectReason: values.rejectReason || null,
      });
      if (res && res.data !== false) {
        ElMessage.success('审核成功');
        auditDrawerApi.close();
        handleRefresh();
      } else { ElMessage.error('审核失败'); }
    } finally { loading.close(); }
  },
  layout: 'horizontal',
  schema: useAuditFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '提交' },
});

// 维护表单
const [MaintainForm, maintainFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '维护中...' });
    try {
      const res = await maintainStudentArchive({
        id: currentMaintainRow.value.id,
        status: values.status,
        changeReason: values.changeReason,
        evidenceUrl: values.evidenceUrl,
      });
      if (res && res.data !== false) {
        ElMessage.success('学籍状态维护成功');
        maintainDrawerApi.close();
        handleRefresh();
      } else { ElMessage.error('维护失败'); }
    } finally { loading.close(); }
  },
  layout: 'horizontal',
  schema: useMaintainFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '提交' },
});

// 详情抽屉
const studentArchiveDetailDrawerRef = ref(null);
function handleOpenDetail(row) {
  dataObj.detailObj = row;
  studentArchiveDetailDrawerRef.value.open();
}

// 高级查询表单
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: (values) => {
    searchParams.value = { ...values };
    drawerApi.close();
    resetPageAndQuery();
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => { delete v.rules; return v; }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// 筛选标签相关
function getFieldLabel(field) {
  const map = { studentNo: '学生编号', name: '姓名', classId: '班级', major: '专业', status: '学籍状态', processStatus: '流程状态', archiveTime: '建档时间' };
  return map[field] || field;
}
function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join(' ~ ');
  if (field === 'status') return statusMap[value] || value;
  if (field === 'processStatus') return processStatusMap[value] || value;
  return value || '-';
}
function handleFilterTagClick(field, value) {
  if (!field) return;
  if (value === '' || value === null || value === undefined) {
    if (tagFilters.value[field] !== undefined) delete tagFilters.value[field];
  } else {
    const existing = tagFilters.value[field];
    if (existing !== undefined) {
      if (Array.isArray(existing) && existing.length === 1 && existing[0] === value) delete tagFilters.value[field];
      else if (!Array.isArray(existing) && existing === value) delete tagFilters.value[field];
      else tagFilters.value[field] = value;
    } else {
      tagFilters.value[field] = value;
    }
  }
  resetPageAndQuery();
}
function clearFilters() { tagFilters.value = {}; resetPageAndQuery(); }
function removeFilterTag(field) { delete tagFilters.value[field]; resetPageAndQuery(); }

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');
const showChart = ref(true);
const toggleChart = () => { showChart.value = !showChart.value; };
defineExpose({ handleFilterTagClick, clearFilters });

// 监听图表自定义事件
const handleChartFilter = (event) => {
  const { type, value } = event.detail;
  if (type === 'status') handleFilterTagClick('status', value);
  else if (type === 'archiveTime') handleFilterTagClick('archiveTime', value);
  else if (type === 'studentNo') handleFilterTagClick('studentNo', value);
};
onMounted(() => { window.addEventListener('student-archive-chart-filter', handleChartFilter); });
onUnmounted(() => { window.removeEventListener('student-archive-chart-filter', handleChartFilter); });
</script>

<template>
  <div class="park-lot-table-new">
    <StudentArchiveDetailDrawer ref="studentArchiveDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh" />
    <Drawer title="搜索"><QueryForm /></Drawer>
    <ArchiveDrawer :title="isEditMode ? textObj.editText : textObj.addText"><ArchiveForm /></ArchiveDrawer>
    <AuditDrawer title="审核"><AuditForm /></AuditDrawer>
    <MaintainDrawer title="学籍状态维护"><MaintainForm /></MaintainDrawer>

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
          <IconButton :content="textObj.addText" icon-name="Plus" @click="handleCreate" />
          <IconButton :content="textObj.importText" icon-name="Upload" @click="handleImport" />
          <IconButton :content="textObj.exportText" icon-name="download" @click="handleExport" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton content="重置" icon-name="Refresh" @click="handleReset" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
          <IconButton :content="showChart ? '隐藏图表' : '显示图表'" icon-name="PieChart" @click="toggleChart" />
        </div>
      </template>

      <!-- 钻取列 -->
      <template #studentNo="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">{{ row.studentNo }}</el-text>
      </template>
      <template #name="{ row }">
        <el-text @click="handleFilterTagClick('name', row.name)" type="primary" style="cursor: pointer;">{{ row.name }}</el-text>
      </template>
      <template #classId="{ row }">
        <el-text @click="() => { ElMessage.info('班级详情弹窗待接入'); }" type="primary" style="cursor: pointer;">{{ row.classId }}</el-text>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)" @click="handleFilterTagClick('status', row.status)" style="cursor: pointer;">{{ row.statusLabel }}</el-tag>
      </template>
      <template #archiveTime="{ row }">
        <el-text @click="handleFilterTagClick('archiveTime', [getDateFromTimestamp(row.archiveTime), getDateFromTimestamp(row.archiveTime)])" type="primary" style="cursor: pointer;">{{ formatTimestamp(row.archiveTime) }}</el-text>
      </template>
      <template #processStatus="{ row }">
        <el-tag :type="getProcessStatusType(row.processStatus)" @click="handleFilterTagClick('processStatus', row.processStatus)" style="cursor: pointer;">{{ row.processStatusLabel }}</el-tag>
      </template>
      <template #evidenceUrl="{ row }">
        <el-link v-if="row.evidenceUrl" :href="row.evidenceUrl" target="_blank" type="primary">下载</el-link>
        <span v-else>-</span>
      </template>
      <template #creator="{ row }">
        <el-text @click="() => { ElMessage.info('用户信息弹窗待接入'); }" type="primary" style="cursor: pointer;">{{ row.creator || '-' }}</el-text>
      </template>
      <template #updater="{ row }">
        <el-text @click="() => { ElMessage.info('用户信息弹窗待接入'); }" type="primary" style="cursor: pointer;">{{ row.updater || '-' }}</el-text>
      </template>

      <!-- 脱敏列 -->
      <template #idCard="{ row }">
        <span>{{ row.idCardMask || '-' }}</span>
      </template>
      <template #phone="{ row }">
        <span>{{ row.phoneMask || '-' }}</span>
      </template>
      <template #parentPhone="{ row }">
        <span>{{ row.parentPhoneMask || '-' }}</span>
      </template>

      <!-- 时间格式化 -->
      <template #createTime="{ row }"><span>{{ formatTimestamp(row.createTime) }}</span></template>
      <template #updateTime="{ row }"><span>{{ formatTimestamp(row.updateTime) }}</span></template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton v-if="row.processStatus === '0'" content="编辑" icon-name="Edit" @click="handleEdit(row)" />
          <IconButton v-if="row.processStatus === '0'" content="审核" icon-name="Check" @click="handleAudit(row)" />
          <IconButton v-if="row.processStatus === '1'" content="维护" icon-name="EditPen" @click="handleMaintain(row)" />
          <IconButton v-if="row.processStatus === '1'" content="导出" icon-name="download" @click="handleExportRow(row)" />
        </div>
      </template>
    </Grid>
  </div>
</template>
