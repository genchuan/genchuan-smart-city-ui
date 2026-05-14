<!-- chart.vue - 能耗图表组件（已移除地图下拉框，优化坐标轴显示） -->
<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';

import { getEnergyCycleReportChart } from '#/api/genchuan/industry/industrialpark/energyMgmt/energyReport/cycleReport/index.js';

import MapComponent from './Mapindex.vue';

const props = defineProps({
  cycleType: { type: String, default: '' }
});
const emit = defineEmits(['refresh']);
const loading = ref(true);

const freshColors = [
  '#4A90E2',
  '#50E3C2',
  '#FF9F40',
  '#A17FE0',
  '#FF6B8B',
  '#FFD93D',
];

// ========== 卡片数据 ==========
const cardList = ref([
  {
    title: '总能耗量',
    value: '0 kWh',
    key: 'totalEnergy',
    color: '#67C23A',
    dimension: 'totalEnergy',
    unit: 'kWh'
  },
  {
    title: '单位能耗',
    value: '0 kWh/㎡',
    key: 'unitEnergy',
    color: '#E6A23C',
    dimension: 'unitEnergy',
    unit: 'kWh/㎡'
  },
  {
    title: '节能总量',
    value: '0 kWh',
    key: 'saveEnergy',
    color: '#F56C6C',
    dimension: 'saveEnergy',
    unit: 'kWh'
  },
  {
    title: '异常预警数',
    value: 0,
    key: 'alarmCount',
    color: '#909399',
    dimension: 'alarmCount',
    unit: '次'
  },
  {
    title: '管控设备数',
    value: 0,
    key: 'controlDeviceCount',
    color: '#409EFF',
    dimension: 'controlDevice',
    unit: '台'
  },
]);

// ========== 图表数据存储 ==========
const chartData = reactive({
  lineData: [],      // 趋势数据 { energyTrendLine, saveTrendLine, alarmTrendLine }
  barData: [],       // 柱状图数据 { areaEnergyBar, deviceEnergyBar, diffBar }
  pieData: [],       // 饼图数据 { energyTypePie, areaEnergyPie, saveTypePie }
  mapData: [],       // 地图数据 areaMapData
  currentTrendType: ref('energy'), // energy, save, alarm
});

// ========== 左侧图表区域 ==========
const leftChartType = ref('line');
const chartTypeOptions = [
  { label: '折线图', value: 'line' },
  { label: '地图', value: 'map' },
];

// 柱状图切换
const barIndex = ref(0);
const barOptions = computed(() => [
  { label: '各区域能耗分布', value: 'area' },
  { label: '各设备能耗分布', value: 'device' },
  { label: '同比环比能耗差值', value: 'diff' }
]);
const currentBarType = computed(() => barOptions.value[barIndex.value]?.value || 'area');

// 地图数据（不再使用下拉框，直接展示全部）
const currentMapData = computed(() => {
  if (!chartData.mapData.length) return [];
  return chartData.mapData.map(item => ({
    ...item,
    coordinate: `${item.lon},${item.lat}`,
    location: `${item.lon},${item.lat}`,
    name: item.areaName
  }));
});

const mapKey = ref(0);

// ========== 右侧饼图区域 ==========
const pieIndex = ref(0);
const pieOptions = computed(() => [
  { label: '能耗类型占比', value: 'energyType' },
  { label: '区域能耗占比', value: 'areaEnergy' },
  { label: '节能方式占比', value: 'saveType' }
]);
const currentPieType = computed(() => pieOptions.value[pieIndex.value]?.value || 'energyType');

// ========== 图表容器引用 ==========
const lineChartRef = ref(null);
const barChartRef = ref(null);
const mapRef = ref(null);
const pieChartRef = ref(null);
let lineChart = null;
let barChart = null;
let pieChart = null;

// 获取当前激活的报表ID（用于图表数据请求）
const getCurrentReportId = async () => {
  // 模拟获取最新报表ID，实际应通过props或从列表获取
  return 1;
};

const fetchData = async () => {
  loading.value = true;
  try {
    const reportId = await getCurrentReportId();
    const params = { reportId };
    if (props.cycleType && props.cycleType !== '') {
      params.reportType = props.cycleType;
    }
    const res = await getEnergyCycleReportChart(params);
    const data = res.data || res;

    if (data.cardData) {
      cardList.value.forEach((card) => {
        const val = data.cardData[card.key];
        if (val !== undefined) {
          let displayVal = val;
          if (card.key === 'totalEnergy') displayVal = `${val} kWh`;
          if (card.key === 'unitEnergy') displayVal = `${val} kWh/㎡`;
          if (card.key === 'saveEnergy') displayVal = `${val} kWh`;
          card.value = displayVal;
        }
      });
    }

    // 组装趋势线数据
    const energyTrend = (data.energyTrendLine || []).map(item => ({ date: item.day, value: item.value, name: '能耗趋势' }));
    const saveTrend = (data.saveTrendLine || []).map(item => ({ date: item.day, value: item.value, name: '节能趋势' }));
    const alarmTrend = (data.alarmTrendLine || []).map(item => ({ date: item.day, value: item.value, name: '预警趋势' }));
    chartData.lineData = [energyTrend, saveTrend, alarmTrend].filter(arr => arr.length > 0);

    // 柱状图数据存储
    chartData.barData = {
      area: data.areaEnergyBar || [],
      device: data.deviceEnergyBar || [],
      diff: data.diffBar || []
    };

    // 饼图数据存储
    chartData.pieData = {
      energyType: data.energyTypePie || [],
      areaEnergy: data.areaEnergyPie || [],
      saveType: data.saveTypePie || []
    };

    chartData.mapData = data.areaMapData || [];

    nextTick(() => {
      initLeftChart();
      initBarChart();
      initPieChart();
    });
  } catch {
    ElMessage.error('加载图表数据失败');
  } finally {
    loading.value = false;
  }
};

const initLeftChart = () => {
  if (leftChartType.value === 'line') {
    initLineChart();
  } else if (leftChartType.value === 'map') {
    mapKey.value++;
  }
};

const initLineChart = () => {
  if (!lineChartRef.value) return;
  if (lineChart) lineChart.dispose();
  lineChart = echarts.init(lineChartRef.value);

  const dates = chartData.lineData[0]?.map(d => d.date) || [];
  const series = [];
  const seriesMap = {
    energy: { name: '能耗趋势', data: chartData.lineData[0] || [], color: freshColors[0] },
    save: { name: '节能趋势', data: chartData.lineData[1] || [], color: freshColors[1] },
    alarm: { name: '预警趋势', data: chartData.lineData[2] || [], color: freshColors[2] }
  };

  Object.values(seriesMap).forEach((item) => {
    if (item.data.length) {
      series.push({
        name: item.name,
        type: 'line',
        data: item.data.map(d => d.value),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: item.color },
        itemStyle: { color: item.color, borderWidth: 2, borderColor: '#fff' },
        yAxisIndex: item.name === '预警趋势' ? 1 : 0
      });
    }
  });

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '能耗趋势分析',
      left: 'center',
      top: 10,
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
      data: series.map(s => s.name),
      top: 35,
      type: 'scroll',
      textStyle: { color: '#6E7E91', fontSize: 10 },
      itemWidth: 10,
      itemHeight: 10,
    },
    grid: {
      left: '10%',   // 增大左边距，为Y轴标签留出空间
      right: '8%',   // 增大右边距，为双Y轴标签留出空间
      bottom: '15%', // 增大底边距，确保X轴旋转标签完整显示
      top: 70,
      containLabel: false, // 不再自动包含标签，手动控制留白
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 11,   // 稍微增大字号
        rotate: 30,     // 减小旋转角度，避免过度倾斜
        interval: 0,
        margin: 12,
      },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
      axisTick: { lineStyle: { color: '#E8F4FD' } },
      splitLine: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        name: '能耗/节能 (kWh)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: { color: '#9AA8B7', fontSize: 11 },
        splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
      },
      {
        type: 'value',
        name: '预警次数 (次)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: { color: '#9AA8B7', fontSize: 11 },
        splitLine: { show: false },
      }
    ],
    series,
  };
  lineChart.setOption(option);
  lineChart.off('click');
  lineChart.on('click', (params) => {
    if (params.componentType !== 'series') return;
    const date = dates[params.dataIndex];
    if (date) {
      emit('refresh', {
        dimension: params.seriesName === '预警趋势' ? 'alarm' : (params.seriesName === '节能趋势' ? 'save' : 'energy'),
        startTime: `${date} 00:00:00`,
        endTime: `${date} 23:59:59`,
      });
    }
  });
  nextTick(() => lineChart && lineChart.resize());
};

const initBarChart = () => {
  if (!barChartRef.value) return;
  if (barChart) barChart.dispose();
  barChart = echarts.init(barChartRef.value);

  let categories = [];
  let values = [];
  let chartTitle = '';
  let yAxisName = '能耗 (kWh)';

  const barData = chartData.barData;
  switch(currentBarType.value) {
    case 'area':
      categories = barData.area.map(item => item.name);
      values = barData.area.map(item => item.value);
      chartTitle = '各区域能耗分布';
      break;
    case 'device':
      categories = barData.device.map(item => item.name);
      values = barData.device.map(item => item.value);
      chartTitle = '各设备能耗分布';
      break;
    case 'diff':
      categories = barData.diff.map(item => item.name);
      values = barData.diff.map(item => item.value);
      chartTitle = '同比环比能耗差值';
      yAxisName = '差值 (kWh)';
      break;
  }

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: chartTitle,
      left: 'center',
      top: 10,
      textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 500 },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
      axisPointer: { type: 'shadow' },
      formatter: '{b}: {c} kWh',
    },
    grid: {
      left: '10%',   // 增大左边距
      right: '5%',
      bottom: '15%', // 增大底边距，确保旋转后的X轴标签完整显示
      top: '18%',
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: categories,
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 11,
        rotate: 30,     // 减小旋转角度，配合底部留白让文字完整显示
        interval: 0,
        margin: 12,
        formatter: (value) => value, // 不再截断，完整显示
      },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameLocation: 'middle',
      nameGap: 50,
      axisLabel: { color: '#9AA8B7', fontSize: 11 },
      splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
    },
    series: [{
      name: chartTitle,
      type: 'bar',
      data: values,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#4A90E2' },
          { offset: 1, color: '#6BB3FF' },
        ]),
        borderRadius: [4, 4, 0, 0],
      },
      barMaxWidth: 30,  // 适当增加最大宽度，避免过细
      label: {
        show: true,
        position: 'top',
        color: '#6E7E91',
        fontSize: 12,
        formatter: (p) => `${p.value} kWh`,
      },
    }],
  };
  barChart.setOption(option);
  barChart.off('click');
  barChart.on('click', (params) => {
    if (params.componentType !== 'series') return;
    const name = categories[params.dataIndex];
    if (name) {
      emit('refresh', {
        dimension: currentBarType.value === 'area' ? 'area' : (currentBarType.value === 'device' ? 'device' : 'diff'),
        type: name,
      });
    }
  });
  nextTick(() => barChart && barChart.resize());
};

const initPieChart = () => {
  if (!pieChartRef.value) return;
  if (pieChart) pieChart.dispose();
  pieChart = echarts.init(pieChartRef.value);

  let pieData = [];
  let chartTitle = '';
  const pieDataObj = chartData.pieData;
  switch(currentPieType.value) {
    case 'energyType':
      pieData = pieDataObj.energyType || [];
      chartTitle = '能耗类型占比';
      break;
    case 'areaEnergy':
      pieData = pieDataObj.areaEnergy || [];
      chartTitle = '区域能耗占比';
      break;
    case 'saveType':
      pieData = pieDataObj.saveType || [];
      chartTitle = '节能方式占比';
      break;
  }

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: chartTitle,
      left: 'center',
      top: 10,
      textStyle: { color: '#6E7E91', fontSize: 14, fontWeight: 500 },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E8F4FD',
      borderWidth: 1,
      textStyle: { color: '#6E7E91' },
      formatter: '{b}: {d}%',
    },
    color: freshColors,
    legend: {
      orient: 'vertical',      // 垂直排列
      left: 'right',           // 放在右侧
      top: 'center',           // 垂直居中
      type: 'scroll',
      textStyle: { color: '#6E7E91', fontSize: 11 },
      itemWidth: 12,
      itemHeight: 12,
      formatter(name) {
        return name && name.length > 10 ? `${name.slice(0, 10)}...` : name;
      },
    },
    series: [{
      name: chartTitle,
      type: 'pie',
      radius: ['40%', '60%'],     // 稍微缩小半径，为图例腾出空间
      center: ['40%', '52%'],     // 向左偏移，避免与右侧图例重叠
      data: pieData,
      label: {
        show: true,
        position: 'inside',       // 标签放在扇形内部，不占用外部空间
        formatter: '{d}%',
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
        textShadowBlur: 2,
        textShadowColor: 'rgba(0,0,0,0.3)',
      },
      emphasis: {
        label: { show: true, fontSize: 12, fontWeight: 'bold' }
      },
      labelLine: { show: false }, // 内部标签无需引导线
      itemStyle: { borderWidth: 2, borderColor: '#fff' },
    }],
  };
  pieChart.setOption(option);
  pieChart.off('click');
  pieChart.on('click', (params) => {
    if (params.componentType !== 'series') return;
    emit('refresh', {
      dimension: currentPieType.value,
      type: params.name,
    });
  });
  nextTick(() => pieChart && pieChart.resize());
};

const onLeftChartTypeChange = () => {
  nextTick(() => initLeftChart());
};

const onBarIndexChange = () => {
  nextTick(() => initBarChart());
};

const onPieIndexChange = () => {
  nextTick(() => initPieChart());
};

const handleMapMarkerClick = (location) => {
  emit('refresh', { location });
};

const inferDimension = (cardKey) => {
  if (cardKey === 'totalEnergy') return 'totalEnergy';
  if (cardKey === 'unitEnergy') return 'unitEnergy';
  if (cardKey === 'saveEnergy') return 'saveEnergy';
  if (cardKey === 'alarmCount') return 'alarm';
  if (cardKey === 'controlDeviceCount') return 'controlDevice';
  return cardKey;
};

const onCardClick = (card) => {
  if (!card.dimension) return;
  emit('refresh', { dimension: inferDimension(card.key) });
};

const handleResize = () => {
  if (lineChart) lineChart.resize();
  if (barChart) barChart.resize();
  if (pieChart) pieChart.resize();
  if (mapRef.value) mapRef.value.resize?.();
};

onMounted(() => {
  fetchData();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  [lineChart, barChart, pieChart].forEach((ch) => ch?.dispose());
});
</script>

<template>
  <div v-loading="loading" class="stats-four-visualization">
    <!-- 左侧卡片区域 -->
    <div class="cards-section">
      <div
        v-for="card in cardList"
        :key="card.key"
        class="stat-card"
        :style="{
          borderLeftColor: card.color,
          cursor: card.dimension ? 'pointer' : 'default',
        }"
        @click="onCardClick(card)"
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
        </div>
      </div>
    </div>

    <!-- 右侧图表区域 -->
    <div class="charts-wrapper">
      <!-- 饼图 -->
      <div class="chart-box pie-chart-box">
        <div class="chart-select-wrapper">
          <el-select v-model="pieIndex" size="small" @change="onPieIndexChange">
            <el-option
              v-for="(opt, idx) in pieOptions"
              :key="idx"
              :label="opt.label"
              :value="idx"
            />
          </el-select>
        </div>
        <div class="chart-container-wrapper">
          <div ref="pieChartRef" class="chart-container"></div>
        </div>
      </div>

      <!-- 柱状图 -->
      <div class="chart-box bar-chart-box">
        <div class="chart-select-wrapper">
          <el-select
            v-model="barIndex"
            size="small"
            @change="onBarIndexChange"
          >
            <el-option
              v-for="(opt, idx) in barOptions"
              :key="idx"
              :label="opt.label"
              :value="idx"
            />
          </el-select>
        </div>
        <div class="chart-container-wrapper">
          <div ref="barChartRef" class="chart-container"></div>
        </div>
      </div>

      <!-- 可切换图表(折线/地图) - 已移除地图下拉框 -->
      <div class="chart-box line-chart-box">
        <div class="chart-select-wrapper">
          <el-select
            v-model="leftChartType"
            size="small"
            @change="onLeftChartTypeChange"
          >
            <el-option
              v-for="opt in chartTypeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </div>
        <div class="chart-container-wrapper">
          <div
            v-show="leftChartType === 'line'"
            ref="lineChartRef"
            class="chart-container"
          ></div>
          <div v-show="leftChartType === 'map'" class="chart-container">
            <MapComponent
              :key="mapKey"
              ref="mapRef"
              :data="currentMapData"
              @marker-click="handleMapMarkerClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-four-visualization {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: auto;
  min-height: 280px;
  padding-bottom: 0.5rem;
  overflow: hidden;
}

.cards-section {
  display: flex;
  flex-shrink: 0;
  flex-flow: row wrap;
  gap: 4px;
  align-content: stretch;
  width: 420px;
  height: 280px;
  padding: 4px;
  overflow: hidden;
}

.stat-card {
  box-sizing: border-box;
  display: flex;
  flex: 1 1 calc(33.333% - 3px);
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  padding: 4px 8px;
  background-color: var(--el-bg-color, #fff);
  border-left: 4px solid #4a90e2;
  border-radius: 4px;
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
  margin-bottom: 4px;
}

.card-title {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: #6e7e91;
}

.card-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-value {
  font-size: 20px;
  font-weight: 600;
}

/* 图表区域 - 调整比例：饼图缩小，柱状图和折线图扩大 */
.charts-wrapper {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 1 1 0;
  align-items: center;
  min-width: 0;
  height: 280px;
  padding: 4px;
  gap: 8px;
}

.chart-box {
  position: relative;
  box-sizing: border-box;
  min-width: 0;
  height: 272px;
  overflow: hidden;
  background-color: var(--el-bg-color, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 5%);
}

/* 饼图宽度缩小 */
.pie-chart-box {
  flex: 0.6;
  min-width: 200px;
}

/* 柱状图和折线图均分剩余空间，给予足够宽度显示坐标轴 */
.bar-chart-box,
.line-chart-box {
  flex: 1;
  min-width: 0;
}

.chart-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 20;
  display: flex;
  gap: 8px;
}

.chart-container {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.chart-container-wrapper {
  width: 100%;
  height: 100%;
}
</style>
