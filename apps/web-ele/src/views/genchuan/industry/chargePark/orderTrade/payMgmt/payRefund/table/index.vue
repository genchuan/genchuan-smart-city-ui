<script setup>
import { reactive, ref } from 'vue';

import { downloadFileFromBlobPart } from '@vben/utils';

import { ElDialog, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { 
  getPayRefundPage,
  exportPayRefundExcel,
  executePayRefund,
  cancelPayRefund,
} from '#/api/genchuan/industry/chargePark/orderTrade/payMgmt/index.js';
import { formatTimestamp } from '#/utils';

import { useFormSchema, useGridColumns } from './data';
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
});
const emit = defineEmits(['arrow-change']);

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

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

// ====================== 导出 EXCEL ======================
async function handleExport() {
  const data = await exportPayRefundExcel();
  downloadFileFromBlobPart({ fileName: '支付退款报表.xls', source: data });
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
  };

  try {
    dataObj.loading = true;
    const res = await getPayRefundPage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      return {
        ...v,
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return dataObj;
  } catch (error) {
    console.error('获取支付退款数据失败:', error);
    ElMessage.error('获取支付退款数据失败');
    return dataObj;
  } finally {
    dataObj.loading = false;
  }
};
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: async () => {
    const values = await queryFormApi.getValues();
    dataObj.searchObj = values;
    dataObj.currentPage = 1;
    gridApi.query();
    drawerApi.close();
  },
  layout: 'horizontal',
  schema: useFormSchema()
    .map((v) => {
      delete v.rules;
      return { ...v };
    })
    .filter((v) => v.isSearch),
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

// 支付退款状态映射
const statusMap = {
  pending: { label: '待处理', type: 'warning' },
  processing: { label: '处理中', type: 'info' },
  completed: { label: '已完成', type: 'success' },
  cancelled: { label: '已取消', type: 'danger' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

// 执行退款弹窗
const executeDialogVisible = ref(false);
const executeForm = reactive({
  id: '',
  remark: '',
});

// 打开执行退款弹窗
const handleExecute = (row) => {
  executeForm.id = row.id;
  executeForm.remark = '';
  executeDialogVisible.value = true;
};

// 提交执行退款
const handleExecuteSubmit = async () => {
  try {
    await executePayRefund(executeForm);
    ElMessage.success('执行退款成功');
    executeDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('执行退款失败');
  }
};

// 取消退款弹窗
const cancelDialogVisible = ref(false);
const cancelForm = reactive({
  id: '',
  remark: '',
});

// 打开取消退款弹窗
const handleCancel = (row) => {
  cancelForm.id = row.id;
  cancelForm.remark = '';
  cancelDialogVisible.value = true;
};

// 提交取消退款
const handleCancelSubmit = async () => {
  try {
    await cancelPayRefund(cancelForm);
    ElMessage.success('取消退款成功');
    cancelDialogVisible.value = false;
    handleRefresh();
  } catch {
    ElMessage.error('取消退款失败');
  }
};

</script>

<template>
  <div class="park-lot-table-new" v-loading="dataObj.loading">
    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 执行退款弹窗 -->
    <ElDialog
      v-model="executeDialogVisible"
      title="执行退款"
      width="500px"
      append-to-body
    >
      <el-form :model="executeForm" label-width="80px">
        <el-form-item label="记录ID">
          <el-input v-model="executeForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="executeForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="executeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleExecuteSubmit">
            执行退款
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 取消退款弹窗 -->
    <ElDialog
      v-model="cancelDialogVisible"
      title="取消退款"
      width="500px"
      append-to-body
    >
      <el-form :model="cancelForm" label-width="80px">
        <el-form-item label="记录ID">
          <el-input v-model="cancelForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="cancelForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入取消原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCancelSubmit">
            确认取消
          </el-button>
        </div>
      </template>
    </ElDialog>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="导出EXCEL"
            icon-name="download"
            @click="handleExport"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
        </div>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #orderId="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.orderId }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="查看"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />
          <IconButton
            content="执行"
            v-if="row.status === 'pending'"
            icon-name="Check"
            @click="handleExecute(row)"
          />
          <IconButton
            content="取消"
            v-if="row.status === 'pending' || row.status === 'processing'"
            icon-name="Close"
            @click="handleCancel(row)"
          />
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
