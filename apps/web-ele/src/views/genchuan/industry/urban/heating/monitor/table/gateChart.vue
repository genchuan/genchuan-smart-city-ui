<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';
import { ElOption, ElSelect } from 'element-plus';

import IconButton from '#/components/common/IconButton.vue';
import MapComponent from '#/genchuan-components/Map/index.vue';

const state = reactive({
  cardList: [
    { title: '总供热区域数', value: 10, color: '#4A90E2' },
    { title: '监测设备数', value: 10, color: '#50E3C2' },
    { title: '在线设备数', value: 8, color: '#FF9F40' },
    { title: '设备在线率', value: '80%', color: '#A17FE0' },
    { title: '正常区域数', value: 7, color: '#FF6B8B' },
    { title: '当季预警数', value: 2, color: '#FFD93D' },
  ],
  mapData: [
    {
      id: 1,
      locationName: '福州市鼓楼区供热管网',
      coordinateInfo: '119.2965,26.0753',
      statusName: '正常',
      riskLevel: '低风险',
    },
    {
      id: 2,
      locationName: '厦门市思明区供热管网',
      coordinateInfo: '118.0889,24.4708',
      statusName: '正常',
      riskLevel: '低风险',
    },
    {
      id: 3,
      locationName: '泉州市丰泽区供热管网',
      coordinateInfo: '118.6880,24.8740',
      statusName: '异常',
      riskLevel: '高风险',
    },
    {
      id: 4,
      locationName: '漳州市芗城区供热管网',
      coordinateInfo: '117.6505,24.5115',
      statusName: '正常',
      riskLevel: '低风险',
    },
    {
      id: 5,
      locationName: '莆田市城厢区供热管网',
      coordinateInfo: '119.0071,25.4366',
      statusName: '已停止',
      riskLevel: '中风险',
    },
    {
      id: 6,
      locationName: '宁德市蕉城区供热管网',
      coordinateInfo: '119.5268,26.6597',
      statusName: '正常',
      riskLevel: '低风险',
    },
    {
      id: 7,
      locationName: '龙岩市新罗区供热管网',
      coordinateInfo: '117.0227,25.1054',
      statusName: '异常',
      riskLevel: '高风险',
    },
    {
      id: 8,
      locationName: '三明市梅列区供热管网',
      coordinateInfo: '117.6333,26.2717',
      statusName: '正常',
      riskLevel: '低风险',
    },
    {
      id: 9,
      locationName: '南平市延平区供热管网',
      coordinateInfo: '118.1972,26.6597',
      statusName: '已停止',
      riskLevel: '中风险',
    },
    {
      id: 10,
      locationName: '平潭综合实验区供热管网',
      coordinateInfo: '119.7854,25.4615',
      statusName: '正常',
      riskLevel: '低风险',
    },
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
        { key: 'id', label: '编号' },
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
      { name: '运行中', value: 8 },
      { name: '已停止', value: 2 },
    ],
  },
  {
    label: '季节类型配置占比',
    data: [
      { name: '冬季', value: 8 },
      { name: '夏季', value: 2 },
    ],
  },
];

// 第二个饼图的数据
const secondChartData = [
  {
    label: '设备在线率',
    data: [
      { name: '在线', value: 8 },
      { name: '离线/异常', value: 2 },
    ],
  },
  {
    label: '预警触发占比',
    data: [
      { name: '正常', value: 8 },
      { name: '异常', value: 2 },
    ],
  },
];

// 所有折线图和柱状图的数据
const allChartsData = [
  {
    label: '单区域供回水温差近24小时变化趋势',
    type: 'line',
    data: {
      xAxis: [
        '00:00',
        '03:00',
        '06:00',
        '09:00',
        '12:00',
        '15:00',
        '18:00',
        '21:00',
      ],
      series: [15.2, 14.8, 14.5, 15, 15.5, 15.8, 16, 15.7],
    },
  },
  {
    label: '单区域管网压力近24小时变化趋势',
    type: 'line',
    data: {
      xAxis: [
        '00:00',
        '03:00',
        '06:00',
        '09:00',
        '12:00',
        '15:00',
        '18:00',
        '21:00',
      ],
      series: [2.5, 2.4, 2.3, 2.4, 2.5, 2.6, 2.5, 2.4],
    },
  },
  {
    label: '不同供热区域供回水温差对比',
    type: 'bar',
    data: {
      xAxis: ['福州', '厦门', '泉州', '漳州', '莆田'],
      series: [15.5, 14.8, 8.2, 16.5, 15.9],
    },
  },
  {
    label: '各区域设备在线数对比',
    type: 'bar',
    data: {
      xAxis: ['福州', '厦门', '泉州', '漳州', '莆田'],
      series: [1, 1, 1, 1, 0],
    },
  },
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
        type,
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

      if (
        firstChartData[firstChartIndex.value].data &&
        firstChartData[firstChartIndex.value].data.length > 0
      ) {
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

      if (
        secondChartData[secondChartIndex.value].data &&
        secondChartData[secondChartIndex.value].data.length > 0
      ) {
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
  if (
    !barLineChartRef.value ||
    !allChartsData[chartIndex.value] ||
    !allChartsData[chartIndex.value].data
  )
    return;
  if (
    !allChartsData[chartIndex.value].data.xAxis ||
    allChartsData[chartIndex.value].data.xAxis.length === 0
  )
    return;

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
          <div class="card-value" :style="{ color: card.color || '#4A90E2' }">
            {{ card.value }}
          </div>
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
          <div
            v-if="allChartsData.length > 1"
            class="chart-select-wrapper bar-line-select"
          >
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
  flex-shrink: 0;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 260px;
  height: 320px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  overflow: hidden;
  background: #fff;
  border-left: 4px solid #4a90e2;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  color: #6e7e91;
  white-space: nowrap;
}

.card-indicator {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}

.card-value {
  margin-bottom: 4px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
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
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
}

/* 地图容器 */
.map-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
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
  background-color: rgb(255 255 255 / 95%);
  box-shadow: 0 1px 4px rgb(0 0 0 / 10%);
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
