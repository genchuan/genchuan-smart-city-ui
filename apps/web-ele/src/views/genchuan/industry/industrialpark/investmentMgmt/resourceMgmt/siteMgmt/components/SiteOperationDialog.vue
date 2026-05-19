<script setup>
import { ref } from 'vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import {
  companyList,
  clientList,
} from '../table/data';

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
    case '续费':
      return [
        {
          fieldName: 'rentInfo',
          label: '租金信息',
          component: 'Input',
          componentProps: {
            placeholder: '请输入租金信息（例：33 元/㎡/月，续租2年）',
            type: 'textarea',
            rows: 3,
          },
          rules: 'required',
        },
      ];

    case '确认':
      return [
        {
          fieldName: 'rentInfo',
          label: '租金信息',
          component: 'Input',
          componentProps: {
            placeholder: '请输入租金信息（例：32 元/㎡/月，租期3年）',
            type: 'textarea',
            rows: 3,
          },
          rules: 'required',
        },
        {
          fieldName: 'signCompany',
          label: '签约企业',
          component: 'Select',
          componentProps: {
            placeholder: '请选择签约企业',
            options: companyList.map((c) => ({ label: c.name, value: c.id })),
          },
        },
      ];

    case '签约':
      return [
        {
          fieldName: 'rentInfo',
          label: '租金信息',
          component: 'Input',
          componentProps: {
            placeholder: '请输入租金信息（例：32 元/㎡/月，租期3年）',
            type: 'textarea',
            rows: 3,
          },
          rules: 'required',
        },
        {
          fieldName: 'signCompany',
          label: '签约企业',
          component: 'Select',
          componentProps: {
            placeholder: '请选择签约企业',
            options: companyList.map((c) => ({ label: c.name, value: c.id })),
          },
          rules: 'required',
        },
      ];

    case '预约':
      return [
        {
          fieldName: 'orderClient',
          label: '预约客户',
          component: 'Select',
          componentProps: {
            placeholder: '请选择预约客户',
            options: clientList.map((c) => ({ label: c.name, value: c.id })),
          },
          rules: 'required',
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
