<script setup>
import {ref, onMounted} from 'vue';
import {
  getMoralReportChart
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/moralReport/data.js';
import Bar from '#/genchuan-components/stats/barClick.vue';

const emit = defineEmits(['rankBarClick', 'campusBarClick']);

const loading = ref(false);

// 班级德育得分排名数据
const rankBarData = ref({
  xAxis: [],
  series: [],
});

// 各校区文明班级数量统计数据
const campusBarData = ref({
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
    const response = await getMoralReportChart(params);
    const data = response?.data || response;
    if (data) {
      // 班级德育得分排名
      if (data.classRankData) {
        rankBarData.value.xAxis = data.classRankData.className || [];
        rankBarData.value.series = [{name: '德育总分', data: data.classRankData.totalScore || []}];
      } else {
        useMockData();
      }
      // 各校区文明班级数量
      if (data.campusCivilizedData) {
        campusBarData.value.xAxis = data.campusCivilizedData.campus || [];
        campusBarData.value.series = [{
          name: '文明班级数量',
          data: data.campusCivilizedData.count || []
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
  rankBarData.value = {
    xAxis: ['计算机2301班', '软件2301班', '大数据2401班', '人工智能2401班'],
    series: [{name: '德育总分', data: [99.0, 98.0, 96.5, 95.0]}],
  };
  campusBarData.value = {
    xAxis: ['丰泽校区', '洛江校区', '鲤城校区'],
    series: [{name: '文明班级数量', data: [20, 15, 12]}],
  };
};

// 柱状图点击事件（Bar组件传递的是柱子的名称字符串）
const handleRankBarClick = (className) => {
  // 根据点击的班级名称找到对应的得分
  const seriesData = rankBarData.value.series[0]?.data || [];
  const index = rankBarData.value.xAxis.findIndex(x => x === className);
  const value = index !== -1 ? seriesData[index] : null;
  emit('rankBarClick', {className, value});
};

const handleCampusBarClick = (campus) => {
  // 根据点击的校区名称找到对应的数量
  const seriesData = campusBarData.value.series[0]?.data || [];
  const index = campusBarData.value.xAxis.findIndex(x => x === campus);
  const value = index !== -1 ? seriesData[index] : null;
  emit('campusBarClick', {campus, value});
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
  <div v-loading="loading" class="moral-chart-box">
    <Bar
      style="flex: 2 !important;"
      title="班级德育得分排名"
      :x-data="rankBarData.xAxis"
      :series-data="rankBarData.series"
      y-name="德育总分"
      @barClick="handleRankBarClick"
    />
    <Bar
      style="flex: 1 !important;"
      title="各校区文明班级数量统计"
      :x-data="campusBarData.xAxis"
      :series-data="campusBarData.series"
      y-name="文明班级数量"
      @barClick="handleCampusBarClick"
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
