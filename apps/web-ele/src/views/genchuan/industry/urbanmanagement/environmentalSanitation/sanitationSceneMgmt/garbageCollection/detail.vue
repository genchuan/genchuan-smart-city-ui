<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const planNo = detailObj.value?.planNo || '收运计划';
  return title.value || `${planNo}详情`;
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
      <!-- 计划信息 -->
      <div class="detail-section">📋 计划信息</div>
      <div class="detail-row"><span class="label">计划单编号：</span>{{ detailObj.planNo || '-' }}</div>
      <div class="detail-row"><span class="label">收运品类：</span>{{ detailObj.garbageTypeName || '-' }}</div>
      <div class="detail-row"><span class="label">收运区域：</span>{{ detailObj.areaName || '-' }}</div>
      <div class="detail-row"><span class="label">收运频次：</span>{{ detailObj.frequency || '-' }}</div>
      <div class="detail-row"><span class="label">收运时段：</span>{{ detailObj.timePeriod || '-' }}</div>
      <div class="detail-row"><span class="label">负责车辆：</span>{{ detailObj.vehicleLicensePlate || '-' }}</div>
      <div class="detail-row"><span class="label">负责人员：</span>{{ detailObj.usersName || '-' }}</div>
      <div class="detail-row"><span class="label">计划状态：</span>{{ detailObj.planStatusName || '-' }}</div>
      <div class="detail-row"><span class="label">完成率：</span>{{ detailObj.completionRate !== undefined ? detailObj.completionRate + '%' : '-' }}</div>
      <div class="detail-row"><span class="label">异常记录数：</span>{{ detailObj.abnormalCount ?? '-' }}</div>
      <div class="detail-row"><span class="label">总收运量：</span>{{ detailObj.totalVolume || '-' }} 吨</div>
      <div class="detail-row"><span class="label">异常处置结果：</span>{{ detailObj.abnormalResult || '-' }}</div>
      <div class="detail-row"><span class="name">创建人：</span>{{ detailObj.createByName || '-' }}</div>

      <!-- 执行记录 -->
      <div class="detail-section">📌 执行记录</div>
      <div class="detail-row"><span class="label">当前进度：</span>{{ detailObj.completionRate || 0 }}%</div>
      <div class="detail-row"><span class="label">已收运量：</span>{{ detailObj.collectedVolume || 0 }} 吨</div>
      <div class="detail-row"><span class="label">打卡状态：</span>{{ detailObj.checkinStatus || '未打卡' }}</div>
      <div class="detail-row"><span class="label">最新上报时间：</span>{{ detailObj.lastReportTime || '-' }}</div>

      <!-- 时间信息 -->
      <div class="detail-section">📅 时间信息</div>
      <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
      <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}</div>
      <div class="detail-row"><span class="label">完成时间：</span>{{ detailObj.completeTime }}</div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  max-height: 70vh;
  overflow-y: auto;
}
.detail-section {
  font-weight: 600;
  font-size: 16px;
  margin: 16px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
}
.detail-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  .label {
    width: 130px;
    flex-shrink: 0;
    font-weight: 500;
    color: #606266;
  }
  &:hover {
    background: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    margin-left: -8px;
  }
}
</style>
