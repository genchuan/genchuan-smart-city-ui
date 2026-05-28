<script lang="ts" setup>
import { onMounted } from 'vue';

import { isEmpty } from '@vben/utils';

import { useVModel } from '@vueuse/core';
import { ElFormItem, ElInput, ElInputNumber } from 'element-plus';

defineOptions({ name: 'RabbitMQConfigForm' });

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
    host: '',
    port: 5672,
    username: '',
    password: '',
    virtualHost: '/',
    exchange: '',
    routingKey: '',
    queue: '',
  };
});
</script>

<template>
  <div class="rabbitmq-config-form">
    <el-form-item label="主机地址" required>
      <el-input
        v-model="config.host"
        placeholder="请输入主机地址，如：localhost"
      />
    </el-form-item>

    <el-form-item label="端口" required>
      <el-input-number
        v-model="config.port"
        :min="1"
        :max="65535"
        placeholder="请输入端口，如：5672"
        class="full-width"
      />
    </el-form-item>

    <el-form-item label="用户名" required>
      <el-input v-model="config.username" placeholder="请输入用户名" />
    </el-form-item>

    <el-form-item label="密码" required>
      <el-input
        v-model="config.password"
        type="password"
        placeholder="请输入密码"
        show-password
      />
    </el-form-item>

    <el-form-item label="虚拟主机" required>
      <el-input
        v-model="config.virtualHost"
        placeholder="请输入虚拟主机，如：/"
      />
    </el-form-item>

    <el-form-item label="交换机" required>
      <el-input v-model="config.exchange" placeholder="请输入交换机名称" />
    </el-form-item>

    <el-form-item label="路由键" required>
      <el-input v-model="config.routingKey" placeholder="请输入路由键" />
    </el-form-item>

    <el-form-item label="队列" required>
      <el-input v-model="config.queue" placeholder="请输入队列名称" />
    </el-form-item>
  </div>
</template>

<style scoped>
.rabbitmq-config-form {
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
