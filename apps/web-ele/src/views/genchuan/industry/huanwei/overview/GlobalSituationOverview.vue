<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="header-box">
      <span class="head-name">环卫园林绿化一体化数智平台</span>
      <ul class="nav-list left-but">
        <li
          v-for="item in navItems"
          :key="item.tag"
          @click="handleNavClick(item)"
          :class="{ active: currentNav === item.tag }"
        >
          <div class="datav-border">
            <span>{{ item.name }}</span>
          </div>
        </li>
      </ul>
      <div class="time-display">{{ currentTime }}</div>
      <button class="fullScreenBut" @click="clickFullscreen">
        <el-icon color="#00ccff" :size="`${1.2}vw`"><FullScreen /></el-icon>
      </button>
    </div>

    <div class="mainbox">
      <!-- 根据当前导航动态渲染组件 -->
      <GlobalOverview v-if="currentNav === 'global'" />
      <IndexAnalysis v-if="currentNav === 'indicators'" />
      <RiskWarning v-if="currentNav === 'risks'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { FullScreen } from '@element-plus/icons-vue';
import screenFull from 'screenfull';
import { ElMessage } from 'element-plus';

// 导入子组件（根据实际路径调整）
import GlobalOverview from './GlobalOverview.vue';
import IndexAnalysis from './IndexAnalysis.vue'; // 需要创建
import RiskWarning from './RiskWarning.vue'; // 需要创建

const pageContainerRef = ref(null);
const currentTime = ref('');
let timeTimer = null;

// 顶部导航数据
const navItems = ref([
  { name: '全局态势', tag: 'global' },
  { name: '指标分析', tag: 'indicators' },
  { name: '风险预警', tag: 'risks' },
]);
const currentNav = ref('global'); // 当前选中的导航项

// 导航点击处理
const handleNavClick = (item) => {
  currentNav.value = item.tag;
};

// 工具函数：格式化时间
const formatTime = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}年${m}月${d}日 ${h}时${min}分${s}秒`;
};

// 全屏功能
const clickFullscreen = () => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }
  screenFull.isFullscreen
    ? screenFull.exit()
    : screenFull.request(pageContainerRef.value);
};

// 初始化
onMounted(() => {
  currentTime.value = formatTime(new Date());
  timeTimer = setInterval(() => {
    currentTime.value = formatTime(new Date());
  }, 1000);
});

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer);
});
</script>

<style lang="scss" scoped>
@import url('./common-styles.scss');
@import './dataV.scss';
@import './datav-border.scss';

.page-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: url('../images/bg.jpg');
  background-size: 100% 100%;
  color: #fff;
  padding: 0 1vw;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.header-box {
  width: 100%;
  height: 10vh;
  background: url('../images/head_bg.png');
  background-size: 100% 100%;
  color: #00ccff;
  font-size: 2.1vw;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .head-name {
    line-height: normal;
    white-space: nowrap;
  }

  .left-but {
    position: absolute;
    top: 0.5vh;
    left: 4vw;
    display: flex;
    align-items: center;
    gap: 1vw;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      cursor: pointer;
      font-size: 1.1vw;

      .datav-border {
        padding: 0.3vw 0.6vw;
        margin: 0.4vw 0.8vw;
        white-space: nowrap;
      }

      &.active .datav-border {
        background: rgba(0, 204, 255, 0.1);
        border-color: #00ccff;
        &::before {
          border-color: #00ccff;
          box-shadow: 0 0 15px #00ccff;
        }
        span {
          color: #00ffcc;
          text-shadow: 0 0 8px rgba(0, 255, 204, 0.5);
        }
        .corner {
          border-color: #00ffcc;
        }
      }
    }
  }

  .time-display {
    position: absolute;
    right: 5vw;
    font-size: 1vw;
    color: rgb(255 255 255 / 70%);
  }

  .fullScreenBut {
    position: absolute;
    right: 1vw;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5vw;
    &:hover {
      background: rgba(0, 204, 255, 0.1);
      border-radius: 4px;
    }
  }
}

.mainbox {
  display: flex;
  margin: 0 auto;
  height: 88vh;
  box-sizing: border-box;
  gap: 0.6vw;
  width: 100%;
}
</style>
