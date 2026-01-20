<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（开闸补录数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用开闸ID）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用开闸ID，兜底显示默认值
const drawerTitle = computed(() => {
  const gateId = detailObj.value?.id || '开闸补录记录';
  return title.value || `${gateId}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800, // 加宽抽屉适配更多字段
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
      <!-- 开闸补录基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">开闸ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">开闸位置:</div>
        <div class="detail-row-right">
          {{ detailObj.openGatePosition || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">开闸原因:</div>
        <div class="detail-row-right" style="white-space: pre-line">
          {{ detailObj.openGateReason || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">紧急程度:</div>
        <div class="detail-row-right">
          <span :class="`status-tag ${detailObj.emergencyLevel}`">
            {{ detailObj.emergencyLevel || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">申请人:</div>
        <div class="detail-row-right">{{ detailObj.applicant || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">联系电话:</div>
        <div class="detail-row-right">{{ detailObj.phone || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">开闸时间:</div>
        <div class="detail-row-right">{{ detailObj.openGateTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">补录状态:</div>
        <div class="detail-row-right">
          <span :class="`status-tag ${detailObj.supplementStatus}`">
            {{ detailObj.supplementStatus || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">审批结果:</div>
        <div class="detail-row-right">
          <span :class="`status-tag ${detailObj.approvalResult}`">
            {{ detailObj.approvalResult || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">同步政务系统状态:</div>
        <div class="detail-row-right">
          <span :class="`status-tag ${detailObj.syncGovStatus}`">
            {{ detailObj.syncGovStatus || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">补录人:</div>
        <div class="detail-row-right">
          {{ detailObj.supplementPerson || '-' }}
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
  min-height: 400px;
  max-height: 70vh;
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
  width: 140px;
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

// 状态标签样式
.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;

  // 紧急程度样式
  &.一般 {
    background-color: #f0f9ff;
    color: #409eff;
  }
  &.紧急 {
    background-color: #fdf2e9;
    color: #e6a23c;
  }
  &.特急 {
    background-color: #fef0f0;
    color: #f56c6c;
  }

  // 补录状态样式
  &.待补录 {
    background-color: #fff7e6;
    color: #fa8c16;
  }
  &.补录中 {
    background-color: #e6f7ff;
    color: #1890ff;
  }
  &.已补录 {
    background-color: #f6ffed;
    color: #52c41a;
  }

  // 审批结果样式
  &.待审批 {
    background-color: #fff7e6;
    color: #fa8c16;
  }
  &.审批中 {
    background-color: #e6f7ff;
    color: #1890ff;
  }
  &.审批通过 {
    background-color: #f6ffed;
    color: #52c41a;
  }
  &.审批驳回 {
    background-color: #fff1f0;
    color: #ff4d4f;
  }

  // 同步政务系统状态样式
  &.未同步 {
    background-color: #fff7e6;
    color: #fa8c16;
  }
  &.同步中 {
    background-color: #e6f7ff;
    color: #1890ff;
  }
  &.已同步 {
    background-color: #f6ffed;
    color: #52c41a;
  }
  &.同步失败 {
    background-color: #fff1f0;
    color: #ff4d4f;
  }
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
