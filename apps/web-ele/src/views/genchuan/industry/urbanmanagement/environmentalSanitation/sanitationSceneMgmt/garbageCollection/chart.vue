<script setup>
import { reactive } from 'vue';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';

const state = reactive({
  cardList: [
    {title: '总计划数', value: 10, color: '#409EFF'},
    {title: '执行中计划数', value: 2, color: '#c8ce13'},
    {title: '已完成计划数', value: 2, color: '#67C23A'},
    {title: '异常计划数', value: 4, color: '#F56C6C'},
  ],
  pieData: {
    type: [
      {name: '其他垃圾', value: 4},
      {name: '厨余垃圾', value: 3},
      {name: '可回收物', value: 2},
      {name: '有害垃圾', value: 1},
    ],
    status: [
      {name: '计划待执行', value: 2},
      {name: '作业进行中', value: 2},
      {name: '异常待处置', value: 2},
      {name: '处置待复核', value: 2},
      {name: '已完成', value: 2},
    ],
    area: [
      {name: '龙文区', value: 3},
      {name: '龙海区', value: 2},
      {name: '芗城区', value: 2},
      {name: '长泰区', value: 2},
      {name: '漳浦县', value: 1},
    ],
  },
  barData: {
    x: ['龙文区', '龙海区', '芗城区', '长泰区', '漳浦县'],
    series: [85, 62, 78, 91, 44],
  },
});
</script>

<template>
  <div class="chart-box">
      <div class="box-left" style="flex: 1 !important;">
        <Indicator
          class="left-card"
          v-for="item in state.cardList"
          :key="item.title"
          v-bind="item"
        />
      </div>
      <Pie
        style="flex: 1 !important;"
        title-text="收运品类占比"
        :data="state.pieData.type"
      />
      <Pie
        style="flex: 1 !important;"
        title-text="计划状态占比"
        :data="state.pieData.status"
      />
      <Pie
        style="flex: 1 !important;"
        title-text="区域分布占比"
        :data="state.pieData.area"
      />
      <Bar
        style="flex: 1 !important;"
        title="不同区域收运完成率对比"
        :x-data="state.barData.x"
        :series-data="[{ name: '完成率', data: state.barData.series }]"
      />
  </div>
</template>

<style scoped lang="scss">
.chart-box {
  padding-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right: 15px;
  width: 100% !important;

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
}
</style>
