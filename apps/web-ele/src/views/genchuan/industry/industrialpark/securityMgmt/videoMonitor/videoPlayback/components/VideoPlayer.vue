<template>
  <div class="video-player-container">
    <video
      ref="videoRef"
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

const emit = defineEmits(['screenshot']);

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

const takeScreenshot = () => {
  if (videoRef.value) {
    emit('screenshot', videoRef.value.currentTime);
  } else {
    console.warn('video element not ready');
  }
};

defineExpose({
  videoElement: videoRef,
  setPlaybackRate,
  playbackRate,
  takeScreenshot,
});

watch(() => props.src, () => {
  if (videoRef.value) {
    videoRef.value.load();
  }
});

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
  height: 100%;           // 关键：让容器占满父级高度
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .video-element {
    width: 100%;
    flex: 1;              // 让视频区域自动撑开剩余高度
    outline: none;
  }

  .player-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;

    .time-display {
      font-family: monospace;
      font-size: 14px;
    }
  }
}
</style>
