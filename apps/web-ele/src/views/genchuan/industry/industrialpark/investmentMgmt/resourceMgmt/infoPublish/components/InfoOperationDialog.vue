<script setup>
import { ref } from 'vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

const props = defineProps({
  title: {
    type: String,
    default: '操作',
  },
});

const emit = defineEmits(['confirm']);

const [Drawer, drawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    handleSubmit();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData();
      if (data) {
        currentTitle.value = data.title || props.title;
        await updateFormSchema(data);
      }
    }
  },
});

const currentTitle = ref('');

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: [],
  showDefaultActions: false,
});

/** 根据标题生成表单配置 */
function getSchemaByTitle(title) {
  switch (title) {
    case '配置':
      return [
        {
          fieldName: 'policyConfig',
          label: '政策配置',
          component: 'Input',
          componentProps: {
            placeholder: '请输入政策配置内容',
            type: 'textarea',
            rows: 4,
          },
          rules: 'required',
        },
      ];

    case '响应':
      return [
        {
          fieldName: 'consultCount',
          label: '咨询数',
          component: 'InputNumber',
          componentProps: {
            placeholder: '请输入咨询数',
            min: 0,
            style: 'width: 100%',
          },
        },
        {
          fieldName: 'responseRate',
          label: '响应率',
          component: 'InputNumber',
          componentProps: {
            placeholder: '请输入响应率(0-1)',
            min: 0,
            max: 1,
            step: 0.01,
            style: 'width: 100%',
          },
        },
      ];

    case '发布':
      return [
        {
          fieldName: 'publishTime',
          label: '发布时间',
          component: 'DatePicker',
          componentProps: {
            placeholder: '请选择发布时间',
            type: 'datetime',
            format: 'YYYY-MM-DD HH:mm:ss',
            valueFormat: 'YYYY-MM-DD HH:mm:ss',
            style: 'width: 100%',
          },
          rules: 'required',
        },
      ];

    case '更新':
      return [
        {
          fieldName: 'infoTitle',
          label: '信息标题',
          component: 'Input',
          componentProps: {
            placeholder: '请输入信息标题',
          },
          rules: 'required',
        },
        {
          fieldName: 'infoType',
          label: '信息类型',
          component: 'Select',
          componentProps: {
            placeholder: '请选择信息类型',
            options: [
              { label: '场地', value: 0 },
              { label: '政策', value: 1 },
              { label: '服务', value: 2 },
            ],
          },
          rules: 'required',
        },
        {
          fieldName: 'policyConfig',
          label: '政策配置',
          component: 'Input',
          componentProps: {
            placeholder: '请输入政策配置内容',
            type: 'textarea',
            rows: 3,
          },
        },
      ];

    default:
      return [];
  }
}

/** 动态更新表单 */
async function updateFormSchema(data) {
  const schema = getSchemaByTitle(currentTitle.value);
  await formApi.setState({ schema });
  if (data) {
    await formApi.setValues(data);
  }
}

/** 提交表单 */
async function handleSubmit() {
  try {
    const valid = await formApi.validate();
    if (valid) {
      const values = await formApi.getValues();
      const result = {
        ...values,
        title: currentTitle.value,
      };
      emit('confirm', result);
      drawerApi.close();
    }
  } catch (error) {
    console.error('表单验证失败:', error);
    ElMessage.warning('请填写必填项');
  }
}

/** 打开抽屉 */
function open(data) {
  currentTitle.value = data?.title || props.title;
  drawerApi.setData(data).open();
}

defineExpose({ open });
</script>

<template>
  <Drawer :title="title">
    <Form />
  </Drawer>
</template>
