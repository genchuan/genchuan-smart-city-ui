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
} from '#/api/genchuan/industry/chargePark/carService/reverseFindCar/spaceLocation/index.js';
import { useFormSchema, useGridColumns } from './data';
import SpaceLocationDetailDrawer from './detail.vue';

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
  if (dataObj.searchObj.queryTime && Array.isArray(dataObj.searchObj.queryTime)) {
    params.queryTimeBegin = dataObj.searchObj.queryTime[0];
    params.queryTimeEnd = dataObj.searchObj.queryTime[1];
    delete params.queryTime;
  }
  const res = await getSpaceLocationPage(params);
  dataObj.total = res.total;
  dataObj.list = (res.list || []).map(v => ({
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

// 活跃筛选标签
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

// 导航
const handleNavigate = async (row) => {
  try {
    const res = await navigateToSpace({ id: row.id, spaceId: row.spaceId });
    if (res && res.navigateUrl) {
      window.open(res.navigateUrl, '_blank');
      ElMessage.success('正在跳转导航...');
    } else {
      ElMessage.warning('导航地址获取失败');
    }
  } catch (error) {
    console.error('导航失败', error);
    ElMessage.error('导航失败，请稍后重试');
  }
};

// 图表刷新事件
const handleChartRefresh = (event) => {
  const filters = event.detail;
  const newSearchObj = { ...dataObj.searchObj };
  if (filters?.date) {
    newSearchObj.queryTime = [filters.date, filters.date];
  } else if (filters?.locationResult) {
    newSearchObj.locationResult = filters.locationResult;
  }
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
          <!-- 新增展开/收缩按钮 -->
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
      <template #user_name="{ row }">
        <el-text @click="() => handleClearField('userId') || (dataObj.searchObj.userId = row.userId) || gridApi.query()" type="primary" style="cursor: pointer">
          {{ getUserName(row.userId) }}
        </el-text>
      </template>
      <template #plate_no="{ row }">
        <el-text @click="() => handleClearField('plateNo') || (dataObj.searchObj.plateNo = row.plateNo) || gridApi.query()" type="primary" style="cursor: pointer">
          {{ row.plateNo || '-' }}
        </el-text>
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
          <IconButton content="导航" icon-name="location" @click="handleNavigate(row)" />
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)" />
        </div>
      </template>
    </Grid>

    <SearchDrawer title="搜索">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <SpaceLocationDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" title="车位定位详情" />
  </div>
</template>

<script>
// 导出功能单独定义
async function handleExport() {
  const data = await exportSpaceLocationExcel(dataObj.searchObj);
  downloadFileFromBlobPart({ fileName: '车位定位记录.xls', source: data });
}
// 需要在上面导入 exportSpaceLocationExcel
</script>
