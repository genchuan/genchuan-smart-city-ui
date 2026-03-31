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

// ---------- 静态模拟数据（严格符合 1.9.2 ~ 1.9.6 各子模块需求）----------
const mockConfig = {
  // 1.9.2 保洁待执行
  '保洁待执行': {
    cards: [
      { title: '待执行保洁计划数', value: 24, color: '#409EFF' },
      { title: '未分配人员计划数', value: 6, color: '#E6A23C' },
      { title: '高频保洁市场数', value: 8, color: '#67C23A' },
    ],
    pie1: { title: '保洁频次分布占比', data: [
        { name: '每日3次', value: 12 },
        { name: '每日2次', value: 8 },
        { name: '每日1次', value: 4 },
      ]},
    pie2: { title: '保洁区域分布占比', data: [
        { name: '摊位区', value: 15 },
        { name: '公共区', value: 6 },
        { name: '通道', value: 3 },
      ]},
    bar: { title: '不同市场保洁人员分配数量对比', x: ['北桥市场', '南门市场', '东岳市场', '西城市场', '浦南市场'], series: [12, 10, 8, 7, 6] },
  },
  // 1.9.3 收运待执行
  '收运待执行': {
    cards: [
      { title: '待执行收运计划数', value: 18, color: '#409EFF' },
      { title: '未分配车辆计划数', value: 4, color: '#E6A23C' },
      { title: '分类收运覆盖数', value: 22, color: '#67C23A' },
    ],
    pie1: { title: '垃圾类型占比', data: [
        { name: '厨余垃圾', value: 15 },
        { name: '其他垃圾', value: 10 },
        { name: '可回收物', value: 5 },
      ]},
    pie2: { title: '收运间隔分布占比', data: [
        { name: '2小时', value: 8 },
        { name: '3小时', value: 6 },
        { name: '4小时', value: 4 },
      ]},
    bar: { title: '不同市场收集容器数量对比', x: ['北桥市场', '南门市场', '东岳市场', '西城市场', '浦南市场'], series: [45, 38, 42, 30, 25] },
  },
  // 1.9.4 污水待处置
  '污水待处置': {
    cards: [
      { title: '待处置污水问题数', value: 9, color: '#409EFF' },
      { title: '已达标市场数', value: 20, color: '#67C23A' },
      { title: '超时未清理数', value: 2, color: '#F56C6C' },
    ],
    pie1: { title: '污水处置方式占比', data: [
        { name: '集中处理', value: 18 },
        { name: '定期抽运', value: 10 },
        { name: '就地处置', value: 4 },
      ]},
    pie2: { title: '处置状态占比', data: [
        { name: '待处置', value: 9 },
        { name: '处置中', value: 12 },
        { name: '已完成', value: 11 },
      ]},
    bar: { title: '不同市场污水处置合格率对比', x: ['北桥市场', '南门市场', '东岳市场', '西城市场', '浦南市场'], series: [98, 95, 92, 96, 94] },
  },
  // 1.9.5 卫生待核查
  '卫生待核查': {
    cards: [
      { title: '待核查市场数', value: 14, color: '#409EFF' },
      { title: '已达标数', value: 10, color: '#67C23A' },
      { title: '需整改数', value: 4, color: '#E6A23C' },
    ],
    pie1: { title: '核查结果占比', data: [
        { name: '达标', value: 10 },
        { name: '不达标', value: 4 },
      ]},
    pie2: { title: '核查时段分布占比', data: [
        { name: '开市前', value: 8 },
        { name: '收摊后', value: 6 },
      ]},
    bar: { title: '不同市场卫生达标率对比', x: ['北桥市场', '南门市场', '东岳市场', '西城市场', '浦南市场'], series: [96, 92, 88, 94, 90] },
    line: { title: '卫生达标率周度趋势变化', x: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], series: [94, 95, 93, 96, 97, 95, 96] },
  },
  // 1.9.6 已完成
  '已完成': {
    cards: [
      { title: '已完成任务总数', value: 456, color: '#409EFF' },
      { title: '卫生达标数', value: 32, color: '#67C23A' },
      { title: '收运完成率100%数', value: 28, color: '#E6A23C' },
      { title: '污水处置合格数', value: 29, color: '#F56C6C' },
    ],
    pie1: { title: '各任务类型占比', data: [
        { name: '保洁任务', value: 180 },
        { name: '收运任务', value: 120 },
        { name: '污水任务', value: 80 },
        { name: '核查任务', value: 76 },
      ]},
    pie2: { title: '各市场完成量占比', data: [
        { name: '北桥市场', value: 110 },
        { name: '南门市场', value: 98 },
        { name: '东岳市场', value: 95 },
        { name: '西城市场', value: 82 },
        { name: '浦南市场', value: 71 },
      ]},
    bar: { title: '按日已完成任务量对比', x: ['02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28'], series: [65, 70, 68, 75, 80, 78, 85] },
    line: { title: '综合管理评分月度趋势变化', x: ['第1周', '第2周', '第3周', '第4周'], series: [85, 87, 89, 92] },
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

    <!-- 收运待执行 -->
    <template v-else-if="activeName === '收运待执行'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['收运待执行'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['收运待执行'].pie1.title" :data="mockConfig['收运待执行'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['收运待执行'].pie2.title" :data="mockConfig['收运待执行'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['收运待执行'].bar.title" :x-data="mockConfig['收运待执行'].bar.x" :series-data="[{ name: '容器数量', data: mockConfig['收运待执行'].bar.series }]" />
    </template>

    <!-- 污水待处置 -->
    <template v-else-if="activeName === '污水待处置'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['污水待处置'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['污水待处置'].pie1.title" :data="mockConfig['污水待处置'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['污水待处置'].pie2.title" :data="mockConfig['污水待处置'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['污水待处置'].bar.title" :x-data="mockConfig['污水待处置'].bar.x" :series-data="[{ name: '合格率', data: mockConfig['污水待处置'].bar.series }]" />
    </template>

    <!-- 卫生待核查 -->
    <template v-else-if="activeName === '卫生待核查'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['卫生待核查'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['卫生待核查'].pie1.title" :data="mockConfig['卫生待核查'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['卫生待核查'].pie2.title" :data="mockConfig['卫生待核查'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['卫生待核查'].bar.title" :x-data="mockConfig['卫生待核查'].bar.x" :series-data="[{ name: '达标率', data: mockConfig['卫生待核查'].bar.series }]" />
      <LineChart style="flex:1" :title="mockConfig['卫生待核查'].line.title" :x-data="mockConfig['卫生待核查'].line.x" :series-data="[{ name: '达标率', data: mockConfig['卫生待核查'].line.series }]" y-name="%" :smooth="true" />
    </template>

    <!-- 已完成 -->
    <template v-else-if="activeName === '已完成'">
      <div class="box-left">
        <Indicator class="left-card" v-for="item in mockConfig['已完成'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pie1.title" :data="mockConfig['已完成'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pie2.title" :data="mockConfig['已完成'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['已完成'].bar.title" :x-data="mockConfig['已完成'].bar.x" :series-data="[{ name: '完成量', data: mockConfig['已完成'].bar.series }]" />
      <LineChart style="flex:1" :title="mockConfig['已完成'].line.title" :x-data="mockConfig['已完成'].line.x" :series-data="[{ name: '综合评分', data: mockConfig['已完成'].line.series }]" y-name="分" :smooth="true" />
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
