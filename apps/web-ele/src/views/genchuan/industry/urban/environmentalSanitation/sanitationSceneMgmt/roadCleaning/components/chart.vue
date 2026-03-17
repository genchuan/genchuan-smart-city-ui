<script setup>
import {reactive} from 'vue';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';

const state = reactive({
  cardList: [
    {title: '总计划数', value: 10, color: '#409EFF'},
    {title: '执行中计划数', value: 2, color: '#c8ce13'},
    {title: '质量达标数', value: 7, color: '#67C23A'},
    {title: '全勤人员数', value: 8, color: '#F56C6C'},
  ],
  pieData: {
    status: [
      {name: '清扫待执行', value: 2},
      {name: '作业进行中', value: 2},
      {name: '问题待处置', value: 2},
      {name: '质量待核查', value: 2},
      {name: '已完成', value: 2},
    ],
    roadType: [
      {name: '主干道', value: 5},
      {name: '次干道', value: 3},
      {name: '支路', value: 2},
    ],
  },
  barData: {
    x: ['龙文区', '龙海区', '芗城区', '长泰区', '漳浦县'],
    series: [98, 95, 92, 96, 100], // 清扫质量达标率
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
      title-text="计划状态占比"
      :data="state.pieData.status"
    />
    <Pie
      style="flex: 1 !important;"
      title-text="路段类型占比"
      :data="state.pieData.roadType"
    />
    <Bar
      style="flex: 1 !important;"
      title="不同区域清扫质量达标率对比"
      :x-data="state.barData.x"
      :series-data="[{ name: '质量达标率', data: state.barData.series }]"
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
