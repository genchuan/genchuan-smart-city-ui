<script setup>import { reactive, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';
import { ElMessage, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElDatePicker, ElDialog, ElDescriptions, ElDescriptionsItem } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getInvoiceAuditPage, exportInvoiceAuditExcel, auditPass, auditReject, batchAudit, batchReapply } from '#/api/genchuan/industry/chargePark/orderTrade/invoiceMgmt/index.js';
import { formatTimestamp } from '#/utils';
import { confirm } from '@vben/common-ui';
import { useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';
import InvoiceDetailDrawer from '#/views/genchuan/industry/chargePark/orderTrade/invoiceMgmt/invoiceList/table/detail.vue';
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
      createTimeStart: null,
      createTimeEnd: null,
    }),
  },
});
const emit = defineEmits(['arrow-change', 'clear-filters']);
// 搜索表单数据
const searchFormData = reactive({
  applicantName: '',
  status: '',
  applyTimeStart: '',
  applyTimeEnd: '',
});
const searchFormRef = ref(null);
// 重新申请弹窗数据
const reapplyDialog = reactive({
  visible: false,
  id: 0,
  remark: '',
});
// 发票审核状态映射 - InvoiceAuditStatusEnum
const statusMap = {
  pending: { label: '待审核', type: 'warning' },
  approved: { label: '已通过', type: 'success' },
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
  const data = await exportInvoiceAuditExcel();
  downloadFileFromBlobPart({ fileName: '发票审核报表.xls', source: data });
}

/** 批量审核通过 */
async function handleBatchAuditPass() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要审核的记录');
    return;
  }
  await confirm('确定批量审核通过选中的记录吗？');
  try {
    await batchAudit(checkedIds.value);
    ElMessage.success('批量审核通过成功');
    handleRefresh();
  } catch (error) {
    console.error('批量审核通过失败:', error);
    ElMessage.error('批量审核通过失败');
  }
}

/** 批量审核拒绝 */
async function handleBatchAuditReject() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请选择要审核的记录');
    return;
  }
  await confirm('确定批量审核拒绝选中的记录吗？');
  try {
    await batchAudit({ ids: checkedIds.value, status: 'rejected' });
    ElMessage.success('批量审核拒绝成功');
    handleRefresh();
  } catch (error) {
    console.error('批量审核拒绝失败:', error);
    ElMessage.error('批量审核拒绝失败');
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

/** 打开重新申请弹窗 */
function handleReapply(row) {
  reapplyDialog.id = row.id;
  reapplyDialog.remark = '';
  reapplyDialog.visible = true;
}

/** 提交重新申请 */
async function submitReapply() {
  try {
    await batchReapply({ id: reapplyDialog.id, remark: reapplyDialog.remark || '' });
    ElMessage.success('重新申请成功');
    reapplyDialog.visible = false;
    handleRefresh();
  } catch (error) {
    console.error('重新申请失败:', error);
    ElMessage.error('重新申请失败');
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
  invoiceDetailObj: {},
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
    const res = await getInvoiceAuditPage(params);
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
    console.error('获取发票审核数据失败:', error);
    ElMessage.error('获取发票审核数据失败');
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
const invoiceDetailDrawerRef = ref(null);
const arrowChange = () => {
  emit('arrow-change');
};

// 点击关联申请跳转发票详情弹窗
function handleOpenInvoiceDetail(row) {
  dataObj.invoiceDetailObj = {
    invoiceNo: row.invoiceNo,
  };
  invoiceDetailDrawerRef.value?.open();
}

// 点击申请人筛选
function handleFilterApplicant(applicantName) {
  if (!applicantName) return;
  dataObj.searchObj = { ...dataObj.searchObj, applicantName: applicantName };
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击审核人筛选
function handleFilterAuditor(auditorName) {
  if (!auditorName) return;
  dataObj.searchObj = { ...dataObj.searchObj, auditorName: auditorName };
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击审核状态筛选
function handleFilterStatus(status) {
  if (!status) return;
  dataObj.searchObj = { ...dataObj.searchObj, status: status };
  dataObj.currentPage = 1;
  gridApi.query();
}

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

    <!-- 发票详情弹窗 -->
    <InvoiceDetailDrawer ref="invoiceDetailDrawerRef" :detail-obj="dataObj.invoiceDetailObj" />

    <Drawer title="搜索">
      <ElForm ref="searchFormRef" :model="searchFormData" label-width="100px" class="query-form">
        <ElFormItem label="申请人">
          <ElInput v-model="searchFormData.creator" placeholder="请输入申请人" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="searchFormData.status" placeholder="请选择状态">
            <ElOption label="待审核" value="pending" />
            <ElOption label="已通过" value="approved" />
            <ElOption label="已驳回" value="rejected" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="审核开始时间">
          <ElDatePicker v-model="searchFormData.applyTimeStart" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss" />
        </ElFormItem>

        <ElFormItem label="审核结束时间">
          <ElDatePicker v-model="searchFormData.applyTimeEnd" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss" />
        </ElFormItem>

      </ElForm>
    </Drawer>

    <!-- 重新申请弹窗 -->
    <ElDialog v-model="reapplyDialog.visible" title="重新申请开票" width="450px" append-to-body>
      <ElForm :model="reapplyDialog" label-width="80px">
        <ElFormItem label="备注">
          <ElInput v-model="reapplyDialog.remark" type="textarea" :rows="3" placeholder="请输入备注（选填）" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="reapplyDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="submitReapply">确认重新申请</el-button>
        </div>
      </template>
    </ElDialog>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="批量审核" icon-name="Check" @click="handleBatchAuditPass" />
          <IconButton content="导出EXCEL" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <template #id="{ row }">
        <span @click="handleOpenDetail(row)" class="common-align cursor-pointer text-primary">
          {{ row.id }}
        </span>
      </template>
      <template #invoiceNo="{ row }">
        <span @click="handleOpenInvoiceDetail(row)" class="common-align cursor-pointer text-primary">
          {{ row.invoiceNo }}
        </span>
      </template>
      <template #creator="{ row }">
        <span @click="handleFilterApplicant(row.creator)" class="common-align cursor-pointer text-primary">
          {{ row.creator }}
        </span>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)" class="cursor-pointer" @click="handleFilterStatus(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #auditorName="{ row }">
        <span @click="handleFilterAuditor(row.auditorName)" class="common-align cursor-pointer text-primary">
          {{ row.auditorName || '-' }}
        </span>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton v-if="row.status === 'pending'" content="审核通过" icon-name="Check" @click="handleAuditPass(row)" />
          <IconButton v-if="row.status === 'pending'" content="审核拒绝" icon-name="Close"
            @click="handleAuditReject(row)" />
          <IconButton v-if="row.status === 'rejected'" content="重新申请" icon-name="Refresh" @click="handleReapply(row)" />
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
