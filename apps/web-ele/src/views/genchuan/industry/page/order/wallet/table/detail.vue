<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（停车充值管理数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用充值单号+车牌号码）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用充值单号+车牌号码，兜底显示默认值
const drawerTitle = computed(() => {
  const rechargeNumber = detailObj.value?.rechargeNumber || '停车充值记录';
  const plateNumber = detailObj.value?.plateNumber || '';
  const defaultTitle = plateNumber
    ? `${rechargeNumber}-${plateNumber}充值详情`
    : `${rechargeNumber}充值详情`;
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
      <!-- 停车充值管理基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">充值单号:</div>
        <div class="detail-row-right">
          {{ detailObj.rechargeNumber || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">用户姓名:</div>
        <div class="detail-row-right">{{ detailObj.userName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车牌号码:</div>
        <div class="detail-row-right">{{ detailObj.plateNumber || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">充值套餐:</div>
        <div class="detail-row-right">
          {{ detailObj.rechargePackage || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">自定义金额:</div>
        <div class="detail-row-right">
          <span class="amount-tag">{{
            detailObj.customAmount || '0.00元'
          }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">优惠金额:</div>
        <div class="detail-row-right">
          <span class="discount-tag">{{
            detailObj.discountAmount || '0.00元'
          }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">实付金额:</div>
        <div class="detail-row-right">
          <span class="payment-tag">{{ detailObj.actualPayment || '-' }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">支付方式:</div>
        <div class="detail-row-right">
          <span class="method-tag">{{ detailObj.paymentMethod || '-' }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">充值状态:</div>
        <div class="detail-row-right">
          <!-- 状态文字加样式区分 -->
          <span :class="`status-tag ${detailObj.rechargeStatus}`">
            {{ detailObj.rechargeStatus || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">到账时间:</div>
        <div class="detail-row-right">{{ detailObj.arrivalTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">钱包余额:</div>
        <div class="detail-row-right">
          <span class="balance-tag">{{ detailObj.walletBalance || '-' }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">充值时间:</div>
        <div class="detail-row-right">{{ detailObj.rechargeTime || '-' }}</div>
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

// 自定义金额标签样式
.amount-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #f0f9ff;
  color: #409eff;
  font-weight: 500;
}

// 优惠金额标签样式
.discount-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #fff7e6;
  color: #fa8c16;
  font-weight: 500;
}

// 实付金额标签样式
.payment-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #f6ffed;
  color: #52c41a;
  font-weight: 500;
}

// 支付方式标签样式
.method-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #f9f0ff;
  color: #722ed1;
  font-weight: 500;
}

// 钱包余额标签样式
.balance-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #e8f4f8;
  color: #1890ff;
  font-weight: 500;
}

// 状态标签样式
.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;

  // 充值状态颜色区分
  &.处理中 {
    background-color: #e6f7ff;
    color: #1890ff;
  }
  &.已到账 {
    background-color: #f6ffed;
    color: #52c41a;
  }
  &.充值失败 {
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
