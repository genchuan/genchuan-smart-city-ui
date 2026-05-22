<script setup>
import { reactive, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import {
  dataList,
  getWorkHomePage,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/workHome/data.js';
import {
  textObj,
  useFormSchema,
  getColumnsByStatus,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/workHome/form.js';

// 时间戳格式化
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

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// ---------- 筛选参数 ----------
const searchParams = ref({});
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
});

const dataObj = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  loading: false,
});

// 外部传入的筛选条件（用于图表联动）
const externalFilters = ref({});

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      ...externalFilters.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    // 处理时间范围
    if (params.dateRange && Array.isArray(params.dateRange) && params.dateRange.length === 2) {
      params.startTime = `${params.dateRange[0]} 00:00:00`;
      params.endTime = `${params.dateRange[1]} 23:59:59`;
      delete params.dateRange;
    }
    const res = await getWorkHomePage(params);
    dataObj.total = res.total;
    // ========== 修改点1：为每行数据添加唯一标识 _rowKey ==========
    dataObj.list = (res.list || []).map((item, idx) => ({
      ...item,
      _rowKey: `${item.id}_${idx}_${Date.now()}` // 保证同一页面内绝对唯一
    }));
  } catch (error) {
    console.error('获取数据失败:', error);
    const mockData = dataList();
    dataObj.total = mockData.length;
    // ========== 修改点2：mock数据也添加唯一标识 ==========
    dataObj.list = mockData.map((item, idx) => ({
      ...item,
      _rowKey: `${item.id}_${idx}_mock`
    }));
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
  externalFilters.value = {};
  drawerApi.close();
  gridApi.reload();
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

// ========== 修改点3：将 keyField 改为 _rowKey ==========
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: getColumnsByStatus(),
    keepSource: true,
    proxyConfig: { ajax: { query: getTableData } },
    rowConfig: {
      keyField: '_rowKey',   // 使用唯一标识字段，不再使用重复的 id
      isHover: true,
    },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  showSearchForm: false,
});

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

// 暴露方法供父组件调用（图表联动筛选）
function setExternalFilters(filters) {
  externalFilters.value = { ...filters };
  gridApi.reload();
}
function clearExternalFilters() {
  externalFilters.value = {};
  gridApi.reload();
}

defineExpose({ setExternalFilters, clearExternalFilters, handleFilterTagClick: setExternalFilters });
</script>

<template>
  <div class="tools-table-new">
    <Drawer title="筛选">
      <QueryForm />
    </Drawer>
    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton content="重置" icon-name="Refresh" @click="handleReset" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'"
                      :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <span style="width: 30px; display: inline-block;"></span>
        </div>
      </template>

      <template #recordType="{ row }">
        <el-tag>{{ row.recordType }}</el-tag>
      </template>
      <template #createTime="{ row }">
        <el-text>{{ formatTimestamp(row.createTime) }}</el-text>
      </template>
    </Grid>
  </div>
</template>
