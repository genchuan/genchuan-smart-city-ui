<script setup>
import { ref, onMounted } from 'vue';
import { getMoralReportChart } from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/moralReport/data.js';
import Bar from '#/genchuan-components/stats/barClick.vue';

const emit = defineEmits(['rankBarClick', 'campusBarClick']);

const loading = ref(false);

// 班级德育得分排名数据
const rankBarData = ref({
  xAxis: [],      // 班级名称列表
  series: [],     // 得分列表
});

// 各校区文明班级数量统计数据
const campusBarData = ref({
  xAxis: [],      // 校区名称列表
  series: [],     // 文明班级数量列表
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
    const response = await getMoralReportChart(params);
    const data = response?.data || response;
    if (data) {
      // 班级德育得分排名
      if (data.classRankData) {
        rankBarData.value.xAxis = data.classRankData.className || [];
        rankBarData.value.series = [{ name: '德育总分', data: data.classRankData.totalScore || [] }];
      } else {
        useMockData();
      }
      // 各校区文明班级数量
      if (data.campusCivilizedData) {
        campusBarData.value.xAxis = data.campusCivilizedData.campus || [];
        campusBarData.value.series = [{ name: '文明班级数量', data: data.campusCivilizedData.count || [] }];
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
  rankBarData.value = {
    xAxis: ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班'],
    series: [{ name: '德育总分', data: [99.0, 98.0, 96.5, 95.0] }],
  };
  campusBarData.value = {
    xAxis: ['丰泽校区', '洛江校区', '鲤城校区'],
    series: [{ name: '文明班级数量', data: [20, 15, 12] }],
  };
};

// 柱状图点击事件
const handleRankBarClick = (params) => {
  // params 格式取决于 barClick 组件，通常包含 xAxis 值（班级名称）
  emit('rankBarClick', { className: params.xAxis, value: params.value });
};

const handleCampusBarClick = (params) => {
  emit('campusBarClick', { campus: params.xAxis, value: params.value });
};

const refreshData = () => fetchChartData();

defineExpose({ refreshData });

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div v-loading="loading" class="moral-chart-box">
    <Bar
      style="flex: 2 !important;"
      title="班级德育得分排名"
      :x-data="rankBarData.xAxis"
      :series-data="rankBarData.series"
      y-name="德育总分"
      @click-point="handleRankBarClick"
    />
    <Bar
      style="flex: 1 !important;"
      title="各校区文明班级数量统计"
      :x-data="campusBarData.xAxis"
      :series-data="campusBarData.series"
      y-name="文明班级数量"
      @click-point="handleCampusBarClick"
    />
  </div>
</template>

<style scoped lang="scss">
.moral-chart-box {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 15px;
  margin-bottom: 20px;
  width: 100%;
}
</style>
