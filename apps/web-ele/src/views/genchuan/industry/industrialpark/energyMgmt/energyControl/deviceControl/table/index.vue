<!-- ==================== 内部 index.vue（设备管控核心） ==================== -->
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
  getDeviceControlPage,
  bindDeviceControl,
  setDeviceControlRule,
  controlDevice,
  optimizeDevice,
  closeDeviceControl,
  startDeviceControl,
  getDeviceDetail,
  getStrategyDetail,
  getUserDetail,
} from '#/api/genchuan/industry/industrialpark/energyMgmt/energyControl/deviceControl/index.js';
import { useFormSchema, useGridColumns } from './data';
import DeviceDetailDrawer from './detail.vue';
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

const userMap = ref(new Map());
async function fetchUserMappings() {
  try {
    // 模拟用户映射，实际可从字典或接口获取，为保持与后端关联，展示操作人昵称
    const users = [{ userId: 'admin', userName: '管理员' }, { userId: 'energy_operator', userName: '能耗操作员' }, { userId: 'maintainer', userName: '维护工程师' }];
    users.forEach(user => userMap.value.set(user.userId, user.userName));
  } catch (error) { console.error('获取用户数据失败', error); }
}
function getUserName(id) { return userMap.value.get(id) || id; }

const getTableData = async (pageObj) => {
  const params = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.searchObj,
  };
  const res = await getDeviceControlPage(params);
  dataObj.total = res.total;
  dataObj.list = (res.list || []).map(v => ({
    ...v,
    createTime: formatTimestamp(v.createTime),
    updateTime: formatTimestamp(v.updateTime),
  }));
  return dataObj;
};

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
  if (fieldName === 'deviceName' || fieldName === 'deviceType' || fieldName === 'controlStatus') {
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
  if (obj.deviceName) filters.push({ label: `设备名称：${obj.deviceName}`, field: 'deviceName' });
  if (obj.deviceType) filters.push({ label: `设备类型：${obj.deviceType}`, field: 'deviceType' });
  if (obj.controlStatus) filters.push({ label: `管控状态：${obj.controlStatus}`, field: 'controlStatus' });
  return filters;
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns({ getUserName, showDeviceDetail, showStrategyDetail, showUserDetail, filterByType: (type) => { dataObj.searchObj.deviceType = type; gridApi.query(); }, filterByStatus: (status) => { dataObj.searchObj.controlStatus = status; gridApi.query(); } }),
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
  window.dispatchEvent(new CustomEvent('device-stats-refresh'));
}

const deviceDetailDrawerRef = ref(null);
const currentDeviceDetail = ref({});
async function showDeviceDetail(id) {
  const res = await getDeviceDetail({ id });
  currentDeviceDetail.value = res;
  deviceDetailDrawerRef.value.open(res);
}

const strategyDetailDrawerRef = ref(null);
const currentStrategyDetail = ref({});
async function showStrategyDetail(strategyId) {
  if (!strategyId) return ElMessage.warning('该设备未关联策略');
  const res = await getStrategyDetail({ id: strategyId });
  currentStrategyDetail.value = res;
  strategyDetailDrawerApi.open();
}

const userDetailDrawerRef = ref(null);
async function showUserDetail(userId) {
  if (!userId) return ElMessage.warning('用户ID不存在');
  try {
    const userDetail = await getUserDetail({ id: userId });
    userDetailDrawerRef.value?.open(userDetail);
  } catch (error) { ElMessage.error('获取用户详情失败'); }
}

// 批量绑定（逐个调用，适配单设备绑定接口）
const bindForm = reactive({ strategyId: null });
const [BindDrawer, bindDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '绑定节能策略',
  onCancel: () => bindDrawerApi.close(),
  onConfirm: async () => {
    if (!bindForm.strategyId) return ElMessage.warning('请选择策略ID');
    try {
      for (const deviceId of checkedIds.value) {
        await bindDeviceControl({ deviceId, strategyId: bindForm.strategyId });
      }
      ElMessage.success('绑定成功');
      bindDrawerApi.close();
      handleRefresh();
    } catch {
      ElMessage.error('绑定失败');
    }
  },
});
const handleBatchBind = () => {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个设备');
  bindForm.strategyId = null;
  bindDrawerApi.open();
};

const settingForm = reactive({ controlRule: '' });
const [SettingDrawer, settingDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '设置管控规则',
  onCancel: () => settingDrawerApi.close(),
  onConfirm: async () => {
    if (!settingForm.controlRule) return ElMessage.warning('请填写管控规则');
    await setDeviceControlRule({ ids: checkedIds.value, controlRule: settingForm.controlRule });
    ElMessage.success('规则设置成功');
    settingDrawerApi.close();
    handleRefresh();
  },
});
const handleBatchSetting = () => {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个设备');
  settingForm.controlRule = '';
  settingDrawerApi.open();
};

const controlForm = reactive({ controlCmd: '' });
const [ControlDrawer, controlDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '远程控制设备',
  onCancel: () => controlDrawerApi.close(),
  onConfirm: async () => {
    if (!controlForm.controlCmd) return ElMessage.warning('请输入控制指令');
    await controlDevice({ ids: checkedIds.value, controlCmd: controlForm.controlCmd });
    ElMessage.success('控制指令已发送');
    controlDrawerApi.close();
    handleRefresh();
  },
});
const handleBatchControl = () => {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个设备');
  controlForm.controlCmd = '';
  controlDrawerApi.open();
};

const handleBatchOptimize = async () => {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个设备');
  await optimizeDevice({ ids: checkedIds.value });
  ElMessage.success('能耗优化已触发');
  handleRefresh();
};

const handleBatchClose = async () => {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个设备');
  await confirm('确认关闭所选设备的管控吗？关闭后将停止自动管控。');
  await closeDeviceControl({ ids: checkedIds.value });
  ElMessage.success('管控已关闭');
  handleRefresh();
};

const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 500,
  onCancel: () => searchDrawerApi.close(),
});
const handleSerachShow = () => searchDrawerApi.open();
const handleFullShow = () => screenfull.toggle();

// 行操作（单个设备）
const handleBind = async (row) => {
  const { value: strategyId } = await ElMessageBox.prompt('请输入策略ID', '绑定策略', { confirmButtonText: '确定', cancelButtonText: '取消', inputPattern: /\d+/, inputErrorMessage: '请输入数字ID' });
  await bindDeviceControl({ deviceId: row.id, strategyId: Number(strategyId) });
  ElMessage.success('绑定成功');
  handleRefresh();
};
const handleSetting = async (row) => {
  const { value: controlRule } = await ElMessageBox.prompt('请输入管控规则', '设置规则', { confirmButtonText: '确定', cancelButtonText: '取消' });
  await setDeviceControlRule({ ids: [row.id], controlRule });
  ElMessage.success('规则设置成功');
  handleRefresh();
};
const handleControl = async (row) => {
  const { value: controlCmd } = await ElMessageBox.prompt('请输入控制指令', '远程控制', { confirmButtonText: '确定', cancelButtonText: '取消' });
  await controlDevice({ ids: [row.id], controlCmd });
  ElMessage.success('控制指令已发送');
  handleRefresh();
};
const handleOptimize = async (row) => {
  await optimizeDevice({ ids: [row.id] });
  ElMessage.success('能耗优化已触发');
  handleRefresh();
};
const handleClose = async (row) => {
  await confirm('确认关闭该设备的管控吗？');
  await closeDeviceControl({ ids: [row.id] });
  ElMessage.success('管控已关闭');
  handleRefresh();
};
const handleAdjust = handleSetting;
const handleStart = async (row) => {
  await startDeviceControl({ id: row.id });
  ElMessage.success('管控已启动');
  handleRefresh();
};
const handleView = (row) => {
  showDeviceDetail(row.id);
};

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
  window.addEventListener('device-control-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('device-control-chart-refresh', handleChartRefresh);
});

const [StrategyDetailDrawer, strategyDetailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 650,
  title: '策略详情',
  onCancel: () => strategyDetailDrawerApi.close(),
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
          <IconButton content="绑定" icon-name="Plus" @click="handleBatchBind" />
          <IconButton content="设置" icon-name="Edit" :disabled="isEmpty(checkedIds)" @click="handleBatchSetting" />
          <IconButton content="控制" icon-name="Setting" :disabled="isEmpty(checkedIds)" @click="handleBatchControl" />
          <IconButton content="优化" icon-name="DataAnalysis" :disabled="isEmpty(checkedIds)" @click="handleBatchOptimize" />
          <IconButton content="关闭" icon-name="Close" :disabled="isEmpty(checkedIds)" @click="handleBatchClose" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton content="刷新" icon-name="refresh" @click="handleRefresh" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <template #id="{ row }"><el-text @click="showDeviceDetail(row.id)" type="primary">{{ row.id }}</el-text></template>
      <template #device_name="{ row }"><el-text @click="showDeviceDetail(row.id)" type="primary" style="cursor: pointer">{{ row.deviceName }}</el-text></template>
      <template #device_type="{ row }"><el-tag @click="handleClearField('deviceType'); dataObj.searchObj.deviceType = row.deviceType; gridApi.query()" style="cursor: pointer">{{ row.deviceType }}</el-tag></template>
      <template #strategy_name="{ row }"><el-text v-if="row.strategyId" @click="showStrategyDetail(row.strategyId)" type="primary" style="cursor: pointer">{{ row.strategyName || '-' }}</el-text><span v-else>-</span></template>
      <template #control_status="{ row }"><el-tag :type="row.controlStatus === '管控中' ? 'success' : 'info'" @click="handleClearField('controlStatus'); dataObj.searchObj.controlStatus = row.controlStatus; gridApi.query()" style="cursor: pointer">{{ row.controlStatus }}</el-tag></template>
      <template #handle_user="{ row }"><el-text v-if="row.handleUser" @click="showUserDetail(row.handleUser)" type="primary" style="cursor: pointer">{{ getUserName(row.handleUser) }}</el-text><span v-else>-</span></template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-if="row.controlStatus === '管控中'">
            <IconButton content="调整" icon-name="Edit" @click="handleAdjust(row)" />
            <IconButton content="关闭" icon-name="Close" @click="handleClose(row)" />
            <IconButton content="查看" icon-name="View" @click="handleView(row)" />
          </template>
          <template v-else>
            <IconButton content="绑定" icon-name="Plus" @click="handleBind(row)" />
            <IconButton content="设置" icon-name="Edit" @click="handleSetting(row)" />
            <IconButton content="启动" icon-name="CaretRight" @click="handleStart(row)" />
          </template>
        </div>
      </template>
    </Grid>

    <SearchDrawer title="搜索"><QueryForm class="query-form" /></SearchDrawer>
    <DeviceDetailDrawer ref="deviceDetailDrawerRef" :detail-obj="{}" title="设备详情" />
    <UserDetailDrawer ref="userDetailDrawerRef" />

    <BindDrawer>
      <el-form :model="bindForm" label-width="100px">
        <el-form-item label="策略ID" required><el-input-number v-model="bindForm.strategyId" :min="1" style="width:100%" placeholder="请输入策略ID" /></el-form-item>
      </el-form>
    </BindDrawer>

    <SettingDrawer>
      <el-form :model="settingForm" label-width="100px">
        <el-form-item label="管控规则" required><el-input v-model="settingForm.controlRule" type="textarea" rows="3" placeholder="例如：非工作时段自动关闭设备" /></el-form-item>
      </el-form>
    </SettingDrawer>

    <ControlDrawer>
      <el-form :model="controlForm" label-width="100px">
        <el-form-item label="控制指令" required><el-input v-model="controlForm.controlCmd" placeholder="例如：adjust_temp_26" /></el-form-item>
      </el-form>
    </ControlDrawer>

    <StrategyDetailDrawer>
      <div class="detail-card">
        <div class="detail-card-row"><div class="detail-row-left">策略ID：</div><div class="detail-row-right">{{ currentStrategyDetail.id || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">策略名称：</div><div class="detail-row-right">{{ currentStrategyDetail.strategyName || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">策略描述：</div><div class="detail-row-right">{{ currentStrategyDetail.description || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ currentStrategyDetail.createTime || '-' }}</div></div>
      </div>
    </StrategyDetailDrawer>
  </div>
</template>
