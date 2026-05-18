<!-- chart.vue -->
<!-- 路径: src/views/genchuan/industry/industrialPark/propertyMgmt/paymentMgmt/arrearsMgmt/table/chart.vue -->
<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { getArrearsChart } from '#/api/genchuan/industry/industrialpark/propertyMgmt/paymentMgmt/arrearsMgmt/index.js';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['refresh']);

const timeRangeOptions = [
  { label: '近7天', value: '近7天' },
  { label: '近30天', value: '近30天' },
  { label: '本月', value: '本月' },
];
const selectedTimeRange = ref('近30天');

const state = reactive({
  cardList: [
    { title: '欠费总户数', value: 0, color: '#4A90E2', key: 'arrearsCompanyCount', filter: {} },
    { title: '欠费总金额(元)', value: 0, color: '#D0024B', key: 'arrearsAmountTotal', filter: {} },
    { title: '补缴数', value: 0, color: '#50E3C2', key: 'repayCount', filter: { arrearsStatus: '已补缴' } },
    { title: '补缴率(%)', value: 0, color: '#9B59B6', key: 'repayRate', filter: {} },
  ],
  itemAmountData: [],      // 各类型欠费金额
  durationDistributionData: [] // 欠费时长分布
});

const itemAmountChartRef = ref(null);
const durationChartRef = ref(null);
let itemAmountChart = null;
let durationChart = null;

const fetchChartData = async () => {
  try {
    const data = await getArrearsChart({ timeRange: selectedTimeRange.value });
    if (data) {
      state.cardList[0].value = data.cardData?.arrearsCompanyCount ?? 0;
      state.cardList[1].value = (data.cardData?.arrearsAmountTotal ?? 0).toFixed(2);
      state.cardList[2].value = data.cardData?.repayCount ?? 0;
      state.cardList[3].value = (data.cardData?.repayRate ?? 0).toFixed(2);
      state.itemAmountData = data.barData?.itemAmount || [];
      state.durationDistributionData = data.barData?.durationDistribution || [];
      initBarCharts();
    }
  } catch (error) {
    console.error('获取物业欠费统计态势失败', error);
    ElMessage.error('加载图表失败');
  }
};

const getItemAmountOption = (data) => ({
  backgroundColor: 'transparent',
  title: { text: '各类型欠费金额', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}<br/>欠费金额：{c} 元' },
  xAxis: { type: 'category', data: data.map(item => item.item), axisLabel: { rotate: 30 } },
  yAxis: { type: 'value', name: '金额(元)' },
  series: [{
    data: data.map(item => item.amount),
    type: 'bar',
    barWidth: '50%',
    itemStyle: { color: '#4A90E2', borderRadius: [4,4,0,0] },
    label: { show: true, position: 'top', formatter: '{c}' }
  }]
});

const getDurationOption = (data) => ({
  backgroundColor: 'transparent',
  title: { text: '欠费时长分布', left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}<br/>欠费企业数：{c} 户' },
  xAxis: { type: 'category', data: data.map(item => item.duration), axisLabel: { rotate: 30 } },
  yAxis: { type: 'value', name: '企业数(户)' },
  series: [{
    data: data.map(item => item.count),
    type: 'bar',
    barWidth: '50%',
    itemStyle: { color: '#F5A623', borderRadius: [4,4,0,0] },
    label: { show: true, position: 'top', formatter: '{c}' }
  }]
});

const initBarCharts = () => {
  if (itemAmountChartRef.value) {
    if (itemAmountChart) itemAmountChart.dispose();
    itemAmountChart = echarts.init(itemAmountChartRef.value);
    itemAmountChart.setOption(getItemAmountOption(state.itemAmountData));
    itemAmountChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const itemName = state.itemAmountData[params.dataIndex]?.item;
        if (itemName) emit('refresh', { arrearsItem: itemName });
      }
    });
  }
  if (durationChartRef.value) {
    if (durationChart) durationChart.dispose();
    durationChart = echarts.init(durationChartRef.value);
    durationChart.setOption(getDurationOption(state.durationDistributionData));
    durationChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const durationRange = state.durationDistributionData[params.dataIndex]?.duration;
        if (durationRange) emit('refresh', { arrearsDurationRange: durationRange });
      }
    });
  }
};

const handleCardClick = (index) => {
  const card = state.cardList[index];
  let filter = {};
  if (card.key === 'repayCount') filter = { arrearsStatus: '已补缴' };
  else if (card.key === 'arrearsCompanyCount') filter = {};
  else if (card.key === 'arrearsAmountTotal') filter = {};
  else if (card.key === 'repayRate') filter = {};
  emit('refresh', filter);
};

const refresh = () => { fetchChartData(); };
defineExpose({ refresh });

watch(selectedTimeRange, () => {
  fetchChartData();
});

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('arrears-stats-refresh', refresh);
    window.addEventListener('resize', () => {
      itemAmountChart?.resize();
      durationChart?.resize();
    });
  });
});

onUnmounted(() => {
  window.removeEventListener('arrears-stats-refresh', refresh);
  itemAmountChart?.dispose();
  durationChart?.dispose();
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
      <div class="chart-time-selector">
        <el-select v-model="selectedTimeRange" placeholder="时间范围" size="small" style="width: 110px">
          <el-option v-for="item in timeRangeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="charts-container">
        <div class="chart-box">
          <div ref="itemAmountChartRef" class="chart-container"></div>
        </div>
        <div class="chart-box">
          <div ref="durationChartRef" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-four-visualization {
  display: flex;
  gap: 20px;
  width: 100%;
  min-height: 320px;
}
.cards-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 260px;
  flex-shrink: 0;
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
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.chart-time-selector {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}
.charts-container {
  flex: 1;
  display: flex;
  gap: 16px;
  min-height: 0;
  width: 100%;
}
.chart-box {
  flex: 1;
  background-color: var(--el-bg-color, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1;
}
</style>
