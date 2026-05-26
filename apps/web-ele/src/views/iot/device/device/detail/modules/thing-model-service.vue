<!-- 设备服务调用 -->
<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ThingModelData } from '#/api/iot/thingmodel';

import { computed, onMounted, reactive, watch } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { formatDateTime } from '@vben/utils';

import { ElButton, ElDatePicker, ElSelect, ElSpace, ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDeviceMessagePairPage } from '#/api/iot/device/device';
import {
  getThingModelServiceCallTypeLabel,
  IotDeviceMessageMethodEnum,
  IoTThingModelTypeEnum,
} from '#/views/iot/utils/constants';

const props = defineProps<{
  deviceId: number;
  thingModelList: ThingModelData[];
}>();

/** 查询参数 */
const queryParams = reactive({
  identifier: '',
  times: undefined as [string, string] | undefined,
});

/** 服务类型的物模型数据 */
const serviceThingModels = computed(() => {
  return props.thingModelList.filter(
    (item: ThingModelData) =>
      String(item.type) === String(IoTThingModelTypeEnum.SERVICE),
  );
});

/** Grid 列定义 */
function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'requestTime',
      title: '调用时间',
      width: 180,
      slots: { default: 'requestTime' },
    },
    {
      field: 'responseTime',
      title: '响应时间',
      width: 180,
      slots: { default: 'responseTime' },
    },
    {
      field: 'identifier',
      title: '标识符',
      width: 160,
      slots: { default: 'identifier' },
    },
    {
      field: 'serviceName',
      title: '服务名称',
      width: 160,
      slots: { default: 'serviceName' },
    },
    {
      field: 'callType',
      title: '调用方式',
      width: 100,
      slots: { default: 'callType' },
    },
    {
      field: 'inputParams',
      title: '输入参数',
      minWidth: 200,
      showOverflow: 'tooltip',
      slots: { default: 'inputParams' },
    },
    {
      field: 'outputParams',
      title: '输出参数',
      minWidth: 200,
      showOverflow: 'tooltip',
      slots: { default: 'outputParams' },
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
          return await getDeviceMessagePairPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            deviceId: props.deviceId,
            method: IotDeviceMessageMethodEnum.SERVICE_INVOKE.method,
            identifier: queryParams.identifier || undefined,
            times: queryParams.times,
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

/** 搜索按钮操作 */
function handleQuery() {
  gridApi.query();
}

/** 重置按钮操作 */
function resetQuery() {
  queryParams.identifier = '';
  queryParams.times = undefined;
  handleQuery();
}

/** 获取服务名称 */
function getServiceName(identifier: string | undefined) {
  if (!identifier) return '-';
  const service = serviceThingModels.value.find(
    (item: ThingModelData) => item.identifier === identifier,
  );
  return service?.name || identifier;
}

/** 获取调用方式 */
function getCallType(identifier: string | undefined) {
  if (!identifier) return '-';
  const service = serviceThingModels.value.find(
    (item: ThingModelData) => item.identifier === identifier,
  );
  if (!service?.service?.callType) return '-';
  return getThingModelServiceCallTypeLabel(service.service.callType) || '-';
}

/** 解析输入参数 */
function parseInputParams(params: string) {
  if (!params) return '-';
  try {
    const parsed = JSON.parse(params);
    if (parsed.params) {
      return JSON.stringify(parsed.params, null, 2);
    }
    return JSON.stringify(parsed, null, 2);
  } catch {
    return params;
  }
}

/** 格式化输出参数 */
function formatOutputParams(row: any) {
  if (!row.reply) return '-';
  try {
    return JSON.stringify(
      {
        code: row.reply.code,
        msg: row.reply.msg,
        data: row.reply.data,
      },
      null,
      2,
    );
  } catch {
    return '-';
  }
}

/** 刷新列表 */
function refresh(delay = 0) {
  if (delay > 0) {
    setTimeout(() => gridApi.query(), delay);
  } else {
    gridApi.query();
  }
}

/** 监听设备标识变化 */
watch(
  () => props.deviceId,
  (newValue) => {
    if (newValue) {
      handleQuery();
    }
  },
);

/** 初始化 */
onMounted(() => {
  if (props.deviceId) {
    handleQuery();
  }
});

/** 暴露方法给父组件 */
defineExpose({
  refresh,
});
</script>

<template>
  <Page auto-content-height>
    <!-- 搜索区域 -->
    <div class="search-bar">
      <div class="filter-item">
        <span class="filter-label">标识符：</span>
        <el-select
          v-model="queryParams.identifier"
          clearable
          placeholder="请选择服务标识符"
          style="width: 240px"
        >
          <el-option
            v-for="service in serviceThingModels"
            :key="service.identifier"
            :label="service.name + ' (' + service.identifier + ')'"
            :value="service.identifier"
          />
        </el-select>
      </div>
      <div class="filter-item">
        <span class="filter-label">时间范围：</span>
        <el-date-picker
          v-model="queryParams.times"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 360px"
        />
      </div>
      <el-space>
        <el-button type="primary" @click="handleQuery">
          <IconifyIcon icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <IconifyIcon icon="ep:refresh" />
          重置
        </el-button>
      </el-space>
    </div>

    <!-- 服务调用列表 -->
    <Grid>
      <template #requestTime="{ row }">
        {{
          row.request?.reportTime ? formatDateTime(row.request.reportTime) : '-'
        }}
      </template>
      <template #responseTime="{ row }">
        {{ row.reply?.reportTime ? formatDateTime(row.reply.reportTime) : '-' }}
      </template>
      <template #identifier="{ row }">
        <el-tag type="primary" size="small">
          {{ row.request?.identifier }}
        </el-tag>
      </template>
      <template #serviceName="{ row }">
        {{ getServiceName(row.request?.identifier) }}
      </template>
      <template #callType="{ row }">
        {{ getCallType(row.request?.identifier) }}
      </template>
      <template #inputParams="{ row }">
        <pre class="params-json">{{ parseInputParams(row.request?.params) }}</pre>
      </template>
      <template #outputParams="{ row }">
        <pre v-if="row.reply" class="params-json">{{ formatOutputParams(row) }}</pre>
        <span v-else>-</span>
      </template>
    </Grid>
  </Page>
</template>

<style scoped>
.search-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  white-space: nowrap;
}

.params-json {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 确保表格容器正常显示 */
:deep(.vxe-grid--form-wrapper) {
  display: none;
}
</style>
