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
import { InspectionTaskAApi } from '#/api/genchuan/shunchangOpsService/smartcity/list/supervisionInspection/inspectionPatrolManagement/inspectiontask';

/** 巡查任务 表单 */
defineOptions({ name: 'InspectionTaskAForm' });

// 提供 open 方法，用于打开弹窗

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
  taskDescription: undefined,
  startingTimeA: undefined,
  endTimeB: undefined,
  inspectionItems: undefined,
  notes: undefined,
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增巡查任务' : '编辑巡查任务';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await InspectionTaskAApi.getInspectionTaskA(id);
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
      await InspectionTaskAApi.createInspectionTaskA(data);
      ElMessage.success('新增成功');
    } else {
      await InspectionTaskAApi.updateInspectionTaskA(data);
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
    taskDescription: undefined,
    startingTimeA: undefined,
    endTimeB: undefined,
    inspectionItems: undefined,
    notes: undefined,
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
      <ElFormItem label="任务编号" prop="taskNumber">
        <ElInput v-model="formData.taskNumber" placeholder="请输入任务编号" />
      </ElFormItem>
      <ElFormItem label="任务名称" prop="task">
        <ElInput v-model="formData.task" placeholder="请输入任务名称" />
      </ElFormItem>
      <ElFormItem label="任务描述" prop="taskDescription">
        <ElInput
          v-model="formData.taskDescription"
          placeholder="请输入任务描述"
        />
      </ElFormItem>
      <ElFormItem label="开始时间" prop="startingTimeA">
        <ElDatePicker
          v-model="formData.startingTimeA"
          type="datetime"
          value-format="x"
          placeholder="选择开始时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="结束时间" prop="endTimeB">
        <ElDatePicker
          v-model="formData.endTimeB"
          type="datetime"
          value-format="x"
          placeholder="选择结束时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="检查项目" prop="inspectionItems">
        <ElInput
          v-model="formData.inspectionItems"
          placeholder="请输入检查项目"
        />
      </ElFormItem>
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
