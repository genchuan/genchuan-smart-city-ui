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
          <IconButton content="生成" icon-name="Plus" @click="openCreateDrawer" />
          <IconButton content="筛选" icon-name="search" @click="openSearchDrawer" />
          <IconButton content="导出" icon-name="download" @click="handleExportList" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="刷新" icon-name="refresh" @click="handleRefresh" />
        </div>
      </template>

      <template #reportCycle="{ row }">
        <el-text @click="filterByField('reportCycle', row.reportCycle)" type="primary" style="cursor: pointer">
          {{ row.reportCycle }}
        </el-text>
      </template>
      <template #statTime="{ row }">
        <el-text @click="filterByStatTime(row)" type="primary" style="cursor: pointer">
          {{ row.statTime }}
        </el-text>
      </template>
      <template #rescueCompleteRate="{ row }">
        <el-text @click="openDimensionDetail(row.id, 'rescue')" type="primary">{{ row.rescueCompleteRate }}%</el-text>
      </template>
      <template #reserveSuccessRate="{ row }">
        <el-text @click="openDimensionDetail(row.id, 'reserve')" type="primary">{{ row.reserveSuccessRate }}%</el-text>
      </template>
      <template #complaintHandleRate="{ row }">
        <el-text @click="openDimensionDetail(row.id, 'complaint')" type="primary">{{ row.complaintHandleRate }}%</el-text>
      </template>
      <template #findCarSuccessRate="{ row }">
        <el-text @click="openDimensionDetail(row.id, 'findCar')" type="primary">{{ row.findCarSuccessRate }}%</el-text>
      </template>
      <template #spacePushSuccessRate="{ row }">
        <el-text @click="openDimensionDetail(row.id, 'spacePush')" type="primary">{{ row.spacePushSuccessRate }}%</el-text>
      </template>
      <template #effectiveWordingCount="{ row }">
        <el-text @click="openDimensionDetail(row.id, 'wording')" type="primary">{{ row.effectiveWordingCount }}</el-text>
      </template>
      <template #generateStatus="{ row }">
        <el-tag @click="filterByField('generateStatus', row.generateStatus)" style="cursor: pointer">
          {{ row.generateStatus }}
        </el-tag>
      </template>
      <template #yearOnYearGrowthRate="{ row }">
        <el-text @click="handleCompare(row.id, 'yoy')" type="primary">{{ row.yearOnYearGrowthRate }}%</el-text>
      </template>
      <template #monthOnMonthGrowthRate="{ row }">
        <el-text @click="handleCompare(row.id, 'mom')" type="primary">{{ row.monthOnMonthGrowthRate }}%</el-text>
      </template>
      <template #operator="{ row }">
        <el-text @click="showOperatorDetail(row.operatorUserId, row.operator)" type="primary">
          {{ row.operator }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleViewDetail(row)" />
          <IconButton content="导出" icon-name="download" @click="handleRowExport(row.id)" />
        </div>
      </template>
    </Grid>

    <!-- 生成报表抽屉 -->
    <CreateDrawer>
      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="100px">
        <el-form-item label="统计类型" prop="statType" required>
          <el-select v-model="createForm.statType" placeholder="请选择统计类型" @change="onStatTypeChange">
            <el-option label="日报" value="日报" />
            <el-option label="周报" value="周报" />
            <el-option label="月报" value="月报" />
            <el-option label="季报" value="季报" />
            <el-option label="半年报" value="半年报" />
            <el-option label="年报" value="年报" />
            <el-option label="自定义" value="自定义" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="createForm.statType && createForm.statType !== '自定义'" label="统计区间">
          <el-text type="info">{{ createForm.statStartTime }} 至 {{ createForm.statEndTime }}</el-text>
        </el-form-item>
        <template v-if="createForm.statType === '自定义'">
          <el-form-item label="统计开始时间" prop="statStartTime" required>
            <el-date-picker v-model="createForm.statStartTime" type="datetime" placeholder="选择开始时间" value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
          <el-form-item label="统计结束时间" prop="statEndTime" required>
            <el-date-picker v-model="createForm.statEndTime" type="datetime" placeholder="选择结束时间" value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
        </template>
      </el-form>
    </CreateDrawer>

    <!-- 报表详情抽屉 -->
    <CycleReportDetailDrawer ref="detailDrawerRef" :detail-data="currentDetail" />

    <!-- 同比/环比分析抽屉（优化后：两行居中对齐） -->
    <CompareDrawer :title="compareTitle" @open="onCompareDrawerOpen">
      <div v-if="compareData" class="compare-chart-container">
        <div class="compare-period">
          <div class="period-item">
            <el-tag type="info" effect="plain">当前周期：{{ compareData.current?.statWindow || '-' }}</el-tag>
          </div>
          <div class="period-item">
            <el-tag type="info" effect="plain">对比周期：{{ compareData.previous?.statWindow || '-' }}</el-tag>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <span>📊 比率指标对比</span>
            <span class="unit">(%)</span>
          </div>
          <div ref="rateChartRef" class="compare-chart"></div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <span>📈 总量指标对比</span>
          </div>
          <div ref="totalChartRef" class="compare-chart"></div>
        </div>
      </div>
      <el-empty v-else description="暂无数据" />
    </CompareDrawer>

    <!-- 操作人详情抽屉（复用报表详情卡片样式） -->
    <OperatorDrawer :title="operatorDrawerTitle" @open="onOperatorDrawerOpen">
      <div class="detail-container" style="padding:0;">
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

    <!-- 筛选抽屉（仿救援服务，统计时间复用 padDateTime 逻辑） -->
    <SearchDrawer title="筛选">
      <QueryForm class="search-form" />
    </SearchDrawer>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useVbenDrawer, useVbenForm } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import { downloadFileFromBlobPart } from '@vben/utils';
import * as echarts from 'echarts';
import {
  getCycleReportPage,
  createCycleReport,
  getCycleReportDetail,
  exportCycleReport,
  compareYoy,
  compareMom,
  rowExportCycleReport,
  getUserInfo,
} from '#/api/genchuan/industry/chargePark/carService/serviceReport/cycleReport/index.js';
import { useFormSchema, useGridColumns } from './data';
import CycleReportDetailDrawer from './detail.vue';

const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);
const arrowChange = () => emit('arrow-change');

const dataObj = reactive({
  total: 0,
  list: [],
  searchObj: {},
  currentPage: 1,
  pageSize: 10,
});

const currentDetail = ref(null);
const compareData = ref(null);
const compareTitle = ref('增长率分析');

// 操作人相关
const operatorDrawerTitle = ref('操作人详情');
const currentOperator = ref({ id: '', username: '', name: '' });

const rateChartRef = ref(null);
const totalChartRef = ref(null);
let rateChart = null;
let totalChart = null;

// ========== 日期时间补全函数（复用列表筛选逻辑） ==========
const padDateTime = (s, isEnd) => {
  if (!s) return s;
  const v = String(s).trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(v)) return v;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(v)) return `${v}:${isEnd ? '59' : '00'}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return `${v} ${isEnd ? '23:59:59' : '00:00:00'}`;
  return v;
};

// ========== 筛选表单抽屉（使用 useVbenForm） ==========
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
    }
  },
});

// 筛选抽屉（独立抽屉，仿救援服务）
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

// 提交筛选：复用 padDateTime 处理统计时间，与列表中的统计时段筛选逻辑一致
async function onSubmit(values) {
  let startTime = values.statStartTime;
  let endTime = values.statEndTime;
  if (startTime) {
    startTime = padDateTime(startTime, false);
  }
  if (endTime) {
    endTime = padDateTime(endTime, true);
  }
  const processedValues = {
    ...values,
    statStartTime: startTime,
    statEndTime: endTime,
  };
  dataObj.searchObj = { ...processedValues };
  dataObj.currentPage = 1;
  gridApi.query();
  searchDrawerApi.close();
}
// ========== 筛选表单结束 ==========

// 获取已选筛选条件标签
const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchObj;
  if (obj.reportCycle) filters.push({ label: `报表周期：${obj.reportCycle}`, field: 'reportCycle' });
  if (obj.statStartTime || obj.statEndTime) {
    const start = obj.statStartTime || '';
    const end = obj.statEndTime || '';
    filters.push({ label: `统计时段：${start} 至 ${end}`, field: 'statTime' });
  }
  if (obj.generateStatus) filters.push({ label: `生成状态：${obj.generateStatus}`, field: 'generateStatus' });
  return filters;
});

const handleClearField = (fieldName) => {
  const next = { ...dataObj.searchObj };
  const formPatch = {};
  if (fieldName === 'statTime') {
    delete next.statStartTime;
    delete next.statEndTime;
    formPatch.statStartTime = null;
    formPatch.statEndTime = null;
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

const filterByStatTime = (row) => {
  let start = row?.statStartTime;
  let end = row?.statEndTime;
  if (!start || !end) {
    const s = String(row?.statTime || '').trim();
    if (!s) return ElMessage.warning('该统计时段为空，无法筛选');
    const parts = s.split(/\s*(?:至|~|—|-{2,})\s*/);
    if (parts.length === 2) {
      [start, end] = parts;
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      start = s;
      end = s;
    } else {
      const m = s.match(/^(\d{4})-(\d{2})$/);
      if (m) {
        const y = m[1];
        const mo = m[2];
        start = `${y}-${mo}-01`;
        end = `${y}-${mo}-${new Date(+y, +mo, 0).getDate()}`;
      }
    }
  }
  if (!start || !end) return ElMessage.warning('该统计时段格式暂不支持筛选');
  start = padDateTime(start, false);
  end = padDateTime(end, true);
  dataObj.searchObj = { ...dataObj.searchObj, statStartTime: start, statEndTime: end };
  delete dataObj.searchObj.statTime;
  dataObj.currentPage = 1;
  gridApi.query();
};

const getTableData = async (pageObj) => {
  const params = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.searchObj,
  };
  const res = await getCycleReportPage(params);
  dataObj.total = res.total;
  dataObj.list = (res.list || []).map(v => ({
    ...v,
    createTime: formatTimestamp(v.createTime),
    updateTime: formatTimestamp(v.updateTime),
    generateTime: formatTimestamp(v.generateTime),
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
    proxyConfig: { ajax: { query: async ({ page }) => getTableData({ page }) } },
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

const createForm = reactive({ statType: '', statStartTime: '', statEndTime: '' });
const createFormRef = ref(null);
const createRules = {
  statType: [{ required: true, message: '请选择统计类型', trigger: 'change' }],
  statStartTime: [
    {
      validator: (rule, value, callback) => {
        if (createForm.statType === '自定义' && !value) {
          callback(new Error('请选择统计开始时间'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  statEndTime: [
    {
      validator: (rule, value, callback) => {
        if (createForm.statType === '自定义') {
          if (!value) return callback(new Error('请选择统计结束时间'));
          if (createForm.statStartTime && new Date(value) <= new Date(createForm.statStartTime)) {
            return callback(new Error('结束时间必须晚于开始时间'));
          }
        }
        callback();
      },
      trigger: 'change'
    }
  ],
};

const fmt = (d) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
const computeRange = (type) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  let start, end;
  switch (type) {
    case '日报':
      start = new Date(y, m, d, 0, 0, 0);
      end = new Date(y, m, d, 23, 59, 59);
      break;
    case '周报': {
      const day = now.getDay() || 7;
      start = new Date(y, m, d - day + 1, 0, 0, 0);
      end = new Date(y, m, d - day + 7, 23, 59, 59);
      break;
    }
    case '月报':
      start = new Date(y, m, 1, 0, 0, 0);
      end = new Date(y, m + 1, 0, 23, 59, 59);
      break;
    case '季报': {
      const qStart = Math.floor(m / 3) * 3;
      start = new Date(y, qStart, 1, 0, 0, 0);
      end = new Date(y, qStart + 3, 0, 23, 59, 59);
      break;
    }
    case '半年报': {
      const hStart = m < 6 ? 0 : 6;
      start = new Date(y, hStart, 1, 0, 0, 0);
      end = new Date(y, hStart + 6, 0, 23, 59, 59);
      break;
    }
    case '年报':
      start = new Date(y, 0, 1, 0, 0, 0);
      end = new Date(y, 11, 31, 23, 59, 59);
      break;
    default:
      return { start: '', end: '' };
  }
  return { start: fmt(start), end: fmt(end) };
};
const onStatTypeChange = (type) => {
  if (type === '自定义') {
    createForm.statStartTime = '';
    createForm.statEndTime = '';
  } else {
    const { start, end } = computeRange(type);
    createForm.statStartTime = start;
    createForm.statEndTime = end;
  }
};
const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 550, title: '生成周期报表',
  onConfirm: async () => {
    try {
      await createFormRef.value.validate();
      await createCycleReport(createForm);
      ElMessage.success('报表生成成功');
      createDrawerApi.close();
      handleRefresh();
    } catch (error) {
      if (error !== 'cancel') ElMessage.error('生成失败，请检查输入');
    }
  },
});
const openCreateDrawer = () => {
  createForm.statType = '';
  createForm.statStartTime = '';
  createForm.statEndTime = '';
  createDrawerApi.open();
};

const handleExportList = async () => {
  if (checkedRows.value.length > 0) {
    await ElMessageBox.confirm(`确认导出选中的 ${checkedRows.value.length} 条数据吗？`, '提示', { type: 'info' });
    await exportRowsAsXlsx(checkedRows.value);
    ElMessage.success('导出成功');
    return;
  }
  await ElMessageBox.confirm('确认导出当前列表数据吗？', '提示', { type: 'info' });
  const params = { ...dataObj.searchObj, pageNo: 1, pageSize: 10000 };
  const blob = await exportCycleReport(params);
  downloadFileFromBlobPart({ fileName: '周期报表列表.xlsx', source: blob });
  ElMessage.success('导出成功');
};

const exportRowsAsXlsx = async (rows) => {
  const XLSX = await import('xlsx');
  const cols = [
    { field: 'reportCycle', title: '报表周期' },
    { field: 'statTime', title: '统计时段' },
    { field: 'rescueCompleteRate', title: '救援完成率(%)' },
    { field: 'reserveSuccessRate', title: '预约成功率(%)' },
    { field: 'complaintHandleRate', title: '投诉处理率(%)' },
    { field: 'findCarSuccessRate', title: '寻车定位成功率(%)' },
    { field: 'spacePushSuccessRate', title: '空位推送成功率(%)' },
    { field: 'effectiveWordingCount', title: '生效话术数' },
    { field: 'rescueTotal', title: '救援总量' },
    { field: 'reserveTotal', title: '预约总量' },
    { field: 'complaintTotal', title: '投诉总量' },
    { field: 'spacePushTotal', title: '空位推送总量' },
    { field: 'generateStatus', title: '生成状态' },
    { field: 'generateTime', title: '报表生成时间' },
    { field: 'operator', title: '操作人' },
    { field: 'yearOnYearGrowthRate', title: '同比增长率(%)' },
    { field: 'monthOnMonthGrowthRate', title: '环比增长率(%)' },
    { field: 'serviceStatusRatio', title: '服务状态占比' },
  ];
  const data = rows.map(r => {
    const o = {};
    cols.forEach(c => { o[c.title] = r[c.field] ?? ''; });
    return o;
  });
  const ws = XLSX.utils.json_to_sheet(data, { header: cols.map(c => c.title) });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '周期报表');
  const cycles = [...new Set(rows.map(r => r.reportCycle).filter(Boolean))];
  const prefix = cycles.length === 1 ? cycles[0] : `周期报表_多类型`;
  const ts = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
  XLSX.writeFile(wb, `${prefix}_${rows.length}条_${ts}.xlsx`);
};

const handleRowExport = async (id) => {
  try {
    await ElMessageBox.confirm('确认导出该报表的完整明细数据吗？', '提示', { type: 'info' });
    const blob = await rowExportCycleReport(id);
    downloadFileFromBlobPart({ fileName: `周期报表_${id}.xlsx`, source: blob });
    ElMessage.success('导出成功');
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error('导出失败');
  }
};

const detailDrawerRef = ref(null);
const handleViewDetail = async (row) => {
  const res = await getCycleReportDetail({ id: row.id });
  currentDetail.value = res;
  detailDrawerRef.value.open();
};

const [CompareDrawer, compareDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 800, title: compareTitle,
  onCancel: () => compareDrawerApi.close(),
});

const onCompareDrawerOpen = () => {
  nextTick(() => {
    rateChart?.resize();
    totalChart?.resize();
  });
};

const renderCompareCharts = () => {
  if (!compareData.value) return;
  const { current, previous } = compareData.value;
  if (!current || !previous) return;

  const rateMetrics = [
    { key: 'rescueCompleteRate', name: '救援完成率' },
    { key: 'reserveSuccessRate', name: '预约成功率' },
    { key: 'complaintHandleRate', name: '投诉处理率' },
    { key: 'findCarSuccessRate', name: '寻车定位成功率' },
    { key: 'spacePushSuccessRate', name: '空位推送成功率' },
  ];
  const totalMetrics = [
    { key: 'rescueTotal', name: '救援总量' },
    { key: 'reserveTotal', name: '预约总量' },
    { key: 'complaintTotal', name: '投诉总量' },
    { key: 'spacePushTotal', name: '空位推送总量' },
  ];

  const rateCategories = rateMetrics.map(m => m.name);
  const currentRateData = rateMetrics.map(m => Number(current[m.key]) || 0);
  const previousRateData = rateMetrics.map(m => Number(previous[m.key]) || 0);

  const totalCategories = totalMetrics.map(m => m.name);
  const currentTotalData = totalMetrics.map(m => Number(current[m.key]) || 0);
  const previousTotalData = totalMetrics.map(m => Number(previous[m.key]) || 0);

  if (rateChartRef.value) {
    if (rateChart) rateChart.dispose();
    rateChart = echarts.init(rateChartRef.value);
    rateChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}<br/>当前周期: {c0}%<br/>对比周期: {c1}%' },
      legend: { data: ['当前周期', '对比周期'], type: 'scroll', top: 0 },
      grid: { top: 50, bottom: 50, left: 60, right: 30, containLabel: true },
      xAxis: {
        type: 'category',
        data: rateCategories,
        axisLabel: { rotate: 30, margin: 10, interval: 0, fontSize: 11 },
        axisLine: { lineStyle: { color: '#aaa' } }
      },
      yAxis: { type: 'value', name: '百分比 (%)', nameLocation: 'middle', nameGap: 45 },
      series: [
        { name: '当前周期', type: 'bar', data: currentRateData, itemStyle: { color: '#409EFF', borderRadius: [4,4,0,0] }, label: { show: true, position: 'top', formatter: '{c}%' } },
        { name: '对比周期', type: 'bar', data: previousRateData, itemStyle: { color: '#E6A23C', borderRadius: [4,4,0,0] }, label: { show: true, position: 'top', formatter: '{c}%' } },
      ],
    });
  }

  if (totalChartRef.value) {
    if (totalChart) totalChart.dispose();
    totalChart = echarts.init(totalChartRef.value);
    totalChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          let str = params[0].axisValue + '<br/>';
          params.forEach(p => {
            str += `${p.marker}${p.seriesName}: ${p.value.toLocaleString()}<br/>`;
          });
          return str;
        }
      },
      legend: { data: ['当前周期', '对比周期'], type: 'scroll', top: 0 },
      grid: { top: 50, bottom: 50, left: 70, right: 30, containLabel: true },
      xAxis: {
        type: 'category',
        data: totalCategories,
        axisLabel: { rotate: 30, margin: 10, interval: 0, fontSize: 11 },
        axisLine: { lineStyle: { color: '#aaa' } }
      },
      yAxis: { type: 'value', name: '数量', nameLocation: 'middle', nameGap: 55, axisLabel: { formatter: (val) => val.toLocaleString() } },
      series: [
        { name: '当前周期', type: 'bar', data: currentTotalData, itemStyle: { color: '#409EFF', borderRadius: [4,4,0,0] }, label: { show: true, position: 'top', formatter: (p) => p.value.toLocaleString() } },
        { name: '对比周期', type: 'bar', data: previousTotalData, itemStyle: { color: '#E6A23C', borderRadius: [4,4,0,0] }, label: { show: true, position: 'top', formatter: (p) => p.value.toLocaleString() } },
      ],
    });
  }

  nextTick(() => {
    rateChart?.resize();
    totalChart?.resize();
  });
};

watch(compareData, () => {
  nextTick(() => renderCompareCharts());
});

const handleCompare = async (id, type) => {
  const res = type === 'yoy' ? await compareYoy({ id }) : await compareMom({ id });
  compareData.value = res;
  compareTitle.value = type === 'yoy' ? '同比增长率分析' : '环比增长率分析';
  compareDrawerApi.open();
};

const dimensionDrawerRef = ref(null);
const openDimensionDetail = async (reportId, dimension) => {
  const res = await getCycleReportDetail({ id: reportId });
  currentDetail.value = res;
  detailDrawerRef.value?.open(dimension);
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

const onOperatorDrawerOpen = () => {};

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

const handleChartDrill = async (event) => {
  const filters = event.detail || {};
  if (filters.dimension) {
    if (!dataObj.list || dataObj.list.length === 0) {
      ElMessage.warning('暂无可下钻的报表，请先生成');
      return;
    }
    const latestReport = dataObj.list[0];
    const res = await getCycleReportDetail({ id: latestReport.id });
    currentDetail.value = res || latestReport;
    detailDrawerRef.value?.open(filters.dimension, filters.type);
    return;
  }
  if (filters.location) {
    ElMessage.info(`地图钻取：位置 ${filters.location}`);
  }
};

onMounted(() => {
  window.addEventListener('cycle-report-chart-refresh', handleChartDrill);
});
onUnmounted(() => {
  window.removeEventListener('cycle-report-chart-refresh', handleChartDrill);
  if (rateChart) rateChart.dispose();
  if (totalChart) totalChart.dispose();
});
</script>

<style scoped>
.compare-chart-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 500px;
}

.compare-period {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.period-item {
  display: flex;
  justify-content: center;
  width: 100%;
}

.period-item .el-tag {
  width: auto;
  max-width: 90%;
  justify-content: center;
  white-space: normal;
  word-break: break-all;
  line-height: 1.4;
  padding: 8px 12px;
  font-size: 13px;
  text-align: center;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;
}

.chart-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.chart-header {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid #409EFF;
}

.chart-header .unit {
  font-size: 12px;
  font-weight: normal;
  color: #909399;
  margin-left: 6px;
}

.compare-chart {
  width: 100%;
  min-height: 360px;
  height: auto;
}

@media (max-width: 768px) {
  .compare-chart {
    min-height: 260px;
  }
}

/* 以下样式复用报表详情（detail.vue）中的卡片样式，用于操作人详情 */
.detail-container {
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
}
.detail-card {
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 0 16px;
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
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  word-break: break-all;
}

/* 筛选抽屉内表单间距 */
.search-form {
  padding: 16px;
}
</style>
