<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import { payExchangeOrder } from '#/api/genchuan/industry/chargePark/marketOp/exchangeMgmt/exchangeOrder';

const emit = defineEmits(['success']);

const record = ref({});
const loading = ref(false);

const [Modal, modalApi] = useVbenModal({
  title: '支付确认',
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
  modalApi.open();
};

// 处理确认
const handleConfirm = async () => {
  try {
    loading.value = true;
    const response = await payExchangeOrder({ id: record.value.id });

    console.log('Pay response:', response);

    // 判断成功：code为0或200，或者data为true
    const isSuccess =
      response &&
      (response.code === 0 ||
        response.code === 200 ||
        response.data === true ||
        response === true);

    if (isSuccess) {
      ElMessage.success('支付成功');
      modalApi.close();
      emit('success');
    } else {
      const errorMsg = response?.msg || response?.message || '支付失败';
      ElMessage.error(errorMsg);
    }
  } catch (error) {
    console.error('支付失败:', error);
    // 如果报错但包含成功信息，也认为是成功
    if (
      error?.response?.data?.code === 0 ||
      error?.response?.data?.code === 200
    ) {
      ElMessage.success('支付成功');
      modalApi.close();
      emit('success');
    } else {
      ElMessage.error(error?.message || '支付失败');
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
    <div class="pay-confirm-content">
      <p class="confirm-message">确定要支付订单 "{{ record.no }}" 吗？</p>
      <p class="tip">确认后将完成支付操作，订单状态将变为"已支付"</p>
    </div>
    <template #footer>
      <ElButton @click="modalApi.close()">取消</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleConfirm">
        确认支付
      </ElButton>
    </template>
  </Modal>
</template>

<style scoped>
.pay-confirm-content {
  padding: 20px 0;
  text-align: center;
}

.confirm-message {
  margin-bottom: 10px;
  font-size: 14px;
  color: #303133;
}

.tip {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}
</style>
