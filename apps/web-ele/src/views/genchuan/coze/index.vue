<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  // 打开新标签页并自动登录
  const loginUrl = 'https://code.coze.cn/';
  const username = 'user';
  const password = 'password';

  // 创建登录表单并提交到新窗口
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = loginUrl;
  form.target = '_blank';

  // 添加账号字段
  const usernameInput = document.createElement('input');
  usernameInput.type = 'hidden';
  usernameInput.name = 'username';
  usernameInput.value = username;
  form.append(usernameInput);

  // 添加密码字段
  const passwordInput = document.createElement('input');
  passwordInput.type = 'hidden';
  passwordInput.name = 'password';
  passwordInput.value = password;
  form.append(passwordInput);

  // 将表单添加到文档并提交
  document.body.append(form);
  form.submit();
  form.remove();
});
</script>

<template>
  <div class="coze-container">
    <div class="loading-text">正在跳转至 Coze 平台...</div>
  </div>
</template>

<style scoped lang="scss">
.coze-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}

.loading-text {
  font-size: 16px;
  color: #666;
}
</style>
