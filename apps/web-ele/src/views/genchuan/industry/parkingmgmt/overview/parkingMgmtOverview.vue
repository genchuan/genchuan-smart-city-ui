<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ArrowLeft, FullScreen } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import screenFull from 'screenfull';

import GlobalOverview from './components/GlobalOverview.vue' //全局总览
import IndexAnalysis from './components/IndexAnalysis.vue'     //指标分析
import RiskWarning from './components/RiskWarning.vue'         //风险预警
import EmergencyResponse from './components/EmergencyResponse.vue' //应急响应
import SynergyLinkage from './components/SynergyLinkage.vue'   //协同联动
import ResourceMonitor from './components/ResourceMonitor.vue' //资源监控

const pageContainerRef = ref<HTMLElement | null>(null);
let timeTimer: NodeJS.Timeout | null = null;
const router = useRouter();

const timeText = ref('');

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
  timeText.value = `${y}年${mt}月${day}日 ${h}时${m}分${s}秒`;
};

const routerClick = (item: {name:string, path:string, tag:string}) => {
  name.value = `智慧停车-${item.name}`;
  currentTag.value = item.tag;
};

const name = ref('智慧停车-全局总览');
const currentTag = ref('home');
const leftNavList = ref([
  { name: '全局总览', path: '', tag: 'home' },
  { name: '指标分析', path: '', tag: '0202' },
  { name: '风险预警', path: '', tag: '0203' }
]);
const rightNavList = ref([
  { name: '应急响应', path: '', tag: '0204' },
  { name: '协同联动', path: '', tag: '0205' },
  { name: '资源监控', path: '', tag: '0206' }
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
          <div class="border-box-8"><span>{{ item.name }}</span></div>
        </li>
      </ul>
      <span class="head-name">{{ name }}</span>
      <ul class="right-but nav-lise">
        <li v-for="(item, key) in rightNavList" :key="key" @click="routerClick(item)">
          <div class="border-box-8 border-reverse"><span>{{ item.name }}</span></div>
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
      <GlobalOverview v-show="currentTag === 'home'" />
      <IndexAnalysis v-show="currentTag === '0202'" />
      <RiskWarning v-show="currentTag === '0203'" />
      <EmergencyResponse v-show="currentTag === '0204'" />
      <SynergyLinkage v-show="currentTag === '0205'" />
      <ResourceMonitor v-show="currentTag === '0206'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../templatesstyle/common.scss';
@import '../../templatesstyle/dataV.scss';

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

  .head-name {
    position: absolute;
    left: 50%;
    display: inline-block;
    line-height: 9vh;
    white-space: nowrap;
    transform: translateX(-50%);
  }

  .left-but { position: absolute; left: 4vw; top: 1vh; }
  .right-but { position: absolute; right: 4vw; top: 1vh; }
  .nav-lise {
    display: flex; flex-wrap: nowrap; align-items: center; flex-direction: row; font-size: 1.1vw;
    li {
      margin: 0 1vw;
      cursor: pointer;
      div {
        padding: 0.2vw 0.5vw;
        margin: 0.2vw;
        white-space: nowrap;
      }
    }
  }

  .back-button, .fullScreenBut {
    position: absolute; top: 0.5vw;
    cursor: pointer; transition: transform 0.2s;
    padding: 5px; background: none; border: none; display: flex; align-items: center; z-index: 10;
    &:hover { transform: scale(1.05); background: rgba(0, 30, 60, 0.8); border-radius: 4px; }
  }
  .back-button { left: 1vw; }
  .fullScreenBut { right: 1vw; }

  .border-box-8 {
    position: relative; border: 1px solid #00ccff;
    background: rgba(0, 60, 120, 0.3); box-shadow: 0 0 8px #00ccff;
    &::before {
      content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px;
      border: 1px solid rgba(0, 204, 255, 0.5); pointer-events: none;
    }
  }
  .border-reverse { background: rgba(0, 30, 60, 0.5); box-shadow: 0 0 10px #0099cc; }
}

.showTime {
  position: absolute;
  top: 6.5vh;
  left: 0.5vw;
  overflow: hidden;
  font-size: 0.7vw;
  color: rgb(255 255 255 / 70%);
  line-height: 1;
  padding-top: 2px;
}

.mainbox {
  box-sizing: border-box;
  width: 100%;
  height: 90vh;
  overflow: hidden;
  display: flex; flex-wrap: nowrap;
}
</style>
