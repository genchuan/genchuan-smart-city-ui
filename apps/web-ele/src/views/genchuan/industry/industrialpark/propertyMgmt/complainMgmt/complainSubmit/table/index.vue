<!-- 内部 index.vue（表格核心） -->
<!-- 路径: src/views/genchuan/industry/industrialPark/propertyMgmt/paymentMgmt/billMgmt/table/index.vue -->
<script setup>
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import {
  getBillPage,
  generateBill,
  calculateBill,
  pushBill,
  payBill,
  invoiceBill,
  exportBill,
  getBillDetail,
  remindBill,
  discountBill,
  repayBill,
  notifyBill,
  disableBill,
  updateBill,
} from '#/api/genchuan/industry/industrialpark/propertyMgmt/paymentMgmt/billMgmt/index.js';
import { useFormSchema, useGridColumns } from './data';
import BillDetailDrawer from './detail.vue';
import UserDetailDrawer from '#/views/genchuan/industry/chargePark/carService/carGuide/nearStation/table/userDetail.vue';

const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);
const arrowChange = () => emit('arrow-change');

const checkedIds = ref([]);
const handleRowCheckboxChange = ({ records }) => { checkedIds.value = records.map(item => item.id); };

const dataObj = reactive({
  detailObj: {},
  total: 0,
  list: [],
  searchObj: {},
  currentPage: 1,
  pageSize: 10,
});

// 用户映射
const userMap = ref(new Map());
async function fetchUserMappings() {
  try {
    const users = [{ userId: 'admin', userName: '管理员' }, { userId: 'property_admin', userName: '物业管理员' }, { userId: 'enterprise_user', userName: '企业用户' }];
    users.forEach(user => userMap.value.set(user.userId, user.userName));
  } catch (error) { console.error('获取用户数据失败', error); }
}
function getUserName(id) { return userMap.value.get(id) || id; }

// 获取表格数据
const getTableData = async (pageObj) => {
  const params = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.searchObj,
  };
  const res = await getBillPage(params);
  dataObj.total = res.total;
  dataObj.list = (res.list || []).map(v => ({
    ...v,
    createTime: formatTimestamp(v.createTime),
    updateTime: formatTimestamp(v.updateTime),
  }));
  return dataObj;
};

// 搜索表单
const [QueryForm, QueryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema().filter(v => v.isSearch).map(v => { delete v.rules; return v; }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: { content: '重置', onClick: () => { QueryFormApi.resetForm(); QueryFormApi.submitForm(); } },
});

const resetAllFilters = async () => {
  dataObj.searchObj = {};
  await QueryFormApi.resetFields();
  dataObj.currentPage = 1;
  gridApi.query();
};

async function onSubmit(values, isReset = false) {
  if (isReset) await resetAllFilters();
  else {
    dataObj.searchObj = { ...values };
    dataObj.currentPage = 1;
    gridApi.query();
    searchDrawerApi?.close?.();
  }
}

const handleClearField = async (fieldName) => {
  const newSearchObj = { ...dataObj.searchObj };
  delete newSearchObj[fieldName];
  dataObj.searchObj = newSearchObj;
  if (['billCode', 'payCompany', 'payItem', 'billStatus', 'payType', 'invoiceStatus'].includes(fieldName)) {
    const currentFormValues = await QueryFormApi.getValues();
    delete currentFormValues[fieldName];
    await QueryFormApi.setValues(currentFormValues, false);
  }
  dataObj.currentPage = 1;
  gridApi.query();
};

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchObj;
  if (obj.billCode) filters.push({ label: `账单编号：${obj.billCode}`, field: 'billCode' });
  if (obj.payCompany) filters.push({ label: `缴费企业：${obj.payCompany}`, field: 'payCompany' });
  if (obj.payItem) filters.push({ label: `缴费项目：${obj.payItem}`, field: 'payItem' });
  if (obj.billStatus) filters.push({ label: `账单状态：${obj.billStatus}`, field: 'billStatus' });
  if (obj.payType) filters.push({ label: `支付方式：${obj.payType}`, field: 'payType' });
  if (obj.invoiceStatus) filters.push({ label: `发票状态：${obj.invoiceStatus}`, field: 'invoiceStatus' });
  return filters;
});

// 表格组件
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns({ getUserName, showBillDetail, showUserDetail, handleFieldClick: (field, value) => handleFieldClick(field, value) }),
    keepSource: true,
    proxyConfig: { ajax: { query: async ({ page }) => getTableData({ page }) } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: { checkboxAll: handleRowCheckboxChange, checkboxChange: handleRowCheckboxChange },
  showSearchForm: false,
});

function handleRefresh() {
  gridApi.query();
  window.dispatchEvent(new CustomEvent('bill-stats-refresh'));
}

// 通用筛选点击
const handleFieldClick = (field, value) => {
  handleClearField(field);
  dataObj.searchObj[field] = value;
  gridApi.query();
};

// 账单详情
const billDetailDrawerRef = ref(null);
const currentBillDetail = ref({});
async function showBillDetail(id) {
  const res = await getBillDetail(id);
  currentBillDetail.value = res;
  billDetailDrawerRef.value.open(res);
}

// 用户详情
const userDetailDrawerRef = ref(null);
async function showUserDetail(userId) {
  if (!userId) return ElMessage.warning('用户ID不存在');
  try {
    const { getUserDetail } = await import('#/api/genchuan/industry/industrialpark/energyMgmt/energyAnalyze/energyAlarm/index.js');
    const userDetail = await getUserDetail(userId);
    userDetailDrawerRef.value?.open(userDetail);
  } catch (error) { ElMessage.error('获取用户详情失败'); }
}

// ---------- 批量操作 ----------
async function handleBatchGenerate() { openGenerateDrawer(); }
async function handleBatchCalculate() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个账单');
  await calculateBill({ ids: checkedIds.value });
  ElMessage.success('核算成功');
  handleRefresh();
}
async function handleBatchPush() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个账单');
  await pushBill({ ids: checkedIds.value });
  ElMessage.success('推送成功');
  handleRefresh();
}
async function handleBatchPay() { openPayDrawer(); }

// 批量开票（增加二次确认）
async function handleBatchInvoice() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个账单');
  await confirm('确认开具选中账单的发票吗？开票后不可撤销。');
  await invoiceBill({ ids: checkedIds.value });
  ElMessage.success('开票成功');
  handleRefresh();
}

// 生成账单抽屉
const generateForm = reactive({ payCompany: '', payItem: '', billMonth: '' });
const generateFormRef = ref(null);
const generateRules = {
  billMonth: [{ required: true, message: '请选择账单月份', trigger: 'blur' }],
};
const [GenerateDrawer, generateDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '生成账单',
  onCancel: () => generateDrawerApi.close(),
  onConfirm: async () => {
    let valid = false;
    try { valid = await generateFormRef.value?.validate(); } catch { ElMessage.warning('请填写所有必填字段'); return; }
    if (valid === false) { ElMessage.warning('请填写所有必填字段'); return; }
    await generateBill(generateForm);
    ElMessage.success('账单生成成功');
    generateDrawerApi.close();
    handleRefresh();
  },
});
const openGenerateDrawer = () => {
  generateForm.payCompany = '';
  generateForm.payItem = '';
  generateForm.billMonth = '';
  generateDrawerApi.open();
};

// 缴费抽屉
const payForm = reactive({ payType: '' });
const [PayDrawer, payDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '在线缴费',
  onCancel: () => payDrawerApi.close(),
  onConfirm: async () => {
    if (!payForm.payType) return ElMessage.warning('请选择支付方式');
    await payBill({ ids: checkedIds.value, payType: payForm.payType });
    ElMessage.success('缴费成功');
    payDrawerApi.close();
    handleRefresh();
  },
});
const openPayDrawer = () => {
  payForm.payType = '';
  payDrawerApi.open();
};

// 催缴
async function handleRemind(row) {
  await remindBill({ id: row.id });
  ElMessage.success('催缴通知已发送');
  handleRefresh();
}

// 减免抽屉
const discountForm = reactive({ id: null, discountAmount: 0 });
const [DiscountDrawer, discountDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '费用减免',
  onCancel: () => discountDrawerApi.close(),
  onConfirm: async () => {
    if (!discountForm.discountAmount || discountForm.discountAmount <= 0) return ElMessage.warning('请输入有效的减免金额');
    await discountBill({ id: discountForm.id, discountAmount: discountForm.discountAmount });
    ElMessage.success('减免成功');
    discountDrawerApi.close();
    handleRefresh();
  },
});
const openDiscountDrawer = (row) => {
  discountForm.id = row.id;
  discountForm.discountAmount = 0;
  discountDrawerApi.open();
};

// 补缴抽屉
const repayForm = reactive({ id: null, repayAmount: 0, payType: '' });
const [RepayDrawer, repayDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '补缴欠费',
  onCancel: () => repayDrawerApi.close(),
  onConfirm: async () => {
    if (!repayForm.repayAmount || repayForm.repayAmount <= 0) return ElMessage.warning('请输入有效的补缴金额');
    if (!repayForm.payType) return ElMessage.warning('请选择支付方式');
    await repayBill({ id: repayForm.id, repayAmount: repayForm.repayAmount, payType: repayForm.payType });
    ElMessage.success('补缴成功');
    repayDrawerApi.close();
    handleRefresh();
  },
});
const openRepayDrawer = (row) => {
  repayForm.id = row.id;
  repayForm.repayAmount = 0;
  repayForm.payType = '';
  repayDrawerApi.open();
};

// 提醒
async function handleNotify(row) {
  await notifyBill({ id: row.id });
  ElMessage.success('提醒通知已发送');
  handleRefresh();
}

// 停用确认
async function handleDisable(row) {
  await confirm('确认停用该企业的服务权限吗？停用后将影响园区服务使用。');
  await disableBill({ id: row.id });
  ElMessage.success('已停用');
  handleRefresh();
}

// 查看（详情）
async function handleView(row) {
  showBillDetail(row.id);
}

// 导出单条
async function handleExport(row) {
  const params = { billCode: row.billCode };
  await exportBill(params);
  ElMessage.success('导出成功');
}

// 行内开票（增加二次确认）
async function handleRowInvoice(row) {
  await confirm(`确认为账单 ${row.billCode} 开具发票吗？`);
  await invoiceBill({ ids: [row.id] });
  ElMessage.success('开票成功');
  handleRefresh();
}

// 图表钻取事件
const handleChartRefresh = (event) => {
  const filters = event.detail;
  if (!filters || Object.keys(filters).length === 0) {
    dataObj.searchObj = {};
    dataObj.currentPage = 1;
    gridApi.query();
    return;
  }
  dataObj.searchObj = { ...dataObj.searchObj, ...filters };
  dataObj.currentPage = 1;
  gridApi.query();
};

onMounted(() => {
  fetchUserMappings();
  window.addEventListener('bill-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('bill-chart-refresh', handleChartRefresh);
});

const handleSearchShow = () => searchDrawerApi.open();
const handleFullShow = () => screenfull.toggle();

const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 500,
  onCancel: () => searchDrawerApi.close(),
});
</script>

<template>
  <div class="park-lot-table-new">
    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <el-tag v-for="filter in activeFilters" :key="filter.field" type="primary" closable @close="handleClearField(filter.field)">
            {{ filter.label }}
          </el-tag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="生成" icon-name="Plus" @click="handleBatchGenerate" />
          <IconButton content="核算" icon-name="Setting" :disabled="isEmpty(checkedIds)" @click="handleBatchCalculate" />
          <IconButton content="推送" icon-name="Message" :disabled="isEmpty(checkedIds)" @click="handleBatchPush" />
          <IconButton content="缴费" icon-name="Money" :disabled="isEmpty(checkedIds)" @click="handleBatchPay" />
          <IconButton content="开票" icon-name="DataAnalysis" :disabled="isEmpty(checkedIds)" @click="handleBatchInvoice" />
          <IconButton content="筛选" icon-name="search" @click="handleSearchShow" />
          <IconButton content="刷新" icon-name="refresh" @click="handleRefresh" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列模板 -->
      <template #bill_code="{ row }"><el-text @click="showBillDetail(row.id)" type="primary">{{ row.billCode }}</el-text></template>
      <template #pay_company="{ row }"><el-text @click="handleFieldClick('payCompany', row.payCompany)" type="primary" style="cursor: pointer">{{ row.payCompany }}</el-text></template>
      <template #pay_item="{ row }"><el-tag @click="handleFieldClick('payItem', row.payItem)" style="cursor: pointer">{{ row.payItem }}</el-tag></template>
      <template #bill_status="{ row }"><el-tag :type="row.billStatus === '已缴费' ? 'success' : row.billStatus === '待缴费' ? 'warning' : 'danger'" @click="handleFieldClick('billStatus', row.billStatus)" style="cursor: pointer">{{ row.billStatus }}</el-tag></template>
      <template #pay_type="{ row }"><span v-if="row.payType" @click="handleFieldClick('payType', row.payType)" style="cursor: pointer">{{ row.payType }}</span><span v-else>-</span></template>
      <template #invoice_status="{ row }"><el-tag :type="row.invoiceStatus === '已开具' ? 'success' : 'info'" @click="handleFieldClick('invoiceStatus', row.invoiceStatus)" style="cursor: pointer">{{ row.invoiceStatus }}</el-tag></template>
      <template #handle_user="{ row }"><el-text v-if="row.handleUser" @click="showUserDetail(row.handleUser)" type="primary" style="cursor: pointer">{{ getUserName(row.handleUser) }}</el-text><span v-else>-</span></template>

      <!-- 操作列：根据账单状态显示不同按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 待缴费状态：推送、催缴、减免 -->
          <template v-if="row.billStatus === '待缴费'">
            <IconButton content="推送" icon-name="Message" @click="async () => { await pushBill({ ids: [row.id] }); handleRefresh(); }" />
            <IconButton content="催缴" icon-name="Bell" @click="handleRemind(row)" />
            <IconButton content="减免" icon-name="Money" @click="openDiscountDrawer(row)" />
          </template>
          <!-- 已缴费状态：开票（带确认）、查看、导出 -->
          <template v-else-if="row.billStatus === '已缴费'">
            <IconButton content="开票" icon-name="DataAnalysis" @click="handleRowInvoice(row)" />
            <IconButton content="查看" icon-name="View" @click="handleView(row)" />
            <IconButton content="导出" icon-name="Download" @click="handleExport(row)" />
          </template>
          <!-- 已欠费状态：补缴、提醒、停用 -->
          <template v-else-if="row.billStatus === '已欠费'">
            <IconButton content="补缴" icon-name="Money" @click="openRepayDrawer(row)" />
            <IconButton content="提醒" icon-name="Bell" @click="handleNotify(row)" />
            <IconButton content="停用" icon-name="VideoPause" @click="handleDisable(row)" />
          </template>
        </div>
      </template>
    </Grid>

    <SearchDrawer title="搜索"><QueryForm class="query-form" /></SearchDrawer>

    <!-- 抽屉弹窗 -->
    <GenerateDrawer>
      <el-form ref="generateFormRef" :model="generateForm" :rules="generateRules" label-width="100px">
        <el-form-item label="缴费企业"><el-input v-model="generateForm.payCompany" placeholder="为空则全量生成" /></el-form-item>
        <el-form-item label="缴费项目"><el-select v-model="generateForm.payItem" clearable placeholder="请选择"><el-option label="物业费" value="物业费" /><el-option label="水电费" value="水电费" /><el-option label="停车费" value="停车费" /></el-select></el-form-item>
        <el-form-item label="账单月份" prop="billMonth"><el-input v-model="generateForm.billMonth" placeholder="格式：yyyy-MM，如2025-05" /></el-form-item>
      </el-form>
    </GenerateDrawer>

    <PayDrawer>
      <el-form :model="payForm" label-width="100px">
        <el-form-item label="支付方式" required><el-select v-model="payForm.payType" placeholder="请选择"><el-option label="微信" value="微信" /><el-option label="支付宝" value="支付宝" /><el-option label="银行卡" value="银行卡" /></el-select></el-form-item>
      </el-form>
    </PayDrawer>

    <DiscountDrawer>
      <el-form :model="discountForm" label-width="100px">
        <el-form-item label="减免金额(元)" required><el-input-number v-model="discountForm.discountAmount" :min="0" :precision="2" style="width:100%" /></el-form-item>
      </el-form>
    </DiscountDrawer>

    <RepayDrawer>
      <el-form :model="repayForm" label-width="100px">
        <el-form-item label="补缴金额(元)" required><el-input-number v-model="repayForm.repayAmount" :min="0" :precision="2" style="width:100%" /></el-form-item>
        <el-form-item label="支付方式" required><el-select v-model="repayForm.payType" placeholder="请选择"><el-option label="微信" value="微信" /><el-option label="支付宝" value="支付宝" /><el-option label="银行卡" value="银行卡" /></el-select></el-form-item>
      </el-form>
    </RepayDrawer>

    <BillDetailDrawer ref="billDetailDrawerRef" :detail-obj="currentBillDetail" title="账单详情" />
    <UserDetailDrawer ref="userDetailDrawerRef" />
  </div>
</template>
