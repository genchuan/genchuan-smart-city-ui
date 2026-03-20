<!--日志详情抽屉-->
<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  logObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' }
});

const { logObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  return title.value || `日志详情 - ${logObj.value.log_id}`;
});

const [LogDetailDrawer, logDetailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 700,
  onCancel() {
    logDetailDrawerApi.close();
  }
});

defineExpose({
  open: () => logDetailDrawerApi.open(),
  close: () => logDetailDrawerApi.close()
});
</script>

<template>
  <LogDetailDrawer :title="drawerTitle" >
    <div class="detail-scroll-container">
      <!-- 基本信息卡片 -->
      <div class="detail-card">
        <h3 class="detail-card-title">日志基本信息</h3>
        <div class="detail-card-row">
          <div class="detail-row-left">日志ID：</div>
          <div class="detail-row-right">{{ logObj.log_id || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">关联规则：</div>
          <div class="detail-row-right">{{ logObj.rule_name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">关联任务：</div>
          <div class="detail-row-right">{{ logObj.task_name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">关联指标项：</div>
          <div class="detail-row-right">{{ logObj.index_name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">数据来源设备：</div>
          <div class="detail-row-right">{{ logObj.device_name || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">数据值：</div>
          <div class="detail-row-right">{{ logObj.data_value || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">同步时间：</div>
          <div class="detail-row-right">{{ logObj.sync_time || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">同步方式：</div>
          <div class="detail-row-right">{{ logObj.sync_type || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">数据清洗结果：</div>
          <div class="detail-row-right">{{ logObj.clean_result || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">存储状态：</div>
          <div class="detail-row-right">{{ logObj.store_status || '-' }}</div>
        </div>
        <div class="detail-card-row" v-if="logObj.fail_reason">
          <div class="detail-row-left">失败原因：</div>
          <div class="detail-row-right">{{ logObj.fail_reason }}</div>
        </div>
        <div class="detail-card-row" v-if="logObj.retry_count !== undefined">
          <div class="detail-row-left">重试次数：</div>
          <div class="detail-row-right">{{ logObj.retry_count }}</div>
        </div>
        <div class="detail-card-row" v-if="logObj.last_retry_time">
          <div class="detail-row-left">最近重试时间：</div>
          <div class="detail-row-right">{{ logObj.last_retry_time }}</div>
        </div>
      </div>
    </div>
  </LogDetailDrawer>
</template>

<style scoped lang="scss">
.detail-scroll-container {
  max-height: calc(70vh - 20px);
  overflow-y: auto;
  padding: 4px;
}
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
}
.detail-card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2f3d;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
}
.detail-row-left {
  width: 140px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
}
.detail-row-right {
  flex: 1;
  color: #303133;
  word-break: break-all;
}
</style>
