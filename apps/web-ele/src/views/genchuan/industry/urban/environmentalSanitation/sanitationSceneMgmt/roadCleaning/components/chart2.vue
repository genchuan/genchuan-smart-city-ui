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

// 辅助函数：对象转数组（用于Pie组件）
const toPieArray = (obj) => Object.entries(obj).map(([name, value]) => ({ name, value }));

// ---------- 卡片数据 ----------
// 清扫待执行
const pendingCards = computed(() => [
  { title: '待执行计划总数', value: filteredList.value.length, color: '#409EFF' },
  { title: '按区域待执行数', value: new Set(filteredList.value.map(v => v.area)).size, color: '#13ce66' },
  { title: '按人员分配数', value: new Set(filteredList.value.flatMap(v => v.staffIds || [])).size, color: '#67C23A' },
]);

// 作业进行中
const ongoingCards = computed(() => [
  { title: '当前作业任务数', value: filteredList.value.length, color: '#409EFF' },
  { title: '正常运行数', value: filteredList.value.filter(v => v.operationStatus === '运行').length, color: '#13ce66' },
  { title: '异常标记数', value: filteredList.value.filter(v => v.isAbnormal).length, color: '#F56C6C' },
]);

// 问题待处置
const problemCards = computed(() => [
  { title: '待处置问题总数', value: filteredList.value.length, color: '#409EFF' },
  { title: '高优先级数', value: filteredList.value.filter(v => v.priority === '高').length, color: '#E6A23C' },
  { title: '超时未处理数', value: filteredList.value.filter(v => v.isTimeout).length, color: '#F56C6C' },
]);

// 质量待核查
const reviewCards = computed(() => [
  { title: '待核查任务数', value: filteredList.value.filter(v => v.reviewStatus === '待核查').length, color: '#409EFF' },
  { title: '已达标数', value: filteredList.value.filter(v => v.reviewStatus === '达标').length, color: '#13ce66' },
  { title: '需整改数', value: filteredList.value.filter(v => v.reviewStatus === '不达标').length, color: '#F56C6C' },
]);

// 已完成
const completedCards = computed(() => [
  { title: '已完成任务数', value: filteredList.value.length, color: '#409EFF' },
  { title: '总清扫里程', value: filteredList.value.reduce((acc, v) => acc + (v.mileage || 0), 0).toFixed(1) + 'km', color: '#13ce66' },
  { title: '平均质量达标率', value: (filteredList.value.reduce((acc, v) => acc + (v.qualityRate || 0), 0) / (filteredList.value.length || 1)).toFixed(0) + '%', color: '#67C23A' },
  { title: '问题处置及时率', value: (filteredList.value.filter(v => v.problemHandleRate >= 90).length / (filteredList.value.length || 1) * 100).toFixed(0) + '%', color: '#F56C6C' },
]);

// ---------- 圆环图数据 ----------
// 清扫待执行
const pendingPie = computed(() => ({
  frequency: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.frequency] = (acc[v.frequency] || 0) + 1; return acc; }, {})),
  roadType: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.roadType] = (acc[v.roadType] || 0) + 1; return acc; }, {})),
}));

// 问题待处置
const problemPie = computed(() => ({
  type: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.problemType] = (acc[v.problemType] || 0) + 1; return acc; }, {})),
  area: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.area] = (acc[v.area] || 0) + 1; return acc; }, {})),
}));

// 质量待核查
const reviewPie = computed(() => ({
  result: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.reviewResult || '待核查'] = (acc[v.reviewResult || '待核查'] || 0) + 1; return acc; }, {})),
  area: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.area] = (acc[v.area] || 0) + 1; return acc; }, {})),
}));

// 已完成
const completedPie = computed(() => ({
  area: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.area] = (acc[v.area] || 0) + (v.mileage || 0); return acc; }, {})),
  staff: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.staff] = (acc[v.staff] || 0) + 1; return acc; }, {})),
}));

// ---------- 示例柱状图/折线图数据 ----------
// 清扫待执行时段对比
const pendingBar = { x: ['凌晨', '上午', '下午', '夜间'], series: [1, 5, 3, 2] };
// 问题处置组对比
const problemBar = { x: ['一组', '二组', '三组'], series: [2, 3, 1] };
// 质量达标率区域对比
const reviewBar = { x: ['龙文区', '龙海区', '芗城区', '长泰区', '漳浦县'], series: [98, 95, 92, 96, 100] };
// 已完成任务量对比（按日）
const completedBar = { x: ['02-22', '02-23', '02-24'], series: [5.2, 3.8, 2.3] };
// 已完成质量达标率趋势
const completedLine = { x: ['周一', '周二', '周三', '周四'], series: [98, 95, 92, 96] };
// 作业进行中完成率趋势
const ongoingLine = { x: ['08:00', '10:00', '12:00', '14:00'], series: [20, 45, 70, 85] };
</script>

<template>
  <div class="chart2-box">
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
      <!-- 地图组件暂缺，用折线图代替趋势 -->
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
