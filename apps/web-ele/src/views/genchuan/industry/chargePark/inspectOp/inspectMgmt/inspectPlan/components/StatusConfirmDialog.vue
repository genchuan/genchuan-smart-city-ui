<script setup>
import { computed, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { WarningFilled } from '@element-plus/icons-vue';
import { ElLoading, ElMessage } from 'element-plus';

import {
  enableInspectPlan,
  pauseInspectPlan,
} from '#/api/genchuan/industry/chargePark/inspectOp/inspectMgmt/inspectPlan';

const emit = defineEmits(['success']);

const actionType = shallowRef('');
const rowData = shallowRef({});

const actionConfig = {
  activate: {
    title: '确认生效',
    message: (name) =>
      `确定要将巡检计划“${name}”生效吗？生效后将自动生成对应巡检任务。`,
    successMessage: '巡检计划生效成功',
    loadingMessage: '正在生效巡检计划...',
    api: enableInspectPlan,
  },
  pause: {
    title: '确认暂停',
    message: (name) =>
      `确定要暂停巡检计划“${name}”吗？暂停后将停止生成后续巡检任务。`,
    successMessage: '巡检计划暂停成功',
    loadingMessage: '正在暂停巡检计划...',
    api: pauseInspectPlan,
  },
  enable: {
    title: '确认启用',
    message: (name) => `确定要启用巡检计划“${name}”吗？启用后将恢复任务生成。`,
    successMessage: '巡检计划启用成功',
    loadingMessage: '正在启用巡检计划...',
    api: enableInspectPlan,
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
    console.error('巡检计划状态操作失败:', error);
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
      <div class="confirm-tip">确认后将刷新巡检计划列表。</div>
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
