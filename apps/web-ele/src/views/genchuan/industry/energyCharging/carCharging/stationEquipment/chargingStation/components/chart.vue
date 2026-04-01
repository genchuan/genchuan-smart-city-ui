<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { ArrowLeft, RefreshRight } from '@element-plus/icons-vue';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import MapCommon from './MapCommon.vue';

// 引入图表API
import {
  getChargingStationChartData,
  getAreaCountChart,
  getStatusCountChart
} from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingStation/data.js';

// ==================== 模拟数据定义 ====================
// 总览模拟数据
const mockOverviewData = {
  totalCount: 120,
  enableCount: 98,
  disableCount: 12,
  waitCount: 10,
  areaList: [
    {areaName: '丰泽区', count: 45},
    {areaName: '鲤城区', count: 32},
    {areaName: '洛江区', count: 28},
    {areaName: '泉港区', count: 15},
  ],
  stationPoints: [
    {
      id: 1001,
      stationName: '泉州丰泽万达广场充电站',
      lon: 118.589423,
      lat: 24.907856,
      status: 'enabled',
      statusName: '已启用',
      address: '泉州市丰泽区宝洲路689号万达广场地下停车场B2层',
    },
    {
      id: 1002,
      stationName: '泉州鲤城新华路充电站',
      lon: 118.567812,
      lat: 24.912345,
      status: 'disabled',
      statusName: '已停用',
      address: '泉州市鲤城区新华南路123号',
    },
    {
      id: 1003,
      stationName: '泉州洛江双阳充电站',
      lon: 118.645678,
      lat: 24.923456,
      status: 'wait',
      statusName: '未启用',
      address: '泉州市洛江区双阳街道阳新街',
    },
  ],
};

// 柱状图下钻模拟数据（根据父区域返回子区域数据）
const mockAreaDrillData = {
  '丰泽区': [
    {areaName: '东湖街道', count: 12},
    {areaName: '丰泽街道', count: 15},
    {areaName: '泉秀街道', count: 10},
    {areaName: '北峰街道', count: 8},
  ],
  '鲤城区': [
    {areaName: '鲤中街道', count: 9},
    {areaName: '开元街道', count: 11},
    {areaName: '海滨街道', count: 7},
    {areaName: '临江街道', count: 5},
  ],
  '洛江区': [
    {areaName: '万安街道', count: 10},
    {areaName: '双阳街道', count: 8},
    {areaName: '河市镇', count: 6},
    {areaName: '马甲镇', count: 4},
  ],
  '泉港区': [
    {areaName: '山腰街道', count: 5},
    {areaName: '后龙镇', count: 4},
    {areaName: '峰尾镇', count: 3},
    {areaName: '前黄镇', count: 3},
  ],
};

// 状态钻取模拟数据（根据状态返回各区域的数量）
const mockStatusDrillData = {
  // 总场站（status = ''）
  '': [
    {areaName: '丰泽区', count: 45},
    {areaName: '鲤城区', count: 32},
    {areaName: '洛江区', count: 28},
    {areaName: '泉港区', count: 15},
  ],
  enabled: [
    {areaName: '丰泽区', count: 38},
    {areaName: '鲤城区', count: 27},
    {areaName: '洛江区', count: 23},
    {areaName: '泉港区', count: 10},
  ],
  disabled: [
    {areaName: '丰泽区', count: 4},
    {areaName: '鲤城区', count: 3},
    {areaName: '洛江区', count: 3},
    {areaName: '泉港区', count: 2},
  ],
  wait: [
    {areaName: '丰泽区', count: 3},
    {areaName: '鲤城区', count: 2},
    {areaName: '洛江区', count: 2},
    {areaName: '泉港区', count: 3},
  ],
};

// ==================== 状态管理 ====================
const chartData = ref({...mockOverviewData});
const loading = ref(false);
const barLoading = ref(false);
const drillStack = ref([]); // 钻取栈，存储区域名称
const currentMode = ref('overview'); // overview: 总览, statusDrill: 状态钻取

// 柱状图状态
const barState = reactive({
  title: '各区域充电场站数量统计',
  xData: [],
  seriesData: [],
  yName: '',
});

// 卡片数据（添加 status 字段，用于钻取）
const cardList = computed(() => [
  {title: '总场站数', value: chartData.value.totalCount, color: '#409EFF', status: ''},
  {title: '启用场站数', value: chartData.value.enableCount, color: '#67C23A', status: 'enabled'},
  {title: '停用场站数', value: chartData.value.disableCount, color: '#F56C6C', status: 'disabled'},
]);

// 地图标记点数据
const geometriesArray = computed(() => chartData.value.stationPoints);

// ==================== 辅助函数 ====================
// 更新柱状图数据
const updateBarChart = (title, xData, seriesData, yName = '') => {
  barState.title = title;
  barState.xData = xData;
  barState.seriesData = seriesData;
  barState.yName = yName;
};

// 重置到总览视图
const resetToOverview = () => {
  currentMode.value = 'overview';
  drillStack.value = [];
  const xData = chartData.value.areaList.map((item) => item.areaName);
  const seriesData = [
    {
      name: '场站数量',
      data: chartData.value.areaList.map((item) => item.count),
    },
  ];
  updateBarChart('各区域充电场站数量统计', xData, seriesData);
};

// ==================== 钻取接口（使用统一 API，带模拟数据降级） ====================
// 获取子区域数据（柱状图下钻）
const fetchAreaCount = async (parentArea) => {
  barLoading.value = true;
  try {
    const result = await getAreaCountChart(parentArea);
    if (result.code === 200 && Array.isArray(result.data)) {
      if (result.data.length === 0) {
        ElMessage.warning('该区域暂无子区域数据');
        return false;
      }
      const xData = result.data.map((item) => item.areaName);
      const seriesData = [
        {
          name: '场站数量',
          data: result.data.map((item) => item.count),
        },
      ];
      updateBarChart(`${parentArea} - 子区域场站数量统计`, xData, seriesData);
      return true;
    } else {
      throw new Error(result.msg || '接口返回异常');
    }
  } catch (error) {
    console.warn('接口调用失败，使用模拟数据：', error.message);
    const mockData = mockAreaDrillData[parentArea];
    if (mockData && mockData.length > 0) {
      const xData = mockData.map((item) => item.areaName);
      const seriesData = [
        {
          name: '场站数量',
          data: mockData.map((item) => item.count),
        },
      ];
      updateBarChart(`${parentArea} - 子区域场站数量统计（模拟数据）`, xData, seriesData);
      ElMessage.info(`当前使用模拟数据，展示${parentArea}的子区域分布`);
      return true;
    } else {
      ElMessage.warning(`没有找到${parentArea}的子区域模拟数据`);
      return false;
    }
  } finally {
    barLoading.value = false;
  }
};

// 获取状态分布数据（卡片钻取）
const fetchStatusCount = async (status) => {
  barLoading.value = true;
  try {
    const result = await getStatusCountChart(status);
    if (result.code === 200 && Array.isArray(result.data)) {
      if (result.data.length === 0) {
        ElMessage.warning('暂无该状态下的场站数据');
        return;
      }
      const xData = result.data.map((item) => item.areaName);
      const seriesData = [
        {
          name: '场站数量',
          data: result.data.map((item) => item.count),
        },
      ];
      const title = status
        ? `${status === 'enabled' ? '启用' : status === 'disabled' ? '停用' : '未启用'}场站区域分布`
        : '各状态场站区域分布';
      updateBarChart(title, xData, seriesData);
      currentMode.value = 'statusDrill';
      drillStack.value = [];
    } else {
      throw new Error(result.msg || '接口返回异常');
    }
  } catch (error) {
    console.warn('接口调用失败，使用模拟数据：', error.message);
    const key = status === undefined ? '' : status;
    const mockData = mockStatusDrillData[key];
    if (mockData && mockData.length > 0) {
      const xData = mockData.map((item) => item.areaName);
      const seriesData = [
        {
          name: '场站数量',
          data: mockData.map((item) => item.count),
        },
      ];
      let title = '';
      if (status === 'enabled') title = '启用场站区域分布（模拟数据）';
      else if (status === 'disabled') title = '停用场站区域分布（模拟数据）';
      else title = '各状态场站区域分布（模拟数据）';
      updateBarChart(title, xData, seriesData);
      currentMode.value = 'statusDrill';
      drillStack.value = [];
      ElMessage.info('当前使用模拟数据，展示状态分布');
    } else {
      ElMessage.error('获取状态分布数据失败，且无模拟数据');
    }
  } finally {
    barLoading.value = false;
  }
};

// ==================== 事件处理 ====================
// 卡片点击
const handleCardClick = (cardInfo) => {
  fetchStatusCount(cardInfo.status);
};

// 柱状图点击（钻取）
const handleBarClick = async (areaName) => {
  if (currentMode.value === 'statusDrill') {
    ElMessage.info('当前为状态分布视图，请点击"返回总览"后再进行区域钻取');
    return;
  }

  const success = await fetchAreaCount(areaName);
  if (success) {
    drillStack.value.push(areaName);
    currentMode.value = 'overview';
  }
};

// 返回上一级
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

// ==================== 初始化 ====================
// 获取充电场站图表数据（总览）
const fetchChartData = async () => {
  loading.value = true;
  try {
    const result = await getChargingStationChartData();
    if (result.code === 200 && result.data) {
      chartData.value = result.data;
      resetToOverview();
      console.log('使用接口数据');
    } else {
      throw new Error(result.msg || '接口返回异常');
    }
  } catch (error) {
    console.warn('接口调用失败，使用模拟数据：', error.message);
    chartData.value = {...mockOverviewData};
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
    <!-- 左侧卡片区域 -->
    <div class="chart-box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 柱状图容器 -->
    <div class="chart-wrapper" style="flex: 1.5 !important;">
      <!-- 钻取工具栏 -->
      <div class="chart-toolbar" v-if="drillStack.length > 0 || currentMode === 'statusDrill'">
        <el-button type="primary" size="small" @click="goBack">
          <el-icon>
            <ArrowLeft/>
          </el-icon>
          返回上一级
        </el-button>
        <el-button type="info" size="small" @click="resetToOverview">
          <el-icon>
            <RefreshRight/>
          </el-icon>
          重置总览
        </el-button>
        <div class="drill-path" v-if="drillStack.length > 0">
          当前路径：{{ drillStack.join(' > ') }}
        </div>
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

    <!-- 地图容器 -->
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

  .chart-box-left {
    display: flex;
    flex: 0 0 max(180px, min(25vw, 220px));
    flex-direction: column;
    gap: 12px;
    min-width: 180px;
    max-width: 220px;
    margin: 0;
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
