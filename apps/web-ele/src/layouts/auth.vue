<script lang="ts" setup>
import { AuthPageLayout } from '@vben/layouts';

import logoImg from '#/logo.png';
</script>

<template>
  <AuthPageLayout
    :slogan-image="logoImg"
    page-description="智慧城市一网统管AI平台"
    page-title="城市运行管理服务解决方案"
  >
    <!-- 自定义工具栏 -->
    <!-- <template #toolbar></template> -->
  </AuthPageLayout>
</template>
<style lang="scss">
.flex-col-center {
  img {
    width: 600px;
  }
}
</style>
