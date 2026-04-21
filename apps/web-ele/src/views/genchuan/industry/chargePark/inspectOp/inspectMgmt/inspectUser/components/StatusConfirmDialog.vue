<script setup>
import { computed, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { WarningFilled } from '@element-plus/icons-vue';
import { ElLoading, ElMessage } from 'element-plus';

import {
  disableInspectUser,
  enableInspectUser,
} from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectUser';

const emit = defineEmits(['success']);

const actionType = shallowRef('');
const rowData = shallowRef({});

const actionConfig = {
  disable: {
    title: '确认禁用',
    message: (name) =>
      `确定要禁用巡检人员“${name}”吗？禁用后该人员无法接收巡检任务。`,
    successMessage: '巡检人员禁用成功',
    loadingMessage: '正在禁用巡检人员...',
    api: disableInspectUser,
  },
  enable: {
    title: '确认启用',
    message: (name) =>
      `确定要启用巡检人员“${name}”吗？启用后将恢复任务派发权限。`,
    successMessage: '巡检人员启用成功',
    loadingMessage: '正在启用巡检人员...',
    api: enableInspectUser,
  },
};

const currentAction = computed(() => actionConfig[actionType.value] || {});

const [Modal, modalApi] = useVbenModal({
  title: computed(() => currentAction.value.title || '确认操作'),
  width: 420,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    await handleConfirm();
  },
});

async function handleConfirm() {
  if (!actionType.value || !rowData.value?.id) {
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
    console.error('巡检人员状态操作失败:', error);
    ElMessage.error('操作失败，请稍后重试');
  } finally {
    loadingInstance.close();
  }
}

function open(type, row) {
  actionType.value = type;
  rowData.value = row || {};
  modalApi.open();
}

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div class="confirm-container">
      <div class="confirm-icon">
        <el-icon><WarningFilled /></el-icon>
      </div>
      <div class="confirm-message">
        {{ currentAction.message ? currentAction.message(rowData.name) : '' }}
      </div>
      <div class="confirm-tip">确认后将刷新巡检人员列表。</div>
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
  font-size: 44px;
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
