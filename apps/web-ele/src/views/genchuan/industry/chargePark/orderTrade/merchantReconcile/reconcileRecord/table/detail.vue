<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

// 对账明细详情
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
  const orderNo = detailObj.value?.orderNo || '对账明细';
  return title.value || `${orderNo} 详情`;
});

// 对账结果映射
const matchResultMap = {
  matched: { label: '对账一致', type: 'success' },
  unmatched: { label: '对账不一致', type: 'danger' },
  pending: { label: '待核对', type: 'warning' },
};

// 获取对账结果标签
const getMatchResultLabel = (result) => {
  return matchResultMap[result]?.label || result;
};

// 获取对账结果类型
const getMatchResultType = (result) => {
  return matchResultMap[result]?.type || 'default';
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
        <div class="detail-row-left">所属对账单ID:</div>
        <div class="detail-row-right">{{ detailObj.billId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">对账单号:</div>
        <div class="detail-row-right">{{ detailObj.billNo || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">商户ID:</div>
        <div class="detail-row-right">{{ detailObj.merchantId || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">订单编号:</div>
        <div class="detail-row-right">{{ detailObj.orderNo || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">系统金额:</div>
        <div class="detail-row-right">{{ detailObj.sysAmount ? `¥${detailObj.sysAmount.toFixed(2)}` : '¥0.00' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">商户上报金额:</div>
        <div class="detail-row-right">{{ detailObj.merchantAmount ? `¥${detailObj.merchantAmount.toFixed(2)}` : '¥0.00' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">差异金额:</div>
        <div class="detail-row-right">{{ detailObj.diffAmount ? `¥${detailObj.diffAmount.toFixed(2)}` : '¥0.00' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">对账结果:</div>
        <div class="detail-row-right">
          <el-tag :type="getMatchResultType(detailObj.matchResult)">
            {{ getMatchResultLabel(detailObj.matchResult) }}
          </el-tag>
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">异常原因:</div>
        <div class="detail-row-right">{{ detailObj.diffReason || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">处理时间:</div>
        <div class="detail-row-right">{{ detailObj.handleTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">备注:</div>
        <div class="detail-row-right">{{ detailObj.remark || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
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