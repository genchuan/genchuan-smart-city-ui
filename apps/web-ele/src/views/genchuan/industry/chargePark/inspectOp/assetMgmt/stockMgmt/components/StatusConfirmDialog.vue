<script setup>
import { computed, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { WarningFilled } from '@element-plus/icons-vue';
import { ElLoading, ElMessage } from 'element-plus';

import { alarmAssetStock } from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/stockMgmt';

const emit = defineEmits(['success']);

const rowData = shallowRef({});

const title = computed(() => '确认告警');
const message = computed(
  () =>
    `确定要向运维人员推送“${rowData.value.assetName || '库存'}”的库存预警消息吗？`,
);

const [Modal, modalApi] = useVbenModal({
  title,
  width: 430,
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

  const loadingInstance = ElLoading.service({
    text: '正在推送库存告警...',
  });

  try {
    await alarmAssetStock({ id: rowData.value.id, status: rowData.value.status });
    ElMessage.success('库存告警推送成功');
    emit('success');
    modalApi.close();
  } catch (error) {
    console.error('库存告警操作失败:', error);
    ElMessage.error('操作失败，请稍后重试');
  } finally {
    loadingInstance.close();
  }
}

function open(row) {
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
      <div class="confirm-message">{{ message }}</div>
      <div class="confirm-tip">确认后将刷新库存管理列表。</div>
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
