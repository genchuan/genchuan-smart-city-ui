<script setup>
import { ref, onMounted } from 'vue';
import { getDormCompareReportChart } from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/dormCompareReport/data.js';
import Bar from '#/genchuan-components/stats/barClick.vue';

const emit = defineEmits(['dormRankBarClick', 'buildingBarClick']);

const loading = ref(false);

// 宿舍得分排名数据
const dormRankBarData = ref({
  xAxis: [],      // 宿舍号列表
  series: [],     // 得分列表
});

// 各楼栋文明宿舍数量统计数据
const buildingBarData = ref({
  xAxis: [],      // 楼栋名称列表
  series: [],     // 文明宿舍数量列表
});

const fetchChartData = async () => {
  loading.value = true;
  try {
    // 实际参数应从父组件或当前筛选条件获取
    const params = {
      reportPeriod: '月报',
      statisticalPeriod: '2026-04-01 至 2026-04-30',
      campus: '丰泽校区',
    };
    const response = await getDormCompareReportChart(params);
    const data = response?.data || response;
    if (data) {
      // 宿舍得分排名
      if (data.dormRankData) {
        dormRankBarData.value.xAxis = data.dormRankData.dormNo || [];
        dormRankBarData.value.series = [{ name: '评比总分', data: data.dormRankData.totalScore || [] }];
      } else {
        useMockData();
      }
      // 各楼栋文明宿舍数量
      if (data.buildingCivilizedData) {
        buildingBarData.value.xAxis = data.buildingCivilizedData.buildingName || [];
        buildingBarData.value.series = [{ name: '文明宿舍数量', data: data.buildingCivilizedData.count || [] }];
      } else {
        useMockData();
      }
    } else {
      useMockData();
    }
  } catch (error) {
    console.error('获取图表数据失败:', error);
    useMockData();
  } finally {
    loading.value = false;
  }
};

const useMockData = () => {
  dormRankBarData.value = {
    xAxis: ['101', '102', '103', '104'],
    series: [{ name: '评比总分', data: [99.0, 98.0, 96.5, 95.0] }],
  };
  buildingBarData.value = {
    xAxis: ['1号楼', '2号楼', '3号楼'],
    series: [{ name: '文明宿舍数量', data: [15, 12, 8] }],
  };
};

// 柱状图点击事件
const handleDormRankBarClick = (params) => {
  emit('dormRankBarClick', { dormNo: params.xAxis, value: params.value });
};

const handleBuildingBarClick = (params) => {
  emit('buildingBarClick', { buildingName: params.xAxis, value: params.value });
};

const refreshData = () => fetchChartData();

defineExpose({ refreshData });

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div v-loading="loading" class="dorm-chart-box">
    <Bar
      style="flex: 2 !important;"
      title="宿舍得分排名"
      :x-data="dormRankBarData.xAxis"
      :series-data="dormRankBarData.series"
      y-name="评比总分"
      @click-point="handleDormRankBarClick"
    />
    <Bar
      style="flex: 1 !important;"
      title="各楼栋文明宿舍数量统计"
      :x-data="buildingBarData.xAxis"
      :series-data="buildingBarData.series"
      y-name="文明宿舍数量"
      @click-point="handleBuildingBarClick"
    />
  </div>
</template>

<style scoped lang="scss">
.dorm-chart-box {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 15px;
  margin-bottom: 20px;
  width: 100%;
}
</style>
