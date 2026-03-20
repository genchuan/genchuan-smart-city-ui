<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElMessage,
  ElUpload,
} from 'element-plus';
import type { UploadFile } from 'element-plus';

import { WaterSampleTestSummaryApi } from '#/api/genchuan/shunchangWaterQualityMonitor/list/watersampletestsummary';

/** 外检统计水质检测结果汇总 导入 */
defineOptions({ name: 'WaterSampleTestSummaryImport' });

const emit = defineEmits(['success']);

const dialogVisible = ref(false); // 弹窗的是否展示
const formLoading = ref(false); // 表单的加载中
const uploadRef = ref(); // 上传组件的引用

const formData = reactive({
  file: undefined as UploadFile | undefined,
});
const formRules = {
  file: [{ required: true, message: '请选择文件', trigger: 'change' }],
};
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = () => {
  dialogVisible.value = true;
  resetForm();
};
defineExpose({ open });

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  const valid = await formRef.value.validate();
  if (!valid) return;
  if (!formData.file) {
    ElMessage.error('请选择文件');
    return;
  }
  // 提交请求
  formLoading.value = true;
  try {
    const fileObj = formData.file.raw;
    if (!fileObj) {
      ElMessage.error('文件对象为空');
      return;
    }
    // 调用导入API
    // await WaterSampleTestSummaryApi.importWaterSampleTestSummary(fileObj);
    ElMessage.success('导入成功');
    dialogVisible.value = false;
    // 发送操作成功的事件
    emit('success');
  } catch (error) {
    console.error('导入失败:', error);
    ElMessage.error('导入失败');
  } finally {
    formLoading.value = false;
  }
};

/** 文件变更 */
const handleFileChange = (file: UploadFile) => {
  formData.file = file;
};

/** 重置表单 */
const resetForm = () => {
  formData.file = undefined;
  formRef.value?.resetFields();
  uploadRef.value?.clearFiles?.();
};

/** 下载模板 */
const downloadTemplate = () => {
  // 模板下载逻辑
  ElMessage.success('模板下载成功');
};
</script>
<template>
  <ElDialog title="导入外检统计水质检测结果汇总" v-model="dialogVisible" width="500px" append-to-body>
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <ElFormItem label="选择文件" prop="file">
        <ElUpload
          ref="uploadRef"
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          :limit="1"
          accept=".xlsx,.xls"
        >
          <ElButton type="primary">选择文件</ElButton>
          <template #tip>
            <div class="el-upload__tip">
              请上传 .xlsx 或 .xls 格式的Excel文件
            </div>
          </template>
        </ElUpload>
      </ElFormItem>
      <ElFormItem>
        <ElButton link type="primary" @click="downloadTemplate">
          下载导入模板
        </ElButton>
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
