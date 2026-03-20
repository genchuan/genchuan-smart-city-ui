<script setup>
import { computed, defineProps, toRefs, ref, onMounted } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import * as echarts from 'echarts';

// 定义组件接收的属性（燃气管网监测数据）
const props = defineProps({
  // 详情数据对象（燃气管网监测数据）
  detailObj: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 抽屉标题（可选，默认使用详情对象的pipeRoad）
  title: {
    type: String,
    default: '',
  },
});

const { detailObj, title } = toRefs(props);

// 计算属性处理标题，优先用管网路段，兜底显示默认值
const drawerTitle = computed(() => {
  const pipeRoad = detailObj.value?.pipeRoad || '燃气管网监测';
  return title.value || `${pipeRoad}详情`;
});

// 初始化抽屉实例（加宽适配燃气管网监测更多字段）
const [DetailDrawer, detailDrawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  width: 850, // 加宽到850px适配燃气管网监测字段
  onCancel() {
    detailDrawerApi.close();
  },
  onConfirm() {},
  async onOpenChange(isOpen) {
    if (isOpen) {
      // 当抽屉打开时初始化图表
      setTimeout(() => {
        initPressureChart();
        initConcentrationChart();
      }, 300);
    }
  },
});

// 图表引用
const pressureChartRef = ref(null);
const concentrationChartRef = ref(null);

// 生成24小时数据
const generate24HoursData = (baseValue, variation) => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(time.getHours() - i);
    const timeStr = time.getHours().toString().padStart(2, '0') + ':00';
    const value = baseValue + (Math.random() - 0.5) * variation;
    data.push([timeStr, parseFloat(value.toFixed(2))]);
  }
  return data;
};

// 初始化压力图表
const initPressureChart = () => {
  if (pressureChartRef.value) {
    const chart = echarts.init(pressureChartRef.value);
    const pressureData = generate24HoursData(detailObj.value.pipePressure || 0.35, 0.05);
    const option = {
      title: { text: '管网压力近24小时变化', left: 'center' },
      tooltip: { trigger: 'axis', formatter: '{b}: {c} MPa' },
      xAxis: { type: 'category', data: pressureData.map(item => item[0]), axisLabel: { rotate: 45 } },
      yAxis: { type: 'value', name: '压力 (MPa)' },
      series: [{ data: pressureData.map(item => item[1]), type: 'line', smooth: true, areaStyle: { opacity: 0.3 } }]
    };
    chart.setOption(option);
  }
};

// 初始化浓度图表
const initConcentrationChart = () => {
  if (concentrationChartRef.value) {
    const chart = echarts.init(concentrationChartRef.value);
    const concentrationData = generate24HoursData(detailObj.value.gasConcentration || 0.8, 0.2);
    const option = {
      title: { text: '燃气浓度近24小时变化', left: 'center' },
      tooltip: { trigger: 'axis', formatter: '{b}: {c} %' },
      xAxis: { type: 'category', data: concentrationData.map(item => item[0]), axisLabel: { rotate: 45 } },
      yAxis: { type: 'value', name: '浓度 (%)' },
      series: [{ data: concentrationData.map(item => item[1]), type: 'line', smooth: true, areaStyle: { opacity: 0.3 } }]
    };
    chart.setOption(option);
  }
};

// 设备关联信息
const deviceRelatedInfo = ref({
  deviceType: '燃气监测传感器',
  installDate: '2024-01-15',
  lastMaintenance: '2024-06-10',
  nextMaintenance: '2024-09-10',
  deviceModel: 'G-202401',
  manufacturer: '福建燃气设备有限公司'
});

// 历史数据快照
const historicalData = ref([
  { time: '2024-06-27 15:30', pressure: 0.34, concentration: 0.78, status: '正常' },
  { time: '2024-06-27 14:30', pressure: 0.35, concentration: 0.80, status: '正常' },
  { time: '2024-06-27 13:30', pressure: 0.36, concentration: 0.82, status: '正常' },
  { time: '2024-06-27 12:30', pressure: 0.35, concentration: 0.81, status: '正常' },
  { time: '2024-06-27 11:30', pressure: 0.34, concentration: 0.79, status: '正常' }
]);

// 分级预警规则匹配情况
const warnRuleMatch = ref({
  level: detailObj.value.warnLevelRule || 'Ⅰ级',
  conditions: [
    { name: '燃气浓度', value: detailObj.value.gasConcentration || 0, threshold: '≤1.0%', result: '正常' },
    { name: '管网压力', value: detailObj.value.pipePressure || 0, threshold: '0.2~0.4MPa', result: '正常' },
    { name: '设备状态', value: detailObj.value.deviceStatus || '-', threshold: '在线', result: detailObj.value.deviceStatus === '在线' ? '正常' : '异常' }
  ],
  suggestion: '当前状态正常，继续保持监测'
});

// 组件挂载时不需要初始化图表，改为在抽屉打开时初始化
// onMounted(() => {
//   setTimeout(() => {
//     initPressureChart();
//     initConcentrationChart();
//   }, 100);
// });

// 对外暴露打开/关闭抽屉的方法
defineExpose({
  open: () => detailDrawerApi.open(),
  close: () => detailDrawerApi.close(),
});
</script>

<template>
  <DetailDrawer :title="drawerTitle">
    <div class="detail-card">
      <!-- 燃气管网监测基础信息 -->
      <div class="detail-section">
        <h3 class="section-title">基础信息</h3>
        <div class="detail-card-row">
          <div class="detail-row-left">管网路段:</div>
          <div class="detail-row-right">
            {{ detailObj.pipeRoad || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">所属区域:</div>
          <div class="detail-row-right">
            {{ detailObj.areaName || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">管网压力:</div>
          <div class="detail-row-right">
            {{ detailObj.pipePressure || '-' }} MPa
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">燃气浓度:</div>
          <div class="detail-row-right">
            {{ detailObj.gasConcentration || '-' }} %
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
          <div class="detail-row-left">最近数据更新时间:</div>
          <div class="detail-row-right">
            {{ detailObj.updateTime || '-' }}
          </div>
        </div>
        <div class="detail-card-row">
          <div class="detail-row-left">分级预警规则匹配结果:</div>
          <div class="detail-row-right">
            <span
              :class="{
                'text-green-600': detailObj.warnLevelRule === 'Ⅰ级',
                'text-yellow-600': detailObj.warnLevelRule === 'Ⅱ级',
                'text-red-600': detailObj.warnLevelRule === 'Ⅲ级',
              }"
            >
              {{ detailObj.warnLevelRule || '-' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 核心指标近24小时变化曲线 -->
      <div class="detail-section">
        <h3 class="section-title">核心指标近24小时变化曲线</h3>
        <div class="chart-container">
          <div ref="pressureChartRef" class="chart-item"></div>
          <div ref="concentrationChartRef" class="chart-item"></div>
        </div>
      </div>

      <!-- 设备关联信息 -->
      <div class="detail-section">
        <h3 class="section-title">设备关联信息</h3>
        <div class="device-info-container">
          <div class="device-info-item">
            <span class="device-info-label">设备类型:</span>
            <span class="device-info-value">{{ deviceRelatedInfo.deviceType }}</span>
          </div>
          <div class="device-info-item">
            <span class="device-info-label">安装日期:</span>
            <span class="device-info-value">{{ deviceRelatedInfo.installDate }}</span>
          </div>
          <div class="device-info-item">
            <span class="device-info-label">上次维护:</span>
            <span class="device-info-value">{{ deviceRelatedInfo.lastMaintenance }}</span>
          </div>
          <div class="device-info-item">
            <span class="device-info-label">下次维护:</span>
            <span class="device-info-value">{{ deviceRelatedInfo.nextMaintenance }}</span>
          </div>
          <div class="device-info-item">
            <span class="device-info-label">设备型号:</span>
            <span class="device-info-value">{{ deviceRelatedInfo.deviceModel }}</span>
          </div>
          <div class="device-info-item">
            <span class="device-info-label">制造商:</span>
            <span class="device-info-value">{{ deviceRelatedInfo.manufacturer }}</span>
          </div>
        </div>
      </div>

      <!-- 历史数据快照 -->
      <div class="detail-section">
        <h3 class="section-title">历史数据快照</h3>
        <div class="history-table-container">
          <table class="history-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>管网压力(MPa)</th>
                <th>燃气浓度(%)</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in historicalData" :key="index">
                <td>{{ item.time }}</td>
                <td>{{ item.pressure }}</td>
                <td>{{ item.concentration }}</td>
                <td>{{ item.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 分级预警规则匹配情况 -->
      <div class="detail-section">
        <h3 class="section-title">分级预警规则匹配情况</h3>
        <div class="warn-rule-container">
          <div class="warn-level">
            <span class="warn-level-label">当前预警等级:</span>
            <span 
              class="warn-level-value"
              :class="{
                'text-green-600': warnRuleMatch.level === 'Ⅰ级',
                'text-yellow-600': warnRuleMatch.level === 'Ⅱ级',
                'text-red-600': warnRuleMatch.level === 'Ⅲ级',
              }"
            >
              {{ warnRuleMatch.level }}
            </span>
          </div>
          <div class="warn-conditions">
            <div class="condition-item" v-for="(condition, index) in warnRuleMatch.conditions" :key="index">
              <span class="condition-name">{{ condition.name }}:</span>
              <span class="condition-value">{{ condition.value }}</span>
              <span class="condition-threshold">(阈值: {{ condition.threshold }})</span>
              <span 
                class="condition-result"
                :class="condition.result === '正常' ? 'text-green-600' : 'text-red-600'"
              >
                {{ condition.result }}
              </span>
            </div>
          </div>
          <div class="warn-suggestion">
            <span class="suggestion-label">建议:</span>
            <span class="suggestion-text">{{ warnRuleMatch.suggestion }}</span>
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
    width: 140px; // 小屏适配"预警等级阈值"等长标签
  }

  .detail-card {
    min-height: 600px;
    max-height: 80vh;
    padding: 15px;
  }

  .chart-item {
    height: 200px;
  }
}

.detail-card {
  min-height: 800px; // 增加高度以容纳更多内容
  max-height: 85vh; // 提高最大高度，容纳更多内容
  padding: 20px;
  overflow-y: auto; // 内容过多时显示滚动条
  background-color: #f9fafb;
  border-radius: 8px;
}

// 详情区块样式
.detail-section {
  margin-bottom: 30px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

// 区块标题样式
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
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

// 图表容器样式
.chart-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 图表项样式
.chart-item {
  width: 100%;
  height: 250px;
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

// 设备信息容器样式
.device-info-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

// 设备信息项样式
.device-info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

// 设备信息标签样式
.device-info-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

// 设备信息值样式
.device-info-value {
  font-size: 14px;
  color: #303133;
}

// 历史数据表格容器样式
.history-table-container {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

// 历史数据表格样式
.history-table {
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
  }
  
  th {
    background-color: #f9fafb;
    font-weight: 600;
    color: #303133;
  }
  
  tr:hover {
    background-color: #f5f7fa;
  }
}

// 预警规则容器样式
.warn-rule-container {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  .warn-level {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .warn-level-label {
    font-weight: 500;
    color: #606266;
    margin-right: 10px;
  }
  
  .warn-level-value {
    font-weight: 600;
    font-size: 16px;
  }
  
  .warn-conditions {
    margin-bottom: 15px;
  }
  
  .condition-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    gap: 10px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .condition-name {
    font-weight: 500;
    color: #606266;
    min-width: 80px;
  }
  
  .condition-value {
    font-weight: 600;
    color: #303133;
  }
  
  .condition-threshold {
    color: #909399;
    font-size: 13px;
  }
  
  .condition-result {
    font-weight: 600;
    margin-left: auto;
  }
  
  .warn-suggestion {
    padding-top: 10px;
    border-top: 1px solid #f0f0f0;
  }
  
  .suggestion-label {
    font-weight: 500;
    color: #606266;
    margin-right: 10px;
  }
  
  .suggestion-text {
    color: #303133;
    line-height: 1.4;
  }
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
