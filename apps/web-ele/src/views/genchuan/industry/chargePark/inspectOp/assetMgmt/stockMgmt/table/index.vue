<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  allocateAssetStock,
  exportAssetStock,
  getAssetStockDetail,
  getAssetStockPage,
  updateAssetStock,
} from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/stockMgmt';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import StatusConfirmDialog from '../components/StatusConfirmDialog.vue';
import {
  detailFields,
  filterMockList,
  getStationName,
  getStockProgressStatus,
  getStockStatusLabel,
  getStockStatusTagType,
  isStockStatusLabel,
  normalizeAssetStockRow,
  textObj,
  useAllocateFormSchema,
  useGridColumns,
  useReplenishFormSchema,
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

const actionTitle = computed(() =>
  actionType.value === 'replenish'
    ? textObj.replenishText
    : textObj.allocateText,
);

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
const checkedIds = ref([]);
const checkedRows = ref([]);
const actionType = ref('allocate');
const actionRow = ref({});
const filterAssetId = ref('');
const filterAssetName = ref('');
const filterStationId = ref('');
const filterStatus = ref('');
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
  const totalStock = dataObj.list.reduce(
    (sum, item) => sum + Number(item.currentStock || 0),
    0,
  );
  const lowCount = dataObj.list.filter((item) =>
    isStockStatusLabel(item.status, '低库存'),
  ).length;
  const warnCount = dataObj.list.filter((item) =>
    isStockStatusLabel(item.status, '预警库存'),
  ).length;

  return {
    totalStock,
    lowCount,
    warnCount,
  };
});

const [ActionForm, actionFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useAllocateFormSchema(),
  showDefaultActions: false,
});

const [ActionDrawer, actionDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    actionDrawerApi.close();
  },
  async onConfirm() {
    const { valid } = await actionFormApi.validate();
    if (!valid) return;

    const values = await actionFormApi.getValues();
    try {
      if (actionType.value === 'allocate') {
        const allocateCount = Number(values.allocateCount || 0);
        if (
          Number(values.targetStationId) === Number(actionRow.value.stationId)
        ) {
          ElMessage.warning('目标仓库不能与来源仓库相同');
          return;
        }
        if (allocateCount > Number(actionRow.value.currentStock || 0)) {
          ElMessage.warning('调配数量不能大于当前库存');
          return;
        }
        await allocateAssetStock({
          id: actionRow.value.id,
          targetStationId: values.targetStationId,
          allocateCount,
        });
        ElMessage.success('库存调配成功');
      }

      if (actionType.value === 'replenish') {
        await updateAssetStock({
          ...actionRow.value,
          id: actionRow.value.id,
          currentStock: Number(values.currentStock || 0),
          replenishCount: Number(values.replenishCount || 0),
        });
        ElMessage.success('库存补货成功');
      }

      actionDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error(error);
      ElMessage.error(
        actionType.value === 'allocate' ? '调配失败' : '补货失败',
      );
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    actionRow.value = actionDrawerApi.getData() || {};
    await actionFormApi.resetForm();
    await actionFormApi.setValues(actionRow.value);
  },
});

function buildQueryParams(page) {
  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    assetId: filterAssetId.value || dataObj.searchParams.assetId,
    assetName: filterAssetName.value,
    stationId: filterStationId.value || dataObj.searchParams.stationId,
    status: filterStatus.value || dataObj.searchParams.status,
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
    const response = await getAssetStockPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];

    // if (list.length === 0 && !pageResult?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    dataObj.useStaticData = false;
    dataObj.total = pageResult.total || 0;
    dataObj.list = list.map((item) => normalizeAssetStockRow(item));
  } catch (error) {
    console.error('获取库存管理数据失败，使用静态数据:', error);
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
    const data = await exportAssetStock(buildQueryParams(dataObj));
    downloadFileFromBlobPart({ fileName: textObj.excelAllName, source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}

async function handleAllocate() {
  if (checkedRows.value.length !== 1) {
    ElMessage.warning('请选择一条库存记录进行调配');
    return;
  }
  actionType.value = 'allocate';
  await actionFormApi.setState({ schema: useAllocateFormSchema() });
  actionDrawerApi.setData(checkedRows.value[0]).open();
}

async function handleReplenish(row) {
  actionType.value = 'replenish';
  await actionFormApi.setState({ schema: useReplenishFormSchema() });
  actionDrawerApi.setData(row).open();
}

function handleAlarm(row) {
  statusConfirmDialogRef.value?.open(row);
}

function onSubmit(values) {
  dataObj.searchParams = { ...values };
  filterTrendTime.value = '';
  gridApi.reload();
  drawerApi.close();
}

async function handleOpenDetail(row) {
  try {
    const response = await getAssetStockDetail(row.id);
    const detail = response?.id ? response : response?.data || response;
    dataObj.detailObj = normalizeAssetStockRow(detail || row);
  } catch (error) {
    console.error('获取库存详情失败，使用行数据:', error);
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

function handleAssetClick(row) {
  dataObj.detailObj = row;
  detailDrawerRef.value?.open();
}

function handleStatusClick(status) {
  filterStatus.value = filterStatus.value === status ? '' : status;
  filterTrendTime.value = '';
  gridApi.query();
}

function handleStationClick(stationId) {
  filterStationId.value =
    Number(filterStationId.value) === Number(stationId) ? '' : stationId;
  gridApi.query();
}

function cancelFilter(type) {
  const clearMap = {
    assetName: () => {
      filterAssetName.value = '';
    },
    stationId: () => {
      filterStationId.value = '';
    },
    status: () => {
      filterStatus.value = '';
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
    if (filter.type === 'status') {
      filterStatus.value = filter.value;
      filterTrendTime.value = '';
    }
    if (filter.type === 'trendTime') {
      filterTrendTime.value = filter.value;
    }
    if (filter.type === 'assetName') {
      filterAssetName.value = filter.value;
    }
    gridApi.query();
  },
  { deep: true },
);
</script>

<template>
  <div class="park-lot-table-new">
    <ActionDrawer :title="actionTitle">
      <ActionForm />
    </ActionDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="dataObj.detailObj"
      :fields="detailFields"
      :title="`${dataObj.detailObj.assetName || '库存'}详情`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="stock-mgmt-filter-tags">
          <ElTag
            v-if="filterAssetName"
            closable
            type="success"
            @close="cancelFilter('assetName')"
          >
            关联资产：{{ filterAssetName }}
          </ElTag>
          <ElTag
            v-if="filterStatus"
            closable
            type="warning"
            @close="cancelFilter('status')"
          >
            库存状态：{{ getStockStatusLabel(filterStatus) }}
          </ElTag>
          <ElTag
            v-if="filterStationId"
            closable
            type="primary"
            @close="cancelFilter('stationId')"
          >
            所属仓库：{{ getStationName(filterStationId) }}
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
          <IconButton content="调配" icon-name="Sort" @click="handleAllocate" />
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

      <template #assetName="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleAssetClick(row)"
        >
          {{ row.assetName }}
        </el-text>
      </template>

      <template #currentStock="{ row }">
        <div class="stock-progress">
          <el-progress
            :percentage="
              Math.min(
                100,
                Math.round(
                  (row.currentStock / Math.max(row.warnThreshold * 3, 1)) * 100,
                ),
              )
            "
            :show-text="false"
            :status="getStockProgressStatus(row)"
          />
          <span>{{ row.currentStock }}</span>
        </div>
      </template>

      <template #status="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getStockStatusTagType(row.status)"
          @click="handleStatusClick(row.status)"
        >
          {{ getStockStatusLabel(row.status) }}
        </ElTag>
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

      <template #replenishRecord="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleRecordDetail(row)"
        >
          {{ row.replenishRecord }}
        </el-text>
      </template>

      <template #allocateRecord="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleRecordDetail(row)"
        >
          {{ row.allocateRecord }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="!isStockStatusLabel(row.status, '正常')"
            content="补货"
            icon-name="Plus"
            @click="handleReplenish(row)"
          />
          <IconButton
            v-if="isStockStatusLabel(row.status, '预警库存')"
            content="告警"
            icon-name="WarningFilled"
            @click="handleAlarm(row)"
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
            本页统计：库存合计 {{ currentPageStats.totalStock }}；低库存
            {{ currentPageStats.lowCount }} 条；预警库存
            {{ currentPageStats.warnCount }} 条
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
.stock-mgmt-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.stock-mgmt-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}

.stock-progress {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 36px;
  gap: 8px;
  align-items: center;
}
</style>
