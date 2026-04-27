<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ElButton, ElMessage, ElUpload } from 'element-plus';

import {
  getPointActivityImportTemplate,
  importPointActivity,
} from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/pointActivity';

const emit = defineEmits(['success']);

const [Modal, modalApi] = useVbenModal({
  title: '导入积分活动',
  width: 500,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    handleImport();
  },
});

const fileList = ref([]);
const uploadRef = ref();
const validating = ref(false);
const validationResult = ref(null);

// 下载导入模板
const downloadTemplate = async () => {
  try {
    // 调用API下载导入模板
    const data = await getPointActivityImportTemplate();
    // 使用downloadFileFromBlobPart触发浏览器下载
    downloadFileFromBlobPart({
      fileName: '积分活动导入模板.xlsx',
      source: data,
    });
    ElMessage.success('模板下载成功');
  } catch (error) {
    console.error('下载模板失败:', error);
    ElMessage.error('下载模板失败，请稍后重试');
  }
};

// 文件上传前校验
const beforeUpload = (file) => {
  const isExcel =
    file.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel' ||
    file.name.endsWith('.xlsx') ||
    file.name.endsWith('.xls');
  if (!isExcel) {
    ElMessage.error('请上传Excel文件(.xlsx, .xls)!');
    return false;
  }
  return true;
};

// 文件变化
const handleFileChange = (uploadFile) => {
  validationResult.value = null;
  fileList.value = [uploadFile];
};

// 执行导入
const handleImport = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请选择要导入的文件');
    return;
  }

  validating.value = true;

  try {
    // 获取文件对象
    const file = fileList.value[0].raw;
    if (!file) {
      ElMessage.warning('文件对象无效');
      validating.value = false;
      return;
    }

    // 调用导入接口
    const response = await importPointActivity(file);

    // 根据接口返回结果处理
    // 检查是否是错误响应格式 {code: xxx, msg: 'xxx', data: null}
    if (response && response.code !== undefined && response.code !== 0) {
      // 接口返回错误信息
      validationResult.value = {
        success: false,
        message: response.msg || '导入失败',
        total: 0,
        successCount: 0,
        failCount: 0,
      };
      ElMessage.error(response.msg || '导入失败');
    } else if (response) {
      // 导入成功
      validationResult.value = {
        success: true,
        message: response.msg || response.message || '导入成功',
        total: response.total || 0,
        successCount: response.successCount || 0,
        failCount: response.failCount || 0,
      };

      ElMessage.success(response.msg || response.message || '导入成功');
      emit('success');
      modalApi.close();
    } else {
      validationResult.value = {
        success: false,
        message: '导入失败',
        total: 0,
        successCount: 0,
        failCount: 0,
      };
      ElMessage.error('导入失败');
    }
  } catch (error) {
    console.error('导入失败:', error);
    // 处理错误响应，支持 {code, msg, data} 格式
    const errorMsg = error?.msg || error?.message || '导入失败，请检查文件格式';
    validationResult.value = {
      success: false,
      message: errorMsg,
      total: 0,
      successCount: 0,
      failCount: 0,
    };
    ElMessage.error(errorMsg);
  } finally {
    validating.value = false;
  }
};

const open = () => {
  fileList.value = [];
  validationResult.value = null;
  modalApi.open();
};

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div class="import-container">
      <!-- 模板下载 -->
      <div class="template-section">
        <div class="section-title">1. 下载导入模板</div>
        <div class="section-content">
          <p class="tip-text">
            请使用系统提供的模板格式导入数据，确保数据格式正确
          </p>
          <ElButton type="primary" @click="downloadTemplate">
            <template #icon>
              <i class="el-icon-download"></i>
            </template>
            下载导入模板
          </ElButton>
        </div>
      </div>

      <!-- 文件上传 -->
      <div class="upload-section">
        <div class="section-title">2. 上传数据文件</div>
        <div class="section-content">
          <ElUpload
            ref="uploadRef"
            v-model:file-list="fileList"
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-change="handleFileChange"
            accept=".xlsx,.xls"
            :limit="1"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 .xlsx, .xls 格式文件，文件大小不超过10MB
              </div>
            </template>
          </ElUpload>
        </div>
      </div>

      <!-- 校验结果 -->
      <div v-if="validationResult" class="result-section">
        <div class="section-title">校验结果</div>
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
            <span class="success-count"
              >成功: {{ validationResult.successCount }}</span
            >
            <span class="fail-count"
              >失败: {{ validationResult.failCount }}</span
            >
          </div>
        </div>
      </div>

      <!-- 导入中提示 -->
      <div v-if="validating" class="validating-tip">
        <i class="el-icon-loading"></i>
        正在校验数据，请稍候...
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
  padding: 20px;
  color: var(--el-text-color-secondary);
  text-align: center;
}

:deep(.el-upload-dragger) {
  width: 100%;
}
</style>
