<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton, ElInput, ElMessage } from 'element-plus';

import { updateInstance } from '#/api/genchuan/dataHub/basicData/monitorEvent';

const emit = defineEmits(['success']);

const [Modal, modalApi] = useVbenModal({
  title: '驳回事件',
  width: 500,
  centered: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    handleConfirm();
  },
});

const record = ref({});
const rejectReason = ref('');
const loading = ref(false);

const open = (row) => {
  record.value = row;
  rejectReason.value = '';
  modalApi.open();
};

const handleConfirm = async () => {
  if (!rejectReason.value.trim()) {
    ElMessage.warning('请输入驳回理由');
    return;
  }

  try {
    loading.value = true;
    await updateInstance({
      ...record.value,
      status: '3', // 已驳回
      rejectReason: rejectReason.value,
    });
    ElMessage.success('驳回成功，已通知创建人');
    modalApi.close();
    emit('success');
  } catch (error) {
    console.error('驳回失败:', error);
    ElMessage.error('驳回失败');
  } finally {
    loading.value = false;
  }
};

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div class="reject-content">
      <div class="info">
        <p>事件名称：{{ record.name }}</p>
        <p>18位标识码：{{ record.uniqueCode }}</p>
      </div>
      <div class="form-item">
        <label class="required">驳回理由</label>
        <ElInput
          v-model="rejectReason"
          type="textarea"
          :rows="4"
          placeholder="请输入驳回理由（必填）"
        />
      </div>
      <p class="tip">驳回后将通知创建人：{{ record.creator }}</p>
    </div>
    <template #footer>
      <ElButton @click="modalApi.close()">取消</ElButton>
      <ElButton type="danger" :loading="loading" @click="handleConfirm">
        确认驳回
      </ElButton>
    </template>
  </Modal>
</template>

<style scoped>
.reject-content {
  padding: 20px 0;
}

.info {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.info p {
  margin: 5px 0;
}

.form-item {
  margin-bottom: 15px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-item label.required::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.tip {
  color: #999;
  font-size: 12px;
  margin-top: 10px;
}
</style>
