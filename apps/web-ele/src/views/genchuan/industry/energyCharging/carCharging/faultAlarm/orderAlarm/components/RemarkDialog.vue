<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { updateOrderAlarmRemark } from '#/api/genchuan/industry/energyCharging/carCharging/faultAlarm/orderAlarm';

const emit = defineEmits(['success']);

const selectedId = ref(null);
const currentRemark = ref('');

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
      fieldName: 'remark',
      label: '备注内容',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注内容',
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
      await updateOrderAlarmRemark({
        id: selectedId.value,
        remark: values.remark,
      });
      ElMessage.success('备注更新成功');
      modalApi.close();
      emit('success');
    } catch (error) {
      console.error(error);
      ElMessage.error('备注更新失败');
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      selectedId.value = null;
      currentRemark.value = '';
      formApi.resetForm();
      return;
    }
    const data = modalApi.getData();
    if (data?.id) {
      selectedId.value = data.id;
      currentRemark.value = data.remark || '';
      await formApi.setValues({ remark: data.remark || '' });
    }
  },
});

defineExpose({
  open: (id, remark) => {
    modalApi.setData({ id, remark });
    modalApi.open();
  },
});
</script>

<template>
  <Modal title="添加备注">
    <Form />
  </Modal>
</template>
