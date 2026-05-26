<script lang="ts" setup>
import { onMounted } from 'vue';

import { isEmpty } from '@vben/utils';

import { useVModel } from '@vueuse/core';
import { ElFormItem, ElInput, ElInputNumber } from 'element-plus';

defineOptions({ name: 'RedisStreamConfigForm' });

const props = defineProps<{
  modelValue: any;
}>();
const emit = defineEmits(['update:modelValue']);
const config = useVModel(props, 'modelValue', emit) as any;

/** 组件初始化 */
onMounted(() => {
  if (!isEmpty(config.value)) {
    return;
  }
  config.value = {
    url: '',
    password: '',
    database: 0,
    streamKey: '',
  };
});
</script>

<template>
  <div class="redis-stream-config-form">
    <el-form-item label="服务地址" required>
      <el-input
        v-model="config.url"
        placeholder="请输入Redis服务地址，如：redis://127.0.0.1:6379"
      />
    </el-form-item>

    <el-form-item label="密码">
      <el-input
        v-model="config.password"
        type="password"
        placeholder="请输入密码"
        show-password
      />
    </el-form-item>

    <el-form-item label="数据库索引" required>
      <el-input-number
        v-model="config.database"
        :min="0"
        :max="15"
        placeholder="请输入数据库索引"
        class="full-width"
      />
    </el-form-item>

    <el-form-item label="Stream Key" required>
      <el-input v-model="config.streamKey" placeholder="请输入Stream Key" />
    </el-form-item>
  </div>
</template>

<style scoped>
.redis-stream-config-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.full-width {
  width: 100%;
}

/* 表单项样式调整 */
:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

/* 数字输入框宽度调整 */
:deep(.el-input-number) {
  width: 100%;
}
</style>
