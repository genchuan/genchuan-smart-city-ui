<!-- ==================== chart.vue ==================== -->
<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { getDeviceControlChart } from '#/api/genchuan/industry/industrialpark/energyMgmt/energyControl/deviceControl/index.js';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['refresh']);

const state = reactive({
  cardList: [
    { title: '管控设备总数', value: 0, color: '#4A90E2', key: 'totalDevices' },
    { title: '平均能耗下降值(kWh)', value: 0, color: '#50E3C2', key: 'avgDownEnergy' },
    { title: '节能率(%)', value: 0, color: '#F5A623', key: 'saveRate' },
    { title: '总节约能耗(kWh)', value: 0, color: '#D0024B', key: 'totalSaveEnergy' },
  ],
  deviceEnergyBarData: [],
  downEnergyBarData: [],
  deviceTypePieData: [],
});

const energyBarChartRef = ref(null);
const downEnergyBarChartRef = ref(null);
const typePieChartRef = ref(null);
let energyBarChart = null;
let downEnergyBarChart = null;
let typePieChart = null;

const fetchChartData = async () => {
  try {
    // 根据需求，默认请求近30天数据，格式可根据后端调整
    const data = await getDeviceControlChart({ timeRange: '近30天' });
    if (data) {
      state.cardList[0].value = data.totalDevices ?? 0;
      state.cardList[1].value = (data.avgDownEnergy ?? 0).toFixed(1);
      state.cardList[2].value = (data.saveRate ?? 0).toFixed(1);
      state.cardList[3].value = (data.totalSaveEnergy ?? 0).toFixed(1);

      state.deviceEnergyBarData = data.deviceEnergyBar || [];
      state.downEnergyBarData = data.downEnergyBar || [];
      state.deviceTypePieData = data.deviceTypePie || [];
      initCharts();
    }
  } catch (error) {
    console.error('获取高能耗设备管控态势失败', error);
    ElMessage.error('加载图表失败');
  }
};

const getBarOption = (data, title, yAxisName, color = '#4A90E2') => ({
  backgroundColor: 'transparent',
  title: {
    text: title,
    left: 'center',
    top: 5,
    textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: {
    left: '10%',
    right: '8%',
    top: '20%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: data.map(item => item.name),
    axisLabel: {
      rotate: 30,
      interval: 0,
      fontSize: 11,
      margin: 12,
    },
    axisLine: { lineStyle: { color: '#ccc' } },
  },
  yAxis: {
    type: 'value',
    name: yAxisName,
    nameLocation: 'middle',
    nameGap: 45,
    axisLabel: { fontSize: 11 },
    splitLine: { lineStyle: { type: 'dashed', color: '#e0e0e0' } },
  },
  series: [{
    type: 'bar',
    data: data.map(item => item.value),
    itemStyle: { color: color, borderRadius: [4, 4, 0, 0] },
    label: { show: true, position: 'top', fontSize: 10, formatter: '{c}' },
    barWidth: '60%',
  }],
});

const getPieOption = (data, title) => ({
  backgroundColor: 'transparent',
  title: {
    text: title,
    left: 'center',
    top: 5,
    textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle',
    textStyle: { fontSize: 12 },
    itemWidth: 10,
    itemHeight: 10,
  },
  series: [{
    type: 'pie',
    radius: ['40%', '65%'],
    center: ['55%', '55%'],
    data: data,
    emphasis: { scale: true },
    label: { show: true, formatter: '{b}', position: 'outside', fontSize: 11 },
    labelLine: { length: 8, length2: 8, smooth: true },
  }],
});

const initCharts = () => {
  if (energyBarChartRef.value) {
    if (energyBarChart) energyBarChart.dispose();
    energyBarChart = echarts.init(energyBarChartRef.value);
    energyBarChart.setOption(getBarOption(state.deviceEnergyBarData, '各设备能耗值', '能耗(kWh)', '#4A90E2'));
    // 柱状图钻取：点击后筛选对应设备的管控明细
    energyBarChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const deviceName = params.name;
        if (deviceName) emit('refresh', { deviceName });
      }
    });
  }
  if (downEnergyBarChartRef.value) {
    if (downEnergyBarChart) downEnergyBarChart.dispose();
    downEnergyBarChart = echarts.init(downEnergyBarChartRef.value);
    downEnergyBarChart.setOption(getBarOption(state.downEnergyBarData, '管控后能耗下降值', '能耗下降值(kWh)', '#50E3C2'));
    // 柱状图钻取：点击后筛选对应设备的管控明细
    downEnergyBarChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const deviceName = params.name;
        if (deviceName) emit('refresh', { deviceName });
      }
    });
  }
  if (typePieChartRef.value) {
    if (typePieChart) typePieChart.dispose();
    typePieChart = echarts.init(typePieChartRef.value);
    typePieChart.setOption(getPieOption(state.deviceTypePieData, '高能耗设备类型占比'));
    // 饼图钻取：点击扇区筛选对应设备类型的明细
    typePieChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const deviceType = params.name;
        if (deviceType) emit('refresh', { deviceType });
      }
    });
  }
};

const handleCardClick = (index) => {
  // 卡片点击均刷新图表数据或可触发列表刷新（此处简单刷新图表，保留原逻辑）
  const card = state.cardList[index];
  if (card.key === 'totalDevices') {
    emit('refresh', {});
  } else {
    emit('refresh', {});
  }
};

const refresh = () => { fetchChartData(); };
defineExpose({ refresh });

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('device-stats-refresh', refresh);
    window.addEventListener('resize', () => {
      energyBarChart?.resize();
      downEnergyBarChart?.resize();
      typePieChart?.resize();
    });
  });
});

onUnmounted(() => {
  window.removeEventListener('device-stats-refresh', refresh);
  energyBarChart?.dispose();
  downEnergyBarChart?.dispose();
  typePieChart?.dispose();
});
</script>

<template>
  <div class="stats-four-visualization">
    <div class="cards-section">
      <div
        v-for="(card, index) in state.cardList"
        :key="index"
        class="stat-card"
        :style="{ borderLeftColor: card.color, cursor: 'pointer' }"
        @click="handleCardClick(index)"
      >
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <div class="card-indicator" :style="{ backgroundColor: card.color }"></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: card.color }">{{ card.value }}</div>
        </div>
      </div>
    </div>
    <div class="middle-charts">
      <div class="chart-box">
        <div ref="energyBarChartRef" class="chart-container"></div>
      </div>
      <div class="chart-box">
        <div ref="downEnergyBarChartRef" class="chart-container"></div>
      </div>
      <div class="chart-box">
        <div ref="typePieChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-four-visualization {
  display: flex;
  gap: 20px;
  width: 100%;
  height: 320px;
  min-height: 0;
}
.cards-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 260px;
  flex-shrink: 0;
  height: 100%;
}
.stat-card {
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.2s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}
.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.card-title {
  font-size: 13px;
  color: #6e7e91;
  font-weight: 600;
}
.card-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.card-body {
  flex: 1;
  display: flex;
  align-items: center;
}
.card-value {
  font-size: 22px;
  font-weight: 700;
}
.middle-charts {
  flex: 1;
  display: flex;
  gap: 16px;
  min-width: 0;
  height: 100%;
}
.chart-box {
  flex: 1;
  background-color: var(--el-bg-color, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.chart-container {
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 0;
}
</style>
