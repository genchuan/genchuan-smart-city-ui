<script setup>
import { ref, onMounted } from 'vue';
import { getDormCheckReportChart } from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/dormCheckReport/data.js';
import Bar from '#/genchuan-components/stats/barClick.vue';

const emit = defineEmits(['abnormalBarClick', 'inDormRateBarClick']);

const loading = ref(false);

// 各班级考勤异常人数数据
const abnormalBarData = ref({
  xAxis: [],
  series: [],
});

// 各班级在寝率数据
const inDormRateBarData = ref({
  xAxis: [],
  series: [],
});

// 默认参数（初始加载使用）
const defaultParams = {
  reportPeriod: '月报',
  statisticalPeriod: getDefaultStatisticalPeriod('月报'),
  campus: '丰泽校区',
};

// 根据报表周期生成默认统计时段（与父组件保持一致）
function getDefaultStatisticalPeriod(reportPeriod) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const pad = (n) => String(n).padStart(2, '0');

  switch (reportPeriod) {
    case '日报':
      const todayStr = `${year}-${pad(month)}-${pad(date)}`;
      return `${todayStr} 至 ${todayStr}`;
    case '周报': {
      const dayOfWeek = now.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + mondayOffset);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const format = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      return `${format(monday)} 至 ${format(sunday)}`;
    }
    case '月报': {
      const firstDay = `${year}-${pad(month)}-01`;
      const lastDay = `${year}-${pad(month)}-${new Date(year, month, 0).getDate()}`;
      return `${firstDay} 至 ${lastDay}`;
    }
    case '季报': {
      const quarter = Math.ceil(month / 3);
      const firstMonth = (quarter - 1) * 3 + 1;
      const lastMonth = quarter * 3;
      const firstDay = `${year}-${pad(firstMonth)}-01`;
      const lastDay = `${year}-${pad(lastMonth)}-${new Date(year, lastMonth, 0).getDate()}`;
      return `${firstDay} 至 ${lastDay}`;
    }
    case '半年报': {
      const half = month <= 6 ? 1 : 2;
      const firstMonth = half === 1 ? 1 : 7;
      const lastMonth = half === 1 ? 6 : 12;
      const firstDay = `${year}-${pad(firstMonth)}-01`;
      const lastDay = `${year}-${pad(lastMonth)}-${new Date(year, lastMonth, 0).getDate()}`;
      return `${firstDay} 至 ${lastDay}`;
    }
    case '年报':
      return `${year}-01-01 至 ${year}-12-31`;
    case '自定义报表':
    default:
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      const formatDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      return `${formatDate(start)} 至 ${formatDate(end)}`;
  }
}

// 获取图表数据（支持传入自定义参数）
const fetchChartData = async (customParams = null) => {
  loading.value = true;
  try {
    let params = {...defaultParams};
    if (customParams) {
      params = {...params, ...customParams};
      // 如果传入了 reportPeriod 但未传入 statisticalPeriod，则自动生成
      if (customParams.reportPeriod && !customParams.statisticalPeriod) {
        params.statisticalPeriod = getDefaultStatisticalPeriod(customParams.reportPeriod);
      }
    }
    const response = await getDormCheckReportChart(params);
    const data = response?.data || response;
    if (data) {
      // 异常人数数据
      if (data.abnormalData) {
        abnormalBarData.value.xAxis = data.abnormalData.className || [];
        abnormalBarData.value.series = [{
          name: '异常人数',
          data: data.abnormalData.abnormalCount || []
        }];
      } else {
        useMockData();
      }
      // 在寝率数据
      if (data.inDormRateData) {
        inDormRateBarData.value.xAxis = data.inDormRateData.className || [];
        inDormRateBarData.value.series = [{
          name: '在寝率(%)',
          data: data.inDormRateData.inDormRate || []
        }];
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

// 本地应急模拟数据（仅在接口异常且返回数据无效时使用）
const useMockData = () => {
  abnormalBarData.value = {
    xAxis: ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班'],
    series: [{name: '异常人数', data: [0, 2, 1, 3]}],
  };
  inDormRateBarData.value = {
    xAxis: ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班'],
    series: [{name: '在寝率(%)', data: [93.33, 90.0, 95.5, 88.0]}],
  };
};

const handleAbnormalBarClick = (className) => {
  const seriesData = abnormalBarData.value.series[0]?.data || [];
  const index = abnormalBarData.value.xAxis.findIndex(x => x === className);
  const value = index !== -1 ? seriesData[index] : null;
  emit('abnormalBarClick', { className, value });
};

const handleInDormRateBarClick = (className) => {
  const seriesData = inDormRateBarData.value.series[0]?.data || [];
  const index = inDormRateBarData.value.xAxis.findIndex(x => x === className);
  const value = index !== -1 ? seriesData[index] : null;
  emit('inDormRateBarClick', { className, value });
};

// 对外暴露刷新方法，可接收参数 { reportPeriod, statisticalPeriod }
const refreshData = (params = null) => {
  fetchChartData(params);
};

defineExpose({refreshData});

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
      @barClick="handleAbnormalBarClick"
    />
    <Bar
      style="flex: 1"
      title="各班级在寝率统计"
      :x-data="inDormRateBarData.xAxis"
      :series-data="inDormRateBarData.series"
      y-name="在寝率(%)"
      @barClick="handleInDormRateBarClick"
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
