<script lang="ts" setup>
import type { MemberConfigVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberConfig';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { MemberConfigApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberConfig';
import { $t } from '#/locales';

import { normalizeDateTimeFormValue } from '../../utils';
import { useFormSchema } from '../data';

type MemberConfigFormDetail = MemberConfigVO & {
  effectiveTimeStr?: number | string;
  effectTime?: number | string;
  effectTimeStr?: number | string;
};

const emit = defineEmits(['success']);
const formData = ref<MemberConfigVO>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['会员配置'])
    : $t('ui.actionTitle.create', ['会员配置']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 90,
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
    modalApi.lock();
    const data = (await formApi.getValues()) as MemberConfigVO;
    try {
      await (formData.value?.id
        ? MemberConfigApi.updateMemberConfig(data)
        : MemberConfigApi.createMemberConfig(data));
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

    const data = modalApi.getData<MemberConfigVO>();
    if (!data || !data.id) {
      await formApi.resetForm();
      return;
    }

    modalApi.lock();
    try {
      const detail = (await MemberConfigApi.getMemberConfig(
        data.id,
      )) as MemberConfigFormDetail;
      const effectiveTime =
        detail.effectiveTime ??
        detail.effectiveTimeStr ??
        detail.effectTime ??
        detail.effectTimeStr;

      formData.value = {
        ...detail,
        effectiveTime: normalizeDateTimeFormValue(effectiveTime),
      };
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal class="w-2/5" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
