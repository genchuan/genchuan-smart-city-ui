<script setup>
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';
import LineChart from '#/components/stats/lineChart.vue';

const props = defineProps({
  activeName: { type: String, required: true },
  // dataList 不再使用，完全采用静态数据
  dataList: { type: Array, default: () => [] }
});

// ---------- 静态模拟数据（严格符合 1.10.2 ~ 1.10.5 各子模块需求）----------
const mockConfig = {
  // 1.10.2 保洁待执行
  '保洁待执行': {
    cards: [
      { title: '待执行保洁计划数', value: 18, color: '#409EFF' },
      { title: '水域保洁计划数', value: 12, color: '#67C23A' },
      { title: '陆域保洁计划数', value: 6, color: '#E6A23C' },
    ],
    pie1: { title: '保洁类型占比', data: [
        { name: '水域保洁', value: 12 },
        { name: '陆域保洁', value: 6 },
      ]},
    pie2: { title: '保洁频次分布占比', data: [
        { name: '每日1次', value: 8 },
        { name: '每周3次', value: 5 },
        { name: '每周1次', value: 3 },
        { name: '每2周1次', value: 2 },
      ]},
    bar: { title: '不同河道保洁人员分配数量对比', x: ['九十九湾', '浦头港', '三湘江', '恒坑溪', '丁字港'], series: [8, 6, 5, 4, 3] },
  },
  // 1.10.3 监测待执行
  '监测待执行': {
    cards: [
      { title: '待执行监测任务数', value: 24, color: '#409EFF' },
      { title: '高优先级监测数', value: 5, color: '#E6A23C' },
      { title: '预警未处理数', value: 3, color: '#F56C6C' },
    ],
    pie1: { title: '监测类型占比', data: [
        { name: '水质监测', value: 14 },
        { name: '异味监测', value: 6 },
        { name: '水生植物监测', value: 4 },
      ]},
    pie2: { title: '监测状态占比', data: [
        { name: '待执行', value: 24 },
        { name: '执行中', value: 10 },
        { name: '已完成', value: 8 },
      ]},
    line: { title: '核心监测指标历史趋势变化', x: ['1月', '2月', '3月', '4月', '5月'], series: [85, 88, 92, 90, 94] },
    bar: { title: '不同河段监测数据达标率对比', x: ['九十九湾', '浦头港', '三湘江', '恒坑溪', '丁字港'], series: [96, 92, 88, 94, 90] },
  },
  // 1.10.4 问题待处置
  '问题待处置': {
    cards: [
      { title: '待处置问题数', value: 27, color: '#409EFF' },
      { title: '高优先级问题数', value: 9, color: '#E6A23C' },
      { title: '超时未处置数', value: 4, color: '#F56C6C' },
    ],
    pie1: { title: '问题类型占比', data: [
        { name: '污水排放', value: 12 },
        { name: '垃圾堆积', value: 8 },
        { name: '水生植物泛滥', value: 7 },
      ]},
    pie2: { title: '责任部门分布占比', data: [
        { name: '河道所', value: 14 },
        { name: '环保局', value: 8 },
        { name: '街道办', value: 5 },
      ]},
    bar: { title: '不同河段问题处置时长对比', x: ['九十九湾', '浦头港', '三湘江', '恒坑溪', '丁字港'], series: [48, 52, 45, 50, 42] },
  },
  // 1.10.5 已完成
  '已完成': {
    cards: [
      { title: '已完成任务总数', value: 342, color: '#409EFF' },
      { title: '保洁覆盖达标数', value: 28, color: '#67C23A' },
      { title: '水质达标数', value: 26, color: '#E6A23C' },
      { title: '问题办结数', value: 115, color: '#F56C6C' },
      { title: '垃圾打捞总吨数', value: '245吨', color: '#909399' },
    ],
    pie1: { title: '各任务类型完成量占比', data: [
        { name: '保洁任务', value: 180 },
        { name: '监测任务', value: 90 },
        { name: '问题处置', value: 72 },
      ]},
    pie2: { title: '各河段完成量占比', data: [
        { name: '九十九湾', value: 95 },
        { name: '浦头港', value: 82 },
        { name: '三湘江', value: 75 },
        { name: '恒坑溪', value: 50 },
        { name: '丁字港', value: 40 },
      ]},
    bar1: { title: '按日已完成任务量对比', x: ['02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28'], series: [48, 52, 50, 55, 58, 60, 62] },
    bar2: { title: '不同河段垃圾打捞量对比', x: ['九十九湾', '浦头港', '三湘江', '恒坑溪', '丁字港'], series: [85, 72, 65, 48, 35] },
    line1: { title: '水质达标率月度趋势变化', x: ['1月', '2月', '3月', '4月', '5月'], series: [88, 90, 92, 94, 96] },
    line2: { title: '保洁覆盖率季度趋势变化', x: ['Q1', 'Q2', 'Q3', 'Q4'], series: [85, 88, 92, 94] },
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
      <Bar style="flex:1" :title="mockConfig['保洁待执行'].bar.title" :x-data="mockConfig['保洁待执行'].bar.x" :series-data="[{ name: '人员数量', data: mockConfig['保洁待执行'].bar.series }]" />
    </template>

    <!-- 监测待执行 -->
    <template v-else-if="activeName === '监测待执行'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['监测待执行'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['监测待执行'].pie1.title" :data="mockConfig['监测待执行'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['监测待执行'].pie2.title" :data="mockConfig['监测待执行'].pie2.data" />
      <LineChart style="flex:1" :title="mockConfig['监测待执行'].line.title" :x-data="mockConfig['监测待执行'].line.x" :series-data="[{ name: '达标率', data: mockConfig['监测待执行'].line.series }]" y-name="%" :smooth="true" />
      <Bar style="flex:1" :title="mockConfig['监测待执行'].bar.title" :x-data="mockConfig['监测待执行'].bar.x" :series-data="[{ name: '达标率', data: mockConfig['监测待执行'].bar.series }]" />
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
      <div class="box-left-m">
        <Indicator class="left-card" v-for="item in mockConfig['已完成'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pie1.title" :data="mockConfig['已完成'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pie2.title" :data="mockConfig['已完成'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['已完成'].bar1.title" :x-data="mockConfig['已完成'].bar1.x" :series-data="[{ name: '完成量', data: mockConfig['已完成'].bar1.series }]" />
      <Bar style="flex:1" :title="mockConfig['已完成'].bar2.title" :x-data="mockConfig['已完成'].bar2.x" :series-data="[{ name: '打捞量(吨)', data: mockConfig['已完成'].bar2.series }]" />
      <LineChart style="flex:1" :title="mockConfig['已完成'].line1.title" :x-data="mockConfig['已完成'].line1.x" :series-data="[{ name: '达标率', data: mockConfig['已完成'].line1.series }]" y-name="%" :smooth="true" />
      <LineChart style="flex:1" :title="mockConfig['已完成'].line2.title" :x-data="mockConfig['已完成'].line2.x" :series-data="[{ name: '覆盖率', data: mockConfig['已完成'].line2.series }]" y-name="%" :smooth="true" />
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

  .box-left-m {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    min-width: 360px;
    max-width: 400px;
    margin-top: 10px !important;

    .left-card {
      height: 150px !important;
    }
  }

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
