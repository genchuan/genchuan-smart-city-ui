<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElDatePicker
} from 'element-plus';
import {
  MaintenancePlanApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/landscaping/landscapingMaintenance/maintenanceplan';

/** 养护计划 表单 */
defineOptions({ name: 'MaintenancePlanForm' });

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  planNumber: undefined,
  planName: undefined,
  planFormulationDate: undefined,
  startDate: undefined,
  plannedEndDate: undefined,
  maintenancePersonnel: undefined,
  maintainParcel: undefined,
  maintenanceContent: undefined,
  maintenanceFrequency: undefined,
  maintenanceDemand: undefined,
  planStatus: undefined,
  plannedBudget: undefined,
  approver: undefined,
  approvalOpinion: undefined,
  approvalDate: undefined,
});
const formRules = reactive({
  planNumber: [{ required: true, message: '请输入计划编号', trigger: 'blur' }],
  planName: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增养护计划' : '编辑养护计划';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await MaintenancePlanApi.getMaintenancePlan(id);
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
      await MaintenancePlanApi.createMaintenancePlan(data);
      ElMessage.success('新增成功');
    } else {
      await MaintenancePlanApi.updateMaintenancePlan(data);
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
    planNumber: undefined,
    planName: undefined,
    planFormulationDate: undefined,
    startDate: undefined,
    plannedEndDate: undefined,
    maintenancePersonnel: undefined,
    maintainParcel: undefined,
    maintenanceContent: undefined,
    maintenanceFrequency: undefined,
    maintenanceDemand: undefined,
    planStatus: undefined,
    plannedBudget: undefined,
    approver: undefined,
    approvalOpinion: undefined,
    approvalDate: undefined,
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
      <ElFormItem label="计划编号" prop="planNumber">
        <ElInput v-model="formData.planNumber" placeholder="请输入计划编号" />
      </ElFormItem>
      <ElFormItem label="计划名称" prop="planName">
        <ElInput v-model="formData.planName" placeholder="请输入计划名称" />
      </ElFormItem>
      <ElFormItem label="计划制定日期" prop="planFormulationDate">
        <ElDatePicker
          v-model="formData.planFormulationDate"
          type="date"
          value-format="x"
          placeholder="选择计划制定日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="计划开始日期" prop="startDate">
        <ElDatePicker
          v-model="formData.startDate"
          type="date"
          value-format="x"
          placeholder="选择计划开始日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="计划结束日期" prop="plannedEndDate">
        <ElDatePicker
          v-model="formData.plannedEndDate"
          type="date"
          value-format="x"
          placeholder="选择计划结束日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="负责养护人员" prop="maintenancePersonnel">
        <ElInput v-model="formData.maintenancePersonnel" placeholder="请输入负责养护人员" />
      </ElFormItem>
      <ElFormItem label="养护地块" prop="maintainParcel">
        <ElInput v-model="formData.maintainParcel" placeholder="请输入养护地块" />
      </ElFormItem>
      <ElFormItem label="养护内容" prop="maintenanceContent">
        <ElInput v-model="formData.maintenanceContent" type="textarea" placeholder="请输入养护内容" />
      </ElFormItem>
      <ElFormItem label="养护频率" prop="maintenanceFrequency">
        <ElInput v-model="formData.maintenanceFrequency" placeholder="请输入养护频率" />
      </ElFormItem>
      <ElFormItem label="养护资源需求" prop="maintenanceDemand">
        <ElInput v-model="formData.maintenanceDemand" placeholder="请输入养护资源需求" />
      </ElFormItem>
      <ElFormItem label="计划预算" prop="plannedBudget">
        <ElInput v-model="formData.plannedBudget" placeholder="请输入计划预算" />
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
