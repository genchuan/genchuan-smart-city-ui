<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { shipExchangeOrder } from '#/api/genchuan/industry/chargePark/marketOp/exchangeMgmt/exchangeOrder';
import { useVbenForm } from '#/adapter/form';

const emit = defineEmits(['success']);

// 存储订单数据 - 使用普通变量避免响应式问题
let orderId = null;
let orderNo = '';
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

    console.log('ShipDialog onConfirm orderId:', orderId);

    // 检查id是否存在
    if (!orderId) {
      ElMessage.error('订单ID缺失，请重新打开弹窗');
      return;
    }

    try {
      loading.value = true;
      const logisticsInfo = `${values.logisticsCompany}：${values.trackingNo}`;

      const requestData = {
        id: orderId,
        logisticsInfo,
      };
      console.log('ShipDialog request data:', requestData);

      const response = await shipExchangeOrder(requestData);

      console.log('ShipDialog response:', response);

      // 判断成功：code为0或200，或者data为true，或者直接返回true
      const isSuccess = response && (
        response.code === 0 ||
        response.code === 200 ||
        response.data === true ||
        response === true
      );

      if (isSuccess) {
        ElMessage.success('发货成功');
        modalApi.close();
        emit('success');
      } else {
        const errorMsg = response?.msg || response?.message || '发货失败';
        ElMessage.error(errorMsg);
      }
    } catch (error) {
      console.error('发货失败:', error);
      // 如果报错但包含成功信息，也认为是成功
      if (error?.response?.data?.code === 0 || error?.response?.data?.code === 200) {
        ElMessage.success('发货成功');
        modalApi.close();
        emit('success');
      } else {
        ElMessage.error(error?.message || '发货失败');
      }
    } finally {
      loading.value = false;
    }
  },
});

// 打开弹窗 - 直接接收row数据并保存
const open = (row) => {
  console.log('ShipDialog open called with row:', row);
  
  // 直接保存传入的row数据到普通变量
  if (row && row.id) {
    orderId = row.id;
    orderNo = row.no || '';
    console.log('ShipDialog orderId saved:', orderId, 'orderNo:', orderNo);
  } else {
    console.error('ShipDialog open called without valid row.id');
    orderId = null;
    orderNo = '';
  }
  
  modalApi.open();
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
