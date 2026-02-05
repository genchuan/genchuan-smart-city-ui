<script setup lang="ts">
defineOptions({
  name: 'DocLink',
});
</script>

<template>
  <div class="w-full sm:mx-auto md:max-w-md">
    <div class="mt-4 flex items-center justify-between">
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
      <span class="text-muted-foreground text-center text-xs uppercase">
        萌新必读
      </span>
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
    </div>

    <div class="mt-4 flex w-full justify-between">
      <a
        href="https://gitee.com/genchuan/Genchuan-Smart-City"
        target="_blank"
        class="text-primary hover:text-primary/80 text-sm"
      >
        📚 开发指南
      </a>
      <a
        href="http://genchuan.cn/"
        target="_blank"
        class="text-primary hover:text-primary/80 text-sm"
      >
        🏢 关于我们
      </a>
      <a
        href="https://appa50w17034868.h5.xet.citv.cn/p/decorate/homepage"
        target="_blank"
        class="text-primary hover:text-primary/80 text-sm"
      >
        🎓 亘川学院
      </a>
      <a
        href="https://gitee.com/genchuan/genchuan-smart-city/raw/master/images/%E5%AE%A2%E6%9C%8D%E5%B0%8F%E4%BD%95.jpg"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary hover:text-primary/80 text-sm"
      >
        📞 定制咨询
      </a>
    </div>
  </div>
</template>
