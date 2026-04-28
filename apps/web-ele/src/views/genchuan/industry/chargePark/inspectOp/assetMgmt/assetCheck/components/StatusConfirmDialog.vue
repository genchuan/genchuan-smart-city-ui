<script setup>
import { computed, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { WarningFilled } from '@element-plus/icons-vue';
import { ElLoading, ElMessage } from 'element-plus';

import {
  confirmAssetCheck,
  executeAssetCheck,
} from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/assetCheck';

const emit = defineEmits(['success']);

const actionType = shallowRef('');
const rowData = shallowRef({});

const actionConfig = {
  execute: {
    title: '确认执行',
    message: (id) => `确定要执行盘点单“${id}”吗？确认后将推送盘点任务。`,
    successMessage: '资产盘点执行成功',
    loadingMessage: '正在执行资产盘点...',
    api: executeAssetCheck,
  },
  confirm: {
    title: '确认结果',
    message: (id) =>
      `确定要确认盘点单“${id}”的盘点结果吗？确认后将同步盘点记录。`,
    successMessage: '资产盘点结果确认成功',
    loadingMessage: '正在确认盘点结果...',
    api: confirmAssetCheck,
  },
};

const currentAction = computed(() => actionConfig[actionType.value] || {});

const [Modal, modalApi] = useVbenModal({
  title: computed(() => currentAction.value.title || '确认操作'),
  width: 430,
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
    console.error('资产盘点状态操作失败:', error);
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
        {{ currentAction.message ? currentAction.message(rowData.id) : '' }}
      </div>
      <div class="confirm-tip">确认后将刷新资产盘点列表。</div>
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
