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
  getPayOrderPage,
  payOrder,
  refundOrder,
  exportPayOrderExcel,
  cancelOrder,
} from '#/api/genchuan/industry/chargePark/orderTrade/payMgmt/index.js';
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
  onConfirm() {
    const obj = formApi.form.values;
    if (formDrawerApi.sharedData.payload.title === '新增') {
      dataObj.apilist.push(obj);
    } else {
      dataObj.apilist.forEach((v, i) => {
        if (v.id === formData.value?.id) {
          dataObj.apilist[i] = obj;
        }
      });
    }
    handleRefresh();
    formDrawerApi.close();
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
  const data = await exportPayOrderExcel();
  downloadFileFromBlobPart({ fileName: '支付订单报表.xls', source: data });
}

// ====================== 图片转PDF（终极零乱码） ======================
async function handlePDF() {
  downloadLocalTemplate('/static/test.pdf', '报表.pdf');
}

/** 创建角色 */
function handleCreate() {
  formDrawerApi
    .setData({
      title: '新增',
    })
    .open();
}

/** 编辑角色 */
function handleEdit(row) {
  formDrawerApi
    .setData({
      title: '编辑',
      ...row,
    })
    .open();
}
async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.name]),
  });
  try {
    dataObj.apilist = dataObj.apilist.filter((v) => v.id !== row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
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
    dataObj.apilist = dataObj.apilist.filter(
      (v) => !checkedIds.value.includes(v.id),
    );
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
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
    const res = await getPayOrderPage(params);
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
    console.error('获取支付订单数据失败:', error);
    ElMessage.error('获取支付订单数据失败');
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
const enDetailObjRef = ref(null);
const arrowChange = () => {
  emit('arrow-change');
};
const autoElmessage = () => {
  ElMessage.success($t('月报自动刷新成功'));
};
const openEn = async () => {
  const res = await getDetailEnObj(1);
  dataObj.enDetailObj = res;
  enDetailObjRef.value?.open();
};

// 支付订单状态映射
const statusMap = {
  pending_pay: { label: '待支付', type: 'warning' },
  paid: { label: '已支付', type: 'success' },
  completed: { label: '已完成', type: 'info' },
  cancelled: { label: '已取消', type: 'danger' },
  refunded: { label: '已退款', type: 'default' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

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
    await payOrder({ id: payForm.id, remark: payForm.remark });
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

// 退款弹窗
const refundDialogVisible = ref(false);
const refundForm = reactive({
  id: '',
  remark: '',
});

// 打开退款弹窗
const handleRefund = (row) => {
  refundForm.id = row.id;
  refundForm.remark = '';
  refundDialogVisible.value = true;
};

// 提交退款
const handleRefundSubmit = async () => {
  const loadingInstance = ElLoading.service({
    text: '正在退款...',
  });
  try {
    await refundOrder({ id: refundForm.id, remark: refundForm.remark });
    ElMessage.success('退款成功');
    refundDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    console.error('退款失败:', error);
    ElMessage.error('退款失败');
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
    await cancelOrder({ id: cancelForm.id, remark: cancelForm.remark });
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
      title="支付订单"
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
            placeholder="请输入支付备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="payDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePaySubmit">
            确认支付
          </el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 退款弹窗 -->
    <ElDialog
      v-model="refundDialogVisible"
      title="退款订单"
      width="500px"
      append-to-body
    >
      <el-form :model="refundForm" label-width="80px">
        <el-form-item label="订单ID">
          <el-input v-model="refundForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="refundForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入退款备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="refundDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRefundSubmit">
            确认退款
          </el-button>
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
            placeholder="请输入取消备注"
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
            content="批量核算"
            icon-name="check"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchCalculate"
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
      <template #checkResult="{ row }">
        <el-tag :type="getCheckResultType(row.checkResult)">
          {{ getCheckResultLabel(row.checkResult) }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #checkNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.checkNo }}
        </el-text>
      </template>
      <template #payMethod="{ row }">
        <span v-if="row.payMethod === 'wechat'">微信</span>
        <span v-else-if="row.payMethod === 'alipay'">支付宝</span>
        <span v-else-if="row.payMethod === 'bank'">银行卡</span>
        <span v-else-if="row.payMethod === 'cash'">现金</span>
        <span v-else>{{ row.payMethod }}</span>
      </template>
      <template #halfyearWarnCount="{ row }">
        <el-text @click="handleTotal(row)" class="common-align" type="primary">
          {{ row.halfyearWarnCount }}
        </el-text>
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
            content="确认"
            v-if="row.status === 'checked'"
            icon-name="Check"
            @click="handleConfirm(row)"
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
