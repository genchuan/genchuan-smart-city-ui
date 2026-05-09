<script setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

const props = defineProps({
  filterRule: {
    type: String,
    default: '',
  },
});

const [Modal, modalApi] = useVbenModal({
  title: '筛选规则详情',
  width: 600,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    modalApi.close();
  },
});

const filterConfig = ref({});

const open = (rule) => {
  // 解析筛选规则字符串
  // 格式如：统计时段：2026-03-01 至 2026-03-31
  const configs = [];
  if (rule) {
    const parts = rule.split(';');
    parts.forEach((part) => {
      const [key, value] = part.split('：');
      if (key && value) {
        configs.push({ key: key.trim(), value: value.trim() });
      }
    });
  }
  filterConfig.value = configs;
  modalApi.open();
};

defineExpose({
  open,
});
</script>

<template>
  <Modal>
    <div class="filter-rule-content">
      <h4 class="section-title">报表筛选配置</h4>
      <div v-if="filterConfig.length === 0" class="empty-tip">暂无筛选配置</div>
      <div v-else class="config-list">
        <div
          v-for="(item, index) in filterConfig"
          :key="index"
          class="config-item"
        >
          <span class="config-key">{{ item.key }}：</span>
          <span class="config-value">{{ item.value }}</span>
        </div>
      </div>

      <h4 class="section-title" style="margin-top: 24px">全维度筛选配置</h4>
      <div class="full-config">
        <div class="config-row">
          <span class="config-label">统计维度：</span>
          <span class="config-tags">
            <el-tag size="small">活动数据</el-tag>
            <el-tag size="small">用户数据</el-tag>
            <el-tag size="small">订单数据</el-tag>
            <el-tag size="small">库存数据</el-tag>
          </span>
        </div>
        <div class="config-row">
          <span class="config-label">数据范围：</span>
          <span class="config-text">全部数据</span>
        </div>
        <div class="config-row">
          <span class="config-label">时间粒度：</span>
          <span class="config-text">按天统计</span>
        </div>
        <div class="config-row">
          <span class="config-label">数据状态：</span>
          <span class="config-text">已生效数据</span>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.filter-rule-content {
  padding: 20px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.empty-tip {
  padding: 20px;
  color: #909399;
  text-align: center;
}

.config-list {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.config-item {
  margin-bottom: 12px;
  font-size: 14px;
}

.config-item:last-child {
  margin-bottom: 0;
}

.config-key {
  font-weight: 500;
  color: #606266;
}

.config-value {
  color: #303133;
}

.full-config {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.config-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.config-row:last-child {
  margin-bottom: 0;
}

.config-label {
  width: 100px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.config-text {
  font-size: 14px;
  color: #303133;
}

.config-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.config-tags .el-tag {
  margin: 0;
}
</style>
