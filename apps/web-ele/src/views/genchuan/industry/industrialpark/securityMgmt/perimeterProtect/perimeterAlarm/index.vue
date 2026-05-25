<!-- 文件3: src/views/genchuan/industry/industrialpark/securityMgmt/perimeterProtect/perimeterAlarm/index.vue -->
<script setup>
import { reactive, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import PerimeterAlarmDetailDrawer from './components/detail.vue';
import RealTimePlayer from './components/RealTimePlayer.vue';
import {
  getMockList,
  getPerimeterAlarmPage,
  defendPerimeterAlarm,
  cancelDefendPerimeterAlarm,
  updateSensitivityPerimeterAlarm,
  handlePerimeterAlarm,
  ignorePerimeterAlarm,
  linkMonitorPerimeterAlarm,
  confirmPerimeterAlarm,
  getPerimeterAlarmDetail,
  getProtectAreaDetail,
  getPerimeterDeviceDetail,
  getUserDetail,
} from '#/api/genchuan/industry/industrialpark/securityMgmt/perimeterProtect/perimeterAlarm/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useHandleFormSchema,
  useSensitivityFormSchema,
  useIgnoreFormSchema,
  formatTimestamp,
} from '#/api/genchuan/industry/industrialpark/securityMgmt/perimeterProtect/perimeterAlarm/form.js';

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// 标签筛选
const tagFilters = ref({});

function handleFilterTagClick(field, value) {
  if (!field || value == null) return;
  if (tagFilters.value[field] !== undefined) {
    const existing = tagFilters.value[field];
    if (Array.isArray(existing) && existing.length === 1 && existing[0] === value) {
      delete tagFilters.value[field];
    } else if (!Array.isArray(existing) && existing === value) {
      delete tagFilters.value[field];
    } else {
      tagFilters.value[field] = value;
    }
  } else {
    tagFilters.value[field] = value;
  }
  gridApi.reload();
}

function clearFilters() {
  tagFilters.value = {};
  gridApi.reload();
}

function removeFilterTag(field) {
  delete tagFilters.value[field];
  gridApi.reload();
}

function getFieldLabel(field) {
  const map = {
    alarmArea: '告警区域',
    alarmType: '告警类型',
    alarmStatus: '告警状态',
    handleUser: '处置人',
    creator: '创建人',
    createTime: '创建时间',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// 抽屉组件
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
});

const [HandleDrawer, handleDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => handleDrawerApi.close(),
});

const [SensitivityDrawer, sensitivityDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => sensitivityDrawerApi.close(),
});

const [IgnoreDrawer, ignoreDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => ignoreDrawerApi.close(),
});

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  loading: false,
});

const gridColumns = ref(getColumns());
const checkedIds = ref([]);
const checkedRows = ref([]);
const checkedAreaIds = ref([]);

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
  checkedAreaIds.value = records.map(item => item.areaId);
}

const searchParams = ref({});
const currentHandleRow = ref(null);
const currentSensitivityTargetIds = ref([]);
const currentIgnoreRow = ref(null);
const monitorDialogVisible = ref(false);
const currentMonitorUrl = ref('');

const getDateFromTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getAlarmStatusType = (status) => {
  const map = {
    '告警中': 'danger',
    '已处置': 'success',
  };
  return map[status] || 'info';
};

const getAlarmTypeTagType = (type) => {
  const map = {
    '入侵': 'danger',
    '破坏': 'warning',
  };
  return map[type] || 'info';
};

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    const res = await getPerimeterAlarmPage(params);
    let filtered = res.list;
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'alarmArea':
            itemValue = item.alarmArea;
            break;
          case 'alarmType':
            itemValue = item.alarmType;
            break;
          case 'alarmStatus':
            itemValue = item.alarmStatus;
            break;
          case 'handleUser':
            itemValue = item.handleUser;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
            break;
          default:
            itemValue = item[field];
        }
        if (Array.isArray(filterValue)) {
          return filterValue.includes(String(itemValue));
        } else {
          return String(itemValue) === String(filterValue);
        }
      });
    });
    dataObj.total = res.total || filtered.length;
    dataObj.list = filtered;
  } catch (error) {
    console.error('获取数据失败:', error);
    const mockData = getMockList();
    let filtered = mockData;
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'alarmArea':
            itemValue = item.alarmArea;
            break;
          case 'alarmType':
            itemValue = item.alarmType;
            break;
          case 'alarmStatus':
            itemValue = item.alarmStatus;
            break;
          case 'handleUser':
            itemValue = item.handleUser;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
            break;
          default:
            itemValue = item[field];
        }
        if (Array.isArray(filterValue)) {
          return filterValue.includes(String(itemValue));
        } else {
          return String(itemValue) === String(filterValue);
        }
      });
    });
    dataObj.total = filtered.length;
    dataObj.list = filtered.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize);
  } finally {
    dataObj.loading = false;
  }
  return dataObj;
};

function handleRefresh() {
  gridApi.reload();
}

function handleReset() {
  searchParams.value = {};
  tagFilters.value = {};
  gridApi.reload();
}

// 批量布防
async function handleBatchDefend() {
  if (checkedAreaIds.value.length === 0) {
    ElMessage.warning('请至少选择一个告警区域');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认对选中的 ${checkedAreaIds.value.length} 个区域进行布防吗？`, '布防确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '布防中...' });
    try {
      const res = await defendPerimeterAlarm({ ids: checkedAreaIds.value });
      if (res && res !== false) {
        ElMessage.success('批量布防成功');
        handleRefresh();
      } else {
        ElMessage.error('批量布防失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 批量撤防
async function handleBatchCancelDefend() {
  if (checkedAreaIds.value.length === 0) {
    ElMessage.warning('请至少选择一个告警区域');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认对选中的 ${checkedAreaIds.value.length} 个区域进行撤防吗？`, '撤防确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '撤防中...' });
    try {
      const res = await cancelDefendPerimeterAlarm({ ids: checkedAreaIds.value });
      if (res && res !== false) {
        ElMessage.success('批量撤防成功');
        handleRefresh();
      } else {
        ElMessage.error('批量撤防失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 批量灵敏度调整
function handleBatchSensitivity() {
  if (checkedAreaIds.value.length === 0) {
    ElMessage.warning('请至少选择一个告警区域');
    return;
  }
  currentSensitivityTargetIds.value = [...checkedAreaIds.value];
  sensitivityFormApi.resetForm();
  sensitivityFormApi.setValues({ sensitivity: 5 });
  sensitivityDrawerApi.open();
}

// 批量处置
async function handleBatchHandle() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个告警事件');
    return;
  }
  const handlingRows = checkedRows.value.filter(row => row.alarmStatus === '告警中');
  if (handlingRows.length === 0) {
    ElMessage.warning('请选择状态为【告警中】的事件进行处置');
    return;
  }
  currentHandleRow.value = handlingRows;
  handleFormApi.resetForm();
  handleDrawerApi.open();
}

// 行内布防
async function handleDefend(row) {
  try {
    await ElMessageBox.confirm(`确认对区域"${row.alarmArea}"进行布防吗？`, '布防确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '布防中...' });
    try {
      const res = await defendPerimeterAlarm({ ids: [row.areaId] });
      if (res && res !== false) {
        ElMessage.success('布防成功');
        handleRefresh();
      } else {
        ElMessage.error('布防失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 行内撤防
async function handleCancelDefend(row) {
  try {
    await ElMessageBox.confirm(`确认对区域"${row.alarmArea}"进行撤防吗？`, '撤防确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '撤防中...' });
    try {
      const res = await cancelDefendPerimeterAlarm({ ids: [row.areaId] });
      if (res && res !== false) {
        ElMessage.success('撤防成功');
        handleRefresh();
      } else {
        ElMessage.error('撤防失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 行内灵敏度调整
function handleSensitivity(row) {
  currentSensitivityTargetIds.value = [row.areaId];
  sensitivityFormApi.resetForm();
  sensitivityFormApi.setValues({ sensitivity: 5 });
  sensitivityDrawerApi.open();
}

// 行内处置
function handleHandle(row) {
  if (row.alarmStatus !== '告警中') {
    ElMessage.warning('只有告警中的事件可以处置');
    return;
  }
  currentHandleRow.value = [row];
  handleFormApi.resetForm();
  handleDrawerApi.open();
}

// 行内忽略
function handleIgnore(row) {
  if (row.alarmStatus !== '告警中') {
    ElMessage.warning('只有告警中的事件可以忽略');
    return;
  }
  currentIgnoreRow.value = row;
  ignoreFormApi.resetForm();
  ignoreDrawerApi.open();
}

// 行内联动监控
async function handleLinkMonitor(row) {
  const loading = ElLoading.service({ text: '获取监控画面...' });
  try {
    const res = await linkMonitorPerimeterAlarm({ id: row.id });
    if (res && res.monitorUrl) {
      currentMonitorUrl.value = res.monitorUrl;
      monitorDialogVisible.value = true;
    } else {
      ElMessage.error('获取监控画面失败');
    }
  } catch (error) {
    console.error('联动监控失败', error);
    ElMessage.error('联动监控失败');
  } finally {
    loading.close();
  }
}

// 行内确认
async function handleConfirm(row) {
  if (row.alarmStatus !== '已处置') {
    ElMessage.warning('只有已处置的事件可以确认');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认事件"${row.alarmArea}"的处置结果吗？`, '确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    });
    const loading = ElLoading.service({ text: '确认中...' });
    try {
      const res = await confirmPerimeterAlarm({ id: row.id });
      if (res && res !== false) {
        ElMessage.success('确认成功');
        handleRefresh();
      } else {
        ElMessage.error('确认失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 灵敏度调整表单
const [SensitivityForm, sensitivityFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '调整中...' });
    try {
      const res = await updateSensitivityPerimeterAlarm({ ids: currentSensitivityTargetIds.value, sensitivity: values.sensitivity });
      if (res && res !== false) {
        ElMessage.success('灵敏度调整成功');
        sensitivityDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('灵敏度调整失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useSensitivityFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

// 处置表单
const [HandleForm, handleFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '处置中...' });
    try {
      const ids = currentHandleRow.value.map(item => item.id);
      const res = await handlePerimeterAlarm({ ids, handleResult: values.handleResult });
      if (res && res !== false) {
        ElMessage.success('处置成功');
        handleDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('处置失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useHandleFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

// 忽略表单
const [IgnoreForm, ignoreFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '忽略中...' });
    try {
      const res = await ignorePerimeterAlarm({ id: currentIgnoreRow.value.id, ignoreReason: values.ignoreReason });
      if (res && res !== false) {
        ElMessage.success('已忽略');
        ignoreDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('忽略失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useIgnoreFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '确认' },
});

// 详情抽屉
const perimeterAlarmDetailDrawerRef = ref(null);

async function handleOpenDetail(row) {
  try {
    const detail = await getPerimeterAlarmDetail({ id: row.id });
    dataObj.detailObj = detail;
    perimeterAlarmDetailDrawerRef.value.open();
  } catch (error) {
    console.error('获取详情失败', error);
    ElMessage.error('获取详情失败');
  }
}

// 点击告警区域弹出防护区域详情
async function handleViewProtectArea(row) {
  if (!row.areaId) {
    ElMessage.warning('无关联防护区域');
    return;
  }
  try {
    const areaDetail = await getProtectAreaDetail({ id: row.areaId });
    ElMessageBox.alert(
      `区域名称：${areaDetail.areaName}\n位置：${areaDetail.location}\n布防状态：${areaDetail.defendStatus}\n灵敏度：${areaDetail.sensitivity}`,
      '防护区域详情',
      { confirmButtonText: '关闭' }
    );
  } catch (error) {
    console.error('获取防护区域信息失败', error);
    ElMessage.error('获取防护区域信息失败');
  }
}

// 点击关联设备弹出设备详情
async function handleViewDevice(row) {
  if (!row.deviceId) {
    ElMessage.warning('无关联设备');
    return;
  }
  try {
    const deviceDetail = await getPerimeterDeviceDetail({ id: row.deviceId });
    ElMessageBox.alert(
      `设备名称：${deviceDetail.name}\n设备型号：${deviceDetail.model}\n设备状态：${deviceDetail.status}`,
      '周界设备详情',
      { confirmButtonText: '关闭' }
    );
  } catch (error) {
    console.error('获取设备信息失败', error);
    ElMessage.error('获取设备信息失败');
  }
}

// 点击处置结果弹出处置详情
async function handleViewHandleResult(row) {
  if (!row.handleResult) {
    ElMessage.warning('无处置结果');
    return;
  }
  ElMessageBox.alert(
    `处置结果：${row.handleResult}\n处置人：${row.handleUser || '-'}\n处置时间：${formatTimestamp(row.updateTime)}`,
    '处置详情',
    { confirmButtonText: '关闭' }
  );
}

// 点击操作人弹出用户详情
async function handleViewUser(row) {
  if (!row.handleUser) {
    ElMessage.warning('无操作人信息');
    return;
  }
  try {
    const userDetail = await getUserDetail({ username: row.handleUser });
    ElMessageBox.alert(
      `用户名：${userDetail.username}\n昵称：${userDetail.nickname}\n电话：${userDetail.phone}`,
      '操作人信息',
      { confirmButtonText: '关闭' }
    );
  } catch (error) {
    console.error('获取用户信息失败', error);
    ElMessage.error('获取用户信息失败');
  }
}

// 筛选表单
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: (values) => {
    searchParams.value = { ...values };
    drawerApi.close();
    gridApi.reload();
  },
  layout: 'horizontal',
  schema: useFormSchema().map(v => {
    delete v.rules;
    return v;
  }),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: { ajax: { query: getTableData } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: { checkboxAll: handleRowCheckboxChange, checkboxChange: handleRowCheckboxChange },
  showSearchForm: false,
});

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

defineExpose({ handleFilterTagClick, clearFilters });
</script>

<template>
  <div class="park-lot-table-new">
    <PerimeterAlarmDetailDrawer ref="perimeterAlarmDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh" />
    <Drawer title="筛选">
      <QueryForm />
    </Drawer>
    <HandleDrawer title="处置告警">
      <HandleForm />
    </HandleDrawer>
    <SensitivityDrawer title="灵敏度调整">
      <SensitivityForm />
    </SensitivityDrawer>
    <IgnoreDrawer title="忽略告警">
      <IgnoreForm />
    </IgnoreDrawer>

    <!-- 联动监控弹窗 -->
    <el-dialog
      v-model="monitorDialogVisible"
      title="联动监控画面"
      width="70%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <RealTimePlayer :src="currentMonitorUrl" style="height: 400px;" />
    </el-dialog>

    <Grid>
      <template #table-title>
        <ElTag
          v-for="(value, field) in tagFilters"
          :key="field"
          type="success"
          closable
          @close="removeFilterTag(field)"
          style="height: 32px; margin: 4px 8px 4px 0; line-height: 32px"
        >
          {{ getFieldLabel(field) }}: {{ getTagDisplayText(field, value) }}
        </ElTag>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton :content="textObj.defendText" icon-name="Lock" @click="handleBatchDefend" />
          <IconButton :content="textObj.cancelDefendText" icon-name="Unlock" @click="handleBatchCancelDefend" />
          <IconButton :content="textObj.sensitivityText" icon-name="Setting" @click="handleBatchSensitivity" />
          <IconButton :content="textObj.handleText" icon-name="Edit" @click="handleBatchHandle" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton content="重置" icon-name="Refresh" @click="handleReset" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 钻取列 -->
      <template #alarmArea="{ row }">
        <el-text @click="handleViewProtectArea(row)" type="primary" style="cursor: pointer;">
          {{ row.alarmArea }}
        </el-text>
      </template>
      <template #alarmTime="{ row }">
        <el-text @click="handleFilterTagClick('alarmTime', getDateFromTimestamp(row.alarmTime))" type="primary" style="cursor: pointer;">
          {{ formatTimestamp(row.alarmTime) }}
        </el-text>
      </template>
      <template #alarmType="{ row }">
        <el-tag :type="getAlarmTypeTagType(row.alarmType)" @click="handleFilterTagClick('alarmType', row.alarmType)" style="cursor: pointer">
          {{ row.alarmType }}
        </el-tag>
      </template>
      <template #deviceId="{ row }">
        <el-text @click="handleViewDevice(row)" type="primary" style="cursor: pointer;">
          {{ row.deviceId || '-' }}
        </el-text>
      </template>
      <template #alarmStatus="{ row }">
        <el-tag :type="getAlarmStatusType(row.alarmStatus)" @click="handleFilterTagClick('alarmStatus', row.alarmStatus)" style="cursor: pointer">
          {{ row.alarmStatus }}
        </el-tag>
      </template>
      <template #handleUser="{ row }">
        <el-text v-if="row.handleUser" @click="handleViewUser(row)" type="primary" style="cursor: pointer;">
          {{ row.handleUser }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #handleResult="{ row }">
        <el-text v-if="row.handleResult" @click="handleViewHandleResult(row)" type="primary" style="cursor: pointer;">
          {{ row.handleResult?.length > 20 ? row.handleResult.substring(0, 20) + '...' : row.handleResult }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #creator="{ row }">
        <el-text @click="handleFilterTagClick('creator', row.creator)" type="primary" style="cursor: pointer;">
          {{ row.creator || '-' }}
        </el-text>
      </template>
      <template #createTime="{ row }">
        <el-text @click="handleFilterTagClick('createTime', getDateFromTimestamp(row.createTime))" type="primary" style="cursor: pointer;">
          {{ formatTimestamp(row.createTime) }}
        </el-text>
      </template>

      <!-- 时间格式化 -->
      <template #updateTime="{ row }">
        {{ formatTimestamp(row.updateTime) }}
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton :content="textObj.defendText" icon-name="Lock" @click="handleDefend(row)" />
          <IconButton :content="textObj.cancelDefendText" icon-name="Unlock" @click="handleCancelDefend(row)" />
          <IconButton :content="textObj.sensitivityText" icon-name="Setting" @click="handleSensitivity(row)" />
          <IconButton v-if="row.alarmStatus === '告警中'" :content="textObj.handleText" icon-name="Edit" @click="handleHandle(row)" />
          <IconButton v-if="row.alarmStatus === '告警中'" :content="textObj.ignoreText" icon-name="Close" @click="handleIgnore(row)" />
          <IconButton :content="textObj.linkMonitorText" icon-name="VideoCamera" @click="handleLinkMonitor(row)" />
          <IconButton v-if="row.alarmStatus === '已处置'" :content="textObj.confirmText" icon-name="Checked" @click="handleConfirm(row)" />
        </div>
      </template>
    </Grid>
  </div>
</template>
