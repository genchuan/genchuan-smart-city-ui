<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { ElImage, ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createGarbageAbnormal,
  createGarbageCollection,
  deleteGarbageAbnormal,
  deleteGarbageAbnormalBatch,
  deleteGarbageCollection,
  deleteGarbageCollectionBatch,
  exportGarbageAbnormalExcel,
  exportGarbageCollectionExcel,
  getGarbageAbnormalPage,
  getGarbageCollection,
  getGarbageCollectionPage,
  getGarbageCollectionStatistics,
  importGarbageCollection,
  updateGarbageAbnormal,
  updateGarbageCollection,
  updateGarbageCollectionBatch,
  batchReviewGarbageAbnormal,
  batchHandleGarbageAbnormal,
  uploadImageBatch
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/garbageCollection/data.js';
import {
  getAbnormalTypeOptions,
  getAreaOptions,
  getCollectionFrequencyOptions,
  getColumnsByStatus,
  getGarbageCollectionOptions,
  getGarbageTypeOptions,
  getHandleStatusOptions,
  getPlanStatusOptions,
  getPointOptions,
  getReviewStatusOptions,
  getTimePeriodOptions,
  getUserOptions,
  getVehicleOptions,
  textObj,
  useAbnormalFormSchema,
  useAbnormalHandleSchema,
  useBatchAdjustSchema,
  useBatchImportSchema,
  useCommunicationSchema,
  useDispatchSchema,
  useFormSchema,
  useReviewPostSchema,
  useReviewSchema,
  useTrackSchema,
  useBatchHandleSchema
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/garbageCollection/form.js';
import { $t } from '#/locales';

import AbnormalDetailDrawer from './components/abnormalDetail.vue';
import Chart2 from './components/chart2.vue';
import ParkDetailDrawer from './components/detail.vue';
import BatchImport from './components/importBatch.vue';

const props = defineProps({
  secondShow: Boolean,
  arrowShow: Boolean,
  arrowState: Boolean,
});
const emit = defineEmits(['arrow-change']);

const getTitle = computed(() =>
  formData.value?.id ? textObj.editText : textObj.addText,
);

// ---------- 搜索抽屉 ----------
const [SearchDrawer, searchDrawerApi] = useVbenDrawer({
  modal: false,
  footer: false,
  onCancel: () => searchDrawerApi.close(),
});

const planSearchSchema = useFormSchema().filter((field) => field.searchFilter);
const abnormalSearchSchema = useAbnormalFormSchema().filter(
  (field) => field.searchFilter,
);

const [SearchFormPlan, planSearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: async () => {
    dataObj.searchParams = await planSearchFormApi.getValues();
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: planSearchSchema,
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

const [SearchFormAbnormal, abnormalSearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: async () => {
    const rawValues = await abnormalSearchFormApi.getValues();
    const converted = {
      ...rawValues,
      reportBy: rawValues.reportUserId,
    };
    delete converted.reportUserId;
    dataObj.searchParams = converted;
    gridApi.reload();
    searchDrawerApi.close();
  },
  layout: 'horizontal',
  schema: abnormalSearchSchema,
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
});

// ---------- 新增/编辑抽屉（收运计划） ----------
const formData = ref();

const [EditForm, editFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [EditDrawer, editDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel: () => editDrawerApi.close(),
  async onConfirm() {
    const formValues = await editFormApi.getValues();
    const isAdd = !formData.value?.id;

    const submitData = {
      ...formValues,
      pointIds: Array.isArray(formValues.pointIds)
        ? JSON.stringify(formValues.pointIds)
        : undefined,
      staffIds: Array.isArray(formValues.staffIds)
        ? JSON.stringify(formValues.staffIds)
        : undefined,
    };

    try {
      await (isAdd
        ? createGarbageCollection(submitData)
        : updateGarbageCollection({ ...submitData, id: formData.value.id }));
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

      // 更新表单选项
      editFormApi.updateSchema([
        {
          fieldName: 'garbageTypeId',
          componentProps: {
            options: Array.from(
              optionMaps.garbageTypeMap,
              ([value, label]) => ({
                value,
                label,
              }),
            ),
          },
        },
        {
          fieldName: 'pointIds',
          componentProps: {
            options: Array.from(optionMaps.pointMap, ([value, label]) => ({
              value,
              label,
            })),
          },
        },
        {
          fieldName: 'planStatusId',
          componentProps: {
            options: Array.from(optionMaps.planStatusMap, ([value, label]) => ({
              value,
              label,
            })),
          },
        },
        {
          fieldName: 'frequency',
          componentProps: {
            options: Array.from(optionMaps.frequencyMap, ([value, label]) => ({
              value,
              label,
            })),
          },
        },
        {
          fieldName: 'staffIds',
          componentProps: {
            options: Array.from(optionMaps.userMap, ([value, label]) => ({
              value,
              label,
            })),
          },
        },
        {
          fieldName: 'vehicleId',
          componentProps: {
            options: Array.from(optionMaps.vehicleMap, ([value, label]) => ({
              value,
              label,
            })),
          },
        },
        {
          fieldName: 'timePeriod',
          componentProps: {
            options: Array.from(optionMaps.timePeriodMap, ([value, label]) => ({
              value,
              label,
            })),
          },
        },
        {
          fieldName: 'areaCode',
          componentProps: {
            options: Array.from(optionMaps.areaMap, ([value, label]) => ({
              value,
              label,
            })),
          },
        },
        {
          fieldName: 'createBy',
          componentProps: {
            options: Array.from(optionMaps.userMap, ([value, label]) => ({
              value,
              label,
            })),
          },
        },
      ]);

      if (formData.value?.id) {
        try {
          const res = await getGarbageCollection(formData.value.id);
          const detail = res.data || res;
          const formValues = {
            ...detail,
            totalVolume:
              detail.totalCollectedQuantity ??
              detail.totalVolume ??
              formData.value.totalVolume,
            abnormalResult:
              detail.abnormalDisposalResult ??
              detail.abnormalResult ??
              formData.value.abnormalResult,
            createBy: detail.createBy ?? formData.value?.createBy,
            pointIds: detail.pointIds ? JSON.parse(detail.pointIds) : [],
            staffIds: detail.staffIds ? JSON.parse(detail.staffIds) : [],
          };
          await editFormApi.setValues(formValues);
        } catch (error) {
          console.warn('获取详情失败', error);
        }
      } else {
        editFormApi.resetForm();
      }
    }
  },
});

// ---------- 异常上报抽屉（重构为公厕模块模式） ----------
const abnormalReportImageList = ref([]);
const abnormalReportCurrentId = ref(null);

const [AbnormalReportForm, abnormalReportFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useAbnormalFormSchema(),
  showDefaultActions: false,
});

// 独立图片上传函数
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
      newUrls = res.map(item => item.url);
    } else if (res?.code === 0 && Array.isArray(res.data)) {
      newUrls = res.data.map(item => item.url);
    } else if (res?.data && Array.isArray(res.data)) {
      newUrls = res.data.map(item => item.url);
    } else {
      ElMessage.error(res?.msg || '上传失败');
      return;
    }
    abnormalReportImageList.value = [...abnormalReportImageList.value, ...newUrls];
    ElMessage.success('上传成功');
  } catch (error) {
    console.error('上传图片异常', error);
    ElMessage.error(`上传图片失败：${error.message}`);
  } finally {
    loading.close();
    event.target.value = '';
  }
};

// 独立图片删除函数
const handleReportImageDelete = (url) => {
  abnormalReportImageList.value = abnormalReportImageList.value.filter(item => item !== url);
  ElMessage.success('删除成功');
};

const [AbnormalReportDrawer, abnormalReportDrawerApi] = useVbenDrawer({
  title: '异常上报',
  appendToMain: true,
  modal: false,
  onCancel: () => {
    abnormalReportCurrentId.value = null;
    abnormalReportImageList.value = [];
    abnormalReportDrawerApi.close();
  },
  async onConfirm() {
    const formValues = await abnormalReportFormApi.getValues();

    const abnormalPhotoUrl = abnormalReportImageList.value.length > 0
      ? JSON.stringify(abnormalReportImageList.value)
      : '';

    const submitData = {
      planId: formValues.planNo,
      reportBy: formValues.reportUserId,
      reportTime: formValues.reportTime,
      abnormalTypeId: formValues.abnormalTypeId,
      abnormalDesc: formValues.abnormalDesc,
      areaCode: formValues.areaCode,
      priority: formValues.priority,
      handleStatus: formValues.handleStatus,
      abnormalPhotoUrl,
    };
    delete submitData.planNo;
    delete submitData.reportUserId;

    try {
      await createGarbageAbnormal(submitData);
      ElMessage.success('异常上报成功');
      await updatePlanAbnormalStatus(formValues.planNo, 1);
      handleRefresh();
      abnormalReportDrawerApi.close();
    } catch (error) {
      console.error('上报失败', error);
      ElMessage.error('上报失败，请重试');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const defaultData = abnormalReportDrawerApi.getData() || {};
      abnormalReportCurrentId.value = defaultData.id || null;
      abnormalReportFormApi.resetForm();

      await abnormalReportFormApi.setValues({
        reportTime: Date.now(),
        priority: '中',
        handleStatus: '待处置',
        ...defaultData,
      });

      abnormalReportFormApi.updateSchema([
        {
          fieldName: 'abnormalTypeId',
          componentProps: {
            options: Array.from(optionMaps.abnormalTypeMap, ([value, label]) => ({ value, label })),
          },
        },
        {
          fieldName: 'areaCode',
          componentProps: {
            options: Array.from(optionMaps.areaMap, ([value, label]) => ({ value, label })),
          },
        },
        {
          fieldName: 'reportUserId',
          componentProps: {
            options: Array.from(optionMaps.userMap, ([value, label]) => ({ value, label })),
          },
        },
        {
          fieldName: 'handleStatus',
          componentProps: {
            options: Array.from(optionMaps.handleStatusMap, ([value, label]) => ({ value, label })),
          },
        },
        {
          fieldName: 'planNo',
          componentProps: { options: planNoOptions.value },
        },
      ]);

      if (abnormalReportCurrentId.value) {
        const rowData = defaultData;
        if (rowData.abnormalPhotoUrl) {
          try {
            abnormalReportImageList.value = JSON.parse(rowData.abnormalPhotoUrl);
          } catch {
            abnormalReportImageList.value = rowData.abnormalPhotoUrl ? [rowData.abnormalPhotoUrl] : [];
          }
        } else {
          abnormalReportImageList.value = [];
        }
      } else {
        abnormalReportImageList.value = [];
      }
    } else {
      abnormalReportCurrentId.value = null;
      abnormalReportImageList.value = [];
    }
  },
});

// ---------- 异常处置抽屉（重构为公厕模块模式） ----------
const abnormalHandleImageList = ref([]);
const abnormalHandleCurrentId = ref(null);

const [AbnormalHandleForm, abnormalHandleFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useAbnormalHandleSchema(),
  showDefaultActions: false,
});

// 独立图片上传函数
const handleHandleImageUpload = async (event) => {
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
      newUrls = res.map(item => item.url);
    } else if (res?.code === 0 && Array.isArray(res.data)) {
      newUrls = res.data.map(item => item.url);
    } else if (res?.data && Array.isArray(res.data)) {
      newUrls = res.data.map(item => item.url);
    } else {
      ElMessage.error(res?.msg || '上传失败');
      return;
    }
    abnormalHandleImageList.value = [...abnormalHandleImageList.value, ...newUrls];
    ElMessage.success('上传成功');
  } catch (error) {
    console.error('上传图片异常', error);
    ElMessage.error(`上传图片失败：${error.message}`);
  } finally {
    loading.close();
    event.target.value = '';
  }
};

// 独立图片删除函数
const handleHandleImageDelete = (url) => {
  abnormalHandleImageList.value = abnormalHandleImageList.value.filter(item => item !== url);
  ElMessage.success('删除成功');
};

const [AbnormalHandleDrawer, abnormalHandleDrawerApi] = useVbenDrawer({
  title: '异常处置',
  appendToMain: true,
  modal: false,
  onCancel: () => {
    abnormalHandleCurrentId.value = null;
    abnormalHandleImageList.value = [];
    abnormalHandleDrawerApi.close();
  },
  async onConfirm() {
    const formValues = await abnormalHandleFormApi.getValues();
    const id = abnormalHandleCurrentId.value;
    if (!id) {
      ElMessage.error('异常数据不存在');
      return;
    }

    const handlePhotoUrl = abnormalHandleImageList.value.length > 0
      ? JSON.stringify(abnormalHandleImageList.value)
      : '';

    const submitData = {
      id,
      handlerId: formValues.handlerId,
      handleTime: formValues.handleTime,
      handleDesc: formValues.handleDesc,
      handleStatus: formValues.handleStatus,  // 提交处置状态
      handlePhotoUrl,
    };

    try {
      await updateGarbageAbnormal(submitData);
      ElMessage.success('处置成功');
      handleRefresh();
      abnormalHandleDrawerApi.close();
    } catch (error) {
      console.error('处置失败', error);
      ElMessage.error('处置失败，请重试');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const rowData = abnormalHandleDrawerApi.getData();
      if (!rowData || !rowData.id) {
        ElMessage.error('未获取到异常记录');
        abnormalHandleDrawerApi.close();
        return;
      }
      abnormalHandleCurrentId.value = rowData.id;

      // 更新下拉选项（包含处置状态）
      abnormalHandleFormApi.updateSchema([
        {
          fieldName: 'abnormalTypeId',
          componentProps: {
            options: Array.from(optionMaps.abnormalTypeMap, ([value, label]) => ({ value, label })),
          },
        },
        {
          fieldName: 'handlerId',
          componentProps: {
            options: Array.from(optionMaps.userMap, ([value, label]) => ({ value, label })),
          },
        },
        {
          fieldName: 'handleStatus',  // 新增处置状态选项
          componentProps: {
            options: Array.from(optionMaps.handleStatusMap, ([value, label]) => ({ value, label })),
          },
        },
        {
          fieldName: 'planNo',
          componentProps: { options: planNoOptions.value, disabled: true },
        },
      ]);

      // 填充表单数据，并设置默认值
      await abnormalHandleFormApi.setValues({
        planNo: rowData.planId || rowData.planNo,
        abnormalTypeId: rowData.abnormalTypeId,
        handlerId: rowData.handlerId,
        handleStatus: rowData.handleStatus || '待复核',   // 默认 '待复核'
        handleTime: rowData.handleTime || Date.now(),     // 默认当前时间
        handleDesc: rowData.handleDesc,
      });

      // 加载已有整改照片（保持不变）
      if (rowData.handlePhotoUrl) {
        try {
          abnormalHandleImageList.value = JSON.parse(rowData.handlePhotoUrl);
        } catch {
          abnormalHandleImageList.value = rowData.handlePhotoUrl ? [rowData.handlePhotoUrl] : [];
        }
      } else {
        abnormalHandleImageList.value = [];
      }
    } else {
      abnormalHandleCurrentId.value = null;
      abnormalHandleImageList.value = [];
    }
  }
});

// ---------- 其他抽屉保持不变 ----------
const planNoOptions = ref([]);

async function updatePlanAbnormalStatus(planNo, delta) {
  if (!planNo) return;
  try {
    const res = await getGarbageCollectionPage({ planNo, pageSize: 1 });
    const planList = res.data?.list || res.list || [];
    if (planList.length === 0) {
      console.warn('未找到对应的计划单:', planNo);
      return;
    }
    const plan = planList[0];
    const planId = plan.id;
    const currentCount = plan.abnormalCount || 0;
    const newCount = Math.max(0, currentCount + delta);
    const updateData = {
      id: planId,
      abnormalCount: newCount,
      isAbnormal: newCount > 0,
    };
    await updateGarbageCollection(updateData);
  } catch (error) {
    console.error('更新计划单异常状态失败', error);
    ElMessage.warning('更新关联计划单异常计数失败');
  }
}

// ---------- 批量导入抽屉 ----------
const [ImportForm, importFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useBatchImportSchema(),
  showDefaultActions: false,
});

const [ImportDrawer, importDrawerApi] = useVbenDrawer({
  title: '批量导入收运计划',
  appendToMain: true,
  modal: false,
  onCancel: () => importDrawerApi.close(),
  async onConfirm() {
    const formValues = await importFormApi.getValues();
    const file = formValues.file;
    if (!file) {
      ElMessage.warning('请上传文件');
      return;
    }
    const loading = ElLoading.service({ text: '导入中...' });
    try {
      const res = await importGarbageCollection(file);
      if (res.code === 0) {
        ElMessage.success(
          `导入成功：成功 ${res.data.successCount} 条，失败 ${res.data.errorCount} 条`,
        );
        handleRefresh();
        importDrawerApi.close();
      } else {
        ElMessage.error(res.msg || '导入失败');
      }
    } catch (error) {
      console.error('导入失败', error);
      ElMessage.error('导入失败，请重试');
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      importFormApi.resetForm();
    }
  },
});

// ---------- 批量调整抽屉 ----------
const [AdjustForm, adjustFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useBatchAdjustSchema(),
  showDefaultActions: false,
});

const [AdjustDrawer, adjustDrawerApi] = useVbenDrawer({
  title: '批量调整收运计划',
  appendToMain: true,
  modal: false,
  onCancel: () => adjustDrawerApi.close(),
  async onConfirm() {
    const formValues = await adjustFormApi.getValues();
    const { adjustType } = formValues;

    if (checkedIds.value.length === 0) {
      ElMessage.warning('请至少选择一条收运计划');
      return;
    }

    const updateFields = {};
    switch (adjustType) {
      case 'frequency': {
        if (!formValues.newFrequency) {
          ElMessage.warning('请选择新频次');
          return;
        }
        updateFields.frequency = formValues.newFrequency;

        break;
      }
      case 'staffIds': {
        if (!formValues.newStaffIds || formValues.newStaffIds.length === 0) {
          ElMessage.warning('请选择新人员');
          return;
        }
        updateFields.staffIds = JSON.stringify(formValues.newStaffIds);

        break;
      }
      case 'timePeriod': {
        if (!formValues.newTimePeriod) {
          ElMessage.warning('请选择新时段');
          return;
        }
        updateFields.timePeriod = formValues.newTimePeriod;

        break;
      }
      case 'vehicleId': {
        if (!formValues.newVehicleId) {
          ElMessage.warning('请选择新车辆');
          return;
        }
        updateFields.vehicleId = formValues.newVehicleId;

        break;
      }
      default: {
        ElMessage.warning('请选择调整维度');
        return;
      }
    }

    const params = {
      ids: checkedIds.value,
      updateFields,
    };

    const loading = ElLoading.service({ text: '批量调整中...' });
    try {
      const res = await updateGarbageCollectionBatch(params);
      const responseData = res?.data ?? res;
      const isSuccess = responseData?.code === 0 || responseData === true;

      if (isSuccess) {
        ElMessage.success('批量调整成功');
        adjustDrawerApi.close();
        handleRefresh();
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
            options: Array.from(optionMaps.timePeriodMap, ([value, label]) => ({
              value,
              label,
            })),
          },
        },
        {
          fieldName: 'newFrequency',
          componentProps: {
            options: Array.from(optionMaps.frequencyMap, ([value, label]) => ({
              value,
              label,
            })),
          },
        },
        {
          fieldName: 'newVehicleId',
          componentProps: {
            options: Array.from(optionMaps.vehicleMap, ([value, label]) => ({
              value,
              label,
            })),
          },
        },
        {
          fieldName: 'newStaffIds',
          componentProps: {
            options: Array.from(optionMaps.userMap, ([value, label]) => ({
              value,
              label,
            })),
          },
        },
      ]);
    }
  },
});

// ---------- 沟通抽屉 ----------
const [CommunicationForm, communicationFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
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

// ---------- 派发/指派抽屉 ----------
const [DispatchForm, dispatchFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useDispatchSchema(),
  showDefaultActions: false,
});

const [DispatchDrawer, dispatchDrawerApi] = useVbenDrawer({
  title: '派发/指派',
  appendToMain: true,
  modal: false,
  onCancel: () => dispatchDrawerApi.close(),
  async onConfirm() {
    const formValues = await dispatchFormApi.getValues();
    ElMessage.info('派发功能待实现');
    dispatchDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      dispatchFormApi.resetForm();
      dispatchFormApi.updateSchema([
        {
          fieldName: 'handlerId',
          componentProps: {
            options: Array.from(optionMaps.userMap, ([value, label]) => ({
              value,
              label,
            })),
          },
        },
      ]);
    }
  },
});

// ---------- 跟踪抽屉 ----------
const [TrackForm, trackFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useTrackSchema(),
  showDefaultActions: false,
});

const [TrackDrawer, trackDrawerApi] = useVbenDrawer({
  title: '跟踪',
  appendToMain: true,
  modal: false,
  onCancel: () => trackDrawerApi.close(),
  async onConfirm() {
    const formValues = await trackFormApi.getValues();
    ElMessage.info('跟踪功能待实现');
    trackDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      trackFormApi.resetForm();
    }
  },
});

// ---------- 批量处理抽屉 ----------
const [BatchHandleForm, batchHandleFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useBatchHandleSchema(),
  showDefaultActions: false,
});

const [BatchHandleDrawer, batchHandleDrawerApi] = useVbenDrawer({
  title: '批量处理',
  appendToMain: true,
  modal: false,
  onCancel: () => batchHandleDrawerApi.close(),
  async onConfirm() {
    const formValues = await batchHandleFormApi.getValues();
    const { handleStatus } = formValues;
    if (!handleStatus) {
      ElMessage.warning('请选择处置状态');
      return;
    }

    const ids = checkedIds.value;
    if (ids.length === 0) {
      ElMessage.warning('请至少选择一条异常记录');
      return;
    }

    const loading = ElLoading.service({ text: '批量处理中...' });
    try {
      await batchHandleGarbageAbnormal({
        ids,
        handleStatus,
      });
      ElMessage.success('批量处理成功');
      batchHandleDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error('批量处理失败', error);
      ElMessage.error(error.message || '批量处理失败，请重试');
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      batchHandleFormApi.resetForm();
      const handleStatusOptions = Array.from(
        optionMaps.handleStatusMap,
        ([value, label]) => ({ value, label })
      );
      batchHandleFormApi.updateSchema([
        {
          fieldName: 'handleStatus',
          componentProps: { options: handleStatusOptions },
        },
      ]);
    }
  },
});

// ---------- 复核抽屉 ----------
const reviewingRow = ref(null);

const [ReviewForm, reviewFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useReviewSchema(),
  showDefaultActions: false,
});

const [ReviewDrawer, reviewDrawerApi] = useVbenDrawer({
  title: '复核',
  appendToMain: true,
  modal: false,
  onCancel: () => reviewDrawerApi.close(),
  async onConfirm() {
    const formValues = await reviewFormApi.getValues();
    const { reviewResult, reviewComment } = formValues;
    if (!reviewResult) {
      ElMessage.warning('请选择复核结果');
      return;
    }
    if (!reviewingRow.value?.id) {
      ElMessage.error('异常数据不存在');
      return;
    }

    let handleStatus;
    if (reviewResult === '通过') {
      handleStatus = optionMaps.handleStatusNameToId.get('已办结');
      if (!handleStatus) {
        ElMessage.error('无法获取已办结状态ID');
        return;
      }
    } else if (reviewResult === '退回') {
      handleStatus = optionMaps.handleStatusNameToId.get('待处置');
      if (!handleStatus) {
        ElMessage.error('无法获取待处置状态ID');
        return;
      }
    }

    const loading = ElLoading.service({ text: '提交中...' });
    try {
      await updateGarbageAbnormal({
        id: reviewingRow.value.id,
        reviewStatus: reviewResult,
        reviewDesc: reviewComment || '',
        ...(handleStatus && { handleStatus }),
      });
      ElMessage.success('复核成功');
      reviewDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error('复核失败', error);
      ElMessage.error(error.message || '复核失败，请重试');
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const rowData = reviewDrawerApi.getData();
      reviewingRow.value = rowData;
      reviewFormApi.resetForm();
    } else {
      reviewingRow.value = null;
    }
  },
});

// ---------- 批量复核抽屉 ----------
const [BatchReviewForm, batchReviewFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useReviewSchema(),
  showDefaultActions: false,
});

const [BatchReviewDrawer, batchReviewDrawerApi] = useVbenDrawer({
  title: '批量复核',
  appendToMain: true,
  modal: false,
  onCancel: () => batchReviewDrawerApi.close(),
  async onConfirm() {
    const formValues = await batchReviewFormApi.getValues();
    const { reviewResult, reviewComment } = formValues;
    if (!reviewResult) {
      ElMessage.warning('请选择复核结果');
      return;
    }

    const ids = checkedIds.value;
    if (ids.length === 0) {
      ElMessage.warning('请至少选择一条异常记录');
      return;
    }

    let handleStatus;
    if (reviewResult === '通过') {
      handleStatus = optionMaps.handleStatusNameToId.get('已办结');
      if (!handleStatus) {
        ElMessage.error('无法获取已办结状态ID');
        return;
      }
    } else if (reviewResult === '退回') {
      handleStatus = optionMaps.handleStatusNameToId.get('待处置');
      if (!handleStatus) {
        ElMessage.error('无法获取待处置状态ID');
        return;
      }
    }

    const loading = ElLoading.service({ text: '批量复核中...' });
    try {
      await batchReviewGarbageAbnormal({
        ids,
        reviewStatus: reviewResult,
        reviewDesc: reviewComment || '',
        ...(handleStatus && { handleStatus }), // 确保批量接口支持 handleStatus 字段
      });
      ElMessage.success('批量复核成功');
      batchReviewDrawerApi.close();
      handleRefresh();
    } catch (error) {
      console.error('批量复核失败', error);
      ElMessage.error(error.message || '批量复核失败，请重试');
    } finally {
      loading.close();
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      batchReviewFormApi.resetForm();
    }
  },
});

// ---------- 复盘抽屉 ----------
const [ReviewPostForm, reviewPostFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
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

// ---------- 启动执行确认 ----------
const handleStartExecute = async (row) => {
  try {
    await ElMessageBox.confirm('确定启动执行该计划吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    });

    const targetStatusId = optionMaps.planStatusNameToId.get('进行中');
    if (!targetStatusId) {
      ElMessage.error('无法获取进行中状态ID，请稍后重试');
      return;
    }

    await updateGarbageCollection({
      id: row.id,
      planStatusId: targetStatusId,
    });

    ElMessage.success('启动成功');
    handleRefresh();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('启动执行失败', error);
      ElMessage.error(`启动执行失败：${error.message || '未知错误'}`);
    }
  }
};

// ---------- 定位跟踪 ----------
const handleLocationTrack = () => {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择要跟踪的车辆');
    return;
  }
  ElMessage.info('定位跟踪功能待实现');
};

// ---------- 批量派发、批量处理、批量复核 ----------
const handleBatchDispatch = () => {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择异常任务');
    return;
  }
  dispatchDrawerApi.open();
};

const handleBatchProcess = () => {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择异常任务');
    return;
  }
  batchHandleDrawerApi.open();
};

const handleBatchReview = () => {
  if (isEmpty(checkedIds.value)) {
    ElMessage.warning('请先选择待复核任务');
    return;
  }
  batchReviewDrawerApi.open();
};

function handleRefresh() {
  gridApi.query();
  loadStatistics();
}

async function handleExport() {
  try {
    const params = dataObj.searchParams || {};
    const areaCode = params.areaCode;
    let areaName = '全部区域';

    if (areaCode) {
      areaName = optionMaps.areaMap.get(areaCode);
      if (!areaName) {
        areaName = areaCode;
      }
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    let fileName = '';
    let response;

    const isAbnormal =
      activeName.value === '异常待处置' || activeName.value === '处置待复核';

    if (isAbnormal) {
      fileName = `整改与复核记录.xlsx`;
      response = await exportGarbageAbnormalExcel(params);
    } else {
      fileName = `垃圾收运任务_${areaName}_${dateStr}.xlsx`;
      response = await exportGarbageCollectionExcel(params);
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
    console.log('【导出流程】进入 catch 块，错误对象:', error);
    const blob =
      error instanceof Blob
        ? error
        : error.response?.data instanceof Blob
          ? error.response.data
          : null;
    if (blob) {
      const fileName = textObj.excelAllName || 'export.xls';
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      return;
    }
    ElMessage.error(`导出失败：${error.message || '未知错误'}`);
  }
}

function handleCreate() {
  editDrawerApi.setData({ title: textObj.addText }).open();
}

function handleEdit(row) {
  const isAbnormal =
    activeName.value === '异常待处置' || activeName.value === '处置待复核';
  if (isAbnormal) {
    // 异常记录：传入默认值覆盖原有的处置状态和处置时间
    abnormalHandleDrawerApi.setData({
      ...(row._raw || row),        // 保留原有数据
      handleStatus: '待复核',       // 强制默认处置状态为“待复核”
      handleTime: Date.now(),       // 强制默认处置时间为当前时间
    }).open();
  } else {
    editDrawerApi.setData({ title: textObj.editText, ...row }).open();
  }
}

async function handleDelete(row) {
  const isAbnormal =
    activeName.value === '异常待处置' || activeName.value === '处置待复核';
  const deleteApi = isAbnormal
    ? deleteGarbageAbnormal
    : deleteGarbageCollection;
  const nameField = isAbnormal ? row.abnormalId || row.id : row.planNo;

  const loading = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [nameField]),
  });
  try {
    await deleteApi(row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [nameField]));
    if (isAbnormal && row.planNo) {
      await updatePlanAbnormalStatus(row.planNo, -1);
    }
    handleRefresh();
  } catch (error) {
    console.error('删除失败', error);
    ElMessage.error(`删除失败：${error.message || '未知错误'}`);
  } finally {
    loading.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？'));
  const loading = ElLoading.service({
    text: $t('ui.actionMessage.deletingBatch'),
  });
  try {
    const isAbnormal =
      activeName.value === '异常待处置' || activeName.value === '处置待复核';

    if (isAbnormal) {
      await deleteGarbageAbnormalBatch(checkedIds.value);
      const planDeltaMap = new Map();
      checkedIds.value.forEach((id) => {
        const abnormal = dataObj.list.find((item) => item.id === id);
        if (abnormal && abnormal.planNo) {
          planDeltaMap.set(
            abnormal.planNo,
            (planDeltaMap.get(abnormal.planNo) || 0) + 1,
          );
        }
      });
      for (const [planNo, delta] of planDeltaMap.entries()) {
        await updatePlanAbnormalStatus(planNo, -delta);
      }
    } else {
      await deleteGarbageCollectionBatch(checkedIds.value);
    }
    ElMessage.success($t('删除成功'));
    handleRefresh();
  } catch (error) {
    console.warn('批量删除失败', error);
    ElMessage.error(`批量删除失败：${error.message || '未知错误'}`);
    handleRefresh();
  } finally {
    loading.close();
  }
}

const checkedIds = ref([]);

function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  list: [],
  searchParams: {},
});

const counts = ref({
  total: 0,
  planStatusCounts: {
    未开始: 0,
    进行中: 0,
    已完成: 0,
    异常: 0,
    待复核: 0,
  },
});

const activeName = ref('全部');
const tabsData = ref([
  { label: '全部' },
  { label: '计划待执行' },
  { label: '作业进行中' },
  { label: '异常待处置' },
  { label: '处置待复核' },
  { label: '已完成' },
]);

const createLabel = (item) => {
  if (item.label === '全部') {
    return `全部 (${counts.value.total})`;
  }
  const keyMap = {
    计划待执行: '未开始',
    作业进行中: '进行中',
    已完成: '已完成',
    异常待处置: '异常',
    处置待复核: '待复核',
  };
  const countKey = keyMap[item.label];
  return `${item.label} (${counts.value.planStatusCounts[countKey] || 0})`;
};

const gridColumns = ref(getColumnsByStatus(activeName.value));

const formatDateTime = (ts) => {
  if (!ts) return '';
  const date = typeof ts === 'number' ? new Date(ts) : new Date(ts);
  if (isNaN(date.getTime())) return ts;
  return date.toLocaleString();
};

const optionMaps = reactive({
  garbageTypeMap: new Map(),
  pointMap: new Map(),
  planStatusMap: new Map(),
  planStatusNameToId: new Map(),
  frequencyMap: new Map(),
  userMap: new Map(),
  vehicleMap: new Map(),
  timePeriodMap: new Map(),
  areaMap: new Map(),
  abnormalTypeMap: new Map(),
  handleStatusMap: new Map(),
  reviewStatusMap: new Map(),
  handleStatusNameToId: new Map(),
  reviewStatusNameToId: new Map(),
});

const buildMap = (options) => {
  const map = new Map();
  options.forEach((item) => map.set(item.value, item.label));
  return map;
};

const buildNameToIdMap = (options) => {
  const map = new Map();
  options.forEach((item) => map.set(item.label, item.value));
  return map;
};

function convertItem(item) {
  let pointIds = [];
  try {
    pointIds = item.pointIds ? JSON.parse(item.pointIds) : [];
  } catch {
    pointIds = Array.isArray(item.pointIds) ? item.pointIds : [];
  }
  const pointsName = pointIds
    .map((id) => optionMaps.pointMap.get(id) || id)
    .join(', ');

  let staffIds = [];
  try {
    staffIds = item.staffIds ? JSON.parse(item.staffIds) : [];
  } catch {
    staffIds = Array.isArray(item.staffIds) ? item.staffIds : [];
  }
  const usersName = staffIds
    .map((id) => optionMaps.userMap.get(id) || id)
    .join(', ');

  return {
    ...item,
    vehicleNumber:
      item.vehicleLicensePlate ||
      optionMaps.vehicleMap.get(item.vehicleId) ||
      item.vehicleId,
    garbageTypeName:
      optionMaps.garbageTypeMap.get(item.garbageTypeId) || item.garbageTypeId,
    planStatusName:
      optionMaps.planStatusMap.get(item.planStatusId) || item.planStatusId,
    createByName: optionMaps.userMap.get(item.createBy) || item.createBy,
    createBy: item.createBy,
    frequency: item.frequency,
    timePeriod: item.timePeriod,
    areaCode: optionMaps.areaMap.get(item.areaCode) || item.areaCode,
    pointsName,
    usersName,
    createTime: formatDateTime(item.createTime),
    updateTime: formatDateTime(item.updateTime),
    lastReportTime: formatDateTime(item.lastReportTime),
    completeTime: formatDateTime(item.completeTime),
  };
}

function convertAbnormalItem(item) {
  const handleStatusValue =
    optionMaps.handleStatusMap.get(item.handleStatus) ||
    item.handleStatus ||
    '-';
  return {
    id: item.id,
    abnormalId: item.abnormalId,
    planNo: item.planId || '-',
    abnormalType:
      optionMaps.abnormalTypeMap.get(item.abnormalTypeId) ||
      item.abnormalName ||
      '-',
    abnormalDesc: item.abnormalDesc || '-',
    areaCode: optionMaps.areaMap.get(item.areaCode) || item.areaCode || '-',
    areaName: item.areaName || optionMaps.areaMap.get(item.areaCode) || '-',
    usersName: optionMaps.userMap.get(item.reportBy) || '-',
    reportName: optionMaps.userMap.get(item.reportBy) || '-',
    createTime: formatDateTime(item.reportTime),
    reportTime: formatDateTime(item.reportTime),
    priority: item.priority || '-',
    handler: optionMaps.userMap.get(item.handlerId) || item.handlerId || '-',
    handleStatus: handleStatusValue,
    handleDesc: item.handleDesc || '-',
    handlePhotoUrl: item.handlePhotoUrl,
    abnormalPhotoUrl: item.abnormalPhotoUrl,
    reviewStatus:
      optionMaps.reviewStatusMap.get(item.handleStatus) || handleStatusValue,
    isTimeout: item.isTimeout === '否',
    reviewBy: optionMaps.userMap.get(item.reviewBy) || item.reviewBy || '-',
    updateTime: formatDateTime(item.updateTime),
    reviewTime: formatDateTime(item.reviewTime),
    creator: item.creator || '-',
    _raw: item,
  };
}

const getTableData = async ({ page }) => {
  try {
    const params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      ...dataObj.searchParams,
    };

    if (activeName.value !== '全部') {
      if (
        activeName.value === '异常待处置' ||
        activeName.value === '处置待复核'
      ) {
        if (activeName.value === '异常待处置') {
          params.handleStatus = '待处置';
        } else if (activeName.value === '处置待复核') {
          params.handleStatus = '待复核';
        }
      } else {
        const statusMap = {
          计划待执行: '未开始',
          作业进行中: '进行中',
          已完成: '已完成',
        };
        const statusName = statusMap[activeName.value];
        if (statusName && optionMaps.planStatusNameToId) {
          const statusId = optionMaps.planStatusNameToId.get(statusName);
          if (statusId) {
            params.planStatusId = statusId;
          }
        }
      }
    }

    let res;
    const isAbnormal =
      activeName.value === '异常待处置' || activeName.value === '处置待复核';
    res = await (isAbnormal
      ? getGarbageAbnormalPage(params)
      : getGarbageCollectionPage(params));

    if (res && res.code === 0 && res.data && Array.isArray(res.data.list)) {
      let list;
      list = isAbnormal
        ? res.data.list.map(convertAbnormalItem)
        : res.data.list.map(convertItem);
      list = list.filter((item) => !item.deleted);
      dataObj.total = res.data.total || 0;
      dataObj.list = list;
      return dataObj;
    } else if (res && typeof res === 'object' && Array.isArray(res.list)) {
      let list;
      list = isAbnormal
        ? res.list.map(convertAbnormalItem)
        : res.list.map(convertItem);
      list = list.filter((item) => !item.deleted);
      dataObj.total = res.total || 0;
      dataObj.list = list;
      return dataObj;
    } else {
      throw new Error('接口返回格式异常');
    }
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
    proxyConfig: { ajax: { query: getTableData } },
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

watch(activeName, (newVal) => {
  gridColumns.value = getColumnsByStatus(newVal);
  if (gridApi && gridApi.xGrid) {
    gridApi.xGrid.refreshColumn();
  } else {
    gridApi.setGridOptions?.({ columns: gridColumns.value });
  }
  dataObj.searchParams = {};
  searchDrawerApi.close();

  if (parkDetailDrawerRef.value) {
    parkDetailDrawerRef.value.close();
  }
  if (abnormalDetailDrawerRef.value) {
    abnormalDetailDrawerRef.value.close();
  }

  handleRefresh();
});

const handleClick = () => gridApi.query();

const isAbnormalSearch = ref(false);

const handleSerachShow = () => {
  isAbnormalSearch.value =
    activeName.value === '异常待处置' || activeName.value === '处置待复核';
  if (isAbnormalSearch.value) {
    abnormalSearchFormApi.resetForm();
  } else {
    planSearchFormApi.resetForm();
  }
  searchDrawerApi.open();
};

const handleFullShow = () => screenfull.toggle();

const parkDetailDrawerRef = ref(null);
const abnormalDetailDrawerRef = ref(null);

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  if (activeName.value === '异常待处置' || activeName.value === '处置待复核') {
    abnormalDetailDrawerRef.value.open();
  } else {
    parkDetailDrawerRef.value.open();
  }
};

const handleProcess = (row) => {
  const status = row.planStatusName;
  switch (status) {
    case '已完成': {
      reviewPostDrawerApi.open();
      break;
    }
    case '异常': {
      dispatchDrawerApi.setData({ planNo: row.planNo }).open();
      break;
    }
    case '待复核': {
      reviewDrawerApi.open();
      break;
    }
    case '未开始': {
      handleStartExecute(row);
      break;
    }
    case '进行中': {
      abnormalReportDrawerApi.setData({ planNo: row.planNo }).open();
      break;
    }
    default: {
      ElMessage.info('该计划暂无处理操作');
    }
  }
};

const arrowChange = () => emit('arrow-change');

const showChart = ref(true);
const toggleChart = () => {
  showChart.value = !showChart.value;
};

async function loadStatistics() {
  try {
    const res = await getGarbageCollectionStatistics();
    if (res && res.total !== undefined && res.planStatusCounts) {
      counts.value = res;
    } else {
      console.warn('统计接口返回异常', res);
    }
  } catch (error) {
    console.error('加载统计失败', error);
    ElMessage.error('加载统计信息失败');
  }
}

const loadOptions = async () => {
  try {
    const [
      garbageTypeRes,
      pointRes,
      planStatusRes,
      frequencyRes,
      userRes,
      vehicleRes,
      timePeriodRes,
      areaRes,
      abnormalTypeRes,
      handleStatusRes,
      reviewStatusRes,
    ] = await Promise.all([
      getGarbageTypeOptions(),
      getPointOptions(),
      getPlanStatusOptions(),
      getCollectionFrequencyOptions(),
      getUserOptions(),
      getVehicleOptions(),
      getTimePeriodOptions(),
      getAreaOptions(),
      getAbnormalTypeOptions(),
      getHandleStatusOptions(),
      getReviewStatusOptions(),
    ]);

    const extractData = (res) => {
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      console.warn('返回数据格式异常', res);
      return [];
    };

    const garbageTypeOptions = extractData(garbageTypeRes);
    const pointOptions = extractData(pointRes);
    const planStatusOptions = extractData(planStatusRes);
    const userOptions = extractData(userRes);
    const vehicleOptions = extractData(vehicleRes);
    const areaOptions = extractData(areaRes);

    const frequencyOptions = extractData(frequencyRes).map((item) => ({
      label: item.label,
      value: item.label,
    }));
    const timePeriodOptions = extractData(timePeriodRes).map((item) => ({
      label: item.label,
      value: item.label,
    }));

    const abnormalTypeOptions = extractData(abnormalTypeRes);
    const handleStatusOptions = extractData(handleStatusRes).map((item) => ({
      label: item.label,
      value: item.label,
    }));
    const reviewStatusOptions = extractData(reviewStatusRes).map((item) => ({
      label: item.label,
      value: item.label,
    }));

    optionMaps.garbageTypeMap = buildMap(garbageTypeOptions);
    optionMaps.pointMap = buildMap(pointOptions);
    optionMaps.planStatusMap = buildMap(planStatusOptions);
    optionMaps.userMap = buildMap(userOptions);
    optionMaps.vehicleMap = buildMap(vehicleOptions);
    optionMaps.areaMap = buildMap(areaOptions);
    optionMaps.frequencyMap = buildMap(frequencyOptions);
    optionMaps.timePeriodMap = buildMap(timePeriodOptions);
    optionMaps.abnormalTypeMap = buildMap(abnormalTypeOptions);
    optionMaps.handleStatusMap = buildMap(handleStatusOptions);
    optionMaps.reviewStatusMap = buildMap(reviewStatusOptions);

    optionMaps.planStatusNameToId = buildNameToIdMap(planStatusOptions);
    optionMaps.handleStatusNameToId = buildNameToIdMap(handleStatusOptions);
    optionMaps.reviewStatusNameToId = buildNameToIdMap(reviewStatusOptions);

    try {
      const planOptionsRes = await getGarbageCollectionOptions();
      const planOptions = extractData(planOptionsRes);
      planNoOptions.value = planOptions.map((item) => ({
        label: item.value,
        value: item.value,
      }));
    } catch (error) {
      console.warn('加载计划单选项失败', error);
      planNoOptions.value = [];
    }

    editFormApi.updateSchema([
      {
        fieldName: 'garbageTypeId',
        componentProps: { options: garbageTypeOptions },
      },
      { fieldName: 'pointIds', componentProps: { options: pointOptions } },
      {
        fieldName: 'planStatusId',
        componentProps: { options: planStatusOptions },
      },
      { fieldName: 'frequency', componentProps: { options: frequencyOptions } },
      { fieldName: 'staffIds', componentProps: { options: userOptions } },
      { fieldName: 'vehicleId', componentProps: { options: vehicleOptions } },
      {
        fieldName: 'timePeriod',
        componentProps: { options: timePeriodOptions },
      },
      { fieldName: 'areaCode', componentProps: { options: areaOptions } },
      { fieldName: 'createBy', componentProps: { options: userOptions } },
    ]);

    planSearchFormApi.updateSchema([
      {
        fieldName: 'garbageTypeId',
        componentProps: { options: garbageTypeOptions },
      },
      { fieldName: 'areaCode', componentProps: { options: areaOptions } },
      { fieldName: 'frequency', componentProps: { options: frequencyOptions } },
      { fieldName: 'vehicleId', componentProps: { options: vehicleOptions } },
      {
        fieldName: 'planStatusId',
        componentProps: { options: planStatusOptions },
      },
    ]);

    abnormalSearchFormApi.updateSchema([
      {
        fieldName: 'abnormalTypeId',
        componentProps: { options: abnormalTypeOptions },
      },
      { fieldName: 'areaCode', componentProps: { options: areaOptions } },
      { fieldName: 'reportUserId', componentProps: { options: userOptions } },
      {
        fieldName: 'handleStatus',
        componentProps: { options: handleStatusOptions },
      },
      {
        fieldName: 'reviewStatus',
        componentProps: { options: reviewStatusOptions },
      },
      {
        fieldName: 'priority',
        componentProps: {
          options: [
            { label: '高', value: '高' },
            { label: '中', value: '中' },
            { label: '低', value: '低' },
          ],
        },
      },
    ]);
  } catch (error) {
    console.error('加载选项数据失败', error);
    ElMessage.error('加载选项数据失败，请刷新重试');
  } finally {
    handleRefresh();
  }
};

onMounted(() => {
  loadOptions();
  loadStatistics();
});
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 原有抽屉 -->
    <EditDrawer :title="getTitle">
      <EditForm />
    </EditDrawer>

    <!-- 异常上报抽屉（重构后） -->
    <AbnormalReportDrawer title="异常上报">
      <AbnormalReportForm />
      <!-- 图片上传区域 -->
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
          <div class="photo-list" v-if="abnormalReportImageList.length > 0">
            <div
              class="photo-item"
              v-for="(url, index) in abnormalReportImageList"
              :key="index"
            >
              <ElImage
                :src="url"
                :preview-src-list="abnormalReportImageList"
                fit="cover"
                style="width: 80px; height: 80px; cursor: pointer; border-radius: 4px;"
                :preview-teleported="true"
              />
              <span class="delete-btn" @click="handleReportImageDelete(url)">✕</span>
            </div>
          </div>
          <div v-else class="no-photo">暂无图片</div>
        </div>
      </div>
    </AbnormalReportDrawer>

    <!-- 异常处置抽屉（重构后） -->
    <AbnormalHandleDrawer title="异常处置">
      <AbnormalHandleForm />
      <!-- 图片上传区域 -->
      <div class="photo-upload-section">
        <div class="photo-manager">
          <div class="upload-area">
            <input
              type="file"
              multiple
              accept="image/*"
              @change="handleHandleImageUpload"
            />
            <span class="upload-tip">可多选图片</span>
          </div>
          <div class="photo-list" v-if="abnormalHandleImageList.length > 0">
            <div
              class="photo-item"
              v-for="(url, index) in abnormalHandleImageList"
              :key="index"
            >
              <ElImage
                :src="url"
                :preview-src-list="abnormalHandleImageList"
                fit="cover"
                style="width: 80px; height: 80px; cursor: pointer; border-radius: 4px;"
                :preview-teleported="true"
              />
              <span class="delete-btn" @click="handleHandleImageDelete(url)">✕</span>
            </div>
          </div>
          <div v-else class="no-photo">暂无图片</div>
        </div>
      </div>
    </AbnormalHandleDrawer>

    <ParkDetailDrawer
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      title="收运计划详情"
    />
    <AbnormalDetailDrawer
      ref="abnormalDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      title="异常详情"
      :current-tab="activeName"
    />

    <!-- 新增的各种功能抽屉 -->
    <ImportDrawer title="批量导入">
      <BatchImport @close="importDrawerApi.close" @success="handleRefresh" />
    </ImportDrawer>

    <AdjustDrawer title="批量调整">
      <AdjustForm />
    </AdjustDrawer>

    <CommunicationDrawer title="沟通">
      <CommunicationForm />
    </CommunicationDrawer>

    <DispatchDrawer title="派发/指派">
      <DispatchForm />
    </DispatchDrawer>

    <TrackDrawer title="跟踪">
      <TrackForm />
    </TrackDrawer>

    <BatchHandleDrawer title="批量处理">
      <BatchHandleForm />
    </BatchHandleDrawer>

    <ReviewDrawer title="复核">
      <ReviewForm />
    </ReviewDrawer>

    <BatchReviewDrawer title="批量复核">
      <BatchReviewForm />
    </BatchReviewDrawer>

    <ReviewPostDrawer title="复盘">
      <ReviewPostForm />
    </ReviewPostDrawer>

    <SearchDrawer title="搜索">
      <SearchFormPlan v-if="!isAbnormalSearch" class="query-form" />
      <SearchFormAbnormal v-else class="query-form" />
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
          <!-- 通用按钮 -->
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
          />

          <!-- 计划待执行专用按钮 -->
          <template v-if="activeName === '计划待执行'">
            <IconButton
              content="新增"
              icon-name="Plus"
              @click="handleCreate"
            />
            <IconButton
              content="批量导入"
              icon-name="Upload"
              @click="importDrawerApi.open"
            />
            <IconButton
              content="批量调整"
              icon-name="Operation"
              @click="adjustDrawerApi.open"
              :disabled="isEmpty(checkedIds)"
            />
          </template>

          <!-- 作业进行中专用按钮 -->
          <template v-if="activeName === '作业进行中'">
            <IconButton
              content="定位跟踪"
              icon-name="Location"
              @click="handleLocationTrack"
              :disabled="isEmpty(checkedIds)"
            />
          </template>

          <!-- 异常待处置专用按钮 -->
          <template v-if="activeName === '异常待处置'">
            <IconButton
              content="派发"
              icon-name="User"
              @click="handleBatchDispatch"
              :disabled="isEmpty(checkedIds)"
            />
            <IconButton
              content="批量处理"
              icon-name="Finished"
              @click="handleBatchProcess"
              :disabled="isEmpty(checkedIds)"
            />
          </template>

          <!-- 处置待复核专用按钮 -->
          <template v-if="activeName === '处置待复核'">
            <IconButton
              content="批量复核"
              icon-name="Check"
              @click="handleBatchReview"
              :disabled="isEmpty(checkedIds)"
            />
          </template>

          <!-- 通用按钮：批量删除、搜索、展开/收缩、全屏、图表切换 -->
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

      <template #planNo="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">
          {{ row.planNo }}
        </el-text>
      </template>

      <template #abnormalId="{ row }">
        <el-text @click="handleOpenDetail(row)" type="primary">
          {{ row.abnormalId }}
        </el-text>
      </template>

      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <!-- 详情按钮始终显示 -->
          <IconButton
            content="详情"
            icon-name="View"
            @click="handleOpenDetail(row)"
          />

          <!-- 根据不同标签页显示不同的行操作按钮 -->
          <!-- 全部标签页：根据计划状态动态显示操作按钮 -->
          <template v-if="activeName === '全部'">
            <template v-if="row.planStatusName === '未开始'">
              <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
              <IconButton content="启动执行" icon-name="VideoPlay" @click="handleStartExecute(row)" />
              <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" />
            </template>
            <template v-else-if="row.planStatusName === '进行中'">
              <IconButton content="异常上报" icon-name="Warning" @click="abnormalReportDrawerApi.setData({ planNo: row.planNo, areaCode: row.areaCode, reportTime: Date.now() }).open()" />
              <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" />
            </template>
            <template v-else-if="row.planStatusName === '已完成'">
              <IconButton content="复盘" icon-name="DataAnalysis" @click="reviewPostDrawerApi.open" />
              <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" />
            </template>
          </template>

          <!-- 计划待执行：编辑、启动执行、删除 -->
          <template v-else-if="activeName === '计划待执行'">
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
            <IconButton
              content="删除"
              icon-name="delete"
              color="#F56C6C"
              @click="handleDelete(row)"
            />
          </template>

          <!-- 作业进行中：沟通、异常上报、删除 -->
          <template v-else-if="activeName === '作业进行中'">
            <IconButton
              content="沟通"
              icon-name="ChatDotRound"
              @click="communicationDrawerApi.open"
            />
            <IconButton
              content="异常上报"
              icon-name="Warning"
              @click="abnormalReportDrawerApi.setData({ planNo: row.planNo, areaCode: row.areaCode, reportTime: Date.now() }).open()"
            />
            <IconButton
              content="删除"
              icon-name="delete"
              color="#F56C6C"
              @click="handleDelete(row)"
            />
          </template>

          <!-- 异常待处置：指派、跟踪、删除 -->
          <template v-else-if="activeName === '异常待处置'">
            <IconButton
              content="处置"
              icon-name="Tools"
              @click="handleEdit(row)"
            />
            <IconButton
              content="指派"
              icon-name="User"
              @click="dispatchDrawerApi.open"
            />
            <IconButton
              content="跟踪"
              icon-name="Timer"
              @click="trackDrawerApi.open"
            />
            <IconButton
              content="删除"
              icon-name="delete"
              color="#F56C6C"
              @click="handleDelete(row)"
            />
          </template>

          <!-- 处置待复核：复核、删除 -->
          <template v-else-if="activeName === '处置待复核'">
            <IconButton
              content="复核"
              icon-name="Finished"
              @click="reviewDrawerApi.setData(row).open()"
            />
            <IconButton
              content="删除"
              icon-name="delete"
              color="#F56C6C"
              @click="handleDelete(row)"
            />
          </template>

          <!-- 已完成：复盘、删除 -->
          <template v-else-if="activeName === '已完成'">
            <IconButton
              content="复盘"
              icon-name="DataAnalysis"
              @click="reviewPostDrawerApi.open"
            />
            <IconButton
              content="删除"
              icon-name="delete"
              color="#F56C6C"
              @click="handleDelete(row)"
            />
          </template>
        </div>
      </template>

      <template #bottom>
        <div
          class="common-total"
          @click="dataObj.totalShow = !dataObj.totalShow"
        >
          <el-icon>
            <ArrowDown v-if="!dataObj.totalShow" />
            <ArrowUp v-else />
          </el-icon>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <div
            v-if="showChart && activeName !== '全部'"
            class="bottom-chart-wrapper"
          >
            <Chart2 :active-name="activeName" :data-list="dataObj.apilist" />
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
