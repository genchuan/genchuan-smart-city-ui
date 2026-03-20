<script setup>
import { ref } from 'vue';

import { ElMessage } from 'element-plus';

import {
  importGarbageCollection
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/garbageCollection/data.js';

const emit = defineEmits(['close', 'success']); // 定义两个事件：关闭抽屉、导入成功

const file = ref(null);
const loading = ref(false);

// 选择文件
const handleFileChange = (uploadFile) => {
  file.value = uploadFile.raw;
};

// 移除文件
const removeFile = () => {
  file.value = null;
};

// 开始导入
const handleImport = async () => {
  if (!file.value) {
    ElMessage.warning('请先选择Excel文件');
    return;
  }

  loading.value = true;
  try {
    console.log('开始导入，文件：', file.value);
    const res = await importGarbageCollection(file.value);
    console.log('请求完成，响应：', res);

    if (res && typeof res === 'object') {
      // 情况1：有 code 字段（错误时可能返回）
      if (res.code !== undefined) {
        if (res.code === 0) {
          const success = res.data?.successCount || 0;
          const fail = res.data?.errorCount || 0;
          ElMessage.success(`导入成功：成功 ${success} 条，失败 ${fail} 条`);
          emit('success', res.data);
          emit('close');
        } else {
          ElMessage.error(res.msg || '导入失败');
        }
      }
      // 情况2：无 code 字段，但有 errorCount（成功时返回）
      else if (res.errorCount === undefined) {
        ElMessage.error('导入失败：返回数据格式异常');
        console.error('未知响应格式', res);
      } else {
        if (res.errorCount === 0) {
          ElMessage.success(
            `导入成功：成功 ${res.successCount} 条，失败 ${res.errorCount} 条`,
          );
          emit('success', res);
          emit('close');
        } else {
          ElMessage.warning(
            `导入完成：成功 ${res.successCount} 条，失败 ${res.errorCount} 条`,
          );
          // 部分失败，可选择不自动关闭抽屉，让用户查看错误列表
        }
      }
    } else {
      ElMessage.error('导入失败：无效的响应数据');
    }
  } catch (error) {
    console.error('导入失败，详细错误：', error);
    ElMessage.error('导入失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 取消
const handleCancel = () => {
  emit('close');
};
</script>

<template>
  <div class="batch-import">
    <!-- 文件上传按钮 -->
    <el-upload
      class="upload-demo"
      action="#"
      :on-change="handleFileChange"
      :auto-upload="false"
      :show-file-list="false"
      accept=".xlsx,.xls"
    >
      <el-button type="primary" icon="UploadFilled">选择Excel文件</el-button>
    </el-upload>

    <!-- 显示已选文件 -->
    <div v-if="file" class="file-info">
      {{ file.name }}
      <el-button link @click="removeFile">移除</el-button>
    </div>

    <!-- 底部按钮 -->
    <div class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleImport">
        {{ loading ? '导入中...' : '开始导入' }}
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.batch-import {
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

.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}
</style>
