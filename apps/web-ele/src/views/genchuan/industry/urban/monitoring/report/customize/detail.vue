<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（窨井盖设施监测自定义报表数据）
const props = defineProps({
  // 详情数据对象（窨井盖设施监测自定义报表数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的reportName）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用报表名称，兜底显示默认值
const drawerTitle = computed(() => {
  const reportName = detailObj.value?.reportName || '自定义报表';
  return title.value || `${reportName}详情`;
});

// 初始化抽屉实例（加宽适配自定义报表更多长字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 1000, // 加宽到1000px适配报表详情等信息
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
      <!-- 窨井盖设施监测自定义报表信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">统计维度名称:</div>
        <div class="detail-row-right">{{ detailObj.dimensionName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">统计维度值:</div>
        <div class="detail-row-right">{{ detailObj.dimensionValue || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核心指标1统计值:</div>
        <div class="detail-row-right">{{ detailObj.coreIndex1 || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核心指标2统计值:</div>
        <div class="detail-row-right">{{ detailObj.coreIndex2 || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核心指标3统计值:</div>
        <div class="detail-row-right">{{ detailObj.coreIndex3 || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">统计时段:</div>
        <div class="detail-row-right">{{ detailObj.statisticsTimeRange || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">报表名称:</div>
        <div class="detail-row-right">{{ detailObj.reportName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">指标对比差值:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-red-600': detailObj.indexComparisonDifference >= 0,
              'text-green-600': detailObj.indexComparisonDifference < 0,
            }"
          >
            {{ detailObj.indexComparisonDifference > 0 ? '+' : '' }}{{ detailObj.indexComparisonDifference || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">指标对比变化率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-red-600': detailObj.indexComparisonChangeRate >= 0,
              'text-green-600': detailObj.indexComparisonChangeRate < 0,
            }"
          >
            {{ detailObj.indexComparisonChangeRate > 0 ? '+' : '' }}{{ detailObj.indexComparisonChangeRate || '-' }}%
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">报表生成时间:</div>
        <div class="detail-row-right">{{ detailObj.reportGenerateTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">报表状态:</div>
        <div class="detail-row-right">{{ detailObj.reportStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">数据更新时间:</div>
        <div class="detail-row-right">{{ detailObj.dataUpdateTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核心指标1名称:</div>
        <div class="detail-row-right">{{ '井盖总数' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核心指标2名称:</div>
        <div class="detail-row-right">{{ '隐患数' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核心指标3名称:</div>
        <div class="detail-row-right">{{ '处置数' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置完成率:</div>
        <div class="detail-row-right">{{ detailObj.coreIndex3 && detailObj.coreIndex2 ? ((detailObj.coreIndex3 / detailObj.coreIndex2) * 100).toFixed(2) + '%' : '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 130px; // 小屏适配"指标变化趋势"等长标签
  }

  .detail-card {
    min-height: 700px;
    max-height: 80vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 750px; // 适配16个出入口管理字段
  max-height: 90vh; // 提高最大高度，容纳更多内容
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本（指标变化趋势）
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
  width: 150px; // 加宽到150px，适配"指标变化趋势"等超长标签
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
  word-break: break-all; // 处理长文本换行（如指标变化趋势）
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
