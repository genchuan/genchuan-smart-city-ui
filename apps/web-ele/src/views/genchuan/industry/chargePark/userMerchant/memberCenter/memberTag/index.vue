<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberTagVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberTag';

import { ref } from 'vue';

import {
  confirm,
  DocAlert,
  Page,
  useVbenDrawer,
  useVbenModal,
} from '@vben/common-ui';
import { CommonStatusEnum } from '@vben/constants';

import { ElLoading, ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { MemberTagApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberTag';
import IconButton from '#/components/common/IconButton.vue';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const searchParams = ref<Record<string, any>>({});

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
  async onOpenChange() {},
});

const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onQuerySubmit,
  layout: 'horizontal',
  schema: useGridFormSchema().map((item) => ({
    ...item,
    rules: undefined,
  })),
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
});

/** 搜索表单提交 */
async function onQuerySubmit(values: Record<string, any>) {
  searchParams.value = { ...values };
  await handleRefresh();
  drawerApi.close();
}

/** 刷新表格 */
function handleRefresh() {
  gridApi.reload();
}

/** 打开搜索抽屉 */
async function handleSearchShow() {
  drawerApi.open();
  await queryFormApi.setValues(searchParams.value);
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

  try {
    await confirm(
      isEnable ? `确认禁用【${row.name}】吗？` : `确认启用【${row.name}】吗？`,
    );
  } catch {
    return;
  }

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
  gridOptions: {
    columns: useGridColumns(),
    layouts: [['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const queryValues = {
            ...searchParams.value,
            ...formValues,
          };

          return await MemberTagApi.getMemberTagPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...queryValues,
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
  showSearchForm: false,
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
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            v-access:code="['member:tag:create']"
            content="新增会员标签"
            icon-name="Plus"
            @click="handleCreate"
          />
          <IconButton
            content="搜索"
            icon-name="search"
            @click="handleSearchShow"
          />
          <IconButton
            content="全屏"
            icon-name="FullScreen"
            @click="() => screenfull.toggle()"
          />
        </div>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools">
          <IconButton
            v-access:code="['member:tag:update']"
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            v-access:code="['member:tag:update']"
            :content="
              Number(row.status) === CommonStatusEnum.ENABLE ? '禁用' : '启用'
            "
            :icon-name="
              Number(row.status) === CommonStatusEnum.ENABLE ? 'Close' : 'Check'
            "
            @click="handleToggleStatus(row)"
          />
        </div>
      </template>
    </Grid>
  </Page>
</template>
