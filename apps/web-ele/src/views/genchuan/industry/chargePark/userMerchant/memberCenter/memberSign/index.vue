<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  MemberSignPageReqVO,
  MemberSignVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberSign';

import { computed, ref } from 'vue';

import { DocAlert, Page } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { MemberSignApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberSign';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import { useGridColumns, useGridFormSchema } from './data';

const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<MemberSignVO>();

const detailFields = ref([
  { key: 'nickname', label: '用户名称' },
  { key: 'createTime', label: '签到时间' },
  { key: 'point', label: '积分奖励' },
  { key: 'day', label: '连续签到天数' },
  { key: 'description', label: '积分发放说明' },
]);

const detailData = computed(() => {
  if (!detailObj.value) {
    return undefined;
  }

  return {
    ...detailObj.value,
    description: detailObj.value.description || '签到成功后自动发放积分',
  };
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await MemberSignApi.getMemberSignPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...(formValues as MemberSignPageReqVO),
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<MemberSignVO>,
});

/** 导出当前列表 */
async function handleExport() {
  try {
    const formValues =
      (await gridApi.formApi.getValues()) as MemberSignPageReqVO;
    await MemberSignApi.exportMemberSign(formValues);
    ElMessage.success('导出成功');
  } catch {
    ElMessage.error('导出失败');
  }
}

/** 查看签到详情 */
async function handleDetail(row: MemberSignVO) {
  detailObj.value = await MemberSignApi.getMemberSign(Number(row.id));
  detailDrawerRef.value?.open();
}
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="会员等级、积分、签到"
        url="https://doc.iocoder.cn/member/level/"
      />
    </template>

    <Grid table-title="会员签到列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '导出',
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              onClick: handleExport,
            },
          ]"
        />
      </template>

      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '查看',
              type: 'primary',
              link: true,
              icon: ACTION_ICON.VIEW,
              onClick: handleDetail.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="detailFields"
      :title="detailObj ? `${detailObj.nickname}签到详情` : '签到详情'"
    />
  </Page>
</template>
