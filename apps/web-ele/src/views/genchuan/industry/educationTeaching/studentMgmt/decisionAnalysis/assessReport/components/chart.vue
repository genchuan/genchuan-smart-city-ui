<script setup>
import { ref, onMounted } from 'vue';
import {
  getAssessReportChart
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/decisionAnalysis/assessReport/data.js';
import Radar from '#/genchuan-components/stats/radarClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';

const emit = defineEmits(['radarClick', 'lineClick']);

const radarIndicator = ref([
  { name: '卫生', max: 100 },
  { name: '早操', max: 100 },
  { name: '文明班级', max: 100 },
  { name: '黑板报', max: 100 },
]);
const radarSeries = ref([]);
const lineXAxis = ref([]);
const lineSeries = ref([]);
const loading = ref(false);

// 默认参数（初始加载使用）
const defaultParams = {
  reportPeriod: '月报',
  statStartTime: getDefaultStatStartTime('月报'),
  statEndTime: getDefaultStatEndTime('月报'),
};

// 根据报表周期生成默认统计开始时间戳
function getDefaultStatStartTime(reportPeriod) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  switch (reportPeriod) {
    case '日报':
      return new Date(year, month, date, 0, 0, 0).getTime();
    case '周报': {
      const dayOfWeek = now.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + mondayOffset);
      monday.setHours(0, 0, 0);
      return monday.getTime();
    }
    case '月报':
      return new Date(year, month, 1, 0, 0, 0).getTime();
    case '季报': {
      const quarter = Math.floor(month / 3);
      const startMonth = quarter * 3;
      return new Date(year, startMonth, 1, 0, 0, 0).getTime();
    }
    case '半年报': {
      const half = month < 6 ? 0 : 6;
      return new Date(year, half, 1, 0, 0, 0).getTime();
    }
    case '年报':
      return new Date(year, 0, 1, 0, 0, 0).getTime();
    default: {
      const start = new Date(now);
      start.setDate(now.getDate() - 29);
      start.setHours(0, 0, 0);
      return start.getTime();
    }
  }
}

// 根据报表周期生成默认统计结束时间戳
function getDefaultStatEndTime(reportPeriod) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  switch (reportPeriod) {
    case '日报':
      return new Date(year, month, date, 23, 59, 59).getTime();
    case '周报': {
      const dayOfWeek = now.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + mondayOffset);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59);
      return sunday.getTime();
    }
    case '月报':
      return new Date(year, month + 1, 0, 23, 59, 59).getTime();
    case '季报': {
      const quarter = Math.floor(month / 3);
      const startMonth = quarter * 3;
      return new Date(year, startMonth + 3, 0, 23, 59, 59).getTime();
    }
    case '半年报': {
      const half = month < 6 ? 0 : 6;
      return new Date(year, half + 6, 0, 23, 59, 59).getTime();
    }
    case '年报':
      return new Date(year, 11, 31, 23, 59, 59).getTime();
    default: {
      const end = new Date(now);
      end.setHours(23, 59, 59);
      return end.getTime();
    }
  }
}

// 获取图表数据
const fetchChartData = async (customParams = null) => {
  loading.value = true;
  try {
    let params = {...defaultParams};
    if (customParams) {
      params = {...params, ...customParams};
      // 如果传入了 reportPeriod 但没有时间参数，自动生成
      if (customParams.reportPeriod && (!customParams.statStartTime || !customParams.statEndTime)) {
        params.statStartTime = getDefaultStatStartTime(customParams.reportPeriod);
        params.statEndTime = getDefaultStatEndTime(customParams.reportPeriod);
      }
    }
    const response = await getAssessReportChart(params);
    const data = response?.data || response;
    if (data) {
      if (data.radarData) {
        radarSeries.value = data.radarData.series || [];
        if (data.radarData.dimensions && data.radarData.dimensions.length === 4) {
          radarIndicator.value = data.radarData.dimensions.map(name => ({name, max: 100}));
        }
      }
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
  emit('radarClick', {value: className, name: className});
};

const handleLineClick = (params) => {
  const className = params.seriesName;
  const date = params.categoryName;
  if (!className || !date) return;
  emit('lineClick', {value: date, name: className});
};

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
    <Radar
      style="flex: 1"
      title-text="班级多维度考评得分"
      :indicator="radarIndicator"
      :series="radarSeries"
      @radarClick="handleRadarClick"
    />
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
