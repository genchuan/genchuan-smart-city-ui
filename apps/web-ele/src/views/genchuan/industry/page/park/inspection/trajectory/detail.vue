<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（巡检记录数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用巡检员姓名+巡检记录）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用巡检员姓名，兜底显示默认值
const drawerTitle = computed(() => {
  const inspectorName = detailObj.value?.inspectorName || '巡检记录';
  return title.value || `${inspectorName}巡检详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800, // 加宽抽屉适配巡检长文本字段
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
      <!-- 巡检记录基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">巡检员姓名:</div>
        <div class="detail-row-right">{{ detailObj.inspectorName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">巡检时段:</div>
        <div class="detail-row-right">
          {{ detailObj.inspectionPeriod || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属片区:</div>
        <div class="detail-row-right">{{ detailObj.belongArea || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">巡检轨迹:</div>
        <div class="detail-row-right">
          {{ detailObj.inspectionTrack || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联操作记录:</div>
        <div class="detail-row-right">
          {{ detailObj.relatedOperationRecord || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">轨迹时长:</div>
        <div class="detail-row-right">{{ detailObj.trackDuration || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">轨迹完成度:</div>
        <div class="detail-row-right">
          {{ detailObj.trackCompletion || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">记录时间:</div>
        <div class="detail-row-right">{{ detailObj.recordTime || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 详情卡片整体样式
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 320px; // 适配8个巡检字段，调整高度避免冗余
  max-height: 70vh; // 限制最大高度，避免内容过多溢出
  overflow-y: auto; // 内容过多时显示滚动条
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配巡检轨迹/操作记录等长文本
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

// 左侧标签样式
.detail-row-left {
  width: 120px; // 固定宽度，保证所有标签对齐
  flex-shrink: 0; // 不收缩
  font-weight: 500; // 加粗突出标签
  color: #606266; // 灰色调，区分内容
  font-size: 14px;
  line-height: 18px; // 统一行高
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  color: #303133; // 主文本色
  font-size: 14px;
  line-height: 18px;
  word-break: break-all; // 处理巡检轨迹/操作记录等长文本换行
  padding-right: 10px;
  white-space: pre-line; // 保留长文本中的自然换行，提升阅读体验
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
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
