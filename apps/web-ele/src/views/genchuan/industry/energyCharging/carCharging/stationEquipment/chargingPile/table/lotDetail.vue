<!-- charging-pile/table/lotDetail.vue -->
<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card" v-loading="loading">
      <div class="detail-card-row">
        <div class="detail-row-left">车位编号：</div>
        <div class="detail-row-right">{{ detail.lotCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车位名称：</div>
        <div class="detail-row-right">{{ detail.lotName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属场站：</div>
        <div class="detail-row-right">{{ detail.stationName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车位类型：</div>
        <div class="detail-row-right">{{ lotTypeMap[detail.lotType] || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">绑定充电桩：</div>
        <div class="detail-row-right">{{ detail.pileName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">占用时长(分钟)：</div>
        <div class="detail-row-right">{{ detail.occupyTime || 0 }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车位状态：</div>
        <div class="detail-row-right">{{ lotStatusMap[detail.lotStatus] || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">超时占用时长(分钟)：</div>
        <div class="detail-row-right">{{ detail.occupyTimeout || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">维保原因：</div>
        <div class="detail-row-right">{{ detail.maintainReason || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">备注：</div>
        <div class="detail-row-right">{{ detail.remark || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ formatDate(detail.createTime) }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';
import { getLotDetail } from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingPile/index.js';

const detail = ref({});
const loading = ref(false);

const lotTypeMap = {
  '1': '快充车位',
  '2': '慢充车位',
};

const lotStatusMap = {
  '0': '空闲',
  '1': '占用',
  '2': '维护中',
};

const drawerTitle = computed(() => {
  return detail.value.lotCode ? `车位详情 - ${detail.value.lotCode}` : '车位详情';
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
  onCancel() { detailDrawerApi.close(); },
});

const open = async (lotId) => {
  if (!lotId) {
    ElMessage.warning('无效的车位ID');
    return;
  }
  loading.value = true;
  try {
    const res = await getLotDetail(lotId);
    detail.value = res || {};
    detailDrawerApi.open();
  } catch (error) {
    ElMessage.error('获取车位详情失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
};

defineExpose({ open });
</script>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 400px;
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
  width: 140px !important;
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
@media (max-width: 768px) {
  .detail-row-left { width: 120px; }
  .detail-card { padding: 15px; max-height: 60vh; }
}
.detail-card::-webkit-scrollbar { width: 6px; }
.detail-card::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
.detail-card::-webkit-scrollbar-thumb { background: #dcdfe6; border-radius: 3px; }
.detail-card::-webkit-scrollbar-thumb:hover { background: #c0c4cc; }
</style>
