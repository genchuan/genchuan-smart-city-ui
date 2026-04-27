<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import Indicator from '#/genchuan-components/stats/indicatorClick.vue';
import Bar from '#/genchuan-components/stats/barClick.vue';
import Pie from '#/genchuan-components/stats/pieClick.vue';
import {
  getViolateMgmtChart,
  getViolateCount,
} from '#/api/genchuan/educationTeaching/studentMgmt/studentWork/violateMgmt/data.js';

// 默认时间范围参数（仅用于 getViolateCount）
const DEFAULT_TIME_RANGE = [1704067200000, 1798732799000];

// 模拟数据（字段与后端一致）
const mockOverview = {
  totalCount: 32,
  pendingCount: 5,
  warnCount: 8,
  highRiskStudentCount: 0,
  violateTypeCount: { appearance: 10, behavior: 18, other: 4 },
};

const mockViolateCount = {
  classCountList: [
    { class_name: '高一(1)班', count: 5 },
    { class_name: '高一(2)班', count: 8 },
    { class_name: '高一(3)班', count: 6 },
    { class_name: '高二(1)班', count: 7 },
    { class_name: '高二(2)班', count: 6 },
  ],
  typeCountList: [
    { typeName: '仪容仪表', count: 10, percent: '31.25' },
    { typeName: '行为违规', count: 18, percent: '56.25' },
    { typeName: '其他', count: 4, percent: '12.5' },
  ],
};

const loading = ref(true);
const overviewData = ref({});
const classCountData = ref([]);
const typeCountData = ref([]);

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

// 各班级违纪次数柱状图（适配后端字段 class_name）
const barXData = computed(() => classCountData.value.map(item => item.class_name));
const barSeriesData = computed(() => [
  { name: '违纪次数', data: classCountData.value.map(item => item.count) },
]);

// 违纪类型分布饼图（处理 typeName 为 null 的情况）
const pieData = computed(() => {
  return typeCountData.value.map((item, index) => ({
    name: item.typeName || `类型${index + 1}`,
    value: item.count,
  }));
});

const emit = defineEmits(['barClick', 'pieClick', 'cardSelect']);

const handleCardClick = (cardInfo) => {
  emit('cardSelect', cardInfo.status);
};

const handleBarClick = (className) => {
  emit('barClick', { type: 'class', value: className });
};

const handlePieClick = (item) => {
  emit('pieClick', { type: 'violateType', value: item.name });
};

const loadChartData = async () => {
  loading.value = true;
  try {
    const [overviewRes, violateCountRes] = await Promise.allSettled([
      getViolateMgmtChart({}),
      getViolateCount({timeRange: DEFAULT_TIME_RANGE}),
    ]);
    overviewData.value = overviewRes.status === 'fulfilled' ? overviewRes.value : mockOverview;
    if (violateCountRes.status === 'fulfilled') {
      classCountData.value = violateCountRes.value.classCountList || [];
      typeCountData.value = violateCountRes.value.typeCountList || [];
    } else {
      classCountData.value = mockViolateCount.classCountList;
      typeCountData.value = mockViolateCount.typeCountList;
    }
  } catch (error) {
    console.error('加载图表数据失败', error);
    overviewData.value = mockOverview;
    classCountData.value = mockViolateCount.classCountList;
    typeCountData.value = mockViolateCount.typeCountList;
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
    <Bar
      style="flex: 1.5 !important;"
      :title="'各班级违纪次数'"
      :x-data="barXData"
      :series-data="barSeriesData"
      y-name="违纪次数"
      @bar-click="handleBarClick"
    />
    <Pie
      style="flex: 1 !important;"
      :title-text="'违纪类型分布'"
      :data="pieData"
      @pie-click="handlePieClick"
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
