<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, FullScreen } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import screenFull from 'screenfull';

import EmergencyResponse from './components/EmergencyResponse.vue';
import GlobalOverview from './components/GlobalOverview.vue';
import IndexAnalysis from './components/IndexAnalysis.vue';
import ResourceMonitor from './components/ResourceMonitor.vue';
import RiskWarning from './components/RiskWarning.vue';
import SynergyLinkage from './components/SynergyLinkage.vue';

const pageContainerRef = ref<HTMLElement | null>(null);
let timeTimer: NodeJS.Timeout | null = null;
const router = useRouter();

const timeText = ref('');
const name = ref('智慧停车-全局总览');
const currentTag = ref('home');

const handleBack = () => {
  router.push('/');
};

const clickFullscreen = () => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  const targetEl = pageContainerRef.value;
  if (screenFull.isFullscreen && document.fullscreenElement === targetEl) {
    screenFull.exit();
  } else if (!screenFull.isFullscreen) {
    screenFull.request(targetEl);
  }
};

const updateShowTime = () => {
  const dt = new Date();
  const y = dt.getFullYear();
  const mt = dt.getMonth() + 1;
  const day = dt.getDate();
  const h = dt.getHours().toString().padStart(2, '0');
  const m = dt.getMinutes().toString().padStart(2, '0');
  const s = dt.getSeconds().toString().padStart(2, '0');
  timeText.value = `${y}年${mt}月${day}日 ${h}时${m}分${s}秒`;
};

const routerClick = (item: { name: string; path: string; tag: string }) => {
  name.value = `智慧停车-${item.name}`;
  currentTag.value = item.tag;
  pageContainerRef.value?.dispatchEvent(new Event('resize'));
};

const leftNavList = ref([
  { name: '全局总览', path: '', tag: 'home' },
  { name: '指标分析', path: '', tag: '0202' },
  { name: '风险预警', path: '', tag: '0203' },
]);

const rightNavList = ref([
  { name: '应急响应', path: '', tag: '0204' },
  { name: '协同联动', path: '', tag: '0205' },
  { name: '资源监控', path: '', tag: '0206' },
]);

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
      <ul class="left-but nav-lise">
        <li v-for="(item, key) in leftNavList" :key="key" @click="routerClick(item)">
          <div class="datav-border">
            <span>{{ item.name }}</span>
            <div class="corner top-left"></div>
            <div class="corner bottom-right"></div>
          </div>
        </li>
      </ul>
      <span class="head-name">{{ name }}</span>
      <ul class="right-but nav-lise">
        <li v-for="(item, key) in rightNavList" :key="key" @click="routerClick(item)">
          <div class="datav-border-reverse">
            <span>{{ item.name }}</span>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
          </div>
        </li>
      </ul>
      <button class="fullScreenBut" @click="clickFullscreen">
        <el-icon color="#00ccff" :size="`${1.2}vw`">
          <FullScreen />
        </el-icon>
      </button>
    </div>

    <div class="showTime h1-time">{{ timeText }}</div>

    <div class="mainbox">
      <GlobalOverview v-if="currentTag === 'home'" />
      <IndexAnalysis v-if="currentTag === '0202'" />
      <RiskWarning v-if="currentTag === '0203'" />
      <EmergencyResponse v-if="currentTag === '0204'" />
      <SynergyLinkage v-if="currentTag === '0205'" />
      <ResourceMonitor v-if="currentTag === '0206'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../templatesstyle/common.scss';
@import '../../templatesstyle/dataV.scss';
@import '../../templatesstyle/datav-border.scss';

.page-container {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  color: #fff;
  background: url('../images/bg.jpg');
  background-size: 100% 100%;
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
  z-index: 9;

  .head-name {
    position: absolute;
    left: 50%;
    display: inline-block;
    line-height: 9vh;
    white-space: nowrap;
    transform: translateX(-50%);
  }

  .left-but {
    position: absolute;
    top: 0.5vh;
    left: 4vw;
  }

  .right-but {
    position: absolute;
    top: 0.5vh;
    right: 4vw;
  }

  .nav-lise {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    font-size: 1.1vw;

    li {
      margin: 0 1vw;
      cursor: pointer;

      div {
        padding: 0.3vw 0.5vw;
        margin: 0.4vw 0.8vw;
        white-space: nowrap;
      }
    }
  }

  .back-button,
  .fullScreenBut {
    position: absolute;
    top: 0.5vw;
    z-index: 10;
    display: flex;
    align-items: center;
    padding: 5px;
    cursor: pointer;
    background: none;
    border: none;
    transition: transform 0.2s;

    &:hover {
      background: rgb(0 30 60 / 80%);
      border-radius: 4px;
      transform: scale(1.05);
    }
  }

  .back-button {
    left: 1vw;
  }

  .fullScreenBut {
    right: 1vw;
  }
}

.showTime {
  position: absolute;
  top: 6.5vh;
  left: 0.5vw;
  padding-top: 2px;
  overflow: hidden;
  font-size: 0.7vw;
  line-height: 1;
  color: rgb(255 255 255 / 70%);
  z-index: 8;
  pointer-events: none;
}

.mainbox {
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 90vh;
  overflow: hidden;
}
</style>
