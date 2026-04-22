<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { activateCardConfig } from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/cardConfig';

const emit = defineEmits(['success']);

const currentRow = ref({});

const [Modal, modalApi] = useVbenModal({
  title: '确认生效',
  width: 400,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    try {
      await activateCardConfig({ id: currentRow.value.id });
      ElMessage.success('生效成功，已启用该卡种售卖');
      modalApi.close();
      emit('success');
    } catch (error) {
      console.error('生效失败:', error);
      ElMessage.error('生效失败');
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
      <p>确认要使卡种配置 <strong>{{ currentRow.name }}</strong> 生效吗？</p>
      <p style="margin-top: 10px; color: #666;">卡种类型：{{ currentRow.typeName }}</p>
      <p style="margin-top: 10px; color: #666;">价格：¥{{ currentRow.price?.toFixed(2) }}</p>
      <p style="margin-top: 10px; color: #67c23a;">生效后将启用该卡种售卖</p>
    </div>
  </Modal>
</template>
