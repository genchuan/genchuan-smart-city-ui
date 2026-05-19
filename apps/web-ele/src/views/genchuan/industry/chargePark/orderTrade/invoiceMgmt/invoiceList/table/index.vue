<script setup>import { reactive, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';
import { ElMessage, ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getInvoiceListPage, exportInvoiceListExcel, batchInvoice, auditPass, auditReject, reapply, push, invoice, download } from '#/api/genchuan/industry/chargePark/orderTrade/invoiceMgmt/index.js';
import { formatTimestamp } from '#/utils';
import { confirm } from '@vben/common-ui';
import { useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';
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
      createTimeStart: null,
      createTimeEnd: null,
    }),
  },
});
const emit = defineEmits(['arrow-change', 'clear-filters']);
// 搜索表单数据
const searchFormData = reactive({
  invoiceNo: '',
  orderNo: '',
  status: '',
});
const searchFormRef = ref(null);
// 发票状态映射 - InvoiceListStatusEnum
const statusMap = {
  pending_audit: { label: '待审核', type: 'warning' },
  pending_invoice: { label: '待开票', type: 'info' },
  invoiced: { label: '已开票', type: 'success' },
  rejected: { label: '已驳回', type: 'danger' },
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
  const data = await exportInvoiceListExcel();
  downloadFileFromBlobPart({ fileName: '发票列表报表.xls', source: data });
}
/** 批量发票 */
async function handleBatchInvoice() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要开票的记录');
    return;
  }
  await confirm('确定批量开票选中的记录吗？');
  try {
    await batchInvoice({ ids: checkedIds.value });
    ElMessage.success('批量开票成功');
    handleRefresh();
  } catch (error) {
    console.error('批量开票失败:', error);
    ElMessage.error('批量开票失败');
  }
}

/** 审核通过 */
async function handleAuditPass(row) {
  await confirm('确定审核通过此记录吗？');
  try {
    await auditPass({ id: row.id, remark: '' });
    ElMessage.success('审核通过成功');
    handleRefresh();
  } catch (error) {
    console.error('审核通过失败:', error);
    ElMessage.error('审核通过失败');
  }
}

/** 审核拒绝 */
async function handleAuditReject(row) {
  await confirm('确定审核拒绝此记录吗？');
  try {
    await auditReject({ id: row.id, remark: '' });
    ElMessage.success('审核拒绝成功');
    handleRefresh();
  } catch (error) {
    console.error('审核拒绝失败:', error);
    ElMessage.error('审核拒绝失败');
  }
}

/** 重新申请 */
async function handleReapply(row) {
  await confirm('确定重新申请此记录吗？');
  try {
    await reapply({ id: row.id, remark: '' });
    ElMessage.success('重新申请成功');
    handleRefresh();
  } catch (error) {
    console.error('重新申请失败:', error);
    ElMessage.error('重新申请失败');
  }
}

/** 确认开票 */
async function handlePush(row) {
  await confirm('确定确认开票此记录吗？');
  try {
    await push({ id: row.id, remark: '' });
    ElMessage.success('确认开票成功');
    handleRefresh();
  } catch (error) {
    console.error('确认开票失败:', error);
    ElMessage.error('确认开票失败');
  }
}

/** 开票 */
async function handleInvoice(row) {
  await confirm('确定开票此记录吗？');
  try {
    await invoice({ id: row.id });
    ElMessage.success('开票成功');
    handleRefresh();
  } catch (error) {
    console.error('开票失败:', error);
    ElMessage.error('开票失败');
  }
}

/** 下载 */
async function handleDownload(row) {
  try {
    const res = await download({ id: row.id });  
    const downloadUrl = res ;
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    } else {
      ElMessage.warning('暂无下载链接');
    }
  } catch (error) {
    console.error('下载失败:', error);
    ElMessage.error('下载失败');
  }
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
    const res = await getInvoiceListPage(params);
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
    console.error('获取发票列表数据失败:', error);
    ElMessage.error('获取发票列表数据失败');
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
const arrowChange = () => {
  emit('arrow-change');
};

watch(
  () => props.filterParams,
  () => {
    dataObj.currentPage = 1;
    dataObj.searchObj = {};
    dataObj.filterParams = props.filterParams;
    gridApi.query();
  },
  { deep: true }
);
</script>

<template>
  <div class="park-lot-table-new" v-loading="dataObj.loading">
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />
    <Drawer title="搜索">
      <ElForm
        ref="searchFormRef"
        :model="searchFormData"
        label-width="100px"
        class="query-form"
      >
        <ElFormItem label="发票编号">
          <ElInput v-model="searchFormData.invoiceNo" placeholder="请输入发票编号" />
        </ElFormItem>
        <ElFormItem label="订单号">
          <ElInput v-model="searchFormData.orderNo" placeholder="请输入订单号" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="searchFormData.status" placeholder="请选择状态">
            <ElOption label="待审核" value="pending_audit" />
            <ElOption label="待开票" value="pending_invoice" />
            <ElOption label="已开票" value="invoiced" />
            <ElOption label="已驳回" value="rejected" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </Drawer>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="批量开票" icon-name="Plus" @click="handleBatchInvoice" />
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
          <IconButton v-if="row.status === 'pending_audit'" content="审核通过" icon-name="Check" @click="handleAuditPass(row)" />
          <IconButton v-if="row.status === 'pending_audit'" content="审核拒绝" icon-name="Close" @click="handleAuditReject(row)" />
          <IconButton v-if="row.status === 'rejected'" content="重新申请" icon-name="Refresh" @click="handleReapply(row)" />
          <IconButton v-if="row.status === 'pending_invoice'" content="确认开票" icon-name="Ticket" @click="handlePush(row)" />
          <IconButton v-if="row.status === 'pending_invoice'" content="开票" icon-name="Plus" @click="handleInvoice(row)" />
          <IconButton v-if="row.status === 'invoiced'" content="下载" icon-name="download" @click="handleDownload(row)" />
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
