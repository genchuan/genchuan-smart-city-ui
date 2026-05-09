<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  MemberPointCheckReqVO,
  MemberPointPageReqVO,
  MemberPointVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberPoint';

import { ref } from 'vue';

import { DocAlert, Page, useVbenDrawer } from '@vben/common-ui';

import { ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { MemberPointApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberPoint';
import IconButton from '#/components/common/IconButton.vue';

import { useGridColumns, useGridFormSchema } from './data';

/** 判断是否为异常记录 */
function isAbnormalRecord(status?: MemberPointVO['status']) {
  return ['abnormal', '异常', '异常记录'].includes(String(status ?? ''));
}

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

          return await MemberPointApi.getMemberPointPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...(queryValues as MemberPointPageReqVO),
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

/** 刷新表格 */
function handleRefresh() {
  gridApi.reload();
}

/** 打开搜索抽屉 */
async function handleSearchShow() {
  drawerApi.open();
  await queryFormApi.setValues(searchParams.value);
}

/** 导出当前列表 */
async function handleExport() {
  try {
    await MemberPointApi.exportMemberPoint(
      searchParams.value as MemberPointPageReqVO,
    );
    ElMessage.success('导出成功');
  } catch {
    ElMessage.error('导出失败');
  }
}

/** 核查积分记录 */
async function handleCheck(row: MemberPointVO) {
  try {
    const { value } = await ElMessageBox.prompt('请输入核查结果', '核查记录', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^\s*\S[\s\S]*$/,
      inputErrorMessage: '核查结果不能为空',
    });

    const payload: MemberPointCheckReqVO = {
      id: Number(row.id),
      checkResult: value.trim(),
    };

    await MemberPointApi.checkMemberPoint(payload);
    ElMessage.success('核查成功');
    handleRefresh();
  } catch {
    // 取消核查不做额外处理
  }
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
            v-if="isAbnormalRecord(row.status)"
            content="核查"
            icon-name="DocumentChecked"
            color="#F56C6C"
            @click="handleCheck(row)"
          />
        </div>
      </template>
    </Grid>
  </Page>
</template>
