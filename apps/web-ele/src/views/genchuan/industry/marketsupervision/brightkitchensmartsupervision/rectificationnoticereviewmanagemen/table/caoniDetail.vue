<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const noticeCode = detailObj.value?.noticeCode || '整改通知';
  return title.value || `${noticeCode}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-wrapper">
      <div class="detail-card">
        <div class="detail-card-row">
          <div class="detail-row-right">
            <div
              class="content-html-box"
              v-html="detailObj.noticeContent || '无内容'"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 外层容器
.detail-wrapper {
  padding: 10px;
  height: 100%;
}

// 主卡片
.detail-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.04);
  max-height: 72vh;
  overflow-y: auto;
}

// 行样式
.detail-card-row {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
}

// 左侧标签
.detail-row-left {
  min-width: 130px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  line-height: 1.6;
}

// 右侧内容
.detail-row-right {
  flex: 1;
  font-size: 14px;
  color: #1f2937;
  line-height: 1.7;
  word-break: break-all;
}

// HTML 内容展示（核心优化）
.content-html-box {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  line-height: 1.8;
  font-size: 14px;
  color: #222;
  word-break: break-all;
  white-space: pre-wrap;

  :deep(*) {
    margin: 0;
    padding: 0;
    line-height: 1.8;
  }

  :deep(p) {
    margin: 6px 0;
  }

  :deep(div) {
    margin: 4px 0;
  }
}

// 滚动条优化
.detail-card::-webkit-scrollbar {
  width: 6px;
}
.detail-card::-webkit-scrollbar-track {
  background: #f9fafb;
}
.detail-card::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

// 响应式
@media (max-width: 768px) {
  .detail-card {
    padding: 16px;
  }
  .detail-row-left {
    min-width: 100px;
  }
}
</style>
