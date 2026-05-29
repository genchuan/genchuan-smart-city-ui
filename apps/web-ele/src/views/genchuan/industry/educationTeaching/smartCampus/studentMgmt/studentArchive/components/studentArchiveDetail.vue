<script setup>
import { computed, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});
const emit = defineEmits(['refresh']);

const { detailObj, title } = toRefs(props);

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const statusMap = { '0': '在籍', '1': '休学', '2': '退学', '3': '异动' };
const processStatusMap = { '0': '待审核', '1': '正常', '2': '已归档' };
const getStatusLabel = (status) => statusMap[status] || status;
const getProcessStatusLabel = (status) => processStatusMap[status] || status;

const drawerTitle = computed(() => {
  const name = detailObj.value?.studentNo ? `学号 ${detailObj.value.studentNo} 学籍详情` : '学籍详情';
  return title.value || name;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({ open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close() });
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-section">📋 学籍基础信息</div>
      <div class="detail-card-row"><div class="detail-row-left">学生编号：</div><div class="detail-row-right">{{ detailObj.studentNo || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">姓名：</div><div class="detail-row-right">{{ detailObj.name || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">班级：</div><div class="detail-row-right">{{ detailObj.classId || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">专业：</div><div class="detail-row-right">{{ detailObj.major || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">层次：</div><div class="detail-row-right">{{ detailObj.level || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">学习形式：</div><div class="detail-row-right">{{ detailObj.studyType || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">身份证号：</div><div class="detail-row-right">{{ detailObj.idCard || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">联系电话：</div><div class="detail-row-right">{{ detailObj.phone || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">家长电话：</div><div class="detail-row-right">{{ detailObj.parentPhone || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">学籍状态：</div><div class="detail-row-right">{{ getStatusLabel(detailObj.status) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">建档时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.archiveTime) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">流程状态：</div><div class="detail-row-right">{{ getProcessStatusLabel(detailObj.processStatus) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">驳回原因：</div><div class="detail-row-right">{{ detailObj.rejectReason || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">异动原因：</div><div class="detail-row-right">{{ detailObj.changeReason || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">佐证材料：</div><div class="detail-row-right"><el-link v-if="detailObj.evidenceUrl" :href="detailObj.evidenceUrl" target="_blank">下载</el-link><span v-else>-</span></div></div>
      <div class="detail-card-row"><div class="detail-row-left">备注：</div><div class="detail-row-right">{{ detailObj.remark || '-' }}</div></div>

      <div class="detail-section">📋 操作日志</div>
      <div class="detail-card-row"><div class="detail-row-left">建档人：</div><div class="detail-row-right">{{ detailObj.creator || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">建档时间(系统)：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.createTime) }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">审核/维护人：</div><div class="detail-row-right">{{ detailObj.updater || '-' }}</div></div>
      <div class="detail-card-row"><div class="detail-row-left">更新时间：</div><div class="detail-row-right">{{ formatTimestamp(detailObj.updateTime) }}</div></div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  min-height: 750px;
  max-height: 85vh;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9fafb;
  border-radius: 8px;
}
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none; }
  &:hover {
    padding-right: 8px;
    padding-left: 8px;
    margin-right: -8px;
    margin-left: -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}
.detail-row-left {
  flex-shrink: 0;
  width: 200px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: #606266;
}
.detail-row-right {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133;
  word-break: break-all;
}
.detail-section {
  font-weight: 600;
  font-size: 16px;
  margin: 16px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
  color: #6E7E91;
  &:first-child { margin-top: 0; }
}
</style>
