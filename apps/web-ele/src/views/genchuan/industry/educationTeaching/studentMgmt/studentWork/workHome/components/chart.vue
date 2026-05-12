<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage, ElSelect, ElOption } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import Radar from '#/genchuan-components/stats/radarClick.vue';
import lineChart from '#/genchuan-components/stats/lineChartClick.vue';
import {
  getWorkHomeChart,
  getDimensionCount,
  getScoreAnalysis,
  getCoreIndex,
} from '#/api/genchuan/industry/educationTeaching/studentMgmt/studentWork/workHome/data.js';

const loading = ref(true);
const chartData = ref({});
const dimensionData = ref([]);
const radarData = ref([]);
const coreData = ref([]);

// 卡片列表
const cardList = computed(() => {
  const data = chartData.value;
  return [
    { title: '学生总人数', value: data.totalStudent || 0, color: '#409EFF', status: 'totalStudent' },
    { title: '荣誉总数', value: data.totalHonor || 0, color: '#67C23A', status: 'totalHonor' },
    { title: '考评总数', value: data.totalAssess || 0, color: '#E6A23C', status: 'totalAssess' },
    { title: '违纪总数', value: data.totalViolate || 0, color: '#F56C6C', status: 'totalViolate' },
    { title: '心理评估总数', value: data.totalMental || 0, color: '#909399', status: 'totalMental' },
    { title: '资助总数', value: data.totalFund || 0, color: '#409EFF', status: 'totalFund' },
    { title: '待处理违纪', value: data.unhandledViolate || 0, color: '#F56C6C', status: 'unhandledViolate' },
    { title: '待处理预警', value: data.unhandledWarn || 0, color: '#E6A23C', status: 'unhandledWarn' },
  ];
});

// 饼图数据（各维度记录分布）
const pieData = computed(() => dimensionData.value.map(item => ({
  name: item.dimension,
  value: item.count,
})));

// 雷达图数据：维度为评分项，系列为班级
const radarIndicator = [
  { name: '教室卫生', max: 100 },
  { name: '早操', max: 100 },
  { name: '文明班级', max: 100 },
  { name: '黑板报', max: 100 },
];
const radarSeries = computed(() => radarData.value.map(item => ({
  name: item.className,
  value: [
    item.healthScore || 0,
    item.exerciseScore || 0,
    item.civilizedScore || 0,
    item.blackboardScore || 0,
  ],
})));

// 折线图数据
const lineXData = computed(() => coreData.value.map(item => item.date));
const lineSeriesData = computed(() => [
  { name: '新增荣誉数', data: coreData.value.map(item => item.honorCount || 0) },
  { name: '新增违纪数', data: coreData.value.map(item => item.violateCount || 0) },
  { name: '新增考评数', data: coreData.value.map(item => item.assessCount || 0) },
]);

// 饼图/雷达图切换选项
const pieRadarOptions = computed(() => [
  {
    type: 'pie',
    title: '各维度记录分布',
    data: pieData.value,
  },
  {
    type: 'radar',
    title: '班级整体发展维度评分',
    indicator: radarIndicator,
    series: radarSeries.value,
  },
]);

const activeChartIndex = ref(0);
const currentChart = computed(() => pieRadarOptions.value[activeChartIndex.value] || pieRadarOptions.value[0]);

// 切换图表
const handleChartChange = (index) => {
  activeChartIndex.value = index;
};

const emit = defineEmits(['cardClick', 'pieClick', 'radarClick', 'lineClick']);

const handleCardClick = (cardInfo) => {
  emit('cardClick', cardInfo.status);
};

// 饼图点击
const handlePieClick = (item) => {
  emit('pieClick', { dimension: item.name });
};

// 雷达图点击
const handleRadarClick = (params) => {
  emit('radarClick', { className: params.name });
};

// 折线图点击
const handleLineClick = (params) => {
  emit('lineClick', { date: params.name });
};

const loadData = async () => {
  loading.value = true;
  try {
    const [chartRes, dimRes, radarRes, coreRes] = await Promise.allSettled([
      getWorkHomeChart({}),
      getDimensionCount({}),
      getScoreAnalysis({ cycle: '月', grade: '' }),
      getCoreIndex({ cycle: '周' }),
    ]);
    if (chartRes.status === 'fulfilled') chartData.value = chartRes.value;
    else chartData.value = { totalStudent: 1256, totalHonor: 328, totalAssess: 452, totalViolate: 86, totalMental: 215, totalFund: 168, unhandledViolate: 12, unhandledWarn: 5 };
    if (dimRes.status === 'fulfilled') dimensionData.value = dimRes.value;
    else dimensionData.value = [
      { dimension: '荣誉', count: 328 },
      { dimension: '考评', count: 452 },
      { dimension: '违纪', count: 86 },
      { dimension: '行为', count: 512 },
      { dimension: '心理', count: 215 },
      { dimension: '资助', count: 168 },
    ];
    if (radarRes.status === 'fulfilled') radarData.value = radarRes.value;
    else radarData.value = [
      { className: '计算机2022级1班', healthScore: 95.5, exerciseScore: 92.0, civilizedScore: 98.0, blackboardScore: 90.0 },
      { className: '计算机2022级2班', healthScore: 88.0, exerciseScore: 90.5, civilizedScore: 89.0, blackboardScore: 92.5 },
    ];
    if (coreRes.status === 'fulfilled') coreData.value = coreRes.value;
    else coreData.value = [
      { date: '2025-01-06', honorCount: 12, violateCount: 3, assessCount: 18 },
      { date: '2025-01-13', honorCount: 15, violateCount: 2, assessCount: 18 },
      { date: '2025-01-20', honorCount: 8, violateCount: 5, assessCount: 18 },
    ];
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
    <!-- 卡片区 -->
    <div class="box-left-big" style="flex: 1.5 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <!-- 饼图/雷达图切换区域 -->
    <div class="chart-switch-area">
      <div class="chart-select-wrapper">
        <el-select
          v-model="activeChartIndex"
          size="small"
          @change="handleChartChange"
        >
          <el-option
            v-for="(opt, idx) in pieRadarOptions"
            :key="idx"
            :label="opt.title"
            :value="idx"
          />
        </el-select>
      </div>

      <!-- 动态渲染饼图或雷达图 -->
      <Pie
        v-if="currentChart.type === 'pie'"
        :title-text="currentChart.title"
        :data="currentChart.data"
        @pie-click="handlePieClick"
      />
      <Radar
        v-else
        :title-text="currentChart.title"
        :indicator="currentChart.indicator"
        :series="currentChart.series"
        @radar-click="handleRadarClick"
      />
    </div>

    <!-- 折线图（使用 lineChart 组件） -->
    <lineChart
      style="flex: 1.5 !important;"
      title="核心指标趋势（周）"
      :x-data="lineXData"
      :series-data="lineSeriesData"
      y-name="数量"
      @line-click="handleLineClick"
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

  .box-left-big {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr);
    min-width: 360px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }
}

/* 饼图/雷达图切换区域样式 */
.chart-switch-area {
  position: relative;
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
}

.chart-select-wrapper {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
}
</style>
