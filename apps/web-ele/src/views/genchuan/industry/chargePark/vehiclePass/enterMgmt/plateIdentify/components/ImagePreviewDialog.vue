<script setup>
import { ref } from 'vue';

const dialogVisible = ref(false);
const imageUrl = ref('');
const imageTitle = ref('');

const open = (url, title = '图片预览') => {
  imageUrl.value = url;
  imageTitle.value = title;
  dialogVisible.value = true;
};

const close = () => {
  dialogVisible.value = false;
  imageUrl.value = '';
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
      <el-image
        :src="imageUrl"
        fit="contain"
        :preview-src-list="[imageUrl]"
        style="width: 100%; max-height: 600px"
      >
        <template #error>
          <div class="image-error">
            <el-icon :size="50"><Picture /></el-icon>
            <div>图片加载失败</div>
          </div>
        </template>
      </el-image>
    </div>
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
