<script setup>
import { computed, defineProps, toRefs } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';

const props = defineProps({
  detailObj: { type: Object, required: true, default: () => ({}) },
  title: { type: String, default: '' },
});

const { detailObj, title } = toRefs(props);

const drawerTitle = computed(() => {
  const planNo = detailObj.value?.planNo || '收运计划';
  return title.value || `${planNo}详情`;
});

const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900,
  onCancel: () => detailDrawerApi.close(),
});

defineExpose({open: () => detailDrawerApi.open(), close: () => detailDrawerApi.close()});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 计划信息 -->
      <div class="detail-section">📋 计划信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">计划单编号：</div>
        <div class="detail-row-right">{{ detailObj.planNo || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">收运品类：</div>
        <div class="detail-row-right">{{ detailObj.garbageTypeName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">收运区域：</div>
        <div class="detail-row-right">{{ detailObj.areaName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">收运频次：</div>
        <div class="detail-row-right">{{ detailObj.frequency || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">收运时段：</div>
        <div class="detail-row-right">{{ detailObj.timePeriod || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">负责车辆：</div>
        <div class="detail-row-right">{{ detailObj.vehicleLicensePlate || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">负责人员：</div>
        <div class="detail-row-right">{{ detailObj.usersName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">计划状态：</div>
        <div class="detail-row-right">{{ detailObj.planStatusName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">完成率：</div>
        <div class="detail-row-right">
          {{ detailObj.completionRate !== undefined ? detailObj.completionRate + '%' : '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常记录数：</div>
        <div class="detail-row-right">{{ detailObj.abnormalCount ?? '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">总收运量：</div>
        <div class="detail-row-right">{{ detailObj.totalVolume || '-' }} 吨</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常处置结果：</div>
        <div class="detail-row-right">{{ detailObj.abnormalResult || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建人：</div>
        <div class="detail-row-right">{{ detailObj.createByName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">当前进度：</div>
        <div class="detail-row-right">{{ detailObj.completionRate || 0 }}%</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">已收运量：</div>
        <div class="detail-row-right">{{ detailObj.collectedVolume || 0 }} 吨</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">打卡状态：</div>
        <div class="detail-row-right">{{ detailObj.checkinStatus || '未打卡' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">最新上报时间：</div>
        <div class="detail-row-right">{{ detailObj.lastReportTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">复盘意见：</div>
        <div class="detail-row-right">{{ detailObj.reviewDesc || '-' }}</div>
      </div>

      <!-- 时间信息 -->
      <div class="detail-section">📅 时间信息</div>
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间：</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">更新时间：</div>
        <div class="detail-row-right">{{ detailObj.updateTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">完成时间：</div>
        <div class="detail-row-right">{{ detailObj.completeTime || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
@media (max-width: 768px) {
  .detail-row-left {
    width: 180px;
  }
  .detail-card {
    min-height: 600px;
    max-height: 80vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 750px;
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
  width: 200px;
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

.detail-section {
  font-weight: 600;
  font-size: 16px;
  margin: 16px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
  color: #6E7E91;

  &:first-child {
    margin-top: 0;
  }
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
