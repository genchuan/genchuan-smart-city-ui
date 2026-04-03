<!-- module-alarm/table/index.vue -->
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

    <!-- 筛选抽屉 -->
    <Drawer title="筛选告警">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 修复凭证预览弹窗 -->
    <el-dialog v-model="voucherPreviewVisible" title="修复凭证预览" width="600px" center>
      <div style="text-align: center">
        <img :src="voucherPreviewUrl" style="max-width: 100%" referrerpolicy="no-referrer" />
      </div>
    </el-dialog>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <el-tag v-if="searchParams.alarmCode" type="primary" closable @close="handleClearField('alarmCode')">告警编号：{{ searchParams.alarmCode }}</el-tag>
          <el-tag v-if="searchParams.moduleName" type="primary" closable @close="handleClearField('moduleName')">模块名称：{{ searchParams.moduleName }}</el-tag>
          <el-tag v-if="searchParams.abnormalType" type="primary" closable @close="handleClearField('abnormalType')">异常类型：{{ abnormalTypeMap[searchParams.abnormalType] || searchParams.abnormalType }}</el-tag>
          <el-tag v-if="searchParams.alarmLevel" type="primary" closable @close="handleClearField('alarmLevel')">告警等级：{{ alarmLevelMap[searchParams.alarmLevel] || searchParams.alarmLevel }}</el-tag>
          <el-tag v-if="searchParams.alarmStatus" type="primary" closable @close="handleClearField('alarmStatus')">告警状态：{{ alarmStatusMap[searchParams.alarmStatus] || searchParams.alarmStatus }}</el-tag>
          <el-tag v-if="searchParams.alarmTimeBegin" type="primary" closable @close="handleClearField('alarmTimeBegin')">告警时间：{{ searchParams.alarmTimeBegin }} 至 {{ searchParams.alarmTimeEnd }}</el-tag>
          <el-tag v-if="searchParams.repairTimeBegin" type="primary" closable @close="handleClearField('repairTimeBegin')">修复时间：{{ searchParams.repairTimeBegin }} 至 {{ searchParams.repairTimeEnd }}</el-tag>
          <el-tag v-if="searchParams.operator" type="primary" closable @close="handleClearField('operator')">操作人：{{ searchParams.operator }}</el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="排查" icon-name="Edit" :disabled="!canBatchCheck" @click="handleBatchCheck" />
          <IconButton content="修复" icon-name="Tools" :disabled="!canBatchRepair" @click="handleBatchRepair" />
          <IconButton content="销账" icon-name="Finished" :disabled="!canBatchClose" @click="handleBatchClose" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <el-dropdown @command="handleExportWithType">
            <IconButton content="导出" icon-name="download" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="Excel">Excel</el-dropdown-item>
                <el-dropdown-item command="PDF">PDF</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <IconButton content="刷新" icon-name="Refresh" @click="handleRefresh" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列模板（钻取交互） -->
      <template #alarmCode="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.alarmCode }}</el-text>
      </template>
      <template #moduleName="{ row }">
        <el-text @click="handleFieldClick('moduleName', row.moduleName)" type="primary">{{ row.moduleName }}</el-text>
      </template>
      <template #abnormalType="{ row }">
        <el-text @click="handleFieldClick('abnormalType', row.abnormalType)" type="primary">{{ abnormalTypeMap[row.abnormalType] || row.abnormalType }}</el-text>
      </template>
      <template #alarmLevel="{ row }">
        <el-tag :type="row.alarmLevel === '严重' ? 'danger' : 'info'" @click="handleFieldClick('alarmLevel', row.alarmLevel)" style="cursor: pointer">
          {{ alarmLevelMap[row.alarmLevel] || row.alarmLevel }}
        </el-tag>
      </template>
      <template #alarmTime="{ row }">
        <el-text @click="handleFieldClick('alarmTime', row.alarmTime)" type="primary">{{ row.alarmTime }}</el-text>
      </template>
      <template #alarmStatus="{ row }">
        <el-tag :type="alarmStatusTagType(row.alarmStatus)" @click="handleFieldClick('alarmStatus', row.alarmStatus)" style="cursor: pointer">
          {{ alarmStatusMap[row.alarmStatus] || row.alarmStatus }}
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

          <template v-if="row.alarmStatus === '未排查'">
            <IconButton content="排查" icon-name="Edit" @click="handleCheck(row)" />
            <IconButton content="备注" icon-name="Document" @click="handleRemark(row)" />
          </template>
          <template v-else-if="row.alarmStatus === '已排查'">
            <IconButton content="修复" icon-name="Tools" @click="handleRepair(row)" />
            <IconButton content="备注" icon-name="Document" @click="handleRemark(row)" />
          </template>
          <template v-else-if="row.alarmStatus === '修复中'">
            <IconButton content="销账" icon-name="Finished" @click="handleClose(row)" />
            <IconButton content="备注" icon-name="Document" @click="handleRemark(row)" />
          </template>
          <template v-else-if="row.alarmStatus === '已销账'">
            <IconButton content="备注" icon-name="Document" @click="handleRemark(row)" />
          </template>
        </div>
      </template>

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

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import {
  getPageList,
  checkAlarm,
  repairAlarm,
  closeAlarm,
  remarkAlarm,
  exportAlarm,
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
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
});

const detailDrawerRef = ref(null);
const debugDrawerRef = ref(null);
const repairDrawerRef = ref(null);
const remarkDrawerRef = ref(null);
const voucherPreviewVisible = ref(false);
const voucherPreviewUrl = ref('');

const getTableData = async ({ page }) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...searchParams.value,
  };
  try {
    const res = await getPageList(params);
    const { list, total } = res;
    dataObj.list = list.map(item => ({
      ...item,
      alarmTime: item.alarmTime ? dayjs(item.alarmTime).format('YYYY-MM-DD HH:mm:ss') : '-',
      repairTime: item.repairTime ? dayjs(item.repairTime).format('YYYY-MM-DD HH:mm:ss') : null,
    }));
    dataObj.total = total;
    return dataObj;
  } catch (error) {
    console.error('表格数据获取失败', error);
    dataObj.list = [];
    dataObj.total = 0;
    return dataObj;
  }
};

function handleRefresh() {
  gridApi.query();
}

function getStatusCount(status) {
  return dataObj.list.filter(v => v.alarmStatus === status).length;
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

// 排查
function handleCheck(row) {
  debugDrawerRef.value.open(row.id);
}
async function handleBatchCheck() {
  const validIds = checkedIds.value.filter(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row?.alarmStatus === '未排查';
  });
  if (validIds.length === 0) {
    ElMessage.warning('请选择未排查状态的告警');
    return;
  }
  await confirm(`确定对选中的 ${validIds.length} 条告警进行排查吗？`);
  const loadingInstance = ElLoading.service({ text: '批量排查中...' });
  try {
    // 批量排查需要逐条调用（或后端支持批量），此处循环调用
    for (const id of validIds) {
      await checkAlarm({ id, checkReason: '批量排查' });
    }
    ElMessage.success('批量排查成功');
    checkedIds.value = [];
    emit('refresh-chart');
    handleRefresh();
  } catch (error) {
    ElMessage.error(error.message || '批量排查失败');
  } finally {
    loadingInstance.close();
  }
}

// 修复
function handleRepair(row) {
  repairDrawerRef.value.open(row.id);
}
async function handleBatchRepair() {
  const validIds = checkedIds.value.filter(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row?.alarmStatus === '已排查';
  });
  if (validIds.length === 0) {
    ElMessage.warning('请选择已排查状态的告警');
    return;
  }
  await confirm(`确定对选中的 ${validIds.length} 条告警进行修复吗？`);
  const loadingInstance = ElLoading.service({ text: '批量修复中...' });
  try {
    for (const id of validIds) {
      await repairAlarm({ id, repairVoucher: '批量修复凭证' });
    }
    ElMessage.success('批量修复成功');
    checkedIds.value = [];
    emit('refresh-chart');
    handleRefresh();
  } catch (error) {
    ElMessage.error(error.message || '批量修复失败');
  } finally {
    loadingInstance.close();
  }
}

// 销账
function handleClose(row) {
  confirm(`确定销账告警【${row.alarmCode}】吗？销账后将标记为已销账。`).then(async () => {
    const loadingInstance = ElLoading.service({ text: '销账中...' });
    try {
      await closeAlarm({ id: row.id });
      ElMessage.success('销账成功');
      emit('refresh-chart');
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
    return row?.alarmStatus === '修复中';
  });
  if (validIds.length === 0) {
    ElMessage.warning('请选择修复中状态的告警');
    return;
  }
  await confirm(`确定对选中的 ${validIds.length} 条告警进行销账吗？`);
  const loadingInstance = ElLoading.service({ text: '批量销账中...' });
  try {
    for (const id of validIds) {
      await closeAlarm({ id });
    }
    ElMessage.success('批量销账成功');
    checkedIds.value = [];
    emit('refresh-chart');
    handleRefresh();
  } catch (error) {
    ElMessage.error(error.message || '批量销账失败');
  } finally {
    loadingInstance.close();
  }
}

// 备注
function handleRemark(row) {
  remarkDrawerRef.value.open(row.id, row.remark);
}

async function handleExportWithType(exportType) {
  if (exportType === 'PDF') {
    ElMessage.info('PDF导出功能开发中');
    return;
  }
  const loadingInstance = ElLoading.service({ text: '正在导出...' });
  try {
    const params = { ...searchParams.value, exportType };
    const blob = await exportAlarm(params);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `模块告警列表_${dayjs().format('YYYYMMDD')}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error(error.message || '导出失败');
  } finally {
    loadingInstance.close();
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
  if (Object.keys(filters).length === 0) {
    resetFilter();
  } else {
    Object.assign(searchParams.value, filters);
    queryFormApi.setValues(filters);
    handleRefresh();
  }
}

const canBatchCheck = computed(() => {
  return checkedIds.value.some(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row?.alarmStatus === '未排查';
  });
});
const canBatchRepair = computed(() => {
  return checkedIds.value.some(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row?.alarmStatus === '已排查';
  });
});
const canBatchClose = computed(() => {
  return checkedIds.value.some(id => {
    const row = dataObj.list.find(item => item.id === id);
    return row?.alarmStatus === '修复中';
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


