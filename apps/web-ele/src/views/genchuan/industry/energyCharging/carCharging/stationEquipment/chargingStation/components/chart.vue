<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/bar.vue';
import MapCommon from './MapCommon.vue';

import { getChargingStationChartData } from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingStation/data.js';

// ==================== 模拟数据（仅用于接口异常降级） ====================
const mockBackendData = {
  stationMapList: [
    { id: 1, stationName: '泉州丰泽充电站', lon: 118.58942, lat: 24.90735, stationStatus: '已启用' },
    { id: 2, stationName: '泉州鲤城充电站', lon: 118.59012, lat: 24.89654, stationStatus: '已启用' },
    { id: 3, stationName: '泉州洛江充电站', lon: 118.61234, lat: 24.91234, stationStatus: '已启用' },
    { id: 4, stationName: '泉州晋江充电站', lon: 118.55678, lat: 24.85678, stationStatus: '已启用' },
    { id: 5, stationName: '泉州石狮充电站', lon: 118.62345, lat: 24.75678, stationStatus: '已启用' },
    { id: 6, stationName: '泉州南安充电站', lon: 118.45678, lat: 24.6789, stationStatus: '已启用' },
    { id: 7, stationName: '泉州惠安充电站', lon: 118.71234, lat: 24.95678, stationStatus: '已启用' },
    { id: 8, stationName: '泉州泉港充电站', lon: 118.81234, lat: 25.01234, stationStatus: '已停用' },
    { id: 9, stationName: '泉州台商充电站', lon: 118.65678, lat: 24.88888, stationStatus: '已启用' },
    { id: 10, stationName: '泉州惠安充电站', lon: 0, lat: 0, stationStatus: '已启用' },
    { id: 11, stationName: '泉州台商充电站', lon: 0, lat: 0, stationStatus: '已启用' },
    { id: 12, stationName: '泉州鲤城汽车站充电站', lon: 118.592145, lat: 24.910236, stationStatus: '已启用' },
    { id: 16, stationName: '泉州丰泽万达广场充电站', lon: 0.000001, lat: 0.000001, stationStatus: '已启用' },
    { id: 17, stationName: '泉州鲤城汽车站充电站', lon: 118.592145, lat: 24.910236, stationStatus: '未启用' }
  ],
  areaBarList: [
    { areaName: '泉州市', totalCount: 14, enableCount: 12 }
  ],
  cardInfo: {
    totalCount: 14,
    enableCount: 12,
    disableCount: 1,
    unEnableCount: 1
  }
};

// 转换后端数据为前端所需结构
const transformBackendData = (backendData) => {
  const stationPoints = (backendData.stationMapList || [])
    .filter(point => {
      const lon = point.lon;
      const lat = point.lat;
      return lon && lat && Math.abs(lon) > 0.0001 && Math.abs(lat) > 0.0001;
    })
    .map(point => ({
      id: point.id,
      stationName: point.stationName,
      lon: point.lon,
      lat: point.lat,
      stationStatus: point.stationStatus,
    }));

  const areaBarList = backendData.areaBarList || [];
  let areaList = [];
  if (areaBarList.length) {
    areaList = areaBarList.map(item => ({
      areaName: item.areaName,
      count: item.totalCount || 0
    }));
  } else {
    areaList = [{ areaName: '暂无数据', count: 0 }];
  }

  const cardInfo = backendData.cardInfo || {};

  return {
    totalCount: cardInfo.totalCount ?? 0,
    enableCount: cardInfo.enableCount ?? 0,
    disableCount: cardInfo.disableCount ?? 0,
    waitCount: cardInfo.unEnableCount ?? 0,
    areaList: areaList,
    stationPoints: stationPoints,
  };
};

// ==================== 状态管理 ====================
const chartData = ref({ ...transformBackendData(mockBackendData) });
const loading = ref(false);

// 柱状图数据
const barState = reactive({
  title: '各区域充电场站数量统计',
  xData: [],
  seriesData: [],
  yName: '',
});

// 卡片数据（增加 status 标识，用于筛选）
const cardList = computed(() => [
  { title: '总场站数', value: chartData.value.totalCount, color: '#409EFF', status: 'total' },
  { title: '启用场站数', value: chartData.value.enableCount, color: '#67C23A', status: 'enabled' },
  { title: '停用场站数', value: chartData.value.disableCount, color: '#F56C6C', status: 'disabled' },
  { title: '未启用场站数', value: chartData.value.waitCount, color: '#E6A23C', status: 'wait' },
]);

// 地图数据
const geometriesArray = computed(() => chartData.value.stationPoints);

// 更新柱状图
const updateBarChart = () => {
  const areaList = chartData.value.areaList;
  barState.xData = areaList.map(item => item.areaName);
  barState.seriesData = [{ name: '场站数量', data: areaList.map(item => item.count) }];
};

// ==================== 初始化加载真实数据 ====================
const fetchChartData = async () => {
  loading.value = true;
  try {
    const result = await getChargingStationChartData();
    if (result && typeof result === 'object' && result.stationMapList) {
      chartData.value = transformBackendData(result);
      updateBarChart();
      console.log('使用真实接口数据');
    } else {
      throw new Error('接口返回数据格式异常');
    }
  } catch (error) {
    console.warn('接口调用失败，使用模拟数据：', error);
    chartData.value = transformBackendData(mockBackendData);
    updateBarChart();
    ElMessage.info('当前使用模拟数据，展示总览信息');
  } finally {
    loading.value = false;
  }
};

// ==================== 事件处理（向父组件发出筛选事件） ====================
const emit = defineEmits(['cardSelect', 'barSelect', 'markerSelect']);

// 卡片点击
const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

// 地图标注点点击（场站名称）
const handleMarkerClick = (properties) => {
  if (properties && properties.stationName) {
    emit('markerSelect', properties.stationName);
  }
};

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <div class="chart-wrapper" style="flex: 1.5 !important;">
      <Bar
        :title="barState.title"
        :x-data="barState.xData"
        :series-data="barState.seriesData"
        :y-name="barState.yName"
      />
    </div>

    <div class="chart-wrapper" style="flex: 2 !important;">
      <MapCommon
        idName="chargingStationMap"
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
