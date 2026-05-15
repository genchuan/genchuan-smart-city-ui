<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';

import { getCycleReportChart } from '#/api/genchuan/industry/chargePark/vehiclePass/passReport/cycleReport';

import DetailDialog from './components/DetailDialog.vue';

const props = defineProps({
  parkId: { type: Number, default: null },
});

const detailDialogRef = ref(null);

const cards = reactive([
  {
    title: '入场量',
    value: 0,
    desc: '累计入场车辆',
    color: '#4A90E2',
    key: 'enterCount',
  },
  {
    title: '离场量',
    value: 0,
    desc: '累计离场车辆',
    color: '#50E3C2',
    key: 'leaveCount',
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
    key: 'checkSuccessRate',
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
    key: 'etcPassSuccessRate',
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
    // 使用真实API
    const params = {
      reportCycle: '日报',
      stationName: props.parkId,
      statTime: new Date().toISOString().split('T')[0],
      tenantId: 1, // TODO: 从用户信息获取
    };

    console.log('请求图表数据参数:', params);
    const res = await getCycleReportChart(params);
    console.log('图表数据响应:', res);

    // 更新卡片数据
    if (res?.cardData) {
      cards[0].value = res.cardData.enterCount || 0;
      cards[1].value = res.cardData.leaveCount || 0;
      cards[2].value = res.cardData.parkingCount || 0;
      cards[3].value = res.cardData.identifySuccessRate
        ? `${res.cardData.identifySuccessRate}%`
        : '0%';
      cards[4].value = res.cardData.checkSuccessRate
        ? `${res.cardData.checkSuccessRate}%`
        : '0%';
      cards[5].value = res.cardData.abnormalHandleRate
        ? `${res.cardData.abnormalHandleRate}%`
        : '0%';
      cards[6].value = res.cardData.etcPassSuccessRate
        ? `${res.cardData.etcPassSuccessRate}%`
        : '0%';
    }

    // 保存图表数据
    state.chartData = {
      cardData: res?.cardData || {},
      mapData: res?.mapData || [],
      barData: res?.barData || [],
      lineData: res?.lineData || [],
      pieData: res?.pieData || [],
    };

    // 检查是否有图表数据
    const hasChartData =
      (state.chartData.lineData?.length > 0 ||
        state.chartData.barData?.length > 0 ||
        state.chartData.pieData?.length > 0);

    console.log('是否有图表数据:', hasChartData);
    console.log('lineData长度:', state.chartData.lineData?.length);
    console.log('barData长度:', state.chartData.barData?.length);
    console.log('pieData长度:', state.chartData.pieData?.length);

    state.hasData = hasChartData;

    if (hasChartData) {
      // 延迟初始化图表，确保DOM已渲染
      setTimeout(() => {
        initCharts();
      }, 100);
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
      text: '通行量趋势 / 成功率趋势',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    legend: {
      bottom: 10,
      data: ['通行量', '识别成功率', '核验成功率', '异常处置率'],
    },
    xAxis: {
      type: 'category',
      data: state.chartData.lineData.map((item) => item.statTime),
    },
    yAxis: [
      { type: 'value', name: '通行数量', position: 'left' },
      { type: 'value', name: '成功率(%)', position: 'right', max: 100 },
    ],
    series: [
      {
        name: '通行量',
        type: 'line',
        yAxisIndex: 0,
        data: state.chartData.lineData.map((item) => item.passCount),
        smooth: true,
        lineStyle: { width: 3, color: '#4A90E2' },
        areaStyle: { color: 'rgba(74,144,226,0.1)' },
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
        data: state.chartData.lineData.map((item) => item.checkSuccessRate),
        smooth: true,
        lineStyle: { width: 2, color: '#E74C3C', type: 'dashed' },
        symbol: 'circle',
        symbolSize: 4,
      },
      {
        name: '异常处置率',
        type: 'line',
        yAxisIndex: 1,
        data: state.chartData.lineData.map((item) => item.abnormalHandleRate),
        smooth: true,
        lineStyle: { width: 2, color: '#F39C12', type: 'dashed' },
        symbol: 'circle',
        symbolSize: 4,
      },
    ],
  };
  lineChartInstance.setOption(option);

  lineChartInstance.on('click', (params) => {
    const dataIndex = params.dataIndex;
    const lineItem = state.chartData.lineData[dataIndex];
    if (lineItem) {
      openDetailDialog('line', params.seriesName, lineItem);
    }
  });
}

function initBarChart() {
  if (!barChartRef.value) return;
  if (barChartInstance) barChartInstance.dispose();
  barChartInstance = echarts.init(barChartRef.value);
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '各场站通行量 / 异常数 / ETC通行量',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 },
    },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 10, data: ['通行量', '异常数', 'ETC通行量'] },
    xAxis: {
      type: 'category',
      data: state.chartData.barData.map(
        (item) => item.stationName || item.hour || '未知',
      ),
      axisLabel: {
        interval: 0,
        rotate: state.chartData.barData.length > 10 ? 45 : 0,
      },
    },
    yAxis: { type: 'value', name: '数量' },
    series: [
      {
        name: '通行量',
        type: 'bar',
        data: state.chartData.barData.map((item) => item.passCount),
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
        name: '异常数',
        type: 'bar',
        data: state.chartData.barData.map((item) => item.abnormalCount),
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#E74C3C' },
            { offset: 1, color: '#C0392B' },
          ]),
        },
        label: { show: true, position: 'top' },
      },
      {
        name: 'ETC通行量',
        type: 'bar',
        data: state.chartData.barData.map((item) => item.etcPassCount),
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

  barChartInstance.on('click', (params) => {
    const dataIndex = params.dataIndex;
    const barItem = state.chartData.barData[dataIndex];
    if (barItem) {
      openDetailDialog('bar', params.seriesName, barItem);
    }
  });
}

function initPieChart() {
  if (!pieChartRef.value) return;
  if (pieChartInstance) pieChartInstance.dispose();
  pieChartInstance = echarts.init(pieChartRef.value);

  const pieChartData = state.chartData.pieData.map((item) => ({
    name: item.type || item.name,
    value: item.count || item.value,
  }));

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
      data: pieChartData.map((item) => item.name),
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
        data: pieChartData,
      },
    ],
  };
  pieChartInstance.setOption(option);

  pieChartInstance.on('click', (params) => {
    openDetailDialog('pie', params.name, { type: params.name, count: params.value });
  });
}

function initCharts() {
  initLineChart();
  initBarChart();
  initPieChart();
}

function handleCardClick(key) {
  console.log('卡片点击:', key);
  const today = new Date();
  // 使用 ISO 8601 格式：YYYY-MM-DDTHH:mm:ss
  const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString().slice(0, 19);
  const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString().slice(0, 19);

  const cardTitleMap = {
    enterCount: '入场量',
    leaveCount: '离场量',
    parkingCount: '在停车辆数',
    identifySuccessRate: '识别成功率',
    checkSuccessRate: '核验成功率',
    abnormalHandleRate: '异常处置率',
    etcPassSuccessRate: 'ETC通行成功率',
  };

  const title = `今日${cardTitleMap[key]}明细`;
  const filterParams = {
    beginTime: todayStart,
    endTime: todayEnd,
  };

  console.log('打开弹窗:', title, filterParams);
  console.log('detailDialogRef.value:', detailDialogRef.value);

  if (detailDialogRef.value) {
    detailDialogRef.value.open({
      title,
      filterParams,
    });
  } else {
    console.error('detailDialogRef.value 为空');
  }

  // 同时触发自定义事件，让表格也能响应（保留原有功能）
  window.dispatchEvent(
    new CustomEvent('cycleReport:cardClick', {
      detail: { key },
    }),
  );
}

// 打开明细对话框
function openDetailDialog(chartType, seriesName, data) {
  let title = '';
  let filterParams = {};

  // 根据图表类型和系列名称确定筛选参数
  if (chartType === 'bar') {
    const target = data.stationName || data.hour || '未知';
    if (seriesName === '通行量') {
      title = `${target} - 通行量明细`;
      filterParams = {
        stationName: data.stationName,
      };
    } else if (seriesName === '异常数') {
      title = `${target} - 异常明细`;
      filterParams = {
        stationName: data.stationName,
      };
    } else if (seriesName === 'ETC通行量') {
      title = `${target} - ETC通行明细`;
      filterParams = {
        stationName: data.stationName,
      };
    }
  } else if (chartType === 'line') {
    // 将日期字符串转换为 ISO 8601 格式
    const statDate = new Date(data.statTime);
    const beginTime = new Date(statDate.setHours(0, 0, 0, 0)).toISOString().slice(0, 19);
    const endTime = new Date(statDate.setHours(23, 59, 59, 999)).toISOString().slice(0, 19);

    if (seriesName === '通行量') {
      title = `${data.statTime} - 通行量明细`;
      filterParams = {
        beginTime,
        endTime,
      };
    } else if (seriesName === '识别成功率') {
      title = `${data.statTime} - 识别明细`;
      filterParams = {
        beginTime,
        endTime,
      };
    } else if (seriesName === '核验成功率') {
      title = `${data.statTime} - 核验明细`;
      filterParams = {
        beginTime,
        endTime,
      };
    } else if (seriesName === '异常处置率') {
      title = `${data.statTime} - 异常处置明细`;
      filterParams = {
        beginTime,
        endTime,
      };
    }
  } else if (chartType === 'pie') {
    title = `${data.type} - 明细`;
    filterParams = {};
  }

  if (detailDialogRef.value && title) {
    detailDialogRef.value.open({
      title,
      filterParams,
    });
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

    <!-- 明细对话框 -->
    <DetailDialog ref="detailDialogRef" />
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
  align-items: flex-end;
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
    height: 330px;

    .left-card {
      display: flex;
      flex-direction: column;
      flex: 1;
      flex: 1;
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
