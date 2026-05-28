<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';

import { Page } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { IconifyIcon } from '@vben/icons';
import { formatDateTime } from '@vben/utils';

import { ElButton, ElSelect, ElSpace, ElSwitch, ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDeviceMessagePage } from '#/api/iot/device/device';
import { IotDeviceMessageMethodEnum } from '#/views/iot/utils/constants';

const props = defineProps<{
  deviceId: number;
}>();

/** 查询参数 */
const queryParams = reactive({
  method: undefined,
  upstream: undefined,
});

/** 自动刷新开关 */
const autoRefresh = ref(false);
/** 自动刷新定时器 */
let autoRefreshTimer: any = null;

/** 消息方法选项 */
const methodOptions = computed(() => {
  return Object.values(IotDeviceMessageMethodEnum).map((item) => ({
    label: item.name,
    value: item.method,
  }));
});

/** Grid 列定义 */
function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'ts',
      title: '时间',
      width: 160,
      slots: { default: 'ts' },
    },
    {
      field: 'upstream',
      title: '上行/下行',
      width: 100,
      slots: { default: 'upstream' },
    },
    {
      field: 'reply',
      title: '是否回复',
      width: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.INFRA_BOOLEAN_STRING },
      },
    },
    {
      field: 'requestId',
      title: '请求编号',
      width: 280,
      showOverflow: 'tooltip',
    },
    {
      field: 'method',
      title: '请求方法',
      width: 120,
      slots: { default: 'method' },
    },
    {
      field: 'params',
      title: '请求/响应数据',
      minWidth: 200,
      showOverflow: 'tooltip',
      slots: { default: 'params' },
    },
  ];
}

/** 创建 Grid 实例 */
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          if (!props.deviceId) {
            return { list: [], total: 0 };
          }
          return await getDeviceMessagePage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            deviceId: props.deviceId,
            method: queryParams.method,
            upstream: queryParams.upstream,
          });
        },
      },
    },
    toolbarConfig: {
      refresh: false,
      search: false,
    },
    pagerConfig: {
      enabled: true,
    },
  } as VxeTableGridOptions,
});

/** 搜索操作 */
function handleQuery() {
  gridApi.query();
}

/** 监听自动刷新 */
watch(autoRefresh, (newValue) => {
  if (newValue) {
    autoRefreshTimer = setInterval(() => {
      gridApi.query();
    }, 5000);
  } else {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
  }
});

/** 监听设备标识变化 */
watch(
  () => props.deviceId,
  (newValue) => {
    if (newValue) {
      handleQuery();
    }
  },
);

/** 组件卸载时清除定时器 */
onBeforeUnmount(() => {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
  }
});

/** 初始化 */
onMounted(() => {
  if (props.deviceId) {
    handleQuery();
  }
});

/** 刷新消息列表 */
function refresh(delay = 0) {
  if (delay > 0) {
    setTimeout(() => {
      gridApi.query();
    }, delay);
  } else {
    gridApi.query();
  }
}

/** 暴露方法给父组件 */
defineExpose({
  refresh,
});
</script>

<template>
  <Page auto-content-height>
    <!-- 搜索区域 -->
    <div class="search-bar">
      <el-select
        v-model="queryParams.method"
        clearable
        placeholder="所有方法"
        style="width: 160px"
      >
        <el-option
          v-for="item in methodOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="queryParams.upstream"
        clearable
        placeholder="上行/下行"
        style="width: 160px"
      >
        <el-option label="上行" value="true" />
        <el-option label="下行" value="false" />
      </el-select>
      <el-space>
        <el-button type="primary" @click="handleQuery">
          <IconifyIcon icon="ep:search" class="btn-icon" /> 搜索
        </el-button>
        <el-switch
          v-model="autoRefresh"
          active-text="定时刷新"
          inactive-text="定时刷新"
        />
      </el-space>
    </div>

    <!-- 消息列表 -->
    <Grid>
      <template #ts="{ row }">
        {{ formatDateTime(row.ts) }}
      </template>
      <template #upstream="{ row }">
        <el-tag :type="row.upstream ? 'primary' : 'success'" size="small">
          {{ row.upstream ? '上行' : '下行' }}
        </el-tag>
      </template>
      <template #method="{ row }">
        {{ methodOptions.find((item) => item.value === row.method)?.label }}
      </template>
      <template #params="{ row }">
        <span v-if="row.reply">
          {{ `{"code":${row.code},"msg":"${row.msg}","data":${row.data}\}` }}
        </span>
        <span v-else>{{ row.params }}</span>
      </template>
    </Grid>
  </Page>
</template>

<style scoped>
.search-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.btn-icon {
  margin-right: 4px;
}

/* 确保表格容器正常显示 */
:deep(.vxe-grid--form-wrapper) {
  display: none;
}
</style>
