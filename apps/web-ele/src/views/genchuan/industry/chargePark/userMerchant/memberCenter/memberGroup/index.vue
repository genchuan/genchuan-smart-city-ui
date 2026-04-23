<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberGroupVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberGroup';

import { DocAlert, Page, useVbenModal } from '@vben/common-ui';
import { CommonStatusEnum } from '@vben/constants';

import { ElLoading, ElMessage } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { MemberGroupApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberGroup';
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

/** 创建会员分组 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑会员分组 */
function handleEdit(row: MemberGroupVO) {
  formModalApi.setData(row).open();
}

/** 生效/禁用会员分组 */
async function handleToggleStatus(row: MemberGroupVO) {
  const isEnable = Number(row.status) === CommonStatusEnum.ENABLE;
  const loadingInstance = ElLoading.service({
    text: `${isEnable ? '正在禁用' : '正在生效'}${row.name}`,
  });
  try {
    await (isEnable
      ? MemberGroupApi.disableMemberGroup({ ids: [row.id as number] })
      : MemberGroupApi.enableMemberGroup({ ids: [row.id as number] }));
    ElMessage.success(`${row.name}${isEnable ? '已禁用' : '已生效'}`);
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
          return await MemberGroupApi.getMemberGroupPage({
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
  } as VxeTableGridOptions<MemberGroupVO>,
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
    <Grid table-title="会员分组列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['会员分组']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['member:group:create'],
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
              auth: ['member:group:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label:
                Number(row.status) === CommonStatusEnum.ENABLE
                  ? '禁用'
                  : '生效',
              type:
                Number(row.status) === CommonStatusEnum.ENABLE
                  ? 'danger'
                  : 'primary',
              link: true,
              icon:
                Number(row.status) === CommonStatusEnum.ENABLE
                  ? ACTION_ICON.DELETE
                  : ACTION_ICON.EDIT,
              auth: ['member:group:update'],
              popConfirm: {
                title:
                  Number(row.status) === CommonStatusEnum.ENABLE
                    ? `确认禁用【${row.name}】吗？`
                    : `确认生效【${row.name}】吗？`,
                confirm: handleToggleStatus.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
