<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElMessageBox, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportCycleReport,
  generateCycleReport,
  getCycleReportDetail,
  getCycleReportPage,
} from '#/api/genchuan/industry/chargePark/inspectOp/inspectReport/cycleReport';

import ReportDetailDrawer from '../components/ReportDetailDrawer.vue';
import {
  filterMockList,
  formatRate,
  getGenerateStatusTagType,
  getReportCycleTagType,
  getStationIdByName,
  getStationName,
  metricFieldMap,
  metricLabelMap,
  normalizeCycleReportRow,
  textObj,
  useGenerateFormSchema,
  useGridColumns,
  useSearchFormSchema,
} from './data';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  chartFilter: {
    type: Object,
    default: null,
  },
  showStats: {
    type: Boolean,
    default: false,
  },
  toggleStats: {
    type: Function,
    default: () => {},
  },
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

const detailDrawerRef = ref(null);
const checkedIds = ref([]);
const filterReportCycle = ref('');
const filterStationId = ref('');
const filterGenerateStatus = ref('');
const filterTrendTime = ref('');
const filterMetric = ref('');

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
  generatedCount: dataObj.list.filter(
    (item) => item.generateStatus === '已生成',
  ).length,
  pendingCount: dataObj.list.filter((item) => item.generateStatus !== '已生成')
    .length,
  customCount: dataObj.list.filter((item) => item.reportType === '自定义')
    .length,
}));

const [GenerateForm, generateFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useGenerateFormSchema(),
  showDefaultActions: false,
});

const [GenerateDrawer, generateDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '生成报表',
  onCancel() {
    generateDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await generateFormApi.validate();
    if (!valid) return;

    const values = await generateFormApi.getValues();
    const [statTimeStart, statTimeEnd] = values.statTimeRange || [];

    if (values.reportType === '自动' && values.reportCycle === '自定义报表') {
      ElMessage.warning('自动报表不支持选择自定义报表周期');
      return;
    }
    if (values.reportType === '自定义' && values.reportCycle !== '自定义报表') {
      ElMessage.warning('自定义报表类型需选择自定义报表周期');
      return;
    }

    try {
      await generateCycleReport({
        reportCycle: values.reportCycle,
        reportType: values.reportType,
        stationId: values.stationId,
        statTimeEnd,
        statTimeStart,
      });
      ElMessage.success('报表生成成功');
      generateDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error(error);
      ElMessage.error('报表生成失败');
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    await generateFormApi.resetForm();
    await generateFormApi.setValues({
      reportCycle: '自定义报表',
      reportType: '自定义',
    });
  },
});

function getMetricLabel(metricKey) {
  return metricLabelMap[metricKey] || metricKey;
}

function sortListByMetric(list) {
  if (!filterMetric.value || !metricFieldMap[filterMetric.value]) {
    return list;
  }
  const field = metricFieldMap[filterMetric.value];
  return [...list].toSorted(
    (a, b) => Number(b[field] || 0) - Number(a[field] || 0),
  );
}

function applyLocalTrendFilter(list) {
  if (!filterTrendTime.value) return list;
  return list.filter((item) =>
    String(item.statTime || '').includes(String(filterTrendTime.value)),
  );
}

function buildQueryParams(page) {
  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    generateStatus:
      filterGenerateStatus.value || dataObj.searchParams.generateStatus,
    reportCycle: filterReportCycle.value || dataObj.searchParams.reportCycle,
    stationId: filterStationId.value || dataObj.searchParams.stationId,
    trendTime: filterTrendTime.value,
  };
}

function getPagedMockData(params, page) {
  const filteredList = sortListByMetric(filterMockList(params));
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
    const response = await getCycleReportPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];

    // if (list.length === 0 && !pageResult?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    dataObj.useStaticData = false;
    dataObj.total = pageResult.total || 0;
    dataObj.list = sortListByMetric(
      applyLocalTrendFilter(list.map((item) => normalizeCycleReportRow(item))),
    );
  } catch (error) {
    console.error('获取周期报表数据失败，使用静态数据', error);
    getPagedMockData(queryParams, page);
  }

  return dataObj;
}

const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
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
  submitButtonOptions: {
    content: '查询',
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
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
  checkedIds.value = records.map((item) => item.id);
}

function handleRefresh() {
  gridApi.query();
}

async function handleExport(params = {}) {
  try {
    const data = await exportCycleReport({
      ...buildQueryParams(dataObj),
      ...params,
    });
    downloadFileFromBlobPart({
      fileName: params.id ? `周期报表_${params.id}.xlsx` : textObj.excelAllName,
      source: data,
    });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}

function handleExportList() {
  handleExport();
}

async function handleExportRow(row) {
  try {
    await ElMessageBox.confirm('确认导出当前周期报表吗？', '导出确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await handleExport({ id: row.id });
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error);
    }
  }
}

function onSubmit(values) {
  const [statTimeStart, statTimeEnd] = values.statTimeRange || [];
  dataObj.searchParams = {
    ...values,
    statTimeEnd,
    statTimeStart,
  };
  delete dataObj.searchParams.statTimeRange;
  filterTrendTime.value = '';
  gridApi.reload();
  drawerApi.close();
}

async function handleOpenDetail(row) {
  try {
    const response = await getCycleReportDetail(row.id);
    const detail = response?.id ? response : response?.data || response;
    detailDrawerRef.value?.open(normalizeCycleReportRow({ ...row, ...detail }));
  } catch (error) {
    console.error(error);
    detailDrawerRef.value?.open(row);
  }
}

function handleSearchShow() {
  drawerApi.open();
}

function handleGenerateShow() {
  generateDrawerApi.open();
}

function handleFullShow() {
  screenfull.toggle();
}

function changeTotalShow() {
  dataObj.totalShow = !dataObj.totalShow;
}

function handleReportCycleClick(value) {
  filterReportCycle.value = filterReportCycle.value === value ? '' : value;
  gridApi.query();
}

function handleStationClick(stationId) {
  filterStationId.value =
    Number(filterStationId.value) === Number(stationId) ? '' : stationId;
  gridApi.query();
}

function handleStatusClick(value) {
  filterGenerateStatus.value =
    filterGenerateStatus.value === value ? '' : value;
  gridApi.query();
}

function handleCompareInfo(text) {
  ElMessage.info(text || '-');
}

function handleMetricDetail(row) {
  handleOpenDetail(row);
}

function cancelFilter(type) {
  const clearMap = {
    generateStatus: () => {
      filterGenerateStatus.value = '';
    },
    metric: () => {
      filterMetric.value = '';
    },
    reportCycle: () => {
      filterReportCycle.value = '';
    },
    stationId: () => {
      filterStationId.value = '';
    },
    trendTime: () => {
      filterTrendTime.value = '';
    },
  };

  clearMap[type]?.();
  gridApi.query();
}

watch(
  () => props.chartFilter,
  (filter) => {
    if (!filter) return;
    if (filter.type === 'metric') {
      filterMetric.value = filter.value;
    }
    if (filter.type === 'station') {
      filterStationId.value = getStationIdByName(filter.value);
    }
    if (filter.type === 'trendTime') {
      filterTrendTime.value = filter.value;
    }
    gridApi.query();
  },
  { deep: true },
);
</script>

<template>
  <div class="park-lot-table-new">
    <GenerateDrawer title="生成报表">
      <GenerateForm />
    </GenerateDrawer>

    <ReportDetailDrawer ref="detailDrawerRef" @export="handleExportRow" />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="cycle-report-filter-tags">
          <ElTag
            v-if="filterReportCycle"
            closable
            type="primary"
            @close="cancelFilter('reportCycle')"
          >
            报表周期：{{ filterReportCycle }}
          </ElTag>
          <ElTag
            v-if="filterStationId"
            closable
            type="success"
            @close="cancelFilter('stationId')"
          >
            所属场站：{{ getStationName(filterStationId) }}
          </ElTag>
          <ElTag
            v-if="filterGenerateStatus"
            closable
            type="warning"
            @close="cancelFilter('generateStatus')"
          >
            生成状态：{{ filterGenerateStatus }}
          </ElTag>
          <ElTag
            v-if="filterTrendTime"
            closable
            type="danger"
            @close="cancelFilter('trendTime')"
          >
            趋势时间：{{ filterTrendTime }}
          </ElTag>
          <ElTag
            v-if="filterMetric"
            closable
            type="info"
            @close="cancelFilter('metric')"
          >
            指标聚焦：{{ getMetricLabel(filterMetric) }}
          </ElTag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="生成"
            icon-name="Plus"
            @click="handleGenerateShow"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExportList"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSearchShow"
          />
          <IconButton
            :content="props.showStats ? '隐藏统计' : '显示统计'"
            :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
            @click="props.toggleStats"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <template #reportCycle="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getReportCycleTagType(row.reportCycle)"
          @click="handleReportCycleClick(row.reportCycle)"
        >
          {{ row.reportCycle }}
        </ElTag>
      </template>

      <template #statTime="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleOpenDetail(row)"
        >
          {{ row.statTime }}
        </el-text>
      </template>

      <template #normalDeviceNum="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleMetricDetail(row)"
        >
          {{ row.normalDeviceNum }}
        </el-text>
      </template>

      <template #abnormalDeviceNum="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="danger"
          @click="handleMetricDetail(row)"
        >
          {{ row.abnormalDeviceNum }}
        </el-text>
      </template>

      <template #inspectTaskNum="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleMetricDetail(row)"
        >
          {{ row.inspectTaskNum }}
        </el-text>
      </template>

      <template #taskCompleteRate="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="success"
          @click="handleMetricDetail(row)"
        >
          {{ formatRate(row.taskCompleteRate) }}
        </el-text>
      </template>

      <template #oilWaitHandleNum="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="warning"
          @click="handleMetricDetail(row)"
        >
          {{ row.oilWaitHandleNum }}
        </el-text>
      </template>

      <template #oilHandleCompleteRate="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="success"
          @click="handleMetricDetail(row)"
        >
          {{ formatRate(row.oilHandleCompleteRate) }}
        </el-text>
      </template>

      <template #inspectUserOnlineNum="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleMetricDetail(row)"
        >
          {{ row.inspectUserOnlineNum }}
        </el-text>
      </template>

      <template #assetNormalNum="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="success"
          @click="handleMetricDetail(row)"
        >
          {{ row.assetNormalNum }}
        </el-text>
      </template>

      <template #stockWarnNum="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="danger"
          @click="handleMetricDetail(row)"
        >
          {{ row.stockWarnNum }}
        </el-text>
      </template>

      <template #stationName="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleStationClick(row.stationId)"
        >
          {{ row.stationName }}
        </el-text>
      </template>

      <template #generateStatus="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getGenerateStatusTagType(row.generateStatus)"
          @click="handleStatusClick(row.generateStatus)"
        >
          {{ row.generateStatus }}
        </ElTag>
      </template>

      <template #operator="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleOpenDetail(row)"
        >
          {{ row.operator }}
        </el-text>
      </template>

      <template #yearOnYearData="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleCompareInfo(row.yearOnYearData)"
        >
          {{ row.yearOnYearData }}
        </el-text>
      </template>

      <template #chainRatioData="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleCompareInfo(row.chainRatioData)"
        >
          {{ row.chainRatioData }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
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
            本页统计：报表 {{ dataObj.list.length }} 条；已生成
            {{ currentPageStats.generatedCount }} 条；待生成/生成中
            {{ currentPageStats.pendingCount }} 条；自定义
            {{ currentPageStats.customCount }} 条
          </span>
        </div>
        <div v-if="dataObj.totalShow" class="common-total-bottom">
          <span>全部统计：共 {{ dataObj.total }} 条</span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.cycle-report-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.cycle-report-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}
</style>
