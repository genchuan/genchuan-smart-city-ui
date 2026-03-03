<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（道路设施基础数据）
const props = defineProps({
  // 详情数据对象（道路设施基础数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的roadName）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 格式化数值显示（保留2位小数）
const formatNumber = (value, precision = 0) => {
  if (value === undefined || value === null || value === '-') return '-';
  return Number(value).toFixed(precision);
};

// 计算属性处理标题，优先用路段名称，兜底显示道路设施详情
const drawerTitle = computed(() => {
  const roadName = detailObj.value?.roadName || '道路设施详情';
  return title.value || `${roadName}详情`;
});

// 初始化抽屉实例（适配道路设施字段展示）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800, // 适配字段数量
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 基础信息区域 -->
      <div class="detail-section">
        <div class="section-title">基础信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">主键ID:</div>
          <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">道路编码:</div>
          <div class="detail-row-right">{{ detailObj.roadCode || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">路段名称:</div>
          <div class="detail-row-right">{{ detailObj.roadName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">区域名称:</div>
          <div class="detail-row-right">{{ detailObj.areaName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">路段长度:</div>
          <div class="detail-row-right">
            {{ formatNumber(detailObj.length, 2) }} 米
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">路段宽度:</div>
          <div class="detail-row-right">
            {{ formatNumber(detailObj.width, 2) }} 米
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">使用状态:</div>
          <div class="detail-row-right">
            <span>
              {{ detailObj.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- 时间信息区域 -->
      <div class="detail-section">
        <div class="section-title">时间信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建时间:</div>
          <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 140px; // 小屏适配长标签
  }

  .detail-card {
    min-height: 600px;
    max-height: 80vh;
    padding: 15px;
  }

  .section-title {
    padding: 10px 0;
    font-size: 16px;
  }
}

// 详情卡片整体样式
.detail-card {
  min-height: 700px; // 适配所有字段展示
  max-height: 90vh;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9fafb;
  border-radius: 8px;
}

// 分区标题样式
.detail-section {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  padding: 15px 0;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 2px solid #e2e8f0;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;

  // 最后一行去掉分隔线
  &:last-child {
    border-bottom: none;
  }

  // 鼠标悬浮高亮
  &:hover {
    padding-right: 8px;
    padding-left: 8px;
    margin-right: -8px;
    margin-left: -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}

// 左侧标签样式
.detail-row-left {
  flex-shrink: 0;
  width: 160px; // 加宽适配长标签
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: #606266;
}

// 右侧内容样式
.detail-row-right {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133;
  word-break: break-all;
}

// 状态颜色样式
.text-green-600 {
  color: #10b981 !important; // 正常状态
}

.text-yellow-600 {
  color: #f59e0b !important; // 维修中状态
}

.text-red-600 {
  color: #ef4444 !important; // 废弃状态
}

.text-gray-600 {
  color: #6b7280 !important; // 中性状态
}

// 滚动条样式优化
.detail-card::-webkit-scrollbar {
  width: 6px;
}

.detail-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.detail-card::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.detail-card::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}
</style>
