<script setup>
import { reactive } from 'vue';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';

// 符合 1.6.1 全部模块的模拟数据
const state = reactive({
  // 四个核心卡片
  cardList: [
    { title: '总商业街数', value: 18, color: '#409EFF' },
    { title: '保洁覆盖达标数', value: 15, color: '#67C23A' },
    { title: '设施完好数', value: 16, color: '#E6A23C' },
    { title: '收运完成数', value: 14, color: '#F56C6C' },
  ],
  // 两个圆环图
  pieData: {
    area: [  // 区域分布占比
      { name: '龙文区', value: 5 },
      { name: '龙海区', value: 4 },
      { name: '芗城区', value: 4 },
      { name: '长泰区', value: 3 },
      { name: '漳浦县', value: 2 },
    ],
    status: [  // 运营状态占比
      { name: '正常运营', value: 12 },
      { name: '暂停运营', value: 4 },
      { name: '在建', value: 2 },
    ],
  },
  // 基础柱状图：不同商业街问题处置时长对比
  barData: {
    x: ['龙文商业街', '龙海商业街', '芗城商业街', '长泰商业街', '漳浦商业街'],
    series: [45, 52, 38, 41, 33], // 单位：分钟
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

    <!-- 区域分布占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="区域分布占比"
      :data="state.pieData.area"
    />

    <!-- 运营状态占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="运营状态占比"
      :data="state.pieData.status"
    />

    <!-- 基础柱状图：不同商业街问题处置时长对比 -->
    <Bar
      style="flex: 1 !important;"
      title="不同商业街问题处置时长对比"
      :x-data="state.barData.x"
      :series-data="[{ name: '处置时长(分钟)', data: state.barData.series }]"
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
