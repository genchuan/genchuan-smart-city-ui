<script setup>
import {reactive, ref, watch} from 'vue';
import {ElLoading, ElMessage, ElTag, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenDrawer} from '@vben/common-ui';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {
  getMoralReportPage,
  createMoralReport,
  exportMoralReport,
  getMoralReportDetail,
} from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/moralReport/data.js';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';
import {downloadFileFromBlobPart} from '@vben/utils';
import {
  detailFields,
  getGenerateStatusTagType,
  getReportPeriodTagType,
  useCreateFormSchema,
  useGridColumns,
  useSearchFormSchema,
} from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/moralReport/form.js';

// 明细弹窗组件（德育报表专用）
import ClassMoralDetailDialog from '../components/ClassMoralDetailDialog.vue';      // 班级德育明细
import GoodDeedDetailDialog from '../components/GoodDeedDetailDialog.vue';          // 好人好事记录明细
import CivilizedBehaviorDetailDialog from '../components/CivilizedBehaviorDetailDialog.vue'; // 文明行为评比明细

const props = defineProps({
  secondShow: Boolean,
  showStats: Boolean,
  toggleStats: Function,
  activeReportCycle: String,
});

// 搜索参数
const searchParams = reactive({
  reportPeriod: '',
  statisticalPeriod: '',
  className: '',
  majorName: '',
  grade: '',
  campus: '',
  civilizedClassTitle: '',
  assessRank: null,
  generateStatus: '',
});

const activeFilterTags = reactive({
  reportPeriod: '',
  className: '',
  majorName: '',
  grade: '',
  campus: '',
  civilizedClassTitle: '',
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

// 移除筛选标签
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
    campus: () => {
      searchParams.campus = '';
      activeFilterTags.campus = '';
    },
    civilizedClassTitle: () => {
      searchParams.civilizedClassTitle = '';
      activeFilterTags.civilizedClassTitle = '';
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
    const loadingInstance = ElLoading.service({text: '正在生成报表...'});
    try {
      const statStart = obj.statTimeRange?.[0];
      const statEnd = obj.statTimeRange?.[1];
      const statisticalPeriod = statStart && statEnd ? `${statStart} 至 ${statEnd}` : '';
      const params = {
        statisticalPeriod,
        reportPeriod: obj.reportPeriod,
        campus: obj.campus,
        grade: obj.grade,
        majorName: obj.majorName || '',
        className: obj.className || '',
      };
      const response = await createMoralReport(params);
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
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  layout: 'horizontal',
  schema: useCreateFormSchema(),
  showDefaultActions: false,
});

// 搜索抽屉
const [Drawer, drawerApi] = useVbenDrawer({modal: false, appendToMain: true, footer: false});
const [QueryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {componentProps: {class: 'w-full'}, formItemClass: 'col-span-2', labelWidth: 100},
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useSearchFormSchema(),
  showCollapseButton: true,
  submitButtonOptions: {content: '查询'},
});

// 详情抽屉
const detailDrawerRef = ref(null);
const detailData = ref({});

// 明细弹窗引用（已移除 drillDownDetailDialogRef）
const classMoralDetailRef = ref(null);      // 班级德育明细
const goodDeedDetailRef = ref(null);        // 好人好事记录
const civilizedBehaviorDetailRef = ref(null); // 文明行为评比

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
    const response = await getMoralReportPage(params);
    if (response?.code === 200) {
      const {list, total} = response.data;
      return {list: list || [], total: total || 0};
    }
    return {list: [], total: 0};
  } catch (error) {
    console.error('获取表格数据失败:', error);
    ElMessage.error('获取数据失败');
    return {list: [], total: 0};
  }
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {ajax: {query: async ({page}) => await getTableData({page})}},
    rowConfig: {keyField: 'id', isHover: true},
    pagerConfig: dataObj,
    toolbarConfig: {refresh: true, search: true},
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
    const loadingInstance = ElLoading.service({text: '正在导出...'});
    const params = {...searchParams};
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key];
    });
    const blob = await exportMoralReport(params);
    downloadFileFromBlobPart({fileName: '德育评比报表数据.xlsx', source: blob});
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
    const loadingInstance = ElLoading.service({text: '正在导出...'});
    const blob = await exportMoralReport({id: row.id});
    downloadFileFromBlobPart({
      fileName: `德育报表_${row.reportPeriod}_${row.className}.xlsx`,
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
  const loadingInstance = ElLoading.service({text: '正在加载详情...'});
  try {
    const response = await getMoralReportDetail({id: row.id});
    detailData.value = response?.code === 200 ? response.data : row;
    detailDrawerRef.value.open();
  } catch (error) {
    detailData.value = row;
    detailDrawerRef.value.open();
  } finally {
    loadingInstance.close();
  }
};

const handleCreate = () => formDrawerApi.setData({}).open();
const handleSearch = () => drawerApi.open();

const handleReset = () => {
  Object.keys(searchParams).forEach(key => {
    if (key === 'assessRank') searchParams[key] = null;
    else searchParams[key] = '';
  });
  Object.keys(activeFilterTags).forEach(key => activeFilterTags[key] = '');
  handleRefresh();
};

function onSubmit(values) {
  Object.assign(searchParams, values);
  activeFilterTags.reportPeriod = searchParams.reportPeriod || '';
  activeFilterTags.className = searchParams.className || '';
  activeFilterTags.majorName = searchParams.majorName || '';
  activeFilterTags.grade = searchParams.grade || '';
  activeFilterTags.campus = searchParams.campus || '';
  activeFilterTags.civilizedClassTitle = searchParams.civilizedClassTitle || '';
  activeFilterTags.assessRank = searchParams.assessRank ? String(searchParams.assessRank) : '';
  activeFilterTags.generateStatus = searchParams.generateStatus || '';
  handleRefresh();
  drawerApi.close();
}

// 字段钻取（已移除 operator 分支）
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
    campus: () => {
      searchParams.campus = row.campus;
      activeFilterTags.campus = row.campus;
      handleRefresh();
    },
    assessRank: () => {
      searchParams.assessRank = row.assessRank;
      activeFilterTags.assessRank = String(row.assessRank);
      handleRefresh();
    },
    civilizedClassTitle: () => {
      searchParams.civilizedClassTitle = row.civilizedClassTitle;
      activeFilterTags.civilizedClassTitle = row.civilizedClassTitle;
      handleRefresh();
    },
    generateStatus: () => {
      searchParams.generateStatus = row.generateStatus;
      activeFilterTags.generateStatus = row.generateStatus;
      handleRefresh();
    },
    totalMoralScore: () => classMoralDetailRef.value?.open(row),
    goodDeedScore: () => goodDeedDetailRef.value?.open(row),
    civilizedBehaviorScore: () => civilizedBehaviorDetailRef.value?.open(row),
  };
  drillMap[type]?.();
};

// 处理图表钻取（来自父组件或图表点击）
const handleStatsFilter = (type, value) => {
  if (type === 'classRankBar') {
    // 点击班级排名柱状图 -> 打开该班级德育明细弹窗
    classMoralDetailRef.value?.open({className: value});
  } else if (type === 'campusBar') {
    // 点击校区文明班级柱状图 -> 筛选该校区文明班级列表
    searchParams.campus = value;
    activeFilterTags.campus = value;
    handleRefresh();
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
  {immediate: false}
);

const handleFullShow = () => screenfull.toggle();

defineExpose({handleStatsFilter});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer title="生成报表">
      <Form/>
    </FormDrawer>
    <DetailDrawer ref="detailDrawerRef" :title="`${detailData.reportPeriod || '德育报表'}详情`"
                  :data="detailData" :fields="detailFields"/>
    <Drawer title="筛选">
      <QueryForm class="query-form"/>
    </Drawer>

    <ClassMoralDetailDialog ref="classMoralDetailRef"/>
    <GoodDeedDetailDialog ref="goodDeedDetailRef"/>
    <CivilizedBehaviorDetailDialog ref="civilizedBehaviorDetailRef"/>

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
          <ElTag v-if="activeFilterTags.campus" type="primary" closable
                 @close="removeFilterTag('campus')">校区：{{ activeFilterTags.campus }}
          </ElTag>
          <ElTag v-if="activeFilterTags.civilizedClassTitle" type="primary" closable
                 @close="removeFilterTag('civilizedClassTitle')">
            文明班级称号：{{ activeFilterTags.civilizedClassTitle }}
          </ElTag>
          <ElTag v-if="activeFilterTags.generateStatus" type="primary" closable
                 @close="removeFilterTag('generateStatus')">
            生成状态：{{ activeFilterTags.generateStatus }}
          </ElTag>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="生成报表" icon-name="Plus" @click="handleCreate"/>
          <IconButton content="导出" icon-name="download" @click="handleExport"/>
          <IconButton content="筛选" icon-name="search" @click="handleSearch"/>
          <IconButton content="重置" icon-name="Refresh" @click="handleReset"/>
          <IconButton :content="props.showStats ? '隐藏统计' : '显示统计'"
                      :icon-name="props.showStats ? 'ArrowUp' : 'ArrowDown'"
                      @click="props.toggleStats"/>
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow"/>
        </div>
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
      <!-- 校区 -->
      <template #campus="{ row }">
        <span style="color: #409eff; cursor: pointer"
              @click="handleFieldDrill('campus', row)">{{ row.campus }}</span>
      </template>
      <!-- 德育总分 -->
      <template #totalMoralScore="{ row }">
        <span style="color: #409eff; cursor: pointer"
              @click="handleFieldDrill('totalMoralScore', row)">{{ row.totalMoralScore }}</span>
      </template>
      <!-- 好人好事得分 -->
      <template #goodDeedScore="{ row }">
        <span style="color: #409eff; cursor: pointer"
              @click="handleFieldDrill('goodDeedScore', row)">{{ row.goodDeedScore }}</span>
      </template>
      <!-- 文明行为得分 -->
      <template #civilizedBehaviorScore="{ row }">
        <span style="color: #409eff; cursor: pointer"
              @click="handleFieldDrill('civilizedBehaviorScore', row)">{{
            row.civilizedBehaviorScore
          }}</span>
      </template>
      <!-- 评比排名 -->
      <template #assessRank="{ row }">
        <span>{{ row.assessRank }}</span>
      </template>
      <!-- 文明班级称号 -->
      <template #civilizedClassTitle="{ row }">
        <span style="color: #409eff; cursor: pointer"
              @click="handleFieldDrill('civilizedClassTitle', row)">{{
            row.civilizedClassTitle || '-'
          }}</span>
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
      <!-- 操作按钮 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="查看" icon-name="View" @click="handleOpenDetail(row)"/>
          <IconButton content="导出" icon-name="download" @click="handleExportRow(row)"/>
        </div>
      </template>
    </Grid>
  </div>
</template>
