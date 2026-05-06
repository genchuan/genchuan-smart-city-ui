<script setup>
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { detailFields, pageConfig } from './table/data.js';

const props = defineProps({
  detailObj: {
    type: Object,
    default: () => ({}),
  },
});

const activeTab = ref('base');
const drawerTitle = computed(() => `${pageConfig.title}详情`);

const [DrawerComponent, drawerApi] = useVbenDrawer({
  appendToMain: true,
  mask: false,
  modal: false,
  position: 'right',
  showCancelButton: false,
  showConfirmButton: false,
  title: drawerTitle,
  width: '48%',
});

const groupedFields = computed(() => {
  const groups = {};
  for (const field of detailFields) {
    const section = field.section || '基础信息';
    if (!groups[section]) {
      groups[section] = [];
    }
    groups[section].push(field);
  }
  return groups;
});

const deviceRows = computed(() => {
  const list = props.detailObj.deviceList || props.detailObj.devices || [];
  if (list.length > 0) return list;
  if (isEmpty(props.detailObj.deviceCount)) return [];
  return [
    {
      deviceCount: props.detailObj.deviceCount,
      deviceNo: '暂无设备明细',
      name: props.detailObj.name,
      stationNo: props.detailObj.stationNo,
      status: props.detailObj.status,
    },
  ];
});

const spaceRows = computed(() => {
  const list =
    props.detailObj.spaceList || props.detailObj.parkingSpaceList || [];
  if (list.length > 0) return list;
  if (isEmpty(props.detailObj.spaceCount)) return [];
  return [
    {
      name: props.detailObj.name,
      spaceCount: props.detailObj.spaceCount,
      spaceNo: '暂无车位明细',
      stationNo: props.detailObj.stationNo,
      status: props.detailObj.status,
    },
  ];
});

const syncLogRows = computed(
  () => props.detailObj.syncLogList || props.detailObj.dataSyncLogList || [],
);

const auditLogRows = computed(
  () => props.detailObj.auditLogList || props.detailObj.operationLogList || [],
);

function padTime(value) {
  return String(value).padStart(2, '0');
}

function formatDateTime(value) {
  if (value === undefined || value === null || value === '') return '--';
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getFullYear()}-${padTime(value.getMonth() + 1)}-${padTime(value.getDate())} ${padTime(value.getHours())}:${padTime(value.getMinutes())}:${padTime(value.getSeconds())}`;
  }
  if (typeof value === 'number' || /^\d+$/.test(String(value))) {
    const text = String(value);
    const timestamp = Number(text.length === 10 ? `${text}000` : text);
    const date = new Date(timestamp);
    if (!Number.isNaN(date.getTime())) return formatDateTime(date);
  }
  const normalized = String(value)
    .replace('T', ' ')
    .replace(/\.\d+Z?$/, '');
  const parsed = new Date(String(value).replaceAll('-', '/'));
  if (!Number.isNaN(parsed.getTime())) return formatDateTime(parsed);
  return normalized.length >= 19 ? normalized.slice(0, 19) : normalized;
}

const builtinFormatters = {
  formatDateTime,
};

function formatValue(field, value) {
  if (Array.isArray(value)) {
    return value.join('、');
  }
  if (isEmpty(value)) {
    return '--';
  }
  if (typeof field.formatter === 'function') {
    return field.formatter(value);
  }
  const formatter =
    typeof field.formatter === 'string'
      ? builtinFormatters[field.formatter]
      : null;
  return formatter ? formatter(value) : value;
}

function open() {
  activeTab.value = 'base';
  drawerApi.open();
}

function close() {
  drawerApi.close();
}

defineExpose({
  open,
  close,
});
</script>

<template>
  <DrawerComponent>
    <el-tabs v-model="activeTab" class="station-detail-tabs">
      <el-tab-pane label="基本信息" name="base">
        <div class="detail-container">
          <div class="detail-card">
            <div
              class="detail-section"
              v-for="(fields, section) in groupedFields"
              :key="section"
            >
              <h4>{{ section }}</h4>
              <div class="detail-content">
                <div
                  class="detail-item"
                  v-for="field in fields"
                  :key="field.key"
                >
                  <span class="detail-label">{{ field.label }}:</span>
                  <span class="detail-value">
                    {{ formatValue(field, props.detailObj[field.key]) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="绑定设备列表" name="devices">
        <el-table v-if="deviceRows.length > 0" :data="deviceRows" border>
          <el-table-column prop="deviceNo" label="设备编号" min-width="130" />
          <el-table-column prop="deviceName" label="设备名称" min-width="140" />
          <el-table-column prop="deviceType" label="设备类型" min-width="120" />
          <el-table-column prop="deviceCount" label="绑定数" min-width="90" />
          <el-table-column prop="status" label="状态" min-width="100" />
        </el-table>
        <el-empty v-else description="暂无绑定设备数据" />
      </el-tab-pane>
      <el-tab-pane label="车位列表" name="spaces">
        <el-table v-if="spaceRows.length > 0" :data="spaceRows" border>
          <el-table-column prop="spaceNo" label="车位编号" min-width="130" />
          <el-table-column prop="garage" label="所属车库" min-width="120" />
          <el-table-column prop="location" label="车位位置" min-width="140" />
          <el-table-column prop="type" label="车位类型" min-width="120" />
          <el-table-column prop="spaceCount" label="车位数" min-width="90" />
          <el-table-column prop="status" label="状态" min-width="100" />
        </el-table>
        <el-empty v-else description="暂无车位数据" />
      </el-tab-pane>
      <el-tab-pane label="数据同步日志" name="sync">
        <el-table v-if="syncLogRows.length > 0" :data="syncLogRows" border>
          <el-table-column prop="syncTime" label="同步时间" min-width="160" />
          <el-table-column prop="syncType" label="同步类型" min-width="120" />
          <el-table-column prop="status" label="状态" min-width="100" />
          <el-table-column prop="message" label="同步结果" min-width="180" />
        </el-table>
        <el-empty v-else description="暂无数据同步日志" />
      </el-tab-pane>
      <el-tab-pane label="操作审计日志" name="audit">
        <el-table v-if="auditLogRows.length > 0" :data="auditLogRows" border>
          <el-table-column prop="operator" label="操作人" min-width="120" />
          <el-table-column
            prop="operateTime"
            label="操作时间"
            min-width="160"
          />
          <el-table-column prop="content" label="操作内容" min-width="220" />
        </el-table>
        <el-empty v-else description="暂无操作审计日志" />
      </el-tab-pane>
    </el-tabs>
  </DrawerComponent>
</template>

<style scoped>
.station-detail-tabs {
  padding: 0 4px;
}

.detail-container {
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
}

.detail-card {
  padding: 16px;
  margin-bottom: 12px;
  background-color: var(--el-bg-color, #fff);
  border: 1px solid var(--el-border-color-light, #ebeef5);
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.detail-section {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.detail-section:last-child {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: 0;
}

.detail-section h4 {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
  padding: 2px 0;
}

.detail-label {
  width: 120px;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular, #606266);
  text-align: right;
}

.detail-value {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  color: var(--el-text-color-primary, #303133);
  text-align: left;
  word-break: break-all;
}
</style>
