<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 片区详情数据对象（适配新字段结构）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const { detailObj } = toRefs(props);

// 计算属性处理标题，优先使用片区名称，兜底显示默认值
const drawerTitle = computed(() => {
  const areaName = detailObj.value?.areaName || '片区';
  return `${areaName}详情`;
});

// 初始化抽屉实例（优化层级配置，避免被覆盖）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToBody: true, // 挂载到body避免层级问题
  appendToMain: false,
  footer: false,
  width: 800, // 加宽适配更多字段
  zIndex: 9999, // 提升层级
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
  <DetailDrawer :title="drawerTitle" class="area-detail-drawer">
    <div class="detail-card">
      <!-- 核心字段展示（适配新的表单schema字段结构） -->
      <div class="detail-card-row">
        <div class="detail-row-left">片区名称:</div>
        <div class="detail-row-right">{{ detailObj.areaName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">当前关联车场:</div>
        <div class="detail-row-right">
          {{ detailObj.currentRelatedParks || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">待关联车场:</div>
        <div class="detail-row-right">
          {{ detailObj.toBeRelatedParks || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">当前关联道路:</div>
        <div class="detail-row-right">
          {{ detailObj.currentRelatedRoads || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">待关联道路:</div>
        <div class="detail-row-right">
          {{ detailObj.toBeRelatedRoads || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">调整原因:</div>
        <div class="detail-row-right">{{ detailObj.adjustReason || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">调整时间:</div>
        <div class="detail-row-right">{{ detailObj.adjustTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">操作人:</div>
        <div class="detail-row-right">{{ detailObj.operator || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新后关联车场数:</div>
        <div class="detail-row-right">
          {{ detailObj.updatedParkCount || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新后关联道路数:</div>
        <div class="detail-row-right">
          {{ detailObj.updatedRoadCount || '-' }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 详情卡片整体样式（适配多字段）
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 400px; // 增加最小高度
  max-height: 70vh; // 限制最大高度，避免溢出
  overflow-y: auto; // 内容过多时滚动
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配长文本（如调整原因）
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0; // 分隔线增强可读性

  // 最后一行去掉分隔线
  &:last-child {
    border-bottom: none;
  }

  // 鼠标悬浮高亮
  &:hover {
    background-color: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    transition: all 0.2s ease;
  }
}

// 左侧标签样式（固定宽度保证对齐）
.detail-row-left {
  width: 140px; // 加宽标签宽度，适配长标签（如更新后关联车场数）
  flex-shrink: 0; // 不收缩
  font-weight: 500; // 加粗突出标签
  color: #606266; // 灰色调，区分内容
  font-size: 14px;
  line-height: 24px; // 提升行高，适配textarea类长文本
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  color: #303133; // 主文本色
  font-size: 14px;
  line-height: 24px; // 提升行高，优化长文本阅读体验
  word-break: break-all; // 处理长文本换行
  padding-right: 10px;
  white-space: pre-line; // 保留textarea的换行符，适配多行文本展示
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 120px;
  }
  .detail-card {
    padding: 15px;
    max-height: 60vh;
  }
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
