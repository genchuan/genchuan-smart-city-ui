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
      fieldName: 'newStatus',
      label: '变更后状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择变更后状态',
        options: [
          { label: '在线', value: '在线' },
          { label: '离线', value: '离线' },
          { label: '故障', value: '故障' },
          { label: '维护中', value: '维护中' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'changeReason',
      label: '变更原因',
      component: 'Input',
      componentProps: {
        placeholder: '请填写变更原因',
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
  <div class="update-status-drawer">
    <Form />
  </div>
</template>

<style scoped>
.update-status-drawer {
  padding: 20px;
}
</style>
