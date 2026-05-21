<script setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';

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
    case '分类': {
      return [
        {
          fieldName: 'demandType',
          label: '需求类型',
          component: 'Select',
          componentProps: {
            placeholder: '请选择需求类型',
            options: [
              { label: '场地', value: 0 },
              { label: '政策', value: 1 },
              { label: '服务', value: 2 },
            ],
            style: 'width: 100%',
          },
          rules: 'required',
        },
        {
          fieldName: 'intentLevel',
          label: '意向程度',
          component: 'Select',
          componentProps: {
            placeholder: '请选择意向程度',
            options: [
              { label: '高', value: 0 },
              { label: '中', value: 1 },
              { label: '低', value: 2 },
            ],
            style: 'width: 100%',
          },
          rules: 'required',
        },
        {
          fieldName: 'clientStatus',
          label: '客户状态',
          component: 'Select',
          componentProps: {
            placeholder: '请选择客户状态',
            options: [
              { label: '潜在客户', value: 0 },
              { label: '意向客户', value: 1 },
              { label: '已签约', value: 2 },
            ],
            style: 'width: 100%',
          },
          rules: 'required',
        },
      ];
    }

    case '服务':
    case '洽谈':
    case '维护':
    case '跟进': {
      return [
        {
          fieldName: 'trackRecord',
          label:
            title === '维护'
              ? '维护记录'
              : title === '跟进'
                ? '跟进记录'
                : title === '洽谈'
                  ? '洽谈记录'
                  : '服务记录',
          component: 'Input',
          componentProps: {
            placeholder: `请输入${title === '维护' ? '维护' : title === '跟进' ? '跟进' : title === '洽谈' ? '洽谈' : '服务'}记录内容`,
            type: 'textarea',
            rows: 4,
            style: 'width: 100%',
          },
          rules: 'required',
        },
      ];
    }

    case '确认':
    case '签约':
    case '续费':
    case '转化': {
      return [
        {
          fieldName: 'transformResult',
          label: title === '续费' ? '续费结果' : '转化结果',
          component: 'Input',
          componentProps: {
            placeholder: `请输入${title === '续费' ? '续费' : '转化'}结果`,
            type: 'textarea',
            rows: 3,
            style: 'width: 100%',
          },
          rules: 'required',
        },
      ];
    }

    default: {
      return [];
    }
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
