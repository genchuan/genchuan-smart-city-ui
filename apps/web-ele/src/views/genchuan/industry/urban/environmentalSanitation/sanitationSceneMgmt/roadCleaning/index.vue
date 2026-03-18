<script setup>
import {computed, onMounted, reactive, ref, watch} from 'vue';
import {confirm, useVbenDrawer} from '@vben/common-ui';
import {isEmpty} from '@vben/utils';
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';
import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {$t} from '#/locales';
import ParkDetailDrawer from './components/detail.vue';
import ProblemDetailDrawer from './components/problemDetail.vue';
import Chart2 from './components/chart2.vue';
import {
  createCleaningProblem,
  createRoadCleaning,
  deleteCleaningProblem,
  deleteCleaningProblemBatch,
  deleteRoadCleaning,
  deleteRoadCleaningBatch,
  exportCleaningProblemExcel,
  exportRoadCleaningExcel,
  getCleaningProblemPage,
  getRoadCleaningPage,
  updateCleaningProblem,
  updateRoadCleaning,
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/roadCleaning/data.js';
import {
  getAreaOptions,
  getColumnsByStatus,
  getPlanStatusOptions,
  getProblemTypeOptions,
  getRoadOptions,
  getTeamOptions,
  getToolOptions,
  getUserOptions,
  textObj,
  useAftermathFormSchema,
  useBatchAdjustFormSchema,
  useBatchReviewFormSchema,
  useCommunicationFormSchema,
  useProblemFormSchema,
  useProblemReportSchema,
  useReviewFormSchema,
  useRoadFormSchema,
  useExecutingEditSchema
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/roadCleaning/form.js';

const props = defineProps({ secondShow: Boolean, arrowShow: Boolean, arrowState: Boolean });
const emit = defineEmits(['arrow-change']);

// ---------- 状态与数据 ----------
const activeName = ref('全部');
const tabsData = ref([
  { label: '全部' },
  { label: '清扫待执行' },
  { label: '作业进行中' },
  { label: '问题待处置' },
  { label: '质量待核查' },
  { label: '已完成' },
]);

const counts = ref({
  total: 0,
  planStatusCounts: {
    全部: 0,
    清扫待执行: 0,
    作业进行中: 0,
    问题待处置: 0,
    质量待核查: 0,
    已完成: 0,
  },
});

const createLabel = (item) => {
  const key = item.label;
  let count = 0;
  if (key === '全部') {
    count = counts.value.total || 0;
  } else {
    count = counts.value.planStatusCounts?.[key] || 0;
  }
  return `${key} (${count})`;
};

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  searchParams: {},
});

const checkedIds = ref([]);

const loadedOptions = reactive({
  road: [],
  area: [],
  user: [],
  planStatus: [],
  tool: [],
  problemType: [],
  team: [],
});

// 判断当前标签页是否使用接口数据
const isApiTab = computed(() => {
  const apiTabs = ['全部', '清扫待执行', '作业进行中', '已完成', '质量待核查', '问题待处置'];
  return apiTabs.includes(activeName.value);
});

// 判断是否为问题待处置标签页
const isProblemTab = computed(() => activeName.value === '问题待处置');

// 判断是否为作业进行中标签页
const isExecutingTab = computed(() => activeName.value === '作业进行中');

const gridColumns = ref(getColumnsByStatus(activeName.value));

// ---------- 动态搜索表单 ----------
// 道路清扫计划搜索表单
const [RoadSearchForm, roadSearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async () => {
    const rawValues = await roadSearchFormApi.getValues();
    dataObj.searchParams = Object.fromEntries(
      Object.entries(rawValues).filter(([_, v]) => v != null && v !== '')
    );
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: useRoadFormSchema().filter(f => f.searchFilter),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// 问题待处置搜索表单
const [ProblemSearchForm, problemSearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  handleSubmit: async () => {
    const rawValues = await problemSearchFormApi.getValues();
    const filteredParams = {};
    Object.entries(rawValues).forEach(([key, val]) => {
      if (val != null && val !== '') {
        if (key === 'reportTime' && Array.isArray(val)) {
          filteredParams.reportTimeStart = val[0];
          filteredParams.reportTimeEnd = val[1];
        } else {
          filteredParams[key] = val;
        }
      }
    });
    dataObj.searchParams = filteredParams;
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: useProblemFormSchema(),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// 搜索抽屉
const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => searchDrawerApi.close(),
});

// ---------- 编辑表单（道路清扫计划） ----------
const [EditForm, editFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
  layout: 'horizontal',
  schema: useRoadFormSchema(),
  showDefaultActions: false,
});

const formData = ref();
const getTitle = computed(() => (formData.value?.id ? textObj.editText : textObj.addText));

const [EditDrawer, editDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel: () => editDrawerApi.close(),
  async onConfirm() {
    const formValues = await editFormApi.getValues();
    const isAdd = !formData.value?.id;

    // 处理数组字段转JSON字符串（表单值）
    const submitData = { ...formValues };
    if (submitData.staffIds && Array.isArray(submitData.staffIds)) {
      submitData.staffIds = JSON.stringify(submitData.staffIds);
    }
    if (submitData.toolIds && Array.isArray(submitData.toolIds)) {
      submitData.toolIds = JSON.stringify(submitData.toolIds);
    }

    try {
      if (isAdd) {
        await createRoadCleaning(submitData);
      } else {
        const originalData = { ...formData.value };
        delete originalData.staffsName;
        delete originalData.roadName;
        delete originalData.areaName;
        delete originalData.planStatusName;
        delete originalData.toolsName;
        delete originalData.photoUrlList;
        delete originalData.$tableRowIndex;

        const fullData = { ...originalData, ...submitData, id: originalData.id };
        if (fullData.staffIds && Array.isArray(fullData.staffIds)) {
          fullData.staffIds = JSON.stringify(fullData.staffIds);
        }
        if (fullData.toolIds && Array.isArray(fullData.toolIds)) {
          fullData.toolIds = JSON.stringify(fullData.toolIds);
        }
        await updateRoadCleaning(fullData);
      }
      ElMessage.success(isAdd ? '新增成功' : '编辑成功');
      handleRefresh();
      editDrawerApi.close();
    } catch (error) {
      console.error('操作失败', error);
      const errMsg = error?.response?.data?.msg || error?.message || '操作失败，请重试';
      ElMessage.error(errMsg);
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = editDrawerApi.getData();
      if (formData.value?.id) {
        const editData = { ...formData.value };
        if (editData.staffIds && typeof editData.staffIds === 'string') {
          try {
            editData.staffIds = JSON.parse(editData.staffIds);
          } catch {
            editData.staffIds = editData.staffIds.split(',').map(s => s.trim());
          }
        }
        if (editData.toolIds && typeof editData.toolIds === 'string') {
          try {
            editData.toolIds = JSON.parse(editData.toolIds);
          } catch {
            editData.toolIds = editData.toolIds.split(',').map(s => s.trim());
          }
        }
        await editFormApi.setValues(editData);
      } else {
        await editFormApi.resetForm();
        const pendingStatus = loadedOptions.planStatus.find(item => item.label === '待执行');
        if (pendingStatus) {
          editFormApi.setValues({ planStatusId: pendingStatus.value });
        }
      }
    }
  },
});

// 作业进行中编辑表单
const [ExecutingEditForm, executingEditFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
  layout: 'horizontal',
  schema: useExecutingEditSchema(),
  showDefaultActions: false,
});

// 当前编辑的行数据
const currentExecutingRow = ref({});

// 作业进行中编辑抽屉
const [ExecutingEditDrawer, executingEditDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '编辑作业信息',
  onCancel: () => executingEditDrawerApi.close(),
  async onConfirm() {
    const formValues = await executingEditFormApi.getValues();
    const submitData = {
      id: currentExecutingRow.value.id,
      ...formValues,
      // 从原始数据中保留 staffIds（注意格式转换）
      staffIds: currentExecutingRow.value.staffIds,
    };
    const loading = ElLoading.service({ text: '提交中...' });
    try {
      // 如果接口要求 staffIds 为 JSON 字符串，此处需要转换
      if (submitData.staffIds && Array.isArray(submitData.staffIds)) {
        submitData.staffIds = JSON.stringify(submitData.staffIds);
      }
      await updateRoadCleaning(submitData);
      ElMessage.success('更新成功');
      executingEditDrawerApi.close();
      handleRefresh();
    } catch (error) {
      ElMessage.error('更新失败：' + (error.message || '未知错误'));
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const row = currentExecutingRow.value;
      if (row && row.id) {
        // 处理时间字段（表格中可能已转为字符串，需转回时间戳）
        if (formData.checkinTime && typeof formData.checkinTime === 'string') {
          const timestamp = new Date(formData.checkinTime).getTime();
          formData.checkinTime = isNaN(timestamp) ? null : timestamp;
        }
        if (formData.lastReportTime && typeof formData.lastReportTime === 'string') {
          const timestamp = new Date(formData.lastReportTime).getTime();
          formData.lastReportTime = isNaN(timestamp) ? null : timestamp;
        }

        // 处理进度（如果从字符串转数字）
        if (formData.progress && typeof formData.progress === 'string') {
          formData.progress = parseFloat(formData.progress);
        }
        await executingEditFormApi.setValues(formData);
      } else {
        await executingEditFormApi.resetForm();
      }
    }
  },
});

// 处理编辑按钮点击
function handleExecutingEdit(row) {
  currentExecutingRow.value = row;
  executingEditDrawerApi.open();
}

// ---------- 质量核查抽屉 ----------
const [ReviewForm, reviewFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: useReviewFormSchema(),
  showDefaultActions: false,
});

const currentReviewRow = ref({});
const [ReviewDrawer, reviewDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '质量核查',
  onCancel: () => reviewDrawerApi.close(),
  async onConfirm() {
    const formValues = await reviewFormApi.getValues();
    if (!formValues.reviewStatus) {
      ElMessage.warning('请选择核查结果');
      return;
    }
    const loading = ElLoading.service({ text: '提交中...' });
    try {
      const currentUserId = 'admin'; // 示例，实际需替换
      await updateRoadCleaning({
        id: currentReviewRow.value.id,
        reviewStatus: formValues.reviewStatus,
        reformRequire: formValues.reformRequire,
        reviewPhotoUrl: formValues.reviewPhotoUrl,
        reviewBy: currentUserId,
        reviewTime: Date.now(),
      });
      ElMessage.success('核查成功');
      reviewDrawerApi.close();
      handleRefresh();
    } catch (error) {
      ElMessage.error('提交失败：' + (error.message || '未知错误'));
    } finally {
      loading.close();
    }
  },
});

// ---------- 问题待处置相关抽屉 ----------

// 派发抽屉
const [DispatchForm, dispatchFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'teamId',
      label: '处置组',
      component: 'Select',
      componentProps: { placeholder: '请选择处置组', options: [] },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const currentDispatchRow = ref({});
const [DispatchDrawer, dispatchDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '派发问题',
  onCancel: () => dispatchDrawerApi.close(),
  async onConfirm() {
    const formValues = await dispatchFormApi.getValues();
    if (!formValues.teamId) {
      ElMessage.warning('请选择处置组');
      return;
    }
    const loading = ElLoading.service({ text: '派发中...' });
    try {
      await updateCleaningProblem({
        id: currentDispatchRow.value.id,
        teamId: formValues.teamId,
        handleStatus: '处理中', // 派发后状态自动变为处理中
      });
      ElMessage.success('派发成功');
      dispatchDrawerApi.close();
      handleRefresh();
    } catch (error) {
      ElMessage.error('派发失败：' + error.message);
    } finally {
      loading.close();
    }
  },
});

// 反馈抽屉
const [FeedbackForm, feedbackFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'handleResult',
      label: '处置结果',
      component: 'Input',
      componentProps: { type: 'textarea', rows: 3, placeholder: '请输入处置结果' },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const currentFeedbackRow = ref({});
const [FeedbackDrawer, feedbackDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '反馈处置结果',
  onCancel: () => feedbackDrawerApi.close(),
  async onConfirm() {
    const formValues = await feedbackFormApi.getValues();
    if (!formValues.handleResult) {
      ElMessage.warning('请输入处置结果');
      return;
    }
    const loading = ElLoading.service({ text: '提交中...' });
    try {
      await updateCleaningProblem({
        id: currentFeedbackRow.value.id,
        handleResult: formValues.handleResult,
        handleStatus: '已办结',
      });
      ElMessage.success('反馈成功');
      feedbackDrawerApi.close();
      handleRefresh();
    } catch (error) {
      ElMessage.error('提交失败：' + error.message);
    } finally {
      loading.close();
    }
  },
});

// 跟踪抽屉
const [TrackDrawer, trackDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  title: '处置跟踪',
  width: 600,
});
const trackLogs = ref([]);

// ---------- 新增：作业进行中 -> 问题上报抽屉 ----------
const [ReportForm, reportFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: useProblemReportSchema(),
  showDefaultActions: false,
});

const currentReportRow = ref({});
const [ReportDrawer, reportDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '问题上报',
  onCancel: () => reportDrawerApi.close(),
  async onConfirm() {
    const formValues = await reportFormApi.getValues();
    if (!formValues.problemTypeId || !formValues.location || !formValues.problemDesc) {
      ElMessage.warning('请填写完整信息');
      return;
    }
    const loading = ElLoading.service({ text: '提交中...' });
    try {
      const currentUserId = 'admin'; // 示例，实际需替换
      await createCleaningProblem({
        planId: currentReportRow.value.planNo, // 关联计划编号，注意字段名可能需要调整
        problemTypeId: formValues.problemTypeId,
        location: formValues.location,
        problemDesc: formValues.problemDesc,
        reportBy: currentUserId,
        reportTime: Date.now(),
        handleStatus: '待处置',
        isTimeout: '否',
      });
      ElMessage.success('问题上报成功');
      reportDrawerApi.close();
      // 不需要刷新当前表格，因为问题列表在另一标签页
    } catch (error) {
      ElMessage.error('上报失败：' + error.message);
    } finally {
      loading.close();
    }
  },
});

// ---------- 新增表单和抽屉 ----------

// 批量调整表单
const [BatchAdjustForm, batchAdjustFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: useBatchAdjustFormSchema(),
  showDefaultActions: false,
});

// 批量调整抽屉
const [BatchAdjustDrawer, batchAdjustDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '批量调整',
  onCancel: () => batchAdjustDrawerApi.close(),
  async onConfirm() {
    const formValues = await batchAdjustFormApi.getValues();
    ElMessage.info('批量调整功能待实现');
    batchAdjustDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      await batchAdjustFormApi.resetForm();
      await batchAdjustFormApi.updateSchema([
        { fieldName: 'newStaffIds', componentProps: { options: loadedOptions.user } },
      ]);
    }
  },
});

// 批量核查表单
const [BatchReviewForm, batchReviewFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: useBatchReviewFormSchema(),
  showDefaultActions: false,
});

// 批量核查抽屉
const [BatchReviewDrawer, batchReviewDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '批量核查',
  onCancel: () => batchReviewDrawerApi.close(),
  async onConfirm() {
    const formValues = await batchReviewFormApi.getValues();
    ElMessage.info('批量核查功能待实现');
    batchReviewDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      await batchReviewFormApi.resetForm();
    }
  },
});

// 沟通表单
const [CommunicationForm, communicationFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: useCommunicationFormSchema(),
  showDefaultActions: false,
});

// 沟通抽屉
const [CommunicationDrawer, communicationDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '发送提醒',
  onCancel: () => communicationDrawerApi.close(),
  async onConfirm() {
    const formValues = await communicationFormApi.getValues();
    ElMessage.info('沟通功能待实现');
    communicationDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      await communicationFormApi.resetForm();
    }
  },
});

// 复盘表单
const [AftermathForm, aftermathFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: useAftermathFormSchema(),
  showDefaultActions: false,
});

// 复盘抽屉
const [AftermathDrawer, aftermathDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '复盘意见',
  onCancel: () => aftermathDrawerApi.close(),
  async onConfirm() {
    const formValues = await aftermathFormApi.getValues();
    ElMessage.info('复盘功能待实现');
    aftermathDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      await aftermathFormApi.resetForm();
    }
  },
});

// 定位跟踪抽屉
const [TrackLocationDrawer, trackLocationDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '定位跟踪',
  footer: false,
  width: 600,
});

// ---------- 详情抽屉引用 ----------
const parkDetailDrawerRef = ref(null);
const problemDetailDrawerRef = ref(null);

// ---------- 数据转换函数（道路清扫计划） ----------
function convertRoadCleaningItem(item) {
  // 处理人员ID数组
  let staffIds = item.staffIds;
  if (typeof staffIds === 'string') {
    try {
      staffIds = JSON.parse(staffIds);
    } catch {
      staffIds = staffIds ? staffIds.split(',').map(s => s.trim()) : [];
    }
  }
  // 处理工具ID数组
  let toolIds = item.toolIds;
  if (typeof toolIds === 'string') {
    try {
      toolIds = JSON.parse(toolIds);
    } catch {
      toolIds = toolIds ? toolIds.split(',').map(s => s.trim()) : [];
    }
  }
  // 处理照片URL数组
  let checkPhotoUrl = item.checkPhotoUrl;
  let photoList = [];
  if (typeof checkPhotoUrl === 'string') {
    try {
      const parsed = JSON.parse(checkPhotoUrl);
      if (Array.isArray(parsed)) {
        photoList = parsed;
        checkPhotoUrl = parsed[0] || '';
      } else {
        photoList = [checkPhotoUrl];
      }
    } catch {
      if (checkPhotoUrl && checkPhotoUrl.includes(',')) {
        photoList = checkPhotoUrl.split(',').map(url => url.trim());
        checkPhotoUrl = photoList[0] || '';
      } else {
        photoList = checkPhotoUrl ? [checkPhotoUrl] : [];
      }
    }
  } else if (Array.isArray(checkPhotoUrl)) {
    photoList = checkPhotoUrl;
    checkPhotoUrl = photoList[0] || '';
  }

  // 根据 reviewBy 映射 reviewByName
  let reviewByName = '-';
  if (item.reviewBy && loadedOptions.user.length) {
    const user = loadedOptions.user.find(u => u.value === item.reviewBy);
    reviewByName = user ? user.label : item.reviewBy;
  }

  return {
    ...item,
    staffIds,
    toolIds,
    checkPhotoUrl,
    photoUrlList: photoList,
    reviewByName,
    createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '-',
    updateTime: item.updateTime ? new Date(item.updateTime).toLocaleString() : '-',
    checkinTime: item.checkinTime ? new Date(item.checkinTime).toLocaleString() : '-',
    lastReportTime: item.lastReportTime ? new Date(item.lastReportTime).toLocaleString() : '-',
    completeTime: item.completeTime ? new Date(item.completeTime).toLocaleString() : '-',
    reviewTime: item.reviewTime ? new Date(item.reviewTime).toLocaleString() : '-',
  };
}

// ---------- 数据转换函数（问题） ----------
function convertProblemItem(item) {
  return {
    ...item,
    reportTime: item.reportTime ? new Date(item.reportTime).toLocaleString() : '-',
    createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '-',
    updateTime: item.updateTime ? new Date(item.updateTime).toLocaleString() : '-',
  };
}

// ---------- 获取表格数据 ----------
const getTableData = async ({ page }) => {
  if (!isApiTab.value) {
    return { list: [], total: 0 };
  }

  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
  };

  try {
    let res;
    if (isProblemTab.value) {
      res = await getCleaningProblemPage(params);
    } else {
      // 道路清扫计划相关接口
      const tabToStatusLabel = {
        '清扫待执行': '待执行',
        '作业进行中': '执行中',
        '已完成': '已完成',
        '质量待核查': '待核查',
      };
      if (activeName.value !== '全部') {
        const targetLabel = tabToStatusLabel[activeName.value];
        if (targetLabel) {
          const statusItem = loadedOptions.planStatus.find(item => item.label === targetLabel);
          if (statusItem) {
            params.planStatusId = statusItem.value;
          }
        }
      }
      res = await getRoadCleaningPage(params);
    }

    const listData = res.data?.list || res.list || [];
    const total = res.data?.total || res.total || 0;

    const convertedList = isProblemTab.value
      ? listData.map(convertProblemItem)
      : listData.map(convertRoadCleaningItem);

    dataObj.total = total;
    dataObj.list = convertedList;
    return dataObj;
  } catch (error) {
    console.error('获取数据失败', error);
    ElMessage.error('数据加载失败，请重试');
    dataObj.total = 0;
    dataObj.list = [];
    return dataObj;
  }
};

// ---------- Grid 配置 ----------
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
  gridEvents: {
    checkboxAll: ({ records }) => {
      checkedIds.value = records.map(item => item.id);
    },
    checkboxChange: ({ records }) => {
      checkedIds.value = records.map(item => item.id);
    },
  },
  showSearchForm: false,
});

watch(activeName, (newVal) => {
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) {
    gridApi.xGrid.refreshColumn();
  } else {
    gridApi.setGridOptions?.({ columns: gridColumns.value });
  }
  dataObj.searchParams = {};
  searchDrawerApi.close();
  parkDetailDrawerRef.value?.close();
  problemDetailDrawerRef.value?.close();
  handleRefresh();
});

// ---------- 操作函数 ----------
function handleRefresh() {
  gridApi.query();
}

function handleClick() {
  gridApi.query();
}

function handleSerachShow() {
  if (isProblemTab.value) {
    problemSearchFormApi.resetForm();
  } else {
    roadSearchFormApi.resetForm();
  }
  searchDrawerApi.open();
}

function handleFullShow() {
  screenfull.toggle();
}

function handleCreate() {
  editDrawerApi.setData({}).open();
}

function handleEdit(row) {
  editDrawerApi.setData(row).open();
}

async function handleDelete(row) {
  const loading = ElLoading.service({ text: $t('ui.actionMessage.deleting', [row.planNo || row.problemId]) });
  try {
    if (isProblemTab.value) {
      await deleteCleaningProblem(row.id);
    } else {
      await deleteRoadCleaning(row.id);
    }
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } catch (error) {
    ElMessage.error('删除失败：' + (error.message || '未知错误'));
  } finally {
    loading.close();
  }
}

async function handleDeleteBatch() {
  if (isEmpty(checkedIds.value)) return;
  await confirm($t('确定删除这些数据吗？'));
  const loading = ElLoading.service({ text: $t('ui.actionMessage.deletingBatch') });
  try {
    if (isProblemTab.value) {
      await deleteCleaningProblemBatch(checkedIds.value);
    } else {
      await deleteRoadCleaningBatch(checkedIds.value);
    }
    checkedIds.value = [];
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } catch (error) {
    ElMessage.error('批量删除失败：' + error.message);
  } finally {
    loading.close();
  }
}

// 批量处理（问题待处置）
async function handleBatchProcess() {
  if (isEmpty(checkedIds.value)) return;
  try {
    const { value } = await ElMessageBox.prompt('请选择操作', '批量处理', {
      inputType: 'select',
      inputOptions: [
        { label: '派发', value: 'dispatch' },
        { label: '标记为已办结', value: 'complete' },
      ],
      inputPlaceholder: '请选择',
      confirmButtonText: '确认',
    });
    if (!value) return;

    const loading = ElLoading.service({ text: '处理中...' });
    try {
      if (value === 'dispatch') {
        const { value: teamId } = await ElMessageBox.prompt('请选择处置组', '批量派发', {
          inputType: 'select',
          inputOptions: loadedOptions.team.map(t => ({ label: t.label, value: t.value })),
          inputPlaceholder: '请选择',
        });
        if (!teamId) return;
        await Promise.all(checkedIds.value.map(id =>
          updateCleaningProblem({ id, teamId, handleStatus: '处理中' })
        ));
      } else {
        await Promise.all(checkedIds.value.map(id =>
          updateCleaningProblem({ id, handleStatus: '已办结' })
        ));
      }
      ElMessage.success('批量处理成功');
      checkedIds.value = [];
      handleRefresh();
    } catch (error) {
      ElMessage.error('批量处理失败：' + error.message);
    } finally {
      loading.close();
    }
  } catch (e) {
    // 取消
  }
}

// 单条数据核查（质量待核查）
function handleReview(row) {
  currentReviewRow.value = row;
  reviewFormApi.resetForm();
  // 可选：回显已有数据（如编辑时）
  // if (row.reviewStatus) {
  //   reviewFormApi.setValues({
  //     reviewStatus: row.reviewStatus,
  //     reformRequire: row.reformRequire,
  //     reviewPhotoUrl: row.reviewPhotoUrl
  //   });
  // }
  reviewDrawerApi.open();
}

// 派发
function handleDispatch(row) {
  currentDispatchRow.value = row;
  dispatchFormApi.resetForm();
  if (row.teamId) {
    dispatchFormApi.setValues({ teamId: row.teamId });
  }
  dispatchDrawerApi.open();
}

// 反馈
function handleFeedback(row) {
  currentFeedbackRow.value = row;
  feedbackFormApi.resetForm();
  if (row.handleResult) {
    feedbackFormApi.setValues({ handleResult: row.handleResult });
  }
  feedbackDrawerApi.open();
}

// 问题上报（作业进行中）
function handleReport(row) {
  currentReportRow.value = row;
  reportFormApi.resetForm();
  reportDrawerApi.open();
}

// 导出
async function handleExport() {
  const params = dataObj.searchParams || {};
  try {
    let response;
    let fileName;
    if (isProblemTab.value) {
      response = await exportCleaningProblemExcel(params);
      fileName = `问题列表_${new Date().toLocaleDateString()}.xlsx`;
    } else {
      response = await exportRoadCleaningExcel(params);
      fileName = `道路清扫计划_${new Date().toLocaleDateString()}.xlsx`;
    }

    const blob = response.data || response;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    ElMessage.error('导出失败：' + (error.message || '未知错误'));
  }
}

// 详情
function handleOpenDetail(row) {
  if (isProblemTab.value) {
    problemDetailDrawerRef.value?.open(row);
  } else {
    dataObj.detailObj = row;
    parkDetailDrawerRef.value?.open();
  }
}

function handleOpenAreaFilter(area) {
  activeName.value = '全部';
  dataObj.searchParams = { area };
  gridApi.reload();
}

function handleOpenStatusFilter(status) {
  const targetTab = status;
  activeName.value = targetTab;
  gridApi.reload();
}

function handleOpenProblemDetail(row) {
  problemDetailDrawerRef.value?.open(row);
}

const arrowChange = () => emit('arrow-change');

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

async function loadStatistics() {
  counts.value.total = 10;
  counts.value.planStatusCounts = {
    全部: 10,
    清扫待执行: 2,
    作业进行中: 2,
    问题待处置: 2,
    质量待核查: 2,
    已完成: 2,
  };
}

async function loadOptions() {
  try {
    const [
      roadOptionsRes,
      areaOptionsRes,
      userOptionsRes,
      planStatusOptionsRes,
      toolOptionsRes,
      problemTypeOptionsRes,
      teamOptionsRes,
    ] = await Promise.all([
      getRoadOptions(),
      getAreaOptions(),
      getUserOptions(),
      getPlanStatusOptions(),
      getToolOptions(),
      getProblemTypeOptions(),
      getTeamOptions(),
    ]);

    const extractData = (res) => {
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    };

    loadedOptions.road = extractData(roadOptionsRes);
    loadedOptions.area = extractData(areaOptionsRes);
    loadedOptions.user = extractData(userOptionsRes);
    loadedOptions.planStatus = extractData(planStatusOptionsRes);
    loadedOptions.tool = extractData(toolOptionsRes);
    loadedOptions.problemType = extractData(problemTypeOptionsRes);
    loadedOptions.team = extractData(teamOptionsRes);

    // 更新道路编辑表单
    await editFormApi.updateSchema([
      { fieldName: 'roadId', componentProps: { options: loadedOptions.road } },
      { fieldName: 'areaCode', componentProps: { options: loadedOptions.area } },
      { fieldName: 'staffIds', componentProps: { options: loadedOptions.user } },
      { fieldName: 'planStatusId', componentProps: { options: loadedOptions.planStatus } },
      { fieldName: 'toolIds', componentProps: { options: loadedOptions.tool } },
      { fieldName: 'reviewBy', componentProps: { options: loadedOptions.user } },
    ]);

    // 更新道路搜索表单
    await roadSearchFormApi.updateSchema([
      { fieldName: 'roadId', componentProps: { options: loadedOptions.road } },
      { fieldName: 'areaCode', componentProps: { options: loadedOptions.area } },
      { fieldName: 'staffIds', componentProps: { options: loadedOptions.user } },
      { fieldName: 'planStatusId', componentProps: { options: loadedOptions.planStatus } },
    ]);

    // 更新问题搜索表单
    await problemSearchFormApi.updateSchema([
      { fieldName: 'problemTypeId', componentProps: { options: loadedOptions.problemType } },
      { fieldName: 'reportBy', componentProps: { options: loadedOptions.user } },
      { fieldName: 'teamId', componentProps: { options: loadedOptions.team } },
    ]);

    // 更新派发表单
    await dispatchFormApi.updateSchema([
      { fieldName: 'teamId', componentProps: { options: loadedOptions.team } },
    ]);

    // 更新问题上报表单
    await reportFormApi.updateSchema([
      { fieldName: 'problemTypeId', componentProps: { options: loadedOptions.problemType } },
    ]);

    console.log('所有选项加载成功');
  } catch (error) {
    console.error('加载选项失败', error);
    ElMessage.error('加载选项失败，请刷新重试');
  }
}

// ---------- 新增按钮对应的处理函数 ----------
function handleBatchAdjust() {
  if (isEmpty(checkedIds.value)) return;
  batchAdjustDrawerApi.open();
}
function handleBatchReview() {
  if (isEmpty(checkedIds.value)) return;
  batchReviewDrawerApi.open();
}
function handleStatistics() {
  statisticsDrawerApi.open();
}
function handleTrackLocation() {
  trackLocationDrawerApi.open();
}
function handleTrack(row) {
  ElMessage.info('跟踪功能待实现');
  // 可打开 TrackDrawer 并加载日志
}
function handleStart(row) {
  ElMessageBox.confirm('确定启动该清扫计划吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info',
  }).then(() => {
    ElMessage.info('启动执行功能待实现');
  }).catch(() => {});
}
function handleCommunicate(row) {
  communicationDrawerApi.setData(row).open();
}
function handleTrackRectify(row) {
  ElMessage.info('跟踪整改功能待实现');
}
function handleAftermath(row) {
  aftermathDrawerApi.setData(row).open();
}

onMounted(async () => {
  await loadOptions();
  await loadStatistics();
  handleRefresh();
});
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 道路清扫计划编辑抽屉 -->
    <EditDrawer :title="getTitle">
      <EditForm />
    </EditDrawer>

    <!-- 作业进行中编辑抽屉 -->
    <ExecutingEditDrawer>
      <ExecutingEditForm />
    </ExecutingEditDrawer>

    <!-- 质量核查抽屉 -->
    <ReviewDrawer>
      <ReviewForm />
    </ReviewDrawer>

    <!-- 问题派发抽屉 -->
    <DispatchDrawer>
      <DispatchForm />
    </DispatchDrawer>

    <!-- 问题反馈抽屉 -->
    <FeedbackDrawer>
      <FeedbackForm />
    </FeedbackDrawer>

    <!-- 问题上报抽屉（作业进行中） -->
    <ReportDrawer>
      <ReportForm />
    </ReportDrawer>

    <!-- 批量调整抽屉 -->
    <BatchAdjustDrawer>
      <BatchAdjustForm />
    </BatchAdjustDrawer>

    <!-- 批量核查抽屉 -->
    <BatchReviewDrawer>
      <BatchReviewForm />
    </BatchReviewDrawer>

    <!-- 沟通抽屉 -->
    <CommunicationDrawer>
      <CommunicationForm />
    </CommunicationDrawer>

    <!-- 复盘抽屉 -->
    <AftermathDrawer>
      <AftermathForm />
    </AftermathDrawer>

    <!-- 定位跟踪抽屉 -->
    <TrackLocationDrawer>
      <div>地图定位跟踪待实现</div>
    </TrackLocationDrawer>

    <!-- 问题跟踪抽屉 -->
    <TrackDrawer>
      <div v-if="trackLogs.length" class="track-logs">
        <div v-for="(log, idx) in trackLogs" :key="idx" class="log-item">
          <div class="log-time">{{ log.time }}</div>
          <div class="log-content">{{ log.content }}</div>
        </div>
      </div>
      <div v-else>暂无跟踪日志</div>
    </TrackDrawer>

    <!-- 道路清扫计划详情抽屉 -->
    <ParkDetailDrawer ref="parkDetailDrawerRef" :detail-obj="dataObj.detailObj" />

    <!-- 问题详情抽屉 -->
    <ProblemDetailDrawer ref="problemDetailDrawerRef" />

    <!-- 搜索抽屉（动态内容） -->
    <SearchDrawer title="搜索">
      <RoadSearchForm v-if="!isProblemTab" />
      <ProblemSearchForm v-else />
    </SearchDrawer>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs" v-if="props.secondShow">
          <el-tabs v-model="activeName" @tab-change="handleClick">
            <el-tab-pane
              v-for="item in tabsData"
              :key="item.label"
              :label="createLabel(item)"
              :name="item.label"
            />
          </el-tabs>
        </div>
      </template>

      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton content="导出" icon-name="download" @click="handleExport" />
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />

          <template v-if="activeName === '清扫待执行'">
            <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
            <IconButton
              content="批量调整"
              icon-name="Edit"
              color="#409EFF"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchAdjust"
            />
          </template>

          <template v-if="activeName === '作业进行中'">
            <IconButton
              content="定位跟踪"
              icon-name="Location"
              color="#409EFF"
              @click="handleTrackLocation"
            />
          </template>

          <template v-if="isProblemTab">
            <IconButton
              content="批量处理"
              icon-name="Checked"
              color="#409EFF"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchProcess"
            />
          </template>

          <template v-if="activeName === '质量待核查'">
            <IconButton
              content="批量核查"
              icon-name="Checked"
              color="#409EFF"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchReview"
            />
          </template>

          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
          <IconButton
            :content="showChart ? '隐藏图表' : '显示图表'"
            icon-name="PieChart"
            @click="toggleChart"
          />
        </div>
      </template>

      <!-- 钻取列自定义渲染 -->
      <template #planNo="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">{{
            row.planNo || row.problemId
          }}</el-text>
      </template>
      <template #roadName="{ row }">
        <el-text v-if="!isProblemTab" @click="handleOpenAreaFilter(row.roadName)" type="primary">
          {{ row.roadName }}
        </el-text>
      </template>
      <template #area="{ row }">
        <el-text v-if="!isProblemTab" @click="handleOpenAreaFilter(row.areaName)" type="primary">
          {{ row.areaName }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-text v-if="!isProblemTab" @click="handleOpenStatusFilter(row.planStatusName)" type="primary">
          {{ row.planStatusName }}
        </el-text>
      </template>
      <template #problemId="{ row }">
        <el-text v-if="isProblemTab" @click="handleOpenDetail(row)" type="primary">{{
            row.problemId
          }}</el-text>
      </template>
      <template #problemType="{ row }">
        <el-text v-if="isProblemTab" @click="handleOpenProblemDetail(row)" type="primary">
          {{ row.problemTypeName }}
        </el-text>
      </template>
      <template #checkPhotoUrl="{ row }">
        <el-image
          v-if="!isProblemTab && row.checkPhotoUrl"
          :src="row.checkPhotoUrl"
          :preview-src-list="row.photoUrlList"
          fit="cover"
          style="width: 40px; height: 40px; border-radius: 4px; cursor: pointer;"
          :preview-teleported="true"
        />
        <span v-else>-</span>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />

          <!-- 全部标签页 -->
          <template v-if="activeName === '全部'">
            <IconButton content="跟踪" icon-name="TrendCharts" @click="handleTrack(row)" />
          </template>

          <!-- 清扫待执行标签页 -->
          <template v-else-if="activeName === '清扫待执行'">
            <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
            <IconButton content="启动执行" icon-name="CaretRight" @click="handleStart(row)" />
          </template>

          <!-- 作业进行中标签页 -->
          <template v-else-if="activeName === '作业进行中'">
            <IconButton content="编辑" icon-name="edit" @click="handleExecutingEdit(row)" />
            <IconButton content="沟通" icon-name="ChatDotRound" @click="handleCommunicate(row)" />
            <IconButton content="问题上报" icon-name="Warning" @click="handleReport(row)" />
          </template>

          <!-- 问题待处置标签页 -->
          <template v-else-if="activeName === '问题待处置'">
            <IconButton content="派发" icon-name="Share" @click="handleDispatch(row)" />
            <IconButton content="反馈" icon-name="Checked" @click="handleFeedback(row)" />
            <IconButton content="跟踪" icon-name="TrendCharts" @click="handleTrack(row)" />
          </template>

          <!-- 质量待核查标签页 -->
          <template v-else-if="activeName === '质量待核查'">
            <IconButton content="核查" icon-name="Checked" @click="handleReview(row)" />
            <IconButton content="跟踪整改" icon-name="AlarmClock" @click="handleTrackRectify(row)" />
          </template>

          <!-- 已完成标签页 -->
          <template v-else-if="activeName === '已完成'">
            <IconButton content="复盘" icon-name="DataAnalysis" @click="handleAftermath(row)" />
          </template>

          <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" />
        </div>
      </template>

      <template #bottom>
        <div class="common-total" @click="dataObj.totalShow = !dataObj.totalShow">
          <el-icon>
            <ArrowDown v-if="!dataObj.totalShow" />
            <ArrowUp v-else />
          </el-icon>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <div v-if="dataObj.totalShow && showChart && activeName !== '全部'" class="bottom-chart-wrapper">
            <Chart2 :active-name="activeName" :data-list="dataObj.list" />
          </div>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.track-logs {
  padding: 16px;
}
.log-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 0;
}
.log-time {
  font-size: 12px;
  color: #999;
}
.log-content {
  margin-top: 4px;
}
</style>
