<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  alarmSpaceMonitor,
  exportSpaceMonitor,
  getSpaceMonitorDetail,
  getSpaceMonitorLocation,
  getSpaceMonitorPage,
} from '#/api/genchuan/industry/chargePark/inspectOp/deviceMonitor/spaceMonitor';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import {
  detailFields,
  filterMockList,
  getAlarmStatusLabel,
  getAlarmStatusTagType,
  getMonitorStatusLabel,
  getMonitorStatusTagType,
  getProcessStatusLabel,
  getProcessStatusTagType,
  getStationName,
  isAlarmedStatus,
  isMonitorAbnormal,
  isMonitorNormal,
  normalizeSpaceMonitorRow,
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

const emit = defineEmits(['locateSpace']);

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
const filterSpaceId = ref('');
const filterStationId = ref('');
const filterMonitorStatus = ref('');
const filterAlarmStatus = ref('');
const filterProcessStatus = ref('');
const filterTrendTime = ref('');
const alarmDialogVisible = ref(false);
const currentAlarmRow = ref(null);
const alarmFormRef = ref(null);
const alarmForm = reactive({
  alarmRemark: '',
});
const alarmRules = {
  alarmRemark: [
    {
      max: 255,
      message: '告警备注不能超过255个字符',
      trigger: 'blur',
    },
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

const currentPageStats = computed(() => {
  const normalCount = dataObj.list.filter((item) =>
    isMonitorNormal(item.monitorStatus),
  ).length;
  const abnormalCount = dataObj.list.filter((item) =>
    isMonitorAbnormal(item.monitorStatus),
  ).length;
  const alarmCount = dataObj.list.filter((item) =>
    isAlarmedStatus(item.alarmStatus),
  ).length;

  return {
    normalCount,
    abnormalCount,
    alarmCount,
  };
});

function buildQueryParams(page) {
  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    spaceId: filterSpaceId.value || dataObj.searchParams.spaceId,
    stationId: filterStationId.value || dataObj.searchParams.stationId,
    monitorStatus:
      filterMonitorStatus.value || dataObj.searchParams.monitorStatus,
    alarmStatus: filterAlarmStatus.value || dataObj.searchParams.alarmStatus,
    processStatus:
      filterProcessStatus.value || dataObj.searchParams.processStatus,
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
    const response = await getSpaceMonitorPage(queryParams);
    const list = Array.isArray(response?.list) ? response.list : [];

    // if (list.length === 0 && !response?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    dataObj.useStaticData = false;
    dataObj.total = response.total || 0;
    dataObj.list = list.map((item) => normalizeSpaceMonitorRow(item));
  } catch (error) {
    console.error('获取车位状态监测数据失败，使用静态数据:', error);
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

async function handleExport() {
  try {
    const data = await exportSpaceMonitor({
      ...dataObj.searchParams,
      monitorStatus:
        filterMonitorStatus.value || dataObj.searchParams.monitorStatus,
      alarmStatus: filterAlarmStatus.value || dataObj.searchParams.alarmStatus,
      processStatus:
        filterProcessStatus.value || dataObj.searchParams.processStatus,
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

function handleSerachShow() {
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
    const response = await getSpaceMonitorDetail(row.id);
    dataObj.detailObj = normalizeSpaceMonitorRow(response || row);
  } catch (error) {
    console.error('获取车位监测详情失败，使用行数据:', error);
    dataObj.detailObj = row;
  }
  detailDrawerRef.value?.open();
}

async function handleLocate(row) {
  try {
    const response = await getSpaceMonitorLocation({ id: row.id });
    const location = {
      ...row,
      ...response,
      id: row.id,
      spaceCode: response?.spaceCode || row.spaceCode,
      stationName: response?.stationName || row.stationName,
      longitude: response?.longitude ?? response?.lon ?? row.longitude,
      latitude: response?.latitude ?? response?.lat ?? row.latitude,
    };

    emit('locateSpace', location);
    ElMessage.success(`已定位到车位：${location.spaceCode}`);
  } catch (error) {
    console.error('获取定位失败，使用行坐标:', error);
    if (!row.longitude || !row.latitude) {
      ElMessage.warning('当前记录缺少定位坐标');
      return;
    }
    emit('locateSpace', row);
    ElMessage.success(`已定位到车位：${row.spaceCode}`);
  }
}

function handleToolbarLocate() {
  const row = checkedRows.value[0];
  if (!row) {
    ElMessage.warning('请先勾选一条需要定位的监测记录');
    return;
  }
  handleLocate(row);
}

function openAlarmDialog(row) {
  currentAlarmRow.value = row;
  alarmForm.alarmRemark = '';
  alarmFormRef.value?.resetFields();
  alarmDialogVisible.value = true;
}

async function confirmAlarm() {
  try {
    await alarmFormRef.value?.validate();
  } catch {
    ElMessage.warning('请检查告警备注');
    return;
  }

  try {
    await alarmSpaceMonitor({
      id: currentAlarmRow.value.id,
      alarmRemark: alarmForm.alarmRemark,
    });
    ElMessage.success('告警已提交');
    alarmDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    console.error(error);
    ElMessage.error('告警提交失败');
  }
}

function handleSpaceClick(row) {
  handleOpenDetail(row);
}

function handleStationClick(row) {
  filterStationId.value =
    Number(filterStationId.value) === Number(row.stationId)
      ? ''
      : row.stationId;
  gridApi.query();
}

function handleMonitorStatusClick(status) {
  filterMonitorStatus.value =
    filterMonitorStatus.value === status ? '' : status;
  filterTrendTime.value = '';
  gridApi.query();
}

function handleAlarmStatusClick(status) {
  filterAlarmStatus.value = filterAlarmStatus.value === status ? '' : status;
  gridApi.query();
}

function handleProcessStatusClick(status) {
  filterProcessStatus.value =
    filterProcessStatus.value === status ? '' : status;
  gridApi.query();
}

function handleAlarmTimeClick(row) {
  if (row.alarmTime) {
    handleOpenDetail(row);
  }
}

function cancelFilter(type) {
  const clearMap = {
    spaceId: () => {
      filterSpaceId.value = '';
    },
    stationId: () => {
      filterStationId.value = '';
    },
    monitorStatus: () => {
      filterMonitorStatus.value = '';
    },
    alarmStatus: () => {
      filterAlarmStatus.value = '';
    },
    processStatus: () => {
      filterProcessStatus.value = '';
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
    if (filter.type === 'monitorStatus') {
      filterMonitorStatus.value = filter.value;
      filterTrendTime.value = '';
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
      :title="`${dataObj.detailObj.spaceCode || '车位状态监测'}详情`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <el-dialog
      v-model="alarmDialogVisible"
      title="异常告警"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="alarmFormRef"
        :model="alarmForm"
        :rules="alarmRules"
        label-width="90px"
      >
        <el-form-item label="告警备注" prop="alarmRemark">
          <el-input
            v-model="alarmForm.alarmRemark"
            maxlength="255"
            placeholder="请输入告警备注（选填）"
            rows="4"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="alarmDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAlarm">确认</el-button>
      </template>
    </el-dialog>

    <Grid>
      <template #table-title>
        <div class="space-filter-tags">
          <ElTag
            v-if="filterSpaceId"
            closable
            type="success"
            @close="cancelFilter('spaceId')"
          >
            车位：{{ filterSpaceId }}
          </ElTag>
          <ElTag
            v-if="filterStationId"
            closable
            type="primary"
            @close="cancelFilter('stationId')"
          >
            所属场站：{{ getStationName(filterStationId) }}
          </ElTag>
          <ElTag
            v-if="filterMonitorStatus"
            closable
            :type="getMonitorStatusTagType(filterMonitorStatus)"
            @close="cancelFilter('monitorStatus')"
          >
            监测状态：{{ getMonitorStatusLabel(filterMonitorStatus) }}
          </ElTag>
          <ElTag
            v-if="filterAlarmStatus"
            closable
            :type="getAlarmStatusTagType(filterAlarmStatus)"
            @close="cancelFilter('alarmStatus')"
          >
            告警状态：{{ getAlarmStatusLabel(filterAlarmStatus) }}
          </ElTag>
          <ElTag
            v-if="filterProcessStatus"
            closable
            :type="getProcessStatusTagType(filterProcessStatus)"
            @close="cancelFilter('processStatus')"
          >
            处理状态：{{ getProcessStatusLabel(filterProcessStatus) }}
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
            content="定位"
            icon-name="Location"
            :disabled="isEmpty(checkedIds)"
            @click="handleToolbarLocate"
          />
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
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

      <template #monitor_status="{ row }">
        <ElTag
          :type="getMonitorStatusTagType(row.monitorStatus)"
          style="cursor: pointer"
          @click="handleMonitorStatusClick(row.monitorStatus)"
        >
          {{ getMonitorStatusLabel(row.monitorStatus) }}
        </ElTag>
      </template>

      <template #alarm_status="{ row }">
        <ElTag
          :type="getAlarmStatusTagType(row.alarmStatus)"
          style="cursor: pointer"
          @click="handleAlarmStatusClick(row.alarmStatus)"
        >
          {{ getAlarmStatusLabel(row.alarmStatus) }}
        </ElTag>
      </template>

      <template #alarm_time="{ row }">
        <el-text
          v-if="row.alarmTime"
          class="common-align"
          type="primary"
          style="cursor: pointer"
          @click="handleAlarmTimeClick(row)"
        >
          {{ row.alarmTimeStr }}
        </el-text>
        <span v-else>-</span>
      </template>

      <template #process_status="{ row }">
        <ElTag
          :type="getProcessStatusTagType(row.processStatus)"
          style="cursor: pointer"
          @click="handleProcessStatusClick(row.processStatus)"
        >
          {{ getProcessStatusLabel(row.processStatus) }}
        </ElTag>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="isMonitorAbnormal(row.monitorStatus)"
            content="告警"
            icon-name="Bell"
            @click="openAlarmDialog(row)"
          />
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="定位"
            icon-name="Location"
            @click="handleLocate(row)"
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
            本页统计：监测记录 {{ dataObj.list.length }} 条；正常
            {{ currentPageStats.normalCount }} 条；异常
            {{ currentPageStats.abnormalCount }} 条；已告警
            {{ currentPageStats.alarmCount }} 条
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
.space-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>
