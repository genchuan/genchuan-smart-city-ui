<script setup lang="ts">
import type { MemberUserApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';

import { formatDate } from '@vben/utils';

import { ElCard } from 'element-plus';

import { useDescription } from '#/components/description';

const props = withDefaults(
  defineProps<{
    mode?: 'kefu' | 'member';
    user: MemberUserApi.User;
  }>(),
  {
    mode: 'member',
  },
);

const [Descriptions] = useDescription({
  border: false,
  column: props.mode === 'member' ? 2 : 1,
  schema: [
    {
      field: 'levelName',
      label: '会员等级',
      render: (val) => val || '-',
    },
    {
      field: 'groupName',
      label: '会员分组',
      render: (val) => val || '-',
    },
    {
      field: 'tagNames',
      label: '会员标签',
      render: (val) => {
        if (Array.isArray(val)) {
          return val[0] || '-';
        }

        return val || '-';
      },
    },
    {
      field: 'experience',
      label: '经验值',
      render: (val) => val || 0,
    },
    {
      field: 'point',
      label: '当前积分',
      render: (val) => val || 0,
    },
    {
      field: 'expireTime',
      label: '会员到期时间',
      render: (val) => formatDate(val)?.toString() || '-',
    },
    {
      field: 'autoRenew',
      label: '自动续费',
      render: (val) => (Number(val) === 1 ? '是' : '否'),
    },
  ],
});
</script>

<template>
  <ElCard>
    <template #header>
      <span class="font-medium">
        <slot name="title"></slot>
      </span>
    </template>
    <Descriptions :data="user" />
  </ElCard>
</template>
