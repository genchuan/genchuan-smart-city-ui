<script setup>
import { defineProps } from 'vue';

// 定义组件属性
const props = defineProps({
  title: {
    type: String,
    default: '默认标题',
  },
  value: {
    type: String,
    default: '0',
  },
  color: {
    type: String,
    default: '#13ce66',
  },
  desc: {
    type: String,
    default: '',
  },
});

// 格式化数值（添加千分位）
const formatValue = (value) => {
  if (!props.formatNumber || typeof value !== 'number') {
    return value;
  }
  return value.toLocaleString('zh-CN');
};
</script>

<template>
  <div
    class="stat-card"
    :style="{
      borderLeftColor: props.color || '#13ce66',
    }"
  >
    <div class="card-header">
      <h3 class="card-title">{{ props.title }}</h3>
      <div
        class="card-indicator"
        :style="{ backgroundColor: props.color || '#13ce66' }"
      ></div>
    </div>
    <div class="card-body">
      <div class="card-value">{{ formatValue(props.value) }}</div>
      <div class="card-desc" v-if="props.desc">{{ props.desc }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stat-card {
  position: relative;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px 16px;
  border-left: 4px solid #13ce66; /* 默认左侧边框色 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .card-title {
      font-size: 14px;
      font-weight: 500;
      color: #606266;
      margin: 0;
    }

    .card-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
  }

  .card-body {
    .card-value {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      line-height: 1.2;
      margin-bottom: 4px;
    }

    .card-desc {
      font-size: 12px;
      color: #909399;
      line-height: 1;
    }
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .stat-card {
    padding: 16px 12px;

    .card-body .card-value {
      font-size: 20px;
    }
  }
}
</style>
