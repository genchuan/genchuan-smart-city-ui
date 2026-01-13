<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（车库数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的garageName/name）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用车库名称，兜底显示默认值
const drawerTitle = computed(() => {
  const garageName =
    detailObj.value?.garageName || detailObj.value?.name || '车库';
  return title.value || `${garageName}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 700, // 加宽抽屉适配更多字段
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
      <!-- 基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">车库ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">资产扩展ID:</div>
        <div class="detail-row-right">{{ detailObj.assetExtendId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属车场ID:</div>
        <div class="detail-row-right">{{ detailObj.parkId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车库名称:</div>
        <div class="detail-row-right">{{ detailObj.garageName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">楼层数:</div>
        <div class="detail-row-right">{{ detailObj.floorCount || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">总车位数:</div>
        <div class="detail-row-right">
          {{ detailObj.totalParkingSpaces || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">门禁类型:</div>
        <div class="detail-row-right">
          {{ detailObj.accessControlType || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">详细地址:</div>
        <div class="detail-row-right">
          {{ detailObj.detailedAddress || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">经度:</div>
        <div class="detail-row-right">{{ detailObj.longitude || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">纬度:</div>
        <div class="detail-row-right">{{ detailObj.latitude || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">启用状态:</div>
        <div class="detail-row-right">{{ detailObj.enableStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建人:</div>
        <div class="detail-row-right">{{ detailObj.creator || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车场名称:</div>
        <div class="detail-row-right">{{ detailObj.name || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
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
  word-break: break-all; // 处理长文本换行（如详细地址）
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
