<!-- 文件4: src/views/genchuan/industry/industrialpark/securityMgmt/perimeterProtect/perimeterAlarm/components/detail.vue -->
<script setup>
import { computed, toRefs, ref } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { formatTimestamp } from '#/api/genchuan/industry/industrialpark/securityMgmt/perimeterProtect/perimeterAlarm/form.js';
import { getProtectAreaDetail, getPerimeterDeviceDetail } from '#/api/genchuan/industry/industrialpark/securityMgmt/perimeterProtect/perimeterAlarm/data.js';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const emit = defineEmits(['refresh']);

const { detailObj, title } = toRefs(props);

const areaDetail = ref(null);
const deviceDetail = ref(null);

const drawerTitle = computed(() => {
  const name = detailObj.value?.alarmArea ? `${detailObj.value.alarmArea} 告警详情` : '周界告警详情';
  return title.value || name;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({
  open: async () => {
    detailDrawerApi.open();
    if (detailObj.value?.areaId) {
      try {
        areaDetail.value = await getProtectAreaDetail({ id: detailObj.value.areaId });
      } catch (error) {
        console.error('获取防护区域详情失败', error);
      }
    }
    if (detailObj.value?.deviceId) {
      try {
        deviceDetail.value = await getPerimeterDeviceDetail({ id: detailObj.value.deviceId });
      } catch (error) {
        console.error('获取周界设备详情失败', error);
      }
    }
  },
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 告警基础信息 -->
      <div class="detail-section">⚠️ 告警基础信息</div>
      <div class="detail-card-row"><div class="detail-row-left">告警区域：</div><div class="detail-row-right">{{ detailObj.alarmArea || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">告警时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.alarmTime) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">告警类型：</div><div class="detail-row-right">{{ detailObj.alarmType || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">关联设备：</div><div class="detail-row-right">{{ detailObj.deviceId || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">告警状态：</div><div class="detail-row-right">{{ detailObj.alarmStatus || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">处置人：</div><div class="detail-row-right">{{ detailObj.handleUser || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">处置结果：</div><div class="detail-row-right">{{ detailObj.handleResult || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">联动监控状态：</div><div class="detail-row-right">{{ detailObj.linkStatus || '-' }}</div></div>

      <!-- 防护区域信息 -->
      <div class="detail-section">🛡️ 防护区域信息</div>
      <div class="detail-card-row"><div class="detail-row-left">区域名称：</div><div class="detail-row-right">{{ areaDetail?.areaName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">位置：</div><div class="detail-row-right">{{ areaDetail?.location || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">布防状态：</div><div class="detail-row-right">{{ areaDetail?.defendStatus || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">灵敏度：</div><div class="detail-row-right">{{ areaDetail?.sensitivity || '-' }}</div></div>

      <!-- 周界设备信息 -->
      <div class="detail-section">📟 周界设备信息</div>
      <div class="detail-card-row"><div class="detail-row-left">设备名称：</div><div class="detail-row-right">{{ deviceDetail?.name || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">设备型号：</div><div class="detail-row-right">{{ deviceDetail?.model || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">设备状态：</div><div class="detail-row-right">{{ deviceDetail?.status || '-' }}</div></div>

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
