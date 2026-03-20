<script setup>
import { computed, defineProps, onMounted, ref, toRefs } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import * as echarts from 'echarts';

// 定义组件接收的属性（综合管廊监测数据）
const props = defineProps({
  // 详情数据对象（综合管廊监测数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的gallerySection）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用管廊区段名称，兜底显示默认值
const drawerTitle = computed(() => {
  const gallerySection = detailObj.value?.gallerySection || '综合管廊监测';
  return title.value || `${gallerySection}详情`;
});

// 图表引用
const tempChartRef = ref(null);
const humidityChartRef = ref(null);
const gasChartRef = ref(null);
const smokeChartRef = ref(null);

// 图表实例
let tempChart = null;
let humidityChart = null;
let gasChart = null;
let smokeChart = null;

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
    const random = (Math.random() - 0.5) * 10;
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
    const data = generateMockData(detailObj.value?.galleryTemp || 25, 15, 35);
    
    const option = {
      title: {
        text: '温度变化曲线',
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
        name: '温度 (℃)'
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

// 初始化湿度图表
const initHumidityChart = () => {
  if (humidityChartRef.value) {
    humidityChart = echarts.init(humidityChartRef.value);
    const times = generateTimeData();
    const data = generateMockData(detailObj.value?.galleryHumidity || 60, 30, 80);
    
    const option = {
      title: {
        text: '湿度变化曲线',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} %'
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
        name: '湿度 (%)'
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
    
    humidityChart.setOption(option);
  }
};

// 初始化燃气浓度图表
const initGasChart = () => {
  if (gasChartRef.value) {
    gasChart = echarts.init(gasChartRef.value);
    const times = generateTimeData();
    const data = generateMockData(detailObj.value?.gasConcentration || 0.2, 0, 1);
    
    const option = {
      title: {
        text: '燃气浓度变化曲线',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} %'
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
        name: '浓度 (%)'
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
    
    gasChart.setOption(option);
  }
};

// 初始化烟感状态图表
const initSmokeChart = () => {
  if (smokeChartRef.value) {
    smokeChart = echarts.init(smokeChartRef.value);
    const times = generateTimeData();
    // 模拟烟感状态数据，0表示正常，1表示报警
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push(Math.random() > 0.9 ? 1 : 0);
    }
    
    const option = {
      title: {
        text: '烟感状态变化',
        left: 'center',
        textStyle: {
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          return params[0].name + ': ' + (params[0].value === 1 ? '报警' : '正常');
        }
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
        min: 0,
        max: 1,
        interval: 1,
        axisLabel: {
          formatter: function(value) {
            return value === 1 ? '报警' : '正常';
          }
        }
      },
      series: [{
        data: data,
        type: 'line',
        step: 'middle',
        lineStyle: {
          color: '#1890ff'
        },
        itemStyle: {
          color: function(params) {
            return params.value === 1 ? '#ff4d4f' : '#52c41a';
          }
        }
      }]
    };
    
    smokeChart.setOption(option);
  }
};

// 初始化所有图表
const initCharts = () => {
  initTempChart();
  initHumidityChart();
  initGasChart();
  initSmokeChart();
};

// 监听窗口大小变化，调整图表大小
const handleResize = () => {
  tempChart?.resize();
  humidityChart?.resize();
  gasChart?.resize();
  smokeChart?.resize();
};

// 组件挂载后初始化图表
onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

// 初始化抽屉实例
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 1000,
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

// 生成历史风险记录
const generateRiskHistory = () => {
  const history = [];
  const now = new Date();
  const riskTypes = ['燃气浓度超标', '烟感报警', '温度异常', '湿度异常', '设备离线'];
  const riskLevels = ['高风险', '中风险'];
  
  // 生成最近7天的历史记录
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().slice(0, 10);
    
    // 每天生成1-3条记录
    const recordCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < recordCount; j++) {
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      history.push({
        id: `${dateStr}-${j}`,
        time: `${dateStr} ${timeStr}`,
        riskType: riskTypes[Math.floor(Math.random() * riskTypes.length)],
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        description: `${riskTypes[Math.floor(Math.random() * riskTypes.length)]} - 系统自动检测到异常`,
        status: Math.random() > 0.3 ? '已处理' : '未处理'
      });
    }
  }
  
  return history;
};

// 历史风险记录数据
const riskHistory = ref(generateRiskHistory());

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 综合管廊监测基础信息 -->
      <div class="detail-card-row">
        <div class="detail-row-left">管廊区段:</div>
        <div class="detail-row-right">
          {{ detailObj.gallerySection || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">管廊温度:</div>
        <div class="detail-row-right">
          {{ detailObj.galleryTemp || '-' }} ℃
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">管廊湿度:</div>
        <div class="detail-row-right">
          {{ detailObj.galleryHumidity || '-' }} %
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">燃气浓度:</div>
        <div class="detail-row-right">
          {{ detailObj.gasConcentration || '-' }} %
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">烟感状态:</div>
        <div class="detail-row-right">
          {{ detailObj.smokeStatus || '-' }}
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
        <div class="detail-row-left">负责巡检员:</div>
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
        <div class="detail-row-left">温度阈值:</div>
        <div class="detail-row-right">
          {{ detailObj.tempThreshold || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">湿度阈值:</div>
        <div class="detail-row-right">
          {{ detailObj.humidityThreshold || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">燃气浓度阈值:</div>
        <div class="detail-row-right">
          {{ detailObj.gasThreshold || '-' }}
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
        <div class="detail-row-left">预警方式:</div>
        <div class="detail-row-right">
          {{ detailObj.warnWay || '-' }}
        </div>
      </div>
      <div class="detail-card-row">
        <div class="detail-row-left">安全风险等级:</div>
        <div class="detail-row-right">
          {{ detailObj.riskLevel || '-' }}
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
            <div ref="humidityChartRef" class="chart-container"></div>
          </div>
          <div class="chart-item">
            <div ref="gasChartRef" class="chart-container"></div>
          </div>
          <div class="chart-item">
            <div ref="smokeChartRef" class="chart-container"></div>
          </div>
        </div>
      </div>
      
      <!-- 历史风险记录部分 -->
      <div class="risk-history-section">
        <h4>历史风险记录</h4>
        <div class="risk-history-table">
          <table>
            <thead>
              <tr>
                <th>时间</th>
                <th>风险类型</th>
                <th>风险等级</th>
                <th>描述</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in riskHistory" :key="record.id">
                <td>{{ record.time }}</td>
                <td>{{ record.riskType }}</td>
                <td>
                  <span :class="{
                    'risk-level-high': record.riskLevel === '高风险',
                    'risk-level-medium': record.riskLevel === '中风险'
                  }">
                    {{ record.riskLevel }}
                  </span>
                </td>
                <td>{{ record.description }}</td>
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
  min-height: 500px; // 适配综合管廊监测字段数量
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
  width: 130px; // 加宽标签宽度，适配"燃气浓度阈值"等长标签
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
  word-break: break-all; // 处理长文本换行
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
    grid-template-columns: repeat(2, 1fr);
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
    height: 300px;
  }
}

// 历史风险记录部分样式
.risk-history-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  
  h4 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 16px;
    font-weight: 500;
  }
  
  .risk-history-table {
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
      
      .risk-level-high {
        color: #ef4444;
        font-weight: 500;
      }
      
      .risk-level-medium {
        color: #f59e0b;
        font-weight: 500;
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