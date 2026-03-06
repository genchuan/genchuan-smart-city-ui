<template>
  <!-- 外层容器占满整个屏幕，绑定点击事件 -->
  <div
    class="video-stream-page"
    @click="jumpToVideoPlayUrl"
  >
    <!-- 可选：添加提示文本，也可以删除 -->
    <div class="click-tip">点击页面任意位置播放视频</div>
  </div>
</template>

<script>
export default {
  name: "index",
  methods: {
    // 跳转视频播放地址的方法
    jumpToVideoPlayUrl() {
      // 目标跳转地址
      const targetUrl = 'http://192.168.8.201:9528/#/play/wasm/ws%3A%2F%2F192.168.8.201%3A80%2Frtp%2F41010500002000000001_34020000001320000001.live.flv%3ForiginTypeStr%3Drtp_push%26audioCodec%3DG711A%26videoCodec%3DH265';

      // 方式1：在当前窗口跳转（默认）
      window.location.href = targetUrl;

      // 方式2：新窗口打开（如需替换方式1，取消下面注释即可）
      // window.open(targetUrl, '_blank');
    }
  }
}
</script>

<style scoped>
/* 让页面容器占满整个屏幕 */
.video-stream-page {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  /* 鼠标悬浮显示手型，提示可点击 */
  cursor: pointer;
  /* 可选：居中显示提示文本 */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

/* 提示文本样式（可选） */
.click-tip {
  font-size: 16px;
  color: #666;
}
</style>
