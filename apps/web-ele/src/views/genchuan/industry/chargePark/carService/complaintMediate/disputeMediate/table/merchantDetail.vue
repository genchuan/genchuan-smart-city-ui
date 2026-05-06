<template>
  <DetailDrawer title="商户详情">
    <div class="detail-card" v-loading="loading">
      <div v-if="merchantData" class="detail-card-content">
        <div class="detail-card-row"><div class="detail-row-left">商户ID：</div><div class="detail-row-right">{{ merchantData.id || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">商户名称：</div><div class="detail-row-right">{{ merchantData.name || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">联系人：</div><div class="detail-row-right">{{ merchantData.contact || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">联系电话：</div><div class="detail-row-right">{{ merchantData.phone || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">商户类型：</div><div class="detail-row-right">{{ merchantData.merchantType || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">商户地址：</div><div class="detail-row-right">{{ merchantData.address || '-' }}</div></div>
        <div class="detail-card-row">
          <div class="detail-row-left">商户状态：</div>
          <div class="detail-row-right">
            <el-tag v-if="merchantData.status" :type="statusType(merchantData.status)">{{ merchantData.status }}</el-tag>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row"><div class="detail-row-left">账户余额：</div><div class="detail-row-right">{{ merchantData.walletBalance != null ? `￥${merchantData.walletBalance}` : '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">注册时间：</div><div class="detail-row-right">{{ fmtTime(merchantData.registerTime) }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">审核人ID：</div><div class="detail-row-right">{{ merchantData.auditorId || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">审核时间：</div><div class="detail-row-right">{{ fmtTime(merchantData.auditTime) }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">备注：</div><div class="detail-row-right">{{ merchantData.remark || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ fmtTime(merchantData.createTime) }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ fmtTime(merchantData.updateTime) }}</div></div>
      </div>
      <el-empty v-else description="暂无商户数据" />
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
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
};

const statusType = (s) => {
  if (!s) return 'info';
  if (/正常/.test(s)) return 'success';
  if (/驳回|禁用/.test(s)) return 'danger';
  if (/待/.test(s)) return 'warning';
  return 'info';
};

const loading = ref(false);
const merchantData = ref(null);

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 750,
  onCancel: () => detailDrawerApi.close(),
});

const open = (data) => { merchantData.value = data; detailDrawerApi.open(); };
const close = () => { detailDrawerApi.close(); merchantData.value = null; };

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
