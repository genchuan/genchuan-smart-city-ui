<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import {
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElMessage,
  ElTag,
} from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportInspectTrack,
  getInspectTrackDetail,
  getInspectTrackPage,
} from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectTrack';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import ExceptionPointDialog from '../components/ExceptionPointDialog.vue';
import ReplayDialog from '../components/ReplayDialog.vue';
import TrackCheckDrawer from '../components/TrackCheckDrawer.vue';
import {
  buildTrendTrackTimeRange,
  detailFields,
  filterInspectTrackRows,
  filterMockList,
  formatTrendTime,
  getSyncStatusTagType,
  getTrackStatusLabel,
  getTrackStatusTagType,
  getUserName,
  isTrackStatusLabel,
  loadTrackUserOptions,
  normalizeInspectTrackRow,
  textObj,
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
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
});

const detailDrawerRef = ref(null);
const replayDialogRef = ref(null);
const checkDrawerRef = ref(null);
const exceptionPointDialogRef = ref(null);
const checkedIds = ref([]);
const checkedRows = ref([]);
const filterUserId = ref('');
const filterUserName = ref('');
const filterArea = ref('');
const filterStatus = ref('');
const filterSyncStatus = ref('');
const filterTrendTime = ref('');

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
  useStaticData: false,
});

const currentPageStats = computed(() => {
  const normalCount = dataObj.list.filter((item) =>
    isTrackStatusLabel(item.status, '正常'),
  ).length;
  const exceptionCount = dataObj.list.filter((item) =>
    isTrackStatusLabel(item.status, '异常'),
  ).length;
  const totalMileage = dataObj.list
    .reduce((total, item) => total + Number(item.mileage || 0), 0)
    .toFixed(2);

  return {
    normalCount,
    exceptionCount,
    totalMileage,
  };
});

function buildQueryParams(page) {
  const trendTrackTimeRange = buildTrendTrackTimeRange(filterTrendTime.value);

  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    userId: filterUserId.value || dataObj.searchParams.userId,
    area: filterArea.value || dataObj.searchParams.area,
    status: filterStatus.value || dataObj.searchParams.status,
    syncStatus: filterSyncStatus.value || dataObj.searchParams.syncStatus,
    trackTime:
      trendTrackTimeRange ||
      dataObj.searchParams.trackTimeRange ||
      dataObj.searchParams.trackTime,
    trendTime: filterTrendTime.value,
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
    const response = await getInspectTrackPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];

    // if (list.length === 0 && !pageResult?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    const normalizedList = list.map((item) => {
      return {
        ...normalizeInspectTrackRow(item),
        trackPointsText: `${item?.points?.split('|')?.length ?? 0} 个轨迹点`,
      };
    });
    const visibleList = filterTrendTime.value
      ? filterInspectTrackRows(normalizedList, {
          ...queryParams,
          trackTime: undefined,
          trackTimeRange: undefined,
        })
      : normalizedList;

    dataObj.useStaticData = false;
    dataObj.total = filterTrendTime.value
      ? visibleList.length
      : pageResult.total || 0;
    dataObj.list = visibleList;
  } catch (error) {
    console.error('获取巡检轨迹数据失败，使用静态数据:', error);
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
  checkedRows.value = records;
  checkedIds.value = records.map((item) => item.id);
}

function handleRefresh() {
  gridApi.query();
}

async function handleExport(format = 'excel') {
  try {
    const data = await exportInspectTrack({
      ...buildQueryParams(dataObj),
      exportFormat: format,
      format,
    });
    downloadFileFromBlobPart({
      fileName: format === 'pdf' ? textObj.pdfAllName : textObj.excelAllName,
      source: data,
    });
    ElMessage.success(format === 'pdf' ? 'PDF 导出成功' : 'Excel 导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}

function handleBatchReplay() {
  if (checkedRows.value.length !== 1) {
    ElMessage.warning('请选择一条巡检轨迹进行回放');
    return;
  }
  replayDialogRef.value?.open(checkedRows.value[0]);
}

function onSubmit(values) {
  dataObj.searchParams = { ...values };
  filterTrendTime.value = '';
  gridApi.reload();
  drawerApi.close();
}

async function handleOpenDetail(row) {
  try {
    const response = await getInspectTrackDetail(row.id);
    dataObj.detailObj = {
      ...normalizeInspectTrackRow(response || row),
      ...row,
    };
  } catch (error) {
    console.error('获取巡检轨迹详情失败，使用行数据:', error);
    dataObj.detailObj = normalizeInspectTrackRow(row);
  }
  detailDrawerRef.value?.open();
}

function handleReplay(row) {
  replayDialogRef.value?.open(row);
}

function handleCheck(row) {
  checkDrawerRef.value?.open(row);
}

function handleExceptionClick(row) {
  if (!row.exceptionCount) return;
  exceptionPointDialogRef.value?.open(row);
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

function handleUserClick(row) {
  if (!row?.userId) return;
  filterUserId.value =
    Number(filterUserId.value) === Number(row?.userId) ? '' : row?.userId;
  filterUserName.value = row?.userName;
  gridApi.query();
}

function handleAreaClick(area) {
  if (!area || area === '-') return;
  filterArea.value = filterArea.value === area ? '' : area;
  gridApi.query();
}

function handleStatusClick(status) {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
}

function handleSyncStatusClick(syncStatus) {
  filterSyncStatus.value =
    filterSyncStatus.value === syncStatus ? '' : syncStatus;
  gridApi.query();
}

function cancelFilter(type) {
  const clearMap = {
    area: () => {
      filterArea.value = '';
    },
    status: () => {
      filterStatus.value = '';
    },
    syncStatus: () => {
      filterSyncStatus.value = '';
    },
    trendTime: () => {
      filterTrendTime.value = '';
    },
    userId: () => {
      filterUserId.value = '';
    },
  };

  clearMap[type]?.();
  gridApi.query();
}

watch(
  () => props.chartFilter,
  (filter) => {
    if (!filter) return;
    if (filter.type === 'user') {
      filterUserId.value = filter.value;
    }
    if (filter.type === 'trendTime') {
      filterTrendTime.value = filter.value;
    }
    if (filter.type === 'track') {
      dataObj.detailObj = normalizeInspectTrackRow(filter.value || {});
      detailDrawerRef.value?.open();
      return;
    }
    gridApi.reload();
  },
  { deep: true },
);

onMounted(() => {
  loadTrackUserOptions();
});
</script>

<template>
  <div class="park-lot-table-new">
    <DetailDrawer
      ref="detailDrawerRef"
      :data="dataObj.detailObj"
      :fields="detailFields"
      :title="`巡检轨迹 ${dataObj.detailObj.id || ''} 详情`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="inspect-track-filter-tags">
          <ElTag
            v-if="filterUserId"
            closable
            type="primary"
            @close="cancelFilter('userId')"
          >
            巡检人员：{{ filterUserName }}
          </ElTag>
          <ElTag
            v-if="filterArea"
            closable
            type="success"
            @close="cancelFilter('area')"
          >
            所属片区：{{ filterArea }}
          </ElTag>
          <ElTag
            v-if="filterStatus"
            closable
            :type="getTrackStatusTagType(filterStatus)"
            @close="cancelFilter('status')"
          >
            轨迹状态：{{ getTrackStatusLabel(filterStatus) }}
          </ElTag>
          <ElTag
            v-if="filterSyncStatus"
            closable
            :type="getSyncStatusTagType(filterSyncStatus)"
            @close="cancelFilter('syncStatus')"
          >
            同步状态：{{ filterSyncStatus }}
          </ElTag>
          <ElTag
            v-if="filterTrendTime"
            closable
            type="danger"
            @close="cancelFilter('trendTime')"
          >
            趋势时间：{{ formatTrendTime(filterTrendTime) }}
          </ElTag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="回放"
            icon-name="VideoPlay"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchReplay"
          />
          <!-- <ElDropdown @command="handleExport"> -->
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <!-- <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem command="excel">导出 Excel</ElDropdownItem>
                <ElDropdownItem command="pdf">导出 PDF</ElDropdownItem>
              </ElDropdownMenu>
            </template> -->
          <!-- </ElDropdown> -->
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSearchShow"
          />
          <!-- <IconButton
            content="刷新"
            icon-name="refresh"
            @click="handleRefresh"
          /> -->
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <template #userName="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleUserClick(row)"
        >
          {{ row.userName }}
        </el-text>
      </template>

      <template #area="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleAreaClick(row.area)"
        >
          {{ row.area }}
        </el-text>
      </template>

      <template #status="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getTrackStatusTagType(row.status)"
          @click="handleStatusClick(row.status)"
        >
          {{ getTrackStatusLabel(row.status) }}
        </ElTag>
      </template>

      <template #exceptionText="{ row }">
        <el-text
          v-if="row.exceptionCount"
          class="common-align"
          style="cursor: pointer"
          type="danger"
          @click="handleExceptionClick(row)"
        >
          {{ row.exceptionText }}
        </el-text>
        <span v-else>无</span>
      </template>

      <template #syncStatus="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getSyncStatusTagType(row.syncStatus)"
          @click="handleSyncStatusClick(row.syncStatus)"
        >
          {{ row.syncStatus }}
        </ElTag>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="isTrackStatusLabel(row.status, '正常')"
            content="回放"
            icon-name="VideoPlay"
            @click="handleReplay(row)"
          />
          <IconButton
            v-if="isTrackStatusLabel(row.status, '异常')"
            content="核查"
            icon-name="CircleCheck"
            @click="handleCheck(row)"
          />
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
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
            本页统计：轨迹 {{ dataObj.list.length }} 条；正常
            {{ currentPageStats.normalCount }} 条；异常
            {{ currentPageStats.exceptionCount }} 条；里程
            {{ currentPageStats.totalMileage }} km
          </span>
        </div>
        <div v-if="dataObj.totalShow" class="common-total-bottom">
          <span>全部统计：共 {{ dataObj.total }} 条；{{ textObj.total }}</span>
        </div>
      </template>
    </Grid>

    <ReplayDialog ref="replayDialogRef" />
    <TrackCheckDrawer ref="checkDrawerRef" @success="handleRefresh" />
    <ExceptionPointDialog ref="exceptionPointDialogRef" />
  </div>
</template>

<style scoped>
.inspect-track-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.inspect-track-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}
</style>
