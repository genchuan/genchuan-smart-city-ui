<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { invoiceCardOrder } from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/cardOrder';
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
      fieldName: 'title',
      label: '发票抬头',
      component: 'Input',
      componentProps: {
        placeholder: '请输入发票抬头',
      },
      rules: 'required',
    },
    {
      fieldName: 'taxNo',
      label: '税号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入税号',
      },
      rules: 'required',
    },
    {
      fieldName: 'email',
      label: '邮箱',
      component: 'Input',
      componentProps: {
        placeholder: '请输入接收发票的邮箱',
      },
      rules: 'required|email',
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  title: '开具发票',
  width: 500,
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
      const invoiceInfo = JSON.stringify({
        title: values.title,
        taxNo: values.taxNo,
        email: values.email,
      });
      await invoiceCardOrder({
        id: currentRow.value.id,
        invoiceInfo,
      });
      ElMessage.success('开票成功，发票凭证已推送至用户邮箱');
      modalApi.close();
      formApi.resetForm();
      emit('success');
    } catch (error) {
      console.error('开票失败:', error);
      ElMessage.error('开票失败');
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
      <p style="margin-bottom: 20px;">为订单 <strong>{{ currentRow.no }}</strong> 开具发票</p>
      <p style="margin-bottom: 20px; color: #666;">订单金额：¥{{ currentRow.amount?.toFixed(2) }}</p>
      <Form />
    </div>
  </Modal>
</template>
