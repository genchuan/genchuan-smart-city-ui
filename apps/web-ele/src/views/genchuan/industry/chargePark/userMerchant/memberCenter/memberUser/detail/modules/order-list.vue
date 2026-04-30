<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallOrderApi } from '#/api/mall/trade/order';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { fenToYuan } from '@vben/utils';

import { ElImage, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getOrderPage } from '#/api/mall/trade/order';
import IconButton from '#/components/common/IconButton.vue';
import { DictTag } from '#/components/dict-tag';
import {
  useGridColumns,
  useGridFormSchema as useOrderGridFormSchema,
} from '#/views/mall/trade/order/data';

const props = defineProps<{
  userId: number;
}>();

const { push } = useRouter();
const searchParams = ref<Record<string, any>>({});

/** 列表的搜索表单（过滤掉用户相关字段） */
function useGridFormSchema() {
  const excludeFields = new Set(['userId', 'userNickname']);
  return useOrderGridFormSchema().filter(
    (item) => !excludeFields.has(item.fieldName),
  );
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
  gridApi.query();
}

/** 打开搜索抽屉 */
async function handleSearchShow() {
  drawerApi.open();
  await queryFormApi.setValues(searchParams.value);
}

/** 详情 */
function handleDetail(row: MallOrderApi.Order) {
  push({ name: 'TradeOrderDetail', params: { id: row.id } });
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    expandConfig: {
      trigger: 'row',
      expandAll: true,
      padding: true,
    },
    columns: useGridColumns(),
    layouts: [['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    keepSource: true,
    pagerConfig: {
      pageSize: 10,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getOrderPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            userId: props.userId,
            ...searchParams.value,
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
  } as VxeTableGridOptions<MallOrderApi.Order>,
  showSearchForm: false,
});
</script>

<template>
  <Drawer title="搜索">
    <QueryForm class="query-form" />
  </Drawer>

  <Grid>
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
    <template #expand_content="{ row }">
      <div class="py-2">
        <div
          v-for="item in row.items"
          :key="item.id!"
          class="flex items-start border-b border-gray-100 py-2 last:border-b-0"
        >
          <div class="mr-3 flex-shrink-0">
            <ElImage :src="item.picUrl" class="h-10 w-10" />
          </div>
          <div class="flex-1">
            <div class="mb-1 font-medium">
              {{ item.spuName }}
              <ElTag
                v-for="property in item.properties"
                :key="property.propertyId"
                class="ml-1"
                size="small"
              >
                {{ property.propertyName }}: {{ property.valueName }}
              </ElTag>
            </div>
            <div
              class="flex items-center justify-between text-xs text-gray-500"
            >
              <span>
                原价：{{ fenToYuan(item.price!) }} 元 / 数量：{{ item.count }}个
              </span>
              <DictTag
                :type="DICT_TYPE.TRADE_ORDER_ITEM_AFTER_SALE_STATUS"
                :value="item.afterSaleStatus"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #actions="{ row }">
      <div class="table-toolbar-tools">
        <IconButton
          v-access:code="['trade:order:query']"
          content="详情"
          icon-name="View"
          @click="handleDetail(row)"
        />
      </div>
    </template>
  </Grid>
</template>
