<template>
  <div class="park-lot-table-new">
    <Grid>
      <!-- 顶部筛选标签 -->
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <el-tag
            v-for="filter in activeFilters"
            :key="filter.field"
            type="primary"
            closable
            @close="handleClearField(filter.field)"
          >
            {{ filter.label }}
          </el-tag>
          <el-button v-if="activeFilters.length" link type="primary" @click="clearAllFilters">清空全部</el-button>
        </div>
      </template>

      <!-- 工具栏按钮 -->
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="筛选" icon-name="search" @click="searchDrawerApi.open()" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="批量推送" icon-name="Promotion" :disabled="selectedIds.length === 0" @click="openBatchPushDialog" />
          <!-- 新增展开/收缩按钮 -->
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="刷新" icon-name="refresh" @click="handleRefresh" />
        </div>
      </template>

      <!-- 列模板 -->
      <template #id="{ row }">
        <el-text @click="openDetail(row)" type="primary">{{ row.id }}</el-text>
      </template>
      <template #userName="{ row }">
        <el-text v-if="row.userId" @click="handleUserClick(row.userId, row.userName)" type="primary" style="cursor: pointer">
          {{ row.userName || getUserNameById(row.userId) || row.userId }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #stationName="{ row }">
        <el-text @click="addQuickFilter('stationId', row.stationId, `场站ID: ${row.stationId}`)" type="primary" style="cursor: pointer">
          {{ row.stationName || '-' }}
        </el-text>
      </template>
      <template #spaceInfo="{ row }">
        <el-text @click="openSpaceDetail(row)" type="primary" style="cursor: pointer">
          {{ row.spaceInfo || '-' }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-tag
          :type="row.status === '待推送' ? 'warning' : 'success'"
          @click="addQuickFilter('status', row.status, `推送状态: ${row.status}`)"
          style="cursor: pointer"
        >
          {{ row.status }}
        </el-tag>
      </template>
      <template #pushResult="{ row }">
        <el-tag
          v-if="row.pushResult"
          :type="row.pushResult === '成功' ? 'success' : 'danger'"
          @click="addQuickFilter('pushResult', row.pushResult, `推送结果: ${row.pushResult}`)"
          style="cursor: pointer"
        >
          {{ row.pushResult }}
        </el-tag>
        <span v-else>-</span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <template v-if="row.status === '待推送'">
            <IconButton content="推送" icon-name="Promotion" @click="handlePush(row)" />
            <IconButton content="查看" icon-name="View" @click="openDetail(row)" />
          </template>
          <template v-else>
            <IconButton content="查看" icon-name="View" @click="openDetail(row)" />
          </template>
        </div>
      </template>
    </Grid>

    <!-- 搜索抽屉 -->
    <SearchDrawer title="搜索">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <!-- 详情抽屉 -->
    <DetailDrawer ref="detailDrawerRef" :detail-data="currentDetail" />
    <UserDetailDrawer ref="userDetailDrawerRef" />

    <!-- 批量推送确认弹窗 -->
    <el-dialog v-model="batchPushVisible" title="批量推送确认" width="400px">
      <span>确认批量推送选中的 {{ selectedIds.length }} 条空位推送吗？</span>
      <template #footer>
        <el-button @click="batchPushVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchPush">确认</el-button>
      </template>
    </el-dialog>

    <!-- 单条推送确认弹窗 -->
    <el-dialog v-model="singlePushVisible" title="推送确认" width="400px">
      <span>确认推送该空位信息吗？</span>
      <template #footer>
        <el-button @click="singlePushVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSinglePush">确认</el-button>
      </template>
    </el-dialog>

    <!-- 空位信息钻取：单条车位详情（右侧抽屉） -->
    <SpaceDetailDrawer :title="`车位详情 - ${spaceDetailContext.stationName}`">
      <div v-loading="spaceDetailLoading" class="detail-card">
        <div v-if="spaceDetailContext.spaceInfo" class="detail-card-row">
          <div class="detail-row-left">推送内容：</div>
          <div class="detail-row-right">{{ spaceDetailContext.spaceInfo }}</div>
        </div>
        <template v-if="spaceDetail">
          <div class="detail-card-row"><div class="detail-row-left">车位ID：</div><div class="detail-row-right">{{ spaceDetail.id || '-' }}</div></div>
          <div class="detail-card-row"><div class="detail-row-left">车位编号：</div><div class="detail-row-right">{{ spaceDetail.spaceNo || '-' }}</div></div>
          <div class="detail-card-row"><div class="detail-row-left">所属场站：</div><div class="detail-row-right">{{ spaceDetail.stationName || '-' }} (ID:{{ spaceDetail.stationId || '-' }})</div></div>
          <div class="detail-card-row"><div class="detail-row-left">所属车库：</div><div class="detail-row-right">{{ spaceDetail.garage || '-' }}</div></div>
          <div class="detail-card-row"><div class="detail-row-left">车位位置：</div><div class="detail-row-right">{{ spaceDetail.location || '-' }}</div></div>
          <div class="detail-card-row"><div class="detail-row-left">车位类型：</div><div class="detail-row-right">{{ spaceDetail.type || '-' }}</div></div>
          <div class="detail-card-row"><div class="detail-row-left">设备类型：</div><div class="detail-row-right">{{ spaceDetail.deviceType || '-' }}</div></div>
          <div class="detail-card-row">
            <div class="detail-row-left">实时状态：</div>
            <div class="detail-row-right">
              <el-tag :type="spaceDetail.realStatus === '空闲' ? 'success' : spaceDetail.realStatus === '占用' ? 'warning' : 'danger'" size="small">
                {{ spaceDetail.realStatus || '-' }}
              </el-tag>
            </div>
          </div>
          <div class="detail-card-row"><div class="detail-row-left">绑定状态：</div><div class="detail-row-right">{{ spaceDetail.status || '-' }}</div></div>
          <div class="detail-card-row"><div class="detail-row-left">备注：</div><div class="detail-row-right">{{ spaceDetail.remark || '-' }}</div></div>
        </template>
        <div v-else-if="!spaceDetailLoading" style="padding: 24px 0; text-align: center; color: #909399">
          {{ spaceMatchHint || '暂无车位详情' }}
        </div>
      </div>
    </SpaceDetailDrawer>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage, ElLoading } from 'element-plus';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import { formatTimestamp } from '#/utils';
import {
  getSpacePushPage,
  exportSpacePush,
  batchPushSpace,
  pushSpace,
  getUserList,
  getUserDetail,
  getParkingSpacesByStation,
} from '#/api/genchuan/industry/chargePark/carService/carGuide/spacePush/index.js';
import { useFormSchema, useGridColumns } from './data';
import DetailDrawer from './detail.vue';
import UserDetailDrawer from './userDetail.vue';

// 新增 props 和 emit
const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },   // 新增
});
const emit = defineEmits(['arrow-change']);         // 新增

// 新增：触发箭头切换事件
const arrowChange = () => {
  emit('arrow-change');
};

// ==================== 用户映射 ====================
const allUserMap = ref(new Map());       // userId -> userName
const userNameToIdMap = ref(new Map());  // userName -> userId

async function fetchAllUsers() {
  try {
    const users = await getUserList();
    allUserMap.value.clear();
    userNameToIdMap.value.clear();
    (users || []).forEach(user => {
      const userId = user.userId;
      const userName = user.userName || user.nickname;
      if (userId && userName) {
        allUserMap.value.set(userId, userName);
        if (!userNameToIdMap.value.has(userName)) {
          userNameToIdMap.value.set(userName, userId);
        }
      }
    });
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
}

function getUserIdByUserName(userName) {
  if (!userName) return null;
  return userNameToIdMap.value.get(userName);
}

function getUserNameById(userId) {
  if (!userId) return '';
  return allUserMap.value.get(userId) || String(userId);
}

// ==================== 搜索参数管理 ====================
const searchParams = reactive({});
const selectedIds = ref([]);
const batchPushVisible = ref(false);
const singlePushVisible = ref(false);
let currentPushRow = null;

// 获取表格数据
const getTableData = async ({ page }) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...searchParams,
  };

  // userName / stationName / pushResult 是前端筛选条件（后端 PageReqVO 不含这些字段），不发给后端
  const userNameFilter = (params.userName || '').trim().toLowerCase();
  const stationNameFilter = (params.stationName || '').trim().toLowerCase();
  const pushResultFilter = params.pushResult || '';
  delete params.userName;
  delete params.stationName;
  delete params.pushResult;

  // 后端 SpacePushPageReqVO.pushTime 是 LocalDateTime[]，用逗号串接绕开 Spring 多值绑定问题
  if (Array.isArray(params.pushTime) && params.pushTime.length === 2) {
    params.pushTime = `${params.pushTime[0]},${params.pushTime[1]}`;
  }

  // 数字字段转 Number
  if (params.userId) params.userId = Number(params.userId);
  if (params.stationId) params.stationId = Number(params.stationId);

  // 清理空值
  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === null || params[key] === '') {
      delete params[key];
    }
  });

  // 前端筛选时拉大 pageSize 一次拿足，再前端过滤+分页
  const hasClientFilter = userNameFilter || stationNameFilter || pushResultFilter;
  if (hasClientFilter) {
    params.pageNo = 1;
    params.pageSize = 200;
  }

  const res = await getSpacePushPage(params);
  let list = res.list || [];
  let total = res.total;

  if (hasClientFilter) {
    list = list.filter(v => {
      const uname = (v.userName || getUserNameById(v.userId) || String(v.userId || '')).toLowerCase();
      const sname = (v.stationName || `场站${v.stationId || ''}`).toLowerCase();
      if (userNameFilter && !uname.includes(userNameFilter)) return false;
      if (stationNameFilter && !sname.includes(stationNameFilter)) return false;
      if (pushResultFilter && v.pushResult !== pushResultFilter) return false;
      return true;
    });
    total = list.length;
    const pStart = (page.currentPage - 1) * page.pageSize;
    list = list.slice(pStart, pStart + page.pageSize);
  }

  list = list.map(item => ({
    ...item,
    pushTime: formatTimestamp(item.pushTime),
    feedbackTime: formatTimestamp(item.feedbackTime),
    createTime: formatTimestamp(item.createTime),
    updateTime: formatTimestamp(item.updateTime),
    stationName: item.stationName || `场站${item.stationId}`,
  }));
  return { total, list };
};

// vxe-grid 配置
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    proxyConfig: { ajax: { query: getTableData } },
    rowConfig: { keyField: 'id', isHover: true },
    toolbarConfig: { refresh: false, search: false },
    showOverflow: true,
    checkboxConfig: { reserve: true, highlight: true },
  },
  gridEvents: {
    checkboxAll: ({ records }) => { selectedIds.value = records.map(r => r.id); },
    checkboxChange: ({ records }) => { selectedIds.value = records.map(r => r.id); },
  },
  showSearchForm: false,
});

// 搜索抽屉
const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 500,
  onCancel: () => searchDrawerApi.close(),
});

// 查询表单
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
    .filter((v) => v.isSearch)
    .map((v) => {
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

// 重置所有筛选
const resetAllFilters = async () => {
  Object.keys(searchParams).forEach(key => delete searchParams[key]);
  await QueryFormApi.resetFields();
  gridApi.reload();
  searchDrawerApi.close();
};

// 表单提交
async function onSubmit(values, isReset = false) {
  if (isReset) {
    await resetAllFilters();
    return;
  }
  // 用户名作为模糊关键字保留在 searchParams.userName，由 getTableData 在前端过滤
  Object.keys(searchParams).forEach(key => delete searchParams[key]);
  Object.assign(searchParams, values);
  gridApi.reload();
  searchDrawerApi.close();
}

// 清除单个筛选字段
const handleClearField = async (fieldName) => {
  delete searchParams[fieldName];
  const currentFormValues = await QueryFormApi.getValues();
  if (currentFormValues[fieldName] !== undefined) {
    const newFormValues = { ...currentFormValues };
    delete newFormValues[fieldName];
    await QueryFormApi.setValues(newFormValues, false);
  }
  gridApi.reload();
};

// 清空全部筛选
const clearAllFilters = () => {
  Object.keys(searchParams).forEach(key => delete searchParams[key]);
  gridApi.reload();
};

// 快速添加筛选（用于钻取）
const addQuickFilter = (field, value, label) => {
  if (searchParams[field] !== undefined && searchParams[field] === value) {
    // 相同值不重复添加
    return;
  }
  searchParams[field] = value;
  gridApi.reload();
  ElMessage.success(`已添加筛选：${label}`);
};

// 用户点击 → 打开右侧用户详情抽屉
const userDetailDrawerRef = ref(null);
const handleUserClick = async (userId) => {
  if (!userId) return ElMessage.warning('用户ID不存在');
  try {
    const userDetail = await getUserDetail(userId);
    userDetailDrawerRef.value?.open(userDetail);
  } catch (error) {
    console.error('获取用户详情失败', error);
    ElMessage.error('获取用户详情失败');
  }
};

// 活动筛选标签（从 searchParams 派生）
const activeFilters = computed(() => {
  const filters = [];

  if (searchParams.userName) {
    filters.push({ label: `用户：${searchParams.userName}`, field: 'userName' });
  }
  if (searchParams.userId) {
    filters.push({ label: `用户：${getUserNameById(searchParams.userId)}`, field: 'userId' });
  }
  if (searchParams.stationName) {
    filters.push({ label: `场站名称：${searchParams.stationName}`, field: 'stationName' });
  }
  if (searchParams.stationId) {
    filters.push({ label: `场站ID：${searchParams.stationId}`, field: 'stationId' });
  }
  if (searchParams.status) {
    filters.push({ label: `推送状态：${searchParams.status}`, field: 'status' });
  }
  if (searchParams.pushResult) {
    filters.push({ label: `推送结果：${searchParams.pushResult}`, field: 'pushResult' });
  }
  if (searchParams.pushTime && Array.isArray(searchParams.pushTime)) {
    const start = searchParams.pushTime[0]?.substring(0, 10) || '';
    const end = searchParams.pushTime[1]?.substring(0, 10) || '';
    filters.push({ label: `推送时间：${start} 至 ${end}`, field: 'pushTime' });
  }

  return filters;
});

// 详情抽屉
const detailDrawerRef = ref(null);
const currentDetail = ref({});
const openDetail = (row) => {
  currentDetail.value = row;
  detailDrawerRef.value.open();
};

// 空位信息钻取：根据 spaceInfo 文本在该场站车位列表中匹配出对应车位
const spaceDetailLoading = ref(false);
const spaceDetailContext = reactive({ stationName: '', spaceInfo: '' });
const spaceDetail = ref(null);
const spaceMatchHint = ref('');

// 从 "A 区 10 号车位空位" 这类描述里提取出位置关键字（如 "A 区 10 号"）
const extractLocationKey = (text) => {
  if (!text) return '';
  const m = String(text).match(/^([A-Za-z]\s*区\s*\d+\s*号)/);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
};

// 文本归一化：去掉所有空白后比较，绕开 “A 区 10 号” / “A区10号” 这类空格差异
const normalizeText = (text) => String(text || '').replace(/\s+/g, '');

const openSpaceDetail = async (row) => {
  spaceDetailContext.stationName = row.stationName || `场站${row.stationId}`;
  spaceDetailContext.spaceInfo = row.spaceInfo || '';
  spaceDetail.value = null;
  spaceMatchHint.value = '';
  spaceDetailDrawerApi.open();
  if (!row.stationId) {
    spaceMatchHint.value = '该推送未关联场站，无法查询车位';
    return;
  }
  spaceDetailLoading.value = true;
  try {
    const list = await getParkingSpacesByStation(row.stationId);
    const locKey = extractLocationKey(row.spaceInfo);
    const infoNorm = normalizeText(row.spaceInfo);
    // 优先按 location 精确（去空格）匹配，其次按 spaceNo 命中，最后按 spaceInfo 包含 location 命中
    let match = null;
    if (locKey) {
      const locKeyNorm = normalizeText(locKey);
      match = list.find(s => normalizeText(s.location) === locKeyNorm)
           || list.find(s => infoNorm.includes(normalizeText(s.location || '')) && s.location)
           || list.find(s => infoNorm.includes(normalizeText(s.spaceNo || '')) && s.spaceNo);
    }
    if (match) {
      spaceDetail.value = match;
    } else if (list.length === 0) {
      spaceMatchHint.value = '该场站暂无车位数据';
    } else {
      spaceMatchHint.value = `未在该场站车位列表中匹配到「${row.spaceInfo}」对应的具体车位`;
    }
  } finally {
    spaceDetailLoading.value = false;
  }
};

const [SpaceDetailDrawer, spaceDetailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 500,
  onCancel: () => spaceDetailDrawerApi.close(),
});

// 单条推送
const handlePush = (row) => {
  currentPushRow = row;
  singlePushVisible.value = true;
};

const confirmSinglePush = async () => {
  const loading = ElLoading.service({ text: '推送中...' });
  try {
    await pushSpace({ id: currentPushRow.id });
    ElMessage.success('推送成功');
    singlePushVisible.value = false;
    handleRefresh();
  } catch (error) {
    ElMessage.error(error.message || '推送失败');
  } finally {
    loading.close();
  }
};

// 批量推送
const openBatchPushDialog = () => {
  batchPushVisible.value = true;
};

const confirmBatchPush = async () => {
  const loading = ElLoading.service({ text: '批量推送中...' });
  try {
    await batchPushSpace({ ids: selectedIds.value });
    ElMessage.success('批量推送成功');
    batchPushVisible.value = false;
    selectedIds.value = [];
    handleRefresh();
  } catch (error) {
    ElMessage.error(error.message || '批量推送失败');
  } finally {
    loading.close();
  }
};

// 导出
const handleExport = async () => {
  const loading = ElLoading.service({ text: '导出中...' });
  try {
    // 构建导出参数（同查询参数）
    const exportParams = { ...searchParams };
    if (exportParams.pushTime && Array.isArray(exportParams.pushTime)) {
      exportParams.pushTimeBegin = exportParams.pushTime[0];
      exportParams.pushTimeEnd = exportParams.pushTime[1];
      delete exportParams.pushTime;
    }
    const data = await exportSpacePush(exportParams);
    downloadFileFromBlobPart({ fileName: '空位推送记录.xls', source: data });
    ElMessage.success('导出成功');
  } catch (error) {
    ElMessage.error('导出失败');
  } finally {
    loading.close();
  }
};

// 刷新列表
const handleRefresh = () => {
  gridApi.reload();
};

// 处理图表钻取事件
const handleChartRefresh = (event) => {
  const filters = event.detail || {};

  // 折线图节点：按当天 00:00:00–23:59:59 过滤推送时间
  if (filters.pushDate) {
    const startDate = `${filters.pushDate} 00:00:00`;
    const endDate = `${filters.pushDate} 23:59:59`;
    // 先清掉之前的 pushTime / pushResult / 用户场站等筛选，避免叠加误导
    Object.keys(searchParams).forEach(key => delete searchParams[key]);
    searchParams.pushTime = [startDate, endDate];
    gridApi.reload();
    ElMessage.success(`已筛选 ${filters.pushDate} 的推送记录`);
    return;
  }

  // 计算图表统计区间：近 30 天（含今天 23:59:59），与后端 chartSpacePush 默认窗口对齐
  const buildRecent30 = () => {
    const fmt = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    const end = new Date();
    end.setHours(23, 59, 59, 0);
    const start = new Date();
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return [fmt(start), fmt(end)];
  };

  // 总推送量卡片：限定近 30 天 + status=已推送，与图表区间一致
  if (filters.cardType === 'totalPush') {
    Object.keys(searchParams).forEach(key => delete searchParams[key]);
    searchParams.status = '已推送';
    searchParams.pushTime = buildRecent30();
    gridApi.reload();
    ElMessage.success('已展示近 30 天已推送记录');
    return;
  }

  // 推送成功率卡片：限定近 30 天 + pushResult=成功
  if (filters.cardType === 'successRate') {
    Object.keys(searchParams).forEach(key => delete searchParams[key]);
    searchParams.pushResult = '成功';
    searchParams.pushTime = buildRecent30();
    gridApi.reload();
    ElMessage.success('已筛选近 30 天成功的推送记录');
    return;
  }
};

onMounted(() => {
  fetchAllUsers();
  window.addEventListener('space-push-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('space-push-chart-refresh', handleChartRefresh);
});
</script>

<style scoped lang="scss">
.detail-card { padding: 20px; background-color: #f9fafb; border-radius: 8px; max-height: 70vh; overflow-y: auto; }
.detail-card-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.detail-card-row:last-child { border-bottom: none; }
.detail-row-left { width: 100px; flex-shrink: 0; font-weight: 500; color: #606266; }
.detail-row-right { flex: 1; color: #303133; word-break: break-all; }
</style>

