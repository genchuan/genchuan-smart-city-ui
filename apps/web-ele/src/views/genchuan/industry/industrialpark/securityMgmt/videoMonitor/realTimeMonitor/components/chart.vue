<script setup>
import { ref, computed, onMounted } from 'vue';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import MapCommon from './MapCommon.vue';
import { getRealTimeMonitorChart } from '#/api/genchuan/industry/industrialpark/securityMgmt/videoMonitor/realTimeMonitor/data.js';

const loading = ref(true);
const chartData = ref({
  onlineCount: 0,
  offlineCount: 0,
  alarmTotalCount: 0,
  handleCompleteCount: 0,
  areaStatList: [],
  cameraMapList: [],
});

// 卡片数据
const cardList = computed(() => [
  { title: '在线摄像头数', value: chartData.value.onlineCount, color: '#67C23A', status: 'online' },
  { title: '离线摄像头数', value: chartData.value.offlineCount, color: '#F56C6C', status: 'offline' },
  { title: '告警总数', value: chartData.value.alarmTotalCount, color: '#E6A23C', status: 'alarm' },
  { title: '处置完成数', value: chartData.value.handleCompleteCount, color: '#409EFF', status: 'handle' },
]);

// 柱状图数据（各区域摄像头数量）
const barData = computed(() => {
  const areaList = chartData.value.areaStatList || [];
  return {
    xData: areaList.map(item => item.area),
    seriesData: [
      { name: '在线', data: areaList.map(item => item.onlineCount) },
      { name: '离线', data: areaList.map(item => item.offlineCount) },
    ],
  };
});

// 地图标注点数据
const geometriesArray = computed(() => {
  const points = chartData.value.cameraMapList || [];
  return points.map(point => ({
    id: point.id,
    stationName: point.cameraName,
    lon: point.lon,
    lat: point.lat,
    stationStatus: point.runStatus === '正常' ? 'enabled' : (point.runStatus === '异常' ? 'disabled' : 'wait'),
    statusName: point.runStatus,
  }));
});

const emit = defineEmits(['cardSelect', 'barSelect', 'markerSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (areaName) => {
  emit('barSelect', { field: 'area', value: areaName });
};

const handleMarkerClick = (stationName) => {
  emit('markerSelect', stationName);
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getRealTimeMonitorChart();
    chartData.value = res;
  } catch (error) {
    console.error('加载图表数据失败', error);
    // 模拟数据
    chartData.value = {
      onlineCount: 28,
      offlineCount: 2,
      alarmTotalCount: 5,
      handleCompleteCount: 3,
      areaStatList: [
        { area: '园区大门', count: 4, onlineCount: 4, offlineCount: 0 },
        { area: '办公楼', count: 10, onlineCount: 9, offlineCount: 1 },
        { area: '生产车间', count: 8, onlineCount: 7, offlineCount: 1 },
        { area: '仓库区', count: 6, onlineCount: 6, offlineCount: 0 },
        { area: '停车场', count: 2, onlineCount: 2, offlineCount: 0 },
      ],
      cameraMapList: [
        { id: 1, cameraName: '大门摄像头', lon: 118.675, lat: 24.896, runStatus: '正常' },
        { id: 2, cameraName: '办公楼东', lon: 118.678, lat: 24.898, runStatus: '正常' },
        { id: 3, cameraName: '办公楼西', lon: 118.676, lat: 24.897, runStatus: '异常' },
        { id: 4, cameraName: '车间A', lon: 118.672, lat: 24.892, runStatus: '正常' },
        { id: 5, cameraName: '仓库北', lon: 118.680, lat: 24.893, runStatus: '正常' },
        { id: 6, cameraName: '停车场南', lon: 118.682, lat: 24.890, runStatus: '离线' },
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
    <div class="box-left">
      <Indicator class="left-card" v-for="item in cardList" :key="item.title" v-bind="item" @click="handleCardClick" />
    </div>

    <Bar
      style="flex: 1.2 !important;"
      title="各区域摄像头数量统计"
      :x-data="barData.xData"
      :series-data="barData.seriesData"
      y-name="摄像头数量"
      @bar-click="handleBarClick"
    />

    <div class="chart-wrapper" style="flex: 1.5 !important;">
      <MapCommon
        idName="monitorMap"
        :geometriesArray="geometriesArray"
        @markerClick="handleMarkerClick"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  width: 100%;
  padding: 0 15px;

  .box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

  .chart-wrapper {
    display: flex;
    flex-direction: column;
    max-height: 330px;
    position: relative;
  }
}
</style>
