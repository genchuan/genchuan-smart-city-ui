<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';

import { useFormSchema } from './data';

const formData = ref();
const getTitle = computed(() => {
  return formData.value?.id ? '编辑停车场' : '新增停车场';
});
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});
const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    console.info('onConfirm');
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      formData.value = drawerApi.getData<Record<string, any>>();
      if (formData.value?.id) {
        await formApi.setValues(formData.value);
      } else {
        formApi.resetForm();
      }
    }
  },
});
</script>
<template>
  <Drawer :title="getTitle"> <Form class="mx-4" /> </Drawer>
</template>
