<script setup>
import Indicator from '#/genchuan-components/stats/indicator.vue';
import Pie from '#/genchuan-components/stats/pie.vue';
import Bar from '#/genchuan-components/stats/bar.vue';
import LineChart from '#/genchuan-components/stats/lineChart.vue';

const props = defineProps({
  activeName: { type: String, required: true },
  // dataList 不再使用，完全采用静态数据
  dataList: { type: Array, default: () => [] }
});

// ---------- 静态模拟数据（严格符合 1.8.2 ~ 1.8.5 各子模块需求）----------
const mockConfig = {
  // 1.8.2 保洁待执行
  '保洁待执行': {
    cards: [
      { title: '待执行保洁计划数', value: 23, color: '#409EFF' },
      { title: '未分配人员计划数', value: 6, color: '#E6A23C' },
      { title: '高频保洁城中村数', value: 9, color: '#67C23A' },
    ],
    pie1: { title: '保洁频次分布占比', data: [
        { name: '每日2次', value: 12 },
        { name: '每日1次', value: 8 },
        { name: '隔日1次', value: 3 },
      ]},
    pie2: { title: '责任区域分布占比', data: [
        { name: '内街', value: 14 },
        { name: '主干道', value: 6 },
        { name: '市场周边', value: 3 },
      ]},
    bar: { title: '不同城中村保洁人员分配数量对比', x: ['上社村', '下社村', '田边村', '后埔村', '古塘村'], series: [15, 12, 10, 8, 7] },
  },
  // 1.8.3 问题待处置
  '问题待处置': {
    cards: [
      { title: '待处置问题数', value: 34, color: '#409EFF' },
      { title: '高优先级问题数', value: 12, color: '#E6A23C' },
      { title: '超时未处置数', value: 5, color: '#F56C6C' },
    ],
    pie1: { title: '问题类型占比', data: [
        { name: '卫生死角', value: 18 },
        { name: '乱堆乱放', value: 10 },
        { name: '设施破损', value: 6 },
      ]},
    pie2: { title: '责任部门分布占比', data: [
        { name: '保洁科', value: 20 },
        { name: '设施科', value: 8 },
        { name: '综合科', value: 6 },
      ]},
    bar: { title: '不同城中村问题处置时长对比', x: ['上社村', '下社村', '田边村', '后埔村', '古塘村'], series: [48, 52, 45, 50, 42] },
  },
  // 1.8.4 处置待复核
  '处置待复核': {
    cards: [
      { title: '待复核任务数', value: 16, color: '#409EFF' },
      { title: '已通过数', value: 42, color: '#67C23A' },
      { title: '需退回整改数', value: 7, color: '#E6A23C' },
    ],
    pie1: { title: '问题类型占比', data: [
        { name: '卫生死角', value: 22 },
        { name: '乱堆乱放', value: 15 },
        { name: '设施破损', value: 10 },
      ]},
    pie2: { title: '复核结果占比', data: [
        { name: '通过', value: 42 },
        { name: '不通过', value: 7 },
      ]},
    bar: { title: '不同责任部门复核通过率对比', x: ['保洁科', '设施科', '综合科'], series: [95, 82, 88] },
  },
  // 1.8.5 已完成
  '已完成': {
    cards: [
      { title: '已完成任务总数', value: 367, color: '#409EFF' },
      { title: '保洁达标数', value: 142, color: '#67C23A' },
      { title: '问题办结数', value: 98, color: '#E6A23C' },
      { title: '复核通过数', value: 86, color: '#F56C6C' },
    ],
    pie1: { title: '各任务类型占比', data: [
        { name: '保洁任务', value: 180 },
        { name: '问题处置', value: 120 },
        { name: '复核任务', value: 67 },
      ]},
    pie2: { title: '各城中村完成量占比', data: [
        { name: '上社村', value: 95 },
        { name: '下社村', value: 88 },
        { name: '田边村', value: 72 },
        { name: '后埔村', value: 65 },
        { name: '古塘村', value: 47 },
      ]},
    bar: { title: '按日已完成任务量对比', x: ['02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28'], series: [52, 48, 55, 60, 58, 62, 65] },
    line: { title: '考核得分月度趋势变化', x: ['第1周', '第2周', '第3周', '第4周'], series: [85, 87, 89, 92] },
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

    <!-- 问题待处置 -->
    <template v-else-if="activeName === '问题待处置'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['问题待处置'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['问题待处置'].pie1.title" :data="mockConfig['问题待处置'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['问题待处置'].pie2.title" :data="mockConfig['问题待处置'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['问题待处置'].bar.title" :x-data="mockConfig['问题待处置'].bar.x" :series-data="[{ name: '处置时长(分钟)', data: mockConfig['问题待处置'].bar.series }]" />
    </template>

    <!-- 处置待复核 -->
    <template v-else-if="activeName === '处置待复核'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['处置待复核'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['处置待复核'].pie1.title" :data="mockConfig['处置待复核'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['处置待复核'].pie2.title" :data="mockConfig['处置待复核'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['处置待复核'].bar.title" :x-data="mockConfig['处置待复核'].bar.x" :series-data="[{ name: '通过率(%)', data: mockConfig['处置待复核'].bar.series }]" />
    </template>

    <!-- 已完成 -->
    <template v-else-if="activeName === '已完成'">
      <div class="box-left">
        <Indicator class="left-card" v-for="item in mockConfig['已完成'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pie1.title" :data="mockConfig['已完成'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pie2.title" :data="mockConfig['已完成'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['已完成'].bar.title" :x-data="mockConfig['已完成'].bar.x" :series-data="[{ name: '完成量', data: mockConfig['已完成'].bar.series }]" />
      <LineChart style="flex:1" :title="mockConfig['已完成'].line.title" :x-data="mockConfig['已完成'].line.x" :series-data="[{ name: '考核得分', data: mockConfig['已完成'].line.series }]" y-name="分" :smooth="true" />
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
