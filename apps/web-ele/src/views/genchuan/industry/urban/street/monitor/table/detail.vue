<script setup>
import { computed, defineProps, toRefs, ref, onMounted, onUnmounted, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import * as echarts from 'echarts';

// 定义组件接收的属性（路灯监测数据）
const props = defineProps({
  // 详情数据对象（路灯监测数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的lightNo）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用路灯编号，兜底显示默认值
const drawerTitle = computed(() => {
  const lightNo = detailObj.value?.lightNo || '路灯监测';
  return title.value || `${lightNo}详情`;
});

// 图表引用
const brightnessChartRef = ref(null);
const currentChartRef = ref(null);
let brightnessChart = null;
let currentChart = null;

// 生成近24小时数据
const generateLast24HoursData = () => {
  const labels = [];
  const brightnessData = [];
  const currentData = [];
  
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    labels.push(`${time.getHours()}:00`);
    
    // 生成模拟数据
    const baseBrightness = detailObj.value?.lightBrightness || 85;
    const baseCurrent = detailObj.value?.workingCurrent || 0.8;
    
    brightnessData.push(baseBrightness + (Math.random() * 10 - 5));
    currentData.push(baseCurrent + (Math.random() * 0.2 - 0.1));
  }
  
  return { labels, brightnessData, currentData };
};

// 初始化图表
const initCharts = () => {
  const { labels, brightnessData, currentData } = generateLast24HoursData();
  
  // 销毁现有图表
  if (brightnessChart) {
    brightnessChart.dispose();
  }
  if (currentChart) {
    currentChart.dispose();
  }
  
  // 初始化亮度图表
  if (brightnessChartRef.value) {
    brightnessChart = echarts.init(brightnessChartRef.value);
    brightnessChart.setOption({
      title: {
        text: '近24小时亮度变化',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['路灯亮度 (cd)'],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: labels
      },
      yAxis: {
        type: 'value',
        min: 0
      },
      series: [
        {
          name: '路灯亮度 (cd)',
          type: 'line',
          stack: 'Total',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.5)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
            ])
          },
          lineStyle: {
            color: '#3b82f6'
          },
          emphasis: {
            focus: 'series'
          },
          data: brightnessData
        }
      ]
    });
  }
  
  // 初始化电流图表
  if (currentChartRef.value) {
    currentChart = echarts.init(currentChartRef.value);
    currentChart.setOption({
      title: {
        text: '近24小时电流变化',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['工作电流 (A)'],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: labels
      },
      yAxis: {
        type: 'value',
        min: 0
      },
      series: [
        {
          name: '工作电流 (A)',
          type: 'line',
          stack: 'Total',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(16, 185, 129, 0.5)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.1)' }
            ])
          },
          lineStyle: {
            color: '#10b981'
          },
          emphasis: {
            focus: 'series'
          },
          data: currentData
        }
      ]
    });
  }
};

// 监听窗口大小变化
const handleResize = () => {
  if (brightnessChart) {
    brightnessChart.resize();
  }
  if (currentChart) {
    currentChart.resize();
  }
};

// 组件挂载时添加 resize 事件监听
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

// 组件卸载时移除 resize 事件监听
const cleanup = () => {
  window.removeEventListener('resize', handleResize);
  if (brightnessChart) {
    brightnessChart.dispose();
  }
  if (currentChart) {
    currentChart.dispose();
  }
};

// 注册组件卸载钩子
onUnmounted(cleanup);

// 设备关联信息
const deviceInfo = computed(() => {
  return {
    deviceModel: 'LT-Monitor-2024',
    installationDate: '2024-01-15',
    lastMaintenance: '2024-06-01',
    firmwareVersion: 'v1.2.3',
    communicationProtocol: 'LoRaWAN',
    batteryLevel: '95%',
    signalStrength: 'Strong'
  };
});

// 历史预警记录
const warningHistory = ref([
  {
    id: 1,
    warningTime: '2024-06-10 18:30:00',
    warningType: '亮度异常',
    warningValue: '120 cd',
    threshold: '0-100 cd',
    status: '已处理',
    handler: '陈铭'
  },
  {
    id: 2,
    warningTime: '2024-06-05 08:15:00',
    warningType: '电流异常',
    warningValue: '2.5 A',
    threshold: '0-2 A',
    status: '已处理',
    handler: '林晓婷'
  },
  {
    id: 3,
    warningTime: '2024-05-28 22:45:00',
    warningType: '设备离线',
    warningValue: '离线',
    threshold: '在线',
    status: '已处理',
    handler: '陈铭'
  }
]);

// 初始化抽屉实例（加宽适配道路监测更多字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 900, // 加宽到900px适配更多内容
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 延迟初始化图表，确保DOM已渲染
      setTimeout(() => {
        initCharts();
      }, 100);
    }
  },
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
      <!-- 路灯监测基础信息 -->
      <div class="detail-section">
        <h3 class="section-title">基础信息</h3>
        <div class="detail-card-row">
          <div class="detail-row-left">路灯编号:</div>
          <div class="detail-row-right">
            {{ detailObj.lightNo || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">路段名称:</div>
          <div class="detail-row-right">
            {{ detailObj.roadName || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">开关状态:</div>
          <div class="detail-row-right">
            {{ detailObj.switchStatus || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">路灯亮度:</div>
          <div class="detail-row-right">
            {{ detailObj.lightBrightness || '-' }} cd
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">工作电流:</div>
          <div class="detail-row-right">
            {{ detailObj.workingCurrent || '-' }} A
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">监测设备编号:</div>
          <div class="detail-row-right">
            {{ detailObj.deviceCode || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">设备在线状态:</div>
          <div class="detail-row-right">
            {{ detailObj.deviceStatus || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">负责维修员:</div>
          <div class="detail-row-right">
            {{ detailObj.staffName || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">数据采集频率:</div>
          <div class="detail-row-right">
            {{ detailObj.collectFrequency || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">监测状态:</div>
          <div class="detail-row-right">
            {{ detailObj.monitorStatus || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">指标阈值范围:</div>
          <div class="detail-row-right">
            {{ detailObj.thresholdRange || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">数据同步时长:</div>
          <div class="detail-row-right">
            {{ detailObj.syncDuration || '-' }} 秒
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">最近更新时间:</div>
          <div class="detail-row-right">
            {{ detailObj.updateTime || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">控制状态:</div>
          <div class="detail-row-right">
            {{ detailObj.controlStatus || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">预警触发标识:</div>
          <div class="detail-row-right">
            {{ detailObj.warnStatusId || '-' }}
          </div>
        </div>
      </div>

      <!-- 近24小时变化曲线 -->
      <div class="detail-section">
        <h3 class="section-title">近24小时变化曲线</h3>
        <div class="chart-container">
          <div class="chart-item">
            <canvas ref="brightnessChartRef" class="chart-canvas"></canvas>
          </div>
          <div class="chart-item">
            <canvas ref="currentChartRef" class="chart-canvas"></canvas>
          </div>
        </div>
      </div>

      <!-- 设备关联信息 -->
      <div class="detail-section">
        <h3 class="section-title">设备关联信息</h3>
        <div class="detail-card-row">
          <div class="detail-row-left">设备型号:</div>
          <div class="detail-row-right">
            {{ deviceInfo.deviceModel }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">安装日期:</div>
          <div class="detail-row-right">
            {{ deviceInfo.installationDate }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">上次维护:</div>
          <div class="detail-row-right">
            {{ deviceInfo.lastMaintenance }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">固件版本:</div>
          <div class="detail-row-right">
            {{ deviceInfo.firmwareVersion }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">通信协议:</div>
          <div class="detail-row-right">
            {{ deviceInfo.communicationProtocol }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">电池电量:</div>
          <div class="detail-row-right">
            {{ deviceInfo.batteryLevel }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">信号强度:</div>
          <div class="detail-row-right">
            {{ deviceInfo.signalStrength }}
          </div>
        </div>
      </div>

      <!-- 历史预警记录 -->
      <div class="detail-section">
        <h3 class="section-title">历史预警记录</h3>
        <div class="warning-history">
          <div class="warning-header">
            <div class="warning-col">预警时间</div>
            <div class="warning-col">预警类型</div>
            <div class="warning-col">预警值</div>
            <div class="warning-col">阈值</div>
            <div class="warning-col">状态</div>
            <div class="warning-col">处理人</div>
          </div>
          <div class="warning-body">
            <div v-for="item in warningHistory" :key="item.id" class="warning-row">
              <div class="warning-col">{{ item.warningTime }}</div>
              <div class="warning-col">{{ item.warningType }}</div>
              <div class="warning-col">{{ item.warningValue }}</div>
              <div class="warning-col">{{ item.threshold }}</div>
              <div class="warning-col">{{ item.status }}</div>
              <div class="warning-col">{{ item.handler }}</div>
            </div>
            <div v-if="warningHistory.length === 0" class="no-warning">
              暂无预警记录
            </div>
          </div>
        </div>
      </div>
    </div>
  </DetailDrawer>
</template>

<style scoped lang="scss">
// 响应式适配
@media (max-width: 768px) {
  .detail-row-left {
    width: 110px; // 小屏适配标签宽度
  }

  .detail-card {
    min-height: 450px;
    max-height: 60vh;
    padding: 15px;
  }

  .chart-container {
    flex-direction: column;
  }

  .chart-item {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }

  .warning-col {
    font-size: 12px;
  }
}

.detail-card {
  min-height: 600px; // 适配更多内容
  max-height: 80vh; // 提高最大高度，容纳更多内容
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
}

// 分区样式
.detail-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
}

// 分区标题
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid #3b82f6;
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
  width: 130px; // 加宽标签宽度，适配"监测设备编号"等长标签
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

// 图表容器
.chart-container {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

// 图表项
.chart-item {
  flex: 1;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

// 图表画布
.chart-canvas {
  width: 100% !important;
  height: 250px !important;
}

// 预警记录
.warning-history {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 10px;
}

// 预警记录头部
.warning-header {
  display: flex;
  background-color: #f3f4f6;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
}

// 预警记录行
.warning-row {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9fafb;
  }
}

// 预警记录列
.warning-col {
  flex: 1;
  font-size: 14px;
  color: #374151;
  text-align: left;
}

// 无预警记录
.no-warning {
  padding: 40px 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
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
