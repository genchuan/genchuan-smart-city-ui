<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（替换为分账方案详情数据）
const props = defineProps({
  // 详情数据对象（分账方案详情数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用方案名称）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用方案名称，兜底显示默认值
const drawerTitle = computed(() => {
  const sharingName = detailObj.value?.sharingName || '分账方案';
  return title.value || `${sharingName}详情`;
});

// 分账类型字典映射（可根据实际芋道字典配置调整）
const sharingTypeMap = {
  '0': '固定比例',
  '1': '阶梯比例',
  '2': '动态比例',
  // 可根据实际业务需求添加更多映射
};

// 分账状态样式映射
const statusMap = {
  '未生效': { text: '未生效', class: 'status-inactive' },
  '已生效': { text: '已生效', class: 'status-active' },
  '已失效': { text: '已失效', class: 'status-expired' },
};

// 格式化分账类型显示
const formatSharingType = (type) => {
  if (!type) return '-';
  return sharingTypeMap[type] || type;
};

// 格式化分账状态显示
const formatSharingStatus = (status) => {
  if (!status) return '-';
  const statusInfo = statusMap[status];
  return statusInfo ? statusInfo.text : status;
};

// 获取状态样式类
const getStatusClass = (status) => {
  if (!status) return '';
  const statusInfo = statusMap[status];
  return statusInfo ? statusInfo.class : '';
};

// 格式化时间戳（如果接口返回的是时间戳）
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800,
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
      <!-- 方案编号 -->
      <div class="detail-card-row">
        <div class="detail-row-left">方案编号:</div>
        <div class="detail-row-right">
          {{ detailObj.sharingCode || '-' }}
        </div>
      </div>

      <!-- 方案名称 -->
      <div class="detail-card-row">
        <div class="detail-row-left">方案名称:</div>
        <div class="detail-row-right">
          {{ detailObj.sharingName || '-' }}
        </div>
      </div>

      <!-- 合作方 -->
      <div class="detail-card-row">
        <div class="detail-row-left">合作方:</div>
        <div class="detail-row-right">
          {{ detailObj.cooperator || '-' }}
        </div>
      </div>

      <!-- 分账类型 -->
      <div class="detail-card-row">
        <div class="detail-row-left">分账类型:</div>
        <div class="detail-row-right">
          {{ formatSharingType(detailObj.sharingType) }}
        </div>
      </div>

      <!-- 分账比例 -->
      <div class="detail-card-row">
        <div class="detail-row-left">分账比例:</div>
        <div class="detail-row-right">
          {{ detailObj.shareRatio ? `${detailObj.shareRatio}%` : '-' }}
        </div>
      </div>

      <!-- 生效时间 -->
      <div class="detail-card-row">
        <div class="detail-row-left">生效时间:</div>
        <div class="detail-row-right">
          {{ formatTimestamp(detailObj.effectTime) }}
        </div>
      </div>

      <!-- 方案状态 -->
      <div class="detail-card-row">
        <div class="detail-row-left">方案状态:</div>
        <div class="detail-row-right">
          <span :class="['status-badge', getStatusClass(detailObj.sharingStatus)]">
            {{ formatSharingStatus(detailObj.sharingStatus) }}
          </span>
        </div>
      </div>

      <!-- 创建时间（如果接口返回该字段） -->
      <div class="detail-card-row" v-if="detailObj.createTime">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">
          {{ formatTimestamp(detailObj.createTime) }}
        </div>
      </div>

      <!-- 更新时间（如果接口返回该字段） -->
      <div class="detail-card-row" v-if="detailObj.updateTime">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">
          {{ formatTimestamp(detailObj.updateTime) }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 110px;
  }

  .detail-card {
    min-height: 450px;
    max-height: 60vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 500px;
  max-height: 75vh;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9fafb;
  border-radius: 8px;
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
  width: 130px;
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

// 状态徽章样式
.status-badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  border-radius: 4px;

  &.status-active {
    color: #67c23a;
    background-color: #f0f9ff;
  }

  &.status-inactive {
    color: #909399;
    background-color: #f4f4f5;
  }

  &.status-expired {
    color: #f56c6c;
    background-color: #fef0f0;
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
