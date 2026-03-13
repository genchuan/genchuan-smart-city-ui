<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import { updateCategory } from '#/api/genchuan/dataHub/basicData/monitorEvent';

const emit = defineEmits(['success']);

const [Modal, modalApi] = useVbenModal({
  title: '提交审核',
  width: 400,
  centered: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    handleConfirm();
  },
});

const record = ref({});
const loading = ref(false);

const open = (row) => {
  record.value = row;
  modalApi.open();
};

// 处理提交
const handleConfirm = async () => {
  try {
    loading.value = true;
    await updateCategory({
      ...record.value,
      auditStatus: '0', // 待审核
    });
    ElMessage.success('提交审核成功');
    modalApi.close();
    emit('success');
  } catch (error) {
    console.error('提交审核失败:', error);
    ElMessage.error('提交审核失败');
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
    <div class="submit-audit-content">
      <p>确定要将分类 "{{ record.categoryName }}" 提交审核吗？</p>
      <p class="tip">提交后审核状态将变为"待审核"</p>
    </div>
    <template #footer>
      <ElButton @click="modalApi.close()">取消</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleConfirm">
        确认
      </ElButton>
    </template>
  </Modal>
</template>

<style scoped>
.submit-audit-content {
  padding: 20px 0;
  text-align: center;
}

.tip {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}
</style>
