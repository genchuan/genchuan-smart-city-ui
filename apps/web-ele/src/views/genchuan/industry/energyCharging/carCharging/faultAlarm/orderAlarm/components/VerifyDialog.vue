<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { ElMessage, ElRadioGroup } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { verifyOrderAlarm } from '#/api/genchuan/industry/energyCharging/carCharging/faultAlarm/orderAlarm';

const emit = defineEmits(['success']);

const selectedIds = ref([]);

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
      fieldName: 'verifyResult',
      label: '核实结果',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.ORDER_ALARM_VERIFY_RESULT, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注说明',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注说明',
        rows: 4,
      },
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
      await verifyOrderAlarm({
        ids: selectedIds.value,
        verifyResult: values.verifyResult,
        remark: values.remark,
      });
      ElMessage.success('核实成功');
      modalApi.close();
      emit('success');
    } catch (error) {
      console.error(error);
      ElMessage.error('核实失败');
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      selectedIds.value = [];
      formApi.resetForm();
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
  <Modal title="核实告警">
    <div class="mb-4 text-gray-600">
      已选择 <span class="font-bold text-primary">{{ selectedIds.length }}</span> 条待核实告警
    </div>
    <Form />
  </Modal>
</template>
