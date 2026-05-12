<!-- 内部 index.vue - 能耗对比分析表格及交互 -->
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
  getCompareAnalyzePage,
  selectCompareAnalyze,
  compareAnalyze,
  judgeCompareAnalyze,
  locateCompareAnalyze,
  exportCompareAnalyzeExcel,
  getCompareAnalyzeDetail,
  optimizeCompareAnalyze,
  getUserDetail,
} from '#/api/genchuan/industry/industrialPark/energyMgmt/energyAnalyze/compareAnalyze/index.js';
import { useFormSchema, useGridColumns } from './data';
import CompareDetailDrawer from './detail.vue';
import ProblemDetailDrawer from './problemDetail.vue';
import UserDetailDrawer from '#/views/genchuan/industry/chargePark/carService/carGuide/nearStation/table/userDetail.vue';

const props = defineProps({
  secondShow: Boolean,
  arrowShow: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);

const arrowChange = () => {
  emit('arrow-change');
};

const checkedIds = ref([]);
const handleRowCheckboxChange = ({ records }) => {
  checkedIds.value = records.map((item) => item.id);
};
const dataObj = reactive({
  detailObj: {},
  problemObj: {},
  total: 0,
  list: [],
  searchObj: {},
  currentPage: 1,
  pageSize: 10,
});

// 用户映射
const userMap = ref(new Map());
async function fetchUserMappings() {
  try {
    const users = [{ userId: 'admin', userName: '管理员' }, { userId: 'energy_operator', userName: '能耗分析员' }, { userId: 'maintainer', userName: '维护工程师' }];
    users.forEach(user => userMap.value.set(user.userId, user.userName));
  } catch (error) {
    console.error('获取用户数据失败', error);
  }
}
function getUserName(id) { return userMap.value.get(id) || id; }

// 获取表格数据
const getTableData = async (pageObj) => {
  const params = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.searchObj,
  };
  const res = await getCompareAnalyzePage(params);
  let list = res.list || [];
  dataObj.total = res.total;
  dataObj.list = list.map(v => ({
    ...v,
    createTime: formatTimestamp(v.createTime),
    updateTime: formatTimestamp(v.updateTime),
  }));
  return dataObj;
};

// 搜索表单
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
    searchDrawerApi?.close?.();
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
  if (obj.compareName) filters.push({ label: `对比名称：${obj.compareName}`, field: 'compareName' });
  if (obj.compareDim) filters.push({ label: `对比维度：${obj.compareDim}`, field: 'compareDim' });
  if (obj.compareTime && obj.compareTime.length) filters.push({ label: `对比时间：${obj.compareTime[0]} 至 ${obj.compareTime[1]}`, field: 'compareTime' });
  return filters;
});

// 表格组件
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns({ getUserName, showCompareDetail, showProblemDetail, showUserDetail, filterByDim: (dim) => { dataObj.searchObj.compareDim = dim; gridApi.query(); } }),
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
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

function handleRefresh() {
  gridApi.query();
  window.dispatchEvent(new CustomEvent('compare-stats-refresh'));
}

// 选择对比（右侧抽屉）
const selectDrawerRef = ref(null);
const selectForm = reactive({ dim: '', timeRange: '', targets: [] });
const openSelectDrawer = () => {
  selectForm.dim = '';
  selectForm.timeRange = '';
  selectForm.targets = [];
  selectDrawerRef.value?.open();
};
const saveSelectConfig = async () => {
  if (!selectForm.dim || !selectForm.timeRange || !selectForm.targets.length) {
    ElMessage.warning('请完整填写对比维度、时间范围和对比目标');
    return;
  }
  await selectCompareAnalyze({ dim: selectForm.dim, timeRange: selectForm.timeRange, targets: selectForm.targets });
  ElMessage.success('对比配置已保存');
  selectDrawerRef.value?.close();
  handleRefresh();
};

// 批量对比、研判、定位
async function handleBatchCompare() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个对比任务');
  await compareAnalyze({ ids: checkedIds.value });
  ElMessage.success('对比执行成功');
  handleRefresh();
}
async function handleBatchJudge() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个对比任务');
  await judgeCompareAnalyze({ ids: checkedIds.value });
  ElMessage.success('趋势研判完成');
  handleRefresh();
}
async function handleBatchLocate() {
  if (isEmpty(checkedIds.value)) return ElMessage.warning('请至少选择一个对比任务');
  await locateCompareAnalyze({ ids: checkedIds.value });
  ElMessage.success('问题定位完成');
  handleRefresh();
}
async function handleExportSelected() {
  await confirm('确认导出选中的对比数据吗？');
  const data = await exportCompareAnalyzeExcel({ ids: checkedIds.value });
  downloadFileFromBlobPart({ fileName: '能耗对比分析数据.xls', source: data });
  ElMessage.success('导出成功');
}

// 详情抽屉
const detailDrawerRef = ref(null);
async function showCompareDetail(id) {
  const res = await getCompareAnalyzeDetail(id);
  dataObj.detailObj = res;
  detailDrawerRef.value.open();
}
// 问题定位详情抽屉
const problemDrawerRef = ref(null);
function showProblemDetail(problemInfo) {
  dataObj.problemObj = { problem: problemInfo };
  problemDrawerRef.value.open();
}
// 用户详情
const userDetailDrawerRef = ref(null);
async function showUserDetail(userId) {
  if (!userId) return ElMessage.warning('用户ID不存在');
  const userDetail = await getUserDetail(userId);
  userDetailDrawerRef.value?.open(userDetail);
}
// 优化抽屉
const optimizeForm = reactive({ optimizePlan: '' });
let currentOptimizeId = null;
const [OptimizeDrawer, optimizeDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '能耗优化方案',
  onConfirm: async () => {
    if (!optimizeForm.optimizePlan) return ElMessage.warning('请填写优化方案');
    await optimizeCompareAnalyze({ id: currentOptimizeId, optimizePlan: optimizeForm.optimizePlan });
    ElMessage.success('优化方案已提交');
    optimizeDrawerApi.close();
    handleRefresh();
  },
});
const openOptimize = (row) => {
  currentOptimizeId = row.id;
  optimizeForm.optimizePlan = '';
  optimizeDrawerApi.open();
};

// 行操作包装
const handleRowCompare = (row) => compareAnalyze({ ids: [row.id] }).then(() => handleRefresh());
const handleRowJudge = (row) => judgeCompareAnalyze({ ids: [row.id] }).then(() => handleRefresh());
const handleRowLocate = (row) => locateCompareAnalyze({ ids: [row.id] }).then(() => handleRefresh());
const handleRowExport = async (row) => {
  await confirm('确认导出该对比数据吗？');
  const data = await exportCompareAnalyzeExcel({ ids: [row.id] });
  downloadFileFromBlobPart({ fileName: `对比_${row.id}.xls`, source: data });
};

// 图表钻取事件
const handleChartRefresh = (event) => {
  const filters = event.detail;
  if (!filters) {
    dataObj.searchObj = {};
    dataObj.currentPage = 1;
    gridApi.query();
    return;
  }
  if (filters.compareTime) {
    dataObj.searchObj = { compareTime: filters.compareTime };
    dataObj.currentPage = 1;
    gridApi.query();
  }
};

// 筛选维度点击
const filterByDim = (dim) => {
  dataObj.searchObj.compareDim = dim;
  dataObj.currentPage = 1;
  gridApi.query();
};

onMounted(() => {
  fetchUserMappings();
  window.addEventListener('compare-chart-refresh', handleChartRefresh);
});
onUnmounted(() => {
  window.removeEventListener('compare-chart-refresh', handleChartRefresh);
});

const handleSerachShow = () => searchDrawerApi.open();
const handleFullShow = () => screenfull.toggle();

const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 500,
});

// 选择对比抽屉组件
const [SelectDrawer, selectDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, width: 500, title: '选择对比配置',
  onConfirm: saveSelectConfig,
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
          <IconButton content="选择" icon-name="Setting" @click="openSelectDrawer" />
          <IconButton content="对比" icon-name="DataAnalysis" :disabled="isEmpty(checkedIds)" @click="handleBatchCompare" />
          <IconButton content="研判" icon-name="TrendCharts" :disabled="isEmpty(checkedIds)" @click="handleBatchJudge" />
          <IconButton content="定位" icon-name="Location" :disabled="isEmpty(checkedIds)" @click="handleBatchLocate" />
          <IconButton content="导出" icon-name="download" :disabled="isEmpty(checkedIds)" @click="handleExportSelected" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
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
        <el-text @click="showCompareDetail(row.id)" type="primary">{{ row.id }}</el-text>
      </template>
      <template #compare_name="{ row }">
        <el-text @click="showCompareDetail(row.id)" type="primary" style="cursor: pointer">{{ row.compareName }}</el-text>
      </template>
      <template #compare_dim="{ row }">
        <el-tag @click="filterByDim(row.compareDim)" style="cursor: pointer">{{ row.compareDim }}</el-tag>
      </template>
      <template #change_rate="{ row }">
        <span :style="{ color: row.changeRate >= 0 ? '#F56C6C' : '#67C23A' }">{{ row.changeRate >= 0 ? '+' : '' }}{{ row.changeRate }}%</span>
      </template>
      <template #problem="{ row }">
        <el-text v-if="row.problem" @click="showProblemDetail(row.problem)" type="primary" style="cursor: pointer">{{ row.problem }}</el-text>
        <span v-else>-</span>
      </template>
      <template #handle_user="{ row }">
        <el-text v-if="row.handleUser" @click="showUserDetail(row.handleUser)" type="primary" style="cursor: pointer">{{ getUserName(row.handleUser) }}</el-text>
        <span v-else>-</span>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="选择" icon-name="Setting" @click="openSelectDrawer" />
          <IconButton content="对比" icon-name="DataAnalysis" @click="handleRowCompare(row)" />
          <IconButton content="研判" icon-name="TrendCharts" @click="handleRowJudge(row)" />
          <IconButton content="定位" icon-name="Location" @click="handleRowLocate(row)" />
          <IconButton content="导出" icon-name="download" @click="handleRowExport(row)" />
          <IconButton content="查看" icon-name="View" @click="showCompareDetail(row.id)" />
          <IconButton content="优化" icon-name="Edit" @click="openOptimize(row)" />
        </div>
      </template>
    </Grid>

    <SearchDrawer title="搜索">
      <QueryForm class="query-form" />
    </SearchDrawer>

    <CompareDetailDrawer ref="detailDrawerRef" :detail-obj="dataObj.detailObj" title="对比详情" />
    <ProblemDetailDrawer ref="problemDrawerRef" :problem-obj="dataObj.problemObj" />
    <UserDetailDrawer ref="userDetailDrawerRef" />

    <SelectDrawer>
      <el-form :model="selectForm" label-width="100px">
        <el-form-item label="对比维度" required>
          <el-select v-model="selectForm.dim" placeholder="请选择">
            <el-option label="同比" value="同比" />
            <el-option label="环比" value="环比" />
            <el-option label="区域间" value="区域间" />
            <el-option label="设备间" value="设备间" />
          </el-select>
        </el-form-item>
        <el-form-item label="对比时间范围" required>
          <el-date-picker v-model="selectForm.timeRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="对比目标" required>
          <el-select v-model="selectForm.targets" multiple filterable allow-create default-first-option placeholder="请选择区域或设备">
            <el-option label="一号楼办公区" value="一号楼办公区" />
            <el-option label="二号楼研发区" value="二号楼研发区" />
            <el-option label="三号楼生产区" value="三号楼生产区" />
          </el-select>
        </el-form-item>
      </el-form>
    </SelectDrawer>

    <OptimizeDrawer>
      <el-form :model="optimizeForm" label-width="100px">
        <el-form-item label="优化方案" required>
          <el-input v-model="optimizeForm.optimizePlan" type="textarea" rows="4" placeholder="请输入能耗优化方案" />
        </el-form-item>
      </el-form>
    </OptimizeDrawer>
  </div>
</template>
