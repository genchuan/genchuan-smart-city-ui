<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
  deptOptions: { type: Array, default: () => [] },
});
const emit = defineEmits(['refresh']);

const { detailObj, title, deptOptions } = toRefs(props);

// 时间戳格式化
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

// 根据 deptId 获取系部名称
const getDeptNameById = (deptId) => {
  if (!deptId) return '-';
  const found = deptOptions.value.find(opt => opt.value === deptId);
  return found ? found.label : String(deptId);
};

const drawerTitle = computed(() => {
  const name = detailObj.value?.enterpriseName ? `${detailObj.value.enterpriseName}` : '企业详情';
  return title.value || name;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close()});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息 -->
      <div class="detail-section">🏢 企业基础信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">企业名称：</div>
        <div class="detail-row-right">{{ detailObj.enterpriseName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">企业类型：</div>
        <div class="detail-row-right">{{ detailObj.enterpriseType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">负责系部：</div>
        <div class="detail-row-right">{{ getDeptNameById(detailObj.deptId) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">联系人：</div>
        <div class="detail-row-right">{{ detailObj.contactUser || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">联系电话：</div>
        <div class="detail-row-right">{{ detailObj.contactPhone || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">合作开始时间：</div>
        <div class="detail-row-right">{{ formatTimestamp(detailObj.coopStartTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">合作结束时间：</div>
        <div class="detail-row-right">{{ formatTimestamp(detailObj.coopEndTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">状态：</div>
        <div class="detail-row-right">{{ detailObj.status || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">备注：</div>
        <div class="detail-row-right">{{ detailObj.remark || '-' }}</div>
      </div>

      <!-- 操作日志 -->
      <div class="detail-section">📋 操作日志</div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建人：</div>
        <div class="detail-row-right">{{ detailObj.creator || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ formatTimestamp(detailObj.createTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新人：</div>
        <div class="detail-row-right">{{ detailObj.updater || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间：</div>
        <div class="detail-row-right">{{ formatTimestamp(detailObj.updateTime) }}</div>
      </div>
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

  &:last-child {
    border-bottom: none;
  }

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

  &:first-child {
    margin-top: 0;
  }
}
</style>
