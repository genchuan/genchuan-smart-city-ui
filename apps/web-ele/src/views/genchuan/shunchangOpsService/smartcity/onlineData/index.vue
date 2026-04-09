<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { OnlineDataApi } from '#/api/genchuan/shunchangOpsService/smartcity/onlineData';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { ElTag } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDeviceList } from '#/api/genchuan/shunchangOpsService/smartcity/onlineData';

import { useGridColumns } from './data';

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
  // 设备列表接口不支持查询参数，不显示搜索表单
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
      <!-- 设备状态 -->
      <template #status="{ row }">
        <ElTag :type="row.status === 0 ? 'success' : 'danger'">
          {{ row.status === 0 ? '正常' : '异常' }}
        </ElTag>
      </template>

      <!-- 启用状态 -->
      <template #enable="{ row }">
        <ElTag :type="row.enable === 1 ? 'success' : 'info'">
          {{ row.enable === 1 ? '启用' : '禁用' }}
        </ElTag>
      </template>

      <!-- 告警状态 -->
      <template #warmStatus="{ row }">
        <ElTag :type="row.warmStatus === 0 ? 'success' : 'warning'">
          {{ row.warmStatus === 0 ? '正常' : '异常' }}
        </ElTag>
      </template>

      <!-- 在线状态 -->
      <template #onlineStatus="{ row }">
        <ElTag :type="row.onlineStatus === 1 ? 'success' : 'info'">
          {{ row.onlineStatus === 1 ? '在线' : '离线' }}
        </ElTag>
      </template>

      <!-- 电量告警 -->
      <template #voltageWarm="{ row }">
        <ElTag :type="row.voltageWarm === 0 ? 'success' : 'warning'">
          {{ row.voltageWarm === 0 ? '正常' : '异常' }}
        </ElTag>
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
