<template>
  <DetailDrawer title="车辆详情">
    <div class="detail-card">
      <div v-if="carData" class="detail-card-content">
        <div class="detail-card-row"><div class="detail-row-left">车辆ID：</div><div class="detail-row-right">{{ carData.id || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">车牌号：</div><div class="detail-row-right">{{ carData.plateNo || '-' }}</div></div>
        <div class="detail-card-row">
          <div class="detail-row-left">车牌颜色：</div>
          <div class="detail-row-right">
            <el-tag v-if="carData.plateColor" :type="plateColorTag(carData.plateColor)">{{ carData.plateColor }}</el-tag>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row"><div class="detail-row-left">车辆类型：</div><div class="detail-row-right">{{ carData.carType || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">车主：</div><div class="detail-row-right">{{ carData.nickname || '-' }}{{ carData.userId ? ` (ID:${carData.userId})` : '' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">手机号：</div><div class="detail-row-right">{{ carData.phone || carData.mobile || '-' }}</div></div>
        <div class="detail-card-row">
          <div class="detail-row-left">绑定状态：</div>
          <div class="detail-row-right">
            <el-tag v-if="carData.status" :type="statusTag(carData.status)">{{ carData.status }}</el-tag>
            <span v-else>-</span>
          </div>
        </div>
        <div class="detail-card-row"><div class="detail-row-left">绑定时间：</div><div class="detail-row-right">{{ fmtTime(carData.bindTime) }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">备注：</div><div class="detail-row-right">{{ carData.remark || '-' }}</div></div>
        <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ fmtTime(carData.createTime) }}</div></div>
      </div>
      <el-empty v-else description="暂无车辆数据" />
    </div>
  </DetailDrawer>
</template>

<script setup>
import { ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElEmpty, ElTag } from 'element-plus';

const fmtTime = (t) => {
  if (!t) return '-';
  const d = new Date(t);
  if (isNaN(d.getTime())) return '-';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const plateColorTag = (c) => {
  if (/绿/.test(c)) return 'success';
  if (/黄/.test(c)) return 'warning';
  if (/黑/.test(c)) return 'info';
  if (/白/.test(c)) return 'info';
  return 'primary';
};

const statusTag = (s) => {
  if (/已绑定/.test(s)) return 'success';
  if (/已解绑/.test(s)) return 'info';
  if (/待审核/.test(s)) return 'warning';
  return 'info';
};

const carData = ref(null);

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 750,
  onCancel: () => detailDrawerApi.close(),
});

const open = (data) => { carData.value = data; detailDrawerApi.open(); };
const close = () => { detailDrawerApi.close(); carData.value = null; };

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
}
.detail-row-left {
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  word-break: break-all;
}
</style>
