<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（与后端字段1:1对应）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题
const drawerTitle = computed(() => {
  const workOrderCode =
    detailObj.value?.workOrderCode ||
    detailObj.value?.orderNo ||
    '设施预警工单';
  return title.value || `${workOrderCode}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 950, // 适当加宽以容纳更多字段
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
      <!-- 1. 基础标识信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">归档唯一标识ID:</div>
        <div class="detail-row-right">{{ detailObj.id || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">归档编号:</div>
        <div class="detail-row-right">{{ detailObj.archiveNo || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">工单编号:</div>
        <div class="detail-row-right">{{ detailObj.orderNo || '-' }}</div>
      </div>

      <!-- 2. 类型与时间 -->
      <div class="detail-card-row">
        <div class="detail-row-left">工单类型:</div>
        <div class="detail-row-right">{{ detailObj.orderType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">工单处置类型:</div>
        <div class="detail-row-right">{{ detailObj.bizType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">工单完成时间:</div>
        <div class="detail-row-right">{{ detailObj.completeTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警编号:</div>
        <div class="detail-row-right">{{ detailObj.warnNo || '-' }}</div>
      </div>

      <!-- 3. 设施与人员 -->
      <div class="detail-card-row">
        <div class="detail-row-left">设施编码:</div>
        <div class="detail-row-right">{{ detailObj.facilityCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设施名称:</div>
        <div class="detail-row-right">{{ detailObj.facilityName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设施类型:</div>
        <div class="detail-row-right">{{ detailObj.facilityType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">指派运维员ID:</div>
        <div class="detail-row-right">{{ detailObj.assignStaffId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">指派运维员姓名:</div>
        <div class="detail-row-right">
          {{ detailObj.assignStaffName || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核查人ID:</div>
        <div class="detail-row-right">{{ detailObj.checkStaffId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核查人姓名:</div>
        <div class="detail-row-right">
          {{ detailObj.checkStaffName || '-' }}
        </div>
      </div>

      <!-- 4. 区域与时空 -->
      <div class="detail-card-row">
        <div class="detail-row-left">所属区域ID:</div>
        <div class="detail-row-right">{{ detailObj.areaId || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属区域名称:</div>
        <div class="detail-row-right">{{ detailObj.areaFullName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处理时间:</div>
        <div class="detail-row-right">{{ detailObj.handleTime || '-' }}</div>
      </div>

      <!-- 5. 结果与状态 -->
      <div class="detail-card-row">
        <div class="detail-row-left">核查结果:</div>
        <div class="detail-row-right">{{ detailObj.checkResult || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核查意见:</div>
        <div class="detail-row-right">{{ detailObj.checkSuggest || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">归档资料数:</div>
        <div class="detail-row-right">{{ detailObj.fileNum || '-' }}</div>
      </div>

      <!-- 6. 指标与阈值 -->
      <div class="detail-card-row">
        <div class="detail-row-left">处置前指标值:</div>
        <div class="detail-row-right">
          {{ detailObj.beforeIndexValue || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置后指标值:</div>
        <div class="detail-row-right">
          {{ detailObj.afterIndexValue || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">恢复值:</div>
        <div class="detail-row-right">{{ detailObj.recoverValue || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">指标阈值:</div>
        <div class="detail-row-right">{{ detailObj.threshold || '-' }}</div>
      </div>

      <!-- 7. 其他 -->
      <div class="detail-card-row">
        <div class="detail-row-left">创建时间:</div>
        <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 160px; // 适配较长字段标签
  }
  .detail-card {
    min-height: 520px;
    max-height: 70vh;
    padding: 15px;
  }
}

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
  width: 180px; // 统一加宽标签宽度，适配长字段
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
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
.detail-card::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}
</style>
