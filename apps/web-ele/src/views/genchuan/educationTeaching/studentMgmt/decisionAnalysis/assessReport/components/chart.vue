<script setup>
import { ref, computed, onMounted } from 'vue';
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Radar from '#/genchuan-components/stats/radarClick.vue';
import lineChart from '#/genchuan-components/stats/lineChart.vue';
import {
  getAssessReportChart,
  getAssessReportDimensionScore,
  getAssessReportCycleTrend,
} from '#/api/genchuan/educationTeaching/studentMgmt/decisionAnalysis/assessReport/data.js';

const loading = ref(true);
const chartData = ref({});
const dimensionData = ref([]);
const trendData = ref([]);

// 卡片数据
const cardList = computed(() => {
  const total = chartData.value.totalAssessCount || 0;
  const avg = chartData.value.avgScore || 0;
  const published = chartData.value.publishedCount || 0;
  const unpublished = chartData.value.unPublishedCount || 0;
  return [
    { title: '总考评记录数', value: total, color: '#409EFF', status: 'total' },
    { title: '平均考评得分', value: avg, color: '#67C23A', suffix: '分', status: 'avg' },
    { title: '已发布记录数', value: published, color: '#E6A23C', status: 'published' },
    { title: '未发布记录数', value: unpublished, color: '#F56C6C', status: 'unpublished' },
  ];
});

const radarIndicator = [
  { name: '教室卫生', max: 100 },
  { name: '早操', max: 100 },
  { name: '文明班级', max: 100 },
  { name: '黑板报', max: 100 },
];

const getRadarSeries = () => {
  const list = dimensionData.value || [];
  return list.map(item => ({
    name: item.className || '',
    value: [
      item.classRoomScore || 0,
      item.morningExerciseScore || 0,
      item.civilizedClassScore || 0,
      item.blackboardScore || 0,
    ],
  }));
};

const lineXAxis = computed(() => {
  return (trendData.value || []).map(item => item.cycleDate || '');
});
const lineSeries = computed(() => {
  return [{ name: '平均得分', data: (trendData.value || []).map(item => item.avgScore || 0) }];
});

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, dimRes, trendRes] = await Promise.allSettled([
      getAssessReportChart({}),
      getAssessReportDimensionScore({ timeScale: '月', statStartTime: 1767225600000, statEndTime: 1769904000000 }),
      getAssessReportCycleTrend({ timeScale: '月', statStartTime: 1767225600000, statEndTime: 1780358400000 }),
    ]);

    if (chartRes.status === 'fulfilled') {
      chartData.value = chartRes.value;
    } else {
      chartData.value = {
        totalAssessCount: 120,
        avgScore: 88.5,
        publishedCount: 100,
        unPublishedCount: 20,
      };
    }

    if (dimRes.status === 'fulfilled') {
      dimensionData.value = dimRes.value;
    } else {
      dimensionData.value = [
        { className: '高一(1)班', classRoomScore: 92.0, morningExerciseScore: 88.5, civilizedClassScore: 95.0, blackboardScore: 90.0 },
        { className: '高一(2)班', classRoomScore: 89.0, morningExerciseScore: 91.0, civilizedClassScore: 87.5, blackboardScore: 92.0 },
      ];
    }

    if (trendRes.status === 'fulfilled') {
      trendData.value = trendRes.value;
    } else {
      trendData.value = [
        { cycleDate: '2025-01', avgScore: 85.2 },
        { cycleDate: '2025-02', avgScore: 87.5 },
        { cycleDate: '2025-03', avgScore: 89.8 },
      ];
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <div class="box-left">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
    <Radar
      style="flex: 1 !important;"
      title-text="班级多维度考评得分"
      :indicator="radarIndicator"
      :series="getRadarSeries()"
    />
    <lineChart
      style="flex: 1.5 !important;"
      title="班级考评周期趋势"
      :x-data="lineXAxis"
      :series-data="lineSeries"
      y-name="平均得分"
    />
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right: 15px;
  width: 100% !important;

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
}
</style>
