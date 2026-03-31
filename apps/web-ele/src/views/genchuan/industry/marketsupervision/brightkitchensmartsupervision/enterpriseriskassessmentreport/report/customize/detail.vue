<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（企业风险报告）
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

// 标题：报表编号
const drawerTitle = computed(() => {
  const reportNumber = detailObj.value?.reportNumber || '企业风险报告';
  return title.value || `${reportNumber} 详情`;
});

// 抽屉配置
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 1000,
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
        <div class="detail-row-left">报表编号：</div>
        <div class="detail-row-right">{{ detailObj.reportNumber || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">筛选条件：</div>
        <div class="detail-row-right">
          {{ detailObj.filterConditions || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">生成时间：</div>
        <div class="detail-row-right">
          {{ detailObj.generationTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">涉及企业数量：</div>
        <div class="detail-row-right">
          {{ detailObj.involvedCompanyCount || '-' }} 家
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">整体风险等级分布：</div>
        <div class="detail-row-right">
          {{ detailObj.riskLevelDistribution || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">平均违规频次：</div>
        <div class="detail-row-right">
          {{ detailObj.averageViolationCount || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">平均整改完成率：</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.averageRectificationRate >= 90,
              'text-yellow-600':
                detailObj.averageRectificationRate >= 70 &&
                detailObj.averageRectificationRate < 90,
              'text-red-600': detailObj.averageRectificationRate < 70,
            }"
          >
            {{ detailObj.averageRectificationRate || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">高频风险点：</div>
        <div class="detail-row-right">
          {{ detailObj.highRiskPoints || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">报表生成人：</div>
        <div class="detail-row-right">
          {{ detailObj.reportGenerator || '-' }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  min-height: 500px;
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
    padding-right: 8px;
    padding-left: 8px;
    margin-right: -8px;
    margin-left: -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}

.detail-row-left {
  flex-shrink: 0;
  width: 150px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
  word-break: break-all;
}

.text-green-600 {
  color: #10b981 !important;
}

.text-yellow-600 {
  color: #f59e0b !important;
}

.text-red-600 {
  color: #ef4444 !important;
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

@media (max-width: 768px) {
  .detail-row-left {
    width: 130px;
  }
  .detail-card {
    padding: 15px;
  }
}
</style>
