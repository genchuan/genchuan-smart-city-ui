<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { formatTimestamp } from '#/utils';

// 定义组件接收的属性
const props = defineProps({
  // 整改通知详情数据对象
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用整改通知主键ID）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用整改通知编号，兜底显示默认值
const drawerTitle = computed(() => {
  const noticeCode = detailObj.value?.noticeCode || '整改通知';
  return title.value || `${noticeCode}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 700,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 整改通知基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">主键ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">整改通知书编号:</div>
        <div class="detail-row-right">{{ detailObj.noticeCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">下发时间:</div>
        <div class="detail-row-right">
          {{ detailObj.issueTime ? formatTimestamp(detailObj.issueTime) : '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">整改期限:</div>
        <div class="detail-row-right">
          {{
            detailObj.rectifyDeadline
              ? formatTimestamp(detailObj.rectifyDeadline)
              : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">送达状态:</div>
        <div class="detail-row-right">{{ detailObj.receiveStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">送达时间:</div>
        <div class="detail-row-right">
          {{
            detailObj.receiveTime ? formatTimestamp(detailObj.receiveTime) : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">通知书原件内容:</div>
        <div class="detail-row-right">
          <div
            class="content-text"
            v-html="detailObj.noticeContent || '-'"
          ></div>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">记录创建时间:</div>
        <div class="detail-row-right">
          {{
            detailObj.createTime ? formatTimestamp(detailObj.createTime) : '-'
          }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 详情卡片整体样式
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 400px;
  max-height: 70vh;
  overflow-y: auto;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    transition: all 0.2s ease;
  }
}

// 左侧标签样式
.detail-row-left {
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}

// 右侧内容样式
.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;
}

// 通知书内容文本样式
.content-text {
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  min-height: 80px;
  line-height: 1.6;
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }
  .detail-card {
    padding: 15px;
    max-height: 60vh;
  }
  .content-text {
    min-height: 60px;
    padding: 6px 10px;
  }
}

// 滚动条样式优化
.detail-card::-webkit-scrollbar {
  width: 6px;
}
.detail-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.detail-card::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}
.detail-card::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}
</style>
