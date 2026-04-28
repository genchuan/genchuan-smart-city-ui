<script setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { checkReceiveRecord } from '#/api/genchuan/industry/chargePark/marketOp/couponActivity/receiveRecord';
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
      fieldName: 'no',
      label: '记录编号',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '记录编号',
      },
    },
    {
      fieldName: 'userName',
      label: '用户名称',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '用户名称',
      },
    },
    {
      fieldName: 'couponName',
      label: '优惠券名称',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '优惠券名称',
      },
    },
    {
      fieldName: 'checkResult',
      label: '核查结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择核查结果',
        options: [
          { label: '核查通过', value: '核查通过' },
          { label: '核查不通过', value: '核查不通过' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'processingOpinion',
      label: '处理意见',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入处理意见',
        rows: 4,
        maxlength: 500,
        showWordLimit: true,
      },
    },
  ],
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  title: '核查记录',
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
      await checkReceiveRecord({
        id: currentRow.value.id,
        checkResult: values.checkResult,
        processingOpinion: values.processingOpinion,
      });
      ElMessage.success('核查成功');
      drawerApi.close();
      emit('success');
    } catch (error) {
      console.error('核查失败:', error);
      ElMessage.error('核查失败');
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData();
      currentRow.value = data || {};
      await formApi.setValues({
        no: currentRow.value.no || '',
        userName: currentRow.value.userName || '',
        couponName: currentRow.value.couponName || '',
        checkResult: '',
        processingOpinion: '',
      });
    } else {
      formApi.resetForm();
    }
  },
});

/** 打开抽屉 */
function open(data) {
  drawerApi.open();
  drawerApi.setData(data);
}

defineExpose({
  open,
});
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
