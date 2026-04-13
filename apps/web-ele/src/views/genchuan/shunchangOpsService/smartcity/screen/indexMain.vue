<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // 获取大屏页面的完整 URL
  const chartAllRoute = router.resolve({ name: 'ChartAll' });
  const chartAllUrl = window.location.origin + chartAllRoute.href;

  // 在新标签页打开大屏页面（无左侧导航栏的全屏模式）
  window.open(chartAllUrl, '_blank');
});
</script>

<template>
  <div class="screen-redirect-container">
    <div class="loading-text">正在打开态势感知大屏...</div>
  </div>
</template>

<style lang="scss" scoped>
.screen-redirect-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 400px;

  .loading-text {
    font-size: 16px;
    color: #666;
  }
}
</style>
