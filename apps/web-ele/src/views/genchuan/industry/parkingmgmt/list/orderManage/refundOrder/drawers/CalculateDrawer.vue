<script setup>
import { ref, computed, watch } from 'vue';
import { useVbenForm } from '#/adapter/form';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  row: {
    type: Object,
    default: () => ({}),
  },
  isReCalculate: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'calculate', 'validate']);

const formData = ref({
  usedAmount: props.row.usedAmount || '',
  serviceFee: props.row.serviceFee || '',
  discountShare: props.row.discountShare || '',
});

const refundAmount = computed(() => {
  const usedAmount = parseFloat(formData.value.usedAmount) || 0;
  const serviceFee = parseFloat(formData.value.serviceFee) || 0;
  const discountShare = parseFloat(formData.value.discountShare) || 0;
  const originalAmount = parseFloat(props.row.originalAmount) || 0;
  
  return (originalAmount - usedAmount - serviceFee - discountShare).toFixed(2);
});

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
      fieldName: 'usedAmount',
      label: '已使用金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入已使用金额',
        min: 0,
        step: 0.01,
        precision: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'serviceFee',
      label: '手续费',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入手续费',
        min: 0,
        step: 0.01,
        precision: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'discountShare',
      label: '优惠分摊金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入优惠分摊金额',
        min: 0,
        step: 0.01,
        precision: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'refundAmount',
      label: '应退金额',
      component: 'InputNumber',
      componentProps: {
        placeholder: '应退金额',
        min: 0,
        step: 0.01,
        precision: 2,
        disabled: true,
      },
    },
  ],
  showDefaultActions: false,
  modelValue: formData,
});

watch(() => props.row, (newRow) => {
  if (newRow && Object.keys(newRow).length > 0) {
    // 计算应退金额
    const originalAmount = parseFloat(newRow.originalAmount || 0);
    const usedAmount = parseFloat(newRow.usedAmount || 0);
    const serviceFee = parseFloat(newRow.serviceFee || 0);
    const discountShare = parseFloat(newRow.discountShare || 0);
    const refundAmountValue = (originalAmount - usedAmount - serviceFee - discountShare).toFixed(2);
    
    // 更新表单数据
    formData.value = {
      usedAmount: newRow.usedAmount || '',
      serviceFee: newRow.serviceFee || '',
      discountShare: newRow.discountShare || '',
      refundAmount: refundAmountValue
    };
    
    // 使用nextTick确保表单API已经初始化
    setTimeout(() => {
      formApi.setValues(formData.value);
    }, 0);
  }
}, { deep: true, immediate: true });

const validate = async () => {
  const values = await formApi.validate();
  if (!values) return false;
  
  emit('validate', values);
  return true;
};

const resetForm = () => {
  formApi.resetForm();
};

const getValues = () => {
  return formApi.form.values;
};

const getRefundAmount = () => {
  return refundAmount.value;
};

defineExpose({
  validate,
  resetForm,
  getValues,
  getRefundAmount,
});
</script>

<template>
  <div class="calculate-drawer">
    <div class="calculate-info">
      <div class="order-info-section">
        <div class="info-item">
          <span class="label">退款单号：</span>
          <span class="value">{{ row.refundNo }}</span>
        </div>
        <div class="info-item">
          <span class="label">原订单编号：</span>
          <span class="value">{{ row.originalOrderNo }}</span>
        </div>
        <div class="info-item">
          <span class="label">订单类型：</span>
          <span class="value">{{ row.orderTypeName }}</span>
        </div>
        <div class="info-item">
          <span class="label">原订单金额：</span>
          <span class="value">{{ row.originalAmount }}</span>
        </div>
      </div>
      
      <div class="calculate-form">
        <Form />
      </div>
    </div>
  </div>
</template>

<style scoped>
.calculate-drawer {
  padding: 20px;
}

.calculate-info {
  margin-bottom: 20px;
}

.order-info-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.info-item .label {
  font-weight: 500;
  margin-right: 8px;
  color: #606266;
  min-width: 100px;
}

.info-item .value {
  color: #303133;
  font-weight: 400;
  flex: 1;
}

.calculate-form {
  margin-top: 20px;
}
</style>