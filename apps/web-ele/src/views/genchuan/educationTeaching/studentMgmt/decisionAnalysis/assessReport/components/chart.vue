<script setup>
import {ref, onMounted} from 'vue';
import {
  getAssessReportChart
} from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/assessReport/data.js';
import Radar from '#/genchuan-components/stats/radarClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';

const emit = defineEmits(['radarClick', 'lineClick']);

// 雷达图配置：indicator 从接口返回的 dimensions 动态生成
const radarIndicator = ref([
  {name: '卫生', max: 100},
  {name: '早操', max: 100},
  {name: '文明班级', max: 100},
  {name: '黑板报', max: 100},
]);
// radarSeries 为多班级数组，格式 [{ name: '班级名', value: [score1,score2,...] }]
const radarSeries = ref([]);
const lineXAxis = ref([]);
// lineSeries 为多班级数组，格式 [{ name: '班级名', data: [score1,score2,...] }]
const lineSeries = ref([]);
const loading = ref(false);

// 默认参数（初始加载使用）
const defaultParams = {
  reportPeriod: '月报',
  statisticalPeriod: getDefaultStatisticalPeriod('月报'),
  campus: '丰泽校区',
};

// 根据报表周期生成默认统计时段（与父组件保持一致的逻辑）
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
      if (customParams.reportPeriod && !customParams.statisticalPeriod) {
        params.statisticalPeriod = getDefaultStatisticalPeriod(customParams.reportPeriod);
      }
    }
    const response = await getAssessReportChart(params);
    const data = response?.data || response;
    if (data) {
      // 处理雷达图数据（多班级）
      if (data.radarData) {
        // 新结构：radarData.series = [{ name, value }]
        radarSeries.value = data.radarData.series || [];
        if (data.radarData.dimensions && data.radarData.dimensions.length === 4) {
          radarIndicator.value = data.radarData.dimensions.map(name => ({name, max: 100}));
        }
      }
      // 处理折线图数据（多班级）
      if (data.lineData) {
        lineXAxis.value = data.lineData.date || [];
        lineSeries.value = data.lineData.series || [];
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

// 本地应急模拟数据（多班级格式）
const useMockData = () => {
  radarSeries.value = [
    {name: '计算机2201班', value: [92, 88, 95, 90]},
    {name: '软件工程2301班', value: [89, 91, 87, 92]},
    {name: '大数据2401班', value: [85, 93, 90, 88]}
  ];
  lineXAxis.value = ['2026-04-01', '2026-04-02', '2026-04-03', '2026-04-04'];
  lineSeries.value = [
    {name: '计算机2201班', data: [85.2, 86.1, 84.5, 87.3]},
    {name: '软件工程2301班', data: [78.5, 79.2, 80.1, 81.0]},
    {name: '大数据2401班', data: [82.0, 83.5, 82.8, 84.2]}
  ];
};

const handleRadarClick = (params) => {
  const className = params.name;
  if (!className) return;
  // 向上传递符合父组件文件3期望的对象格式 { value: 班级名, name: 班级名 }
  emit('radarClick', {value: className, name: className});
};

const handleLineClick = (params) => {
  const className = params.seriesName;
  const date = params.categoryName;
  if (!className || !date) return;
  // 向上传递 { value: 日期, name: 班级名 }
  emit('lineClick', {value: date, name: className});
};

// 对外暴露刷新方法
const refreshData = (params = null) => {
  fetchChartData(params);
};

defineExpose({refreshData});

onMounted(() => {
  fetchChartData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <!-- 雷达图：多班级会自动显示多个多边形 -->
    <Radar
      style="flex: 1"
      title-text="班级多维度考评得分"
      :indicator="radarIndicator"
      :series="radarSeries"
      @radarClick="handleRadarClick"
    />
    <!-- 折线图：多班级会自动显示多条折线 -->
    <lineChart
      style="flex: 1.5"
      title="班级考评周期趋势"
      :x-data="lineXAxis"
      :series-data="lineSeries"
      y-name="平均得分"
      @lineClick="handleLineClick"
    />
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 15px;
  margin-bottom: 20px;
  width: 100%;
}
</style>
