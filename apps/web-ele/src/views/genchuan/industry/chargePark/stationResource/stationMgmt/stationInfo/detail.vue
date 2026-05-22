<script setup>
import { computed } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { detailFields, pageConfig } from './table/data.js';

const props = defineProps({
  detailObj: {
    type: Object,
    default: () => ({}),
  },
});

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
    <div class="detail-container">
      <div class="detail-card">
        <div class="detail-content">
          <div
            class="detail-item"
            v-for="field in detailFields"
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
  </DrawerComponent>
</template>

<style scoped>
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
