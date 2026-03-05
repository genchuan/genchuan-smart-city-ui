<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const id = detailObj.value?.complaintId || '投诉';
  return title.value || `${id}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });

const formatPhotos = (photoStr) => {
  if (!photoStr) return [];
  try {
    return JSON.parse(photoStr);
  } catch {
    return [photoStr];
  }
};
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-section">📋 投诉信息</div>
      <div class="detail-row"><span class="label">投诉编号：</span>{{ detailObj.complaintId || '-' }}</div>
      <div class="detail-row"><span class="label">关联公厕：</span>{{ detailObj.toiletName || '-' }}</div>
      <div class="detail-row"><span class="label">投诉类型：</span>{{ detailObj.complaintTypeName || '-' }}</div>
      <div class="detail-row"><span class="label">投诉内容：</span>{{ detailObj.content || '-' }}</div>
      <div class="detail-row"><span class="label">投诉人：</span>{{ detailObj.complaintName || '-' }}</div>
      <div class="detail-row"><span class="label">联系电话：</span>{{ detailObj.phone || '-' }}</div>
      <div class="detail-row"><span class="label">投诉时间：</span>{{ detailObj.complaintTime || '-' }}</div>

      <div class="detail-section">🔧 处置信息</div>
      <div class="detail-row"><span class="label">派单状态：</span>{{ detailObj.dispatchStatus || '-' }}</div>
      <div class="detail-row"><span class="label">责任人：</span>{{ detailObj.handlerName || '-' }}</div>
      <div class="detail-row"><span class="label">是否超时：</span>{{ detailObj.isTimeout === '是' ? '是' : '否' }}</div>
      <div class="detail-row"><span class="label">处置措施：</span>{{ detailObj.handleMeasure || '-' }}</div>
      <div class="detail-row"><span class="label">处置结果：</span>{{ detailObj.handleResult || '-' }}</div>
      <div class="detail-row"><span class="label">反馈内容：</span>{{ detailObj.feedbackContent || '-' }}</div>
      <div class="detail-row" v-if="detailObj.reformPhoto">
        <span class="label">整改照片：</span>
        <div class="photo-list">
          <el-image
            v-for="(url, index) in formatPhotos(detailObj.reformPhoto)"
            :key="index"
            :src="url"
            :preview-src-list="formatPhotos(detailObj.reformPhoto)"
            fit="cover"
            style="width: 80px; height: 80px; margin-right: 8px; border-radius: 4px;"
          />
        </div>
      </div>

      <div class="detail-section">📅 系统信息</div>
      <div class="detail-row"><span class="label">创建时间：</span>{{ detailObj.createTime || '-' }}</div>
      <div class="detail-row"><span class="label">更新时间：</span>{{ detailObj.updateTime || '-' }}</div>
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
.photo-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
