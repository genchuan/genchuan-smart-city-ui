<script setup>
import { computed, reactive, ref, shallowRef, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElMessage, ElProgress, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  batchProcessOilMonitor,
  exportOilMonitor,
  getOilMonitorDetail,
  getOilMonitorPage,
  ignoreOilMonitor,
  processOilMonitor,
  updateOilMonitorProgress,
} from '#/api/genchuan/industry/chargePark/inspectOp/deviceMonitor/oilMonitor';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import {
  detailFields,
  filterMockList,
  getProcessStatusLabel,
  getProcessStatusTagType,
  getProcessUserName,
  getStationName,
  isProcessStatusLabel,
  normalizeOilMonitorRow,
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
  onConfirm() {},
  async onOpenChange() {},
});

const detailDrawerRef = ref(null);
const checkedIds = ref([]);
const checkedRows = ref([]);
const filterSpaceId = shallowRef('');
const filterStationId = shallowRef('');
const filterStationName = shallowRef('');
const filterProcessStatus = shallowRef('');
const filterProcessUserId = shallowRef('');
const filterTrendTime = shallowRef('');

const processDrawerMode = shallowRef('single');
const processRows = ref([]);
const processFormRef = ref(null);
const processForm = reactive({
  processMethod: '',
  processUserId: null,
  processProgress: 50,
});
const processRules = {
  // processMethod: [
  //   { required: false, message: '请输入处置方式', trigger: 'blur' },
  // ],
  // processUserId: [{ required: true, message: '请选择处置人', trigger: 'blur' }],
  processProgress: [
    { required: true, message: '请输入处置进度', trigger: 'change' },
  ],
};

const ignoreDialogVisible = shallowRef(false);
const currentIgnoreRow = ref(null);
const ignoreFormRef = ref(null);
const ignoreForm = reactive({
  ignoreReason: '',
});
const ignoreRules = {
  ignoreReason: [
    { required: true, message: '请输入忽略理由', trigger: 'blur' },
    { min: 10, message: '忽略理由不少于10个字', trigger: 'blur' },
  ],
};

const progressDialogVisible = shallowRef(false);
const currentProgressRow = ref(null);
const progressFormRef = ref(null);
const progressForm = reactive({
  processProgress: 0,
});
const progressRules = {
  processProgress: [
    { required: true, message: '请输入处置进度', trigger: 'change' },
  ],
};

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

const currentPageStats = computed(() => ({
  waitCount: dataObj.list.filter((item) =>
    isProcessStatusLabel(item.processStatus, '未处理'),
  ).length,
  handlingCount: dataObj.list.filter((item) =>
    isProcessStatusLabel(item.processStatus, '处理中'),
  ).length,
  closedCount: dataObj.list.filter((item) =>
    isProcessStatusLabel(item.processStatus, '已关闭'),
  ).length,
}));

const processDrawerTitle = computed(() => {
  return processDrawerMode.value === 'batch'
    ? '批量处置油车占位'
    : '处置油车占位';
});

function buildQueryParams(page) {
  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    spaceId: filterSpaceId.value || dataObj.searchParams.spaceId,
    stationId: filterStationId.value || dataObj.searchParams.stationId,
    stationName: filterStationName.value,
    processStatus:
      filterProcessStatus.value || dataObj.searchParams.processStatus,
    processUserId:
      filterProcessUserId.value || dataObj.searchParams.processUserId,
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
    const response = await getOilMonitorPage(queryParams);
    const list = Array.isArray(response?.list) ? response.list : [];

    // if (list.length === 0 && !response?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    dataObj.useStaticData = false;
    dataObj.total = response.total || 0;
    dataObj.list = list.map((item) => normalizeOilMonitorRow(item));
  } catch (error) {
    console.error('获取油车占位监测数据失败，使用静态数据:', error);
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

const [ProcessDrawer, processDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    processDrawerApi.close();
  },
  onConfirm() {
    saveProcess();
  },
});

function handleRowCheckboxChange({ records }) {
  checkedRows.value = records;
  checkedIds.value = records.map((item) => item.id);
}

function handleRefresh() {
  gridApi.query();
}

async function handleExport() {
  try {
    const data = await exportOilMonitor({
      ...dataObj.searchParams,
      stationId: filterStationId.value || dataObj.searchParams.stationId,
      processStatus:
        filterProcessStatus.value || dataObj.searchParams.processStatus,
      processUserId:
        filterProcessUserId.value || dataObj.searchParams.processUserId,
    });
    downloadFileFromBlobPart({ fileName: textObj.excelAllName, source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}

function onSubmit(values) {
  dataObj.searchParams = { ...values };
  filterTrendTime.value = '';
  gridApi.reload();
  drawerApi.close();
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

async function handleOpenDetail(row) {
  try {
    const response = await getOilMonitorDetail(row.id);
    dataObj.detailObj = normalizeOilMonitorRow(response || row);
  } catch (error) {
    console.error('获取油车占位详情失败，使用行数据:', error);
    dataObj.detailObj = row;
  }
  detailDrawerRef.value?.open();
}

function resetProcessForm() {
  processForm.processMethod = '现场劝离';
  processForm.processUserId = null;
  processForm.processProgress = 50;
  processFormRef.value?.resetFields();
}

function openProcessDrawer(row) {
  resetProcessForm();
  processDrawerMode.value = 'single';
  processRows.value = [row];
  processForm.processProgress = row.processProgress;
  processDrawerApi.open();
}

function openBatchProcessDrawer() {
  const rows = checkedRows.value.filter(
    (item) => !isProcessStatusLabel(item.processStatus, '已处理'),
  );
  if (rows.length === 0) {
    ElMessage.warning('请先勾选未处理的占位数据');
    return;
  }
  if (rows.length !== checkedRows.value.length) {
    ElMessage.warning('仅未处理数据可批量处置，已自动忽略其他状态');
  }
  processDrawerMode.value = 'batch';
  processRows.value = rows;
  resetProcessForm();
  processDrawerApi.open();
}

async function saveProcess() {
  try {
    await processFormRef.value?.validate();
  } catch {
    ElMessage.warning('请完善处置信息');
    return;
  }

  try {
    const payload = {
      // processMethod: processForm.processMethod,
      // processUserId: processForm.processUserId,
      processProgress: processForm.processProgress,
    };

    if (processDrawerMode.value === 'batch') {
      await batchProcessOilMonitor({
        ...payload,
        ids: processRows.value.map((item) => item.id),
      });
      ElMessage.success('批量处置已提交');
    } else {
      await processOilMonitor({
        ...payload,
        id: processRows.value[0].id,
      });
      ElMessage.success('处置已提交');
    }

    processDrawerApi.close();
    handleRefresh();
  } catch (error) {
    console.error(error);
    ElMessage.error('处置提交失败');
  }
}

function openIgnoreDialog(row) {
  currentIgnoreRow.value = row;
  ignoreForm.ignoreReason = '';
  ignoreFormRef.value?.resetFields();
  ignoreDialogVisible.value = true;
}
async function confirmIgnore() {
  try {
    await ignoreFormRef.value?.validate();
  } catch {
    ElMessage.warning('请填写不少于10个字的忽略理由');
    return;
  }

  try {
    await ignoreOilMonitor({
      id: currentIgnoreRow.value.id,
      ignoreReason: ignoreForm.ignoreReason,
    });
    ElMessage.success('忽略操作已提交');
    ignoreDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    console.error(error);
    ElMessage.error('忽略提交失败');
  }
}

function openProgressDialog(row) {
  currentProgressRow.value = row;
  progressFormRef.value?.resetFields();
  progressForm.processProgress = row.processProgress || 0;
  progressDialogVisible.value = true;
}

async function confirmProgress() {
  try {
    await progressFormRef.value?.validate();
  } catch {
    ElMessage.warning('请填写处置进度');
    return;
  }

  try {
    await updateOilMonitorProgress({
      ids: [currentProgressRow.value.id],
      processProgress: progressForm.processProgress,
    });
    ElMessage.success('处置进度已更新');
    progressDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    console.error(error);
    ElMessage.error('进度更新失败');
  }
}

function handleSpaceClick(row) {
  handleOpenDetail(row);
}

function handleStationClick(row) {
  filterStationName.value = '';
  filterStationId.value =
    Number(filterStationId.value) === Number(row.stationId)
      ? ''
      : row.stationId;
  gridApi.query();
}

function handleStatusClick(status) {
  filterProcessStatus.value =
    filterProcessStatus.value === status ? '' : status;
  filterTrendTime.value = '';
  gridApi.query();
}

function handleUserClick(row) {
  if (!row.processUserId) return;
  filterProcessUserId.value =
    Number(filterProcessUserId.value) === Number(row.processUserId)
      ? ''
      : row.processUserId;
  gridApi.query();
}

function handleIgnoreReasonClick(row) {
  if (row.ignoreReason) {
    handleOpenDetail(row);
  }
}

function handleProgressDetail(row) {
  handleOpenDetail(row);
}

function cancelFilter(type) {
  const clearMap = {
    station: () => {
      filterStationId.value = '';
      filterStationName.value = '';
    },
    processStatus: () => {
      filterProcessStatus.value = '';
    },
    processUserId: () => {
      filterProcessUserId.value = '';
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
    if (filter.type === 'processStatus') {
      filterProcessStatus.value = filter.value;
      filterTrendTime.value = '';
    }
    if (filter.type === 'station') {
      filterStationId.value = filter.value.stationId || '';
      filterStationName.value = filter.value.stationId
        ? ''
        : filter.value.stationName;
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
    <DetailDrawer
      ref="detailDrawerRef"
      :data="dataObj.detailObj"
      :fields="detailFields"
      :title="`${dataObj.detailObj.spaceCode || '油车占位监测'}详情`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <ProcessDrawer :title="processDrawerTitle">
      <el-form
        ref="processFormRef"
        :model="processForm"
        :rules="processRules"
        label-width="100px"
      >
        <!-- <el-form-item label="处置方式" prop="processMethod">
          <el-select
            v-model="processForm.processMethod"
            class="w-full"
            placeholder="请选择处置方式"
          >
            <el-option
              v-for="item in processMethodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="processForm.processMethod"
            class="w-full"
            placeholder="请输入处置方式"
          />
        </el-form-item>
        <el-form-item label="处置人" prop="processUserId">
          <el-select
            v-model="processForm.processMethod"
            class="w-full"
            placeholder="请选择处置方式"
          >
            <el-option
              v-for="item in processMethodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="processForm.processUserId"
            class="w-full"
            placeholder="请输入处置人"
          />
        </el-form-item>
        <el-form-item label="处置人" prop="processUserId">
          <el-select
            v-model="processForm.processUserId"
            class="w-full"
            filterable
            placeholder="请选择处置人"
          >
            <el-option
              v-for="item in processUserOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="处置进度" prop="processProgress">
          <el-slider
            v-model="processForm.processProgress"
            :max="100"
            :min="0"
            show-input
          />
        </el-form-item>
        <div class="process-tip">
          本次将处置 {{ processRows.length }} 条油车占位记录。
        </div>
      </el-form>
    </ProcessDrawer>

    <el-dialog
      v-model="ignoreDialogVisible"
      title="忽略占位"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ignoreFormRef"
        :model="ignoreForm"
        :rules="ignoreRules"
        label-width="90px"
      >
        <el-form-item label="忽略理由" prop="ignoreReason">
          <el-input
            v-model="ignoreForm.ignoreReason"
            maxlength="255"
            placeholder="请输入忽略理由，至少10个字"
            rows="4"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="ignoreDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmIgnore">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="progressDialogVisible"
      title="更新处置进度"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="progressFormRef"
        :model="progressForm"
        :rules="progressRules"
        label-width="90px"
      >
        <el-form-item label="处置进度" prop="processProgress">
          <el-slider
            v-model="progressForm.processProgress"
            :max="100"
            :min="0"
            show-input
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="progressDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmProgress">确认</el-button>
      </template>
    </el-dialog>

    <Grid>
      <template #table-title>
        <div class="oil-filter-tags">
          <ElTag
            v-if="filterStationId || filterStationName"
            closable
            type="primary"
            @close="cancelFilter('station')"
          >
            所属场站：{{ filterStationName || getStationName(filterStationId) }}
          </ElTag>
          <ElTag
            v-if="filterProcessStatus"
            closable
            :type="getProcessStatusTagType(filterProcessStatus)"
            @close="cancelFilter('processStatus')"
          >
            处置状态：{{ getProcessStatusLabel(filterProcessStatus) }}
          </ElTag>
          <ElTag
            v-if="filterProcessUserId"
            closable
            type="success"
            @close="cancelFilter('processUserId')"
          >
            处置人：{{ getProcessUserName(filterProcessUserId) }}
          </ElTag>
          <ElTag
            v-if="filterTrendTime"
            closable
            type="warning"
            @close="cancelFilter('trendTime')"
          >
            趋势时间点：{{ filterTrendTime }}
          </ElTag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="批量处置"
            icon-name="Tools"
            :disabled="isEmpty(checkedIds)"
            @click="openBatchProcessDrawer"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
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

      <template #space_code="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleSpaceClick(row)"
        >
          {{ row.spaceCode }}
        </el-text>
      </template>

      <template #station_name="{ row }">
        <el-text
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleStationClick(row)"
        >
          {{ row.stationName }}
        </el-text>
      </template>

      <template #process_status="{ row }">
        <ElTag
          :type="getProcessStatusTagType(row.processStatus)"
          style="cursor: pointer"
          @click="handleStatusClick(row.processStatus)"
        >
          {{ getProcessStatusLabel(row.processStatus) }}
        </ElTag>
      </template>

      <template #process_user="{ row }">
        <el-text
          v-if="row.processUserId"
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleUserClick(row)"
        >
          {{ row.processUserName }}
        </el-text>
        <span v-else>-</span>
      </template>

      <template #ignore_reason="{ row }">
        <el-text
          v-if="row.ignoreReason"
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleIgnoreReasonClick(row)"
        >
          {{ row.ignoreReason }}
        </el-text>
        <span v-else>-</span>
      </template>

      <template #process_progress="{ row }">
        <ElProgress
          class="progress-cell"
          :percentage="row.processProgress"
          :stroke-width="8"
          @click="handleProgressDetail(row)"
        />
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="isProcessStatusLabel(row.processStatus, '未处理')"
            content="处置"
            icon-name="Tools"
            @click="openProcessDrawer(row)"
          />
          <IconButton
            v-if="isProcessStatusLabel(row.processStatus, '未处理')"
            content="忽略"
            icon-name="Close"
            @click="openIgnoreDialog(row)"
          />
          <IconButton
            v-if="isProcessStatusLabel(row.processStatus, '处理中')"
            content="更新进度"
            icon-name="Edit"
            @click="openProgressDialog(row)"
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
            本页统计：占位记录 {{ dataObj.list.length }} 条；未处理
            {{ currentPageStats.waitCount }} 条；处理中
            {{ currentPageStats.handlingCount }} 条；已关闭
            {{ currentPageStats.closedCount }} 条
          </span>
        </div>
        <div v-if="dataObj.totalShow" class="common-total-bottom">
          <span>全部统计：共 {{ dataObj.total }} 条；{{ textObj.total }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.oil-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.process-tip {
  padding: 10px 12px;
  margin-top: 8px;
  font-size: 13px;
  color: #596678;
  background: #f5f7fa;
  border-radius: 8px;
}

.progress-cell {
  width: 120px;
  cursor: pointer;
}

/*
  页面样式里 .el-tabs__header 为 absolute，且工具栏按钮被 .vxe-tools--operate { top: -30px }
  顶到标签区域；未提升 z-index 时，点击会落在标签头上，表现为「搜索点了没反应」。
*/
.park-lot-table-new :deep(.vxe-grid--toolbar-wrapper) {
  position: relative;
  z-index: 20;
}

.park-lot-table-new :deep(.vxe-tools--wrapper),
.park-lot-table-new :deep(.vxe-tools--operate) {
  z-index: 21;
}
</style>
