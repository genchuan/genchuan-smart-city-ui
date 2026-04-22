<script setup>
import { computed, reactive, ref, watch, nextTick } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { downloadFileFromBlobPart } from '@vben/utils';
import ReportDetailDrawer from './components/reportDetail.vue';
import {
  getMockList,
  getDormCheckReportPage,
  createDormCheckReport,
  exportDormCheckReport,
  getDormCheckReportDetail,
} from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/dormCheckReport/data.js';
import {
  textObj,
  useFormSchema,
  getColumns,
  useGenerateFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/dormCheckReport/form.js';

// 辅助函数：时间戳格式化
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

// 提取日期部分（用于筛选）
const getDateFromTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// ---------- 标签筛选 ----------
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
    timeScale: '报表时间尺度',
    creator: '生成人',
    createTime: '生成时间',
  };
  return map[field] || field;
}

function getTagDisplayText(field, value) {
  if (Array.isArray(value)) return value.join('、');
  return value || '-';
}

// ---------- 抽屉组件 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => drawerApi.close(),
});

const [GenerateDrawer, generateDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => generateDrawerApi.close(),
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

const getTableData = async ({ page }) => {
  dataObj.loading = true;
  try {
    const params = {
      ...searchParams.value,
      pageNo: page.currentPage,
      pageSize: page.pageSize,
    };
    const res = await getDormCheckReportPage(params);
    let filtered = res.list;
    // 应用标签筛选
    Object.entries(tagFilters.value).forEach(([field, filterValue]) => {
      filtered = filtered.filter(item => {
        let itemValue;
        switch (field) {
          case 'timeScale':
            itemValue = item.timeScale;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
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
          case 'timeScale':
            itemValue = item.timeScale;
            break;
          case 'creator':
            itemValue = item.creator;
            break;
          case 'createTime':
            const createDate = item.createTime ? getDateFromTimestamp(item.createTime) : '';
            itemValue = createDate;
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

// 批量导出
async function handleBatchExport() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一个报表');
    return;
  }
  try {
    const loading = ElLoading.service({ text: '正在导出...' });
    try {
      const data = await exportDormCheckReport({ ids: checkedIds.value });
      downloadFileFromBlobPart({ fileName: `${textObj.excelName}.xls`, source: data });
      ElMessage.success('导出成功');
    } finally {
      loading.close();
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
}

// 单行导出
async function handleExport(row) {
  try {
    const loading = ElLoading.service({ text: '正在导出...' });
    try {
      const data = await exportDormCheckReport({ ids: [row.id] });
      downloadFileFromBlobPart({ fileName: `${row.timeScale}_考勤报表_${formatTimestamp(row.statStartTime)}.xls`, source: data });
      ElMessage.success('导出成功');
    } finally {
      loading.close();
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
}

// 生成报表
function handleGenerate() {
  generateFormApi.resetForm();
  generateDrawerApi.open();
}

// 生成表单
const [GenerateForm, generateFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async (values) => {
    const loading = ElLoading.service({ text: '生成报表中...' });
    try {
      const res = await createDormCheckReport(values);
      if (res === true) {
        ElMessage.success('报表生成成功');
        generateDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error('报表生成失败');
      }
    } finally {
      loading.close();
    }
  },
  layout: 'horizontal',
  schema: useGenerateFormSchema(),
  showCollapseButton: false,
  submitButtonOptions: { content: '确认' },
});

// 详情抽屉
const reportDetailDrawerRef = ref(null);
function handleOpenDetail(row) {
  dataObj.detailObj = row;
  reportDetailDrawerRef.value.open();
}

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

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

defineExpose({ handleFilterTagClick, clearFilters });
</script>

<template>
  <div class="park-lot-table-new">
    <ReportDetailDrawer ref="reportDetailDrawerRef" :detail-obj="dataObj.detailObj" @refresh="handleRefresh" />
    <Drawer title="筛选">
      <QueryForm />
    </Drawer>
    <GenerateDrawer :title="textObj.generateText">
      <GenerateForm />
    </GenerateDrawer>
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
          <IconButton content="生成" icon-name="Plus" @click="handleGenerate" />
          <IconButton content="导出" icon-name="download" @click="handleBatchExport" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton content="重置" icon-name="Refresh" @click="handleReset" />
          <IconButton :content="props.arrowShow ? '展开' : '收缩'" :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'" @click="arrowChange" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
          <IconButton :content="showChart ? '隐藏图表' : '显示图表'" icon-name="PieChart" @click="toggleChart" />
        </div>
      </template>

      <!-- 钻取列 -->
      <template #timeScale="{ row }">
        <el-text @click="handleFilterTagClick('timeScale', row.timeScale)" type="primary" style="cursor: pointer;">
          {{ row.timeScale }}
        </el-text>
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
      <template #statStartTime="{ row }">
        <el-text>{{ formatTimestamp(row.statStartTime) }}</el-text>
      </template>
      <template #statEndTime="{ row }">
        <el-text>{{ formatTimestamp(row.statEndTime) }}</el-text>
      </template>
      <template #statFinishTime="{ row }">
        <el-text>{{ formatTimestamp(row.statFinishTime) }}</el-text>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="导出" icon-name="download" @click="handleExport(row)" />
        </div>
      </template>
    </Grid>
  </div>
</template>
