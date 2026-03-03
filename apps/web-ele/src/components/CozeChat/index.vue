<script setup lang="ts">
import { onMounted } from 'vue';

interface CozeChatProps {
  botId: string;
  token: string;
  title?: string;
}

const props = withDefaults(defineProps<CozeChatProps>(), {
  title: 'AI助手',
});

onMounted(() => {
  // 检查 SDK 是否已加载
  if (typeof window === 'undefined' || !(window as any).CozeWebSDK) {
    console.warn('CozeWebSDK 未加载，请确保在 index.html 中引入 SDK');
    return;
  }

  const CozeWebSDK = (window as any).CozeWebSDK;

  // 初始化 Coze 客户端
  new CozeWebSDK.WebChatClient({
    config: {
      bot_id: props.botId,
    },
    componentProps: {
      title: props.title,
    },
    auth: {
      type: 'token',
      token: props.token,
      onRefreshToken: () => props.token,
    },
    ui: {
      base: {
        icon: 'http://192.168.8.68:9000/shunchang/20260303/aiLogo_1772526483764.png',
      },
    },
  });

  // 自定义样式
  customizeStyles();
});

// 自定义 Coze 聊天组件样式
const customizeStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    /* 调整悬浮按钮位置 */
    .ab1ac9d9bab12da47298 {
      bottom: 80px !important;
      right: 20px !important;
    }

    /* 自定义聊天窗口样式 */
    .coze-chat-window {
      border-radius: 12px !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
    }
  `;
  document.head.appendChild(style);
};
</script>

<template>
  <!-- 此组件无需渲染任何内容，仅负责初始化 Coze -->
</template>
