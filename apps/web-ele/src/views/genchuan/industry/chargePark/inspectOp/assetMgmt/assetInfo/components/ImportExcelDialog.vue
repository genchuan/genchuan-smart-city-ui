<script setup>
import { computed, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { UploadFilled } from '@element-plus/icons-vue';
import { ElButton, ElMessage, ElUpload } from 'element-plus';
import * as XLSX from 'xlsx';

import { importAssetInfo } from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/assetInfo';

const emit = defineEmits(['success']);

const fileList = shallowRef([]);
const uploadRef = shallowRef(null);
const validating = shallowRef(false);
const validationResult = shallowRef(null);
const successCountText = computed(
  () => `成功: ${validationResult.value?.successCount ?? 0}`,
);
const failCountText = computed(
  () => `失败: ${validationResult.value?.failCount ?? 0}`,
);

const [Modal, modalApi] = useVbenModal({
  title: '导入资产信息',
  width: 560,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    handleImport();
  },
});

function downloadTemplate() {
  const templateData = [
    ['资产名称', '资产类型', '采购时间', '所属场站', '资产状态'],
    ['车位监测摄像头', '监测设备', '2026-04-15 09:00:00', '泉州丰泽充电站', '正常'],
    ['直流快充终端', '充电设备', '2026-04-16 09:00:00', '晋江池店综合能源站', '正常'],
    ['手持巡检终端', '巡检工具', '2026-04-17 09:00:00', '鲤城公共停车场', '正常'],
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '资产信息导入模板');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = '资产信息导入模板.xlsx';
  document.body.append(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
  ElMessage.success('模板下载成功');
}

function validateFile(file) {
  const isExcel =
    file.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel' ||
    file.name.endsWith('.xlsx') ||
    file.name.endsWith('.xls');
  const isValidSize = file.size / 1024 / 1024 <= 10;

  if (!isExcel) {
    ElMessage.error('请上传 Excel 文件（.xlsx 或 .xls）');
    return false;
  }
  if (!isValidSize) {
    ElMessage.error('文件大小不能超过 10MB');
    return false;
  }
  return true;
}

function beforeUpload(file) {
  return validateFile(file);
}

function handleFileChange(uploadFile) {
  validationResult.value = null;
  const rawFile = uploadFile.raw;
  if (!rawFile || !validateFile(rawFile)) {
    fileList.value = [];
    uploadRef.value?.clearFiles?.();
    return;
  }
  fileList.value = [uploadFile];
}

async function handleImport() {
  if (fileList.value.length === 0) {
    ElMessage.warning('请选择要导入的文件');
    return;
  }

  const file = fileList.value[0]?.raw;
  if (!file) {
    ElMessage.warning('文件对象无效');
    return;
  }

  validating.value = true;

  try {
    const response = await importAssetInfo(file);
    validationResult.value = {
      success: true,
      message: response?.message || '导入成功',
      total: response?.total || 0,
      successCount: response?.successCount || 0,
      failCount: response?.failureCount || 0,
    };
    console.log('response', response);
    if (validationResult.value.failCount > 0) {
      ElMessage.warning('部分数据导入失败，请查看校验结果');
    } else {
      ElMessage.success(response?.message || '导入成功');
      emit('success');
      modalApi.close();
    }
  } catch (error) {
    console.error('导入资产信息失败:', error);
    validationResult.value = {
      success: false,
      message: error?.message || '导入失败，请检查文件格式',
      total: 0,
      successCount: 0,
      failCount: 0,
    };
    ElMessage.error(error?.message || '导入失败，请检查文件格式');
  } finally {
    validating.value = false;
  }
}

function open() {
  fileList.value = [];
  validationResult.value = null;
  uploadRef.value?.clearFiles?.();
  modalApi.open();
}

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div class="import-container">
      <div class="template-section">
        <div class="section-title">1. 下载导入模板</div>
        <div class="section-content">
          <p class="tip-text">
            请按模板填写资产名称、资产类型、采购时间和所属场站。
          </p>
          <ElButton type="primary" @click="downloadTemplate">
            下载导入模板
          </ElButton>
        </div>
      </div>

      <div class="upload-section">
        <div class="section-title">2. 上传数据文件</div>
        <div class="section-content">
          <ElUpload
            ref="uploadRef"
            v-model:file-list="fileList"
            accept=".xlsx,.xls"
            action="#"
            :auto-upload="false"
            :before-upload="beforeUpload"
            drag
            :limit="1"
            :on-change="handleFileChange"
          >
            <el-icon class="upload-icon"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 .xlsx、.xls 文件，大小不超过 10MB。
              </div>
            </template>
          </ElUpload>
        </div>
      </div>

      <div v-if="validationResult" class="result-section">
        <div class="section-title">导入结果</div>
        <div
          class="result-content"
          :class="{
            success: validationResult.success,
            error: !validationResult.success,
          }"
        >
          <div class="result-message">{{ validationResult.message }}</div>
          <div class="result-detail">
            <span>总记录数: {{ validationResult.total }}</span>
            <span class="success-count">{{ successCountText }}</span>
            <span class="fail-count">{{ failCountText }}</span>
          </div>
        </div>
      </div>

      <div v-if="validating" class="validating-tip">
        正在导入并校验数据，请稍候...
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.import-container {
  padding: 20px;
}

.template-section,
.upload-section {
  margin-bottom: 24px;
}

.section-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.section-content {
  padding-left: 16px;
}

.tip-text {
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.upload-icon {
  margin-bottom: 12px;
  font-size: 32px;
  color: var(--el-color-primary);
}

.result-section {
  padding: 16px;
  margin-top: 20px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.result-content {
  padding: 12px;
  border-radius: 4px;
}

.result-content.success {
  background-color: var(--el-color-success-light-9);
  border: 1px solid var(--el-color-success-light-5);
}

.result-content.error {
  background-color: var(--el-color-danger-light-9);
  border: 1px solid var(--el-color-danger-light-5);
}

.result-message {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.result-content.success .result-message {
  color: var(--el-color-success);
}

.result-content.error .result-message {
  color: var(--el-color-danger);
}

.result-detail {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.result-detail span {
  margin-right: 16px;
}

.success-count {
  color: var(--el-color-success);
}

.fail-count {
  color: var(--el-color-danger);
}

.validating-tip {
  padding: 16px;
  color: var(--el-text-color-secondary);
  text-align: center;
}

:deep(.el-upload-dragger) {
  width: 100%;
}
</style>
