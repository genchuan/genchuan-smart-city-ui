<script setup>
import { computed, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { formatTimestamp } from '#/utils';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const { detailObj, title } = toRefs(props);
const drawerTitle = computed(() => title.value || `预约${detailObj.value?.id || ''}详情`);

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 750,
  onCancel: () => detailDrawerApi.close(),
});
defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row"><div class="detail-row-left">预约ID：</div><div class="detail-row-right">{{ detailObj.id || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">用户：</div><div class="detail-row-right">{{ detailObj.userName || '-' }} (ID:{{ detailObj.userId || '-' }})</div></div>
      <div class="detail-card-row"><div class="detail-row-left">场站：</div><div class="detail-row-right">{{ detailObj.stationName || '-' }} (ID:{{ detailObj.stationId || '-' }})</div></div>
      <div class="detail-card-row"><div class="detail-row-left">车位：</div><div class="detail-row-right">{{ detailObj.spaceName || '-' }} (ID:{{ detailObj.spaceId || '-' }})</div></div>
      <div class="detail-card-row"><div class="detail-row-left">预约时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.reserveTime) || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">预约类型：</div><div class="detail-row-right">{{ detailObj.reserveType || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">状态：</div><div class="detail-row-right">{{ detailObj.status || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">审核人：</div><div class="detail-row-right">{{ detailObj.auditUserName || '-' }} (ID:{{ detailObj.auditUserId || '-' }})</div></div>
      <div class="detail-card-row"><div class="detail-row-left">审核时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.auditTime) || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">审核备注：</div><div class="detail-row-right">{{ detailObj.auditRemark || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">驳回理由：</div><div class="detail-row-right">{{ detailObj.rejectReason || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">完成时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.finishTime) || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">评价得分：</div><div class="detail-row-right">{{ detailObj.score ? `${detailObj.score}分` : '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">评价内容：</div><div class="detail-row-right">{{ detailObj.evaluateContent || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.createTime) || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.updateTime) || '-' }}</div></div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card { padding: 20px; background-color: #f9fafb; border-radius: 8px; max-height: 70vh; overflow-y: auto; }
.detail-card-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.detail-row-left { width: 120px; flex-shrink: 0; font-weight: 500; color: #606266; }
.detail-row-right { flex: 1; color: #303133; word-break: break-all; }
</style>
