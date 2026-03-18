<script setup>
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';
import LineChart from '#/components/stats/lineChart.vue';

const props = defineProps({
  activeName: { type: String, required: true },
  dataList: { type: Array, default: () => [] }
});

const mockConfig = {
  // 1.6.2 保洁待执行
  '保洁待执行': {
    cards: [
      { title: '待执行计划数', value: 24, color: '#409EFF' },
      { title: '按区域待执行数', value: 8, color: '#67C23A' },
      { title: '按人员分配数', value: 12, color: '#E6A23C' },
    ],
    pie1: { title: '保洁频次分布占比', data: [
        { name: '每日3次', value: 10 },
        { name: '每日2次', value: 8 },
        { name: '每日1次', value: 6 },
      ]},
    pie2: { title: '巡回间隔占比', data: [
        { name: '30分钟', value: 12 },
        { name: '60分钟', value: 8 },
        { name: '90分钟', value: 4 },
      ]},
    bar: { title: '不同时段保洁计划数量对比', x: ['上午', '下午', '夜间'], series: [14, 18, 6] },
  },
  // 1.6.3 收运待执行
  '收运待执行': {
    cards: [
      { title: '待执行收运计划数', value: 16, color: '#409EFF' },
      { title: '未分配车辆计划数', value: 5, color: '#E6A23C' },
      { title: '高频收运商业街数', value: 7, color: '#67C23A' },
    ],
    pie1: { title: '收运间隔分布占比', data: [
        { name: '2小时', value: 6 },
        { name: '3小时', value: 5 },
        { name: '4小时', value: 3 },
        { name: '6小时', value: 2 },
      ]},
    pie2: { title: '所属区域分布占比', data: [
        { name: '龙文区', value: 5 },
        { name: '龙海区', value: 4 },
        { name: '芗城区', value: 4 },
        { name: '长泰区', value: 2 },
        { name: '漳浦县', value: 1 },
      ]},
    bar: { title: '不同商业街垃圾收集点位数量对比', x: ['龙文街', '龙海街', '芗城街', '长泰街', '漳浦街'], series: [32, 28, 35, 20, 18] },
  },
  // 1.6.4 设施待维护
  '设施待维护': {
    cards: [
      { title: '待维护设施数', value: 22, color: '#409EFF' },
      { title: '已派单数', value: 9, color: '#67C23A' },
      { title: '超时未维护数', value: 4, color: '#F56C6C' },
    ],
    pie1: { title: '设施类型损坏占比', data: [
        { name: '垃圾桶', value: 10 },
        { name: '路灯', value: 6 },
        { name: '休息座椅', value: 4 },
        { name: '指示牌', value: 2 },
      ]},
    pie2: { title: '维护状态占比', data: [
        { name: '待派单', value: 8 },
        { name: '已派单', value: 9 },
        { name: '维修中', value: 5 },
      ]},
    bar: { title: '不同商业街设施待维护数量对比', x: ['龙文街', '龙海街', '芗城街', '长泰街', '漳浦街'], series: [7, 5, 4, 3, 3] },
  },
  // 1.6.5 问题待处置
  '问题待处置': {
    cards: [
      { title: '待处置问题数', value: 31, color: '#409EFF' },
      { title: '高优先级问题数', value: 12, color: '#E6A23C' },
      { title: '超时未处置数', value: 5, color: '#F56C6C' },
    ],
    pie1: { title: '问题类型占比', data: [
        { name: '卫生问题', value: 15 },
        { name: '设施问题', value: 10 },
        { name: '占道问题', value: 6 },
      ]},
    pie2: { title: '处置状态占比', data: [
        { name: '待派单', value: 10 },
        { name: '处置中', value: 16 },
        { name: '已办结', value: 5 },
      ]},
    bar: { title: '不同商业街问题处置时长对比', x: ['龙文街', '龙海街', '芗城街', '长泰街', '漳浦街'], series: [48, 52, 39, 45, 41] },
  },
  // 1.6.6 已完成
  '已完成': {
    cards: [
      { title: '已完成任务总数', value: 327, color: '#409EFF' },
      { title: '保洁覆盖达标数', value: 152, color: '#67C23A' },
      { title: '设施完好达标数', value: 98, color: '#E6A23C' },
      { title: '收运完成率100%数', value: 16, color: '#F56C6C' },
    ],
    pie1: { title: '各任务类型完成量占比', data: [
        { name: '保洁任务', value: 180 },
        { name: '收运任务', value: 90 },
        { name: '维护任务', value: 57 },
      ]},
    pie2: { title: '各商业街完成量占比', data: [
        { name: '龙文街', value: 98 },
        { name: '龙海街', value: 82 },
        { name: '芗城街', value: 75 },
        { name: '长泰街', value: 42 },
        { name: '漳浦街', value: 30 },
      ]},
    bar: { title: '按日已完成任务量对比', x: ['02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28'], series: [45, 52, 48, 55, 60, 58, 62] },
    line: { title: '保洁覆盖率月度趋势变化', x: ['第1周', '第2周', '第3周', '第4周'], series: [92, 94, 95, 96] },
  },
};
</script>

<template>
  <div class="chart2-box">
    <!-- 保洁待执行 -->
    <template v-if="activeName === '保洁待执行'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['保洁待执行'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['保洁待执行'].pie1.title" :data="mockConfig['保洁待执行'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['保洁待执行'].pie2.title" :data="mockConfig['保洁待执行'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['保洁待执行'].bar.title" :x-data="mockConfig['保洁待执行'].bar.x" :series-data="[{ name: '计划数', data: mockConfig['保洁待执行'].bar.series }]" />
    </template>

    <!-- 收运待执行 -->
    <template v-else-if="activeName === '收运待执行'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['收运待执行'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['收运待执行'].pie1.title" :data="mockConfig['收运待执行'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['收运待执行'].pie2.title" :data="mockConfig['收运待执行'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['收运待执行'].bar.title" :x-data="mockConfig['收运待执行'].bar.x" :series-data="[{ name: '点位数量', data: mockConfig['收运待执行'].bar.series }]" />
    </template>

    <!-- 设施待维护 -->
    <template v-else-if="activeName === '设施待维护'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['设施待维护'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['设施待维护'].pie1.title" :data="mockConfig['设施待维护'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['设施待维护'].pie2.title" :data="mockConfig['设施待维护'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['设施待维护'].bar.title" :x-data="mockConfig['设施待维护'].bar.x" :series-data="[{ name: '待维护数', data: mockConfig['设施待维护'].bar.series }]" />
    </template>

    <!-- 问题待处置 -->
    <template v-else-if="activeName === '问题待处置'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['问题待处置'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['问题待处置'].pie1.title" :data="mockConfig['问题待处置'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['问题待处置'].pie2.title" :data="mockConfig['问题待处置'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['问题待处置'].bar.title" :x-data="mockConfig['问题待处置'].bar.x" :series-data="[{ name: '处置时长(分钟)', data: mockConfig['问题待处置'].bar.series }]" />
    </template>

    <!-- 已完成 -->
    <template v-else-if="activeName === '已完成'">
      <div class="box-left">
        <Indicator class="left-card" v-for="item in mockConfig['已完成'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pie1.title" :data="mockConfig['已完成'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pie2.title" :data="mockConfig['已完成'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['已完成'].bar.title" :x-data="mockConfig['已完成'].bar.x" :series-data="[{ name: '完成量', data: mockConfig['已完成'].bar.series }]" />
      <LineChart style="flex:1" :title="mockConfig['已完成'].line.title" :x-data="mockConfig['已完成'].line.x" :series-data="[{ name: '覆盖率', data: mockConfig['已完成'].line.series }]" y-name="%" :smooth="true" />
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
