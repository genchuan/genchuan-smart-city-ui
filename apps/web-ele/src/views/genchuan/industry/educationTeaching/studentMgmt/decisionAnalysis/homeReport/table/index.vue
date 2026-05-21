<script setup>
import { reactive, ref, watch } from 'vue';
import { ElLoading, ElMessage, ElTag, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getHomeReportPage,
  createHomeReport,
  archiveHomeReport,
  exportHomeReport,
  getHomeReportDetail,
  getCommunicateMgmtPage,
  getParentReplyPage,
  getUserInfo,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/homeReport/data.js';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { downloadFileFromBlobPart } from '@vben/utils';
import {
  detailFields,
  getGenerateStatusTagType,
  getReportCycleTagType,
  useCreateFormSchema,
  useGridColumns,
  useSearchFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/homeReport/form.js';
import MsgPushDetailDialog from '../components/MsgPushDetailDialog.vue';
import MsgReadDetailDialog from '../components/MsgReadDetailDialog.vue';
import ParentFeedbackDetailDialog from '../components/ParentFeedbackDetailDialog.vue';

const props = defineProps({
  secondShow: Boolean,
  showStats: Boolean,
  toggleStats: Function,
  activeReportCycle: String,
});

const searchParams = reactive({
  reportCycle: '',
  statStartTime: null,
  statEndTime: null,
  generateStatus: '',
});

const activeFilterTags = reactive({
  reportCycle: '',
  generateStatus: '',
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

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const removeFilterTag = (type) => {
  if (type === 'reportCycle') {
    searchParams.reportCycle = '';
    activeFilterTags.reportCycle = '';
  } else if (type === 'generateStatus') {
    searchParams.generateStatus = '';
    activeFilterTags.generateStatus = '';
  }
  handleRefresh();
};

// 生成报表抽屉
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel: () => formDrawerApi.close(),
  async onConfirm() {
    const obj = formApi.form.values;
    const loadingInstance = ElLoading.service({ text: '正在生成报表...' });
    try {
      const statStart = obj.statTimeRange?.[0];
      const statEnd = obj.statTimeRange?.[1];
      const params = {
        statStartTime: statStart ? new Date(statStart).getTime() : null,
        statEndTime: statEnd ? new Date(statEnd).getTime() : null,
        reportCycle: obj.reportCycle,
        grade: obj.grade,
        className: obj.className || '',
      };
      const response = await createHomeReport(params);
      if (response?.code === 200) {
        ElMessage.success('报表生成任务已提交');
        handleRefresh();
        formDrawerApi.close();
      } else {
        ElMessage.error(response?.msg || '报表生成失败');
      }
    } catch (error) {
      console.error('生成报表失败:', error);
      ElMessage.error('报表生成失败');
    } finally {
      loadingInstance.close();
    }
  },
});

const [Form, formApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: useCreateFormSchema(),
  showDefaultActions: false,
});

// 搜索抽屉
const [Drawer, drawerApi] = useVbenDrawer({ modal: false, appendToMain: true, footer: false });
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useSearchFormSchema(),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// 详情抽屉
const detailDrawerRef = ref(null);
const detailData = ref({});

// 明细弹窗引用
const msgPushDetailRef = ref(null);
const msgReadDetailRef = ref(null);
const parentFeedbackDetailRef = ref(null);

// 表格数据获取
const getTableData = async (pageObj) => {
  const page = pageObj.page;
  try {
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      ...searchParams,
    };
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key];
    });
    const response = await getHomeReportPage(params);
    if (response?.code === 200) {
      const { list, total } = response.data;
      return { list: list || [], total: total || 0 };
    }
    return { list: [], total: 0 };
  } catch (error) {
    console.error('获取表格数据失败:', error);
    ElMessage.error('获取数据失败');
    return { list: [], total: 0 };
  }
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: { ajax: { query: async ({ page }) => await getTableData({ page }) } },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: { refresh: true, search: true },
    showOverflow: true,
  },
  showSearchForm: false,
});

const handleRefresh = () => gridApi.query();

// 批量导出
const handleExport = async () => {
  try {
    await ElMessageBox.confirm('确认导出当前筛选的所有报表数据吗？', '导出确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    });
    const loadingInstance = ElLoading.service({ text: '正在导出...' });
    const params = { ...searchParams };
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key];
    });
    const blob = await exportHomeReport(params);
    downloadFileFromBlobPart({ fileName: '家校报表数据.xlsx', source: blob });
    ElMessage.success('导出成功');
    loadingInstance.close();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('导出失败:', error);
      ElMessage.error('导出失败');
    }
  }
};

// 单行导出
const handleExportRow = async (row) => {
  try {
    await ElMessageBox.confirm(`确认导出报表“${row.reportCycle}”的数据吗？`, '导出确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    });
    const loadingInstance = ElLoading.service({ text: '正在导出...' });
    const blob = await exportHomeReport({ id: row.id });
    downloadFileFromBlobPart({ fileName: `家校报表_${row.reportCycle}.xlsx`, source: blob });
    ElMessage.success('导出成功');
    loadingInstance.close();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('导出失败:', error);
      ElMessage.error('导出失败');
    }
  }
};

// 查看详情
const handleOpenDetail = async (row) => {
  const loadingInstance = ElLoading.service({ text: '正在加载详情...' });
  try {
    const response = await getHomeReportDetail({ id: row.id });
    detailData.value = response?.code === 200 ? response.data : row;
    detailDrawerRef.value.open();
  } catch (error) {
    detailData.value = row;
    detailDrawerRef.value.open();
  } finally {
    loadingInstance.close();
  }
};

// 生成按钮
const handleGenerate = async (row) => {
  try {
    await ElMessageBox.confirm(`确认生成“${row.reportCycle}”报表吗？`, '生成确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    });
    const loadingInstance = ElLoading.service({ text: '正在生成报表...' });
    const response = await createHomeReport({ id: row.id });
    if (response?.code === 200) {
      ElMessage.success('报表生成成功');
      handleRefresh();
    } else {
      ElMessage.error(response?.msg || '生成失败');
    }
    loadingInstance.close();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('生成失败:', error);
      ElMessage.error('生成失败');
    }
  }
};

// 归档
const handleArchive = async (row) => {
  try {
    await ElMessageBox.confirm(`确认归档“${row.reportCycle}”报表吗？归档后将不可再修改。`, '归档确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loadingInstance = ElLoading.service({ text: '正在归档...' });
    const response = await archiveHomeReport({ ids: [row.id] });
    if (response?.code === 200) {
      ElMessage.success('归档成功');
      handleRefresh();
    } else {
      ElMessage.error(response?.msg || '归档失败');
    }
    loadingInstance.close();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('归档失败:', error);
      ElMessage.error('归档失败');
    }
  }
};

// 打印（年报）
const handlePrint = (row) => {
  window.print();
  ElMessage.info('打印功能已触发');
};

const getActionButtons = (row) => {
  const { reportCycle, generateStatus } = row;
  if (generateStatus === '待生成') {
    return [{ label: '生成', onClick: () => handleGenerate(row), type: 'primary' }];
  }
  if (generateStatus === '已生成') {
    const base = [
      { label: '查看', onClick: () => handleOpenDetail(row) },
      { label: '导出', onClick: () => handleExportRow(row) },
    ];
    if (reportCycle !== '年报') base.push({ label: '归档', onClick: () => handleArchive(row) });
    else base.push({ label: '归档', onClick: () => handleArchive(row) }, { label: '打印', onClick: () => handlePrint(row) });
    return base;
  }
  if (generateStatus === '已归档') {
    const base = [
      { label: '查看', onClick: () => handleOpenDetail(row) },
      { label: '导出', onClick: () => handleExportRow(row) },
    ];
    if (reportCycle === '年报') base.push({ label: '打印', onClick: () => handlePrint(row) });
    return base;
  }
  return [];
};

const handleCreate = () => formDrawerApi.setData({}).open();
const handleSearch = () => drawerApi.open();

const handleReset = () => {
  searchParams.reportCycle = '';
  searchParams.generateStatus = '';
  searchParams.statStartTime = null;
  searchParams.statEndTime = null;
  activeFilterTags.reportCycle = '';
  activeFilterTags.generateStatus = '';
  handleRefresh();
};

function onSubmit(values) {
  searchParams.reportCycle = values.reportCycle || '';
  searchParams.generateStatus = values.generateStatus || '';
  if (values.statTimeRange && values.statTimeRange.length === 2) {
    searchParams.statStartTime = new Date(values.statTimeRange[0]).getTime();
    searchParams.statEndTime = new Date(values.statTimeRange[1]).getTime();
  } else {
    searchParams.statStartTime = null;
    searchParams.statEndTime = null;
  }
  activeFilterTags.reportCycle = searchParams.reportCycle;
  activeFilterTags.generateStatus = searchParams.generateStatus;
  handleRefresh();
  drawerApi.close();
}

// 字段钻取
const handleFieldDrill = (type, row) => {
  switch (type) {
    case 'msgPushNum':
      msgPushDetailRef.value?.open();
      break;
    case 'msgReadNum':
      msgReadDetailRef.value?.open();
      break;
    case 'parentFeedbackNum':
      parentFeedbackDetailRef.value?.open();
      break;
    case 'reportCycle':
      searchParams.reportCycle = row.reportCycle;
      activeFilterTags.reportCycle = row.reportCycle;
      handleRefresh();
      break;
    case 'generateStatus':
      searchParams.generateStatus = row.generateStatus;
      activeFilterTags.generateStatus = row.generateStatus;
      handleRefresh();
      break;
    default:
      break;
  }
};

// 操作人信息
const handleOperatorClick = async (operatorId) => {
  const loadingInstance = ElLoading.service({ text: '加载中...' });
  try {
    const res = await getUserInfo({ id: operatorId });
    if (res.code === 200) {
      const user = res.data;
      ElMessageBox.alert(`账号：${user.username}\n姓名：${user.nickname}\n部门ID：${user.deptId}`, '操作人信息', {
        confirmButtonText: '关闭',
      });
    }
  } catch (error) {
    ElMessage.error('获取操作人信息失败');
  } finally {
    loadingInstance.close();
  }
};

// 图表钻取回调
const handleStatsFilter = (type, value) => {
  if (type === 'pie') {
    // 饼图钻取：推送类型分布 -> 筛选该类型消息
    msgPushDetailRef.value?.open({ type: value });
  } else if (type === 'line') {
    // 折线图钻取
  } else if (type === 'reportCycle') {
    searchParams.reportCycle = value || '';
    activeFilterTags.reportCycle = value || '';
    handleRefresh();
  }
};

watch(
  () => props.activeReportCycle,
  (newVal) => {
    if (newVal !== undefined) {
      searchParams.reportCycle = newVal || '';
      activeFilterTags.reportCycle = newVal || '';
      handleRefresh();
    }
  },
  { immediate: false }
);

const handleFullShow = () => screenfull.toggle();

defineExpose({ handleStatsFilter });
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer title="生成报表">
      <Form />
    </FormDrawer>
    <DetailDrawer ref="detailDrawerRef" :title="`${detailData.reportCycle || '家校报表'}详情`"
                  :data="detailData" :fields="detailFields" />
    <Drawer title="筛选">
      <QueryForm class="query-form" />
    </Drawer>

    <!-- 明细弹窗 -->
    <MsgPushDetailDialog ref="msgPushDetailRef" />
    <MsgReadDetailDialog ref="msgReadDetailRef" />
    <ParentFeedbackDetailDialog ref="parentFeedbackDetailRef" />

    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <ElTag v-if="activeFilterTags.reportCycle" type="primary" closable
                 @close="removeFilterTag('reportCycle')">报表周期：{{ activeFilterTags.reportCycle }}</ElTag>
          <ElTag v-if="activeFilterTags.generateStatus" type="primary" closable
                 @close="removeFilterTag('generateStatus')">生成状态：{{ activeFilterTags.generateStatus }}</ElTag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="生成报表" icon-name="Plus" @click="handleCreate" />
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton content="筛选" icon-name="search" @click="handleSearch" />
          <IconButton content="重置" icon-name="Refresh" @click="handleReset" />
          <IconButton :content="props.showStats ? '隐藏统计' : '显示统计'"
                      :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
                      @click="props.toggleStats" />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>

      <!-- 统计时段 -->
      <template #statisticalPeriod="{ row }">
        <span>{{ formatTimestamp(row.statStartTime) }} - {{ formatTimestamp(row.statEndTime) }}</span>
      </template>

      <!-- 报表周期 -->
      <template #reportCycle="{ row }">
        <ElTag :type="getReportCycleTagType(row.reportCycle)" style="cursor: pointer"
               @click="handleFieldDrill('reportCycle', row)">
          {{ row.reportCycle }}
        </ElTag>
      </template>

      <!-- 推送消息数 -->
      <template #msgPushNum="{ row }">
        <span style="color: #409eff; cursor: pointer" @click="handleFieldDrill('msgPushNum', row)">
          {{ row.msgPushNum }}
        </span>
      </template>

      <!-- 已读消息数 -->
      <template #msgReadNum="{ row }">
        <span style="color: #409eff; cursor: pointer" @click="handleFieldDrill('msgReadNum', row)">
          {{ row.msgReadNum }}
        </span>
      </template>

      <!-- 家长反馈数 -->
      <template #parentFeedbackNum="{ row }">
        <span style="color: #409eff; cursor: pointer" @click="handleFieldDrill('parentFeedbackNum', row)">
          {{ row.parentFeedbackNum }}
        </span>
      </template>

      <!-- 生成状态 -->
      <template #generateStatus="{ row }">
        <ElTag :type="getGenerateStatusTagType(row.generateStatus)" style="cursor: pointer"
               @click="handleFieldDrill('generateStatus', row)">
          {{ row.generateStatus }}
        </ElTag>
      </template>

      <!-- 操作人 -->
      <template #operatorId="{ row }">
        <span style="color: #409eff; cursor: pointer" @click="handleOperatorClick(row.operatorId)">
          {{ row.operatorId }}
        </span>
      </template>

      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="gap: 8px;">
          <template v-for="btn in getActionButtons(row)" :key="btn.label">
            <IconButton :content="btn.label" :icon-name="btn.label === '生成' ? 'Plus' : (btn.label === '查看' ? 'View' : (btn.label === '导出' ? 'download' : (btn.label === '归档' ? 'FolderAdd' : 'Printer')))" @click="btn.onClick" />
          </template>
        </div>
      </template>
    </Grid>
  </div>
</template>
