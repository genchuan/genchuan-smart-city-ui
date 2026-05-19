<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallAfterSaleApi } from '#/api/mall/trade/afterSale';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenDrawer } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { ElButton, ElImage, ElTabs, ElTag } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAfterSalePage } from '#/api/mall/trade/afterSale';
import IconButton from '#/components/common/IconButton.vue';
import {
  useGridColumns,
  useGridFormSchema,
} from '#/views/mall/trade/afterSale/data';

const props = defineProps<{
  userId: number;
}>();

const { push } = useRouter();

const statusTabs = ref([
  {
    label: '全部',
    value: '0',
  },
]);
const statusTab = ref(statusTabs.value[0]!.value);
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
      clearable: true,
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

/** 处理退款 */
function handleOpenAfterSaleDetail(row: MallAfterSaleApi.AfterSale) {
  push({ name: 'TradeAfterSaleDetail', params: { id: row.id } });
}

/** 查看订单详情 */
function handleOpenOrderDetail(row: MallAfterSaleApi.AfterSale) {
  push({ name: 'TradeOrderDetail', params: { id: row.orderId } });
}

/** 切换售后状态 */
function handleChangeStatus(key: number | string) {
  statusTab.value = key.toString();
  handleRefresh();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    cellConfig: {
      height: 60,
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
          return await getAfterSalePage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            userId: props.userId,
            status:
              statusTab.value === '0' ? undefined : Number(statusTab.value),
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
  } as VxeTableGridOptions<MallAfterSaleApi.AfterSale>,
  showSearchForm: false,
});

/** 初始化 */
onMounted(() => {
  for (const dict of getDictOptions(DICT_TYPE.TRADE_AFTER_SALE_STATUS)) {
    statusTabs.value.push({
      label: dict.label,
      value: dict.value.toString(),
    });
  }
});
</script>

<template>
  <Drawer title="搜索">
    <QueryForm class="query-form" />
  </Drawer>

  <Grid>
    <template #toolbar-actions>
      <ElTabs
        v-model="statusTab"
        class="w-full"
        @tab-change="handleChangeStatus"
      >
        <ElTabs.TabPane
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
    <template #orderNo="{ row }">
      <ElButton type="primary" link @click="handleOpenOrderDetail(row)">
        {{ row.orderNo }}
      </ElButton>
    </template>
    <template #productInfo="{ row }">
      <div class="flex items-start gap-2 text-left">
        <ElImage
          v-if="row.picUrl"
          :src="row.picUrl"
          style="width: 40px; height: 40px"
          :preview-src-list="[row.picUrl]"
        />
        <div class="flex flex-1 flex-col gap-1">
          <span class="text-sm">{{ row.spuName }}</span>
          <div class="mt-1 flex flex-wrap gap-1">
            <ElTag
              v-for="property in row.properties"
              :key="property.propertyId!"
              size="small"
              type="info"
            >
              {{ property.propertyName }}: {{ property.valueName }}
            </ElTag>
          </div>
        </div>
      </div>
    </template>
    <template #actions="{ row }">
      <div class="table-toolbar-tools">
        <IconButton
          content="处理退款"
          icon-name="Operation"
          @click="handleOpenAfterSaleDetail(row)"
        />
      </div>
    </template>
  </Grid>
</template>
