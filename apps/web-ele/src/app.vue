<script lang="ts" setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';

import { useElementPlusDesignTokens } from '@vben/hooks';

import { ElConfigProvider } from 'element-plus';

import { elementLocale } from '#/locales';

defineOptions({ name: 'App' });

// 获取当前路由实例（响应式）
const route = useRoute();

// 监听路由完整变化（包括路径、参数、查询参数）
watch(
  // 监听的目标：route.fullPath（包含路径+参数+查询参数）
  () => route.fullPath,
  // 回调函数：newVal 新路由，oldVal 旧路由
  () => {
    document.title = '智慧城市一网统管AI平台';
  },
  // 可选配置：immediate 立即执行（组件挂载时触发一次）
  { immediate: true },
);

useElementPlusDesignTokens();
</script>

<template>
  <ElConfigProvider :locale="elementLocale">
    <RouterView />
  </ElConfigProvider>
</template>
<style lang="scss">
.dark {
  .items-center {
    a {
      color: #fff;
    }
  }
}
</style>
