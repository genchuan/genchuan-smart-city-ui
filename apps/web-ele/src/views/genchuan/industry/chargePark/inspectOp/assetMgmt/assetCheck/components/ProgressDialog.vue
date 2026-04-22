<script setup>
import { reactive, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElLoading, ElMessage } from 'element-plus';

import { updateAssetCheckProgress } from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/assetCheck';

const emit = defineEmits(['success']);

const formRef = shallowRef(null);
const rowData = shallowRef({});
const formData = reactive({
  progress: 0,
});

const rules = {
  progress: [
    { required: true, message: '请输入盘点进度', trigger: 'change' },
    {
      validator: (_rule, value, callback) => {
        const numberValue = Number(value);
        if (numberValue < 0 || numberValue > 100) {
          callback(new Error('盘点进度需在0-100之间'));
          return;
        }
        callback();
      },
      trigger: 'change',
    },
  ],
};

const [Modal, modalApi] = useVbenModal({
  title: '更新盘点进度',
  width: 460,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    await handleConfirm();
  },
});

async function handleConfirm() {
  if (!rowData.value?.id) {
    ElMessage.warning('操作参数错误');
    return;
  }

  try {
    await formRef.value?.validate?.();
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '正在更新盘点进度...',
  });

  try {
    await updateAssetCheckProgress({
      id: rowData.value.id,
      progress: Number(formData.progress),
    });
    ElMessage.success('盘点进度更新成功');
    emit('success');
    modalApi.close();
  } catch (error) {
    console.error('更新盘点进度失败:', error);
    ElMessage.error('更新失败，请稍后重试');
  } finally {
    loadingInstance.close();
  }
}

function open(row) {
  rowData.value = row || {};
  formData.progress = Number(row?.progress || 0);
  formRef.value?.clearValidate?.();
  modalApi.open();
}

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <el-form
      ref="formRef"
      class="progress-form"
      label-position="top"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="当前盘点进度" prop="progress">
        <div class="progress-editor">
          <el-slider v-model="formData.progress" :max="100" :min="0" />
          <el-input-number
            v-model="formData.progress"
            controls-position="right"
            :max="100"
            :min="0"
          />
        </div>
      </el-form-item>
    </el-form>
  </Modal>
</template>

<style scoped>
.progress-form {
  padding: 20px;
}

.progress-editor {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 130px;
  gap: 16px;
  align-items: center;
  width: 100%;
}
</style>
