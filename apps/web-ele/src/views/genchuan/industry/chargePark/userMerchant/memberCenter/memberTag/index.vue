<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberTagVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberTag';

import { DocAlert, Page, useVbenModal } from '@vben/common-ui';
import { CommonStatusEnum } from '@vben/constants';

import { ElLoading, ElMessage } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { MemberTagApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberTag';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建会员标签 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑会员标签 */
function handleEdit(row: MemberTagVO) {
  formModalApi.setData(row).open();
}

/** 启用/禁用会员标签 */
async function handleToggleStatus(row: MemberTagVO) {
  const isEnable = Number(row.status) === CommonStatusEnum.ENABLE;
  const loadingInstance = ElLoading.service({
    text: `${isEnable ? '正在禁用' : '正在启用'}${row.name}`,
  });
  try {
    await (isEnable
      ? MemberTagApi.disableMemberTag({ ids: [row.id as number] })
      : MemberTagApi.enableMemberTag({ ids: [row.id as number] }));
    ElMessage.success(`${row.name}${isEnable ? '已禁用' : '已启用'}`);
    handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

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
          return await MemberTagApi.getMemberTagPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
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
  } as VxeTableGridOptions<MemberTagVO>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="会员用户、标签、分组"
        url="https://doc.iocoder.cn/member/user/"
      />
    </template>
    <FormModal @success="handleRefresh" />
    <Grid table-title="会员标签列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['会员标签']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['member:tag:create'],
              onClick: handleCreate,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'primary',
              link: true,
              icon: ACTION_ICON.EDIT,
              auth: ['member:tag:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label:
                Number(row.status) === CommonStatusEnum.ENABLE
                  ? '禁用'
                  : '启用',
              type:
                Number(row.status) === CommonStatusEnum.ENABLE
                  ? 'danger'
                  : 'primary',
              link: true,
              icon:
                Number(row.status) === CommonStatusEnum.ENABLE
                  ? ACTION_ICON.DELETE
                  : ACTION_ICON.EDIT,
              auth: ['member:tag:update'],
              popConfirm: {
                title:
                  Number(row.status) === CommonStatusEnum.ENABLE
                    ? `确认禁用【${row.name}】吗？`
                    : `确认启用【${row.name}】吗？`,
                confirm: handleToggleStatus.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
