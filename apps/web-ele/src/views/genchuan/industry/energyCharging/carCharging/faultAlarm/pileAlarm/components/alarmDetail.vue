<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

// ---------- 时间戳格式化函数（与主表格保持一致） ----------
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const drawerTitle = computed(() => {
  const name = detailObj.value?.alarmCode || '告警';
  return title.value || `${name}详情`;
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
      <!-- 告警基础信息 -->
      <div class="detail-section">⚠️ 告警基础信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">告警编号：</div>
        <div class="detail-row-right">{{ detailObj.alarmCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">充电桩编号：</div>
        <div class="detail-row-right">{{ detailObj.pileCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">充电桩名称：</div>
        <div class="detail-row-right">{{ detailObj.pileName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属场站ID：</div>
        <div class="detail-row-right">{{ detailObj.stationId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属场站名称：</div>
        <div class="detail-row-right">{{ detailObj.stationName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">故障类型：</div>
        <div class="detail-row-right">{{ detailObj.faultType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">告警等级：</div>
        <div class="detail-row-right">{{ detailObj.alarmLevel || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">告警时间：</div>
        <div class="detail-row-right">{{ formatTimestamp(detailObj.alarmTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处理人员ID：</div>
        <div class="detail-row-right">{{ detailObj.handleUser || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处理人员：</div>
        <div class="detail-row-right">{{ detailObj.handleUserName || detailObj.handleUser || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">告警状态：</div>
        <div class="detail-row-right">{{ detailObj.alarmStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">备注：</div>
        <div class="detail-row-right">{{ detailObj.remark || '-' }}</div>
      </div>

      <!-- 处置日志（根据状态动态生成） -->
      <div class="detail-section">📝 处置日志</div>
      <div class="detail-card-row" v-if="detailObj.alarmTime">
        <div class="detail-row-left">{{ formatTimestamp(detailObj.alarmTime) }}</div>
        <div class="detail-row-right">告警产生，系统自动记录</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.handleUser && detailObj.alarmStatus !== '未派单'">
        <div class="detail-row-left">{{ formatTimestamp(detailObj.updateTime) || formatTimestamp(detailObj.alarmTime) }}</div>
        <div class="detail-row-right">派单给 {{ detailObj.handleUserName || detailObj.handleUser }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.disposeMeasure">
        <div class="detail-row-left">{{ formatTimestamp(detailObj.disposeTime) || formatTimestamp(detailObj.updateTime) || '-' }}</div>
        <div class="detail-row-right">处置措施：{{ detailObj.disposeMeasure }}</div>
      </div>
      <div class="detail-card-row" v-if="detailObj.alarmStatus === '已销单'">
        <div class="detail-row-left">{{ formatTimestamp(detailObj.disposeTime) || formatTimestamp(detailObj.updateTime) || '-' }}</div>
        <div class="detail-row-right">销单确认，告警处理完成</div>
      </div>
      <div class="detail-card-row" v-else-if="detailObj.alarmStatus === '未派单'">
        <div class="detail-row-left">暂无处置记录</div>
        <div class="detail-row-right"></div>
      </div>

      <!-- 时间信息 -->
      <div class="detail-section">📅 时间信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ formatTimestamp(detailObj.createTime) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间：</div>
        <div class="detail-row-right">{{ formatTimestamp(detailObj.updateTime) }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
@media (max-width: 768px) {
  .detail-row-left {
    width: 180px;
  }
  .detail-card {
    min-height: 600px;
    max-height: 80vh;
    padding: 15px;
  }
}

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

.detail-card::-webkit-scrollbar {
  width: 6px;
}

.detail-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.detail-card::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.detail-card::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}
</style>
