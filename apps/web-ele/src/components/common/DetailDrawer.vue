<script setup>
import { computed } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  title: {
    type: String,
    default: '详情',
  },
  data: {
    type: [Object, Array],
    default: null,
  },
  fields: {
    type: Array,
    default: () => [],
  },
  width: {
    type: String,
    default: '50%',
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['close', 'confirm']);

const [DrawerComponent, drawerApi] = useVbenDrawer({
  width: props.width,
  mask: false,
  modal: false,
  position: 'right',
  appendToMain: true,
  title: computed(() => props.title),
  showCancelButton: false,
  showConfirmButton: false,
  // cancelButtonOptions: {
  //   content: '取消',
  // },
  // confirmButtonOptions: {
  //   content: '确定',
  // },
  // onCancel() {
  //   drawerApi.close();
  //   emit('close');
  // },
  // onConfirm() {
  //   drawerApi.close();
  //   emit('confirm');
  // },
});

const open = () => {
  drawerApi.open();
};

const close = () => {
  drawerApi.close();
  emit('close');
};

const padTime = (value) => String(value).padStart(2, '0');

const formatDateTime = (value) => {
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
};

const builtinFormatters = {
  formatDateTime,
};

const formatValue = (field, value) => {
  if (typeof field.formatter === 'function') {
    return field.formatter(value);
  }
  const formatter =
    typeof field.formatter === 'string'
      ? builtinFormatters[field.formatter]
      : null;
  let nextValue = value;
  if (formatter) {
    nextValue = formatter(value);
  } else if (Array.isArray(value)) {
    nextValue = value.join('、');
  }
  if (
    field.suffix &&
    nextValue !== undefined &&
    nextValue !== null &&
    nextValue !== '' &&
    nextValue !== '--'
  ) {
    return `${nextValue}${field.suffix}`;
  }
  return nextValue ?? '--';
};

defineExpose({
  open,
  close,
});
</script>

<template>
  <DrawerComponent>
    <div class="detail-container">
      <div
        class="detail-card"
        v-for="(item, index) in Array.isArray(data) ? data : [data]"
        :key="index"
      >
        <div class="detail-content">
          <div class="detail-item" v-for="field in fields" :key="field.key">
            <span class="detail-label">{{ field.label }}:</span>
            <span class="detail-value">
              <template v-if="field.type === 'tag'">
                <el-tag
                  :type="
                    (() => {
                      const type = field.tagType?.(item[field.key]) || 'info';
                      // 支持所有字典配置的颜色类型映射
                      const colorTypeMap = {
                        danger: 'danger',
                        error: 'danger',
                        info: 'info',
                        primary: 'primary',
                        success: 'success',
                        warning: 'warning',
                        blue: 'primary',
                        green: 'success',
                        orange: 'warning',
                        cyan: 'info',
                        purple: 'primary',
                        pink: 'danger',
                        red: 'danger',
                        yellow: 'warning',
                      };
                      return colorTypeMap[type] || type || 'info';
                    })()
                  "
                >
                  {{ formatValue(field, item[field.key]) }}
                </el-tag>
              </template>
              <template v-else>
                {{ formatValue(field, item[field.key]) }}
              </template>
            </span>
          </div>
        </div>
        <div
          v-if="index < (Array.isArray(data) ? data.length - 1 : 0)"
          class="detail-separator"
        ></div>
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
  padding: 20px;
  margin-bottom: 16px;
  background-color: var(--el-bg-color, #fff);
  border: 1px solid var(--el-border-color-light, #ebeef5);
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.detail-card:last-child {
  margin-bottom: 0;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 4px 0;
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
  font-size: 14px;
  color: var(--el-text-color-primary, #303133);
  text-align: left;
}

.detail-separator {
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px dashed var(--el-border-color-light, #ebeef5);
}

.detail-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 0 0;
  margin-top: 20px;
  border-top: 1px solid var(--el-border-color-light, #ebeef5);
}
</style>
