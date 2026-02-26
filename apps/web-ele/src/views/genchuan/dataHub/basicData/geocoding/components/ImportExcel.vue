<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close', 'import-success']);

const file = ref(null);
const loading = ref(false);
const result = ref({
  show: false,
  success: false,
  successCount: 0,
  passCount: 0,
  failCount: 0,
  message: '',
});

const handleFileChange = (fileObj) => {
  file.value = fileObj.raw;
  result.value.show = false;
};

const removeFile = () => {
  file.value = null;
  result.value.show = false;
};

const handleImport = () => {
  if (!file.value) {
    result.value = {
      show: true,
      success: false,
      message: '请先选择Excel文件',
    };
    return;
  }

  loading.value = true;

  // 模拟导入过程
  setTimeout(() => {
    loading.value = false;
    // 模拟校验结果
    result.value = {
      show: true,
      success: true,
      successCount: 15,
      passCount: 12,
      failCount: 3,
    };
    emit('import-success', result.value);
  }, 2000);
};

const handleCancel = () => {
  emit('close');
};
</script>

<template>
  <div class="import-excel">
    <el-upload
      class="upload-demo"
      action="#"
      :on-change="handleFileChange"
      :auto-upload="false"
      :show-file-list="false"
      accept=".xlsx,.xls"
    >
      <el-button type="primary" icon="UploadFilled"> 选择Excel文件 </el-button>
    </el-upload>
    <div v-if="file" class="file-info">
      {{ file.name }}
      <el-button type="text" @click="removeFile">移除</el-button>
    </div>
    <div class="result-info" v-if="result.show">
      <el-alert
        :title="result.success ? '导入成功' : '导入失败'"
        :type="result.success ? 'success' : 'error'"
        :closable="false"
        show-icon
      />
      <div v-if="result.success" class="success-info">
        <p>成功导入 {{ result.successCount }} 条数据</p>
        <p>校验通过 {{ result.passCount }} 条</p>
        <p>校验失败 {{ result.failCount }} 条</p>
      </div>
      <div v-else class="error-info">
        <p>{{ result.message }}</p>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleImport" :loading="loading">
        {{ loading ? '导入中...' : '开始导入' }}
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.import-excel {
  padding: 20px;
}

.upload-demo {
  margin-bottom: 20px;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin: 10px 0;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.result-info {
  margin: 20px 0;
}

.success-info,
.error-info {
  padding: 10px;
  margin-top: 10px;
  background-color: #f0f9eb;
  border-radius: 4px;
}

.error-info {
  background-color: #fef0f0;
}

.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}
</style>
