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
