<script setup>
import { ref, computed } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElButton, ElTag } from 'element-plus';

const [Drawer, drawerApi] = useVbenDrawer({
  title: '关联管理部件详情',
  width: 600,
  modal: false,
  appendToMain: true,
  onCancel() {
    drawerApi.close();
  },
});

const record = ref({});

// 关联部件详情数据 - 从record.relatedPartName解析或模拟
const relatedPartDetail = computed(() => {
  const relatedPartName = record.value?.relatedPartName;
  if (!relatedPartName) {
    return null;
  }
  // 这里可以根据relatedPartName从后端获取详情
  // 目前先模拟展示数据
  return {
    name: relatedPartName,
    code: 'MP' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
    type: '管理部件',
    status: '1',
    location: '福建省泉州市',
    grid: record.value?.gridName || '未知网格',
    createTime: '2025-01-01 00:00:00',
    description: '该管理部件与监测部件实例相关联',
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
    <div v-if="relatedPartDetail" class="related-part-detail">
      <div class="detail-section">
        <h4>基本信息</h4>
        <div class="detail-item">
          <span class="label">部件名称：</span>
          <span class="value">{{ relatedPartDetail.name }}</span>
        </div>
        <div class="detail-item">
          <span class="label">部件编码：</span>
          <span class="value">{{ relatedPartDetail.code }}</span>
        </div>
        <div class="detail-item">
          <span class="label">部件类型：</span>
          <span class="value">{{ relatedPartDetail.type }}</span>
        </div>
        <div class="detail-item">
          <span class="label">状态：</span>
          <ElTag type="success">启用</ElTag>
        </div>
      </div>

      <div class="detail-section">
        <h4>位置信息</h4>
        <div class="detail-item">
          <span class="label">所属地区：</span>
          <span class="value">{{ relatedPartDetail.location }}</span>
        </div>
        <div class="detail-item">
          <span class="label">所在网格：</span>
          <span class="value">{{ relatedPartDetail.grid }}</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>其他信息</h4>
        <div class="detail-item">
          <span class="label">创建时间：</span>
          <span class="value">{{ relatedPartDetail.createTime }}</span>
        </div>
        <div class="detail-item">
          <span class="label">描述：</span>
          <span class="value">{{ relatedPartDetail.description }}</span>
        </div>
      </div>
    </div>
    <div v-else class="empty-tip">
      <p>该监测部件实例暂无关联的管理部件</p>
    </div>
    <template #footer>
      <ElButton @click="drawerApi.close()">关闭</ElButton>
    </template>
  </Drawer>
</template>

<style scoped>
.related-part-detail {
  padding: 20px;
}

.detail-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.detail-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.detail-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.detail-item {
  display: flex;
  margin-bottom: 12px;
  font-size: 14px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.label {
  width: 100px;
  color: var(--el-text-color-secondary);
  flex-shrink: 0;
}

.value {
  flex: 1;
  color: var(--el-text-color-primary);
}

.empty-tip {
  padding: 40px 20px;
  text-align: center;
  color: var(--el-text-color-secondary);
}
</style>
