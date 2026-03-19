<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton
} from 'element-plus';
import {
  AssessmentAndEvaluationApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/landscaping/landscapingMaintenance/assessmentandevaluation';

/** 养护考核评价 表单 */
defineOptions({ name: 'AssessmentAndEvaluationForm' });

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  maintenancePersonnelNumber: undefined,
  maintenanceTaskNumber: undefined,
  assessmentCycle: undefined,
  assessmentScore: undefined,
  assessmentLevel: undefined,
  evaluationOpinion: undefined,
  improvementSuggestions: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增养护考核评价' : '编辑养护考核评价';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await AssessmentAndEvaluationApi.getAssessmentAndEvaluation(id);
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
      await AssessmentAndEvaluationApi.createAssessmentAndEvaluation(data);
      ElMessage.success('新增成功');
    } else {
      await AssessmentAndEvaluationApi.updateAssessmentAndEvaluation(data);
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
    maintenancePersonnelNumber: undefined,
    maintenanceTaskNumber: undefined,
    assessmentCycle: undefined,
    assessmentScore: undefined,
    assessmentLevel: undefined,
    evaluationOpinion: undefined,
    improvementSuggestions: undefined,
  };
  formRef.value?.resetFields();
};
</script>
<template>
  <ElDialog :title="dialogTitle" v-model="dialogVisible" width="600px" append-to-body>
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <ElFormItem label="养护人员编号" prop="maintenancePersonnelNumber">
        <ElInput v-model="formData.maintenancePersonnelNumber" placeholder="请输入养护人员编号" />
      </ElFormItem>
      <ElFormItem label="养护任务编号" prop="maintenanceTaskNumber">
        <ElInput v-model="formData.maintenanceTaskNumber" placeholder="请输入养护任务编号" />
      </ElFormItem>
      <ElFormItem label="考核周期" prop="assessmentCycle">
        <ElInput v-model="formData.assessmentCycle" placeholder="请输入考核周期" />
      </ElFormItem>
      <ElFormItem label="考核得分" prop="assessmentScore">
        <ElInput v-model="formData.assessmentScore" placeholder="请输入考核得分" />
      </ElFormItem>
      <ElFormItem label="考核等级" prop="assessmentLevel">
        <ElInput v-model="formData.assessmentLevel" placeholder="请输入考核等级" />
      </ElFormItem>
      <ElFormItem label="评价意见" prop="evaluationOpinion">
        <ElInput v-model="formData.evaluationOpinion" type="textarea" placeholder="请输入评价意见" />
      </ElFormItem>
      <ElFormItem label="改进建议" prop="improvementSuggestions">
        <ElInput v-model="formData.improvementSuggestions" type="textarea" placeholder="请输入改进建议" />
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
