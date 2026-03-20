<script setup>
import { computed, defineProps, onMounted, ref, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import * as echarts from 'echarts';

// 定义组件接收的属性（供水管网监测数据）
const props = defineProps({
  // 详情数据对象（供水管网监测数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的pipeArea）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用管网分区，兜底显示默认值
const drawerTitle = computed(() => {
  const pipeArea = detailObj.value?.pipeArea || '供水管网监测';
  return title.value || `${pipeArea}详情`;
});

// 初始化抽屉实例（加宽适配供水管网监测更多字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 800, // 加宽到800px适配供水管网监测字段
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange() {},
});

// 图表容器引用
const pressureChartRef = ref(null);
const flowChartRef = ref(null);

// 生成24小时数据
const generate24HoursData = (baseValue, variation) => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(time.getHours() - i);
    const timeStr = time.getHours().toString().padStart(2, '0') + ':00';
    
    // 生成带随机波动的数据
    const value = baseValue + (Math.random() - 0.5) * variation;
    data.push([timeStr, parseFloat(value.toFixed(2))]);
  }
  
  return data;
};

// 初始化压力图表
const initPressureChart = () => {
  if (pressureChartRef.value) {
    const chart = echarts.init(pressureChartRef.value);
    const pressureData = generate24HoursData(props.detailObj.pipePressure || 0.45, 0.1);
    
    const option = {
      title: {
        text: '管网压力近24小时变化',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} MPa'
      },
      xAxis: {
        type: 'category',
        data: pressureData.map(item => item[0]),
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '压力 (MPa)'
      },
      series: [{
        data: pressureData.map(item => item[1]),
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        }
      }]
    };
    
    chart.setOption(option);
  }
};

// 初始化流量图表
const initFlowChart = () => {
  if (flowChartRef.value) {
    const chart = echarts.init(flowChartRef.value);
    const flowData = generate24HoursData(props.detailObj.pipeFlow || 100, 20);
    
    const option = {
      title: {
        text: '管网流量近24小时变化',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} m³/h'
      },
      xAxis: {
        type: 'category',
        data: flowData.map(item => item[0]),
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '流量 (m³/h)'
      },
      series: [{
        data: flowData.map(item => item[1]),
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        }
      }]
    };
    
    chart.setOption(option);
  }
};

// 监听抽屉打开事件
onMounted(() => {
  // 延迟初始化图表，确保DOM已渲染
  setTimeout(() => {
    initPressureChart();
    initFlowChart();
  }, 100);
});

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: () => {
    detailDrawerApi.open();
    // 抽屉打开后初始化图表
    setTimeout(() => {
      initPressureChart();
      initFlowChart();
    }, 100);
  },
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 供水管网监测基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">管网分区:</div>
        <div class="detail-row-right">
          {{ detailObj.pipeArea || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">管网压力:</div>
        <div class="detail-row-right">
          {{ detailObj.pipePressure || '-' }} MPa
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">管网流量:</div>
        <div class="detail-row-right">
          {{ detailObj.pipeFlow || '-' }} m³/h
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">泄漏状态:</div>
        <div class="detail-row-right">
          {{ detailObj.leakStatus || '-' }}
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
        <div class="detail-row-left">数据同步时长:</div>
        <div class="detail-row-right">
          {{ detailObj.syncDuration || '-' }} 秒
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
        <div class="detail-row-left">最近更新时间:</div>
        <div class="detail-row-right">
          {{ detailObj.updateTime || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警优先级规则:</div>
        <div class="detail-row-right">
          {{ detailObj.warnPriorityRule || '-' }}
        </div>
      </div>
      
      <!-- 核心指标近24小时变化曲线 -->
      <div class="chart-section">
        <h3 class="chart-title">核心指标近24小时变化</h3>
        <div class="chart-container">
          <div ref="pressureChartRef" class="chart-item"></div>
          <div ref="flowChartRef" class="chart-item"></div>
        </div>
      </div>
      
      <!-- 设备关联信息 -->
      <div class="info-section">
        <h3 class="section-title">设备关联信息</h3>
        <div class="device-info">
          <div class="info-item">
            <span class="info-label">设备型号:</span>
            <span class="info-value">{{ detailObj.deviceModel || 'WATER-MON-2024' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">安装位置:</span>
            <span class="info-value">{{ detailObj.installLocation || detailObj.pipeArea || '未知' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">安装时间:</span>
            <span class="info-value">{{ detailObj.installTime || '2024-01-01' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">维护周期:</span>
            <span class="info-value">{{ detailObj.maintenanceCycle || '3个月' }}</span>
          </div>
        </div>
      </div>
      
      <!-- 历史泄漏记录 -->
      <div class="info-section">
        <h3 class="section-title">历史泄漏记录</h3>
        <div class="leak-history">
          <div class="history-item" v-if="detailObj.leakStatus !== '正常'">
            <div class="history-time">2024-06-10 08:30:00</div>
            <div class="history-content">
              <span class="history-type">疑似泄漏</span>
              <span class="history-desc">管网压力异常波动，疑似泄漏</span>
            </div>
          </div>
          <div class="history-item">
            <div class="history-time">2024-05-25 14:15:00</div>
            <div class="history-content">
              <span class="history-type">正常</span>
              <span class="history-desc">定期检查，无泄漏情况</span>
            </div>
          </div>
          <div class="history-item">
            <div class="history-time">2024-05-10 09:45:00</div>
            <div class="history-content">
              <span class="history-type">正常</span>
              <span class="history-desc">定期检查，无泄漏情况</span>
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
    min-height: 450px; // 适配供水管网监测字段数量，提升最小高度
    max-height: 60vh; // 提高最大高度，容纳更多内容
    padding: 15px;
  }
}

.detail-card {
  min-height: 500px; // 适配供水管网监测字段数量，提升最小高度
  max-height: 75vh; // 提高最大高度，容纳更多内容
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

// 图表部分样式
.chart-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  
  .chart-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 15px;
    text-align: center;
  }
  
  .chart-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    
    .chart-item {
      width: 100%;
      height: 300px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}

// 信息部分样式
.info-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 15px;
  }
  
  .device-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    
    .info-item {
      display: flex;
      flex-direction: column;
      
      .info-label {
        font-size: 14px;
        color: #606266;
        margin-bottom: 5px;
      }
      
      .info-value {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
      }
    }
  }
  
  .leak-history {
    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      margin-bottom: 10px;
      background-color: #ffffff;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      
      .history-time {
        font-size: 13px;
        color: #606266;
      }
      
      .history-content {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .history-type {
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 500;
          
          &[class*="正常"] {
            background-color: #f0f9eb;
            color: #67c23a;
          }
          
          &[class*="疑似泄漏"] {
            background-color: #fdf6ec;
            color: #e6a23c;
          }
          
          &[class*="确认泄漏"] {
            background-color: #fef0f0;
            color: #f56c6c;
          }
        }
        
        .history-desc {
          font-size: 13px;
          color: #303133;
        }
      }
    }
  }
}
</style>
