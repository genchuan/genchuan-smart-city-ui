<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElDatePicker
} from 'element-plus';
import {
  MaintenanceTasksApi,
} from '#/api/genchuan/shunchangOpsService/smartcity/list/industryApp/landscaping/landscapingMaintenance/maintenancetasks';

/** 养护任务 表单 */
defineOptions({ name: 'MaintenanceTasksForm' });

/** 提交表单 */
const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  taskNumber: undefined,
  task: undefined,
  maintainTheLandParcel: undefined,
  maintenancePersonnel: undefined,
  taskStartTime: undefined,
  taskEndTime: undefined,
  taskContent: undefined,
  requiredTools: undefined,
  requiredMaterials: undefined,
  taskPriority: undefined,
  status: undefined,
  completionStatusDescription: undefined,
});
const formRules = reactive({
  taskNumber: [{ required: true, message: '请输入任务编号', trigger: 'blur' }],
  task: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增养护任务' : '编辑养护任务';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await MaintenanceTasksApi.getMaintenanceTasks(id);
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
      await MaintenanceTasksApi.createMaintenanceTasks(data);
      ElMessage.success('新增成功');
    } else {
      await MaintenanceTasksApi.updateMaintenanceTasks(data);
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
    taskNumber: undefined,
    task: undefined,
    maintainTheLandParcel: undefined,
    maintenancePersonnel: undefined,
    taskStartTime: undefined,
    taskEndTime: undefined,
    taskContent: undefined,
    requiredTools: undefined,
    requiredMaterials: undefined,
    taskPriority: undefined,
    status: undefined,
    completionStatusDescription: undefined,
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
      <ElFormItem label="任务编号" prop="taskNumber">
        <ElInput v-model="formData.taskNumber" placeholder="请输入任务编号" />
      </ElFormItem>
      <ElFormItem label="任务名称" prop="task">
        <ElInput v-model="formData.task" placeholder="请输入任务名称" />
      </ElFormItem>
      <ElFormItem label="养护地块" prop="maintainTheLandParcel">
        <ElInput v-model="formData.maintainTheLandParcel" placeholder="请输入养护地块" />
      </ElFormItem>
      <ElFormItem label="养护人员" prop="maintenancePersonnel">
        <ElInput v-model="formData.maintenancePersonnel" placeholder="请输入养护人员" />
      </ElFormItem>
      <ElFormItem label="任务开始时间" prop="taskStartTime">
        <ElDatePicker
          v-model="formData.taskStartTime"
          type="datetime"
          value-format="x"
          placeholder="选择任务开始时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="任务结束时间" prop="taskEndTime">
        <ElDatePicker
          v-model="formData.taskEndTime"
          type="datetime"
          value-format="x"
          placeholder="选择任务结束时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="任务内容" prop="taskContent">
        <ElInput v-model="formData.taskContent" type="textarea" placeholder="请输入任务内容" />
      </ElFormItem>
      <ElFormItem label="所需工具" prop="requiredTools">
        <ElInput v-model="formData.requiredTools" placeholder="请输入所需工具" />
      </ElFormItem>
      <ElFormItem label="任务优先级" prop="taskPriority">
        <ElInput v-model="formData.taskPriority" placeholder="请输入任务优先级" />
      </ElFormItem>
      <ElFormItem label="完成情况说明" prop="completionStatusDescription">
        <ElInput v-model="formData.completionStatusDescription" type="textarea" placeholder="请输入完成情况说明" />
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
