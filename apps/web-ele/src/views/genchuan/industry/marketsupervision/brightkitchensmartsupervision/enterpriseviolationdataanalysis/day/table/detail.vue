<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（告警统计详情）
const props = defineProps({
  // 详情数据对象
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题
const drawerTitle = computed(() => {
  const reportNo = detailObj.value?.reportNumber || '告警统计报告';
  return title.value || `${reportNo} 详情`;
});

// 初始化抽屉
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

// 对外暴露方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 告警统计详情字段 -->
      <div class="detail-card-row">
        <div class="detail-row-left">报告编号:</div>
        <div class="detail-row-right">
          {{ detailObj.reportNumber || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">统计日期:</div>
        <div class="detail-row-right">
          {{ detailObj.statisticsDate || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">统计区域:</div>
        <div class="detail-row-right">
          {{ detailObj.statisticsArea || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">当日总告警次数:</div>
        <div class="detail-row-right">
          {{ detailObj.totalAlarmCount || 0 }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">当日违规企业数量:</div>
        <div class="detail-row-right">
          {{ detailObj.violationCompanyCount || 0 }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">高频违规类型:</div>
        <div class="detail-row-right">
          {{ detailObj.highFreqViolationType || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">区域违规分布:</div>
        <div class="detail-row-right">
          {{ detailObj.areaViolationDistribution || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">同比告警变化率:</div>
        <div class="detail-row-right">
          {{ detailObj.yoyAlarmChangeRate || 0 }} %
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">环比告警变化率:</div>
        <div class="detail-row-right">
          {{ detailObj.momAlarmChangeRate || 0 }} %
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">设备告警正常率:</div>
        <div class="detail-row-right">
          {{ detailObj.deviceAlarmNormalRate || 0 }} %
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">当日整改完成率:</div>
        <div class="detail-row-right">
          {{ detailObj.dailyRectificationCompletionRate || 0 }} %
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
.detail-card {
  min-height: 600px;
  max-height: 85vh;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9fafb;
  border-radius: 8px;
}

.detail-card-row {
  display: flex;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    padding: 14px 8px;
    margin: 0 -8px;
    background-color: #f5f7fa;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
}

.detail-row-left {
  flex-shrink: 0;
  width: 120px;
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

// 滚动条优化
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

// 小屏适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 140px;
  }
  .detail-card {
    padding: 15px;
  }
}
</style>
