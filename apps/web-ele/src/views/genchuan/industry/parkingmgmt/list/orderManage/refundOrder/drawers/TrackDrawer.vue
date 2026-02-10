<script setup>
import { ref, computed } from 'vue';
import { ElTimeline, ElTimelineItem } from 'element-plus';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  row: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close']);

const timelineData = computed(() => {
  return [
    {
      time: props.row.changeTime || '2025-01-14 16:00:00',
      status: '退款申请提交',
      description: '用户提交退款申请',
      type: 'primary',
      icon: 'Plus'
    },
    {
      time: props.row.changeTime || '2025-01-14 16:30:00',
      status: '审批通过',
      description: '退款申请已审批通过',
      type: 'info',
      icon: 'Check'
    },
    {
      time: props.row.changeTime || '2025-01-14 17:00:00',
      status: '财务处理中',
      description: '财务部门正在处理退款',
      type: 'info',
      icon: 'Clock'
    },
    {
      time: props.row.changeTime || '2025-01-14 18:00:00',
      status: '银行处理中',
      description: '银行正在处理退款转账',
      type: 'info',
      icon: 'Clock'
    },
    {
      time: props.row.changeTime || '2025-01-14 19:00:00',
      status: '退款成功',
      description: '退款已成功到账',
      type: 'success',
      icon: 'Check'
    }
  ];
});
</script>

<template>
  <div class="track-drawer-content">
    <div class="track-header">
      <div class="order-info-item">
        <span class="label">退款单号：</span>
        <span class="value">{{ row.refundNo }}</span>
      </div>
      <div class="order-info-item">
        <span class="label">原订单编号：</span>
        <span class="value">{{ row.originalOrderNo }}</span>
      </div>
      <div class="order-info-item">
        <span class="label">用户姓名：</span>
        <span class="value">{{ row.userName }}</span>
      </div>
      <div class="order-info-item">
        <span class="label">车牌号码：</span>
        <span class="value">{{ row.carNumber }}</span>
      </div>
      <div class="order-info-item">
        <span class="label">退款金额：</span>
        <span class="value">{{ row.refundAmount }}</span>
      </div>
      <div class="order-info-item">
        <span class="label">退款原因：</span>
        <span class="value">{{ row.refundReasonName }}</span>
      </div>
      <div class="order-info-item">
        <span class="label">申请时间：</span>
        <span class="value">{{ row.applyTime }}</span>
      </div>
      <div class="order-info-item">
        <span class="label">退款方式：</span>
        <span class="value">{{ row.payTypeName }}</span>
      </div>
      <div class="order-info-item">
        <span class="label">审批状态：</span>
        <span class="value">{{ row.approveStatusName }}</span>
      </div>
      <div class="order-info-item">
        <span class="label">退款状态：</span>
        <span class="value">{{ row.refundStatusName }}</span>
      </div>
      <div class="order-info-item">
        <span class="label">审批时间：</span>
        <span class="value">{{ row.approveTime }}</span>
      </div>
      <div class="order-info-item">
        <span class="label">退款时间：</span>
        <span class="value">{{ row.refundTime }}</span>
      </div>
      <div class="order-info-item">
        <span class="label">到账时间：</span>
        <span class="value">{{ row.arrivalTime }}</span>
      </div>
    </div>
    <div class="track-timeline">
      <ElTimeline>
        <ElTimelineItem
          v-for="(item, index) in timelineData"
          :key="index"
          :timestamp="item.time"
          :type="item.type"
          :size="16"
          :icon="item.icon"
        >
          <div class="timeline-item-content">
            <div class="status">{{ item.status }}</div>
            <div class="description">{{ item.description }}</div>
          </div>
        </ElTimelineItem>
      </ElTimeline>
    </div>
  </div>
</template>

<style scoped>
.track-drawer-content {
  padding: 20px;
  font-size: 14px;
}

.track-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.order-info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.order-info-item .label {
  font-weight: 500;
  margin-right: 8px;
  color: #606266;
  min-width: 100px;
}

.order-info-item .value {
  color: #303133;
  font-weight: 400;
  flex: 1;
}

.track-timeline {
  margin-top: 20px;
}

.timeline-item-content {
  padding: 8px 0;
}

.timeline-item-content .status {
  font-weight: 500;
  margin-bottom: 4px;
  color: #303133;
}

.timeline-item-content .description {
  font-size: 13px;
  color: #606266;
  line-height: 1.4;
}

.el-timeline-item__timestamp {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
