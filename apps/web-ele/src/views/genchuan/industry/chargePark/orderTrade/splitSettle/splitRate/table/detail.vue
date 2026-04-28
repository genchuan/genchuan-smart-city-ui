<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

// 分账规则详情
const props = defineProps({
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 标题
const drawerTitle = computed(() => {
  const partnerName = detailObj.value?.partnerName || '分账规则';
  return title.value || `${partnerName} 规则详情`;
});

// 状态映射 - SplitRateStatusEnum
const statusMap = {
  pending: { label: '未生效', type: 'warning' },
  enabled: { label: '已生效', type: 'success' },
  disabled: { label: '已禁用', type: 'danger' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

// 分账模式映射 - SplitRateSplitModeEnum
const splitModeMap = {
  fixed: '固定比例',
  ladder: '阶梯比例',
};

// 抽屉
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">主键ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">合作方ID:</div>
        <div class="detail-row-right">{{ detailObj.partnerId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">合作方名称:</div>
        <div class="detail-row-right">{{ detailObj.partnerName || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">分账模式:</div>
        <div class="detail-row-right">{{ splitModeMap[detailObj.splitMode] || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">比例值:</div>
        <div class="detail-row-right">{{ detailObj.rateValue ? `${detailObj.rateValue}%` : '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">状态:</div>
        <div class="detail-row-right">
          <el-tag :type="getStatusType(detailObj.status)">
            {{ getStatusLabel(detailObj.status) }}
          </el-tag>
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">审核人ID:</div>
        <div class="detail-row-right">{{ detailObj.auditorId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">审核人名称:</div>
        <div class="detail-row-right">{{ detailObj.auditorName || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">审核时间:</div>
        <div class="detail-row-right">{{ detailObj.auditTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">备注:</div>
        <div class="detail-row-right">{{ detailObj.remark || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">备用字段1:</div>
        <div class="detail-row-right">{{ detailObj.reserve1 || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">备用字段2:</div>
        <div class="detail-row-right">{{ detailObj.reserve2 || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">创建者:</div>
        <div class="detail-row-right">{{ detailObj.creator || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">更新时间:</div>
        <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
@media (max-width: 768px) {
  .detail-row-left {
    width: 150px;
  }
  .detail-card {
    min-height: 600px;
    max-height: 80vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 650px;
  max-height: 85vh;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9fafb;
  border-radius: 8px;
}

.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    padding: 12px 8px;
    margin: 0 -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}

.detail-row-left {
  flex-shrink: 0;
  width: 160px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  font-size: 14px;
  color: #303133;
  word-break: break-all;
}

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