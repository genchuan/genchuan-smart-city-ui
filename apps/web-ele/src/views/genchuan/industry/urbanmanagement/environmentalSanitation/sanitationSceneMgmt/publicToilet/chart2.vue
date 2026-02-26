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
// 保洁待执行
const cleaningCards = computed(() => [
  { title: '待执行保洁计划数', value: filteredList.value.length, color: '#409EFF' },
  { title: '按区域待执行数', value: new Set(filteredList.value.map(v => v.area)).size, color: '#13ce66' },
  { title: '按人员分配数', value: new Set(filteredList.value.flatMap(v => v.cleanerIds || [])).size, color: '#67C23A' },
]);

// 物资待补充
const materialCards = computed(() => [
  { title: '待补充物资总数', value: filteredList.value.length, color: '#409EFF' },
  { title: '高预警物资数', value: filteredList.value.filter(v => v.warningLevel === '高').length, color: '#E6A23C' },
  { title: '各区域待补充数', value: new Set(filteredList.value.map(v => v.area)).size, color: '#F56C6C' },
]);

// 投诉待处置
const complaintCards = computed(() => [
  { title: '待处置投诉总数', value: filteredList.value.length, color: '#409EFF' },
  { title: '按类型投诉数', value: new Set(filteredList.value.map(v => v.complaintType)).size, color: '#13ce66' },
  { title: '超时未处理数', value: filteredList.value.filter(v => v.isTimeout).length, color: '#F56C6C' },
]);

// 设施待维修
const facilityCards = computed(() => [
  { title: '待维修设施总数', value: filteredList.value.length, color: '#409EFF' },
  { title: '按类型维修数', value: new Set(filteredList.value.map(v => v.facilityType)).size, color: '#13ce66' },
  { title: '已派单数', value: filteredList.value.filter(v => v.repairStatus === '已派单').length, color: '#67C23A' },
]);

// 已完成
const completedCards = computed(() => [
  { title: '已完成任务总数', value: filteredList.value.length, color: '#409EFF' },
  { title: '保洁达标率', value: (filteredList.value.filter(v => v.cleaningRate >= 90).length / (filteredList.value.length || 1) * 100).toFixed(0) + '%', color: '#67C23A' },
  { title: '投诉办结率', value: (filteredList.value.filter(v => v.complaintRate >= 90).length / (filteredList.value.length || 1) * 100).toFixed(0) + '%', color: '#E6A23C' },
  { title: '设施完好率', value: (filteredList.value.filter(v => v.facilityRate >= 90).length / (filteredList.value.length || 1) * 100).toFixed(0) + '%', color: '#F56C6C' },
]);

// ---------- 圆环图数据 ----------
// 保洁待执行
const cleaningPie = computed(() => ({
  frequency: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.cleaningFrequency] = (acc[v.cleaningFrequency] || 0) + 1; return acc; }, {})),
  area: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.area] = (acc[v.area] || 0) + 1; return acc; }, {})),
}));

// 物资待补充
const materialPie = computed(() => ({
  type: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.materialType] = (acc[v.materialType] || 0) + 1; return acc; }, {})),
  warning: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.warningStatus || '正常'] = (acc[v.warningStatus || '正常'] || 0) + 1; return acc; }, {})),
}));

// 投诉待处置
const complaintPie = computed(() => ({
  type: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.complaintType] = (acc[v.complaintType] || 0) + 1; return acc; }, {})),
  area: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.area] = (acc[v.area] || 0) + 1; return acc; }, {})),
}));

// 设施待维修
const facilityPie = computed(() => ({
  type: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.facilityType] = (acc[v.facilityType] || 0) + 1; return acc; }, {})),
  status: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.repairStatus] = (acc[v.repairStatus] || 0) + 1; return acc; }, {})),
}));

// 已完成
const completedPie = computed(() => ({
  taskType: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.taskType] = (acc[v.taskType] || 0) + 1; return acc; }, {})),
  area: toPieArray(filteredList.value.reduce((acc, v) => { acc[v.area] = (acc[v.area] || 0) + 1; return acc; }, {})),
}));

// ---------- 示例柱状图/折线图数据（实际应从数据计算）----------
// 保洁待执行时段对比
const cleaningBar = { x: ['上午', '下午', '夜间'], series: [4, 3, 1] };
// 物资缺口数量对比
const materialBar = { x: ['洗手液', '厕纸', '消毒液'], series: [5, 8, 3] };
// 投诉区域对比
const complaintBar = { x: ['龙文区', '龙海区', '芗城区'], series: [2, 3, 1] };
// 设施损坏区域对比
const facilityBar = { x: ['龙文区', '龙海区', '芗城区'], series: [2, 4, 2] };
// 已完成任务量对比（按日）
const completedBar = { x: ['02-22', '02-23', '02-24'], series: [5.2, 3.8, 2.3] };
// 已完成达标率趋势
const completedLine = { x: ['周一', '周二', '周三', '周四'], series: [98, 95, 92, 94] };
</script>

<template>
  <div class="chart2-box">
    <!-- 保洁待执行 -->
    <template v-if="activeName === '保洁待执行'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in cleaningCards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" title-text="保洁频次分布" :data="cleaningPie.frequency" />
      <Pie style="flex:1" title-text="区域分布" :data="cleaningPie.area" />
      <Bar style="flex:1" title="不同时段保洁计划数量对比" :x-data="cleaningBar.x" :series-data="[{ name: '计划数', data: cleaningBar.series }]" />
    </template>

    <!-- 物资待补充 -->
    <template v-else-if="activeName === '物资待补充'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in materialCards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" title-text="物资类型占比" :data="materialPie.type" />
      <Pie style="flex:1" title-text="预警状态占比" :data="materialPie.warning" />
      <Bar style="flex:1" title="不同物资缺口数量对比" :x-data="materialBar.x" :series-data="[{ name: '缺口数', data: materialBar.series }]" />
    </template>

    <!-- 投诉待处置 -->
    <template v-else-if="activeName === '投诉待处置'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in complaintCards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" title-text="投诉类型占比" :data="complaintPie.type" />
      <Pie style="flex:1" title-text="区域分布占比" :data="complaintPie.area" />
      <Bar style="flex:1" title="不同区域投诉数量对比" :x-data="complaintBar.x" :series-data="[{ name: '投诉数', data: complaintBar.series }]" />
    </template>

    <!-- 设施待维修 -->
    <template v-else-if="activeName === '设施待维修'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in facilityCards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" title-text="设施类型占比" :data="facilityPie.type" />
      <Pie style="flex:1" title-text="维修状态占比" :data="facilityPie.status" />
      <Bar style="flex:1" title="不同区域设施损坏数量对比" :x-data="facilityBar.x" :series-data="[{ name: '损坏数', data: facilityBar.series }]" />
    </template>

    <!-- 已完成 -->
    <template v-else-if="activeName === '已完成'">
      <div class="box-left">
        <Indicator class="left-card" v-for="item in completedCards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" title-text="任务类型占比" :data="completedPie.taskType" />
      <Pie style="flex:1" title-text="区域完成量占比" :data="completedPie.area" />
      <Bar style="flex:1" title="按日任务完成量对比" :x-data="completedBar.x" :series-data="[{ name: '完成量', data: completedBar.series }]" />
      <LineChart style="flex:1" title="保洁达标率趋势" :x-data="completedLine.x" :series-data="[{ name: '达标率', data: completedLine.series }]" y-name="%" :smooth="true" />
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
