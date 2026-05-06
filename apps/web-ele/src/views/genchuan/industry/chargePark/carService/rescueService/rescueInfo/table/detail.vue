<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const id = detailObj.value?.id || '救援信息';
  return title.value || `${id}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 750,
  onCancel() {
    detailDrawerApi.close();
  },
  async onOpenChange() {},
});

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">救援ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">用户:</div>
        <div class="detail-row-right">{{ detailObj.userName || '-' }} (ID:{{ detailObj.userId || '-' }})</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">救援位置:</div>
        <div class="detail-row-right">{{ detailObj.locationName || detailObj.location || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">救援类型:</div>
        <div class="detail-row-right">{{ detailObj.rescueType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">派发时间:</div>
        <div class="detail-row-right">{{ detailObj.dispatchTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">救援状态:</div>
        <div class="detail-row-right">{{ detailObj.status || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">救援人员:</div>
        <div class="detail-row-right">{{ detailObj.rescueUserName || '-' }} (ID:{{ detailObj.rescueUserId || '-' }})</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">完成时间:</div>
        <div class="detail-row-right">{{ detailObj.finishTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处理时长:</div>
        <div class="detail-row-right">{{ detailObj.handleDuration ? `${detailObj.handleDuration}秒` : '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">评价得分:</div>
        <div class="detail-row-right">{{ detailObj.score ? `${detailObj.score}分` : '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">评价内容:</div>
        <div class="detail-row-right">{{ detailObj.evaluateContent || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">归档状态:</div>
        <div class="detail-row-right">{{ detailObj.archiveStatus || '未归档' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">派发备注:</div>
        <div class="detail-row-right">{{ detailObj.dispatchRemark || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">转派理由:</div>
        <div class="detail-row-right">{{ detailObj.transferReason || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">救援进度:</div>
        <div class="detail-row-right">{{ detailObj.progress || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">现场照片:</div>
        <div class="detail-row-right">
          <img v-if="detailObj.photo" :src="detailObj.photo" style="width: 100px; height: 100px" />
          <span v-else>-</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建人:</div>
        <div class="detail-row-right">{{ detailObj.creator || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新人:</div>
        <div class="detail-row-right">{{ detailObj.updater || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

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
