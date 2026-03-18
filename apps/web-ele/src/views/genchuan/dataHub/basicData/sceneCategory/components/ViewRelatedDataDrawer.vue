<script setup>
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElButton, ElTag } from 'element-plus';

const [Drawer, drawerApi] = useVbenDrawer({
  title: '关联数据详情',
  width: 600,
  modal: false,
  appendToMain: true,
  onCancel() {
    drawerApi.close();
  },
});

const record = ref({});

// 模拟关联数据
const relatedData = computed(() => {
  const sceneName = record.value.sceneName || '';
  const partCount = record.value.partCount || 0;
  const eventCount = record.value.eventCount || 0;

  return {
    // 关联部件明细
    parts: partCount > 0 ? [
      { name: `${sceneName}-部件1`, code: 'P001', type: '监控设备', status: '正常' },
      { name: `${sceneName}-部件2`, code: 'P002', type: '传感器', status: '正常' },
      { name: `${sceneName}-部件3`, code: 'P003', type: '控制器', status: '离线' },
    ] : [],
    // 关联事件明细
    events: eventCount > 0 ? [
      { name: `${sceneName}-事件1`, code: 'E001', type: '异常报警', status: '待处理', time: '2025-03-06 10:30:00' },
      { name: `${sceneName}-事件2`, code: 'E002', type: '预警提醒', status: '已处理', time: '2025-03-06 09:00:00' },
    ] : [],
    // 关联资产设备明细
    assets: [
      { name: `${sceneName}-资产1`, code: 'A001', type: '固定资产', status: '在用' },
      { name: `${sceneName}-资产2`, code: 'A002', type: '设备资产', status: '在用' },
    ],
  };
});

const open = (row) => {
  record.value = row;
  drawerApi.open();
};

defineExpose({
  open,
});
</script>

<template>
  <Drawer>
    <div class="related-data-content">
      <!-- 场景基本信息 -->
      <div class="detail-section">
        <h3 class="section-title">场景基本信息</h3>
        <div class="detail-item">
          <label>场景名称：</label>
          <span>{{ record.sceneName }}</span>
        </div>
        <div class="detail-item">
          <label>场景编码：</label>
          <span>{{ record.sceneCode }}</span>
        </div>
        <div class="detail-item">
          <label>关联部件数：</label>
          <span>{{ record.partCount || 0 }}</span>
        </div>
        <div class="detail-item">
          <label>关联事件数：</label>
          <span>{{ record.eventCount || 0 }}</span>
        </div>
      </div>

      <!-- 关联部件明细 -->
      <div class="detail-section">
        <h3 class="section-title">
          关联部件明细
          <ElTag type="primary" size="small">{{ relatedData.parts.length }}</ElTag>
        </h3>
        <div v-if="relatedData.parts.length > 0" class="data-list">
          <div v-for="(item, index) in relatedData.parts" :key="index" class="data-item">
            <div class="item-header">
              <span class="item-name">{{ item.name }}</span>
              <ElTag :type="item.status === '正常' ? 'success' : 'danger'" size="small">
                {{ item.status }}
              </ElTag>
            </div>
            <div class="item-info">
              <span>编码：{{ item.code }}</span>
              <span>类型：{{ item.type }}</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-text">暂无关联部件</div>
      </div>

      <!-- 关联事件明细 -->
      <div class="detail-section">
        <h3 class="section-title">
          关联事件明细
          <ElTag type="warning" size="small">{{ relatedData.events.length }}</ElTag>
        </h3>
        <div v-if="relatedData.events.length > 0" class="data-list">
          <div v-for="(item, index) in relatedData.events" :key="index" class="data-item">
            <div class="item-header">
              <span class="item-name">{{ item.name }}</span>
              <ElTag :type="item.status === '已处理' ? 'success' : 'warning'" size="small">
                {{ item.status }}
              </ElTag>
            </div>
            <div class="item-info">
              <span>编码：{{ item.code }}</span>
              <span>类型：{{ item.type }}</span>
              <span>时间：{{ item.time }}</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-text">暂无关联事件</div>
      </div>

      <!-- 关联资产设备明细 -->
      <div class="detail-section">
        <h3 class="section-title">
          关联资产设备明细
          <ElTag type="info" size="small">{{ relatedData.assets.length }}</ElTag>
        </h3>
        <div class="data-list">
          <div v-for="(item, index) in relatedData.assets" :key="index" class="data-item">
            <div class="item-header">
              <span class="item-name">{{ item.name }}</span>
              <ElTag type="success" size="small">
                {{ item.status }}
              </ElTag>
            </div>
            <div class="item-info">
              <span>编码：{{ item.code }}</span>
              <span>类型：{{ item.type }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <ElButton @click="drawerApi.close()">关闭</ElButton>
    </template>
  </Drawer>
</template>

<style scoped>
.related-data-content {
  padding: 20px;
}

.detail-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.detail-section:last-child {
  border-bottom: none;
}

.section-title {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.detail-item {
  display: flex;
  margin-bottom: 12px;
  font-size: 14px;
}

.detail-item label {
  width: 120px;
  color: #606266;
  font-weight: 500;
}

.detail-item span {
  flex: 1;
  color: #303133;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-item {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-name {
  font-weight: 500;
  color: #303133;
}

.item-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: #606266;
}

.empty-text {
  padding: 20px;
  color: #909399;
  text-align: center;
}
</style>
