<script setup>
import { computed, reactive, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { ElDialog, ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
// 导出插件

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { 
  getAgentPayOrderPage,
  exportAgentPayOrder,
  deleteAgentPayOrder,
  payAgentPayOrder,
  cancelAgentPayOrder,
  invoiceAgentPayOrder,
  createAgentPayOrder,
  updateAgentPayOrder,
} from '#/api/genchuan/industry/chargePark/orderTrade/agentPay/index.js';
import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';
import { downloadLocalTemplate } from '#/utils/genchuan/down';

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

const getTitle = computed(() => {
  return formData.value?.id ? '编辑' : '新增';
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

const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
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
    const obj = formApi.form.values;
    const loadingInstance = ElLoading.service({
      text: formDrawerApi.sharedData.payload.title === '新增' ? '正在创建...' : '正在更新...',
    });
    try {
      if (formDrawerApi.sharedData.payload.title === '新增') {
        await createAgentPayOrder({
          id: obj.id || 0,
          merchantId: obj.merchantId || 0,
          carNo: obj.carNo || '',
          amount: obj.amount || 0,
          payType: obj.payType || '',
          status: obj.status || '',
          remark: obj.remark || '',
          reserve1: obj.reserve1 || '',
          reserve2: obj.reserve2 || '',
        });
        ElMessage.success('创建成功');
      } else {
        await updateAgentPayOrder({
          id: obj.id || 0,
          merchantId: obj.merchantId || 0,
          carNo: obj.carNo || '',
          amount: obj.amount || 0,
          payType: obj.payType || '',
          status: obj.status || '',
          remark: obj.remark || '',
          reserve1: obj.reserve1 || '',
          reserve2: obj.reserve2 || '',
        });
        ElMessage.success('更新成功');
      }
      handleRefresh();
      formDrawerApi.close();
    } catch (error) {
      console.error('操作失败:', error);
      ElMessage.error(formDrawerApi.sharedData.payload.title === '新增' ? '创建失败' : '更新失败');
    } finally {
      loadingInstance.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

// ====================== 导出 EXCEL ======================
async function handleExport() {
  const data = await exportAgentPayOrder();
  downloadFileFromBlobPart({ fileName: '代付订单报表.xls', source: data });
}

// ====================== 图片转PDF（终极零乱码） ======================
async function handlePDF() {
  downloadLocalTemplate('/static/test.pdf', '报表.pdf');
}

/** 创建订单 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: '新增',
    })
    .open();
}

/** 编辑订单（工具栏） */
function handleEdit() {
  const row = dataObj.list.find((v) => v.id === checkedIds.value[0]);
  if (row) {
    handleEditRow(row);
  }
}

/** 编辑订单（行内） */
function handleEditRow(row) {
  formDrawerApi
    .setData({
      title: '编辑',
      ...row,
    })
    .open();
}

/** 删除选中订单 */
function handleDeleteBySelect() {
  const row = dataObj.list.find((v) => v.id === checkedIds.value[0]);
  if (row) {
    handleDelete(row);
  }
}

// 支付弹窗
const payDialogVisible = ref(false);
const payForm = reactive({
  id: '',
  remark: '',
});

// 打开支付弹窗
const handlePay = (row) => {
  payForm.id = row.id;
  payForm.remark = '';
  payDialogVisible.value = true;
};

// 提交支付
const handlePaySubmit = async () => {
  const loadingInstance = ElLoading.service({
    text: '正在支付...',
  });
  try {
    await payAgentPayOrder({ id: payForm.id, remark: payForm.remark });
    ElMessage.success('支付成功');
    payDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    console.error('支付失败:', error);
    ElMessage.error('支付失败');
  } finally {
    loadingInstance.close();
  }
};

// 取消弹窗
const cancelDialogVisible = ref(false);
const cancelForm = reactive({
  id: '',
  remark: '',
});

// 打开取消弹窗
const handleCancel = (row) => {
  cancelForm.id = row.id;
  cancelForm.remark = '';
  cancelDialogVisible.value = true;
};

// 提交取消
const handleCancelSubmit = async () => {
  const loadingInstance = ElLoading.service({
    text: '正在取消...',
  });
  try {
    await cancelAgentPayOrder({ id: cancelForm.id, remark: cancelForm.remark });
    ElMessage.success('取消成功');
    cancelDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    console.error('取消失败:', error);
    ElMessage.error('取消失败');
  } finally {
    loadingInstance.close();
  }
};

// 发票弹窗
const invoiceDialogVisible = ref(false);
const invoiceForm = reactive({
  id: '',
  remark: '',
});

// 打开发票弹窗
const handleInvoice = (row) => {
  invoiceForm.id = row.id;
  invoiceForm.remark = '';
  invoiceDialogVisible.value = true;
};

// 提交发票申请
const handleInvoiceSubmit = async () => {
  const loadingInstance = ElLoading.service({
    text: '正在申请发票...',
  });
  try {
    await invoiceAgentPayOrder({ id: invoiceForm.id, remark: invoiceForm.remark });
    ElMessage.success('发票申请成功');
    invoiceDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    console.error('发票申请失败:', error);
    ElMessage.error('发票申请失败');
  } finally {
    loadingInstance.close();
  }
};
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.orderNo]),
  });
  try {
    await deleteAgentPayOrder({ id: row.id });
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.orderNo]));
    handleRefresh();
  } catch (error) {
    console.error('删除失败:', error);
    ElMessage.error('删除失败');
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    for (const id of checkedIds.value) {
      await deleteAgentPayOrder({ id });
    }
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } catch (error) {
    console.error('批量删除失败:', error);
    ElMessage.error('批量删除失败');
  } finally {
    loadingInstance.close();
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
    const res = await getAgentPayOrderPage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      return {
        ...v,
        payTime: formatTimestamp(v.payTime),
        createTime: formatTimestamp(v.createTime),
        updateTime: formatTimestamp(v.updateTime),
      };
    });
    return dataObj;
  } catch (error) {
    console.error('获取代付订单数据失败:', error);
    ElMessage.error('获取代付订单数据失败');
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

const activeName = ref('全部');
const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value?.open();
};
const tabsData = ref([
  { label: '全部' },
  { label: '启用' },
  { label: '禁用' },
  { label: '暂停运营' },
  { label: '维修中' },
]);
const createLabel = (item) => {
  let text = `(${dataObj.apilist.filter((v) => v.status === item.label).length})`;
  if (item.label === '全部') {
    text = `(${dataObj.apilist.length})`;
  }
  return item.label + text;
};
const handleClick = () => {
  gridApi.query();
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

// 代付订单状态映射
const statusMap = {
  pending_pay: { label: '待支付', type: 'warning' },
  paid: { label: '已支付', type: 'success' },
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

// 支付方式映射
const payTypeMap = {
  wechat: '微信支付',
  alipay: '支付宝支付',
  bank: '银行卡支付',
};

// 获取支付方式标签
const getPayTypeLabel = (payType) => {
  return payTypeMap[payType] || payType;
};
</script>

<template>
  <div class="park-lot-table-new" v-loading="dataObj.loading">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 支付弹窗 -->
    <ElDialog
      v-model="payDialogVisible"
      title="订单支付"
      width="500px"
      append-to-body
    >
      <el-form :model="payForm" label-width="80px">
        <el-form-item label="订单ID">
          <el-input v-model="payForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="payForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入支付备注（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="payDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePaySubmit">确认支付</el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 取消弹窗 -->
    <ElDialog
      v-model="cancelDialogVisible"
      title="取消订单"
      width="500px"
      append-to-body
    >
      <el-form :model="cancelForm" label-width="80px">
        <el-form-item label="订单ID">
          <el-input v-model="cancelForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="cancelForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入取消备注（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCancelSubmit">确认取消</el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 发票弹窗 -->
    <ElDialog
      v-model="invoiceDialogVisible"
      title="申请发票"
      width="500px"
      append-to-body
    >
      <el-form :model="invoiceForm" label-width="80px">
        <el-form-item label="订单ID">
          <el-input v-model="invoiceForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="invoiceForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入发票备注（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="invoiceDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleInvoiceSubmit">确认申请</el-button>
        </div>
      </template>
    </ElDialog>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="新增"
            icon-name="Plus"
            @click="handleCreate"
          />
         
          <IconButton
            content="批量删除"
            icon-name="Delete"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
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
      <template #payType="{ row }">
        {{ getPayTypeLabel(row.payType) }}
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #orderNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.orderNo }}
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
            content="编辑"
            icon-name="Edit"
            @click="handleEditRow(row)"
          />
          <IconButton
            content="删除"
            icon-name="Delete"
            @click="handleDelete(row)"
          />
          <IconButton
            content="支付"
            v-if="row.status === 'pending_pay'"
            icon-name="Wallet"
            @click="handlePay(row)"
          />
          <IconButton
            content="取消"
            v-if="row.status === 'pending_pay'"
            icon-name="Close"
            @click="handleCancel(row)"
          />
          <IconButton
            content="发票"
            v-if="row.status === 'paid' || row.status === 'completed'"
            icon-name="wallet"
            @click="handleInvoice(row)"
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
