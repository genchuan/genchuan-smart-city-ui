<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

// 设备借出订单详情
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

// 标题
const drawerTitle = computed(() => {
  const orderNo = detailObj.value?.orderNo || '设备借出订单';
  return title.value || `${orderNo} 详情`;
});

// 订单状态映射
const statusMap = {
  lending: '借出中',
  pending_pay: '待支付',
  paid: '已支付',
  completed: '已完成',
  cancelled: '已取消',
  refunding: '退款中',
};

// 支付方式映射
const payMethodMap = {
  wechat: '微信',
  alipay: '支付宝',
  bank: '银行卡',
  cash: '现金',
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status] || status || '-';
};

// 获取支付方式标签
const getPayMethodLabel = (payMethod) => {
  return payMethodMap[payMethod] || payMethod || '-';
};

// 抽屉
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
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
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">主键ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">订单编号:</div>
        <div class="detail-row-right">{{ detailObj.orderNo || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">用户ID:</div>
        <div class="detail-row-right">{{ detailObj.userId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">用户昵称:</div>
        <div class="detail-row-right">{{ detailObj.userNickname || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">借出时间:</div>
        <div class="detail-row-right">{{ detailObj.lendTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">归还时间:</div>
        <div class="detail-row-right">{{ detailObj.returnTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">实际使用时长（分钟）:</div>
        <div class="detail-row-right">{{ detailObj.actualDuration || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">订单金额:</div>
        <div class="detail-row-right">{{ detailObj.amount || '0.00' }} 元</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">订单状态:</div>
        <div class="detail-row-right">{{ detailObj.status || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">订单生成时间:</div>
        <div class="detail-row-right">{{ detailObj.createOrderTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">所属场站:</div>
        <div class="detail-row-right">{{ detailObj.stationName || detailObj.stationId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">支付方式:</div>
        <div class="detail-row-right">{{ getPayMethodLabel(detailObj.payMethod) }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">优惠抵扣金额:</div>
        <div class="detail-row-right">{{ detailObj.discountAmount || '0.00' }} 元</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">归档时间:</div>
        <div class="detail-row-right">{{ detailObj.archiveTime || '-' }}</div>
      </div>
 

      <div class="detail-card-row">
        <div class="detail-row-left">创建者:</div>
        <div class="detail-row-right">{{ detailObj.creator || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">更新者:</div>
        <div class="detail-row-right">{{ detailObj.updater || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
@media (max-width: 768px) {
  .detail-row-left {
    width: 150px;
  }
  .detail-card {
    min-height: 600px;
    max-height: 80vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 650px;
  max-height: 85vh;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9fafb;
  border-radius: 8px;
}

.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    padding: 12px 8px;
    margin: 0 -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}

.detail-row-left {
  flex-shrink: 0;
  width: 160px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  font-size: 14px;
  color: #303133;
  word-break: break-all;
}

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