<script setup>
import { ref, computed } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';

import { allocateStockControl } from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/stockControl';
import { useVbenForm } from '#/adapter/form';

const emit = defineEmits(['success']);

const currentRow = ref({});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
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
      fieldName: 'sourceStationId',
      label: '调配来源',
      component: 'Select',
      componentProps: {
        placeholder: '请选择调配来源场站',
        options: [
          { label: '总部仓库', value: 1 },
          { label: 'A场站', value: 2 },
          { label: 'B场站', value: 3 },
          { label: 'C场站', value: 4 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'targetStationId',
      label: '目标场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择目标场站',
        options: [
          { label: 'A场站', value: 2 },
          { label: 'B场站', value: 3 },
          { label: 'C场站', value: 4 },
          { label: 'D场站', value: 5 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'num',
      label: '调配数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入调配数量',
        min: 1,
        precision: 0,
      },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  title: '库存调配',
  onCancel() {
    drawerApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    const values = await formApi.getValues();

    try {
      await allocateStockControl({
        cardId: currentRow.value.cardId,
        sourceStationId: values.sourceStationId,
        targetStationId: values.targetStationId,
        num: values.num,
      });
      ElMessage.success('调配成功');
      drawerApi.close();
      emit('success');
    } catch (error) {
      console.error('调配失败:', error);
      ElMessage.error('调配失败');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData();
      currentRow.value = data || {};
      await formApi.setValues({
        cardName: data?.cardName || '',
        currentStock: data?.currentStock || 0,
        sourceStationId: undefined,
        targetStationId: undefined,
        num: undefined,
      });
    }
  },
});

// 暴露open方法供父组件调用
defineExpose({
  open: (row) => {
    drawerApi.setData(row);
    drawerApi.open();
  },
});
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
