<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（桥梁养护归档数据）
const props = defineProps({
  // 详情数据对象（桥梁养护归档数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的archiveCode）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用归档编号，兜底显示桥梁养护归档
const drawerTitle = computed(() => {
  const archiveCode = detailObj.value?.archiveCode || '桥梁养护归档';
  return title.value || `${archiveCode}详情`;
});

// 初始化抽屉实例（加宽适配桥梁养护归档更多字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 1000, // 加宽到1000px适配16个桥梁养护归档字段
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
      <!-- 桥梁养护归档详情信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">归档编号:</div>
        <div class="detail-row-right">{{ detailObj.archiveCode || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">关联工单编号:</div>
        <div class="detail-row-right">
          {{ detailObj.relatedWorkOrderCode || '-' }}
        </div>
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
          <span
            :class="{
              'text-blue-600': ['支座更换', '支座调平'].includes(
                detailObj.maintenanceType,
              ),
              'text-purple-600': ['振动检测与加固', '应变检测与修复'].includes(
                detailObj.maintenanceType,
              ),
              'text-gray-600': ['设备维修', '现场巡检'].includes(
                detailObj.maintenanceType,
              ),
            }"
          >
            {{ detailObj.maintenanceType || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">指派养护员:</div>
        <div class="detail-row-right">
          {{ detailObj.assignedMaintenancePerson || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核查结果:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.verificationResult === '合格',
              'text-red-600': detailObj.verificationResult === '不合格',
            }"
          >
            {{ detailObj.verificationResult || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">工单完成时间:</div>
        <div class="detail-row-right">
          {{ detailObj.workOrderCompleteTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">归档时间:</div>
        <div class="detail-row-right">
          {{ detailObj.archiveTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警养护总时长:</div>
        <div class="detail-row-right">
          {{ detailObj.warningMaintenanceTotalTime || '-' }} 小时
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">指标恢复值:</div>
        <div class="detail-row-right">
          {{ detailObj.indexRecoveryValue || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">核查员:</div>
        <div class="detail-row-right">
          {{ detailObj.verificationPerson || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">养护前后指标对比:</div>
        <div class="detail-row-right">
          {{ detailObj.indexComparisonBeforeAfter || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">养护材料总使用量:</div>
        <div class="detail-row-right">
          {{ detailObj.maintenanceMaterialTotalUsage || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">归档文件数:</div>
        <div class="detail-row-right">
          {{ detailObj.archiveFileCount || '-' }} 个
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 180px; // 小屏适配"养护材料总使用量"等长标签
  }

  .detail-card {
    min-height: 800px;
    max-height: 85vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 850px; // 适配16个桥梁养护归档字段
  max-height: 90vh; // 提高最大高度，容纳更多桥梁养护归档字段
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配多行文本（养护对比/材料使用量）
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
  width: 200px; // 加宽到200px，适配"养护材料总使用量""养护前后指标对比"等超长标签
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
  word-break: break-all; // 处理长文本换行（如养护对比、材料使用量）
}

// 状态颜色样式
.text-green-600 {
  color: #10b981 !important; // 合格 - 绿色
}

.text-red-600 {
  color: #ef4444 !important; // 不合格 - 红色
}

.text-blue-600 {
  color: #3b82f6 !important; // 支座类养护 - 蓝色
}

.text-purple-600 {
  color: #8b5cf6 !important; // 检测加固类养护 - 紫色
}

.text-gray-600 {
  color: #6b7280 !important; // 常规养护 - 灰色
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
