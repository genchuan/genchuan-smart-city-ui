<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElDatePicker
} from 'element-plus';
import {
  InspectionPlanManagementApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/landscaping/landscapingInspectionManag/inspectionplanmanagement';

/** 巡查计划管理 表单 */
defineOptions({ name: 'InspectionPlanManagementForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  planName: undefined,
  patrolArea: undefined,
  inspectionCycle: undefined,
  scheduledStartTime: undefined,
  plannedEndTime: undefined,
  arrangementOfPatrolPersonnel: undefined,
  inspectionContent: undefined,
  inspectionStandards: undefined,
  emergencyResponsePlan: undefined,
  notes: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增巡查计划管理' : '编辑巡查计划管理';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await InspectionPlanManagementApi.getInspectionPlanManagement(id);
      formData.value.scheduledStartTime = formData.value.scheduledStartTime ? Number(formData.value.scheduledStartTime) : '';
      formData.value.plannedEndTime = formData.value.plannedEndTime ? Number(formData.value.plannedEndTime) : '';
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
      await InspectionPlanManagementApi.createInspectionPlanManagement(
        data,
      );
      ElMessage.success('新增成功');
    } else {
      await InspectionPlanManagementApi.updateInspectionPlanManagement(
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
    planName: undefined,
    patrolArea: undefined,
    inspectionCycle: undefined,
    scheduledStartTime: undefined,
    plannedEndTime: undefined,
    arrangementOfPatrolPersonnel: undefined,
    inspectionContent: undefined,
    inspectionStandards: undefined,
    emergencyResponsePlan: undefined,
    notes: undefined,
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
      label-width="100px"
      v-loading="formLoading"
    >
      <ElFormItem label="计划名称" prop="planName">
        <ElInput v-model="formData.planName" placeholder="请输入计划名称" />
      </ElFormItem>
      <ElFormItem label="巡查区域" prop="patrolArea">
        <ElInput v-model="formData.patrolArea" placeholder="请输入巡查区域" />
      </ElFormItem>
      <ElFormItem label="巡查周期" prop="inspectionCycle">
        <ElInput v-model="formData.inspectionCycle" placeholder="请输入巡查周期" />
      </ElFormItem>
      <ElFormItem label="计划开始时间" prop="scheduledStartTime">
        <ElDatePicker
          v-model="formData.scheduledStartTime"
          type="date"
          value-format="x"
          placeholder="选择计划开始时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="计划结束时间" prop="plannedEndTime">
        <ElDatePicker
          v-model="formData.plannedEndTime"
          type="date"
          value-format="x"
          placeholder="选择计划结束时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="巡查人员安排" prop="arrangementOfPatrolPersonnel">
        <ElInput v-model="formData.arrangementOfPatrolPersonnel" placeholder="请输入巡查人员安排" />
      </ElFormItem>
      <ElFormItem label="巡查区域" prop="inspectionContent">
        <ElInput v-model="formData.inspectionContent" type="textarea" placeholder="请输入巡查区域" />
      </ElFormItem>
      <ElFormItem label="巡查标准" prop="inspectionStandards">
        <ElInput v-model="formData.inspectionStandards" placeholder="请输入巡查标准" />
      </ElFormItem>
      <!--<ElFormItem label="应急处置预案" prop="emergencyResponsePlan">-->
      <!--  <ElInput v-model="formData.emergencyResponsePlan" placeholder="请输入应急处置预案" />-->
      <!--</ElFormItem>-->
      <ElFormItem label="备注" prop="notes">
        <ElInput v-model="formData.notes" placeholder="请输入备注" />
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
