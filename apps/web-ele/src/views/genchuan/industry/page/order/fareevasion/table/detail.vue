<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（停车逃费订单数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用逃费单号+车牌）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用逃费单号+车牌，兜底显示默认值
const drawerTitle = computed(() => {
  const evasionNum = detailObj.value?.evasionNumber || '停车逃费订单';
  const plateNum = detailObj.value?.plateNumber || '';
  const defaultTitle = plateNum
    ? `${evasionNum}-${plateNum}详情`
    : `${evasionNum}详情`;
  return title.value || defaultTitle;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800, // 加宽抽屉适配更多字段
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
      <!-- 停车逃费订单基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">逃费单号:</div>
        <div class="detail-row-right">{{ detailObj.evasionNumber || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">原订单编号:</div>
        <div class="detail-row-right">
          {{ detailObj.originalOrderNumber || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车牌号码:</div>
        <div class="detail-row-right">{{ detailObj.plateNumber || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属车场:</div>
        <div class="detail-row-right">{{ detailObj.parkName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">逃费金额:</div>
        <div class="detail-row-right">
          <span class="amount-tag">{{ detailObj.evasionAmount || '-' }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">逃费时间:</div>
        <div class="detail-row-right">{{ detailObj.evasionTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">逃费类型:</div>
        <div class="detail-row-right">
          <span class="type-tag">{{ detailObj.evasionType || '-' }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">识别方式:</div>
        <div class="detail-row-right">
          {{ detailObj.recognitionMethod || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">黑名单状态:</div>
        <div class="detail-row-right">
          <span :class="`status-tag ${detailObj.blacklistStatus}`">
            {{ detailObj.blacklistStatus || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">识别时间:</div>
        <div class="detail-row-right">
          {{ detailObj.recognitionTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处理状态:</div>
        <div class="detail-row-right">
          <span :class="`status-tag ${detailObj.processingStatus}`">
            {{ detailObj.processingStatus || '-' }}
          </span>
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
  width: 140px;
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

// 金额标签样式
.amount-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #fff1f0;
  color: #ff4d4f;
  font-weight: 500;
}

// 逃费类型标签样式
.type-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #f0f9ff;
  color: #409eff;
}

// 状态标签样式
.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;

  // 黑名单状态颜色区分
  &.待审核 {
    background-color: #f5f5f5;
    color: #8c8c8c;
  }
  &.已加入 {
    background-color: #fff1f0;
    color: #ff4d4f;
  }
  &.已移除 {
    background-color: #f6ffed;
    color: #52c41a;
  }

  // 处理状态颜色区分
  &.待追缴 {
    background-color: #fff7e6;
    color: #fa8c16;
  }
  &.追缴中 {
    background-color: #e6f7ff;
    color: #1890ff;
  }
  &.已追缴 {
    background-color: #f6ffed;
    color: #52c41a;
  }
  &.追缴失败 {
    background-color: #fff1f0;
    color: #ff4d4f;
  }
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 120px;
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
