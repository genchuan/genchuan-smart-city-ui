<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（替换为道路预警工单处置数据）
const props = defineProps({
  // 详情数据对象（道路预警工单处置数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的workOrderCode）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用工单编号，兜底显示默认值
const drawerTitle = computed(() => {
  const workOrderCode = detailObj.value?.workOrderCode || '道路预警工单';
  return title.value || `${workOrderCode}详情`;
});

// 初始化抽屉实例（加宽适配工单处置字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900, // 加宽到900px适配工单处置更多字段
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
      <!-- 道路预警工单处置基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">工单编号:</div>
        <div class="detail-row-right">{{ detailObj.workOrderCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联预警编号:</div>
        <div class="detail-row-right">
          {{ detailObj.relatedWarningCode || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置路段:</div>
        <div class="detail-row-right">
          {{ detailObj.disposalRoadSection || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置类型:</div>
        <div class="detail-row-right">{{ detailObj.disposalType || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">指派运维员:</div>
        <div class="detail-row-right">
          {{ detailObj.assignedMaintenancePerson || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">工单创建时间:</div>
        <div class="detail-row-right">
          {{ detailObj.workOrderCreateTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置时限:</div>
        <div class="detail-row-right">
          {{ detailObj.disposalTimeLimit || '-' }} 小时
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">当前处置进度:</div>
        <div class="detail-row-right">
          {{ detailObj.currentDisposalProgress || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">抵达现场时间:</div>
        <div class="detail-row-right">
          {{ detailObj.arriveSceneTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">剩余处置时间:</div>
        <div class="detail-row-right">
          {{ detailObj.remainingDisposalTime || '-' }} 小时
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处置进度更新时间:</div>
        <div class="detail-row-right">
          {{ detailObj.disposalProgressUpdateTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">已完成处置内容:</div>
        <div class="detail-row-right">
          {{ detailObj.completedDisposalContent || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">现场检测数据:</div>
        <div class="detail-row-right">
          {{ detailObj.sceneDetectionData || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">超时提醒标识:</div>
        <div class="detail-row-right">
          {{ detailObj.timeoutReminderFlag || '-' }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 130px; // 小屏适配工单字段标签宽度
  }

  .detail-card {
    min-height: 520px;
    max-height: 70vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 600px; // 适配工单处置14个字段，提升最小高度
  max-height: 85vh; // 提高最大高度，容纳更多工单字段
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本（处置内容/检测数据）
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
  width: 150px; // 加宽标签宽度，适配"处置进度更新时间"等长标签
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
  word-break: break-all; // 处理长文本换行（如现场检测数据、处置内容）
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
