<script setup>
import { reactive, ref } from 'vue';

import { ElMessage } from 'element-plus';

const emit = defineEmits(['close', 'save']);

const formRef = ref(null);
const formData = reactive({
  selectUserName: '',
  importPoints: 1,
  importReason: '',
  importType: '单个导入',
  batchImportFile: '',
});

const rules = {
  selectUserName: [
    { required: true, message: '请输入用户选择', trigger: 'blur' },
  ],
  importPoints: [
    { required: true, message: '请输入积分数量', trigger: 'blur' },
  ],
  importReason: [
    { required: true, message: '请输入导入原因', trigger: 'blur' },
  ],
  importType: [
    { required: true, message: '请选择导入方式', trigger: 'change' },
  ],
};

const handleFileChange = (file) => {
  formData.batchImportFile = file.raw;
};

const handleSave = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    emit('save', formData);
    ElMessage.success('导入成功');
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};
</script>

<template>
  <div class="import-drawer">
    <div class="drawer-header">
      <h3>人工积分导入</h3>
    </div>
    <div class="drawer-content">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="用户选择" required>
          <el-input
            v-model="formData.selectUserName"
            placeholder="请输入用户选择"
          />
        </el-form-item>
        <el-form-item label="积分数量" required>
          <el-input-number
            v-model="formData.importPoints"
            placeholder="请输入积分数量"
            :min="1"
          />
        </el-form-item>
        <el-form-item label="导入原因" required>
          <el-input
            v-model="formData.importReason"
            placeholder="请输入导入原因"
          />
        </el-form-item>
        <el-form-item label="导入方式" required>
          <el-select v-model="formData.importType" placeholder="请选择导入方式">
            <el-option label="单个导入" value="单个导入" />
            <el-option label="批量导入" value="批量导入" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="批量导入文件"
          v-if="formData.importType === '批量导入'"
        >
          <el-upload
            class="upload-demo"
            action="#"
            :on-change="handleFileChange"
            :auto-upload="false"
            :limit="1"
            accept=".xlsx, .xls"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                请上传Excel文件，单个文件大小不超过5MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<style scoped>
.import-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e4e7ed;
}

.drawer-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.drawer-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.drawer-footer {
  padding: 16px 24px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.upload-demo {
  margin-top: 8px;
}
</style>
