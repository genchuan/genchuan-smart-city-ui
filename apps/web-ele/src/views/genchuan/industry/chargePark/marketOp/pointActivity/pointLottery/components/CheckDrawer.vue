<script setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { checkPointLottery } from '#/api/genchuan/industry/chargePark/marketOp/pointActivity/pointLottery';

const emit = defineEmits(['success']);

const rowData = ref({});

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
      fieldName: 'id',
      label: '记录ID',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'no',
      label: '抽奖记录编号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'userName',
      label: '用户名称',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'prizeName',
      label: '奖品名称',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'checkResult',
      label: '核查结果',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入核查结果',
        rows: 4,
      },
      rules: 'required',
    },
    {
      fieldName: 'handleOpinion',
      label: '处理意见',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入处理意见',
        rows: 4,
      },
    },
  ],
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '核查抽奖记录',
  onCancel() {
    drawerApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const values = await formApi.getValues();
    try {
      await checkPointLottery({
        id: rowData.value.id,
        checkResult: values.checkResult,
        handleOpinion: values.handleOpinion,
      });
      ElMessage.success('核查成功');
      emit('success');
      drawerApi.close();
    } catch (error) {
      console.error(error);
      ElMessage.error('核查失败');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      rowData.value = drawerApi.getData();
      await formApi.setValues({
        id: rowData.value.id,
        no: rowData.value.no,
        userName: rowData.value.userName,
        prizeName: rowData.value.prizeName,
        checkResult: '',
        handleOpinion: '',
      });
    }
  },
});

const open = (row) => {
  drawerApi.setData(row).open();
};

defineExpose({
  open,
});
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
