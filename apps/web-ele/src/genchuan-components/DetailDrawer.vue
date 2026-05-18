<script setup>
import { computed } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Picture } from '@element-plus/icons-vue';
import { ElIcon, ElImage, ElTag } from 'element-plus';

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
  width: computed(() => props.width),
  mask: false,
  modal: false,
  position: 'right',
  appendToMain: true,
  title: computed(() => props.title),
  showCancelButton: false,
  showConfirmButton: false,
});

const open = () => {
  drawerApi.open();
};

const close = () => {
  drawerApi.close();
  emit('close');
};

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

const formatValue = (field, value) => {
  if (typeof field.formatter === 'function') {
    return field.formatter(value);
  }
  const formatter =
    typeof field.formatter === 'string'
      ? builtinFormatters[field.formatter]
      : null;
  const nextValue = formatter ? formatter(value) : value;
  if (
    field.suffix &&
    nextValue !== undefined &&
    nextValue !== null &&
    nextValue !== '' &&
    nextValue !== '--'
  ) {
    return String(nextValue).endsWith(field.suffix)
      ? nextValue
      : `${nextValue}${field.suffix}`;
  }
  return nextValue ?? '--';
};

// 获取完整图片URL
const getFullImageUrl = (url) => {
  if (!url) return '';
  const imageUrl = Array.isArray(url) ? url[0] : url;
  if (!imageUrl) return '';
  // 如果已经是完整URL，直接返回
  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://') ||
    imageUrl.startsWith('data:image/')
  ) {
    return imageUrl;
  }
  // 如果是相对路径，拼接BASE_URL
  const baseUrl = import.meta.env.VITE_BASE_URL || '';
  return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
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
              <template v-if="field.isLogs">
                <div class="logs-container">
                  <div v-if="item[field.key] && item[field.key].length > 0" class="logs-list">
                    <div v-for="(log, logIndex) in item[field.key]" :key="logIndex" class="log-item">
                      <div class="log-time">{{ formatDateTime(log.time) }}</div>
                      <div class="log-content">
                        <div class="log-operator">操作人: {{ log.operator }}</div>
                        <div class="log-action">操作: {{ log.action }}</div>
                        <div class="log-remark">备注: {{ log.remark }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="logs-empty">暂无日志</div>
                </div>
              </template>
              <template v-else-if="field.type === 'tag'">
                <ElTag
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
                </ElTag>
              </template>
              <template v-else-if="field.type === 'tags'">
                <div class="tags-container">
                  <ElTag
                    v-for="(tag, tagIndex) in formatValue(
                      field,
                      item[field.key],
                    )"
                    :key="tagIndex"
                    :type="
                      (() => {
                        const type = tag.type || 'info';
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
                    size="small"
                    style="margin-right: 4px; margin-bottom: 2px"
                  >
                    {{ tag.label }}
                  </ElTag>
                </div>
              </template>
              <template v-else-if="field.type === 'image'">
                <ElImage
                  v-if="item[field.key]"
                  :src="getFullImageUrl(item[field.key])"
                  :preview-src-list="[getFullImageUrl(item[field.key])]"
                  style="width: 100px; height: 100px; cursor: pointer"
                  fit="cover"
                  crossorigin="anonymous"
                  referrerPolicy="no-referrer"
                >
                  <template #error>
                    <div class="image-error">
                      <ElIcon><Picture /></ElIcon>
                      <span>加载失败</span>
                    </div>
                  </template>
                </ElImage>
                <span v-else class="text-placeholder">暂无图片</span>
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
  padding: 16px;
  margin-bottom: 0;
  background-color: var(--el-bg-color, #fff);
  border: 1px solid var(--el-border-color-light, #ebeef5);
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 8%);
}

.detail-card + .detail-card {
  margin-top: 12px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.detail-item {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;
  align-items: flex-start;
  min-height: 32px;
  padding: 8px 0;
}

.detail-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular, #606266);
  text-align: right;
  word-break: break-word;
}

.detail-value {
  display: flex;
  align-items: center;
  min-height: 22px;
  font-size: 14px;
  color: var(--el-text-color-primary, #303133);
  text-align: left;
  word-break: break-word;
}

.detail-separator {
  display: none;
}

.detail-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 0 0;
  margin-top: 20px;
  border-top: 1px solid var(--el-border-color-light, #ebeef5);
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--el-text-color-secondary);
  background-color: var(--el-fill-color-light);
}

.image-error span {
  margin-top: 4px;
  font-size: 12px;
}

.text-placeholder {
  color: var(--el-text-color-placeholder);
}

.logs-container {
  width: 100%;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background-color: var(--el-fill-color-light, #f5f7fa);
  border-left: 3px solid var(--el-color-primary, #409eff);
  border-radius: 2px;
}

.log-time {
  min-width: 160px;
  font-size: 12px;
  color: var(--el-text-color-secondary, #909399);
  font-weight: 500;
}

.log-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.log-operator,
.log-action,
.log-remark {
  font-size: 13px;
  color: var(--el-text-color-primary, #303133);
  line-height: 1.5;
}

.log-operator {
  font-weight: 500;
}

.logs-empty {
  padding: 12px;
  text-align: center;
  color: var(--el-text-color-placeholder, #a8abb2);
  font-size: 13px;
}
</style>
