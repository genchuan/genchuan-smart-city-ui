<script setup>
import { reactive, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useFormSchema } from './data';

const formData = ref({});
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const handleSave = async () => {
  const values = await formApi.getValues();
  // 这里可以添加API调用逻辑
  ElMessage.success('监测参数配置保存成功');
};

const handleCancel = () => {
  formApi.resetForm();
};
</script>

<template>
  <div class="setting-container">
    <div class="setting-header">
      <h3>监测参数配置</h3>
      <p>配置排水管网监测相关参数，包括采集频率、阈值设置等</p>
    </div>
    
    <div class="setting-form">
      <Form />
    </div>
    
    <div class="setting-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.setting-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.setting-header {
  margin-bottom: 20px;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #303133;
  }
  
  p {
    font-size: 14px;
    color: #606266;
  }
}

.setting-form {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.setting-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
</style>