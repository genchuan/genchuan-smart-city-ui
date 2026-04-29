<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElLoading, ElMessage, ElMessageBox, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteInspectUser,
  exportInspectUser,
  getInspectUserDetail,
  getInspectUserPage,
} from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectUser';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import ImportExcelDialog from '../components/ImportExcelDialog.vue';
import StatusConfirmDialog from '../components/StatusConfirmDialog.vue';
import UserFormDrawer from '../components/UserFormDrawer.vue';
import {
  detailFields,
  deviceDetailFields,
  filterInspectUserRows,
  filterMockList,
  getDeviceDetail,
  getOnlineStatusLabel,
  getOnlineStatusTagType,
  getUserStatusLabel,
  getUserStatusTagType,
  isOnlineStatusLabel,
  isUserStatusLabel,
  normalizeInspectUserRow,
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
const deviceDetailDrawerRef = ref(null);
const formDrawerRef = ref(null);
const importExcelDialogRef = ref(null);
const statusConfirmDialogRef = ref(null);
const checkedRows = ref([]);
const filterArea = ref('');
const filterStatus = ref('');
const filterOnlineStatus = ref('');

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  deviceDetailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
  useStaticData: false,
});

const currentPageStats = computed(() => {
  let normalCount = 0;
  let disabledCount = 0;
  let onlineCount = 0;

  for (const item of dataObj.list) {
    if (isUserStatusLabel(item.status, '正常')) normalCount += 1;
    if (isUserStatusLabel(item.status, '禁用')) disabledCount += 1;
    if (isOnlineStatusLabel(item.onlineStatus, '在线')) onlineCount += 1;
  }

  return {
    normalCount,
    disabledCount,
    onlineCount,
  };
});

function buildQueryParams(page) {
  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    area: filterArea.value || dataObj.searchParams.area,
    status: filterStatus.value || dataObj.searchParams.status,
    onlineStatus: filterOnlineStatus.value || dataObj.searchParams.onlineStatus,
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
    const response = await getInspectUserPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];

    // if (list.length === 0 && !pageResult?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    const normalizedList = list.map((item) => normalizeInspectUserRow(item));
    const visibleList =
      filterArea.value || filterStatus.value || filterOnlineStatus.value
        ? filterInspectUserRows(normalizedList, queryParams)
        : normalizedList;

    dataObj.useStaticData = false;
    dataObj.total =
      filterArea.value || filterStatus.value || filterOnlineStatus.value
        ? visibleList.length
        : pageResult.total || 0;
    dataObj.list = visibleList;
  } catch (error) {
    console.error('获取巡检人员数据失败，使用静态数据:', error);
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
}

function handleRefresh() {
  gridApi.query();
}

function handleCreate() {
  formDrawerRef.value?.open();
}

function handleImport() {
  importExcelDialogRef.value?.open();
}

async function handleExport() {
  try {
    const data = await exportInspectUser(buildQueryParams(dataObj));
    downloadFileFromBlobPart({ fileName: textObj.excelAllName, source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}

function onSubmit(values) {
  dataObj.searchParams = { ...values };
  gridApi.reload();
  drawerApi.close();
}

async function handleOpenDetail(row) {
  try {
    const response = await getInspectUserDetail(row.id);
    dataObj.detailObj = normalizeInspectUserRow(response || row);
  } catch (error) {
    console.error('获取巡检人员详情失败，使用行数据:', error);
    dataObj.detailObj = normalizeInspectUserRow(row);
  }
  detailDrawerRef.value?.open();
}

function handleEdit(row) {
  formDrawerRef.value?.open(row);
}

function handleEnable(row) {
  statusConfirmDialogRef.value?.open('enable', row);
}

function handleDisable(row) {
  statusConfirmDialogRef.value?.open('disable', row);
}

function handleDeviceClick(row) {
  dataObj.deviceDetailObj = getDeviceDetail(row);
  deviceDetailDrawerRef.value?.open();
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

async function handleDelete(row) {
  await ElMessageBox.confirm('确定删除该巡检人员吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  const loadingInstance = ElLoading.service({ text: '删除中...' });
  try {
    await deleteInspectUser(row.id);
    ElMessage.success('删除成功');
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
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

function handleOnlineStatusClick(onlineStatus) {
  filterOnlineStatus.value =
    filterOnlineStatus.value === onlineStatus ? '' : onlineStatus;
  gridApi.query();
}

function cancelFilter(type) {
  const clearMap = {
    area: () => {
      filterArea.value = '';
    },
    onlineStatus: () => {
      filterOnlineStatus.value = '';
    },
    status: () => {
      filterStatus.value = '';
    },
  };

  clearMap[type]?.();
  gridApi.query();
}

watch(
  () => props.chartFilter,
  (filter) => {
    if (!filter) return;
    if (filter.type === 'area') {
      filterArea.value = filter.value;
    }
    if (filter.type === 'onlineStatus') {
      filterOnlineStatus.value = filter.value;
    }
    if (filter.type === 'status') {
      filterStatus.value = filter.value || '';
      if (!filter.value) filterOnlineStatus.value = '';
    }
    gridApi.reload();
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
      :title="`${dataObj.detailObj.name || '巡检人员'}详情`"
    />
    <DetailDrawer
      ref="deviceDetailDrawerRef"
      :data="dataObj.deviceDetailObj"
      :fields="deviceDetailFields"
      :title="`${dataObj.deviceDetailObj.name || '绑定设备'}详情`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="inspect-user-filter-tags">
          <ElTag
            v-if="filterArea"
            closable
            type="primary"
            @close="cancelFilter('area')"
          >
            所属片区：{{ filterArea }}
          </ElTag>
          <ElTag
            v-if="filterStatus"
            closable
            :type="getUserStatusTagType(filterStatus)"
            @close="cancelFilter('status')"
          >
            人员状态：{{ getUserStatusLabel(filterStatus) }}
          </ElTag>
          <ElTag
            v-if="filterOnlineStatus"
            closable
            :type="getOnlineStatusTagType(filterOnlineStatus)"
            @close="cancelFilter('onlineStatus')"
          >
            在线状态：{{ getOnlineStatusLabel(filterOnlineStatus) }}
          </ElTag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导入" icon-name="Upload" @click="handleImport" />
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

      <template #deviceName="{ row }">
        <el-text
          v-if="row.deviceId"
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleDeviceClick(row)"
        >
          {{ row.deviceName }}
        </el-text>
        <span v-else>-</span>
      </template>

      <template #status="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getUserStatusTagType(row.status)"
          @click="handleStatusClick(row.status)"
        >
          {{ getUserStatusLabel(row.status) }}
        </ElTag>
      </template>

      <template #onlineStatus="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getOnlineStatusTagType(row.onlineStatus)"
          @click="handleOnlineStatusClick(row.onlineStatus)"
        >
          {{ getOnlineStatusLabel(row.onlineStatus) }}
        </ElTag>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="isUserStatusLabel(row.status, '正常')"
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            v-if="isUserStatusLabel(row.status, '正常')"
            content="禁用"
            icon-name="VideoPause"
            @click="handleDisable(row)"
          />
          <IconButton
            v-if="isUserStatusLabel(row.status, '禁用')"
            content="启用"
            icon-name="CircleCheckFilled"
            @click="handleEnable(row)"
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
            本页统计：人员 {{ dataObj.list.length }} 人；正常
            {{ currentPageStats.normalCount }} 人；禁用
            {{ currentPageStats.disabledCount }} 人；在线
            {{ currentPageStats.onlineCount }} 人
          </span>
        </div>
        <div v-if="dataObj.totalShow" class="common-total-bottom">
          <span>全部统计：共 {{ dataObj.total }} 人；{{ textObj.total }}</span>
        </div>
      </template>
    </Grid>

    <UserFormDrawer ref="formDrawerRef" @success="handleRefresh" />
    <ImportExcelDialog ref="importExcelDialogRef" @success="handleRefresh" />
    <StatusConfirmDialog
      ref="statusConfirmDialogRef"
      @success="handleRefresh"
    />
  </div>
</template>

<style scoped>
.inspect-user-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.inspect-user-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}
</style>
