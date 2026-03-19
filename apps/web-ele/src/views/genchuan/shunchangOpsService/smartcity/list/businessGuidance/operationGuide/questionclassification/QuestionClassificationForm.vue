<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElOption,
  ElSelect,
} from 'element-plus';

import { QuestionClassificationApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/businessGuidance/operationGuide/questionclassification';

/** 问题录入 表单 */
defineOptions({ name: 'QuestionClassificationForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  isArea: undefined,
  questionType: undefined,
  urgency: undefined,
  involvingTheSubject: undefined,
});
const formRules = reactive({
  isArea: [{ required: true, message: '请输入所属领域', trigger: 'blur' }],
  questionType: [
    { required: true, message: '请选择问题类型', trigger: 'change' },
  ],
  urgency: [{ required: true, message: '请输入紧急程度', trigger: 'blur' }],
  involvingTheSubject: [
    { required: true, message: '请输入涉及主体', trigger: 'blur' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增问题分类' : '修改问题分类';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await QuestionClassificationApi.getQuestionClassification(id);
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
      await QuestionClassificationApi.createQuestionClassification(data);
      ElMessage.success('新增成功');
    } else {
      await QuestionClassificationApi.updateQuestionClassification(data);
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
    isArea: undefined,
    questionType: undefined,
    urgency: undefined,
    involvingTheSubject: undefined,
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
      <ElFormItem label="所属领域" prop="isArea">
        <ElInput v-model="formData.isArea" placeholder="请输入所属领域" />
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
      <ElFormItem label="紧急程度" prop="urgency">
        <ElInput v-model="formData.urgency" placeholder="请输入紧急程度" />
      </ElFormItem>
      <ElFormItem label="涉及主体" prop="involvingTheSubject">
        <ElInput
          v-model="formData.involvingTheSubject"
          placeholder="请输入涉及主体"
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
