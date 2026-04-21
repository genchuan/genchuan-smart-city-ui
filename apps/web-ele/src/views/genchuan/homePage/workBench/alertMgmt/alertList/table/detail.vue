<template>
  <DetailDrawer :title="title || `预警详情 - ${detailObj.alertNo}`">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">预警编号:</div>
        <div class="detail-row-right">{{ detailObj.alertNo }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警等级:</div>
        <div class="detail-row-right">
          <el-tag :type="levelTagType(detailObj.level)" size="small">{{ detailObj.level }}</el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警类型:</div>
        <div class="detail-row-right">{{ detailObj.type }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">发生时间:</div>
        <div class="detail-row-right">{{ formatTime(detailObj.occurTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联对象ID:</div>
        <div class="detail-row-right">{{ detailObj.relateObjId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">发生地点:</div>
        <div class="detail-row-right">{{ detailObj.address || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警状态:</div>
        <div class="detail-row-right">
          <el-tag :type="statusTagType(detailObj.status)" size="small">{{ detailObj.status }}</el-tag>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置人ID:</div>
        <div class="detail-row-right">{{ detailObj.handleUserId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置进度:</div>
        <div class="detail-row-right">
          <el-progress v-if="detailObj.progress !== undefined" :percentage="detailObj.progress" :status="detailObj.progress === 100 ? 'success' : ''" style="width: 200px" />
          <span v-else>-</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">忽略理由:</div>
        <div class="detail-row-right">{{ detailObj.ignoreReason || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关闭时间:</div>
        <div class="detail-row-right">{{ formatTime(detailObj.closeTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置凭证:</div>
        <div class="detail-row-right">
          <a v-if="detailObj.voucherUrl" :href="detailObj.voucherUrl" target="_blank">查看凭证</a>
          <span v-else>-</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警描述:</div>
        <div class="detail-row-right">{{ detailObj.description || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">{{ formatTime(detailObj.createTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">{{ formatTime(detailObj.updateTime) }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<script setup>
import { defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' }
});
const { detailObj, title } = toRefs(props);

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel: () => detailDrawerApi.close(),
  onConfirm: () => {},
  onOpenChange: () => {}
});

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close()
});

const formatTime = (ts) => {
  if (!ts) return '-';
  const d = new Date(parseInt(ts) * 1000);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
};

const levelTagType = (level) => {
  if (level === '高危') return 'danger';
  if (level === '高') return 'warning';
  if (level === '中') return 'primary';
  return 'info';
};

const statusTagType = (status) => {
  if (status === '未处理') return 'info';
  if (status === '处理中') return 'primary';
  if (status === '已关闭') return 'success';
  return 'info';
};
</script>

<style scoped lang="scss">
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 300px;
}
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none; }
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
@media (max-width: 768px) {
  .detail-row-left { width: 100px; }
}
</style>
