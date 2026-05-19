<script setup>
import { ref } from 'vue';

import { ElImageViewer } from 'element-plus';

const dialogVisible = ref(false);
const imageUrl = ref('');
const imageTitle = ref('');
const showViewer = ref(false);
const imageError = ref(false);

const open = (url, title = '图片预览') => {
  imageUrl.value = url;
  imageTitle.value = title;
  imageError.value = false;
  dialogVisible.value = true;
};

const close = () => {
  dialogVisible.value = false;
  showViewer.value = false;
  imageUrl.value = '';
};

const handleImageClick = () => {
  if (!imageError.value) {
    showViewer.value = true;
  }
};

const handleImageError = () => {
  imageError.value = true;
};

const closeViewer = () => {
  showViewer.value = false;
};

defineExpose({
  open,
  close,
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="imageTitle"
    width="800px"
    append-to-body
  >
    <div class="image-preview-container">
      <div v-if="!imageError" class="image-wrapper" @click="handleImageClick">
        <img
          :src="imageUrl"
          alt="抓拍图片"
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
          @error="handleImageError"
        />
      </div>
      <div v-else class="image-error">
        <el-icon :size="50"><Picture /></el-icon>
        <div>图片加载失败</div>
        <div class="error-url">{{ imageUrl }}</div>
      </div>
    </div>
    <teleport to="body">
      <ElImageViewer
        v-if="showViewer"
        :url-list="[imageUrl]"
        :initial-index="0"
        @close="closeViewer"
      />
    </teleport>
  </el-dialog>
</template>

<style scoped>
.image-preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--el-text-color-secondary);
}
</style>
