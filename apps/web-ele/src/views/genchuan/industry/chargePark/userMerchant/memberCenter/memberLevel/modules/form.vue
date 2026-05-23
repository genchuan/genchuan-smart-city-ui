<script lang="ts" setup>
import type { MemberLevelVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberLevel';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { MemberLevelApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberLevel';
import { $t } from '#/locales';

import { normalizeDateTimeFormValue } from '../../utils';
import { useFormSchema } from '../data';

type MemberLevelFormDetail = MemberLevelVO & {
  effectiveTimeStr?: number | string;
  effectTime?: number | string;
  effectTimeStr?: number | string;
};

const emit = defineEmits(['success']);
const formData = ref<MemberLevelVO>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['等级'])
    : $t('ui.actionTitle.create', ['等级']);
});

function normalizeSubmitData(data: MemberLevelVO) {
  return {
    ...data,
    benefits:
      typeof data.benefits === 'string' ? data.benefits.trim() : data.benefits,
    upgradeCondition:
      typeof data.upgradeCondition === 'string'
        ? data.upgradeCondition.trim()
        : data.upgradeCondition,
  };
}

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 110,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const formValues = (await formApi.getValues()) as MemberLevelVO;
    const data = normalizeSubmitData(formValues);

    modalApi.lock();
    try {
      await (formData.value?.id
        ? MemberLevelApi.updateMemberLevel(data)
        : MemberLevelApi.createMemberLevel(data));
      await modalApi.close();
      emit('success');
      ElMessage.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      await formApi.resetForm();
      return;
    }
    // 加载数据
    const data = modalApi.getData<MemberLevelVO>();
    if (!data || !data.id) {
      await formApi.resetForm();
      return;
    }
    modalApi.lock();
    try {
      const detail = (await MemberLevelApi.getMemberLevel(
        data.id,
      )) as MemberLevelFormDetail;
      const effectiveTime =
        detail.effectiveTime ??
        detail.effectiveTimeStr ??
        detail.effectTime ??
        detail.effectTimeStr;

      formData.value = {
        ...detail,
        effectiveTime: normalizeDateTimeFormValue(effectiveTime),
      };
      // 设置到 values
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-1/2">
    <Form class="mx-4" />
  </Modal>
</template>
