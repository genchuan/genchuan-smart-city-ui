<script setup>
import { formatArrayDate } from '#/utils/genchuan/formatTime.ts';
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
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

// 标题计算
const drawerTitle = computed(() => {
  const reportNo = detailObj.value?.reportNo || '风险报告';
  return title.value || `${reportNo} 详情`;
});

// 抽屉配置
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 850,
  onCancel() {
    detailDrawerApi.close();
  },
});

// 暴露方法给父组件调用
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">统计周期:</div>
        <div class="detail-row-right">{{ detailObj.statisticPeriod || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">报告编号:</div>
        <div class="detail-row-right">{{ detailObj.reportNo || '-' }}</div>
      </div> 
      <div class="detail-card-row">
        <div class="detail-row-left">企业名称:</div>
        <div class="detail-row-right">{{ detailObj.entName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">风险等级:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.riskLevel === '低风险',
              'text-yellow-600': detailObj.riskLevel === '中风险',
              'text-red-600': detailObj.riskLevel === '高风险',
            }"
          >
            {{ detailObj.riskLevel || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">区域:</div>
        <div class="detail-row-right">{{ detailObj.area || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">企业类型:</div>
        <div class="detail-row-right">{{ detailObj.entType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">统计开始时间:</div>
        <div class="detail-row-right">{{ formatArrayDate(detailObj.beginTime || [2026,1,1]) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">统计结束时间:</div>
        <div class="detail-row-right">{{ formatArrayDate(detailObj.endTime || [2026,1,1]) }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">违规次数:</div>
        <div class="detail-row-right">{{ detailObj.violationCount || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
@media (max-width: 768px) {
  .detail-row-left {
    width: 140px;
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

/* 风险等级颜色 */
.text-green-600 {
  color: #10b981 !important;
}
.text-yellow-600 {
  color: #f59e0b !important;
}
.text-red-600 {
  color: #ef4444 !important;
}

/* 滚动条优化 */
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
</style>