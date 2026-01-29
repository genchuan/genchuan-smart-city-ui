<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（围栏管理数据：8个核心字段）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用围栏名称+围栏详情）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用围栏名称，兜底显示默认值
const drawerTitle = computed(() => {
  const fenceName = detailObj.value?.fenceName || '围栏记录';
  return title.value || `${fenceName}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900, // 加宽至900px，更好适配围栏范围等超长文本字段
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
      <!-- 围栏管理基础信息（8个核心字段，按业务优先级排序） -->
      <div class="detail-card-row">
        <div class="detail-row-left">围栏名称:</div>
        <div class="detail-row-right">{{ detailObj.fenceName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属片区:</div>
        <div class="detail-row-right">{{ detailObj.belongArea || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联单元网格:</div>
        <div class="detail-row-right">
          {{ detailObj.relatedUnitGrid || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">围栏范围:</div>
        <div class="detail-row-right">{{ detailObj.fenceRange || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联巡检员:</div>
        <div class="detail-row-right">
          {{ detailObj.relatedInspector || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">围栏状态:</div>
        <div class="detail-row-right">{{ detailObj.fenceStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联泊位点数量:</div>
        <div class="detail-row-right">
          {{ detailObj.relatedBerthCount || '-' }}
        </div>
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
  min-height: 340px; // 适配8个围栏字段，略调高高度保证界面紧凑不拥挤
  max-height: 70vh; // 限制最大高度，避免内容过多溢出
  overflow-y: auto; // 内容过多时显示滚动条
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配围栏范围/关联单元网格等长文本
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
  width: 130px; // 调整至130px，适配「关联单元网格」「关联泊位点数量」等长标签
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
  word-break: break-all; // 处理围栏范围等超长文本换行，避免溢出
  padding-right: 10px;
  white-space: pre-line; // 保留长文本中的自然换行，提升阅读体验
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 110px;
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
