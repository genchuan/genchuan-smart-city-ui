<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
} from 'element-plus';

import { TestResultApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/testresult';

/** 检测结果录入 表单 */
defineOptions({ name: 'TestResultForm' });

const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  sampleCode: undefined,
  testIndicator: undefined,
  testValue: undefined,
  unit: undefined,
  testMethod: undefined,
  testOperator: undefined,
  testTime: undefined,
  equipmentCode: undefined,
});
const formRules = reactive({
  sampleCode: [
    { required: true, message: '样本编号不能为空', trigger: 'blur' },
  ],
  testIndicator: [
    { required: true, message: '检测指标不能为空', trigger: 'blur' },
  ],
  testValue: [{ required: true, message: '检测值不能为空', trigger: 'blur' }],
  unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
  testOperator: [
    { required: true, message: '检测人员不能为空', trigger: 'blur' },
  ],
});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value =
    type === 'create' ? '新增检测结果录入' : '编辑检测结果录入';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await TestResultApi.getTestResult(id);
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
      await TestResultApi.createTestResult(data);
      ElMessage.success('新增成功');
    } else {
      await TestResultApi.updateTestResult(data);
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
    sampleCode: undefined,
    testIndicator: undefined,
    testValue: undefined,
    unit: undefined,
    testMethod: undefined,
    testOperator: undefined,
    testTime: undefined,
    equipmentCode: undefined,
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
      <ElFormItem label="样本编号" prop="sampleCode">
        <ElInput v-model="formData.sampleCode" placeholder="请输入样本编号" />
      </ElFormItem>
      <ElFormItem label="检测指标" prop="testIndicator">
        <ElInput
          v-model="formData.testIndicator"
          placeholder="请输入检测指标"
        />
      </ElFormItem>
      <ElFormItem label="检测值" prop="testValue">
        <ElInput v-model="formData.testValue" placeholder="请输入检测值" />
      </ElFormItem>
      <ElFormItem label="单位" prop="unit">
        <ElInput v-model="formData.unit" placeholder="请输入单位" />
      </ElFormItem>
      <ElFormItem label="检测方法" prop="testMethod">
        <ElInput v-model="formData.testMethod" placeholder="请输入检测方法" />
      </ElFormItem>
      <ElFormItem label="检测人员" prop="testOperator">
        <ElInput v-model="formData.testOperator" placeholder="请输入检测人员" />
      </ElFormItem>
      <ElFormItem label="检测时间" prop="testTime">
        <ElDatePicker
          v-model="formData.testTime"
          type="date"
          value-format="x"
          placeholder="选择检测时间"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="设备编号" prop="equipmentCode">
        <ElInput
          v-model="formData.equipmentCode"
          placeholder="请输入设备编号"
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
