<script>
export default {
  name: 'Index',
  methods: {
    // 跳转视频播放地址的方法
    jumpToVideoPlayUrl() {
      // 目标跳转地址
      const targetUrl = 'http://192.168.8.201:9528/#/live';

      // 方式1：在当前窗口跳转（默认）
      window.location.href = targetUrl;

      // 方式2：新窗口打开（如需替换方式1，取消下面注释即可）
      // window.open(targetUrl, '_blank');
    },
  },
};
</script>

<template>
  <!-- 外层容器占满整个屏幕，绑定点击事件 -->
  <div class="video-stream-page" @click="jumpToVideoPlayUrl">
    <!-- 可选：添加提示文本，也可以删除 -->
    <div class="click-tip">点击页面任意位置播放视频</div>
  </div>
</template>

<style scoped>
/* 让页面容器占满整个屏幕 */
.video-stream-page {
  /* 可选：居中显示提示文本 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;

  /* 鼠标悬浮显示手型，提示可点击 */
  cursor: pointer;
  background-color: #f5f5f5;
}

/* 提示文本样式（可选） */
.click-tip {
  font-size: 16px;
  color: #666;
}
</style>
