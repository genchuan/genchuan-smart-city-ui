<script setup lang="ts">
import type { MemberUserApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import { ElButton, ElCard, ElMessage, ElTabPane, ElTabs } from 'element-plus';

import { getUser } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import { $t } from '#/locales';

import Form from '../modules/form.vue';
import AccountInfo from './modules/account-info.vue';
import BasicInfo from './modules/basic-info.vue';
import PointList from './modules/point-list.vue';
import SignList from './modules/sign-list.vue';

const route = useRoute();
const { closeCurrentTab, refreshTab } = useTabs();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const userId = Number(route.query.id);
const user = ref<MemberUserApi.User>();
const activeName = ref('PointList');

async function getUserDetail() {
  if (!userId) {
    ElMessage.error('参数错误，会员编号不能为空');
    await closeCurrentTab();
    return;
  }

  user.value = await getUser(userId);
}

function handleEdit() {
  formModalApi.setData(user.value).open();
}

async function handleSuccess() {
  await getUserDetail();
  await refreshTab();
}

onMounted(async () => {
  await getUserDetail();
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleSuccess" />
    <div class="flex">
      <BasicInfo v-if="user" class="w-3/5" :user="user" mode="member">
        <template #title> 基本信息 </template>
        <template #extra>
          <ElButton type="primary" @click="handleEdit">
            {{ $t('common.edit') }}
          </ElButton>
        </template>
      </BasicInfo>
      <AccountInfo v-if="user" class="ml-4 w-2/5" :user="user">
        <template #title> 会员账户 </template>
      </AccountInfo>
    </div>
    <div class="mt-4">
      <ElCard title="会员明细">
        <ElTabs v-model="activeName">
          <ElTabPane label="积分记录" name="PointList">
            <PointList class="h-full" :user-id="userId" />
          </ElTabPane>
          <ElTabPane label="签到记录" name="SignList">
            <SignList class="h-full" :user-id="userId" />
          </ElTabPane>
        </ElTabs>
      </ElCard>
    </div>
  </Page>
</template>
