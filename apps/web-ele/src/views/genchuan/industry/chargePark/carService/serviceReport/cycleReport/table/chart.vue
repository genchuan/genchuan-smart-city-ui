<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';

import { getCycleReportChart } from '#/api/genchuan/industry/chargePark/carService/serviceReport/cycleReport/index.js';

import MapComponent from './Mapindex.vue';

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
    title: '救援完成率',
    value: '0%',
    key: 'rescueCompleteRate',
    color: '#67C23A',
    dimension: 'rescue',
  },
  {
    title: '预约成功率',
    value: '0%',
    key: 'reserveSuccessRate',
    color: '#E6A23C',
    dimension: 'reserve',
  },
  {
    title: '投诉处理率',
    value: '0%',
    key: 'complaintHandleRate',
    color: '#F56C6C',
    dimension: 'complaint',
  },
  {
    title: '寻车定位成功率',
    value: '0%',
    key: 'findCarSuccessRate',
    color: '#909399',
    dimension: 'findCar',
  },
  {
    title: '空位推送成功率',
    value: '0%',
    key: 'spacePushSuccessRate',
    color: '#409EFF',
    dimension: 'spacePush',
  },
  {
    title: '生效话术数',
    value: 0,
    key: 'effectiveWordingCount',
    color: '#67C23A',
    dimension: 'wording',
  },
]);

// ========== 图表数据存储 ==========
const chartData = reactive({
  lineData: [],
  barData: [],
  pieData: [],
  mapData: [],
});

// ========== 左侧图表区域 ==========
const leftChartType = ref('line');
const chartTypeOptions = [
  { label: '折线图', value: 'line' },
  { label: '地图', value: 'map' },
];

const barIndex = ref(0);
const barOptions = computed(() => {
  if (chartData.barData.length === 0) return [];
  return chartData.barData.map((item) => ({
    label: item.name,
    value: item.name,
  }));
});
const currentBar = computed(
  () => chartData.barData[barIndex.value] || { name: '', data: [] },
);

const mapIndex = ref(0);
const mapOptions = computed(() => {
  if (chartData.mapData.length === 0) return [];
  return chartData.mapData.map((item) => ({
    label: item.name,
    value: item.name,
  }));
});

const currentMapData = computed(() => {
  const raw = chartData.mapData[mapIndex.value] || { name: '', data: [] };
  const mappedData = (raw.data || [])
    .map((item) => {
      const coord = item.location || item.coordinate;
      if (coord && typeof coord === 'string' && coord.includes(',')) {
        return { ...item, coordinate: coord };
      }
      return null;
    })
    .filter(Boolean);
  return { name: raw.name, data: mappedData };
});

const mapKey = ref(0);

// ========== 右侧饼图区域 ==========
const pieIndex = ref(0);
const pieOptions = computed(() => {
  if (chartData.pieData.length === 0) return [];
  return chartData.pieData.map((item) => ({
    label: item.name,
    value: item.name,
  }));
});
const currentPie = computed(
  () => chartData.pieData[pieIndex.value] || { name: '', data: [] },
);

// ========== 图表容器引用 ==========
const lineChartRef = ref(null);
const barChartRef = ref(null);
const mapRef = ref(null);
const pieChartRef = ref(null);
let lineChart = null;
let barChart = null;
let pieChart = null;

const getDefaultParams = () => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);
  return {
    reportCycle: '月报',
    statStartTime: start.toISOString().slice(0, 19).replace('T', ' '),
    statEndTime: end.toISOString().slice(0, 19).replace('T', ' '),
  };
};

// 当前卡片/图表所用的窗口（与 getDefaultParams 同口径），下钻时随事件向外抛
const currentWindow = () => {
  const p = getDefaultParams();
  return { startTime: p.statStartTime, endTime: p.statEndTime };
};

const fetchData = async () => {
  loading.value = true;
  try {
    const params = getDefaultParams();
    const res = await getCycleReportChart(params);
    const data = res.data || res;

    if (data.cardData) {
      cardList.value.forEach((card) => {
        const val = data.cardData[card.key];
        if (val !== undefined) {
          card.value = card.key.includes('Rate') ? `${val}%` : val;
        }
      });
    }

    chartData.lineData = data.lineData || [];
    chartData.barData = data.barData || [];
    chartData.pieData = data.pieData || [];
    chartData.mapData = data.mapData || [];

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
    // 容器从 display:none 切回可见时,腾讯地图实例的内部尺寸已固化,
    // 通过 mapKey 重建组件让它在已可见容器里重新初始化
    mapKey.value++;
  }
};

const initLineChart = () => {
  if (!lineChartRef.value) return;
  if (lineChart) lineChart.dispose();
  lineChart = echarts.init(lineChartRef.value);
  const dates = chartData.lineData[0]?.data.map((d) => d.date) || [];
  const series = chartData.lineData.map((item, idx) => ({
    name: item.name,
    type: 'line',
    data: item.data.map((d) => d.count),
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: { width: 2 },
    itemStyle: {
      color: freshColors[idx % freshColors.length],
      borderWidth: 2,
      borderColor: '#fff',
    },
  }));
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '服务量趋势',
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
      data: chartData.lineData.map((item) => item.name),
      top: 35,
      type: 'scroll',
      textStyle: { color: '#6E7E91', fontSize: 10 },
      itemWidth: 10,
      itemHeight: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: 70,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 10,
        rotate: 45,
        interval: 'auto',
        formatter: (value) => {
          const parts = String(value).split('-');
          return parts.length === 3
            ? `${Number(parts[1])}/${Number(parts[2])}`
            : value;
        },
      },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
      axisTick: { lineStyle: { color: '#E8F4FD' } },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#9AA8B7', fontSize: 11 },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
      axisTick: { lineStyle: { color: '#E8F4FD' } },
      splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
    },
    series,
  };
  lineChart.setOption(option);
  lineChart.off('click');
  lineChart.on('click', (params) => {
    if (params.componentType !== 'series') return;
    const dim = inferDimension(params.seriesName);
    if (!dim) return;
    // 用 dataIndex 直接从源数据取日期,避免 params.name 被 echarts 调整
    const sourceLine = chartData.lineData.find(
      (l) => l.name === params.seriesName,
    );
    const day = sourceLine?.data?.[params.dataIndex]?.date;
    if (!day) return;
    emit('refresh', {
      dimension: dim,
      startTime: `${day} 00:00:00`,
      endTime: `${day} 23:59:59`,
    });
  });
  nextTick(() => lineChart && lineChart.resize());
};

const initBarChart = () => {
  if (!barChartRef.value) return;
  if (barChart) barChart.dispose();
  barChart = echarts.init(barChartRef.value);
  const categories = currentBar.value.data.map((item) => item.type);
  const values = currentBar.value.data.map((item) => item.count);
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: currentBar.value.name || '分布统计',
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
      formatter: '{b}: {c}',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '18%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: categories,
      axisLabel: {
        color: '#9AA8B7',
        fontSize: 10,
        rotate: 45,
        interval: 0,
        formatter: (value) =>
          value && value.length > 4 ? `${value.slice(0, 4)}...` : value,
      },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
      axisTick: { lineStyle: { color: '#E8F4FD' } },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#9AA8B7', fontSize: 11 },
      axisLine: { lineStyle: { color: '#E8F4FD' } },
      axisTick: { lineStyle: { color: '#E8F4FD' } },
      splitLine: { lineStyle: { color: '#F0F6FC', type: 'dashed' } },
    },
    series: [
      {
        name: currentBar.value.name || '数量',
        type: 'bar',
        data: values,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4A90E2' },
            { offset: 1, color: '#6BB3FF' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        barMaxWidth: 18,
        label: {
          show: true,
          position: 'top',
          color: '#6E7E91',
          fontSize: 12,
          formatter: '{c}',
        },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(74, 144, 226, 0.3)' },
          label: { show: true, fontSize: 14, fontWeight: 'bold' },
        },
      },
    ],
  };
  barChart.setOption(option);
  barChart.off('click');
  barChart.on('click', (params) => {
    if (params.componentType !== 'series') return;
    const dim = inferDimension(currentBar.value.name);
    if (dim)
      emit('refresh', {
        dimension: dim,
        type: params.name,
        ...currentWindow(),
      });
  });
  nextTick(() => barChart && barChart.resize());
};

const initPieChart = () => {
  if (!pieChartRef.value) return;
  if (pieChart) pieChart.dispose();
  pieChart = echarts.init(pieChartRef.value);
  const pieData = currentPie.value.data.map((item) => ({
    name: item.type,
    value: item.count,
  }));
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: currentPie.value.name || '分布统计',
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
      formatter: '{b}: {c} ({d}%)',
    },
    color: freshColors,
    legend: {
      orient: 'horizontal',
      bottom: '3%',
      type: 'scroll',
      left: 'center',
      textStyle: { color: '#6E7E91', fontSize: 10 },
      itemWidth: 10,
      itemHeight: 10,
      formatter(name) {
        return name && name.length > 4 ? `${name.slice(0, 4)}...` : name;
      },
    },
    series: [
      {
        name: currentPie.value.name || '分布统计',
        type: 'pie',
        radius: ['28%', '45%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: true,
        minShowLabelAngle: 5,
        label: {
          show: true,
          position: 'outside',
          formatter(params) {
            const name =
              params.name && params.name.length > 4
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
          label: { show: true, fontSize: 13, fontWeight: 'bold' },
          scale: true,
          scaleSize: 5,
        },
        labelLine: {
          show: true,
          length: 12,
          length2: 8,
          smooth: true,
          lineStyle: { color: '#9AA8B7', width: 1 },
        },
        itemStyle: { borderWidth: 2, borderColor: '#fff' },
        data: pieData,
      },
    ],
  };
  pieChart.setOption(option);
  pieChart.off('click');
  pieChart.on('click', (params) => {
    if (params.componentType !== 'series') return;
    const dim = inferDimension(currentPie.value.name);
    if (dim)
      emit('refresh', {
        dimension: dim,
        type: params.name,
        ...currentWindow(),
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

const onMapIndexChange = () => {
  mapKey.value++;
  nextTick(() => {
    if (mapRef.value) mapRef.value.resize?.();
  });
};

const onPieIndexChange = () => {
  nextTick(() => initPieChart());
};

const handleMapMarkerClick = (location) => {
  emit('refresh', { location });
};

// 根据图表/卡片名称推断 dimension key（用于下钻）
const inferDimension = (name = '') => {
  if (name.includes('救援')) return 'rescue';
  if (name.includes('预约')) return 'reserve';
  if (name.includes('投诉') || name.includes('纠纷')) return 'complaint';
  if (name.includes('寻车') || name.includes('寻找')) return 'findCar';
  if (name.includes('空位') || name.includes('推送')) return 'spacePush';
  if (name.includes('话术')) return 'wording';
  if (name.includes('充停地图')) return 'chargeParkMap';
  if (name.includes('周边场站')) return 'nearStation';
  if (name.includes('路径规划')) return 'pathPlan';
  return null;
};

const onCardClick = (card) => {
  if (!card.dimension) return;
  emit('refresh', { dimension: card.dimension, ...currentWindow() });
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

      <!-- 柱状图(独立) -->
      <div class="chart-box bar-chart-box">
        <div class="chart-select-wrapper">
          <el-select
            v-if="barOptions.length > 0"
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

      <!-- 可切换图表(折线/地图) -->
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
          <el-select
            v-if="leftChartType === 'map' && mapOptions.length > 0"
            v-model="mapIndex"
            size="small"
            style="margin-left: 8px"
            @change="onMapIndexChange"
          >
            <el-option
              v-for="(opt, idx) in mapOptions"
              :key="idx"
              :label="opt.label"
              :value="idx"
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
              :data="currentMapData.data"
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

.charts-wrapper {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 1 1 0;
  align-items: center;
  min-width: 0;
  height: 280px;
  padding: 4px;
}

.chart-box {
  position: relative;
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
  max-width: 260px;
  height: 272px;
  margin-right: 8px;
  overflow: hidden;
  background-color: var(--el-bg-color, #fff);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 5%);
}

.line-chart-box {
  max-width: none;
}

.chart-box:last-child {
  margin-right: 0;
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
