<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportSpareStock,
  getSpareStockDetail,
  getSpareStockPage,
  inSpareStock,
  outSpareStock,
  replenishSpareStock,
} from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/spareStock';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import {
  detailFields,
  filterMockList,
  getSpareProgressStatus,
  getSpareStatusLabel,
  getSpareStatusTagType,
  getWarehouseName,
  isSpareStatusLabel,
  loadSpareOptions,
  normalizeSpareStockRow,
  textObj,
  useGridColumns,
  useInFormSchema,
  useOutFormSchema,
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

const actionTitle = computed(() => {
  const titleMap = {
    in: textObj.inText,
    out: textObj.outText,
    replenish: textObj.replenishText,
  };
  return titleMap[actionType.value] || textObj.inText;
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
const actionType = ref('in');
const actionRow = ref({});
const filterSpareName = ref('');
const filterWarehouseId = ref('');
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
    isSpareStatusLabel(item.status, '低库存'),
  ).length;
  const normalCount = dataObj.list.filter((item) =>
    isSpareStatusLabel(item.status, '正常'),
  ).length;

  return {
    totalStock,
    lowCount,
    normalCount,
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
  schema: useInFormSchema(),
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
      if (actionType.value === 'in') {
        await inSpareStock({
          spareId: values.spareId,
          inCount: Number(values.inCount || 0),
          supplier: values.supplier,
        });
        ElMessage.success('备件入库成功');
      }

      if (actionType.value === 'out') {
        const outCount = Number(values.outCount || 0);
        if (
          actionRow.value?.id &&
          outCount > Number(actionRow.value.currentStock || 0)
        ) {
          ElMessage.warning('出库数量不能大于当前库存');
          return;
        }
        await outSpareStock({
          spareId: values.spareId,
          outCount,
          receiver: values.receiver,
        });
        ElMessage.success('备件出库成功');
      }

      if (actionType.value === 'replenish') {
        await replenishSpareStock({
          id: actionRow.value.id,
          replenishCount: Number(values.replenishCount || 0),
        });
        ElMessage.success('备件补货成功');
      }

      actionDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error(error);
      ElMessage.error('操作失败，请稍后重试');
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
    spareName: filterSpareName.value || dataObj.searchParams.spareName,
    warehouseId: filterWarehouseId.value || dataObj.searchParams.warehouseId,
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
    const response = await getSpareStockPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];

    // if (list.length === 0 && !pageResult?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    dataObj.useStaticData = false;
    dataObj.total = pageResult.total || 0;
    dataObj.list = list.map((item) => normalizeSpareStockRow(item));
  } catch (error) {
    console.error('获取备件仓储数据失败，使用静态数据:', error);
    getPagedMockData(queryParams, page);
  }

  return dataObj;
}

function buildSearchFormSchema() {
  return useSearchFormSchema().map((item) => {
    delete item.rules;
    return { ...item };
  });
}

const [QueryForm, queryFormApi] = useVbenForm({
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
  schema: buildSearchFormSchema(),
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
    const data = await exportSpareStock(buildQueryParams(dataObj));
    downloadFileFromBlobPart({ fileName: textObj.excelAllName, source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}

async function openActionDrawer(type, row = {}) {
  actionType.value = type;
  const schemaMap = {
    in: useInFormSchema,
    out: useOutFormSchema,
    replenish: useReplenishFormSchema,
  };
  await actionFormApi.setState({ schema: schemaMap[type]() });
  actionDrawerApi.setData(row).open();
}

async function handleToolbarIn() {
  const row = checkedRows.value.length === 1 ? checkedRows.value[0] : {};
  await openActionDrawer('in', row);
}

async function handleToolbarOut() {
  if (checkedRows.value.length !== 1) {
    ElMessage.warning('请选择一条备件库存记录进行出库');
    return;
  }
  await openActionDrawer('out', checkedRows.value[0]);
}

async function handleRowIn(row) {
  await openActionDrawer('in', row);
}

async function handleRowOut(row) {
  await openActionDrawer('out', row);
}

async function handleReplenish(row) {
  await openActionDrawer('replenish', row);
}

function onSubmit(values) {
  dataObj.searchParams = { ...values };
  filterTrendTime.value = '';
  gridApi.reload();
  drawerApi.close();
}

async function handleOpenDetail(row) {
  try {
    const response = await getSpareStockDetail(row.id);
    const detail = response?.id ? response : response?.data || response;
    dataObj.detailObj = normalizeSpareStockRow(detail || row);
  } catch (error) {
    console.error('获取备件仓储详情失败，使用行数据:', error);
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

function handleSpareClick(row) {
  dataObj.detailObj = row;
  detailDrawerRef.value?.open();
}

function handleStatusClick(status) {
  filterStatus.value = filterStatus.value === status ? '' : status;
  filterTrendTime.value = '';
  gridApi.query();
}

function handleWarehouseClick(warehouseId) {
  filterWarehouseId.value = warehouseId
  gridApi.query();
}

function cancelFilter(type) {
  const clearMap = {
    spareName: () => {
      filterSpareName.value = '';
    },
    status: () => {
      filterStatus.value = '';
    },
    trendTime: () => {
      filterTrendTime.value = '';
    },
    warehouseId: () => {
      filterWarehouseId.value = '';
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
    if (filter.type === 'spareName') {
      filterSpareName.value = filter.value;
    }
    gridApi.query();
  },
  { deep: true },
);

onMounted(async () => {
  await loadSpareOptions();
  await queryFormApi.setState({ schema: buildSearchFormSchema() });
  await actionFormApi.setState({ schema: useInFormSchema() });
});
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
      :title="`${dataObj.detailObj.spareName || '备件'}详情`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="spare-stock-filter-tags">
          <ElTag
            v-if="filterSpareName"
            closable
            type="success"
            @close="cancelFilter('spareName')"
          >
            关联备件：{{ filterSpareName }}
          </ElTag>
          <ElTag
            v-if="filterStatus"
            closable
            type="warning"
            @close="cancelFilter('status')"
          >
            库存状态：{{ getSpareStatusLabel(filterStatus) }}
          </ElTag>
          <ElTag
            v-if="filterWarehouseId"
            closable
            type="primary"
            @close="cancelFilter('warehouseId')"
          >
            所属仓库：{{ filterWarehouseId }}
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
          <IconButton
            content="入库"
            icon-name="Plus"
            @click="handleToolbarIn"
          />
          <IconButton
            content="出库"
            icon-name="Remove"
            @click="handleToolbarOut"
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
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>

      <template #spareName="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleSpareClick(row)"
        >
          {{ row.spareName }}
        </el-text>
      </template>

      <template #currentStock="{ row }">
        <div class="spare-progress">
          <el-progress
            :percentage="
              Math.min(100, Math.round((row.currentStock / 30) * 100))
            "
            :show-text="false"
            :status="getSpareProgressStatus(row)"
          />
          <span>{{ row.currentStock }}</span>
        </div>
      </template>

      <template #status="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getSpareStatusTagType(row.status)"
          @click="handleStatusClick(row.status)"
        >
          {{ getSpareStatusLabel(row.status) }}
        </ElTag>
      </template>

      <template #warehouseName="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleWarehouseClick(row.warehouseName)"
        >
          {{ row.warehouseName }}
        </el-text>
      </template>

      <template #outRecord="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleRecordDetail(row)"
        >
          {{ row.outRecord }}
        </el-text>
      </template>

      <template #inRecord="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleRecordDetail(row)"
        >
          {{ row.inRecord }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="isSpareStatusLabel(row.status, '正常')"
            content="入库"
            icon-name="Plus"
            @click="handleRowIn(row)"
          />
          <IconButton
            v-if="isSpareStatusLabel(row.status, '正常')"
            content="出库"
            icon-name="Remove"
            @click="handleRowOut(row)"
          />
          <IconButton
            v-if="isSpareStatusLabel(row.status, '低库存')"
            content="补货"
            icon-name="Edit"
            @click="handleReplenish(row)"
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
            本页统计：备件库存 {{ currentPageStats.totalStock }}；正常
            {{ currentPageStats.normalCount }} 条；低库存
            {{ currentPageStats.lowCount }} 条
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
.spare-stock-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.spare-stock-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}

.spare-progress {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 36px;
  gap: 8px;
  align-items: center;
}
</style>
