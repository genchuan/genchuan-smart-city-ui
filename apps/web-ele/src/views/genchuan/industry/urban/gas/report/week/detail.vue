<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（替换为道路监测周度统计数据）
const props = defineProps({
  // 详情数据对象（道路监测周度统计数据）
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
  const roadSectionName = detailObj.value?.roadSectionName || '道路监测周统计';
  return title.value || `${roadSectionName}周统计详情`;
});

// 初始化抽屉实例（加宽适配周度统计更多长字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 1000, // 加宽到1000px适配周统计14个字段+超长标签
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
      <!-- 道路监测周度统计分析信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">路段名称:</div>
        <div class="detail-row-right">
          {{ detailObj.roadSectionName || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">坑洼数量周均值:</div>
        <div class="detail-row-right">
          {{ detailObj.potholeCountWeekAvg || '-' }} 个
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">裂缝长度周均值:</div>
        <div class="detail-row-right">
          {{ detailObj.crackLengthWeekAvg || '-' }} 米
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">周累计预警数:</div>
        <div class="detail-row-right">
          {{ detailObj.weekTotalWarningCount || '-' }} 次
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">周工单处置效率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.weekWorkOrderDisposalEfficiency >= 90,
              'text-yellow-600':
                detailObj.weekWorkOrderDisposalEfficiency >= 80 &&
                detailObj.weekWorkOrderDisposalEfficiency < 90,
              'text-red-600':
                detailObj.weekWorkOrderDisposalEfficiency > 0 &&
                detailObj.weekWorkOrderDisposalEfficiency < 80,
            }"
          >
            {{ detailObj.weekWorkOrderDisposalEfficiency || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">工单超时率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.workOrderTimeoutRate <= 5,
              'text-yellow-600':
                detailObj.workOrderTimeoutRate > 5 &&
                detailObj.workOrderTimeoutRate <= 15,
              'text-red-600': detailObj.workOrderTimeoutRate > 15,
            }"
          >
            {{ detailObj.workOrderTimeoutRate || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备周在线率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.deviceWeekOnlineRate >= 95,
              'text-yellow-600':
                detailObj.deviceWeekOnlineRate >= 85 &&
                detailObj.deviceWeekOnlineRate < 95,
              'text-red-600':
                detailObj.deviceWeekOnlineRate > 0 &&
                detailObj.deviceWeekOnlineRate < 85,
            }"
          >
            {{ detailObj.deviceWeekOnlineRate || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">周达标率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.weekComplianceRate >= 90,
              'text-yellow-600':
                detailObj.weekComplianceRate >= 75 &&
                detailObj.weekComplianceRate < 90,
              'text-red-600':
                detailObj.weekComplianceRate > 0 &&
                detailObj.weekComplianceRate < 75,
            }"
          >
            {{ detailObj.weekComplianceRate || '-' }} %
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
        <div class="detail-row-left">预警类型分布:</div>
        <div class="detail-row-right">
          <div class="break-words">
            {{ detailObj.warningTypeDistribution || '-' }}
          </div>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">周统计时段:</div>
        <div class="detail-row-right">
          {{ detailObj.weekStatisticsPeriod || '-' }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 180px; // 小屏适配周统计超长标签宽度
  }

  .detail-card {
    min-height: 750px;
    max-height: 85vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 800px; // 适配14个周统计字段，提升最小高度
  max-height: 90vh; // 提高最大高度，容纳更多统计内容
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本（预警类型分布）
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
  width: 200px; // 加宽到200px，适配"坑洼数量同比变化率"等超长标签
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
  word-break: break-all; // 处理长文本换行（如预警类型分布）
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
