<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { ElMessage } from 'element-plus';

import { replenishStockControl } from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/stockControl';
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
      fieldName: 'cardName',
      label: '卡种名称',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'currentStock',
      label: '当前库存',
      component: 'InputNumber',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'num',
      label: '补货数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入补货数量',
        min: 1,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'source',
      label: '补货来源',
      component: 'Select',
      componentProps: {
        placeholder: '请选择补货来源',
        options: [
          { label: '总部仓库', value: '总部仓库' },
          { label: '供应商A', value: '供应商A' },
          { label: '供应商B', value: '供应商B' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  title: '库存补货',
  width: 500,
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    const values = await formApi.getValues();

    try {
      await replenishStockControl({
        id: currentRow.value.id,
        num: values.num,
        source: values.source,
      });
      ElMessage.success('补货成功');
      modalApi.close();
      emit('success');
    } catch (error) {
      console.error('补货失败:', error);
      ElMessage.error('补货失败');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData();
      currentRow.value = data || {};
      await formApi.setValues({
        cardName: data?.cardName || '',
        currentStock: data?.currentStock || 0,
        num: undefined,
        source: undefined,
      });
    }
  },
});

// 暴露open方法供父组件调用
defineExpose({
  open: (row) => {
    modalApi.setData(row);
    modalApi.open();
  },
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
