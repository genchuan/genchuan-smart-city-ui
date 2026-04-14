<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { getSettlementBillChart} from '#/api/genchuan/industry/energyCharging/carCharging/settlement/settlementBill/index.js';
import { ElDialog, ElMessage } from 'element-plus'; 
import * as echarts from 'echarts'; 
const state = reactive({
  cardList: [
    { title: '结算单总数', value: 0, color: '#4A90E2' },
    { title: '待审核数量', value: 0, color: '#50E3C2' },
    { title: '已完成数量', value: 0, color: '#FF9F40' },
    { title: '总结算金额', value: 0, color: '#A17FE0' },
  ],
  barData: [],
});





// 图表引用
const barChartRef = ref(null);
let barChartInstance = null;

const lineChartRef = ref(null);
let lineChartInstance = null;

// 折线图数据
const lineChartData = ref({
  label: '每日结算单趋势',
  type: 'line',
  data: {
    xAxis: [],
    series: [
      { name: '结算单数量', data: [] },
    ],
  },
});

// 柱状图数据
const barChartData = ref({
  label: '合作方结算金额统计',
  type: 'bar',
  data: {
    xAxis: [],
    series: [
      { name: '结算金额', data: [] },
    ],
  },
});







// 获取柱状/折线图配置 - 修改后的版本
const getBarLineOption = (chartData) => {
  const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B'];
  const type = chartData?.type || 'bar';
  const isStack = chartData?.stack === 'total';
  const seriesData = chartData?.data?.series || [];

  // 处理series数据，确保每个系列都有正确的配置
  const series = Array.isArray(seriesData)
    ? seriesData.map((item, index) => {
      // 如果是数组，说明是单系列数据
      if (typeof item !== 'object') {
        return {
          name: chartData?.label || '趋势统计',
          type,
          data: seriesData,
          itemStyle: {
            borderRadius: type === 'bar' ? [4, 4, 0, 0] : undefined,
            color: freshColors[0],
          },
          smooth: type === 'line',
          lineStyle:
            type === 'line'
              ? {
                width: 3,
                color: freshColors[0],
              }
              : undefined,
          symbol: type === 'line' ? 'circle' : undefined,
          symbolSize: type === 'line' ? 6 : undefined,
          label: {
            show: type === 'bar',
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
            label: {
              show: type === 'bar',
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          areaStyle:
            type === 'line'
              ? {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
                  { offset: 1, color: 'rgba(74, 144, 226, 0.05)' },
                ]),
              }
              : undefined,
        };
      }

      // 如果是对象，说明是多系列数据
      return {
        name: item.name || chartData?.label || '趋势统计',
        type,
        data: item.data || [],
        stack: isStack ? 'total' : undefined,
        itemStyle: {
          borderRadius: type === 'bar' ? [4, 4, 0, 0] : undefined,
          color: freshColors[index % freshColors.length],
        },
        smooth: type === 'line',
        lineStyle:
          type === 'line'
            ? {
              width: 3,
              color: freshColors[index % freshColors.length],
            }
            : undefined,
        symbol: type === 'line' ? 'circle' : undefined,
        symbolSize: type === 'line' ? 6 : undefined,
        label: {
          show: type === 'bar',
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
          label: {
            show: type === 'bar',
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        areaStyle:
              type === 'line'
                ? {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(74, 144, 226, 0.3)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(74, 144, 226, 0.05)',
                    },
                  ]),
                }
                : undefined,
      };
    })
    : [
      {
        // 默认单系列配置
        name: chartData?.label || '趋势统计',
        type,
        data: [],
        itemStyle: {
          borderRadius: type === 'bar' ? [4, 4, 0, 0] : undefined,
          color: freshColors[0],
        },
        smooth: type === 'line',
        lineStyle:
          type === 'line'
            ? {
              width: 3,
              color: freshColors[0],
            }
            : undefined,
        symbol: type === 'line' ? 'circle' : undefined,
        symbolSize: type === 'line' ? 6 : undefined,
        label: {
          show: type === 'bar',
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
          label: {
            show: type === 'bar',
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        areaStyle:
          type === 'line'
            ? {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
                { offset: 1, color: 'rgba(74, 144, 226, 0.05)' },
              ]),
            }
            : undefined,
      },
    ];

  return {
    backgroundColor: 'transparent',
    title: {
      text: chartData?.label || '趋势统计',
      left: 'center',
      top: 5,
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
      textStyle: {
        color: '#6E7E91',
      },
    },
    color: freshColors,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '40px',
      containLabel: true,
      backgroundColor: 'transparent',
    },
    xAxis: {
      type: 'category',
      boundaryGap: type === 'bar',
      data: chartData?.data?.xAxis || [],
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 11,
        rotate: chartData?.data?.xAxis?.length > 8 ? 30 : 0,
      },
      axisLine: {
        lineStyle: {
          color: '#E8F4FD',
        },
      },
      axisTick: {
        lineStyle: {
          color: '#E8F4FD',
        },
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 11,
      },
      axisLine: {
        lineStyle: {
          color: '#E8F4FD',
        },
      },
      axisTick: {
        lineStyle: {
          color: '#E8F4FD',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#F0F6FC',
          type: 'dashed',
        },
      },
    },
    series,
  };
};





// 初始化柱状图
const initBarChart = () => {
  if (
    !barChartRef.value ||
    !barChartData.value ||
    !barChartData.value.data
  )
    return;
  if (
    !barChartData.value.data.xAxis ||
    barChartData.value.data.xAxis.length === 0
  )
    return;

  try {
    if (barChartInstance) {
      barChartInstance.dispose();
      barChartInstance = null;
    }

    barChartInstance = echarts.init(barChartRef.value);
    const option = getBarLineOption(barChartData.value);
    barChartInstance.setOption(option);
  } catch (error) {
    console.error('初始化柱状图失败:', error);
  }
};

// 初始化折线图
const initLineChart = () => {
  if (
    !lineChartRef.value ||
    !lineChartData.value ||
    !lineChartData.value.data
  )
    return;
  if (
    !lineChartData.value.data.xAxis ||
    lineChartData.value.data.xAxis.length === 0
  )
    return;

  try {
    if (lineChartInstance) {
      lineChartInstance.dispose();
      lineChartInstance = null;
    }

    lineChartInstance = echarts.init(lineChartRef.value);
    const option = getBarLineOption(lineChartData.value);
    lineChartInstance.setOption(option);
  } catch (error) {
    console.error('初始化折线图失败:', error);
  }
};

// 初始化所有图表
const initCharts = () => {
  initBarChart();
  initLineChart();
};

// 处理窗口大小变化
const handleResize = () => {
  barChartInstance?.resize();
  lineChartInstance?.resize();
};

// 获取结算单图表数据并更新卡片
const fetchSettlementChartData = async () => {
  try {
    const response = await getSettlementBillChart();
    if (response) {
      // 更新卡片数据
      state.cardList[0].value = response.totalBillCount || 0;
      state.cardList[1].value = response.pendingAuditCount || 0;
      state.cardList[2].value = response.completedCount || 0;
      state.cardList[3].value = response.totalSettlementAmount || 0;

      // 更新柱状图数据
      if (response.barData && Array.isArray(response.barData)) {
        const xAxis = response.barData.map(item => item.name);
        const amountData = response.barData.map(item => item.amount);

        barChartData.value.data.xAxis = xAxis;
        barChartData.value.data.series[0].data = amountData;

        // 更新柱状图
        initBarChart();
      }

      // 更新折线图数据
      if (response.lineData && Array.isArray(response.lineData)) {
        const xAxis = response.lineData.map(item => item.date);
        const countData = response.lineData.map(item => item.count);

        lineChartData.value.data.xAxis = xAxis;
        lineChartData.value.data.series[0].data = countData;

        // 更新折线图
        initLineChart();
      }
    }
  } catch (error) {
    console.error('获取结算单图表数据失败:', error);
  }
};


onMounted(() => {
  nextTick(() => {
    initCharts();
  });
  window.addEventListener('resize', handleResize);
  // 初始加载结算单图表数据
  fetchSettlementChartData();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (barChartInstance) {
    barChartInstance.dispose();
    barChartInstance = null;
  }
  if (lineChartInstance) {
    lineChartInstance.dispose();
    lineChartInstance = null;
  }
});
</script>

<template>
  <div class="stats-four-visualization">
    <!-- 卡片区 - 2x3网格布局 -->
    <div class="cards-section">
      <div v-for="(card, index) in state.cardList" :key="`card-${index}`" class="stat-card" :style="{
        borderLeftColor: card.color || '#4A90E2',
      }">
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <div class="card-indicator" :style="{ backgroundColor: card.color || '#4A90E2' }"></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: card.color || '#4A90E2' }" :data-unit="card.title === '总结算金额' ? 'yuan' : ''">
          {{ card.value }}
        </div>
        </div>
      </div>
    </div>

    <!-- 右侧展示区 -->
    <div class="right-section">
      <!-- 图表视图 - 柱状图和折线图 -->
      <div class="charts-section">
        <!-- 柱状图展示区 -->
        <div class="bar-chart-area">
          <div ref="barChartRef" class="chart-container"></div>
        </div>
        <!-- 折线图展示区 -->
        <div class="line-chart-area">
          <div ref="lineChartRef" class="chart-container"></div>
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
  overflow: hidden;
}

/* 卡片区样式 - 2x3网格布局 */
.cards-section {
  display: grid;
  grid-template-columns: 1fr 1fr; 
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

.card-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 4px;
}

.card-value[data-unit="yuan"]::after {
  content: '元';
  display: inline-block;
  margin-left: 4px;
  font-size: 14px;
  color: #9AA8B7;
}

/* 右侧展示区样式 */
.right-section {
  position: relative;
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  height: 320px;
}

.toggle-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1999;
}

.toggle-button {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}



/* 图表区样式 */
.charts-section {
  display: flex;
  flex: 1;
  gap: 20px;
  min-width: 0;
}



.chart-container {
  width: 100%;
  height: 100%;
}

/* 柱状图区域 */
.bar-chart-area {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 320px;
}

.line-chart-area {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 320px;
}

/* 详情内容样式 */
.detail-content {
  padding: 20px;
}

.detail-content h3 {
  margin-bottom: 20px;
  color: #6E7E91;
  font-size: 16px;
  font-weight: 600;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
}

.detail-table th {
  background-color: #F0F6FC;
  color: #6E7E91;
  font-weight: 600;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #E8F4FD;
}

.detail-table td {
  padding: 12px;
  border-bottom: 1px solid #E8F4FD;
  color: #6E7E91;
}

.detail-table tr:hover {
  background-color: #F5F7FA;
}


</style>
