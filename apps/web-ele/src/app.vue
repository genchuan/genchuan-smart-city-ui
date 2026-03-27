<script lang="ts" setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';

import { useElementPlusDesignTokens } from '@vben/hooks';

import { ElConfigProvider } from 'element-plus';

import { CozeChat } from '#/genchuan-components/CozeChat';
import { elementLocale } from '#/locales';

defineOptions({ name: 'App' });

// Coze 配置（建议从环境变量读取）
const COZE_CONFIG = {
  botId: import.meta.env.VITE_COZE_BOT_ID || '7519678747293892634',
  token: import.meta.env.VITE_COZE_TOKEN || 'your-token-here',
  title: import.meta.env.VITE_COZE_TITLE || 'AI助手',
};

// 获取当前路由实例（响应式）
const route = useRoute();

// 监听路由完整变化（包括路径、参数、查询参数）
watch(
  // 监听的目标：route.fullPath（包含路径+参数+查询参数）
  () => route.fullPath,
  // 回调函数：newVal 新路由，oldVal 旧路由
  () => {
    // document.title = '智慧城市一网统管AI平台';
    document.title = import.meta.env.VITE_APP_TITLE;
  },
  // 可选配置：immediate 立即执行（组件挂载时触发一次）
  { immediate: true },
);

useElementPlusDesignTokens();
</script>

<template>
  <!--  <ElConfigProvider :locale="elementLocale">-->
  <!--    <RouterView />-->
  <!--  </ElConfigProvider>-->
  <ElConfigProvider :locale="elementLocale">
    <RouterView />
    <!-- 全局 Coze AI 聊天 -->
    <CozeChat
      :bot-id="COZE_CONFIG.botId"
      :token="COZE_CONFIG.token"
      :title="COZE_CONFIG.title"
    />
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
