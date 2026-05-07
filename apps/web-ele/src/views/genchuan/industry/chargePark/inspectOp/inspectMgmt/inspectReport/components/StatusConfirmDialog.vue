<script setup>
import { computed, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { WarningFilled } from '@element-plus/icons-vue';
import { ElLoading, ElMessage } from 'element-plus';

import {
  approveInspectReport,
  processInspectReport,
} from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectReport';

const emit = defineEmits(['success']);

const actionType = shallowRef('');
const rowData = shallowRef({});

const actionConfig = {
  approve: {
    title: '确认通过',
    message: (id) => `确定要通过巡检上报 ${id} 吗？通过后将进入待处置状态。`,
    successMessage: '巡检上报已通过',
    loadingMessage: '正在审核巡检上报...',
    api: approveInspectReport,
  },
  execute: {
    title: '确认执行',
    message: (id) => `确定要执行巡检上报 ${id} 吗？执行后将进入待处置状态。`,
    successMessage: '巡检上报已执行',
    loadingMessage: '正在执行巡检上报...',
    api: processInspectReport,
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
    await currentAction.value.api({
      id: rowData.value.id,
      // auditRemark: '情况属实，安排处置',
    });
    ElMessage.success(currentAction.value.successMessage);
    emit('success');
    modalApi.close();
  } catch (error) {
    console.error('巡检上报状态操作失败:', error);
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
      <div class="confirm-tip">确认后将刷新巡检上报列表。</div>
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
