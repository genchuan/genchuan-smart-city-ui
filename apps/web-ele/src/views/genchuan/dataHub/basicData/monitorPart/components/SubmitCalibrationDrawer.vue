<script setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  ElButton,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
} from 'element-plus';

const emit = defineEmits(['success']);

const [Drawer, drawerApi] = useVbenDrawer({
  title: '提交校准记录',
  width: 500,
  modal: false,
  appendToMain: true,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    handleSubmit();
  },
});

const record = ref({});
const formRef = ref(null);
const formData = ref({
  calibrationTime: '',
  calibrationResult: '',
  operator: '',
});
const rules = {
  calibrationTime: [
    { required: true, message: '请选择校准时间', trigger: 'change' },
  ],
  calibrationResult: [
    { required: true, message: '请输入校准结果', trigger: 'blur' },
  ],
  operator: [{ required: true, message: '请输入操作人员', trigger: 'blur' }],
};

const open = (row) => {
  record.value = row;
  formData.value = {
    calibrationTime: '',
    calibrationResult: '',
    operator: '',
  };
  drawerApi.open();
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate((valid) => {
    if (valid) {
      // 这里调用提交校准记录的API
      // 由于没有实际的API，这里模拟提交成功
      ElMessage.success('提交校准记录成功');
      drawerApi.close();
      emit('success');
    }
  });
};

defineExpose({
  open,
});
</script>

<template>
  <Drawer>
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      style="padding: 20px"
    >
      <ElFormItem label="部件名称">
        <span>{{ record.name }}</span>
      </ElFormItem>
      <ElFormItem label="18位标识码">
        <span>{{ record.uniqueCode }}</span>
      </ElFormItem>
      <ElFormItem label="校准时间" prop="calibrationTime">
        <ElDatePicker
          v-model="formData.calibrationTime"
          type="datetime"
          placeholder="请选择校准时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="校准结果" prop="calibrationResult">
        <ElInput
          v-model="formData.calibrationResult"
          type="textarea"
          :rows="3"
          placeholder="请输入校准结果"
        />
      </ElFormItem>
      <ElFormItem label="操作人员" prop="operator">
        <ElInput v-model="formData.operator" placeholder="请输入操作人员" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="drawerApi.close()">取消</ElButton>
      <ElButton type="primary" @click="handleSubmit">确认</ElButton>
    </template>
  </Drawer>
</template>

<style scoped></style>
