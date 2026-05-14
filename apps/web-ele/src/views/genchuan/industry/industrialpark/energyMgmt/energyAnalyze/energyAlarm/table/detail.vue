<!-- ==================== detail.vue（区域详情抽屉）==================== -->
<script setup>
import { computed, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { formatTimestamp } from '#/utils';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const { detailObj, title } = toRefs(props);
const drawerTitle = computed(() => title.value || `区域${detailObj.value?.id || ''}详情`);

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 750,
  onCancel: () => detailDrawerApi.close(),
});
defineExpose({ open: (data) => { detailObj.value = data; detailDrawerApi.open(); }, close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row"><div class="detail-row-left">区域ID：</div><div class="detail-row-right">{{ detailObj.id || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">区域名称：</div><div class="detail-row-right">{{ detailObj.areaName || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">区域面积：</div><div class="detail-row-right">{{ detailObj.areaSize ? `${detailObj.areaSize}㎡` : '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">能耗总量：</div><div class="detail-row-right">{{ detailObj.totalEnergy ? `${detailObj.totalEnergy}kWh` : '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">单位面积能耗：</div><div class="detail-row-right">{{ detailObj.unitEnergy ? `${detailObj.unitEnergy}kWh/㎡` : '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">能耗状态：</div><div class="detail-row-right">{{ detailObj.energyStatus || '-' }}</div></div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card { padding: 20px; background-color: #f9fafb; border-radius: 8px; max-height: 70vh; overflow-y: auto; }
.detail-card-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.detail-row-left { width: 120px; flex-shrink: 0; font-weight: 500; color: #606266; }
.detail-row-right { flex: 1; color: #303133; word-break: break-all; }
</style>
