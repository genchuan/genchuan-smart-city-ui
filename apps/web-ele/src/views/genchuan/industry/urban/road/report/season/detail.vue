<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（替换为道路监测季度统计数据）
const props = defineProps({
  // 详情数据对象（道路监测季度统计数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的roadSectionName）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用路段名称，兜底显示默认值
const drawerTitle = computed(() => {
  const roadSectionName =
    detailObj.value?.roadSectionName || '道路监测季度统计';
  return title.value || `${roadSectionName}季度统计详情`;
});

// 初始化抽屉实例（加宽适配季度统计更多长字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 1200, // 加宽到1200px适配16个季度统计字段+超长标签
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 道路监测季度统计分析信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">路段名称:</div>
        <div class="detail-row-right">
          {{ detailObj.roadSectionName || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">区域名称:</div>
        <div class="detail-row-right">{{ detailObj.areaName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">坑洼数量季度均值:</div>
        <div class="detail-row-right">
          {{ detailObj.potholeCountQuarterAvg || '-' }} 个
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">裂缝长度季度均值:</div>
        <div class="detail-row-right">
          {{ detailObj.crackLengthQuarterAvg || '-' }} 米
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">季度累计预警数:</div>
        <div class="detail-row-right">
          {{ detailObj.quarterTotalWarningCount || '-' }} 次
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">季度工单量:</div>
        <div class="detail-row-right">
          {{ detailObj.quarterWorkOrderCount || '-' }} 个
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">季度处置效率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.quarterDisposalEfficiency >= 90,
              'text-yellow-600':
                detailObj.quarterDisposalEfficiency >= 80 &&
                detailObj.quarterDisposalEfficiency < 90,
              'text-red-600':
                detailObj.quarterDisposalEfficiency > 0 &&
                detailObj.quarterDisposalEfficiency < 80,
            }"
          >
            {{ detailObj.quarterDisposalEfficiency || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">季度处置达标率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.quarterDisposalComplianceRate >= 90,
              'text-yellow-600':
                detailObj.quarterDisposalComplianceRate >= 75 &&
                detailObj.quarterDisposalComplianceRate < 90,
              'text-red-600':
                detailObj.quarterDisposalComplianceRate > 0 &&
                detailObj.quarterDisposalComplianceRate < 75,
            }"
          >
            {{ detailObj.quarterDisposalComplianceRate || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备季度在线率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.deviceQuarterOnlineRate >= 95,
              'text-yellow-600':
                detailObj.deviceQuarterOnlineRate >= 85 &&
                detailObj.deviceQuarterOnlineRate < 95,
              'text-red-600':
                detailObj.deviceQuarterOnlineRate > 0 &&
                detailObj.deviceQuarterOnlineRate < 85,
            }"
          >
            {{ detailObj.deviceQuarterOnlineRate || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">坑洼数量环比变化率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-red-600': detailObj.potholeCountMomChangeRate > 0,
              'text-green-600': detailObj.potholeCountMomChangeRate < 0,
            }"
          >
            {{ detailObj.potholeCountMomChangeRate || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">坑洼数量同比变化率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-red-600': detailObj.potholeCountYoYChangeRate > 0,
              'text-green-600': detailObj.potholeCountYoYChangeRate < 0,
            }"
          >
            {{ detailObj.potholeCountYoYChangeRate || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">裂缝长度环比变化率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-red-600': detailObj.crackLengthMomChangeRate > 0,
              'text-green-600': detailObj.crackLengthMomChangeRate < 0,
            }"
          >
            {{ detailObj.crackLengthMomChangeRate || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">裂缝长度同比变化率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-red-600': detailObj.crackLengthYoYChangeRate > 0,
              'text-green-600': detailObj.crackLengthYoYChangeRate < 0,
            }"
          >
            {{ detailObj.crackLengthYoYChangeRate || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">区域设施健康度排名:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.areaFacilityHealthRank <= 3,
              'text-yellow-600':
                detailObj.areaFacilityHealthRank > 3 &&
                detailObj.areaFacilityHealthRank <= 7,
              'text-red-600': detailObj.areaFacilityHealthRank > 7,
            }"
          >
            {{ detailObj.areaFacilityHealthRank || '-' }} 名
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">季度统计时段:</div>
        <div class="detail-row-right">
          {{ detailObj.quarterStatisticsPeriod || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警类型分布占比:</div>
        <div class="detail-row-right">
          <div class="break-words">
            {{ detailObj.warningTypeDistributionRatio || '-' }}
          </div>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 220px; // 小屏适配季度统计超长标签宽度
  }

  .detail-card {
    min-height: 900px;
    max-height: 90vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 950px; // 适配16个季度统计字段，提升最小高度
  max-height: 95vh; // 提高最大高度，充分利用屏幕空间
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0; // 分隔线增强可读性

  // 最后一行去掉分隔线
  &:last-child {
    border-bottom: none;
  }

  // 鼠标悬浮高亮
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

// 左侧标签样式
.detail-row-left {
  flex-shrink: 0; // 不收缩
  width: 240px; // 加宽到240px，适配"区域设施健康度排名"等超长标签
  font-size: 14px;
  font-weight: 500; // 加粗突出标签
  line-height: 18px; // 统一行高
  color: #606266; // 灰色调，区分内容
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133; // 主文本色
  word-break: break-all; // 处理长文本换行
}

// 长文本换行优化
.break-words {
  word-break: break-word;
  white-space: pre-wrap;
}

// 状态颜色样式
.text-green-600 {
  color: #10b981 !important;
}

.text-yellow-600 {
  color: #f59e0b !important;
}

.text-red-600 {
  color: #ef4444 !important;
}

// 滚动条样式优化
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
