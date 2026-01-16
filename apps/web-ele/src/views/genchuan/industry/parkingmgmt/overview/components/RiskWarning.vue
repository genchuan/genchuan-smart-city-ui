<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, getCurrentInstance } from 'vue'; // ✅ 新增 getCurrentInstance 导入（参考代码必加）
import { useRouter } from 'vue-router';

import { Filter, FullScreen, Setting, VideoPause, VideoPlay } from '@element-plus/icons-vue';
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElSwitch, ElTable, ElTableColumn, ElTabPane, ElTabs, ElTag } from 'element-plus';
import screenFull from 'screenfull'; // ✅ 参考代码的全屏插件导入
import FlightGanttChart1 from "#/views/genchuan/industry/parkingmgmt/overview/components/FlightGanttChart1.vue";

const pageContainerRef = ref<HTMLElement | null>(null);
const router = useRouter();

// ✅ ↓↓↓ 完全照搬参考代码的【全屏核心代码】- 一字未改 ↓↓↓
const instance = getCurrentInstance();
// 面板全屏方法 - 完全复制参考代码里的同名方法
const togglePanelFullscreen = (panelRefName) => {
  if (!screenFull.isEnabled) {
    ElMessage.warning('您的浏览器不支持全屏功能');
    return;
  }

  const panel = instance.refs[panelRefName];
  if (!panel) {
    ElMessage.error('未找到面板元素');
    return;
  }

  if (screenFull.isFullscreen && document.fullscreenElement === panel) {
    screenFull.exit();
  } else {
    screenFull.request(panel);
  }
};
// ✅ ↑↑↑ 完全照搬参考代码的全屏核心代码 - 结束 ↑↑↑

</script>

<template>
  <div class="page-container" ref="pageContainerRef">
    <div class="mainbox">
      <div class="top">
        <div class="panel top-left">
          <p>预警事件概览</p>
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-middle">
          <div class="panel-footer"></div>
        </div>
        <div class="panel top-right">
          <p>异常预警视图</p>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="bottom">
        <!-- ✅ 面板的ref名称，和点击传参的名称保持一致，参考代码标准写法 -->
        <div class="panel bottom-left" ref="eventDisposalTracking">
          <div class="header-actions">
            <div class="actions-left"><p>事件处置跟踪</p></div>
            <div class="actions-right">
              <el-icon color="#409eff" size="16"><Filter /></el-icon>
              <!-- ✅ 点击调用的方法+传参，完全照搬参考代码的写法 -->
              <button class="panel-fullscreen-btn" @click="togglePanelFullscreen('eventDisposalTracking')">
                <el-icon color="#00ccff" size="16"><FullScreen /></el-icon>
              </button>
            </div>
          </div>
          <FlightGanttChart1 title="各预警事件处置全流程时间轴" :baseFontScale="1" />
          <div class="panel-footer"></div>
        </div>
        <div class="panel bottom-right">
          <p>合规预警视图</p>
          <div class="panel-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../templatesstyle/common';

.page-container {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 0 20px;
  overflow: hidden;
  color: #fff;
  background: url('../../images/bg.jpg');
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
  height: 60%;
}

.top-left { flex: 2; }

.top-middle {
  flex: 5;
}

.top-right { flex: 2; }

.bottom {
  display: flex;
  gap: 0.6vw;
  height: 36%;
}

.bottom-left { flex: 1; }
.bottom-right { flex: 1; }

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

// ✅ 完全照搬参考代码的全屏按钮样式 - 补齐缺失的样式，保证点击生效
.panel-fullscreen-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #00ccff;
}
// ✅ 补齐header-actions的布局样式，和参考代码一致
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5vw;
}
.actions-right {
  display: flex;
  align-items: center;
  gap: 0.8vw;
}
</style>
