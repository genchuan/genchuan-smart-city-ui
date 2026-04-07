<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage, ElRadioGroup } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import {
  auditOrderRefundBatch,
  rejectOrderRefund,
} from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/orderRefund';

const emit = defineEmits(['success']);

const selectedIds = ref([]);
const auditAction = ref('pass'); // pass: 通过, reject: 驳回

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
      fieldName: 'auditAction',
      label: '审核操作',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '通过', value: 'pass' },
          { label: '驳回', value: 'reject' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'auditRemark',
      label: '审核备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入审核备注（驳回时必填）',
        rows: 4,
      },
      dependencies: {
        triggerFields: ['auditAction'],
        show: (values) => values.auditAction === 'reject',
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
    
    // 手动验证：如果选择驳回，必须填写审核备注
    if (values.auditAction === 'reject' && !values.auditRemark) {
      ElMessage.warning('驳回时必须填写原因');
      return;
    }
    
    modalApi.lock();
    try {
      if (values.auditAction === 'pass') {
        // 审核通过
        await auditOrderRefundBatch({
          ids: selectedIds.value,
          auditRemark: values.auditRemark || '',
        });
        ElMessage.success('审核通过成功');
      } else {
        // 驳回 - 批量驳回
        for (const id of selectedIds.value) {
          await rejectOrderRefund({
            id: id,
            rejectReason: values.auditRemark,
          });
        }
        ElMessage.success('驳回成功');
      }
      modalApi.close();
      emit('success');
    } catch (error) {
      console.error(error);
      ElMessage.error(values.auditAction === 'pass' ? '审核失败' : '驳回失败');
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      selectedIds.value = [];
      auditAction.value = 'pass';
      formApi.resetForm();
      return;
    }
    const data = modalApi.getData();
    if (data?.ids) {
      selectedIds.value = data.ids;
      await formApi.setValues({ auditAction: 'pass', auditRemark: '' });
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
  <Modal title="审核退款申请">
    <div class="mb-4 text-gray-600">
      已选择 <span class="font-bold text-primary">{{ selectedIds.length }}</span> 条待审核退款申请
    </div>
    <Form />
  </Modal>
</template>
