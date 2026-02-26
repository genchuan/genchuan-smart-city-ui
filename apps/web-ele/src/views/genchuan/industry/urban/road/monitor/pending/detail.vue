<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（替换为道路预警数据）
const props = defineProps({
  // 详情数据对象（道路预警数据）
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
  const warningCode = detailObj.value?.warningCode || '道路预警';
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
      <!-- 道路预警基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">预警编号:</div>
        <div class="detail-row-right">{{ detailObj.warningCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警路段:</div>
        <div class="detail-row-right">
          {{ detailObj.warningRoadSection || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">超标指标:</div>
        <div class="detail-row-right">
          {{ detailObj.overStandardIndex || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">超标数值:</div>
        <div class="detail-row-right">
          {{ detailObj.overStandardValue || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">阈值标准:</div>
        <div class="detail-row-right">
          {{ detailObj.thresholdStandard || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警触发时间:</div>
        <div class="detail-row-right">
          {{ detailObj.warningTriggerTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警状态:</div>
        <div class="detail-row-right">{{ detailObj.warningStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">监测设备编号:</div>
        <div class="detail-row-right">
          {{ detailObj.monitorDeviceCode || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警处置时限:</div>
        <div class="detail-row-right">
          {{ detailObj.warningDisposalTimeLimit || '-' }} 小时
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">剩余处置时间:</div>
        <div class="detail-row-right">
          {{ detailObj.remainingDisposalTime || '-' }} 小时
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联监测数据:</div>
        <div class="detail-row-right">
          {{ detailObj.relatedMonitorData || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">派单状态:</div>
        <div class="detail-row-right">
          {{ detailObj.dispatchStatus || '-' }}
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
