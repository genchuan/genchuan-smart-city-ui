<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { disableCardConfig } from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/cardConfig';

const emit = defineEmits(['success']);

const currentRow = ref({});

const [Modal, modalApi] = useVbenModal({
  title: '确认禁用',
  width: 400,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    try {
      await disableCardConfig({ id: currentRow.value.id });
      ElMessage.success('禁用成功，已停用该卡种售卖');
      modalApi.close();
      emit('success');
    } catch (error) {
      console.error('禁用失败:', error);
      ElMessage.error('禁用失败');
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
      <p>确认要禁用卡种配置 <strong>{{ currentRow.name }}</strong> 吗？</p>
      <p style="margin-top: 10px; color: #666;">卡种类型：{{ currentRow.typeName }}</p>
      <p style="margin-top: 10px; color: #666;">价格：¥{{ currentRow.price?.toFixed(2) }}</p>
      <p style="margin-top: 10px; color: #f56c6c;">禁用后将停用该卡种售卖，配置状态将变为未生效</p>
    </div>
  </Modal>
</template>
