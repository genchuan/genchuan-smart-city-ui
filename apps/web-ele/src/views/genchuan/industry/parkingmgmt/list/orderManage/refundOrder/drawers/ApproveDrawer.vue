<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
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
});

const emit = defineEmits(['close', 'approve', 'validate']);

const formData = ref({});
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
      fieldName: 'approveResult',
      label: '审批结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审批结果',
        options: [
          { label: '通过', value: '已通过' },
          { label: '拒绝', value: '已拒绝' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'approveOpinion',
      label: '审批意见',
      component: 'Input',
      componentProps: {
        placeholder: '请输入审批意见',
        type: 'textarea',
        rows: 3,
      },
    },
  ],
  showDefaultActions: false,
});

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

defineExpose({
  validate,
  resetForm,
  getValues,
});
</script>

<template>
  <div class="approve-drawer">
    <Form />
  </div>
</template>

<style scoped>
.approve-drawer {
  padding: 20px;
}
</style>
