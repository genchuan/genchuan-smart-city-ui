<!-- 内部 index.vue - 表格主组件（包含所有业务逻辑和操作按钮） -->
<script setup>
import { reactive, ref, onMounted, onUnmounted, onActivated, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';
import { ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import {
  getEnergyCollectPage,
  dockEnergyCollect,
  collectEnergyData,
  monitorEnergyCollect,
  exportEnergyCollectExcel,
  checkEnergyCollect,
  restartEnergyCollect,
  calibrateEnergyCollect,
  getEnergyCollectDetail,
  getUserList,
  getUserDetail,
} from '#/api/genchuan/industry/industrialpark/energyMgmt/energyMonitor/dataCollect/index.js';
import { useFormSchema, useGridColumns } from './data';
import EnergyDetailDrawer from './detail.vue';
import UserDetailDrawer from '#/views/genchuan/industry/chargePark/carService/carGuide/nearStation/table/userDetail.vue';

const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);
const arrowChange = () => { emit('arrow-change'); };

const checkedIds = ref([]);
const handleRowCheckboxChange = ({ records }) => {
  checkedIds.value = records.map((item) => item.id);
};

const dataObj = reactive({
  detailObj: {},
  total: 0,
  list: [],
  searchObj: {},
  currentPage: 1,
  pageSize: 10,
});

const userMap = ref(new Map());
async function fetchMappings() {
  try {
    const users = await getUserList();
    users.forEach(user => userMap.value.set(user.userId, user.userName));
  } catch (error) {
    console.error('获取用户映射失败', error);
  }
}
function getUserName(id) { return userMap.value.get(id) || id; }

const getTableData = async (pageObj) => {
  const params = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.searchObj,
  };
  if (params.collectTime && Array.isArray(params.collectTime) && params.collectTime.length === 2) {
    params.collectTime = `${params.collectTime[0]},${params.collectTime[1]}`;
  }
  const res = await getEnergyCollectPage(params);
  let list = res.list || [];
  dataObj.total = res.total;
  dataObj.list = list.map(v => ({
    ...v,
    collectTime: formatTimestamp(v.collectTime),
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

async function onSubmit(values, isReset = false) {
  if (isReset) {
    dataObj.searchObj = {};
    await QueryFormApi.resetFields();
  } else {
    dataObj.searchObj = { ...values };
  }
  dataObj.currentPage = 1;
  gridApi.query();
  searchDrawerApi?.close?.();
}

// 表格组件
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns({ getUserName }),
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

function handleRefresh() { gridApi.query(); window.dispatchEvent(new CustomEvent('energy-stats-refresh')); }

// 批量操作
const openDock = async () => {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请选择设备');
  await dockEnergyCollect({ ids: checkedIds.value });
  ElMessage.success('对接成功');
  handleRefresh();
};
const openCollect = async () => {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请选择设备');
  await collectEnergyData({ ids: checkedIds.value });
  ElMessage.success('手动采集已触发');
  handleRefresh();
};
let monitorTimer = null;
const startMonitor = () => {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请选择设备');
  monitorEnergyCollect({ ids: checkedIds.value }).then(() => {
    ElMessage.success('实时监测已开启');
    if (monitorTimer) clearInterval(monitorTimer);
    monitorTimer = setInterval(() => { gridApi.query(); }, 5000);
  });
};
const stopMonitor = () => {
  if (monitorTimer) clearInterval(monitorTimer);
  ElMessage.info('监测已关闭');
};
const handleExport = async () => {
  await exportEnergyCollectExcel(dataObj.searchObj);
  downloadFileFromBlobPart({ fileName: '能耗采集数据.xls', source: await exportEnergyCollectExcel(dataObj.searchObj) });
};

// 单行操作
const handleCheck = async (row) => {
  await confirm('确认排查该设备采集异常？');
  await checkEnergyCollect(row.id);
  ElMessage.success('排查完成');
  handleRefresh();
};
const handleRestart = async (row) => {
  await confirm('确认重启采集设备？');
  await restartEnergyCollect(row.id);
  ElMessage.success('重启指令已发送');
  handleRefresh();
};
const calibrateForm = reactive({ id: null, calibrateValue: 0 });
const [CalibrateDrawer, calibrateDrawerApi] = useVbenDrawer({
  modal: false, width: 500, title: '校准数据',
  onConfirm: async () => {
    if (!calibrateForm.calibrateValue) return ElMessage.warning('请输入校准后的能耗值');
    await calibrateEnergyCollect({ id: calibrateForm.id, calibrateValue: calibrateForm.calibrateValue });
    ElMessage.success('校准成功');
    calibrateDrawerApi.close();
    handleRefresh();
  },
});
const openCalibrate = (row) => {
  calibrateForm.id = row.id;
  calibrateForm.calibrateValue = row.energyValue;
  calibrateDrawerApi.open();
};

// 详情抽屉
const detailDrawerRef = ref(null);
const handleOpenDetail = async (row) => {
  const res = await getEnergyCollectDetail({ id: row.id });
  dataObj.detailObj = res;
  detailDrawerRef.value.open();
};

// 异常明细弹窗
const exceptionDetailVisible = ref(false);
const currentException = ref({});
const showExceptionDetail = (row) => {
  currentException.value = row;
  exceptionDetailVisible.value = true;
};
// 用户详情
const userDetailDrawerRef = ref(null);
const showUserDetail = async (handleUser) => {
  if (!handleUser) return;
  const userDetail = await getUserDetail(handleUser);
  userDetailDrawerRef.value?.open(userDetail);
};

// 筛选标签
const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchObj;
  if (obj.deviceName) filters.push({ label: `设备名称：${obj.deviceName}`, field: 'deviceName' });
  if (obj.deviceType) filters.push({ label: `设备类型：${obj.deviceType}`, field: 'deviceType' });
  if (obj.energyType) filters.push({ label: `能耗类型：${obj.energyType}`, field: 'energyType' });
  if (obj.collectStatus) filters.push({ label: `采集状态：${obj.collectStatus}`, field: 'collectStatus' });
  if (obj.collectTime && obj.collectTime.length === 2) filters.push({ label: `采集时间：${obj.collectTime[0]} 至 ${obj.collectTime[1]}`, field: 'collectTime' });
  return filters;
});
const handleClearField = async (fieldName) => {
  delete dataObj.searchObj[fieldName];
  await QueryFormApi.setValues(dataObj.searchObj, false);
  gridApi.query();
};

// 图表刷新事件
const handleChartRefresh = (event) => {
  const filters = event.detail;
  const newSearchObj = { ...dataObj.searchObj };
  delete newSearchObj.collectStatus;
  delete newSearchObj.collectTime;
  if (filters?.collectStatus) newSearchObj.collectStatus = filters.collectStatus;
  else if (filters?.collectTime) newSearchObj.collectTime = [filters.collectTime, filters.collectTime];
  else if (filters?.allDevices) { /* 保留全部 */ }
  dataObj.searchObj = newSearchObj;
  gridApi.query();
};

// 路由自动打开对接配置（可选）
const route = useRoute();
let consumedSignature = '';
async function autoOpenDockFromRoute() { /* 类似预约逻辑可扩展 */ }

onMounted(() => {
  fetchMappings();
  window.addEventListener('energy-chart-refresh', handleChartRefresh);
  autoOpenDockFromRoute();
});
onActivated(() => { autoOpenDockFromRoute(); });
onUnmounted(() => {
  window.removeEventListener('energy-chart-refresh', handleChartRefresh);
  if (monitorTimer) clearInterval(monitorTimer);
});

const handleSerachShow = () => searchDrawerApi.open();
const handleFullShow = () => screenfull.toggle();
const [SearchDrawer, searchDrawerApi] = useVbenDrawer({ modal: false, footer: false, width: 500 });
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
          <IconButton content="对接" icon-name="Plus" @click="openDock" />
          <IconButton content="采集" icon-name="download" @click="openCollect" />
          <IconButton content="监测" icon-name="monitor" @click="startMonitor" />
          <IconButton content="停止监测" icon-name="Close" @click="stopMonitor" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列模板 -->
      <template #device_name="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer">{{ row.deviceName }}</el-text>
      </template>
      <template #device_type="{ row }">
        <el-text @click="() => { dataObj.searchObj.deviceType = row.deviceType; gridApi.query(); }" type="primary" style="cursor: pointer">{{ row.deviceType }}</el-text>
      </template>
      <template #energy_type="{ row }">
        <el-text @click="() => { dataObj.searchObj.energyType = row.energyType; gridApi.query(); }" type="primary" style="cursor: pointer">{{ row.energyType }}</el-text>
      </template>
      <template #collect_status="{ row }">
        <el-tag :type="row.collectStatus === '采集正常' ? 'success' : 'danger'" @click="() => { dataObj.searchObj.collectStatus = row.collectStatus; gridApi.query(); }" style="cursor: pointer">{{ row.collectStatus }}</el-tag>
      </template>
      <template #exception_count="{ row }">
        <el-text v-if="row.exceptionCount > 0" @click="showExceptionDetail(row)" type="primary" style="cursor: pointer">{{ row.exceptionCount }}</el-text>
        <span v-else>0</span>
      </template>
      <template #handle_user="{ row }">
        <el-text v-if="row.handleUser" @click="showUserDetail(row.handleUser)" type="primary" style="cursor: pointer">{{ getUserName(row.handleUser) }}</el-text>
        <span v-else>-</span>
      </template>

      <!-- 操作按钮（根据采集状态显示） -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-if="row.collectStatus === '采集正常'">
            <IconButton content="刷新" icon-name="refresh" @click="handleRefresh" />
            <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
            <IconButton content="导出" icon-name="download" @click="handleExport" />
          </template>
          <template v-else>
            <IconButton content="排查" icon-name="check" @click="handleCheck(row)" />
            <IconButton content="重启" icon-name="refresh" @click="handleRestart(row)" />
            <IconButton content="校准" icon-name="edit" @click="openCalibrate(row)" />
          </template>
        </div>
      </template>
    </Grid>

    <SearchDrawer title="筛选">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <EnergyDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" title="采集设备详情" />
    <UserDetailDrawer ref="userDetailDrawerRef" />

    <!-- 校准抽屉 -->
    <CalibrateDrawer>
      <el-form :model="calibrateForm" label-width="100px">
        <el-form-item label="校准能耗值" required>
          <el-input-number v-model="calibrateForm.calibrateValue" :precision="2" />
        </el-form-item>
      </el-form>
    </CalibrateDrawer>

    <!-- 异常明细弹窗 -->
    <el-dialog v-model="exceptionDetailVisible" title="异常记录明细" width="500px">
      <div>设备名称：{{ currentException.deviceName }}</div>
      <div>异常次数：{{ currentException.exceptionCount }}</div>
      <div>最近异常时间：{{ currentException.collectTime }}</div>
      <div>建议操作：请排查设备连接或重启采集器</div>
    </el-dialog>
  </div>
</template>
