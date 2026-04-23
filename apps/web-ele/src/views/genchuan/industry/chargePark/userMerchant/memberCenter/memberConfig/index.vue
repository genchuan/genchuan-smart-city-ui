<script lang="ts" setup>
import type {
  MemberConfigSaveReqVO,
  MemberConfigVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberConfig';

import { onMounted } from 'vue';

import { Page } from '@vben/common-ui';
import { fenToYuan, yuanToFen } from '@vben/utils';

import { ElCard, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { MemberConfigApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberConfig';
import { $t } from '#/locales';

import { schema } from './data';

const defaultConfig: MemberConfigVO = {
  pointTradeDeductEnable: 0,
  pointTradeDeductMaxPrice: 0,
  pointTradeDeductUnitPrice: 0,
  pointTradeGivePoint: 0,
};

const [Form, formApi] = useVbenForm({
  commonConfig: {
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema,
  handleSubmit,
});

/** 提交表单 */
async function handleSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }

  const values = (await formApi.getValues()) as MemberConfigVO;
  const data: MemberConfigSaveReqVO = {
    id: values.id,
    pointTradeDeductEnable: values.pointTradeDeductEnable,
    pointTradeDeductMaxPrice: Number(values.pointTradeDeductMaxPrice || 0),
    pointTradeDeductUnitPrice: yuanToFen(
      Number(values.pointTradeDeductUnitPrice || 0),
    ),
    pointTradeGivePoint: Number(values.pointTradeGivePoint || 0),
  };

  await MemberConfigApi.saveMemberConfig(data);
  // 关闭并提示
  ElMessage.success($t('ui.actionMessage.operationSuccess'));

  await getConfigInfo();
}

/** 获取配置 */
async function getConfigInfo() {
  const result = await MemberConfigApi.getMemberConfigPage({
    pageNo: 1,
    pageSize: 1,
  });
  const currentConfig = Array.isArray(result?.list)
    ? result.list[0]
    : undefined;

  if (!currentConfig) {
    await formApi.setValues(defaultConfig);
    return;
  }

  const detail = currentConfig.id
    ? await MemberConfigApi.getMemberConfig(currentConfig.id)
    : currentConfig;
  const values: MemberConfigVO = {
    ...defaultConfig,
    ...detail,
    pointTradeDeductUnitPrice: Number.parseFloat(
      fenToYuan(Number(detail.pointTradeDeductUnitPrice || 0)),
    ),
  };

  await formApi.setValues(values);
}

/** 初始化 */
onMounted(() => {
  void getConfigInfo();
});
</script>

<template>
  <Page auto-content-height>
    <ElCard title="积分设置">
      <Form class="w-1/4" />
    </ElCard>
  </Page>
</template>
