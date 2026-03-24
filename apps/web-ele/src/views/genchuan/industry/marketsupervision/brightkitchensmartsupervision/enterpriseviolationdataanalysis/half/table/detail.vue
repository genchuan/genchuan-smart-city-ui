<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（企业违规分析半年报）
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

// 标题自动处理
const drawerTitle = computed(() => {
  const reportNo = detailObj.value?.reportNumber || '企业违规半年报';
  return title.value || `${reportNo} 详情`;
});

// 抽屉配置
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 950,
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 暴露方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <div class="detail-card-row">
        <div class="detail-row-left">报告编号:</div>
        <div class="detail-row-right">
          {{ detailObj.reportNumber || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">统计半年:</div>
        <div class="detail-row-right">
          {{ detailObj.statHalfyear || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">统计区域:</div>
        <div class="detail-row-right">
          {{ detailObj.statArea || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">统计周期:</div>
        <div class="detail-row-right">
          {{ detailObj.statCycle || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">半年总告警次数:</div>
        <div class="detail-row-right">
          {{ detailObj.halfyearWarnCount || 0 }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">半年违规企业数量:</div>
        <div class="detail-row-right">
          {{ detailObj.halfyearIllegalEntCount || 0 }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">季度违规趋势:</div>
        <div class="detail-row-right">
          {{ detailObj.quarterIllegalTrend || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">高频违规类型:</div>
        <div class="detail-row-right">
          {{ detailObj.highIllegalType || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">区域违规排名:</div>
        <div class="detail-row-right">
          {{ detailObj.areaIllegalRank || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">企业类型违规分布:</div>
        <div class="detail-row-right">
          {{ detailObj.entTypeIllegalDist || '-' }}
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">同比告警变化率:</div>
        <div class="detail-row-right">{{ detailObj.warnChangeYoy || 0 }} %</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">环比告警变化率:</div>
        <div class="detail-row-right">{{ detailObj.warnChangeMom || 0 }} %</div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">半年整改完成率:</div>
        <div class="detail-row-right">
          {{ detailObj.halfyearRectifyRate || 0 }} %
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">半年设备正常率:</div>
        <div class="detail-row-right">
          {{ detailObj.halfyearDeviceNormalRate || 0 }} %
        </div>
      </div>

      <div class="detail-card-row">
        <div class="detail-row-left">合规企业占比:</div>
        <div class="detail-row-right">
          {{ detailObj.complianceRate || 0 }} %
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
@media (max-width: 768px) {
  .detail-row-left {
    width: 160px;
  }
  .detail-card {
    min-height: 600px;
    max-height: 80vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 700px;
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
  width: 180px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: #606266;
}

.detail-row-right {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
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
