<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性
const props = defineProps({
  // 详情数据对象（车辆在停数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用车牌号码）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先使用车牌号码，兜底显示默认值
const drawerTitle = computed(() => {
  const plateNum = detailObj.value?.plateNumber || '车辆在停记录';
  return title.value || `${plateNum}详情`;
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800, // 加宽抽屉适配更多字段
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
      <!-- 车辆在停基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">车牌号码:</div>
        <div class="detail-row-right">{{ detailObj.plateNumber || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属车场:</div>
        <div class="detail-row-right">{{ detailObj.parkName || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">所属车位:</div>
        <div class="detail-row-right">{{ detailObj.parkingSpace || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">入场时间:</div>
        <div class="detail-row-right">{{ detailObj.entryTime || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">在停时长:</div>
        <div class="detail-row-right">
          {{ detailObj.parkingDuration || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">在停状态:</div>
        <div class="detail-row-right">
          <!-- 状态文字加样式区分 -->
          <span :class="`status-tag ${detailObj.parkingStatus}`">
            {{ detailObj.parkingStatus || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">传感器状态:</div>
        <div class="detail-row-right">
          <span :class="`status-tag ${detailObj.sensorStatus}`">
            {{ detailObj.sensorStatus || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">超时长提醒阈值:</div>
        <div class="detail-row-right">
          {{ detailObj.overtimeReminderThreshold || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常标识:</div>
        <div class="detail-row-right">
          <span v-if="detailObj.exceptionFlag !== '无'" class="exception-tag">
            {{ detailObj.exceptionFlag || '-' }}
          </span>
          <span v-else>{{ detailObj.exceptionFlag || '-' }}</span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">处理状态:</div>
        <div class="detail-row-right">
          <span :class="`status-tag ${detailObj.processingStatus}`">
            {{ detailObj.processingStatus || '-' }}
          </span>
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">最后更新时间:</div>
        <div class="detail-row-right">
          {{ detailObj.lastUpdateTime || '-' }}
        </div>
      </div>
      <!-- 扩展字段：关联车场信息（可选） -->
      <div class="detail-card-row">
        <div class="detail-row-left">车场泊位总数:</div>
        <div class="detail-row-right">{{ detailObj.parkTotal || '-' }} 个</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车场收费标准:</div>
        <div class="detail-row-right">{{ detailObj.pricing || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">车场联系电话:</div>
        <div class="detail-row-right">{{ detailObj.phone || '-' }}</div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 详情卡片整体样式
.detail-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-height: 400px;
  max-height: 70vh;
  overflow-y: auto;
}

// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

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

// 左侧标签样式
.detail-row-left {
  width: 140px;
  flex-shrink: 0;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  line-height: 18px;
}

// 右侧内容样式
.detail-row-right {
  flex: 1;
  color: #303133;
  font-size: 14px;
  line-height: 18px;
  word-break: break-all;
  padding-right: 10px;
}

// 状态标签样式
.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;

  // 不同状态的颜色区分
  &.正常在停 {
    background-color: #e8f4f8;
    color: #409eff;
  }
  &.即将超时 {
    background-color: #fdf2e9;
    color: #e6a23c;
  }
  &.已超时,
  &.异常停留 {
    background-color: #fef0f0;
    color: #f56c6c;
  }
  &.正常 {
    background-color: #f0f9ff;
    color: #52c41a;
  }
  &.离线,
  &.信号弱 {
    background-color: #f9f0ff;
    color: #9254de;
  }
  &.故障 {
    background-color: #fff1f0;
    color: #ff4d4f;
  }
  &.未处理 {
    background-color: #fff7e6;
    color: #fa8c16;
  }
  &.处理中 {
    background-color: #e6f7ff;
    color: #1890ff;
  }
  &.已处理 {
    background-color: #f6ffed;
    color: #52c41a;
  }
  &.无需处理 {
    background-color: #f5f5f5;
    color: #8c8c8c;
  }
}

// 异常标识标签
.exception-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #fff1f0;
  color: #ff4d4f;
}

// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 120px;
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
