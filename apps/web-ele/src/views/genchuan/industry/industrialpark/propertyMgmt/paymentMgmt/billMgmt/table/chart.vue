<!-- chart.vue -->
<!-- 路径: src/views/genchuan/industry/industrialPark/propertyMgmt/paymentMgmt/billMgmt/table/chart.vue -->
<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { getBillChart } from '#/api/genchuan/industry/industrialPark/propertyMgmt/paymentMgmt/billMgmt/index.js';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['refresh']);

// 时间范围选项
const timeRangeOptions = [
  { label: '近7天', value: '近7天' },
  { label: '近30天', value: '近30天' },
  { label: '本月', value: '本月' },
];
const selectedTimeRange = ref('近30天');

const state = reactive({
  cardList: [
    { title: '账单总数', value: 0, color: '#4A90E2', key: 'billTotal', filter: {} },
    { title: '已缴数', value: 0, color: '#50E3C2', key: 'paidCount', filter: { billStatus: '已缴费' } },
    { title: '欠费数', value: 0, color: '#F5A623', key: 'arrearsCount', filter: { billStatus: '已欠费' } },
    { title: '营收总额(元)', value: 0, color: '#D0024B', key: 'incomeTotal', filter: {} },
    // { title: '缴费率(%)', value: 0, color: '#9B59B6', key: 'payRate', filter: {} },
  ],
  dailyPayTrendData: [],   // 每日缴费趋势
  incomeTrendData: [],     // 营收趋势
});

const payTrendChartRef = ref(null);
const incomeTrendChartRef = ref(null);
let payTrendChart = null;
let incomeTrendChart = null;

const fetchChartData = async () => {
  try {
    const data = await getBillChart({ timeRange: selectedTimeRange.value });
    if (data) {
      state.cardList[0].value = data.cardData?.billTotal ?? 0;
      state.cardList[1].value = data.cardData?.paidCount ?? 0;
      state.cardList[2].value = data.cardData?.arrearsCount ?? 0;
      state.cardList[3].value = (data.cardData?.incomeTotal ?? 0).toFixed(2);
      // state.cardList[4].value = (data.cardData?.payRate ?? 0).toFixed(2);
      state.dailyPayTrendData = data.lineData?.dailyPayTrend || [];
      state.incomeTrendData = data.lineData?.incomeTrend || [];
      initLineCharts();
    }
  } catch (error) {
    console.error('获取物业缴费态势失败', error);
    ElMessage.error('加载图表失败');
  }
};

const getPayLineOption = (data, title, yAxisName, lineColor) => ({
  backgroundColor: 'transparent',
  title: { text: title, left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', formatter: '{b}<br/>缴费笔数：{c} 笔' },
  xAxis: { type: 'category', data: data.map(item => item.date), axisLabel: { rotate: 30 } },
  yAxis: { type: 'value', name: yAxisName },
  series: [{
    data: data.map(item => item.count),
    type: 'line',
    smooth: true,
    lineStyle: { color: lineColor, width: 2 },
    areaStyle: { opacity: 0.1, color: lineColor },
    symbol: 'circle',
    symbolSize: 6,
  }],
});

const getIncomeLineOption = (data, title, yAxisName, lineColor) => ({
  backgroundColor: 'transparent',
  title: { text: title, left: 'center', top: 10, textStyle: { color: '#6E7E91', fontSize: 14 } },
  tooltip: { trigger: 'axis', formatter: '{b}<br/>营收金额：{c} 元' },
  xAxis: { type: 'category', data: data.map(item => item.date), axisLabel: { rotate: 30 } },
  yAxis: { type: 'value', name: yAxisName },
  series: [{
    data: data.map(item => item.amount),
    type: 'line',
    smooth: true,
    lineStyle: { color: lineColor, width: 2 },
    areaStyle: { opacity: 0.1, color: lineColor },
    symbol: 'circle',
    symbolSize: 6,
  }],
});

const initLineCharts = () => {
  if (payTrendChartRef.value) {
    if (payTrendChart) payTrendChart.dispose();
    payTrendChart = echarts.init(payTrendChartRef.value);
    payTrendChart.setOption(getPayLineOption(state.dailyPayTrendData, '每日缴费趋势', '缴费笔数', '#4A90E2'));
    payTrendChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const date = state.dailyPayTrendData[params.dataIndex]?.date;
        if (date) emit('refresh', { payTime: date });
      }
    });
  }
  if (incomeTrendChartRef.value) {
    if (incomeTrendChart) incomeTrendChart.dispose();
    incomeTrendChart = echarts.init(incomeTrendChartRef.value);
    incomeTrendChart.setOption(getIncomeLineOption(state.incomeTrendData, '每日营收趋势', '营收金额(元)', '#F5A623'));
    incomeTrendChart.on('click', (params) => {
      if (params.componentType === 'series') {
        const date = state.incomeTrendData[params.dataIndex]?.date;
        if (date) emit('refresh', { payTime: date });
      }
    });
  }
};

const handleCardClick = (index) => {
  const card = state.cardList[index];
  const filter = { ...card.filter };
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
    window.addEventListener('bill-stats-refresh', refresh);
    window.addEventListener('resize', () => {
      payTrendChart?.resize();
      incomeTrendChart?.resize();
    });
  });
});

onUnmounted(() => {
  window.removeEventListener('bill-stats-refresh', refresh);
  payTrendChart?.dispose();
  incomeTrendChart?.dispose();
});
</script>

<template>
  <div class="stats-four-visualization">
    <!-- 左侧卡片区域：纵向排列，与原示例完全一致 -->
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

    <!-- 右侧图表区域：两个折线图并列，时间筛选器绝对定位在右上角，不占用文档流高度 -->
    <div class="middle-charts">
      <!-- 时间筛选器：绝对定位，不影响布局高度 -->
      <div class="chart-time-selector">
        <el-select v-model="selectedTimeRange" placeholder="时间范围" size="small" style="width: 110px">
          <el-option v-for="item in timeRangeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="charts-container">
        <div class="chart-box">
          <div ref="payTrendChartRef" class="chart-container"></div>
        </div>
        <div class="chart-box">
          <div ref="incomeTrendChartRef" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 完全复用原示例布局，不改变任何高度、间距 */
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
  position: relative; /* 为绝对定位的筛选器提供参考 */
  display: flex;
  flex-direction: column;
  min-width: 0;
}
/* 时间筛选器绝对定位在右上角，不占用文档流高度 */
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
