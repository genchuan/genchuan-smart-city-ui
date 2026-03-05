<script lang="ts" setup name="ThingsBoard">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useThingsBoardAuth } from '#/composables/useThingsBoardAuth';

const route = useRoute();
const { ensureThingsBoardLogin, reLogin } = useThingsBoardAuth();

const url = ref('');
const iframeRef = ref<HTMLIFrameElement | null>(null);
const loading = ref(true);
const error = ref('');

// 定义要添加到 body 的 class 名称
const customClass = 'custom-body-class';

const addClassToBody = () => {
  document.body.classList.add(customClass);
};

const removeClassFromBody = () => {
  document.body.classList.remove(customClass);
};

// 处理 iframe 加载完成
const handleIframeLoad = () => {
  loading.value = false;
  error.value = '';
};

// 处理 iframe 加载错误
const handleIframeError = () => {
  loading.value = false;
  error.value = '加载失败，请刷新页面重试';
};

// 加载仪表盘
const loadDashboard = async () => {
  loading.value = true;
  error.value = '';

  // 先确保 ThingsBoard 已登录
  const isAuthenticated = await ensureThingsBoardLogin();

  if (!isAuthenticated) {
    loading.value = false;
    error.value = 'ThingsBoard 登录失败，请检查配置';
    return;
  }

  // 构建完整的 ThingsBoard URL
  const baseUrl = import.meta.env.VITE_THINGS_BOARD_URL;
  const routeName = route.name as string;
  url.value = `${baseUrl}${routeName}`;
};

// 刷新 iframe
const refreshIframe = async () => {
  loading.value = true;
  error.value = '';

  // 强制重新登录
  const isAuthenticated = await reLogin();

  if (!isAuthenticated) {
    loading.value = false;
    error.value = 'ThingsBoard 登录失败，请检查配置';
    return;
  }

  // 强制重新加载 iframe
  const currentSrc = url.value;
  url.value = '';
  setTimeout(() => {
    url.value = currentSrc;
  }, 100);
};

// 挂载完毕
onMounted(() => {
  addClassToBody();
  loadDashboard();
});

// 在组件卸载时移除 class
onUnmounted(() => {
  removeClassFromBody();
});

// 监听路由变化，更新 iframe URL
watch(
  () => route.name,
  () => {
    loadDashboard();
  },
);
</script>

<template>
  <div class="thingsboard-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>正在加载仪表盘...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-overlay">
      <div class="error-content">
        <p>{{ error }}</p>
        <button @click="refreshIframe" class="refresh-btn">刷新重试</button>
      </div>
    </div>

    <!-- 提示信息 -->
<!--    <div v-if="!loading && !error" class="info-banner">-->
<!--      <span>如果仪表盘无法显示，请尝试</span>-->
<!--      <button @click="refreshIframe" class="link-btn">点击刷新</button>-->
<!--    </div>-->

    <!-- iframe -->
    <iframe
      v-show="!loading && !error"
      :src="url"
      frameborder="0"
      ref="iframeRef"
      width="100%"
      class="iframe-css"
      scrolling="auto"
      @load="handleIframeLoad"
      @error="handleIframeError"
    ></iframe>
  </div>
</template>

<style lang="scss" scoped>
.thingsboard-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  z-index: 10;
}

.loading-spinner {
  text-align: center;
  color: #606266;

  p {
    margin-top: 16px;
    font-size: 14px;
  }
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border: 3px solid #e4e7ed;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-content {
  text-align: center;
  color: #606266;

  p {
    margin-bottom: 16px;
    font-size: 14px;
  }
}

.refresh-btn {
  padding: 8px 20px;
  font-size: 14px;
  color: #fff;
  background-color: #409eff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #66b1ff;
  }
}

.info-banner {
  padding: 8px 16px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  margin: 8px;
  font-size: 13px;
  color: #096dd9;
  display: flex;
  align-items: center;
  gap: 8px;

  .link-btn {
    color: #1890ff;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    font-size: 13px;

    &:hover {
      color: #40a9ff;
    }
  }
}

.iframe-css {
  flex: 1;
  width: 100%;
  border: none;
  min-height: 0;
}
</style>

<style lang="scss">
.custom-body-class .cc-iframe {
  padding: 0px !important;
}
</style>
