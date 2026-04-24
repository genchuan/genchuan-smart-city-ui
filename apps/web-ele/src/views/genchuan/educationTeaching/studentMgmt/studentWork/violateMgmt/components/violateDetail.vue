<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const emit = defineEmits(['refresh']);

const { detailObj, title } = toRefs(props);

// 时间戳格式化
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
  const id = detailObj.value?.studentId || '违纪';
  return title.value || `学号${id} 违纪详情`;
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
      <!-- 基础信息 -->
      <div class="detail-section">⚠️ 违纪基础信息</div>
      <div class="detail-card-row"><div class="detail-row-left">学号：</div><div class="detail-row-right">{{ detailObj.studentId || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">班级：</div><div class="detail-row-right">{{ detailObj.className || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">违纪类型：</div><div class="detail-row-right">{{ detailObj.violateType || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">处分类型：</div><div class="detail-row-right">{{ detailObj.punishType || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">违纪时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.violateTime) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">违纪原因：</div><div class="detail-row-right">{{ detailObj.violateReason || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">状态：</div><div class="detail-row-right">{{ detailObj.status || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">备注：</div><div class="detail-row-right">{{ detailObj.remark || '-' }}</div></div>

      <!-- 审批记录 -->
      <div class="detail-section">📝 审批记录</div>
      <div class="detail-card-row"><div class="detail-row-left">审批人：</div><div class="detail-row-right">{{ detailObj.auditUser || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">审批时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.auditTime) }}</div></div>

      <!-- 推送记录 -->
      <div class="detail-section">📢 推送记录</div>
      <div class="detail-card-row"><div class="detail-row-left">家长推送时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.pushTime) }}</div></div>

      <!-- 预警记录 -->
      <div class="detail-section">🔔 预警记录</div>
      <div class="detail-card-row"><div class="detail-row-left">预警时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.warnTime) }}</div></div>

      <!-- 操作日志 -->
      <div class="detail-section">📋 操作日志</div>
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
