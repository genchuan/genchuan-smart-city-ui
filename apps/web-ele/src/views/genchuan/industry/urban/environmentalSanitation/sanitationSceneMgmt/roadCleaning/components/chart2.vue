<script setup>
import { computed, watch, onMounted, reactive } from 'vue';
import {
  getRoadCleaningChartPending,
  getRoadCleaningChartExecuting,
  getCleaningProblemChartPending,
  getRoadCleaningChartCheck,
  getRoadCleaningChartCompleted,
} from '#/api/genchuan/industry/urban/environmentalSanitation/sanitationSceneMgmt/roadCleaning/data.js';
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Pie from '#/genchuan-components/stats/pie.vue';
import Bar from '#/genchuan-components/stats/bar.vue';
import LineChart from '#/genchuan-components/stats/lineChart.vue';

const props = defineProps({
  activeName: { type: String, required: true },
  // 注意：如果父组件不再需要传递 dataList，可以移除该 prop
  // dataList: { type: Array, required: true }
});

// 各状态的数据存储
const state = reactive({
  loading: false,
  pending: null,      // 清扫待执行数据
  executing: null,    // 作业进行中数据
  problem: null,      // 问题待处置数据
  review: null,       // 质量待核查数据
  completed: null,    // 已完成数据
});

// 数值安全转换
const toNumber = (val) => (val === null || val === undefined ? 0 : Number(val) || 0);

// 根据 activeName 获取对应的数据（方便模板中使用）
const currentData = computed(() => {
  switch (props.activeName) {
    case '清扫待执行': return state.pending;
    case '作业进行中': return state.executing;
    case '问题待处置': return state.problem;
    case '质量待核查': return state.review;
    case '已完成': return state.completed;
    default: return null;
  }
});

// 加载当前状态的数据
const fetchCurrentData = async () => {
  state.loading = true;
  try {
    let res = null;
    switch (props.activeName) {
      case '清扫待执行':
        res = await getRoadCleaningChartPending();
        state.pending = res;
        break;
      case '作业进行中':
        res = await getRoadCleaningChartExecuting();
        state.executing = res;
        break;
      case '问题待处置':
        res = await getCleaningProblemChartPending();
        state.problem = res;
        break;
      case '质量待核查':
        res = await getRoadCleaningChartCheck();
        state.review = res;
        break;
      case '已完成':
        res = await getRoadCleaningChartCompleted();
        state.completed = res;
        break;
    }
    console.log(`${props.activeName} 接口返回:`, res);
  } catch (error) {
    console.error(`获取 ${props.activeName} 图表数据失败`, error);
  } finally {
    state.loading = false;
  }
};

// 监听 activeName 变化，重新加载数据
watch(() => props.activeName, fetchCurrentData, { immediate: true });

// ---------- 以下是各状态模板中需要的数据计算（根据接口字段映射）----------

// 清扫待执行数据映射
const pendingCards = computed(() => {
  const d = state.pending;
  if (!d) return [];
  return [
    { title: '待执行计划总数', value: toNumber(d.pendingPlanCount), color: '#409EFF' },
    { title: '按区域待执行数', value: toNumber(d.pendingAreaCount), color: '#13ce66' },
    { title: '按人员分配数', value: toNumber(d.pendingStaffCount), color: '#67C23A' },
  ];
});
const pendingPie = computed(() => ({
  frequency: Array.isArray(state.pending?.frequencyDistribution) ? state.pending.frequencyDistribution : [],
  roadType: Array.isArray(state.pending?.roadSectionTypeDistribution) ? state.pending.roadSectionTypeDistribution : [],
}));
const pendingBar = computed(() => {
  const list = Array.isArray(state.pending?.planCountByTimePeriod) ? state.pending.planCountByTimePeriod : [];
  return {
    x: list.map(item => item.name),
    series: list.map(item => toNumber(item.value)),
  };
});

// 作业进行中数据映射
const ongoingCards = computed(() => {
  const d = state.executing;
  if (!d) return [];
  return [
    { title: '当前作业任务数', value: toNumber(d.currentTaskCount), color: '#409EFF' },
    { title: '正常运行数', value: toNumber(d.normalRunningCount), color: '#13ce66' },
    { title: '异常标记数', value: toNumber(d.abnormalCount), color: '#F56C6C' },
  ];
});
const ongoingLine = computed(() => {
  const trend = Array.isArray(state.executing?.completionRateTrend) ? state.executing.completionRateTrend : [];
  return {
    x: trend.map(item => item.timePoint),
    series: trend.map(item => toNumber(item.completionRate)),
  };
});

// 问题待处置数据映射
const problemCards = computed(() => {
  const d = state.problem;
  if (!d) return [];
  return [
    { title: '待处置问题总数', value: toNumber(d.pendingProblemCount), color: '#409EFF' },
    { title: '高优先级数', value: toNumber(d.highPriorityCount), color: '#E6A23C' },
    { title: '超时未处理数', value: toNumber(d.timeoutCount), color: '#F56C6C' },
  ];
});
const problemPie = computed(() => ({
  type: Array.isArray(state.problem?.problemTypeDistribution) ? state.problem.problemTypeDistribution : [],
  area: Array.isArray(state.problem?.areaDistribution) ? state.problem.areaDistribution : [],
}));
const problemBar = computed(() => {
  const list = Array.isArray(state.problem?.teamPendingDistribution) ? state.problem.teamPendingDistribution : [];
  return {
    x: list.map(item => item.name),
    series: list.map(item => toNumber(item.value)),
  };
});

// 质量待核查数据映射
const reviewCards = computed(() => {
  const d = state.review;
  if (!d) return [];
  return [
    { title: '待核查任务数', value: toNumber(d.pendingCheckCount), color: '#409EFF' },
    { title: '已达标数', value: toNumber(d.qualifiedCount), color: '#13ce66' },
    { title: '需整改数', value: toNumber(d.needReformCount), color: '#F56C6C' },
  ];
});
const reviewPie = computed(() => ({
  result: Array.isArray(state.review?.checkResultDistribution) ? state.review.checkResultDistribution : [],
  area: Array.isArray(state.review?.areaDistribution) ? state.review.areaDistribution : [],
}));
const reviewBar = computed(() => {
  const list = Array.isArray(state.review?.areaQualityRateList) ? state.review.areaQualityRateList : [];
  return {
    x: list.map(item => item.name),
    series: list.map(item => toNumber(item.value)),
  };
});

// 已完成数据映射
const completedCards = computed(() => {
  const d = state.completed;
  if (!d) return [];
  return [
    { title: '已完成任务总数', value: toNumber(d.completedTaskCount), color: '#409EFF' },
    { title: '总清扫里程', value: d.totalCleaningMileage ? d.totalCleaningMileage + 'km' : '0km', color: '#13ce66' },
    { title: '平均质量达标率', value: (toNumber(d.avgQualityRate) || 0).toFixed(0) + '%', color: '#67C23A' },
    { title: '问题处置及时率', value: (toNumber(d.problemHandleRate) || 0).toFixed(0) + '%', color: '#F56C6C' },
  ];
});
const completedPie = computed(() => ({
  area: Array.isArray(state.completed?.areaCompletionDistribution) ? state.completed.areaCompletionDistribution : [],
  staff: Array.isArray(state.completed?.staffWorkloadDistribution) ? state.completed.staffWorkloadDistribution : [],
}));
const completedBar = computed(() => {
  const list = Array.isArray(state.completed?.taskCompletionComparison) ? state.completed.taskCompletionComparison : [];
  // 如果接口返回空数组，可提供一个默认占位数据或隐藏图表
  return {
    x: list.map(item => item.timePoint || item.name),
    series: list.map(item => toNumber(item.value)),
  };
});
const completedLine = computed(() => {
  const trend = Array.isArray(state.completed?.qualityRateTrend) ? state.completed.qualityRateTrend : [];
  return {
    x: trend.map(item => item.timePoint),
    series: trend.map(item => toNumber(item.value)),
  };
});
</script>

<template>
  <div class="chart2-box" v-loading="state.loading" element-loading-text="加载中...">
    <!-- 清扫待执行 -->
    <template v-if="activeName === '清扫待执行'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in pendingCards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" title-text="清扫频次分布" :data="pendingPie.frequency" />
      <Pie style="flex:1" title-text="路段类型占比" :data="pendingPie.roadType" />
      <Bar style="flex:1" title="不同时段清扫计划数量对比" :x-data="pendingBar.x" :series-data="[{ name: '计划数', data: pendingBar.series }]" />
    </template>

    <!-- 作业进行中 -->
    <template v-else-if="activeName === '作业进行中'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in ongoingCards" :key="item.title" v-bind="item" />
      </div>
      <LineChart style="flex:1" title="清扫路段完成率趋势" :x-data="ongoingLine.x" :series-data="[{ name: '完成率', data: ongoingLine.series }]" y-name="%" :smooth="true" />
    </template>

    <!-- 问题待处置 -->
    <template v-else-if="activeName === '问题待处置'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in problemCards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" title-text="问题类型占比" :data="problemPie.type" />
      <Pie style="flex:1" title-text="区域分布占比" :data="problemPie.area" />
      <Bar style="flex:1" title="不同处置组待处置问题对比" :x-data="problemBar.x" :series-data="[{ name: '问题数', data: problemBar.series }]" />
    </template>

    <!-- 质量待核查 -->
    <template v-else-if="activeName === '质量待核查'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in reviewCards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" title-text="核查结果占比" :data="reviewPie.result" />
      <Pie style="flex:1" title-text="区域分布占比" :data="reviewPie.area" />
      <Bar style="flex:1" title="不同区域质量达标率对比" :x-data="reviewBar.x" :series-data="[{ name: '达标率', data: reviewBar.series }]" />
    </template>

    <!-- 已完成 -->
    <template v-else-if="activeName === '已完成'">
      <div class="box-left">
        <Indicator class="left-card" v-for="item in completedCards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" title-text="各区域完成量占比" :data="completedPie.area" />
      <Pie style="flex:1" title-text="各人员作业量占比" :data="completedPie.staff" />
      <Bar style="flex:1" title="按日任务完成量对比" :x-data="completedBar.x" :series-data="[{ name: '完成量', data: completedBar.series }]" />
      <LineChart style="flex:1" title="质量达标率趋势" :x-data="completedLine.x" :series-data="[{ name: '达标率', data: completedLine.series }]" y-name="%" :smooth="true" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.chart2-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  width: 100%;

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

  .chart-box-left {
    display: flex;
    flex: 0 0 max(280px, min(25vw, 320px));
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
    max-width: 320px;
    margin: 0;
  }
}
</style>
