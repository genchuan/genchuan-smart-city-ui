<script lang="ts" setup>
import { onMounted } from 'vue';

import { isEmpty } from '@vben/utils';

import { useVModel } from '@vueuse/core';
import { ElFormItem, ElInput } from 'element-plus';

defineOptions({ name: 'RocketMQConfigForm' });

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
    nameServer: '',
    accessKey: '',
    secretKey: '',
    group: '',
    topic: '',
    tags: '',
  };
});
</script>

<template>
  <div class="rocketmq-config-form">
    <el-form-item label="NameServer" required>
      <el-input
        v-model="config.nameServer"
        placeholder="请输入 NameServer 地址，如：127.0.0.1:9876"
      />
    </el-form-item>

    <el-form-item label="AccessKey" required>
      <el-input v-model="config.accessKey" placeholder="请输入 AccessKey" />
    </el-form-item>

    <el-form-item label="SecretKey" required>
      <el-input
        v-model="config.secretKey"
        type="password"
        placeholder="请输入 SecretKey"
        show-password
      />
    </el-form-item>

    <el-form-item label="消费组" required>
      <el-input v-model="config.group" placeholder="请输入消费组" />
    </el-form-item>

    <el-form-item label="主题" required>
      <el-input v-model="config.topic" placeholder="请输入主题" />
    </el-form-item>

    <el-form-item label="标签">
      <el-input v-model="config.tags" placeholder="请输入标签" />
    </el-form-item>
  </div>
</template>

<style scoped>
.rocketmq-config-form {
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
