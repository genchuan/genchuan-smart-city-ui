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

const formatValue = (field, value) => {
  if (field.formatter) {
    return field.formatter(value);
  }
  return value;
};

// 获取完整图片URL
const getFullImageUrl = (url) => {
  if (!url) return '';
  // 如果已经是完整URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // 如果是相对路径，拼接BASE_URL
  const baseUrl = import.meta.env.VITE_BASE_URL || '';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
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
              <template v-else-if="field.type === 'tags'">
                <div class="tags-container">
                  <el-tag
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
                  </el-tag>
                </div>
              </template>
              <template v-else-if="field.type === 'image'">
                <el-image
                  v-if="item[field.key]"
                  :src="getFullImageUrl(item[field.key])"
                  :preview-src-list="[getFullImageUrl(item[field.key])]"
                  style="width: 100px; height: 100px; cursor: pointer"
                  fit="cover"
                >
                  <template #error>
                    <div class="image-error">
                      <el-icon><Picture /></el-icon>
                      <span>加载失败</span>
                    </div>
                  </template>
                </el-image>
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
</style>
