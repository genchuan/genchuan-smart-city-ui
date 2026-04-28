<script setup>
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElLoading, ElMessage } from 'element-plus';

import {
  activateActivityConfig,
  disableActivityConfig,
} from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/activityConfig';

const emit = defineEmits(['success']);

// 操作类型：activate-生效, disable-禁用
const actionType = ref('');
const rowData = ref({});

const actionConfig = {
  activate: {
    title: '确认生效',
    message: (name) =>
      `确定要将活动 "${name}" 生效吗？生效后该优惠活动将启用。`,
    successMessage: '生效成功',
    loadingMessage: '正在生效...',
    api: activateActivityConfig,
  },
  disable: {
    title: '确认禁用',
    message: (name) => `确定要禁用活动 "${name}" 吗？禁用后该优惠活动将停用。`,
    successMessage: '禁用成功',
    loadingMessage: '正在禁用...',
    api: disableActivityConfig,
  },
};

const currentAction = computed(() => actionConfig[actionType.value] || {});

const [Modal, modalApi] = useVbenModal({
  title: computed(() => currentAction.value.title || '确认操作'),
  width: 400,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    await handleConfirm();
  },
});

const handleConfirm = async () => {
  if (!actionType.value || !rowData.value.id) {
    ElMessage.warning('操作参数错误');
    return;
  }

  const loadingInstance = ElLoading.service({
    text: currentAction.value.loadingMessage,
  });

  try {
    await currentAction.value.api({ id: rowData.value.id });
    ElMessage.success(currentAction.value.successMessage);
    emit('success');
    modalApi.close();
  } catch (error) {
    console.error('操作失败:', error);
    ElMessage.error('操作失败，请稍后重试');
  } finally {
    loadingInstance.close();
  }
};

const open = (type, row) => {
  actionType.value = type;
  rowData.value = row;
  modalApi.open();
};

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div class="confirm-container">
      <div class="confirm-icon">
        <i class="el-icon-warning-outline"></i>
      </div>
      <div class="confirm-message">
        {{ currentAction.message ? currentAction.message(rowData.name) : '' }}
      </div>
      <div class="confirm-tip">此操作不可撤销，请谨慎操作。</div>
    </div>
  </Modal>
</template>

<style scoped>
.confirm-container {
  padding: 20px;
  text-align: center;
}

.confirm-icon {
  margin-bottom: 16px;
  font-size: 48px;
  color: var(--el-color-warning);
}

.confirm-message {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-primary);
}

.confirm-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
