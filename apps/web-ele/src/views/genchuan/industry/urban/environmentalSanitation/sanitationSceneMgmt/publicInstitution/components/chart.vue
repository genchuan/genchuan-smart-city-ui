<script setup>
import { reactive } from 'vue';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';

const state = reactive({
  // 四个核心卡片
  cardList: [
    { title: '总机构数', value: 32, color: '#409EFF' },
    { title: '保洁达标数', value: 28, color: '#67C23A' },
    { title: '问题办结数', value: 24, color: '#E6A23C' },
    { title: '核查通过数', value: 26, color: '#F56C6C' },
  ],
  // 两个圆环图
  pieData: {
    type: [  // 机构类型占比
      { name: '学校', value: 12 },
      { name: '医院', value: 8 },
      { name: '机关单位', value: 7 },
      { name: '商场', value: 5 },
    ],
    area: [  // 区域分布占比
      { name: '龙文区', value: 9 },
      { name: '龙海区', value: 7 },
      { name: '芗城区', value: 6 },
      { name: '长泰区', value: 5 },
      { name: '漳浦县', value: 5 },
    ],
  },
  // 基础柱状图：不同类型机构保洁达标率对比
  barData: {
    x: ['学校', '医院', '机关单位', '商场'],
    series: [96, 92, 88, 94], // 达标率 %
  },
});
</script>

<template>
  <div class="chart-box">
    <!-- 左侧卡片区域：四个指标卡片，网格布局 -->
    <div class="box-left" style="flex: 1 !important;">
      <Indicator
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>

    <!-- 机构类型占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="机构类型占比"
      :data="state.pieData.type"
    />

    <!-- 区域分布占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="区域分布占比"
      :data="state.pieData.area"
    />

    <!-- 基础柱状图：不同类型机构保洁达标率对比 -->
    <Bar
      style="flex: 1 !important;"
      title="不同类型机构保洁达标率对比"
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
