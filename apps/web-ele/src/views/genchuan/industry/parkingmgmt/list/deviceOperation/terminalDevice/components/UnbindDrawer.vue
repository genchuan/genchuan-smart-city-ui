<script setup>
import { useVbenForm } from '#/adapter/form';

const props = defineProps({
  row: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(['close', 'submit']);

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
      fieldName: 'unbindReason',
      label: '解绑原因',
      component: 'Select',
      componentProps: {
        placeholder: '请选择解绑原因',
        options: [
          { label: '设备故障', value: '设备故障' },
          { label: '设备更换', value: '设备更换' },
          { label: '其他原因', value: '其他原因' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请填写备注',
        type: 'textarea',
        rows: 3,
      },
    },
  ],
  showDefaultActions: false,
});

const handleSubmit = async () => {
  const isValid = await formApi.validate();
  if (isValid) {
    const values = formApi.form.values;
    emit('submit', values);
  }
};

const handleCancel = () => {
  emit('close');
};

// 暴露方法和属性给父组件
defineExpose({
  formApi,
  handleSubmit,
});
</script>

<template>
  <div class="unbind-drawer">
    <Form />
  </div>
</template>

<style scoped>
.unbind-drawer {
  padding: 20px;
}
</style>
