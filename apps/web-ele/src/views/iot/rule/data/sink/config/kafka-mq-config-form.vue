<script lang="ts" setup>
import { onMounted } from 'vue';

import { isEmpty } from '@vben/utils';

import { useVModel } from '@vueuse/core';
import { ElFormItem, ElInput, ElSwitch } from 'element-plus';

defineOptions({ name: 'KafkaMQConfigForm' });

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
    bootstrapServers: '',
    username: '',
    password: '',
    ssl: false,
    topic: '',
  };
});
</script>

<template>
  <div class="kafka-config-form">
    <el-form-item label="服务地址" required>
      <el-input
        v-model="config.bootstrapServers"
        placeholder="请输入服务地址，如：localhost:9092"
      />
    </el-form-item>

    <el-form-item label="用户名">
      <el-input v-model="config.username" placeholder="请输入用户名" />
    </el-form-item>

    <el-form-item label="密码">
      <el-input
        v-model="config.password"
        type="password"
        placeholder="请输入密码"
        show-password
      />
    </el-form-item>

    <el-form-item label="启用 SSL" required>
      <el-switch v-model="config.ssl" />
    </el-form-item>

    <el-form-item label="主题" required>
      <el-input v-model="config.topic" placeholder="请输入主题" />
    </el-form-item>
  </div>
</template>

<style scoped>
.kafka-config-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 表单项样式调整 */
:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
