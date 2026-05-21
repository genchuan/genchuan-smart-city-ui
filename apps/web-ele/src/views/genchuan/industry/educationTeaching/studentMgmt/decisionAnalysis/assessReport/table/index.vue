<script setup>
import { reactive, ref, watch } from 'vue';
import { ElLoading, ElMessage, ElTag, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getAssessReportPage,
  createAssessReport,
  archiveAssessReport,
  exportAssessReport,
  getAssessReportDetail,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/assessReport/data.js';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import { downloadFileFromBlobPart } from '@vben/utils';
import {
  detailFields,
  getGenerateStatusTagType,
  getReportPeriodTagType,
  useCreateFormSchema,
  useGridColumns,
  useSearchFormSchema,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/assessReport/form.js';

import ClassAssessDetailDialog from '../components/ClassAssessDetailDialog.vue';
import HealthDetailDialog from '../components/HealthDetailDialog.vue';
import MorningExerciseDetailDialog from '../components/MorningExerciseDetailDialog.vue';
import CivilizedClassDetailDialog from '../components/CivilizedClassDetailDialog.vue';
import BlackboardDetailDialog from '../components/BlackboardDetailDialog.vue';

const props = defineProps({
  secondShow: Boolean,
  showStats: Boolean,
  toggleStats: Function,
  activeReportCycle: String,
});

// 搜索参数
const searchParams = reactive({
  reportPeriod: '',
  statStartTime: null,
  statEndTime: null,
  className: '',
  majorName: '',
  grade: '',
  assessRank: null,
  generateStatus: '',
});

const activeFilterTags = reactive({
  reportPeriod: '',
  className: '',
  majorName: '',
  grade: '',
  assessRank: '',
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
  const map = {
    reportPeriod: () => {
      searchParams.reportPeriod = '';
      activeFilterTags.reportPeriod = '';
    },
    className: () => {
      searchParams.className = '';
      activeFilterTags.className = '';
    },
    majorName: () => {
      searchParams.majorName = '';
      activeFilterTags.majorName = '';
    },
    grade: () => {
      searchParams.grade = '';
      activeFilterTags.grade = '';
    },
    assessRank: () => {
      searchParams.assessRank = null;
      activeFilterTags.assessRank = '';
    },
    generateStatus: () => {
      searchParams.generateStatus = '';
      activeFilterTags.generateStatus = '';
    },
  };
  map[type]?.();
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
        reportPeriod: obj.reportPeriod,
        grade: obj.grade,
        majorName: obj.majorName || '',
        className: obj.className || '',
      };
      const response = await createAssessReport(params);
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
const classAssessDetailRef = ref(null);
const healthDetailRef = ref(null);
const morningExerciseDetailRef = ref(null);
const civilizedClassDetailRef = ref(null);
const blackboardDetailRef = ref(null);

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
    const response = await getAssessReportPage(params);
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
    const blob = await exportAssessReport(params);
    downloadFileFromBlobPart({ fileName: '考评统计报表数据.xlsx', source: blob });
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
    await ElMessageBox.confirm(`确认导出报表“${row.reportPeriod}”的数据吗？`, '导出确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    });
    const loadingInstance = ElLoading.service({ text: '正在导出...' });
    const blob = await exportAssessReport({ id: row.id });
    downloadFileFromBlobPart({
      fileName: `考评报表_${row.reportPeriod}_${row.className}.xlsx`,
      source: blob
    });
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
    const response = await getAssessReportDetail({ id: row.id });
    detailData.value = response?.code === 200 ? response.data : row;
    detailDrawerRef.value.open();
  } catch (error) {
    detailData.value = row;
    detailDrawerRef.value.open();
  } finally {
    loadingInstance.close();
  }
};

// 生成按钮（针对待生成状态）
const handleGenerate = async (row) => {
  try {
    await ElMessageBox.confirm(`确认生成“${row.reportPeriod} - ${row.className}”报表吗？`, '生成确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    });
    const loadingInstance = ElLoading.service({ text: '正在生成报表...' });
    const response = await createAssessReport({ id: row.id });
    if (response?.code === 200) {
      ElMessage.success('报表生成成功');
      handleRefresh(); // 刷新列表，状态变为“已生成”
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

// 归档按钮
const handleArchive = async (row) => {
  try {
    await ElMessageBox.confirm(`确认归档“${row.reportPeriod} - ${row.className}”报表吗？归档后将不可再修改。`, '归档确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });
    const loadingInstance = ElLoading.service({ text: '正在归档...' });
    const response = await archiveAssessReport({ id: row.id });
    if (response?.code === 200) {
      ElMessage.success('归档成功');
      handleRefresh(); // 刷新列表，状态变为“已归档”
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

// 打印按钮（仅年报）
const handlePrint = (row) => {
  // 简单模拟打印：打开一个新窗口打印当前详情（或调用浏览器打印）
  window.print(); // 实际项目中可能需要更复杂的逻辑
  ElMessage.info('打印功能已触发（模拟）');
};

// 根据报表周期和生成状态动态获取操作按钮列表
const getActionButtons = (row) => {
  const { reportPeriod, generateStatus } = row;
  // 待生成：只有生成按钮
  if (generateStatus === '待生成') {
    return [{ label: '生成', onClick: () => handleGenerate(row), type: 'primary' }];
  }
  // 已生成状态
  if (generateStatus === '已生成') {
    const baseButtons = [
      { label: '查看', onClick: () => handleOpenDetail(row) },
      { label: '导出', onClick: () => handleExportRow(row) },
    ];
    // 归档按钮（除了年报，年报已生成也有归档按钮？根据需求：年报已生成也有归档）
    if (reportPeriod !== '年报') {
      baseButtons.push({ label: '归档', onClick: () => handleArchive(row) });
    } else {
      // 年报已生成：归档 + 打印
      baseButtons.push({ label: '归档', onClick: () => handleArchive(row) });
      baseButtons.push({ label: '打印', onClick: () => handlePrint(row) });
    }
    return baseButtons;
  }
  // 已归档状态
  if (generateStatus === '已归档') {
    const baseButtons = [
      { label: '查看', onClick: () => handleOpenDetail(row) },
      { label: '导出', onClick: () => handleExportRow(row) },
    ];
    if (reportPeriod === '年报') {
      baseButtons.push({ label: '打印', onClick: () => handlePrint(row) });
    }
    return baseButtons;
  }
  return [];
};

const handleCreate = () => formDrawerApi.setData({}).open();
const handleSearch = () => drawerApi.open();

const handleReset = () => {
  Object.keys(searchParams).forEach(key => {
    if (key === 'assessRank') searchParams[key] = null;
    else if (key === 'statStartTime' || key === 'statEndTime') searchParams[key] = null;
    else searchParams[key] = '';
  });
  Object.keys(activeFilterTags).forEach(key => activeFilterTags[key] = '');
  handleRefresh();
};

function onSubmit(values) {
  searchParams.reportPeriod = values.reportPeriod || '';
  searchParams.className = values.className || '';
  searchParams.majorName = values.majorName || '';
  searchParams.grade = values.grade || '';
  searchParams.generateStatus = values.generateStatus || '';

  if (values.statTimeRange && values.statTimeRange.length === 2) {
    searchParams.statStartTime = new Date(values.statTimeRange[0]).getTime();
    searchParams.statEndTime = new Date(values.statTimeRange[1]).getTime();
  } else {
    searchParams.statStartTime = null;
    searchParams.statEndTime = null;
  }

  activeFilterTags.reportPeriod = searchParams.reportPeriod || '';
  activeFilterTags.className = searchParams.className || '';
  activeFilterTags.majorName = searchParams.majorName || '';
  activeFilterTags.grade = searchParams.grade || '';
  activeFilterTags.assessRank = searchParams.assessRank ? String(searchParams.assessRank) : '';
  activeFilterTags.generateStatus = searchParams.generateStatus || '';
  handleRefresh();
  drawerApi.close();
}

// 字段钻取
const handleFieldDrill = (type, row) => {
  const drillMap = {
    reportPeriod: () => {
      searchParams.reportPeriod = row.reportPeriod;
      activeFilterTags.reportPeriod = row.reportPeriod;
      handleRefresh();
    },
    className: () => {
      searchParams.className = row.className;
      activeFilterTags.className = row.className;
      handleRefresh();
    },
    majorName: () => {
      searchParams.majorName = row.majorName;
      activeFilterTags.majorName = row.majorName;
      handleRefresh();
    },
    grade: () => {
      searchParams.grade = row.grade;
      activeFilterTags.grade = row.grade;
      handleRefresh();
    },
    assessRank: () => {
      searchParams.assessRank = row.assessRank;
      activeFilterTags.assessRank = String(row.assessRank);
      handleRefresh();
    },
    generateStatus: () => {
      searchParams.generateStatus = row.generateStatus;
      activeFilterTags.generateStatus = row.generateStatus;
      handleRefresh();
    },
    totalAssessScore: () => classAssessDetailRef.value?.open(row),
    healthScore: () => healthDetailRef.value?.open(row),
    morningExerciseScore: () => morningExerciseDetailRef.value?.open(row),
    civilizedClassScore: () => civilizedClassDetailRef.value?.open(row),
    blackboardNewsScore: () => blackboardDetailRef.value?.open(row),
  };
  drillMap[type]?.();
};

const handleStatsFilter = (type, value) => {
  if (type === 'radar') {
    classAssessDetailRef.value?.open({ className: value });
  } else if (type === 'line') {
    classAssessDetailRef.value?.open({
      className: value.className,
      statisticalDate: value.date,
    });
  } else if (type === 'reportCycle') {
    searchParams.reportPeriod = value || '';
    activeFilterTags.reportPeriod = value || '';
    handleRefresh();
  }
};

watch(
  () => props.activeReportCycle,
  (newVal) => {
    if (newVal !== undefined) {
      searchParams.reportPeriod = newVal || '';
      activeFilterTags.reportPeriod = newVal || '';
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
    <DetailDrawer ref="detailDrawerRef" :title="`${detailData.reportPeriod || '考评报表'}详情`"
                  :data="detailData" :fields="detailFields" />
    <Drawer title="筛选">
      <QueryForm class="query-form" />
    </Drawer>

    <ClassAssessDetailDialog ref="classAssessDetailRef" />
    <HealthDetailDialog ref="healthDetailRef" />
    <MorningExerciseDetailDialog ref="morningExerciseDetailRef" />
    <CivilizedClassDetailDialog ref="civilizedClassDetailRef" />
    <BlackboardDetailDialog ref="blackboardDetailRef" />

    <Grid>
      <template #table-title>
        <div class="tabel-tabs"
             style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <ElTag v-if="activeFilterTags.className" type="primary" closable
                 @close="removeFilterTag('className')">班级：{{ activeFilterTags.className }}
          </ElTag>
          <ElTag v-if="activeFilterTags.majorName" type="primary" closable
                 @close="removeFilterTag('majorName')">专业：{{ activeFilterTags.majorName }}
          </ElTag>
          <ElTag v-if="activeFilterTags.grade" type="primary" closable
                 @close="removeFilterTag('grade')">年级：{{ activeFilterTags.grade }}
          </ElTag>
          <ElTag v-if="activeFilterTags.generateStatus" type="primary" closable
                 @close="removeFilterTag('generateStatus')">
            生成状态：{{ activeFilterTags.generateStatus }}
          </ElTag>
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

      <!-- 统计时段列 -->
      <template #statisticalPeriod="{ row }">
        <span>{{ formatTimestamp(row.statStartTime) }} - {{ formatTimestamp(row.statEndTime) }}</span>
      </template>

      <!-- 报表周期 -->
      <template #reportPeriod="{ row }">
        <ElTag :type="getReportPeriodTagType(row.reportPeriod)">
          {{ row.reportPeriod }}
        </ElTag>
      </template>
      <!-- 班级名称 -->
      <template #className="{ row }">
        <span style="color: #409eff; cursor: pointer"
              @click="handleFieldDrill('className', row)">{{ row.className }}</span>
      </template>
      <!-- 专业名称 -->
      <template #majorName="{ row }">
        <span style="color: #409eff; cursor: pointer"
              @click="handleFieldDrill('majorName', row)">{{ row.majorName }}</span>
      </template>
      <!-- 年级 -->
      <template #grade="{ row }">
        <span style="color: #409eff; cursor: pointer"
              @click="handleFieldDrill('grade', row)">{{ row.grade }}</span>
      </template>
      <!-- 四项考评总分 -->
      <template #totalAssessScore="{ row }">
        <span style="color: #409eff; cursor: pointer"
              @click="handleFieldDrill('totalAssessScore', row)">{{ row.totalAssessScore }}</span>
      </template>
      <!-- 卫生得分 -->
      <template #healthScore="{ row }">
        <span style="color: #409eff; cursor: pointer" @click="handleFieldDrill('healthScore', row)">{{
            row.healthScore
          }}</span>
      </template>
      <!-- 早操得分 -->
      <template #morningExerciseScore="{ row }">
        <span style="color: #409eff; cursor: pointer"
              @click="handleFieldDrill('morningExerciseScore', row)">{{
            row.morningExerciseScore
          }}</span>
      </template>
      <!-- 文明班级得分 -->
      <template #civilizedClassScore="{ row }">
        <span style="color: #409eff; cursor: pointer"
              @click="handleFieldDrill('civilizedClassScore', row)">{{
            row.civilizedClassScore
          }}</span>
      </template>
      <!-- 黑板报得分 -->
      <template #blackboardNewsScore="{ row }">
        <span style="color: #409eff; cursor: pointer"
              @click="handleFieldDrill('blackboardNewsScore', row)">{{
            row.blackboardNewsScore
          }}</span>
      </template>
      <!-- 考评排名 -->
      <template #assessRank="{ row }">
        <span>{{ row.assessRank }}</span>
      </template>
      <!-- 生成状态 -->
      <template #generateStatus="{ row }">
        <ElTag :type="getGenerateStatusTagType(row.generateStatus)" style="cursor: pointer"
               @click="handleFieldDrill('generateStatus', row)">
          {{ row.generateStatus }}
        </ElTag>
      </template>
      <!-- 操作人 -->
      <template #operator="{ row }">
        <span>{{ row.operator }}</span>
      </template>
      <!-- 操作按钮（动态） -->
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
