<!-- dataType：enum 数组类型 -->
<script lang="ts" setup>
import type { Ref } from 'vue';

import { useVModel } from '@vueuse/core';
import { ElButton, ElFormItem, ElInput, ElMessage } from 'element-plus';

/** 枚举型的 dataSpecs 配置组件 */
defineOptions({ name: 'ThingModelEnumDataSpecs' });

const props = defineProps<{ modelValue: any }>();
const emits = defineEmits(['update:modelValue']);
const dataSpecsList = useVModel(props, 'modelValue', emits) as Ref<any[]>;

/** 添加枚举项 */
function addEnum() {
  dataSpecsList.value.push({
    name: '', // 枚举项的名称
    value: '', // 枚举值
  } as any);
}

/** 删除枚举项 */
function deleteEnum(index: number) {
  if (dataSpecsList.value.length === 1) {
    ElMessage.warning('至少需要一个枚举项');
    return;
  }
  dataSpecsList.value.splice(index, 1);
}
</script>

<template>
  <el-form-item label="枚举项">
    <div class="enum-container">
      <div class="enum-header">
        <span class="enum-header-label">参数值</span>
        <span class="enum-header-label">参数描述</span>
      </div>
      <div
        v-for="(item, index) in dataSpecsList"
        :key="index"
        class="enum-row"
      >
        <div class="enum-value">
          <el-input v-model="item.value" placeholder="请输入枚举值,如'0'" />
        </div>
        <span class="enum-separator">~</span>
        <div class="enum-description">
          <el-input v-model="item.name" placeholder="对该枚举项的描述" />
        </div>
        <el-button class="enum-delete" type="primary" link @click="deleteEnum(index)">
          删除
        </el-button>
      </div>
      <el-button type="primary" link @click="addEnum">+添加枚举项</el-button>
    </div>
  </el-form-item>
</template>

<style scoped>
.enum-container {
  display: flex;
  flex-direction: column;
}

.enum-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.enum-header-label {
  flex: 1;
}

.enum-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.enum-value {
  flex: 1;
}

.enum-separator {
  margin: 0 8px;
}

.enum-description {
  flex: 1;
}

.enum-delete {
  margin-left: 10px;
}

/* 表单项嵌套样式调整 */
:deep(.el-form-item) .el-form-item {
  margin-bottom: 0;
}
</style>
