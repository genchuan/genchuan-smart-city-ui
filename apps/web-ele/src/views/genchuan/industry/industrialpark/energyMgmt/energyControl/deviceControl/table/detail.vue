<!-- ==================== detail.vue（设备详情抽屉）==================== -->
<script setup>
import { computed, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const { detailObj, title } = toRefs(props);
const drawerTitle = computed(() => title.value || `设备${detailObj.value?.id || ''}详情`);

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 750,
  onCancel: () => detailDrawerApi.close(),
});
defineExpose({ open: (data) => { detailObj.value = data; detailDrawerApi.open(); }, close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row"><div class="detail-row-left">设备ID：</div><div class="detail-row-right">{{ detailObj.id || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">设备名称：</div><div class="detail-row-right">{{ detailObj.deviceName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">设备类型：</div><div class="detail-row-right">{{ detailObj.deviceType || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">关联策略：</div><div class="detail-row-right">{{ detailObj.strategyName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">管控规则：</div><div class="detail-row-right">{{ detailObj.controlRule || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">管控状态：</div><div class="detail-row-right">{{ detailObj.controlStatus || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">管控前能耗：</div><div class="detail-row-right">{{ detailObj.beforeEnergy ? `${detailObj.beforeEnergy} kWh` : '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">管控后能耗：</div><div class="detail-row-right">{{ detailObj.afterEnergy ? `${detailObj.afterEnergy} kWh` : '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">能耗下降值：</div><div class="detail-row-right">{{ detailObj.downEnergy ? `${detailObj.downEnergy} kWh` : '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">操作人：</div><div class="detail-row-right">{{ detailObj.handleUser || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ detailObj.createTime || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div></div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card { padding: 20px; background-color: #f9fafb; border-radius: 8px; max-height: 70vh; overflow-y: auto; }
.detail-card-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.detail-row-left { width: 120px; flex-shrink: 0; font-weight: 500; color: #606266; }
.detail-row-right { flex: 1; color: #303133; word-break: break-all; }
</style>
