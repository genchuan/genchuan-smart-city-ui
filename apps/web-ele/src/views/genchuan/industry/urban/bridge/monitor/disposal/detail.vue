<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（桥梁养护工单数据）
const props = defineProps({
  // 详情数据对象（桥梁养护工单数据）
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

// 计算属性处理标题，优先用工单编号，兜底显示桥梁养护工单
const drawerTitle = computed(() => {
  const workOrderCode = detailObj.value?.workOrderCode || '桥梁养护工单';
  return title.value || `${workOrderCode}详情`;
});

// 初始化抽屉实例（加宽适配桥梁养护工单更多字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 950, // 加宽到950px适配桥梁养护工单新增字段
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
      <!-- 桥梁养护工单基础信息 -->
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
        <div class="detail-row-left">养护桥梁:</div>
        <div class="detail-row-right">
          {{ detailObj.maintenanceBridge || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">监测部位:</div>
        <div class="detail-row-right">
          {{ detailObj.monitorPosition || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">养护类型:</div>
        <div class="detail-row-right">
          {{ detailObj.maintenanceType || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">指派养护员:</div>
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
        <div class="detail-row-left">当前养护进度:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-blue-600': ['未开始', '前往现场'].includes(
                detailObj.currentMaintenanceProgress,
              ),
              'text-yellow-600': ['现场检测', '处置中', '待验收'].includes(
                detailObj.currentMaintenanceProgress,
              ),
              'text-green-600':
                detailObj.currentMaintenanceProgress === '已完成',
              'text-red-600': detailObj.currentMaintenanceProgress === '已驳回',
            }"
          >
            {{ detailObj.currentMaintenanceProgress || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">剩余处置时间:</div>
        <div class="detail-row-right">
          {{ detailObj.remainingDisposalTime || '-' }} 小时
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">养护进度更新时间:</div>
        <div class="detail-row-right">
          {{ detailObj.maintenanceProgressUpdateTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">已完成养护内容:</div>
        <div class="detail-row-right">
          {{ detailObj.completedMaintenanceContent || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">现场检测数据:</div>
        <div class="detail-row-right">
          {{ detailObj.sceneDetectionData || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">养护材料使用量:</div>
        <div class="detail-row-right">
          {{ detailObj.maintenanceMaterialUsage || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">超时提醒标识:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.timeoutReminderFlag === '未超时',
              'text-yellow-600': detailObj.timeoutReminderFlag === '即将超时',
              'text-red-600': detailObj.timeoutReminderFlag === '已超时',
            }"
          >
            {{ detailObj.timeoutReminderFlag || '-' }}
          </span>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 160px; // 小屏适配"养护材料使用量"等长标签
  }

  .detail-card {
    min-height: 700px;
    max-height: 85vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 750px; // 适配15个桥梁养护工单字段
  max-height: 90vh; // 提高最大高度，容纳更多桥梁养护工单字段
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本（养护内容/检测数据）
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
  width: 180px; // 加宽到180px，适配"养护材料使用量""养护进度更新时间"等超长标签
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
  word-break: break-all; // 处理长文本换行（如养护内容、检测数据、材料使用量）
}

// 状态颜色样式
.text-blue-600 {
  color: #3b82f6 !important; // 未开始/前往现场 - 蓝色
}

.text-yellow-600 {
  color: #f59e0b !important; // 检测中/处置中/待验收 - 黄色
}

.text-green-600 {
  color: #10b981 !important; // 已完成/未超时 - 绿色
}

.text-red-600 {
  color: #ef4444 !important; // 已驳回/已超时 - 红色
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

.detail-
card::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}
</style>
