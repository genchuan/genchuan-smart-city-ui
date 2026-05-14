<!-- 内部 index.vue - 能耗报表主表格 -->
<script setup>
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';

import { useVbenDrawer, useVbenForm } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import * as echarts from 'echarts';
import { ElMessage, ElMessageBox } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getEnergyCycleReportPage,
  generateEnergyCycleReport,
  exportEnergyCycleReport,
  getEnergyCycleReportDetail,
  getUserInfo,
  rowExportEnergyCycleReport,
  startAutoGenerate,
  stopAutoGenerate,
} from '#/api/genchuan/industry/industrialpark/energyMgmt/energyReport/cycleReport/index.js';
import { formatTimestamp } from '#/utils';

import { useFormSchema, useGridColumns } from './data';
import EnergyReportDetailDrawer from './detail.vue';

const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },
  cycleType: { type: String, default: '' },
});
const emit = defineEmits(['arrowChange']);
const arrowChange = () => emit('arrowChange');

const dataObj = reactive({
  total: 0,
  list: [],
  searchObj: {},
  currentPage: 1,
  pageSize: 10,
});

const currentDetail = ref(null);

// 操作人相关
const operatorDrawerTitle = ref('操作人详情');
const currentOperator = ref({ id: '', username: '', name: '' });

// ========== 日期时间补全函数 ==========
const padDateTime = (s, isEnd) => {
  if (!s) return s;
  const v = String(s).trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(v)) return v;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(v))
    return `${v}:${isEnd ? '59' : '00'}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v))
    return `${v} ${isEnd ? '23:59:59' : '00:00:00'}`;
  return v;
};

// ========== 筛选表单抽屉 ==========
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema(),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      queryFormApi.resetForm();
      queryFormApi.submitForm();
    },
  },
});

const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 500,
  title: '筛选',
  onCancel: () => searchDrawerApi.close(),
});

const openSearchDrawer = () => {
  searchDrawerApi.open();
};

async function onSubmit(values) {
  let startTime = values.reportTimeStart;
  let endTime = values.reportTimeEnd;
  if (startTime) startTime = padDateTime(startTime, false);
  if (endTime) endTime = padDateTime(endTime, true);
  const processedValues = {
    reportType: values.reportType,
    reportTimeStart: startTime,
    reportTimeEnd: endTime,
    generateStatus: values.generateStatus,
  };
  dataObj.searchObj = { ...processedValues };
  dataObj.currentPage = 1;
  gridApi.query();
  searchDrawerApi.close();
}

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchObj;
  // if (obj.reportType) filters.push({ label: `报表周期：${obj.reportType}`, field: 'reportType' });
  if (obj.reportTimeStart || obj.reportTimeEnd) {
    const start = obj.reportTimeStart || '';
    const end = obj.reportTimeEnd || '';
    filters.push({ label: `统计时段：${start} 至 ${end}`, field: 'reportTime' });
  }
  if (obj.generateStatus)
    filters.push({ label: `生成状态：${obj.generateStatus}`, field: 'generateStatus' });
  return filters;
});

const handleClearField = (fieldName) => {
  const next = { ...dataObj.searchObj };
  const formPatch = {};
  if (fieldName === 'reportTime') {
    delete next.reportTimeStart;
    delete next.reportTimeEnd;
    formPatch.reportTimeStart = null;
    formPatch.reportTimeEnd = null;
  } else {
    delete next[fieldName];
    formPatch[fieldName] = null;
  }
  dataObj.searchObj = next;
  dataObj.currentPage = 1;
  gridApi.query();
  Promise.resolve(queryFormApi.setValues?.(formPatch, false)).catch(() => {});
};

const filterByField = (field, value) => {
  dataObj.searchObj = { ...dataObj.searchObj, [field]: value };
  dataObj.currentPage = 1;
  gridApi.query();
};

const getTableData = async (pageObj) => {
  const params = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.searchObj,
    reportTime: dataObj.searchObj.reportTimeStart && dataObj.searchObj.reportTimeEnd
      ? `${dataObj.searchObj.reportTimeStart},${dataObj.searchObj.reportTimeEnd}`
      : undefined
  };
  const res = await getEnergyCycleReportPage(params);
  dataObj.total = res.total;
  dataObj.list = (res.list || []).map((v) => ({
    ...v,
    createTime: formatTimestamp(v.createTime),
    updateTime: formatTimestamp(v.updateTime),
  }));
  return dataObj;
};

const checkedRows = ref([]);
const handleRowCheckboxChange = ({ records }) => {
  checkedRows.value = records || [];
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

const handleRefresh = () => gridApi.query();

// 生成报表相关
const createForm = reactive({
  reportType: '',
  timeRange: '',
  timeRangeStart: '',
  timeRangeEnd: '',
});
const createFormRef = ref(null);
const createRules = {
  reportType: [{ required: true, message: '请选择报表类型', trigger: 'change' }],
  timeRange: [
    {
      validator: (rule, value, callback) => {
        if (createForm.reportType === '自定义报表' && (!createForm.timeRangeStart || !createForm.timeRangeEnd)) {
          callback(new Error('请选择统计时间范围'));
        } else {
          callback();
        }
      },
      trigger: 'change',
    },
  ],
};

const fmt = (d) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
const computeRange = (type) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  let end, start;
  switch (type) {
    case '半年报': {
      const hStart = m < 6 ? 0 : 6;
      start = new Date(y, hStart, 1, 0, 0, 0);
      end = new Date(y, hStart + 6, 0, 23, 59, 59);
      break;
    }
    case '周报': {
      const day = now.getDay() || 7;
      start = new Date(y, m, d - day + 1, 0, 0, 0);
      end = new Date(y, m, d - day + 7, 23, 59, 59);
      break;
    }
    case '季报': {
      const qStart = Math.floor(m / 3) * 3;
      start = new Date(y, qStart, 1, 0, 0, 0);
      end = new Date(y, qStart + 3, 0, 23, 59, 59);
      break;
    }
    case '年报': {
      start = new Date(y, 0, 1, 0, 0, 0);
      end = new Date(y, 11, 31, 23, 59, 59);
      break;
    }
    case '日报': {
      start = new Date(y, m, d, 0, 0, 0);
      end = new Date(y, m, d, 23, 59, 59);
      break;
    }
    case '月报': {
      start = new Date(y, m, 1, 0, 0, 0);
      end = new Date(y, m + 1, 0, 23, 59, 59);
      break;
    }
    default: {
      return { start: '', end: '' };
    }
  }
  return { start: fmt(start), end: fmt(end) };
};
const onReportTypeChange = (type) => {
  if (type === '自定义报表') {
    createForm.timeRangeStart = '';
    createForm.timeRangeEnd = '';
  } else {
    const { start, end } = computeRange(type);
    createForm.timeRangeStart = start;
    createForm.timeRangeEnd = end;
  }
};
const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  width: 550,
  title: '生成能耗周期报表',
  onConfirm: async () => {
    try {
      await createFormRef.value.validate();
      const params = {
        reportType: createForm.reportType,
        timeRange: `${createForm.timeRangeStart},${createForm.timeRangeEnd}`
      };
      await generateEnergyCycleReport(params);
      ElMessage.success('报表生成成功');
      createDrawerApi.close();
      handleRefresh();
    } catch (error) {
      if (error !== 'cancel') ElMessage.error('生成失败，请检查输入');
    }
  },
});
const openCreateDrawer = () => {
  createForm.reportType = '';
  createForm.timeRangeStart = '';
  createForm.timeRangeEnd = '';
  createDrawerApi.open();
};

// 开启/关闭自动生成
const handleStartAutoGenerate = async () => {
  try {
    await startAutoGenerate();
    ElMessage.success('已开启报表自动生成');
  } catch {
    ElMessage.error('开启失败');
  }
};
const handleStopAutoGenerate = async () => {
  try {
    await stopAutoGenerate();
    ElMessage.success('已关闭报表自动生成');
  } catch {
    ElMessage.error('关闭失败');
  }
};

// 导出列表
const handleExportList = async () => {
  if (checkedRows.value.length > 0) {
    await ElMessageBox.confirm(
      `确认导出选中的 ${checkedRows.value.length} 条数据吗？`,
      '提示',
      { type: 'info' },
    );
    await exportRowsAsXlsx(checkedRows.value);
    ElMessage.success('导出成功');
    return;
  }
  await ElMessageBox.confirm('确认导出当前列表数据吗？', '提示', {
    type: 'info',
  });
  const params = { ...dataObj.searchObj, pageNo: 1, pageSize: 200 };
  const blob = await exportEnergyCycleReport(params);
  downloadFileFromBlobPart({ fileName: '能耗周期报表列表.xlsx', source: blob });
  ElMessage.success('导出成功');
};

const exportRowsAsXlsx = async (rows) => {
  const XLSX = await import('xlsx');
  const cols = [
    { field: 'reportType', title: '报表周期' },
    { field: 'reportTime', title: '统计时段' },
    { field: 'totalEnergy', title: '总能耗量(kWh)' },
    { field: 'unitEnergy', title: '单位能耗(kWh/㎡)' },
    { field: 'saveEnergy', title: '节能总量(kWh)' },
    { field: 'alarmCount', title: '异常预警数(次)' },
    { field: 'controlDeviceCount', title: '管控设备数(台)' },
    { field: 'generateStatus', title: '生成状态' },
    { field: 'createTime', title: '报表生成时间' },
    { field: 'creator', title: '操作人' },
    { field: 'exportCount', title: '报表导出次数' },
    { field: 'yoyChange', title: '同比变化(%)' },
    { field: 'momChange', title: '环比变化(%)' },
  ];
  const data = rows.map((r) => {
    const o = {};
    cols.forEach((c) => {
      o[c.title] = r[c.field] ?? '';
    });
    return o;
  });
  const ws = XLSX.utils.json_to_sheet(data, { header: cols.map(c => c.title) });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '能耗周期报表');
  const ts = new Date().toISOString().slice(0, 19).replaceAll(/[T:]/g, '-');
  XLSX.writeFile(wb, `能耗周期报表_${rows.length}条_${ts}.xlsx`);
};

const handleRowExport = async (id) => {
  try {
    await ElMessageBox.confirm('确认导出该报表的完整明细数据吗？', '提示', { type: 'info' });
    const blob = await rowExportEnergyCycleReport(id);
    downloadFileFromBlobPart({ fileName: `能耗周期报表_${id}.xlsx`, source: blob });
    ElMessage.success('导出成功');
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error('导出失败');
  }
};

const detailDrawerRef = ref(null);
const handleViewDetail = async (row) => {
  const res = await getEnergyCycleReportDetail({ id: row.id });
  currentDetail.value = res;
  detailDrawerRef.value.open();
};

// 操作人详情抽屉
const [OperatorDrawer, operatorDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 400,
  title: operatorDrawerTitle,
  onCancel: () => operatorDrawerApi.close(),
});
const showOperatorDetail = async (userId, userName) => {
  if (!userId) {
    ElMessage.warning('无操作人信息');
    return;
  }
  try {
    const userInfo = await getUserInfo(userId);
    currentOperator.value = {
      id: userId,
      username: userInfo.username || '',
      name: userInfo.nickname || userName || '',
    };
  } catch {
    currentOperator.value = { id: userId, username: '', name: userName || '' };
  }
  operatorDrawerApi.open();
};

// 钻取明细
const openDimensionDetail = async (reportId, dimension, filterValue) => {
  const res = await getEnergyCycleReportDetail({ id: reportId });
  currentDetail.value = res;
  detailDrawerRef.value?.open(dimension, filterValue);
};

// 图表钻取监听
const handleChartDrill = async (event) => {
  const filters = event.detail || {};
  if (filters._activeCycleType !== undefined && filters._activeCycleType !== props.cycleType) return;
  if (filters.dimension) {
    if (!dataObj.list || dataObj.list.length === 0) {
      ElMessage.warning('暂无可下钻的报表，请先生成');
      return;
    }
    const latestReport = dataObj.list[0];
    await openDimensionDetail(latestReport.id, filters.dimension, filters.type);
  }
};

watch(
  () => props.cycleType,
  (newVal) => {
    const newSearchObj = { ...dataObj.searchObj };
    if (newVal === '') {
      delete newSearchObj.reportType;
    } else {
      newSearchObj.reportType = newVal;
    }
    dataObj.searchObj = newSearchObj;
    dataObj.currentPage = 1;
    gridApi.query();
  },
  { immediate: true },
);

onMounted(() => {
  window.addEventListener('cycle-report-chart-refresh', handleChartDrill);
});
onUnmounted(() => {
  window.removeEventListener('cycle-report-chart-refresh', handleChartDrill);
});

const getCycleTagType = (cycle) => {
  const typeMap = {
    '日报': 'info', '周报': 'success', '月报': 'warning',
    '季报': 'danger', '半年报': 'primary', '年报': '',
    '自定义报表': 'info',
  };
  return typeMap[cycle] || '';
};
</script>

<template>
  <div class="park-lot-table-new">
    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <el-tag
            v-for="filter in activeFilters"
            :key="filter.field"
            type="primary"
            closable
            @close="handleClearField(filter.field)"
          >
            {{ filter.label }}
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="开启自动生成" icon-name="VideoPlay" @click="handleStartAutoGenerate" />
          <IconButton content="关闭自动生成" icon-name="VideoPause" @click="handleStopAutoGenerate" />
          <IconButton content="生成" icon-name="Plus" @click="openCreateDrawer" />
          <IconButton content="筛选" icon-name="search" @click="openSearchDrawer" />
          <IconButton content="导出" icon-name="download" @click="handleExportList" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="刷新" icon-name="refresh" @click="handleRefresh" />
        </div>
      </template>

      <template #reportType="{ row }">
        <el-tag :type="getCycleTagType(row.reportType)" @click="filterByField('reportType', row.reportType)" style="cursor: pointer" size="small">
          {{ row.reportType }}
        </el-tag>
      </template>
      <template #reportTime="{ row }">
        <el-text @click="filterByField('reportTime', row.reportTime)" type="primary" style="cursor: pointer">
          {{ row.reportTime }}
        </el-text>
      </template>
      <template #totalEnergy="{ row }">
        <el-text @click="openDimensionDetail(row.id, 'totalEnergy')" type="primary">
          {{ row.totalEnergy }} kWh
        </el-text>
      </template>
      <template #unitEnergy="{ row }">
        <el-text @click="openDimensionDetail(row.id, 'unitEnergy')" type="primary">
          {{ row.unitEnergy }} kWh/㎡
        </el-text>
      </template>
      <template #saveEnergy="{ row }">
        <el-text @click="openDimensionDetail(row.id, 'saveEnergy')" type="primary">
          {{ row.saveEnergy }} kWh
        </el-text>
      </template>
      <template #alarmCount="{ row }">
        <el-text @click="openDimensionDetail(row.id, 'alarm')" type="primary">
          {{ row.alarmCount }}
        </el-text>
      </template>
      <template #controlDeviceCount="{ row }">
        <el-text @click="openDimensionDetail(row.id, 'controlDevice')" type="primary">
          {{ row.controlDeviceCount }}
        </el-text>
      </template>
      <template #generateStatus="{ row }">
        <el-tag @click="filterByField('generateStatus', row.generateStatus)" style="cursor: pointer">
          {{ row.generateStatus }}
        </el-tag>
      </template>
      <template #operator="{ row }">
        <el-text @click="showOperatorDetail(row.creatorUserId, row.creator)" type="primary">
          {{ row.creator }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleViewDetail(row)" />
          <IconButton content="导出" icon-name="download" @click="handleRowExport(row.id)" />
          <IconButton content="筛选" icon-name="Filter" @click="filterByField('reportType', row.reportType)" />
        </div>
      </template>
    </Grid>

    <!-- 生成报表抽屉 -->
    <CreateDrawer>
      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="100px">
        <el-form-item label="报表类型" prop="reportType" required>
          <el-select v-model="createForm.reportType" placeholder="请选择报表类型" @change="onReportTypeChange">
            <el-option label="日报" value="日报" />
            <el-option label="周报" value="周报" />
            <el-option label="月报" value="月报" />
            <el-option label="季报" value="季报" />
            <el-option label="半年报" value="半年报" />
            <el-option label="年报" value="年报" />
            <el-option label="自定义报表" value="自定义报表" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="createForm.reportType && createForm.reportType !== '自定义报表'" label="统计区间">
          <el-text type="info">{{ createForm.timeRangeStart }} 至 {{ createForm.timeRangeEnd }}</el-text>
        </el-form-item>
        <template v-if="createForm.reportType === '自定义报表'">
          <el-form-item label="统计开始时间" prop="timeRangeStart" required>
            <el-date-picker v-model="createForm.timeRangeStart" type="datetime" placeholder="选择开始时间" value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
          <el-form-item label="统计结束时间" prop="timeRangeEnd" required>
            <el-date-picker v-model="createForm.timeRangeEnd" type="datetime" placeholder="选择结束时间" value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
        </template>
      </el-form>
    </CreateDrawer>

    <!-- 报表详情抽屉 -->
    <EnergyReportDetailDrawer ref="detailDrawerRef" :detail-data="currentDetail" />

    <!-- 操作人详情抽屉 -->
    <OperatorDrawer :title="operatorDrawerTitle">
      <div class="detail-container" style="padding: 0">
        <div class="detail-card">
          <div class="detail-card-row">
            <div class="detail-row-left">账号：</div>
            <div class="detail-row-right">{{ currentOperator.username || '-' }}</div>
          </div>
          <div class="detail-card-row">
            <div class="detail-row-left">姓名：</div>
            <div class="detail-row-right">{{ currentOperator.name || '-' }}</div>
          </div>
        </div>
      </div>
    </OperatorDrawer>

    <!-- 筛选抽屉 -->
    <SearchDrawer title="筛选">
      <QueryForm class="search-form" />
    </SearchDrawer>
  </div>
</template>

<style scoped>
.compare-chart-container {
  min-height: 500px;
  padding: 20px;
  background: #f5f7fa;
}
.compare-chart {
  width: 100%;
  height: auto;
  min-height: 360px;
}
.detail-container {
  max-height: 80vh;
  padding: 20px;
  overflow-y: auto;
}
.detail-card {
  padding: 0 16px;
  margin-bottom: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
}
.detail-card-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.detail-card-row:last-child {
  border-bottom: none;
}
.detail-row-left {
  flex-shrink: 0;
  width: 120px;
  font-weight: 500;
  color: #606266;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  word-break: break-all;
}
.search-form {
  padding: 16px;
}
</style>
