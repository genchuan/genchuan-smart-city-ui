<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 地磁设备管理详情数据对象（适配地磁设备字段结构）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const { detailObj } = toRefs(props);

// 计算属性处理标题，优先使用地磁设备编号，兜底显示默认值
const drawerTitle = computed(() => {
  const geomagneticDevice = detailObj.value?.geomagneticDevice || '地磁设备';
  return `${geomagneticDevice}详情`;
});

// 初始化抽屉实例（优化层级配置，避免被覆盖）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
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
  <DetailDrawer :title="drawerTitle" class="geomagnetic-device-detail-drawer">
    <div class="detail-card">
      <!-- 地磁设备管理核心字段展示 -->
      <div class="detail-card-row">
        <div class="detail-row-left">地磁设备:</div>
        <div class="detail-row-right">
          {{ detailObj.geomagneticDevice || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">状态:</div>
        <div class="detail-row-right">{{ detailObj.status || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">绑定泊位:</div>
        <div class="detail-row-right">{{ detailObj.boundBerth || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">参数配置:</div>
        <div class="detail-row-right">{{ detailObj.paramConfig || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">故障告警记录:</div>
        <div class="detail-row-right">
          {{ detailObj.faultAlarmRecord || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">维修工单:</div>
        <div class="detail-row-right">
          {{ detailObj.maintenanceOrder || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">累计工作时长:</div>
        <div class="detail-row-right">
          {{ detailObj.totalWorkingHours || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">上报频次:</div>
        <div class="detail-row-right">
          {{ detailObj.reportingFrequency || '-' }}
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 详情卡片整体样式（适配地磁设备8个字段）
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 360px; // 适配8个字段的高度，提升展示舒适度
  max-height: 70vh; // 限制最大高度，避免溢出
  overflow-y: auto; // 内容过多时滚动
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start; // 顶部对齐，适配参数配置/故障告警等长文本
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0; // 分隔线增强可读性

  // 最后一行去掉分隔线
  &:last-child {
    border-bottom: none;
  }

  // 鼠标悬浮高亮
  &:hover {
    background-color: #f5f7fa;
    border-radius: 4px;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    transition: all 0.2s ease;
  }
}

// 左侧标签样式（固定宽度保证对齐，适配长标签）
.detail-row-left {
  width: 140px; // 适配「故障告警记录」「累计工作时长」等长标签
  flex-shrink: 0; // 不收缩
  font-weight: 500; // 加粗突出标签
  color: #606266; // 灰色调，区分内容
  font-size: 14px;
  line-height: 24px; // 提升行高，优化长文本阅读体验
}

// 右侧内容样式
.detail-row-right {
  flex: 1; // 剩余宽度自适应
  color: #303133; // 主文本色
  font-size: 14px;
  line-height: 24px; // 提升行高
  word-break: break-all; // 处理参数配置等长文本换行
  padding-right: 10px;
  white-space: pre-line; // 保留故障告警记录中的换行符（如有）
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 120px; // 移动端适配长标签宽度
  }
  .detail-card {
    padding: 15px;
    max-height: 60vh;
  }
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
