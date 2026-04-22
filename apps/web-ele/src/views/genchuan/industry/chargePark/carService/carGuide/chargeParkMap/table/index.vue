<!-- chargeParkMap/table/index.vue -->
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
      <template #queryLocation="{ row }">
        <el-text @click="locateAddress(row.queryLocation)" type="primary" style="cursor: pointer">
          {{ row.queryLocation || '-' }}
        </el-text>
      </template>
      <template #resultCount="{ row }">
        <el-text @click="addQuickFilter('resultCount', row.resultCount, `结果数: ${row.resultCount}`)" type="primary" style="cursor: pointer">
          {{ row.resultCount }}
        </el-text>
      </template>
      <template #responseDuration="{ row }">
        <el-text @click="addQuickFilter('responseDuration', row.responseDuration, `响应时长: ${row.responseDuration}ms`)" type="primary" style="cursor: pointer">
          {{ row.responseDuration }} ms
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="导航" icon-name="location" @click="handleNavigate(row)" />
          <IconButton content="预订" icon-name="calendar" @click="handleReserve(row)" />
        </div>
      </template>
    </Grid>

    <!-- 搜索抽屉 -->
    <SearchDrawer title="搜索">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <!-- 详情抽屉 -->
    <DetailDrawer ref="detailDrawerRef" :detail-data="currentDetail" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage, ElLoading } from 'element-plus';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import {
  getChargeParkMapPage,
  navigateChargeParkMap,
  reserveChargeParkMap,
  getUserList,
} from '#/api/genchuan/industry/chargePark/carService/carGuide/chargeParkMap/index.js';
import { useFormSchema, useGridColumns } from './data';
import DetailDrawer from './detail.vue';

const props = defineProps({ secondShow: Boolean });
const emit = defineEmits(['refreshChart']);

// ==================== 用户映射 ====================
const allUserMap = ref(new Map());
const userNameToIdMap = ref(new Map());

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
  return allUserMap.value.get(userId) || userId;
}

// ==================== 搜索参数管理 ====================
const searchParams = reactive({});

const getTableData = async ({ page }) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...searchParams,
  };

  if (searchParams.queryTime && Array.isArray(searchParams.queryTime)) {
    params.queryTimeBegin = searchParams.queryTime[0];
    params.queryTimeEnd = searchParams.queryTime[1];
    delete params.queryTime;
  }

  if (searchParams.bounds) {
    params.north = searchParams.bounds.north;
    params.south = searchParams.bounds.south;
    params.east = searchParams.bounds.east;
    params.west = searchParams.bounds.west;
    delete params.bounds;
  }

  if (params.userId) {
    params.userId = Number(params.userId);
  }

  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === null || params[key] === '') {
      delete params[key];
    }
  });

  const res = await getChargeParkMapPage(params);
  if (res.list && res.list.length) {
    res.list = res.list.map(item => ({
      ...item,
      queryTime: formatTimestamp(item.queryTime),
      createTime: formatTimestamp(item.createTime),
      updateTime: formatTimestamp(item.updateTime),
    }));
  }
  return { total: res.total, list: res.list };
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    proxyConfig: { ajax: { query: getTableData } },
    rowConfig: { keyField: 'id', isHover: true },
    toolbarConfig: { refresh: false, search: false },
    showOverflow: true,
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

const resetAllFilters = async () => {
  Object.keys(searchParams).forEach(key => delete searchParams[key]);
  await QueryFormApi.resetFields();
  gridApi.reload();
  searchDrawerApi.close();
};

async function onSubmit(values, isReset = false) {
  if (isReset) {
    await resetAllFilters();
    return;
  }

  const formValues = { ...values };
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

  Object.keys(searchParams).forEach(key => delete searchParams[key]);
  Object.assign(searchParams, formValues);

  gridApi.reload();
  searchDrawerApi.close();
}

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

const clearAllFilters = () => {
  Object.keys(searchParams).forEach(key => delete searchParams[key]);
  gridApi.reload();
};

const addQuickFilter = (field, value, label) => {
  if (searchParams[field] !== undefined) {
    delete searchParams[field];
  }
  searchParams[field] = value;
  gridApi.reload();
  ElMessage.success(`已添加筛选：${label}`);
};

const handleUserClick = (userId, userName) => {
  if (!userId) return;
  addQuickFilter('userId', userId, `用户：${userName || getUserNameById(userId)}`);
};

const activeFilters = computed(() => {
  const filters = [];
  if (searchParams.userId) {
    const userName = getUserNameById(searchParams.userId);
    filters.push({ label: `用户：${userName}`, field: 'userId' });
  }
  if (searchParams.queryLocation) {
    filters.push({ label: `查询位置：${searchParams.queryLocation}`, field: 'queryLocation' });
  }
  if (searchParams.queryTime && Array.isArray(searchParams.queryTime)) {
    const start = searchParams.queryTime[0]?.substring(0, 10) || '';
    const end = searchParams.queryTime[1]?.substring(0, 10) || '';
    filters.push({ label: `查询时间：${start} 至 ${end}`, field: 'queryTime' });
  }
  if (searchParams.resultCount) {
    filters.push({ label: `结果数：${searchParams.resultCount}`, field: 'resultCount' });
  }
  if (searchParams.responseDuration) {
    filters.push({ label: `响应时长：${searchParams.responseDuration}ms`, field: 'responseDuration' });
  }
  if (searchParams.stationId) {
    filters.push({ label: `场站ID：${searchParams.stationId}`, field: 'stationId' });
  }
  if (searchParams.bounds) {
    filters.push({ label: '区域筛选（地图范围）', field: 'bounds' });
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

// ==================== 导航功能（终极兼容版）====================
const handleNavigate = async (row, targetId = null) => {
  const loading = ElLoading.service({ text: '正在获取导航地址...' });
  try {
    const params = { id: row.id };
    if (targetId) params.targetId = targetId;
    const res = await navigateChargeParkMap(params);

    // 兼容多种返回格式
    let url = null;
    if (typeof res === 'string') {
      url = res;
    } else if (res && typeof res === 'object') {
      url = res.data || res.url || null;
    }

    if (url && typeof url === 'string' && url.trim()) {
      // 确保是完整 URL
      const finalUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(finalUrl, '_blank');
      ElMessage.success('已打开导航');
    } else {
      console.error('导航地址无效:', res);
      ElMessage.warning('未获取到有效的导航地址');
    }
  } catch (error) {
    console.error('导航失败:', error);
    ElMessage.error('导航失败，请稍后重试');
  } finally {
    loading.close();
  }
};

// ==================== 预订功能（终极兼容版）====================
const handleReserve = async (row, targetId = null) => {
  const loading = ElLoading.service({ text: '正在跳转预约服务...' });
  try {
    const params = { id: row.id };
    if (targetId) params.targetId = targetId;
    const res = await reserveChargeParkMap(params);

    let url = null;
    if (typeof res === 'string') {
      url = res;
    } else if (res && typeof res === 'object') {
      url = res.data || res.url || null;
    }

    if (url && typeof url === 'string' && url.trim()) {
      // 处理相对路径
      const finalUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
      window.open(finalUrl, '_blank');
      ElMessage.success('已打开预订页面');
    } else {
      console.error('预订地址无效:', res);
      ElMessage.warning('未获取到预订页面地址');
    }
  } catch (error) {
    console.error('预订失败:', error);
    ElMessage.error('预订失败，请稍后重试');
  } finally {
    loading.close();
  }
};

const handleRefresh = () => {
  gridApi.reload();
  emit('refreshChart');
};

const locateAddress = (address) => {
  window.dispatchEvent(new CustomEvent('charge-park-map-locate', { detail: address }));
};

const handleChartRefresh = (event) => {
  const filters = event.detail;
  if (filters.stationId) {
    addQuickFilter('stationId', filters.stationId, `场站ID: ${filters.stationId}`);
  }
};

onMounted(() => {
  fetchAllUsers();
  window.addEventListener('charge-park-map-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('charge-park-map-chart-refresh', handleChartRefresh);
});

defineExpose({ handleRefresh });
</script>
