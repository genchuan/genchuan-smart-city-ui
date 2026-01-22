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

const [DetailDrawer, drawerApi] = useVbenDrawer({
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

defineExpose({
  open,
  close,
});
</script>

<template>
  <DetailDrawer>
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
                <el-tag :type="field.tagType?.(item[field.key]) || 'info'">
                  {{ item[field.key] }}
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
  </DetailDrawer>
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
  background-color: #fff;
  border: 1px solid #ebeef5;
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
  color: #606266;
  text-align: right;
}

.detail-value {
  flex: 1;
  font-size: 14px;
  color: #303133;
  text-align: left;
}

.detail-separator {
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px dashed #ebeef5;
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
