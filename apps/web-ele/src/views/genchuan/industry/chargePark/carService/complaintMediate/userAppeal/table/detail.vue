<script setup>
import { computed, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { formatTimestamp } from '#/utils';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const { detailObj, title } = toRefs(props);
const drawerTitle = computed(() => title.value || `用户申诉${detailObj.value?.id || ''}详情`);

const fmtTime = (v) => {
  if (v == null || v === '') return '-';
  const r = formatTimestamp(v);
  return r || '-';
};

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false, appendToMain: true, footer: false, width: 750,
  onCancel: () => detailDrawerApi.close(),
});
defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row"><div class="detail-row-left">申诉ID：</div><div class="detail-row-right">{{ detailObj.id || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">用户：</div><div class="detail-row-right">{{ detailObj.userName || '-' }} (ID:{{ detailObj.userId || '-' }})</div></div>
      <div class="detail-card-row"><div class="detail-row-left">关联订单：</div><div class="detail-row-right">{{ detailObj.orderId || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">申诉内容：</div><div class="detail-row-right">{{ detailObj.content || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">提交时间：</div><div class="detail-row-right">{{ fmtTime(detailObj.submitTime) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">申诉状态：</div><div class="detail-row-right">{{ detailObj.status || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">审核人：</div><div class="detail-row-right">{{ detailObj.auditUserName || '-' }} (ID:{{ detailObj.auditUserId || '-' }})</div></div>
      <div class="detail-card-row"><div class="detail-row-left">审核时间：</div><div class="detail-row-right">{{ fmtTime(detailObj.auditTime) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">驳回理由：</div><div class="detail-row-right">{{ detailObj.rejectReason || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">处置人：</div><div class="detail-row-right">{{ detailObj.handleUserName || '-' }} (ID:{{ detailObj.handleUserId || '-' }})</div></div>
      <div class="detail-card-row"><div class="detail-row-left">处置时间：</div><div class="detail-row-right">{{ fmtTime(detailObj.handleTime) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">反馈内容：</div><div class="detail-row-right">{{ detailObj.feedbackContent || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">反馈时间：</div><div class="detail-row-right">{{ fmtTime(detailObj.feedbackTime) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建人：</div><div class="detail-row-right">{{ detailObj.creator || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">创建时间：</div><div class="detail-row-right">{{ fmtTime(detailObj.createTime) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新人：</div><div class="detail-row-right">{{ detailObj.updater || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ fmtTime(detailObj.updateTime) }}</div></div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card { padding: 20px; background-color: #f9fafb; border-radius: 8px; max-height: 70vh; overflow-y: auto; }
.detail-card-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.detail-row-left { width: 120px; flex-shrink: 0; font-weight: 500; color: #606266; }
.detail-row-right { flex: 1; color: #303133; word-break: break-all; }
</style>
