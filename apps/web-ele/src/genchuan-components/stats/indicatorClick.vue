<template>
  <div
    class="stat-card"
    :style="{
      borderLeftColor: props.color || '#13ce66',
    }"
    @click="handleClick"
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

<script setup>
import { defineProps, defineEmits } from 'vue';

// 定义组件属性
const props = defineProps({
  title: {
    type: String,
    default: '默认标题',
  },
  value: {
    type: [String, Number],
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
  // 新增：状态值，用于钻取时传递给父组件
  status: {
    type: String,
    default: '',
  },
});

// 定义事件
const emit = defineEmits(['click']);

// 格式化数值（添加千分位）
const formatValue = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString('zh-CN');
  }
  return value;
};

// 点击处理：将卡片信息传递给父组件
const handleClick = () => {
  emit('click', {
    title: props.title,
    value: props.value,
    status: props.status,
  });
};
</script>

<style scoped lang="scss">
.stat-card {
  //height: 102px;
  position: relative;
  background-color: hsl(var(--card));
  border-radius: 8px;
  padding: 20px 16px;
  border-left: 4px solid #13ce66;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .card-title {
      font-size: 14px;
      font-weight: 500;
      color: #606266;
      margin: 0;
    }

    .card-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
  }

  .card-body {
    .card-value {
      font-size: 28px;
      font-weight: bold;
      color: #4a90e2;
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
</style>
