<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

// 欠费记录结清状态映射
const statusMap = {
  unpaid: { label: '未结清', type: 'warning' },
  cleared: { label: '已结清', type: 'success' },
};

// 获取状态标签
const getStatusLabel = (status) => {
  return statusMap[status]?.label || status;
};

// 欠费结清记录详情
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
  const id = detailObj.value?.id || '欠费结清记录';
  return title.value || `欠费结清【${id}】详情`;
});

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
        <div class="detail-row-left">车牌:</div>
        <div class="detail-row-right">{{ detailObj.plateNo || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">关联欠费订单ID:</div>
        <div class="detail-row-right">{{ detailObj.orderIds || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">欠费金额:</div>
        <div class="detail-row-right">{{ detailObj.arrearAmount || '0.00' }} 元</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">结清状态:</div>
        <div class="detail-row-right">{{ getStatusLabel(detailObj.status) || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">所属场站:</div>
        <div class="detail-row-right">{{ detailObj.stationName || '-' }}</div>
      </div>

       

      <div class="detail-card-row">
        <div class="detail-row-left">创建者:</div>
        <div class="detail-row-right">{{ detailObj.creator || '-' }}</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">更新者:</div>
        <div class="detail-row-right">{{ detailObj.updater || '-' }}</div>
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
  color: #303333;
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