<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { OnlineDataApi } from '#/api/genchuan/shunchangOpsService/smartcity/onlineData';

import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElCard,
  ElDescriptions,
  ElDescriptionsItem,
  ElTag,
} from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDeviceData } from '#/api/genchuan/shunchangOpsService/smartcity/onlineData';
import { formatDate } from '#/utils/genchuan/formatTime';

import { useDeviceDataColumns, useDeviceDataFormSchema } from './data';

const route = useRoute();
const router = useRouter();

// 从路由参数获取设备信息
const deviceSn = computed(() => (route.query.sn as string) || '');
const deviceName = computed(() => (route.query.name as string) || '');

// 返回设备列表
function handleBack() {
  router.push('/genchuan-city-ops/online/onlineDvice');
}

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

const checkedIds = ref<string[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: OnlineDataApi.DeviceData[];
}) {
  checkedIds.value = records.map((item) => item.sn);
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useDeviceDataFormSchema(),
  },
  gridOptions: {
    columns: useDeviceDataColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          console.log('[deviceData] formValues:', formValues);

          // 处理时间范围
          let startTime = '';
          let endTime = '';

          // 检查 timeRange 字段
          const timeRange = formValues.timeRange;
          if (timeRange) {
            console.log('[deviceData] timeRange:', timeRange, 'type:', typeof timeRange, 'isArray:', Array.isArray(timeRange));

            if (Array.isArray(timeRange) && timeRange.length === 2) {
              // 如果已经是格式化的字符串，直接使用
              if (typeof timeRange[0] === 'string') {
                startTime = timeRange[0];
                endTime = timeRange[1];
              } else if (timeRange[0] instanceof Date) {
                // 如果是 Date 对象，格式化为字符串
                startTime = formatDate(timeRange[0]);
                endTime = formatDate(timeRange[1]);
              }
            }
          }

          console.log('[deviceData] startTime:', startTime, 'endTime:', endTime);

          return await getDeviceData({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            sn: deviceSn.value || formValues.sn,
            start: startTime,
            end: endTime,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'sn',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<OnlineDataApi.DeviceData>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});

// 页面加载时自动查询
onMounted(() => {
  if (deviceSn.value) {
    gridApi.query();
  }
});
</script>

<template>
  <Page auto-content-height>
    <!-- 设备信息卡片 -->
    <ElCard class="mb-4" v-if="deviceSn">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-medium">设备信息</span>
          <ElButton type="primary" @click="handleBack">
            <template #icon>
              <IconifyIcon icon="ep:arrow-left" />
            </template>
            返回列表
          </ElButton>
        </div>
      </template>
      <ElDescriptions :column="4" border>
        <ElDescriptionsItem label="设备名称">
          {{ deviceName }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="设备SN码">
          <ElTag type="primary">{{ deviceSn }}</ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="设备类型">
          <ElTag type="success">液位计</ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="数据类型">
          <ElTag type="info">实时监测数据</ElTag>
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>

    <!-- 数据列表 -->
    <Grid :table-title="`${deviceName || '设备'} - 采集数据列表`">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '返回',
              type: 'default',
              icon: ACTION_ICON.CLOSE,
              onClick: handleBack,
            },
            {
              label: '刷新',
              type: 'primary',
              icon: ACTION_ICON.REFRESH,
              onClick: handleRefresh,
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
