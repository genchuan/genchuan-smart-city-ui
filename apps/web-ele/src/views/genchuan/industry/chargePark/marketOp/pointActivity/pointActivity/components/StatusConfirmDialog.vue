<script setup>
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElLoading, ElMessage } from 'element-plus';

import {
  activatePointActivity,
  enablePointActivity,
  pausePointActivity,
} from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/pointActivity';

const emit = defineEmits(['success']);

// 操作类型：activate-生效, pause-暂停, enable-启用
const actionType = ref('');
const rowData = ref({});

const actionConfig = {
  activate: {
    title: '确认生效',
    message: (name) =>
      `确定要将活动 "${name}" 生效吗？生效后活动状态将变为"进行中"。`,
    successMessage: '活动生效成功',
    loadingMessage: '正在生效活动...',
    api: activatePointActivity,
  },
  pause: {
    title: '确认暂停',
    message: (name) => `确定要暂停活动 "${name}" 吗？暂停后将无法参与该活动。`,
    successMessage: '活动暂停成功',
    loadingMessage: '正在暂停活动...',
    api: pausePointActivity,
  },
  enable: {
    title: '确认启用',
    message: (name) =>
      `确定要启用活动 "${name}" 吗？启用后活动状态将变为"进行中"。`,
    successMessage: '活动启用成功',
    loadingMessage: '正在启用活动...',
    api: enablePointActivity,
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
    // 将id转换为数字类型
    await currentAction.value.api({ id: Number(rowData.value.id) });
    ElMessage.success(currentAction.value.successMessage);
    emit('success');
    modalApi.close();
  } catch (error) {
    console.error('操作失败:', error);
    const errorMsg = error?.msg || error?.message || '操作失败，请稍后重试';
    ElMessage.error(errorMsg);
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
