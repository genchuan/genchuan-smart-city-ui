<script setup>
import { Loading } from '@element-plus/icons-vue';

defineProps({
  text: {
    type: String,
    default: '加载中...',
  },
});
</script>

<template>
  <div class="loading-overlay">
    <el-icon class="loading-icon"><Loading /></el-icon>
    <span>{{ text }}</span>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(255 255 255 / 80%);
  border-radius: 8px;
}

.loading-icon {
  margin-bottom: 16px;
  font-size: 48px;
  color: #409eff;
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
