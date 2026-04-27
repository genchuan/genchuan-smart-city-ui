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
        <el-text @click="handleUserClick(row.userId, row.userName)" type="primary" style="cursor: pointer">
          {{ row.userName || '-' }}
        </el-text>
      </template>
      <template #stationName="{ row }">
        <el-text @click="addQuickFilter('stationId', row.stationId, `场站ID: ${row.stationId}`)" type="primary" style="cursor: pointer">
          {{ row.stationName || '-' }}
        </el-text>
      </template>
      <template #spaceInfo="{ row }">
        <el-text @click="addQuickFilter('spaceId', row.spaceId, `车位ID: ${row.spaceId}`)" type="primary" style="cursor: pointer">
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
          :type="row.pushResult === '成功' ? 'success' : 'danger'"
          @click="addQuickFilter('pushResult', row.pushResult, `推送结果: ${row.pushResult}`)"
          style="cursor: pointer"
        >
          {{ row.pushResult || '-' }}
        </el-tag>
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
} from '#/api/genchuan/industry/chargePark/carService/carGuide/spacePush/index.js';
import { useFormSchema, useGridColumns } from './data';
import DetailDrawer from './detail.vue';

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

  // 处理推送时间范围
  if (searchParams.pushTime && Array.isArray(searchParams.pushTime)) {
    params.pushTimeBegin = searchParams.pushTime[0];
    params.pushTimeEnd = searchParams.pushTime[1];
    delete params.pushTime;
  }

  // 处理用户ID
  if (params.userId) {
    params.userId = Number(params.userId);
  }
  if (params.stationId) {
    params.stationId = Number(params.stationId);
  }

  // 清理空值
  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === null || params[key] === '') {
      delete params[key];
    }
  });

  const res = await getSpacePushPage(params);
  if (res.list && res.list.length) {
    res.list = res.list.map(item => ({
      ...item,
      pushTime: formatTimestamp(item.pushTime),
      feedbackTime: formatTimestamp(item.feedbackTime),
      createTime: formatTimestamp(item.createTime),
      updateTime: formatTimestamp(item.updateTime),
      // 补充场站名称（如果后端未返回，用ID代替）
      stationName: item.stationName || `场站${item.stationId}`,
    }));
  }
  return { total: res.total, list: res.list };
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

  const formValues = { ...values };

  // 用户名转用户ID
  if (formValues.userName) {
    const userId = getUserIdByUserName(formValues.userName);
    if (userId) {
      formValues.userId = userId;
    } else {
      ElMessage.warning(`未找到用户“${formValues.userName}”，请检查用户名`);
      return;
    }
    delete formValues.userName;
  }

  // 清空现有搜索参数，然后赋新值
  Object.keys(searchParams).forEach(key => delete searchParams[key]);
  Object.assign(searchParams, formValues);

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

// 用户点击钻取
const handleUserClick = (userId, userName) => {
  if (!userId) return;
  addQuickFilter('userId', userId, `用户：${userName || getUserNameById(userId)}`);
};

// 活动筛选标签（从 searchParams 派生）
const activeFilters = computed(() => {
  const filters = [];

  if (searchParams.userId) {
    const userName = getUserNameById(searchParams.userId);
    filters.push({ label: `用户：${userName}`, field: 'userId' });
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
  if (searchParams.spaceId) {
    filters.push({ label: `车位ID：${searchParams.spaceId}`, field: 'spaceId' });
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
  const filters = event.detail;

  if (filters.pushDate) {
    // 将日期转换为当天时间范围
    const startDate = `${filters.pushDate} 00:00:00`;
    const endDate = `${filters.pushDate} 23:59:59`;
    addQuickFilter('pushTime', [startDate, endDate], `推送日期：${filters.pushDate}`);
  } else if (filters.cardType === 'totalPush') {
    // 点击总推送量卡片：清空所有筛选，展示全部数据
    clearAllFilters();
    ElMessage.info('已显示全部推送记录');
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

