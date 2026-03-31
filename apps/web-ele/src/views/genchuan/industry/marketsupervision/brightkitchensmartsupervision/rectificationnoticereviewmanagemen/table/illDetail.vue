<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { formatTimestamp } from '#/utils';

// 定义组件接收的属性
const props = defineProps({
  // AI场景告警详情数据对象
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用分类编码）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用分类编码，兜底显示默认值
const drawerTitle = computed(() => {
  const alertCategory = detailObj.value?.alertCategory || 'AI场景告警';
  return title.value || `${alertCategory}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 700, // 适配AI告警字段数量调整宽度
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
      <!-- AI场景告警基础字段展示 -->
      <div class="detail-card-row">
        <div class="detail-row-left">主键ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">分类编码:</div>
        <div class="detail-row-right">{{ detailObj.typeCategory || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">违规类型编码:</div>
        <div class="detail-row-right">{{ detailObj.typeCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">违规类型名称:</div>
        <div class="detail-row-right">{{ detailObj.typeName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">违法行为说明:</div>
        <div class="detail-row-right">
          {{ detailObj.illegalBehaviorDescription || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">告警设备说明:</div>
        <div class="detail-row-right">
          {{ detailObj.alarmDeviceDescription || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">排序序号:</div>
        <div class="detail-row-right">{{ detailObj.sort || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">
          {{
            detailObj.createTime ? formatTimestamp(detailObj.createTime) : '-'
          }}
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
  min-height: 300px;
  max-height: 50vh;
  overflow-y: auto;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

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
  width: 120px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}

// 右侧内容样式
.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 100px;
  }
  .detail-card {
    padding: 15px;
    max-height: 40vh;
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
