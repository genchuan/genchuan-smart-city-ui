<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（车位数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用车位编号）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用车位编号，兜底显示默认值
const drawerTitle = computed(() => {
  const parkingSpaceNo = detailObj.value?.parkingSpaceNo || '车位';
  return title.value || `${parkingSpaceNo}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800, // 加宽抽屉适配更多车位字段
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
      <!-- 车位详情信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">车位编号:</div>
        <div class="detail-row-right">
          {{ detailObj.parkingSpaceNo || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车位类型:</div>
        <div class="detail-row-right">
          {{ detailObj.parkingSpaceType || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属车场/车库:</div>
        <div class="detail-row-right">
          {{ detailObj.belongParkGarage || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">位置描述:</div>
        <div class="detail-row-right">{{ detailObj.locationDesc || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">是否可预约:</div>
        <div class="detail-row-right">{{ detailObj.bookable || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">绑定车牌数量上限:</div>
        <div class="detail-row-right">
          {{ detailObj.bindPlateLimit || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">启用状态:</div>
        <div class="detail-row-right">{{ detailObj.enableStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">联系人:</div>
        <div class="detail-row-right">{{ detailObj.contactPerson || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">联系电话:</div>
        <div class="detail-row-right">{{ detailObj.contactPhone || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">绑定车牌数:</div>
        <div class="detail-row-right">
          {{ detailObj.bindPlateCount || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">台账更新时间:</div>
        <div class="detail-row-right">
          {{ detailObj.ledgerUpdateTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">可用状态:</div>
        <div class="detail-row-right">
          {{ detailObj.availableStatus || '-' }}
        </div>
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
  min-height: 400px; // 增加最小高度适配更多字段
  max-height: 70vh; // 限制最大高度，避免内容过多溢出
  overflow-y: auto; // 内容过多时显示滚动条
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本
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
  width: 140px; // 加宽适配长标签（绑定车牌数量上限/台账更新时间）
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
  word-break: break-all; // 处理长文本换行（如所属车场/车库、位置描述）
  padding-right: 10px;
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

// 滚动条样式优化（可选）
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
