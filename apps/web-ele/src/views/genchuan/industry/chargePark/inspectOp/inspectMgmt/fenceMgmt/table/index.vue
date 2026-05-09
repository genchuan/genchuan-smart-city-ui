<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElLoading, ElMessage, ElMessageBox, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteFenceMgmt,
  getFenceMgmtDetail,
  getFenceMgmtPage,
} from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/fenceMgmt';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import AlarmDetailDialog from '../components/AlarmDetailDialog.vue';
import FenceFormDrawer from '../components/FenceFormDrawer.vue';
import StatusConfirmDialog from '../components/StatusConfirmDialog.vue';
import {
  detailFields,
  filterFenceRows,
  filterMockList,
  getFenceStatusLabel,
  getFenceStatusTagType,
  getUserName,
  isFenceStatusLabel,
  loadFenceUserOptions,
  normalizeFenceMgmtRow,
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
const formDrawerRef = ref(null);
const statusConfirmDialogRef = ref(null);
const alarmDetailDialogRef = ref(null);
const checkedIds = ref([]);
const checkedRows = ref([]);
const filterUserId = ref('');
const filterAreaLabel = ref('');
const filterStatus = ref('');
const filterAlarmed = ref(false);

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
  let enabledCount = 0;
  let disabledCount = 0;
  let alarmCount = 0;

  for (const item of dataObj.list) {
    if (isFenceStatusLabel(item.status, '已生效')) enabledCount += 1;
    if (isFenceStatusLabel(item.status, '未生效')) disabledCount += 1;
    alarmCount += Number(item.alarmCount || 0);
  }

  return {
    enabledCount,
    disabledCount,
    alarmCount,
  };
});

function buildQueryParams(page) {
  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    userId: filterUserId.value || dataObj.searchParams.userId,
    status: filterStatus.value || dataObj.searchParams.status,
    areaLabel: filterAreaLabel.value,
    alarmed: filterAlarmed.value,
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
    const response = await getFenceMgmtPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];

    // if (list.length === 0 && !pageResult?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    const normalizedList = list.map((item) => normalizeFenceMgmtRow(item));
    const visibleList =
      filterAreaLabel.value || filterAlarmed.value
        ? filterFenceRows(normalizedList, queryParams)
        : normalizedList;

    dataObj.useStaticData = false;
    dataObj.total =
      filterAreaLabel.value || filterAlarmed.value
        ? visibleList.length
        : pageResult.total || 0;
    dataObj.list = visibleList;
  } catch (error) {
    console.error('获取电子围栏数据失败，使用静态数据:', error);
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

function handleCreate() {
  formDrawerRef.value?.open();
}

// function getSingleCheckedRow(tip) {
//   if (checkedRows.value.length !== 1) {
//     ElMessage.warning(tip);
//     return null;
//   }
//   return checkedRows.value[0];
// }

// function handleEditSelected() {
//   const row = getSingleCheckedRow('请选择一条电子围栏进行编辑');
//   if (!row) return;
//   formDrawerRef.value?.open(row);
// }

// function handleSaveSelected() {
//   const row = getSingleCheckedRow('请选择一条电子围栏进行保存');
//   if (!row) return;
//   formDrawerRef.value?.open(row);
// }

async function handleDelete(row) {
  await ElMessageBox.confirm('确定删除该电子围栏吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  const loadingInstance = ElLoading.service({ text: '删除中...' });
  try {
    await deleteFenceMgmt(row.id);
    ElMessage.success('删除成功');
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}
function onSubmit(values) {
  dataObj.searchParams = { ...values };
  filterAlarmed.value = false;
  gridApi.reload();
  drawerApi.close();
}

async function handleOpenDetail(row) {
  try {
    const response = await getFenceMgmtDetail(row.id);
    dataObj.detailObj = normalizeFenceMgmtRow(response || row);
  } catch (error) {
    console.error('获取电子围栏详情失败，使用行数据:', error);
    dataObj.detailObj = normalizeFenceMgmtRow(row);
  }
  detailDrawerRef.value?.open();
}

function handleEnable(row) {
  statusConfirmDialogRef.value?.open('enable', row);
}

function handleDisable(row) {
  statusConfirmDialogRef.value?.open('disable', row);
}

function handleEdit(row) {
  formDrawerRef.value?.open(row);
}

// function handleAlarmClick(row) {
//   if (!row.alarmCount) {
//     ElMessage.info('当前围栏暂无告警明细');
//     return;
//   }
//   alarmDetailDialogRef.value?.open(row);
// }

function handleSearchShow() {
  drawerApi.open();
}

function handleFullShow() {
  screenfull.toggle();
}

function changeTotalShow() {
  dataObj.totalShow = !dataObj.totalShow;
}

function handleAreaClick(areaLabel) {
  if (!areaLabel) return;
  filterAreaLabel.value = filterAreaLabel.value === areaLabel ? '' : areaLabel;
  gridApi.query();
}

function handleUserClick(userId) {
  if (!userId) return;
  filterUserId.value =
    Number(filterUserId.value) === Number(userId) ? '' : userId;
  gridApi.query();
}

function handleStatusClick(status) {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
}

function cancelFilter(type) {
  const clearMap = {
    alarmed: () => {
      filterAlarmed.value = false;
    },
    areaLabel: () => {
      filterAreaLabel.value = '';
    },
    status: () => {
      filterStatus.value = '';
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
    console.log('filter', filter);
    if (filter.type === 'status') {
      filterStatus.value = filter.value || '';
      filterAlarmed.value = false;
    }
    if (filter.type === 'alarmed') {
      filterAlarmed.value = filter.value ?? false;
    }
    if (filter.type === 'fence') {
      dataObj.detailObj = normalizeFenceMgmtRow(filter.value || {});
      detailDrawerRef.value?.open();
      return;
    }
    gridApi.reload();
  },
  { deep: true },
);

onMounted(() => {
  loadFenceUserOptions();
});
</script>

<template>
  <div class="park-lot-table-new">
    <DetailDrawer
      ref="detailDrawerRef"
      :data="dataObj.detailObj"
      :fields="detailFields"
      :title="`${dataObj.detailObj.name || '电子围栏'}详情`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="fence-filter-tags">
          <ElTag
            v-if="filterUserId"
            closable
            type="primary"
            @close="cancelFilter('userId')"
          >
            巡检人员：{{ getUserName(filterUserId) }}
          </ElTag>
          <ElTag
            v-if="filterAreaLabel"
            closable
            type="success"
            @close="cancelFilter('areaLabel')"
          >
            围栏区域：{{ filterAreaLabel }}
          </ElTag>
          <ElTag
            v-if="filterStatus"
            closable
            :type="getFenceStatusTagType(filterStatus)"
            @close="cancelFilter('status')"
          >
            围栏状态：{{ getFenceStatusLabel(filterStatus) }}
          </ElTag>
          <ElTag
            v-if="filterAlarmed"
            closable
            type="danger"
            @close="cancelFilter('alarmed')"
          >
            告警围栏
          </ElTag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <!-- <IconButton
            content="编辑"
            icon-name="Edit"
            :disabled="isEmpty(checkedIds)"
            @click="handleEditSelected"
          />
          <IconButton
            content="保存"
            icon-name="Check"
            :disabled="isEmpty(checkedIds)"
            @click="handleSaveSelected"
          /> -->
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

      <template #name="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleOpenDetail(row)"
        >
          {{ row.name }}
        </el-text>
      </template>

      <template #areaText="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleAreaClick(row.areaLabel)"
        >
          {{ row.areaText }}
        </el-text>
      </template>

      <template #userName="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleUserClick(row.userId)"
        >
          {{ row.userName }}
        </el-text>
      </template>

      <template #status="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getFenceStatusTagType(row.status)"
          @click="handleStatusClick(row.status)"
        >
          {{ getFenceStatusLabel(row.status) }}
        </ElTag>
      </template>

      <template #alarmText="{ row }">
        <el-text
          class="common-align"
          :style="{ cursor: row.alarmCount ? 'pointer' : 'default' }"
          :type="row.alarmCount ? 'danger' : 'info'"
          @click="handleOpenDetail(row)"
        >
          {{ row.alarmText }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="isFenceStatusLabel(row.status, '未生效')"
            content="生效"
            icon-name="CircleCheckFilled"
            @click="handleEnable(row)"
          />
          <IconButton
            v-if="isFenceStatusLabel(row.status, '已生效')"
            content="禁用"
            icon-name="VideoPause"
            @click="handleDisable(row)"
          />
          <IconButton
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDelete(row)"
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
            本页统计：围栏 {{ dataObj.list.length }} 个；已生效
            {{ currentPageStats.enabledCount }} 个；未生效
            {{ currentPageStats.disabledCount }} 个；告警
            {{ currentPageStats.alarmCount }} 次
          </span>
        </div>
        <div v-if="dataObj.totalShow" class="common-total-bottom">
          <span>全部统计：共 {{ dataObj.total }} 个；{{ textObj.total }}</span>
        </div>
      </template>
    </Grid>

    <FenceFormDrawer
      ref="formDrawerRef"
      :existing-rows="dataObj.list"
      @success="handleRefresh"
    />
    <StatusConfirmDialog
      ref="statusConfirmDialogRef"
      @success="handleRefresh"
    />
    <AlarmDetailDialog ref="alarmDetailDialogRef" />
  </div>
</template>

<style scoped>
.fence-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.fence-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}
</style>
