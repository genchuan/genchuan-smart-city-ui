<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 引入时间格式化工具（根据项目实际路径调整）
import { formatTimestamp } from '#/utils';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（整改通知书数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用通知书编号）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用通知书编号，兜底显示默认值
const drawerTitle = computed(() => {
  const noticeCode = detailObj.value?.noticeCode || '整改通知书';
  return title.value || `${noticeCode}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 750, // 加宽抽屉适配更多字段
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
      <!-- 整改通知书基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">主键ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">整改通知书编号:</div>
        <div class="detail-row-right">{{ detailObj.noticeCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">整改复审台账ID:</div>
        <div class="detail-row-right">
          {{ detailObj.rectifyReviewId || '-' }}
        </div>
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
              ? formatTimestamp(detailObj.rectifyDeadline, 'YYYY-MM-DD')
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
        <div class="detail-row-left">通知书内容:</div>
        <div class="detail-row-right">
          <!-- 长文本适配，保留换行 -->
          <div
            class="content-text"
            v-html="detailObj.noticeContent?.replace(/\\n/g, '<br/>') || '-'"
          ></div>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
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
  min-height: 450px; // 适配新字段数量
  max-height: 70vh; // 限制最大高度，避免内容过多溢出
  overflow-y: auto; // 内容过多时显示滚动条
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0; // 分隔线增强可读性

  // 最后一行去掉分隔线
  &:last-child {
    border-bottom: none;
  }

  // 鼠标悬浮高亮
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
  width: 120px; // 固定宽度，保证所有标签对齐
  flex-shrink: 0; // 不收缩
  font-weight: 500; // 加粗突出标签
  color: #606266; // 灰色调，区分内容
  font-size: 14px;
  line-height: 18px; // 统一行高
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  color: #303133; // 主文本色
  font-size: 14px;
  line-height: 18px;
  word-break: break-all; // 处理长文本换行（如内容、链接）
  padding-right: 10px;
}

// 通知书内容文本样式
.content-text {
  line-height: 1.6; // 增大行高，提升长文本可读性
  padding: 8px 0;
  white-space: pre-wrap; // 保留空白和换行
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
