<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElOption,
  ElSelect,
} from 'element-plus';

import { ProblemInputApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/operationGuide/probleminput';

/** 问题录入 表单 */
defineOptions({ name: 'ProblemInputForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  questionTitle: undefined,
  problemDescription: undefined,
  questionTime: undefined,
  questioner: undefined,
  isArea: undefined,
  urgency: undefined,
  questionType: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增问题录入' : '编辑问题录入';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await ProblemInputApi.getProblemInput(id);
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
      await ProblemInputApi.createProblemInput(data);
      ElMessage.success('新增成功');
    } else {
      await ProblemInputApi.updateProblemInput(data);
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
    questionTitle: undefined,
    problemDescription: undefined,
    questionTime: undefined,
    questioner: undefined,
    isArea: undefined,
    urgency: undefined,
    questionType: undefined,
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
      label-width="100px"
      v-loading="formLoading"
    >
      <ElFormItem label="问题标题" prop="questionTitle">
        <ElInput
          v-model="formData.questionTitle"
          placeholder="请输入问题标题"
        />
      </ElFormItem>
      <ElFormItem label="问题描述" prop="problemDescription">
        <ElInput
          v-model="formData.problemDescription"
          placeholder="请输入问题描述"
        />
      </ElFormItem>
      <ElFormItem label="提问时间" prop="questionTime">
        <ElDatePicker
          v-model="formData.questionTime"
          type="date"
          value-format="x"
          placeholder="选择提问时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="提问人" prop="questioner">
        <ElInput v-model="formData.questioner" placeholder="请输入提问人" />
      </ElFormItem>
      <ElFormItem label="所属领域" prop="isArea">
        <ElInput v-model="formData.isArea" placeholder="请输入所属领域" />
      </ElFormItem>
      <ElFormItem label="紧急程度" prop="urgency">
        <ElInput v-model="formData.urgency" placeholder="请输入紧急程度" />
      </ElFormItem>
      <ElFormItem label="问题类型" prop="questionType">
        <ElSelect
          v-model="formData.questionType"
          placeholder="请选择问题类型"
          style="width: 100%"
        >
          <ElOption label="系统操作类" value="systemOperation" />
          <ElOption label="现场实操类" value="onSiteOperation" />
          <ElOption label="流程管理类" value="processManagement" />
          <ElOption label="资源需求类" value="resourceRequirement" />
          <ElOption label="政策咨询类" value="policyConsultation" />
          <ElOption label="其他问题" value="other" />
        </ElSelect>
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
