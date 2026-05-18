<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createHandoverLog,
  exportHandoverLog,
  getHandoverLogDetail,
  getHandoverLogPage,
} from '#/api/genchuan/industry/chargePark/inspectOp/scheduleMgmt/handoverLog';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { $t } from '#/locales';

import StatusConfirmDialog from '../components/StatusConfirmDialog.vue';
import {
  detailFields,
  filterMockList,
  getStatusLabel,
  getStatusTagType,
  getUserName,
  isStatusLabel,
  loadScheduleUserOptions,
  normalizeHandoverLogRow,
  textObj,
  useFormSchema,
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
const statusConfirmDialogRef = ref(null);
const formData = ref({});
const checkedIds = ref([]);
const checkedRows = ref([]);
const filterUserName = ref('');
const filterHandoverDate = ref('');
const filterStatus = ref('');
const filterConfirmUserId = ref('');
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
  const pendingCount = dataObj.list.filter((item) =>
    isStatusLabel(item.status, '待确认'),
  ).length;
  const confirmedCount = dataObj.list.filter((item) =>
    isStatusLabel(item.status, '已确认'),
  ).length;

  return {
    confirmedCount,
    pendingCount,
  };
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    const values = await formApi.getValues();
    try {
      await createHandoverLog({
        ...values,
        handoverDate: dayjs(values.handoverDate).valueOf(),
        status: '待确认',
      });
      ElMessage.success('新增交接日志成功');
      formDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error(error);
      ElMessage.error('新增交接日志失败');
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    formData.value = formDrawerApi.getData() || {};
    await formApi.resetForm();
    await formApi.setValues(formData.value);
  },
});

function buildQueryParams(page) {
  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    userName: filterUserName.value,
    handoverDate: filterHandoverDate.value || dataObj.searchParams.handoverDate,
    status: filterStatus.value || dataObj.searchParams.status,
    confirmUserId:
      filterConfirmUserId.value || dataObj.searchParams.confirmUserId,
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
    const response = await getHandoverLogPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];

    // if (list.length === 0 && !pageResult?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    dataObj.useStaticData = false;
    dataObj.total = pageResult.total || 0;
    dataObj.list = list.map((item) => normalizeHandoverLogRow(item));
  } catch (error) {
    console.error('获取交接日志数据失败，使用静态数据:', error);
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
    const data = await exportHandoverLog(buildQueryParams(dataObj));
    downloadFileFromBlobPart({ fileName: textObj.excelAllName, source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}

function handleCreate() {
  formDrawerApi
    .setData({ handoverDate: new Date().toISOString().slice(0, 10) })
    .open();
}

function handleConfirm(row) {
  statusConfirmDialogRef.value?.open(row);
}

function onSubmit(values) {
  dataObj.searchParams = { ...values };
  filterHandoverDate.value = '';
  filterTrendTime.value = '';
  gridApi.reload();
  drawerApi.close();
}

async function handleOpenDetail(row) {
  try {
    const response = await getHandoverLogDetail(row.id);
    const detail = response?.id ? response : response?.data || response;
    dataObj.detailObj = normalizeHandoverLogRow(detail || row);
  } catch (error) {
    console.error('获取交接日志详情失败，使用行数据:', error);
    dataObj.detailObj = row;
  }
  detailDrawerRef.value?.open();
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
  dataObj.detailObj = row;
  detailDrawerRef.value?.open();
}

function handleDateClick(date) {
  filterHandoverDate.value = filterHandoverDate.value === date ? '' : date;
  filterTrendTime.value = '';
  gridApi.query();
}

function handleStatusClick(status) {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
}

function handleConfirmUserClick(confirmUserId) {
  if (!confirmUserId) return;
  filterConfirmUserId.value =
    Number(filterConfirmUserId.value) === Number(confirmUserId)
      ? ''
      : confirmUserId;
  gridApi.query();
}

function cancelFilter(type) {
  const clearMap = {
    confirmUserId: () => {
      filterConfirmUserId.value = '';
    },
    date: () => {
      filterHandoverDate.value = '';
    },
    status: () => {
      filterStatus.value = '';
    },
    trendTime: () => {
      filterTrendTime.value = '';
    },
    userName: () => {
      filterUserName.value = '';
    },
  };

  clearMap[type]?.();
  gridApi.query();
}

watch(
  () => props.chartFilter,
  (filter) => {
    if (!filter) return;
    if (filter.type === 'status') {
      filterStatus.value = filter.value;
    }
    if (filter.type === 'trendTime') {
      filterTrendTime.value = filter.value;
      filterHandoverDate.value = '';
    }
    gridApi.query();
  },
  { deep: true },
);

onMounted(() => {
  loadScheduleUserOptions();
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="textObj.addText">
      <Form />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="dataObj.detailObj"
      :fields="detailFields"
      :title="`${dataObj.detailObj.userName || '交接日志'}详情`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="handover-log-filter-tags">
          <ElTag
            v-if="filterUserName"
            closable
            type="success"
            @close="cancelFilter('userName')"
          >
            交接人员：{{ filterUserName }}
          </ElTag>
          <ElTag
            v-if="filterHandoverDate"
            closable
            type="primary"
            @close="cancelFilter('date')"
          >
            交接日期：{{ dayjs(filterHandoverDate).format('YYYY-MM-DD') }}
          </ElTag>
          <ElTag
            v-if="filterStatus"
            closable
            type="warning"
            @close="cancelFilter('status')"
          >
            日志状态：{{ getStatusLabel(filterStatus) }}
          </ElTag>
          <ElTag
            v-if="filterConfirmUserId"
            closable
            type="info"
            @close="cancelFilter('confirmUserId')"
          >
            确认人员：{{ getUserName(filterConfirmUserId) }}
          </ElTag>
          <ElTag
            v-if="filterTrendTime"
            closable
            type="danger"
            @close="cancelFilter('trendTime')"
          >
            趋势时间：{{ filterTrendTime }}
          </ElTag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
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

      <template #handoverDateStr="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleDateClick(row.handoverDate)"
        >
          {{ dayjs(row.handoverDate).format('YYYY-MM-DD') }}
        </el-text>
      </template>

      <template #status="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getStatusTagType(row.status)"
          @click="handleStatusClick(row.status)"
        >
          {{ getStatusLabel(row.status) }}
        </ElTag>
      </template>

      <template #confirmUserName="{ row }">
        <el-text
          v-if="row.confirmUserId"
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleConfirmUserClick(row.confirmUserId)"
        >
          {{ row.confirmUserName }}
        </el-text>
        <span v-else>-</span>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="isStatusLabel(row.status, '待确认')"
            content="确认"
            icon-name="Select"
            @click="handleConfirm(row)"
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
            本页统计：日志 {{ dataObj.list.length }} 条；待确认
            {{ currentPageStats.pendingCount }} 条；已确认
            {{ currentPageStats.confirmedCount }} 条
          </span>
        </div>
        <div v-if="dataObj.totalShow" class="common-total-bottom">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>

    <StatusConfirmDialog
      ref="statusConfirmDialogRef"
      @success="handleRefresh"
    />
  </div>
</template>

<style scoped>
.handover-log-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.handover-log-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}
</style>
