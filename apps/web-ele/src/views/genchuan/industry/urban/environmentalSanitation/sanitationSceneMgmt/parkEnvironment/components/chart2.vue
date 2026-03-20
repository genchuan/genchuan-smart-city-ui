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
  // 1.7.2 保洁待执行
  '保洁待执行': {
    cards: [
      { title: '待执行保洁计划数', value: 18, color: '#409EFF' },
      { title: '未分配人员计划数', value: 5, color: '#E6A23C' },
      { title: '高频保洁公园数', value: 8, color: '#67C23A' },
    ],
    pie1: { title: '保洁频次分布占比', data: [
        { name: '每日2次', value: 10 },
        { name: '每日1次', value: 6 },
        { name: '每周3次', value: 2 },
      ]},
    pie2: { title: '保洁区域分布占比', data: [
        { name: '休闲广场', value: 7 },
        { name: '主园路', value: 5 },
        { name: '儿童乐园', value: 4 },
        { name: '湖滨区', value: 2 },
      ]},
    bar: { title: '不同公园保洁人员分配数量对比', x: ['龙文公园', '龙海公园', '芗城公园', '长泰公园', '漳浦公园'], series: [12, 10, 8, 6, 5] },
  },
  // 1.7.3 绿化待养护
  '绿化待养护': {
    cards: [
      { title: '待养护计划数', value: 14, color: '#409EFF' },
      { title: '病虫害防治计划数', value: 6, color: '#E6A23C' },
      { title: '绿化存活不达标数', value: 2, color: '#F56C6C' },
    ],
    pie1: { title: '养护内容占比', data: [
        { name: '修剪', value: 8 },
        { name: '浇灌', value: 6 },
        { name: '病虫害防治', value: 6 },
        { name: '除草', value: 4 },
      ]},
    pie2: { title: '绿化品类占比', data: [
        { name: '乔木', value: 9 },
        { name: '灌木', value: 7 },
        { name: '草坪', value: 5 },
        { name: '花卉', value: 3 },
      ]},
    bar: { title: '不同公园绿化存活率对比', x: ['龙文公园', '龙海公园', '芗城公园', '长泰公园', '漳浦公园'], series: [96, 94, 92, 97, 95] },
  },
  // 1.7.4 设施待维护
  '设施待维护': {
    cards: [
      { title: '待维护设施数', value: 22, color: '#409EFF' },
      { title: '已派单数', value: 8, color: '#67C23A' },
      { title: '超时未维护数', value: 3, color: '#F56C6C' },
      { title: '设施完好达标数', value: 18, color: '#909399' },
    ],
    pie1: { title: '设施类型损坏占比', data: [
        { name: '休闲座椅', value: 8 },
        { name: '健身器材', value: 6 },
        { name: '照明设施', value: 5 },
        { name: '垃圾桶', value: 3 },
      ]},
    pie2: { title: '维护状态占比', data: [
        { name: '待派单', value: 9 },
        { name: '已派单', value: 8 },
        { name: '维修中', value: 5 },
      ]},
    bar: { title: '不同公园设施待维护数量对比', x: ['龙文公园', '龙海公园', '芗城公园', '长泰公园', '漳浦公园'], series: [7, 5, 4, 3, 3] },
  },
  // 1.7.5 清运待执行
  '清运待执行': {
    cards: [
      { title: '待执行清运计划数', value: 12, color: '#409EFF' },
      { title: '未分配车辆计划数', value: 4, color: '#E6A23C' },
      { title: '分类收集点位配置完成数', value: 35, color: '#67C23A' },
    ],
    pie1: { title: '清运频次分布占比', data: [
        { name: '每日2次', value: 7 },
        { name: '每日1次', value: 4 },
        { name: '隔日1次', value: 1 },
      ]},
    pie2: { title: '所属区域分布占比', data: [
        { name: '龙文区', value: 4 },
        { name: '龙海区', value: 3 },
        { name: '芗城区', value: 3 },
        { name: '长泰区', value: 2 },
        { name: '漳浦县', value: 1 },
      ]},
    bar: { title: '不同公园垃圾收集点位数量对比', x: ['龙文公园', '龙海公园', '芗城公园', '长泰公园', '漳浦公园'], series: [15, 12, 10, 8, 6] },
  },
  // 1.7.6 已完成
  '已完成': {
    cards: [
      { title: '已完成任务总数', value: 428, color: '#409EFF' },
      { title: '环境达标数', value: 23, color: '#67C23A' },
      { title: '绿化存活达标数', value: 22, color: '#E6A23C' },
      { title: '设施完好达标数', value: 21, color: '#F56C6C' },
      { title: '垃圾清运完成率100%数', value: 19, color: '#909399' },
    ],
    pie1: { title: '各任务类型完成量占比', data: [
        { name: '保洁任务', value: 185 },
        { name: '养护任务', value: 98 },
        { name: '维护任务', value: 85 },
        { name: '清运任务', value: 60 },
      ]},
    pie2: { title: '各公园完成量占比', data: [
        { name: '龙文公园', value: 110 },
        { name: '龙海公园', value: 95 },
        { name: '芗城公园', value: 90 },
        { name: '长泰公园', value: 70 },
        { name: '漳浦公园', value: 63 },
      ]},
    bar: { title: '按日已完成任务量对比', x: ['02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28'], series: [58, 62, 60, 68, 72, 70, 75] },
    line: { title: '环境达标率月度趋势变化', x: ['第1周', '第2周', '第3周', '第4周'], series: [94, 95, 96, 97] },
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
      <Bar style="flex:1" :title="mockConfig['保洁待执行'].bar.title" :x-data="mockConfig['保洁待执行'].bar.x" :series-data="[{ name: '分配人数', data: mockConfig['保洁待执行'].bar.series }]" />
    </template>

    <!-- 绿化待养护 -->
    <template v-else-if="activeName === '绿化待养护'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['绿化待养护'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['绿化待养护'].pie1.title" :data="mockConfig['绿化待养护'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['绿化待养护'].pie2.title" :data="mockConfig['绿化待养护'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['绿化待养护'].bar.title" :x-data="mockConfig['绿化待养护'].bar.x" :series-data="[{ name: '存活率', data: mockConfig['绿化待养护'].bar.series }]" />
    </template>

    <!-- 设施待维护 -->
    <template v-else-if="activeName === '设施待维护'">
      <div class="box-left">
        <Indicator class="left-card" v-for="item in mockConfig['设施待维护'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['设施待维护'].pie1.title" :data="mockConfig['设施待维护'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['设施待维护'].pie2.title" :data="mockConfig['设施待维护'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['设施待维护'].bar.title" :x-data="mockConfig['设施待维护'].bar.x" :series-data="[{ name: '待维护数', data: mockConfig['设施待维护'].bar.series }]" />
    </template>

    <!-- 清运待执行 -->
    <template v-else-if="activeName === '清运待执行'">
      <div class="chart-box-left">
        <Indicator class="left-card" v-for="item in mockConfig['清运待执行'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['清运待执行'].pie1.title" :data="mockConfig['清运待执行'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['清运待执行'].pie2.title" :data="mockConfig['清运待执行'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['清运待执行'].bar.title" :x-data="mockConfig['清运待执行'].bar.x" :series-data="[{ name: '点位数量', data: mockConfig['清运待执行'].bar.series }]" />
    </template>

    <!-- 已完成 -->
    <template v-else-if="activeName === '已完成'">
      <div class="box-left-m">
        <Indicator class="left-card" v-for="item in mockConfig['已完成'].cards" :key="item.title" v-bind="item" />
      </div>
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pie1.title" :data="mockConfig['已完成'].pie1.data" />
      <Pie style="flex:1" :title-text="mockConfig['已完成'].pie2.title" :data="mockConfig['已完成'].pie2.data" />
      <Bar style="flex:1" :title="mockConfig['已完成'].bar.title" :x-data="mockConfig['已完成'].bar.x" :series-data="[{ name: '完成量', data: mockConfig['已完成'].bar.series }]" />
      <LineChart style="flex:1" :title="mockConfig['已完成'].line.title" :x-data="mockConfig['已完成'].line.x" :series-data="[{ name: '环境达标率', data: mockConfig['已完成'].line.series }]" y-name="%" :smooth="true" />
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
