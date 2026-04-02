<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { getStationDeviceRealTimeMonitor, getParamTrend } from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/statusMonitor/index.js';
import * as echarts from 'echarts';
import { ElOption, ElSelect } from 'element-plus';
import MapComponent from '#/genchuan-components/Map/index.vue';
const state = reactive({
  cardList: [
    { title: '监测设备总数量', value: 0, color: '#4A90E2' },
    { title: '正常设备数量', value: 0, color: '#50E3C2' },
    { title: '异常设备数量', value: 0, color: '#FF9F40' },
    { title: '处置中设备数量', value: 0, color: '#A17FE0' },
    { title: '已恢复设备数量', value: 0, color: '#FF6B8B' },
  ],
  mapData: [],
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
      title: 'deviceName',
      fields: [
        { key: 'id', label: '设备编号' },
        { key: 'alarmLevel', label: '告警等级', bold: true },
      ],
    },
  },
});

// 图表引用
const barLineChartRef = ref(null);
let barLineChartInstance = null;

// 图表切换状态
const chartIndex = ref(0);

// 所有折线图和柱状图的数据
const allChartsData = ref([
  {
    label: '设备运行参数实时趋势',
    type: 'line',
    data: {
      xAxis: [],
      series: [
        { name: '电压(V)', data: [] },
        { name: '电流(A)', data: [] },
        { name: '功率(kW)', data: [] },
      ],
    },
  },
]);



// 切换图表
const handleBarLineChange = (index) => {
  chartIndex.value = index;
  initBarLineChart();
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



// 初始化柱状/折线图
const initBarLineChart = () => {
  if (
    !barLineChartRef.value ||
    !allChartsData.value[chartIndex.value] ||
    !allChartsData.value[chartIndex.value].data
  )
    return;
  if (
    !allChartsData.value[chartIndex.value].data.xAxis ||
    allChartsData.value[chartIndex.value].data.xAxis.length === 0
  )
    return;

  try {
    if (barLineChartInstance) {
      barLineChartInstance.dispose();
      barLineChartInstance = null;
    }

    barLineChartInstance = echarts.init(barLineChartRef.value);
    const option = getBarLineOption(allChartsData.value[chartIndex.value]);
    barLineChartInstance.setOption(option);
  } catch (error) {
    console.error('初始化柱状/折线图失败:', error);
  }
};

// 初始化所有图表
const initCharts = () => {
  initBarLineChart();
};

// 处理窗口大小变化
const handleResize = () => {
  barLineChartInstance?.resize();
};

// 获取监测数据并更新卡片
const fetchMonitorData = async () => {
  try {
    const response = await getStationDeviceRealTimeMonitor();
    if (response) {
      state.cardList[0].value = response.totalCount || 0;
      state.cardList[1].value = response.normalCount || 0;
      state.cardList[2].value = response.abnormalCount || 0;
      state.cardList[3].value = response.handlingCount || 0;
      state.cardList[4].value = response.recoveredCount || 0;
      // 处理异常点数据，转换为地图组件需要的格式 
      if (response.abnormalPointList && Array.isArray(response.abnormalPointList)) {
        state.mapData = response.abnormalPointList.map(point => ({
          id: point.id,
          deviceName: point.deviceName,
          coordinate: `${point.lon},${point.lat}`,
          statusName: '异常',
          alarmLevel: point.alarmLevel, 
        }));
      } else {
        state.mapData = [];
      }

      if (response.paramTrendList && Array.isArray(response.paramTrendList)) {
        const xAxis = response.paramTrendList.map(item => item.time);
        const voltageData = response.paramTrendList.map(item => item.voltage);
        const currentData = response.paramTrendList.map(item => item.current);
        const powerData = response.paramTrendList.map(item => item.power);


        allChartsData.value[0].data.xAxis = xAxis;
        allChartsData.value[0].data.series[0].data = voltageData;
        allChartsData.value[0].data.series[1].data = currentData;
        allChartsData.value[0].data.series[2].data = powerData;

        // 更新折线图
        initBarLineChart();
      }
    }
  } catch (error) {
    console.error('获取监测数据失败:', error);
  }
};


onMounted(() => {
  nextTick(() => {
    initCharts();
  });
  window.addEventListener('resize', handleResize);
  // 初始加载监测数据
  fetchMonitorData();
  // 初始加载参数趋势数据 
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
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
      <div v-for="(card, index) in state.cardList" :key="`card-${index}`" class="stat-card" :style="{
        borderLeftColor: card.color || '#4A90E2',
      }">
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <div class="card-indicator" :style="{ backgroundColor: card.color || '#4A90E2' }"></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: card.color || '#4A90E2' }">
            {{ card.value }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧展示区 -->
    <div class="right-section">
      <div class="map-wrapper">
        <MapComponent :data="state.mapData" :marker-icons="state.mapConfig.markerIcons"
          :status-icon-map="state.mapConfig.statusIconMap" :status-key-map="state.mapConfig.statusKeyMap"
          :info-window-config="state.mapConfig.infoWindowConfig" />
      </div>
      <!-- 图表视图 - 两个圆环图 + 一个较宽图表 -->
      <div class="charts-section">
        <!-- 柱状/折线图展示区（更宽） -->
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
  width: 50%;
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
