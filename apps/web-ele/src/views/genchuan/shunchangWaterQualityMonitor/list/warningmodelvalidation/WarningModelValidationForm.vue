<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
} from 'element-plus';

import { WarningModelValidationApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/warningmodelvalidation';

/** 预警模型校验 表单 */
defineOptions({ name: 'WarningModelValidationForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  modelName: undefined,
  validationPeriod: undefined,
  warningCount: undefined,
  accurateWarningCount: undefined,
  falseAlarmCount: undefined,
  accuracyRate: undefined,
  adjustmentSuggestion: undefined,
});
const formRules = reactive({
  modelName: [{ required: true, message: '模型名称不能为空', trigger: 'blur' }],
  validationPeriod: [
    { required: true, message: '校验时间段不能为空', trigger: 'blur' },
  ],
  warningCount: [
    { required: true, message: '预警次数不能为空', trigger: 'blur' },
  ],
  accurateWarningCount: [
    { required: true, message: '准确预警次数不能为空', trigger: 'blur' },
  ],
  falseAlarmCount: [
    { required: true, message: '误报次数不能为空', trigger: 'blur' },
  ],
  accuracyRate: [
    { required: true, message: '准确率(%)不能为空', trigger: 'blur' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增预警模型校验' : '编辑预警模型校验';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value =
        await WarningModelValidationApi.getWarningModelValidation(id);
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
      await WarningModelValidationApi.createWarningModelValidation(data);
      ElMessage.success('新增成功');
    } else {
      await WarningModelValidationApi.updateWarningModelValidation(data);
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
    modelName: undefined,
    validationPeriod: undefined,
    warningCount: undefined,
    accurateWarningCount: undefined,
    falseAlarmCount: undefined,
    accuracyRate: undefined,
    adjustmentSuggestion: undefined,
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
      <ElFormItem label="模型名称" prop="modelName">
        <ElInput v-model="formData.modelName" placeholder="请输入模型名称" />
      </ElFormItem>
      <ElFormItem label="校验时间段" prop="validationPeriod">
        <ElInput
          v-model="formData.validationPeriod"
          placeholder="请输入校验时间段"
        />
      </ElFormItem>
      <ElFormItem label="预警次数" prop="warningCount">
        <ElInput v-model="formData.warningCount" placeholder="请输入预警次数" />
      </ElFormItem>
      <ElFormItem label="准确预警次数" prop="accurateWarningCount">
        <ElInput
          v-model="formData.accurateWarningCount"
          placeholder="请输入准确预警次数"
        />
      </ElFormItem>
      <ElFormItem label="误报次数" prop="falseAlarmCount">
        <ElInput
          v-model="formData.falseAlarmCount"
          placeholder="请输入误报次数"
        />
      </ElFormItem>
      <ElFormItem label="准确率(%)" prop="accuracyRate">
        <ElInput
          v-model="formData.accuracyRate"
          placeholder="请输入准确率(%)"
        />
      </ElFormItem>
      <ElFormItem label="调整建议" prop="adjustmentSuggestion">
        <ElInput
          v-model="formData.adjustmentSuggestion"
          placeholder="请输入调整建议"
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
