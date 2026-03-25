<script setup>
import { reactive, ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { ElSelect, ElOption } from 'element-plus';

import IconButton from '#/components/common/IconButton.vue';
import MapComponent from '#/genchuan-components/Map/index.vue';

const state = reactive({
  cardList: [
    { title: '总监测路段数', value: 15, color: '#4A90E2' },
    { title: '在线设备数', value: 12, color: '#50E3C2' },
    { title: '设备在线率', value: '80%', color: '#FF9F40' },
    { title: '降雨联动预警数', value: 3, color: '#A17FE0' },
    { title: '正常监测路段数', value: 12, color: '#FF6B8B' },
    { title: '当前降雨量均值', value: '12.5mm', color: '#FFD93D' },
  ],
  mapData: [
    { id: 1, locationName: '福州路段1', coordinateInfo: '119.2965,26.0753', statusName: '正常', riskLevel: '低风险' },
    { id: 2, locationName: '福州路段2', coordinateInfo: '119.3065,26.0853', statusName: '异常', riskLevel: '高风险' },
    { id: 3, locationName: '厦门路段1', coordinateInfo: '118.0889,24.4708', statusName: '正常', riskLevel: '低风险' },
    { id: 4, locationName: '厦门路段2', coordinateInfo: '118.0989,24.4808', statusName: '异常', riskLevel: '中风险' },
    { id: 5, locationName: '泉州路段1', coordinateInfo: '118.6880,24.8740', statusName: '异常', riskLevel: '高风险' },
    { id: 6, locationName: '莆田路段1', coordinateInfo: '119.0094,25.4311', statusName: '正常', riskLevel: '低风险' },
    { id: 7, locationName: '宁德路段1', coordinateInfo: '119.5295,26.6470', statusName: '正常', riskLevel: '低风险' },
    { id: 8, locationName: '龙岩路段1', coordinateInfo: '116.9139,25.1054', statusName: '异常', riskLevel: '中风险' },
    { id: 9, locationName: '三明路段1', coordinateInfo: '117.6393,26.2650', statusName: '正常', riskLevel: '低风险' },
    { id: 10, locationName: '南平路段1', coordinateInfo: '118.1755,26.6327', statusName: '正常', riskLevel: '低风险' },
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
      '正常': 'green',
      '异常': 'red',
      '离线': 'red',
      '维护中': 'orange',
      '停用': 'red',
      '建设中': 'gray',
    },
    infoWindowConfig: {
      title: 'locationName',
      fields: [
        { key: 'id', label: '路段编号' },
        { key: 'statusName', label: '状态', bold: true },
        { key: 'riskLevel', label: '风险等级' },
      ],
    },
  },
});

// 图表引用
const pieChartRef1 = ref(null);
const pieChartRef2 = ref(null);
const barLineChartRef = ref(null);
let pieChartInstance1 = null;
let pieChartInstance2 = null;
let barLineChartInstance = null;

// 显示地图状态
const mapVisible = ref(true);

// 饼图切换状态
const firstChartIndex = ref(0);
const secondChartIndex = ref(1);
const chartIndex = ref(0);

// 第一个饼图的数据
const firstChartData = [
  {
    label: '监测状态占比',
    data: [
      { name: '正常监测', value: 12 },
      { name: '暂停监测', value: 3 },
    ]
  },
  {
    label: '采集频率类型占比',
    data: [
      { name: '常规', value: 10 },
      { name: '降雨期', value: 5 },
    ]
  }
];

// 第二个饼图的数据
const secondChartData = [
  {
    label: '设备在线率',
    data: [
      { name: '在线', value: 12 },
      { name: '离线/异常', value: 3 },
    ]
  },
  {
    label: '安全风险等级占比',
    data: [
      { name: '低风险', value: 8 },
      { name: '中风险', value: 2 },
      { name: '高风险', value: 5 },
    ]
  }
];

// 所有柱状图的数据（已删除折线图）
const allChartsData = [
  {
    label: '不同路段液位对比',
    type: 'bar',
    data: {
      xAxis: ['福州', '厦门', '泉州', '莆田', '宁德', '龙岩'],
      series: [1.8, 1.5, 2.0, 1.2, 1.4, 1.6]
    }
  },
  {
    label: '不同路段异常预警数对比',
    type: 'bar',
    data: {
      xAxis: ['福州', '厦门', '泉州', '莆田', '宁德', '龙岩'],
      series: [1, 1, 1, 0, 0, 0]
    }
  },
  {
    label: '各运维员负责路段数对比',
    type: 'bar',
    data: {
      xAxis: ['张三', '李四', '王五', '赵六', '钱七'],
      series: [4, 3, 3, 3, 2]
    }
  }
];

// 切换地图/图表视图
const toggleView = () => {
  mapVisible.value = !mapVisible.value;
  if (!mapVisible.value) {
    setTimeout(() => {
      initCharts();
    }, 0);
  }
};

// 切换第一个饼图
const handlePie1Change = (index) => {
  firstChartIndex.value = index;
  initPieChart1();
};

// 切换第二个饼图
const handlePie2Change = (index) => {
  secondChartIndex.value = index;
  initPieChart2();
};

// 切换图表
const handleBarLineChange = (index) => {
  chartIndex.value = index;
  initBarLineChart();
};

// 获取圆环图配置
const getPieOption = (chartData) => {
  const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B', '#FFD93D'];

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
            const name = params.name.length > 4 ? `${params.name.slice(0, 4)}...` : params.name;
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

// 获取柱状/折线图配置
const getBarLineOption = (chartData) => {
  const freshColors = ['#4A90E2', '#50E3C2', '#FF9F40', '#A17FE0', '#FF6B8B'];
  const type = chartData?.type || 'bar';

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
    series: [
      {
        name: chartData?.label || '趋势统计',
        type: type,
        data: chartData?.data?.series || [],
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
    ],
  };
};

// 初始化第一个圆环图
const initPieChart1 = () => {
  if (pieChartRef1.value && firstChartData[firstChartIndex.value]) {
    try {
      if (pieChartInstance1) {
        pieChartInstance1.dispose();
        pieChartInstance1 = null;
      }

      if (firstChartData[firstChartIndex.value].data && firstChartData[firstChartIndex.value].data.length > 0) {
        pieChartInstance1 = echarts.init(pieChartRef1.value);
        const option = getPieOption(firstChartData[firstChartIndex.value]);
        pieChartInstance1.setOption(option);
      }
    } catch (error) {
      console.error('初始化第一个圆环图失败:', error);
    }
  }
};

// 初始化第二个圆环图
const initPieChart2 = () => {
  if (pieChartRef2.value && secondChartData[secondChartIndex.value]) {
    try {
      if (pieChartInstance2) {
        pieChartInstance2.dispose();
        pieChartInstance2 = null;
      }

      if (secondChartData[secondChartIndex.value].data && secondChartData[secondChartIndex.value].data.length > 0) {
        pieChartInstance2 = echarts.init(pieChartRef2.value);
        const option = getPieOption(secondChartData[secondChartIndex.value]);
        pieChartInstance2.setOption(option);
      }
    } catch (error) {
      console.error('初始化第二个圆环图失败:', error);
    }
  }
};

// 初始化柱状/折线图
const initBarLineChart = () => {
  if (!barLineChartRef.value || !allChartsData[chartIndex.value] || !allChartsData[chartIndex.value].data) return;
  if (!allChartsData[chartIndex.value].data.xAxis || allChartsData[chartIndex.value].data.xAxis.length === 0) return;

  try {
    if (barLineChartInstance) {
      barLineChartInstance.dispose();
      barLineChartInstance = null;
    }

    barLineChartInstance = echarts.init(barLineChartRef.value);
    const option = getBarLineOption(allChartsData[chartIndex.value]);
    barLineChartInstance.setOption(option);
  } catch (error) {
    console.error('初始化柱状/折线图失败:', error);
  }
};

// 初始化所有图表
const initCharts = () => {
  initPieChart1();
  initPieChart2();
  initBarLineChart();
};

// 处理窗口大小变化
const handleResize = () => {
  pieChartInstance1?.resize();
  pieChartInstance2?.resize();
  barLineChartInstance?.resize();
};

onMounted(() => {
  nextTick(() => {
    initCharts();
  });
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
          <div class="card-value" :style="{ color: card.color || '#4A90E2' }">{{ card.value }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧展示区 -->
    <div class="right-section">
      <!-- 地图/图表切换按钮 -->
      <div class="toggle-container">
        <IconButton
          :content="mapVisible ? '图表' : '地图'"
          icon-name="Switch"
          @click="toggleView"
          class="toggle-button"
        />
      </div>

      <!-- 地图视图 -->
      <div v-if="mapVisible" class="map-wrapper">
        <MapComponent
          :data="state.mapData"
          :marker-icons="state.mapConfig.markerIcons"
          :status-icon-map="state.mapConfig.statusIconMap"
          :status-key-map="state.mapConfig.statusKeyMap"
          :info-window-config="state.mapConfig.infoWindowConfig"
        />
      </div>

      <!-- 图表视图 - 两个圆环图 + 一个较宽图表 -->
      <div v-else class="charts-section">
        <!-- 第一个圆环图展示区（带切换） -->
        <div class="pie-chart-area">
          <!-- 下拉切换按钮 -->
          <div v-if="firstChartData.length > 1" class="chart-select-wrapper">
            <ElSelect
              v-model="firstChartIndex"
              size="small"
              class="chart-select"
              @change="handlePie1Change"
            >
              <ElOption
                v-for="(option, idx) in firstChartData"
                :key="idx"
                :label="option.label"
                :value="idx"
              />
            </ElSelect>
          </div>
          <div ref="pieChartRef1" class="chart-container"></div>
        </div>

        <!-- 第二个圆环图展示区（带切换） -->
        <div class="pie-chart-area">
          <!-- 下拉切换按钮 -->
          <div v-if="secondChartData.length > 1" class="chart-select-wrapper">
            <ElSelect
              v-model="secondChartIndex"
              size="small"
              class="chart-select"
              @change="handlePie2Change"
            >
              <ElOption
                v-for="(option, idx) in secondChartData"
                :key="idx"
                :label="option.label"
                :value="idx"
              />
            </ElSelect>
          </div>
          <div ref="pieChartRef2" class="chart-container"></div>
        </div>

        <!-- 柱状/折线图展示区（更宽） -->
        <div class="bar-line-chart-area">
          <!-- 下拉切换按钮 -->
          <div v-if="allChartsData.length > 1" class="chart-select-wrapper bar-line-select">
            <ElSelect
              v-model="chartIndex"
              size="small"
              class="chart-select"
              @change="handleBarLineChange"
            >
              <ElOption
                v-for="(option, idx) in allChartsData"
                :key="idx"
                :label="option.label"
                :value="idx"
              />
            </ElSelect>
          </div>
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
  background: #ffffff;
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
