<template>
  <div class="real-time-player-container">
    <video
      ref="videoRef"
      class="video-element"
      :src="src"
      autoplay
      muted
      controls
      @loadedmetadata="onLoadedMetadata"
    >
      您的浏览器不支持视频播放。
    </video>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
});

const videoRef = ref(null);

const onLoadedMetadata = () => {
  // 可在此处执行初始化操作
};

// 暂停播放
const pauseVideo = () => {
  if (videoRef.value) {
    videoRef.value.pause();
  }
};

// 恢复播放
const playVideo = () => {
  if (videoRef.value) {
    videoRef.value.play().catch(err => console.warn('自动播放失败', err));
  }
};

// 获取 video 元素（用于全屏）
const getVideoElement = () => videoRef.value;

// 前端截图：返回 dataURL
const captureFrame = () => {
  if (!videoRef.value) return null;
  const canvas = document.createElement('canvas');
  canvas.width = videoRef.value.videoWidth;
  canvas.height = videoRef.value.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg');
};

// 暴露方法给父组件
defineExpose({
  pauseVideo,
  playVideo,
  getVideoElement,
  captureFrame,
});

// 监听 src 变化，重新加载并播放
watch(() => props.src, (newSrc) => {
  if (videoRef.value && newSrc) {
    videoRef.value.load();
    videoRef.value.play().catch(e => console.warn('自动播放失败', e));
  }
});

// 组件销毁时释放视频资源
onBeforeUnmount(() => {
  if (videoRef.value) {
    videoRef.value.pause();
    videoRef.value.src = '';
  }
});
</script>

<style scoped lang="scss">
.real-time-player-container {
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;

  .video-element {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
