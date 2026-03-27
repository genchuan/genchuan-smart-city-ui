<script lang="ts" setup>
import { AuthPageLayout } from '@vben/layouts';

import logoImg from '../../public/static/imgs/logo/logo.png';

const companySiteLink = import.meta.env.VITE_COMPANY_SiteLink;
</script>
<template>
  <!--  page-description="城市运行管理服务解决方案"-->
  <!--  page-title="智慧城市一网统管AI平台"-->
  <!--  :slogan-image="logoImg"-->
  <AuthPageLayout
    app-name=""
    page-description=""
    page-title=""
    slogan-image=""
  >
    <!-- 自定义版权插槽，修改登录页面的版权信息 -->
    <template #copyright>
      <div v-if="false" class="text-md flex-center">
        Copyright © 2026
        <a
          :href="companySiteLink"
          class="mx-1 hover:text-primary-hover"
          target="_blank"
        >
          智慧城市一网统管解决方案|闽ICP备19026857号-4
        </a>
      </div>
    </template>
    <!-- 自定义工具栏 -->
    <!-- <template #toolbar></template> -->
  </AuthPageLayout>
</template>
<style>
/* 使用全局样式确保能够覆盖子组件样式 */

/* 解决图片压缩问题，调整大小使其与登录页布局和谐 */
.flex-col-center {
  img {
    width: 350px;
    height: 350px;
  }
}
</style>
