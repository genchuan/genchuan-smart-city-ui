<script setup>
import { computed, defineProps, toRefs, ref, onMounted } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import * as echarts from 'echarts';

// 定义组件接收的属性（窨井盖监测数据）
const props = defineProps({
  // 详情数据对象（窨井盖监测数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的cover_no）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 图表引用
const tiltChartRef = ref(null);
const vibrationChartRef = ref(null);

// 图表实例
let tiltChart = null;
let vibrationChart = null;

// 生成近24小时的时间数据
const generateTimeData = () => {
  const times = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    times.push(time.getHours() + ':00');
  }
  return times;
};

// 生成模拟数据
const generateMockData = (baseValue, min, max) => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const random = (Math.random() - 0.5) * 2;
    let value = baseValue + random;
    value = Math.max(min, Math.min(max, value));
    data.push(parseFloat(value.toFixed(1)));
  }
  return data;
};

// 初始化倾斜角度图表
const initTiltChart = () => {
  if (tiltChartRef.value) {
    tiltChart = echarts.init(tiltChartRef.value);
    const times = generateTimeData();
    const data = generateMockData(detailObj.value?.tiltAngle || 2.5, 0, 15);
    
    const option = {
      title: {
        text: '倾斜角度变化曲线',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} °'
      },
      xAxis: {
        type: 'category',
        data: times,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '角度 (°)'
      },
      series: [{
        data: data,
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#ff7875'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 120, 117, 0.3)' },
            { offset: 1, color: 'rgba(255, 120, 117, 0.1)' }
          ])
        }
      }]
    };
    
    tiltChart.setOption(option);
  }
};

// 初始化振动数据图表
const initVibrationChart = () => {
  if (vibrationChartRef.value) {
    vibrationChart = echarts.init(vibrationChartRef.value);
    const times = generateTimeData();
    const data = generateMockData(detailObj.value?.vibrationData || 0.5, 0, 5);
    
    const option = {
      title: {
        text: '振动数据变化曲线',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}'
      },
      xAxis: {
        type: 'category',
        data: times,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '振动值'
      },
      series: [{
        data: data,
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#73d13d'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(115, 209, 61, 0.3)' },
            { offset: 1, color: 'rgba(115, 209, 61, 0.1)' }
          ])
        }
      }]
    };
    
    vibrationChart.setOption(option);
  }
};

// 初始化所有图表
const initCharts = () => {
  initTiltChart();
  initVibrationChart();
};

// 监听窗口大小变化，调整图表大小
const handleResize = () => {
  tiltChart?.resize();
  vibrationChart?.resize();
};

// 历史异常记录数据
const historyRecords = ref([
  {
    id: 1,
    time: '2024-06-15 08:30:00',
    type: '异常振动',
    description: '振动数据超过阈值',
    status: '已处理',
    handler: '陈铭',
  },
  {
    id: 2,
    time: '2024-06-14 14:20:00',
    type: '倾斜角度异常',
    description: '倾斜角度超过15度',
    status: '已处理',
    handler: '林晓婷',
  },
  {
    id: 3,
    time: '2024-06-13 09:15:00',
    type: '开合状态异常',
    description: '井盖异常打开',
    status: '已处理',
    handler: '王志远',
  },
]);

// 计算属性处理标题，优先用井盖编号，兜底显示默认值
const drawerTitle = computed(() => {
  const coverNo = detailObj.value?.coverNo || '窨井盖监测';
  return title.value || `${coverNo}详情`;
});

// 初始化抽屉实例（加宽适配窨井盖监测更多字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 1000, // 加宽到1000px适配图表
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 延迟初始化图表，确保DOM已经渲染
      setTimeout(() => {
        initCharts();
      }, 100);
    }
  },
});

// 组件挂载后初始化图表
onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
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
      <!-- 窨井盖监测基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">井盖编号:</div>
        <div class="detail-row-right">
          {{ detailObj.coverNo || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">路段名称:</div>
        <div class="detail-row-right">
          {{ detailObj.roadName || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">开合状态:</div>
        <div class="detail-row-right">
          {{ detailObj.openStatus || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">倾斜角度:</div>
        <div class="detail-row-right">
          {{ detailObj.tiltAngle || '-' }} °
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">振动数据:</div>
        <div class="detail-row-right">
          {{ detailObj.vibrationData || '-' }}
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
        <div class="detail-row-left">负责运维员:</div>
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
          {{ detailObj.tiltAngleThreshold || '-' }}
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
        <div class="detail-row-left">安全风险等级:</div>
        <div class="detail-row-right">
          {{ detailObj.riskLevel || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">异常振动标识:</div>
        <div class="detail-row-right">
          {{ detailObj.abnormalVibrationFlag || '-' }}
        </div>
      </div>

      <!-- 设备关联信息 -->
      <div class="detail-section">
        <h3 class="section-title">设备关联信息</h3>
        <div class="device-info">
          <div class="device-info-row">
            <div class="device-info-label">设备编号:</div>
            <div class="device-info-value">{{ detailObj.deviceCode || '-' }}</div>
          </div>
          <div class="device-info-row">
            <div class="device-info-label">设备状态:</div>
            <div class="device-info-value">{{ detailObj.deviceStatus || '-' }}</div>
          </div>
          <div class="device-info-row">
            <div class="device-info-label">数据采集频率:</div>
            <div class="device-info-value">{{ detailObj.collectFrequency || '-' }}</div>
          </div>
          <div class="device-info-row">
            <div class="device-info-label">数据同步时长:</div>
            <div class="device-info-value">{{ detailObj.syncDuration || '-' }} 秒</div>
          </div>
        </div>
      </div>

      <!-- 近24小时数据变化曲线 -->
      <div class="detail-section">
        <h3 class="section-title">近24小时数据变化</h3>
        <div class="chart-grid">
          <div class="chart-item">
            <div ref="tiltChartRef" class="chart-container"></div>
          </div>
          <div class="chart-item">
            <div ref="vibrationChartRef" class="chart-container"></div>
          </div>
        </div>
      </div>

      <!-- 历史异常记录 -->
      <div class="detail-section">
        <h3 class="section-title">历史异常记录</h3>
        <div class="history-table">
          <div class="history-header">
            <div class="history-header-item">时间</div>
            <div class="history-header-item">异常类型</div>
            <div class="history-header-item">描述</div>
            <div class="history-header-item">状态</div>
            <div class="history-header-item">处理人</div>
          </div>
          <div class="history-body">
            <div v-for="record in historyRecords" :key="record.id" class="history-row">
              <div class="history-item">{{ record.time }}</div>
              <div class="history-item">{{ record.type }}</div>
              <div class="history-item">{{ record.description }}</div>
              <div class="history-item">{{ record.status }}</div>
              <div class="history-item">{{ record.handler }}</div>
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
}

.detail-card {
  min-height: 650px; // 适配窨井盖监测字段数量，提升最小高度
  max-height: 80vh; // 提高最大高度，容纳更多内容
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

// 设备关联信息样式
.device-info {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .device-info-row {
    display: flex;
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .device-info-label {
      flex-shrink: 0;
      width: 100px;
      font-weight: 500;
      color: #606266;
      font-size: 14px;
    }
    
    .device-info-value {
      flex: 1;
      color: #303133;
      font-size: 14px;
    }
  }
}

// 图表部分样式
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  
  .chart-item {
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .chart-container {
    width: 100%;
    height: 250px;
  }
}

// 历史异常记录样式
.detail-section {
  margin-top: 30px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 2px solid #f0f0f0;
  }
  
  .history-table {
    width: 100%;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    
    .history-header {
      display: flex;
      background-color: #f5f7fa;
      border-bottom: 1px solid #f0f0f0;
      
      .history-header-item {
        flex: 1;
        padding: 12px;
        font-size: 13px;
        font-weight: 500;
        color: #606266;
        text-align: center;
        border-right: 1px solid #f0f0f0;
        
        &:last-child {
          border-right: none;
        }
      }
    }
    
    .history-body {
      .history-row {
        display: flex;
        border-bottom: 1px solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:hover {
          background-color: #f9fafb;
        }
        
        .history-item {
          flex: 1;
          padding: 10px;
          font-size: 13px;
          color: #303133;
          text-align: center;
          border-right: 1px solid #f0f0f0;
          
          &:last-child {
            border-right: none;
          }
        }
      }
    }
  }
}
</style>
