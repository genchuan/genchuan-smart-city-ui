<script setup lang="ts">
import type { MemberUserApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';

import { h } from 'vue';

import { formatDate } from '@vben/utils';

import { ElAvatar, ElCard, ElCol, ElRow, ElTag } from 'element-plus';

import { useDescription } from '#/components/description';

import { formatMemberStatus, getMemberStatusTagType } from '../../data';

const props = withDefaults(
  defineProps<{ mode?: 'kefu' | 'member'; user: MemberUserApi.User }>(),
  {
    mode: 'member',
  },
);

function formatSex(value?: number | string) {
  const sexMap: Record<string, string> = {
    0: '未知',
    1: '男',
    2: '女',
  };

  return sexMap[String(value ?? '')] || '-';
}

const [Descriptions] = useDescription({
  border: false,
  column: props.mode === 'member' ? 2 : 1,
  schema: [
    {
      field: 'id',
      label: '会员编号',
    },
    {
      field: 'nickname',
      label: '会员昵称',
    },
    {
      field: 'mobile',
      label: '手机号',
    },
    {
      field: 'name',
      label: '真实姓名',
    },
    {
      field: 'status',
      label: '状态',
      render: (val) =>
        h(
          ElTag,
          {
            type: getMemberStatusTagType(val),
          },
          () => formatMemberStatus(val),
        ),
    },
    {
      field: 'sex',
      label: '性别',
      render: (val) => formatSex(val),
    },
    {
      field: 'areaName',
      label: '所在地区',
      render: (val) => val || '-',
    },
    {
      field: 'registerIp',
      label: '注册 IP',
      render: (val) => val || '-',
    },
    {
      field: 'registerTerminal',
      label: '注册终端',
      render: (val) => val ?? '-',
    },
    {
      field: 'birthday',
      label: '生日',
      render: (val) => formatDate(val)?.toString() || '-',
    },
    {
      field: 'createTime',
      label: '注册时间',
      render: (val) => formatDate(val)?.toString() || '-',
    },
    {
      field: 'loginDate',
      label: '最后登录时间',
      render: (val) => formatDate(val)?.toString() || '-',
    },
    {
      field: 'loginIp',
      label: '最后登录 IP',
      render: (val) => val || '-',
    },
    {
      field: 'mark',
      label: '会员备注',
      render: (val) => val || '-',
    },
  ],
});
</script>

<template>
  <ElCard>
    <template #header>
      <div class="flex justify-between">
        <span class="font-medium">
          <slot name="title"></slot>
        </span>
        <div class="h-[10px]">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <ElRow v-if="mode === 'member'" :gutter="24">
      <ElCol :span="6">
        <ElAvatar :size="180" shape="square" :src="user.avatar" />
      </ElCol>
      <ElCol :span="18">
        <Descriptions :data="user" />
      </ElCol>
    </ElRow>
    <template v-else-if="mode === 'kefu'">
      <ElAvatar :size="140" shape="square" :src="user.avatar" />
      <Descriptions :data="user" />
    </template>
  </ElCard>
</template>
