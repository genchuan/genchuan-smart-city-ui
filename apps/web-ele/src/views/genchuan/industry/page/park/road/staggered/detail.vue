<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 订单详情数据对象（适配新的订单字段结构）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const { detailObj } = toRefs(props);

// 计算属性处理标题，优先使用订单编号，兜底显示默认值
const drawerTitle = computed(() => {
  const orderName = detailObj.value?.orderNo || '订单';
  return `${orderName}详情`;
});

// 初始化抽屉实例（优化层级配置，避免被覆盖）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToBody: true, // 挂载到body避免层级问题
  appendToMain: false,
  footer: false,
  width: 900, // 加宽适配更多订单字段
  zIndex: 9999, // 提升层级
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
  <DetailDrawer :title="drawerTitle" class="order-detail-drawer">
    <div class="detail-card">
      <!-- 订单核心字段展示（适配新的订单字段结构） -->
      <div class="detail-card-row">
        <div class="detail-row-left">订单编号:</div>
        <div class="detail-row-right">{{ detailObj.orderNo || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车牌号码:</div>
        <div class="detail-row-right">{{ detailObj.plateNo || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">泊位编号:</div>
        <div class="detail-row-right">{{ detailObj.berthNo || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预订时段:</div>
        <div class="detail-row-right">{{ detailObj.bookingPeriod || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">错时规则:</div>
        <div class="detail-row-right">{{ detailObj.timeRule || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">出租周期:</div>
        <div class="detail-row-right">{{ detailObj.rentCycle || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">支付金额:</div>
        <div class="detail-row-right">
          {{
            detailObj.payAmount ? `¥ ${detailObj.payAmount.toFixed(2)}` : '-'
          }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">联系人:</div>
        <div class="detail-row-right">{{ detailObj.contactPerson || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">联系电话:</div>
        <div class="detail-row-right">{{ detailObj.contactPhone || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">支付状态:</div>
        <div class="detail-row-right">{{ detailObj.payStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">生效状态:</div>
        <div class="detail-row-right">
          {{ detailObj.effectiveStatus || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">使用状态:</div>
        <div class="detail-row-right">{{ detailObj.useStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">完成时间:</div>
        <div class="detail-row-right">{{ detailObj.completeTime || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 详情卡片整体样式（适配订单多字段）
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 500px; // 增加最小高度适配更多字段
  max-height: 70vh; // 限制最大高度，避免溢出
  overflow-y: auto; // 内容过多时滚动
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配长文本
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
  width: 120px; // 调整标签宽度适配订单字段
  flex-shrink: 0; // 不收缩
  font-weight: 500; // 加粗突出标签
  color: #606266; // 灰色调，区分内容
  font-size: 14px;
  line-height: 20px; // 适配行高
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  color: #303133; // 主文本色
  font-size: 14px;
  line-height: 20px;
  word-break: break-all; // 处理长文本换行
  padding-right: 10px;
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
