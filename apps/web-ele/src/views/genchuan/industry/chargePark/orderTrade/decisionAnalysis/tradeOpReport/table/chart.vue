<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { decisionAnalysisChart } from '#/api/genchuan/industry/chargePark/orderTrade/decisionAnalysis/index.js';
import { ElMessage } from 'element-plus';
import Card from '#/components/stats/card.vue';

// 图表实例
const lineChartRef = ref(null);
const barChartRef = ref(null);
const pieChartRef = ref(null);

let lineChart = null;
let barChart = null;
let pieChart = null;

// 状态数据
const state = reactive({
  loading: false,
  cardList: [
    { title: '周期订单数', value: 0, color: '#FF6B6B' },
    { title: '周期营收', value: 0, color: '#4ECDC4', suffix: '元' },
    { title: '支付率', value: 0, color: '#13ce66', suffix: '%' },
    { title: '充电量', value: 0, color: '#4A90E2', suffix: '度' },
    { title: '借出量', value: 0, color: '#9B59B6', suffix: '次' },
    { title: '退款金额', value: 0, color: '#E67E22', suffix: '元' },
    { title: '待处置异常数', value: 0, color: '#E74C3C' },
    { title: '追缴完成率', value: 0, color: '#3498DB', suffix: '%' },
    { title: '核算准确率', value: 0, color: '#1ABC9C', suffix: '%' },
  ],
  lineData: [],
  barData: [],
  pieData: [],
});

// 查询参数
const params = reactive({
  reportCycle: '年报',
  statTime: '2026-01-01 00:00:00-2026-12-31 00:00:00',
});

/** 获取图表数据 */
const fetchChartData = async () => {
  try {
    state.loading = true;
    const res = await decisionAnalysisChart(params);
    
    // 更新卡片数据
    if (res.cardData) {
      const cardKeyMap = [
        'cycleOrderCount', 'cycleRevenue', 'payRate', 'chargeQuantity', 'lendCount',
        'refundAmount', 'waitHandleAbnormalCount', 'collectCompleteRate', 'checkAccuracyRate'
      ];
      cardKeyMap.forEach((key, index) => {
        state.cardList[index].value = res.cardData[key] || 0;
      });
    }
    
    // 更新图表数据
    state.lineData = res.lineData || [];
    state.barData = res.barData || [];
    state.pieData = res.pieData || [];
    
    // 更新图表
    updateLineChart();
    updateBarChart();
    updatePieChart();
  } catch (error) {
    console.error('获取交易运营报表图表数据失败:', error);
    ElMessage.error('获取图表数据失败');
    // 接口调用失败时使用默认数据
    state.cardList[0].value = 0;
    state.cardList[1].value = 60;
    state.cardList[2].value = 0;
    state.cardList[3].value = 0;
    state.cardList[4].value = 0;
    state.cardList[5].value = 0;
    state.cardList[6].value = 0;
    state.cardList[7].value = 0;
    state.cardList[8].value = 0;
    
    // 使用mock数据
    state.lineData = [
      { name: '订单量趋势', data: [] },
      { name: '营收趋势', data: [60] },
      { name: '退款金额趋势', data: [] },
      { name: '异常订单趋势', data: [] },
    ];
    state.barData = [
      { name: '各类型订单量分布', data: [] },
      { name: '各场站订单量分布', data: [] },
    ];
    state.pieData = [
      { name: '订单状态占比', data: [] },
      { name: '支付方式占比', data: [{ name: 'wechat', value: 1 }, { value: 1 }] },
      { name: '异常类型占比', data: [] },
    ];
    
    updateLineChart();
    updateBarChart();
    updatePieChart();
  } finally {
    state.loading = false;
  }
};

/** 更新折线图 */
const updateLineChart = () => {
  if (!lineChart || !state.lineData.length) return;
  
  const series = state.lineData.map((item, index) => ({
    name: item.name,
    type: 'line',
    smooth: true,
    data: item.data || [],
    lineStyle: {
      width: 2,
    },
    itemStyle: {
      borderRadius: 4,
    },
    areaStyle: index === 1 ? {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
        { offset: 1, color: 'rgba(74, 144, 226, 0.05)' },
      ]),
    } : undefined,
  }));
  
  const option = {
    title: {
      text: '趋势分析',
      left: 'center',
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
    },
    legend: {
      data: state.lineData.map((item) => item.name),
      bottom: 0,
      textStyle: { color: '#6E7E91' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: state.lineData[0]?.data.map((_, i) => `第${i + 1}期`) || [],
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
      splitLine: { lineStyle: { color: '#F3F4F6' } },
    },
    series,
  };
  
  lineChart.setOption(option);
};

/** 更新柱状图 */
const updateBarChart = () => {
  if (!barChart || !state.barData.length) return;
  
  const series = state.barData.map((item) => ({
    name: item.name,
    type: 'bar',
    data: item.data || [],
    barWidth: '30%',
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
  }));
  
  const option = {
    title: {
      text: '分布分析',
      left: 'center',
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
    },
    legend: {
      data: state.barData.map((item) => item.name),
      bottom: 0,
      textStyle: { color: '#6E7E91' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: state.barData[0]?.data.map((_, i) => `项${i + 1}`) || [],
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6E7E91', fontSize: 12 },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
      splitLine: { lineStyle: { color: '#F3F4F6' } },
    },
    series,
  };
  
  barChart.setOption(option);
};

/** 更新饼图 */
const updatePieChart = () => {
  if (!pieChart || !state.pieData.length) return;
  
  const pieItem = state.pieData.find((item) => item.data && item.data.length);
  
  if (!pieItem) {
    pieChart.setOption({
      title: {
        text: '占比分析',
        left: 'center',
        textStyle: {
          color: '#6E7E91',
          fontSize: 14,
          fontWeight: 500,
        },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E8F4FD',
        borderWidth: 1,
        textStyle: { color: '#6E7E91' },
      },
      legend: {
        bottom: 0,
        textStyle: { color: '#6E7E91' },
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: [],
      }],
    });
    return;
  }
  
  const option = {
    title: {
      text: pieItem.name,
      left: 'center',
      textStyle: {
        color: '#6E7E91',
        fontSize: 14,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
    },
    legend: {
      bottom: 0,
      textStyle: { color: '#6E7E91' },
    },
    series: [{
      name: pieItem.name,
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: true,
        formatter: '{b}: {d}%',
        color: '#6E7E91',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      data: pieItem.data.map((item) => ({
        name: item.name || `未知${item.value}`,
        value: item.value,
      })),
    }],
  };
  
  pieChart.setOption(option);
};

/** 初始化图表 */
const initCharts = () => {
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value);
  }
  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value);
  }
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value);
  }
};

/** 窗口大小改变时重绘图表 */
const handleResize = () => {
  lineChart?.resize();
  barChart?.resize();
  pieChart?.resize();
};

onMounted(() => {
  initCharts();
  fetchChartData();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  lineChart?.dispose();
  barChart?.dispose();
  pieChart?.dispose();
});
</script>

<template>
  <div class="park-chart-box" v-loading="state.loading">
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <div class="chart-box-right"> 
      <div ref="pieChartRef" class="simple-bar-pie"></div>
      <div ref="lineChartRef" class="simple-bar-pie simple-bar-chart"></div>
      <div ref="barChartRef" class="simple-bar-pie simple-bar-chart"></div> 
    </div>
  </div>
</template>

<style scoped lang="scss">
.park-chart-box {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: hsl(var(--card));
  border-radius: 8px;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
}

.chart-box-left {
  width: 300px!important;
  display: flex;
  height: 340px;
  overflow: auto;
  gap: 16px;
  flex-shrink: 0;
  width: 60%; 
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    display: none;
  }

  .left-card {
    flex-shrink: 0;
    width: 300px!important;
  }

  @media (max-width: 1200px) {
    width: 100%;
  }
}

.chart-box-right {
  display: flex; 
  gap: 16px;
  flex: 1;
  max-height: 320px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.simple-bar-chart {
  width: 100%; 
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}
.simple-bar-pie {
  width: 300px!important;
}
</style>
