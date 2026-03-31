<script setup>
import { computed } from 'vue';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';
import LineChart from '#/components/stats/lineChart.vue';

const props = defineProps({
  activeName: { type: String, required: true },
  dataList: { type: Array, default: () => [] } // 保留 props 但使用静态数据
});

// ---------- 静态模拟数据（严格符合各子模块需求）----------
const mockConfig = {
  // 1.5.2 保洁待执行
  '保洁待执行': {
    cards: [
      { title: '待执行计划数', value: 18, color: '#409EFF' },
      { title: '按机构类型待执行数', value: 12, color: '#67C23A' },
      { title: '按区域待执行数', value: 8, color: '#E6A23C' },
    ],
    pie1: { title: '保洁频次分布占比', data: [
        { name: '每日2次', value: 8 },
        { name: '每日1次', value: 6 },
        { name: '每周3次', value: 4 },
      ]},
    pie2: { title: '机构类型占比', data: [
        { name: '学校', value: 7 },
        { name: '医院', value: 5 },
        { name: '机关单位', value: 4 },
        { name: '商场', value: 2 },
      ]},
    bar: { title: '不同时段保洁计划数量对比', x: ['上午', '下午', '夜间'], series: [9, 6, 3] },
  },
  // 1.5.3 问题待处置
  '问题待处置': {
    cards: [
      { title: '待处置问题总数', value: 24, color: '#409EFF' },
      { title: '按类型问题数', value: 15, color: '#67C23A' },
      { title: '超时未处理数', value: 5, color: '#F56C6C' },
    ],
    pie1: { title: '问题类型占比', data: [
        { name: '卫生死角', value: 10 },
        { name: '设施损坏', value: 8 },
        { name: '异味问题', value: 6 },
      ]},
    pie2: { title: '机构类型占比', data: [
        { name: '学校', value: 8 },
        { name: '医院', value: 7 },
        { name: '机关单位', value: 5 },
        { name: '商场', value: 4 },
      ]},
    bar: { title: '不同区域问题数量对比', x: ['龙文区', '龙海区', '芗城区', '长泰区'], series: [8, 6, 5, 5] },
  },
  // 1.5.4 核查待验收
  '核查待验收': {
    cards: [
      { title: '待核查任务数', value: 14, color: '#409EFF' },
      { title: '已达标数', value: 22, color: '#67C23A' },
      { title: '需整改数', value: 8, color: '#E6A23C' },
    ],
    pie1: { title: '核查结果占比', data: [
        { name: '待核查', value: 14 },
        { name: '达标', value: 22 },
        { name: '不达标', value: 8 },
      ]},
    pie2: { title: '任务类型占比', data: [
        { name: '保洁任务', value: 18 },
        { name: '问题处置', value: 15 },
        { name: '设备维护', value: 11 },
      ]},
    bar: { title: '不同机构核查通过率对比', x: ['龙文一中', '龙海医院', '芗城机关', '长泰商场'], series: [98, 92, 88, 95] }, // 通过率 %
  },
  // 1.5.5 已完成
  '已完成': {
    cards: [
      { title: '已完成任务总数', value: 187, color: '#409EFF' },
      { title: '保洁达标率', value: '96%', color: '#67C23A' },
      { title: '问题办结率', value: '92%', color: '#E6A23C' },
      { title: '核查通过率', value: '94%', color: '#F56C6C' },
    ],
    pie1: { title: '各机构类型任务占比', data: [
        { name: '学校', value: 65 },
        { name: '医院', value: 48 },
        { name: '机关单位', value: 42 },
        { name: '商场', value: 32 },
      ]},
    pie2: { title: '各任务类型占比', data: [
        { name: '保洁任务', value: 98 },
        { name: '问题处置', value: 52 },
        { name: '核查任务', value: 37 },
      ]},
    bar: { title: '按日任务完成量对比', x: ['02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28'], series: [28, 32, 30, 35, 33, 38, 40] },
    line: { title: '保洁达标率趋势变化', x: ['02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28'], series: [95, 96, 94, 97, 96, 98, 97] },
  },
};

const currentConfig = computed(() => mockConfig[props.activeName] || null);
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

    <!-- 问题待处置 -->
    <template v-else-if="activeName === '问题待处置'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['问题待处置'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['问题待处置'].pie1.title" :data="mockConfig['问题待处置'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['问题待处置'].pie2.title" :data="mockConfig['问题待处置'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['问题待处置'].bar.title" :x-data="mockConfig['问题待处置'].bar.x" :series-data="[{ name: '问题数', data: mockConfig['问题待处置'].bar.series }]" />
    </template>

    <!-- 核查待验收 -->
    <template v-else-if="activeName === '核查待验收'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['核查待验收'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['核查待验收'].pie1.title" :data="mockConfig['核查待验收'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['核查待验收'].pie2.title" :data="mockConfig['核查待验收'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['核查待验收'].bar.title" :x-data="mockConfig['核查待验收'].bar.x" :series-data="[{ name: '通过率', data: mockConfig['核查待验收'].bar.series }]" />
    </template>

    <!-- 已完成 -->
    <template v-else-if="activeName === '已完成'">
      <div class="box-left">
        <Indicator class="left-card" v-for="item in mockConfig['已完成'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pie1.title" :data="mockConfig['已完成'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pie2.title" :data="mockConfig['已完成'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['已完成'].bar.title" :x-data="mockConfig['已完成'].bar.x" :series-data="[{ name: '完成量', data: mockConfig['已完成'].bar.series }]" />
      <LineChart style="flex:1" :title="mockConfig['已完成'].line.title" :x-data="mockConfig['已完成'].line.x" :series-data="[{ name: '达标率', data: mockConfig['已完成'].line.series }]" y-name="%" :smooth="true" />
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
