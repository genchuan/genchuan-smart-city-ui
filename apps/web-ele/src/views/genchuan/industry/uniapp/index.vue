<template>
  <div class="redirect-container">
    <!-- 跳转提示文字 -->
    <p>正在跳转，请稍候...</p>
    <!-- 备用手动跳转按钮，防止自动跳转失效 -->
    <button @click="handleRedirect" class="redirect-btn">未跳转？点击手动跳转</button>
  </div>
</template>

<script>
export default {
  name: "index",
  mounted() {
    // 组件挂载完成后，新建标签页自动打开目标地址
    this.handleRedirect();
  },
  methods: {
    /**
     * 新建标签页跳转方法
     * window.open(url, '_blank') ：固定在新标签页打开链接
     */
    handleRedirect() {
      // 目标地址，第二个参数 _blank 表示新标签页打开
      window.open("http://127.0.0.1:9000/", "_blank");
    }
  }
};
</script>

<style scoped>
.redirect-container {
  /* 页面居中布局 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
  font-family: Arial, sans-serif;
}

.redirect-btn {
  margin-top: 20px;
  padding: 10px 24px;
  font-size: 16px;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.redirect-btn:hover {
  background-color: #66b1ff;
}
</style>
