<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElImage, ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';
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
  batchAdjustRoadCleaning,
  batchProcessCleaningProblem,
  getCleaningStatistics,
  uploadImageBatch,
  deleteFile
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
  useExecutingEditSchema,
  getHandleStatusOptions,
  useBatchProblemSchema,
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

// ---------- 标签筛选 ----------
const tagFilters = ref({});

function handleFilterTagClick(field, value) {
  if (!field || value == null) return;
  if (tagFilters.value[field] === value) {
    delete tagFilters.value[field];
  } else {
    tagFilters.value[field] = value;
  }
  gridApi.reload();
}

function removeFilterTag(field) {
  delete tagFilters.value[field];
  gridApi.reload();
}

function getFieldLabel(field) {
  const map = {
    roadId: '清扫路段',
    areaCode: '责任区域',
    planStatusId: '计划状态',
  };
  return map[field] || field;
}

function getTagDisplayText(field, id) {
  if (id == null) return '';
  let options = [];
  switch (field) {
    case 'roadId':
      options = loadedOptions.road;
      break;
    case 'areaCode':
      options = loadedOptions.area;
      break;
    case 'planStatusId':
      options = loadedOptions.planStatus;
      break;
    default:
      return id;
  }
  const found = options.find(opt => opt.value === id);
  return found ? found.label : id;
}

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
  handleStatus: [],
});

const isApiTab = computed(() => {
  const apiTabs = ['全部', '清扫待执行', '作业进行中', '已完成', '质量待核查', '问题待处置'];
  return apiTabs.includes(activeName.value);
});

const isProblemTab = computed(() => activeName.value === '问题待处置');
const isExecutingTab = computed(() => activeName.value === '作业进行中');

const gridColumns = ref(getColumnsByStatus(activeName.value));

// ---------- 动态搜索表单 ----------
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

// ========== 编辑抽屉图片列表 ==========
const editImageList = ref([]);

// 独立图片上传函数（参考公厕模块）
const handleEditImageUpload = async (event) => {
  const files = event.target.files;
  if (files.length === 0) return;

  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  const loading = ElLoading.service({ text: '上传中...' });
  try {
    const res = await uploadImageBatch(formData);
    let newUrls = [];
    if (Array.isArray(res)) {
      newUrls = res;
    } else if (res?.code === 0 && Array.isArray(res.data)) {
      newUrls = res.data;
    } else if (res?.data && Array.isArray(res.data)) {
      newUrls = res.data;
    } else {
      ElMessage.error(res?.msg || '上传失败，响应格式不正确');
      return;
    }
    editImageList.value = [...editImageList.value, ...newUrls];
    ElMessage.success('上传成功');
  } catch (error) {
    console.error('上传图片异常', error);
    ElMessage.error(`上传图片失败：${error.message}`);
  } finally {
    loading.close();
    event.target.value = '';
  }
};

// 编辑抽屉图片删除（使用通用删除接口）
const handleEditImageDelete = async (url) => {
  const loading = ElLoading.service({ text: '删除中...' });
  try {
    const res = await deleteFile(url);
    const isSuccess = res === true || res?.code === 0 || res?.success === true || res === '';
    if (isSuccess) {
      editImageList.value = editImageList.value.filter(item => item !== url);
      ElMessage.success('删除成功');
    } else {
      const errMsg = typeof res === 'string' ? res : JSON.stringify(res);
      ElMessage.error(`删除失败：${errMsg}`);
      console.error('删除失败，响应详情:', res);
    }
  } catch (error) {
    console.error('删除图片异常', error);
    ElMessage.error(`删除图片失败：${error.message}`);
  } finally {
    loading.close();
  }
};

// 辅助函数：从字段解析图片列表
const loadImageListFromField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
      return [value];
    } catch {
      if (value.includes(',')) {
        return value.split(',').map(url => url.trim());
      }
      return [value];
    }
  }
  return [];
};

const [EditDrawer, editDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel: () => {
    editImageList.value = [];
    editDrawerApi.close();
  },
  async onConfirm() {
    const formValues = await editFormApi.getValues();
    const isAdd = !formData.value?.id;

    // 直接使用图片列表
    formValues.checkPhotoUrl = editImageList.value.length > 0 ? JSON.stringify(editImageList.value) : '';

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
        editImageList.value = loadImageListFromField(formData.value.checkPhotoUrl);
      } else {
        await editFormApi.resetForm();
        const pendingStatus = loadedOptions.planStatus.find(item => item.label === '未开始');
        if (pendingStatus) {
          editFormApi.setValues({ planStatusId: pendingStatus.value });
        }
        editImageList.value = [];
      }
    } else {
      editImageList.value = [];
    }
  },
});

// ---------- 作业进行中编辑表单 ----------
const [ExecutingEditForm, executingEditFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
  layout: 'horizontal',
  schema: useExecutingEditSchema(),
  showDefaultActions: false,
});

const currentExecutingRow = ref({});

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
      staffIds: currentExecutingRow.value.staffIds,
    };
    const loading = ElLoading.service({ text: '提交中...' });
    try {
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
        const formValues = { ...row };
        if (formValues.checkinTime && typeof formValues.checkinTime === 'string') {
          const timestamp = new Date(formValues.checkinTime).getTime();
          formValues.checkinTime = isNaN(timestamp) ? null : timestamp;
        }
        if (formValues.lastReportTime && typeof formValues.lastReportTime === 'string') {
          const timestamp = new Date(formValues.lastReportTime).getTime();
          formValues.lastReportTime = isNaN(timestamp) ? null : timestamp;
        }
        if (formValues.progress && typeof formValues.progress === 'string') {
          formValues.progress = parseFloat(formValues.progress);
        }
        if (!formValues.planStatusId) {
          const executingStatus = loadedOptions.planStatus.find(item => item.label === '进行中');
          if (executingStatus) {
            formValues.planStatusId = executingStatus.value;
          }
        }
        await executingEditFormApi.setValues(formValues);
      } else {
        await executingEditFormApi.resetForm();
      }
    }
  }
});

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
const reviewImageList = ref([]);

// 核查抽屉图片上传
const handleReviewImageUpload = async (event) => {
  const files = event.target.files;
  if (files.length === 0) return;

  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  const loading = ElLoading.service({ text: '上传中...' });
  try {
    const res = await uploadImageBatch(formData);
    let newUrls = [];
    if (Array.isArray(res)) {
      newUrls = res;
    } else if (res?.code === 0 && Array.isArray(res.data)) {
      newUrls = res.data;
    } else if (res?.data && Array.isArray(res.data)) {
      newUrls = res.data;
    } else {
      ElMessage.error(res?.msg || '上传失败，响应格式不正确');
      return;
    }
    reviewImageList.value = [...reviewImageList.value, ...newUrls];
    ElMessage.success('上传成功');
  } catch (error) {
    console.error('上传图片异常', error);
    ElMessage.error(`上传图片失败：${error.message}`);
  } finally {
    loading.close();
    event.target.value = '';
  }
};

// 核查抽屉图片删除（使用通用删除接口）
const handleReviewImageDelete = async (url) => {
  const loading = ElLoading.service({ text: '删除中...' });
  try {
    const res = await deleteFile(url);
    const isSuccess = res === true || res?.code === 0 || res?.success === true || res === '';
    if (isSuccess) {
      reviewImageList.value = reviewImageList.value.filter(item => item !== url);
      ElMessage.success('删除成功');
    } else {
      const errMsg = typeof res === 'string' ? res : JSON.stringify(res);
      ElMessage.error(`删除失败：${errMsg}`);
      console.error('删除失败，响应详情:', res);
    }
  } catch (error) {
    console.error('删除图片异常', error);
    ElMessage.error(`删除图片失败：${error.message}`);
  } finally {
    loading.close();
  }
};

const [ReviewDrawer, reviewDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '质量核查',
  onCancel: () => {
    reviewImageList.value = [];
    reviewDrawerApi.close();
  },
  async onConfirm() {
    const formValues = await reviewFormApi.getValues();
    if (!formValues.reviewStatus) {
      ElMessage.warning('请选择核查结果');
      return;
    }
    const loading = ElLoading.service({ text: '提交中...' });
    try {
      const currentUserId = 'admin';
      await updateRoadCleaning({
        id: currentReviewRow.value.id,
        reviewStatus: formValues.reviewStatus,
        reformRequire: formValues.reformRequire,
        reviewPhotoUrl: reviewImageList.value.length > 0 ? JSON.stringify(reviewImageList.value) : '',
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
  async onOpenChange(isOpen) {
    if (isOpen) {
      const row = currentReviewRow.value;
      if (row && row.id) {
        reviewImageList.value = loadImageListFromField(row.reviewPhotoUrl);
        await reviewFormApi.setValues({
          reviewStatus: row.reviewStatus || '',
          reformRequire: row.reformRequire || '',
          reviewPhotoUrl: reviewImageList.value.length > 0 ? JSON.stringify(reviewImageList.value) : '',
        });
      } else {
        await reviewFormApi.resetForm();
        reviewImageList.value = [];
      }
    } else {
      reviewImageList.value = [];
    }
  },
});

// ---------- 问题待处置相关抽屉 ----------
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
        handleStatus: '处理中',
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

const [TrackDrawer, trackDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  title: '处置跟踪',
  width: 600,
});
const trackLogs = ref([]);

// ---------- 作业进行中 -> 问题上报抽屉 ----------
const [ReportForm, reportFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: useProblemReportSchema(),
  showDefaultActions: false,
});

const currentReportRow = ref({});
const reportImageList = ref([]);

// 上报抽屉图片上传
const handleReportImageUpload = async (event) => {
  const files = event.target.files;
  if (files.length === 0) return;

  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  const loading = ElLoading.service({ text: '上传中...' });
  try {
    const res = await uploadImageBatch(formData);
    let newUrls = [];
    if (Array.isArray(res)) {
      newUrls = res;
    } else if (res?.code === 0 && Array.isArray(res.data)) {
      newUrls = res.data;
    } else if (res?.data && Array.isArray(res.data)) {
      newUrls = res.data;
    } else {
      ElMessage.error(res?.msg || '上传失败，响应格式不正确');
      return;
    }
    reportImageList.value = [...reportImageList.value, ...newUrls];
    ElMessage.success('上传成功');
  } catch (error) {
    console.error('上传图片异常', error);
    ElMessage.error(`上传图片失败：${error.message}`);
  } finally {
    loading.close();
    event.target.value = '';
  }
};

// 上报抽屉图片删除（使用通用删除接口）
const handleReportImageDelete = async (url) => {
  const loading = ElLoading.service({ text: '删除中...' });
  try {
    const res = await deleteFile(url);
    const isSuccess = res === true || res?.code === 0 || res?.success === true || res === '';
    if (isSuccess) {
      reportImageList.value = reportImageList.value.filter(item => item !== url);
      ElMessage.success('删除成功');
    } else {
      const errMsg = typeof res === 'string' ? res : JSON.stringify(res);
      ElMessage.error(`删除失败：${errMsg}`);
      console.error('删除失败，响应详情:', res);
    }
  } catch (error) {
    console.error('删除图片异常', error);
    ElMessage.error(`删除图片失败：${error.message}`);
  } finally {
    loading.close();
  }
};

const [ReportDrawer, reportDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '问题上报',
  onCancel: () => {
    reportImageList.value = [];
    reportDrawerApi.close();
  },
  async onConfirm() {
    const formValues = await reportFormApi.getValues();
    if (!formValues.problemTypeId || !formValues.location || !formValues.problemDesc) {
      ElMessage.warning('请填写完整信息');
      return;
    }
    const loading = ElLoading.service({ text: '提交中...' });
    try {
      const currentUserId = 'admin';
      await createCleaningProblem({
        planId: currentReportRow.value.planNo,
        problemTypeId: formValues.problemTypeId,
        location: formValues.location,
        problemDesc: formValues.problemDesc,
        reportBy: currentUserId,
        reportTime: Date.now(),
        handleStatus: '待处置',
        isTimeout: '否',
        localePhotoUrl: reportImageList.value.length > 0 ? JSON.stringify(reportImageList.value) : '',
      });
      ElMessage.success('问题上报成功');
      reportDrawerApi.close();
    } catch (error) {
      ElMessage.error('上报失败：' + error.message);
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const row = currentReportRow.value;
      if (row && row.id) {
        reportImageList.value = loadImageListFromField(row.photoUrls);
        await reportFormApi.setValues({
          problemTypeId: row.problemTypeId || '',
          location: row.location || '',
          problemDesc: row.problemDesc || '',
          reportBy: row.reportBy || '',
          reportTime: row.reportTime || Date.now(),
          handleStatus: row.handleStatus || '待处置',
        });
      } else {
        await reportFormApi.resetForm();
        reportImageList.value = [];
      }
    } else {
      reportImageList.value = [];
    }
  },
});

// ---------- 批量调整等抽屉 ----------
const [BatchAdjustForm, batchAdjustFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: useBatchAdjustFormSchema(),
  showDefaultActions: false,
});

const [BatchAdjustDrawer, batchAdjustDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '批量调整',
  onCancel: () => batchAdjustDrawerApi.close(),
  async onConfirm() {
    const formValues = await batchAdjustFormApi.getValues();
    const { adjustType, newTimePeriod, newFrequency, newStaffIds } = formValues;

    if (checkedIds.value.length === 0) {
      ElMessage.warning('请至少选择一条保洁任务');
      return;
    }

    let adjustDimension = '';
    let adjustValue = '';

    switch (adjustType) {
      case 'timePeriod':
        if (!newTimePeriod) {
          ElMessage.warning('请选择新清扫时段');
          return;
        }
        adjustDimension = 'time_period';
        adjustValue = newTimePeriod;
        break;
      case 'frequency':
        if (!newFrequency) {
          ElMessage.warning('请选择新清扫频次');
          return;
        }
        adjustDimension = 'frequency';
        adjustValue = newFrequency;
        break;
      case 'staffIds':
        if (!newStaffIds || newStaffIds.length === 0) {
          ElMessage.warning('请选择新负责人员');
          return;
        }
        adjustDimension = 'staff';
        adjustValue = JSON.stringify(newStaffIds);
        break;
      default:
        ElMessage.warning('请选择调整维度');
        return;
    }

    const params = {
      ids: checkedIds.value,
      adjustDimension,
      adjustValue,
    };

    const loading = ElLoading.service({ text: '批量调整中...' });
    try {
      const res = await batchAdjustRoadCleaning(params);
      const isSuccess = res?.code === 0 || res === true;
      if (isSuccess) {
        ElMessage.success('批量调整成功');
        batchAdjustDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(res?.msg || '调整失败');
      }
    } catch (error) {
      ElMessage.error(`调整失败：${error.message}`);
    } finally {
      loading.close();
    }
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

const [BatchReviewForm, batchReviewFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: useBatchReviewFormSchema(),
  showDefaultActions: false,
});

const [BatchReviewDrawer, batchReviewDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '批量核查',
  onCancel: () => batchReviewDrawerApi.close(),
  async onConfirm() {
    const formValues = await batchReviewFormApi.getValues();
    const { reviewStatus, reformRequire } = formValues;

    if (checkedIds.value.length === 0) {
      ElMessage.warning('请至少选择一条保洁任务');
      return;
    }
    if (!reviewStatus) {
      ElMessage.warning('请选择核查结果');
      return;
    }

    const params = {
      ids: checkedIds.value,
      adjustDimension: 'review_status',
      adjustValue: reviewStatus,
      adjustRemark: reformRequire || '',
    };

    const loading = ElLoading.service({ text: '批量核查中...' });
    try {
      const res = await batchAdjustRoadCleaning(params);
      const isSuccess = res?.code === 0 || res === true;
      if (isSuccess) {
        ElMessage.success('批量核查成功');
        batchReviewDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(res?.msg || '核查失败');
      }
    } catch (error) {
      ElMessage.error(`核查失败：${error.message}`);
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      await batchReviewFormApi.resetForm();
    }
  },
});

const [CommunicationForm, communicationFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: useCommunicationFormSchema(),
  showDefaultActions: false,
});

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

const aftermathRow = ref(null);

const [AftermathForm, aftermathFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 100 },
  layout: 'horizontal',
  schema: useAftermathFormSchema(),
  showDefaultActions: false,
});

const [AftermathDrawer, aftermathDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '复盘意见',
  onCancel: () => aftermathDrawerApi.close(),
  async onConfirm() {
    const formValues = await aftermathFormApi.getValues();
    const { reviewOpinion } = formValues;
    if (!reviewOpinion) {
      ElMessage.warning('请输入复盘意见');
      return;
    }
    if (!aftermathRow.value?.id) {
      ElMessage.error('任务数据不存在');
      return;
    }

    const loading = ElLoading.service({ text: '提交中...' });
    try {
      await updateRoadCleaning({
        id: aftermathRow.value.id,
        reviewDesc: reviewOpinion,
      });
      ElMessage.success('复盘意见保存成功');
      aftermathDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error('复盘失败', error);
      ElMessage.error(error.message || '复盘失败，请重试');
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const rowData = aftermathDrawerApi.getData();
      aftermathRow.value = rowData;
      aftermathFormApi.resetForm();
      if (rowData?.reviewDesc) {
        await aftermathFormApi.setValues({ reviewOpinion: rowData.reviewDesc });
      }
    } else {
      aftermathRow.value = null;
    }
  },
});

const [TrackLocationDrawer, trackLocationDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '定位跟踪',
  footer: false,
  width: 600,
});

const parkDetailDrawerRef = ref(null);
const problemDetailDrawerRef = ref(null);

// 批量问题处理表单
const [BatchProblemForm, batchProblemFormApi] = useVbenForm({
  commonConfig: { componentProps: { class: 'w-full' }, formItemClass: 'col-span-2', labelWidth: 80 },
  layout: 'horizontal',
  schema: useBatchProblemSchema(),
  showDefaultActions: false,
});

const [BatchProblemDrawer, batchProblemDrawerApi] = useVbenDrawer({
  title: '批量处理问题',
  appendToMain: true,
  modal: false,
  onCancel: () => batchProblemDrawerApi.close(),
  async onConfirm() {
    const formValues = await batchProblemFormApi.getValues();
    const { action, teamId, handleStatus } = formValues;

    if (checkedIds.value.length === 0) {
      ElMessage.warning('请至少选择一条问题记录');
      return;
    }

    if (action === 'dispatch') {
      if (!teamId) {
        ElMessage.warning('请选择处置组');
        return;
      }
      const loading = ElLoading.service({ text: '批量派发中...' });
      try {
        await Promise.all(checkedIds.value.map(id =>
          updateCleaningProblem({ id, teamId, handleStatus: '处理中' })
        ));
        ElMessage.success('批量派发成功');
        checkedIds.value = [];
        batchProblemDrawerApi.close();
        handleRefresh();
      } catch (error) {
        ElMessage.error(`派发失败：${error.message}`);
      } finally {
        loading.close();
      }
    }

    if (action === 'updateStatus') {
      if (!handleStatus) {
        ElMessage.warning('请选择处置状态');
        return;
      }
      const loading = ElLoading.service({ text: '批量更新状态中...' });
      try {
        const params = { ids: checkedIds.value, handleStatus };
        const res = await batchProcessCleaningProblem(params);
        const isSuccess = res?.code === 0 || res === true;
        if (isSuccess) {
          ElMessage.success('批量更新状态成功');
          batchProblemDrawerApi.close();
          handleRefresh();
        } else {
          ElMessage.error(res?.msg || '更新状态失败');
        }
      } catch (error) {
        ElMessage.error(`更新状态失败：${error.message}`);
      } finally {
        loading.close();
      }
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      await batchProblemFormApi.resetForm();
      await batchProblemFormApi.updateSchema([
        {
          fieldName: 'teamId',
          componentProps: {
            options: loadedOptions.team.map(item => ({ value: item.value, label: item.label }))
          }
        },
        {
          fieldName: 'handleStatus',
          componentProps: {
            options: loadedOptions.handleStatus.map(item => ({ value: item.value, label: item.label }))
          }
        },
      ]);
    }
  },
});

function handleBatchProcess() {
  if (isEmpty(checkedIds.value)) return;
  batchProblemDrawerApi.open();
}

// ---------- 数据转换函数 ----------
function convertRoadCleaningItem(item) {
  let staffIds = item.staffIds;
  if (typeof staffIds === 'string') {
    try {
      staffIds = JSON.parse(staffIds);
    } catch {
      staffIds = staffIds ? staffIds.split(',').map(s => s.trim()).filter(Boolean) : [];
    }
  }
  if (!Array.isArray(staffIds)) staffIds = staffIds ? [staffIds] : [];

  let staffsName = '-';
  if (staffIds.length > 0) {
    if (loadedOptions.user && loadedOptions.user.length) {
      const names = staffIds.map(id => {
        const user = loadedOptions.user.find(u => u.value === id);
        return user ? user.label : id;
      }).filter(Boolean);
      staffsName = names.join(', ');
    } else {
      staffsName = staffIds.join(', ');
    }
  }

  let toolIds = item.toolIds;
  if (typeof toolIds === 'string') {
    try {
      toolIds = JSON.parse(toolIds);
    } catch {
      toolIds = toolIds ? toolIds.split(',').map(s => s.trim()).filter(Boolean) : [];
    }
  }
  if (!Array.isArray(toolIds)) toolIds = toolIds ? [toolIds] : [];

  let toolsName = '-';
  if (toolIds.length > 0) {
    if (loadedOptions.tool && loadedOptions.tool.length) {
      const names = toolIds.map(id => {
        const tool = loadedOptions.tool.find(t => t.value == id);
        return tool ? tool.label : id;
      }).filter(Boolean);
      toolsName = names.join(', ');
    } else {
      toolsName = toolIds.join(', ');
    }
  }

  let checkPhotoUrl = item.checkPhotoUrl;
  let photoList = loadImageListFromField(checkPhotoUrl);
  let firstPhoto = photoList.length > 0 ? photoList[0] : '';

  let reviewByName = '-';
  if (item.reviewBy && loadedOptions.user && loadedOptions.user.length) {
    const user = loadedOptions.user.find(u => u.value == item.reviewBy);
    reviewByName = user ? user.label : item.reviewBy;
  }

  return {
    ...item,
    staffIds,
    staffsName,
    toolIds,
    toolsName,
    checkPhotoUrl: firstPhoto,
    photoUrlList: photoList,
    reviewByName,
    createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '-',
    updateTime: item.updateTime ? new Date(item.updateTime).toLocaleString() : '-',
    checkinTime: item.checkinTime ? new Date(item.checkinTime).toLocaleString() : '-',
    lastReportTime: item.lastReportTime ? new Date(item.lastReportTime).toLocaleString() : '-',
    completeTime: item.completeTime ? new Date(item.completeTime).toLocaleString() : '-',
    reviewTime: item.reviewTime ? new Date(item.reviewTime).toLocaleString() : '-',
    reviewDesc: item.reviewDesc || '-',
  };
}

function convertProblemItem(item) {
  let handleStatusName = item.handleStatus;
  if (item.handleStatus && loadedOptions.handleStatus.length) {
    const found = loadedOptions.handleStatus.find(opt => opt.value === item.handleStatus);
    handleStatusName = found ? found.label : item.handleStatus;
  }

  let photoUrlList = loadImageListFromField(item.localePhotoUrl);
  let firstPhoto = photoUrlList.length > 0 ? photoUrlList[0] : '';

  return {
    ...item,
    reportTime: item.reportTime ? new Date(item.reportTime).toLocaleString() : '-',
    createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '-',
    updateTime: item.updateTime ? new Date(item.updateTime).toLocaleString() : '-',
    handleStatusName,
    photoUrlList,
    firstPhoto,
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
    ...tagFilters.value,
  };

  try {
    let res;
    if (isProblemTab.value) {
      res = await getCleaningProblemPage(params);
    } else {
      if (activeName.value !== '全部') {
        switch (activeName.value) {
          case '清扫待执行': {
            const pendingValue = loadedOptions.planStatus.find(item => item.label === '未开始')?.value;
            if (pendingValue) params.planStatusId = pendingValue;
            break;
          }
          case '作业进行中': {
            const executingValue = loadedOptions.planStatus.find(item => item.label === '进行中')?.value;
            if (executingValue) params.planStatusId = executingValue;
            break;
          }
          case '已完成': {
            const completedValue = loadedOptions.planStatus.find(item => item.label === '已完成')?.value;
            if (completedValue) params.planStatusId = completedValue;
            break;
          }
          case '质量待核查': {
            params.reviewStatus = ['待核查', '不达标'];
            break;
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
  tagFilters.value = {};
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

function handleReview(row) {
  currentReviewRow.value = row;
  reviewFormApi.resetForm();
  reviewImageList.value = loadImageListFromField(row.reviewPhotoUrl);
  reviewFormApi.setValues({
    reviewStatus: row.reviewStatus || '',
    reformRequire: row.reformRequire || '',
    reviewPhotoUrl: reviewImageList.value.length > 0 ? JSON.stringify(reviewImageList.value) : '',
  });
  reviewDrawerApi.open();
}

function handleDispatch(row) {
  currentDispatchRow.value = row;
  dispatchFormApi.resetForm();
  if (row.teamId) {
    dispatchFormApi.setValues({ teamId: row.teamId });
  }
  dispatchDrawerApi.open();
}

function handleFeedback(row) {
  currentFeedbackRow.value = row;
  feedbackFormApi.resetForm();
  if (row.handleResult) {
    feedbackFormApi.setValues({ handleResult: row.handleResult });
  }
  feedbackDrawerApi.open();
}

function handleReport(row) {
  currentReportRow.value = row;
  reportFormApi.resetForm();
  reportImageList.value = [];
  reportDrawerApi.open();
}

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

function handleOpenDetail(row) {
  if (isProblemTab.value) {
    problemDetailDrawerRef.value?.open(row);
  } else {
    dataObj.detailObj = row;
    parkDetailDrawerRef.value?.open();
  }
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
  try {
    const res = await getCleaningStatistics();
    const data = res || {};
    counts.value.total = data.total || 0;
    counts.value.planStatusCounts = data.planStatusCounts || {};
  } catch (error) {
    console.error('加载统计数据失败', error);
  }
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
      handleStatusOptionsRes,
    ] = await Promise.all([
      getRoadOptions(),
      getAreaOptions(),
      getUserOptions(),
      getPlanStatusOptions(),
      getToolOptions(),
      getProblemTypeOptions(),
      getTeamOptions(),
      getHandleStatusOptions(),
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
    loadedOptions.handleStatus = extractData(handleStatusOptionsRes);

    await editFormApi.updateSchema([
      { fieldName: 'roadId', componentProps: { options: loadedOptions.road } },
      { fieldName: 'areaCode', componentProps: { options: loadedOptions.area } },
      { fieldName: 'staffIds', componentProps: { options: loadedOptions.user } },
      { fieldName: 'planStatusId', componentProps: { options: loadedOptions.planStatus } },
      { fieldName: 'toolIds', componentProps: { options: loadedOptions.tool } },
      { fieldName: 'reviewBy', componentProps: { options: loadedOptions.user } },
    ]);
    await executingEditFormApi.updateSchema([
      { fieldName: 'planStatusId', componentProps: { options: loadedOptions.planStatus } },
    ]);

    await roadSearchFormApi.updateSchema([
      { fieldName: 'roadId', componentProps: { options: loadedOptions.road } },
      { fieldName: 'areaCode', componentProps: { options: loadedOptions.area } },
      { fieldName: 'staffIds', componentProps: { options: loadedOptions.user } },
      { fieldName: 'planStatusId', componentProps: { options: loadedOptions.planStatus } },
    ]);

    await problemSearchFormApi.updateSchema([
      { fieldName: 'problemTypeId', componentProps: { options: loadedOptions.problemType } },
      { fieldName: 'reportBy', componentProps: { options: loadedOptions.user } },
      { fieldName: 'teamId', componentProps: { options: loadedOptions.team } },
    ]);

    await dispatchFormApi.updateSchema([
      { fieldName: 'teamId', componentProps: { options: loadedOptions.team } },
    ]);

    await reportFormApi.updateSchema([
      { fieldName: 'problemTypeId', componentProps: { options: loadedOptions.problemType } },
    ]);

    console.log('所有选项加载成功');
  } catch (error) {
    console.error('加载选项失败', error);
    ElMessage.error('加载选项失败，请刷新重试');
  }
}

function handleBatchAdjust() {
  if (isEmpty(checkedIds.value)) return;
  batchAdjustDrawerApi.open();
}
function handleBatchReview() {
  if (isEmpty(checkedIds.value)) return;
  batchReviewDrawerApi.open();
}
function handleTrackLocation() {
  trackLocationDrawerApi.open();
}
function handleTrack(row) {
  ElMessage.info('跟踪功能待实现');
}
async function handleStart(row) {
  try {
    await ElMessageBox.confirm('确定启动该清扫计划吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    });

    const targetStatusId = loadedOptions.planStatus.find(item => item.label === '进行中')?.value;
    if (!targetStatusId) {
      ElMessage.error('无法获取进行中状态ID，请稍后重试');
      return;
    }

    const loading = ElLoading.service({ text: '启动中...' });
    try {
      const updateData = {
        id: row.id,
        planStatusId: targetStatusId,
        staffIds: row.staffIds ? JSON.stringify(row.staffIds) : '[]',
        toolIds: row.toolIds ? JSON.stringify(row.toolIds) : '[]',
      };
      await updateRoadCleaning(updateData);
      ElMessage.success('启动成功');
      handleRefresh();
    } catch (error) {
      ElMessage.error('启动失败：' + (error.message || '未知错误'));
    } finally {
      loading.close();
    }
  } catch (error) {
    // 用户取消
  }
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
      <!-- 图片上传区域（使用独立函数） -->
      <div class="photo-upload-section">
        <div class="photo-manager">
          <div class="upload-area">
            <input
              type="file"
              multiple
              accept="image/*"
              @change="handleEditImageUpload"
            />
            <span class="upload-tip">可多选图片</span>
          </div>
          <div class="photo-list" v-if="editImageList.length > 0">
            <div
              class="photo-item"
              v-for="(url, index) in editImageList"
              :key="index"
            >
              <ElImage
                :src="url"
                :preview-src-list="editImageList"
                fit="cover"
                style="width: 80px; height: 80px; cursor: pointer; border-radius: 4px"
                :preview-teleported="true"
              />
              <span class="delete-btn" @click="handleEditImageDelete(url)">✕</span>
            </div>
          </div>
          <div v-else class="no-photo">暂无图片</div>
        </div>
      </div>
    </ExecutingEditDrawer>

    <!-- 质量核查抽屉 -->
    <ReviewDrawer>
      <ReviewForm />
      <div class="photo-upload-section">
        <div class="photo-manager">
          <div class="upload-area">
            <input
              type="file"
              multiple
              accept="image/*"
              @change="handleReviewImageUpload"
            />
            <span class="upload-tip">可多选图片</span>
          </div>
          <div class="photo-list" v-if="reviewImageList.length > 0">
            <div
              class="photo-item"
              v-for="(url, index) in reviewImageList"
              :key="index"
            >
              <ElImage
                :src="url"
                :preview-src-list="reviewImageList"
                fit="cover"
                style="width: 80px; height: 80px; cursor: pointer; border-radius: 4px"
                :preview-teleported="true"
              />
              <span class="delete-btn" @click="handleReviewImageDelete(url)">✕</span>
            </div>
          </div>
          <div v-else class="no-photo">暂无图片</div>
        </div>
      </div>
    </ReviewDrawer>

    <!-- 问题派发抽屉 -->
    <DispatchDrawer>
      <DispatchForm />
    </DispatchDrawer>

    <!-- 问题反馈抽屉 -->
    <FeedbackDrawer>
      <FeedbackForm />
    </FeedbackDrawer>

    <!-- 问题上报抽屉 -->
    <ReportDrawer>
      <ReportForm />
      <div class="photo-upload-section">
        <div class="photo-manager">
          <div class="upload-area">
            <input
              type="file"
              multiple
              accept="image/*"
              @change="handleReportImageUpload"
            />
            <span class="upload-tip">可多选图片</span>
          </div>
          <div class="photo-list" v-if="reportImageList.length > 0">
            <div
              class="photo-item"
              v-for="(url, index) in reportImageList"
              :key="index"
            >
              <ElImage
                :src="url"
                :preview-src-list="reportImageList"
                fit="cover"
                style="width: 80px; height: 80px; cursor: pointer; border-radius: 4px"
                :preview-teleported="true"
              />
              <span class="delete-btn" @click="handleReportImageDelete(url)">✕</span>
            </div>
          </div>
          <div v-else class="no-photo">暂无图片</div>
        </div>
      </div>
    </ReportDrawer>

    <!-- 批量问题处理抽屉 -->
    <BatchProblemDrawer>
      <BatchProblemForm />
    </BatchProblemDrawer>

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

    <!-- 搜索抽屉 -->
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

        <ElTag
          v-for="(value, field) in tagFilters"
          :key="field"
          type="success"
          closable
          @close="removeFilterTag(field)"
          style="height: 32px; margin: 4px 0; line-height: 32px"
        >
          {{ getFieldLabel(field) }}: {{ getTagDisplayText(field, value) }}
        </ElTag>
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
        <el-text @click="handleFilterTagClick('roadId', row.roadId)" type="primary">
          {{ row.roadName || '-' }}
        </el-text>
      </template>
      <template #area="{ row }">
        <el-text @click="handleFilterTagClick('areaCode', row.areaCode)" type="primary">
          {{ row.areaName || row.area }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-text @click="handleFilterTagClick('planStatusId', row.planStatusId)" type="primary">
          {{ row.planStatusName || row.status }}
        </el-text>
      </template>

      <template #handleStatus="{ row }">
        {{ row.handleStatusName || row.handleStatus }}
      </template>
      <template #problemId="{ row }">
        <el-text v-if="isProblemTab" @click="handleOpenDetail(row)" type="primary">{{
            row.problemId
          }}</el-text>
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
      <template #localePhotoUrl="{ row }">
        <template v-if="isProblemTab">
          <el-image
            v-if="row.firstPhoto"
            :src="row.firstPhoto"
            :preview-src-list="row.photoUrlList"
            fit="cover"
            style="width: 40px; height: 40px; border-radius: 4px; cursor: pointer;"
            :preview-teleported="true"
          />
          <span v-else>-</span>
        </template>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)" />

          <template v-if="activeName === '全部'">
            <IconButton content="跟踪" icon-name="TrendCharts" @click="handleTrack(row)" />
          </template>

          <template v-else-if="activeName === '清扫待执行'">
            <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
            <IconButton content="启动执行" icon-name="CaretRight" @click="handleStart(row)" />
          </template>

          <template v-else-if="activeName === '作业进行中'">
            <IconButton content="编辑" icon-name="edit" @click="handleExecutingEdit(row)" />
            <IconButton content="沟通" icon-name="ChatDotRound" @click="handleCommunicate(row)" />
            <IconButton content="问题上报" icon-name="Warning" @click="handleReport(row)" />
          </template>

          <template v-else-if="activeName === '问题待处置'">
            <IconButton content="派发" icon-name="Share" @click="handleDispatch(row)" />
            <IconButton content="反馈" icon-name="Checked" @click="handleFeedback(row)" />
            <IconButton content="跟踪" icon-name="TrendCharts" @click="handleTrack(row)" />
          </template>

          <template v-else-if="activeName === '质量待核查'">
            <IconButton content="核查" icon-name="Checked" @click="handleReview(row)" />
            <IconButton content="跟踪整改" icon-name="AlarmClock" @click="handleTrackRectify(row)" />
          </template>

          <template v-else-if="activeName === '已完成'">
            <IconButton content="复盘" icon-name="DataAnalysis" @click="aftermathDrawerApi.setData(row).open()" />
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
:deep(.vxe-grid--bottom-wrapper) {
  display: block !important;
}

.photo-upload-section {
  padding: 0 20px;
}

.photo-manager {
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.upload-area {
  margin-bottom: 16px;
}
.upload-area input[type='file'] {
  margin-right: 8px;
}
.upload-tip {
  font-size: 12px;
  color: #999;
}

.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.photo-item {
  position: relative;
}
.photo-item .delete-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  background: rgb(0 0 0 / 60%);
  border-radius: 50%;
}
.photo-item .delete-btn:hover {
  background: #f56c6c;
}

.no-photo {
  padding: 20px;
  color: #999;
  text-align: center;
}

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
