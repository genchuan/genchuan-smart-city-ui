<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { cancelCardOrder } from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/cardOrder';
import { useVbenForm } from '#/adapter/form';

const emit = defineEmits(['success']);

const currentRow = ref({});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'cancelReason',
      label: '取消原因',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入取消原因',
        rows: 3,
        maxlength: 200,
        showWordLimit: true,
      },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  title: '确认取消订单',
  width: 400,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const values = await formApi.getValues();
    try {
      await cancelCardOrder({
        id: currentRow.value.id,
        cancelReason: values.cancelReason,
      });
      ElMessage.success('订单已取消');
      modalApi.close();
      formApi.resetForm();
      emit('success');
    } catch (error) {
      console.error('取消订单失败:', error);
      ElMessage.error('取消订单失败');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData();
      currentRow.value = data || {};
      formApi.resetForm();
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
      <p>确认要取消订单 <strong>{{ currentRow.no }}</strong> 吗？</p>
      <p style="margin-top: 10px; color: #666;">订单金额：¥{{ currentRow.amount?.toFixed(2) }}</p>
      <p style="margin-top: 10px; color: #f56c6c;">取消后订单状态将变为已取消，不可恢复</p>
      <div style="margin-top: 20px;">
        <Form />
      </div>
    </div>
  </Modal>
</template>
