<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

import { shipExchangeOrder } from '#/api/genchuan/industry/chargePark/marketOp/exchangeMgmt/exchangeOrder';
import { useVbenForm } from '#/adapter/form';

const emit = defineEmits(['success']);

const record = ref({});
const loading = ref(false);

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
      fieldName: 'logisticsCompany',
      label: '物流公司',
      component: 'Select',
      componentProps: {
        placeholder: '请选择物流公司',
        options: [
          { label: '顺丰快递', value: '顺丰快递' },
          { label: '圆通快递', value: '圆通快递' },
          { label: '中通快递', value: '中通快递' },
          { label: '申通快递', value: '申通快递' },
          { label: '韵达快递', value: '韵达快递' },
          { label: 'EMS', value: 'EMS' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'trackingNo',
      label: '物流单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入物流单号',
      },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  title: '发货',
  width: 500,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    const values = await formApi.getValues();

    try {
      loading.value = true;
      const logisticsInfo = `${values.logisticsCompany}：${values.trackingNo}`;
      const response = await shipExchangeOrder({
        id: record.value.id,
        logisticsInfo,
      });

      if (response && response.code === 200) {
        ElMessage.success('发货成功');
        modalApi.close();
        emit('success');
      } else {
        ElMessage.error(response?.message || '发货失败');
      }
    } catch (error) {
      console.error('发货失败:', error);
      ElMessage.error(error?.message || '发货失败');
    } finally {
      loading.value = false;
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData();
      record.value = data || {};
      await formApi.resetForm();
    }
  },
});

// 打开弹窗
const open = (row) => {
  modalApi.open(row);
};

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
