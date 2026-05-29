<script setup>
import { computed, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';

import { ElDialog, ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
// 导出插件
import * as XLSX from 'xlsx';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDetailEnObj } from '#/api/genchuan/industry/marketsupervision/index.js';
import { getTempParkOrderPage, exportTempParkOrderExcel, refundTempParkOrder, invoiceTempParkOrder, cancelTempParkOrder, payTempParkOrder, invoiceOrder } from '#/api/genchuan/industry/chargePark/orderTrade/orderMgmt/index.js';
import { $t } from '#/locales';
import { downloadLocalTemplate } from '#/utils/genchuan/down';
import enDetailDrawer from '#/views/genchuan/industry/marketsupervision/brightkitchensmartsupervision/rectificationnoticereviewmanagemen/table/enDetail.vue';

import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';
import { formatTimestamp } from '#/utils';
import { useFormSchema, useGridColumns } from './data';
import ParkDetailDrawer from './detail.vue';
import PlateNoDetail from '#/views/genchuan/industry/chargePark/orderTrade/orderMgmt/components/plateNoDetail.vue';


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
      createOrderTimeStart: null,
      createOrderTimeEnd: null,
      stationName: null,
    }),
  },
});
const emit = defineEmits(['arrow-change', 'clear-filters']);

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
  onConfirm() { 
    queryFormApi.submit();
  },
  async onOpenChange() { },
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

// 点击支付状态筛选
function handleFilterStatus(status) {
  dataObj.searchObj = { ...dataObj.searchObj, status: status };
  queryFormApi.setValues({ status: status });
  dataObj.currentPage = 1;
  gridApi.query();
}

// 点击场站名称筛选
function handleFilterStationName(stationName) {
  dataObj.searchObj = { ...dataObj.searchObj, stationName: stationName };
  queryFormApi.setValues({ stationName: stationName });
  dataObj.currentPage = 1;
  gridApi.query();
}

// ====================== 导出 EXCEL ======================
async function handleExport() {
  const data = await exportTempParkOrderExcel();
  downloadFileFromBlobPart({ fileName: '临时停车订单报表.xls', source: data });
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
    const res = await getTempParkOrderPage(params);
    dataObj.total = res.total;
    dataObj.list = res.list.map((v) => {
      return {
        ...v,
        archiveTime: formatTimestamp(v.archiveTime),
        createOrderTime: formatTimestamp(v.createOrderTime),
        updateTime: formatTimestamp(v.updateTime),
        createTime: formatTimestamp(v.createTime),
        payTime: formatTimestamp(v.payTime),
      };
    });;
    return dataObj;
  } catch (error) {
    console.error('获取订单数据失败:', error);
    ElMessage.error('获取订单数据失败');
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
    dataObj.filterParams = {};
    dataObj.currentPage = 1;
    emit('clear-filters');
    gridApi.query();
    drawerApi.close();
  },
  layout: 'horizontal',
  schema: useFormSchema().map((v) => {
    delete v.rules;
    return { ...v };
  }).filter((v) => v.isSearch),
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
const handleSearchShow = () => {
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

// 订单状态映射
const statusMap = {
  'charging': { label: '充电中', type: 'primary' },
  'pending_pay': { label: '待支付', type: 'warning' },
  'paid': { label: '已支付', type: 'success' },
  'completed': { label: '已完成', type: 'success' },
  'cancelled': { label: '已取消', type: 'info' },
  'refunding': { label: '退款中', type: 'danger' },
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
  try {
    await payTempParkOrder(payForm);
    ElMessage.success('支付成功');
    payDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    ElMessage.error('支付失败');
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
  try {
    await cancelTempParkOrder(cancelForm);
    ElMessage.success('取消成功');
    cancelDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    ElMessage.error('取消失败');
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
  try {
    await refundTempParkOrder(refundForm);
    ElMessage.success('退款申请已提交');
    refundDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    ElMessage.error('退款申请失败');
  }
};

// 开票弹窗
const invoiceDialogVisible = ref(false);
const invoiceForm = reactive({
  id: '',
  orderNo: '',
  invoiceTitle: '',
  invoiceTaxNo: '',
  invoiceEmail: '',
  remark: '',
});

// 车牌详情弹窗
const plateDetailVisible = ref(false);
const currentPlateNo = ref('');

// 打开开票弹窗
const handleInvoice = (row) => {
  invoiceForm.id = row.id;
  invoiceForm.orderNo = row.orderNo;
  invoiceForm.remark = '';
  invoiceDialogVisible.value = true;
};

// 邮箱格式校验
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// 提交开票
const handleInvoiceSubmit = async () => {
  // 校验邮箱格式
  if (invoiceForm.invoiceEmail && !validateEmail(invoiceForm.invoiceEmail)) {
    ElMessage.error('请输入有效的邮箱地址');
    return;
  }
  
  try {
    await invoiceTempParkOrder(invoiceForm);
    ElMessage.success('开票申请已提交');
    invoiceDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    ElMessage.error(error.msg);
  }
};

// 获取车牌详情
const handlePlateDetail = (row) => {
  currentPlateNo.value = row.plateNo;
  plateDetailVisible.value = true;
};

// ====================== 告警明细弹窗 ======================
const alarmDialogVisible = ref(false);
const currentAlarmRow = ref({});
const alarmList = ref([]);

function generateAlarmData(row) {
  const count = row.halfyearWarnCount || 0;
  const typeItems = row.highIllegalType.split(',').map((item) => item.trim());
  const avgCount = Math.ceil(count / typeItems.length);
  const types = typeItems.map((name) => {
    return { name, num: avgCount };
  });

  const list = [];
  let id = 1;
  types.forEach((type) => {
    for (let i = 0; i < Math.min(type.num, 5); i++) {
      list.push({
        id: id++,
        canteenName: row.canteenName,
        alarmType: type.name,
        alarmTime: `${row.statCycle.split('-')[0].trim()} ${String(Math.trunc(Math.random() * 24)).padStart(2, '0')}:${String(Math.trunc(Math.random() * 60)).padStart(2, '0')}`,
        alarmLevel: ['一般', '较重', '严重'][Math.trunc(Math.random() * 3)],
        status: ['未处理', '处理中', '已整改'][Math.trunc(Math.random() * 3)],
      });
    }
  });
  return list.slice(0, count);
}

function handleTotal(row) {
  currentAlarmRow.value = row;
  alarmList.value = generateAlarmData(row);
  alarmDialogVisible.value = true;
}

const alarmColumns = [
  { label: '序号', prop: 'id', width: 70 },
  { label: '食堂名称', prop: 'canteenName' },
  { label: '告警类型', prop: 'alarmType' },
  { label: '告警时间', prop: 'alarmTime' },
  { label: '告警等级', prop: 'alarmLevel' },
  { label: '处理状态', prop: 'status' },
];
</script>

<template>
  <div class="park-lot-table-new" v-loading="dataObj.loading">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />
    <enDetailDrawer ref="enDetailObjRef" :detail-obj="dataObj.enDetailObj" />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 告警明细弹窗 -->
    <ElDialog v-model="alarmDialogVisible" title="本半年食品安全问题明细" width="900px" append-to-body>
      <el-table :data="alarmList" border height="450">
        <el-table-column v-for="col in alarmColumns" :key="col.prop" :label="col.label" :prop="col.prop"
          :width="col.width" />
      </el-table>
    </ElDialog>

    <!-- 支付弹窗 -->
    <ElDialog v-model="payDialogVisible" title="订单支付" width="500px" append-to-body>
      <el-form :model="payForm" label-width="80px">
        <el-form-item label="订单ID">
          <el-input v-model="payForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="payForm.remark" type="textarea" rows="3" placeholder="请输入支付备注" />
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
    <ElDialog v-model="cancelDialogVisible" title="取消订单" width="500px" append-to-body>
      <el-form :model="cancelForm" label-width="80px">
        <el-form-item label="订单ID">
          <el-input v-model="cancelForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="cancelForm.remark" type="textarea" rows="3" placeholder="请输入取消备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCancelSubmit">确认取消</el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 退款弹窗 -->
    <ElDialog v-model="refundDialogVisible" title="退款申请" width="500px" append-to-body>
      <el-form :model="refundForm" label-width="80px">
        <el-form-item label="订单ID">
          <el-input v-model="refundForm.id" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="refundForm.remark" type="textarea" rows="3" placeholder="请输入退款备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="refundDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRefundSubmit">确认退款</el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 开票弹窗 -->
    <ElDialog v-model="invoiceDialogVisible" title="开票申请" width="500px" append-to-body>
      <el-form :model="invoiceForm" label-width="80px">
        <el-form-item label="订单ID">
          <el-input v-model="invoiceForm.id" disabled />
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input v-model="invoiceForm.orderNo" disabled />
        </el-form-item>
        <el-form-item label="发票抬头">
          <el-input v-model="invoiceForm.invoiceTitle" placeholder="请输入发票抬头" />
        </el-form-item>
        <el-form-item label="发票税号">
          <el-input v-model="invoiceForm.invoiceTaxNo" placeholder="请输入发票税号" />
        </el-form-item>
        <el-form-item label="接收邮箱">
          <el-input v-model="invoiceForm.invoiceEmail" placeholder="请输入接收邮箱" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="invoiceForm.remark" type="textarea" rows="3" placeholder="请输入开票备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="invoiceDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleInvoiceSubmit">确认开票</el-button>
        </div>
      </template>
    </ElDialog>

    <!-- 车牌详情弹窗 -->
    <PlateNoDetail v-model:visible="plateDetailVisible" :plate-no="currentPlateNo" />

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="导出EXCEL" icon-name="download" @click="handleExport" />
          <IconButton content="批量删除" icon-name="delete" color="#F56C6C" :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch" />
          <IconButton content="搜索" icon-name="search" @click="handleSearchShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <template #status="{ row }">
        <el-tag @click="handleFilterStatus(row.status)" :type="getStatusType(row.status)" class="cursor-pointer">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>
      <template #orderNo="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">
          {{ row.orderNo }}
        </el-text>
      </template>
      <template #stationName="{ row }">
        <el-text @click="handleFilterStationName(row.stationName)" class="common-align cursor-pointer" type="primary">
          {{ row.stationName }}
        </el-text>
      </template>
      <template #plateNo="{ row }">
        <el-text @click="handlePlateDetail(row)" class="common-align" type="primary">
          {{ row.plateNo }}
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
        <el-text @click="handleOpenDetail(row)" class="common-align" type="primary">
          {{ row.orderId }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="支付" v-if="row.status === 'pending_pay'" icon-name="Money" @click="handlePay(row)" />
          <IconButton content="退款" icon-name="back" v-if="row.status === 'paid'" @click="handleRefund(row)" />
          <IconButton content="取消" v-if="row.status === 'pending_pay'" icon-name="delete" color="#F56C6C"
            @click="handleCancel(row)" />
          <IconButton content="开票" v-if="row.status === 'paid' || row.status === 'completed'" icon-name="Document" @click="handleInvoice(row)" />
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
<style scoped>
/* 自定义样式 */
.park-lot-table-new {
  width: 100%;
  height: 100%;
}

.common-toolbar-tools {
  display: flex;
  gap: 8px;
}

.table-toolbar-tools {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.common-total {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 10px 0;
  color: #409eff;
}

.tabel-tab-icon {
  margin-right: 8px;
}

/* 车牌详情弹窗样式 */
.plate-detail-container {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.detail-row {
  display: flex;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.detail-label {
  width: 120px;
  font-weight: 600;
  color: #606266;
  text-align: right;
  margin-right: 20px;
}

.detail-value {
  flex: 1;
  color: #303133;
  word-break: break-all;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #909399;
  font-size: 16px;
}
</style>