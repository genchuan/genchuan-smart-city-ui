<script setup>
import { computed, reactive, shallowRef, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportInspectOpReport,
  getInspectOpReportDetail,
  getInspectOpReportPage,
} from '#/api/genchuan/industry/chargePark/inspectOp/decisionAnalysis/inspectOpReport';

import ReportDetailDrawer from '../components/ReportDetailDrawer.vue';
import {
  filterMockList,
  formatRate,
  getReportStatusTagType,
  getReportTypeTagType,
  metricOptions,
  normalizeInspectOpReportRow,
  textObj,
  useGridColumns,
  useSearchFormSchema,
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  chartFilter: { type: Object, default: null },
});
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});
const detailDrawerRef = shallowRef(null);
const checkedIds = shallowRef([]);
const checkedRows = shallowRef([]);
const filterReportType = shallowRef('');
const filterTimeScale = shallowRef('');
const filterReportStatus = shallowRef('');
const filterTrendTime = shallowRef('');
const filterTaskType = shallowRef('');
const filterMetric = shallowRef('');
const dataObj = reactive({
  totalShow: false,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
  useStaticData: false,
});
const currentPageStats = computed(() => ({
  generatedCount: dataObj.list.filter((item) => item.reportStatus === '已生成')
    .length,
  generatingCount: dataObj.list.filter((item) => item.reportStatus === '生成中')
    .length,
  failedCount: dataObj.list.filter((item) => item.reportStatus === '生成失败')
    .length,
}));
function getMetricLabel(metricKey) {
  return (
    metricOptions.find((item) => item.key === metricKey)?.label || metricKey
  );
}
function buildQueryParams(page) {
  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    reportType: filterReportType.value || dataObj.searchParams.reportType,
    timeScale: filterTimeScale.value || dataObj.searchParams.timeScale,
    reportStatus: filterReportStatus.value || dataObj.searchParams.reportStatus,
    trendTime: filterTrendTime.value,
    taskType: filterTaskType.value,
    metricKey: filterMetric.value,
  };
}
function getPagedMockData(params, page) {
  const filteredList = filterMockList(params);
  dataObj.useStaticData = true;
  dataObj.total = filteredList.length;
  dataObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize,
  );
}
async function getTableData({ page }) {
  dataObj.currentPage = page.currentPage;
  dataObj.pageSize = page.pageSize;
  const queryParams = buildQueryParams(page);
  try {
    const response = await getInspectOpReportPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];
    // if (list.length === 0 && !pageResult?.total)
    //   throw new Error('接口返回数据为空');
    dataObj.useStaticData = false;
    dataObj.total = pageResult.total || 0;
    dataObj.list = list.map((item) => normalizeInspectOpReportRow(item));
  } catch (error) {
    console.error('获取运维运营报表数据失败，使用静态数据:', error);
    getPagedMockData(queryParams, page);
  }
  return dataObj;
}
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useSearchFormSchema().map((item) => {
    delete item.rules;
    return { ...item };
  }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});
function handleRowCheckboxChange({ records }) {
  checkedRows.value = records;
  checkedIds.value = records.map((item) => item.id);
}
function handleRefresh() {
  gridApi.query();
}
async function handleExport(params = {}) {
  try {
    const data = await exportInspectOpReport({
      ...buildQueryParams(dataObj),
      ids: checkedIds.value,
      ...params,
    });
    downloadFileFromBlobPart({ fileName: textObj.excelAllName, source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}
function handleExportList() {
  handleExport();
}
function handleExportRow(row) {
  handleExport({ id: row.id });
}
function onSubmit(values) {
  dataObj.searchParams = { ...values };
  filterReportType.value = '';
  filterTimeScale.value = '';
  filterReportStatus.value = '';
  filterTrendTime.value = '';
  handleRefresh();
  drawerApi.close();
}
async function handleOpenDetail(row) {
  try {
    const response = await getInspectOpReportDetail(row.id);
    const detail =
      response?.id || response?.reportData
        ? response
        : response?.data || response;
    detailDrawerRef.value?.open(
      normalizeInspectOpReportRow({ ...row, ...detail }),
    );
  } catch (error) {
    console.error(error);
    detailDrawerRef.value?.open(row);
  }
}
function handleReportTypeClick(value) {
  filterReportType.value = filterReportType.value === value ? '' : value;
  gridApi.query();
}
function handleTimeScaleClick(value) {
  filterTimeScale.value = filterTimeScale.value === value ? '' : value;
  gridApi.query();
}
function handleStatusClick(value) {
  filterReportStatus.value = filterReportStatus.value === value ? '' : value;
  gridApi.query();
}
function handleSearchShow() {
  drawerApi.open();
}
function handleFullShow() {
  screenfull.toggle();
}
function changeTotalShow() {
  dataObj.totalShow = !dataObj.totalShow;
}
function showCondition(row) {
  ElMessage.info(row.filterCondition || '-');
}
function showAnalysis(row) {
  ElMessage.info(row.analysisSummary || '-');
}
function cancelFilter(type) {
  const clearMap = {
    reportType: () => {
      filterReportType.value = '';
    },
    timeScale: () => {
      filterTimeScale.value = '';
    },
    reportStatus: () => {
      filterReportStatus.value = '';
    },
    trendTime: () => {
      filterTrendTime.value = '';
    },
    taskType: () => {
      filterTaskType.value = '';
    },
    metric: () => {
      filterMetric.value = '';
    },
  };
  clearMap[type]?.();
  gridApi.query();
}
watch(
  () => props.chartFilter,
  (filter) => {
    if (!filter) return;
    if (filter.type === 'trendTime') filterTrendTime.value = filter.value;
    if (filter.type === 'taskType') filterTaskType.value = filter.value;
    if (filter.type === 'metric') filterMetric.value = filter.value;
    gridApi.query();
  },
  { deep: true },
);
</script>

<template>
  <div class="park-lot-table-new">
    <ReportDetailDrawer ref="detailDrawerRef" @export="handleExportRow" />
    <Drawer title="搜索"><QueryForm class="query-form" /></Drawer>
    <Grid>
      <template #table-title>
        <div class="inspect-report-filter-tags">
          <ElTag
            v-if="filterReportType"
            closable
            type="primary"
            @close="cancelFilter('reportType')"
          >
            报表类型?{{ filterReportType }}
          </ElTag>
          <ElTag
            v-if="filterTimeScale"
            closable
            type="success"
            @close="cancelFilter('timeScale')"
          >
            时间尺度?{{ filterTimeScale }}
          </ElTag>
          <ElTag
            v-if="filterReportStatus"
            closable
            type="warning"
            @close="cancelFilter('reportStatus')"
          >
            报表状态?{{ filterReportStatus }}
          </ElTag>
          <ElTag
            v-if="filterTrendTime"
            closable
            type="danger"
            @close="cancelFilter('trendTime')"
          >
            趋势时间?{{ filterTrendTime }}
          </ElTag>
          <ElTag
            v-if="filterTaskType"
            closable
            type="info"
            @close="cancelFilter('taskType')"
          >
            任务类型?{{ filterTaskType }}
          </ElTag>
          <ElTag
            v-if="filterMetric"
            closable
            type="success"
            @close="cancelFilter('metric')"
          >
            指标?{{ getMetricLabel(filterMetric) }}
          </ElTag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExportList"
          /><IconButton
            content="搜索"
            icon-name="search"
            @click="handleSearchShow"
          /><IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #reportType="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getReportTypeTagType(row.reportType)"
          @click="handleReportTypeClick(row.reportType)"
        >
          {{ row.reportType }}
        </ElTag>
      </template>
      <template #timeScale="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleTimeScaleClick(row.timeScale)"
        >
          {{ row.timeScale }}
        </el-text>
      </template>
      <template #reportStatus="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getReportStatusTagType(row.reportStatus)"
          @click="handleStatusClick(row.reportStatus)"
        >
          {{ row.reportStatus }}
        </ElTag>
      </template>
      <template #statData="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleOpenDetail(row)"
        >
          {{ row.taskCount }} / {{ formatRate(row.taskFinishRate) }}
        </el-text>
      </template>
      <template #analysisData="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="showAnalysis(row)"
        >
          {{ row.analysisSummary }}
        </el-text>
      </template>
      <template #filterCondition="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="showCondition(row)"
        >
          {{ row.filterCondition }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          /><IconButton
            content="导出"
            icon-name="download"
            @click="handleExportRow(row)"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon v-if="!dataObj.totalShow" class="tabel-tab-icon">
            <ArrowDown />
          </el-icon>
          <el-icon v-if="dataObj.totalShow" class="tabel-tab-icon">
            <ArrowUp />
          </el-icon>
          <span>
            本页统计：报表 {{ dataObj.list.length }} 条?已生成
            {{ currentPageStats.generatedCount }} 条?生成中
            {{ currentPageStats.generatingCount }} 条?生成失败
            {{ currentPageStats.failedCount }} 条
          </span>
        </div>
        <div v-if="dataObj.totalShow" class="common-total-bottom">
          <span>全部统计：{{ textObj.total }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.inspect-report-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.inspect-report-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}
</style>
