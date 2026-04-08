<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { OnlineDataApi } from '#/api/genchuan/shunchangOpsService/smartcity/onlineData';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getDeviceList,
} from '#/api/genchuan/shunchangOpsService/smartcity/onlineData';

import { useGridColumns, useGridFormSchema } from './data';

const router = useRouter();

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 查看设备数据 */
function handleViewData(row: OnlineDataApi.Device) {
  router.push({
    path: '/genchuan-city-ops/online/onlineData',
    query: {
      sn: row.sn,
      name: row.name,
    },
  });
}

const checkedIds = ref<string[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: OnlineDataApi.Device[];
}) {
  checkedIds.value = records.map((item) => item.id);
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
          return await getDeviceList({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
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
  } as VxeTableGridOptions<OnlineDataApi.Device>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="采集设备列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '刷新',
              type: 'primary',
              icon: ACTION_ICON.REFRESH,
              onClick: handleRefresh,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '查看数据',
              type: 'primary',
              link: true,
              icon: ACTION_ICON.VIEW,
              onClick: handleViewData.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
