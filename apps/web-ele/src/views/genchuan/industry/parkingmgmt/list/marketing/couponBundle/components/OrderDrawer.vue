<script setup>
import { computed } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  orderDetail: {
    type: Object,
    default: () => ({}),
  },
  title: {
    type: String,
    default: '查看关联订单',
  },
});

const emit = defineEmits(['close']);

const [Drawer, drawerApi] = useVbenDrawer({
  width: '50%',
  mask: false,
  modal: false,
  position: 'right',
  appendToMain: true,
  title: computed(() => props.title),
  showCancelButton: false,
  showConfirmButton: false,
  onCancel() {
    emit('close');
    drawerApi.close();
  },
});

// 暴露open方法给父组件
defineExpose({
  open: drawerApi.open,
  setData: drawerApi.setData,
});

// 订单详情字段配置
const orderFields = [
  { key: 'orderId', label: '订单ID' },
  { key: 'orderTime', label: '订单时间' },
  { key: 'totalAmount', label: '总金额', formatter: (value) => `${value}元` },
  {
    key: 'deductAmount',
    label: '抵扣金额',
    formatter: (value) => `${value}元`,
  },
  {
    key: 'actualAmount',
    label: '实际金额',
    formatter: (value) => `${value}元`,
  },
  { key: 'payStatus', label: '支付状态' },
  { key: 'lotName', label: '车场名称' },
  { key: 'couponName', label: '优惠券名称' },
  { key: 'parkingTime', label: '入场时间' },
  { key: 'leaveTime', label: '出场时间' },
];

// 格式化值
const formatValue = (field, value) => {
  if (field.formatter) {
    return field.formatter(value);
  }
  return value;
};
</script>

<template>
  <Drawer>
    <div class="detail-container">
      <div class="detail-card">
        <div class="detail-content">
          <div
            class="detail-item"
            v-for="field in orderFields"
            :key="field.key"
          >
            <span class="detail-label">{{ field.label }}:</span>
            <span class="detail-value">
              {{ formatValue(field, orderDetail[field.key]) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<style scoped>
.detail-container {
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
}

.detail-card {
  padding: 20px;
  margin-bottom: 16px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.detail-card:last-child {
  margin-bottom: 0;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 4px 0;
}

.detail-label {
  width: 120px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  text-align: right;
}

.detail-value {
  flex: 1;
  font-size: 14px;
  color: #303133;
  text-align: left;
}
</style>
