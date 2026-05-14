<!-- ==================== 内部 index.vue（核心修改） ==================== -->
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
  getEnergyAlarmPage,
  createEnergyAlarm,
  monitorEnergyAlarm,
  triggerEnergyAlarm,
  handleEnergyAlarm,
  rectifyEnergyAlarm,
  updateEnergyAlarm,
  ignoreEnergyAlarm,
  getEnergyAlarmDetail,
  getAreaDetailById,
  getHandleResultDetail,
  getUserDetail,
} from '#/api/genchuan/industry/industrialpark/energyMgmt/energyAnalyze/energyAlarm/index.js';
import { useFormSchema, useGridColumns } from './data';
import AreaDetailDrawer from './detail.vue';
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
  const res = await getEnergyAlarmPage(params);
  dataObj.total = res.total;
  dataObj.list = (res.list || []).map(v => ({
    ...v,
    triggerTime: formatTimestamp(v.triggerTime),
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
  if (fieldName === 'alarmName' || fieldName === 'alarmType' || fieldName === 'alarmStatus' || fieldName === 'handleResult') {
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
  if (obj.alarmName) filters.push({ label: `预警名称：${obj.alarmName}`, field: 'alarmName' });
  if (obj.alarmType) filters.push({ label: `预警类型：${obj.alarmType}`, field: 'alarmType' });
  if (obj.alarmStatus) filters.push({ label: `预警状态：${obj.alarmStatus}`, field: 'alarmStatus' });
  if (obj.handleResult) filters.push({ label: `处置结果：${obj.handleResult}`, field: 'handleResult' });
  return filters;
});

// 表格组件
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns({ getUserName, showAlarmDetail, showAreaDetail, showHandleResultDetail, showUserDetail }),
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
  window.dispatchEvent(new CustomEvent('alarm-stats-refresh'));
}

// 预警详情抽屉（使用 api 控制）
const currentAlarmDetail = ref({});
const [AlarmDetailDrawer, alarmDetailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 650,
  title: '预警详情',
  onCancel: () => alarmDetailDrawerApi.close(),
});
async function showAlarmDetail(id) {
  const res = await getEnergyAlarmDetail({ id });
  currentAlarmDetail.value = res;
  alarmDetailDrawerApi.open();
}

// 关联区域详情（使用 ref 组件）
const areaDetailDrawerRef = ref(null);
async function showAreaDetail(areaId) {
  const res = await getAreaDetailById(areaId);
  areaDetailDrawerRef.value.open(res);
}

// 处置详情抽屉（使用 api 控制）
const handleResultDetail = ref({});
const [HandleResultDrawer, handleResultDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 550,
  title: '处置详情',
  onCancel: () => handleResultDrawerApi.close(),
});
async function showHandleResultDetail(alarmId) {
  const res = await getHandleResultDetail(alarmId);
  handleResultDetail.value = res;
  handleResultDrawerApi.open();
}

// 用户详情（使用 ref 组件）
const userDetailDrawerRef = ref(null);
async function showUserDetail(userId) {
  if (!userId) return ElMessage.warning('用户ID不存在');
  try {
    const userDetail = await getUserDetail(userId);
    userDetailDrawerRef.value?.open(userDetail);
  } catch (error) { ElMessage.error('获取用户详情失败'); }
}

// 批量操作
async function handleBatchMonitor() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个预警规则');
  await monitorEnergyAlarm({ ids: checkedIds.value });
  ElMessage.success('监测已开启');
  handleRefresh();
}
async function handleBatchTrigger() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个预警规则');
  await triggerEnergyAlarm({ ids: checkedIds.value });
  ElMessage.success('预警已触发');
  handleRefresh();
}
async function handleBatchHandle() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个预警记录');
  await handleEnergyAlarm({ ids: checkedIds.value });
  ElMessage.success('处置完成');
  handleRefresh();
}

const rectifyForm = reactive({ rectifyPlan: '' });
let currentRectifyIds = [];
const [RectifyDrawer, rectifyDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '整改方案',
  onCancel: () => rectifyDrawerApi.close(),
  onConfirm: async () => {
    if (!rectifyForm.rectifyPlan) return ElMessage.warning('请填写整改方案');
    await rectifyEnergyAlarm({ ids: currentRectifyIds, rectifyPlan: rectifyForm.rectifyPlan });
    ElMessage.success('整改流程已发起');
    rectifyDrawerApi.close();
    handleRefresh();
  },
});
async function handleBatchRectify() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个预警记录');
  currentRectifyIds = checkedIds.value;
  rectifyForm.rectifyPlan = '';
  rectifyDrawerApi.open();
}

// 配置预警阈值
const configForm = reactive({ alarmName: '', alarmType: '', areaId: null, alarmThreshold: null });
const configFormRef = ref(null);
const configRules = {
  alarmName: [{ required: true, message: '请输入预警名称', trigger: 'blur' }],
  alarmType: [{ required: true, message: '请选择预警类型', trigger: 'change' }],
  areaId: [{ required: true, message: '请输入关联区域ID', trigger: 'blur' }],
  alarmThreshold: [{ required: true, message: '请输入预警阈值', trigger: 'blur' }],
};
const [ConfigDrawer, configDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '配置预警阈值',
  onCancel: () => configDrawerApi.close(),
  onConfirm: async () => {
    let valid = false;
    try { valid = await configFormRef.value?.validate(); } catch { ElMessage.warning('请填写所有必填字段'); return; }
    if (valid === false) { ElMessage.warning('请填写所有必填字段'); return; }
    await createEnergyAlarm(configForm);
    ElMessage.success('预警配置保存成功');
    configDrawerApi.close();
    handleRefresh();
  },
});
const openConfig = () => {
  configForm.alarmName = '';
  configForm.alarmType = '';
  configForm.areaId = null;
  configForm.alarmThreshold = null;
  configDrawerApi.open();
};

// 调整阈值
let currentAdjustRow = null;
const adjustForm = reactive({ alarmName: '', alarmThreshold: null });
const [AdjustDrawer, adjustDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '调整预警配置',
  onCancel: () => adjustDrawerApi.close(),
  onConfirm: async () => {
    if (!adjustForm.alarmName || adjustForm.alarmThreshold === null) return ElMessage.warning('请填写完整');
    await updateEnergyAlarm({ id: currentAdjustRow.id, alarmName: adjustForm.alarmName, alarmThreshold: adjustForm.alarmThreshold });
    ElMessage.success('调整成功');
    adjustDrawerApi.close();
    handleRefresh();
  },
});
const openAdjust = (row) => {
  currentAdjustRow = row;
  adjustForm.alarmName = row.alarmName;
  adjustForm.alarmThreshold = row.alarmThreshold;
  adjustDrawerApi.open();
};

// 忽略预警
async function handleIgnore(row) {
  await confirm('确认忽略该预警吗？忽略后将标记为无需处理。');
  await ignoreEnergyAlarm({ id: row.id });
  ElMessage.success('已忽略');
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
  window.addEventListener('alarm-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('alarm-chart-refresh', handleChartRefresh);
});

const handleSerachShow = () => searchDrawerApi.open();
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
          <IconButton content="配置" icon-name="Plus" @click="openConfig" />
          <IconButton content="监测" icon-name="DataAnalysis" :disabled="isEmpty(checkedIds)" @click="handleBatchMonitor" />
          <IconButton content="触发" icon-name="Warning" :disabled="isEmpty(checkedIds)" @click="handleBatchTrigger" />
          <IconButton content="处置" icon-name="Edit" :disabled="isEmpty(checkedIds)" @click="handleBatchHandle" />
          <IconButton content="整改" icon-name="Refresh" :disabled="isEmpty(checkedIds)" @click="handleBatchRectify" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton content="刷新" icon-name="refresh" @click="handleRefresh" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列模板 -->
      <template #id="{ row }"><el-text @click="showAlarmDetail(row.id)" type="primary">{{ row.id }}</el-text></template>
      <template #alarm_name="{ row }"><el-text @click="showAlarmDetail(row.id)" type="primary" style="cursor: pointer">{{ row.alarmName }}</el-text></template>
      <template #alarm_type="{ row }"><el-tag @click="handleClearField('alarmType'); dataObj.searchObj.alarmType = row.alarmType; gridApi.query()" style="cursor: pointer">{{ row.alarmType }}</el-tag></template>
      <template #area_name="{ row }"><el-text @click="showAreaDetail(row.areaId)" type="primary" style="cursor: pointer">{{ row.areaName || '-' }}</el-text></template>
      <template #alarm_status="{ row }"><el-tag :type="row.alarmStatus === '异常预警' ? 'danger' : 'success'" @click="handleClearField('alarmStatus'); dataObj.searchObj.alarmStatus = row.alarmStatus; gridApi.query()" style="cursor: pointer">{{ row.alarmStatus }}</el-tag></template>
      <template #handle_result="{ row }">
        <el-tag
          v-if="row.handleResult"
          :type="row.handleResult === '已处置' ? 'success' : (row.handleResult === '未处置' ? 'warning' : 'info')"
          @click="showHandleResultDetail(row.id)"
          style="cursor: pointer"
        >
          {{ row.handleResult }}
        </el-tag>
        <span v-else>-</span>
      </template>
      <template #handle_user="{ row }"><el-text v-if="row.handleUser" @click="showUserDetail(row.handleUser)" type="primary" style="cursor: pointer">{{ getUserName(row.handleUser) }}</el-text><span v-else>-</span></template>

      <!-- 行内操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-if="row.alarmStatus === '正常监测'">
            <IconButton content="调整" icon-name="Edit" @click="openAdjust(row)" />
            <IconButton content="查看" icon-name="View" @click="showAlarmDetail(row.id)" />
          </template>
          <template v-else>
            <IconButton content="处置" icon-name="Setting" @click="async () => { await handleEnergyAlarm({ ids: [row.id] }); handleRefresh(); }" />
            <IconButton content="整改" icon-name="Refresh" @click="async () => { currentRectifyIds = [row.id]; rectifyForm.rectifyPlan = ''; rectifyDrawerApi.open(); }" />
            <IconButton content="忽略" icon-name="Close" @click="handleIgnore(row)" />
          </template>
        </div>
      </template>
    </Grid>

    <SearchDrawer title="搜索"><QueryForm class="query-form" /></SearchDrawer>
    <AreaDetailDrawer ref="areaDetailDrawerRef" :detail-obj="{}" title="区域详情" />
    <UserDetailDrawer ref="userDetailDrawerRef" />

    <ConfigDrawer>
      <el-form ref="configFormRef" :model="configForm" :rules="configRules" label-width="100px">
        <el-form-item label="预警名称" prop="alarmName"><el-input v-model="configForm.alarmName" placeholder="请输入预警名称" /></el-form-item>
        <el-form-item label="预警类型" prop="alarmType"><el-select v-model="configForm.alarmType" placeholder="请选择"><el-option label="过载" value="过载" /><el-option label="超阈值" value="超阈值" /></el-select></el-form-item>
        <el-form-item label="关联区域ID" prop="areaId"><el-input-number v-model="configForm.areaId" :min="1" style="width:100%" /></el-form-item>
        <el-form-item label="预警阈值(kWh)" prop="alarmThreshold"><el-input-number v-model="configForm.alarmThreshold" :min="0" :precision="2" style="width:100%" /></el-form-item>
      </el-form>
    </ConfigDrawer>

    <AdjustDrawer>
      <el-form :model="adjustForm" label-width="100px">
        <el-form-item label="预警名称"><el-input v-model="adjustForm.alarmName" /></el-form-item>
        <el-form-item label="预警阈值(kWh)"><el-input-number v-model="adjustForm.alarmThreshold" :min="0" :precision="2" style="width:100%" /></el-form-item>
      </el-form>
    </AdjustDrawer>

    <RectifyDrawer>
      <el-form :model="rectifyForm" label-width="100px">
        <el-form-item label="整改方案" required><el-input v-model="rectifyForm.rectifyPlan" type="textarea" rows="4" placeholder="请输入整改方案" /></el-form-item>
      </el-form>
    </RectifyDrawer>

    <AlarmDetailDrawer>
      <div class="detail-card">
        <div class="detail-card-row"><div class="detail-row-left">预警ID：</div><div class="detail-row-right">{{ currentAlarmDetail.id || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">预警名称：</div><div class="detail-row-right">{{ currentAlarmDetail.alarmName || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">预警类型：</div><div class="detail-row-right">{{ currentAlarmDetail.alarmType || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">关联区域ID：</div><div class="detail-row-right">{{ currentAlarmDetail.areaId || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">预警阈值：</div><div class="detail-row-right">{{ currentAlarmDetail.alarmThreshold || '-' }} kWh</div></div>
        <div class="detail-card-row"><div class="detail-row-left">预警状态：</div><div class="detail-row-right">{{ currentAlarmDetail.alarmStatus || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">触发时间：</div><div class="detail-row-right">{{ currentAlarmDetail.triggerTime || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">处置结果：</div><div class="detail-row-right">{{ currentAlarmDetail.handleResult || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">能耗节约量：</div><div class="detail-row-right">{{ currentAlarmDetail.saveEnergy || '-' }} kWh</div></div>
        <div class="detail-card-row"><div class="detail-row-left">操作人：</div><div class="detail-row-right">{{ getUserName(currentAlarmDetail.handleUser) }}</div></div>
      </div>
    </AlarmDetailDrawer>

    <HandleResultDrawer>
      <div class="detail-card">
        <div class="detail-card-row"><div class="detail-row-left">处置结果：</div><div class="detail-row-right">{{ handleResultDetail.handleResult || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">整改方案：</div><div class="detail-row-right">{{ handleResultDetail.rectifyPlan || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">操作人：</div><div class="detail-row-right">{{ getUserName(handleResultDetail.handleUser) }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">处置时间：</div><div class="detail-row-right">{{ handleResultDetail.updateTime || '-' }}</div></div>
      </div>
    </HandleResultDrawer>
  </div>
</template>
