<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElUpload,
} from 'element-plus';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { DrainagePermitApplyApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/waterConservancyAndWaterAffairs/drainageUserManagement/drainagePermitApply';
import { Icon } from '@iconify/vue';

/** 排水许可证申请 表单 */
defineOptions({ name: 'DrainagePermitApplyForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  applyNo: undefined,
  userName: undefined,
  waterQualityReport: undefined,
  dailyDrainage: undefined,
  pollutionProof: undefined,
  violationHistory: undefined,
  applyStatus: undefined,
  approver: undefined,
  approveTime: undefined,
  approveComment: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

// 字典选项 - 使用计算属性实时获取
const applyStatusOptions = computed(() =>
  getDictOptions(DICT_TYPE.CRM_AUDIT_STATUS, 'string'),
);

// 文件上传相关
const uploadLoading = ref(false);
const fileList = ref([]);

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增' : '编辑';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await DrainagePermitApplyApi.getDrainagePermitApply(id);
      // 如果有文件，设置文件列表
      if (formData.value.waterQualityReport) {
        fileList.value = [
          {
            name: formData.value.waterQualityReport.split('/').pop() || '文件',
            url: formData.value.waterQualityReport,
          },
        ];
      }
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value;
    if (formType.value === 'create') {
      await DrainagePermitApplyApi.createDrainagePermitApply(data);
      ElMessage.success('新增成功');
    } else {
      await DrainagePermitApplyApi.updateDrainagePermitApply(data);
      ElMessage.success('修改成功');
    }
    dialogVisible.value = false;
    // 发送操作成功的事件
    emit('success');
  } finally {
    formLoading.value = false;
  }
};

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    applyNo: undefined,
    userName: undefined,
    waterQualityReport: undefined,
    dailyDrainage: undefined,
    pollutionProof: undefined,
    violationHistory: undefined,
    applyStatus: undefined,
    approver: undefined,
    approveTime: undefined,
    approveComment: undefined,
  };
  fileList.value = [];
  formRef.value?.resetFields();
};

/** 文件上传前 */
const beforeUpload = (file: File) => {
  const isValidType = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ].includes(file.type);
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isValidType) {
    ElMessage.error('只支持 doc/xls/ppt/txt/pdf 格式的文件!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过 5MB!');
    return false;
  }
  return true;
};

/** 自定义上传 */
const customUpload = async (options: any) => {
  const { file, onProgress, onSuccess, onError } = options;
  uploadLoading.value = true;
  try {
    const res = await DrainagePermitApplyApi.uploadWaterQualityReport(file);
    formData.value.waterQualityReport = res.url || res.data?.url;
    onSuccess(res);
    ElMessage.success('上传成功');
  } catch (error) {
    onError(error);
    ElMessage.error('上传失败');
  } finally {
    uploadLoading.value = false;
  }
};

/** 文件移除 */
const handleRemove = () => {
  formData.value.waterQualityReport = undefined;
  fileList.value = [];
};
</script>
<template>
  <ElDialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="700px"
    append-to-body
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="180px"
      v-loading="formLoading"
    >
      <ElFormItem label="申请编号" prop="applyNo">
        <ElInput v-model="formData.applyNo" placeholder="请输入申请编号" />
      </ElFormItem>
      <ElFormItem label="排水户名称" prop="userName">
        <ElInput v-model="formData.userName" placeholder="请输入排水户名称" />
      </ElFormItem>
      <ElFormItem label="排水水质检测报告文件" prop="waterQualityReport">
        <ElUpload
          v-model:file-list="fileList"
          :http-request="customUpload"
          :before-upload="beforeUpload"
          :on-remove="handleRemove"
          :limit="1"
          accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf"
        >
          <ElButton type="primary" :loading="uploadLoading">
            <Icon icon="ep:upload" style="margin-right: 4px" /> 选取文件
          </ElButton>
          <template #tip>
            <div class="el-upload__tip">
              <div style=" margin-top: 4px; font-size: 12px;color: #f56c6c">
                大小不超过 5MB
              </div>
              <div style=" margin-top: 4px; font-size: 12px;color: #f56c6c">
                格式为 doc/xls/ppt/txt/pdf 的文件
              </div>
            </div>
          </template>
        </ElUpload>
      </ElFormItem>
      <ElFormItem label="日均排水量（吨）" prop="dailyDrainage">
        <ElInput
          v-model="formData.dailyDrainage"
          placeholder="请输入日均排水量（吨）"
        />
      </ElFormItem>
      <ElFormItem label="重点排污单位证明文件路径" prop="pollutionProof">
        <ElInput
          v-model="formData.pollutionProof"
          placeholder="请输入重点排污单位证明文件路径"
        />
      </ElFormItem>
      <ElFormItem label="历史违规记录" prop="violationHistory">
        <ElInput
          v-model="formData.violationHistory"
          placeholder="请输入历史违规记录"
        />
      </ElFormItem>
      <ElFormItem label="申请状态" prop="applyStatus">
        <ElSelect
          v-model="formData.applyStatus"
          placeholder="请选择申请状态"
          style="width: 100%"
        >
          <ElOption
            v-for="dict in applyStatusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="审核人" prop="approver">
        <ElInput v-model="formData.approver" placeholder="请输入审核人" />
      </ElFormItem>
      <ElFormItem label="审核时间" prop="approveTime">
        <ElDatePicker
          v-model="formData.approveTime"
          type="datetime"
          value-format="x"
          placeholder="选择审核时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="审核意见" prop="approveComment">
        <ElInput
          v-model="formData.approveComment"
          type="textarea"
          placeholder="请输入审核意见"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton @click="submitForm" type="primary" :disabled="formLoading">
        确 定
      </ElButton>
    </template>
  </ElDialog>
</template>

<style scoped>
:deep(.el-upload__tip) {
  line-height: 1.5;
}
</style>
