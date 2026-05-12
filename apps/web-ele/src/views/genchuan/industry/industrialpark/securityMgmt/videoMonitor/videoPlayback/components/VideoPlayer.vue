<!-- 文件: src/views/genchuan/industrialPark/securityMgmt/videoPlayback/components/VideoPlayer.vue -->
<template>
  <div class="video-player-container">
    <video
      ref="videoRef"
      id="video-player-element"
      class="video-element"
      :src="src"
      controls
      autoplay
      @loadedmetadata="onLoadedMetadata"
    >
      您的浏览器不支持视频播放。
    </video>
    <div class="player-controls">
      <span class="time-display">{{ currentTimeDisplay }} / {{ durationDisplay }}</span>
      <div class="speed-control">
        <span>倍速：</span>
        <el-button-group>
          <el-button size="small" @click="setPlaybackRate(0.5)" :type="playbackRate === 0.5 ? 'primary' : 'default'">0.5x</el-button>
          <el-button size="small" @click="setPlaybackRate(1)" :type="playbackRate === 1 ? 'primary' : 'default'">1x</el-button>
          <el-button size="small" @click="setPlaybackRate(2)" :type="playbackRate === 2 ? 'primary' : 'default'">2x</el-button>
          <el-button size="small" @click="setPlaybackRate(4)" :type="playbackRate === 4 ? 'primary' : 'default'">4x</el-button>
          <el-button size="small" @click="setPlaybackRate(8)" :type="playbackRate === 8 ? 'primary' : 'default'">8x</el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
});

const videoRef = ref(null);
const currentTime = ref(0);
const duration = ref(0);
const playbackRate = ref(1);

const currentTimeDisplay = computed(() => formatTime(currentTime.value));
const durationDisplay = computed(() => formatTime(duration.value));

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const onLoadedMetadata = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration;
  }
};

const updateTime = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime;
    requestAnimationFrame(updateTime);
  }
};

const setPlaybackRate = (rate) => {
  if (videoRef.value) {
    videoRef.value.playbackRate = rate;
    playbackRate.value = rate;
  }
};

// 暴露 video 元素和倍速相关方法，供父组件直接调用（兼容原有 currentVideoElement 逻辑）
defineExpose({
  videoElement: videoRef,
  setPlaybackRate,
  playbackRate,
});

watch(() => props.src, () => {
  if (videoRef.value) {
    videoRef.value.load();
  }
});

// 启动时间更新循环
updateTime();

onBeforeUnmount(() => {
  if (videoRef.value) {
    videoRef.value.pause();
    videoRef.value.src = '';
  }
});
</script>

<style scoped lang="scss">
.video-player-container {
  width: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;

  .video-element {
    width: 100%;
    max-height: 400px;
    outline: none;
  }

  .player-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;

    .time-display {
      font-family: monospace;
      font-size: 14px;
    }

    .speed-control {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }
  }
}
</style>
