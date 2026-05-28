<!-- form.vue - 产品表单组件 -->
<script setup>
import { computed, nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElCollapse, ElCollapseItem, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import {
  createProduct,
  getProduct,
  updateProduct,
} from '#/api/iot/product/product';
import { $t } from '#/locales';

import { useAdvancedFormSchema, useBasicFormSchema } from '../data';

const emit = defineEmits(['success']);

/** 生成 ProductKey（包含大小写字母和数字） */
function generateProductKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const formData = ref();
const activeKey = ref([]);
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['产品'])
    : $t('ui.actionTitle.create', ['产品']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
  },
  layout: 'horizontal',
  schema: [],
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1',
});

const [AdvancedForm, advancedFormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
  },
  layout: 'horizontal',
  schema: useAdvancedFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1',
});

/** 基础表单需要 formApi 引用，所以通过 setState 设置 schema */
formApi.setState({ schema: useBasicFormSchema(formApi, generateProductKey) });

/** 获取高级表单的值 */
async function getAdvancedFormValues() {
  if (advancedFormApi.isMounted) {
    return await advancedFormApi.getValues();
  }
  return {
    icon: formData.value?.icon,
    picUrl: formData.value?.picUrl,
    description: formData.value?.description,
  };
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const basicValues = await formApi.getValues();
    const advancedValues = await getAdvancedFormValues();
    const data = {
      ...basicValues,
      ...advancedValues,
    };
    try {
      await (formData.value?.id ? updateProduct(data) : createProduct(data));
      await modalApi.close();
      emit('success');
      ElMessage.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      formData.value = undefined;
      activeKey.value = [];
      return;
    }
    const data = modalApi.getData();
    if (!data || !data.id) {
      activeKey.value = [];
      await formApi.setValues({
        productKey: generateProductKey(),
      });
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getProduct(data.id);
      await formApi.setValues(formData.value);
      if (
        formData.value?.icon ||
        formData.value?.picUrl ||
        formData.value?.description
      ) {
        activeKey.value = ['advanced'];
        await nextTick();
        await nextTick();
        if (advancedFormApi.isMounted) {
          await advancedFormApi.setValues(formData.value);
        }
      }
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-2/5">
    <div class="mx-4">
      <Form />
      <el-collapse v-model="activeKey" class="mt-4">
        <el-collapse-item name="advanced" title="更多设置">
          <AdvancedForm />
        </el-collapse-item>
      </el-collapse>
    </div>
  </Modal>
</template>

<style scoped>
.mx-4 {
  margin-left: 1rem;
  margin-right: 1rem;
}
.mt-4 {
  margin-top: 1rem;
}
</style>
