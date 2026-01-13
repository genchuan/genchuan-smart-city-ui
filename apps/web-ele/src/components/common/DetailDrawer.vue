<script setup>
import { computed } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  title: {
    type: String,
    default: '详情',
  },
  data: {
    type: Object,
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

const [DetailDrawer, drawerApi] = useVbenDrawer({
  width: props.width,
  mask: false,
  modal: false,
  position: 'right',
  appendToMain: true,
  title: computed(() => props.title),
  showCancelButton: true,
  showConfirmButton: true,
  cancelButtonOptions: {
    content: '取消',
  },
  confirmButtonOptions: {
    content: '确定',
  },
  onCancel() {
    drawerApi.close();
    emit('close');
  },
  onConfirm() {
    drawerApi.close();
    emit('confirm');
  },
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

defineExpose({
  open,
  close,
});
</script>

<template>
  <DetailDrawer>
    <div class="detail-container">
      <div class="detail-card">
        <div v-if="data" class="detail-content">
          <div class="detail-item" v-for="field in fields" :key="field.key">
            <span class="detail-label">{{ field.label }}:</span>
            <span class="detail-value">
              <template v-if="field.type === 'tag'">
                <el-tag :type="field.tagType?.(data[field.key]) || 'info'">
                  {{ data[field.key] }}
                </el-tag>
              </template>
              <template v-else>
                {{ formatValue(field, data[field.key]) }}
              </template>
            </span>
          </div>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped>
.detail-container {
  box-sizing: border-box;
  height: 100%;
  padding: 20px;
}

.detail-card {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
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
  width: 100px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  text-align: right;
}

.detail-value {
  flex: 1;
  font-size: 14px;
  color: #303133;
  text-align: left;
}

.detail-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 0 0;
  margin-top: 20px;
  border-top: 1px solid #ebeef5;
}
</style>
