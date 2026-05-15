<!-- detail.vue -->
<!-- 策略详情抽屉，用于展示策略完整信息 -->
<script setup>
import { computed, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { formatTimestamp } from '#/utils'; // 导入时间戳格式化工具

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const { detailObj, title } = toRefs(props);
const drawerTitle = computed(() => title.value || `策略${detailObj.value?.id || ''}详情`);

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 750,
  onCancel: () => detailDrawerApi.close(),
});
defineExpose({ open: (data) => { detailObj.value = data; detailDrawerApi.open(); }, close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row"><div class="detail-row-left">策略ID：</div><div class="detail-row-right">{{ detailObj.id || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">策略名称：</div><div class="detail-row-right">{{ detailObj.strategyName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">策略类型：</div><div class="detail-row-right">{{ detailObj.strategyType || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">关联设备：</div><div class="detail-row-right">{{ detailObj.deviceName || '-' }} (ID: {{ detailObj.deviceId || '-' }})</div></div>
      <div class="detail-card-row"><div class="detail-row-left">执行时间：</div><div class="detail-row-right">{{ detailObj.executeTime || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">策略状态：</div><div class="detail-row-right">{{ detailObj.strategyStatus || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">节能总量：</div><div class="detail-row-right">{{ detailObj.saveEnergy || '-' }} kWh</div></div>
      <div class="detail-card-row"><div class="detail-row-left">节能率：</div><div class="detail-row-right">{{ detailObj.saveRate || '-' }}%</div></div>
      <div class="detail-card-row"><div class="detail-row-left">评估结果：</div><div class="detail-row-right">{{ detailObj.evaluateResult || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">操作人：</div><div class="detail-row-right">{{ detailObj.handleUser || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ detailObj.createTime ? formatTimestamp(detailObj.createTime) : '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ detailObj.updateTime ? formatTimestamp(detailObj.updateTime) : '-' }}</div></div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card { padding: 20px; background-color: #f9fafb; border-radius: 8px; max-height: 70vh; overflow-y: auto; }
.detail-card-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.detail-row-left { width: 120px; flex-shrink: 0; font-weight: 500; color: #606266; }
.detail-row-right { flex: 1; color: #303133; word-break: break-all; }
</style>
