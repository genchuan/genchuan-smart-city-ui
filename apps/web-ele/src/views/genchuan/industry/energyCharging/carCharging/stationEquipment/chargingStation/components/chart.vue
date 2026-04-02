<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { ArrowLeft, RefreshRight } from '@element-plus/icons-vue';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import MapCommon from './MapCommon.vue';

import {
  getChargingStationChartData,
  getAreaCountChart,
  getStatusCountChart
} from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingStation/data.js';

// ==================== 模拟数据（仅用于接口异常降级，字段与后端保持一致） ====================
const mockBackendData = {
  stationMapList: [
    { id: 1001, stationName: '泉州丰泽万达广场充电站', lon: 118.589423, lat: 24.907856, stationStatus: '已启用' },
    { id: 1002, stationName: '泉州鲤城新华路充电站', lon: 118.567812, lat: 24.912345, stationStatus: '已停用' },
    { id: 1003, stationName: '泉州洛江双阳充电站', lon: 118.645678, lat: 24.923456, stationStatus: '未启用' },
    { id: 1004, stationName: '泉州丰泽东海充电站', lon: 118.612345, lat: 24.887654, stationStatus: '已启用' },
    { id: 1005, stationName: '泉州鲤城江南充电站', lon: 118.578901, lat: 24.909876, stationStatus: '已启用' },
  ],
  areaBarList: [   // 后端未提供详细的区域分布，这里仅作示意，实际会从 stationMapList 聚合
    { areaName: '丰泽区', totalCount: 2, enableCount: 2 },
    { areaName: '鲤城区', totalCount: 2, enableCount: 1 },
    { areaName: '洛江区', totalCount: 1, enableCount: 0 },
  ],
  cardInfo: {
    totalCount: 5,
    enableCount: 3,
    disableCount: 1,
    unEnableCount: 1,
  }
};

// 从站点列表聚合区域统计（后端未直接提供 areaList，前端自行聚合）
const aggregateAreaList = (stationMapList) => {
  const areaMap = new Map();
  stationMapList.forEach(station => {
    let areaName = '其他区域';
    const match = station.stationName?.match(/泉州(.*?)充电站/);
    if (match && match[1]) {
      const raw = match[1];
      if (raw.includes('丰泽')) areaName = '丰泽区';
      else if (raw.includes('鲤城')) areaName = '鲤城区';
      else if (raw.includes('洛江')) areaName = '洛江区';
      else if (raw.includes('泉港')) areaName = '泉港区';
      else if (raw.includes('晋江')) areaName = '晋江市';
      else if (raw.includes('石狮')) areaName = '石狮市';
      else areaName = raw + '区';
    }
    areaMap.set(areaName, (areaMap.get(areaName) || 0) + 1);
  });
  return Array.from(areaMap.entries())
    .map(([areaName, count]) => ({ areaName, count }))
    .sort((a, b) => b.count - a.count);
};

// 转换后端数据为前端所需结构（仅使用后端提供的字段）
const transformBackendData = (backendData) => {
  const stationPoints = (backendData.stationMapList || [])
    .filter(point => point.lon && point.lat && Math.abs(point.lon) > 0.0001 && Math.abs(point.lat) > 0.0001)
    .map(point => ({
      id: point.id,
      stationName: point.stationName,
      lon: point.lon,
      lat: point.lat,
      stationStatus: point.stationStatus,
    }));

  const areaList = aggregateAreaList(backendData.stationMapList || []);
  const cardInfo = backendData.cardInfo || {};

  return {
    totalCount: cardInfo.totalCount ?? 0,
    enableCount: cardInfo.enableCount ?? 0,
    disableCount: cardInfo.disableCount ?? 0,
    waitCount: cardInfo.unEnableCount ?? 0,   // 后端字段 unEnableCount
    areaList: areaList.length ? areaList : [{ areaName: '暂无数据', count: 0 }],
    stationPoints: stationPoints,
  };
};

// ==================== 钻取模拟数据（降级用，字段与后端可能返回的一致） ====================
const mockAreaDrillData = {
  丰泽区: [
    { areaName: '东湖街道', count: 2 },
    { areaName: '丰泽街道', count: 1 },
  ],
  鲤城区: [
    { areaName: '鲤中街道', count: 1 },
    { areaName: '开元街道', count: 1 },
  ],
  洛江区: [
    { areaName: '万安街道', count: 1 },
  ],
};

const mockStatusDrillData = {
  '': [
    { areaName: '丰泽区', count: 2 },
    { areaName: '鲤城区', count: 2 },
    { areaName: '洛江区', count: 1 },
  ],
  enabled: [
    { areaName: '丰泽区', count: 2 },
    { areaName: '鲤城区', count: 1 },
  ],
  disabled: [
    { areaName: '鲤城区', count: 1 },
  ],
  wait: [
    { areaName: '洛江区', count: 1 },
  ],
};

// ==================== 状态管理 ====================
const chartData = ref({ ...transformBackendData(mockBackendData) });
const loading = ref(false);
const barLoading = ref(false);
const drillStack = ref([]);
const currentMode = ref('overview');

const barState = reactive({
  title: '各区域充电场站数量统计',
  xData: [],
  seriesData: [],
  yName: '',
});

const cardList = computed(() => [
  { title: '总场站数', value: chartData.value.totalCount, color: '#409EFF', status: '' },
  { title: '启用场站数', value: chartData.value.enableCount, color: '#67C23A', status: 'enabled' },
  { title: '停用场站数', value: chartData.value.disableCount, color: '#F56C6C', status: 'disabled' },
  { title: '未启用场站数', value: chartData.value.waitCount, color: '#E6A23C', status: 'wait' },
]);

const geometriesArray = computed(() => chartData.value.stationPoints);

// ==================== 辅助函数 ====================
const updateBarChart = (title, xData, seriesData, yName = '') => {
  barState.title = title;
  barState.xData = xData;
  barState.seriesData = seriesData;
  barState.yName = yName;
};

const resetToOverview = () => {
  currentMode.value = 'overview';
  drillStack.value = [];
  const xData = chartData.value.areaList.map(item => item.areaName);
  const seriesData = [{ name: '场站数量', data: chartData.value.areaList.map(item => item.count) }];
  updateBarChart('各区域充电场站数量统计', xData, seriesData);
};

// ==================== 钻取接口（模拟降级） ====================
const fetchAreaCount = async (parentArea) => {
  barLoading.value = true;
  try {
    const result = await getAreaCountChart(parentArea);
    if (Array.isArray(result) && result.length) {
      const xData = result.map(item => item.areaName);
      const seriesData = [{ name: '场站数量', data: result.map(item => item.count) }];
      updateBarChart(`${parentArea} - 子区域场站数量统计`, xData, seriesData);
      return true;
    } else {
      throw new Error('接口返回数据为空');
    }
  } catch (error) {
    console.warn('接口失败，使用模拟数据', error);
    const mockData = mockAreaDrillData[parentArea];
    if (mockData?.length) {
      const xData = mockData.map(item => item.areaName);
      const seriesData = [{ name: '场站数量', data: mockData.map(item => item.count) }];
      updateBarChart(`${parentArea} - 子区域场站数量统计（模拟）`, xData, seriesData);
      ElMessage.info(`使用模拟数据：${parentArea}的子区域分布`);
      return true;
    } else {
      ElMessage.warning(`无${parentArea}的子区域数据`);
      return false;
    }
  } finally {
    barLoading.value = false;
  }
};

const fetchStatusCount = async (status) => {
  barLoading.value = true;
  try {
    const result = await getStatusCountChart(status);
    if (Array.isArray(result) && result.length) {
      const xData = result.map(item => item.areaName);
      const seriesData = [{ name: '场站数量', data: result.map(item => item.count) }];
      let title = '';
      if (status === 'enabled') title = '启用场站区域分布';
      else if (status === 'disabled') title = '停用场站区域分布';
      else if (status === 'wait') title = '未启用场站区域分布';
      else title = '各状态场站区域分布';
      updateBarChart(title, xData, seriesData);
      currentMode.value = 'statusDrill';
      drillStack.value = [];
      return;
    } else {
      throw new Error('接口返回数据为空');
    }
  } catch (error) {
    console.warn('接口失败，使用模拟数据', error);
    const key = status === undefined ? '' : status;
    const mockData = mockStatusDrillData[key];
    if (mockData?.length) {
      const xData = mockData.map(item => item.areaName);
      const seriesData = [{ name: '场站数量', data: mockData.map(item => item.count) }];
      let title = '';
      if (status === 'enabled') title = '启用场站区域分布（模拟）';
      else if (status === 'disabled') title = '停用场站区域分布（模拟）';
      else if (status === 'wait') title = '未启用场站区域分布（模拟）';
      else title = '各状态场站区域分布（模拟）';
      updateBarChart(title, xData, seriesData);
      currentMode.value = 'statusDrill';
      drillStack.value = [];
      ElMessage.info('使用模拟数据展示状态分布');
    } else {
      ElMessage.error('获取状态分布失败');
    }
  } finally {
    barLoading.value = false;
  }
};

// ==================== 事件处理 ====================
const handleCardClick = (cardInfo) => {
  fetchStatusCount(cardInfo.status);
};

const handleBarClick = async (areaName) => {
  if (currentMode.value === 'statusDrill') {
    ElMessage.info('当前为状态分布视图，请点击返回总览后再进行区域钻取');
    return;
  }
  const success = await fetchAreaCount(areaName);
  if (success) {
    drillStack.value.push(areaName);
    currentMode.value = 'overview';
  }
};

const goBack = () => {
  if (drillStack.value.length > 0) {
    drillStack.value.pop();
    if (drillStack.value.length === 0) {
      resetToOverview();
    } else {
      const parentArea = drillStack.value[drillStack.value.length - 1];
      fetchAreaCount(parentArea);
    }
  } else if (currentMode.value === 'statusDrill') {
    resetToOverview();
  } else {
    resetToOverview();
  }
};

// ==================== 初始化加载真实数据 ====================
const fetchChartData = async () => {
  loading.value = true;
  try {
    const result = await getChargingStationChartData();
    // 假设 result 直接就是后端返回的对象（已解包）
    if (result && typeof result === 'object' && result.stationMapList) {
      chartData.value = transformBackendData(result);
      resetToOverview();
      console.log('使用真实接口数据');
    } else {
      throw new Error('接口返回数据格式异常');
    }
  } catch (error) {
    console.warn('接口调用失败，使用模拟数据：', error);
    chartData.value = transformBackendData(mockBackendData);
    resetToOverview();
    ElMessage.info('当前使用模拟数据，展示总览信息');
  } finally {
    loading.value = false;
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
      <div class="chart-toolbar" v-if="drillStack.length > 0 || currentMode === 'statusDrill'">
        <el-button type="primary" size="small" @click="goBack">
          <el-icon><ArrowLeft /></el-icon> 返回上一级
        </el-button>
        <el-button type="info" size="small" @click="resetToOverview">
          <el-icon><RefreshRight /></el-icon> 重置总览
        </el-button>
        <div class="drill-path" v-if="drillStack.length > 0">当前路径：{{ drillStack.join(' > ') }}</div>
      </div>
      <Bar
        :title="barState.title"
        :x-data="barState.xData"
        :series-data="barState.seriesData"
        :y-name="barState.yName"
        @bar-click="handleBarClick"
        v-loading="barLoading"
      />
    </div>

    <div class="chart-wrapper" style="flex: 2 !important;">
      <MapCommon
        ref="mapComponent"
        idName="chargingStationMap"
        :geometriesArray="geometriesArray"
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

    .chart-toolbar {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      align-items: center;
      flex-wrap: wrap;

      .drill-path {
        font-size: 12px;
        color: #909399;
        margin-left: auto;
      }
    }
  }
}
</style>
