<script setup>
import { ref, computed, onMounted } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';

import { allocateStockControl } from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/stockControl';
import { getStationSimpleList } from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/pointActivity';
import { useVbenForm } from '#/adapter/form';

const emit = defineEmits(['success']);

const currentRow = ref({});
const stationOptions = ref([]);

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
        options: stationOptions,
        clearable: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'targetStationId',
      label: '目标场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择目标场站',
        options: stationOptions,
        clearable: true,
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

const fetchStationList = async () => {
  try {
    const response = await getStationSimpleList();
    if (response && Array.isArray(response)) {
      stationOptions.value = response.map((station) => ({
        label: station.name || station.stationName,
        value: station.id,
      }));
    }
  } catch (error) {
    console.error('获取场站列表失败:', error);
    stationOptions.value = [];
  }
};

onMounted(() => {
  fetchStationList();
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
      await formApi.resetForm();
      await formApi.setValues({
        cardName: data?.cardName || '',
        currentStock: data?.currentStock || 0,
      });
    }
  },
});

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
