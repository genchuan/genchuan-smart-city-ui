<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

// 订单类型映射
const orderTypeMap = {
  temp_park: '临时停车',
  offtime_park: '错时停车',
  car_charge: '汽车充电',
  bike_charge: '两轮充电',
  share_charge: '共享充电',
};

// 异常类型映射
const abnormalTypeMap = {
  payment_error: '支付异常',
  billing_error: '计费异常',
  status_error: '状态异常',
};

// 处置状态映射
const statusMap = {
  unhandled: '未处理',
  handling: '处理中',
  closed: '已关闭',
};

// 获取订单类型标签
const getOrderTypeLabel = (orderType) => {
  return orderTypeMap[orderType] || orderType || '-';
};

// 获取异常类型标签
const getAbnormalTypeLabel = (abnormalType) => {
  return abnormalTypeMap[abnormalType] || abnormalType || '-';
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status] || status || '-';
};

// 异常订单详情
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
  const id = detailObj.value?.id || '异常订单';
  return title.value || `异常订单【${id}】详情`;
});

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
        <div class="detail-row-left">关联订单ID:</div>
        <div class="detail-row-right">{{ detailObj.orderId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">订单类型:</div>
        <div class="detail-row-right">{{ getOrderTypeLabel(detailObj.orderType) }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">异常类型:</div>
        <div class="detail-row-right">{{ getAbnormalTypeLabel(detailObj.abnormalType) }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">异常识别时间:</div>
        <div class="detail-row-right">{{ detailObj.identifyTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">处置状态:</div>
        <div class="detail-row-right">{{ getStatusLabel(detailObj.status) }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">所属场站:</div>
        <div class="detail-row-right">{{ detailObj.stationName || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">忽略理由:</div>
        <div class="detail-row-right">{{ detailObj.ignoreReason || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">处置进度:</div>
        <div class="detail-row-right">{{ detailObj.processProgress || '-' }}</div>
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