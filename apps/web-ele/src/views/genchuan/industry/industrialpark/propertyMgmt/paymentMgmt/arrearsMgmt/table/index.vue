<!-- 内部 index.vue（表格核心） -->
<!-- 路径: src/views/genchuan/industry/industrialPark/propertyMgmt/paymentMgmt/arrearsMgmt/table/index.vue -->
<script setup>
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import {
  getArrearsPage,
  getArrearsStatistics,
  notifyArrears,
  repayArrears,
  updateArrears,
  disableArrears,
  exportArrears,
  getArrearsDetail,
  urgeArrears,
  discountArrears,
} from '#/api/genchuan/industry/industrialpark/propertyMgmt/paymentMgmt/arrearsMgmt/index.js';
import { useFormSchema, useGridColumns } from './data';
import ArrearsDetailDrawer from './detail.vue';
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
  const res = await getArrearsPage(params);
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
  if (['arrearsCompany', 'arrearsItem', 'arrearsStatus'].includes(fieldName)) {
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
  if (obj.arrearsCompany) filters.push({ label: `欠费企业：${obj.arrearsCompany}`, field: 'arrearsCompany' });
  if (obj.arrearsItem) filters.push({ label: `欠费项目：${obj.arrearsItem}`, field: 'arrearsItem' });
  if (obj.arrearsStatus) filters.push({ label: `欠费状态：${obj.arrearsStatus}`, field: 'arrearsStatus' });
  if (obj.arrearsDurationRange) filters.push({ label: `欠费时长：${obj.arrearsDurationRange}`, field: 'arrearsDurationRange' });
  return filters;
});

// 表格组件
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns({ showEnterpriseDetail, showUserDetail, handleFieldClick: (field, value) => handleFieldClick(field, value) }),
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
  window.dispatchEvent(new CustomEvent('arrears-stats-refresh'));
}

// 通用筛选点击
const handleFieldClick = (field, value) => {
  if (field === 'arrearsDuration') {
    let range = '';
    if (value <= 30) range = '0-30天';
    else if (value <= 60) range = '30-60天';
    else range = '60天以上';
    dataObj.searchObj.arrearsDurationRange = range;
  } else {
    handleClearField(field);
    dataObj.searchObj[field] = value;
  }
  gridApi.query();
};

// 企业详情弹窗 (模拟)
const enterpriseDetailDrawerRef = ref(null);
const currentEnterprise = ref({});
function showEnterpriseDetail(enterpriseName) {
  currentEnterprise.value = { enterpriseName, remark: '企业详细信息请查看档案' };
  enterpriseDetailDrawerRef.value?.open(currentEnterprise.value);
}
const [EnterpriseDrawer, enterpriseDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '企业详情',
  onCancel: () => enterpriseDrawerApi.close(),
});
const openEnterpriseDrawer = (data) => { currentEnterprise.value = data; enterpriseDrawerApi.open(); };

// 欠费详情
const arrearsDetailDrawerRef = ref(null);
const currentArrearsDetail = ref({});
async function showArrearsDetail(id) {
  const res = await getArrearsDetail({ id });
  currentArrearsDetail.value = res;
  arrearsDetailDrawerRef.value.open(res);
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

// 全局统计：触发图表刷新，并显示统计信息
async function handleStatistics() {
  const res = await getArrearsStatistics({ timeRange: '近30天' });
  ElMessage.success(`欠费总户数: ${res.cardData?.arrearsCompanyCount}, 欠费总金额: ${res.cardData?.arrearsAmountTotal}, 补缴率: ${res.cardData?.repayRate}%`);
  window.dispatchEvent(new CustomEvent('arrears-stats-refresh'));
}

// 批量提醒
async function handleBatchNotify() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个欠费记录');
  await notifyArrears({ ids: checkedIds.value });
  ElMessage.success('提醒通知已发送');
  handleRefresh();
}

// 批量补缴
async function handleBatchRepay() { openRepayDrawer(null, true); }

// 批量停用
async function handleBatchDisable() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个欠费记录');
  await confirm('确认停用所选企业的服务权限吗？停用后将影响园区服务使用。');
  await disableArrears({ ids: checkedIds.value });
  ElMessage.success('已停用');
  handleRefresh();
}

// 更新抽屉 (单个更新)
const updateForm = reactive({ id: null, arrearsAmount: 0, remark: '' });
const [UpdateDrawer, updateDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '更新欠费记录',
  onCancel: () => updateDrawerApi.close(),
  onConfirm: async () => {
    if (!updateForm.arrearsAmount || updateForm.arrearsAmount <= 0) return ElMessage.warning('请输入有效的欠费金额');
    await updateArrears({ id: updateForm.id, arrearsAmount: updateForm.arrearsAmount, remark: updateForm.remark });
    ElMessage.success('更新成功');
    updateDrawerApi.close();
    handleRefresh();
  },
});
const openUpdateDrawer = (row) => {
  updateForm.id = row.id;
  updateForm.arrearsAmount = row.arrearsAmount;
  updateForm.remark = '';
  updateDrawerApi.open();
};

// 补缴抽屉
const repayForm = reactive({ ids: [], repayAmount: 0, payType: '' });
const [RepayDrawer, repayDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '欠费补缴',
  onCancel: () => repayDrawerApi.close(),
  onConfirm: async () => {
    if (!repayForm.repayAmount || repayForm.repayAmount <= 0) return ElMessage.warning('请输入有效的补缴金额');
    if (!repayForm.payType) return ElMessage.warning('请选择支付方式');
    await repayArrears({ ids: repayForm.ids, repayAmount: repayForm.repayAmount, payType: repayForm.payType });
    ElMessage.success('补缴成功');
    repayDrawerApi.close();
    handleRefresh();
  },
});
const openRepayDrawer = (row, isBatch = false) => {
  if (isBatch) {
    if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个欠费记录');
    repayForm.ids = [...checkedIds.value];
  } else {
    repayForm.ids = [row.id];
  }
  repayForm.repayAmount = 0;
  repayForm.payType = '';
  repayDrawerApi.open();
};

// 催收
async function handleUrge(row) {
  await urgeArrears({ id: row.id });
  ElMessage.success('催收通知已发送');
  handleRefresh();
}

// 减免抽屉
const discountForm = reactive({ id: null, discountAmount: 0 });
const [DiscountDrawer, discountDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '费用减免',
  onCancel: () => discountDrawerApi.close(),
  onConfirm: async () => {
    if (!discountForm.discountAmount || discountForm.discountAmount <= 0) return ElMessage.warning('请输入有效的减免金额');
    await discountArrears({ id: discountForm.id, discountAmount: discountForm.discountAmount });
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

// 导出单条
async function handleExport(row) {
  const params = { id: row.id };
  await exportArrears(params);
  ElMessage.success('导出成功');
}

// 查看（详情）
async function handleView(row) {
  showArrearsDetail(row.id);
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
  window.addEventListener('arrears-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('arrears-chart-refresh', handleChartRefresh);
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
          <IconButton content="统计" icon-name="DataAnalysis" @click="handleStatistics" />
          <IconButton content="提醒" icon-name="Message" :disabled="isEmpty(checkedIds)" @click="handleBatchNotify" />
          <IconButton content="补缴" icon-name="Money" :disabled="isEmpty(checkedIds)" @click="handleBatchRepay" />
          <IconButton content="更新" icon-name="Edit" :disabled="checkedIds.length !== 1" @click="openUpdateDrawer({ id: checkedIds[0], arrearsAmount: 0 })" />
          <IconButton content="停用" icon-name="VideoPause" :disabled="isEmpty(checkedIds)" @click="handleBatchDisable" />
          <IconButton content="筛选" icon-name="search" @click="handleSearchShow" />
          <IconButton content="刷新" icon-name="refresh" @click="handleRefresh" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列模板 -->
      <template #arrears_company="{ row }"><el-text @click="showEnterpriseDetail(row.arrearsCompany)" type="primary" style="cursor: pointer">{{ row.arrearsCompany }}</el-text></template>
      <template #arrears_item="{ row }"><el-tag @click="handleFieldClick('arrearsItem', row.arrearsItem)" style="cursor: pointer">{{ row.arrearsItem }}</el-tag></template>
      <template #arrears_duration="{ row }"><span @click="handleFieldClick('arrearsDuration', row.arrearsDuration)" style="cursor: pointer; color: #409EFF;">{{ row.arrearsDuration }}天</span></template>
      <template #arrears_status="{ row }"><el-tag :type="row.arrearsStatus === '已补缴' ? 'success' : 'danger'" @click="handleFieldClick('arrearsStatus', row.arrearsStatus)" style="cursor: pointer">{{ row.arrearsStatus }}</el-tag></template>
      <template #handle_user="{ row }"><el-text v-if="row.handleUser" @click="showUserDetail(row.handleUser)" type="primary" style="cursor: pointer">{{ getUserName(row.handleUser) }}</el-text><span v-else>-</span></template>

      <!-- 操作列：根据欠费状态显示不同按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-if="row.arrearsStatus === '待补缴'">
            <IconButton content="提醒" icon-name="Message" @click="handleBatchNotify" />
            <IconButton content="催收" icon-name="Bell" @click="handleUrge(row)" />
            <IconButton content="减免" icon-name="Money" @click="openDiscountDrawer(row)" />
          </template>
          <template v-else-if="row.arrearsStatus === '已补缴'">
            <IconButton content="更新" icon-name="Edit" @click="openUpdateDrawer(row)" />
            <IconButton content="查看" icon-name="View" @click="handleView(row)" />
            <IconButton content="导出" icon-name="Download" @click="handleExport(row)" />
          </template>
        </div>
      </template>
    </Grid>

    <SearchDrawer title="搜索"><QueryForm class="query-form" /></SearchDrawer>

    <!-- 抽屉弹窗 -->
    <UpdateDrawer>
      <el-form :model="updateForm" label-width="100px">
        <el-form-item label="欠费金额(元)" required><el-input-number v-model="updateForm.arrearsAmount" :min="0" :precision="2" style="width:100%" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="updateForm.remark" type="textarea" /></el-form-item>
      </el-form>
    </UpdateDrawer>

    <RepayDrawer>
      <el-form :model="repayForm" label-width="100px">
        <el-form-item label="补缴金额(元)" required><el-input-number v-model="repayForm.repayAmount" :min="0" :precision="2" style="width:100%" /></el-form-item>
        <el-form-item label="支付方式" required><el-select v-model="repayForm.payType" placeholder="请选择"><el-option label="微信" value="微信" /><el-option label="支付宝" value="支付宝" /><el-option label="银行卡" value="银行卡" /></el-select></el-form-item>
      </el-form>
    </RepayDrawer>

    <DiscountDrawer>
      <el-form :model="discountForm" label-width="100px">
        <el-form-item label="减免金额(元)" required><el-input-number v-model="discountForm.discountAmount" :min="0" :precision="2" style="width:100%" /></el-form-item>
      </el-form>
    </DiscountDrawer>

    <EnterpriseDrawer>
      <div class="detail-card-row"><div class="detail-row-left">企业名称：</div><div class="detail-row-right">{{ currentEnterprise.enterpriseName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">备注：</div><div class="detail-row-right">{{ currentEnterprise.remark || '-' }}</div></div>
    </EnterpriseDrawer>

    <ArrearsDetailDrawer ref="arrearsDetailDrawerRef" :detail-obj="currentArrearsDetail" title="欠费详情" />
    <UserDetailDrawer ref="userDetailDrawerRef" />
  </div>
</template>
