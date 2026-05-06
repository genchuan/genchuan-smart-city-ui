<template>
  <div class="park-lot-table-new">
    <!-- 详情抽屉 -->
    <DetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" />
    <!-- 排查弹窗 -->
    <DebugDrawer ref="debugDrawerRef" @success="handleRefresh" />
    <!-- 修复弹窗 -->
    <RepairDrawer ref="repairDrawerRef" @success="handleRefresh" />
    <!-- 备注弹窗 -->
    <RemarkDrawer ref="remarkDrawerRef" @success="handleRefresh" />

    <!-- 批量排查弹窗 -->
    <el-dialog v-model="batchCheckVisible" title="批量排查" width="500px" :close-on-click-modal="false">
      <el-form :model="batchCheckForm" label-width="100px">
        <el-form-item label="排查原因" required>
          <el-input v-model="batchCheckForm.checkReason" type="textarea" rows="4" placeholder="请输入排查原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="batchCheckVisible = false">取消</el-button>
        <el-button type="primary" :loading="batchCheckLoading" @click="submitBatchCheck">确认排查</el-button>
      </template>
    </el-dialog>

    <!-- 批量修复弹窗 -->
    <el-dialog v-model="batchRepairVisible" title="批量修复" width="500px" :close-on-click-modal="false">
      <el-form :model="batchRepairForm" label-width="100px">
        <el-form-item label="修复凭证" required>
          <el-upload ref="batchUploadRef" action="#" :auto-upload="false" :on-change="handleBatchFileChange" :limit="1" accept="image/*,application/pdf">
            <el-button type="primary">选择文件</el-button>
            <template #tip><div class="el-upload__tip">支持 jpg/png/pdf，不超过10MB</div></template>
          </el-upload>
          <div v-if="batchRepairForm.repairVoucherUrl" class="voucher-preview">
            <el-link type="primary" @click="previewBatchVoucher">查看凭证</el-link>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="batchRepairVisible = false">取消</el-button>
        <el-button type="primary" :loading="batchRepairLoading" @click="submitBatchRepair">确认修复</el-button>
      </template>
    </el-dialog>

    <!-- 筛选抽屉 -->
    <Drawer title="筛选告警">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 修复凭证预览弹窗 -->
    <el-dialog v-model="voucherPreviewVisible" title="修复凭证预览" width="600px" center>
      <div style="text-align: center">
        <iframe v-if="isPdf(voucherPreviewUrl)" :src="voucherPreviewUrl" width="100%" height="500px" />
        <img v-else :src="voucherPreviewUrl" style="max-width: 100%" referrerpolicy="no-referrer" />
      </div>
    </el-dialog>

    <Grid>
      <!-- 筛选标签区域 -->
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <el-tag v-if="searchParams.alarmCode" type="primary" closable @close="handleClearField('alarmCode')">告警编号：{{ searchParams.alarmCode }}</el-tag>
          <el-tag v-if="searchParams.moduleName" type="primary" closable @close="handleClearField('moduleName')">模块名称：{{ searchParams.moduleName }}</el-tag>
          <el-tag v-if="searchParams.abnormalTypeId" type="primary" closable @close="handleClearField('abnormalTypeId')">异常类型：{{ abnormalTypeMap[searchParams.abnormalTypeId] || searchParams.abnormalTypeId }}</el-tag>
          <el-tag v-if="searchParams.alarmLevelId" type="primary" closable @close="handleClearField('alarmLevelId')">告警等级：{{ alarmLevelMap[searchParams.alarmLevelId] || searchParams.alarmLevelId }}</el-tag>
          <el-tag v-if="searchParams.alarmStatusId" type="primary" closable @close="handleClearField('alarmStatusId')">
            告警状态：{{ alarmStatusMap[searchParams.alarmStatusId] || searchParams.alarmStatusId }}
          </el-tag>
          <el-tag v-if="searchParams.alarmTimeBegin" type="primary" closable @close="handleClearField('alarmTimeBegin')">告警时间：{{ searchParams.alarmTimeBegin }} 至 {{ searchParams.alarmTimeEnd }}</el-tag>
          <el-tag v-if="searchParams.repairTimeBegin" type="primary" closable @close="handleClearField('repairTimeBegin')">修复时间：{{ searchParams.repairTimeBegin }} 至 {{ searchParams.repairTimeEnd }}</el-tag>
          <el-tag v-if="searchParams.operator" type="primary" closable @close="handleClearField('operator')">操作人：{{ searchParams.operator }}</el-tag>
        </div>
      </template>

      <!-- 工具栏按钮 -->
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="排查" icon-name="Edit" :disabled="!canBatchCheck" @click="handleBatchCheck" />
          <IconButton content="修复" icon-name="Tools" :disabled="!canBatchRepair" @click="handleBatchRepair" />
          <IconButton content="销账" icon-name="Finished" :disabled="!canBatchClose" @click="handleBatchClose" />
          <IconButton content="导出" icon-name="download" @click="handleNormalExport" />
          <!--          <IconButton content="批量导出" icon-name="download" :disabled="checkedIds.length === 0" @click="handleBatchExport" />-->
          <!--          <IconButton content="打印" icon-name="Printer" @click="handlePrintAsPDF" />-->
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列模板 -->
      <template #alarmCode="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.alarmCode }}</el-text>
      </template>
      <template #moduleName="{ row }">
        <el-text @click="handleFieldClick('moduleName', row.moduleName)" type="primary">{{ row.moduleName }}</el-text>
      </template>
      <template #abnormalType="{ row }">
        <el-text @click="handleFieldClick('abnormalTypeId', row.abnormalTypeId)" type="primary">{{ row.abnormalName }}</el-text>
      </template>
      <template #alarmLevel="{ row }">
        <el-tag :type="row.alarmLevelName === '严重' ? 'danger' : 'info'" @click="handleFieldClick('alarmLevelId', row.alarmLevelId)" style="cursor: pointer">
          {{ row.alarmLevelName }}
        </el-tag>
      </template>
      <template #alarmTime="{ row }">
        <el-text @click="handleFieldClick('alarmTime', row.alarmTime)" type="primary">{{ row.alarmTime }}</el-text>
      </template>
      <template #alarmStatus="{ row }">
        <el-tag :type="alarmStatusTagType(row.alarmStatusName)" @click="handleFieldClick('alarmStatusId', row.alarmStatusId)" style="cursor: pointer">
          {{ row.alarmStatusName }}
        </el-tag>
      </template>
      <template #repairTime="{ row }">
        <el-text v-if="row.repairTime" @click="handleFieldClick('repairTime', row.repairTime)" type="primary">{{ row.repairTime }}</el-text>
        <span v-else>-</span>
      </template>
      <template #operator="{ row }">
        <el-text v-if="row.operator" @click="handleFieldClick('operator', row.operator)" type="primary">{{ row.operator }}</el-text>
        <span v-else>-</span>
      </template>
      <template #repairVoucher="{ row }">
        <el-button v-if="row.repairVoucher" link type="primary" @click="previewVoucher(row.repairVoucher)">预览凭证</el-button>
        <span v-else>-</span>
      </template>

      <!-- 操作列按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; gap: 4px; flex-wrap: wrap; justify-content: center;">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="排查" icon-name="Edit" :disabled="row.alarmStatusName !== '未排查'" @click="handleCheck(row)" />
          <IconButton content="修复" icon-name="Tools" :disabled="row.alarmStatusName !== '已排查'" @click="handleRepair(row)" />
          <IconButton content="销账" icon-name="Finished" :disabled="row.alarmStatusName !== '修复中'" @click="handleClose(row)" />
          <IconButton content="备注" icon-name="Document" @click="handleRemark(row)" />
        </div>
      </template>

      <!-- 底部统计 -->
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>本页统计：告警总数{{ dataObj.list.length }}，未排查{{ getStatusCount('未排查') }}，已排查{{ getStatusCount('已排查') }}，修复中{{ getStatusCount('修复中') }}，已销账{{ getStatusCount('已销账') }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：总告警数{{ dataObj.total }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';

import {
  getPageList,
  checkAlarm,
  repairAlarm,
  closeAlarm,
  remarkAlarm,
  exportAlarm,
  uploadRepairVoucher,
} from '#/api/genchuan/industry/energyCharging/carCharging/faultAlarm/moduleAlarm/index.js';
import DetailDrawer from './detail.vue';
import DebugDrawer from './debugDrawer.vue';
import RepairDrawer from './repairDrawer.vue';
import RemarkDrawer from './remarkDrawer.vue';
import { useGridColumns, useQuerySchema, abnormalTypeMap, alarmLevelMap, alarmStatusMap, alarmStatusTagType } from './data.js';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change', 'refresh-chart']);

const searchParams = ref({});
const checkedIds = ref([]);
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  list: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
});

// 批量排查相关
const batchCheckVisible = ref(false);
const batchCheckLoading = ref(false);
const batchCheckForm = ref({ checkReason: '' });
let batchCheckTargetIds = [];

// 批量修复相关
const batchRepairVisible = ref(false);
const batchRepairLoading = ref(false);
const batchRepairForm = ref({ repairVoucherUrl: '' });
let batchRepairTargetIds = [];

const detailDrawerRef = ref(null);
const debugDrawerRef = ref(null);
const repairDrawerRef = ref(null);
const remarkDrawerRef = ref(null);
const voucherPreviewVisible = ref(false);
const voucherPreviewUrl = ref('');
const batchPreviewVisible = ref(false);
const batchPreviewUrl = ref('');

const isPdf = (url) => url?.toLowerCase().endsWith('.pdf');

// 转换查询参数（将前端字段映射为后端字段）
const convertSearchParams = (params) => {
  const converted = { ...params };
  // 注意：后端接收的是 abnormalTypeId、alarmLevelId、alarmStatusId
  if (converted.abnormalTypeId !== undefined) {
    // 保持原样，后端直接使用
  }
  if (converted.alarmLevelId !== undefined) {
    // 保持原样
  }
  if (converted.alarmStatusId !== undefined) {
    // 保持原样
  }
  return converted;
};

// 格式化列表数据（适配后端返回的字段）
function formatList(list) {
  return (list || []).map(item => ({
    ...item,
    alarmTime: item.alarmTime ? dayjs(item.alarmTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    repairTime: item.repairTime ? dayjs(item.repairTime).format('YYYY-MM-DD HH:mm:ss') : null,
    createTime: item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    updateTime: item.updateTime ? dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    abnormalName: item.abnormalName || '-',
    alarmLevelName: item.alarmLevelName || '-',
    alarmStatusName: item.alarmStatusName || '-',
    operator: item.updaterName || item.updater || '-',
  }));
}

const getTableData = async ({ page }) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...convertSearchParams(searchParams.value),
  };
  try {
    const res = await getPageList(params);
    const { list, total } = res;
    dataObj.list = formatList(list);
    dataObj.total = total;
    dataObj.currentPage = page.currentPage;
    dataObj.pageSize = page.pageSize;
    return { list: dataObj.list, total };
  } catch (error) {
    console.error('表格数据获取失败', error);
    dataObj.list = [];
    dataObj.total = 0;
    return { list: [], total: 0 };
  }
};

function handleRefresh() {
  gridApi.query();
  emit('refresh-chart');
}

function getStatusCount(status) {
  return dataObj.list.filter(v => v.alarmStatusName === status).length;
}

function handleClearField(fieldName) {
  const newParams = { ...searchParams.value };
  delete newParams[fieldName];
  if (fieldName === 'alarmTimeBegin') delete newParams.alarmTimeEnd;
  if (fieldName === 'repairTimeBegin') delete newParams.repairTimeEnd;
  searchParams.value = newParams;
  queryFormApi.setValues({ [fieldName]: '' });
  handleRefresh();
}

function handleFieldClick(fieldName, value) {
  if (fieldName === 'alarmTime') {
    const dayStr = dayjs(value).format('YYYY-MM-DD');
    const alarmTimeBegin = `${dayStr} 00:00:00`;
    const alarmTimeEnd = `${dayStr} 23:59:59`;
    searchParams.value = { ...searchParams.value, alarmTimeBegin, alarmTimeEnd };
    queryFormApi.setValues({ alarmTimeBegin, alarmTimeEnd });
  } else if (fieldName === 'repairTime') {
    const dayStr = dayjs(value).format('YYYY-MM-DD');
    const repairTimeBegin = `${dayStr} 00:00:00`;
    const repairTimeEnd = `${dayStr} 23:59:59`;
    searchParams.value = { ...searchParams.value, repairTimeBegin, repairTimeEnd };
    queryFormApi.setValues({ repairTimeBegin, repairTimeEnd });
  } else {
    searchParams.value = { ...searchParams.value, [fieldName]: value };
    queryFormApi.setValues({ [fieldName]: value });
  }
  handleRefresh();
}

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  detailDrawerRef.value.open();
}

function previewVoucher(url) {
  voucherPreviewUrl.value = url;
  voucherPreviewVisible.value = true;
}

// 单条排查
function handleCheck(row) {
  debugDrawerRef.value.open(row.id, row.alarmCode);
}

// 批量排查
function handleBatchCheck() {
  const validIds = checkedIds.value.filter(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row?.alarmStatusName === '未排查';
  });
  if (validIds.length === 0) {
    ElMessage.warning('请选择未排查状态的告警');
    return;
  }
  batchCheckTargetIds = validIds;
  batchCheckForm.value.checkReason = '';
  batchCheckVisible.value = true;
}

async function submitBatchCheck() {
  if (!batchCheckForm.value.checkReason.trim()) {
    ElMessage.warning('请输入排查原因');
    return;
  }
  batchCheckLoading.value = true;
  try {
    const results = await Promise.allSettled(
      batchCheckTargetIds.map(id => checkAlarm({ id, checkReason: batchCheckForm.value.checkReason }))
    );
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    if (succeeded) ElMessage.success(`成功排查 ${succeeded} 条告警`);
    if (failed) ElMessage.warning(`失败 ${failed} 条，请手动处理`);
    checkedIds.value = [];
    batchCheckVisible.value = false;
    handleRefresh();
  } catch (error) {
    ElMessage.error('批量排查失败');
  } finally {
    batchCheckLoading.value = false;
  }
}

// 单条修复
function handleRepair(row) {
  repairDrawerRef.value.open(row.id, row.alarmCode);
}

// 批量修复
function handleBatchRepair() {
  const validIds = checkedIds.value.filter(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row?.alarmStatusName === '已排查';
  });
  if (validIds.length === 0) {
    ElMessage.warning('请选择已排查状态的告警');
    return;
  }
  batchRepairTargetIds = validIds;
  batchRepairForm.value.repairVoucherUrl = '';
  batchRepairVisible.value = true;
}

function handleBatchFileChange(file) {
  const formData = new FormData();
  formData.append('file', file.raw);
  uploadRepairVoucher(formData).then(url => {
    batchRepairForm.value.repairVoucherUrl = url;
    ElMessage.success('凭证上传成功');
  }).catch(() => {
    ElMessage.error('凭证上传失败');
  });
}

function previewBatchVoucher() {
  if (batchRepairForm.value.repairVoucherUrl) {
    batchPreviewUrl.value = batchRepairForm.value.repairVoucherUrl;
    batchPreviewVisible.value = true;
  }
}

async function submitBatchRepair() {
  if (!batchRepairForm.value.repairVoucherUrl) {
    ElMessage.warning('请上传修复凭证');
    return;
  }
  batchRepairLoading.value = true;
  try {
    const results = await Promise.allSettled(
      batchRepairTargetIds.map(id => repairAlarm({ id, repairVoucher: batchRepairForm.value.repairVoucherUrl }))
    );
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    if (succeeded) ElMessage.success(`成功修复 ${succeeded} 条告警`);
    if (failed) ElMessage.warning(`失败 ${failed} 条，请手动处理`);
    checkedIds.value = [];
    batchRepairVisible.value = false;
    handleRefresh();
  } catch (error) {
    ElMessage.error('批量修复失败');
  } finally {
    batchRepairLoading.value = false;
  }
}

// 销账
function handleClose(row) {
  confirm(`确定销账告警【${row.alarmCode}】吗？销账后将标记为已销账。`).then(async () => {
    const loadingInstance = ElLoading.service({ text: '销账中...' });
    try {
      await closeAlarm({ id: row.id });
      ElMessage.success('销账成功');
      handleRefresh();
    } catch (error) {
      ElMessage.error(error.message || '销账失败');
    } finally {
      loadingInstance.close();
    }
  });
}

async function handleBatchClose() {
  const validIds = checkedIds.value.filter(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row?.alarmStatusName === '修复中';
  });
  if (validIds.length === 0) {
    ElMessage.warning('请选择修复中状态的告警');
    return;
  }
  await confirm(`确定对选中的 ${validIds.length} 条告警进行销账吗？`);
  const loadingInstance = ElLoading.service({ text: '批量销账中...' });
  try {
    const results = await Promise.allSettled(validIds.map(id => closeAlarm({ id })));
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    if (succeeded) ElMessage.success(`成功销账 ${succeeded} 条告警`);
    if (failed) ElMessage.warning(`失败 ${failed} 条，请手动处理`);
    checkedIds.value = [];
    handleRefresh();
  } catch (error) {
    ElMessage.error('批量销账失败');
  } finally {
    loadingInstance.close();
  }
}

// 备注
function handleRemark(row) {
  remarkDrawerRef.value.open(row.id, row.alarmCode, row.remark);
}

// ==================== 导出功能 ====================
async function handleNormalExport() {
  const loadingInstance = ElLoading.service({ text: '正在获取数据...' });
  try {
    const params = {
      ...convertSearchParams(searchParams.value),
      pageNo: 1,
      pageSize: 200,
    };
    let allData = [];
    let hasMore = true;
    while (hasMore) {
      const res = await getPageList(params);
      const { list, total } = res;
      if (list && list.length > 0) {
        const formatted = formatList(list);
        allData = allData.concat(formatted);
        params.pageNo++;
        if (list.length < params.pageSize) hasMore = false;
      } else {
        hasMore = false;
      }
    }
    if (allData.length === 0) {
      ElMessage.warning('没有数据可导出');
      return;
    }
    const allColumns = useGridColumns();
    const exportColumns = allColumns.filter(
      col => col.field && col.type !== 'checkbox' && col.title !== '操作'
    ).map(col => ({ field: col.field, title: col.title }));
    const wsData = [exportColumns.map(col => col.title)];
    allData.forEach(row => {
      const rowData = exportColumns.map(col => {
        let val = row[col.field];
        if (col.field === 'repairVoucher') val = val || '-';
        return val ?? '-';
      });
      wsData.push(rowData);
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, '模块告警');
    XLSX.writeFile(wb, `模块告警列表_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败', error);
    ElMessage.error(error.message || '导出失败');
  } finally {
    loadingInstance.close();
  }
}

async function handleBatchExport() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条告警');
    return;
  }
  const selectedRows = dataObj.list.filter(item => checkedIds.value.includes(item.id));
  if (selectedRows.length === 0) {
    ElMessage.warning('选中的数据不在当前页，请刷新后重试');
    return;
  }
  const loading = ElLoading.service({ text: '正在生成批量导出文件...' });
  const wb = XLSX.utils.book_new();
  const allColumns = useGridColumns();
  const exportColumns = allColumns.filter(
    col => col.field && col.type !== 'checkbox' && col.title !== '操作'
  ).map(col => ({ field: col.field, title: col.title }));
  try {
    for (const row of selectedRows) {
      const rowForSheet = {};
      exportColumns.forEach(col => {
        let val = row[col.field];
        if (col.field === 'repairVoucher') val = val || '-';
        rowForSheet[col.title] = val ?? '-';
      });
      const ws = XLSX.utils.json_to_sheet([rowForSheet]);
      let sheetName = (row.alarmCode || `告警_${row.id}`).replace(/[\\/:*?"<>|]/g, '_');
      if (sheetName.length > 31) sheetName = sheetName.substring(0, 28) + '...';
      let finalSheetName = sheetName;
      let counter = 1;
      while (wb.SheetNames.includes(finalSheetName)) {
        finalSheetName = `${sheetName}_${counter++}`;
      }
      XLSX.utils.book_append_sheet(wb, ws, finalSheetName);
    }
    if (wb.SheetNames.length === 0) {
      ElMessage.warning('没有有效数据可导出');
      return;
    }
    const fileName = `模块告警批量导出_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    ElMessage.success('批量导出成功');
  } catch (error) {
    console.error('批量导出失败', error);
    ElMessage.error(error.message || '批量导出失败');
  } finally {
    loading.close();
  }
}

function handlePrintAsPDF() {
  const printContent = document.querySelector('.vxe-table');
  if (printContent) {
    const originalTitle = document.title;
    document.title = '模块告警列表';
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head><title>模块告警列表</title>
        <style>body { font-family: sans-serif; } table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }</style>
        </head>
        <body>${printContent.outerHTML}</body>
      </html>
    `);
    win.document.close();
    win.print();
    win.close();
    document.title = originalTitle;
  } else {
    ElMessage.warning('无法获取表格内容');
  }
}

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
}

function resetFilter() {
  searchParams.value = {};
  queryFormApi.resetForm();
  handleRefresh();
}

function setFilter(filters) {
  if (!filters || Object.keys(filters).length === 0) {
    resetFilter();
    return;
  }
  const processedFilters = { ...filters };
  Object.assign(searchParams.value, processedFilters);
  queryFormApi.setValues(processedFilters);
  handleRefresh();
}

const canBatchCheck = computed(() => {
  return checkedIds.value.some(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row?.alarmStatusName === '未排查';
  });
});
const canBatchRepair = computed(() => {
  return checkedIds.value.some(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row?.alarmStatusName === '已排查';
  });
});
const canBatchClose = computed(() => {
  return checkedIds.value.some(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row?.alarmStatusName === '修复中';
  });
});

const changeTotalShow = () => (dataObj.totalShow = !dataObj.totalShow);
const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

// 筛选抽屉
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
});

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useQuerySchema(),
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

function onSubmit(values) {
  searchParams.value = values;
  drawerApi.close();
  handleRefresh();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: { ajax: { query: async ({ page }) => getTableData({ page }) } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { 'class-name': 'common-tool-bar-config', refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

defineExpose({ setFilter, resetFilter });
</script>

<style scoped>
.voucher-preview {
  margin-top: 8px;
}
</style>
