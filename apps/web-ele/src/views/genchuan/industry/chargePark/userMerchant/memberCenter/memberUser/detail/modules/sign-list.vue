<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberSignInRecordApi } from '#/api/member/signin/record';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSignInRecordPage } from '#/api/member/signin/record';
import IconButton from '#/components/common/IconButton.vue';
import {
  useGridColumns as useSignInGridColumns,
  useGridFormSchema as useSignInGridFormSchema,
} from '#/views/member/signin/record/data';

const props = defineProps<{
  userId: number;
}>();

const searchParams = ref<Record<string, any>>({});

/** 列表的搜索表单（过滤掉用户相关字段） */
function useGridFormSchema() {
  const excludeFields = new Set(['nickname']);
  return useSignInGridFormSchema().filter(
    (item) => !excludeFields.has(item.fieldName),
  );
}

/** 列表的字段（过滤掉用户相关字段） */
function useGridColumns() {
  const excludeFields = new Set(['nickname']);
  return useSignInGridColumns()?.filter(
    (item) => item.field && !excludeFields.has(item.field),
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

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    layouts: [['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getSignInRecordPage({
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
  } as VxeTableGridOptions<MemberSignInRecordApi.SignInRecord>,
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
