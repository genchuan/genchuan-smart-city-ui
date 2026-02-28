<script setup>
import { computed, defineProps, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

// 定义组件接收的属性（道路监测管理数据）
const props = defineProps({
  // 详情数据对象（道路监测管理数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的roadName）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 格式化数值显示（保留2位小数）
const formatNumber = (value, precision = 0) => {
  if (value === undefined || value === null || value === '-') return '-';
  return Number(value).toFixed(precision);
};

// 格式化是否预警显示
const formatIsWarning = (value) => {
  if (value === undefined || value === null || value === '-') return '-';
  return value === '1' || value === 1 ? '是' : '否';
};

// 计算属性处理标题，优先用路段名称，兜底显示道路监测管理
const drawerTitle = computed(() => {
  const roadName = detailObj.value?.roadName || '道路监测管理';
  return title.value || `${roadName}详情`;
});

// 初始化抽屉实例（加宽适配更多道路监测管理字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 1000, // 加宽到1000px适配所有字段展示
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
      <!-- 基础信息区域 -->
      <div class="detail-section">
        <div class="section-title">基础信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">监测编码:</div>
          <div class="detail-row-right">{{ detailObj.monitorCode || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">道路ID:</div>
          <div class="detail-row-right">{{ detailObj.roadId || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">设备ID:</div>
          <div class="detail-row-right">{{ detailObj.deviceId || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">配置ID:</div>
          <div class="detail-row-right">{{ detailObj.configId || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">路段名称:</div>
          <div class="detail-row-right">{{ detailObj.roadName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">设备编码:</div>
          <div class="detail-row-right">{{ detailObj.deviceCode || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">设备在线状态:</div>
          <div class="detail-row-right">
            <span
              :class="{
                'text-green-600': detailObj.deviceOnlineStatus === '在线',
                'text-red-600': detailObj.deviceOnlineStatus === '离线',
                'text-yellow-600': detailObj.deviceOnlineStatus === '异常',
              }"
            >
              {{ detailObj.deviceOnlineStatus || '-' }}
            </span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">监测状态:</div>
          <div class="detail-row-right">
            <span
              :class="{
                'text-green-600': detailObj.monitorStatus === '运行中',
                'text-red-600': detailObj.monitorStatus === '已停止',
              }"
            >
              {{ detailObj.monitorStatus || '-' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 监测数据区域 -->
      <div class="detail-section">
        <div class="section-title">监测数据</div>
        <div class="detail-card-row">
          <div class="detail-row-left">坑洼数量:</div>
          <div class="detail-row-right">
            {{ detailObj.potholeNum || '-' }} 个
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">裂缝长度:</div>
          <div class="detail-row-right">
            {{ formatNumber(detailObj.crackLength, 2) }} 米
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">路面温度:</div>
          <div class="detail-row-right">
            {{ formatNumber(detailObj.roadTemp, 1) }} ℃
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">交通流量:</div>
          <div class="detail-row-right">
            {{ detailObj.trafficFlow || '-' }} 辆/小时
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">采集频率快照:</div>
          <div class="detail-row-right">
            {{ detailObj.collectFrequencySnapshot || '-' }} 分钟
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">是否预警:</div>
          <div class="detail-row-right">
            <span
              :class="{
                'text-red-600': formatIsWarning(detailObj.isWarning) === '是',
                'text-gray-600': formatIsWarning(detailObj.isWarning) === '否',
              }"
            >
              {{ formatIsWarning(detailObj.isWarning) }}
            </span>
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预警ID:</div>
          <div class="detail-row-right">{{ detailObj.warningId || '-' }}</div>
        </div>
      </div>

      <!-- 阈值配置区域 -->
      <div class="detail-section">
        <div class="section-title">阈值配置</div>
        <div class="detail-card-row">
          <div class="detail-row-left">指标阈值范围:</div>
          <div class="detail-row-right break-words">
            {{ detailObj.indicatorThresholdRange || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">坑洼数量阈值:</div>
          <div class="detail-row-right">
            {{ detailObj.potholeNumThreshold || '-' }} 个
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">裂缝长度阈值:</div>
          <div class="detail-row-right">
            {{ formatNumber(detailObj.crackLengthThreshold, 2) }} 米
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">路面温度阈值:</div>
          <div class="detail-row-right">
            {{ formatNumber(detailObj.roadTempThreshold, 1) }} ℃
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">交通流量阈值:</div>
          <div class="detail-row-right">
            {{ detailObj.trafficFlowThreshold || '-' }} 辆/小时
          </div>
        </div>
      </div>

      <!-- 运维信息区域 -->
      <div class="detail-section">
        <div class="section-title">运维信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">运维员ID:</div>
          <div class="detail-row-right">{{ detailObj.staffId || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">运维员姓名:</div>
          <div class="detail-row-right">{{ detailObj.staffName || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">数据同步时长:</div>
          <div class="detail-row-right">
            {{ detailObj.syncDuration || '-' }} 秒
          </div>
        </div>
      </div>

      <!-- 时间信息区域 -->
      <div class="detail-section">
        <div class="section-title">时间信息</div>
        <div class="detail-card-row">
          <div class="detail-row-left">记录时间:</div>
          <div class="detail-row-right">{{ detailObj.recordTime || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">创建时间:</div>
          <div class="detail-row-right">{{ detailObj.createTime || '-' }}</div>
        </div>
      </div>

      <!-- 扩展字段区域 -->
      <div class="detail-section">
        <div class="section-title">扩展字段</div>
        <div class="detail-card-row">
          <div class="detail-row-left">通用扩展字段1:</div>
          <div class="detail-row-right">{{ detailObj.extCommon1 || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">通用扩展字段2:</div>
          <div class="detail-row-right">{{ detailObj.extCommon2 || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">通用扩展字段3:</div>
          <div class="detail-row-right">{{ detailObj.extCommon3 || '-' }}</div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">通用扩展字段4:</div>
          <div class="detail-row-right">{{ detailObj.extCommon4 || '-' }}</div>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .dpaddrng-le0t {
    font-size: 1406x; // 小屏适配长标签
  }

  .detail-card {
    min-height: 800px;
    max-height: 80vh;
    padding: 15px;
  }

  .section-title {
    padding: 10px 0;
    font-size: 16px;
  }
}

// 详情卡片整体样式
.detail-card {
  min-height: 900px; // 适配所有字段展示
  max-height: 90vh;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9fafb;
  border-radius: 8px;
}
// 分区标题样式
.detail-section {
}

.section-title {
  padding: 15px 0;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}
// 每行的布局
.detail-card-row {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;

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
  flex-shrink: 0;
  width: 160px; // 加宽适配长标签
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: #606266;
}

// 右侧内容样式
.detail-row-right {
  flex: 1;
  padding-right: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #303133;
  word-break: break-all;
}

// 长文本换行
.break-words {
  word-break: break-word;
  white-space: pre-wrap;
}

// 状态颜色样式
.text-green-600 {
  color: #10b981 !important; // 正常状态
}

.text-red-600 {
  color: #ef4444 !important; // 异常/预警状态
}

.text-yellow-600 {
  color: #f59e0b !important; // 警告状态
}

.text-gray-600 {
  color: #6b7280 !important; // 中性状态
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
