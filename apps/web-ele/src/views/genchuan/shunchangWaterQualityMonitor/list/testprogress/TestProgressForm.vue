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

import { TestProgressApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/testprogress';

/** 检测进度跟踪 表单 */
defineOptions({ name: 'TestProgressForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  taskCode: undefined,
  progressPercent: undefined,
  completedIndicators: undefined,
  pendingIndicators: undefined,
  estimatedCompletion: undefined,
  delayReason: undefined,
});
const formRules = reactive({
  taskCode: [{ required: true, message: '任务编号不能为空', trigger: 'blur' }],
  progressPercent: [{ required: true, message: '当前进度(%)不能为空', trigger: 'blur' }],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = type === 'create' ? '新增检测进度跟踪' : '编辑检测进度跟踪';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await TestProgressApi.getTestProgress(id);
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
      await TestProgressApi.createTestProgress(data);
      ElMessage.success('新增成功');
    } else {
      await TestProgressApi.updateTestProgress(data);
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
    progressPercent: undefined,
    completedIndicators: undefined,
    pendingIndicators: undefined,
    estimatedCompletion: undefined,
    delayReason: undefined,
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
      <ElFormItem label="任务编号" prop="taskCode">
        <ElInput v-model="formData.taskCode" placeholder="请输入任务编号" />
      </ElFormItem>
      <ElFormItem label="当前进度(%)" prop="progressPercent">
        <ElInput v-model="formData.progressPercent" placeholder="请输入当前进度(%)" />
      </ElFormItem>
      <ElFormItem label="已完成指标" prop="completedIndicators">
        <ElInput v-model="formData.completedIndicators" placeholder="请输入已完成指标" />
      </ElFormItem>
      <ElFormItem label="未完成指标" prop="pendingIndicators">
        <ElInput v-model="formData.pendingIndicators" placeholder="请输入未完成指标" />
      </ElFormItem>
      <ElFormItem label="预计完成时间" prop="estimatedCompletion">
        <ElDatePicker
          v-model="formData.estimatedCompletion"
          type="date"
          value-format="x"
          placeholder="选择预计完成时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="延迟原因" prop="delayReason">
        <ElInput v-model="formData.delayReason" placeholder="请输入延迟原因(如有)" />
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
