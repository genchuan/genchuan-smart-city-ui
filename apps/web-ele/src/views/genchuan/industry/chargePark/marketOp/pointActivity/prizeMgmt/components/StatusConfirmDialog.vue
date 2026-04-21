<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import {
  disablePrizeMgmt,
  enablePrizeMgmt,
} from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/prizeMgmt';

const emit = defineEmits(['success']);

const [Modal, modalApi] = useVbenModal({
  width: 400,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    handleConfirm();
  },
});

const rowData = ref(null);
const actionType = ref(''); // 'enable' 或 'disable'
const loading = ref(false);

// 打开弹窗
const open = (row, type) => {
  rowData.value = row;
  actionType.value = type;
  modalApi.setState({
    title: type === 'enable' ? '启用确认' : '禁用确认',
  });
  modalApi.open();
};

// 确认操作
const handleConfirm = async () => {
  if (!rowData.value) return;

  loading.value = true;
  try {
    if (actionType.value === 'enable') {
      await enablePrizeMgmt({ id: rowData.value.id });
      ElMessage.success('启用成功');
    } else {
      await disablePrizeMgmt({ id: rowData.value.id });
      ElMessage.success('禁用成功');
    }
    emit('success');
    modalApi.close();
  } catch (error) {
    console.error(error);
    ElMessage.error(actionType.value === 'enable' ? '启用失败' : '禁用失败');
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
    <div class="confirm-container">
      <div class="confirm-icon">
        <el-icon :size="48" :color="actionType === 'enable' ? '#67C23A' : '#E6A23C'">
          <WarningFilled />
        </el-icon>
      </div>
      <div class="confirm-title">
        {{ actionType === 'enable' ? '确认启用该奖品？' : '确认禁用该奖品？' }}
      </div>
      <div class="confirm-content">
        <template v-if="actionType === 'enable'">
          <p>启用后，该奖品将恢复正常发放状态</p>
          <p class="prize-name">奖品名称：{{ rowData?.name }}</p>
        </template>
        <template v-else>
          <p>禁用后，该奖品将暂停发放</p>
          <p class="prize-name">奖品名称：{{ rowData?.name }}</p>
        </template>
      </div>
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
}

.confirm-title {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.confirm-content {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.confirm-content p {
  margin: 8px 0;
}

.prize-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}
</style>
