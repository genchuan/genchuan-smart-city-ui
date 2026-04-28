<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { payCardOrder } from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/cardOrder';

const emit = defineEmits(['success']);

const currentRow = ref({});

const [Modal, modalApi] = useVbenModal({
  title: '确认支付',
  width: 400,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    try {
      await payCardOrder({ id: currentRow.value.id });
      ElMessage.success('支付成功');
      modalApi.close();
      emit('success');
    } catch (error) {
      console.error('支付失败:', error);
      ElMessage.error('支付失败');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData();
      currentRow.value = data || {};
    }
  },
});

function open(data) {
  modalApi.setData(data);
  modalApi.open();
}

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div style="padding: 20px;">
      <p>确认要完成订单 <strong>{{ currentRow.no }}</strong> 的支付操作吗？</p>
      <p style="margin-top: 10px; color: #666;">订单金额：¥{{ currentRow.amount?.toFixed(2) }}</p>
      <p style="margin-top: 10px; color: #666;">用户：{{ currentRow.userName }}</p>
    </div>
  </Modal>
</template>
