<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage, ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Radar from '#/genchuan-components/stats/radarClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getAssessMgmtChart,
  getDimensionScore,
  getCycleTrend,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/assessMgmt/data.js';

// 模拟数据
const mockOverview = {
  totalCount: 12,
  avgScore: 89.50,
  topRankClass: '高一(1)班',
  assessTypeCount: {
    class_clean: 4,
    morning_exercise: 3,
    civil_class: 3,
    blackboard: 2,
  },
  statusCount: {
    un_publish: 2,
    published: 10,
  },
};

const mockDimensionScore = [
  { className: '高一(1)班', classCleanScore: 95, morningExerciseScore: 92, civilClassScore: 98, blackboardScore: 90, totalScore: 93.75 },
  { className: '高一(2)班', classCleanScore: 88, morningExerciseScore: 85, civilClassScore: 90, blackboardScore: 87, totalScore: 87.5 },
  { className: '高二(1)班', classCleanScore: 92, morningExerciseScore: 94, civilClassScore: 91, blackboardScore: 93, totalScore: 92.5 },
];

const mockTrend = [
  { cycleName: '第1周', avgScore: 90.5, rank: 2 },
  { cycleName: '第2周', avgScore: 92, rank: 1 },
  { cycleName: '第3周', avgScore: 93.5, rank: 1 },
  { cycleName: '第4周', avgScore: 95, rank: 1 },
];

const loading = ref(true);
const overviewData = ref({});
const dimensionData = ref([]);
const trendData = ref([]);

// 卡片列表
const cardList = computed(() => {
  const total = overviewData.value.totalCount || 0;
  const avgScore = overviewData.value.avgScore || 0;
  const topRankClass = overviewData.value.topRankClass || '-';
  const published = overviewData.value.statusCount?.published || 0;
  return [
    { title: '本期考评总数', value: total, color: '#409EFF', status: 'total' },
    { title: '平均得分', value: avgScore, color: '#67C23A', status: 'avgScore' },
    { title: '排名第一班级', value: topRankClass, color: '#E6A23C', status: 'topRank' },
    { title: '已发布数', value: published, color: '#F56C6C', status: 'published' },
  ];
});

// 雷达图数据：将 dimensionData 转换为雷达图需要的格式（每个班级一个系列）
const radarIndicator = [
  { name: '教室卫生', max: 100 },
  { name: '早操', max: 100 },
  { name: '文明班级', max: 100 },
  { name: '黑板报', max: 100 },
];
const radarSeries = computed(() => {
  return dimensionData.value.map(item => ({
    name: item.className,
    value: [
      item.classCleanScore || 0,
      item.morningExerciseScore || 0,
      item.civilClassScore || 0,
      item.blackboardScore || 0,
    ],
  }));
});

// 折线图数据
const lineXData = computed(() => trendData.value.map(item => item.cycleName));
const lineSeriesData = computed(() => [
  { name: '平均得分', data: trendData.value.map(item => item.avgScore) },
  { name: '班级排名', data: trendData.value.map(item => item.rank) },
]);

const emit = defineEmits(['radarClick', 'lineClick', 'cardSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleRadarClick = (params) => {
  // params 包含班级名称
  emit('radarClick', { className: params.name });
};

const handleLineClick = (params) => {
  // params 包含周期名称
  emit('lineClick', { cycleName: params.name });
};

const loadChartData = async () => {
  loading.value = true;
  try {
    const [overviewRes, dimensionRes, trendRes] = await Promise.allSettled([
      getAssessMgmtChart({ cycle: 'month' }),
      getDimensionScore({ cycle: 'month' }),
      getCycleTrend({ startTime: '', endTime: '' }),
    ]);
    overviewData.value = overviewRes.status === 'fulfilled' ? overviewRes.value : mockOverview;
    dimensionData.value = dimensionRes.status === 'fulfilled' ? dimensionRes.value : mockDimensionScore;
    trendData.value = trendRes.status === 'fulfilled' ? trendRes.value : mockTrend;
  } catch (error) {
    console.error('加载图表数据失败', error);
    overviewData.value = mockOverview;
    dimensionData.value = mockDimensionScore;
    trendData.value = mockTrend;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadChartData();
});
</script>

<template>
  <div v-loading="loading" class="chart-box">
    <!-- 卡片区 -->
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 雷达图：班级多维度考评得分 -->
    <div class="chart-wrapper" style="flex: 1 !important;">
      <Radar
        title="班级多维度考评得分"
        :indicator="radarIndicator"
        :series="radarSeries"
        @radar-click="handleRadarClick"
      />
    </div>

    <!-- 折线图：班级考评周期趋势 -->
    <div class="chart-wrapper" style="flex: 1.5 !important;">
      <lineChart
        title="班级考评周期趋势"
        :x-data="lineXData"
        :series-data="lineSeriesData"
        y-name="值"
        @line-click="handleLineClick"
      />
    </div>
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

  .chart-wrapper {
    display: flex;
    flex-direction: column;
    min-width: 320px;
    flex: 1;
    margin-left: 12px;
    position: relative;
  }
}
</style>
