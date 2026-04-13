<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { completeOrderAlarm } from '#/api/genchuan/industry/energyCharging/carCharging/faultAlarm/orderAlarm';

const emit = defineEmits(['success']);

const selectedIds = ref([]);

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    modalApi.lock();
    try {
      await completeOrderAlarm({
        ids: selectedIds.value,
      });
      ElMessage.success('完结成功');
      modalApi.close();
      emit('success');
    } catch (error) {
      console.error(error);
      ElMessage.error('完结失败');
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      selectedIds.value = [];
      return;
    }
    const data = modalApi.getData();
    if (data?.ids) {
      selectedIds.value = data.ids;
    }
  },
});

defineExpose({
  open: (ids) => {
    modalApi.setData({ ids });
    modalApi.open();
  },
});
</script>

<template>
  <Modal title="完结告警">
    <div class="py-4 text-center text-gray-600">
      <p class="mb-2">
        已选择 <span class="font-bold text-primary">{{ selectedIds.length }}</span> 条处理中告警
      </p>
      <p>确定要将这些告警标记为已完结吗？</p>
    </div>
  </Modal>
</template>
