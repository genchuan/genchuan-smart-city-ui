<script setup lang="ts">
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElButton, ElDialog, ElEmpty, ElImage, ElLink, ElMessage } from 'element-plus';

const [Drawer, drawerApi] = useVbenDrawer({
  title: '查看附件',
  width: 600,
  modal: false,
  appendToMain: true,
  onCancel() {
    drawerApi.close();
  },
});

const record = ref<any>({});
const attachments = ref<any[]>([]);

const open = (row: any) => {
  record.value = row;
  // 解析附件信息
  if (row.attachmentInfo) {
    try {
      attachments.value = JSON.parse(row.attachmentInfo);
    } catch {
      attachments.value = [];
    }
  } else {
    // 模拟附件数据用于演示
    attachments.value = [
      {
        name: '事项照片.jpg',
        size: 1024 * 1024 * 2.5, // 2.5MB
        url: 'https://picsum.photos/800/600',
        type: 'image/jpeg',
      },
      {
        name: '处理报告.pdf',
        size: 1024 * 512, // 512KB
        url: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO...',
        type: 'application/pdf',
      },
      {
        name: '现场视频.mp4',
        size: 1024 * 1024 * 15, // 15MB
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'video/mp4',
      },
    ];
  }
  drawerApi.open();
};

// 预览弹窗引用
const previewVisible = ref(false);
const previewFile = ref<any>({});

const handlePreview = (file: any) => {
  if (!file.url) {
    ElMessage.warning('文件预览链接不可用');
    return;
  }

  // 根据文件类型处理预览
  if (file.type?.startsWith('image/')) {
    // 图片预览
    previewFile.value = file;
    previewVisible.value = true;
  } else if (file.type === 'application/pdf') {
    // PDF预览
    window.open(file.url, '_blank');
  } else if (file.type?.startsWith('video/')) {
    // 视频预览
    previewFile.value = file;
    previewVisible.value = true;
  } else {
    // 其他文件直接下载
    handleDownload(file);
  }
};

const handleDownload = (file: any) => {
  if (!file.url) {
    ElMessage.warning('文件下载链接不可用');
    return;
  }

  // 创建下载链接
  const link = document.createElement('a');
  link.href = file.url;
  link.download = file.name || 'download';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  ElMessage.success(`开始下载: ${file.name}`);
};

const closePreview = () => {
  previewVisible.value = false;
  previewFile.value = {};
};

defineExpose({
  open,
});
</script>

<template>
  <Drawer>
    <div class="attachment-drawer-content">
      <div class="info">
        <p><strong>事项名称：</strong>{{ record.name }}</p>
        <p><strong>16位标识码：</strong>{{ record.uniqueCode }}</p>
      </div>

      <div class="attachment-list">
        <h4>附件列表</h4>
        <div v-if="attachments.length > 0" class="list">
          <div
            v-for="(file, index) in attachments"
            :key="index"
            class="attachment-item"
          >
            <div class="file-info">
              <span class="file-name">{{ file.name || '未命名文件' }}</span>
              <span class="file-size" v-if="file.size">
                {{ (file.size / 1024).toFixed(2) }} KB
              </span>
            </div>
            <div class="file-actions">
              <ElLink type="primary" @click="handlePreview(file)">
                预览
              </ElLink>
              <ElLink type="success" @click="handleDownload(file)">
                下载
              </ElLink>
            </div>
          </div>
        </div>
        <ElEmpty v-else description="暂无附件" />
      </div>
    </div>
    <template #footer>
      <ElButton @click="drawerApi.close()">关闭</ElButton>
    </template>
  </Drawer>

  <!-- 图片/视频预览弹窗 -->
  <ElDialog
    v-model="previewVisible"
    :title="previewFile.name || '预览'"
    width="80%"
    center
    @close="closePreview"
  >
    <div class="preview-content">
      <!-- 图片预览 -->
      <ElImage
        v-if="previewFile.type?.startsWith('image/')"
        :src="previewFile.url"
        fit="contain"
        style="width: 100%; max-height: 600px;"
      />
      <!-- 视频预览 -->
      <video
        v-else-if="previewFile.type?.startsWith('video/')"
        :src="previewFile.url"
        controls
        style="width: 100%; max-height: 600px;"
      >
        您的浏览器不支持视频播放
      </video>
    </div>
    <template #footer>
      <ElButton @click="closePreview">关闭</ElButton>
      <ElButton type="primary" @click="handleDownload(previewFile)">
        下载
      </ElButton>
    </template>
  </ElDialog>
</template>

<style scoped>
.attachment-drawer-content {
  padding: 20px;
}

.info {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.info p {
  margin: 8px 0;
}

.attachment-list h4 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fafafa;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  font-weight: 500;
  color: #333;
}

.file-size {
  font-size: 12px;
  color: #999;
}

.file-actions {
  display: flex;
  gap: 15px;
}

.preview-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 20px;
}
</style>
