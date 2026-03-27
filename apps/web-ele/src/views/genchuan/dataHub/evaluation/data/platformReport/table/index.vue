<!-- platform-report/index.vue (表格页面) -->
<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { exportToExcel } from '#/utils/excel.js';
import reportDetail from './detail.vue';
import {
  getPlatformReportsByFilter,
  evalTaskList,
  userList,
  reportStatusList,
  getGridColumnsByTab,
  getSearchSchemaByTab,
  validateUploadFile,
  createPlatformReport,
  updatePlatformReport,
  performCheck,
  getErrorFileUrl
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false }
});
const emit = defineEmits(['arrow-change', 'data-change']);

// ==================== 数据定义 ====================
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  currentPage: 1,
  pageSize: 10,
  list: [],
  total: 0
});

const checkedIds = ref([]);
const searchParams = ref({});
const activeName = ref('全部');
const detailRef = ref(null);

// tabs配置
const tabsData = ref([
  { label: '全部' },
  { label: '未校验' },
  { label: '已校验' },
  { label: '校验失败' }
]);

const createLabel = (item) => {
  let count = 0;
  const reports = getPlatformReportsByFilter(item.label === '全部' ? '全部' : item.label);
  count = reports.length;
  return `${item.label} (${count})`;
};

// 文件上传弹窗
const uploadVisible = ref(false);
const uploadForm = reactive({
  task_id: '',
  file: null
});
const uploadLoading = ref(false);
const uploadResult = ref(null);

// 重新上传弹窗
const reuploadVisible = ref(false);
const currentReport = ref(null);
const reuploadFile = ref(null);
const reuploadLoading = ref(false);

// 预览弹窗
const previewVisible = ref(false);
const previewData = ref([]);

// ==================== 表格配置 ====================
const gridColumns = ref(getGridColumnsByTab('全部'));

const getTableData = (pageObj) => {
  const page = pageObj.page;
  let reports = getPlatformReportsByFilter(activeName.value, searchParams.value);
  reports.sort((a, b) => (b.report_time || '').localeCompare(a.report_time || ''));

  dataObj.total = reports.length;
  dataObj.list = reports.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize
  );
  return dataObj;
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) }
    },
    rowConfig: { keyField: 'report_id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true
    },
    showOverflow: true
  },
  gridEvents: {
    checkboxAll: ({ records }) => { checkedIds.value = records.map(item => item.report_id); },
    checkboxChange: ({ records }) => { checkedIds.value = records.map(item => item.report_id); }
  },
  showSearchForm: false
});

// ==================== 搜索抽屉 ====================
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); }
});

const searchSchema = computed(() => getSearchSchemaByTab(activeName.value));

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120
  },
  handleSubmit: (values) => {
    searchParams.value = values;
    drawerApi.close();
    handleRefresh();
  },
  layout: 'horizontal',
  schema: searchSchema.value,
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      queryFormApi.resetForm();
      queryFormApi.submitForm();
    }
  }
});

// ==================== 操作方法 ====================
function handleRefresh() {
  gridApi.query();
}

async function handleDownloadTemplate() {
  // 模拟下载模板
  ElMessage.success('模板下载中...');
  // 实际应调用接口获取模板文件
}

async function handleUpload() {
  if (!uploadForm.task_id) {
    ElMessage.warning('请选择关联评价任务');
    return;
  }
  if (!uploadForm.file) {
    ElMessage.warning('请选择文件');
    return;
  }
  uploadLoading.value = true;
  try {
    const result = await validateUploadFile(uploadForm.file, uploadForm.task_id);
    uploadResult.value = result;
    if (result.success) {
      // 创建上报记录
      const newReport = createPlatformReport({
        task_id: uploadForm.task_id,
        file_name: uploadForm.file.name,
        data_count: result.successCount + result.failCount,
        success_count: result.successCount,
        fail_count: result.failCount,
        report_by: 'u1'
      });
      ElMessage.success('上传成功，数据已保存');
      uploadVisible.value = false;
      handleRefresh();
      emit('data-change');
    } else {
      ElMessage.warning(`校验失败，成功${result.successCount}条，失败${result.failCount}条`);
      // 展示失败详情，提供错误文件下载
    }
  } catch (error) {
    ElMessage.error('上传失败');
  } finally {
    uploadLoading.value = false;
  }
}

async function handleBatchCheck() {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请至少选择一条记录');
    return;
  }
  await confirm('确定对选中的记录执行校验吗？');
  performCheck(checkedIds.value);
  ElMessage.success('校验任务已触发');
  handleRefresh();
  emit('data-change');
}

function handleExport() {
  const sheets = [{
    name: '平台上报记录',
    data: dataObj.list.map(r => ({
      '上报批次号': r.batch_no,
      '关联评价任务': r.task_name,
      '上报人': r.report_by_name,
      '上报时间': r.report_time,
      '数据状态': reportStatusList.find(s => s.id === r.status)?.name || r.status,
      '上报文件名称': r.file_name,
      '数据条数': r.data_count,
      '成功条数': r.success_count,
      '失败条数': r.fail_count,
      '校验时间': r.check_time || '',
      '校验操作人': r.check_by_name || '',
      '失败原因摘要': r.fail_reason || ''
    }))
  }];
  exportToExcel(sheets, '平台上报记录列表', `平台上报记录_${new Date().toLocaleDateString()}.xlsx`);
}

async function handleBatchExport() {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请至少选择一条记录');
    return;
  }
  const selected = dataObj.list.filter(r => checkedIds.value.includes(r.report_id));
  const sheets = selected.map(r => ({
    name: r.batch_no,
    data: [{ /* 实际应获取详细数据 */ }]
  }));
  ElMessage.success('批量导出功能待实现');
}

function handleViewDetail(row) {
  dataObj.detailObj = row;
  detailRef.value.open();
}

function handleDownloadOriginal(row) {
  ElMessage.success(`下载原文件: ${row.file_name}`);
}

function handleDownloadErrorFile(row) {
  const url = getErrorFileUrl(row.report_id);
  if (url) {
    ElMessage.success(`下载错误文件: ${url}`);
  } else {
    ElMessage.warning('无错误文件可下载');
  }
}

function handleReupload(row) {
  currentReport.value = row;
  reuploadVisible.value = true;
  reuploadFile.value = null;
}

async function submitReupload() {
  if (!reuploadFile.value) {
    ElMessage.warning('请选择文件');
    return;
  }
  reuploadLoading.value = true;
  try {
    const result = await validateUploadFile(reuploadFile.value, currentReport.value.task_id);
    if (result.success) {
      updatePlatformReport(currentReport.value.report_id, reuploadFile.value, currentReport.value.task_id);
      ElMessage.success('重新上传成功，请重新校验');
    } else {
      // 更新失败记录，保留错误信息
      const updated = updatePlatformReport(currentReport.value.report_id, reuploadFile.value, currentReport.value.task_id);
      if (updated) {
        updated.status = 'failed';
        updated.fail_reason = result.failReason;
        updated.error_file_url = result.errorFileUrl;
      }
      ElMessage.warning(`重新上传后校验仍失败: ${result.message}`);
    }
    reuploadVisible.value = false;
    handleRefresh();
    emit('data-change');
  } catch (error) {
    ElMessage.error('重新上传失败');
  } finally {
    reuploadLoading.value = false;
  }
}

function handlePreview(row) {
  // 模拟预览数据
  previewData.value = Array.from({ length: 10 }, (_, i) => ({
    object_id: `obj00${i}`,
    index_id: `idx00${i}`,
    value: Math.random() * 100,
    report_time: new Date().toLocaleString()
  }));
  previewVisible.value = true;
}

function handleCheck(row) {
  confirm('确定对该记录执行校验吗？').then(() => {
    performCheck([row.report_id]);
    ElMessage.success('校验任务已触发');
    handleRefresh();
    emit('data-change');
  });
}

function handleFieldClick(fieldName, value, displayValue) {
  const newParams = { ...searchParams.value, [fieldName]: value };
  if (displayValue !== undefined) newParams[`${fieldName}_display`] = displayValue;
  searchParams.value = newParams;
  handleRefresh();
}

function handleClearField(fieldName) {
  const newParams = { ...searchParams.value };
  delete newParams[fieldName];
  delete newParams[`${fieldName}_display`];
  searchParams.value = newParams;
  handleRefresh();
}

function handleClick() {
  gridColumns.value = getGridColumnsByTab(activeName.value);
  gridApi.setGridOptions({ columns: gridColumns.value });
  gridApi.query();
}

function handleSerachShow() {
  drawerApi.open();
}

function handleFullShow() {
  screenfull.toggle();
}

function arrowChange() {
  emit('arrow-change');
}

defineExpose({
  activeName
});
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 上报详情抽屉 -->
    <reportDetail ref="detailRef" :detail-obj="dataObj.detailObj" />

    <!-- 搜索抽屉 -->
    <Drawer title="筛选">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 上传弹窗 -->
    <el-dialog v-model="uploadVisible" title="上传平台上报数据" width="500px">
      <el-form :model="uploadForm" label-width="100px">
        <el-form-item label="关联评价任务" required>
          <el-select v-model="uploadForm.task_id" placeholder="请选择">
            <el-option v-for="t in evalTaskList" :key="t.task_id" :label="t.name" :value="t.task_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件" required>
          <input type="file" @change="e => uploadForm.file = e.target.files[0]" accept=".xlsx,.xls" />
        </el-form-item>
      </el-form>
      <div v-if="uploadResult" class="upload-result">
        <p>校验结果: {{ uploadResult.message }}</p>
        <p>成功条数: {{ uploadResult.successCount }}，失败条数: {{ uploadResult.failCount }}</p>
        <a v-if="uploadResult.errorFileUrl" :href="uploadResult.errorFileUrl" download>下载错误文件</a>
      </div>
      <template #footer>
        <el-button @click="uploadVisible = false">取消</el-button>
        <el-button type="primary" :loading="uploadLoading" @click="handleUpload">上传</el-button>
      </template>
    </el-dialog>

    <!-- 重新上传弹窗 -->
    <el-dialog v-model="reuploadVisible" title="重新上传" width="500px">
      <el-form label-width="100px">
        <el-form-item label="批次号">{{ currentReport?.batch_no }}</el-form-item>
        <el-form-item label="选择新文件" required>
          <input type="file" @change="e => reuploadFile = e.target.files[0]" accept=".xlsx,.xls" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reuploadVisible = false">取消</el-button>
        <el-button type="primary" :loading="reuploadLoading" @click="submitReupload">确认上传</el-button>
      </template>
    </el-dialog>

    <!-- 预览弹窗 -->
    <el-dialog v-model="previewVisible" title="文件预览" width="800px">
      <el-table :data="previewData" border max-height="500">
        <el-table-column prop="object_id" label="评价对象ID" />
        <el-table-column prop="index_id" label="指标项ID" />
        <el-table-column prop="value" label="数据值" />
        <el-table-column prop="report_time" label="上报时间" />
      </el-table>
    </el-dialog>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <div v-if="props.secondShow">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
              <el-tab-pane v-for="item in tabsData" :key="item.label" :label="createLabel(item)" :name="item.label" />
            </el-tabs>
          </div>

          <!-- 钻取筛选标签 -->
          <el-tag v-if="searchParams.task_id" type="primary" closable @close="handleClearField('task_id')">
            任务：{{ evalTaskList.find(t => t.task_id === searchParams.task_id)?.name }}
          </el-tag>
          <el-tag v-if="searchParams.report_by" type="success" closable @close="handleClearField('report_by')">
            上报人：{{ userList.find(u => u.id === searchParams.report_by)?.name }}
          </el-tag>
          <el-tag v-if="searchParams.status" type="info" closable @close="handleClearField('status')">
            状态：{{ reportStatusList.find(s => s.id === searchParams.status)?.name }}
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <!-- 全部页特有按钮 -->
          <template v-if="activeName === '全部'">
            <IconButton content="下载模板" icon-name="Download" @click="handleDownloadTemplate" />
            <IconButton content="上传文件" icon-name="Upload" @click="uploadVisible = true" />
          </template>

          <!-- 未校验页特有按钮 -->
          <template v-if="activeName === '未校验'">
            <IconButton content="下载模板" icon-name="Download" @click="handleDownloadTemplate" />
            <IconButton content="批量校验" icon-name="Checked" :disabled="isEmpty(checkedIds)" @click="handleBatchCheck" />
          </template>

          <!-- 校验失败页特有按钮 -->
          <template v-if="activeName === '校验失败'">
            <IconButton content="批量下载错误文件" icon-name="Download" :disabled="isEmpty(checkedIds)" @click="handleBatchExport" />
          </template>

          <!-- 通用按钮 -->
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton v-if="activeName !== '全部'" content="批量导出" icon-name="FolderOpened" :disabled="isEmpty(checkedIds)" @click="handleBatchExport" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列渲染 -->
      <template #batch_no="{ row }">
        <el-text @click="handleViewDetail(row)" class="common-align" type="primary">{{ row.batch_no }}</el-text>
      </template>

      <template #taskName="{ row }">
        <el-text @click="handleFieldClick('task_id', row.task_id, row.task_name)" class="common-align" type="primary">{{ row.task_name }}</el-text>
      </template>

      <template #status="{ row }">
        <el-text @click="handleFieldClick('status', row.status, reportStatusList.find(s => s.id === row.status)?.name)" class="common-align" type="primary">
          {{ reportStatusList.find(s => s.id === row.status)?.name || row.status }}
        </el-text>
      </template>

      <template #errorFileDownload="{ row }">
        <a v-if="row.error_file_url" @click="handleDownloadErrorFile(row)" style="cursor: pointer; color: #409eff">可下载</a>
        <span v-else>无</span>
      </template>

      <template #filePreview="{ row }">
        <el-button link type="primary" @click="handlePreview(row)">可预览</el-button>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; align-items: center; justify-content: center; gap: 4px">
          <IconButton content="详情" icon-name="View" @click="handleViewDetail(row)" />
          <IconButton content="下载原文件" icon-name="Download" @click="handleDownloadOriginal(row)" />
          <IconButton v-if="row.status === 'failed'" content="下载错误文件" icon-name="Warning" @click="handleDownloadErrorFile(row)" />
          <IconButton v-if="row.status === 'failed' || row.status === 'unverified'" content="重新上传" icon-name="Refresh" @click="handleReupload(row)" />
          <IconButton v-if="row.status === 'unverified'" content="触发校验" icon-name="Checked" @click="handleCheck(row)" />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="dataObj.totalShow = !dataObj.totalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>本页统计：记录数量{{ dataObj.list.length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：记录总数{{ dataObj.total }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
