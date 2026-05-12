<!-- 内部 index.vue - 分区能耗监测表格及交互 -->
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
  getAreaMonitorPage,
  createAreaMonitor,
  statAreaMonitor,
  analyzeAreaMonitor,
  alarmAreaMonitor,
  exportAreaMonitorExcel,
  getAreaMonitorDetail,
  compareAreaMonitor,
  checkAreaMonitor,
  optimizeAreaMonitor,
  getUserDetail,
  getDeviceListByArea,
} from '#/api/genchuan/industry/industrialpark/energyMgmt/energyMonitor/areaMonitor/index.js';
import { useFormSchema, useGridColumns } from './data';
import AreaDetailDrawer from './detail.vue';
import UserDetailDrawer from '#/views/genchuan/industry/chargePark/carService/carGuide/nearStation/table/userDetail.vue';

const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);

const arrowChange = () => {
  emit('arrow-change');
};

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

// 用户映射
const userMap = ref(new Map());

async function fetchUserMappings() {
  try {
    // 实际项目中可能需要批量获取用户列表，这里简化处理
    const users = [{ userId: 'admin', userName: '管理员' }, { userId: 'energy_operator', userName: '能耗操作员' }, { userId: 'maintainer', userName: '维护工程师' }];
    users.forEach(user => userMap.value.set(user.userId, user.userName));
  } catch (error) {
    console.error('获取用户数据失败', error);
  }
}

function getUserName(id) { return userMap.value.get(id) || id; }

// 获取表格数据
const getTableData = async (pageObj) => {
  const params = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.searchObj,
  };
  const res = await getAreaMonitorPage(params);
  let list = res.list || [];
  dataObj.total = res.total;
  dataObj.list = list.map(v => ({
    ...v,
    createTime: formatTimestamp(v.createTime),
    updateTime: formatTimestamp(v.updateTime),
  }));
  return dataObj;
};

// 搜索表单
const [QueryForm, QueryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema()
    .filter(v => v.isSearch)
    .map(v => {
      delete v.rules;
      return v;
    }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      QueryFormApi.resetForm();
      QueryFormApi.submitForm();
    }
  },
});

const resetAllFilters = async () => {
  dataObj.searchObj = {};
  await QueryFormApi.resetFields();
  dataObj.currentPage = 1;
  gridApi.query();
};

async function onSubmit(values, isReset = false) {
  if (isReset) {
    await resetAllFilters();
  } else {
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
  const currentFormValues = await QueryFormApi.getValues();
  delete currentFormValues[fieldName];
  await QueryFormApi.setValues(currentFormValues, false);
  dataObj.currentPage = 1;
  gridApi.query();
};

const activeFilters = computed(() => {
  const filters = [];
  const obj = dataObj.searchObj;
  if (obj.areaName) filters.push({ label: `区域名称：${obj.areaName}`, field: 'areaName' });
  if (obj.energyStatus) filters.push({ label: `能耗状态：${obj.energyStatus}`, field: 'energyStatus' });
  return filters;
});

// 表格组件
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns({ getUserName, showAreaDetail, showDeviceList, showUserDetail }),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

function handleRefresh() {
  gridApi.query();
  window.dispatchEvent(new CustomEvent('area-stats-refresh'));
}

async function handleExport() {
  await confirm('确认导出选中区域数据吗？');
  const data = await exportAreaMonitorExcel(dataObj.searchObj);
  downloadFileFromBlobPart({ fileName: '分区能耗监测数据.xls', source: data });
}

// 详情抽屉
const detailDrawerRef = ref(null);
async function showAreaDetail(areaId) {
  const res = await getAreaMonitorDetail({ id: areaId });
  dataObj.detailObj = res;
  detailDrawerRef.value.open();
}

// 设备列表抽屉
const deviceListDrawerRef = ref(null);
const deviceListData = ref([]);
async function showDeviceList(areaId, areaName) {
  const res = await getDeviceListByArea(areaId);
  deviceListData.value = res.list || [];
  deviceListDrawerRef.value?.open();
}

// 用户详情抽屉
const userDetailDrawerRef = ref(null);
async function showUserDetail(userId) {
  if (!userId) return ElMessage.warning('用户ID不存在');
  try {
    const userDetail = await getUserDetail(userId);
    userDetailDrawerRef.value?.open(userDetail);
  } catch (error) {
    console.error('获取用户详情失败', error);
    ElMessage.error('获取用户详情失败');
  }
}

// 批量操作
async function handleBatchStat() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个区域');
  await statAreaMonitor({ ids: checkedIds.value });
  ElMessage.success('能耗统计已触发');
  handleRefresh();
}

async function handleBatchAnalyze() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个区域');
  await analyzeAreaMonitor({ ids: checkedIds.value });
  ElMessage.success('对比分析已触发');
  handleRefresh();
}

async function handleBatchAlarm() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个区域');
  await alarmAreaMonitor({ ids: checkedIds.value });
  ElMessage.success('能耗预警已开启');
  handleRefresh();
}

// 新增区域划分抽屉
const createForm = reactive({ areaName: '', areaSize: null });
const createFormRef = ref(null);
const createRules = {
  areaName: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
  areaSize: [{ required: true, message: '请输入区域面积', trigger: 'blur' }],
};

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  width: 500,
  title: '划分能耗监测区域',
  onCancel: () => createDrawerApi.close(),
  onConfirm: async () => {
    let valid = false;
    try {
      valid = await createFormRef.value?.validate();
    } catch {
      ElMessage.warning('请填写所有必填字段');
      return;
    }
    if (valid === false) {
      ElMessage.warning('请填写所有必填字段');
      return;
    }
    try {
      await createAreaMonitor({ areaName: createForm.areaName, areaSize: createForm.areaSize });
      ElMessage.success('区域划分成功');
      createDrawerApi.close();
      handleRefresh();
    } catch (err) {
      console.error('划分失败', err);
      ElMessage.error('划分失败：' + (err?.msg || err?.message));
    }
  },
});

const openCreate = () => {
  createForm.areaName = '';
  createForm.areaSize = null;
  createDrawerApi.open();
};

// 对比弹窗
const compareData = ref({});
const compareDialogVisible = ref(false);
async function handleCompare(row) {
  const res = await compareAreaMonitor({ id: row.id });
  compareData.value = res;
  compareDialogVisible.value = true;
}

// 排查
async function handleCheck(row) {
  await confirm('确认排查该区域能耗异常吗？');
  await checkAreaMonitor(row.id);
  ElMessage.success('排查任务已启动');
  handleRefresh();
}

// 优化抽屉
const optimizeForm = reactive({ optimizePlan: '' });
let currentOptimizeRow = null;
const [OptimizeDrawer, optimizeDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  width: 500,
  title: '能耗优化方案',
  onCancel: () => optimizeDrawerApi.close(),
  onConfirm: async () => {
    if (!optimizeForm.optimizePlan) return ElMessage.warning('请填写优化方案');
    await optimizeAreaMonitor({ id: currentOptimizeRow.id, optimizePlan: optimizeForm.optimizePlan });
    ElMessage.success('优化方案已提交');
    optimizeDrawerApi.close();
    handleRefresh();
  },
});

const openOptimize = (row) => {
  currentOptimizeRow = row;
  optimizeForm.optimizePlan = '';
  optimizeDrawerApi.open();
};

// 图表刷新事件（处理图表区域的钻取交互）
const handleChartRefresh = (event) => {
  const filters = event.detail;
  if (!filters) {
    // 清空所有筛选
    dataObj.searchObj = {};
    dataObj.currentPage = 1;
    gridApi.query();
    return;
  }

  // 处理地图标记点击：打开区域详情抽屉
  if (filters.areaId) {
    showAreaDetail(filters.areaId);
    return;
  }

  // 处理柱状图点击：按区域名称筛选
  if (filters.areaName) {
    dataObj.searchObj = { areaName: filters.areaName };
    dataObj.currentPage = 1;
    gridApi.query();
    return;
  }

  // 处理卡片点击：按能耗状态筛选
  if (filters.energyStatus) {
    dataObj.searchObj = { energyStatus: filters.energyStatus };
    dataObj.currentPage = 1;
    gridApi.query();
    return;
  }

  // 其他情况清空筛选
  dataObj.searchObj = {};
  dataObj.currentPage = 1;
  gridApi.query();
};

const route = useRoute();
onMounted(() => {
  fetchUserMappings();
  window.addEventListener('area-chart-refresh', handleChartRefresh);
});

onActivated(() => {});
onUnmounted(() => {
  window.removeEventListener('area-chart-refresh', handleChartRefresh);
});

const handleSerachShow = () => searchDrawerApi.open();
const handleFullShow = () => screenfull.toggle();

const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 500,
  onCancel: () => searchDrawerApi.close(),
});

// 设备列表抽屉组件
const [DeviceListDrawer, deviceListDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 600,
  title: '关联设备列表',
  onCancel: () => deviceListDrawerApi.close(),
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
          <IconButton content="划分" icon-name="Plus" @click="openCreate" />
          <IconButton content="统计" icon-name="DataAnalysis" :disabled="isEmpty(checkedIds)" @click="handleBatchStat" />
          <IconButton content="分析" icon-name="PieChart" :disabled="isEmpty(checkedIds)" @click="handleBatchAnalyze" />
          <IconButton content="预警" icon-name="Warning" :disabled="isEmpty(checkedIds)" @click="handleBatchAlarm" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 自定义列模板 -->
      <template #id="{ row }">
        <el-text @click="showAreaDetail(row.id)" type="primary">{{ row.id }}</el-text>
      </template>
      <template #area_name="{ row }">
        <el-text @click="showAreaDetail(row.id)" type="primary" style="cursor: pointer">{{ row.areaName }}</el-text>
      </template>
      <template #energy_status="{ row }">
        <el-tag :type="{ '正常能耗': 'success', '能耗异常': 'danger' }[row.energyStatus]" @click="handleClearField('energyStatus')" style="cursor: pointer">
          {{ row.energyStatus }}
        </el-tag>
      </template>
      <template #device_count="{ row }">
        <el-text @click="showDeviceList(row.id, row.areaName)" type="primary" style="cursor: pointer">{{ row.deviceCount }}</el-text>
      </template>
      <template #yoy_change="{ row }">
        <span :style="{ color: row.yoyChange >= 0 ? '#F56C6C' : '#67C23A' }">{{ row.yoyChange >= 0 ? '+' : '' }}{{ row.yoyChange }}%</span>
      </template>
      <template #mom_change="{ row }">
        <span :style="{ color: row.momChange >= 0 ? '#F56C6C' : '#67C23A' }">{{ row.momChange >= 0 ? '+' : '' }}{{ row.momChange }}%</span>
      </template>
      <template #handle_user="{ row }">
        <el-text v-if="row.handleUser" @click="showUserDetail(row.handleUser)" type="primary" style="cursor: pointer">
          {{ getUserName(row.handleUser) }}
        </el-text>
        <span v-else>-</span>
      </template>

      <!-- 操作按钮：根据能耗状态显示不同按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-if="row.energyStatus === '正常能耗'">
            <IconButton content="查看" icon-name="View" @click="showAreaDetail(row.id)" />
            <IconButton content="对比" icon-name="DataLine" @click="handleCompare(row)" />
            <IconButton content="导出" icon-name="download" @click="handleExport" />
          </template>
          <template v-else>
            <IconButton content="预警" icon-name="Warning" @click="handleBatchAlarm" />
            <IconButton content="排查" icon-name="Search" @click="handleCheck(row)" />
            <IconButton content="优化" icon-name="Edit" @click="openOptimize(row)" />
          </template>
        </div>
      </template>
    </Grid>

    <SearchDrawer title="搜索">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <AreaDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" title="区域详情" />
    <UserDetailDrawer ref="userDetailDrawerRef" />

    <!-- 新增区域划分抽屉 -->
    <CreateDrawer>
      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="100px">
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="createForm.areaName" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="区域面积(㎡)" prop="areaSize">
          <el-input-number v-model="createForm.areaSize" :min="1" :precision="0" style="width: 100%" />
        </el-form-item>
      </el-form>
    </CreateDrawer>

    <!-- 优化方案抽屉 -->
    <OptimizeDrawer>
      <el-form :model="optimizeForm" label-width="100px">
        <el-form-item label="优化方案" required>
          <el-input v-model="optimizeForm.optimizePlan" type="textarea" rows="4" placeholder="请输入能耗优化方案，如：调整空调温度、关闭非工作时段照明等" />
        </el-form-item>
      </el-form>
    </OptimizeDrawer>

    <!-- 设备列表抽屉 -->
    <DeviceListDrawer>
      <el-table :data="deviceListData" border style="width: 100%">
        <el-table-column prop="id" label="设备ID" width="80" />
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="deviceType" label="设备类型" />
        <el-table-column prop="energyValue" label="当前能耗(kWh)" />
        <el-table-column prop="status" label="状态" />
      </el-table>
    </DeviceListDrawer>

    <!-- 对比结果弹窗 -->
    <el-dialog v-model="compareDialogVisible" title="能耗对比分析" width="500px">
      <div v-if="compareData.yoyData">
        <h4>同比分析</h4>
        <div>去年同期：{{ compareData.yoyData.lastYear }} kWh</div>
        <div>今年同期：{{ compareData.yoyData.thisYear }} kWh</div>
        <div>差值：{{ compareData.yoyData.diff }} kWh</div>
      </div>
      <div v-if="compareData.momData" style="margin-top: 20px">
        <h4>环比分析</h4>
        <div>上月同期：{{ compareData.momData.lastMonth }} kWh</div>
        <div>本月同期：{{ compareData.momData.thisMonth }} kWh</div>
        <div>差值：{{ compareData.momData.diff }} kWh</div>
      </div>
    </el-dialog>
  </div>
</template>
