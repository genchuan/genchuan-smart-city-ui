<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberUserApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { DocAlert, Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getUserPage } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';
import IconButton from '#/components/common/IconButton.vue';
import { CouponSendForm } from '#/views/mall/promotion/coupon/components';

import { useGridColumns, useGridFormSchema } from './data';
import BalanceForm from './modules/balance-form.vue';
import Form from './modules/form.vue';
import LevelForm from './modules/level-form.vue';
import PointForm from './modules/point-form.vue';

const router = useRouter();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [PointFormModal, pointFormModalApi] = useVbenModal({
  connectedComponent: PointForm,
  destroyOnClose: true,
});

const [BalanceFormModal, balanceFormModalApi] = useVbenModal({
  connectedComponent: BalanceForm,
  destroyOnClose: true,
});

const [LevelFormModal, levelFormModalApi] = useVbenModal({
  connectedComponent: LevelForm,
  destroyOnClose: true,
});

const [CouponSendFormModal, couponSendFormModalApi] = useVbenModal({
  connectedComponent: CouponSendForm,
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

/** 编辑会员 */
function handleEdit(row: MemberUserApi.User) {
  formModalApi.setData(row).open();
}

/** 修改会员等级 */
function handleUpdateLevel(row: MemberUserApi.User) {
  levelFormModalApi.setData(row).open();
}

/** 修改会员积分 */
function handleUpdatePoint(row: MemberUserApi.User) {
  pointFormModalApi.setData(row).open();
}

/** 修改会员余额 */
function handleUpdateBalance(row: MemberUserApi.User) {
  balanceFormModalApi.setData(row).open();
}

/** 发送优惠券 */
async function handleSendCoupon() {
  couponSendFormModalApi
    .setData({
      userIds: checkedIds.value,
    })
    .open();
}

const checkedIds = ref<number[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: MemberUserApi.User[];
}) {
  checkedIds.value = records.map((item) => item.id!);
}

/** 查看会员详情 */
function handleViewDetail(row: MemberUserApi.User) {
  router.push({
    name: 'MemberUserDetail',
    query: {
      id: row.id,
    },
  });
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

          return await getUserPage({
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
  } as VxeTableGridOptions<MemberUserApi.User>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
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
    <PointFormModal @success="handleRefresh" />
    <BalanceFormModal @success="handleRefresh" />
    <LevelFormModal @success="handleRefresh" />
    <CouponSendFormModal />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            v-access:code="['promotion:coupon:send']"
            content="发送优惠券"
            icon-name="Mouse"
            :disabled="isEmpty(checkedIds)"
            @click="handleSendCoupon"
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
            content="详情"
            icon-name="View"
            @click="handleViewDetail(row)"
          />
          <IconButton
            v-access:code="['member:user:update']"
            content="编辑"
            icon-name="Edit"
            @click="handleEdit(row)"
          />
          <IconButton
            v-access:code="['member:user:update-level']"
            content="修改等级"
            icon-name="Medal"
            @click="handleUpdateLevel(row)"
          />
          <IconButton
            v-access:code="['member:user:update-point']"
            content="修改积分"
            icon-name="Coin"
            @click="handleUpdatePoint(row)"
          />
          <IconButton
            v-access:code="['pay:wallet:update-balance']"
            content="修改余额"
            icon-name="Wallet"
            @click="handleUpdateBalance(row)"
          />
        </div>
      </template>
    </Grid>
  </Page>
</template>
