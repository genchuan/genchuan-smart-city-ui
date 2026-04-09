<!-- orderReport/table/OrderReportChart.vue -->
<template>
  <div class="charging-pile-visualization">
    <!-- 卡片区域（与充电桩完全一致） -->
    <div class="cards-section">
      <div
        v-for="card in cards"
        :key="card.key"
        class="stat-card"
        :style="{ borderLeftColor: card.color }"
        @click="handleCardClick(card.key)"
      >
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <div class="card-indicator" :style="{ backgroundColor: card.color }"></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: card.color }">
            {{ formatCardValue(card.key, cardData[card.key]) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域：折线图 + 柱状图 -->
    <div class="charts-section">
      <div class="chart-item">
        <div ref="lineChartRef" class="chart-container"></div>
      </div>
      <div class="chart-item">
        <div ref="barChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted, ref, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getChartData } from '#/api/genchuan/industry/energyCharging/carCharging/chargingOrder/orderReport/index.js';

const emit = defineEmits(['drill-down']);

// 卡片数据
const cardData = reactive({
  totalOrderCount: 0,
  totalTradeAmount: 0,
  abnormalRate: '0%',
  refundRate: '0%',
});

const cards = ref([
  { title: '总订单数', key: 'totalOrderCount', color: '#4A90E2', filterType: 'total' },
  { title: '交易金额', key: 'totalTradeAmount', color: '#67C23A', filterType: 'amount' },
  { title: '异常订单率', key: 'abnormalRate', color: '#F56C6C', filterType: 'abnormal' },
  { title: '退款率', key: 'refundRate', color: '#E6A23C', filterType: 'refund' },
]);

const lineData = ref([]);
const barData = ref([]);

const lineChartRef = ref(null);
const barChartRef = ref(null);
let lineChartInstance = null;
let barChartInstance = null;

const formatCardValue = (key, val) => {
  if (key === 'totalTradeAmount') {
    return `¥${(val / 100).toFixed(2)}`;
  }
  return val ?? 0;
};

const fetchChartData = async (params = {}) => {
  try {
    const res = await getChartData(params);
    const { lineData: line, barData: bar, cardData: card } = res;
    lineData.value = line || [];
    barData.value = bar || [];
    cardData.totalOrderCount = card?.totalOrderCount || 0;
    cardData.totalTradeAmount = card?.totalTradeAmount || 0;
    const totalOrder = card?.totalOrderCount || 1;
    cardData.abnormalRate = card?.totalAbnormalCount
      ? `${((card.totalAbnormalCount / totalOrder) * 100).toFixed(2)}%`
      : '0%';
    cardData.refundRate = card?.totalRefundCount
      ? `${((card.totalRefundCount / totalOrder) * 100).toFixed(2)}%`
      : '0%';
    updateCharts();
  } catch (error) {
    console.error('获取图表数据失败', error);
  }
};

const getLineOption = () => {
  const xAxisData = lineData.value.map(item => item.date);
  const orderCountData = lineData.value.map(item => item.orderCount);
  const tradeAmountData = lineData.value.map(item => item.tradeAmount);
  if (xAxisData.length === 0) {
    return {
      backgroundColor: 'transparent',
      title: { text: '暂无数据', left: 'center', top: 'center', textStyle: { color: '#999' } },
      xAxis: { show: false },
      yAxis: { show: false },
      series: [],
    };
  }
  return {
    backgroundColor: 'transparent',
    title: {
      text: '订单数量 & 交易金额趋势',
      left: 'center',
      top: 5,
      textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    legend: { data: ['订单数量', '交易金额(元)'], bottom: 0 },
    grid: { left: '8%', right: '8%', top: '18%', bottom: '12%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: { color: '#9AA8B7', fontSize: 11, rotate: xAxisData.length > 7 ? 25 : 0 },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
    },
    yAxis: [
      {
        type: 'value',
        name: '订单数量',
        nameTextStyle: { color: '#9AA8B7', fontSize: 11 },
        axisLabel: { color: '#9AA8B7' },
        splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
      },
      {
        type: 'value',
        name: '交易金额(元)',
        nameTextStyle: { color: '#9AA8B7', fontSize: 11 },
        axisLabel: { color: '#9AA8B7' },
      },
    ],
    series: [
      {
        name: '订单数量',
        type: 'line',
        data: orderCountData,
        smooth: true,
        lineStyle: { width: 3, color: '#4A90E2' },
        symbol: 'circle',
        symbolSize: 6,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
            { offset: 1, color: 'rgba(74, 144, 226, 0.05)' },
          ]),
        },
        itemStyle: { color: '#4A90E2' },
      },
      {
        name: '交易金额(元)',
        type: 'line',
        data: tradeAmountData,
        smooth: true,
        lineStyle: { width: 3, color: '#67C23A' },
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 6,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.05)' },
          ]),
        },
        itemStyle: { color: '#67C23A' },
      },
    ],
  };
};

const getBarOption = () => {
  const xAxisData = barData.value.map(item => item.date);
  const abnormalData = barData.value.map(item => item.abnormalCount);
  const refundData = barData.value.map(item => item.refundCount);
  if (xAxisData.length === 0) {
    return {
      backgroundColor: 'transparent',
      title: { text: '暂无数据', left: 'center', top: 'center', textStyle: { color: '#999' } },
      xAxis: { show: false },
      yAxis: { show: false },
      series: [],
    };
  }
  return {
    backgroundColor: 'transparent',
    title: {
      text: '异常订单 & 退款数量',
      left: 'center',
      top: 5,
      textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    legend: { data: ['异常订单数', '退款订单数'], bottom: 0 },
    grid: { left: '8%', right: '5%', top: '18%', bottom: '12%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: { color: '#9AA8B7', fontSize: 11, rotate: xAxisData.length > 7 ? 25 : 0 },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
    },
    yAxis: {
      type: 'value',
      name: '数量',
      nameTextStyle: { color: '#9AA8B7', fontSize: 11 },
      axisLabel: { color: '#9AA8B7' },
      splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
    },
    series: [
      {
        name: '异常订单数',
        type: 'bar',
        data: abnormalData,
        itemStyle: { borderRadius: [4, 4, 0, 0], color: '#F56C6C' },
        label: { show: true, position: 'top', color: '#F56C6C', fontSize: 12 },
      },
      {
        name: '退款订单数',
        type: 'bar',
        data: refundData,
        itemStyle: { borderRadius: [4, 4, 0, 0], color: '#E6A23C' },
        label: { show: true, position: 'top', color: '#E6A23C', fontSize: 12 },
      },
    ],
  };
};

const updateLineChart = () => {
  if (!lineChartRef.value) return;
  if (!lineChartInstance) {
    lineChartInstance = echarts.init(lineChartRef.value);
    lineChartInstance.off('click');
    lineChartInstance.on('click', (params) => {
      if (params.componentType === 'series' && params.dataIndex !== undefined) {
        const date = lineData.value[params.dataIndex]?.date;
        if (date) emit('drill-down', { type: 'line', data: { date } });
      }
    });
  }
  lineChartInstance.setOption(getLineOption(), true);
  lineChartInstance.resize();
};

const updateBarChart = () => {
  if (!barChartRef.value) return;
  if (!barChartInstance) {
    barChartInstance = echarts.init(barChartRef.value);
    barChartInstance.off('click');
    barChartInstance.on('click', (params) => {
      if (params.componentType === 'series' && params.dataIndex !== undefined) {
        const date = barData.value[params.dataIndex]?.date;
        if (date) emit('drill-down', { type: 'bar', data: { date } });
      }
    });
  }
  barChartInstance.setOption(getBarOption(), true);
  barChartInstance.resize();
};

const updateCharts = () => {
  updateLineChart();
  updateBarChart();
};

const handleCardClick = (key) => {
  const card = cards.value.find(c => c.key === key);
  if (!card) return;
  emit('drill-down', {
    type: 'card',
    data: { filterType: card.filterType },
  });
};

let resizeTimer = null;
const handleResize = () => {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    lineChartInstance?.resize();
    barChartInstance?.resize();
  }, 100);
};

onMounted(() => {
  nextTick(() => {
    fetchChartData();
    window.addEventListener('resize', handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  lineChartInstance?.dispose();
  barChartInstance?.dispose();
  if (resizeTimer) clearTimeout(resizeTimer);
});

defineExpose({ fetchChartData });
</script>

<style scoped lang="scss">
/* 完全复用充电桩图表样式，无额外自定义 */
.charging-pile-visualization {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  width: 100%;
  height: auto;
  min-height: 340px;
  overflow: hidden;
}
.cards-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  flex-shrink: 0;
  width: 260px;
  height: 340px;
}
.stat-card {
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: #fff;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.card-title {
  font-size: 13px;
  color: #6e7e91;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
}
.card-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}
.charts-section {
  flex: 1;
  display: flex;
  gap: 20px;
  min-width: 0;
  height: 340px;
}
.chart-item {
  flex: 1;
  min-width: 0;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
