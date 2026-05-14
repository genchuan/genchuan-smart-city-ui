<!-- 内部 index.vue（表格核心） -->
<!-- 路径: src/views/genchuan/industry/industrialPark/energyMgmt/energyControl/strategySet/table/index.vue -->
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
  getStrategyPage,
  createStrategy,
  setStrategyParam,
  enableStrategy,
  evaluateStrategy,
  optimizeStrategy,
  pauseStrategy,
  updateStrategy,
  deleteStrategy,
  getStrategyDetail,
  getDeviceDetail,
  getEvaluateDetail,
} from '#/api/genchuan/industry/industrialpark/energyMgmt/energyControl/strategySet/index.js';
import { useFormSchema, useGridColumns } from './data';
import StrategyDetailDrawer from './detail.vue';
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
    const users = [{ userId: 'admin', userName: '管理员' }, { userId: 'energy_operator', userName: '能耗操作员' }, { userId: 'maintainer', userName: '维护工程师' }];
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
  const res = await getStrategyPage(params);
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
  if (fieldName === 'strategyName' || fieldName === 'strategyType' || fieldName === 'strategyStatus') {
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
  if (obj.strategyName) filters.push({ label: `策略名称：${obj.strategyName}`, field: 'strategyName' });
  if (obj.strategyType) filters.push({ label: `策略类型：${obj.strategyType}`, field: 'strategyType' });
  if (obj.strategyStatus) filters.push({ label: `策略状态：${obj.strategyStatus}`, field: 'strategyStatus' });
  if (obj.executeTime) filters.push({ label: `执行时间：${obj.executeTime}`, field: 'executeTime' });
  return filters;
});

// 表格组件
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns({ getUserName, showStrategyDetail, showDeviceDetail, showEvaluateDetail, showUserDetail, handleTypeFilter: (type) => handleFieldClick('strategyType', type), handleStatusFilter: (status) => handleFieldClick('strategyStatus', status) }),
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
  window.dispatchEvent(new CustomEvent('strategy-stats-refresh'));
}

// 通用筛选点击
const handleFieldClick = (field, value) => {
  handleClearField(field);
  dataObj.searchObj[field] = value;
  gridApi.query();
};

// 策略详情
const strategyDetailDrawerRef = ref(null);
const currentStrategyDetail = ref({});
async function showStrategyDetail(id) {
  const res = await getStrategyDetail({ id });
  currentStrategyDetail.value = res;
  strategyDetailDrawerRef.value.open(res);
}

// 设备明细
const deviceDetailDrawerRef = ref(null);
const currentDeviceDetail = ref({});
async function showDeviceDetail(deviceId) {
  if (!deviceId) return ElMessage.warning('设备ID不存在');
  const res = await getDeviceDetail(deviceId);
  currentDeviceDetail.value = res;
  deviceDetailDrawerRef.value.open(res);
}

// 评估详情
const evaluateDetailDrawerRef = ref(null);
const currentEvaluateDetail = ref({});
async function showEvaluateDetail(id) {
  const res = await getEvaluateDetail(id);
  currentEvaluateDetail.value = res;
  evaluateDetailDrawerRef.value.open(res);
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
async function handleBatchCreate() { openCreateDrawer(); }
async function handleBatchSet() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个策略');
  currentBatchIds = checkedIds.value;
  setParamForm.param = {};
  setParamDrawerApi.open();
}
async function handleBatchEnable() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个策略');
  await enableStrategy({ ids: checkedIds.value });
  ElMessage.success('启用成功');
  handleRefresh();
}
async function handleBatchEvaluate() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个策略');
  await evaluateStrategy({ ids: checkedIds.value });
  ElMessage.success('评估已发起');
  handleRefresh();
}
async function handleBatchOptimize() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个策略');
  currentBatchIds = checkedIds.value;
  optimizeForm.optimizeParam = {};
  optimizeDrawerApi.open();
}

// 制定抽屉
const createForm = reactive({ strategyName: '', strategyType: '', deviceId: null, executeTime: '' });
const createFormRef = ref(null);
const createRules = {
  strategyName: [{ required: true, message: '请输入策略名称', trigger: 'blur' }],
  strategyType: [{ required: true, message: '请选择策略类型', trigger: 'change' }],
  deviceId: [{ required: true, message: '请输入关联设备ID', trigger: 'blur' }],
  executeTime: [{ required: true, message: '请输入执行时间', trigger: 'blur' }],
};
const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '制定节能策略',
  onCancel: () => createDrawerApi.close(),
  onConfirm: async () => {
    let valid = false;
    try { valid = await createFormRef.value?.validate(); } catch { ElMessage.warning('请填写所有必填字段'); return; }
    if (valid === false) { ElMessage.warning('请填写所有必填字段'); return; }
    await createStrategy(createForm);
    ElMessage.success('策略制定成功');
    createDrawerApi.close();
    handleRefresh();
  },
});
const openCreateDrawer = () => {
  createForm.strategyName = '';
  createForm.strategyType = '';
  createForm.deviceId = null;
  createForm.executeTime = '';
  createDrawerApi.open();
};

// 设置参数抽屉
let currentBatchIds = [];
const setParamForm = reactive({ param: {} });
const [SetParamDrawer, setParamDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '策略参数设置',
  onCancel: () => setParamDrawerApi.close(),
  onConfirm: async () => {
    if (!setParamForm.param || Object.keys(setParamForm.param).length === 0) return ElMessage.warning('请填写参数');
    await setStrategyParam({ ids: currentBatchIds, param: setParamForm.param });
    ElMessage.success('参数设置成功');
    setParamDrawerApi.close();
    handleRefresh();
  },
});

// 优化抽屉
const optimizeForm = reactive({ optimizeParam: {} });
const [OptimizeDrawer, optimizeDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '策略参数优化',
  onCancel: () => optimizeDrawerApi.close(),
  onConfirm: async () => {
    if (!optimizeForm.optimizeParam || Object.keys(optimizeForm.optimizeParam).length === 0) return ElMessage.warning('请填写优化参数');
    await optimizeStrategy({ ids: currentBatchIds, optimizeParam: optimizeForm.optimizeParam });
    ElMessage.success('优化成功');
    optimizeDrawerApi.close();
    handleRefresh();
  },
});

// 行内操作
async function handlePause(row) {
  await pauseStrategy({ id: row.id });
  ElMessage.success('策略已暂停');
  handleRefresh();
}
async function handleAdjust(row) {
  currentBatchIds = [row.id];
  setParamForm.param = {};
  setParamDrawerApi.open();
}
async function handleModify(row) {
  currentModifyRow = row;
  modifyForm.strategyName = row.strategyName;
  modifyForm.executeTime = row.executeTime;
  modifyDrawerApi.open();
}
async function handleDelete(row) {
  await confirm('确认删除该策略吗？删除后不可恢复。');
  await deleteStrategy({ id: row.id });
  ElMessage.success('删除成功');
  handleRefresh();
}
let currentModifyRow = null;
const modifyForm = reactive({ strategyName: '', executeTime: '' });
const [ModifyDrawer, modifyDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '修改策略信息',
  onCancel: () => modifyDrawerApi.close(),
  onConfirm: async () => {
    if (!modifyForm.strategyName) return ElMessage.warning('请填写策略名称');
    await updateStrategy({ id: currentModifyRow.id, strategyName: modifyForm.strategyName, executeTime: modifyForm.executeTime });
    ElMessage.success('修改成功');
    modifyDrawerApi.close();
    handleRefresh();
  },
});

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
  window.addEventListener('strategy-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('strategy-chart-refresh', handleChartRefresh);
});

const handleSearchShow = () => searchDrawerApi.open();
const handleFullShow = () => screenfull.toggle();

const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 500,
  onCancel: () => searchDrawerApi.close(),
});

// 设备明细抽屉
const [DeviceDetailDrawer, deviceDetailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 600,
  title: '设备明细',
  onCancel: () => deviceDetailDrawerApi.close(),
});
// 评估详情抽屉
const [EvaluateDetailDrawer, evaluateDetailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 550,
  title: '评估详情',
  onCancel: () => evaluateDetailDrawerApi.close(),
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
          <IconButton content="制定" icon-name="Plus" @click="handleBatchCreate" />
          <IconButton content="设置" icon-name="Setting" :disabled="isEmpty(checkedIds)" @click="handleBatchSet" />
          <IconButton content="启用" icon-name="CaretRight" :disabled="isEmpty(checkedIds)" @click="handleBatchEnable" />
          <IconButton content="评估" icon-name="DataAnalysis" :disabled="isEmpty(checkedIds)" @click="handleBatchEvaluate" />
          <IconButton content="优化" icon-name="Edit" :disabled="isEmpty(checkedIds)" @click="handleBatchOptimize" />
          <IconButton content="筛选" icon-name="search" @click="handleSearchShow" />
          <IconButton content="刷新" icon-name="refresh" @click="handleRefresh" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列模板 -->
      <template #id="{ row }"><el-text @click="showStrategyDetail(row.id)" type="primary">{{ row.id }}</el-text></template>
      <template #strategy_name="{ row }"><el-text @click="showStrategyDetail(row.id)" type="primary" style="cursor: pointer">{{ row.strategyName }}</el-text></template>
      <template #strategy_type="{ row }"><el-tag @click="handleFieldClick('strategyType', row.strategyType)" style="cursor: pointer">{{ row.strategyType }}</el-tag></template>
      <template #device_name="{ row }"><el-text v-if="row.deviceId" @click="showDeviceDetail(row.deviceId)" type="primary" style="cursor: pointer">{{ row.deviceName || row.deviceId }}</el-text><span v-else>-</span></template>
      <template #strategy_status="{ row }"><el-tag :type="row.strategyStatus === '已启用' ? 'success' : 'info'" @click="handleFieldClick('strategyStatus', row.strategyStatus)" style="cursor: pointer">{{ row.strategyStatus }}</el-tag></template>
      <template #evaluate_result="{ row }"><el-text v-if="row.evaluateResult" @click="showEvaluateDetail(row.id)" type="primary" style="cursor: pointer">{{ row.evaluateResult }}</el-text><span v-else>-</span></template>
      <template #handle_user="{ row }"><el-text v-if="row.handleUser" @click="showUserDetail(row.handleUser)" type="primary" style="cursor: pointer">{{ getUserName(row.handleUser) }}</el-text><span v-else>-</span></template>

      <!-- 操作列：根据状态显示不同按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-if="row.strategyStatus === '已启用'">
            <IconButton content="暂停" icon-name="VideoPause" @click="handlePause(row)" />
            <IconButton content="调整" icon-name="Edit" @click="handleAdjust(row)" />
            <IconButton content="评估" icon-name="DataAnalysis" @click="async () => { await evaluateStrategy({ ids: [row.id] }); handleRefresh(); }" />
          </template>
          <template v-else>
            <IconButton content="启用" icon-name="CaretRight" @click="async () => { await enableStrategy({ ids: [row.id] }); handleRefresh(); }" />
            <IconButton content="修改" icon-name="Edit" @click="handleModify(row)" />
            <IconButton content="删除" icon-name="Delete" @click="handleDelete(row)" />
          </template>
        </div>
      </template>
    </Grid>

    <SearchDrawer title="搜索"><QueryForm class="query-form" /></SearchDrawer>

    <!-- 抽屉弹窗 -->
    <CreateDrawer>
      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="100px">
        <el-form-item label="策略名称" prop="strategyName"><el-input v-model="createForm.strategyName" placeholder="请输入策略名称" /></el-form-item>
        <el-form-item label="策略类型" prop="strategyType"><el-select v-model="createForm.strategyType" placeholder="请选择"><el-option label="照明" value="照明" /><el-option label="空调" value="空调" /><el-option label="设备" value="设备" /></el-select></el-form-item>
        <el-form-item label="关联设备ID" prop="deviceId"><el-input-number v-model="createForm.deviceId" :min="1" style="width:100%" /></el-form-item>
        <el-form-item label="执行时间" prop="executeTime"><el-input v-model="createForm.executeTime" placeholder="如：工作日 18:00-次日8:00" /></el-form-item>
      </el-form>
    </CreateDrawer>

    <SetParamDrawer>
      <el-form :model="setParamForm" label-width="100px">
        <el-form-item label="策略参数"><el-input v-model="setParamForm.param.temp" placeholder="温度(℃)" /><el-input v-model="setParamForm.param.speed" placeholder="风速" /></el-form-item>
      </el-form>
    </SetParamDrawer>

    <OptimizeDrawer>
      <el-form :model="optimizeForm" label-width="100px">
        <el-form-item label="优化参数"><el-input v-model="optimizeForm.optimizeParam.temp" placeholder="温度(℃)" /><el-input v-model="optimizeForm.optimizeParam.speed" placeholder="风速" /></el-form-item>
      </el-form>
    </OptimizeDrawer>

    <ModifyDrawer>
      <el-form :model="modifyForm" label-width="100px">
        <el-form-item label="策略名称"><el-input v-model="modifyForm.strategyName" /></el-form-item>
        <el-form-item label="执行时间"><el-input v-model="modifyForm.executeTime" /></el-form-item>
      </el-form>
    </ModifyDrawer>

    <StrategyDetailDrawer ref="strategyDetailDrawerRef" :detail-obj="currentStrategyDetail" title="策略详情" />
    <UserDetailDrawer ref="userDetailDrawerRef" />

    <DeviceDetailDrawer>
      <div class="detail-card">
        <div class="detail-card-row"><div class="detail-row-left">设备ID：</div><div class="detail-row-right">{{ currentDeviceDetail.id || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">设备名称：</div><div class="detail-row-right">{{ currentDeviceDetail.deviceName || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">设备类型：</div><div class="detail-row-right">{{ currentDeviceDetail.deviceType || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">所在区域：</div><div class="detail-row-right">{{ currentDeviceDetail.areaName || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">运行状态：</div><div class="detail-row-right">{{ currentDeviceDetail.status || '-' }}</div></div>
      </div>
    </DeviceDetailDrawer>

    <EvaluateDetailDrawer>
      <div class="detail-card">
        <div class="detail-card-row"><div class="detail-row-left">评估结果：</div><div class="detail-row-right">{{ currentEvaluateDetail.evaluateResult || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">节能总量：</div><div class="detail-row-right">{{ currentEvaluateDetail.saveEnergy || '-' }} kWh</div></div>
        <div class="detail-card-row"><div class="detail-row-left">节能率：</div><div class="detail-row-right">{{ currentEvaluateDetail.saveRate || '-' }}%</div></div>
        <div class="detail-card-row"><div class="detail-row-left">评估时间：</div><div class="detail-row-right">{{ currentEvaluateDetail.evaluateTime || '-' }}</div></div>
      </div>
    </EvaluateDetailDrawer>
  </div>
</template>
