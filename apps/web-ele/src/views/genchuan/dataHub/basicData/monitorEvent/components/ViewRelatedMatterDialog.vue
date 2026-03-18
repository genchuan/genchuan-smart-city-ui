<script setup>
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElButton, ElTag } from 'element-plus';

const [Drawer, drawerApi] = useVbenDrawer({
  title: '关联管理事项详情',
  width: 600,
  modal: false,
  appendToMain: true,
  onCancel() {
    drawerApi.close();
  },
});

const record = ref({});

// 自动生成的管理事项详情
const matterDetail = computed(() => {
  const eventName = record.value.name || '';
  const categoryName = record.value.categoryName || '';
  const monitorName = record.value.monitorName || '';
  const description = record.value.description || '';
  const areaName = record.value.areaName || '';
  const coordinate = record.value.coordinate || '';

  return {
    matterName: `${eventName}-关联事项`,
    matterType: categoryName,
    matterSource: '监测事件自动生成',
    relatedMonitor: monitorName,
    matterDesc: description,
    matterLocation: areaName,
    matterCoordinate: coordinate,
    matterStatus: '待处理',
    matterPriority: '高',
    createTime: new Date().toLocaleString('zh-CN'),
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
    <div class="matter-detail-content">
      <div class="detail-section">
        <h3 class="section-title">事项基本信息</h3>
        <div class="detail-item">
          <label>事项名称：</label>
          <span>{{ matterDetail.matterName }}</span>
        </div>
        <div class="detail-item">
          <label>事项类型：</label>
          <span>{{ matterDetail.matterType }}</span>
        </div>
        <div class="detail-item">
          <label>事项来源：</label>
          <span>{{ matterDetail.matterSource }}</span>
        </div>
        <div class="detail-item">
          <label>关联监测部件：</label>
          <span>{{ matterDetail.relatedMonitor }}</span>
        </div>
      </div>

      <div class="detail-section">
        <h3 class="section-title">事项描述</h3>
        <div class="detail-desc">{{ matterDetail.matterDesc || '暂无描述' }}</div>
      </div>

      <div class="detail-section">
        <h3 class="section-title">位置信息</h3>
        <div class="detail-item">
          <label>行政区划：</label>
          <span>{{ matterDetail.matterLocation }}</span>
        </div>
        <div class="detail-item">
          <label>坐标位置：</label>
          <span>{{ matterDetail.matterCoordinate }}</span>
        </div>
      </div>

      <div class="detail-section">
        <h3 class="section-title">处理信息</h3>
        <div class="detail-item">
          <label>事项状态：</label>
          <ElTag type="warning">{{ matterDetail.matterStatus }}</ElTag>
        </div>
        <div class="detail-item">
          <label>优先级：</label>
          <ElTag type="danger">{{ matterDetail.matterPriority }}</ElTag>
        </div>
        <div class="detail-item">
          <label>创建时间：</label>
          <span>{{ matterDetail.createTime }}</span>
        </div>
      </div>
    </div>
    <template #footer>
      <ElButton @click="drawerApi.close()">关闭</ElButton>
    </template>
  </Drawer>
</template>

<style scoped>
.matter-detail-content {
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

.detail-desc {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}
</style>
