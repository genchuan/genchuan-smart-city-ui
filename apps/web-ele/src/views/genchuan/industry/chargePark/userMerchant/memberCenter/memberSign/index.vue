<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  MemberSignPageReqVO,
  MemberSignVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberSign';

import { computed, ref } from 'vue';

import { DocAlert, Page, useVbenDrawer } from '@vben/common-ui';

import { ElMessage } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { MemberSignApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberSign';
import IconButton from '#/components/common/IconButton.vue';
import DetailDrawer from '#/genchuan-components/DetailDrawer.vue';

import { useGridColumns, useGridFormSchema } from './data';

const detailDrawerRef = ref<null | { open: () => void }>(null);
const detailObj = ref<MemberSignVO>();

const detailFields = ref([
  { key: 'nickname', label: '用户名称' },
  { key: 'createTime', label: '签到时间' },
  { key: 'point', label: '积分奖励' },
  { key: 'day', label: '连续签到天数' },
  { key: 'description', label: '积分发放说明' },
]);

const detailData = computed(() => {
  if (!detailObj.value) {
    return undefined;
  }

  return {
    ...detailObj.value,
    description: detailObj.value.description || '签到成功后自动发放积分',
  };
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

          return await MemberSignApi.getMemberSignPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...(queryValues as MemberSignPageReqVO),
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
  } as VxeTableGridOptions<MemberSignVO>,
  showSearchForm: false,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 打开搜索抽屉 */
async function handleSearchShow() {
  drawerApi.open();
  await queryFormApi.setValues(searchParams.value);
}

/** 导出当前列表 */
async function handleExport() {
  try {
    await MemberSignApi.exportMemberSign(
      searchParams.value as MemberSignPageReqVO,
    );
    ElMessage.success('导出成功');
  } catch {
    ElMessage.error('导出失败');
  }
}

/** 查看签到详情 */
async function handleDetail(row: MemberSignVO) {
  detailObj.value = await MemberSignApi.getMemberSign(Number(row.id));
  detailDrawerRef.value?.open();
}
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="会员等级、积分、签到"
        url="https://doc.iocoder.cn/member/level/"
      />
    </template>

    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <IconButton
            content="导出"
            icon-name="download"
            @click="handleExport"
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
            content="查看"
            icon-name="View"
            @click="handleDetail(row)"
          />
        </div>
      </template>
    </Grid>

    <DetailDrawer
      ref="detailDrawerRef"
      :data="detailData"
      :fields="detailFields"
      :title="detailObj ? `${detailObj.nickname}签到详情` : '签到详情'"
    />
  </Page>
</template>
