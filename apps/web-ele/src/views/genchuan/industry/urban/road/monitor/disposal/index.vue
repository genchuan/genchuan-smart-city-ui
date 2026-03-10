<script setup>
import { computed, onMounted, reactive, ref } from 'vue';

import { confirm, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { UploadFilled } from '@element-plus/icons-vue'; // 修复图标导入
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElLoading,
  ElMessage,
  ElOption,
  ElSelect,
  ElUpload,
} from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addRoad,
  batchConfirmRemind,
  batchUpdateAssignStaff,
  confirmValid,
  deleteWarn,
  getRoadFacility,
  getRoadFacilityList,
  getRoadWorkOrder,
  superviseWorkOrder,
  updateRoad,
  updateWorkOrderProgress,
  uploadWorkOrderFile,
} from '#/api/genchuan/industry/urban/index.js';
import { $t } from '#/locales';
import { formatTimestamp } from '#/utils';

import { useFormSchema, useGridColumns } from './data';
import tableDetail from './detail.vue';

const props = defineProps({
  secondShow: {
    type: Boolean,
    default: false,
  },
  arrowShow: {
    type: Boolean,
    default: false,
  },
  arrowState: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['arrow-change']);
const roadDetailRef = ref(null);
const schemaData = ref(null);
const roadObj = ref({ detailObj: {}, list: [] });

const currentSwitchRow = ref({});
const switchLoading = ref(false);
const assignForm = reactive({
  assignStaffId: '',
  assignStaffName: '',
  remark: '',
});
const assignFormRules = reactive({
  assignStaffId: [
    { required: true, message: '请选择新的指派运维员', trigger: 'change' },
  ],
});
const staffList = ref([]);
const assignFormRef = ref(null);

// 批量提醒相关
const warnLoading = ref(false);
const warnForm = reactive({
  warnContent: '',
  sendType: 'SYSTEM',
});
const warnFormRules = reactive({
  warnContent: [
    { required: true, message: '请输入提醒内容', trigger: 'blur' },
    { min: 5, max: 200, message: '提醒内容长度在5-200个字符', trigger: 'blur' },
  ],
  sendType: [{ required: true, message: '请选择发送方式', trigger: 'change' }],
});
const warnFormRef = ref(null);

// 更新进度相关
const progressLoading = ref(false);
const currentProgressRow = ref({});
const progressForm = reactive({
  disposeProgress: '',
  progressDesc: '',
});
const progressFormRules = reactive({
  disposeProgress: [
    { required: true, message: '请选择处置进度', trigger: 'change' },
  ],
  progressDesc: [
    { required: true, message: '请输入进度说明', trigger: 'blur' },
  ],
});
const progressFormRef = ref(null);
const progressOptions = ref([
  { label: '待处置', value: 'PENDING' },
  { label: '现场修补', value: 'ON_SITE_REPAIR' },
  { label: '裂缝清理', value: 'CRACK_CLEANING' },
]);

// 超时督办相关
const superviseLoading = ref(false);
const currentSuperviseRow = ref({});
const superviseForm = reactive({
  superviseOpinion: '',
});
const superviseFormRules = reactive({
  superviseOpinion: [
    { required: true, message: '请输入督办意见', trigger: 'blur' },
    { min: 5, max: 500, message: '督办意见长度在5-500个字符', trigger: 'blur' },
  ],
});
const superviseFormRef = ref(null);
const [SuperviseModal, superviseModalApi] = useVbenModal({
  title: '超时督办',
  width: 450,
  modalProps: {
    destroyOnClose: true,
  },
  onCancel() {
    superviseFormRef.value?.resetFields();
  },
  footer: false,
});

// 上传资料相关（核心改造：匹配接口所有query参数）
const uploadLoading = ref(false);
const currentUploadRow = ref({});
// 新增接口要求的所有参数
const uploadForm = reactive({
  fileDesc: '', // 资料文字说明
  afterIndexValue: 0, // 处理后的指标数值
  file: null,
});
// 上传表单校验规则（匹配接口必填项）
const uploadFormRules = reactive({
  fileDesc: [
    { required: true, message: '请输入资料文字说明', trigger: 'blur' },
  ],
  afterIndexValue: [
    { required: true, message: '请输入处理后的指标数值', trigger: 'blur' },
  ],
  file: [{ required: true, message: '请选择要上传的文件', trigger: 'change' }],
});
const uploadFormRef = ref(null);
const [UploadModal, uploadModalApi] = useVbenModal({
  title: '上传工单资料',
  width: 600,
  modalProps: {
    destroyOnClose: true,
  },
  onCancel() {
    // 关闭弹窗清空所有数据
    uploadForm.fileDesc = '';
    uploadForm.afterIndexValue = 0;
    uploadForm.file = null;
    fileList.value = [];
    uploadFormRef.value?.resetFields();
  },
  footer: false,
});

const getTitle = computed(() => {
  return formData.value?.id ? '编辑' : '新增';
});

onMounted(async () => {
  const roadList = await getRoadFacilityList({
    pageNo: 1,
    pageSize: 999,
  });
  roadObj.value.list = roadList.list;

  await fetchStaffList();

  let roadIndex = 0;
  const schema = useFormSchema();
  schema.forEach((v, i) => {
    if (v.fieldName === 'roadId') {
      roadIndex = i;
    }
  });
  schema[roadIndex] = {
    fieldName: 'roadId',
    label: '道路名称',
    component: 'Select',
    labelWidth: '120',
    componentProps: {
      allowClear: true,
      filterOption: true,
      options: roadObj.value.list.map((v) => {
        return {
          label: v.roadName,
          value: v.id,
        };
      }),
      placeholder: '请选择设备在线状态',
      showSearch: true,
    },
    rules: 'required',
    isSearch: true,
    addShow: true,
    editShow: true,
  };
  schemaData.value = schema;
});

const fetchStaffList = async () => {
  try {
    staffList.value = [
      { value: '1', label: '张三' },
      { value: '2', label: '李四' },
    ];
  } catch {
    ElMessage.error('获取运维员列表失败！');
  }
};

const handleSwitch = (row) => {
  assignForm.assignStaffId = '';
  assignForm.assignStaffName = '';
  assignForm.remark = '';
  currentSwitchRow.value = row;
  switchDrawerApi.open();
};

const handleSwitchConfirm = async () => {
  const valid = await assignFormRef.value.validate();
  if (!valid) return;

  try {
    switchLoading.value = true;
    const nowObj = staffList.value.find(
      (v) => v.value === assignForm.assignStaffId,
    );
    await batchUpdateAssignStaff({
      workOrderId: currentSwitchRow.value.id,
      assignStaffId: nowObj.value,
      assignStaffName: nowObj.label,
    });

    ElMessage.success('调整派单对象并推送提醒成功！');
    switchDrawerApi.close();
    handleRefresh();
  } catch (error) {
    ElMessage.error(`操作失败：${error.message || '网络异常'}`);
  } finally {
    switchLoading.value = false;
  }
};

// 批量提醒抽屉
const [WarnDrawer, warnDrawerApi] = useVbenDrawer({
  title: '批量发送提醒',
  placement: 'right',
  width: 450,
  appendToMain: true,
  modal: false,
  footer: false,
  onCancel() {
    warnFormRef.value?.resetFields();
    warnDrawerApi.close();
  },
});

// 打开批量提醒抽屉
const handleWarnOpen = () => {
  warnForm.warnContent = '';
  warnForm.sendType = 'SYSTEM';
  warnDrawerApi.open();
};

// 提交批量提醒
const handleWarnSubmit = async () => {
  try {
    warnLoading.value = true;
    await batchConfirmRemind({
      idList: checkedIds.value,
    });

    ElMessage.success(`成功发送${checkedIds.value.length}条提醒！`);
    warnDrawerApi.close();
    handleRefresh();
  } catch (error) {
    ElMessage.error(`批量提醒发送失败：${error.message || '网络异常'}`);
  } finally {
    warnLoading.value = false;
  }
};

// 批量提醒按钮禁用逻辑
const isWarnDisabled = () => {
  return isEmpty(checkedIds.value);
};

// 更新进度抽屉
const [ProgressDrawer, progressDrawerApi] = useVbenDrawer({
  title: '更新工单进度',
  placement: 'right',
  width: 450,
  appendToMain: true,
  modal: false,
  footer: false,
  onCancel() {
    progressFormRef.value?.resetFields();
    progressDrawerApi.close();
  },
});

// 打开更新进度抽屉
const handleArrowUp = (row) => {
  progressForm.disposeProgress = '';
  progressForm.progressDesc = '';
  currentProgressRow.value = row;
  progressDrawerApi.open();
};

// 保存工单进度
const handleProgressSave = async () => {
  const valid = await progressFormRef.value.validate();
  if (!valid) return;

  try {
    progressLoading.value = true;

    await updateWorkOrderProgress({
      workOrderId: currentProgressRow.value.id,
      processStatus: progressForm.disposeProgress,
      processDesc: progressForm.progressDesc,
    });

    ElMessage.success('工单进度更新成功！');
    progressDrawerApi.close();
    handleRefresh();
  } catch (error) {
    ElMessage.error(`进度更新失败：${error.message || '网络异常'}`);
  } finally {
    progressLoading.value = false;
  }
};

// 打开超时督办弹窗
const handleSupervise = (row) => {
  superviseForm.superviseOpinion = '';
  currentSuperviseRow.value = row;
  superviseModalApi.open();
};

// 提交督办意见
const handleSuperviseSubmit = async () => {
  const valid = await superviseFormRef.value.validate();
  if (!valid) return;

  try {
    superviseLoading.value = true;

    await superviseWorkOrder({
      workOrderId: currentSuperviseRow.value.id,
      superviseOpinion: superviseForm.superviseOpinion,
    });

    ElMessage.success('超时督办提交成功！');
    superviseModalApi.close();
    handleRefresh();
  } catch (error) {
    ElMessage.error(`督办提交失败：${error.message || '网络异常'}`);
  } finally {
    superviseLoading.value = false;
  }
};

// 上传组件相关
const upload = ref(null);
const fileList = ref([]);
const handleExceed = (files) => {
  upload.value.clearFiles();
  const file = files[0];
  upload.value.handleStart(file);
};

// 打开上传资料弹窗
const handleUpdateFile = (row) => {
  // 初始化表单数据
  uploadForm.fileDesc = '';
  uploadForm.afterIndexValue = 0;
  uploadForm.file = null;
  fileList.value = [];
  currentUploadRow.value = row;
  uploadModalApi.open();
};

// 文件选择事件
const onChange = (file) => {
  fileList.value = [];
  fileList.value.push(file);
  uploadForm.file = file;
};

// 提交文件上传（核心改造：匹配接口query+form-data参数）
const handleUploadSubmit = async () => {
  // 1. 表单整体校验
  const valid = await uploadFormRef.value.validate();
  if (!valid) return;

  // 2. 校验文件是否选择
  if (!uploadForm.file || fileList.value.length === 0) {
    ElMessage.warning('请选择要上传的文件');
    return;
  }

  try {
    uploadLoading.value = true;
    const file = fileList.value[0];

    // 3. 构建FormData（仅传递文件）
    const formData = new FormData();
    formData.append('file', file.raw);
    formData.append('workOrderId', currentUploadRow.value.id);
    formData.append('fileDesc', uploadForm.fileDesc);
    formData.append('afterIndexValue', uploadForm.afterIndexValue);

    // 5. 调用上传接口：同时传递formData和query参数
    await uploadWorkOrderFile(formData);

    ElMessage.success('工单资料上传成功！');
    uploadModalApi.close();
    handleRefresh(); // 刷新工单列表
  } catch (error) {
    ElMessage.error(`上传失败：${error.message || '服务器异常'}`);
    console.error('上传错误详情：', error);
  } finally {
    uploadLoading.value = false;
  }
};

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

const [SwitchDrawer, switchDrawerApi] = useVbenDrawer({
  title: '调整派单对象',
  placement: 'right',
  width: 450,
  appendToMain: true,
  modal: false,
  footer: false,
  onCancel() {
    assignFormRef.value?.resetFields();
    switchDrawerApi.close();
  },
});

const formData = ref();
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    formDrawerApi.close();
  },
  async onConfirm() {
    const obj = formApi.form.values;
    await (formDrawerApi.sharedData.payload.title === '增加'
      ? addRoad(obj)
      : updateRoad({ ...dataObj.editObj, ...obj }));
    handleRefresh();
    formDrawerApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      formData.value = formDrawerApi.getData();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});

function handleRefresh() {
  gridApi.query();
}

async function handleDelete(row) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting'),
  });
  try {
    await deleteWarn(row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

async function handleDeleteBatch() {
  await confirm($t('确定删除这些数据吗？')).then(() => {
    checkedIds.value.forEach(async (v) => {
      await handleDelete({
        id: v,
      });
    });
  });
  handleRefresh();
}

const recordsList = ref([]);
const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map((item) => item.id);
  recordsList.value = records;
}

const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  apilist: [],
  imgUrl: '',
  serachObj: {},
  list: [],
  editObj: {},
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

const getTableData = async (pageObj) => {
  const getParams = {
    pageNo: pageObj.page.currentPage,
    pageSize: pageObj.page.pageSize,
    ...dataObj.serachObj,
  };
  const data = await getRoadWorkOrder(getParams);
  dataObj.total = data.total;
  dataObj.list = data.list.map((v) => {
    return {
      ...v,
      updateTime: formatTimestamp(v.updateTime),
      arriveTime: formatTimestamp(v.arriveTime),
      createTime: formatTimestamp(v.createTime),
      disposeProgressText:
        {
          PENDING: '待处置',
          ON_SITE_REPAIR: '现场修补',
          CRACK_CLEANING: '裂缝清理',
        }[v.disposeProgress] || '待处置',
    };
  });
  return dataObj;
};

const [QueryForm, QueryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useFormSchema()
    .filter((v) => v.isSearch)
    .map((v) => {
      delete v.rules;
      return {
        ...v,
      };
    }),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

async function onSubmit() {
  dataObj.serachObj = await QueryFormApi.getValues();
  gridApi.reload();
  drawerApi.close();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => getTableData({ page }),
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: dataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

const handleOpenDetail = (row) => {
  dataObj.detailObj = row;
  parkDetailDrawerRef.value.open();
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

const arrowChange = () => {
  emit('arrow-change');
};

const parkDetailDrawerRef = ref(null);

const openRoadDetail = async (row) => {
  const resObj = await getRoadFacility({
    id: row.roadId,
  });
  roadObj.value.detailObj = resObj;
  roadDetailRef.value.open();
};

const currentConfirmRow = ref({});
const confirmOpinion = ref('');
const handleConfirm = (row) => {
  currentConfirmRow.value = row;
  confirmOpinion.value = '';
  confirmDrawerApi.open();
};

async function handleConfirmSave() {
  if (!confirmOpinion.value) {
    ElMessage.warning('请输入确认意见');
    return;
  }

  try {
    await confirmValid({
      id: currentConfirmRow.value.id,
      confirmOpinion: confirmOpinion.value,
    });

    ElMessage.success('操作成功');
    confirmDrawerApi.close();
    handleRefresh();
  } catch {
    ElMessage.error('操作失败');
  }
}

const [ConfirmDrawer, confirmDrawerApi] = useVbenDrawer({
  title: '确认有效',
  placement: 'right',
  width: 480,
  footer: false,
  appendToMain: true,
  modal: false,
  onCancel() {
    confirmDrawerApi.close();
  },
});
</script>

<template>
  <div class="park-lot-table-new">
    <!-- 确认有效抽屉 -->
    <ConfirmDrawer>
      <div class="p-6">
        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium">确认意见</label>
          <ElInput
            v-model="confirmOpinion"
            type="textarea"
            :rows="6"
            placeholder="请输入确认意见"
          />
        </div>
        <div class="flex justify-end gap-2">
          <ElButton @click="confirmDrawerApi.close()">取消</ElButton>
          <ElButton type="primary" @click="handleConfirmSave">保存</ElButton>
        </div>
      </div>
    </ConfirmDrawer>

    <!-- 批量提醒抽屉 -->
    <WarnDrawer>
      <div class="warn-drawer-content p-6">
        <ElForm
          ref="warnFormRef"
          :model="warnForm"
          :rules="warnFormRules"
          class="warn-form"
        >
          <div class="form-item mb-4">
            <label class="mb-2 block text-sm font-medium">提醒范围</label>
            <div class="text-sm text-gray-700">
              已选中 {{ checkedIds.length }} 个工单
            </div>
          </div>
        </ElForm>

        <div class="mt-6 flex justify-end gap-2">
          <ElButton @click="warnDrawerApi.close()">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleWarnSubmit"
            :loading="warnLoading"
          >
            确认发送提醒
          </ElButton>
        </div>
      </div>
    </WarnDrawer>

    <!-- 更新进度抽屉 -->
    <ProgressDrawer>
      <div class="progress-drawer-content p-6">
        <ElForm
          ref="progressFormRef"
          :model="progressForm"
          :rules="progressFormRules"
          class="progress-form"
        >
          <div class="form-item mb-4">
            <label class="mb-2 block text-sm font-medium">当前工单</label>
            <div class="text-sm text-gray-700">
              工单编号：{{ currentProgressRow.orderNo || '-' }}
            </div>
          </div>

          <ElFormItem label="处置进度" prop="disposeProgress" class="mb-4">
            <ElSelect
              v-model="progressForm.disposeProgress"
              placeholder="请选择处置进度"
              class="w-full"
            >
              <ElOption
                v-for="item in progressOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="进度说明" prop="progressDesc" class="mb-4">
            <ElInput
              v-model="progressForm.progressDesc"
              type="textarea"
              :rows="4"
              placeholder="请输入进度说明"
              maxlength="500"
              show-word-limit
            />
          </ElFormItem>
        </ElForm>

        <div class="mt-6 flex justify-end gap-2">
          <ElButton @click="progressDrawerApi.close()">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleProgressSave"
            :loading="progressLoading"
          >
            保存进度
          </ElButton>
        </div>
      </div>
    </ProgressDrawer>

    <!-- 超时督办弹窗 -->
    <SuperviseModal>
      <div class="supervise-modal-content p-4">
        <ElForm
          ref="superviseFormRef"
          :model="superviseForm"
          :rules="superviseFormRules"
          class="supervise-form"
        >
          <div class="form-item mb-4">
            <label class="mb-2 block text-sm font-medium">督办工单</label>
            <div class="text-sm text-gray-700">
              工单编号：{{ currentSuperviseRow.orderNo || '-' }}
            </div>
          </div>

          <ElFormItem label="督办意见" prop="superviseOpinion" class="mb-4">
            <ElInput
              v-model="superviseForm.superviseOpinion"
              type="textarea"
              :rows="4"
              placeholder="请输入督办意见（5-500个字符）"
              maxlength="500"
              show-word-limit
            />
          </ElFormItem>
        </ElForm>

        <div class="mt-4 flex justify-end gap-2">
          <ElButton @click="superviseModalApi.close()">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleSuperviseSubmit"
            :loading="superviseLoading"
          >
            确认
          </ElButton>
        </div>
      </div>
    </SuperviseModal>

    <!-- 上传资料弹窗（核心改造：新增所有接口参数输入框） -->
    <UploadModal>
      <div class="upload-modal-content p-4">
        <ElForm
          ref="uploadFormRef"
          :model="uploadForm"
          :rules="uploadFormRules"
          label-width="120px"
        >
          <!-- 资料文字说明 -->
          <ElFormItem label="资料说明" prop="fileDesc" class="mb-4">
            <ElInput
              v-model="uploadForm.fileDesc"
              placeholder="请输入资料文字说明（如：现场检测图片）"
              maxlength="100"
              show-word-limit
            />
          </ElFormItem>

          <!-- 处理后的指标数值 -->
          <ElFormItem label="指标数值" prop="afterIndexValue" class="mb-4">
            <ElInputNumber
              v-model="uploadForm.afterIndexValue"
              placeholder="请输入处理后的指标数值"
              :min="0"
              style="width: 100%"
            />
          </ElFormItem>

          <!-- 文件上传区域 -->
          <ElFormItem label="选择文件" prop="file" class="mb-4">
            <ElUpload
              ref="upload"
              v-model:file-list="fileList"
              :on-change="onChange"
              :on-exceed="handleExceed"
              :auto-upload="false"
              class="upload-demo"
              drag
              :limit="1"
            >
              <ElIcon class="el-icon--upload"><UploadFilled /></ElIcon>
              <div class="el-upload__text">
                拖拽文件到此处上传，或<em>点击选择文件</em>
              </div>
              <div class="el-upload__tip mt-2 text-sm text-gray-500">
                支持jpg/jpeg/png/pdf/doc/docx/xls/xlsx格式，单个文件不超过5MB
              </div>
            </ElUpload>
          </ElFormItem>
        </ElForm>

        <!-- 操作按钮 -->
        <div class="mt-4 flex justify-end gap-2">
          <ElButton @click="uploadModalApi.close()">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleUploadSubmit"
            :loading="uploadLoading"
          >
            确认上传
          </ElButton>
        </div>
      </div>
    </UploadModal>

    <!-- 调整派单对象抽屉 -->
    <SwitchDrawer>
      <div class="assign-drawer-content p-6">
        <ElForm
          ref="assignFormRef"
          :model="assignForm"
          :rules="assignFormRules"
          class="assign-form"
        >
          <div class="form-item mb-4">
            <label class="mb-2 block text-sm font-medium">当前工单</label>
            <div class="text-sm text-gray-700">
              工单编号：{{ currentSwitchRow.orderNo || '-' }}
            </div>
          </div>

          <ElFormItem label="新指派运维员" prop="assignStaffId" class="mb-4">
            <ElSelect
              v-model="assignForm.assignStaffId"
              placeholder="请选择运维员"
              class="w-full"
              @change="
                (val) => {
                  const staff = staffList.find((item) => item.staffId === val);
                  assignForm.assignStaffName = staff?.staffName || '';
                }
              "
            >
              <ElOption
                v-for="item in staffList"
                :key="item.staffId"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElForm>

        <div class="mt-6 flex justify-end gap-2">
          <ElButton @click="switchDrawerApi.close()">取消</ElButton>
          <ElButton
            type="primary"
            @click="handleSwitchConfirm"
            :loading="switchLoading"
          >
            确认调整并推送提醒
          </ElButton>
        </div>
      </div>
    </SwitchDrawer>

    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>

    <tableDetail
      ref="parkDetailDrawerRef"
      :detail-obj="dataObj.detailObj"
      title="详情"
    />

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="批量提醒"
            icon-name="AlarmClock"
            color="#F56C6C"
            :disabled="isWarnDisabled()"
            @click="handleWarnOpen"
          />
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
        </div>
      </template>
      <template #orderNo="{ row }">
        <el-text
          @click="handleOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.orderNo }}
        </el-text>
      </template>
      <template #roadName="{ row }">
        <el-text
          @click="openRoadDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.warnNo }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            content="调整派单对象"
            icon-name="switch"
            @click="handleSwitch(row)"
          />
          <IconButton
            content="更新进度"
            icon-name="ArrowUp"
            @click="handleArrowUp(row)"
          />
          <IconButton
            content="超时督办"
            icon-name="Clock"
            @click="handleSupervise(row)"
          />
          <IconButton
            content="上传资料"
            icon-name="Upload"
            @click="handleUpdateFile(row)"
          />
          <IconButton
            content="删除"
            icon-name="delete"
            color="#F56C6C"
            @click="handleDelete(row)"
          />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow"></div>
      </template>
    </Grid>
  </div>
</template>

<style scoped lang="scss">
// 超时督办弹窗样式
.supervise-modal-content {
  .supervise-form {
    .el-form-item {
      margin-bottom: 16px;

      &.is-required {
        ::v-deep .el-form-item__label::after {
          content: '*';
          color: #f56c6c;
          margin-left: 4px;
        }
      }
    }

    .form-item {
      font-size: 14px;
      color: #606266;
    }
  }
}

// 上传资料弹窗样式（适配新表单）
.upload-modal-content {
  ::v-deep .el-form {
    width: 100%;
  }

  .upload-demo {
    ::v-deep .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      padding: 20px;
      text-align: center;
      cursor: pointer;

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }
}

// 更新进度抽屉样式
.progress-drawer-content {
  height: 100%;
  box-sizing: border-box;

  .progress-form {
    .el-form-item {
      margin-bottom: 16px;

      &.is-required {
        ::v-deep .el-form-item__label::after {
          content: '*';
          color: #f56c6c;
          margin-left: 4px;
        }
      }
    }

    .form-item {
      font-size: 14px;
      color: #606266;
    }
  }
}

// 批量提醒抽屉样式
.warn-drawer-content {
  height: 100%;
  box-sizing: border-box;

  .warn-form {
    .el-form-item {
      margin-bottom: 16px;

      &.is-required {
        ::v-deep .el-form-item__label::after {
          content: '*';
          color: #f56c6c;
          margin-left: 4px;
        }
      }
    }

    .form-item {
      font-size: 14px;
      color: #606266;
    }
  }
}

// 调整派单对象抽屉样式
.assign-drawer-content {
  height: 100%;
  box-sizing: border-box;

  .assign-form {
    .el-form-item {
      margin-bottom: 16px;

      &.is-required {
        ::v-deep .el-form-item__label::after {
          content: '*';
          color: #f56c6c;
          margin-left: 4px;
        }
      }
    }

    .form-item {
      font-size: 14px;
      color: #606266;
    }
  }
}

// 按钮禁用样式优化
:deep(.common-toolbar-tools) {
  .el-button.is-disabled {
    opacity: 0.6;
  }
}

// 抽屉样式优化
:deep(.el-drawer) {
  .el-drawer__body {
    padding: 0;
  }
}

.text-red-500 {
  color: #f56c6c;
}

.text-gray-500 {
  color: #909399;
}

.text-primary {
  color: #409eff;
}
</style>
