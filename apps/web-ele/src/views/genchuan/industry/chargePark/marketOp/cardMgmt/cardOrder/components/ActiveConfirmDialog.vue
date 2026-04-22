<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { activeCardOrder } from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/cardOrder';

const emit = defineEmits(['success']);

const currentRow = ref({});

const [Modal, modalApi] = useVbenModal({
  title: '确认激活',
  width: 400,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    try {
      await activeCardOrder({ id: currentRow.value.id });
      ElMessage.success('激活成功，已推送卡激活通知');
      modalApi.close();
      emit('success');
    } catch (error) {
      console.error('激活失败:', error);
      ElMessage.error('激活失败');
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
      <p>确认要激活订单 <strong>{{ currentRow.no }}</strong> 对应的卡种吗？</p>
      <p style="margin-top: 10px; color: #666;">卡种：{{ currentRow.cardName }}</p>
      <p style="margin-top: 10px; color: #666;">用户：{{ currentRow.userName }}</p>
      <p style="margin-top: 10px; color: #f56c6c;">激活后将推送卡激活通知给用户</p>
    </div>
  </Modal>
</template>
