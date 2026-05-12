<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

// 发票申请审核记录详情
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
  const invoiceNo = detailObj.value?.invoiceNo || '发票申请';
  return title.value || `${invoiceNo} 审核详情`;
});

// 状态映射
const statusMap = {
  pending: { label: '待审核', type: 'warning' },
  approved: { label: '已通过', type: 'success' },
  rejected: { label: '已驳回', type: 'danger' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
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
        <div class="detail-row-left">关联发票ID:</div>
        <div class="detail-row-right">{{ detailObj.applyId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">关联发票编号:</div>
        <div class="detail-row-right">{{ detailObj.invoiceNo || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">申请人ID:</div>
        <div class="detail-row-right">{{ detailObj.applicantId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">申请人名称:</div>
        <div class="detail-row-right">{{ detailObj.applicantName || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">申请时间:</div>
        <div class="detail-row-right">{{ detailObj.applyTime || '-' }}</div>
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
        <div class="detail-row-left">审核结果:</div>
        <div class="detail-row-right">{{ detailObj.auditResult || '-' }}</div>
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