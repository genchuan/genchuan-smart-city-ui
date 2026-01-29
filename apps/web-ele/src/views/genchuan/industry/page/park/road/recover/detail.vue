<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 停车欠费缴费详情数据对象（适配缴费相关字段结构）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const { detailObj } = toRefs(props);

// 计算属性处理标题，优先使用二维码编号，兜底显示默认值
const drawerTitle = computed(() => {
  const qrCode = detailObj.value?.qrCode || '停车欠费缴费';
  return `${qrCode}详情`;
});

// 初始化抽屉实例（优化层级配置，避免被覆盖）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
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
  <DetailDrawer :title="drawerTitle" class="parking-arrears-pay-detail-drawer">
    <div class="detail-card">
      <!-- 停车欠费缴费核心字段展示 -->
      <div class="detail-card-row">
        <div class="detail-row-left">欠费聚合支付二维码:</div>
        <div class="detail-row-right">{{ detailObj.arrearsQrCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">缴费状态同步结果:</div>
        <div class="detail-row-right">{{ detailObj.paySyncResult || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">二维码:</div>
        <div class="detail-row-right">{{ detailObj.qrCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">金额:</div>
        <div class="detail-row-right">
          {{ detailObj.amount ? `¥${detailObj.amount.toFixed(2)}` : '-' }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 详情卡片整体样式（适配停车欠费缴费字段）
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 200px; // 适配4个字段的高度
  max-height: 70vh; // 限制最大高度，避免溢出
  overflow-y: auto; // 内容过多时滚动
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配二维码链接长文本
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

// 左侧标签样式（固定宽度保证对齐）
.detail-row-left {
  width: 160px; // 适配长标签（欠费聚合支付二维码）的宽度
  flex-shrink: 0; // 不收缩
  font-weight: 500; // 加粗突出标签
  color: #606266; // 灰色调，区分内容
  font-size: 14px;
  line-height: 24px; // 提升行高，适配长文本阅读
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  color: #303133; // 主文本色
  font-size: 14px;
  line-height: 24px; // 提升行高
  word-break: break-all; // 处理二维码链接长文本换行
  padding-right: 10px;
  white-space: pre-line; // 保留换行符（如有）
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 140px; // 移动端适配长标签宽度
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
