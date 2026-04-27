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
          <IconButton content="筛选" icon-name="search" @click="() => queryFormApi.openDrawer?.()" />
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
        <el-text @click="filterByStatTime(row.statTime)" style="cursor: pointer">
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

    <CreateDrawer>
      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="100px">
        <el-form-item label="统计类型" prop="statType" required>
          <el-select v-model="createForm.statType" placeholder="请选择统计类型">
            <el-option label="日报" value="日报" />
            <el-option label="周报" value="周报" />
            <el-option label="月报" value="月报" />
            <el-option label="季报" value="季报" />
            <el-option label="半年报" value="半年报" />
            <el-option label="年报" value="年报" />
            <el-option label="自定义" value="自定义" />
          </el-select>
        </el-form-item>
        <el-form-item label="统计开始时间" prop="statStartTime" required>
          <el-date-picker v-model="createForm.statStartTime" type="datetime" placeholder="选择开始时间" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="统计结束时间" prop="statEndTime" required>
          <el-date-picker v-model="createForm.statEndTime" type="datetime" placeholder="选择结束时间" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
      </el-form>
    </CreateDrawer>

    <CycleReportDetailDrawer ref="detailDrawerRef" :detail-data="currentDetail" />

    <CompareDrawer :title="compareTitle">
      <div v-if="compareData" class="compare-chart-container">
        <div class="compare-period">
          <el-tag type="info">当前周期：{{ compareData.current?.statWindow || '-' }}</el-tag>
          <el-tag type="info" style="margin-left: 12px">对比周期：{{ compareData.previous?.statWindow || '-' }}</el-tag>
        </div>
        <div class="chart-title">比率指标对比 (%)</div>
        <div ref="rateChartRef" class="compare-chart"></div>
        <div class="chart-title" style="margin-top: 24px">总量指标对比</div>
        <div ref="totalChartRef" class="compare-chart"></div>
      </div>
      <el-empty v-else description="暂无数据" />
    </CompareDrawer>

    <DimensionDetailDrawer ref="dimensionDrawerRef" />

    <el-dialog v-model="operatorDialogVisible" title="操作人详情" width="400px">
      <p>用户ID：{{ currentOperator.id }}</p>
      <p>用户名称：{{ currentOperator.name }}</p>
    </el-dialog>

    <QueryForm.Drawer title="筛选" />
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
  getDimensionDetail,
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
const operatorDialogVisible = ref(false);
const currentOperator = ref({ id: '', name: '' });

const rateChartRef = ref(null);
const totalChartRef = ref(null);
let rateChart = null;
let totalChart = null;

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
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

async function onSubmit(values) {
  dataObj.searchObj = { ...values };
  dataObj.currentPage = 1;
  gridApi.query();
}

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

const handleClearField = async (fieldName) => {
  if (fieldName === 'statTime') {
    delete dataObj.searchObj.statStartTime;
    delete dataObj.searchObj.statEndTime;
    await queryFormApi.setValues({ statStartTime: null, statEndTime: null }, false);
  } else {
    delete dataObj.searchObj[fieldName];
    await queryFormApi.setValues({ [fieldName]: null }, false);
  }
  dataObj.currentPage = 1;
  gridApi.query();
};

const filterByField = (field, value) => {
  dataObj.searchObj = { ...dataObj.searchObj, [field]: value };
  dataObj.currentPage = 1;
  gridApi.query();
};

const filterByStatTime = (statTime) => {
  const match = statTime.match(/^(\d{4})-(\d{2})$/);
  if (match) {
    const year = match[1];
    const month = match[2];
    const start = `${year}-${month}-01 00:00:00`;
    const end = `${year}-${month}-${new Date(year, month, 0).getDate()} 23:59:59`;
    dataObj.searchObj = { ...dataObj.searchObj, statStartTime: start, statEndTime: end };
    delete dataObj.searchObj.statTime;
  } else {
    ElMessage.warning('该统计时段格式暂不支持筛选');
    return;
  }
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
  showSearchForm: false,
});

const handleRefresh = () => gridApi.query();

const createForm = reactive({ statType: '', statStartTime: '', statEndTime: '' });
const createFormRef = ref(null);
const createRules = {
  statType: [{ required: true, message: '请选择统计类型', trigger: 'change' }],
  statStartTime: [{ required: true, message: '请选择统计开始时间', trigger: 'change' }],
  statEndTime: [
    { required: true, message: '请选择统计结束时间', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (createForm.statStartTime && value && new Date(value) <= new Date(createForm.statStartTime)) {
          callback(new Error('结束时间必须晚于开始时间'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
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
  await ElMessageBox.confirm('确认导出当前列表数据吗？', '提示', { type: 'info' });
  const params = { ...dataObj.searchObj, pageNo: 1, pageSize: 10000 };
  const blob = await exportCycleReport(params);
  downloadFileFromBlobPart({ fileName: '周期报表列表.xlsx', source: blob });
  ElMessage.success('导出成功');
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
  const currentRateData = rateMetrics.map(m => current[m.key] ?? 0);
  const previousRateData = rateMetrics.map(m => previous[m.key] ?? 0);

  const totalCategories = totalMetrics.map(m => m.name);
  const currentTotalData = totalMetrics.map(m => current[m.key] ?? 0);
  const previousTotalData = totalMetrics.map(m => previous[m.key] ?? 0);

  if (rateChartRef.value) {
    if (rateChart) rateChart.dispose();
    rateChart = echarts.init(rateChartRef.value);
    rateChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['当前周期', '对比周期'] },
      xAxis: { type: 'category', data: rateCategories, axisLabel: { rotate: 30 } },
      yAxis: { type: 'value', name: '百分比 (%)' },
      series: [
        { name: '当前周期', type: 'bar', data: currentRateData, itemStyle: { color: '#409EFF', borderRadius: [4,4,0,0] } },
        { name: '对比周期', type: 'bar', data: previousRateData, itemStyle: { color: '#E6A23C', borderRadius: [4,4,0,0] } },
      ],
    });
  }

  if (totalChartRef.value) {
    if (totalChart) totalChart.dispose();
    totalChart = echarts.init(totalChartRef.value);
    totalChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['当前周期', '对比周期'] },
      xAxis: { type: 'category', data: totalCategories, axisLabel: { rotate: 30 } },
      yAxis: { type: 'value', name: '数量' },
      series: [
        { name: '当前周期', type: 'bar', data: currentTotalData, itemStyle: { color: '#409EFF', borderRadius: [4,4,0,0] } },
        { name: '对比周期', type: 'bar', data: previousTotalData, itemStyle: { color: '#E6A23C', borderRadius: [4,4,0,0] } },
      ],
    });
  }
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
const dimensionTitleMap = {
  rescue: '救援明细',
  reserve: '预约明细',
  complaint: '投诉明细',
  findCar: '寻车明细',
  spacePush: '空位推送明细',
  wording: '话术明细',
};
const openDimensionDetail = async (reportId, dimension) => {
  const res = await getDimensionDetail({ id: reportId, dimension, pageNo: 1, pageSize: 100 });
  dimensionDrawerRef.value.open({
    title: dimensionTitleMap[dimension] || `${dimension}明细`,
    data: res.list || [],
    total: res.total,
  });
};

const showOperatorDetail = async (userId, userName) => {
  if (!userId) {
    ElMessage.warning('无操作人信息');
    return;
  }
  try {
    const userInfo = await getUserInfo(userId);
    currentOperator.value = { id: userId, name: userInfo.nickname || userName };
  } catch {
    currentOperator.value = { id: userId, name: userName || userId };
  }
  operatorDialogVisible.value = true;
};

const handleChartDrill = async (event) => {
  const filters = event.detail;
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
  padding: 16px;
}
.compare-period {
  margin-bottom: 20px;
  text-align: center;
}
.chart-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #303133;
}
.compare-chart {
  width: 100%;
  height: 350px;
}
</style>
