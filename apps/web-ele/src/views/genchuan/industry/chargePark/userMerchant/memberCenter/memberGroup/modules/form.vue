<script lang="ts" setup>
import type { MemberGroupVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberGroup';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { MemberGroupApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberGroup';
import { $t } from '#/locales';

import { normalizeDateTimeFormValue } from '../../utils';
import { useFormSchema } from '../data';

type MemberGroupFormDetail = MemberGroupVO & {
  effectiveTimeStr?: number | string;
  effectTime?: number | string;
  effectTimeStr?: number | string;
};

const emit = defineEmits(['success']);
const formData = ref<MemberGroupVO>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['会员分组'])
    : $t('ui.actionTitle.create', ['会员分组']);
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

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    // 提交表单
    const data = (await formApi.getValues()) as MemberGroupVO;
    try {
      await (formData.value?.id
        ? MemberGroupApi.updateMemberGroup(data)
        : MemberGroupApi.createMemberGroup(data));
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
      return;
    }
    // 加载数据
    const data = modalApi.getData<MemberGroupVO>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      const detail = (await MemberGroupApi.getMemberGroup(
        data.id,
      )) as MemberGroupFormDetail;
      const effectiveTime =
        detail.effectiveTime ??
        detail.effectiveTimeStr ??
        detail.effectTime ??
        detail.effectTimeStr;

      formData.value = {
        ...detail,
        effectiveTime: normalizeDateTimeFormValue(effectiveTime),
      };
      // 设置表单 values
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
