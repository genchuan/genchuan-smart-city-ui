<script setup>
import { computed, defineProps, toRefs, ref, onMounted } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import * as echarts from 'echarts';

// 定义组件接收的属性（排水管网监测数据）
const props = defineProps({
  // 详情数据对象（排水管网监测数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的pipe_road）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 图表引用
const levelChartRef = ref(null);
const flowChartRef = ref(null);
const rainfallChartRef = ref(null);

// 图表实例
let levelChart = null;
let flowChart = null;
let rainfallChart = null;

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

// 初始化液位图表
const initLevelChart = () => {
  if (levelChartRef.value) {
    levelChart = echarts.init(levelChartRef.value);
    const times = generateTimeData();
    const data = generateMockData(detailObj.value?.pipe_level || 1.5, 0, 5);
    
    const option = {
      title: {
        text: '管网液位变化曲线',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} 米'
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
        name: '液位 (米)'
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
    
    levelChart.setOption(option);
  }
};

// 初始化流速图表
const initFlowChart = () => {
  if (flowChartRef.value) {
    flowChart = echarts.init(flowChartRef.value);
    const times = generateTimeData();
    const data = generateMockData(detailObj.value?.pipe_flow_speed || 0.8, 0, 3);
    
    const option = {
      title: {
        text: '管网流速变化曲线',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} 米/秒'
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
        name: '流速 (米/秒)'
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
    
    flowChart.setOption(option);
  }
};

// 初始化降雨量图表
const initRainfallChart = () => {
  if (rainfallChartRef.value) {
    rainfallChart = echarts.init(rainfallChartRef.value);
    const times = generateTimeData();
    const data = generateMockData(detailObj.value?.rainfall || 5, 0, 50);
    
    const option = {
      title: {
        text: '降雨量变化曲线',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} 毫米'
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
        name: '降雨量 (毫米)'
      },
      series: [{
        data: data,
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#1890ff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
          ])
        }
      }]
    };
    
    rainfallChart.setOption(option);
  }
};

// 初始化所有图表
const initCharts = () => {
  initLevelChart();
  initFlowChart();
  initRainfallChart();
};

// 监听窗口大小变化，调整图表大小
const handleResize = () => {
  levelChart?.resize();
  flowChart?.resize();
  rainfallChart?.resize();
};

// 计算属性处理标题，优先用管网路段名称，兜底显示默认值
const drawerTitle = computed(() => {
  const pipeRoad = detailObj.value?.pipe_road || '排水管网监测';
  return title.value || `${pipeRoad}详情`;
});

// 初始化抽屉实例（加宽适配排水管网监测更多字段）
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
      <!-- 排水管网监测基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">管网路段:</div>
        <div class="detail-row-right">
          {{ detailObj.pipe_road || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">管网液位:</div>
        <div class="detail-row-right">
          {{ detailObj.pipe_level || '-' }} 米
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">管网流速:</div>
        <div class="detail-row-right">
          {{ detailObj.pipe_flow_speed || '-' }} 米/秒
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">降雨量:</div>
        <div class="detail-row-right">
          {{ detailObj.rainfall || '-' }} 毫米
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">监测设备编号:</div>
        <div class="detail-row-right">
          {{ detailObj.code || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">设备在线状态:</div>
        <div class="detail-row-right">
          {{ detailObj.status || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">负责运维员:</div>
        <div class="detail-row-right">
          {{ detailObj.user_name || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">采集频率类型:</div>
        <div class="detail-row-right">
          {{ detailObj.collect_frequency_type || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">数据同步时长:</div>
        <div class="detail-row-right">
          {{ detailObj.sync_duration || '-' }} 秒
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">监测状态:</div>
        <div class="detail-row-right">{{ detailObj.monitor_status || '-' }}</div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">液位阈值:</div>
        <div class="detail-row-right">
          {{ detailObj.pipe_level_threshold || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">流速阈值:</div>
        <div class="detail-row-right">
          {{ detailObj.pipe_flow_speed_threshold || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">降雨量阈值:</div>
        <div class="detail-row-right">
          {{ detailObj.rainfall_threshold || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">最近更新时间:</div>
        <div class="detail-row-right">
          {{ detailObj.update_time || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">降雨联动预警开关:</div>
        <div class="detail-row-right">
          {{ detailObj.rain_warn_switch || '-' }}
        </div>
      </div>

      <!-- 设备关联信息 -->
      <div class="detail-section">
        <h3 class="section-title">设备关联信息</h3>
        <div class="device-info">
          <div class="device-info-row">
            <div class="device-info-label">设备编号:</div>
            <div class="device-info-value">{{ detailObj.code || '-' }}</div>
          </div>
          <div class="device-info-row">
            <div class="device-info-label">设备状态:</div>
            <div class="device-info-value">{{ detailObj.status || '-' }}</div>
          </div>
          <div class="device-info-row">
            <div class="device-info-label">采集频率类型:</div>
            <div class="device-info-value">{{ detailObj.collect_frequency_type || '-' }}</div>
          </div>
          <div class="device-info-row">
            <div class="device-info-label">数据同步时长:</div>
            <div class="device-info-value">{{ detailObj.sync_duration || '-' }} 秒</div>
          </div>
        </div>
      </div>

      <!-- 降雨联动数据 -->
      <div class="detail-section">
        <h3 class="section-title">降雨联动数据</h3>
        <div class="rainfall-info">
          <div class="rainfall-info-row">
            <div class="rainfall-info-label">当前降雨量:</div>
            <div class="rainfall-info-value">{{ detailObj.rainfall || '-' }} 毫米</div>
          </div>
          <div class="rainfall-info-row">
            <div class="rainfall-info-label">降雨量阈值:</div>
            <div class="rainfall-info-value">{{ detailObj.rainfall_threshold || '-' }}</div>
          </div>
          <div class="rainfall-info-row">
            <div class="rainfall-info-label">降雨联动预警开关:</div>
            <div class="rainfall-info-value">{{ detailObj.rain_warn_switch || '-' }}</div>
          </div>
        </div>
      </div>

      <!-- 近24小时数据变化曲线 -->
      <div class="detail-section">
        <h3 class="section-title">核心指标近24小时变化</h3>
        <div class="chart-grid">
          <div class="chart-item">
            <div ref="levelChartRef" class="chart-container"></div>
          </div>
          <div class="chart-item">
            <div ref="flowChartRef" class="chart-container"></div>
          </div>
          <div class="chart-item">
            <div ref="rainfallChartRef" class="chart-container"></div>
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
  min-height: 500px; // 适配道路监测字段数量，提升最小高度
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

// 降雨联动数据样式
.rainfall-info {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .rainfall-info-row {
    display: flex;
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .rainfall-info-label {
      flex-shrink: 0;
      width: 120px;
      font-weight: 500;
      color: #606266;
      font-size: 14px;
    }
    
    .rainfall-info-value {
      flex: 1;
      color: #303133;
      font-size: 14px;
    }
  }
}

// 图表部分样式
.chart-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
    height: 200px;
  }
}

// 详情卡片整体样式
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
}
</style>
