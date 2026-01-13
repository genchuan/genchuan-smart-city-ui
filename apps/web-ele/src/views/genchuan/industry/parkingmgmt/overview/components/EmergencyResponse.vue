<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { ArrowLeft, FullScreen } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import screenFull from 'screenfull';

const pageContainerRef = ref<HTMLElement | null>(null);
const router = useRouter();

</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="mainbox">
      <div class="top">
        <div class="panel top-left">
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-right">
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left">
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-middle">
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right">
          <div class="panel-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../templatesstyle/common';

// 最外层容器
.page-container {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 0 20px;
  overflow: hidden;
  color: #fff;
  background: url('../../images/bg.jpg');
}

.header-box {
  position: relative;
  width: 100%;
  height: 10vh;
  font-size: 2.1vw;
  font-weight: bold;
  color: #0cf;
  background: url('../../images/head_bg.png') no-repeat;
  background-size: 100% 100%;

  .head-name {
    position: absolute;
    left: 50%;
    display: inline-block;
    line-height: 9vh;
    white-space: nowrap;
    transform: translateX(-50%);
  }
}

.panel {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0.5vw;
  background: url('../../images/line(1).png') rgb(255 255 255 / 4%);
  border: 0.2vh solid rgb(25 186 139 / 17%);
}

.mainbox {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.6vw;
  height: 91vh;
  margin: 0 auto;
}

.top {
  display: flex;
  gap: 0.6vw;
  height: 50%;
}

.top-left {
  flex: 1;
}

.top-right {
  flex: 1;
}

.bottom {
  display: flex;
  gap: 0.6vw;
  height: 46%;
}

.bottom-left {
  flex: 1;
}

.bottom-middle {
  flex: 1;
}

.bottom-right {
  flex: 1;
}
</style>
