<script setup>
import { reactive } from 'vue';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';

const state = reactive({
  // 五个核心卡片（严格按需求）
  cardList: [
    { title: '总公园数', value: 25, color: '#409EFF' },
    { title: '正常运营数', value: 22, color: '#67C23A' },
    { title: '保洁达标数', value: 20, color: '#E6A23C' },
    { title: '绿化存活达标数', value: 23, color: '#F56C6C' },
    { title: '设施完好数', value: 21, color: '#909399' },
  ],
  // 两个圆环图
  pieData: {
    status: [  // 运营状态占比
      { name: '正常运营', value: 22 },
      { name: '维修改造', value: 2 },
      { name: '暂停开放', value: 1 },
    ],
    area: [   // 所属区域分布占比
      { name: '龙文区', value: 7 },
      { name: '龙海区', value: 6 },
      { name: '芗城区', value: 5 },
      { name: '长泰区', value: 4 },
      { name: '漳浦县', value: 3 },
    ],
  },
  // 基础柱状图：不同公园环境达标率对比
  barData: {
    x: ['龙文公园', '龙海公园', '芗城公园', '长泰公园', '漳浦公园'],
    series: [96, 92, 88, 94, 90], // 达标率 %
  },
});
</script>

<template>
  <div class="chart-box">
    <div class="box-left-m" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>

    <!-- 运营状态占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="运营状态占比"
      :data="state.pieData.status"
    />

    <!-- 所属区域分布占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="所属区域分布占比"
      :data="state.pieData.area"
    />

    <!-- 基础柱状图：不同公园环境达标率对比 -->
    <Bar
      style="flex: 1 !important;"
      title="不同公园环境达标率对比"
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
}
</style>
