<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getViolateMgmtChart,
  getViolateCount,
  getWarnIndex,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/violateMgmt/data.js';

// 模拟数据
const mockOverview = {
  totalCount: 32,
  pendingCount: 5,
  warnCount: 8,
  highRiskStudentCount: 0,
  violateTypeCount: { appearance: 10, behavior: 18, other: 4 },
};

const mockViolateCount = {
  classCountList: [
    { className: '高一(1)班', count: 5 },
    { className: '高一(2)班', count: 8 },
    { className: '高一(3)班', count: 6 },
    { className: '高二(1)班', count: 7 },
    { className: '高二(2)班', count: 6 },
  ],
  typeCountList: [
    { typeName: '仪容仪表', count: 10, percent: 31.25 },
    { typeName: '行为违规', count: 18, percent: 56.25 },
    { typeName: '其他', count: 4, percent: 12.5 },
  ],
};

const mockWarnIndex = [
  { cycleName: '第1周', newViolateCount: 8, newWarnCount: 2, handleRate: 87.5 },
  { cycleName: '第2周', newViolateCount: 10, newWarnCount: 3, handleRate: 90.0 },
  { cycleName: '第3周', newViolateCount: 7, newWarnCount: 2, handleRate: 100.0 },
  { cycleName: '第4周', newViolateCount: 7, newWarnCount: 1, handleRate: 100.0 },
];

const loading = ref(true);
const overviewData = ref({});
const classCountData = ref([]);
const typeCountData = ref([]);
const warnIndexData = ref([]);

// 卡片列表
const cardList = computed(() => {
  const total = overviewData.value.totalCount || 0;
  const pending = overviewData.value.pendingCount || 0;
  const warn = overviewData.value.warnCount || 0;
  const highRisk = overviewData.value.highRiskStudentCount || 0;
  return [
    { title: '违纪总次数', value: total, color: '#409EFF', status: 'total' },
    { title: '待审批', value: pending, color: '#E6A23C', status: 'pending' },
    { title: '已预警', value: warn, color: '#F56C6C', status: 'warn' },
    { title: '高风险学生', value: highRisk, color: '#909399', status: 'highRisk' },
  ];
});

// 各班级违纪次数柱状图
const barXData = computed(() => classCountData.value.map(item => item.className));
const barSeriesData = computed(() => [
  { name: '违纪次数', data: classCountData.value.map(item => item.count) },
]);

// 违纪类型分布饼图
const pieData = computed(() => typeCountData.value.map(item => ({
  name: item.typeName,
  value: item.count,
})));

// 预警指标折线图数据
const lineXData = computed(() => warnIndexData.value.map(item => item.cycleName));
const lineSeriesData = computed(() => [
  { name: '新增违纪数', data: warnIndexData.value.map(item => item.newViolateCount) },
  { name: '新增预警数', data: warnIndexData.value.map(item => item.newWarnCount) },
  { name: '处理率(%)', data: warnIndexData.value.map(item => item.handleRate) },
]);

const emit = defineEmits(['barClick', 'pieClick', 'cardSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

// 修正：柱状图点击事件，直接接收班级名称字符串
const handleBarClick = (className) => {
  emit('barClick', { type: 'class', value: className });
};

const handlePieClick = (item) => {
  emit('pieClick', { type: 'violateType', value: item.name });
};

const loadChartData = async () => {
  loading.value = true;
  try {
    const [overviewRes, violateCountRes, warnIndexRes] = await Promise.allSettled([
      getViolateMgmtChart({}),
      getViolateCount({}),
      getWarnIndex({ cycle: 'month' }),
    ]);
    overviewData.value = overviewRes.status === 'fulfilled' ? overviewRes.value : mockOverview;
    if (violateCountRes.status === 'fulfilled') {
      classCountData.value = violateCountRes.value.classCountList || [];
      typeCountData.value = violateCountRes.value.typeCountList || [];
    } else {
      classCountData.value = mockViolateCount.classCountList;
      typeCountData.value = mockViolateCount.typeCountList;
    }
    warnIndexData.value = warnIndexRes.status === 'fulfilled' ? warnIndexRes.value : mockWarnIndex;
  } catch (error) {
    console.error('加载图表数据失败', error);
    overviewData.value = mockOverview;
    classCountData.value = mockViolateCount.classCountList;
    typeCountData.value = mockViolateCount.typeCountList;
    warnIndexData.value = mockWarnIndex;
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
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in cardList"
        :key="item.title"
        v-bind="item"
        @click="handleCardClick"
      />
    </div>

    <div class="chart-wrapper" style="flex: 1 !important;">
      <Bar
        :title="'各班级违纪次数'"
        :x-data="barXData"
        :series-data="barSeriesData"
        y-name="违纪次数"
        @bar-click="handleBarClick"
      />
    </div>

    <div class="chart-wrapper" style="flex: 1 !important;">
      <Pie
        :title-text="'违纪类型分布'"
        :data="pieData"
        @pie-click="handlePieClick"
      />
    </div>

    <div class="chart-wrapper" style="flex: 1 !important;">
      <Bar
        :title="'预警指标趋势'"
        :x-data="lineXData"
        :series-data="lineSeriesData"
        y-name="数量/率"
        @bar-click="(cycleName) => emit('barClick', { type: 'cycle', value: cycleName })"
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
    min-width: 300px;
    flex: 1;
    margin-left: 12px;
    margin-bottom: 12px;
  }
}
</style>
