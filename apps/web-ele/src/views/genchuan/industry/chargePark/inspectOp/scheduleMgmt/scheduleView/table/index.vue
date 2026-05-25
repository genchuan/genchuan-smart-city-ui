<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';
import dayjs from 'dayjs';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  applyScheduleShift,
  exportScheduleView,
  getScheduleViewDetail,
  getScheduleViewPage,
} from '#/api/genchuan/industry/chargePark/inspectOp/scheduleMgmt/scheduleView';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import {
  detailFields,
  filterMockList,
  getApplyStatusLabel,
  getApplyStatusTagType,
  getScheduleStatusLabel,
  getScheduleStatusTagType,
  getShiftTypeLabel,
  getShiftTypeTagType,
  isApplyStatusLabel,
  isScheduleStatusLabel,
  loadScheduleUserOptions,
  normalizeScheduleViewRow,
  textObj,
  useGridColumns,
  useSearchFormSchema,
  useShiftApplyFormSchema,
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
const applyRow = ref({});
const checkedIds = ref([]);
const checkedRows = ref([]);
const filterUserName = ref('');
const filterScheduleDate = ref('');
const filterShiftType = ref('');
const filterPositionName = ref('');
const filterStatus = ref('');
const filterApplyStatus = ref('');

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
    isScheduleStatusLabel(item.status, '正常'),
  ).length;
  const changedCount = dataObj.list.filter((item) =>
    isScheduleStatusLabel(item.status, '已换班'),
  ).length;
  const applyingCount = dataObj.list.filter((item) =>
    isApplyStatusLabel(item.shiftApplyStatus, '申请中'),
  ).length;

  return {
    applyingCount,
    changedCount,
    normalCount,
  };
});

const [ApplyForm, applyFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useShiftApplyFormSchema(),
  showDefaultActions: false,
});

const [ApplyDrawer, applyDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    applyDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await applyFormApi.validate();
    if (!valid) return;

    const values = await applyFormApi.getValues();
    if (Number(values.targetUserId) === Number(applyRow.value.userId)) {
      ElMessage.warning('换班对象不能是当前排班人员');
      return;
    }

    try {
      await applyScheduleShift({
        id: applyRow.value.id,
        targetUserId: values.targetUserId,
        newDate: values.newDate,
        newShiftType: values.newShiftType,
        applyRemark: values.applyRemark,
      });
      ElMessage.success('换班申请提交成功');
      applyDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error(error);
      ElMessage.error('换班申请提交失败');
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    applyRow.value = applyDrawerApi.getData() || {};
    await applyFormApi.resetForm();
    await applyFormApi.setValues({
      ...applyRow.value,
      newDate: applyRow.value.scheduleDate,
      newShiftType: applyRow.value.shiftType,
    });
  },
});

function buildQueryParams(page) {
  console.log( dataObj.searchParams);
  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    userId: filterUserName.value?.value || dataObj.searchParams.userId,
    scheduleDate: filterScheduleDate.value || dataObj.searchParams.scheduleDate,
    shiftType: filterShiftType.value || dataObj.searchParams.shiftType,
    positionName: filterPositionName.value || dataObj.searchParams.positionName,
    status: filterStatus.value || dataObj.searchParams.status,
    shiftApplyStatus:
      filterApplyStatus.value || dataObj.searchParams.shiftApplyStatus,
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
    const response = await getScheduleViewPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];

    // if (list.length === 0 && !pageResult?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    dataObj.useStaticData = false;
    dataObj.total = pageResult.total || 0;
    dataObj.list = list.map((item) => normalizeScheduleViewRow(item));
  } catch (error) {
    console.error('获取排班查看数据失败，使用静态数据:', error);
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
    const data = await exportScheduleView(buildQueryParams(dataObj));
    downloadFileFromBlobPart({ fileName: textObj.excelAllName, source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}

function handleApplyShift(row) {
  applyDrawerApi.setData(row).open();
}

function onSubmit(values) {
  dataObj.searchParams = { ...values };
  filterScheduleDate.value = '';
  gridApi.reload();
  drawerApi.close();
}

async function handleOpenDetail(row) {
  try {
    const response = await getScheduleViewDetail(row.id);
    const detail = response?.id ? response : response?.data || response;
    dataObj.detailObj = normalizeScheduleViewRow(detail || row);
  } catch (error) {
    console.error('获取排班详情失败，使用行数据:', error);
    dataObj.detailObj = row;
  }
  detailDrawerRef.value?.open();
}

function handleRecordDetail(row) {
  dataObj.detailObj = row;
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
  filterScheduleDate.value = filterScheduleDate.value === date ? '' : date;
  gridApi.query();
}

function handleShiftTypeClick(shiftType) {
  filterShiftType.value = filterShiftType.value === shiftType ? '' : shiftType;
  gridApi.query();
}

function handlePositionClick(positionName) {
  filterPositionName.value =
    filterPositionName.value === positionName ? '' : positionName;
  gridApi.query();
}

function handleStatusClick(status) {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
}

function handleApplyStatusClick(status) {
  filterApplyStatus.value = filterApplyStatus.value === status ? '' : status;
  gridApi.query();
}

function cancelFilter(type) {
  const clearMap = {
    applyStatus: () => {
      filterApplyStatus.value = '';
    },
    date: () => {
      filterScheduleDate.value = '';
    },
    position: () => {
      filterPositionName.value = '';
    },
    shiftType: () => {
      filterShiftType.value = '';
    },
    status: () => {
      filterStatus.value = '';
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
    if (filter.type === 'scheduleDate') {
      filterScheduleDate.value = filter.value;
    }
    if (filter.type === 'userName') {
      filterUserName.value = filter.value;
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
    <ApplyDrawer :title="textObj.applyText">
      <ApplyForm />
    </ApplyDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="dataObj.detailObj"
      :fields="detailFields"
      :title="`${dataObj.detailObj.userName || '排班'}详情`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="schedule-view-filter-tags">
          <ElTag
            v-if="filterUserName"
            closable
            type="success"
            @close="cancelFilter('userName')"
          >
            关联人员：{{ filterUserName?.label }}
          </ElTag>
          <ElTag
            v-if="filterScheduleDate"
            closable
            type="primary"
            @close="cancelFilter('date')"
          >
            排班日期：{{ dayjs(filterScheduleDate).format('YYYY-MM-DD HH:mm:ss') }}
          </ElTag>
          <ElTag
            v-if="filterShiftType"
            closable
            type="warning"
            @close="cancelFilter('shiftType')"
          >
            排班时段：{{ getShiftTypeLabel(filterShiftType) }}
          </ElTag>
          <ElTag
            v-if="filterPositionName"
            closable
            type="info"
            @close="cancelFilter('position')"
          >
            所属岗位：{{ filterPositionName }}
          </ElTag>
          <ElTag
            v-if="filterStatus"
            closable
            type="danger"
            @close="cancelFilter('status')"
          >
            排班状态：{{ getScheduleStatusLabel(filterStatus) }}
          </ElTag>
          <ElTag
            v-if="filterApplyStatus"
            closable
            type="warning"
            @close="cancelFilter('applyStatus')"
          >
            换班状态：{{ getApplyStatusLabel(filterApplyStatus) }}
          </ElTag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
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

      <template #scheduleDateStr="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleDateClick(row.scheduleDate)"
        >
          <!-- {{ row.scheduleDateStr }} -->
          {{ dayjs(row.scheduleDate).format('YYYY-MM-DD HH:mm:ss') }}
        </el-text>
      </template>

      <template #shiftType="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getShiftTypeTagType(row.shiftType)"
          @click="handleShiftTypeClick(row.shiftType)"
        >
          {{ getShiftTypeLabel(row.shiftType) }}
        </ElTag>
      </template>

      <template #positionName="{ row }">
        <!--  class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handlePositionClick(row.positionName)" -->
        <el-text
        >
          {{ row.positionName }}
        </el-text>
      </template>

      <template #status="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getScheduleStatusTagType(row.status)"
          @click="handleStatusClick(row.status)"
        >
          {{ getScheduleStatusLabel(row.status) }}
        </ElTag>
      </template>

      <template #shiftApplyStatus="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getApplyStatusTagType(row.shiftApplyStatus)"
          @click="handleApplyStatusClick(row.shiftApplyStatus)"
        >
          {{ getApplyStatusLabel(row.shiftApplyStatus) }}
        </ElTag>
      </template>

      <template #applyRecord="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleRecordDetail(row)"
        >
          {{ row.applyRecord }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="
              isScheduleStatusLabel(row.status, '正常') &&
              !isApplyStatusLabel(row.shiftApplyStatus, '申请中')
            "
            content="申请换班"
            icon-name="Switch"
            @click="handleApplyShift(row)"
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
            本页统计：排班 {{ dataObj.list.length }} 条；正常
            {{ currentPageStats.normalCount }} 条；已换班
            {{ currentPageStats.changedCount }} 条；申请中
            {{ currentPageStats.applyingCount }} 条
          </span>
        </div>
        <div v-if="dataObj.totalShow" class="common-total-bottom">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.schedule-view-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.schedule-view-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}
</style>
