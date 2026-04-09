<template>
  <div class="park-lot-table-new">
    <DetailDrawer ref="detailDrawerRef" />
    <AnalyticsDialog ref="analyticsDialogRef" />

    <Drawer title="筛选报表">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <div v-if="props.secondShow">
            <el-tabs v-model="activeTimeScale" class="demo-tabs" @tab-change="handleTimeScaleChange">
              <el-tab-pane
                v-for="item in timeScaleTabs"
                :key="item.value"
                :label="`${item.label} (${getTabCount(item.value)})`"
                :name="item.value"
              />
            </el-tabs>
          </div>

          <!-- 筛选条件标签 -->
          <el-tag v-if="searchParams.reportCode" type="primary" closable @close="handleClearFilter('reportCode')">
            报表编号：{{ searchParams.reportCode }}
          </el-tag>
          <el-tag v-if="searchParams.reportName" type="primary" closable @close="handleClearFilter('reportName')">
            报表名称：{{ searchParams.reportName }}
          </el-tag>
          <el-tag v-if="searchParams.reportType" type="primary" closable @close="handleClearFilter('reportType')">
            报表类型：{{ reportTypeMap[searchParams.reportType] || searchParams.reportType }}
          </el-tag>
          <el-tag v-if="searchParams.reportStatus" type="primary" closable @close="handleClearFilter('reportStatus')">
            流程状态：{{ reportStatusMap[searchParams.reportStatus] || searchParams.reportStatus }}
          </el-tag>
          <el-tag v-if="searchParams.timeScale" type="primary" closable @close="handleClearFilter('timeScale')">
            时间尺度：{{ timeScaleMap[searchParams.timeScale] || searchParams.timeScale }}
          </el-tag>
          <!-- 统计周期标签：使用 formatStatPeriod 格式化显示 -->
          <el-tag v-if="searchParams.startTime && searchParams.endTime" type="info" closable @close="handleClearFilter('startTime')">
            统计周期：{{ formatStatPeriod(searchParams.startTime, searchParams.endTime) }}
          </el-tag>
          <!-- 生成时间标签：使用 formatTimestamp 格式化显示时间戳 -->
          <el-tag v-if="searchParams.createTimeBegin && searchParams.createTimeEnd" type="info" closable @close="handleClearFilter('createTimeBegin')">
            生成时间：{{ formatTimestamp(searchParams.createTimeBegin) }} 至 {{ formatTimestamp(searchParams.createTimeEnd) }}
          </el-tag>
          <el-tag v-if="searchParams.abnormalType" type="danger" closable @close="handleClearFilter('abnormalType')">
            异常类型：{{ searchParams.abnormalType }}
          </el-tag>
          <el-tag v-if="searchParams.refundStatus" type="warning" closable @close="handleClearFilter('refundStatus')">
            退款状态：{{ searchParams.refundStatus }}
          </el-tag>
          <el-tag v-if="searchParams.tradeAmount" type="success" closable @close="handleClearFilter('tradeAmount')">
            交易金额：{{ searchParams.tradeAmount === '>0' ? '大于0' : searchParams.tradeAmount }}
          </el-tag>
          <el-tag v-if="searchParams.createUser" type="primary" closable @close="handleClearFilter('createUser')">
            操作人：{{ searchParams.createUser }}
          </el-tag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="筛选" icon-name="search" @click="handleSearchShow" />
          <IconButton content="导出列表" icon-name="download" @click="handleExportList" />
          <IconButton content="刷新" icon-name="Refresh" @click="handleRefresh" />
          <IconButton content="自定义报表生成" icon-name="DocumentAdd" @click="emit('openCustomDrawer')" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="handleArrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 表格列模板 -->
      <template #reportId="{ row }">
        <el-text type="primary" @click="handleViewDetail(row)">{{ row.id }}</el-text>
      </template>
      <template #reportCode="{ row }">
        <el-text type="primary" @click="handleFilterByField('reportCode', row.reportCode)">{{ row.reportCode }}</el-text>
      </template>
      <template #reportType="{ row }">
        <el-text type="primary" @click="handleFilterByField('reportType', row.reportType)">{{ row.reportTypeName }}</el-text>
      </template>
      <template #timeScale="{ row }">
        <el-tag :type="timeScaleTagType(row.timeScale)" @click="handleFilterByField('timeScale', row.timeScale)" style="cursor: pointer">
          {{ row.timeScaleName }}
        </el-tag>
      </template>
      <template #statPeriod="{ row }">
        <el-text type="primary" @click="handleFilterByPeriod(row.startTime, row.endTime)">{{ row.statPeriod }}</el-text>
      </template>
      <template #createTime="{ row }">
        <el-text type="primary" @click="handleFilterByCreateTime(row.createTime)">{{ row.createTime }}</el-text>
      </template>
      <template #reportStatus="{ row }">
        <el-tag :type="reportStatusTagType(row.reportStatus)" @click="handleFilterByField('reportStatus', row.reportStatus)" style="cursor: pointer">
          {{ row.reportStatusName }}
        </el-tag>
      </template>
      <template #filterCondition="{ row }">
        <el-text type="primary" @click="showFilterCondition(row.filterCondition)">查看规则</el-text>
      </template>
      <template #analysis="{ row }">
        <el-text type="primary" @click="showAnalytics(row.id)">查看分析</el-text>
      </template>
      <template #createUser="{ row }">
        <el-text type="primary" @click="handleFilterByField('createUser', row.createUser)">{{ row.createUser }}</el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; gap: 4px; flex-wrap: wrap; justify-content: center;">
          <IconButton content="查看" icon-name="View" @click="handleViewDetail(row)" />
          <IconButton content="导出" icon-name="download" @click="handleExportSingle(row)" />
          <IconButton content="打印" icon-name="Printer" @click="handlePrint(row)" />
          <IconButton v-if="row.timeScale === 'custom'" content="重新生成" icon-name="refresh" @click="handleRecreate(row)" />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>本页统计：报表总数{{ dataObj.list.length }}，日报{{ getTabCount('day') }}，周报{{ getTabCount('week') }}，月报{{ getTabCount('month') }}，季报{{ getTabCount('quarter') }}，半年报{{ getTabCount('halfYear') }}，年报{{ getTabCount('year') }}，自定义{{ getTabCount('custom') }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：总报表数{{ dataObj.total }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage, ElLoading } from 'element-plus';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import screenfull from 'screenfull';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

import {
  getReportPage,
  exportReportList,
  exportSingleReport,
  printReport,
  recreateReport,
} from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/orderReport/index.js';
import DetailDrawer from './detail.vue';
import AnalyticsDialog from './analyticsDialog.vue';
import {
  useGridColumns,
  useQuerySchema,
  reportTypeMap,
  reportStatusMap,
  timeScaleMap,
  reportStatusTagType,
  timeScaleTagType,
  formatStatPeriod,
  formatTimestamp,
  mockReportList,
  mockReportDetail,
} from './data.js';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: true },
});
const emit = defineEmits(['refresh-chart', 'openCustomDrawer', 'arrow-change']);

// 时间尺度标签页配置
const timeScaleTabs = ref([
  { label: '全部', value: 'all' },
  { label: '日报', value: 'day' },
  { label: '周报', value: 'week' },
  { label: '月报', value: 'month' },
  { label: '季报', value: 'quarter' },
  { label: '半年报', value: 'halfYear' },
  { label: '年报', value: 'year' },
  { label: '自定义报表', value: 'custom' },
]);

const activeTimeScale = ref('all');
const searchParams = ref({});
const dataObj = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10,
  totalShow: false,
  list: [],
});
const tabCountMap = ref({
  all: 0,
  day: 0,
  week: 0,
  month: 0,
  quarter: 0,
  halfYear: 0,
  year: 0,
  custom: 0,
});

const detailDrawerRef = ref(null);
const analyticsDialogRef = ref(null);
const filterConditionVisible = ref(false);
const filterConditionText = ref('');
const checkedIds = ref([]);

const getTabCount = (value) => tabCountMap.value[value] ?? 0;

// ==================== 辅助函数：日期字符串转时间戳（秒） ====================
const dateStringToTimestamp = (dateStr) => {
  if (!dateStr) return null;
  if (/^\d+$/.test(dateStr)) return Number(dateStr);
  const date = new Date(dateStr);
  return Math.floor(date.getTime() / 1000);
};

// ==================== convertSearchParams 修复 ====================
const convertSearchParams = (params) => {
  const converted = { ...params };
  if (activeTimeScale.value !== 'all') {
    converted.timeScale = activeTimeScale.value;
  } else {
    if (!params.timeScale) {
      delete converted.timeScale;
    }
  }
  Object.keys(converted).forEach(key => {
    if (converted[key] === '' || converted[key] === null || converted[key] === undefined) {
      delete converted[key];
    }
  });
  return converted;
};

const formatList = (list) => {
  return (list || []).map(item => ({
    ...item,
    reportTypeName: reportTypeMap[item.reportType] || item.reportType || '-',
    reportStatusName: reportStatusMap[item.reportStatus] || item.reportStatus || '-',
    timeScaleName: timeScaleMap[item.timeScale] || item.timeScale || '-',
    statPeriod: formatStatPeriod(item.startTime, item.endTime),
    createTime: formatTimestamp(item.createTime),
  }));
};

// 前端过滤函数（支持时间戳比较）
const filterMockData = (data, filters, timeScale) => {
  let filtered = [...data];
  const effectiveTimeScale = filters.timeScale || (timeScale !== 'all' ? timeScale : null);
  if (effectiveTimeScale) {
    filtered = filtered.filter(item => item.timeScale === effectiveTimeScale);
  }
  if (filters.reportCode) {
    filtered = filtered.filter(item => item.reportCode.includes(filters.reportCode));
  }
  if (filters.reportName) {
    filtered = filtered.filter(item => item.reportName.includes(filters.reportName));
  }
  if (filters.reportType) {
    filtered = filtered.filter(item => item.reportType === filters.reportType);
  }
  if (filters.reportStatus) {
    filtered = filtered.filter(item => item.reportStatus === filters.reportStatus);
  }
  // 统计周期（startTime/endTime）已经是时间戳
  if (filters.startTime && filters.endTime) {
    const start = Number(filters.startTime);
    const end = Number(filters.endTime);
    filtered = filtered.filter(item => Number(item.startTime) >= start && Number(item.endTime) <= end);
  }
  // 生成时间（createTimeBegin/createTimeEnd）已经是时间戳
  if (filters.createTimeBegin && filters.createTimeEnd) {
    const begin = Number(filters.createTimeBegin);
    const end = Number(filters.createTimeEnd);
    filtered = filtered.filter(item => Number(item.createTime) >= begin && Number(item.createTime) <= end);
  }
  if (filters.createUser) {
    filtered = filtered.filter(item => item.createUser?.includes(filters.createUser));
  }
  return filtered;
};

const getTableData = async ({ page }) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...convertSearchParams(searchParams.value),
  };
  try {
    const res = await getReportPage(params);
    const { list, total } = res;
    const formattedList = formatList(list);
    dataObj.list = formattedList;
    dataObj.total = total;
    dataObj.currentPage = page.currentPage;
    dataObj.pageSize = page.pageSize;
    updateTabCounts(formattedList);
    return { list: formattedList, total };
  } catch (error) {
    console.warn('后端接口未就绪，使用前端模拟数据并应用筛选条件', error);
    let filteredList = filterMockData(mockReportList, searchParams.value, activeTimeScale.value);
    const total = filteredList.length;
    const start = (page.currentPage - 1) * page.pageSize;
    const pagedList = filteredList.slice(start, start + page.pageSize);
    const formattedList = formatList(pagedList);
    dataObj.list = formattedList;
    dataObj.total = total;
    dataObj.currentPage = page.currentPage;
    dataObj.pageSize = page.pageSize;
    updateTabCounts(formattedList);
    return { list: formattedList, total };
  }
};

const updateTabCounts = (list) => {
  const counts = {
    all: list.length,
    day: 0,
    week: 0,
    month: 0,
    quarter: 0,
    halfYear: 0,
    year: 0,
    custom: 0,
  };
  list.forEach(item => {
    const scale = item.timeScale;
    if (counts.hasOwnProperty(scale)) {
      counts[scale]++;
    }
  });
  tabCountMap.value = counts;
};

const handleRefresh = () => {
  gridApi.query();
  emit('refresh-chart');
};

const handleTimeScaleChange = (value) => {
  activeTimeScale.value = value;
  searchParams.value = {};
  dataObj.currentPage = 1;
  handleRefresh();
};

const handleClearFilter = (key) => {
  if (key === 'startTime') {
    delete searchParams.value.startTime;
    delete searchParams.value.endTime;
  } else if (key === 'createTimeBegin') {
    delete searchParams.value.createTimeBegin;
    delete searchParams.value.createTimeEnd;
  } else {
    delete searchParams.value[key];
  }
  handleRefresh();
};

const handleFilterByField = (field, value) => {
  if (field === 'timeScale') {
    activeTimeScale.value = 'all';
    searchParams.value = { ...searchParams.value, [field]: value };
  } else {
    searchParams.value = { ...searchParams.value, [field]: value };
  }
  handleRefresh();
};

const handleFilterByPeriod = (startTime, endTime) => {
  searchParams.value = { ...searchParams.value, startTime, endTime };
  handleRefresh();
};

// ==================== 关键修复：将生成时间转换为时间戳 ====================
const handleFilterByCreateTime = (createTimeStr) => {
  // createTimeStr 格式如 "2024/4/1 00:00:00" 或 "2024-04-01 00:00:00"
  const dayStr = dayjs(createTimeStr).format('YYYY-MM-DD');
  const beginDateStr = `${dayStr} 00:00:00`;
  const endDateStr = `${dayStr} 23:59:59`;
  // 转换为时间戳（秒）
  const beginTimestamp = dateStringToTimestamp(beginDateStr);
  const endTimestamp = dateStringToTimestamp(endDateStr);
  searchParams.value = {
    ...searchParams.value,
    createTimeBegin: beginTimestamp,
    createTimeEnd: endTimestamp,
  };
  handleRefresh();
};
// ========================================================================

const showFilterCondition = (condition) => {
  try {
    const parsed = JSON.parse(condition);
    filterConditionText.value = JSON.stringify(parsed, null, 2);
  } catch {
    filterConditionText.value = condition || '无筛选条件';
  }
  ElMessage.info(filterConditionText.value);
};

const showAnalytics = (id) => {
  analyticsDialogRef.value.open(id);
};

const handleViewDetail = (row) => {
  detailDrawerRef.value.open(row.id);
};

// ==================== 导出与打印功能（模拟数据，保持不变） ====================
const handleExportList = async () => {
  const loading = ElLoading.service({ text: '正在生成导出文件...' });
  try {
    let exportData = filterMockData(mockReportList, searchParams.value, activeTimeScale.value);
    const wsData = [
      ['报表ID', '报表编号', '报表名称', '报表类型', '时间尺度', '统计周期', '生成时间', '流程状态', '操作人'],
    ];
    exportData.forEach(item => {
      wsData.push([
        item.id,
        item.reportCode,
        item.reportName,
        reportTypeMap[item.reportType] || item.reportType,
        timeScaleMap[item.timeScale] || item.timeScale,
        formatStatPeriod(item.startTime, item.endTime),
        formatTimestamp(item.createTime),
        reportStatusMap[item.reportStatus] || item.reportStatus,
        item.createUser,
      ]);
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, '报表列表');
    XLSX.writeFile(wb, `报表列表_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败', error);
    ElMessage.error('导出失败，请重试');
  } finally {
    loading.close();
  }
};

const handleExportSingle = async (row, type = 'Excel') => {
  const loading = ElLoading.service({ text: '正在生成报表文件...' });
  try {
    const detail = mockReportDetail;
    const statistics = detail.statistics || {};
    const wsData = [
      ['报表详情'],
      ['报表名称', row.reportName],
      ['报表编号', row.reportCode],
      ['报表类型', reportTypeMap[row.reportType]],
      ['时间尺度', timeScaleMap[row.timeScale]],
      ['统计周期', formatStatPeriod(row.startTime, row.endTime)],
      ['生成时间', formatTimestamp(row.createTime)],
      ['流程状态', reportStatusMap[row.reportStatus]],
      ['操作人', row.createUser],
      [],
      ['统计数据'],
      ['订单总量', statistics.totalOrderCount || 0],
      ['交易金额', statistics.totalTradeAmount ? `¥${(statistics.totalTradeAmount / 100).toFixed(2)}` : '-'],
      ['充电总量', `${statistics.totalChargeAmount || 0} kWh`],
      ['退款次数', statistics.refundCount || 0],
      ['异常订单数', statistics.abnormalOrderCount || 0],
      ['异常订单率', statistics.abnormalRate || '0%'],
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, '报表详情');
    XLSX.writeFile(wb, `${row.reportName || '报表'}_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出单条失败', error);
    ElMessage.error('导出失败，请重试');
  } finally {
    loading.close();
  }
};

const handlePrint = async (row) => {
  const loading = ElLoading.service({ text: '准备打印内容...' });
  try {
    const detail = mockReportDetail;
    const statistics = detail.statistics || {};
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${row.reportName} - 打印</title>
        <style>
          body { font-family: 'Microsoft YaHei', sans-serif; padding: 20px; }
          h1 { text-align: center; color: #333; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 18px; font-weight: bold; border-left: 4px solid #4A90E2; padding-left: 10px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .metric-grid { display: flex; flex-wrap: wrap; gap: 16px; }
          .metric-card { background: #f9f9f9; border-radius: 8px; padding: 12px; min-width: 150px; text-align: center; }
          .metric-value { font-size: 24px; font-weight: bold; color: #4A90E2; }
        </style>
      </head>
      <body>
        <h1>${row.reportName}</h1>
        <div class="section">
          <div class="section-title">基础信息</div>
          <table>
            <tr><th>报表ID</th><td>${row.id}</td><th>报表编号</th><td>${row.reportCode}</td></tr>
            <tr><th>报表类型</th><td>${reportTypeMap[row.reportType]}</td><th>时间尺度</th><td>${timeScaleMap[row.timeScale]}</td></tr>
            <tr><th>统计周期</th><td colspan="3">${formatStatPeriod(row.startTime, row.endTime)}</td></tr>
            <tr><th>生成时间</th><td>${formatTimestamp(row.createTime)}</td><th>流程状态</th><td>${reportStatusMap[row.reportStatus]}</td></tr>
          </table>
        </div>
        <div class="section">
          <div class="section-title">统计数据</div>
          <div class="metric-grid">
            <div class="metric-card"><div>订单总量</div><div class="metric-value">${statistics.totalOrderCount || 0}</div></div>
            <div class="metric-card"><div>交易金额</div><div class="metric-value">¥${statistics.totalTradeAmount ? (statistics.totalTradeAmount / 100).toFixed(2) : '0.00'}</div></div>
            <div class="metric-card"><div>充电总量</div><div class="metric-value">${statistics.totalChargeAmount || 0} kWh</div></div>
            <div class="metric-card"><div>退款次数</div><div class="metric-value">${statistics.refundCount || 0}</div></div>
            <div class="metric-card"><div>异常订单数</div><div class="metric-value">${statistics.abnormalOrderCount || 0}</div></div>
            <div class="metric-card"><div>异常订单率</div><div class="metric-value">${statistics.abnormalRate || '0%'}</div></div>
          </div>
        </div>
      </body>
      </html>
    `;
    const win = window.open();
    win.document.write(printContent);
    win.document.close();
    win.print();
  } catch (error) {
    console.error('打印失败', error);
    ElMessage.error('打印失败，请重试');
  } finally {
    loading.close();
  }
};
// ==============================================================

const handleRecreate = async (row) => {
  try {
    await recreateReport({ id: row.id });
    ElMessage.success('重新生成任务已提交');
    handleRefresh();
  } catch (error) {
    ElMessage.error('重新生成失败');
  }
};

const handleFullShow = () => {
  screenfull.toggle();
};

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel: () => drawerApi.close(),
});
const handleSearchShow = () => drawerApi.open();

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: (values) => {
    searchParams.value = values;
    drawerApi.close();
    handleRefresh();
  },
  layout: 'horizontal',
  schema: useQuerySchema(),
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

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

const handleArrowChange = () => {
  emit('arrow-change');
};

const handleRowCheckboxChange = ({ records }) => {
  checkedIds.value = records.map(item => item.id);
};

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

watch(activeTimeScale, () => {
  emit('refresh-chart');
});

const setFilter = (filter) => {
  if (filter && Object.keys(filter).length) {
    Object.assign(searchParams.value, filter);
    handleRefresh();
  }
};

const resetFilter = () => {
  searchParams.value = {};
  handleRefresh();
};

defineExpose({
  setFilter,
  resetFilter,
  handleRefresh,
  getSearchParams: () => convertSearchParams(searchParams.value),
});

onMounted(() => {
  handleRefresh();
});
</script>
