<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { getRectifyReviewChart, getRectifyReviewStatistics } from '#/api/genchuan/industry/marketsupervision';
import { ElMessage } from 'element-plus';

import * as echarts from 'echarts';
import { ElOption, ElSelect } from 'element-plus';

const state = reactive({
  cardList: [
    { title: '复审台账总数', value: 0, color: '#4A90E2' },
    { title: '待复审数', value: 0, color: '#50E3C2' },
    { title: '已下发数', value: 0, color: '#FF9F40' },
    { title: '已撤销数', value: 0, color: '#A17FE0' },
    { title: '已完成数', value: 0, color: '#FF6B8B' },
    { title: '复审完成率', value: 0, color: '#FFD93D', suffix: '%' },
  ],
});

// 第一个饼图的数据（复审状态占比）
const firstChartData = ref([
  {
    label: '复审状态占比',
    data: [
      { name: '待复审', value: 0 },
      { name: '已下发', value: 0 },
      { name: '已撤销', value: 0 },
      { name: '已完成', value: 0 },
    ],
  },
]);

// 第二个饼图的数据（违规等级占比）
const secondChartData = ref([
  {
    label: '违规等级占比',
    data: [
      { name: '一般违规', value: 0 },
      { name: '严重违规', value: 0 },
      { name: '特别严重', value: 0 },
    ],
  },
]);

// 柱状图数据（月度新增数量）
const barChartData = ref({
  label: '月度整改复审新增数量',
  type: 'bar',
  data: {
    xAxis: [],
    series: [
      {
        name: '新增数量',
        data: [],
      },
    ],
  },
});

// 图表引用
const pieChartRef1 = ref(null);
const pieChartRef2 = ref(null);
const barLineChartRef = ref(null);
let pieChartInstance1 = null;
let pieChartInstance2 = null;
let barLineChartInstance = null;

// 获取统计数据
const fetchStatisticsData = async () => {
  try {
    const res = await getRectifyReviewStatistics();
    // 更新卡片数据
    state.cardList[0].value = res.totalCount || 0;
    state.cardList[1].value = res.pendingReviewCount || 0;
    state.cardList[2].value = res.issuedCount || 0;
    state.cardList[3].value = res.canceledCount || 0;
    state.cardList[4].value = res.completedCount || 0;
    state.cardList[5].value = res.completedRatio || 0;

    // 更新第一个饼图数据（复审状态占比）
    firstChartData.value[0].data = [
      { name: '待复审', value: res.pendingReviewCount || 0 },
      { name: '已下发', value: res.issuedCount || 0 },
      { name: '已撤销', value: res.canceledCount || 0 },
      { name: '已完成', value: res.completedCount || 0 },
    ];

    // 更新第二个饼图数据（违规等级占比）
    secondChartData.value[0].data = [
      { name: '一般违规', value: res.levelNormalCount || 0 },
      { name: '严重违规', value: res.levelSeriousCount || 0 },
      { name: '特别严重', value: res.levelVerySeriousCount || 0 },
    ];
  } catch (error) {
    console.error('获取统计数据失败:', error);
    ElMessage.error('获取统计数据失败');
  }
};

// 获取柱状图数据
const fetchChartData = async () => {
  try {
    const res = await getRectifyReviewChart();
    const list = res.list || [];
    
    // 更新柱状图数据
    barChartData.value.data.xAxis = list.map(item => item.time || '');
    barChartData.value.data.series[0].data = list.map(item => item.count || 0);
  } catch (error) {
    console.error('获取图表数据失败:', error);
    ElMessage.error('获取图表数据失败');
    // 模拟数据
    barChartData.value.data.xAxis = ['2026-03', '2026-04'];
    barChartData.value.data.series[0].data = [34, 22];
  }
};

// 获取圆环图配置
const getPieOption = (chartData) => {
  const freshColors = [
    '#4A90E2',
    '#50E3C2',
    '#FF9F40',
    '#A17FE0',
    '#FF6B8B',
    '#FFD93D',
  ];

  return {
    backgroundColor: 'transparent',
    title: {
      text: chartData?.label || '分布统计',
      left: 'center',
      top: 10,
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
      textStyle: {
        color: '#6E7E91',
      },
    },
    color: freshColors,
    legend: {
      orient: 'horizontal',
      bottom: 5,
      type: 'scroll',
      left: 'center',
      textStyle: {
        color: '#6E7E91',
        fontSize: 10,
      },
      itemWidth: 10,
      itemHeight: 10,
      formatter(name) {
        return name.length > 4 ? `${name.slice(0, 4)}...` : name;
      },
    },
    series: [
      {
        name: chartData?.label || '分布统计',
        type: 'pie',
        radius: ['35%', '55%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: true,
        minShowLabelAngle: 5,
        label: {
          show: true,
          position: 'outside',
          formatter(params) {
            const name =
              params.name.length > 4
                ? `${params.name.slice(0, 4)}...`
                : params.name;
            return `{name|${name}}\n{percent|${params.percent}%}`;
          },
          rich: {
            name: {
              color: '#6E7E91',
              fontSize: 11,
              lineHeight: 16,
              align: 'center',
            },
            percent: {
              color: '#4A90E2',
              fontSize: 12,
              fontWeight: 'bold',
              lineHeight: 16,
              align: 'center',
            },
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
          },
          scale: true,
          scaleSize: 5,
        },
        labelLine: {
          show: true,
          length: 12,
          length2: 8,
          smooth: true,
          lineStyle: {
            color: '#9AA8B7',
            width: 1,
          },
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff',
        },
        data: chartData?.data || [],
      },
    ],
  };
};

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
                      color: `rgba(${hexToRgb(freshColors[index % freshColors.length])}, 0.3)`,
                    },
                    {
                      offset: 1,
                      color: `rgba(${hexToRgb(freshColors[index % freshColors.length])}, 0.05)`,
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

// 辅助函数：将十六进制颜色转换为RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
    : '74, 144, 226';
}

// 初始化第一个圆环图
const initPieChart1 = () => {
  if (pieChartRef1.value && firstChartData.value[0]) {
    try {
      if (pieChartInstance1) {
        pieChartInstance1.dispose();
        pieChartInstance1 = null;
      }

      if (
        firstChartData.value[0].data &&
        firstChartData.value[0].data.length > 0
      ) {
        pieChartInstance1 = echarts.init(pieChartRef1.value);
        const option = getPieOption(firstChartData.value[0]);
        pieChartInstance1.setOption(option);
      }
    } catch (error) {
      console.error('初始化第一个圆环图失败:', error);
    }
  }
};

// 初始化第二个圆环图
const initPieChart2 = () => {
  if (pieChartRef2.value && secondChartData.value[0]) {
    try {
      if (pieChartInstance2) {
        pieChartInstance2.dispose();
        pieChartInstance2 = null;
      }

      if (
        secondChartData.value[0].data &&
        secondChartData.value[0].data.length > 0
      ) {
        pieChartInstance2 = echarts.init(pieChartRef2.value);
        const option = getPieOption(secondChartData.value[0]);
        pieChartInstance2.setOption(option);
      }
    } catch (error) {
      console.error('初始化第二个圆环图失败:', error);
    }
  }
};

// 初始化柱状图
const initBarLineChart = () => {
  if (!barLineChartRef.value || !barChartData.value.data) return;
  if (!barChartData.value.data.xAxis || barChartData.value.data.xAxis.length === 0) return;

  try {
    if (barLineChartInstance) {
      barLineChartInstance.dispose();
      barLineChartInstance = null;
    }

    barLineChartInstance = echarts.init(barLineChartRef.value);
    const option = getBarLineOption(barChartData.value);
    barLineChartInstance.setOption(option);
  } catch (error) {
    console.error('初始化柱状图失败:', error);
  }
};

// 初始化所有图表
const initCharts = () => {
  initPieChart1();
  initPieChart2();
  initBarLineChart();
};

// 获取数据并初始化图表
const fetchDataAndInitCharts = async () => {
  await fetchStatisticsData();
  await fetchChartData();
  nextTick(() => {
    initCharts();
  });
};

// 处理窗口大小变化
const handleResize = () => {
  pieChartInstance1?.resize();
  pieChartInstance2?.resize();
  barLineChartInstance?.resize();
};

onMounted(() => {
  fetchDataAndInitCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (pieChartInstance1) {
    pieChartInstance1.dispose();
    pieChartInstance1 = null;
  }
  if (pieChartInstance2) {
    pieChartInstance2.dispose();
    pieChartInstance2 = null;
  }
  if (barLineChartInstance) {
    barLineChartInstance.dispose();
    barLineChartInstance = null;
  }
});
</script>

<template>
  <div class="stats-four-visualization">
    <!-- 卡片区 - 2x3网格布局 -->
    <div class="cards-section">
      <div
        v-for="(card, index) in state.cardList"
        :key="`card-${index}`"
        class="stat-card"
        :style="{
          borderLeftColor: card.color || '#4A90E2',
        }"
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
            {{ card.value }}{{ card.suffix || '' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧展示区 -->
    <div class="right-section">
      <!-- 图表视图 - 两个圆环图 + 一个较宽图表 -->
      <div class="charts-section">
        <!-- 第一个圆环图展示区 -->
        <div class="pie-chart-area">
          <div ref="pieChartRef1" class="chart-container"></div>
        </div>

        <!-- 第二个圆环图展示区 -->
        <div class="pie-chart-area">
          <div ref="pieChartRef2" class="chart-container"></div>
        </div>

        <!-- 柱状图展示区（更宽） -->
        <div class="bar-line-chart-area">
          <div ref="barLineChartRef" class="chart-container"></div>
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

/* 地图容器 */
.map-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

/* 图表区样式 */
.charts-section {
  display: flex;
  flex: 1;
  gap: 20px;
  min-width: 0;
}

/* 圆环图区域 */
.pie-chart-area {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 320px;
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
}

/* 柱状/折线图区域 - 更宽 */
.bar-line-chart-area {
  position: relative;
  flex: 1.5;
  min-width: 0;
  height: 320px;
}

.bar-line-select {
  left: 10px;
}
</style>
