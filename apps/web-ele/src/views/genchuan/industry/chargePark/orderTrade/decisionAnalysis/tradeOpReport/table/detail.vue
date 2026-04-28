<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

// 交易运营报表详情
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
  const reportCycle = detailObj.value?.reportCycle || '交易运营报表';
  return title.value || `${reportCycle} 详情`;
});

// 报表生成状态映射
const generateStatusMap = {
  pending: { label: '生成中', type: 'warning' },
  success: { label: '生成成功', type: 'success' },
  failed: { label: '生成失败', type: 'danger' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return generateStatusMap[status]?.label || status;
};

// 获取状态类型
const getStatusType = (status) => {
  return generateStatusMap[status]?.type || 'default';
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
        <div class="detail-row-left">报表记录ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">报表周期:</div>
        <div class="detail-row-right">{{ detailObj.reportCycle || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">统计时段:</div>
        <div class="detail-row-right">{{ detailObj.statTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">周期订单数:</div>
        <div class="detail-row-right">{{ detailObj.cycleOrderCount || 0 }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">周期营收(元):</div>
        <div class="detail-row-right">{{ (detailObj.cycleRevenue || 0).toFixed(2) }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">支付率(%):</div>
        <div class="detail-row-right">{{ (detailObj.payRate || 0).toFixed(2) }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">充电量(度):</div>
        <div class="detail-row-right">{{ (detailObj.chargeQuantity || 0).toFixed(2) }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">借出量(次):</div>
        <div class="detail-row-right">{{ detailObj.lendCount || 0 }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">退款金额(元):</div>
        <div class="detail-row-right">{{ (detailObj.refundAmount || 0).toFixed(2) }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">待处置异常数:</div>
        <div class="detail-row-right">{{ detailObj.waitHandleAbnormalCount || 0 }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">追缴完成率(%):</div>
        <div class="detail-row-right">{{ (detailObj.collectCompleteRate || 0).toFixed(2) }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">审核完成率(%):</div>
        <div class="detail-row-right">{{ (detailObj.checkCompleteRate || 0).toFixed(2) }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">核算准确率(%):</div>
        <div class="detail-row-right">{{ (detailObj.checkAccuracyRate || 0).toFixed(2) }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">报表生成状态:</div>
        <div class="detail-row-right">
          <el-tag :type="getStatusType(detailObj.generateStatus)">
            {{ getStatusLabel(detailObj.generateStatus) }}
          </el-tag>
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">报表生成时间:</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">操作人:</div>
        <div class="detail-row-right">{{ detailObj.operator || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">同比:</div>
        <div class="detail-row-right">{{ detailObj.yearOnYear || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">环比:</div>
        <div class="detail-row-right">{{ detailObj.chainRatio || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">报表导出次数:</div>
        <div class="detail-row-right">{{ detailObj.exportCount || 0 }}</div>
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
