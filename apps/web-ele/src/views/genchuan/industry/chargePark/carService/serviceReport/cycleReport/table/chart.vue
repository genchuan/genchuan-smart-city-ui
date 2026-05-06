<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick, computed } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import { getCycleReportChart } from '#/api/genchuan/industry/chargePark/carService/serviceReport/cycleReport/index.js';
import MapComponent from './Mapindex.vue';

const emit = defineEmits(['refresh']);
const loading = ref(true);

// ========== 卡片数据 ==========
const cardList = ref([
  { title: '救援完成率', value: '0%', key: 'rescueCompleteRate', color: '#67C23A', dimension: 'rescue' },
  { title: '预约成功率', value: '0%', key: 'reserveSuccessRate', color: '#E6A23C', dimension: 'reserve' },
  { title: '投诉处理率', value: '0%', key: 'complaintHandleRate', color: '#F56C6C', dimension: 'complaint' },
  { title: '寻车定位成功率', value: '0%', key: 'findCarSuccessRate', color: '#909399', dimension: 'findCar' },
  { title: '空位推送成功率', value: '0%', key: 'spacePushSuccessRate', color: '#409EFF', dimension: 'spacePush' },
  { title: '生效话术数', value: 0, key: 'effectiveWordingCount', color: '#67C23A', dimension: 'wording' },
]);

// ========== 图表数据存储 ==========
const chartData = reactive({
  lineData: [],
  barData: [],
  pieData: [],
  mapData: [],
});

// ========== 左侧图表区域 ==========
const leftChartType = ref('bar');
const chartTypeOptions = [
  { label: '折线图', value: 'line' },
  { label: '柱状图', value: 'bar' },
  { label: '地图', value: 'map' },
];

const barIndex = ref(0);
const barOptions = computed(() => {
  if (!chartData.barData.length) return [];
  return chartData.barData.map(item => ({ label: item.name, value: item.name }));
});
const currentBar = computed(() => chartData.barData[barIndex.value] || { name: '', data: [] });

const mapIndex = ref(0);
const mapOptions = computed(() => {
  if (!chartData.mapData.length) return [];
  return chartData.mapData.map(item => ({ label: item.name, value: item.name }));
});

const currentMapData = computed(() => {
  const raw = chartData.mapData[mapIndex.value] || { name: '', data: [] };
  const mappedData = (raw.data || [])
    .map(item => {
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
  if (!chartData.pieData.length) return [];
  return chartData.pieData.map(item => ({ label: item.name, value: item.name }));
});
const currentPie = computed(() => chartData.pieData[pieIndex.value] || { name: '', data: [] });

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
    statEndTime: end.toISOString().slice(0, 19).replace('T', ' ')
  };
};

const fetchData = async () => {
  loading.value = true;
  try {
    const params = getDefaultParams();
    const res = await getCycleReportChart(params);
    const data = res.data || res;

    if (data.cardData) {
      cardList.value.forEach(card => {
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
      initPieChart();
    });
  } catch (error) {
    ElMessage.error('加载图表数据失败');
  } finally {
    loading.value = false;
  }
};

const initLeftChart = () => {
  if (leftChartType.value === 'line') {
    initLineChart();
  } else if (leftChartType.value === 'bar') {
    initBarChart();
  } else if (leftChartType.value === 'map') {
    nextTick(() => {
      if (mapRef.value) mapRef.value.resize?.();
    });
  }
};

const initLineChart = () => {
  if (!lineChartRef.value) return;
  if (lineChart) lineChart.dispose();
  lineChart = echarts.init(lineChartRef.value);
  const dates = chartData.lineData[0]?.data.map(d => d.date) || [];
  const series = chartData.lineData.map(item => ({
    name: item.name,
    type: 'line',
    data: item.data.map(d => d.count),
    smooth: true,
  }));
  const option = {
    title: { text: '服务量趋势', left: 'center', top: 5, textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { data: chartData.lineData.map(item => item.name), top: 30, type: 'scroll' },
    grid: { top: 70, bottom: 20, left: 50, right: 30, containLabel: true },
    xAxis: { type: 'category', data: dates, boundaryGap: false },
    yAxis: { type: 'value', name: '数量' },
    series,
  };
  lineChart.setOption(option);
};

const initBarChart = () => {
  if (!barChartRef.value) return;
  if (barChart) barChart.dispose();
  barChart = echarts.init(barChartRef.value);
  const categories = currentBar.value.data.map(item => item.type);
  const values = currentBar.value.data.map(item => item.count);
  const option = {
    title: { text: currentBar.value.name, left: 'center', top: 5, textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 50, bottom: 20, left: 50, right: 30 },
    xAxis: { type: 'category', data: categories, axisLabel: { rotate: 30 } },
    yAxis: { type: 'value', name: '数量' },
    series: [{ type: 'bar', data: values, itemStyle: { borderRadius: [4, 4, 0, 0] } }],
  };
  barChart.setOption(option);
  barChart.off('click');
  barChart.on('click', (params) => {
    if (params.componentType !== 'series') return;
    const dim = inferDimension(currentBar.value.name);
    if (dim) emit('refresh', { dimension: dim, type: params.name });
  });
};

const initPieChart = () => {
  if (!pieChartRef.value) return;
  if (pieChart) pieChart.dispose();
  pieChart = echarts.init(pieChartRef.value);
  const pieData = currentPie.value.data.map(item => ({ name: item.type, value: item.count }));
  const option = {
    title: { text: currentPie.value.name, left: 'center', top: 5, textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
    series: [{
      type: 'pie',
      radius: '55%',
      center: ['50%', '55%'],
      data: pieData,
      label: { show: true, formatter: '{b}: {d}%' },
      emphasis: { scale: true },
    }],
  };
  pieChart.setOption(option);
  pieChart.off('click');
  pieChart.on('click', (params) => {
    if (params.componentType !== 'series') return;
    const dim = inferDimension(currentPie.value.name);
    if (dim) emit('refresh', { dimension: dim, type: params.name });
  });
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
const inferDimension = (name) => {
  const n = name || '';
  if (n.includes('救援')) return 'rescue';
  if (n.includes('预约')) return 'reserve';
  if (n.includes('投诉')) return 'complaint';
  if (n.includes('寻车') || n.includes('寻找')) return 'findCar';
  if (n.includes('空位') || n.includes('推送')) return 'spacePush';
  if (n.includes('话术')) return 'wording';
  return null;
};

const onCardClick = (card) => {
  if (!card.dimension) return;
  emit('refresh', { dimension: card.dimension });
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
  [lineChart, barChart, pieChart].forEach(ch => ch?.dispose());
});
</script>

<template>
  <div v-loading="loading" class="stats-four-visualization">
    <!-- 左侧卡片区域 -->
    <div class="cards-section">
      <div
        v-for="(card, index) in cardList"
        :key="card.key"
        class="stat-card"
        :style="{ borderLeftColor: card.color, cursor: card.dimension ? 'pointer' : 'default' }"
        @click="onCardClick(card)"
      >
        <div class="card-header">
          <span class="card-title">{{ card.title }}</span>
          <div class="card-indicator" :style="{ backgroundColor: card.color }"></div>
        </div>
        <div class="card-body">
          <div class="card-value" :style="{ color: card.color }">{{ card.value }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧图表区域 -->
    <div class="right-section">
      <!-- 左侧：可切换图表 -->
      <div class="chart-box left-chart">
        <div class="chart-select-wrapper">
          <el-select v-model="leftChartType" size="small" @change="onLeftChartTypeChange">
            <el-option v-for="opt in chartTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
          <el-select
            v-if="leftChartType === 'bar' && barOptions.length"
            v-model="barIndex"
            size="small"
            style="margin-left: 8px"
            @change="onBarIndexChange"
          >
            <el-option v-for="(opt, idx) in barOptions" :key="idx" :label="opt.label" :value="idx" />
          </el-select>
          <el-select
            v-if="leftChartType === 'map' && mapOptions.length"
            v-model="mapIndex"
            size="small"
            style="margin-left: 8px"
            @change="onMapIndexChange"
          >
            <el-option v-for="(opt, idx) in mapOptions" :key="idx" :label="opt.label" :value="idx" />
          </el-select>
        </div>
        <div class="chart-container-wrapper">
          <div v-show="leftChartType === 'line'" ref="lineChartRef" class="chart-container"></div>
          <div v-show="leftChartType === 'bar'" ref="barChartRef" class="chart-container"></div>
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

      <!-- 右侧：饼图区域 -->
      <div class="chart-box right-chart">
        <div class="chart-select-wrapper">
          <el-select v-model="pieIndex" size="small" @change="onPieIndexChange">
            <el-option v-for="(opt, idx) in pieOptions" :key="idx" :label="opt.label" :value="idx" />
          </el-select>
        </div>
        <div class="chart-container-wrapper">
          <div ref="pieChartRef" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-four-visualization {
  display: flex;
  gap: 20px;
  width: 100%;
  /* 固定高度与示例一致，移除多余 padding */
  min-height: 320px;
  border-radius: 8px;
  background-color: var(--el-bg-color, #fff);
}
.cards-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 260px;
  flex-shrink: 0;
}
.stat-card {
  padding: 12px 14px;
  border-radius: 8px;
  border-left: 4px solid #4a90e2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.card-title {
  font-size: 13px;
  color: #6e7e91;
  font-weight: 600;
}
.card-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.card-body {
  flex: 1;
  display: flex;
  align-items: center;
}
.card-value {
  font-size: 22px;
  font-weight: 700;
}
.right-section {
  flex: 1;
  display: flex;
  gap: 20px;
  height: 320px; /* 固定高度，与示例一致 */
}
.chart-box {
  flex: 1;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  background-color: var(--el-bg-color, #fff);
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
  min-height: 320px;
}
</style>
