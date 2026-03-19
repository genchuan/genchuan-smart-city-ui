<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElDatePicker,
} from 'element-plus';
import { PatrolTaskManagementApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/landscaping/landscapingInspectionManag/patroltaskmanagement';

/** 巡査任务管理 表单 */
defineOptions({ name: 'PatrolTaskManagementForm' });

// 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  task: undefined,
  belongingPlan: undefined,
  patrolArea: undefined,
  patrolTime: undefined,
  executive: undefined,
  expectedDuration: undefined,
  taskDescription: undefined,
  keyInspectionPoints: undefined,
  listOfCarryingEquipment: undefined,
  completionStatusDescription: undefined,
  abnormalSituationRecord: undefined,
  handlingMeasures: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增巡査任务' : '编辑巡査任务';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await PatrolTaskManagementApi.getPatrolTaskManagement(id);
      if (formData.value.patrolTime) {
        formData.value.patrolTime = String(formData.value.patrolTime);
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
      await PatrolTaskManagementApi.createPatrolTaskManagement(data);
      ElMessage.success('新增成功');
    } else {
      await PatrolTaskManagementApi.updatePatrolTaskManagement(data);
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
    task: undefined,
    belongingPlan: undefined,
    patrolArea: undefined,
    patrolTime: undefined,
    executive: undefined,
    expectedDuration: undefined,
    taskDescription: undefined,
    keyInspectionPoints: undefined,
    listOfCarryingEquipment: undefined,
    completionStatusDescription: undefined,
    abnormalSituationRecord: undefined,
    handlingMeasures: undefined,
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
      label-width="120px"
      v-loading="formLoading"
    >
      <ElFormItem label="任务名称" prop="task">
        <ElInput v-model="formData.task" placeholder="请输入任务名称" />
      </ElFormItem>
      <ElFormItem label="巡查区域" prop="patrolArea">
        <ElInput v-model="formData.patrolArea" placeholder="请输入巡查区域" />
      </ElFormItem>
      <ElFormItem label="巡查时间" prop="patrolTime">
        <ElDatePicker
          v-model="formData.patrolTime"
          type="date"
          value-format="x"
          placeholder="选择巡查时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="执行人员" prop="executive">
        <ElInput v-model="formData.executive" placeholder="请输入执行人员" />
      </ElFormItem>
      <ElFormItem label="预计时长" prop="expectedDuration">
        <ElInput
          v-model="formData.expectedDuration"
          placeholder="请输入预计时长"
        />
      </ElFormItem>
      <ElFormItem label="任务描述" prop="taskDescription">
        <ElInput
          v-model="formData.taskDescription"
          type="textarea"
          placeholder="请输入任务描述"
        />
      </ElFormItem>
      <ElFormItem label="巡查重点" prop="keyInspectionPoints">
        <ElInput
          v-model="formData.keyInspectionPoints"
          placeholder="请输入巡查重点"
        />
      </ElFormItem>
      <ElFormItem label="携带设备清单" prop="listOfCarryingEquipment">
        <ElInput
          v-model="formData.listOfCarryingEquipment"
          placeholder="请输入携带设备清单"
        />
      </ElFormItem>
      <ElFormItem label="完成情况说明" prop="completionStatusDescription">
        <ElInput
          v-model="formData.completionStatusDescription"
          type="textarea"
          placeholder="请输入完成情况说明"
        />
      </ElFormItem>
      <ElFormItem label="异常情况记录" prop="abnormalSituationRecord">
        <ElInput
          v-model="formData.abnormalSituationRecord"
          type="textarea"
          placeholder="请输入异常情况记录"
        />
      </ElFormItem>
      <ElFormItem label="处理措施" prop="handlingMeasures">
        <ElInput
          v-model="formData.handlingMeasures"
          type="textarea"
          placeholder="请输入处理措施"
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
