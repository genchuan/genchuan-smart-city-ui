<script setup>
import { computed, defineProps, onMounted, ref, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import * as echarts from 'echarts';

// 定义组件接收的属性（供热管网监测数据）
const props = defineProps({
  // 详情数据对象（供热管网监测数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的heatArea）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用供热区域，兜底显示默认值
const drawerTitle = computed(() => {
  const heatArea = detailObj.value?.heatArea || '供热管网监测';
  return title.value || `${heatArea}详情`;
});

// 图表引用
const tempChartRef = ref(null);
const pressureChartRef = ref(null);
const flowChartRef = ref(null);

// 图表实例
let tempChart = null;
let pressureChart = null;
let flowChart = null;

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
    const random = (Math.random() - 0.5) * 5;
    let value = baseValue + random;
    value = Math.max(min, Math.min(max, value));
    data.push(parseFloat(value.toFixed(1)));
  }
  return data;
};

// 初始化温度图表
const initTempChart = () => {
  if (tempChartRef.value) {
    tempChart = echarts.init(tempChartRef.value);
    const times = generateTimeData();
    const data = generateMockData(detailObj.value?.tempDifference || 15, 5, 25);
    
    const option = {
      title: {
        text: '供回水温差变化曲线',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} ℃'
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
        name: '温差 (℃)'
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
    
    tempChart.setOption(option);
  }
};

// 初始化压力图表
const initPressureChart = () => {
  if (pressureChartRef.value) {
    pressureChart = echarts.init(pressureChartRef.value);
    const times = generateTimeData();
    const data = generateMockData(detailObj.value?.pipePressure || 2.5, 1.5, 3.5);
    
    const option = {
      title: {
        text: '管网压力变化曲线',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} MPa'
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
        name: '压力 (MPa)'
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
    
    pressureChart.setOption(option);
  }
};

// 初始化流量图表
const initFlowChart = () => {
  if (flowChartRef.value) {
    flowChart = echarts.init(flowChartRef.value);
    const times = generateTimeData();
    const data = generateMockData(detailObj.value?.pipeFlow || 120, 80, 160);
    
    const option = {
      title: {
        text: '管网流量变化曲线',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} m³/h'
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
        name: '流量 (m³/h)'
      },
      series: [{
        data: data,
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#faad14'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(250, 173, 20, 0.3)' },
            { offset: 1, color: 'rgba(250, 173, 20, 0.1)' }
          ])
        }
      }]
    };
    
    flowChart.setOption(option);
  }
};

// 初始化所有图表
const initCharts = () => {
  initTempChart();
  initPressureChart();
  initFlowChart();
};

// 监听窗口大小变化，调整图表大小
const handleResize = () => {
  tempChart?.resize();
  pressureChart?.resize();
  flowChart?.resize();
};

// 生成历史超标记录
const generateOverLimitHistory = () => {
  const history = [];
  const now = new Date();
  const overLimitTypes = ['供回水温差超标', '管网压力超标', '管网流量超标', '设备离线'];
  
  // 生成最近7天的历史记录
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().slice(0, 10);
    
    // 每天生成0-2条记录
    const recordCount = Math.floor(Math.random() * 3);
    for (let j = 0; j < recordCount; j++) {
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      history.push({
        id: `${dateStr}-${j}`,
        time: `${dateStr} ${timeStr}`,
        overLimitType: overLimitTypes[Math.floor(Math.random() * overLimitTypes.length)],
        value: (Math.random() * 10 + 10).toFixed(1),
        threshold: '10-20',
        status: Math.random() > 0.5 ? '已处理' : '未处理'
      });
    }
  }
  
  return history;
};

// 历史超标记录数据
const overLimitHistory = ref(generateOverLimitHistory());

// 组件挂载后初始化图表
onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

// 初始化抽屉实例（加宽适配供热管网监测更多字段）
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

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 供热管网基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">供热区域:</div>
        <div class="detail-row-right">
          {{ detailObj.heatArea || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">供回水温差:</div>
        <div class="detail-row-right">
          {{ detailObj.tempDifference || '-' }} ℃
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
        <div class="detail-row-left">季节类型:</div>
        <div class="detail-row-right">
          {{ detailObj.seasonType || '-' }}
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
        <div class="detail-row-left">负责检修员:</div>
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
        <div class="detail-row-left">冬季温差阈值:</div>
        <div class="detail-row-right">
          {{ detailObj.winterTempDiffThreshold || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">非冬季温差阈值:</div>
        <div class="detail-row-right">
          {{ detailObj.nonWinterTempDiffThreshold || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">管网压力阈值:</div>
        <div class="detail-row-right">
          {{ detailObj.pipePressureThreshold || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">管网流量阈值:</div>
        <div class="detail-row-right">
          {{ detailObj.pipeFlowThreshold || '-' }}
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
        <div class="detail-row-left">季节阈值开关:</div>
        <div class="detail-row-right">
          {{ detailObj.seasonSwitch || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">预警触发标识:</div>
        <div class="detail-row-right">
          {{ detailObj.warnStatus || '-' }}
        </div>
      </div>
      
      <!-- 数据可视化部分 -->
      <div class="chart-section">
        <h4>近24小时数据变化</h4>
        <div class="chart-grid">
          <div class="chart-item">
            <div ref="tempChartRef" class="chart-container"></div>
          </div>
          <div class="chart-item">
            <div ref="pressureChartRef" class="chart-container"></div>
          </div>
          <div class="chart-item">
            <div ref="flowChartRef" class="chart-container"></div>
          </div>
        </div>
      </div>
      
      <!-- 历史超标记录部分 -->
      <div class="over-limit-section">
        <h4>历史超标记录</h4>
        <div class="over-limit-table">
          <table>
            <thead>
              <tr>
                <th>时间</th>
                <th>超标类型</th>
                <th>实际值</th>
                <th>阈值范围</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in overLimitHistory" :key="record.id">
                <td>{{ record.time }}</td>
                <td>{{ record.overLimitType }}</td>
                <td>{{ record.value }}</td>
                <td>{{ record.threshold }}</td>
                <td>
                  <span :class="{
                    'status-handled': record.status === '已处理',
                    'status-pending': record.status === '未处理'
                  }">
                    {{ record.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
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

// 图表部分样式
.chart-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  
  h4 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 16px;
    font-weight: 500;
  }
  
  .chart-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
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

// 历史超标记录部分样式
.over-limit-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  
  h4 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 16px;
    font-weight: 500;
  }
  
  .over-limit-table {
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
    
    table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #f0f0f0;
      }
      
      th {
        background-color: #f9fafb;
        font-weight: 500;
        color: #606266;
      }
      
      tr:hover {
        background-color: #f5f7fa;
      }
      
      .status-handled {
        color: #10b981;
        font-weight: 500;
      }
      
      .status-pending {
        color: #ef4444;
        font-weight: 500;
      }
    }
  }
}
</style>
