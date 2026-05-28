<script lang="ts" setup>
import { ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { isEmpty } from '@vben/utils';

import { ElButton, ElInput } from 'element-plus';

defineOptions({ name: 'KeyValueEditor' });

const props = defineProps<{
  addButtonText: string;
  modelValue: Record<string, string>;
}>();

const emit = defineEmits(['update:modelValue']);

interface KeyValueItem {
  key: string;
  value: string;
}

const items = ref<KeyValueItem[]>([]); // 内部 key-value 项列表

/** 添加项目 */
function addItem() {
  items.value.push({ key: '', value: '' });
  updateModelValue();
}

/** 移除项目 */
function removeItem(index: number) {
  items.value.splice(index, 1);
  updateModelValue();
}

/** 更新 modelValue */
function updateModelValue() {
  const result: Record<string, string> = {};
  items.value.forEach((item) => {
    if (item.key) {
      result[item.key] = item.value;
    }
  });
  emit('update:modelValue', result);
}

/** 监听项目变化 */
watch(items, updateModelValue, { deep: true });
watch(
  () => props.modelValue,
  (val) => {
    // 列表有值后以列表中的值为准
    if (isEmpty(val) || !isEmpty(items.value)) {
      return;
    }
    items.value = Object.entries(props.modelValue).map(([key, value]) => ({
      key,
      value,
    }));
  },
);
</script>

<template>
  <div class="key-value-editor">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="editor-row"
    >
      <el-input
        v-model="item.key"
        class="key-input"
        placeholder="键"
      />
      <el-input
        v-model="item.value"
        class="value-input"
        placeholder="值"
      />
      <el-button
        class="delete-btn"
        text
        type="danger"
        @click="removeItem(index)"
      >
        <IconifyIcon icon="ant-design:delete-outlined" />
        删除
      </el-button>
    </div>
    <el-button text type="primary" @click="addItem">
      <IconifyIcon icon="ant-design:plus-outlined" />
      {{ addButtonText }}
    </el-button>
  </div>
</template>

<style scoped>
.key-value-editor {
  width: 100%;
}

.editor-row {
  display: flex;
  width: 100%;
  margin-bottom: 8px;
  align-items: center;
  gap: 8px;
}

.key-input {
  flex: 1;
}

.value-input {
  flex: 1;
}

.delete-btn {
  flex-shrink: 0;
  margin-left: 0;
}

/* 按钮文本样式调整 */
:deep(.el-button.is-text) {
  padding: 8px 12px;
}

:deep(.el-button.is-text:hover) {
  background-color: transparent;
}
</style>
