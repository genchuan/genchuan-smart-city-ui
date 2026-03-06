<!-- index.vue 政务报表生成主页面 -->
<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

import ReportDetailDrawer from '#/views/report/park/gov/generate/detail.vue';

import {
  dataList,
  textObj,
  useFormSchema,
  useGridColumns,
  getMaxId,
  generateReportNo,
  areaList,
  templateList,
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);

// 右侧筛选抽屉
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  async onOpenChange() {},
});

const searchParams = ref({});

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  handleReset: onReset,
  layout: 'horizontal',
  schema: useFormSchema().map((v) => ({ ...v, rules: undefined })),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询', type: 'primary' },
  resetButtonOptions: { content: '重置' },
});

function onSubmit(values) {
  searchParams.value = { ...values };
  if (values.time_range && Array.isArray(values.time_range) && values.time_range.length === 2) {
    searchParams.value.start_date = values.time_range[0];
    searchParams.value.end_date = values.time_range[1];
  }
  drawerApi.close();
  gridApi.query();
}

function onReset() {
  searchParams.value = {};
  queryFormApi.resetForm();
  gridApi.query();
}

function handleRefresh() {
  gridApi.query();
}

// ---------- 导出 ----------
async function handleExport() {
  if (reportObj.list.length === 0) {
    ElMessage.warning('没有数据可导出');
    return;
  }
  try {
    const loadingInstance = ElLoading.service({ text: '正在导出Excel...' });
    await exportToExcel(reportObj.list, textObj.excelName, textObj.excelAllName);
    loadingInstance.close();
    ElMessage.success('导出成功');
  } catch (error) {
    loadingInstance?.close();
    ElMessage.error('导出失败');
  }
}

async function handleExportAll() {
  let filteredList = getFilteredList();
  if (filteredList.length === 0) {
    ElMessage.warning('没有数据可导出');
    return;
  }
  try {
    const loadingInstance = ElLoading.service({ text: '正在导出全部数据...' });
    await exportToExcel(filteredList, `${textObj.excelName}_全部`, `${textObj.excelName}_全部.xlsx`);
    loadingInstance.close();
    ElMessage.success('导出成功');
  } catch (error) {
    loadingInstance?.close();
    ElMessage.error('导出失败');
  }
}

async function handleExportSelected() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择要导出的报表');
    return;
  }
  const selectedRows = reportObj.list.filter(row => checkedIds.value.includes(row.id));
  try {
    const loadingInstance = ElLoading.service({ text: '正在导出选中数据...' });
    await exportToExcel(selectedRows, `${textObj.excelName}_选中`, `${textObj.excelName}_选中.xlsx`);
    loadingInstance.close();
    ElMessage.success('导出成功');
  } catch (error) {
    loadingInstance?.close();
    ElMessage.error('导出失败');
  }
}

async function handleExportRow(row) {
  try {
    const loadingInstance = ElLoading.service({ text: '正在导出...' });
    await exportToExcel([row], `${row.template_name}-${row.report_no}`, `${row.template_name}-${row.report_no}.xlsx`);
    loadingInstance.close();
    ElMessage.success('导出成功');
  } catch (error) {
    loadingInstance?.close();
    ElMessage.error('导出失败');
  }
}

// ---------- 上报 ----------
async function handleUpload(row) {
  try {
    await confirm(textObj.uploadConfirm);
    const loadingInstance = ElLoading.service({ text: '正在上报...' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = reportObj.apilist.findIndex(v => v.id === row.id);
    if (index !== -1) {
      reportObj.apilist[index] = {
        ...reportObj.apilist[index],
        upload_status: '已上报',
        generate_time: getCurrentTime()
      };
      ElMessage.success('上报成功');
      handleRefresh();
    }
    loadingInstance.close();
  } catch {
    // 用户取消
  }
}

async function handleUploadBatch() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请先选择要上报的报表');
    return;
  }
  try {
    await confirm(`确定要将选中的 ${checkedIds.value.length} 个报表上报到政务系统吗？`);
    const loadingInstance = ElLoading.service({ text: '正在批量上报...' });
    reportObj.apilist = reportObj.apilist.map(item => {
      if (checkedIds.value.includes(item.id)) {
        return {
          ...item,
          upload_status: '已上报',
          generate_time: getCurrentTime()
        };
      }
      return item;
    });
    checkedIds.value = [];
    handleRefresh();
    loadingInstance.close();
    ElMessage.success(`成功上报 ${checkedIds.value.length} 个报表`);
  } catch {
    // 用户取消
  }
}

// ---------- 生成报表（调用详情抽屉内嵌生成功能）----------
const reportDetailDrawerRef = ref(null);

async function handleGenerate() {
  // 直接调用详情抽屉暴露的方法，打开内嵌的生成抽屉
  reportDetailDrawerRef.value?.openGenerateDrawer();
}

// 生成抽屉提交回调
async function handleGenerateSubmit(formData) {
  const loadingInstance = ElLoading.service({ text: '正在生成报表...' });
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newId = getMaxId() + 1;
    const newReportNo = generateReportNo();
    const currentTime = getCurrentTime();

    const areaInfo = areaList().find((item) => item.value === formData.area_code);
    const startDate = formData.start_date || currentTime.split(' ')[0];
    const endDate = formData.end_date || currentTime.split(' ')[0];

    const newData = {
      id: newId,
      report_no: newReportNo,
      template_name: formData.template_name,
      area_name: areaInfo?.area_name || '未知',
      area_code: formData.area_code,
      stat_period: formData.stat_period,
      start_date: startDate,
      end_date: endDate,
      data_content: generateMockData(formData.template_name),
      report_status: '已生成',
      upload_status: '未上报',
      generate_time: currentTime,
      operator: '当前用户',
    };

    reportObj.apilist.unshift(newData);
    activeName.value = '全部报表';
    await gridApi.query();

    setTimeout(() => {
      const table = gridApi.grid;
      if (table) {
        table.setCurrentRow(newData);
        table.scrollToRow(newData);
      }
    }, 50);

    ElMessage.success('政务报表生成成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('生成失败');
  } finally {
    loadingInstance.close();
  }
}

function generateMockData(templateName) {
  const mockData = {
    '市级停车场运营日报': {
      total_entry: Math.floor(Math.random() * 1000) + 800,
      total_income: Math.floor(Math.random() * 20000) + 15000,
      order_count: Math.floor(Math.random() * 1000) + 800,
      avg_utilization: `${Math.floor(Math.random() * 20) + 70}%`,
      peak_hours: ['08:00-10:00', '17:00-19:00'],
      complaint_count: Math.floor(Math.random() * 5)
    },
    '区域停车设施统计月报': {
      total_spaces: Math.floor(Math.random() * 2000) + 1000,
      free_spaces: Math.floor(Math.random() * 500) + 100,
      turnover_rate: (Math.random() * 2 + 3).toFixed(1),
      avg_utilization: `${Math.floor(Math.random() * 25) + 70}%`,
      maintenance_count: Math.floor(Math.random() * 20) + 5
    },
    '政务停车场监管日报': {
      compliance_rate: `${Math.floor(Math.random() * 5) + 95}%`,
      complaint_count: Math.floor(Math.random() * 10),
      accident_count: Math.floor(Math.random() * 3),
      inspection_completed: Math.floor(Math.random() * 100) + 20,
      inspection_rate: '100%'
    },
    '节假日停车预测报告': {
      predicted_entry: Math.floor(Math.random() * 10000) + 5000,
      predicted_income: Math.floor(Math.random() * 300000) + 150000,
      congestion_index: (Math.random() * 4 + 5).toFixed(1),
      peak_days: ['2026-02-12', '2026-02-15'],
      recommendations: ['增加临时车位', '延长营业时间']
    },
    '小区停车场使用周报': {
      owner_usage_rate: `${Math.floor(Math.random() * 20) + 70}%`,
      visitor_ratio: `${Math.floor(Math.random() * 20) + 20}%`,
      avg_duration: `${Math.floor(Math.random() * 4) + 6}小时`,
      complaint_count: Math.floor(Math.random() * 10),
      satisfaction_rate: `${Math.floor(Math.random() * 10) + 90}%`
    }
  };
  return mockData[templateName] || mockData['市级停车场运营日报'];
}

const getCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// ---------- 列表数据管理 ----------
const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

const reportObj = reactive({
  totalShow: false,
  detailObj: {},
  total: dataList().length,
  currentPage: 1,
  pageSize: 10,
  apilist: dataList(),
  list: [],
});

function getFilteredList() {
  let filteredList = reportObj.apilist;

  if (activeName.value === '今日生成') {
    filteredList = filteredList.filter((v) => v.generate_time.includes('2026-02-05'));
  } else if (activeName.value === '待上报') {
    filteredList = filteredList.filter((v) => v.upload_status === '未上报' || v.upload_status === '待上报');
  } else if (activeName.value === '已上报') {
    filteredList = filteredList.filter((v) => v.upload_status === '已上报');
  } else if (activeName.value === '运营统计') {
    filteredList = filteredList.filter((v) => v.template_name.includes('运营'));
  }

  if (searchParams.value.template_name) {
    filteredList = filteredList.filter((v) => v.template_name === searchParams.value.template_name);
  }
  if (searchParams.value.area_code) {
    filteredList = filteredList.filter((v) => v.area_code === searchParams.value.area_code);
  }
  if (searchParams.value.stat_period) {
    filteredList = filteredList.filter((v) => v.stat_period === searchParams.value.stat_period);
  }
  if (searchParams.value.report_status) {
    filteredList = filteredList.filter((v) => v.report_status === searchParams.value.report_status);
  }
  if (searchParams.value.upload_status) {
    filteredList = filteredList.filter((v) => v.upload_status === searchParams.value.upload_status);
  }
  if (searchParams.value.start_date && searchParams.value.end_date) {
    filteredList = filteredList.filter(
      (v) => v.start_date >= searchParams.value.start_date && v.end_date <= searchParams.value.end_date,
    );
  }

  return filteredList;
}

const getTableData = (pageObj) => {
  const { page } = pageObj;
  const filteredList = getFilteredList();
  reportObj.total = filteredList.length;
  reportObj.list = filteredList.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize);
  return reportObj;
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: reportObj,
    toolbarConfig: { 'class-name': 'common-tool-bar-config', refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

// ---------- 标签页 ----------
const activeName = ref('今日生成');
const tabsData = ref([
  { label: '今日生成' },
  { label: '待上报' },
  { label: '已上报' },
  { label: '运营统计' },
  { label: '全部报表' },
]);

const createLabel = (item) => {
  const filteredList = getFilteredList();
  let count = 0;
  if (item.label === '今日生成') {
    count = filteredList.filter((v) => v.generate_time.includes('2026-02-05')).length;
  } else if (item.label === '待上报') {
    count = filteredList.filter((v) => v.upload_status === '未上报' || v.upload_status === '待上报').length;
  } else if (item.label === '已上报') {
    count = filteredList.filter((v) => v.upload_status === '已上报').length;
  } else if (item.label === '运营统计') {
    count = filteredList.filter((v) => v.template_name.includes('运营')).length;
  } else if (item.label === '全部报表') {
    count = filteredList.length;
  }
  return `${item.label}(${count})`;
};

const handleClick = () => {
  gridApi.query();
};

// ---------- 详情抽屉 ----------
const handleOpenDetail = (row) => {
  reportObj.detailObj = row;
  reportDetailDrawerRef.value.open();
};
const handleReportNoClick = (report) => handleOpenDetail(report);
const handleAreaClick = (report) => {
  searchParams.value = { ...searchParams.value, area_code: report.area_code };
  gridApi.query();
  ElMessage.info(`已筛选区域: ${report.area_name}`);
};

// ---------- 辅助函数 ----------
const getTimeRangeDisplay = (row) => {
  return row.start_date && row.end_date ? `${row.start_date} 至 ${row.end_date}` : '-';
};

// ---------- 权限（模拟） ----------
const hasGeneratePermission = computed(() => true);
const hasExportPermission = computed(() => true);
const hasUploadPermission = computed(() => true);

const handleSerachShow = () => drawerApi.open();
const handleFullShow = () => screenfull.toggle();
const arrowChange = () => emit('arrow-change');
const changeTotalShow = () => (reportObj.totalShow = !reportObj.totalShow);
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 详情抽屉（内含生成报表抽屉） -->
    <ReportDetailDrawer
      ref="reportDetailDrawerRef"
      :detail-obj="reportObj.detailObj"
      :title="`报表详情 - ${reportObj.detailObj.template_name}`"
      @report-no-click="handleReportNoClick"
      @area-click="handleAreaClick"
      @generate-submit="handleGenerateSubmit"
    />

    <!-- 右侧筛选抽屉 -->
    <Drawer title="筛选">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 主表格 -->
    <Grid>
      <!-- 二级标签 -->
      <template #table-title>
        <div class="tabel-tabs">
          <div v-if="props.secondShow">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>
        </div>
      </template>

      <!-- 工具栏右侧按钮组 -->
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <!-- 生成按钮：调用详情抽屉的内嵌生成抽屉 -->
          <IconButton
            content="生成"
            icon-name="Plus"
            :disabled="!hasGeneratePermission"
            @click="handleGenerate"
          />

          <!-- 导出下拉菜单 -->
          <ElDropdown
            trigger="click"
            placement="bottom"
            @command="(command) => {
              if (command === 'excel-current') handleExport();
              else if (command === 'excel-all') handleExportAll();
              else if (command === 'excel-selected') handleExportSelected();
            }"
          >
            <IconButton
              content="导出"
              icon-name="Download"
              :disabled="!hasExportPermission || reportObj.list.length === 0"
            />
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem divided>当前页</ElDropdownItem>
                <ElDropdownItem command="excel-current">导出Excel</ElDropdownItem>
                <ElDropdownItem divided>全部数据</ElDropdownItem>
                <ElDropdownItem command="excel-all">导出Excel(全部)</ElDropdownItem>
                <ElDropdownItem divided>选中数据</ElDropdownItem>
                <ElDropdownItem command="excel-selected" :disabled="checkedIds.length === 0">
                  导出Excel(选中)
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>

          <IconButton content="筛选" icon-name="Search" @click="handleSerachShow" />
          <IconButton
            content="批量上报"
            icon-name="Upload"
            color="#13ce66"
            :disabled="!hasUploadPermission || checkedIds.length === 0"
            @click="handleUploadBatch"
          />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
          <IconButton content="刷新" icon-name="Refresh" @click="handleRefresh" />
        </div>
      </template>

      <!-- 表格列自定义渲染（与原始一致）... -->
      <template #report_no="{ row }">
        <el-text @click="handleReportNoClick(row)" class="common-align cursor-pointer" type="primary">
          {{ row.report_no }}
        </el-text>
      </template>
      <template #template_name="{ row }">
        <el-text @click="handleOpenDetail(row)" class="common-align cursor-pointer" type="primary">
          {{ row.template_name }}
        </el-text>
      </template>
      <template #area_name="{ row }">
        <el-tag type="success" size="small" class="cursor-pointer" @click="handleAreaClick(row)">
          {{ row.area_name }}
        </el-tag>
      </template>
      <template #stat_period="{ row }">
        <el-tag
          :type="
            row.stat_period === '日'
              ? 'info'
              : row.stat_period === '周'
                ? 'warning'
                : row.stat_period === '月'
                  ? 'primary'
                  : 'success'
          "
          size="small"
        >
          {{ row.stat_period }}
        </el-tag>
      </template>
      <template #time_range="{ row }">
        <el-text size="small">{{ getTimeRangeDisplay(row) }}</el-text>
      </template>
      <template #report_status="{ row }">
        <el-tag
          :type="
            row.report_status === '已生成' ? 'success' : row.report_status === '生成中' ? 'warning' : 'danger'
          "
          size="small"
        >
          {{ row.report_status }}
        </el-tag>
      </template>
      <template #upload_status="{ row }">
        <el-tag
          :type="
            row.upload_status === '已上报' ? 'success' : row.upload_status === '待上报' ? 'warning' : 'info'
          "
          size="small"
        >
          {{ row.upload_status }}
        </el-tag>
      </template>
      <template #generate_time="{ row }">
        <el-text size="small">{{ row.generate_time }}</el-text>
      </template>

      <!-- 操作列按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton content="导出" icon-name="Download" @click="() => handleExportRow(row)" />
          <IconButton
            v-if="row.upload_status !== '已上报'"
            content="上报"
            icon-name="Upload"
            color="#13ce66"
            :disabled="!hasUploadPermission"
            @click="() => handleUpload(row)"
          />
          <IconButton v-else content="已上报" icon-name="Upload" color="#13ce66" @click="() => ElMessage.info('该报表已上报')" />
        </div>
      </template>

      <!-- 底部统计栏 -->
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!reportObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="reportObj.totalShow"><ArrowUp /></el-icon>
          <span>
            本页统计：报表数{{ reportObj.list.length }}; 已上报:
            {{ reportObj.list.filter((v) => v.upload_status === '已上报').length }}; 待上报:
            {{ reportObj.list.filter((v) => v.upload_status !== '已上报').length }}; 今日生成:
            {{ reportObj.list.filter((v) => v.generate_time.includes('2026-02-05')).length }};
          </span>
        </div>
        <div class="common-total-bottom" v-if="reportObj.totalShow">
          <span> 全部统计：{{ textObj.total }} </span>
          <span class="ml-4">选中：{{ checkedIds.length }} 个报表</span>
        </div>
      </template>
    </Grid>
  </div>
</template>
