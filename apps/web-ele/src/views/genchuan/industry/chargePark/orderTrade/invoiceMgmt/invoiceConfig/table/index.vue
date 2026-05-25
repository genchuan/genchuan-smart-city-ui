<script setup>import { reactive, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';
import { ElMessage, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElDatePicker } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getInvoiceConfigPage, exportInvoiceConfigExcel, batchEnable, batchDisable, batchDelete, create, update } from '#/api/genchuan/industry/chargePark/orderTrade/invoiceMgmt/index.js';
import { formatTimestamp } from '#/utils';
import { confirm } from '@vben/common-ui';
import { useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';
import EditDrawer from './edit.vue';
const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  arrowShow: {
    type: Boolean,
    default: false,
  },
  arrowState: {
    type: Boolean,
    default: false,
  },
  filterParams: {
    type: Object,
    default: () => ({
      status: null,
      category: null,
    }),
  },
});
const emit = defineEmits(['arrow-change', 'clear-filters']);
// 搜索表单数据
const searchFormData = reactive({
  status: '',
  applicantName: '',
  createTimeStart: '',
  createTimeEnd: '',
});
const searchFormRef = ref(null);
// 发票配置状态映射 - InvoiceConfigStatusEnum
const statusMap = {
  pending: { label: '未生效', type: 'warning' },
  enabled: { label: '已生效', type: 'success' },
  disabled: { label: '已禁用', type: 'danger' },
};
// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};
// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};
const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  footer: true,
  cancelText: '重置',
  confirmText: '查询',
  onCancel() {
    resetSearch();
  },
  onConfirm() {
    handleSearch();
  },
});
/** 搜索 */
function handleSearch() {
  dataObj.searchObj = {
    ...searchFormData,
  };
  dataObj.currentPage = 1;
  gridApi.query();
  drawerApi.close();
}
/** 重置搜索 */
function resetSearch() {
  for (const key in searchFormData) {
    searchFormData[key] = '';
  }
  dataObj.searchObj = {};
  dataObj.currentPage = 1;
  gridApi.query();
}
/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}
// ====================== 导出 EXCEL ======================
async function handleExport() {
  const data = await exportInvoiceConfigExcel();
  downloadFileFromBlobPart({ fileName: '发票配置报表.xls', source: data });
}

/** 批量启用 */
async function handleBatchEnable() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要启用的记录');
    return;
  }
  await confirm('确定批量启用选中的记录吗？');
  try {
    await batchEnable({ id: checkedIds.value });
    ElMessage.success('批量启用成功');
    handleRefresh();
  } catch (error) {
    console.error('批量启用失败:', error);
    ElMessage.error('批量启用失败');
  }
}

/** 批量禁用 */
async function handleBatchDisable() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要禁用的记录');
    return;
  }
  await confirm('确定批量禁用选中的记录吗？');
  try {
    await batchDisable({ ids: checkedIds.value });
    ElMessage.success('批量禁用成功');
    handleRefresh();
  } catch (error) {
    console.error('批量禁用失败:', error);
    ElMessage.error('批量禁用失败');
  }
}

/** 批量删除 */
async function handleBatchDelete() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的记录');
    return;
  }
  await confirm('确定批量删除选中的记录吗？');
  try {
    await batchDelete({ data: checkedIds.value });
    ElMessage.success('批量删除成功');
    handleRefresh();
  } catch (error) {
    console.error('批量删除失败:', error);
    ElMessage.error('批量删除失败');
  }
}

/** 编辑配置 */
async function handleEdit(row) {
  editDrawerRef.value?.openEdit(row);
}

/** 生效配置 */
async function handleEnable(row) {
  await confirm('确定生效此配置吗？');
  try {
    await batchEnable({ id: row.id });
    ElMessage.success('生效成功');
    handleRefresh();
  } catch (error) {
    console.error('生效失败:', error);
    ElMessage.error('生效失败');
  }
}

/** 禁用配置 */
async function handleDisable(row) {
  await confirm('确定禁用此配置吗？');
  try {
    await batchDisable({ id: row.id });
    ElMessage.success('禁用成功');
    handleRefresh();
  } catch (error) {
    console.error('禁用失败:', error);
    ElMessage.error('禁用失败');
  }
}

/** 新增配置 */
async function handleAdd() {
  editDrawerRef.value?.openAdd();
}

const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  enDetailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  list: [],
  loading: false,
  searchObj: {},
  filterParams: {},
});
const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};
// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchObj,
    ...dataObj.filterParams,
  };
  try {
    dataObj.loading = true;
    const res = await getInvoiceConfigPage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      const result = { ...v };
      for (const key in result) {
        if (key.includes('Time') && result[key]) {
          result[key] = formatTimestamp(result[key]);
        }
      }
      return result;
    });
    return dataObj;
  }
  catch (error) {
    console.error('获取发票配置数据失败:', error);
    ElMessage.error('获取发票配置数据失败');
    return dataObj;
  }
  finally {
    dataObj.loading = false;
  }
};
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
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value?.open();
};
const handleSerachShow = () => {
  drawerApi.open();
};
const handleFullShow = () => {
  screenfull.toggle();
};
const parkDetailDrawerRef = ref(null);
const editDrawerRef = ref(null);

// 注册刷新回调供编辑组件调用
window.invoiceConfigRefresh = handleRefresh;

const arrowChange = () => {
  emit('arrow-change');
};

watch(
  () => props.filterParams,
  () => {
    dataObj.currentPage = 1;
    gridApi.query();
  },
  { deep: true }
);
</script>

<template>
  <div class="park-lot-table-new" v-loading="dataObj.loading">
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />
    <EditDrawer ref="editDrawerRef" />
    <Drawer title="搜索">
      <ElForm ref="searchFormRef" :model="searchFormData" label-width="100px" class="query-form">
        <ElFormItem label="状态">
          <ElSelect v-model="searchFormData.status" placeholder="请选择状态">
            <ElOption label="未生效" value="pending" />
            <ElOption label="已生效" value="enabled" />
            <ElOption label="已禁用" value="disabled" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="申请人">
          <ElInput v-model="searchFormData.applicantName" placeholder="请输入申请人" />
        </ElFormItem>
        <ElFormItem label="审核开始时间">
          <ElDatePicker v-model="searchFormData.createTimeStart" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss" />
        </ElFormItem>
        <ElFormItem label="审核结束时间">
          <ElDatePicker v-model="searchFormData.createTimeEnd" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss" />
        </ElFormItem>
      </ElForm>
    </Drawer>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="新增" icon-name="Plus" @click="handleAdd" />
          <IconButton content="导出EXCEL" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #invoiceNo="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">
          {{ row.invoiceNo }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="编辑" icon-name="Edit" @click="handleEdit(row)" />
          <IconButton v-if="row.status === 'disabled' || row.status === 'pending'" content="生效" icon-name="Check"
            @click="handleEnable(row)" />
          <IconButton v-if="row.status === 'enabled'" content="禁用" icon-name="Close" @click="handleDisable(row)" />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow">
            <ArrowDown />
          </el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow">
            <ArrowUp />
          </el-icon>
          <span> 全部统计：10条 </span>
        </div>
      </template>
    </Grid>
  </div>
</template>
