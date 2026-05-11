<script setup>
import {ref, onMounted} from 'vue';
import {
  getAssessReportChart
} from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/assessReport/data.js';
import Radar from '#/genchuan-components/stats/radarClick.vue';
import lineChart from '#/genchuan-components/stats/lineChart.vue';

const emit = defineEmits(['radarClick', 'lineClick']);

const radarIndicator = ref([
  {name: '卫生', max: 100},
  {name: '早操', max: 100},
  {name: '文明班级', max: 100},
  {name: '黑板报', max: 100},
]);
const radarSeries = ref([]);
const lineXAxis = ref([]);
const lineSeries = ref([]);
const loading = ref(false);

const fetchChartData = async () => {
  loading.value = true;
  try {
    // 实际参数应从父组件或全局获取，此处示例使用默认值
    const params = {
      reportPeriod: '月报',
      statisticalPeriod: '2026-04-01 至 2026-04-30',
      campus: '丰泽校区',
    };
    const response = await getAssessReportChart(params);
    const data = response?.data || response;
    if (data) {
      if (data.radarData) {
        radarSeries.value = [{name: '班级平均分', value: data.radarData.score || [0, 0, 0, 0]}];
        if (data.radarData.dimensions?.length === 4) {
          radarIndicator.value = data.radarData.dimensions.map((name) => ({name, max: 100}));
        }
      }
      if (data.lineData) {
        lineXAxis.value = data.lineData.date || [];
        lineSeries.value = [{name: '总分', data: data.lineData.totalScore || []}];
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
    {name: '高一(1)班', value: [92, 88, 95, 90]},
    {name: '高一(2)班', value: [89, 91, 87, 92]},
  ];
  lineXAxis.value = ['2026-04-01', '2026-04-02', '2026-04-03'];
  lineSeries.value = [{name: '总分', data: [98.0, 98.2, 98.5]}];
};

const handleRadarClick = (params) => {
  emit('radarClick', {type: 'radar', value: params.name, name: params.seriesName});
};

const handleLineClick = (params) => {
  emit('lineClick', {type: 'line', value: params.xAxis, name: params.seriesName});
};

const refreshData = () => fetchChartData();

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
      @click-point="handleRadarClick"
    />
    <lineChart
      style="flex: 1.5"
      title="班级考评周期趋势"
      :x-data="lineXAxis"
      :series-data="lineSeries"
      y-name="平均得分"
      @click-point="handleLineClick"
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
