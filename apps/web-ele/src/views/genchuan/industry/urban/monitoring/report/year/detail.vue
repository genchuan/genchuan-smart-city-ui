<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（窨井盖设施监测年报数据）
const props = defineProps({
  // 详情数据对象（窨井盖设施监测年报数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的areaName）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用区域名称，兜底显示默认值
const drawerTitle = computed(() => {
  const areaName = detailObj.value?.areaName || '窨井盖设施监测年报';
  return title.value || `${areaName}年报详情`;
});

// 初始化抽屉实例（加宽适配年报更多长字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 1400, // 加宽到1400px适配年报字段+超长标签+长文本
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
      <!-- 窨井盖设施监测年报信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">所属区域:</div>
        <div class="detail-row-right">{{ detailObj.areaName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">责任单位:</div>
        <div class="detail-row-right">{{ detailObj.deptName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">年度统计时段:</div>
        <div class="detail-row-right">{{ detailObj.yearStatisticsPeriod || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">窨井盖总数:</div>
        <div class="detail-row-right">{{ detailObj.manholeTotalCount || '-' }} 个</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">年度累计隐患数:</div>
        <div class="detail-row-right">{{ detailObj.yearTotalHiddenTroubleCount || '-' }} 个</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">年度处置完成数:</div>
        <div class="detail-row-right">{{ detailObj.yearDisposalCompleteCount || '-' }} 个</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备年度在线率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.deviceYearOnlineRate >= 95,
              'text-yellow-600':
                detailObj.deviceYearOnlineRate >= 85 &&
                detailObj.deviceYearOnlineRate < 95,
              'text-red-600':
                detailObj.deviceYearOnlineRate > 0 &&
                detailObj.deviceYearOnlineRate < 85,
            }"
          >
            {{ detailObj.deviceYearOnlineRate || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">年度重大隐患数:</div>
        <div class="detail-row-right">{{ detailObj.yearMajorHiddenTroubleCount || '-' }} 个</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">年度隐患处置完成率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.yearHiddenTroubleDisposalRate >= 90,
              'text-yellow-600':
                detailObj.yearHiddenTroubleDisposalRate >= 80 &&
                detailObj.yearHiddenTroubleDisposalRate < 90,
              'text-red-600':
                detailObj.yearHiddenTroubleDisposalRate > 0 &&
                detailObj.yearHiddenTroubleDisposalRate < 80,
            }"
          >
            {{ detailObj.yearHiddenTroubleDisposalRate || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">年度重大隐患处置率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.yearMajorHiddenTroubleDisposalRate >= 95,
              'text-yellow-600':
                detailObj.yearMajorHiddenTroubleDisposalRate >= 85 &&
                detailObj.yearMajorHiddenTroubleDisposalRate < 95,
              'text-red-600':
                detailObj.yearMajorHiddenTroubleDisposalRate > 0 &&
                detailObj.yearMajorHiddenTroubleDisposalRate < 85,
            }"
          >
            {{ detailObj.yearMajorHiddenTroubleDisposalRate || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">同比隐患变化率:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-red-600': detailObj.yoyHiddenTroubleChangeRate > 0,
              'text-green-600': detailObj.yoyHiddenTroubleChangeRate < 0,
            }"
          >
            {{ detailObj.yoyHiddenTroubleChangeRate > 0 ? '+' : '' }}{{ detailObj.yoyHiddenTroubleChangeRate || '-' }} %
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">年度运维综合得分:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.yearOperationComprehensiveScore >= 90,
              'text-yellow-600':
                detailObj.yearOperationComprehensiveScore >= 80 &&
                detailObj.yearOperationComprehensiveScore < 90,
              'text-red-600':
                detailObj.yearOperationComprehensiveScore > 0 &&
                detailObj.yearOperationComprehensiveScore < 80,
            }"
          >
            {{ detailObj.yearOperationComprehensiveScore || '-' }} 分
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">年度重复隐患率:</div>
        <div class="detail-row-right">{{ detailObj.yearRepeatHiddenTroubleRate || '-' }} %</div>
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
