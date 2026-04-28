<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberLevelVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberLevel';

import { DocAlert, Page, useVbenModal } from '@vben/common-ui';
import { CommonStatusEnum } from '@vben/constants';

import { ElLoading, ElMessage } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { MemberLevelApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberLevel';
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

/** 创建等级 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑等级 */
function handleEdit(row: MemberLevelVO) {
  formModalApi.setData(row).open();
}

/** 启用/禁用等级 */
async function handleToggleStatus(row: MemberLevelVO) {
  const isEnable = Number(row.status) === CommonStatusEnum.ENABLE;
  const loadingInstance = ElLoading.service({
    text: `${isEnable ? '正在禁用' : '正在启用'}${row.name}`,
  });
  try {
    await (isEnable
      ? MemberLevelApi.disableMemberLevel({ ids: [row.id as number] })
      : MemberLevelApi.enableMemberLevel({ ids: [row.id as number] }));
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
          return await MemberLevelApi.getMemberLevelPage({
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
  } as VxeTableGridOptions<MemberLevelVO>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="会员等级、积分、签到"
        url="https://doc.iocoder.cn/member/level/"
      />
    </template>

    <FormModal @success="handleRefresh" />
    <Grid table-title="等级列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['等级']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['member:level:create'],
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
              auth: ['member:level:update'],
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
              auth: ['member:level:update'],
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
