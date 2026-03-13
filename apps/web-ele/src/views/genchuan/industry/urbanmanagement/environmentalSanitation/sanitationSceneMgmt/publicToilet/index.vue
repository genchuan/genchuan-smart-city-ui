<script setup>
import {computed, onMounted, reactive, ref, watch} from 'vue';

import {confirm, useVbenDrawer} from '@vben/common-ui';
import {isEmpty} from '@vben/utils';

import {ElImage, ElLoading, ElMessage, ElMessageBox} from 'element-plus';
import screenfull from 'screenfull';

import {useVbenForm} from '#/adapter/form';
import {useVbenVxeGrid} from '#/adapter/vxe-table';
import {
  createPublicToilet,
  createToiletCleaningTask,
  createToiletComplaint,
  createToiletConsumable,
  createToiletFacilityRepair,
  deleteCleaningPhoto,
  deletePublicToilet,
  deletePublicToiletBatch,
  deleteRepairPhoto,
  deleteToiletCleaningTask,
  deleteToiletCleaningTaskBatch,
  deleteToiletComplaint,
  deleteToiletComplaintBatch,
  deleteToiletConsumable,
  deleteToiletConsumableBatch,
  deleteToiletFacilityRepair,
  deleteToiletFacilityRepairBatch,
  exportPublicToiletExcel,
  exportToiletCleaningTaskExcel,
  exportToiletComplaintExcel,
  exportToiletConsumableExcel,
  exportToiletFacilityRepairExcel,
  getCleaningPhotoList,
  getPublicToiletPage,
  getPublicToiletStatistics,
  getRepairPhotoList,
  getToiletCleaningTaskPage,
  getToiletComplaintPage,
  getToiletConsumablePage,
  getToiletFacilityRepairPage,
  updatePublicToilet,
  updateToiletCleaningTask,
  updateToiletComplaint,
  updateToiletConsumable,
  updateToiletFacilityRepair,
  uploadCleaningPhotos,
  uploadImageBatch,
  uploadRepairPhotos,
  batchAdjustToiletCleaningTask,
  batchSupplyToiletConsumable,
  uploadComplaintPhotos,
  deleteComplaintPhoto,
  getComplaintPhotoList,
  supplyToiletConsumable,
  batchHandleToiletComplaint,
} from '#/api/genchuan/industry/urbanmanagement/environmentalSanitation/sanitationSceneMgmt/publicToilet/data.js';
import {
  getAreaOptions,
  getColumnsByStatus,
  getComplaintTypeOptions,
  getConsumableOptions,
  getFacilityOptions,
  getOperationStatusOptions,
  getPlanStatusOptions,
  getPublicToiletOptions,
  getUserOptions,
  textObj,
  useAcceptSchema,
  useBatchAdjustSchema,
  useBatchSupplySchema,
  useCleaningFormSchema,
  useCommunicationSchema,
  useComplaintFormSchema,
  useConsumableFormSchema,
  useDispatchSchema,
  useFormSchema,
  useRepairFormSchema,
  useReviewPostSchema,
  useSupplySchema,
} from '#/api/genchuan/industry/urbanmanagement/environmentalSanitation/sanitationSceneMgmt/publicToilet/form.js';
import {$t} from '#/locales';

import Chart2 from './chart2.vue';
import CleaningDetailDrawer from './cleaningDetail.vue';
import ComplaintDetailDrawer from './complaintDetail.vue';
import ConsumableDetailDrawer from './consumableDetail.vue';
import ParkDetailDrawer from './detail.vue';
import RepairDetailDrawer from './repairDetail.vue';

const props = defineProps({
  secondShow: Boolean,
  arrowShow: Boolean,
  arrowState: Boolean,
});
const emit = defineEmits(['arrow-change']);

const activeName = ref('全部');
const tabsData = ref([
  {label: '全部'},
  {label: '保洁待执行'},
  {label: '物资待补充'},
  {label: '投诉待处置'},
  {label: '设施待维修'},
  {label: '已完成'},
]);

const counts = ref({
  total: 0,
  planStatusCounts: {
    全部: 0,
    保洁待执行: 0,
    物资待补充: 0,
    投诉待处置: 0,
    设施待维修: 0,
    已完成: 0,
  },
});

const createLabel = (item) => {
  const key = item.label;
  let count = 0;
  count =
    key === '全部'
      ? counts.value.total || 0
      : counts.value.planStatusCounts?.[key] || 0;
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
  area: [],
  operationStatus: [],
  complaintType: [],
  facility: [],
  toilet: [],
  user: [],
  planStatus: [],
  consumable: [],
  handleStatus: [], // 用于投诉批量处理的状态
});

const optionMaps = reactive({
  planStatusMap: new Map(),
});

// 获取处置状态选项（可复用投诉的处置状态，也可以从后端获取）
// 这里假设从后端获取，但先静态定义，后面可以调用接口
const fetchHandleStatusOptions = async () => {
  // 模拟：实际应该调用接口
  return [
    {label: '待处置', value: '待处置'},
    {label: '处置中', value: '处置中'},
    {label: '已处置', value: '已处置'},
  ];
};

const isComplaintTab = computed(() => activeName.value === '投诉待处置');
const isRepairTab = computed(() => activeName.value === '设施待维修');
const isCleaningTab = computed(() => activeName.value === '保洁待执行');
const isConsumableTab = computed(() => activeName.value === '物资待补充');
const isCompletedTab = computed(() => activeName.value === '已完成');
const isToiletTab = computed(
  () =>
    !isComplaintTab.value &&
    !isRepairTab.value &&
    !isCleaningTab.value &&
    !isConsumableTab.value &&
    !isCompletedTab.value,
);

const gridColumns = ref(getColumnsByStatus(activeName.value));

// ---------- 搜索表单 ----------
const [ToiletSearchForm, toiletSearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: async () => {
    const rawValues = await toiletSearchFormApi.getValues();
    const filteredParams = Object.fromEntries(
      Object.entries(rawValues).filter(([_, v]) => v != null && v !== ''),
    );
    dataObj.searchParams = filteredParams;
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: useFormSchema().filter((f) => f.searchFilter),
  showCollapseButton: true,
  submitButtonOptions: {content: '查询'},
});

const [ComplaintSearchForm, complaintSearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: async () => {
    const rawValues = await complaintSearchFormApi.getValues();
    const filteredParams = Object.fromEntries(
      Object.entries(rawValues).filter(([_, v]) => v != null && v !== ''),
    );
    dataObj.searchParams = filteredParams;
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: useComplaintFormSchema().filter((f) => f.searchFilter),
  showCollapseButton: true,
  submitButtonOptions: {content: '查询'},
});

const [RepairSearchForm, repairSearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: async () => {
    const rawValues = await repairSearchFormApi.getValues();
    const filteredParams = Object.fromEntries(
      Object.entries(rawValues).filter(([_, v]) => v != null && v !== ''),
    );
    dataObj.searchParams = filteredParams;
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: useRepairFormSchema().filter((f) => f.searchFilter),
  showCollapseButton: true,
  submitButtonOptions: {content: '查询'},
});

const [CleaningSearchForm, cleaningSearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: async () => {
    const rawValues = await cleaningSearchFormApi.getValues();
    const filteredParams = Object.fromEntries(
      Object.entries(rawValues).filter(([_, v]) => v != null && v !== ''),
    );
    dataObj.searchParams = filteredParams;
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: useCleaningFormSchema().filter((f) => f.searchFilter),
  showCollapseButton: true,
  submitButtonOptions: {content: '查询'},
});

const [ConsumableSearchForm, consumableSearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: async () => {
    const rawValues = await consumableSearchFormApi.getValues();
    const filteredParams = Object.fromEntries(
      Object.entries(rawValues).filter(([_, v]) => v != null && v !== ''),
    );
    dataObj.searchParams = filteredParams;
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: useConsumableFormSchema().filter((f) => f.searchFilter),
  showCollapseButton: true,
  submitButtonOptions: {content: '查询'},
});

const currentSearchFormComponent = computed(() => {
  if (isComplaintTab.value) return ComplaintSearchForm;
  if (isRepairTab.value) return RepairSearchForm;
  if (isCleaningTab.value || isCompletedTab.value) return CleaningSearchForm;
  if (isConsumableTab.value) return ConsumableSearchForm;
  return ToiletSearchForm;
});

const currentSearchFormApi = computed(() => {
  if (isComplaintTab.value) return complaintSearchFormApi;
  if (isRepairTab.value) return repairSearchFormApi;
  if (isCleaningTab.value || isCompletedTab.value) return cleaningSearchFormApi;
  if (isConsumableTab.value) return consumableSearchFormApi;
  return toiletSearchFormApi;
});

const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => searchDrawerApi.close(),
});

// ---------- 编辑表单 ----------
const [ToiletEditForm, toiletEditFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [ComplaintEditForm, complaintEditFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useComplaintFormSchema(),
  showDefaultActions: false,
});

const [RepairEditForm, repairEditFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useRepairFormSchema(),
  showDefaultActions: false,
});

const [CleaningEditForm, cleaningEditFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useCleaningFormSchema(),
  showDefaultActions: false,
});

const [ConsumableEditForm, consumableEditFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useConsumableFormSchema(),
  showDefaultActions: false,
});

const currentFormComponent = computed(() => {
  if (isComplaintTab.value) return ComplaintEditForm;
  if (isRepairTab.value) return RepairEditForm;
  if (isCleaningTab.value || isCompletedTab.value) return CleaningEditForm;
  if (isConsumableTab.value) return ConsumableEditForm;
  return ToiletEditForm;
});

const currentFormApi = computed(() => {
  if (isComplaintTab.value) return complaintEditFormApi;
  if (isRepairTab.value) return repairEditFormApi;
  if (isCleaningTab.value || isCompletedTab.value) return cleaningEditFormApi;
  if (isConsumableTab.value) return consumableEditFormApi;
  return toiletEditFormApi;
});

const formData = ref();
const getTitle = computed(() =>
  formData.value?.id ? textObj.editText : textObj.addText,
);

// ---------- 图片上传相关 ----------
const imageList = ref([]);
const currentId = ref(null);

const formatProofs = (proofStr) => {
  if (!proofStr) return [];
  if (Array.isArray(proofStr)) return proofStr;
  if (typeof proofStr === 'string') {
    try {
      const parsed = JSON.parse(proofStr);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // 忽略
    }
    if (proofStr.includes(',')) {
      return proofStr.split(',').map((url) => url.trim());
    }
    return [proofStr];
  }
  return [];
};

const formatPhotos = (photoStr) => {
  if (!photoStr) return [];
  if (Array.isArray(photoStr)) return photoStr;
  if (typeof photoStr === 'string') {
    try {
      const parsed = JSON.parse(photoStr);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // 忽略
    }
    if (photoStr.includes(',')) {
      return photoStr.split(',').map((url) => url.trim());
    }
    return [photoStr];
  }
  return [];
};

const updateFormImageField = (list) => {
  if (isComplaintTab.value) {
    const value = list.length > 0 ? JSON.stringify(list) : '';
    currentFormApi.value.setValues({reformPhoto: value});
  } else if (isCompletedTab.value || isCleaningTab.value) {
    const value = list.length > 0 ? JSON.stringify(list) : '';
    currentFormApi.value.setValues({proofUrls: value, proofUrl: value});
  } else if (isRepairTab.value) {
    const value = list.length > 0 ? JSON.stringify(list) : '';
    currentFormApi.value.setValues({photoUrl: value});
  }
};

const fetchImageList = async (id) => {
  if (!id) return [];
  try {
    let res;
    if (isComplaintTab.value) {
      res = await getComplaintPhotoList(id);
    } else if (isCompletedTab.value || isCleaningTab.value) {
      res = await getCleaningPhotoList(id);
    } else if (isRepairTab.value) {
      res = await getRepairPhotoList(id);
    } else {
      return [];
    }
    if (Array.isArray(res)) {
      return res;
    }
    if (res && Array.isArray(res.data)) {
      return res.data;
    }
    if (res && Array.isArray(res.result)) {
      return res.result;
    }
    if (res && Array.isArray(res.photos)) {
      return res.photos;
    }
    if (res && Array.isArray(res.list)) {
      return res.list;
    }
    console.warn('获取图片列表返回未知格式', res);
    return [];
  } catch (error) {
    console.error('获取图片列表出错', error);
    return [];
  }
};

const handleImageUpload = async (event) => {
  const files = event.target.files;
  if (files.length === 0) return;

  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  const loading = ElLoading.service({text: '上传中...'});
  try {
    let res;
    let newList = [];

    if (currentId.value) {
      if (isComplaintTab.value) {
        res = await uploadComplaintPhotos(currentId.value, formData);
      } else if (isCompletedTab.value || isCleaningTab.value) {
        res = await uploadCleaningPhotos(currentId.value, formData);
      } else if (isRepairTab.value) {
        res = await uploadRepairPhotos(currentId.value, formData);
      } else {
        return;
      }

      const isSuccess =
        Array.isArray(res) ||
        res === true ||
        res?.code === 0 ||
        res?.success === true;

      if (isSuccess) {
        newList = await fetchImageList(currentId.value);
        imageList.value = newList;
        updateFormImageField(newList);
        ElMessage.success('上传成功');
      } else {
        const errMsg = typeof res === 'string' ? res : JSON.stringify(res);
        ElMessage.error(`上传失败：${errMsg}`);
        console.error('上传失败，响应详情:', res);
      }
    } else {
      res = await uploadImageBatch(formData);

      if (Array.isArray(res)) {
        const uploadedUrls = res.map((item) => item.url);
        newList = [...imageList.value, ...uploadedUrls];
        imageList.value = newList;
        updateFormImageField(newList);
        ElMessage.success('上传成功');
      } else if (res?.code === 0 && Array.isArray(res.data)) {
        const uploadedUrls = res.data.map((item) => item.url);
        newList = [...imageList.value, ...uploadedUrls];
        imageList.value = newList;
        updateFormImageField(newList);
        ElMessage.success('上传成功');
      } else {
        const errMsg = res?.msg || '上传失败: 响应格式不正确';
        ElMessage.error(`上传失败：${errMsg}`);
      }
    }
  } catch (error) {
    console.error('上传图片异常', error);
    ElMessage.error(`上传图片失败：${error.message}`);
  } finally {
    loading.close();
    event.target.value = '';
  }
};

const handleImageDelete = async (url) => {
  const loading = ElLoading.service({text: '删除中...'});
  try {
    if (currentId.value) {
      let res;
      if (isComplaintTab.value) {
        res = await deleteComplaintPhoto(currentId.value, url);
      } else if (isCompletedTab.value || isCleaningTab.value) {
        res = await deleteCleaningPhoto(currentId.value, url);
      } else if (isRepairTab.value) {
        res = await deleteRepairPhoto(currentId.value, url);
      } else {
        return;
      }

      console.log('删除响应:', res);

      const isSuccess =
        res === true || res?.code === 0 || res?.success === true || res === '';

      if (isSuccess) {
        const newList = await fetchImageList(currentId.value);
        imageList.value = newList;
        updateFormImageField(newList);
        ElMessage.success('删除成功');
      } else {
        const errMsg = typeof res === 'string' ? res : JSON.stringify(res);
        ElMessage.error(`删除失败：${errMsg}`);
        console.error('删除失败，响应详情:', res);
      }
    } else {
      const newList = imageList.value.filter((item) => item !== url);
      imageList.value = newList;
      updateFormImageField(newList);
      ElMessage.success('删除成功');
    }
  } catch (error) {
    console.error('删除图片异常', error);
    ElMessage.error(`删除图片失败：${error.message}`);
  } finally {
    loading.close();
  }
};

// ---------- 编辑抽屉 ----------
const [EditDrawer, editDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel: () => {
    currentId.value = null;
    imageList.value = [];
    editDrawerApi.close();
  },
  async onConfirm() {
    const formValues = await currentFormApi.value.getValues();
    const isAdd = !formData.value?.id;

    if (
      (isCleaningTab.value || isCompletedTab.value) &&
      imageList.value.length > 0
    ) {
      const proofUrls = JSON.stringify(imageList.value);
      formValues.proofUrls = proofUrls;
      formValues.proofUrl = proofUrls;
    } else if (isRepairTab.value && imageList.value.length > 0) {
      formValues.photoUrl = JSON.stringify(imageList.value);
    }

    try {
      if (isComplaintTab.value) {
        const submitData = {...formValues};
        await (isAdd
          ? createToiletComplaint(submitData)
          : updateToiletComplaint({...submitData, id: formData.value.id}));
      } else if (isRepairTab.value) {
        const submitData = {...formValues};
        await (isAdd
          ? createToiletFacilityRepair(submitData)
          : updateToiletFacilityRepair({
            ...submitData,
            id: formData.value.id,
          }));
      } else if (isCleaningTab.value || isCompletedTab.value) {
        const submitData = {...formValues};
        if (Array.isArray(submitData.cleanerIds)) {
          submitData.cleanerIds = JSON.stringify(submitData.cleanerIds);
        }
        await (isAdd
          ? createToiletCleaningTask(submitData)
          : updateToiletCleaningTask({
            ...submitData,
            id: formData.value.id,
          }));
      } else if (isConsumableTab.value) {
        const submitData = {...formValues};
        await (isAdd
          ? createToiletConsumable(submitData)
          : updateToiletConsumable({
            ...submitData,
            id: formData.value.id,
          }));
      } else {
        const submitData = {
          ...formValues,
          cleanerIds: Array.isArray(formValues.cleanerIds)
            ? JSON.stringify(formValues.cleanerIds)
            : formValues.cleanerIds,
        };
        await (isAdd
          ? createPublicToilet(submitData)
          : updatePublicToilet({...submitData, id: formData.value.id}));
      }
      ElMessage.success(isAdd ? '新增成功' : '编辑成功');
      handleRefresh();
      editDrawerApi.close();
    } catch (error) {
      console.error('操作失败', error);
      ElMessage.error('操作失败，请重试');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = editDrawerApi.getData();
      currentId.value = formData.value?.id || null;

      if (formData.value?.id) {
        await currentFormApi.value.setValues(formData.value);

        if (isCleaningTab.value || isCompletedTab.value) {
          currentFormApi.value.updateSchema([
            {
              fieldName: 'proofUrls',
              componentProps: {style: {display: 'none'}},
            },
            {
              fieldName: 'proofUrl',
              componentProps: {style: {display: 'none'}},
            },
          ]);
        } else if (isRepairTab.value) {
          currentFormApi.value.updateSchema([
            {
              fieldName: 'photoUrl',
              componentProps: {style: {display: 'none'}},
            },
          ]);
        }

        let list = await fetchImageList(currentId.value);
        if (list.length === 0) {
          if (isComplaintTab.value) {
            list = formatPhotos(formData.value.reformPhoto);
          } else if (isCompletedTab.value || isCleaningTab.value) {
            list = formatProofs(
              formData.value.proofUrls || formData.value.proofUrl,
            );
          } else if (isRepairTab.value) {
            list = formatPhotos(formData.value.photoUrl);
          }
        }
        imageList.value = list;
        updateFormImageField(list);
      } else {
        await currentFormApi.value.resetForm();

        if (isCleaningTab.value || isCompletedTab.value) {
          currentFormApi.value.updateSchema([
            {
              fieldName: 'proofUrls',
              componentProps: {style: {display: 'none'}},
            },
            {
              fieldName: 'proofUrl',
              componentProps: {style: {display: 'none'}},
            },
          ]);
        } else if (isRepairTab.value) {
          currentFormApi.value.updateSchema([
            {
              fieldName: 'photoUrl',
              componentProps: {style: {display: 'none'}},
            },
          ]);
        }

        imageList.value = [];
        if (isComplaintTab.value) {
          currentFormApi.value.setValues({complaintTime: Date.now()});
        } else if (isRepairTab.value) {
          currentFormApi.value.setValues({
            reportTime: Date.now(),
            repairStatus: '待维修',
          });
        } else if (isConsumableTab.value) {
          currentFormApi.value.setValues({
            consumableWarning: '正常',
            consumableGap: 0,
            lastSupplyTime: Date.now(),
          });
        }
      }
    } else {
      currentId.value = null;
      imageList.value = [];
    }
  },
});

// ---------- 新增功能抽屉 ----------

// 批量调整抽屉（保洁待执行）
const [AdjustForm, adjustFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useBatchAdjustSchema(),
  showDefaultActions: false,
});

const [AdjustDrawer, adjustDrawerApi] = useVbenDrawer({
  title: '批量调整保洁计划',
  appendToMain: true,
  modal: false,
  onCancel: () => adjustDrawerApi.close(),
  async onConfirm() {
    const formValues = await adjustFormApi.getValues();
    const {adjustType, newTimePeriod, newFrequency, newCleanerIds} = formValues;

    if (checkedIds.value.length === 0) {
      ElMessage.warning('请至少选择一条保洁任务');
      return;
    }

    const updateFields = {};
    switch (adjustType) {
      case 'timePeriod':
        if (!newTimePeriod) {
          ElMessage.warning('请选择新时段');
          return;
        }
        updateFields.cleaningTime = newTimePeriod;
        break;
      case 'frequency':
        if (!newFrequency) {
          ElMessage.warning('请选择新频次');
          return;
        }
        updateFields.cleaningFrequency = newFrequency;
        break;
      case 'cleanerIds':
        if (!newCleanerIds || newCleanerIds.length === 0) {
          ElMessage.warning('请选择新人员');
          return;
        }
        updateFields.cleanerIds = newCleanerIds;
        break;
      default:
        ElMessage.warning('请选择调整维度');
        return;
    }

    const params = {
      ids: checkedIds.value,
      updateFields,
    };

    const loading = ElLoading.service({text: '批量调整中...'});
    try {
      // 使用 PUT 方法调用批量调整接口
      const res = await batchAdjustToiletCleaningTask(params);

      // 兼容 Axios 包装和后端直接返回
      const responseData = res?.data ?? res;
      const isSuccess = responseData?.code === 0 || responseData === true;

      if (isSuccess) {
        ElMessage.success('批量调整成功');
        adjustDrawerApi.close();
        handleRefresh(); // 刷新列表和统计
      } else {
        ElMessage.error(responseData?.msg || '调整失败');
      }
    } catch (error) {
      console.error('批量调整异常', error);
      ElMessage.error(`调整失败：${error.message || '未知错误'}`);
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      adjustFormApi.resetForm();
      adjustFormApi.updateSchema([
        {
          fieldName: 'newTimePeriod',
          componentProps: {
            options: [
              {label: '06:00-08:00', value: '06:00-08:00'},
              {label: '08:00-10:00', value: '08:00-10:00'},
              {label: '10:00-12:00', value: '10:00-12:00'},
              {label: '14:00-16:00', value: '14:00-16:00'},
              {label: '16:00-18:00', value: '16:00-18:00'},
              {label: '18:00-20:00', value: '18:00-20:00'},
              {label: '20:00-22:00', value: '20:00-22:00'},
            ],
          },
        },
        {
          fieldName: 'newFrequency',
          componentProps: {
            options: [
              {label: '每日一次', value: '每日一次'},
              {label: '每日两次', value: '每日两次'},
              {label: '每周三次', value: '每周三次'},
              {label: '每周一次', value: '每周一次'},
            ],
          },
        },
        {
          fieldName: 'newCleanerIds',
          componentProps: {
            options: loadedOptions.user, // 从已加载的选项获取
            multiple: true,
          },
        },
      ]);
    }
  },
});

// 批量补充登记抽屉（物资待补充）
const [BatchSupplyForm, batchSupplyFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useBatchSupplySchema(),
  showDefaultActions: false,
});

const [BatchSupplyDrawer, batchSupplyDrawerApi] = useVbenDrawer({
  title: '批量补充登记',
  appendToMain: true,
  modal: false,
  onCancel: () => batchSupplyDrawerApi.close(),
  async onConfirm() {
    const formValues = await batchSupplyFormApi.getValues();
    const {supplyQuantity} = formValues;

    if (checkedIds.value.length === 0) {
      ElMessage.warning('请至少选择一条物资待补充记录');
      return;
    }

    if (!supplyQuantity || supplyQuantity <= 0) {
      ElMessage.warning('请填写有效的补充数量');
      return;
    }

    // 从当前列表数据中获取真实的 consumableId
    const supplyItems = [];
    for (const id of checkedIds.value) {
      const row = dataObj.list.find(item => item.id === id);
      if (row && row.consumableId) {
        supplyItems.push({
          consumableId: row.consumableId,
          supplyQuantity: Number(supplyQuantity),
        });
      } else {
        console.warn(`ID为 ${id} 的记录缺少 consumableId`);
      }
    }

    if (supplyItems.length === 0) {
      ElMessage.warning('无法获取有效的耗材配置信息');
      return;
    }

    const params = {supplyItems};

    const loading = ElLoading.service({text: '批量补充中...'});
    try {
      const res = await batchSupplyToiletConsumable(params);
      const responseData = res?.data ?? res;
      const isSuccess = responseData?.code === 0 || responseData === true;

      if (isSuccess) {
        ElMessage.success('批量补充成功');
        batchSupplyDrawerApi.close();
        handleRefresh();
      } else {
        ElMessage.error(responseData?.msg || '补充失败');
      }
    } catch (error) {
      console.error('批量补充异常', error);
      ElMessage.error(`补充失败：${error.message || '未知错误'}`);
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      batchSupplyFormApi.resetForm();
    }
  },
});

// 单条补充登记抽屉（物资待补充）
const [SupplyForm, supplyFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useSupplySchema(),
  showDefaultActions: false,
});

const [SupplyDrawer, supplyDrawerApi] = useVbenDrawer({
  title: '补充登记',
  appendToMain: true,
  modal: false,
  onCancel: () => {
    supplyCurrentId.value = null;
    supplyImageList.value = [];
    supplyDrawerApi.close();
  },
  async onConfirm() {
    const formValues = await supplyFormApi.getValues();
    const {supplyQuantity} = formValues;

    if (!supplyCurrentId.value) {
      ElMessage.error('未找到物资记录');
      return;
    }

    if (!supplyQuantity || supplyQuantity <= 0) {
      ElMessage.warning('请填写有效的补充数量');
      return;
    }

    const params = {
      id: supplyCurrentId.value,
      supplyQuantity: Number(supplyQuantity),
      photoUrls: supplyImageList.value, // 直接传数组
    };

    const loading = ElLoading.service({text: '提交中...'});
    try {
      const res = await supplyToiletConsumable(params);
      const responseData = res?.data ?? res;
      const isSuccess = responseData?.code === 0 || responseData === true;

      if (isSuccess) {
        ElMessage.success('补充成功');
        supplyDrawerApi.close();
        handleRefresh(); // 刷新列表
      } else {
        ElMessage.error(responseData?.msg || '补充失败');
      }
    } catch (error) {
      console.error('补充异常', error);
      ElMessage.error(`补充失败：${error.message || '未知错误'}`);
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const rowData = supplyDrawerApi.getData();
      if (rowData && rowData.id) {
        supplyCurrentId.value = rowData.id;
        await supplyFormApi.resetForm();
        // 隐藏表单中的 photoUrls 字段（避免重复显示上传组件）
        supplyFormApi.updateSchema([
          {
            fieldName: 'photoUrls',
            componentProps: {style: {display: 'none'}},
          },
        ]);
        supplyImageList.value = []; // 清空图片列表
      } else {
        ElMessage.error('未获取到物资记录');
        supplyDrawerApi.close();
      }
    } else {
      supplyCurrentId.value = null;
      supplyImageList.value = [];
    }
  },
});

// 派单抽屉（通用，用于投诉和维修）
const [DispatchForm, dispatchFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useDispatchSchema(),
  showDefaultActions: false,
});

function handleTaskTrack(row) {
  ElMessage.info('功能待实现');
}

const [DispatchDrawer, dispatchDrawerApi] = useVbenDrawer({
  title: '派单',
  appendToMain: true,
  modal: false,
  onCancel: () => dispatchDrawerApi.close(),
  async onConfirm() {
    const formValues = await dispatchFormApi.getValues();
    ElMessage.info('派单功能待实现');
    dispatchDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      dispatchFormApi.resetForm();
      dispatchFormApi.updateSchema([
        {
          fieldName: 'handlerId',
          componentProps: {options: loadedOptions.user},
        },
      ]);
    }
  },
});

// 批量处理投诉抽屉（可选派单或更新状态）
const batchHandleComplaintSchema = [
  {
    fieldName: 'action',
    label: '批量操作',
    component: 'RadioGroup',
    componentProps: {
      options: [
        {label: '派单', value: 'dispatch'},
        {label: '更新状态', value: 'updateStatus'},
      ],
    },
    rules: 'required',
  },
  {
    fieldName: 'handlerId',
    label: '责任人',
    component: 'Select',
    componentProps: {placeholder: '请选择责任人', options: []},
    dependencies: {show: (values) => values.action === 'dispatch'},
  },
  {
    fieldName: 'dispatchStatus', // 字段名严格与后端一致
    label: '处理状态',           // 按您的要求改为“处理状态”
    component: 'Select',
    componentProps: {placeholder: '请选择处理状态', options: []},
    dependencies: {show: (values) => values.action === 'updateStatus'},
  },
];

const [BatchHandleComplaintForm, batchHandleComplaintFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: batchHandleComplaintSchema,
  showDefaultActions: false,
});

const [BatchHandleComplaintDrawer, batchHandleComplaintDrawerApi] =
  useVbenDrawer({
    title: '批量处理投诉',
    appendToMain: true,
    modal: false,
    onCancel: () => batchHandleComplaintDrawerApi.close(),
    async onConfirm() {
      const formValues = await batchHandleComplaintFormApi.getValues();
      const {action, handlerId, dispatchStatus} = formValues;

      if (checkedIds.value.length === 0) {
        ElMessage.warning('请至少选择一条投诉记录');
        return;
      }

      // 处理派单操作：当前后端接口不支持批量派单，给出提示
      if (action === 'dispatch') {
        ElMessage.info('批量派单功能暂未实现');
        return;
      }

      // 更新状态操作
      if (action === 'updateStatus') {
        if (!dispatchStatus) {
          ElMessage.warning('请选择处理状态');
          return;
        }

        const params = {
          ids: checkedIds.value,
          dispatchStatus: dispatchStatus, // 使用 dispatchStatus 字段
        };

        const loading = ElLoading.service({text: '批量处理中...'});
        try {
          // 假设导入的接口函数名为 batchHandleToiletComplaint
          const res = await batchHandleToiletComplaint(params);
          const responseData = res?.data ?? res;
          const isSuccess = responseData?.code === 0 || responseData === true;

          if (isSuccess) {
            ElMessage.success('批量处理成功');
            batchHandleComplaintDrawerApi.close();
            handleRefresh();
          } else {
            ElMessage.error(responseData?.msg || '处理失败');
          }
        } catch (error) {
          console.error('批量处理异常', error);
          ElMessage.error(`处理失败：${error.message || '未知错误'}`);
        } finally {
          loading.close();
        }
      }
    },
    async onOpenChange(isOpen) {
      if (isOpen) {
        batchHandleComplaintFormApi.resetForm();
        // 更新责任人选项和处理状态选项
        const statusOptions = [
          {label: '待派单', value: '待派单'},
          {label: '已派单', value: '已派单'},
          {label: '已处置', value: '已处置'},
        ];
        batchHandleComplaintFormApi.updateSchema([
          {
            fieldName: 'handlerId',
            componentProps: {options: loadedOptions.user},
          },
          {
            fieldName: 'dispatchStatus',
            componentProps: {options: statusOptions},
          },
        ]);
      }
    },
  });

// ---------- 独立处置抽屉（投诉） ----------
const disposeCurrentId = ref(null);
const disposeImageList = ref([]);

const disposeSchema = [
  {
    fieldName: 'handleMeasure',
    label: '处置措施',
    component: 'Input',
    componentProps: {type: 'textarea', rows: 3, placeholder: '请输入处置措施'},
    rules: 'required',
  },
  {
    fieldName: 'handleResult',
    label: '处置结果',
    component: 'Input',
    componentProps: {type: 'textarea', rows: 3, placeholder: '请输入处置结果'},
    rules: 'required',
  },
  // reformPhoto 字段不再使用，但保留用于隐藏，实际用图片上传组件
  {
    fieldName: 'reformPhoto',
    label: '整改照片',
    component: 'Input',
    componentProps: {placeholder: '图片URL，多个用逗号分隔', style: {display: 'none'}},
  },
];

const [DisposeForm, disposeFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: disposeSchema,
  showDefaultActions: false,
});

const [DisposeDrawer, disposeDrawerApi] = useVbenDrawer({
  title: '处置',
  appendToMain: true,
  modal: false,
  onCancel: () => {
    disposeCurrentId.value = null;
    disposeImageList.value = [];
    disposeDrawerApi.close();
  },
  async onConfirm() {
    const formValues = await disposeFormApi.getValues();
    const id = disposeCurrentId.value;
    if (!id) {
      ElMessage.error('未找到投诉记录');
      return;
    }
    // 将图片列表转为 JSON 字符串
    const reformPhoto = disposeImageList.value.length > 0
      ? JSON.stringify(disposeImageList.value)
      : '';
    const updateData = {
      id,
      handleMeasure: formValues.handleMeasure,
      handleResult: formValues.handleResult,
      reformPhoto,
    };

    const loading = ElLoading.service({text: '提交中...'});
    try {
      await updateToiletComplaint(updateData);
      ElMessage.success('处置成功');
      handleRefresh();          // 刷新表格数据
      disposeDrawerApi.close();
    } catch (error) {
      console.error('处置失败', error);
      ElMessage.error(`处置失败：${error.message || '未知错误'}`);
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const rowData = disposeDrawerApi.getData();
      if (rowData && rowData.id) {
        disposeCurrentId.value = rowData.id;
        // 预填充表单
        await disposeFormApi.setValues({
          handleMeasure: rowData.handleMeasure || '',
          handleResult: rowData.handleResult || '',
        });
        // 加载已有图片
        const list = await getComplaintPhotoList(rowData.id);
        disposeImageList.value = list;
      } else {
        disposeFormApi.resetForm();
        disposeImageList.value = [];
      }
    } else {
      disposeCurrentId.value = null;
      disposeImageList.value = [];
    }
  },
});

const supplyCurrentId = ref(null);
const supplyImageList = ref([]);

// 图片上传
const handleSupplyImageUpload = async (event) => {
  const files = event.target.files;
  if (files.length === 0) return;
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  const loading = ElLoading.service({text: '上传中...'});
  try {
    const res = await uploadImageBatch(formData);
    // 处理返回的图片 URL 数组
    if (Array.isArray(res)) {
      const newUrls = res.map(item => item.url);
      supplyImageList.value = [...supplyImageList.value, ...newUrls];
      ElMessage.success('上传成功');
    } else if (res?.code === 0 && Array.isArray(res.data)) {
      const newUrls = res.data.map(item => item.url);
      supplyImageList.value = [...supplyImageList.value, ...newUrls];
      ElMessage.success('上传成功');
    } else {
      ElMessage.error(res?.msg || '上传失败');
    }
  } catch (error) {
    console.error('上传图片异常', error);
    ElMessage.error(`上传图片失败：${error.message}`);
  } finally {
    loading.close();
    event.target.value = '';
  }
};

// 图片删除（仅前端移除）
const handleSupplyImageDelete = async (url) => {
  supplyImageList.value = supplyImageList.value.filter(item => item !== url);
  ElMessage.success('删除成功');
};

// 处置抽屉图片上传
const handleDisposeImageUpload = async (event) => {
  const files = event.target.files;
  if (files.length === 0) return;
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  const loading = ElLoading.service({text: '上传中...'});
  try {
    if (disposeCurrentId.value) {
      const res = await uploadComplaintPhotos(disposeCurrentId.value, formData);
      // 判断成功（兼容不同返回格式）
      const isSuccess =
        Array.isArray(res) ||
        res === true ||
        res?.code === 0 ||
        res?.success === true;
      if (isSuccess) {
        const newList = await getComplaintPhotoList(disposeCurrentId.value);
        disposeImageList.value = newList;
        ElMessage.success('上传成功');
      } else {
        const errMsg = typeof res === 'string' ? res : JSON.stringify(res);
        ElMessage.error(`上传失败：${errMsg}`);
      }
    } else {
      ElMessage.error('未找到投诉记录');
    }
  } catch (error) {
    console.error('上传图片异常', error);
    ElMessage.error(`上传图片失败：${error.message}`);
  } finally {
    loading.close();
    event.target.value = '';
  }
};

// 处置抽屉图片删除
const handleDisposeImageDelete = async (url) => {
  const loading = ElLoading.service({text: '删除中...'});
  try {
    if (disposeCurrentId.value) {
      const res = await deleteComplaintPhoto(disposeCurrentId.value, url);
      const isSuccess = res === true || res?.code === 0 || res?.success === true;
      if (isSuccess) {
        const newList = await getComplaintPhotoList(disposeCurrentId.value);
        disposeImageList.value = newList;
        ElMessage.success('删除成功');
      } else {
        const errMsg = typeof res === 'string' ? res : JSON.stringify(res);
        ElMessage.error(`删除失败：${errMsg}`);
      }
    } else {
      ElMessage.error('未找到投诉记录');
    }
  } catch (error) {
    console.error('删除图片异常', error);
    ElMessage.error(`删除图片失败：${error.message}`);
  } finally {
    loading.close();
  }
};

// ---------- 独立反馈抽屉（投诉） ----------
const feedbackCurrentId = ref(null);

const feedbackSchema = [
  {
    fieldName: 'feedbackContent',
    label: '反馈内容',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 4,
      placeholder: '请输入发送给投诉人的反馈内容',
    },
    rules: 'required',
  },
];

const [FeedbackForm, feedbackFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: feedbackSchema,
  showDefaultActions: false,
});

const [FeedbackDrawer, feedbackDrawerApi] = useVbenDrawer({
  title: '反馈',
  appendToMain: true,
  modal: false,
  onCancel: () => {
    feedbackCurrentId.value = null;
    feedbackDrawerApi.close();
  },
  async onConfirm() {
    const formValues = await feedbackFormApi.getValues();
    const id = feedbackCurrentId.value;
    if (!id) {
      ElMessage.error('未找到投诉记录');
      return;
    }
    const loading = ElLoading.service({text: '提交中...'});
    try {
      await updateToiletComplaint({id, feedbackContent: formValues.feedbackContent});
      ElMessage.success('反馈成功');
      handleRefresh();
      feedbackDrawerApi.close();
    } catch (error) {
      console.error('反馈失败', error);
      ElMessage.error(`反馈失败：${error.message || '未知错误'}`);
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const rowData = feedbackDrawerApi.getData();
      if (rowData && rowData.id) {
        feedbackCurrentId.value = rowData.id;
        await feedbackFormApi.setValues({
          feedbackContent: rowData.feedbackContent || '',
        });
      } else {
        feedbackFormApi.resetForm();
      }
    } else {
      feedbackCurrentId.value = null;
    }
  },
});

// ---------- 沟通弹窗（用于维修跟踪） ----------
const [CommunicationForm, communicationFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useCommunicationSchema(),
  showDefaultActions: false,
});

const [CommunicationDrawer, communicationDrawerApi] = useVbenDrawer({
  title: '沟通',
  appendToMain: true,
  modal: false,
  onCancel: () => communicationDrawerApi.close(),
  async onConfirm() {
    const formValues = await communicationFormApi.getValues();
    ElMessage.info('沟通功能待实现');
    communicationDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      communicationFormApi.resetForm();
    }
  },
});

// 验收弹窗（维修）
const acceptCurrentId = ref(null);

const [AcceptForm, acceptFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useAcceptSchema(),
  showDefaultActions: false,
});

const [AcceptDrawer, acceptDrawerApi] = useVbenDrawer({
  title: '验收',
  appendToMain: true,
  modal: false,
  onCancel: () => acceptDrawerApi.close(),
  async onConfirm() {
    const formValues = await acceptFormApi.getValues();
    const id = acceptCurrentId.value;
    if (!id) {
      ElMessage.error('未找到维修记录');
      return;
    }
    // 验收结果是必填项，手动验证
    if (!formValues.acceptResult) {
      ElMessage.warning('请选择验收结果');
      return;
    }

    // 构建更新数据
    const updateData = {
      id,
      acceptResult: formValues.acceptResult,
      acceptOpinion: formValues.acceptOpinion,
    };

    // 根据验收结果自动更新维修状态（业务逻辑可调整）
    if (formValues.acceptResult === '合格') {
      updateData.repairStatus = '合格';
    } else if (formValues.acceptResult === '不合格') {
      updateData.repairStatus = '不合格';
    }

    const loading = ElLoading.service({text: '提交中...'});
    try {
      await updateToiletFacilityRepair(updateData);
      ElMessage.success('验收成功');
      handleRefresh();       // 刷新表格数据
      acceptDrawerApi.close();
    } catch (error) {
      console.error('验收失败', error);
      ElMessage.error(`验收失败：${error.message || '未知错误'}`);
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const rowData = acceptDrawerApi.getData();
      if (rowData && rowData.id) {
        acceptCurrentId.value = rowData.id;
        // 预填充表单（如果已有验收结果）
        await acceptFormApi.setValues({
          acceptResult: rowData.acceptResult || '',
          acceptOpinion: rowData.acceptOpinion || '',
        });
      } else {
        acceptCurrentId.value = null;
        acceptFormApi.resetForm();
      }
    } else {
      acceptCurrentId.value = null;
    }
  },
});

// 复盘弹窗（已完成）
const [ReviewPostForm, reviewPostFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {class: 'w-full'},
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useReviewPostSchema(),
  showDefaultActions: false,
});

const [ReviewPostDrawer, reviewPostDrawerApi] = useVbenDrawer({
  title: '复盘',
  appendToMain: true,
  modal: false,
  onCancel: () => reviewPostDrawerApi.close(),
  async onConfirm() {
    const formValues = await reviewPostFormApi.getValues();
    ElMessage.info('复盘功能待实现');
    reviewPostDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      reviewPostFormApi.resetForm();
    }
  },
});

// 统计分析弹窗（已完成）
const [StatisticDrawer, statisticDrawerApi] = useVbenDrawer({
  title: '统计分析',
  appendToMain: true,
  modal: false,
  footer: false,
  onCancel: () => statisticDrawerApi.close(),
});

// ---------- 详情抽屉引用 ----------
const parkDetailDrawerRef = ref(null);
const complaintDetailDrawerRef = ref(null);
const repairDetailDrawerRef = ref(null);
const cleaningDetailDrawerRef = ref(null);
const consumableDetailDrawerRef = ref(null);

function convertToiletItem(item) {
  return {
    ...item,
    name: item.name || item.toiletName,
    areaName: item.areaName || item.areaCode,
    managerName: item.managerName || item.managerId,
    operationStatusName: item.operationStatusName || item.operationStatusId,
    cleanersName:
      item.cleanersName || (item.cleanerIds ? JSON.parse(item.cleanerIds) : []),
    planStatusName:
      optionMaps.planStatusMap.get(item.planStatusId) || item.planStatusName || item.planStatusId,
    createTime: item.createTime
      ? new Date(item.createTime).toLocaleString()
      : '-',
    updateTime: item.updateTime
      ? new Date(item.updateTime).toLocaleString()
      : '-',
    lastSupplyTime: item.lastSupplyTime
      ? new Date(item.lastSupplyTime).toLocaleString()
      : '-',
    warningStatus: item.consumableGap > 0 ? '预警' : '正常',
  };
}

function convertComplaintItem(item) {
  // 解析 reformPhoto 字段用于表格预览
  let reformPhotoList = [];
  let reformPhoto = '';
  if (item.reformPhoto) {
    if (Array.isArray(item.reformPhoto)) {
      reformPhotoList = item.reformPhoto;
      reformPhoto = reformPhotoList[0] || '';
    } else if (typeof item.reformPhoto === 'string') {
      try {
        const parsed = JSON.parse(item.reformPhoto);
        if (Array.isArray(parsed)) {
          reformPhotoList = parsed;
          reformPhoto = parsed[0] || '';
        } else {
          reformPhotoList = [item.reformPhoto];
          reformPhoto = item.reformPhoto;
        }
      } catch {
        if (item.reformPhoto.includes(',')) {
          reformPhotoList = item.reformPhoto.split(',').map((url) => url.trim());
          reformPhoto = reformPhotoList[0] || '';
        } else {
          reformPhotoList = [item.reformPhoto];
          reformPhoto = item.reformPhoto;
        }
      }
    }
  }

  return {
    ...item,
    complaintTime: item.complaintTime
      ? new Date(item.complaintTime).toLocaleString()
      : '-',
    reportTime: item.reportTime
      ? new Date(item.reportTime).toLocaleString()
      : '-',
    createTime: item.createTime
      ? new Date(item.createTime).toLocaleString()
      : '-',
    updateTime: item.updateTime
      ? new Date(item.updateTime).toLocaleString()
      : '-',
    toiletName: item.toiletName,
    complaintTypeName: item.complaintTypeName,
    handlerName: item.handlerName,
    reformPhotoList,
    reformPhoto,
  };
}

function convertRepairItem(item) {
  let photoUrlList = [];
  let firstPhoto = '';
  if (item.photoUrl) {
    if (Array.isArray(item.photoUrl)) {
      photoUrlList = item.photoUrl;
      firstPhoto = photoUrlList[0] || '';
    } else if (typeof item.photoUrl === 'string') {
      try {
        const parsed = JSON.parse(item.photoUrl);
        if (Array.isArray(parsed)) {
          photoUrlList = parsed;
          firstPhoto = parsed[0] || '';
        } else {
          photoUrlList = [item.photoUrl];
          firstPhoto = item.photoUrl;
        }
      } catch {
        if (item.photoUrl.includes(',')) {
          photoUrlList = item.photoUrl.split(',').map((url) => url.trim());
          firstPhoto = photoUrlList[0] || '';
        } else {
          photoUrlList = [item.photoUrl];
          firstPhoto = item.photoUrl;
        }
      }
    }
  }

  return {
    ...item,
    reportTime: item.reportTime
      ? new Date(item.reportTime).toLocaleString()
      : '-',
    expectedCompleteTime: item.expectedCompleteTime
      ? new Date(item.expectedCompleteTime).toLocaleString()
      : '-',
    createTime: item.createTime
      ? new Date(item.createTime).toLocaleString()
      : '-',
    updateTime: item.updateTime
      ? new Date(item.updateTime).toLocaleString()
      : '-',
    toiletName: item.toiletName,
    facilityName: item.facilityName,
    reportName: item.reportName,
    repairName: item.repairName,
    photoUrl: firstPhoto,
    photoUrlList,
  };
}

function convertCleaningItem(item) {
  let cleanerIds = item.cleanerIds;
  if (typeof cleanerIds === 'string') {
    try {
      cleanerIds = JSON.parse(cleanerIds);
    } catch {
      if (cleanerIds.includes(',')) {
        cleanerIds = cleanerIds.split(',').map((s) => s.trim());
      } else {
        cleanerIds = cleanerIds ? [cleanerIds] : [];
      }
    }
  }

  const converted = {
    ...item,
    createTime: item.createTime
      ? new Date(item.createTime).toLocaleString()
      : '-',
    cleanerIds,
  };

  if (item.planStatusName === '已完成') {
    converted.taskType = '保洁任务';
    converted.handlerName =
      item.cleanerNames || (cleanerIds && cleanerIds.join(',')) || '-';
  }

  let proofUrlList = [];
  let firstProof = '';
  const proofSource = item.proofUrls || item.proofUrl;
  if (proofSource) {
    if (Array.isArray(proofSource)) {
      proofUrlList = proofSource;
      firstProof = proofUrlList[0] || '';
    } else if (typeof proofSource === 'string') {
      try {
        const parsed = JSON.parse(proofSource);
        if (Array.isArray(parsed)) {
          proofUrlList = parsed;
          firstProof = parsed[0] || '';
        } else {
          proofUrlList = [proofSource];
          firstProof = proofSource;
        }
      } catch {
        if (proofSource.includes(',')) {
          proofUrlList = proofSource.split(',').map((url) => url.trim());
          firstProof = proofUrlList[0] || '';
        } else {
          proofUrlList = [proofSource];
          firstProof = proofSource;
        }
      }
    }
  }

  converted.proofUrlList = proofUrlList;
  converted.proofUrl = firstProof;

  return converted;
}

function convertConsumableItem(item) {
  return {...item};
}

const getTableData = async ({page}) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...dataObj.searchParams,
  };

  switch (activeName.value) {
    case '保洁待执行': {
      const pendingValue = loadedOptions.planStatus.find(
        (item) => item.label === '未开始',
      )?.value;
      const executingValue = loadedOptions.planStatus.find(
        (item) => item.label === '进行中',
      )?.value;
      if (pendingValue && executingValue) {
        params.planStatusId = [pendingValue, executingValue];
      }

      break;
    }
    case '已完成': {
      const completedValue = loadedOptions.planStatus.find(
        (item) => item.label === '已完成',
      )?.value;
      if (completedValue) {
        params.planStatusId = completedValue;
      }

      break;
    }
    case '投诉待处置': {
      params.dispatchStatus = ['待派单', '已派单'];

      break;
    }
    case '设施待维修': {
      params.repairStatus = ['待维修', '维修中', '已完成', '不合格'];

      break;
    }
    // No default
  }

  try {
    let res;
    if (isComplaintTab.value) {
      res = await getToiletComplaintPage(params);
    } else if (isRepairTab.value) {
      res = await getToiletFacilityRepairPage(params);
    } else if (isCleaningTab.value || isCompletedTab.value) {
      res = await getToiletCleaningTaskPage(params);
    } else if (isConsumableTab.value) {
      res = await getToiletConsumablePage(params);
    } else {
      res = await getPublicToiletPage(params);
    }

    const listData = res.data?.list || res.list || [];
    const total = res.data?.total || res.total || 0;

    let convertedList = [];
    if (isComplaintTab.value) {
      convertedList = listData.map(convertComplaintItem);
    } else if (isRepairTab.value) {
      convertedList = listData.map(convertRepairItem);
    } else if (isCleaningTab.value || isCompletedTab.value) {
      convertedList = listData.map(convertCleaningItem);
    } else if (isConsumableTab.value) {
      convertedList = listData.map(convertConsumableItem);
    } else {
      convertedList = listData.map(convertToiletItem);
    }

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

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gridColumns.value,
    keepSource: true,
    proxyConfig: {ajax: {query: getTableData}},
    rowConfig: {keyField: 'id', isHover: true},
    pagerConfig: dataObj,
    toolbarConfig: {refresh: true, search: true},
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: ({records}) => {
      checkedIds.value = records.map((item) => item.id);
    },
    checkboxChange: ({records}) => {
      checkedIds.value = records.map((item) => item.id);
    },
  },
  showSearchForm: false,
});

watch(activeName, (newVal) => {
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) {
    gridApi.xGrid.refreshColumn();
  } else {
    gridApi.setGridOptions?.({columns: gridColumns.value});
  }
  dataObj.searchParams = {};
  searchDrawerApi.close();
  parkDetailDrawerRef.value?.close();
  complaintDetailDrawerRef.value?.close();
  repairDetailDrawerRef.value?.close();
  cleaningDetailDrawerRef.value?.close();
  consumableDetailDrawerRef.value?.close();
  handleRefresh();
});

function handleRefresh() {
  gridApi.query();
}

function handleClick() {
  gridApi.query();
}

function handleSerachShow() {
  currentSearchFormApi.value.resetForm();
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
  const loading = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [
      row.name ||
      row.complaintId ||
      row.repairId ||
      row.taskNo ||
      row.consumableName,
    ]),
  });
  try {
    if (isComplaintTab.value) {
      await deleteToiletComplaint(row.id);
    } else if (isRepairTab.value) {
      await deleteToiletFacilityRepair(row.id);
    } else if (isCleaningTab.value || isCompletedTab.value) {
      await deleteToiletCleaningTask(row.id);
    } else if (isConsumableTab.value) {
      await deleteToiletConsumable(row.id);
    } else {
      await deletePublicToilet(row.id);
    }
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } catch (error) {
    console.error('删除失败', error);
    ElMessage.error(`删除失败：${error.message || '未知错误'}`);
  } finally {
    loading.close();
  }
}

async function handleDeleteBatch() {
  if (isEmpty(checkedIds.value)) return;
  await confirm($t('确定删除这些数据吗？'));
  const loading = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    if (isComplaintTab.value) {
      await deleteToiletComplaintBatch(checkedIds.value);
    } else if (isRepairTab.value) {
      await deleteToiletFacilityRepairBatch(checkedIds.value);
    } else if (isCleaningTab.value || isCompletedTab.value) {
      await deleteToiletCleaningTaskBatch(checkedIds.value);
    } else if (isConsumableTab.value) {
      await deleteToiletConsumableBatch(checkedIds.value);
    } else {
      await deletePublicToiletBatch(checkedIds.value);
    }
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } catch (error) {
    console.warn('批量删除失败', error);
    ElMessage.error(`批量删除失败：${error.message || '未知错误'}`);
  } finally {
    loading.close();
  }
}

async function handleExport() {
  const params = dataObj.searchParams || {};
  try {
    let response;
    let fileName;
    if (isComplaintTab.value) {
      response = await exportToiletComplaintExcel(params);
      fileName = `投诉记录_${new Date().toLocaleDateString()}.xlsx`;
    } else if (isRepairTab.value) {
      response = await exportToiletFacilityRepairExcel(params);
      fileName = `维修记录_${new Date().toLocaleDateString()}.xlsx`;
    } else if (isCleaningTab.value || isCompletedTab.value) {
      response = await exportToiletCleaningTaskExcel(params);
      fileName = `保洁任务_${new Date().toLocaleDateString()}.xlsx`;
    } else if (isConsumableTab.value) {
      response = await exportToiletConsumableExcel(params);
      fileName = `物资待补充_${new Date().toLocaleDateString()}.xlsx`;
    } else {
      response = await exportPublicToiletExcel(params);
      fileName = `公厕信息_${new Date().toLocaleDateString()}.xlsx`;
    }

    const blob = response.data || response;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    ElMessage.error(`导出失败：${error.message || '未知错误'}`);
  }
}

function handleOpenDetail(row) {
  dataObj.detailObj = row;
  if (isComplaintTab.value) {
    complaintDetailDrawerRef.value?.open();
  } else if (isRepairTab.value) {
    repairDetailDrawerRef.value?.open();
  } else if (isCleaningTab.value || isCompletedTab.value) {
    cleaningDetailDrawerRef.value?.open();
  } else if (isConsumableTab.value) {
    consumableDetailDrawerRef.value?.open();
  } else {
    parkDetailDrawerRef.value?.open();
  }
}

function handleOpenAreaFilter(area) {
  activeName.value = '全部';
  dataObj.searchParams = {area};
  gridApi.reload();
}

function handleOpenStatusFilter(status) {
  const statusMap = {
    正常运营: '全部',
    暂停运营: '全部',
    待整改: '全部',
  };
  const targetTab = statusMap[status] || '全部';
  activeName.value = targetTab;
  gridApi.reload();
}

function handleOpenComplaintDetail(row) {
  dataObj.detailObj = row;
  complaintDetailDrawerRef.value?.open();
}

function handleFilterByConsumable(consumableId) {
  if (activeName.value === '物资待补充') {
    dataObj.searchParams = {consumableId};
    gridApi.reload();
  } else {
    activeName.value = '物资待补充';
    setTimeout(() => {
      dataObj.searchParams = {consumableId};
      gridApi.reload();
    }, 100);
  }
}

const arrowChange = () => emit('arrow-change');

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

// 启动执行（保洁待执行）
const handleStartExecute = async (row) => {
  try {
    // 弹出确认框
    await ElMessageBox.confirm('确定启动执行该保洁计划吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    });

    // 从已加载的选项中找到“进行中”对应的状态ID
    const targetStatusId = loadedOptions.planStatus.find(
      (item) => item.label === '进行中'
    )?.value;
    if (!targetStatusId) {
      ElMessage.error('无法获取进行中状态ID，请稍后重试');
      return;
    }

    // 调用更新接口，只传递必要字段
    await updateToiletCleaningTask({
      id: row.id,
      planStatusId: targetStatusId,
    });

    ElMessage.success('启动成功');
    handleRefresh(); // 刷新列表数据
  } catch (error) {
    // 用户取消确认时不处理
    if (error !== 'cancel') {
      console.error('启动执行失败', error);
      ElMessage.error(`启动执行失败：${error.message || '未知错误'}`);
    }
  }
};

async function loadStatistics() {
  try {
    const res = await getPublicToiletStatistics();
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
      toiletOptionsRes,
      userOptionsRes,
      areaOptionsRes,
      operationStatusOptionsRes,
      complaintTypeOptionsRes,
      facilityOptionsRes,
      planStatusOptionsRes,
      consumableOptionsRes,
    ] = await Promise.all([
      getPublicToiletOptions(),
      getUserOptions(),
      getAreaOptions(),
      getOperationStatusOptions(),
      getComplaintTypeOptions(),
      getFacilityOptions(),
      getPlanStatusOptions(),
      getConsumableOptions(),
    ]);

    const extractData = (res) => {
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      console.warn('返回数据格式异常', res);
      return [];
    };

    loadedOptions.toilet = extractData(toiletOptionsRes);
    loadedOptions.user = extractData(userOptionsRes);
    loadedOptions.area = extractData(areaOptionsRes);
    loadedOptions.operationStatus = extractData(operationStatusOptionsRes);
    loadedOptions.complaintType = extractData(complaintTypeOptionsRes);
    loadedOptions.facility = extractData(facilityOptionsRes);
    loadedOptions.planStatus = extractData(planStatusOptionsRes);
    loadedOptions.consumable = extractData(consumableOptionsRes);

    // 构建状态映射
    optionMaps.planStatusMap = new Map(
      loadedOptions.planStatus.map(item => [item.value, item.label])
    );

    // 获取处置状态选项
    const handleStatusRes = await fetchHandleStatusOptions();
    loadedOptions.handleStatus = handleStatusRes;

    await toiletEditFormApi.updateSchema([
      {
        fieldName: 'areaCode',
        componentProps: {options: loadedOptions.area},
      },
      {
        fieldName: 'operationStatusId',
        componentProps: {options: loadedOptions.operationStatus},
      },
      {
        fieldName: 'managerId',
        componentProps: {options: loadedOptions.user},
      },
      {
        fieldName: 'cleanerIds',
        componentProps: {options: loadedOptions.user},
      },
    ]);

    await complaintEditFormApi.updateSchema([
      {
        fieldName: 'toiletId',
        componentProps: {options: loadedOptions.toilet},
      },
      {
        fieldName: 'complaintTypeId',
        componentProps: {options: loadedOptions.complaintType},
      },
      {
        fieldName: 'handlerId',
        componentProps: {options: loadedOptions.user},
      },
    ]);

    await repairEditFormApi.updateSchema([
      {
        fieldName: 'toiletId',
        componentProps: {options: loadedOptions.toilet},
      },
      {
        fieldName: 'facilityId',
        componentProps: {options: loadedOptions.facility},
      },
      {
        fieldName: 'reportBy',
        componentProps: {options: loadedOptions.user},
      },
      {
        fieldName: 'repairBy',
        componentProps: {options: loadedOptions.user},
      },
    ]);

    await cleaningEditFormApi.updateSchema([
      {
        fieldName: 'toiletId',
        componentProps: {options: loadedOptions.toilet},
      },
      {
        fieldName: 'cleanerIds',
        componentProps: {options: loadedOptions.user, multiple: true},
      },
      {
        fieldName: 'planStatusId',
        componentProps: {options: loadedOptions.planStatus},
      },
    ]);

    await consumableEditFormApi.updateSchema([
      {
        fieldName: 'toiletId',
        componentProps: {options: loadedOptions.toilet},
      },
      {
        fieldName: 'consumableId',
        componentProps: {options: loadedOptions.consumable},
      },
      {
        fieldName: 'managerId',
        componentProps: {options: loadedOptions.user},
      },
    ]);

    await toiletSearchFormApi.updateSchema([
      {
        fieldName: 'areaCode',
        componentProps: {options: loadedOptions.area},
      },
      {
        fieldName: 'operationStatusId',
        componentProps: {options: loadedOptions.operationStatus},
      },
      {
        fieldName: 'managerId',
        componentProps: {options: loadedOptions.user},
      },
      {
        fieldName: 'cleanerIds',
        componentProps: {options: loadedOptions.user},
      },
    ]);

    await complaintSearchFormApi.updateSchema([
      {
        fieldName: 'toiletId',
        componentProps: {options: loadedOptions.toilet},
      },
      {
        fieldName: 'complaintTypeId',
        componentProps: {options: loadedOptions.complaintType},
      },
      {
        fieldName: 'handlerId',
        componentProps: {options: loadedOptions.user},
      },
    ]);

    await repairSearchFormApi.updateSchema([
      {
        fieldName: 'toiletId',
        componentProps: {options: loadedOptions.toilet},
      },
      {
        fieldName: 'facilityId',
        componentProps: {options: loadedOptions.facility},
      },
      {
        fieldName: 'reportBy',
        componentProps: {options: loadedOptions.user},
      },
      {
        fieldName: 'repairBy',
        componentProps: {options: loadedOptions.user},
      },
    ]);

    await cleaningSearchFormApi.updateSchema([
      {
        fieldName: 'toiletId',
        componentProps: {options: loadedOptions.toilet},
      },
      {
        fieldName: 'cleanerIds',
        componentProps: {options: loadedOptions.user, multiple: true},
      },
      {
        fieldName: 'planStatusId',
        componentProps: {options: loadedOptions.planStatus},
      },
    ]);

    await consumableSearchFormApi.updateSchema([
      {
        fieldName: 'toiletId',
        componentProps: {options: loadedOptions.toilet},
      },
      {
        fieldName: 'consumableId',
        componentProps: {options: loadedOptions.consumable},
      },
      {
        fieldName: 'managerId',
        componentProps: {options: loadedOptions.user},
      },
    ]);

    console.log('所有选项加载成功');
  } catch (error) {
    console.error('加载选项失败', error);
    ElMessage.error('加载选项失败，请刷新重试');
  }
}

onMounted(async () => {
  await loadOptions();
  await loadStatistics();
  handleRefresh();
});
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 新增/编辑抽屉 -->
    <EditDrawer :title="getTitle">
      <component :is="currentFormComponent" ref="editFormRef"/>
      <!-- 图片上传区域：投诉、保洁、维修相关标签页时显示 -->
      <div
        v-if="isCompletedTab || isCleaningTab || isRepairTab"
        class="photo-upload-section"
      >
        <div class="photo-manager">
          <div class="upload-area">
            <input
              type="file"
              multiple
              accept="image/*"
              @change="handleImageUpload"
            />
            <span class="upload-tip">可多选图片</span>
          </div>
          <div class="photo-list" v-if="imageList.length > 0">
            <div
              class="photo-item"
              v-for="(url, index) in imageList"
              :key="index"
            >
              <ElImage
                :src="url"
                :preview-src-list="imageList"
                fit="cover"
                style="
                  width: 80px;
                  height: 80px;
                  cursor: pointer;
                  border-radius: 4px;
                "
                :preview-teleported="true"
              />
              <span class="delete-btn" @click="handleImageDelete(url)">✕</span>
            </div>
          </div>
          <div v-else class="no-photo">暂无图片</div>
        </div>
      </div>
    </EditDrawer>

    <!-- 新增功能抽屉 -->
    <AdjustDrawer title="批量调整保洁计划">
      <AdjustForm/>
    </AdjustDrawer>

    <BatchSupplyDrawer title="批量补充登记">
      <BatchSupplyForm/>
    </BatchSupplyDrawer>

    <SupplyDrawer title="补充登记">
      <SupplyForm/>
      <!-- 图片上传区域 -->
      <div class="photo-upload-section">
        <div class="photo-manager">
          <div class="upload-area">
            <input
              type="file"
              multiple
              accept="image/*"
              @change="handleSupplyImageUpload"
            />
            <span class="upload-tip">可多选图片</span>
          </div>
          <div class="photo-list" v-if="supplyImageList.length > 0">
            <div
              class="photo-item"
              v-for="(url, index) in supplyImageList"
              :key="index"
            >
              <ElImage
                :src="url"
                :preview-src-list="supplyImageList"
                fit="cover"
                style="
              width: 80px;
              height: 80px;
              cursor: pointer;
              border-radius: 4px;
            "
                :preview-teleported="true"
              />
              <span class="delete-btn" @click="handleSupplyImageDelete(url)">✕</span>
            </div>
          </div>
          <div v-else class="no-photo">暂无图片</div>
        </div>
      </div>
    </SupplyDrawer>

    <DispatchDrawer title="派单">
      <DispatchForm/>
    </DispatchDrawer>

    <BatchHandleComplaintDrawer title="批量处理投诉">
      <BatchHandleComplaintForm/>
    </BatchHandleComplaintDrawer>

    <!-- 独立处置抽屉 -->
    <DisposeDrawer title="处置">
      <DisposeForm/>
      <!-- 图片上传区域 -->
      <div class="photo-upload-section">
        <div class="photo-manager">
          <div class="upload-area">
            <input
              type="file"
              multiple
              accept="image/*"
              @change="handleDisposeImageUpload"
            />
            <span class="upload-tip">可多选图片</span>
          </div>
          <div class="photo-list" v-if="disposeImageList.length > 0">
            <div
              class="photo-item"
              v-for="(url, index) in disposeImageList"
              :key="index"
            >
              <ElImage
                :src="url"
                :preview-src-list="disposeImageList"
                fit="cover"
                style="
                  width: 80px;
                  height: 80px;
                  cursor: pointer;
                  border-radius: 4px;
                "
                :preview-teleported="true"
              />
              <span class="delete-btn" @click="handleDisposeImageDelete(url)">✕</span>
            </div>
          </div>
          <div v-else class="no-photo">暂无图片</div>
        </div>
      </div>
    </DisposeDrawer>

    <!-- 独立反馈抽屉 -->
    <FeedbackDrawer title="反馈">
      <FeedbackForm/>
    </FeedbackDrawer>

    <CommunicationDrawer title="沟通">
      <CommunicationForm/>
    </CommunicationDrawer>

    <AcceptDrawer title="验收">
      <AcceptForm/>
    </AcceptDrawer>

    <ReviewPostDrawer title="复盘">
      <ReviewPostForm/>
    </ReviewPostDrawer>

    <StatisticDrawer title="统计分析">
      <div class="statistic-content">
        <Chart2 :active-name="activeName" :data-list="dataObj.list"/>
      </div>
    </StatisticDrawer>

    <!-- 详情抽屉（只读） -->
    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
    />
    <ComplaintDetailDrawer
      ref="complaintDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
    />
    <RepairDetailDrawer
      ref="repairDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
    />
    <CleaningDetailDrawer
      ref="cleaningDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
    />
    <ConsumableDetailDrawer
      ref="consumableDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
    />

    <!-- 搜索抽屉 -->
    <SearchDrawer title="搜索">
      <component :is="currentSearchFormComponent" ref="searchFormRef"/>
    </SearchDrawer>

    <!-- 主表格 -->
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
          <!-- 通用按钮 -->
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />

          <!-- 保洁待执行专用按钮 -->
          <template v-if="isCleaningTab">
            <IconButton content="新增" icon-name="Plus" @click="handleCreate"/>
            <IconButton
              content="批量调整"
              icon-name="Operation"
              @click="adjustDrawerApi.open"
              :disabled="isEmpty(checkedIds)"
            />
          </template>

          <!-- 物资待补充专用按钮 -->
          <template v-if="isConsumableTab">
            <IconButton content="新增" icon-name="Plus" @click="handleCreate"/>
            <IconButton
              content="批量补充登记"
              icon-name="Finished"
              @click="batchSupplyDrawerApi.open"
              :disabled="isEmpty(checkedIds)"
            />
          </template>

          <!-- 投诉待处置专用按钮 -->
          <template v-if="isComplaintTab">
            <IconButton content="新增" icon-name="Plus" @click="handleCreate"/>
            <IconButton
              content="派单"
              icon-name="User"
              @click="dispatchDrawerApi.open"
              :disabled="isEmpty(checkedIds)"
            />
            <IconButton
              content="批量处理"
              icon-name="Operation"
              @click="batchHandleComplaintDrawerApi.open"
              :disabled="isEmpty(checkedIds)"
            />
          </template>

          <!-- 设施待维修专用按钮 -->
          <template v-if="isRepairTab">
            <IconButton content="新增" icon-name="Plus" @click="handleCreate"/>
            <IconButton
              content="派单"
              icon-name="User"
              @click="dispatchDrawerApi.open"
              :disabled="isEmpty(checkedIds)"
            />
          </template>

          <!-- 通用：批量删除、搜索、展开/收缩、全屏、图表切换 -->
          <IconButton
            content="批量删除"
            icon-name="delete"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleDeleteBatch"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSerachShow"
          />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="handleFullShow"
          />
          <IconButton
            :content="showChart ? '隐藏图表' : '显示图表'"
            icon-name="PieChart"
            @click="toggleChart"
          />
        </div>
      </template>

      <!-- 表格插槽（原样保留） -->
      <template #name="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">
          {{ row.name || row.toiletName }}
        </el-text>
      </template>
      <template #area="{ row }">
        <el-text @click="handleOpenAreaFilter(row.areaName)" type="primary">
          {{ row.areaName }}
        </el-text>
      </template>
      <template #status="{ row }">
        <el-text
          @click="handleOpenStatusFilter(row.operationStatusName)"
          type="primary"
        >
          {{ row.operationStatusName }}
        </el-text>
      </template>
      <template #toiletName="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">
          {{ row.toiletName }}
        </el-text>
      </template>
      <template #complaintId="{ row }">
        <el-text @click="handleOpenComplaintDetail(row)" type="primary">
          {{ row.complaintId }}
        </el-text>
      </template>
      <template #complaintType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">
          {{ row.complaintTypeName }}
        </el-text>
      </template>
      <template #repairId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">
          {{ row.repairId }}
        </el-text>
      </template>
      <template #facilityType="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">
          {{ row.facilityName }}
        </el-text>
      </template>
      <template #consumableName="{ row }">
        <el-text
          @click="handleFilterByConsumable(row.consumableId)"
          type="primary"
        >
          {{ row.consumableName }}
        </el-text>
      </template>

      <!-- 现场照片列（预览） -->
      <template #photoUrl="{ row }">
        <ElImage
          v-if="row.photoUrl"
          :src="row.photoUrl"
          :preview-src-list="row.photoUrlList"
          fit="cover"
          style="width: 40px; height: 40px; cursor: pointer; border-radius: 4px"
          :preview-teleported="true"
        />
        <span v-else>-</span>
      </template>

      <!-- 佐证材料列（预览） -->
      <template #proofUrl="{ row }">
        <ElImage
          v-if="row.proofUrl"
          :src="row.proofUrl"
          :preview-src-list="row.proofUrlList"
          fit="cover"
          style="width: 40px; height: 40px; cursor: pointer; border-radius: 4px"
          :preview-teleported="true"
        />
        <span v-else>-</span>
      </template>

      <!-- 整改照片列（预览） -->
      <template #reformPhoto="{ row }">
        <ElImage
          v-if="row.reformPhoto"
          :src="row.reformPhoto"
          :preview-src-list="row.reformPhotoList"
          fit="cover"
          style="width: 40px; height: 40px; cursor: pointer; border-radius: 4px"
          :preview-teleported="true"
        />
        <span v-else>-</span>
      </template>

      <template #taskType="{ row }">
        {{ row.taskType || '-' }}
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 详情按钮始终显示 -->
          <IconButton content="详情" icon-name="View" @click="handleOpenDetail(row)"/>

          <!-- 全部标签页：任务跟踪 -->
          <IconButton
            v-if="activeName === '全部'"
            content="任务跟踪"
            icon-name="link"
            @click="handleTaskTrack(row)"
          />

          <!-- 保洁待执行：编辑、启动执行 -->
          <template v-if="isCleaningTab">
            <IconButton
              content="编辑"
              icon-name="edit"
              @click="handleEdit(row)"
            />
            <IconButton
              content="启动执行"
              icon-name="VideoPlay"
              @click="handleStartExecute(row)"
            />
          </template>

          <!-- 物资待补充：补充登记 -->
          <template v-if="isConsumableTab">
            <IconButton
              content="编辑"
              icon-name="edit"
              @click="handleEdit(row)"
            />
            <IconButton
              content="补充登记"
              icon-name="EditPen"
              @click="supplyDrawerApi.setData(row); supplyDrawerApi.open()"
            />
          </template>

          <!-- 投诉待处置：处置、反馈 -->
          <template v-if="isComplaintTab">
            <IconButton
              content="编辑"
              icon-name="edit"
              @click="handleEdit(row)"
            />
            <IconButton
              content="处置"
              icon-name="Tools"
              @click="disposeDrawerApi.setData(row); disposeDrawerApi.open()"
            />
            <IconButton
              content="反馈"
              icon-name="ChatDotRound"
              @click="feedbackDrawerApi.setData(row); feedbackDrawerApi.open()"
            />
          </template>

          <!-- 设施待维修：跟踪、验收 -->
          <template v-if="isRepairTab">
            <IconButton
              content="编辑"
              icon-name="edit"
              @click="handleEdit(row)"
            />
            <IconButton
              content="跟踪"
              icon-name="Timer"
              @click="communicationDrawerApi.open"
            />
            <IconButton
              content="验收"
              icon-name="Finished"
              :disabled="row.repairStatus === '待维修' || row.repairStatus === '维修中'"
              @click="acceptDrawerApi.setData(row); acceptDrawerApi.open()"
            />
          </template>

          <!-- 已完成：复盘 -->
          <IconButton
            v-if="isCompletedTab"
            content="复盘"
            icon-name="DataAnalysis"
            @click="reviewPostDrawerApi.open"
          />

          <!-- 删除按钮始终显示 -->
          <IconButton
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDelete(row)"
          />
        </div>
      </template>

      <template #bottom>
        <div
          class="common-total"
          @click="dataObj.totalShow = !dataObj.totalShow"
        >
          <el-icon>
            <ArrowDown v-if="!dataObj.totalShow"/>
            <ArrowUp v-else/>
          </el-icon>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <div
            v-if="dataObj.totalShow && showChart && activeName !== '全部'"
            class="bottom-chart-wrapper"
          >
            <Chart2 :active-name="activeName" :data-list="dataObj.list"/>
          </div>
        </div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
/* 强制显示底部容器，覆盖全局样式的 display: none */
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

  input[type='file'] {
    margin-right: 8px;
  }

  .upload-tip {
    font-size: 12px;
    color: #999;
  }
}

.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.photo-item {
  position: relative;

  .delete-btn {
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

    &:hover {
      background: #f56c6c;
    }
  }
}

.no-photo {
  padding: 20px;
  color: #999;
  text-align: center;
}

.statistic-content {
  padding: 20px;
  min-height: 400px;
}
</style>
