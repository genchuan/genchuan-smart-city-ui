<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElDatePicker,
} from 'element-plus';
import { ProjectBasicInfoApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/projectbasicinfo';

/** 工程基本信息管理 表单 */
defineOptions({ name: 'ProjectBasicInfoForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  projectCode: undefined,
  projectName: undefined,
  designCapacity: undefined,
  processType: undefined,
  commissioningDate: undefined,
  managementUnit: undefined,
  projectStatus: undefined,
  administrativeRegion: undefined,
});
const formRules = reactive({
  projectCode: [{ required: true, message: '工程编码不能为空', trigger: 'blur' }],
  projectName: [{ required: true, message: '工程名称不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增工程基本信息' : '编辑工程基本信息';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await ProjectBasicInfoApi.getProjectBasicInfo(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value;
    if (formType.value === 'create') {
      await ProjectBasicInfoApi.createProjectBasicInfo(data);
      ElMessage.success('新增成功');
    } else {
      await ProjectBasicInfoApi.updateProjectBasicInfo(data);
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
    projectCode: undefined,
    projectName: undefined,
    designCapacity: undefined,
    processType: undefined,
    commissioningDate: undefined,
    managementUnit: undefined,
    projectStatus: undefined,
    administrativeRegion: undefined,
  };
  formRef.value?.resetFields();
};
</script>
<template>
  <ElDialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="600px"
    append-to-body
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
      v-loading="formLoading"
    >
      <ElFormItem label="工程编码" prop="projectCode">
        <ElInput v-model="formData.projectCode" placeholder="请输入工程编码" />
      </ElFormItem>
      <ElFormItem label="工程名称" prop="projectName">
        <ElInput v-model="formData.projectName" placeholder="请输入工程名称" />
      </ElFormItem>
      <ElFormItem label="设计供水规模(吨/日)" prop="designCapacity">
        <ElInput v-model="formData.designCapacity" placeholder="请输入设计供水规模(吨/日)" />
      </ElFormItem>
      <ElFormItem label="工艺类型" prop="processType">
        <ElInput v-model="formData.processType" placeholder="请输入工艺类型" />
      </ElFormItem>
      <ElFormItem label="投产日期" prop="commissioningDate">
        <ElDatePicker
          v-model="formData.commissioningDate"
          type="date"
          value-format="x"
          placeholder="选择投产日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="管理单位" prop="managementUnit">
        <ElInput v-model="formData.managementUnit" placeholder="请输入管理单位" />
      </ElFormItem>
      <ElFormItem label="工程状态" prop="projectStatus">
        <ElInput v-model="formData.projectStatus" placeholder="请输入工程状态" />
      </ElFormItem>
      <ElFormItem label="所属行政区" prop="administrativeRegion">
        <ElInput v-model="formData.administrativeRegion" placeholder="请输入所属行政区" />
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
