<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';

import { getCycleReportChart } from '#/api/genchuan/industry/chargePark/vehiclePass/passReport/cycleReport';

const props = defineProps({
  parkId: { type: Number, default: null },
});

const cards = reactive([
  {
    title: '入场量',
    value: 0,
    desc: '累计入场车辆',
    color: '#4A90E2',
    key: 'entryCount',
  },
  {
    title: '离场量',
    value: 0,
    desc: '累计离场车辆',
    color: '#50E3C2',
    key: 'exitCount',
  },
  {
    title: '在停车辆数',
    value: 0,
    desc: '当前在停车辆',
    color: '#FF9F40',
    key: 'parkingCount',
  },
  {
    title: '识别成功率',
    value: '0%',
    desc: '识别准确度',
    color: '#9B59B6',
    key: 'identifySuccessRate',
  },
  {
    title: '核验成功率',
    value: '0%',
    desc: '核验准确度',
    color: '#E74C3C',
    key: 'verifySuccessRate',
  },
  {
    title: '异常处置率',
    value: '0%',
    desc: '异常处理率',
    color: '#F39C12',
    key: 'abnormalHandleRate',
  },
  {
    title: 'ETC通行成功率',
    value: '0%',
    desc: 'ETC通行率',
    color: '#1ABC9C',
    key: 'etcSuccessRate',
  },
]);

const state = reactive({
  chartData: {
    cardData: {},
    mapData: [],
    barData: [],
    lineData: [],
    pieData: [],
  },
  hasData: false,
});

const lineChartRef = ref(null);
const barChartRef = ref(null);
const pieChartRef = ref(null);
let lineChartInstance = null;
let barChartInstance = null;
let pieChartInstance = null;

async function loadChartData() {
  try {
    const params = {
      reportCycle: '日报',
      stationId: props.parkId,
      tenantId: 1, // TODO: 从用户信息获取
    };

    const res = await getCycleReportChart(params);

    // 更新卡片数据
    if (res?.cardData) {
      cards[0].value = res.cardData.entryCount || 0;
      cards[1].value = res.cardData.exitCount || 0;
      cards[2].value = res.cardData.parkingCount || 0;
      cards[3].value = res.cardData.identifySuccessRate
        ? `${res.cardData.identifySuccessRate}%`
        : '0%';
      cards[4].value = res.cardData.verifySuccessRate
        ? `${res.cardData.verifySuccessRate}%`
        : '0%';
      cards[5].value = res.cardData.abnormalHandleRate
        ? `${res.cardData.abnormalHandleRate}%`
        : '0%';
      cards[6].value = res.cardData.etcSuccessRate
        ? `${res.cardData.etcSuccessRate}%`
        : '0%';
    }

    // 检查是否有图表数据
    const hasChartData =
      res &&
      (res.lineData?.length > 0 ||
        res.barData?.length > 0 ||
        res.pieData?.length > 0);

    if (hasChartData) {
      state.chartData = {
        cardData: res.cardData || {},
        mapData: res.mapData || [],
        barData: res.barData || [],
        lineData: res.lineData || [],
        pieData: res.pieData || [],
      };
      state.hasData = true;
      initCharts();
    } else {
      state.hasData = false;
    }
  } catch (error) {
    console.error('加载图表数据失败:', error);
    state.hasData = false;
  }
}

function initLineChart() {
  if (!lineChartRef.value) return;
  if (lineChartInstance) lineChartInstance.dispose();
  lineChartInstance = echarts.init(lineChartRef.value);
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '通行量趋势',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    legend: {
      bottom: 10,
      data: ['入场量', '离场量', '识别成功率', '核验成功率'],
    },
    xAxis: {
      type: 'category',
      data: state.chartData.lineData.map((item) => item.date || item.time),
    },
    yAxis: [
      { type: 'value', name: '通行数量', position: 'left' },
      { type: 'value', name: '成功率(%)', position: 'right', max: 100 },
    ],
    series: [
      {
        name: '入场量',
        type: 'line',
        yAxisIndex: 0,
        data: state.chartData.lineData.map((item) => item.entryCount),
        smooth: true,
        lineStyle: { width: 3, color: '#4A90E2' },
        areaStyle: { color: 'rgba(74,144,226,0.1)' },
        symbol: 'circle',
        symbolSize: 6,
      },
      {
        name: '离场量',
        type: 'line',
        yAxisIndex: 0,
        data: state.chartData.lineData.map((item) => item.exitCount),
        smooth: true,
        lineStyle: { width: 3, color: '#50E3C2' },
        areaStyle: { color: 'rgba(80,227,194,0.1)' },
        symbol: 'circle',
        symbolSize: 6,
      },
      {
        name: '识别成功率',
        type: 'line',
        yAxisIndex: 1,
        data: state.chartData.lineData.map((item) => item.identifySuccessRate),
        smooth: true,
        lineStyle: { width: 2, color: '#9B59B6', type: 'dashed' },
        symbol: 'circle',
        symbolSize: 4,
      },
      {
        name: '核验成功率',
        type: 'line',
        yAxisIndex: 1,
        data: state.chartData.lineData.map((item) => item.verifySuccessRate),
        smooth: true,
        lineStyle: { width: 2, color: '#E74C3C', type: 'dashed' },
        symbol: 'circle',
        symbolSize: 4,
      },
    ],
  };
  lineChartInstance.setOption(option);

  // 添加折线图点击事件
  lineChartInstance.on('click', (params) => {
    const clickDate = new Date(params.name);
    const startTime = new Date(clickDate.setHours(0, 0, 0, 0)).getTime().toString();
    const endTime = new Date(clickDate.setHours(23, 59, 59, 999)).getTime().toString();
    const filterParams = { startTime, endTime };
    window.dispatchEvent(
      new CustomEvent('filterByChart:passOpReport', { detail: filterParams }),
    );
  });
}

function initBarChart() {
  if (!barChartRef.value) return;
  if (barChartInstance) barChartInstance.dispose();
  barChartInstance = echarts.init(barChartRef.value);
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '各场站通行量 / 各时段通行量',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 10, data: ['入场量', '离场量', 'ETC通行量'] },
    xAxis: {
      type: 'category',
      data: state.chartData.barData.map(
        (item) => item.name || item.hour || item.station,
      ),
    },
    yAxis: { type: 'value', name: '通行量' },
    series: [
      {
        name: '入场量',
        type: 'bar',
        data: state.chartData.barData.map((item) => item.entryCount),
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4A90E2' },
            { offset: 1, color: '#50E3C2' },
          ]),
        },
        label: { show: true, position: 'top' },
      },
      {
        name: '离场量',
        type: 'bar',
        data: state.chartData.barData.map((item) => item.exitCount),
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#50E3C2' },
            { offset: 1, color: '#1ABC9C' },
          ]),
        },
        label: { show: true, position: 'top' },
      },
      {
        name: 'ETC通行量',
        type: 'bar',
        data: state.chartData.barData.map((item) => item.etcCount),
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#1ABC9C' },
            { offset: 1, color: '#16A085' },
          ]),
        },
        label: { show: true, position: 'top' },
      },
    ],
  };
  barChartInstance.setOption(option);

  // 添加柱状图点击事件
  barChartInstance.on('click', (params) => {
    const filterParams = {
      station: params.name,
      dataType: params.seriesName, // '入场量', '离场量', 'ETC通行量'
    };
    window.dispatchEvent(
      new CustomEvent('filterByChart:passOpReport', { detail: filterParams }),
    );
  });
}

function initPieChart() {
  if (!pieChartRef.value) return;
  if (pieChartInstance) pieChartInstance.dispose();
  pieChartInstance = echarts.init(pieChartRef.value);
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '异常类型分布 / 通行方式分布',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
    legend: {
      bottom: 10,
      data: state.chartData.pieData.map((item) => item.name),
    },
    series: [
      {
        name: '分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}: {d}%',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        data: state.chartData.pieData,
      },
    ],
  };
  pieChartInstance.setOption(option);

  // 添加饼图点击事件
  pieChartInstance.on('click', (params) => {
    const filterParams = { category: params.name };
    window.dispatchEvent(
      new CustomEvent('filterByChart:passOpReport', { detail: filterParams }),
    );
  });
}

function initCharts() {
  initLineChart();
  initBarChart();
  initPieChart();
}

function handleCardClick(key) {
  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0)).getTime().toString();
  const todayEnd = new Date(today.setHours(23, 59, 59, 999)).getTime().toString();

  const filterMap = {
    entryCount: {
      recordType: '入场',
      startTime: todayStart,
      endTime: todayEnd,
    },
    exitCount: { recordType: '离场', startTime: todayStart, endTime: todayEnd },
    parkingCount: { parkStatus: '在停' },
    identifySuccessRate: { identifyStatus: '成功' },
    verifySuccessRate: { verifyStatus: '成功' },
    abnormalHandleRate: { handleStatus: '已处置' },
  };

  const filterParams = filterMap[key];
  if (filterParams) {
    window.dispatchEvent(
      new CustomEvent('filterByChart:passOpReport', { detail: filterParams }),
    );
  }
}

onMounted(() => {
  loadChartData();
  window.addEventListener('resize', () => {
    lineChartInstance?.resize();
    barChartInstance?.resize();
    pieChartInstance?.resize();
  });
});
onUnmounted(() => {
  lineChartInstance?.dispose();
  barChartInstance?.dispose();
  pieChartInstance?.dispose();
});
</script>

<template>
  <div class="chart-box">
    <!-- 左侧卡片区域 -->
    <div class="box-left">
      <div
        v-for="card in cards"
        :key="card.key"
        class="left-card"
        :style="{ borderLeftColor: card.color }"
        @click="handleCardClick(card.key)"
      >
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <div
            class="card-indicator"
            :style="{ backgroundColor: card.color }"
          ></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: card.color }">
            {{ card.value }}
          </div>
          <div class="card-desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧图表区域 -->
    <div v-if="state.hasData" class="chart-wrapper">
      <div class="chart-container">
        <div ref="lineChartRef" style="width: 100%; height: 100%"></div>
      </div>
      <div class="chart-container">
        <div ref="barChartRef" style="width: 100%; height: 100%"></div>
      </div>
      <div class="chart-container">
        <div ref="pieChartRef" style="width: 100%; height: 100%"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 覆盖全局样式
@media (min-width: 1200px) {
  .chart-box .chart-wrapper {
    min-width: 0 !important;
    margin-left: 0 !important;
  }

  .chart-box .chart-wrapper .chart-container {
    min-width: 0 !important;
  }
}

.chart-box {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  width: 100% !important;
  padding-right: 15px;
  padding-bottom: 0.5rem;
  padding-left: 15px;

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
    width: 100%;
    margin-top: 10px !important;

    .left-card {
      display: flex;
      flex-direction: column;
      height: 102px;
      padding: 16px 14px;
      overflow: hidden;
      cursor: pointer;
      border-left: 4px solid #4a90e2;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
        transform: translateY(-2px);
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        .card-title {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.3;
          color: #606266;
        }

        .card-indicator {
          flex-shrink: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
      }

      .card-body {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;

        .card-value {
          margin-bottom: 4px;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
        }

        .card-desc {
          font-size: 12px;
          line-height: 1;
          color: #909399;
        }
      }
    }
  }

  .chart-wrapper {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 15px;
    width: 100%;
    margin: 0 !important;

    .chart-container {
      min-width: 0;
      height: 330px;
      padding: 10px;
      background-color: hsl(var(--card));
      border-radius: 8px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
    }
  }
}
</style>
