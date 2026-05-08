<template>
  <DetailDrawer title="订单详情">
    <div class="detail-card" v-loading="loading">
      <div v-if="orderData" class="detail-card-content">
        <div class="detail-card-row"><div class="detail-row-left">订单ID：</div><div class="detail-row-right">{{ orderData.id || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">订单编号：</div><div class="detail-row-right">{{ orderData.orderNo || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">订单类型：</div><div class="detail-row-right">{{ orderData.orderType || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">车牌号：</div><div class="detail-row-right">{{ orderData.plateNo || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">订单金额：</div><div class="detail-row-right">{{ orderData.amount != null ? `￥${orderData.amount}` : '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">优惠抵扣：</div><div class="detail-row-right">{{ orderData.discountAmount != null ? `￥${orderData.discountAmount}` : '-' }}</div></div>
        <div class="detail-card-row">
          <div class="detail-row-left">支付状态：</div>
          <div class="detail-row-right">
            <el-tag v-if="orderData.status" :type="statusType(orderData.status)">{{ orderData.status }}</el-tag>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row"><div class="detail-row-left">支付方式：</div><div class="detail-row-right">{{ orderData.payMethod || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">所属场站：</div><div class="detail-row-right">{{ orderData.stationName || '-' }}{{ orderData.stationId ? ` (ID:${orderData.stationId})` : '' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">订单生成时间：</div><div class="detail-row-right">{{ fmtTime(orderData.createOrderTime) }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">支付时间：</div><div class="detail-row-right">{{ fmtTime(orderData.payTime) }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">归档时间：</div><div class="detail-row-right">{{ fmtTime(orderData.archiveTime) }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">操作人ID：</div><div class="detail-row-right">{{ orderData.operatorId || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ fmtTime(orderData.createTime) }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ fmtTime(orderData.updateTime) }}</div></div>
      </div>
      <el-empty v-else description="暂无订单数据" />
    </div>
  </DetailDrawer>
</template>

<script setup>
import { ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const fmtTime = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '-';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const statusType = (s) => {
  if (!s) return 'info';
  if (/已支付|成功/.test(s)) return 'success';
  if (/失败|取消/.test(s)) return 'danger';
  if (/退款/.test(s)) return 'warning';
  return 'info';
};

const loading = ref(false);
const orderData = ref(null);

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 750,
  onCancel: () => detailDrawerApi.close(),
});

const open = (data) => { orderData.value = data; detailDrawerApi.open(); };
const close = () => { detailDrawerApi.close(); orderData.value = null; };

defineExpose({ open, close });
</script>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 450px;
  max-height: 70vh;
  overflow-y: auto;
}
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none; }
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
.detail-row-left {
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;
}
</style>
