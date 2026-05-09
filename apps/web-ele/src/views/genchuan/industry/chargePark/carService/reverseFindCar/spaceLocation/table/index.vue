<script setup>
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';
import { ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { formatTimestamp } from '#/utils';
import {
  getSpaceLocationPage,
  getSpaceLocationDetail,
  navigateToSpace,
  getUserList,
  getCarByPlateNo,
} from '#/api/genchuan/industry/chargePark/carService/reverseFindCar/spaceLocation/index.js';
// 新增：获取用户详情接口（复用充停地图的API）
import { getUserDetail } from '#/api/genchuan/industry/chargePark/carService/carGuide/chargeParkMap/index.js';
import { useFormSchema, useGridColumns } from './data';
import SpaceLocationDetailDrawer from './detail.vue';
// 新增：用户详情抽屉组件
import UserDetailDrawer from '#/views/genchuan/industry/chargePark/carService/carGuide/chargeParkMap/table/userDetail.vue';
import VehicleDetailDrawer from './vehicleDetail.vue';

// 新增 props 和 emit
const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);

const arrowChange = () => {
  emit('arrow-change');
};

const dataObj = reactive({
  detailObj: {},
  total: 0,
  list: [],
  searchObj: {},
  currentPage: 1,
  pageSize: 10,
});

// ==================== 用户映射 ====================
const userMap = ref(new Map());

async function fetchUserMap() {
  try {
    const users = await getUserList();
    users.forEach(user => userMap.value.set(user.userId, user.userName));
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
}
function getUserName(id) { return userMap.value.get(id) || id; }

// ==================== 获取表格数据 ====================
const getTableData = async (pageObj) => {
  const params = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.searchObj,
  };
  const userNameFilter = (params.userName || '').trim().toLowerCase();
  delete params.userName;
  const res = await getSpaceLocationPage(params);
  let list = res.list || [];
  let total = res.total;
  if (userNameFilter) {
    list = list.filter(v => (userMap.value.get(v.userId) || String(v.userId || '')).toLowerCase().includes(userNameFilter));
    total = list.length;
  }
  dataObj.total = total;
  dataObj.list = list.map(v => ({
    ...v,
    createTime: formatTimestamp(v.createTime),
    updateTime: formatTimestamp(v.updateTime),
    queryTime: formatTimestamp(v.queryTime),
  }));
  return dataObj;
};

// ==================== 搜索表单 ====================
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
  if (obj.userId) filters.push({ label: `用户：${getUserName(obj.userId)}`, field: 'userId' });
  if (obj.plateNo) filters.push({ label: `车牌：${obj.plateNo}`, field: 'plateNo' });
  if (obj.locationResult) filters.push({ label: `定位结果：${obj.locationResult}`, field: 'locationResult' });
  if (obj.queryTime && obj.queryTime.length === 2) {
    filters.push({ label: `查询时间：${obj.queryTime[0]} 至 ${obj.queryTime[1]}`, field: 'queryTime' });
  }
  return filters;
});

// ==================== 表格组件 ====================
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns({ getUserName }),
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
  showSearchForm: false,
});

function handleRefresh() { gridApi.query(); }

// 详情抽屉
const detailDrawerRef = ref(null);
const handleOpenDetail = async (row) => {
  const res = await getSpaceLocationDetail({ id: row.id });
  dataObj.detailObj = res;
  detailDrawerRef.value.open();
};

// 新增：用户详情抽屉
const userDetailDrawerRef = ref(null);
const openUserDetail = async (userId) => {
  if (!userId) {
    ElMessage.warning('用户ID不存在');
    return;
  }
  try {
    const userDetail = await getUserDetail(userId);
    userDetailDrawerRef.value?.open(userDetail);
  } catch (error) {
    console.error('获取用户详情失败', error);
    ElMessage.error('获取用户详情失败');
  }
};

// 车牌点击 → 车辆详情抽屉
const vehicleDetailDrawerRef = ref(null);
const handlePlateClick = async (plateNo) => {
  if (!plateNo) return;
  try {
    const car = await getCarByPlateNo(plateNo);
    if (!car) {
      ElMessage.warning('未查询到该车牌的车辆信息');
      return;
    }
    vehicleDetailDrawerRef.value?.open(car);
  } catch (error) {
    console.error('获取车辆详情失败', error);
    ElMessage.error('获取车辆详情失败');
  }
};

// 浏览器当前位置
let cachedLngLat = null;
const getCurrentLngLat = () => new Promise(resolve => {
  if (cachedLngLat) return resolve(cachedLngLat);
  if (!navigator.geolocation) return resolve(null);
  navigator.geolocation.getCurrentPosition(
    pos => {
      cachedLngLat = `${pos.coords.longitude.toFixed(6)},${pos.coords.latitude.toFixed(6)}`;
      resolve(cachedLngLat);
    },
    () => resolve(null),
    { timeout: 10000, maximumAge: 5 * 60 * 1000, enableHighAccuracy: false }
  );
});

// 导航
const handleNavigate = async (row) => {
  if (row.spaceId == null) {
    ElMessage.warning('该记录定位失败，无车位坐标，无法导航');
    return;
  }
  try {
    const res = await navigateToSpace({ id: row.id, spaceId: row.spaceId });
    let url = typeof res === 'string' ? res : (res?.navigateUrl || res?.data);
    if (!url) {
      ElMessage.warning('该记录无可用的车位坐标，无法导航');
      return;
    }
    const from = await getCurrentLngLat();
    const sep = url.includes('?') ? '&' : '?';
    const extra = (from ? `from=${from}&` : '') + 'src=carservice&coordinate=gaode&callnative=0';
    url = `${url}${sep}${extra}`;
    window.open(url, '_blank');
    ElMessage.success('正在跳转导航...');
  } catch (error) {
    console.error('导航失败', error);
    ElMessage.error('导航失败，请稍后重试');
  }
};

// 计算近 N 天时间区间
const getRecentDaysRange = (days) => {
  const fmt = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  return [fmt(start), fmt(end)];
};

// 图表刷新事件
const handleChartRefresh = async (event) => {
  const filters = event.detail || {};
  if (filters.spaceLocationId) {
    try {
      const res = await getSpaceLocationDetail({ id: filters.spaceLocationId });
      dataObj.detailObj = res || {};
      detailDrawerRef.value?.open();
    } catch (e) {
      console.error('加载车位定位详情失败', e);
      ElMessage.error('详情加载失败');
    }
    return;
  }
  if (filters.totalQueryCount || filters.locationSuccessRate) {
    const next = { queryTime: getRecentDaysRange(7) };
    // 成功率卡片只展示成功定位记录,与卡片语义对齐
    if (filters.locationSuccessRate) next.locationResult = '成功';
    dataObj.searchObj = next;
    dataObj.currentPage = 1;
    gridApi.query();
    return;
  }
  const newSearchObj = { ...dataObj.searchObj };
  if (filters.date) newSearchObj.queryTime = [filters.date, filters.date];
  if (filters.locationResult) newSearchObj.locationResult = filters.locationResult;
  dataObj.searchObj = newSearchObj;
  dataObj.currentPage = 1;
  gridApi.query();
};

onMounted(() => {
  fetchUserMap();
  window.addEventListener('space-location-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('space-location-chart-refresh', handleChartRefresh);
});

const handleSerachShow = () => searchDrawerApi.open();
const handleFullShow = () => screenfull.toggle();

// 搜索抽屉
const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 500,
  onCancel: () => searchDrawerApi.close(),
});

const handleExport = async () => {
  try {
    const PAGE_SIZE = 200;
    let pageNo = 1;
    let list = [];
    while (true) {
      const res = await getSpaceLocationPage({ ...dataObj.searchObj, pageNo, pageSize: PAGE_SIZE });
      const part = res?.list || [];
      list = list.concat(part);
      const total = res?.total ?? list.length;
      if (part.length < PAGE_SIZE || list.length >= total) break;
      pageNo++;
      if (pageNo > 100) break;
    }
    if (!list.length) {
      ElMessage.warning('暂无数据可导出');
      return;
    }
    const XLSX = await import('xlsx');
    const cols = [
      { field: 'id', title: '定位ID' },
      { field: 'userId', title: '用户ID', formatter: (v) => getUserName(v) },
      { field: 'plateNo', title: '车牌号码' },
      { field: 'queryTime', title: '查询时间', formatter: (v) => formatTimestamp(v) },
      { field: 'locationResult', title: '定位结果' },
      { field: 'responseDuration', title: '响应时长(ms)' },
    ];
    const data = list.map(row => {
      const o = {};
      cols.forEach(c => {
        const v = row[c.field];
        o[c.title] = c.formatter ? c.formatter(v) : (v ?? '');
      });
      return o;
    });
    const ws = XLSX.utils.json_to_sheet(data, { header: cols.map(c => c.title) });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '车位定位记录');
    const ts = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    XLSX.writeFile(wb, `车位定位记录_${list.length}条_${ts}.xlsx`);
    ElMessage.success(`导出 ${list.length} 条`);
  } catch (e) {
    console.error('[导出失败]', e);
    ElMessage.error('导出失败');
  }
};
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
        <el-text @click="handleOpenDetail(row)" type="primary">{{ row.id }}</el-text>
      </template>
      <!-- 修改用户列：点击打开用户详情 -->
      <template #user_name="{ row }">
        <el-text @click="openUserDetail(row.userId)" type="primary" style="cursor: pointer">
          {{ getUserName(row.userId) }}
        </el-text>
      </template>
      <template #plate_no="{ row }">
        <el-text v-if="row.plateNo" @click="handlePlateClick(row.plateNo)" type="primary" style="cursor: pointer">
          {{ row.plateNo }}
        </el-text>
        <span v-else>-</span>
      </template>
      <template #location_result="{ row }">
        <el-tag :type="row.locationResult === '成功' ? 'success' : 'danger'" @click="() => handleClearField('locationResult') || (dataObj.searchObj.locationResult = row.locationResult) || gridApi.query()" style="cursor: pointer">
          {{ row.locationResult || '-' }}
        </el-tag>
      </template>
      <template #response_duration="{ row }">
        <el-text @click="() => handleClearField('responseDuration') || (dataObj.searchObj.responseDuration = row.responseDuration) || gridApi.query()" type="primary" style="cursor: pointer">
          {{ row.responseDuration ? `${row.responseDuration}ms` : '-' }}
        </el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton :content="row.spaceId == null ? '定位失败无法导航' : '导航'" icon-name="location" :disabled="row.spaceId == null" @click="handleNavigate(row)" />
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
        </div>
      </template>
    </Grid>

    <SearchDrawer title="搜索">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <SpaceLocationDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" title="车位定位详情" />

    <!-- 新增：用户详情抽屉 -->
    <UserDetailDrawer ref="userDetailDrawerRef" />
    <VehicleDetailDrawer ref="vehicleDetailDrawerRef" />
  </div>
</template>
