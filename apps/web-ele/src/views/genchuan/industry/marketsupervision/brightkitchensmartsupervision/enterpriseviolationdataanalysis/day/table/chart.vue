<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { getViolationAnalyticsPage } from '#/api/genchuan/industry/marketsupervision/index.js';
import * as echarts from 'echarts';
import { ElOption, ElSelect } from 'element-plus';

const state = reactive({
  cardList: [
    { title: '企业总数', value: 156, color: '#4A90E2' },
    { title: '低风险企业数', value: 98, color: '#50E3C2' },
    { title: '中风险企业数', value: 42, color: '#FF9F40' },
    { title: '高风险企业数', value: 16, color: '#FF6B8B' },
    { title: '平均整改完成率', value: '87.5%', color: '#A17FE0' },
    { title: '整体违规频次', value: 234, color: '#FFD93D' },
  ],
  mapConfig: {
    markerIcons: {
      normal: '/static/imgs/dataHub/map/marker-blue.png',
      yellow: '/static/imgs/dataHub/map/marker-yellow.png',
      red: '/static/imgs/dataHub/map/marker-red.png',
    },
    statusIconMap: {
      green: 'normal',
      orange: 'yellow',
      red: 'red',
      blue: 'normal',
      gray: 'normal',
    },
    statusKeyMap: {
      正常: 'green',
      异常: 'red',
      离线: 'red',
      维护中: 'orange',
      停用: 'red',
      建设中: 'gray',
    },
    infoWindowConfig: {
      title: 'locationName',
      fields: [
        { key: 'id', label: '井盖编号' },
        { key: 'statusName', label: '状态', bold: true },
        { key: 'riskLevel', label: '风险等级' },
      ],
    },
  },
});

// 图表引用
const barChartRef = ref(null);
const lineChartRef = ref(null);
const pieChartRef = ref(null);
let barChartInstance = null;
let lineChartInstance = null;
let pieChartInstance = null;

// 图表数据
const chartData = ref({
  xAxis: [],
  barData: [],
  lineData: [],
  pieData: [],
});

// 获取接口数据
const fetchData = async () => {
  const data = await getViolationAnalyticsPage({ pageNo: 1, pageSize: 10 });
 
  const list = data.list;
  
  // 处理数据
  const xAxis = list.map(item => item.entName);
  const barData = list.map(item => item.violationCount);
  const lineData = list.map(item => item.violationCount);
  const pieData = list.map(item => ({
    name: item.entName,
    value: item.violationCount,
  }));
  
  chartData.value = {
    xAxis,
    barData,
    lineData,
    pieData,
  };
  
  // 更新图表
  updateCharts();
};

// 更新图表
const updateCharts = () => {
  // 更新柱状图
  if (barChartInstance) {
    barChartInstance.setOption({
      xAxis: [
        {
          data: chartData.value.xAxis,
        },
      ],
      series: [
        { name: '违规次数', data: chartData.value.barData },
      ],
    });
  }
  // 更新折线图
  if (lineChartInstance) {
    lineChartInstance.setOption({
      xAxis: [
        {
          data: chartData.value.xAxis,
        },
      ],
      series: [
        { name: '违规次数', data: chartData.value.lineData },
      ],
    });
  }
  // 更新圆环图
  if (pieChartInstance) {
    pieChartInstance.setOption({
      series: [
        {
          data: chartData.value.pieData,
        },
      ],
    });
  }
};





// 获取柱状图配置
const getBarOption = () => {
  const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B'];

  return {
    backgroundColor: 'transparent',
    title: {
      text: '违规次数',
      left: 'center',
      top: 5,
      textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 500 },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
    },
    color: freshColors,
    legend: {
      data: ['违规次数'],
      bottom: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '40px',
      containLabel: true,
      backgroundColor: 'transparent',
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        data: chartData.value.xAxis,
        axisLabel: {
          color: '#9AA8B7',
          fontSize: 11,
          rotate: chartData.value.xAxis.length > 8 ? 30 : 0,
        },
        axisLine: { lineStyle: { color: '#E8F4FD' } },
        axisTick: { lineStyle: { color: '#E8F4FD' } },
        splitLine: { show: false },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '违规次数',
        position: 'left',
        axisLabel: {
          color: '#9AA8B7',
          fontSize: 11,
          formatter: '{value}',
        },
        axisLine: { lineStyle: { color: '#E8F4FD' } },
        axisTick: { lineStyle: { color: '#E8F4FD' } },
        splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
      },
    ],
    series: [
      {
        name: '违规次数',
        type: 'bar',
        data: chartData.value.barData,
        yAxisIndex: 0,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: freshColors[0],
        },
        label: {
          show: true,
          position: 'top',
          color: '#6E7E91',
          fontSize: 12,
          formatter: '{c}',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(74, 144, 226, 0.3)',
          },
          label: { show: true, fontSize: 14, fontWeight: 'bold' },
        },
      },
    ],
  };
};

// 获取折线图配置
const getLineOption = () => {
  const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B'];

  return {
    backgroundColor: 'transparent',
    title: {
      text: '企业违规次数',
      left: 'center',
      top: 5,
      textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 500 },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
    },
    color: freshColors,
    legend: {
      data: ['违规次数'],
      bottom: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '40px',
      containLabel: true,
      backgroundColor: 'transparent',
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        data: chartData.value.xAxis,
        axisLabel: {
          color: '#9AA8B7',
          fontSize: 11,
          rotate: chartData.value.xAxis.length > 8 ? 30 : 0,
        },
        axisLine: { lineStyle: { color: '#E8F4FD' } },
        axisTick: { lineStyle: { color: '#E8F4FD' } },
        splitLine: { show: false },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '违规次数',
        position: 'left',
        axisLabel: {
          color: '#9AA8B7',
          fontSize: 11,
          formatter: '{value}',
        },
        axisLine: { lineStyle: { color: '#E8F4FD' } },
        axisTick: { lineStyle: { color: '#E8F4FD' } },
        splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
      },
    ],
    series: [
      {
        name: '违规次数',
        type: 'line',
        data: chartData.value.lineData,
        yAxisIndex: 0,
        itemStyle: {
          color: freshColors[1],
        },
        smooth: true,
        lineStyle: { width: 3, color: freshColors[1] },
        symbol: 'circle',
        symbolSize: 6,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(74, 144, 226, 0.3)',
          },
          label: { show: true, fontSize: 14, fontWeight: 'bold' },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
            { offset: 1, color: 'rgba(74, 144, 226, 0.05)' },
          ]),
        },
      },
    ],
  };
};

// 获取圆环图配置
const getPieOption = () => {
  const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B', '#FFD93D', '#FF6B8B', '#A17FE0', '#FF9F40', '#50E3C2'];

  return {
    backgroundColor: 'transparent',
    title: {
      text: '企业违规次数占比',
      left: 'center',
      top: 5,
      textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 500 },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
      formatter: '{b}: {c} 次 ({d}%)',
    },
    color: freshColors,
    legend: {
      data: chartData.value.pieData.map(item => item.name),
      bottom: 10,
      orient: 'horizontal',
      textStyle: {
        fontSize: 11,
        color: '#6E7E91',
      },
    },
    series: [
      {
        name: '违规次数占比',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: chartData.value.pieData,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {d}%',
          color: '#6E7E91',
          fontSize: 11,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
      },
    ],
  };
};

// 初始化柱状图
const initBarChart = async () => {
  if (!barChartRef.value) return;
  try {
    if (barChartInstance) {
      barChartInstance.dispose();
      barChartInstance = null;
    }
    // 先获取数据
    await fetchData();
    // 再初始化图表
    barChartInstance = echarts.init(barChartRef.value);
    const option = getBarOption();
    barChartInstance.setOption(option, true);
  } catch (error) {
    console.error('初始化柱状图失败:', error);
  }
};

// 初始化折线图
const initLineChart = async () => {
  if (!lineChartRef.value) return;
  try {
    if (lineChartInstance) {
      lineChartInstance.dispose();
      lineChartInstance = null;
    }
    // 先获取数据
    await fetchData();
    // 再初始化图表
    lineChartInstance = echarts.init(lineChartRef.value);
    const option = getLineOption();
    lineChartInstance.setOption(option, true);
  } catch (error) {
    console.error('初始化折线图失败:', error);
  }
};

// 初始化圆环图
const initPieChart = async () => {
  if (!pieChartRef.value) return;
  try {
    if (pieChartInstance) {
      pieChartInstance.dispose();
      pieChartInstance = null;
    }
    // 先获取数据
    await fetchData();
    // 再初始化图表
    pieChartInstance = echarts.init(pieChartRef.value);
    const option = getPieOption();
    pieChartInstance.setOption(option, true);
  } catch (error) {
    console.error('初始化圆环图失败:', error);
  }
};

// 初始化所有图表（增加延迟确保DOM挂载）
const initCharts = () => {
  // 增加少量延迟，确保DOM完全渲染
  setTimeout(() => {
    initBarChart();
    initLineChart();
    initPieChart();
  }, 100);
};

// 处理窗口大小变化
const handleResize = () => {
  setTimeout(() => {
    // 防抖
    barChartInstance?.resize();
    lineChartInstance?.resize();
    pieChartInstance?.resize();
  }, 100);
};

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (barChartInstance) {
    barChartInstance.dispose();
  }
  if (lineChartInstance) {
    lineChartInstance.dispose();
  }
  if (pieChartInstance) {
    pieChartInstance.dispose();
  }
});
</script>

<template>
  <div class="stats-four-visualization">
    <!-- 卡片区 -->
    <!--  
    <div class="cards-section">
      <div
        v-for="(card, index) in state.cardList"
        :key="`card-${index}`"
        class="stat-card"
        :style="{ borderLeftColor: card.color || '#4A90E2' }"
      >
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <div
            class="card-indicator"
            :style="{ backgroundColor: card.color || '#4A90E2' }"
          ></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: card.color || '#4A90E2' }">
            {{ card.value }}
          </div>
        </div>
      </div>
    </div>
    -->
    <!-- 右侧展示区 -->
    <div class="right-section">
      <div class="charts-section">
        <!-- 柱状图 -->
        <div class="bar-chart-area">
          <div ref="barChartRef" class="chart-container"></div>
        </div>
        <!-- 折线图 -->
        <div class="line-chart-area">
          <div ref="lineChartRef" class="chart-container"></div>
        </div>
        <!-- 圆环图 -->
        <div class="pie-chart-area">
          <div ref="pieChartRef" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-four-visualization {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  width: 100%;
  height: auto;
  min-height: 320px;
  padding: 10px; /* 加内边距避免溢出 */
  box-sizing: border-box; /* 包含内边距 */
}

/* 卡片区样式 */
.cards-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  flex-shrink: 0;
  gap: 12px;
  width: 260px;
  height: 320px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  padding: 12px 14px; 
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 4px;
}

/* 右侧展示区样式 */
.right-section {
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  height: 320px;
}

/* 图表区样式 - 关键：修复flex布局宽度问题 */
.charts-section {
  display: flex;
  flex: 1;
  gap: 20px;
  min-width: 0;
  height: 100%; /* 确保高度继承 */
}

/* 圆环图区域 - 关键：移除min-width:0，固定最小宽度 */
.pie-chart-area {
  position: relative;
  flex: 1;
  min-width: 200px; /* 给最小宽度，避免echarts无法渲染 */
  height: 100%;
}

.chart-select-wrapper {
  position: absolute;
  top: 8px;
  left: 10px;
  z-index: 10;
}

.chart-select {
  width: 90px;
}

.chart-select :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.chart-select :deep(.el-input__inner) {
  font-size: 12px;
}

.chart-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box; /* 包含内边距 */
}

/* 柱状图区域 */
.bar-chart-area {
  position: relative;
  flex: 1;
  min-width: 300px; /* 给最小宽度 */
  height: 100%;
}

/* 折线图区域 */
.line-chart-area {
  position: relative;
  flex: 1;
  min-width: 300px; /* 给最小宽度 */
  height: 100%;
}

/* 圆环图区域 */
.pie-chart-area {
  position: relative;
  flex: 1;
  min-width: 200px; /* 给最小宽度 */
  height: 100%;
}
</style>
