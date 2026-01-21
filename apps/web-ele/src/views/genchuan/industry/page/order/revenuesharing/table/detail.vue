<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（停车结算统计数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用商户名称+车场名称）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用商户名称+车场名称，兜底显示默认值
const drawerTitle = computed(() => {
  const merchantName = detailObj.value?.merchantName || '停车结算统计';
  const parkName = detailObj.value?.parkName || '';
  const defaultTitle = parkName
    ? `${merchantName}-${parkName}结算详情`
    : `${merchantName}结算详情`;
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
      <!-- 停车结算统计基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">商户名称:</div>
        <div class="detail-row-right">{{ detailObj.merchantName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车场名称:</div>
        <div class="detail-row-right">{{ detailObj.parkName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">统计周期:</div>
        <div class="detail-row-right">
          {{ detailObj.statisticsCycle || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">结算状态:</div>
        <div class="detail-row-right">
          <!-- 状态文字加样式区分 -->
          <span :class="`status-tag ${detailObj.settlementStatus}`">
            {{ detailObj.settlementStatus || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">分账规则:</div>
        <div class="detail-row-right">
          <span class="rule-tag">{{ detailObj.profitSharingRule || '-' }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">总交易额:</div>
        <div class="detail-row-right">
          <span class="amount-tag">{{
            detailObj.totalTransactionAmount || '-'
          }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">退款金额:</div>
        <div class="detail-row-right">
          <span class="refund-tag">{{ detailObj.refundAmount || '-' }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">平台分成:</div>
        <div class="detail-row-right">
          <span class="platform-tag">{{ detailObj.platformShare || '-' }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">商户分成:</div>
        <div class="detail-row-right">
          <span class="merchant-tag">{{ detailObj.merchantShare || '-' }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">税费金额:</div>
        <div class="detail-row-right">
          <span class="tax-tag">{{ detailObj.taxAmount || '-' }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">生成时间:</div>
        <div class="detail-row-right">{{ detailObj.generateTime || '-' }}</div>
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

// 分账规则标签样式
.rule-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #f0f9ff;
  color: #409eff;
}

// 金额标签样式
.amount-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #f6ffed;
  color: #52c41a;
  font-weight: 500;
}

// 退款金额标签样式
.refund-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #fff1f0;
  color: #ff4d4f;
  font-weight: 500;
}

// 平台分成标签样式
.platform-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #e8f4f8;
  color: #1890ff;
  font-weight: 500;
}

// 商户分成标签样式
.merchant-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #f9f0ff;
  color: #722ed1;
  font-weight: 500;
}

// 税费金额标签样式
.tax-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #fff7e6;
  color: #fa8c16;
  font-weight: 500;
}

// 状态标签样式
.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;

  // 结算状态颜色区分
  &.待结算 {
    background-color: #f5f5f5;
    color: #8c8c8c;
  }
  &.结算中 {
    background-color: #e6f7ff;
    color: #1890ff;
  }
  &.已结算 {
    background-color: #f6ffed;
    color: #52c41a;
  }
  &.结算失败 {
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
