<script setup lang="ts">
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage, ElUpload } from 'element-plus';
import * as XLSX from 'xlsx';

import { importInstance } from '#/api/genchuan/dataHub/basicData/managePart';

const emit = defineEmits(['success']);

const [Modal, modalApi] = useVbenModal({
  title: '导入部件实例',
  width: 500,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    handleImport();
  },
});

const fileList = ref<any[]>([]);
const uploadRef = ref();
const validating = ref(false);
const validationResult = ref<null | {
  failCount: number;
  message: string;
  success: boolean;
  successCount: number;
  total: number;
}>(null);

// 下载导入模板
const downloadTemplate = () => {
  // 创建模板数据
  const templateData = [
    [
      '部件名称',
      '16位标识码',
      '所属分类',
      '所在网格',
      '坐标信息',
      '运行状态',
      '主管部门',
      '创建人',
      '关联监测部件数',
      '行政区划归属',
    ],
    [
      '示例-路灯001',
      'LD20250301000001',
      '道路设施',
      '中山路网格A区',
      '118.596000,24.915000',
      '2',
      '市政管理局',
      '张三',
      '3',
      '朝阳区',
    ],
    [
      '示例-垃圾桶001',
      'LJ20250301000002',
      '环境卫生',
      '公园路网格B区',
      '118.595000,24.925000',
      '2',
      '环卫管理处',
      '李四',
      '1',
      '海淀区',
    ],
  ];

  // 使用xlsx库创建Excel文件
  const worksheet = XLSX.utils.aoa_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '导入模板');

  // 生成Excel文件并下载
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = '部件实例导入模板.xlsx';
  document.body.append(link);
  link.click();
  link.remove();
  ElMessage.success('模板下载成功');
};

// 文件上传前校验
const beforeUpload = (file: File) => {
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
const handleFileChange = (uploadFile: any) => {
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
    const response = await importInstance(file);

    // 根据接口返回结果处理
    if (response) {
      validationResult.value = {
        success: true,
        message: response.message || '导入成功',
        total: response.total || 0,
        successCount: response.successCount || 0,
        failCount: response.failCount || 0,
      };

      ElMessage.success(response.message || '导入成功');
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
  } catch (error: any) {
    console.error('导入失败:', error);
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
