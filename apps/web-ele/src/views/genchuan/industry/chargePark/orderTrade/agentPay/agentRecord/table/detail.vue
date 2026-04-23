<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

// 资金变动记录详情
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
  const recordNo = detailObj.value?.recordNo || '资金变动记录';
  return title.value || `${recordNo} 详情`;
});

// 状态映射
const statusMap = {
  pending: { label: '待核查', type: 'warning' },
  passed: { label: '核查通过', type: 'success' },
  rejected: { label: '核查驳回', type: 'danger' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return statusMap[status]?.type || 'default';
};

// 核查结果映射
const checkResultMap = {
  pending: { label: '待核查', type: 'warning' },
  passed: { label: '核查通过', type: 'success' },
  rejected: { label: '核查驳回', type: 'danger' },
};

// 获取核查结果标签
const getCheckResultLabel = (checkResult) => {
  return checkResultMap[checkResult]?.label || checkResult;
};

// 获取核查结果类型
const getCheckResultType = (checkResult) => {
  return checkResultMap[checkResult]?.type || 'default';
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
        <div class="detail-row-left">记录编号:</div>
        <div class="detail-row-right">{{ detailObj.recordNo || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">关联订单ID:</div>
        <div class="detail-row-right">{{ detailObj.orderId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">关联订单编号:</div>
        <div class="detail-row-right">{{ detailObj.orderNo || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">商户ID:</div>
        <div class="detail-row-right">{{ detailObj.merchantId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">商户名称:</div>
        <div class="detail-row-right">{{ detailObj.merchantName || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">变动金额:</div>
        <div class="detail-row-right">{{ detailObj.amount || '0.00' }} 元</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">交易时间:</div>
        <div class="detail-row-right">{{ detailObj.tradeTime || '-' }}</div>
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
        <div class="detail-row-left">核查人ID:</div>
        <div class="detail-row-right">{{ detailObj.checkerId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">核查人名称:</div>
        <div class="detail-row-right">{{ detailObj.checkerName || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">核查时间:</div>
        <div class="detail-row-right">{{ detailObj.checkTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">核查结果:</div>
        <div class="detail-row-right">
          <el-tag :type="getCheckResultType(detailObj.checkResult)">
            {{ getCheckResultLabel(detailObj.checkResult) }}
          </el-tag>
        </div>
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