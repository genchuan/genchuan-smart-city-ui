<script setup>
import { computed, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const { detailObj, title } = toRefs(props);
const drawerTitle = computed(() => title.value || `路径规划${detailObj.value?.id || ''}详情`);

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 750,
  onCancel: () => detailDrawerApi.close(),
});
defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row"><div class="detail-row-left">规划ID：</div><div class="detail-row-right">{{ detailObj.id || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">用户：</div><div class="detail-row-right">{{ detailObj.userName || '-' }} (ID:{{ detailObj.userId || '-' }})</div></div>
      <div class="detail-card-row"><div class="detail-row-left">起点位置：</div><div class="detail-row-right">{{ detailObj.startLocationName || detailObj.startLocation || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">终点位置：</div><div class="detail-row-right">{{ detailObj.endLocationName || detailObj.endLocation || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">规划时间：</div><div class="detail-row-right">{{ detailObj.planTime || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">路径长度：</div><div class="detail-row-right">{{ detailObj.pathLength ? `${detailObj.pathLength}米` : '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">预计时长：</div><div class="detail-row-right">{{ detailObj.expectDuration ? `${detailObj.expectDuration}秒` : '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建人：</div><div class="detail-row-right">{{ detailObj.creator || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ detailObj.createTime || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新人：</div><div class="detail-row-right">{{ detailObj.updater || '-' }}</div></div>
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
