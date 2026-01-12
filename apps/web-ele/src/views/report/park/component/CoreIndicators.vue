<script setup>
import { Bottom, Top } from '@element-plus/icons-vue';

const props = defineProps({
  title: {
    type: String,
    default: '核心指标',
  },
  indicators: {
    type: Array,
    required: true,
  },
  formatValue: {
    type: Function,
    default: (value, unit) => {
      if (unit === '元') {
        if (value >= 10_000) {
          return `¥${(value / 10_000).toFixed(2)}万`;
        }
        return `¥${value.toFixed(2)}`;
      }
      return value.toLocaleString();
    },
  },
});

// 这里可以定义一些默认的样式类
const getComparisonClass = (comparison) => {
  if (comparison > 30) return 'comparison-positive';
  if (comparison < -30) return 'comparison-negative';
  return '';
};
</script>

<template>
  <div class="core-indicators">
    <h3 class="section-title">{{ title }}</h3>
    <div class="indicators-grid">
      <div
        v-for="indicator in indicators"
        :key="indicator.key"
        class="indicator-card"
        :class="{ abnormal: indicator.abnormal }"
      >
        <div class="indicator-header">
          <span class="indicator-name">{{ indicator.name }}</span>
          <el-tag v-if="indicator.tag" :type="indicator.tag.type" size="small">
            <el-icon v-if="indicator.tag.icon === 'top'"><Top /></el-icon>
            <el-icon v-if="indicator.tag.icon === 'bottom'"><Bottom /></el-icon>
            {{ indicator.tag.text }}
          </el-tag>
        </div>
        <div class="indicator-value">
          <span class="value">{{
            formatValue(indicator.value, indicator.unit)
          }}</span>
          <span class="unit">{{ indicator.unit }}</span>
        </div>
        <div v-if="indicator.comparison" class="indicator-comparison">
          <slot name="comparison" :indicator="indicator">
            <!-- 默认的comparison内容，可以由父组件覆盖 -->
            <span :class="getComparisonClass(indicator.comparison)">
              <el-icon v-if="indicator.comparison > 0"><Top /></el-icon>
              <el-icon v-if="indicator.comparison < 0"><Bottom /></el-icon>
              较近7日均值 {{ Math.abs(indicator.comparison) }}%
            </span>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.core-indicators {
  margin-bottom: 12px;
}

.section-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.indicators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.indicator-card {
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 10%);
  transition: all 0.3s;
}

.indicator-card:hover {
  box-shadow: 0 4px 16px rgb(0 0 0 / 15%);
  transform: translateY(-2px);
}

.indicator-card.abnormal {
  background: linear-gradient(135deg, #fff 0%, #fdf6ec 100%);
  border-left: 4px solid #e6a23c;
}

.indicator-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.indicator-name {
  font-size: 14px;
  font-weight: 500;
  color: #909399;
}

.indicator-value {
  display: flex;
  align-items: baseline;
  margin-bottom: 4px;
}

.indicator-value .value {
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
  color: #303133;
}

.indicator-value .unit {
  margin-left: 4px;
  font-size: 14px;
  color: #909399;
}

.indicator-comparison {
  font-size: 12px;
}

.comparison-positive {
  color: #67c23a; /* 正增长 - 绿色 */
}

.comparison-negative {
  color: #f56c6c; /* 负增长 - 红色 */
}
</style>
