<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（道路监测统计分析数据）
const props = defineProps({
  // 详情数据对象（道路监测统计分析数据）
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

// 计算属性处理标题，优先用路段名称，兜底显示道路监测统计分析
const drawerTitle = computed(() => {
  const roadSectionName =
    detailObj.value?.roadSectionName || '道路监测统计分析';
  return title.value || `${roadSectionName}详情`;
});

// 格式化数值显示（保留1位小数）
const formatNumber = (value) => {
  if (value === undefined || value === null || value === '-') return '-';
  return Number(value).toFixed(1);
};

// 格式化百分比显示
const formatPercent = (value) => {
  if (value === undefined || value === null || value === '-') return '-';
  return `${Number(value).toFixed(1)}%`;
};

// 格式化环比变化率（显示正负号）
const formatChangeRate = (value) => {
  if (value === undefined || value === null || value === '-') return '-';
  const num = Number(value);
  return num > 0 ? `+${num.toFixed(1)}%` : `${num.toFixed(1)}%`;
};

// 初始化抽屉实例（加宽适配道路监测更多字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 1000, // 加宽到1000px适配17个道路监测字段
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
      <!-- 道路监测统计分析基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">路段名称:</div>
        <div class="detail-row-right">
          {{ detailObj.roadSectionName || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">坑洼数量均值:</div>
        <div class="detail-row-right">
          {{ formatNumber(detailObj.potholeCountAvg) }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">裂缝长度均值:</div>
        <div class="detail-row-right">
          {{ formatNumber(detailObj.crackLengthAvg) }} 米
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">路面温度范围:</div>
        <div class="detail-row-right">
          {{ detailObj.roadSurfaceTempRange || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">交通流量峰值:</div>
        <div class="detail-row-right">
          {{ detailObj.trafficFlowPeak || '-' }} 辆/小时
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">交通流量谷值:</div>
        <div class="detail-row-right">
          {{ detailObj.trafficFlowValley || '-' }} 辆/小时
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警触发次数:</div>
        <div class="detail-row-right">
          {{ detailObj.warningTriggerCount || '-' }} 次
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">工单创建数:</div>
        <div class="detail-row-right">
          {{ detailObj.workOrderCreateCount || '-' }} 个
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置完成数:</div>
        <div class="detail-row-right">
          {{ detailObj.disposalCompleteCount || '-' }} 个
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核查通过率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.verificationPassRate >= 90,
              'text-yellow-600':
                detailObj.verificationPassRate >= 70 &&
                detailObj.verificationPassRate < 90,
              'text-red-600': detailObj.verificationPassRate < 70,
            }"
          >
            {{ formatPercent(detailObj.verificationPassRate) }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备在线率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.deviceOnlineRate >= 95,
              'text-yellow-600':
                detailObj.deviceOnlineRate >= 85 &&
                detailObj.deviceOnlineRate < 95,
              'text-red-600': detailObj.deviceOnlineRate < 85,
            }"
          >
            {{ formatPercent(detailObj.deviceOnlineRate) }}
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
              'text-gray-600': detailObj.potholeCountMomChangeRate === 0,
            }"
          >
            {{ formatChangeRate(detailObj.potholeCountMomChangeRate) }}
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
              'text-gray-600': detailObj.crackLengthMomChangeRate === 0,
            }"
          >
            {{ formatChangeRate(detailObj.crackLengthMomChangeRate) }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">平均处置时长:</div>
        <div class="detail-row-right">
          {{ formatNumber(detailObj.avgDisposalDuration) }} 小时
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">正常监测路段数:</div>
        <div class="detail-row-right">
          {{ detailObj.normalMonitorRoadCount || '-' }} 个
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">超标指标分布:</div>
        <div class="detail-row-right">
          <div class="break-words">
            {{ detailObj.indexOverStandardDistribution || '-' }}
          </div>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">数据统计时段:</div>
        <div class="detail-row-right">
          {{ detailObj.dataStatisticsPeriod || '-' }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 180px; // 小屏适配"坑洼数量环比变化率"等长标签
  }

  .detail-card {
    min-height: 800px;
    max-height: 85vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 850px; // 适配16个道路监测统计分析字段
  max-height: 90vh; // 提高最大高度，容纳更多内容
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本（超标指标分布）
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
  width: 200px; // 加宽到200px，适配"坑洼数量环比变化率"等超长标签
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
  word-break: break-all; // 处理长文本换行（如超标指标分布）
}

// 状态颜色样式
.text-green-600 {
  color: #10b981 !important; // 优秀/下降 - 绿色
}

.text-yellow-600 {
  color: #f59e0b !important; // 中等 - 黄色
}

.text-red-600 {
  color: #ef4444 !important; // 差/上升 - 红色
}

.text-gray-600 {
  color: #6b7280 !important; // 无变化 - 灰色
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
