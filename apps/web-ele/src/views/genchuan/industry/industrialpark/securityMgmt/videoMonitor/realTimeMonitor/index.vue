<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import RealTimeMonitorDetailDrawer from './components/detail.vue';
import {
  getMockList,
  getRealTimeMonitorPage,
  snapRealTimeMonitor,
  pauseRealTimeMonitor,
  restartRealTimeMonitor,
  focusRealTimeMonitor,
  alarmRealTimeMonitor,
  handleRealTimeMonitor,
  recordRealTimeMonitor,
  getRealTimeMonitorDetail,
  getCameraDetail,
  getUserDetail,
  getSecurityEventDetail,
} from '#/api/genchuan/industry/industrialPark/securityMgmt/videoMonitor/realTimeMonitor/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useHandleFormSchema,
  useSplitScreenSchema,
  useAlarmFormSchema,
  useRecordFormSchema,
} from '#/api/genchuan/industry/industrialPark/securityMgmt/videoMonitor/realTimeMonitor/form.js';

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
    area: '安装区域',
    runStatus: '运行状态',
    alarmStatus: '告警状态',
    creator: '创建人',
    createTime: '创建时间',
    cameraName: '摄像头名称',
    handleUser: '操作人',
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

const [SplitDrawer, splitDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => splitDrawerApi.close(),
});

const [HandleDrawer, handleDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => handleDrawerApi.close(),
});

const [AlarmDrawer, alarmDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => alarmDrawerApi.close(),
});

const [RecordDrawer, recordDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => recordDrawerApi.close(),
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

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
  checkedRows.value = records;
}

const searchParams = ref({});
const currentHandleRow = ref(null);
const currentAlarmRow = ref(null);
const currentRecordRow = ref(null);
const currentSplitMode = ref(4);

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const getDateFromTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getRunStatusType = (status) => {
  const map = {
    '正常': 'success',
    '异常': 'danger',
    '离线': 'info',
  };
  return map[status] || 'info';
};

const getAlarmStatusType = (status) => {
  const map = {
    '无告警': 'success',
    '告警中': 'danger',
  };
  return map[status] || 'info';
};

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    const res = await getRealTimeMonitorPage(params);
    let filtered = res.list;
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'area':
            itemValue = item.area;
            break;
          case 'runStatus':
            itemValue = item.runStatus;
            break;
          case 'alarmStatus':
            itemValue = item.alarmStatus;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
            break;
          case 'cameraName':
            itemValue = item.cameraName;
            break;
          case 'handleUser':
            itemValue = item.handleUser;
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
          case 'area':
            itemValue = item.area;
            break;
          case 'runStatus':
            itemValue = item.runStatus;
            break;
          case 'alarmStatus':
            itemValue = item.alarmStatus;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
            break;
          case 'cameraName':
            itemValue = item.cameraName;
            break;
          case 'handleUser':
            itemValue = item.handleUser;
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

// 全屏（选中画面，需先选中一行）
let fullscreenElement = null;
function handleFullscreen() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择一个监控画面');
    return;
  }
  // 全屏当前选中的第一个画面（模拟）
  const element = document.querySelector('.vxe-grid');
  if (element && screenfull.isEnabled) {
    screenfull.request(element);
    ElMessage.success('已切换全屏模式，按 ESC 退出');
  } else {
    ElMessage.warning('当前浏览器不支持全屏功能');
  }
}

// 分屏
function handleSplitScreen() {
  splitDrawerApi.open();
}

// 截图（批量）
async function handleBatchSnap() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个监控画面');
    return;
  }
  const loading = ElLoading.service({ text: '截图中...' });
  try {
    const res = await snapRealTimeMonitor({ ids: checkedIds.value });
    if (res && res !== false) {
      ElMessage.success(`成功截图 ${checkedIds.value.length} 个画面`);
      handleRefresh();
    } else {
      ElMessage.error('截图失败');
    }
  } finally {
    loading.close();
  }
}

// 暂停（批量）
async function handleBatchPause() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个监控画面');
    return;
  }
  const loading = ElLoading.service({ text: '暂停中...' });
  try {
    const res = await pauseRealTimeMonitor({ ids: checkedIds.value });
    if (res && res !== false) {
      ElMessage.success(`已暂停 ${checkedIds.value.length} 个画面`);
      handleRefresh();
    } else {
      ElMessage.error('暂停失败');
    }
  } finally {
    loading.close();
  }
}

// 重启（批量）
async function handleBatchRestart() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个监控画面');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认重启选中的 ${checkedIds.value.length} 个摄像头设备吗？`, '重启确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '重启中...' });
    try {
      const res = await restartRealTimeMonitor({ ids: checkedIds.value });
      if (res && res !== false) {
        ElMessage.success(`已重启 ${checkedIds.value.length} 个设备`);
        handleRefresh();
      } else {
        ElMessage.error('重启失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 筛选
function handleSerachShow() {
  drawerApi.open();
}

// 行内操作：截图
async function handleSnap(row) {
  const loading = ElLoading.service({ text: '截图中...' });
  try {
    const res = await snapRealTimeMonitor({ ids: [row.id] });
    if (res && res !== false) {
      ElMessage.success('截图成功，已保存至本地');
      handleRefresh();
    } else {
      ElMessage.error('截图失败');
    }
  } finally {
    loading.close();
  }
}

// 行内操作：聚焦（全屏预览）
async function handleFocus(row) {
  const loading = ElLoading.service({ text: '聚焦中...' });
  try {
    const res = await focusRealTimeMonitor({ id: row.id });
    if (res && res !== false) {
      // 前端全屏预览该摄像头的画面
      const imgElement = document.querySelector(`img[data-id="${row.id}"]`);
      if (imgElement && screenfull.isEnabled) {
        screenfull.request(imgElement);
        ElMessage.success('已切换全屏预览');
      } else {
        ElMessage.success('聚焦成功');
      }
    } else {
      ElMessage.error('聚焦失败');
    }
  } finally {
    loading.close();
  }
}

// 行内操作：告警
async function handleAlarm(row) {
  if (row.alarmStatus === '告警中') {
    ElMessage.warning('该摄像头已在告警中');
    return;
  }
  currentAlarmRow.value = row;
  alarmFormApi.resetForm();
  alarmDrawerApi.open();
}

// 行内操作：处置
async function handleHandle(row) {
  if (row.alarmStatus !== '告警中') {
    ElMessage.warning('只有告警中的摄像头可以进行处置');
    return;
  }
  currentHandleRow.value = row;
  handleFormApi.resetForm();
  handleDrawerApi.open();
}

// 行内操作：录像
async function handleRecord(row) {
  currentRecordRow.value = row;
  recordFormApi.resetForm();
  recordDrawerApi.open();
}

// 详情抽屉
const realTimeMonitorDetailDrawerRef = ref(null);

async function handleOpenDetail(row) {
  try {
    const detail = await getRealTimeMonitorDetail({ id: row.id });
    dataObj.detailObj = detail;
    realTimeMonitorDetailDrawerRef.value.open();
  } catch (error) {
    console.error('获取详情失败', error);
    ElMessage.error('获取详情失败');
  }
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

// 点击处置结果弹出事件详情
async function handleViewEvent(row) {
  if (!row.handleResult) {
    ElMessage.warning('无处置结果信息');
    return;
  }
  try {
    const eventDetail = await getSecurityEventDetail({ handleResult: row.handleResult });
    ElMessageBox.alert(
      `事件类型：${eventDetail.eventType}\n处置结果：${eventDetail.handleResult}\n处置时间：${formatTimestamp(eventDetail.handleTime)}`,
      '事件处置详情',
      { confirmButtonText: '关闭' }
    );
  } catch (error) {
    console.error('获取事件详情失败', error);
    ElMessage.error('获取事件详情失败');
  }
}

// 查询表单
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

// 处置表单
const [HandleForm, handleFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '处置中...' });
    try {
      const res = await handleRealTimeMonitor({ id: currentHandleRow.value.id, handleResult: values.handleResult });
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

// 告警表单
const [AlarmForm, alarmFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '告警中...' });
    try {
      const res = await alarmRealTimeMonitor({ id: currentAlarmRow.value.id, alarmContent: values.alarmContent });
      if (res && res !== false) {
        ElMessage.success('告警已触发');
        alarmDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('告警失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useAlarmFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '确认' },
});

// 录像表单
const [RecordForm, recordFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '录像中...' });
    try {
      const res = await recordRealTimeMonitor({ id: currentRecordRow.value.id, recordDuration: values.recordDuration || 300 });
      if (res && res !== false) {
        ElMessage.success('开始录像');
        recordDrawerApi.close();
      } else {
        ElMessage.error('录像失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useRecordFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '开始录像' },
});

// 分屏表单
const [SplitForm, splitFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    currentSplitMode.value = values.splitMode;
    ElMessage.success(`已切换到${values.splitMode}分屏模式`);
    splitDrawerApi.close();
  },
  layout: 'horizontal',
  schema: useSplitScreenSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
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

const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

defineExpose({ handleFilterTagClick, clearFilters });
</script>

<template>
  <div class="park-lot-table-new">
    <RealTimeMonitorDetailDrawer ref="realTimeMonitorDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh" />
    <Drawer title="搜索">
      <QueryForm />
    </Drawer>
    <SplitDrawer title="分屏模式">
      <SplitForm />
    </SplitDrawer>
    <HandleDrawer title="事件处置">
      <HandleForm />
    </HandleDrawer>
    <AlarmDrawer title="告警触发">
      <AlarmForm />
    </AlarmDrawer>
    <RecordDrawer title="录像设置">
      <RecordForm />
    </RecordDrawer>
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
          <IconButton :content="textObj.fullscreenText" icon-name="FullScreen" @click="handleFullscreen" />
          <IconButton :content="textObj.splitText" icon-name="Grid" @click="handleSplitScreen" />
          <IconButton :content="textObj.snapText" icon-name="Camera" @click="handleBatchSnap" />
          <IconButton :content="textObj.pauseText" icon-name="VideoPause" @click="handleBatchPause" />
          <IconButton :content="textObj.restartText" icon-name="Refresh" @click="handleBatchRestart" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton content="重置" icon-name="Refresh" @click="handleReset" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 钻取列 -->
      <template #cameraName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary" style="cursor: pointer;">
          {{ row.cameraName }}
        </el-text>
      </template>
      <template #area="{ row }">
        <el-text @click="handleFilterTagClick('area', row.area)" type="primary" style="cursor: pointer;">
          {{ row.area }}
        </el-text>
      </template>
      <template #runStatus="{ row }">
        <el-tag :type="getRunStatusType(row.runStatus)" @click="handleFilterTagClick('runStatus', row.runStatus)" style="cursor: pointer">
          {{ row.runStatus }}
        </el-tag>
      </template>
      <template #alarmStatus="{ row }">
        <el-tag :type="getAlarmStatusType(row.alarmStatus)" @click="handleFilterTagClick('alarmStatus', row.alarmStatus)" style="cursor: pointer">
          {{ row.alarmStatus }}
        </el-tag>
      </template>
      <template #imgUrl="{ row }">
        <el-image
          :src="row.imgUrl"
          style="width: 80px; height: 60px; object-fit: cover; border-radius: 4px; cursor: pointer;"
          :preview-src-list="[row.imgUrl]"
          @click="() => {}"
        />
      </template>
      <template #updateTime="{ row }">
        {{ formatTimestamp(row.updateTime) }}
      </template>
      <template #handleUser="{ row }">
        <el-text v-if="row.handleUser" @click="handleViewUser(row)" type="primary" style="cursor: pointer;">
          {{ row.handleUser }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #handleResult="{ row }">
        <el-text v-if="row.handleResult" @click="handleViewEvent(row)" type="primary" style="cursor: pointer;">
          {{ row.handleResult?.length > 20 ? row.handleResult.substring(0, 20) + '...' : row.handleResult }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #snapImg="{ row }">
        <el-button v-if="row.snapImg" link type="primary" @click="() => { window.open(row.snapImg); }">查看截图</el-button>
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

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="截图" icon-name="Camera" @click="handleSnap(row)" />
          <IconButton content="聚焦" icon-name="ZoomIn" @click="handleFocus(row)" />
          <IconButton v-if="row.runStatus === '正常'" content="告警" icon-name="Warning" color="#E6A23C" @click="handleAlarm(row)" />
          <IconButton v-if="row.alarmStatus === '告警中'" content="处置" icon-name="Edit" @click="handleHandle(row)" />
          <IconButton content="录像" icon-name="VideoCamera" @click="handleRecord(row)" />
        </div>
      </template>
    </Grid>
  </div>
</template>
