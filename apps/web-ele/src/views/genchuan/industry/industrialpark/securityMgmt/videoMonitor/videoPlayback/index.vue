<script setup>
import { reactive, ref, nextTick } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import VideoPlaybackDetailDrawer from './components/detail.vue';
import VideoPlayer from './components/VideoPlayer.vue';
import {
  getMockList,
  getVideoPlaybackPage,
  playVideoPlayback,
  snapVideoPlayback,
  exportVideoPlayback,
  deleteVideoPlayback,
  confirmVideoPlayback,
  getCameraDetail,
  getUserDetail,
} from '#/api/genchuan/industry/industrialpark/securityMgmt/videoMonitor/videoPlayback/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useSearchFormSchema,
  formatTimestamp,
} from '#/api/genchuan/industry/industrialpark/securityMgmt/videoMonitor/videoPlayback/form.js';

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
    cameraName: '摄像头名称',
    storeStatus: '存储状态',
    handleUser: '操作人',
    creator: '创建人',
    createTime: '创建时间',
    videoTime: '录像时间',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  if (field === 'videoTime') return formatTimestamp(value);
  return value || '-';
}

// 抽屉组件
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
});

const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => searchDrawerApi.close(),
});

// 播放器改为模态框，不再使用抽屉
// const [PlayerDrawer, playerDrawerApi] = ...  // 已删除

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
const currentPlayRow = ref(null);
const currentPlayerUrl = ref('');
const currentPlayerTitle = ref('');
// 播放器模态框控制
const playerDialogVisible = ref(false);

const getDateFromTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getStoreStatusType = (status) => {
  const map = {
    '正常': 'success',
    '已过期': 'danger',
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
    const res = await getVideoPlaybackPage(params);
    let filtered = res.list;
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'cameraName':
            itemValue = item.cameraName;
            break;
          case 'storeStatus':
            itemValue = item.storeStatus;
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
          case 'videoTime':
            const videoDate = item.videoTime ? getDateFromTimestamp(item.videoTime) : '';
            itemValue = videoDate;
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
          case 'cameraName':
            itemValue = item.cameraName;
            break;
          case 'storeStatus':
            itemValue = item.storeStatus;
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
          case 'videoTime':
            const videoDate = item.videoTime ? getDateFromTimestamp(item.videoTime) : '';
            itemValue = videoDate;
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

async function handleExport() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个录像');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认导出选中的 ${checkedIds.value.length} 个录像文件吗？`, '导出确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    });
    const loading = ElLoading.service({ text: '导出中...' });
    try {
      await exportVideoPlayback({ ids: checkedIds.value });
      ElMessage.success('导出成功');
      handleRefresh();
    } finally {
      loading.close();
    }
  } catch {}
}

// 检索
function handleSearch() {
  searchFormApi.resetForm();
  searchDrawerApi.open();
}

// 快进/慢速需要的视频元素引用
let currentVideoElement = null;

function handleFastForward() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择一个录像');
    return;
  }
  if (!currentVideoElement) {
    ElMessage.warning('请先播放录像');
    return;
  }
  let newRate = currentVideoElement.playbackRate * 2;
  if (newRate > 8) newRate = 1;
  currentVideoElement.playbackRate = newRate;
  ElMessage.success(`播放速度已调整为 ${newRate} 倍`);
}

function handleSlowMotion() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择一个录像');
    return;
  }
  if (!currentVideoElement) {
    ElMessage.warning('请先播放录像');
    return;
  }
  let newRate = currentVideoElement.playbackRate / 2;
  if (newRate < 0.25) newRate = 1;
  currentVideoElement.playbackRate = newRate;
  ElMessage.success(`播放速度已调整为 ${newRate} 倍`);
}

// 截图（基于当前播放的视频）
async function handleSnap() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择一个录像');
    return;
  }
  if (!currentVideoElement) {
    ElMessage.warning('请先播放录像');
    return;
  }
  const loading = ElLoading.service({ text: '截图中...' });
  try {
    const currentTime = Math.floor(currentVideoElement.currentTime);
    const res = await snapVideoPlayback({ id: checkedIds.value[0], snapTime: currentTime });
    if (res && res.success) {
      const link = document.createElement('a');
      link.href = res.snapUrl;
      link.download = `snapshot_${Date.now()}.jpg`;
      link.click();
      ElMessage.success('截图成功');
    } else {
      ElMessage.error('截图失败');
    }
  } catch (error) {
    console.error('截图失败', error);
    ElMessage.error('截图失败');
  } finally {
    loading.close();
  }
}

// 行内播放（改为打开模态框）
async function handlePlay(row) {
  if (row.storeStatus !== '正常') {
    ElMessage.warning('该录像已过期，无法播放');
    return;
  }
  const loading = ElLoading.service({ text: '获取播放地址...' });
  try {
    const res = await playVideoPlayback({ id: row.id });
    if (res && res.playUrl) {
      currentPlayerUrl.value = res.playUrl;
      currentPlayerTitle.value = `${row.cameraName} - ${formatTimestamp(row.videoTime)}`;
      playerDialogVisible.value = true; // 打开模态框
      // 等待模态框渲染完成后获取 video 元素
      nextTick(() => {
        const video = document.querySelector('#video-player-element');
        if (video) {
          currentVideoElement = video;
          // 可选：自动播放
          video.play();
        }
      });
    } else {
      ElMessage.error('获取播放地址失败');
    }
  } catch (error) {
    console.error('播放失败', error);
    ElMessage.error('播放失败');
  } finally {
    loading.close();
  }
}

// 行内截图
async function handleRowSnap(row) {
  if (row.storeStatus !== '正常') {
    ElMessage.warning('该录像已过期，无法截图');
    return;
  }
  const loading = ElLoading.service({ text: '截图中...' });
  try {
    const res = await snapVideoPlayback({ id: row.id, snapTime: 0 });
    if (res && res.success) {
      const link = document.createElement('a');
      link.href = res.snapUrl;
      link.download = `snapshot_${row.id}.jpg`;
      link.click();
      ElMessage.success('截图成功');
    } else {
      ElMessage.error('截图失败');
    }
  } catch (error) {
    console.error('截图失败', error);
    ElMessage.error('截图失败');
  } finally {
    loading.close();
  }
}

// 行内导出
async function handleRowExport(row) {
  try {
    await ElMessageBox.confirm(`确认导出录像"${row.cameraName}"文件吗？`, '导出确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    });
    const loading = ElLoading.service({ text: '导出中...' });
    try {
      await exportVideoPlayback({ ids: [row.id] });
      ElMessage.success('导出成功');
      handleRefresh();
    } finally {
      loading.close();
    }
  } catch {}
}

// 行内删除
async function handleRowDelete(row) {
  if (row.storeStatus !== '已过期') {
    ElMessage.warning('只有已过期的录像可以删除');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认删除录像"${row.cameraName}"吗？删除后无法恢复。`, '删除确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '删除中...' });
    try {
      const res = await deleteVideoPlayback({ ids: [row.id] });
      if (res) {
        ElMessage.success('删除成功');
        handleRefresh();
      } else {
        ElMessage.error('删除失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 行内确认（已过期录像确认清理）
async function handleRowConfirm(row) {
  if (row.storeStatus !== '已过期') {
    ElMessage.warning('只有已过期的录像需要确认');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认清理录像"${row.cameraName}"吗？此操作将永久删除文件。`, '确认清理', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loading = ElLoading.service({ text: '清理中...' });
    try {
      const res = await confirmVideoPlayback({ id: row.id });
      if (res) {
        ElMessage.success('清理成功');
        handleRefresh();
      } else {
        ElMessage.error('清理失败');
      }
    } finally {
      loading.close();
    }
  } catch {}
}

// 详情抽屉
const videoPlaybackDetailDrawerRef = ref(null);

async function handleOpenDetail(row) {
  try {
    const detail = { ...row };
    dataObj.detailObj = detail;
    videoPlaybackDetailDrawerRef.value.open();
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

// 检索表单
const [SearchForm, searchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const { timeRange, cameraId, area } = values;
    const newParams = {};
    if (timeRange && timeRange.length === 2) {
      newParams.videoTimeStart = timeRange[0];
      newParams.videoTimeEnd = timeRange[1];
    }
    if (cameraId) newParams.cameraId = cameraId;
    if (area) newParams.area = area;
    searchParams.value = { ...searchParams.value, ...newParams };
    searchDrawerApi.close();
    gridApi.reload();
  },
  layout: 'horizontal',
  schema: useSearchFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '保存' },
});

// 查询表单（筛选）
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: (values) => {
    const newParams = { ...values };
    if (values.videoTimeRange && values.videoTimeRange.length === 2) {
      newParams.videoTimeStart = values.videoTimeRange[0];
      newParams.videoTimeEnd = values.videoTimeRange[1];
      delete newParams.videoTimeRange;
    }
    searchParams.value = { ...newParams };
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
    <VideoPlaybackDetailDrawer ref="videoPlaybackDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh" />
    <Drawer title="筛选">
      <QueryForm />
    </Drawer>
    <SearchDrawer title="检索录像">
      <SearchForm />
    </SearchDrawer>

    <!-- 播放器模态框（居中弹窗） -->
    <el-dialog
      v-model="playerDialogVisible"
      :title="currentPlayerTitle"
      width="80%"
      destroy-on-close
      :modal="false"
    >
      <video
        id="video-player-element"
        :src="currentPlayerUrl"
        controls
        autoplay
        style="width: 100%; height: 500px; object-fit: contain;"
      ></video>
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
          <IconButton :content="textObj.searchText" icon-name="Search" @click="handleSearch" />
          <IconButton :content="textObj.fastForwardText" icon-name="TopRight" @click="handleFastForward" />
          <IconButton :content="textObj.slowMotionText" icon-name="BottomRight" @click="handleSlowMotion" />
          <IconButton :content="textObj.snapText" icon-name="Camera" @click="handleSnap" />
          <IconButton :content="textObj.exportText" icon-name="download" @click="handleExport" />
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
      <template #videoTime="{ row }">
        <el-text @click="handleFilterTagClick('videoTime', row.videoTime)" type="primary" style="cursor: pointer;">
          {{ formatTimestamp(row.videoTime) }}
        </el-text>
      </template>
      <template #storeStatus="{ row }">
        <el-tag :type="getStoreStatusType(row.storeStatus)" @click="handleFilterTagClick('storeStatus', row.storeStatus)" style="cursor: pointer">
          {{ row.storeStatus }}
        </el-tag>
      </template>
      <template #handleUser="{ row }">
        <el-text v-if="row.handleUser" @click="handleViewUser(row)" type="primary" style="cursor: pointer;">
          {{ row.handleUser }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #exportRecord="{ row }">
        <el-link v-if="row.exportRecord" type="primary" :href="row.exportRecord" target="_blank">下载</el-link>
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
      <template #queryTime="{ row }">
        {{ formatTimestamp(row.queryTime) }}
      </template>
      <template #updateTime="{ row }">
        {{ formatTimestamp(row.updateTime) }}
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <template v-if="row.storeStatus === '正常'">
            <IconButton :content="textObj.playText" icon-name="VideoPlay" @click="handlePlay(row)" />
            <IconButton :content="textObj.snapText" icon-name="Camera" @click="handleRowSnap(row)" />
            <IconButton :content="textObj.exportText" icon-name="download" @click="handleRowExport(row)" />
          </template>
          <template v-else>
            <IconButton :content="textObj.deleteText" icon-name="Delete" color="#F56C6C" @click="handleRowDelete(row)" />
            <IconButton :content="textObj.confirmText" icon-name="Checked" @click="handleRowConfirm(row)" />
          </template>
        </div>
      </template>
    </Grid>
  </div>
</template>
