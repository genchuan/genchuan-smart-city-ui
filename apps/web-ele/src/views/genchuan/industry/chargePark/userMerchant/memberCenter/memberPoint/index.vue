<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  MemberPointCheckReqVO,
  MemberPointPageReqVO,
  MemberPointVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberPoint';

import { DocAlert, Page } from '@vben/common-ui';

import { ElMessage, ElMessageBox } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { MemberPointApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberPoint';

import { useGridColumns, useGridFormSchema } from './data';

/** 判断是否为异常记录 */
function isAbnormalRecord(status?: MemberPointVO['status']) {
  return ['abnormal', '异常', '异常记录'].includes(String(status ?? ''));
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await MemberPointApi.getMemberPointPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...(formValues as MemberPointPageReqVO),
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
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出当前列表 */
async function handleExport() {
  try {
    const formValues =
      (await gridApi.formApi.getValues()) as MemberPointPageReqVO;
    await MemberPointApi.exportMemberPoint(formValues);
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

    <Grid table-title="会员积分列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '导出',
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              onClick: handleExport,
            },
          ]"
        />
      </template>

      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '核查',
              type: 'danger',
              link: true,
              icon: ACTION_ICON.AUDIT,
              ifShow: () => isAbnormalRecord(row.status),
              onClick: handleCheck.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
