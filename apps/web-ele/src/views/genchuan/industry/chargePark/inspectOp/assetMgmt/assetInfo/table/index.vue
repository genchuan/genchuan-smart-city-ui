<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElMessage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createAssetInfo,
  exportAssetInfo,
  getAssetInfoDetail,
  getAssetInfoPage,
  updateAssetInfo,
} from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/assetInfo';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import ImportExcelDialog from '../components/ImportExcelDialog.vue';
import StatusConfirmDialog from '../components/StatusConfirmDialog.vue';
import {
  detailFields,
  filterMockList,
  getAssetStatusLabel,
  getAssetStatusTagType,
  getAssetTypeLabel,
  getAssetTypeTagType,
  getStationName,
  isAssetStatusLabel,
  normalizeAssetInfoRow,
  textObj,
  useEditFormSchema,
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

const getTitle = computed(() =>
  formData.value?.id ? textObj.editText : textObj.addText,
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
const importExcelDialogRef = ref(null);
const statusConfirmDialogRef = ref(null);
const formData = ref({});
const checkedIds = ref([]);
const checkedRows = ref([]);
const filterType = ref('');
const filterStatus = ref('');
const filterStationId = ref('');

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
    isAssetStatusLabel(item.status, '正常'),
  ).length;
  const disabledCount = dataObj.list.filter((item) =>
    isAssetStatusLabel(item.status, '禁用'),
  ).length;
  const scrapCount = dataObj.list.filter((item) =>
    isAssetStatusLabel(item.status, '报废'),
  ).length;

  return {
    normalCount,
    disabledCount,
    scrapCount,
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
      if (formData.value?.id) {
        await updateAssetInfo({
          ...formData.value,
          ...values,
          id: formData.value.id,
        });
        ElMessage.success('编辑成功');
      } else {
        await createAssetInfo({ ...values, status: '1' });
        ElMessage.success('新增成功');
      }
      formDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error(error);
      ElMessage.error(formData.value?.id ? '编辑失败' : '新增失败');
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    formData.value = formDrawerApi.getData() || {};
    await formApi.resetForm();
    if (formData.value?.id) {
      await formApi.setValues(formData.value);
    }
  },
});

function buildQueryParams(page) {
  return {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
    type: filterType.value || dataObj.searchParams.type,
    status: filterStatus.value || dataObj.searchParams.status,
    stationId: filterStationId.value || dataObj.searchParams.stationId,
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
    const response = await getAssetInfoPage(queryParams);
    const pageResult = response?.list ? response : response?.data || response;
    const list = Array.isArray(pageResult?.list) ? pageResult.list : [];

    // if (list.length === 0 && !pageResult?.total) {
    //   throw new Error('接口返回数据为空');
    // }

    dataObj.useStaticData = false;
    dataObj.total = pageResult.total || 0;
    dataObj.list = list.map((item) => normalizeAssetInfoRow(item));
  } catch (error) {
    console.error('获取资产信息数据失败，使用静态数据:', error);
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
    const data = await exportAssetInfo(buildQueryParams(dataObj));
    downloadFileFromBlobPart({ fileName: textObj.excelAllName, source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('导出失败');
  }
}

function handleImport() {
  importExcelDialogRef.value?.open();
}

async function handleCreate() {
  await formApi.setState({ schema: useFormSchema() });
  formDrawerApi.setData({ status: '1' }).open();
}

async function handleEdit(row) {
  await formApi.setState({ schema: useEditFormSchema() });
  formDrawerApi.setData(row).open();
}

function handleDisable(row) {
  statusConfirmDialogRef.value?.open('disable', row);
}

function handleScrap(row) {
  statusConfirmDialogRef.value?.open('scrap', row);
}

function onSubmit(values) {
  dataObj.searchParams = { ...values };
  gridApi.reload();
  drawerApi.close();
}

async function handleOpenDetail(row) {
  try {
    const response = await getAssetInfoDetail(row.id);
    const detail = response?.id ? response : response?.data || response;
    dataObj.detailObj = normalizeAssetInfoRow(detail || row);
  } catch (error) {
    console.error('获取资产信息详情失败，使用行数据:', error);
    dataObj.detailObj = row;
  }
  detailDrawerRef.value?.open();
}

function handleDeviceDetail(row) {
  dataObj.detailObj = row;
  detailDrawerRef.value?.open();
}

function handleChangeRecord(row) {
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

function handleTypeClick(type) {
  filterType.value = filterType.value === type ? '' : type;
  gridApi.query();
}

function handleStatusClick(status) {
  filterStatus.value = filterStatus.value === status ? '' : status;
  gridApi.query();
}

function handleStationClick(stationId) {
  filterStationId.value =
    Number(filterStationId.value) === Number(stationId) ? '' : stationId;
  gridApi.query();
}

function cancelFilter(type) {
  const clearMap = {
    stationId: () => {
      filterStationId.value = '';
    },
    status: () => {
      filterStatus.value = '';
    },
    type: () => {
      filterType.value = '';
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
    if (filter.type === 'type') {
      filterType.value = filter.value;
    }
    gridApi.query();
  },
  { deep: true },
);
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="dataObj.detailObj"
      :fields="detailFields"
      :title="`${dataObj.detailObj.name || '资产信息'}详情`"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="asset-info-filter-tags">
          <ElTag
            v-if="filterType"
            closable
            type="success"
            @close="cancelFilter('type')"
          >
            资产类型：{{ getAssetTypeLabel(filterType) }}
          </ElTag>
          <ElTag
            v-if="filterStatus"
            closable
            type="warning"
            @close="cancelFilter('status')"
          >
            资产状态：{{ getAssetStatusLabel(filterStatus) }}
          </ElTag>
          <ElTag
            v-if="filterStationId"
            closable
            type="primary"
            @close="cancelFilter('stationId')"
          >
            所属场站：{{ getStationName(filterStationId) }}
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

      <template #type="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getAssetTypeTagType(row.type)"
          @click="handleTypeClick(row.type)"
        >
          {{ getAssetTypeLabel(row.type) }}
        </ElTag>
      </template>

      <template #status="{ row }">
        <ElTag
          style="cursor: pointer"
          :type="getAssetStatusTagType(row.status)"
          @click="handleStatusClick(row.status)"
        >
          {{ getAssetStatusLabel(row.status) }}
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

      <template #deviceName="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleDeviceDetail(row)"
        >
          {{ row.deviceName }}
        </el-text>
      </template>

      <template #changeRecord="{ row }">
        <el-text
          class="common-align"
          style="cursor: pointer"
          type="primary"
          @click="handleChangeRecord(row)"
        >
          {{ row.changeRecord }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-if="!isAssetStatusLabel(row.status, '报废')"
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            v-if="isAssetStatusLabel(row.status, '正常')"
            content="禁用"
            icon-name="SwitchButton"
            @click="handleDisable(row)"
          />
          <IconButton
            v-if="!isAssetStatusLabel(row.status, '报废')"
            content="报废"
            icon-name="DeleteFilled"
            @click="handleScrap(row)"
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
            本页统计：资产 {{ dataObj.list.length }} 条；正常
            {{ currentPageStats.normalCount }} 条；禁用
            {{ currentPageStats.disabledCount }} 条；报废
            {{ currentPageStats.scrapCount }} 条
          </span>
        </div>
        <div v-if="dataObj.totalShow" class="common-total-bottom">
          <span> 全部统计：{{ textObj.total }} </span>
        </div>
      </template>
    </Grid>

    <ImportExcelDialog ref="importExcelDialogRef" @success="handleRefresh" />
    <StatusConfirmDialog
      ref="statusConfirmDialogRef"
      @success="handleRefresh"
    />
  </div>
</template>

<style scoped>
.asset-info-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.asset-info-filter-tags :deep(.el-tag) {
  height: 32px;
  line-height: 32px;
}
</style>
