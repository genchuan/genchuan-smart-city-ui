<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const emit = defineEmits(['refresh']);

const { detailObj, title } = toRefs(props);

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const drawerTitle = computed(() => {
  const name = detailObj.value?.dutyUser || '值班';
  return title.value || `${name}值班详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-section">📅 值班基础信息</div>
      <div class="detail-card-row"><div class="detail-row-left">值班日期：</div><div class="detail-row-right">{{ detailObj.dutyDate || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">值班人：</div><div class="detail-row-right">{{ detailObj.dutyUser || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">打卡时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.checkInTime) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">打卡状态：</div><div class="detail-row-right">{{ detailObj.checkInStatus || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">调班原因：</div><div class="detail-row-right">{{ detailObj.transferReason || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">调班替代人：</div><div class="detail-row-right">{{ detailObj.transferUser || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">调班状态：</div><div class="detail-row-right">{{ detailObj.transferStatus || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">出车事由：</div><div class="detail-row-right">{{ detailObj.carReason || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">出车目的地：</div><div class="detail-row-right">{{ detailObj.carDestination || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">出车状态：</div><div class="detail-row-right">{{ detailObj.carStatus || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">值班记录：</div><div class="detail-row-right">{{ detailObj.recordContent || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">记录上传时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.recordUploadTime) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">状态：</div><div class="detail-row-right">{{ detailObj.status || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">备注：</div><div class="detail-row-right">{{ detailObj.remark || '-' }}</div></div>

      <div class="detail-section">📝 操作日志</div>
      <div class="detail-card-row"><div class="detail-row-left">创建人：</div><div class="detail-row-right">{{ detailObj.creator || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.createTime) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新人：</div><div class="detail-row-right">{{ detailObj.updater || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.updateTime) }}</div></div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  min-height: 750px;
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
  &:last-child { border-bottom: none; }
  &:hover {
    padding-right: 8px;
    padding-left: 8px;
    margin-right: -8px;
    margin-left: -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}
.detail-row-left {
  flex-shrink: 0;
  width: 200px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: #606266;
}
.detail-row-right {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133;
  word-break: break-all;
}
.detail-section {
  font-weight: 600;
  font-size: 16px;
  margin: 16px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
  color: #6E7E91;
  &:first-child { margin-top: 0; }
}
</style>
