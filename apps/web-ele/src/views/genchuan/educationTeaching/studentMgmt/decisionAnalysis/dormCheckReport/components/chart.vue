<script setup>
import { ref, onMounted } from 'vue';
import { getDormCheckReportChart } from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/dormCheckReport/data.js';
import Bar from '#/genchuan-components/stats/barClick.vue';

const emit = defineEmits(['abnormalBarClick', 'inDormRateBarClick']);

const loading = ref(false);

// 各班级考勤异常人数数据
const abnormalBarData = ref({
  xAxis: [],      // 班级名称列表
  series: [],     // 异常人数列表
});

// 各班级在寝率数据
const inDormRateBarData = ref({
  xAxis: [],      // 班级名称列表
  series: [],     // 在寝率列表
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
    const response = await getDormCheckReportChart(params);
    const data = response?.data || response;
    if (data) {
      // 异常人数数据
      if (data.abnormalData) {
        abnormalBarData.value.xAxis = data.abnormalData.className || [];
        abnormalBarData.value.series = [{ name: '异常人数', data: data.abnormalData.abnormalCount || [] }];
      } else {
        useMockData();
      }
      // 在寝率数据
      if (data.inDormRateData) {
        inDormRateBarData.value.xAxis = data.inDormRateData.className || [];
        inDormRateBarData.value.series = [{ name: '在寝率(%)', data: data.inDormRateData.inDormRate || [] }];
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
  abnormalBarData.value = {
    xAxis: ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班'],
    series: [{ name: '异常人数', data: [0, 2, 1, 3] }],
  };
  inDormRateBarData.value = {
    xAxis: ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班'],
    series: [{ name: '在寝率(%)', data: [93.33, 90.0, 95.5, 88.0] }],
  };
};

const handleAbnormalBarClick = (params) => {
  emit('abnormalBarClick', { className: params.xAxis, value: params.value });
};

const handleInDormRateBarClick = (params) => {
  emit('inDormRateBarClick', { className: params.xAxis, value: params.value });
};

const refreshData = () => fetchChartData();

defineExpose({ refreshData });

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div v-loading="loading" class="check-chart-box">
    <Bar
      style="flex: 1"
      title="各班级考勤异常人数统计"
      :x-data="abnormalBarData.xAxis"
      :series-data="abnormalBarData.series"
      y-name="异常人数"
      @click-point="handleAbnormalBarClick"
    />
    <Bar
      style="flex: 1"
      title="各班级在寝率统计"
      :x-data="inDormRateBarData.xAxis"
      :series-data="inDormRateBarData.series"
      y-name="在寝率(%)"
      @click-point="handleInDormRateBarClick"
    />
  </div>
</template>

<style scoped lang="scss">
.check-chart-box {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 15px;
  margin-bottom: 20px;
  width: 100%;
}
</style>
