<script setup>
import { reactive } from 'vue';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';

const state = reactive({
  cardList: [
    { title: '总公厕数', value: 10, color: '#409EFF' },
    { title: '正常运营数', value: 8, color: '#67C23A' },
    { title: '保洁达标数', value: 7, color: '#E6A23C' },
    { title: '无投诉数', value: 6, color: '#F56C6C' },
  ],
  pieData: {
    status: [
      { name: '保洁待执行', value: 2 },
      { name: '物资待补充', value: 2 },
      { name: '投诉待处置', value: 2 },
      { name: '设施待维修', value: 2 },
      { name: '已完成', value: 2 },
    ],
    area: [
      { name: '龙文区', value: 3 },
      { name: '龙海区', value: 2 },
      { name: '芗城区', value: 2 },
      { name: '长泰区', value: 2 },
      { name: '漳浦县', value: 1 },
    ],
  },
  barData: {
    x: ['龙文区', '龙海区', '芗城区', '长泰区', '漳浦县'],
    series: [98, 95, 92, 94, 100], // 保洁达标率
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
      title-text="运营状态占比"
      :data="state.pieData.status"
    />
    <Pie
      style="flex: 1 !important;"
      title-text="区域分布占比"
      :data="state.pieData.area"
    />
    <Bar
      style="flex: 1 !important;"
      title="不同区域保洁达标率对比"
      :x-data="state.barData.x"
      :series-data="[{ name: '达标率', data: state.barData.series }]"
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
