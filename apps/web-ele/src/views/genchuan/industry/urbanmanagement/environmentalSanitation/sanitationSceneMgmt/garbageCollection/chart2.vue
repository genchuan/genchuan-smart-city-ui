<script setup>
import { computed } from 'vue';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';
import LineChart from '#/components/stats/lineChart.vue';

const props = defineProps({
  activeName: { type: String, required: true },
  dataList: { type: Array, required: true }
});

// 过滤当前状态的数据
const filteredList = computed(() => {
  return props.dataList.filter(item => item.status === props.activeName);
});

// 辅助：对象转数组
const toPieArray = (obj) => Object.entries(obj).map(([name, value]) => ({ name, value }));

// ---------- 卡片数据 ----------
const pendingCards = computed(() => [
  { title: '待执行计划总数', value: filteredList.value.length, color: '#409EFF' },
  { title: '区域数', value: new Set(filteredList.value.map(v => v.area)).size, color: '#13ce66' },
  { title: '品类数', value: new Set(filteredList.value.map(v => v.garbageType)).size, color: '#67C23A' },
]);

const ongoingCards = computed(() => [
  { title: '当前作业任务数', value: filteredList.value.length, color: '#409EFF' },
  { title: '正常运行数', value: filteredList.value.filter(v => !v.isAbnormal).length, color: '#13ce66' },
  { title: '异常标记数', value: filteredList.value.filter(v => v.isAbnormal).length, color: '#F56C6C' },
]);

const abnormalCards = computed(() => [
  { title: '待处置异常总数', value: filteredList.value.length, color: '#409EFF' },
  { title: '高优先级数', value: filteredList.value.filter(v => v.priority === '高').length, color: '#E6A23C' },
  { title: '超时未处理数', value: filteredList.value.filter(v => v.isTimeout).length, color: '#F56C6C' },
]);

const reviewCards = computed(() => [
  { title: '待复核', value: filteredList.value.filter(v => v.reviewStatus === '待复核').length, color: '#409EFF' },
  { title: '已通过', value: filteredList.value.filter(v => v.reviewStatus === '通过').length, color: '#13ce66' },
  { title: '已退回', value: filteredList.value.filter(v => v.reviewStatus === '退回').length, color: '#F56C6C' },
]);

const completedCards = computed(() => [
  { title: '已完成任务数', value: filteredList.value.length, color: '#409EFF' },
  { title: '总收运量', value: filteredList.value.reduce((acc, v) => acc + (v.totalVolume || 0), 0).toFixed(1) + '吨', color: '#13ce66' },
  { title: '平均完成率', value: (filteredList.value.reduce((acc, v) => acc + (v.completionRate || 0), 0) / (filteredList.value.length || 1)).toFixed(0) + '%', color: '#67C23A' },
  { title: '异常办结率', value: (filteredList.value.filter(v => v.abnormalCompleteRate).length / (filteredList.value.length || 1) * 100).toFixed(0) + '%', color: '#F56C6C' },
]);

// ---------- 圆环图数据 ----------
const pendingPieArea = computed(() => toPieArray(filteredList.value.reduce((acc, v) => { acc[v.area] = (acc[v.area] || 0) + 1; return acc; }, {})));
const pendingPieType = computed(() => toPieArray(filteredList.value.reduce((acc, v) => { acc[v.garbageType] = (acc[v.garbageType] || 0) + 1; return acc; }, {})));

const abnormalPieType = computed(() => toPieArray(filteredList.value.reduce((acc, v) => { acc[v.abnormalType || '未知'] = (acc[v.abnormalType || '未知'] || 0) + 1; return acc; }, {})));
const abnormalPieArea = computed(() => toPieArray(filteredList.value.reduce((acc, v) => { const a = v.area.split('-')[0]; acc[a] = (acc[a] || 0) + 1; return acc; }, {})));

const reviewPieReview = computed(() => toPieArray(filteredList.value.reduce((acc, v) => { acc[v.reviewStatus || '待复核'] = (acc[v.reviewStatus || '待复核'] || 0) + 1; return acc; }, {})));
const reviewPieType = computed(() => toPieArray(filteredList.value.reduce((acc, v) => { acc[v.abnormalType || '未知'] = (acc[v.abnormalType || '未知'] || 0) + 1; return acc; }, {})));

const completedPieArea = computed(() => toPieArray(filteredList.value.reduce((acc, v) => { const a = v.area.split('-')[0]; acc[a] = (acc[a] || 0) + (v.totalVolume || 0); return acc; }, {})));
const completedPieType = computed(() => toPieArray(filteredList.value.reduce((acc, v) => { acc[v.garbageType] = (acc[v.garbageType] || 0) + (v.totalVolume || 0); return acc; }, {})));

// ---------- 示例图表数据（实际可从数据计算）----------
const pendingBar = { x: ['上午','下午','夜间'], series: [4,3,1] };
const abnormalBar = { x: ['李华','张伟','陈晨'], series: [2,1,2] };
const reviewBar = { x: ['车辆故障','人员缺勤'], series: [2.5,1.8] };
const completedBar = { x: ['02-22','02-23','02-24'], series: [5.2,3.8,2.3] };
const ongoingLine = { x: ['08:00','10:00','12:00','14:00'], series: [1.2,2.5,3.8,4.6] };
const completedLine = { x: ['周一','周二','周三','周四'], series: [85,92,78,95] };
</script>

<template>
  <div class="chart2-box">
    <!-- 计划待执行 -->
    <template v-if="activeName === '计划待执行'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in pendingCards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" title-text="待执行区域分布" :data="pendingPieArea" />
      <Pie style="flex:1" title-text="待执行品类分布" :data="pendingPieType" />
      <Bar style="flex:1" title="不同时段待执行数量" :x-data="pendingBar.x" :series-data="[{ name:'计划数', data: pendingBar.series }]" />
    </template>

    <!-- 作业进行中 -->
    <template v-else-if="activeName === '作业进行中'">
      <div class="chart-box-left"><Indicator class="left-card" v-for="item in ongoingCards" :key="item.title" v-bind="item" /></div>
      <LineChart style="flex:1" title="当日收运量实时增长" :x-data="ongoingLine.x" :series-data="[{ name:'收运量(吨)', data: ongoingLine.series }]" y-name="吨" :smooth="true" />
    </template>

    <!-- 异常待处置 -->
    <template v-else-if="activeName === '异常待处置'">
      <div class="chart-box-left"><Indicator class="left-card" v-for="item in abnormalCards" :key="item.title" v-bind="item" /></div>
      <Pie style="flex:1" title-text="异常类型占比" :data="abnormalPieType" />
      <Pie style="flex:1" title-text="异常区域分布" :data="abnormalPieArea" />
      <Bar style="flex:1" title="责任人异常数量" :x-data="abnormalBar.x" :series-data="[{ name:'异常数', data: abnormalBar.series }]" />
    </template>

    <!-- 处置待复核 -->
    <template v-else-if="activeName === '处置待复核'">
      <div class="chart-box-left"><Indicator class="left-card" v-for="item in reviewCards" :key="item.title" v-bind="item" /></div>
      <Pie style="flex:1" title-text="复核结果占比" :data="reviewPieReview" />
      <Pie style="flex:1" title-text="异常类型占比" :data="reviewPieType" />
      <Bar style="flex:1" title="异常处置平均时长(小时)" :x-data="reviewBar.x" :series-data="[{ name:'时长', data: reviewBar.series }]" />
    </template>

    <!-- 已完成 -->
    <template v-else-if="activeName === '已完成'">
      <div class="box-left"><Indicator class="left-card" v-for="item in completedCards" :key="item.title" v-bind="item" /></div>
      <Pie style="flex:1" title-text="区域收运量占比" :data="completedPieArea" />
      <Pie style="flex:1" title-text="品类收运量占比" :data="completedPieType" />
      <Bar style="flex:1" title="按日收运量对比" :x-data="completedBar.x" :series-data="[{ name:'收运量(吨)', data: completedBar.series }]" />
      <LineChart style="flex:1" title="收运完成率趋势" :x-data="completedLine.x" :series-data="[{ name:'完成率', data: completedLine.series }]" y-name="%" :smooth="true" />
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
