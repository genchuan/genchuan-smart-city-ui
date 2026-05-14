<script setup>
import { reactive, ref, onMounted, nextTick, watch, computed } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import RealTimeMonitorDetailDrawer from './components/detail.vue';
import RealTimePlayer from './components/RealTimePlayer.vue';
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
} from '#/api/genchuan/industry/industrialpark/securityMgmt/videoMonitor/realTimeMonitor/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useHandleFormSchema,
} from '#/api/genchuan/industry/industrialpark/securityMgmt/videoMonitor/realTimeMonitor/form.js';

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
const currentRecordRow = ref(null);
const currentSplitMode = ref(4);

// 监控画面弹窗相关变量
const playerDialogVisible = ref(false);
const currentStreamUrl = ref('');
const currentMonitorRow = ref(null);

// ========== 分屏功能修正 ==========
// 存储每个窗口的数据 { streamUrl, cameraId, cameraName, paused }
const splitPlayers = ref([]);
// 摄像头选项列表（从表格数据中获取）
const cameraOptions = ref([]);
// 存储每个窗口的 RealTimePlayer 实例引用
const playerRefs = ref([]);

// 更新摄像头选项
const updateCameraOptions = () => {
  cameraOptions.value = dataObj.list.map(item => ({
    label: item.cameraName,
    value: item.id,
    streamUrl: item.streamUrl,
    cameraName: item.cameraName,
  }));
};

// 监听表格数据变化，刷新选项
watch(() => dataObj.list, () => updateCameraOptions(), { deep: true, immediate: true });

// 分屏模式选项
const splitModeOptions = [
  { label: '1分屏', value: 1 },
  { label: '4分屏', value: 4 },
  { label: '9分屏', value: 9 },
  { label: '16分屏', value: 16 },
];

// 切换分屏模式时重置窗口数据
const handleSplitModeChange = (value) => {
  currentSplitMode.value = value;
  // 重新生成占位数据，并重置 ref 数组
  splitPlayers.value = Array.from({ length: value }, () => ({
    streamUrl: '',
    cameraId: null,
    cameraName: '未选择',
    paused: false,
  }));
  playerRefs.value = new Array(value).fill(null);
  ElMessage.success(`已切换到 ${value} 分屏模式`);
};

// 为指定窗口分配摄像头
const assignCameraToWindow = (windowIndex, cameraId) => {
  const camera = cameraOptions.value.find(c => c.value === cameraId);
  if (camera) {
    splitPlayers.value[windowIndex] = {
      streamUrl: camera.streamUrl,
      cameraId: camera.value,
      cameraName: camera.cameraName,
      paused: false,
    };
  } else {
    splitPlayers.value[windowIndex] = {
      streamUrl: '',
      cameraId: null,
      cameraName: '未选择',
      paused: false,
    };
  }
  // 如果之前有播放器实例，需要重新加载？不需要，v-if会重建
};

// 设置播放器实例引用
const setPlayerRef = (idx, el) => {
  if (el) {
    playerRefs.value[idx] = el;
  }
};

// 根据分屏数计算网格列数（正方形网格）
const gridColumnCount = computed(() => {
  const mode = currentSplitMode.value;
  if (mode === 1) return 1;
  if (mode === 4) return 2;
  if (mode === 9) return 3;
  if (mode === 16) return 4;
  return 2;
});

// 打开分屏弹窗时，初始化分屏窗口数据
const openSplitDialog = () => {
  if (!cameraOptions.value.length && dataObj.list.length) {
    updateCameraOptions();
  }
  // 重置分屏模式为当前值，并初始化窗口数据
  splitPlayers.value = Array.from({ length: currentSplitMode.value }, () => ({
    streamUrl: '',
    cameraId: null,
    cameraName: '未选择',
    paused: false,
  }));
  playerRefs.value = new Array(currentSplitMode.value).fill(null);
  playerDialogVisible.value = true;
};

// ========== 窗口独立控制方法 ==========
// 截图
const handleSnapshot = (idx) => {
  const player = playerRefs.value[idx];
  if (!player) {
    ElMessage.warning('播放器未就绪');
    return;
  }
  const dataURL = player.captureFrame();
  if (dataURL) {
    const link = document.createElement('a');
    link.download = `snapshot_${splitPlayers.value[idx].cameraName || idx}_${Date.now()}.jpg`;
    link.href = dataURL;
    link.click();
    ElMessage.success('截图已保存');
  } else {
    ElMessage.error('截图失败，请确保视频正在播放');
  }
};

// 暂停/恢复播放
const togglePause = (idx) => {
  const player = playerRefs.value[idx];
  if (!player) {
    ElMessage.warning('播放器未就绪');
    return;
  }
  const currentPaused = splitPlayers.value[idx].paused;
  if (currentPaused) {
    player.playVideo();
    splitPlayers.value[idx].paused = false;
  } else {
    player.pauseVideo();
    splitPlayers.value[idx].paused = true;
  }
};

// 重启摄像头（调用后端接口）
const handleRestart = async (idx) => {
  const cameraId = splitPlayers.value[idx].cameraId;
  if (!cameraId) {
    ElMessage.warning('请先选择摄像头');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认重启摄像头“${splitPlayers.value[idx].cameraName}”吗？`, '重启确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '重启中...' });
    try {
      const res = await restartRealTimeMonitor({ ids: [cameraId] });
      if (res && res !== false) {
        ElMessage.success('重启成功');
        handleRefresh();
      } else {
        ElMessage.error('重启失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
};

// 录像（调用后端接口）
const handleRecordVideo = async (idx) => {
  const cameraId = splitPlayers.value[idx].cameraId;
  if (!cameraId) {
    ElMessage.warning('请先选择摄像头');
    return;
  }
  const loading = ElLoading.service({ text: '开始录像...' });
  try {
    const res = await recordRealTimeMonitor({
      id: cameraId,
      recordDuration: 300 // 默认录像5分钟
    });
    if (res && res !== false) {
      ElMessage.success('已开启该摄像头的异常事件录像');
    } else {
      ElMessage.error('录像失败');
    }
  } catch (error) {
    console.error('录像失败', error);
    ElMessage.error('录像失败');
  } finally {
    loading.close();
  }
};

// 弹窗内：全屏整个容器
function handleFullscreenContainer() {
  const container = document.querySelector('.split-grid-container');
  if (container && screenfull.isEnabled) {
    screenfull.request(container);
    ElMessage.success('已全屏');
  } else {
    ElMessage.warning('全屏失败');
  }
}

// 单画面查看（兼容原有“查看”按钮）
function handleViewMonitor(row) {
  if (!row.streamUrl) {
    ElMessage.warning('该摄像头暂未配置实时流地址');
    return;
  }
  currentSplitMode.value = 1;
  splitPlayers.value = [{
    streamUrl: row.streamUrl,
    cameraId: row.id,
    cameraName: row.cameraName,
    paused: false,
  }];
  playerRefs.value = new Array(1).fill(null);
  playerDialogVisible.value = true;
}

// 聚焦（全屏单画面）
async function handleFocus(row) {
  handleViewMonitor(row);
  await nextTick();
  handleFullscreenContainer();
}

// 以下为原有功能，未作改动（但 handleFocus 和 handleViewMonitor 已重新定义，注意移除冲突）
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

function handleSerachShow() {
  drawerApi.open();
}

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

// handleFocus 已在上方重写，移除原实现
// handleViewMonitor 已重写

async function handleAlarm(row) {
  if (row.alarmStatus === '告警中') {
    ElMessage.warning('该摄像头已在告警中');
    return;
  }
  const loading = ElLoading.service({ text: '触发告警中...' });
  try {
    const res = await alarmRealTimeMonitor({
      id: row.id,
      alarmContent: '触发告警'
    });
    if (res && res !== false) {
      ElMessage.success('告警已触发，已推送至安保人员');
      handleRefresh();
    } else {
      ElMessage.error('告警失败');
    }
  } catch (error) {
    console.error('告警失败', error);
    ElMessage.error('告警失败');
  } finally {
    loading.close();
  }
}

async function handleHandle(row) {
  if (row.alarmStatus !== '告警中') {
    ElMessage.warning('只有告警中的摄像头可以进行处置');
    return;
  }
  currentHandleRow.value = row;
  handleFormApi.resetForm();
  handleDrawerApi.open();
}

async function handleRecord(row) {
  if (!row) return;
  const loading = ElLoading.service({ text: '录像中...' });
  try {
    const res = await recordRealTimeMonitor({
      id: row.id,
      recordDuration: 300
    });
    if (res && res !== false) {
      ElMessage.success('开始录像');
    } else {
      ElMessage.error('录像失败');
    }
  } finally {
    loading.close();
  }
}

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

const [HandleForm, handleFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '处置中...' });
    try {
      const res = await handleRealTimeMonitor({
        id: currentHandleRow.value.id,
        handleResult: values.handleResult
      });
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
    <RealTimeMonitorDetailDrawer ref="realTimeMonitorDetailDrawerRef"
                                 :detail-obj="dataObj.detailObj" @refresh="handleRefresh" />
    <Drawer title="搜索">
      <QueryForm />
    </Drawer>
    <HandleDrawer title="事件处置">
      <HandleForm />
    </HandleDrawer>
    <RecordDrawer title="录像设置">
      <!-- 原 RecordForm 未定义，保留原状 -->
    </RecordDrawer>

    <!-- 分屏监控弹窗（独立控制每个窗口） -->
    <el-dialog
      v-model="playerDialogVisible"
      width="90%"
      destroy-on-close
      :modal="false"
      class="real-time-player-dialog"
      fullscreen
    >
      <template #header>
        <div class="dialog-header">
          <span class="dialog-title">分屏监控墙</span>
          <div class="header-actions">
            <el-select
              v-model="currentSplitMode"
              size="small"
              placeholder="分屏模式"
              style="width: 100px"
              @change="handleSplitModeChange"
            >
              <el-option
                v-for="item in splitModeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button size="small" type="primary" @click="handleFullscreenContainer">全屏</el-button>
          </div>
        </div>
      </template>
      <div class="split-grid-container" :style="{ gridTemplateColumns: `repeat(${gridColumnCount}, 1fr)` }">
        <div v-for="(player, idx) in splitPlayers" :key="idx" class="split-item">
          <div class="player-header">
            <span class="player-name">
              <el-select
                :model-value="player.cameraId"
                placeholder="选择摄像头"
                size="small"
                clearable
                @change="(val) => assignCameraToWindow(idx, val)"
                :loading="!cameraOptions.length"
              >
              <el-option
                v-for="cam in cameraOptions"
                :key="cam.value"
                :label="cam.label"
                :value="cam.value"
              />
            </el-select>
            </span>
            <div class="window-actions">
              <el-button size="small" type="success" @click="handleSnapshot(idx)">截图</el-button>
              <el-button size="small" :type="player.paused ? 'primary' : 'warning'" @click="togglePause(idx)">
                {{ player.paused ? '播放' : '暂停' }}
              </el-button>
              <el-button size="small" type="danger" @click="handleRestart(idx)">重启</el-button>
              <el-button size="small" type="primary" @click="handleRecordVideo(idx)">异常事件录像</el-button>
            </div>
          </div>
          <RealTimePlayer
            v-if="player.streamUrl"
            :src="player.streamUrl"
            :ref="(el) => setPlayerRef(idx, el)"
          />
          <div v-else class="empty-placeholder">未选择摄像头</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="playerDialogVisible = false">关闭</el-button>
      </template>
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
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton content="重置" icon-name="Refresh" @click="handleReset" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
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
        <el-tag :type="getRunStatusType(row.runStatus)"
                @click="handleFilterTagClick('runStatus', row.runStatus)" style="cursor: pointer">
          {{ row.runStatus }}
        </el-tag>
      </template>
      <template #alarmStatus="{ row }">
        <el-tag :type="getAlarmStatusType(row.alarmStatus)"
                @click="handleFilterTagClick('alarmStatus', row.alarmStatus)" style="cursor: pointer">
          {{ row.alarmStatus }}
        </el-tag>
      </template>
      <template #imgUrl="{ row }">
        <el-button type="primary" link @click="handleViewMonitor(row)">查看</el-button>
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
          <IconButton content="聚焦" icon-name="ZoomIn" @click="handleFocus(row)" />
          <IconButton v-if="row.runStatus === '正常'" content="告警" icon-name="Warning" color="#E6A23C" @click="handleAlarm(row)" />
          <IconButton v-if="row.alarmStatus === '告警中'" content="处置" icon-name="Edit" @click="handleHandle(row)" />
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
.real-time-player-dialog {
  :deep(.el-dialog__body) {
    padding: 0 20px 20px 20px;
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .dialog-title {
    font-size: 18px;
    font-weight: 500;
    color: #303133;
  }

  .header-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}

.split-grid-container {
  display: grid;
  gap: 8px;
  height: 70vh;
  overflow: auto;

  .split-item {
    background: #000;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;

    .player-header {
      background: rgba(0,0,0,0.7);
      padding: 4px 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      z-index: 1;
      flex-wrap: wrap;

      .player-name {
        font-size: 12px;
        margin-left: auto;
      }

      .window-actions {
        display: flex;
        gap: 4px;
      }
    }

    .real-time-player-container {
      flex: 1;
      min-height: 200px;
    }

    .empty-placeholder {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ccc;
      background: #1a1a1a;
      font-size: 14px;
    }
  }
}

:deep(.el-select) {
  width: 200px;
}
</style>
