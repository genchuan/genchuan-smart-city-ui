<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（替换为广告数据）
const props = defineProps({
  // 详情数据对象（广告数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的warningCode）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用预警编号，兜底显示默认值
const drawerTitle = computed(() => {
  const warningCode = detailObj.value?.warningCode || '广告';
  return title.value || `${warningCode}详情`;
});

// 初始化抽屉实例（加宽适配预警字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 850, // 加宽到850px适配预警更多字段
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
      <!-- 广告基础信息 -->
      <!-- 统计半年 -->
      <div class="detail-card-row">
        <div class="detail-row-left">统计半年:</div>
        <div class="detail-row-right">
          {{ detailObj.statsHalfYear || '-' }}
        </div>
      </div>

      <!-- 半年清运总量 -->
      <div class="detail-card-row">
        <div class="detail-row-left">半年清运总量:</div>
        <div class="detail-row-right">
          {{ detailObj.halfYearClearTotal ? detailObj.halfYearClearTotal + ' 吨' : '-' }}
        </div>
      </div>

      <!-- 半年违规处置总量 -->
      <div class="detail-card-row">
        <div class="detail-row-left">半年违规处置总量:</div>
        <div class="detail-row-right">
          {{ detailObj.halfYearViolationTotal ? detailObj.halfYearViolationTotal + ' 次' : '-' }}
        </div>
      </div>

      <!-- 半年跨区域清运案件数 -->
      <div class="detail-card-row">
        <div class="detail-row-left">半年跨区域清运案件数:</div>
        <div class="detail-row-right">
          {{ detailObj.halfYearCrossRegionCases ? detailObj.halfYearCrossRegionCases + ' 件' : '-' }}
        </div>
      </div>

      <!-- 半年清运企业奖惩数量 -->
      <div class="detail-card-row">
        <div class="detail-row-left">半年清运企业奖惩数量:</div>
        <div class="detail-row-right">
          {{ detailObj.halfYearRewardPunishCount ? detailObj.halfYearRewardPunishCount + ' 次' : '-' }}
        </div>
      </div>

      <!-- 半年卡点设备完好率 -->
      <div class="detail-card-row">
        <div class="detail-row-left">半年卡点设备完好率:</div>
        <div class="detail-row-right">
          {{ detailObj.halfYearDeviceOnlineRate ? detailObj.halfYearDeviceOnlineRate + '%' : '-' }}
        </div>
      </div>

      <!-- 同比增长率 -->
      <div class="detail-card-row">
        <div class="detail-row-left">同比增长率:</div>
        <div class="detail-row-right">
          {{ detailObj.yearOverYearGrowthRate ? detailObj.yearOverYearGrowthRate + '%' : '-' }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 120px; // 小屏适配预警字段标签宽度
  }

  .detail-card {
    min-height: 480px;
    max-height: 65vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 550px; // 适配预警字段数量，提升最小高度
  max-height: 80vh; // 提高最大高度，容纳更多预警字段
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本
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
  width: 140px; // 加宽标签宽度，适配"预警处置时限"等长标签
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
  word-break: break-all; // 处理长文本换行（如关联监测数据）
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
