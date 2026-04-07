<script setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { reapplyOrderRefund } from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/orderRefund';

const emit = defineEmits(['success']);

const selectedId = ref(null);
const originalData = ref({});

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
      fieldName: 'refundAmount',
      label: '退款金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入退款金额',
        min: 0,
        precision: 2,
        controlsPosition: 'right',
      },
      rules: 'required',
    },
    {
      fieldName: 'refundReason',
      label: '退款原因',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入退款原因',
        rows: 4,
      },
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const values = await formApi.getValues();
    try {
      await reapplyOrderRefund({
        id: selectedId.value,
        refundAmount: values.refundAmount,
        refundReason: values.refundReason,
      });
      ElMessage.success('重新申请成功');
      drawerApi.close();
      emit('success');
    } catch (error) {
      console.error(error);
      ElMessage.error('重新申请失败');
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      selectedId.value = null;
      originalData.value = {};
      formApi.resetForm();
      return;
    }
    const data = drawerApi.getData();
    if (data?.id) {
      selectedId.value = data.id;
      originalData.value = data || {};
      // 复用原信息填充表单
      await formApi.setValues({
        refundAmount: data.refundAmount || '',
        refundReason: data.refundReason || '',
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
  <Drawer title="重新申请退款" width="500px">
    <div class="mb-4 p-4 bg-gray-50 rounded">
      <div class="text-sm text-gray-600 mb-2">原申请信息：</div>
      <div class="text-sm">
        <div>退款编号：{{ originalData.refundCode }}</div>
        <div>关联订单：{{ originalData.orderCode }}</div>
        <div>用户ID：{{ originalData.userId }}</div>
        <div>车牌号：{{ originalData.plateNo }}</div>
        <div v-if="originalData.remark">原备注：{{ originalData.remark }}</div>
      </div>
    </div>
    <div class="text-primary text-sm mb-4">
      请修改以下信息后重新提交退款申请：
    </div>
    <Form />
  </Drawer>
</template>
