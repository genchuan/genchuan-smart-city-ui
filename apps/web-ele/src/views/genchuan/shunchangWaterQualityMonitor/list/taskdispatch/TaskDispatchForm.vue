<script setup lang="ts">
import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
} from 'element-plus';
import { reactive, ref } from 'vue';

import { TaskDispatchApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/taskdispatch';

/** 任务派发 表单 */
defineOptions({ name: 'TaskDispatchForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  taskCode: undefined,
  taskType: undefined,
  testPoints: undefined,
  indicators: undefined,
  deadline: undefined,
  dispatchDept: undefined,
});
const formRules = reactive({
  taskCode: [{ required: true, message: '任务编号不能为空', trigger: 'blur' }],
  taskType: [{ required: true, message: '任务类型不能为空', trigger: 'blur' }],
  testPoints: [{ required: true, message: '检测点清单不能为空', trigger: 'blur' }],
  indicators: [{ required: true, message: '指标清单不能为空', trigger: 'blur' }],
  deadline: [{ required: true, message: '截止日期不能为空', trigger: 'blur' }],
  dispatchDept: [{ required: true, message: '派发部门不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增任务派发' : '编辑任务派发';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await TaskDispatchApi.getTaskDispatch(id);
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
      await TaskDispatchApi.createTaskDispatch(data);
      ElMessage.success('新增成功');
    } else {
      await TaskDispatchApi.updateTaskDispatch(data);
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
    taskCode: undefined,
    taskType: undefined,
    testPoints: undefined,
    indicators: undefined,
    deadline: undefined,
    dispatchDept: undefined,
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
      <ElFormItem label="任务编号" prop="taskCode">
        <ElInput v-model="formData.taskCode" placeholder="请输入任务编号" />
      </ElFormItem>
      <ElFormItem label="任务类型" prop="taskType">
        <ElInput v-model="formData.taskType" placeholder="请输入任务类型(常规/应急)" />
      </ElFormItem>
      <ElFormItem label="检测点清单" prop="testPoints">
        <ElInput v-model="formData.testPoints" placeholder="请输入检测点清单" />
      </ElFormItem>
      <ElFormItem label="指标清单" prop="indicators">
        <ElInput v-model="formData.indicators" placeholder="请输入指标清单" />
      </ElFormItem>
      <ElFormItem label="截止日期" prop="deadline">
        <ElDatePicker
          v-model="formData.deadline"
          type="date"
          value-format="x"
          placeholder="选择截止日期"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="派发部门" prop="dispatchDept">
        <ElInput v-model="formData.dispatchDept" placeholder="请输入派发部门" />
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
