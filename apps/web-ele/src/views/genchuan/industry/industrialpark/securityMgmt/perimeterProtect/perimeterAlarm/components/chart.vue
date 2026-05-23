<!-- 文件5: src/views/genchuan/industry/industrialpark/securityMgmt/perimeterProtect/perimeterAlarm/components/chart.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import MapCommon from './MapCommon.vue';
import { getPerimeterAlarmChart } from '#/api/genchuan/industry/industrialpark/securityMgmt/perimeterProtect/perimeterAlarm/data.js';

const loading = ref(true);
const chartData = ref({
  alarmTotalCount: 0,
  handleCount: 0,
  unHandleCount: 0,
  dailyAlarmList: [],
  areaAlarmList: [],
  alarmMapList: [],
});

// 卡片数据
const cardList = computed(() => [
  { title: '告警总数', value: chartData.value.alarmTotalCount, color: '#F56C6C', status: 'total' },
  { title: '已处置数', value: chartData.value.handleCount, color: '#67C23A', status: 'handled' },
  { title: '未处置数', value: chartData.value.unHandleCount, color: '#E6A23C', status: 'unhandled' },
]);

// 每日告警次数柱状图
const dailyBarData = computed(() => {
  const data = chartData.value.dailyAlarmList || [];
  return {
    xData: data.map(item => item.date),
    seriesData: [{ name: '告警次数', data: data.map(item => item.count) }],
  };
});

// 各区域告警分布柱状图
const areaBarData = computed(() => {
  const data = chartData.value.areaAlarmList || [];
  return {
    xData: data.map(item => item.area),
    seriesData: [{ name: '告警次数', data: data.map(item => item.count) }],
  };
});

// 地图告警点位数据
const geometriesArray = computed(() => {
  const points = chartData.value.alarmMapList || [];
  return points.map(point => ({
    id: point.id,
    cameraName: point.alarmArea,
    lon: point.lon,
    lat: point.lat,
    stationStatus: point.alarmType === '入侵' ? 'enabled' : 'disabled',
    statusName: point.alarmType,
  }));
});

// 当前激活的柱状图类型（daily / area）
const activeBarType = ref('daily');
const barOptions = {
  daily: { title: '每日告警次数', data: dailyBarData, yName: '告警次数' },
  area: { title: '各区域告警分布', data: areaBarData, yName: '告警次数' },
};
const currentBar = computed(() => barOptions[activeBarType.value]);

const emit = defineEmits(['cardSelect', 'barSelect', 'markerSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (value) => {
  if (activeBarType.value === 'daily') {
    emit('barSelect', { field: 'alarmTime', value });
  } else {
    emit('barSelect', { field: 'alarmArea', value });
  }
};

const handleMarkerClick = (alarmArea) => {
  emit('markerSelect', alarmArea);
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getPerimeterAlarmChart();
    chartData.value = res;
  } catch (error) {
    console.error('加载图表数据失败', error);
    chartData.value = {
      alarmTotalCount: 15,
      handleCount: 12,
      unHandleCount: 3,
      dailyAlarmList: [
        { date: '2025-05-01', count: 2 },
        { date: '2025-05-02', count: 3 },
        { date: '2025-05-03', count: 4 },
        { date: '2025-05-04', count: 2 },
        { date: '2025-05-05', count: 3 },
        { date: '2025-05-06', count: 1 },
      ],
      areaAlarmList: [
        { area: '北围墙', count: 5 },
        { area: '东围墙', count: 3 },
        { area: '南围墙', count: 4 },
        { area: '西围墙', count: 3 },
      ],
      alarmMapList: [
        { id: 1, alarmArea: '北围墙东段', lon: 118.675, lat: 24.896, alarmType: '入侵' },
        { id: 2, alarmArea: '北围墙西段', lon: 118.672, lat: 24.896, alarmType: '破坏' },
        { id: 3, alarmArea: '东围墙北段', lon: 118.680, lat: 24.898, alarmType: '入侵' },
        { id: 4, alarmArea: '南围墙中段', lon: 118.678, lat: 24.890, alarmType: '入侵' },
        { id: 5, alarmArea: '西围墙南段', lon: 118.668, lat: 24.892, alarmType: '破坏' },
      ],
    };
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <!-- 左侧卡片区域 -->
    <div class="chart-box-left">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 柱状图区域（带下拉切换） -->
    <div class="chart-area">
      <div class="chart-select-wrapper">
        <el-select v-model="activeBarType" size="small">
          <el-option label="每日告警次数" value="daily" />
          <el-option label="各区域告警分布" value="area" />
        </el-select>
      </div>
      <Bar
        :title="currentBar.title"
        :x-data="currentBar.data.value.xData"
        :series-data="currentBar.data.value.seriesData"
        :y-name="currentBar.yName"
        @bar-click="handleBarClick"
      />
    </div>

    <!-- 地图区域 -->
    <div class="chart-wrapper" style="flex: 1.5 !important;">
      <MapCommon
        idName="perimeterAlarmMap"
        :geometriesArray="geometriesArray"
        @markerClick="handleMarkerClick"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right: 15px;
  width: 100% !important;

  .chart-box-left {
    display: flex;
    flex: 0 0 max(280px, min(25vw, 320px));
    flex-direction: column;
    gap: 12px;
    min-width: 200px;
    max-width: 240px;
    margin: 0;
  }

  .chart-area {
    position: relative;
    flex: 1.5;
    min-width: 300px;
    display: flex;
    flex-direction: column;
  }

  .chart-select-wrapper {
    position: absolute;
    top: 8px;
    right: 10px;
    z-index: 10;
  }

  .chart-wrapper {
    display: flex;
    flex-direction: column;
    max-height: 330px;
    position: relative;
  }
}
</style>
