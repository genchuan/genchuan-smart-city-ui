<!-- index.vue -->
<script setup>
import { computed, reactive, ref } from 'vue';
import { useVbenDrawer, confirm } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
import { exportToExcel } from '#/utils/excel.js';

// 上报详情抽屉组件
import ReportDetailDrawer from '#/views/report/park/gov/record/detail.vue';

import { dataList, textObj, useFormSchema, useGridColumns, getMaxId } from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change']);

// ---------- 重新上报弹窗配置 ----------
const getTitle = computed(() => textObj.resubmitText);

const formData = ref();
const [ResubmitForm, resubmitFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'templateName',
      label: '模板名称',
      component: 'Select',
      componentProps: {
        options: [
          { label: '停车场日运营报表', value: '停车场日运营报表' },
          { label: '车流高峰分析表', value: '车流高峰分析表' },
        ],
        placeholder: '请选择报表模板',
      },
      rules: 'required',
    },
    {
      fieldName: 'areaCode',
      label: '行政区域',
      component: 'Select',
      componentProps: {
        options: [
          { label: '天河区', value: '440106' },
          { label: '越秀区', value: '440104' },
          { label: '海珠区', value: '440105' },
          { label: '白云区', value: '440111' },
        ],
        placeholder: '请选择区域',
      },
      rules: 'required',
    },
    {
      fieldName: 'statDate',
      label: '统计日期',
      component: 'DatePicker',
      componentProps: {
        type: 'date',
        placeholder: '请选择统计日期',
        valueFormat: 'YYYY-MM-DD',
      },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const [ResubmitDrawer, resubmitDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    resubmitDrawerApi.close();
  },
  onConfirm() {
    // 模拟重新上报成功
    ElMessage.success('重新上报请求已提交，请稍后查看结果');
    resubmitDrawerApi.close();
    handleRefresh();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const row = resubmitDrawerApi.getData();
      formData.value = row;
      // 预填模板名称（如果有）
      await resubmitFormApi.setValues({
        templateName: row?.templateName || '',
      });
    }
  },
});

// ---------- 筛选抽屉配置 ----------
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
  onConfirm() {},
  async onOpenChange() {},
});

// 筛选表单（高级筛选）
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  handleSubmit: onSearchSubmit,
  handleReset: onSearchReset,
  layout: 'horizontal',
  schema: useFormSchema().map((v) => ({ ...v, rules: undefined })), // 移除校验
  showCollapseButton: true,
  submitButtonOptions: { content: '查询', type: 'primary' },
  resetButtonOptions: { content: '重置' },
});

// 快速查询（报表编号/模板名称模糊查询）
const quickKeyword = ref('');

// ---------- 数据源与表格 ----------
const reportObj = reactive({
  totalShow: false,
  detailObj: {},
  apilist: dataList(),
  list: [],
  total: dataList().length,
});

const checkedIds = ref([]);
const activeName = ref('全部'); // 标签页用于状态快速筛选

const tabsData = ref([
  { label: '全部' },
  { label: '待上报' },
  { label: '已上报' },
  { label: '已驳回' },
  { label: '审核通过' },
]);

// 标签页计数（基于当前搜索/筛选结果）
const createLabel = (item) => {
  let filtered = getFilteredList();
  if (item.label !== '全部') {
    filtered = filtered.filter(v => v.uploadStatus === item.label);
  }
  return `${item.label}(${filtered.length})`;
};

// 获取经过搜索条件过滤的数据（不含分页）
const getFilteredList = () => {
  let list = reportObj.apilist;

  // 高级筛选参数
  const sp = searchParams.value;
  if (sp.uploadTimeRange && sp.uploadTimeRange.length === 2) {
    const [start, end] = sp.uploadTimeRange;
    list = list.filter(v => v.uploadTime.split(' ')[0] >= start && v.uploadTime.split(' ')[0] <= end);
  }
  if (sp.templateName) list = list.filter(v => v.templateName.includes(sp.templateName));
  if (sp.areaCode) list = list.filter(v => v.areaCode === sp.areaCode);
  if (sp.uploadStatus) list = list.filter(v => v.uploadStatus === sp.uploadStatus);

  // 快速查询（报表编号/模板名称）
  if (quickKeyword.value) {
    const kw = quickKeyword.value.toLowerCase();
    list = list.filter(v =>
      v.reportNo.toLowerCase().includes(kw) ||
      v.templateName.toLowerCase().includes(kw)
    );
  }

  // 标签页状态筛选
  if (activeName.value !== '全部') {
    list = list.filter(v => v.uploadStatus === activeName.value);
  }

  return list;
};

// 表格数据获取（分页）
const getTableData = ({ page }) => {
  const filteredList = getFilteredList();
  reportObj.total = filteredList.length;
  reportObj.list = filteredList.slice(
    (page.currentPage - 1) * page.pageSize,
    page.currentPage * page.pageSize
  );
  return { list: reportObj.list, total: reportObj.total };
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: { pageSize: 10 },
    toolbarConfig: { 'class-name': 'common-tool-bar-config', refresh: true, search: true },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

// 搜索条件
const searchParams = ref({});

function onSearchSubmit(values) {
  searchParams.value = { ...values };
  drawerApi.close();
  gridApi.query();
}

function onSearchReset() {
  searchParams.value = {};
  quickKeyword.value = '';
  queryFormApi.resetForm();
  gridApi.query();
}

function handleRefresh() { gridApi.query(); }

// ---------- 批量导出 ----------
async function handleExport() {
  const data = getFilteredList(); // 导出当前筛选结果
  exportToExcel(data, textObj.excelName, textObj.excelAllName);
}

function handleExportRow(row) {
  exportToExcel([row], `${row.reportNo}`, `${row.reportNo}.xlsx`);
}

// ---------- 详情弹窗 ----------
const reportDetailDrawerRef = ref(null);
function handleOpenDetail(row) {
  reportObj.detailObj = row;
  reportDetailDrawerRef.value.open();
}

// ---------- 重新上报（仅驳回状态）----------
function handleResubmit(row) {
  if (row.uploadStatus !== '已驳回') {
    ElMessage.warning('仅驳回状态的上报记录可重新上报');
    return;
  }
  resubmitDrawerApi.setData(row).open();
}

// ---------- 删除单行（仅用于演示，实际无批量删除需求）----------
async function handleDelete(row) {
  await confirm($t('确定删除该上报记录？'));
  reportObj.apilist = reportObj.apilist.filter(v => v.id !== row.id);
  ElMessage.success('已删除');
  handleRefresh();
}

// ---------- 复选框----------
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
}

// ---------- 钻取功能：点击筛选相关记录 ----------
function handleFilterByReportNo(reportNo) {
  quickKeyword.value = reportNo;
  gridApi.query();
}
function handleFilterByTemplate(templateName) {
  searchParams.value = { ...searchParams.value, templateName };
  drawerApi.close();
  gridApi.query();
}
function handleFilterByArea(areaCode) {
  searchParams.value = { ...searchParams.value, areaCode };
  drawerApi.close();
  gridApi.query();
}
function handleFilterByStatus(status) {
  searchParams.value = { ...searchParams.value, uploadStatus: status };
  drawerApi.close();
  gridApi.query();
}

// ---------- UI交互 ----------
const changeTotalShow = () => { reportObj.totalShow = !reportObj.totalShow; };
const handleSerachShow = () => { drawerApi.open(); };
const handleFullShow = () => { screenfull.toggle(); };
const arrowChange = () => { emit('arrow-change'); };
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 重新上报弹窗 -->
    <ResubmitDrawer :title="getTitle">
      <ResubmitForm />
    </ResubmitDrawer>

    <!-- 上报详情抽屉 -->
    <ReportDetailDrawer
      ref="reportDetailDrawerRef"
      :detail-obj="reportObj.detailObj"
      :title="`上报详情 - ${reportObj.detailObj.reportNo}`"
    />

    <!-- 高级筛选抽屉 -->
    <Drawer title="筛选">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 表格 -->
    <Grid>
      <!-- 二级标签：上报状态快速筛选 -->
      <template #table-title>
        <div class="tabel-tabs" v-if="props.secondShow">
          <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleRefresh">
            <el-tab-pane
              v-for="item in tabsData"
              :key="item.label"
              :label="createLabel(item)"
              :name="item.label"
            />
          </el-tabs>
        </div>
      </template>

      <!-- 工具栏操作按钮 -->
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="筛选" icon-name="search" @click="handleSerachShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 表格列插槽：钻取、状态标签、驳回原因条件显示等 -->
      <template #uploadId="{ row }">
        <el-text type="primary" class="link-text" @click="handleOpenDetail(row)">
          {{ row.uploadId }}
        </el-text>
      </template>
      <template #reportNo="{ row }">
        <el-text type="primary" class="link-text" @click="handleFilterByReportNo(row.reportNo)">
          {{ row.reportNo }}
        </el-text>
      </template>
      <template #templateName="{ row }">
        <el-text type="primary" class="link-text" @click="handleFilterByTemplate(row.templateName)">
          {{ row.templateName }}
        </el-text>
      </template>
      <template #areaName="{ row }">
        <el-text type="primary" class="link-text" @click="handleFilterByArea(row.areaCode)">
          {{ row.areaName }}
        </el-text>
      </template>
      <template #uploadStatus="{ row }">
        <el-tag
          :type="row.uploadStatus === '已上报' ? 'primary' :
                 row.uploadStatus === '已驳回' ? 'danger' :
                 row.uploadStatus === '审核通过' ? 'success' : 'info'"
          size="small"
          @click="handleFilterByStatus(row.uploadStatus)"
          style="cursor: pointer;"
        >
          {{ row.uploadStatus }}
        </el-tag>
      </template>
      <template #rejectReason="{ row }">
        <span v-if="row.uploadStatus === '已驳回'">{{ row.rejectReason }}</span>
        <span v-else>-</span>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />
          <IconButton
            content="重新上报"
            icon-name="Refresh"
            :disabled="row.uploadStatus !== '已驳回'"
            @click="handleResubmit(row)"
          />
          <IconButton content="导出" icon-name="download" @click="handleExportRow(row)" />
          <!-- 保留删除按钮仅用于演示，可根据实际去掉 -->
          <IconButton content="删除" icon-name="Delete" color="#F56C6C" @click="handleDelete(row)" />
        </div>
      </template>

      <!-- 底部统计 -->
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!reportObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="reportObj.totalShow"><ArrowUp /></el-icon>
          <span>
            本页统计：数据量{{ reportObj.list.length }}；
            上报ID数: {{ reportObj.list.length }}；
          </span>
        </div>
        <div class="common-total-bottom" v-if="reportObj.totalShow">
          <span>全部统计：{{ textObj.total }}</span>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
.gov-report-table {
  :deep(.link-text) {
    cursor: pointer;
    &:hover { text-decoration: underline; }
  }
  :deep(.el-tag) { cursor: pointer; }
}
</style>
