<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage, ElInput } from 'element-plus';

import { cancelExchangeOrder } from '#/api/genchuan/industry/chargePark/marketOp/exchangeMgmt/exchangeOrder';

const emit = defineEmits(['success']);

const record = ref({});
const loading = ref(false);
const cancelReason = ref('用户主动取消订单');

const [Modal, modalApi] = useVbenModal({
  title: '取消订单确认',
  width: 400,
  centered: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    handleConfirm();
  },
});

// 打开弹窗
const open = (row) => {
  record.value = row;
  cancelReason.value = '用户主动取消订单';
  modalApi.open();
};

// 处理确认
const handleConfirm = async () => {
  try {
    loading.value = true;
    const response = await cancelExchangeOrder({
      id: record.value.id,
      cancelReason: cancelReason.value,
    });

    console.log('Cancel response:', response);

    // 判断成功：code为0或200，或者data为true
    const isSuccess = response && (
      response.code === 0 ||
      response.code === 200 ||
      response.data === true ||
      response === true
    );

    if (isSuccess) {
      ElMessage.success('取消成功');
      modalApi.close();
      emit('success');
    } else {
      const errorMsg = response?.msg || response?.message || '取消失败';
      ElMessage.error(errorMsg);
    }
  } catch (error) {
    console.error('取消失败:', error);
    // 如果报错但包含成功信息，也认为是成功
    if (error?.response?.data?.code === 0 || error?.response?.data?.code === 200) {
      ElMessage.success('取消成功');
      modalApi.close();
      emit('success');
    } else {
      ElMessage.error(error?.message || '取消失败');
    }
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
    <div class="cancel-confirm-content">
      <p class="confirm-message">确定要取消订单 "{{ record.no }}" 吗？</p>
      <div class="cancel-reason">
        <label>取消原因：</label>
        <ElInput
          v-model="cancelReason"
          type="textarea"
          :rows="3"
          placeholder="请输入取消原因"
        />
      </div>
      <p class="tip">确认后将取消订单，并返还用户消耗的积分</p>
    </div>
    <template #footer>
      <ElButton @click="modalApi.close()">取消</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleConfirm">
        确认取消
      </ElButton>
    </template>
  </Modal>
</template>

<style scoped>
.cancel-confirm-content {
  padding: 20px 0;
}

.confirm-message {
  font-size: 14px;
  color: #303133;
  margin-bottom: 16px;
  text-align: center;
}

.cancel-reason {
  margin-bottom: 16px;
}

.cancel-reason label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.tip {
  font-size: 12px;
  color: #909399;
  text-align: center;
}
</style>
