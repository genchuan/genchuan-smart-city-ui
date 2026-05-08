<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallCouponApi } from '#/api/mall/promotion/coupon/coupon';

import { ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { ElLoading, ElMessage, ElTabPane, ElTabs } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteCoupon,
  getCouponPage,
} from '#/api/mall/promotion/coupon/coupon';
import IconButton from '#/components/common/IconButton.vue';
import {
  useGridColumns as useCouponGridColumns,
  useGridFormSchema as useCouponGridFormSchema,
} from '#/views/mall/promotion/coupon/data';

const props = defineProps<{
  userId: number;
}>();

const activeTab = ref('all');
const statusTabs = ref(getStatusTabs());
const searchParams = ref<Record<string, any>>({});

/** 列表的搜索表单（过滤掉会员相关字段） */
function useGridFormSchema() {
  const excludeFields = new Set(['nickname']);
  return useCouponGridFormSchema().filter(
    (item) => !excludeFields.has(item.fieldName),
  );
}

/** 列表的字段（过滤掉会员相关字段） */
function useGridColumns() {
  const excludeFields = new Set(['nickname']);
  return useCouponGridColumns()?.filter(
    (item) => item.field && !excludeFields.has(item.field),
  );
}

/** 获取状态选项卡配置 */
function getStatusTabs() {
  const tabs = [
    {
      label: '全部',
      value: 'all',
    },
  ];
  const statusOptions = getDictOptions(DICT_TYPE.PROMOTION_COUPON_STATUS);
  for (const option of statusOptions) {
    tabs.push({
      label: option.label,
      value: String(option.value),
    });
  }
  return tabs;
}

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

/** Tab 切换 */
function handleTabChange(tabName: any) {
  activeTab.value = tabName;
  handleRefresh();
}

/** 删除优惠券 */
async function handleDelete(row: MallCouponApi.Coupon) {
  try {
    await confirm(
      '回收将会收回会员领取的待使用的优惠券，已使用的将无法回收，确定要回收所选优惠券吗？',
    );
  } catch {
    return;
  }

  const loadingInstance = ElLoading.service({
    text: '回收中...',
  });
  try {
    await deleteCoupon(row.id!);
    ElMessage.success('回收成功');
    await handleRefresh();
  } finally {
    loadingInstance.close();
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    layouts: [['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    keepSource: true,
    pagerConfig: {
      pageSize: 10,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const params = {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            userId: props.userId,
            ...searchParams.value,
            ...formValues,
            // Tab状态过滤
            status:
              activeTab.value === 'all' ? undefined : Number(activeTab.value),
          };
          return await getCouponPage(params);
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
  } as VxeTableGridOptions<MallCouponApi.Coupon>,
  showSearchForm: false,
});
</script>

<template>
  <Drawer title="搜索">
    <QueryForm class="query-form" />
  </Drawer>

  <Grid>
    <template #toolbar-actions>
      <ElTabs
        :model-value="activeTab"
        class="w-full"
        @tab-change="handleTabChange"
      >
        <ElTabPane
          v-for="tab in statusTabs"
          :key="tab.value"
          :label="tab.label"
          :name="tab.value"
        />
      </ElTabs>
    </template>
    <template #toolbar-tools>
      <div class="common-toolbar-tools">
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
          v-access:code="['promotion:coupon:delete']"
          content="回收"
          icon-name="Delete"
          color="#F56C6C"
          @click="handleDelete(row)"
        />
      </div>
    </template>
  </Grid>
</template>
