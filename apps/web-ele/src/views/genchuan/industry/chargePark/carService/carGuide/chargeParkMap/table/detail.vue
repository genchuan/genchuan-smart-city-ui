<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">查询ID：</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">用户：</div>
        <div class="detail-row-right">{{ detailObj.userName || '-' }} (ID:{{ detailObj.userId || '-' }})</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">查询位置：</div>
        <div class="detail-row-right">{{ detailObj.queryLocation || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">查询时间：</div>
        <div class="detail-row-right">{{ detailObj.queryTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">查询结果数：</div>
        <div class="detail-row-right">{{ detailObj.resultCount || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">响应时长：</div>
        <div class="detail-row-right">{{ detailObj.responseDuration ? `${detailObj.responseDuration} ms` : '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间：</div>
        <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailData: {
    type: Object,
    default: () => ({}),
  },
});

const detailObj = ref({});

watch(
  () => props.detailData,
  (val) => {
    if (val) detailObj.value = val;
  },
  { immediate: true, deep: true }
);

const drawerTitle = computed(() => {
  const id = detailObj.value?.id || '查询记录';
  return `${id}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 750,
  onCancel() {
    detailDrawerApi.close();
  },
});

const open = () => detailDrawerApi.open();
const close = () => detailDrawerApi.close();

defineExpose({ open, close });
</script>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 450px;
  max-height: 70vh;
  overflow-y: auto;
}
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    transition: all 0.2s ease;
  }
}
.detail-row-left {
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;
}
</style>
