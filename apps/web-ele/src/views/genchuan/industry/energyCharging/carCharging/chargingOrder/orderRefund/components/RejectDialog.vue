<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { rejectOrderRefund } from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/orderRefund';

const emit = defineEmits(['success']);

const selectedId = ref(null);

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
      fieldName: 'rejectReason',
      label: '驳回原因',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入驳回原因（必填）',
        rows: 6,
      },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const values = await formApi.getValues();
    modalApi.lock();
    try {
      await rejectOrderRefund({
        id: selectedId.value,
        rejectReason: values.rejectReason,
      });
      ElMessage.success('驳回成功');
      modalApi.close();
      emit('success');
    } catch (error) {
      console.error(error);
      ElMessage.error('驳回失败');
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      selectedId.value = null;
      formApi.resetForm();
      return;
    }
    const data = modalApi.getData();
    if (data?.id) {
      selectedId.value = data.id;
    }
  },
});

defineExpose({
  open: (id) => {
    modalApi.setData({ id });
    modalApi.open();
  },
});
</script>

<template>
  <Modal title="驳回退款申请">
    <div class="mb-4 text-gray-600">
      确定要驳回该退款申请吗？请填写驳回原因。
    </div>
    <Form />
  </Modal>
</template>
