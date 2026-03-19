<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton
} from 'element-plus';
import {
  InspectionStatisticsApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/supervisionInspection/inspectionPatrolManagement/inspectionstatistics';

/** 巡查分析统计 表单 */
defineOptions({ name: 'InspectionStatisticsForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  patrolArea: undefined,
  patrolPersonnel: undefined,
  completionInspectionTasks: undefined,
  averagePatrolDuration: undefined,
  numberProblemDiscoveries: undefined,
  distributionProblems: undefined,
  problemSolvingRate: undefined,
  repetitiveProblemRate: undefined,
  riskLevelAssessment: undefined,
  suggestionsMeasures: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增巡查分析统计' : '编辑巡查分析统计';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await InspectionStatisticsApi.getInspectionStatistics(id);
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
      await InspectionStatisticsApi.createInspectionStatistics(
        data,
      );
      ElMessage.success('新增成功');
    } else {
      await InspectionStatisticsApi.updateInspectionStatistics(
        data,
      );
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
    patrolArea: undefined,
    patrolPersonnel: undefined,
    completionInspectionTasks: undefined,
    averagePatrolDuration: undefined,
    numberProblemDiscoveries: undefined,
    distributionProblems: undefined,
    problemSolvingRate: undefined,
    repetitiveProblemRate: undefined,
    riskLevelAssessment: undefined,
    suggestionsMeasures: undefined,
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
      <ElFormItem label="巡查区域" prop="patrolArea">
        <ElInput v-model="formData.patrolArea" placeholder="请输入巡查区域" />
      </ElFormItem>
      <ElFormItem label="巡查人员" prop="patrolPersonnel">
        <ElInput v-model="formData.patrolPersonnel" placeholder="请输入巡查人员" />
      </ElFormItem>
      <ElFormItem label="巡查任务完成率" prop="completionInspectionTasks">
        <ElInput v-model="formData.completionInspectionTasks" placeholder="请输入巡查任务完成率" />
      </ElFormItem>
      <ElFormItem label="平均巡查时长" prop="averagePatrolDuration">
        <ElInput v-model="formData.averagePatrolDuration" placeholder="请输入平均巡查时长" />
      </ElFormItem>
      <ElFormItem label="问题发现数量" prop="numberProblemDiscoveries">
        <ElInput v-model="formData.numberProblemDiscoveries" placeholder="请输入问题发现数量" />
      </ElFormItem>
      <ElFormItem label="不同类型问题分布" prop="distributionProblems">
        <ElInput v-model="formData.distributionProblems" placeholder="请输入不同类型问题分布" />
      </ElFormItem>
      <ElFormItem label="问题解决率" prop="problemSolvingRate">
        <ElInput v-model="formData.problemSolvingRate" placeholder="请输入问题解决率" />
      </ElFormItem>
      <ElFormItem label="重复问题发生率" prop="repetitiveProblemRate">
        <ElInput v-model="formData.repetitiveProblemRate" placeholder="请输入重复问题发生率" />
      </ElFormItem>
      <ElFormItem label="风险等级评估" prop="riskLevelAssessment">
        <ElInput v-model="formData.riskLevelAssessment" placeholder="请输入风险等级评估" />
      </ElFormItem>
      <ElFormItem label="建议与改进措施" prop="suggestionsMeasures">
        <ElInput v-model="formData.suggestionsMeasures" placeholder="请输入建议与改进措施" />
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
