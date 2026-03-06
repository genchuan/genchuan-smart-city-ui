<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（停车套餐订单数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用订单编号+车牌）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用订单编号+车牌，兜底显示默认值
const drawerTitle = computed(() => {
  const orderNum = detailObj.value?.orderNumber || '停车套餐订单';
  const plateNum = detailObj.value?.plateNumber || '';
  const defaultTitle = plateNum
    ? `${orderNum}-${plateNum}详情`
    : `${orderNum}详情`;
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
      <!-- 停车套餐订单基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">订单编号:</div>
        <div class="detail-row-right">{{ detailObj.orderNumber || '-' }}</div>
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
        <div class="detail-row-left">套餐类型:</div>
        <div class="detail-row-right">
          <span class="package-tag">{{ detailObj.packageType || '-' }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">适用车场:</div>
        <div class="detail-row-right">
          {{ detailObj.applicablePark || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">开通时长:</div>
        <div class="detail-row-right">{{ detailObj.openDuration || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">原价:</div>
        <div class="detail-row-right">{{ detailObj.originalPrice || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">实付金额:</div>
        <div class="detail-row-right">
          <span class="amount-tag">{{ detailObj.actualPayment || '-' }}</span>
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
        <div class="detail-row-left">生效时间:</div>
        <div class="detail-row-right">{{ detailObj.effectiveTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">到期时间:</div>
        <div class="detail-row-right">{{ detailObj.expireTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">支付状态:</div>
        <div class="detail-row-right">
          <span :class="`status-tag ${detailObj.paymentStatus}`">
            {{ detailObj.paymentStatus || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">卡状态:</div>
        <div class="detail-row-right">
          <span :class="`status-tag ${detailObj.cardStatus}`">
            {{ detailObj.cardStatus || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">支付方式:</div>
        <div class="detail-row-right">{{ detailObj.paymentMethod || '-' }}</div>
      </div>
      <!-- 扩展字段：关联车场信息（可选） -->
      <div class="detail-card-row">
        <div class="detail-row-left">车场泊位总数:</div>
        <div class="detail-row-right">{{ detailObj.parkTotal || '-' }} 个</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车场收费标准:</div>
        <div class="detail-row-right">{{ detailObj.pricing || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车场联系电话:</div>
        <div class="detail-row-right">{{ detailObj.phone || '-' }}</div>
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

// 套餐类型标签
.package-tag {
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

// 状态标签样式
.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;

  // 支付状态颜色区分
  &.未支付 {
    background-color: #fff1f0;
    color: #ff4d4f;
  }
  &.已支付 {
    background-color: #e8f4f8;
    color: #409eff;
  }
  &.已退款 {
    background-color: #f9f0ff;
    color: #9254de;
  }

  // 卡状态颜色区分
  &.未生效 {
    background-color: #f5f5f5;
    color: #8c8c8c;
  }
  &.正常生效 {
    background-color: #f6ffed;
    color: #52c41a;
  }
  &.即将到期 {
    background-color: #fff7e6;
    color: #fa8c16;
  }
  &.已过期 {
    background-color: #fef0f0;
    color: #f56c6c;
  }
  &.已冻结 {
    background-color: #fff1f0;
    color: #ff4d4f;
  }
  &.已注销 {
    background-color: #f5f5f5;
    color: #8c8c8c;
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
