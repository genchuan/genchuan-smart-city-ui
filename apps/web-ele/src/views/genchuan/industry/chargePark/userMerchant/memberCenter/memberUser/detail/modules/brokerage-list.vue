<script setup lang="ts">
import type {
  VxeGridPropTypes,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { MallBrokerageUserApi } from '#/api/mall/trade/brokerage/user';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getBrokerageUserPage } from '#/api/mall/trade/brokerage/user';
import IconButton from '#/components/common/IconButton.vue';
import { getRangePickerDefaultProps } from '#/utils';

defineOptions({ name: 'BrokerageList' });

const props = defineProps<{
  userId: number;
}>();

const searchParams = ref<Record<string, any>>({});

const formSchema = (): any[] => {
  return [
    {
      fieldName: 'level',
      label: '用户类型',
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '全部',
            value: 0,
          },
          {
            label: '一级',
            value: 1,
          },
          {
            label: '二级',
            value: 2,
          },
        ],
        placeholder: '请选择用户类型',
        allowClear: true,
      },
    },
    {
      fieldName: 'bindUserTime',
      label: '绑定时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        clearable: true,
      },
    },
  ];
};

const columns = (): VxeGridPropTypes.Columns => {
  return [
    {
      field: 'id',
      title: '用户编号',
    },
    {
      field: 'avatar',
      title: '头像',
      cellRender: {
        name: 'CellImage',
        props: {
          height: 40,
          width: 40,
          shape: 'circle',
        },
      },
    },
    {
      field: 'nickname',
      title: '昵称',
    },
    {
      field: 'level',
      title: '等级',
      formatter: (row: any) => {
        return row.level === 1 ? '一级' : '二级';
      },
    },
    {
      field: 'bindUserTime',
      title: '绑定时间',
      formatter: 'formatDateTime',
    },
  ];
};

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
  schema: formSchema().map((item) => ({
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
    columns: columns(),
    layouts: [['Top', 'Toolbar', 'Table', 'Bottom', 'Pager']],
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getBrokerageUserPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            bindUserId: props.userId,
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
  } as VxeTableGridOptions<MallBrokerageUserApi.BrokerageUser>,
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
