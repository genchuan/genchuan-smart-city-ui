<script setup lang="ts">
import { reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElButton, ElTag, ElTimeline, ElTimelineItem } from 'element-plus';

const [Drawer, drawerApi] = useVbenDrawer({
  title: '关联事件与处置记录',
  width: 650,
  position: 'right',
  modal: false,
  appendToMain: true,
  onCancel() {
    drawerApi.close();
  },
});

const currentPart = ref<any>({});

// 模拟事件数据
const eventList = reactive([
  {
    id: 'E001',
    type: '异常报警',
    status: '已处置',
    createTime: '2025-03-01 09:30:00',
    description: '部件运行状态异常，温度传感器读数超出正常范围',
    handler: '张三',
    handleTime: '2025-03-01 10:15:00',
    handleResult: '已现场检查，更换温度传感器，恢复正常',
  },
  {
    id: 'E002',
    type: '定期巡检',
    status: '已完成',
    createTime: '2025-02-28 14:00:00',
    description: '月度定期巡检，检查部件运行状态',
    handler: '李四',
    handleTime: '2025-02-28 15:30:00',
    handleResult: '巡检正常，无异常情况',
  },
  {
    id: 'E003',
    type: '故障维修',
    status: '已处置',
    createTime: '2025-02-25 08:20:00',
    description: '部件离线，无法连接网络',
    handler: '王五',
    handleTime: '2025-02-25 11:45:00',
    handleResult: '检查网络连接，重启设备，恢复正常通信',
  },
  {
    id: 'E004',
    type: '异常报警',
    status: '处置中',
    createTime: '2025-03-02 16:00:00',
    description: '检测到部件振动异常',
    handler: '',
    handleTime: '',
    handleResult: '',
  },
]);

const open = (row: any) => {
  currentPart.value = row;
  drawerApi.open();
};

const getEventTypeType = (type: string) => {
  switch (type) {
    case '定期巡检': {
      return 'success';
    }
    case '异常报警': {
      return 'danger';
    }
    case '故障维修': {
      return 'warning';
    }
    default: {
      return 'info';
    }
  }
};

const getStatusType = (status: string) => {
  switch (status) {
    case '处置中': {
      return 'warning';
    }
    case '已处置': {
      return 'success';
    }
    case '已完成': {
      return 'success';
    }
    case '待处置': {
      return 'danger';
    }
    default: {
      return 'info';
    }
  }
};

defineExpose({
  open,
});
</script>

<template>
  <Drawer>
    <div class="view-events-container">
      <!-- 当前部件信息 -->
      <div class="current-part-info">
        <div class="info-title">部件信息</div>
        <div class="info-content">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">部件名称：</span>
              <span class="info-value" :title="currentPart.partName">{{
                currentPart.partName
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">16位标识码：</span>
              <span class="info-value" :title="currentPart.uniqueCode">{{
                currentPart.uniqueCode
              }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">所属分类：</span>
              <span class="info-value">{{ currentPart.categoryName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">所在网格：</span>
              <span class="info-value">{{ currentPart.gridName }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 事件统计 -->
      <div class="event-stats">
        <div class="stat-item">
          <div class="stat-value">{{ eventList.length }}</div>
          <div class="stat-label">全部事件</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">
            {{
              eventList.filter(
                (e) => e.status === '已处置' || e.status === '已完成',
              ).length
            }}
          </div>
          <div class="stat-label">已处置</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">
            {{ eventList.filter((e) => e.status === '处置中').length }}
          </div>
          <div class="stat-label">处置中</div>
        </div>
      </div>

      <!-- 事件时间线 -->
      <div class="event-timeline">
        <div class="timeline-title">事件记录</div>
        <ElTimeline>
          <ElTimelineItem
            v-for="event in eventList"
            :key="event.id"
            :timestamp="event.createTime"
            :type="getEventTypeType(event.type)"
          >
            <div class="event-card">
              <div class="event-header">
                <div class="event-title">
                  <ElTag size="small" :type="getEventTypeType(event.type)">
                    {{ event.type }}
                  </ElTag>
                  <span class="event-id">{{ event.id }}</span>
                </div>
                <ElTag size="small" :type="getStatusType(event.status)">
                  {{ event.status }}
                </ElTag>
              </div>
              <div class="event-content">
                <div class="event-description">{{ event.description }}</div>

                <!-- 处置记录 -->
                <div v-if="event.handleTime" class="handle-record">
                  <div class="record-title">处置记录</div>
                  <div class="record-item">
                    <span class="record-label">处置人：</span>
                    <span class="record-value">{{ event.handler }}</span>
                  </div>
                  <div class="record-item">
                    <span class="record-label">处置时间：</span>
                    <span class="record-value">{{ event.handleTime }}</span>
                  </div>
                  <div class="record-item">
                    <span class="record-label">处置结果：</span>
                    <span class="record-value">{{ event.handleResult }}</span>
                  </div>
                </div>

                <!-- 待处置提示 -->
                <div v-else class="pending-tip">
                  <i class="el-icon-warning"></i>
                  该事件尚未处置，请尽快安排处理
                </div>
              </div>
            </div>
          </ElTimelineItem>
        </ElTimeline>
      </div>
    </div>

    <!-- 自定义底部按钮 -->
    <template #footer>
      <div class="drawer-footer">
        <ElButton @click="drawerApi.close()">关闭</ElButton>
      </div>
    </template>
  </Drawer>
</template>

<style scoped>
.view-events-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.current-part-info {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.info-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  gap: 24px;
}

.info-item {
  display: flex;
  font-size: 13px;
  flex: 1;
  min-width: 0;
}

.info-label {
  color: var(--el-text-color-secondary);
  width: 90px;
  flex-shrink: 0;
  text-align: right;
  padding-right: 8px;
}

.info-value {
  color: var(--el-text-color-primary);
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-color-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.event-timeline {
  margin-top: 20px;
}

.timeline-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.event-card {
  padding: 16px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  margin-bottom: 8px;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.event-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-id {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.event-content {
  font-size: 13px;
}

.event-description {
  color: var(--el-text-color-regular);
  margin-bottom: 12px;
  line-height: 1.6;
}

.handle-record {
  padding: 12px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
  margin-top: 12px;
}

.record-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.record-item {
  display: flex;
  font-size: 12px;
  margin-bottom: 4px;
}

.record-label {
  color: var(--el-text-color-secondary);
  width: 70px;
}

.record-value {
  color: var(--el-text-color-primary);
  flex: 1;
}

.pending-tip {
  padding: 12px;
  background-color: var(--el-color-warning-light-9);
  border: 1px solid var(--el-color-warning-light-5);
  border-radius: 4px;
  color: var(--el-color-warning);
  font-size: 12px;
  margin-top: 12px;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
