<script setup>
import { ref, computed } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { ElMessage } from 'element-plus';

import { warnStockControl } from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/stockControl';

const emit = defineEmits(['success']);

const currentRow = ref({});
const warnContent = ref('库存不足，请及时补货');

const cardInfoText = computed(() => {
  if (currentRow.value.cardName) {
    return `卡种：${currentRow.value.cardName}，当前库存：${currentRow.value.currentStock}，预警阈值：${currentRow.value.warnThreshold}`;
  }
  return '';
});

const [Modal, modalApi] = useVbenModal({
  title: '库存预警确认',
  width: 450,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    try {
      await warnStockControl({
        id: currentRow.value.id,
        warnContent: warnContent.value,
      });
      ElMessage.success('告警推送成功');
      modalApi.close();
      emit('success');
    } catch (error) {
      console.error('告警失败:', error);
      ElMessage.error('告警推送失败');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData();
      currentRow.value = data || {};
      warnContent.value = '库存不足，请及时补货';
    }
  },
});

// 暴露open方法供父组件调用
defineExpose({
  open: (row) => {
    modalApi.setData(row);
    modalApi.open();
  },
});
</script>

<template>
  <Modal>
    <div class="warn-confirm-content">
      <div class="warn-icon-wrapper">
        <el-icon class="warn-icon" :size="48" color="#E6A23C">
          <WarningFilled />
        </el-icon>
      </div>
      <div class="warn-message">
        <p class="warn-title">确认推送库存预警通知？</p>
        <p class="warn-info">{{ cardInfoText }}</p>
        <p class="warn-desc">确认后将推送库存预警通知至相关负责人，触发库存告警流程。</p>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.warn-confirm-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;
}

.warn-icon-wrapper {
  margin-bottom: 16px;
}

.warn-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.warn-message {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.warn-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.warn-info {
  font-size: 14px;
  color: #606266;
  margin: 0;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.warn-desc {
  font-size: 13px;
  color: #909399;
  margin: 0;
  margin-top: 8px;
}
</style>
