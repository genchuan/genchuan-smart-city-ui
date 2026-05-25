<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberPointVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberPoint';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { MemberPointApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberPoint';
import IconButton from '#/components/common/IconButton.vue';

import {
  useGridColumns as usePointGridColumns,
  useGridFormSchema as usePointGridFormSchema,
} from '../../../memberPoint/data';

const props = defineProps<{
  userId: number;
}>();

const searchParams = ref<Record<string, any>>({});

function useGridFormSchema() {
  const excludeFields = new Set(['userId']);
  return usePointGridFormSchema().filter(
    (item) => !excludeFields.has(item.fieldName),
  );
}

function useGridColumns() {
  const excludeFields = new Set(['userId']);
  return usePointGridColumns()?.filter(
    (item) => !item.field || !excludeFields.has(item.field),
  );
}

const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() {
    drawerApi.close();
  },
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

async function onQuerySubmit(values: Record<string, any>) {
  searchParams.value = { ...values };
  await handleRefresh();
  drawerApi.close();
}

function handleRefresh() {
  gridApi.reload();
}

async function handleSearchShow() {
  drawerApi.open();
  await queryFormApi.setValues(searchParams.value);
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await MemberPointApi.getMemberPointPage({
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
  } as VxeTableGridOptions<MemberPointVO>,
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
  </Grid>
</template>
