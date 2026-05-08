<script setup>
import { computed, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { formatTimestamp } from '#/utils';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const { detailObj, title } = toRefs(props);
const drawerTitle = computed(() => title.value || `纠纷调解${detailObj.value?.id || ''}详情`);

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
      <div class="detail-card-row"><div class="detail-row-left">调解ID：</div><div class="detail-row-right">{{ detailObj.id || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">用户：</div><div class="detail-row-right">{{ detailObj.userName || '-' }} (ID:{{ detailObj.userId || '-' }})</div></div>
      <div class="detail-card-row"><div class="detail-row-left">商户：</div><div class="detail-row-right">{{ detailObj.merchantName || '-' }} (ID:{{ detailObj.merchantId || '-' }})</div></div>
      <div class="detail-card-row"><div class="detail-row-left">纠纷内容：</div><div class="detail-row-right">{{ detailObj.content || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">发起时间：</div><div class="detail-row-right">{{ fmtTime(detailObj.submitTime) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">调解状态：</div><div class="detail-row-right">{{ detailObj.status || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">调解人：</div><div class="detail-row-right">{{ detailObj.mediateUserName || '-' }} (ID:{{ detailObj.mediateUserId || '-' }})</div></div>
      <div class="detail-card-row"><div class="detail-row-left">调解进度：</div><div class="detail-row-right">{{ detailObj.progress || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">确认结果：</div><div class="detail-row-right">{{ detailObj.confirmResult || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">确认时间：</div><div class="detail-row-right">{{ fmtTime(detailObj.confirmTime) }}</div></div>
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
