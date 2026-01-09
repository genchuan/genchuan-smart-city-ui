<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ArrowLeft, FullScreen } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import screenFull from 'screenfull';

const pageContainerRef = ref<HTMLElement | null>(null);
let timeTimer: NodeJS.Timeout | null = null;
const router = useRouter();

const handleBack = () => {
  router.push('/');
};

const clickFullscreen = () => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const targetEl = pageContainerRef.value;
  screenFull.isFullscreen ? screenFull.exit() : screenFull.request(targetEl);
};

const updateShowTime = () => {
  const dt = new Date();
  const y = dt.getFullYear();
  const mt = dt.getMonth() + 1;
  const day = dt.getDate();
  const h = dt.getHours().toString().padStart(2, '0');
  const m = dt.getMinutes().toString().padStart(2, '0');
  const s = dt.getSeconds().toString().padStart(2, '0');

  const showTimeEl = document.querySelector('.showTime');
  if (showTimeEl) {
    showTimeEl.innerHTML = `当前时间：${y}年${mt}月${day}日 ${h}时${m}分${s}秒`;
  }
};

onMounted(() => {
  updateShowTime();
  timeTimer = setInterval(updateShowTime, 1000);
});

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer);
});
</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="header-box">
      <button class="back-button" @click="handleBack">
        <el-icon color="#00ccff" :size="`${1.2}vw`">
          <ArrowLeft />
        </el-icon>
      </button>
      <span class="head-name">停车管理-应急指挥视图</span>
      <div class="showTime h1-time"></div>
      <button class="fullScreenBut" @click="clickFullscreen">
        <el-icon color="#00ccff" :size="`${1.2}vw`">
          <FullScreen />
        </el-icon>
      </button>
    </div>
    <div class="mainbox">
      <div class="top">
        <div class="panel top-left">
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-middle">
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-right">
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="panel bottom-left1">
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-left2">
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right1">
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right2">
          <div class="panel-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../templatesstyle/common.scss';
@import '../../templatesstyle/operation-indicators.scss';
@import '../../templatesstyle/resource-indicators.scss';
@import '../../templatesstyle/service-indicators.scss';
@import '../../templatesstyle/efficiency-indicators.scss';
@import '../../templatesstyle/compliance-indicators.scss';
@import '../../templatesstyle/risk-indicators.scss';
@import '../../templatesstyle/development-indicators.scss';

// 最外层容器
.page-container {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 0 20px;
  overflow: hidden;
  color: #fff;
  background: url('../images/bg.jpg');
}

.header-box {
  position: relative;
  width: 100%;
  height: 10vh;
  font-size: 2.1vw;
  font-weight: bold;
  color: #0cf;
  background: url('../images/head_bg.png') no-repeat;
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
  background: url('../images/line(1).png') rgb(255 255 255 / 4%);
  border: 0.2vh solid rgb(25 186 139 / 17%);
}

.mainbox {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.6vw;
  height: 92vh;
  padding: 0.6vw 0;
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

.top-middle {
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

.bottom-left1 {
  flex: 1;
}

.bottom-left2 {
  flex: 1;
}

.bottom-right1 {
  flex: 1;
}

.bottom-right2 {
  flex: 1;
}
</style>
