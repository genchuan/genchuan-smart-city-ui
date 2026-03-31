<script setup lang="ts">
import { nextTick, ref } from 'vue';

import { Icon } from '@iconify/vue';
import { ElButton, ElDialog, ElMessage, ElUpload } from 'element-plus';
import type { UploadFile } from 'element-plus';

import { getAccessToken, getTenantId } from '#/utils/genchuan/auth';

/** 外检统计水质检测结果汇总 导入 */
defineOptions({ name: 'WaterSampleTestSummaryImport' });

const emit = defineEmits(['success']);

const dialogVisible = ref(false);
const formLoading = ref(false);
const uploadRef = ref();
const importUrl =
  import.meta.env.VITE_GLOB_API_URL +
  '/waterdetection/water-sample-test-summary/import';
const uploadHeaders = ref();
const fileList = ref<UploadFile[]>([]);
const updateSupport = ref(0);

/** 打开弹窗 */
const open = () => {
  dialogVisible.value = true;
  updateSupport.value = 0;
  fileList.value = [];
  resetForm();
};
defineExpose({ open });

/** 提交表单 */
const submitForm = async () => {
  if (fileList.value.length === 0) {
    ElMessage.error('请上传文件');
    return;
  }
  uploadHeaders.value = {
    Authorization: 'Bearer ' + getAccessToken(),
    'tenant-id': getTenantId(),
  };
  formLoading.value = true;
  uploadRef.value?.submit();
};

/** 文件上传成功 */
const submitFormSuccess = (response: any) => {
  if (response.code !== 0) {
    ElMessage.error(response.msg);
    formLoading.value = false;
    return;
  }
  const data = response.data;
  let text = '上传成功数量：' + data.createSampleNames.length + ';';
  for (const sampleName of data.createSampleNames) {
    text += '< ' + sampleName + ' >';
  }
  text += '更新成功数量：' + data.updateSampleNames.length + ';';
  for (const sampleName of data.updateSampleNames) {
    text += '< ' + sampleName + ' >';
  }
  text += '更新失败数量：' + Object.keys(data.failureSampleNames).length + ';';
  for (const sampleName in data.failureSampleNames) {
    text +=
      '< ' + sampleName + ': ' + data.failureSampleNames[sampleName] + ' >';
  }
  ElMessage.success(text);
  formLoading.value = false;
  dialogVisible.value = false;
  emit('success');
};

/** 上传错误提示 */
const submitFormError = (): void => {
  ElMessage.error('上传失败，请您重新上传！');
  formLoading.value = false;
};

/** 重置表单 */
const resetForm = async (): Promise<void> => {
  formLoading.value = false;
  await nextTick();
  uploadRef.value?.clearFiles();
};

/** 文件数超出提示 */
const handleExceed = (): void => {
  ElMessage.error('最多只能上传一个文件！');
};
</script>
<template>
  <ElDialog
    v-model="dialogVisible"
    title="水质检测结果导入"
    width="400px"
    append-to-body
  >
    <ElUpload
      ref="uploadRef"
      v-model:file-list="fileList"
      :action="importUrl + '?updateSupport=' + updateSupport"
      :auto-upload="false"
      :disabled="formLoading"
      :headers="uploadHeaders"
      :limit="1"
      :on-error="submitFormError"
      :on-exceed="handleExceed"
      :on-success="submitFormSuccess"
      accept=".xlsx, .xls"
      drag
    >
      <div class="upload-content">
        <Icon icon="ep:upload" class="upload-icon" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
    </ElUpload>
    <template #footer>
      <ElButton @click="dialogVisible = false">取 消</ElButton>
      <ElButton type="primary" @click="submitForm" :disabled="formLoading">
        确 定
      </ElButton>
    </template>
  </ElDialog>
</template>

<style scoped>
.upload-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 28px;
  color: #909399;
}
</style>
