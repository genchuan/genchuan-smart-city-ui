<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 泊位停车详情数据对象（适配新的泊位字段结构）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const { detailObj } = toRefs(props);

// 计算属性处理标题，优先使用目标泊位号，兜底显示默认值
const drawerTitle = computed(() => {
  const berthNo = detailObj.value?.targetBerthNo || '泊位停车';
  return `${berthNo}详情`;
});

// 初始化抽屉实例（优化层级配置，避免被覆盖）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
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
  <DetailDrawer :title="drawerTitle" class="berth-parking-detail-drawer">
    <div class="detail-card">
      <!-- 泊位停车核心字段展示（适配新的字段结构） -->
      <div class="detail-card-row">
        <div class="detail-row-left">目标泊位号:</div>
        <div class="detail-row-right">{{ detailObj.targetBerthNo || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车牌号码:</div>
        <div class="detail-row-right">{{ detailObj.licensePlate || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车辆类型:</div>
        <div class="detail-row-right">{{ detailObj.vehicleType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车牌颜色:</div>
        <div class="detail-row-right">{{ detailObj.plateColor || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">录入时间:</div>
        <div class="detail-row-right">{{ detailObj.entryTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">停车状态:</div>
        <div class="detail-row-right">{{ detailObj.parkingStatus || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 详情卡片整体样式（适配泊位停车字段）
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 350px; // 适配6个字段的高度，避免空白过多
  max-height: 70vh; // 限制最大高度，避免溢出
  overflow-y: auto; // 内容过多时滚动
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配长文本
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
  width: 120px; // 适配泊位停车字段标签宽度
  flex-shrink: 0; // 不收缩
  font-weight: 500; // 加粗突出标签
  color: #606266; // 灰色调，区分内容
  font-size: 14px;
  line-height: 20px; // 适配行高
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  color: #303133; // 主文本色
  font-size: 14px;
  line-height: 20px;
  word-break: break-all; // 处理长文本换行
  padding-right: 10px;
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }
  .detail-card {
    padding: 15px;
    max-height: 60vh;
    min-height: 300px;
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
