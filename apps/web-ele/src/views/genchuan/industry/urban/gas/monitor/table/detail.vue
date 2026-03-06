<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（桥梁监测数据）
const props = defineProps({
  // 详情数据对象（桥梁监测数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的bridgeName）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用桥梁名称，兜底显示默认值
const drawerTitle = computed(() => {
  const bridgeName = detailObj.value?.bridgeName || '桥梁监测';
  return title.value || `${bridgeName}详情`;
});

// 初始化抽屉实例（加宽适配桥梁监测更多字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 850, // 加宽到850px适配桥梁监测字段（含时间/预警等级）
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
      <!-- 桥梁监测基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">桥梁名称:</div>
        <div class="detail-row-right">
          {{ detailObj.bridgeName || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">监测部位:</div>
        <div class="detail-row-right">
          {{ detailObj.monitorPosition || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">支座位移:</div>
        <div class="detail-row-right">
          {{ detailObj.bearingDisplacement || '-' }} mm
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">振动频率:</div>
        <div class="detail-row-right">
          {{ detailObj.vibrationFrequency || '-' }} Hz
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">应变值:</div>
        <div class="detail-row-right">
          {{ detailObj.strainValue || '-' }} με
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">监测设备编号:</div>
        <div class="detail-row-right">
          {{ detailObj.monitorDeviceCode || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备在线状态:</div>
        <div class="detail-row-right">
          {{ detailObj.deviceOnlineStatus || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">负责养护员:</div>
        <div class="detail-row-right">
          {{ detailObj.maintenancePerson || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">数据采集频率:</div>
        <div class="detail-row-right">
          {{ detailObj.dataCollectionFreq || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">数据同步时长:</div>
        <div class="detail-row-right">
          {{ detailObj.dataSyncDuration || '-' }} 秒
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">监测状态:</div>
        <div class="detail-row-right">{{ detailObj.monitorStatus || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">指标阈值范围:</div>
        <div class="detail-row-right">
          {{ detailObj.indexThresholdRange || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">最近数据更新时间:</div>
        <div class="detail-row-right">
          {{ detailObj.latestDataUpdateTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警等级阈值:</div>
        <div class="detail-row-right">
          <span
            :class="{
              'text-green-600': detailObj.warningLevelThreshold === 'Ⅰ级',
              'text-yellow-600': detailObj.warningLevelThreshold === 'Ⅱ级',
              'text-red-600': detailObj.warningLevelThreshold === 'Ⅲ级',
            }"
          >
            {{ detailObj.warningLevelThreshold || '-' }}
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
    width: 140px; // 小屏适配"预警等级阈值"等长标签
  }

  .detail-card {
    min-height: 600px;
    max-height: 80vh;
    padding: 15px;
  }
}

.detail-card {
  min-height: 650px; // 适配14个桥梁监测字段
  max-height: 85vh; // 提高最大高度，容纳更多内容
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
  width: 160px; // 加宽到160px，适配"预警等级阈值"等超长标签
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
  word-break: break-all; // 处理长文本换行（如指标阈值范围）
}

// 预警等级颜色样式
.text-green-600 {
  color: #10b981 !important; // Ⅰ级（正常）-绿色
}

.text-yellow-600 {
  color: #f59e0b !important; // Ⅱ级（注意）-黄色
}

.text-red-600 {
  color: #ef4444 !important; // Ⅲ级（危险）-红色
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
