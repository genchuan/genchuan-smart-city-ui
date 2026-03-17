<script setup>
import { reactive } from 'vue';
import Indicator from '#/components/stats/indicator.vue';
import Pie from '#/components/stats/pie.vue';
import Bar from '#/components/stats/bar.vue';
import LineChart from '#/components/stats/lineChart.vue';

const state = reactive({
  // 四个核心卡片
  cardList: [
    { title: '总转运站数', value: 24, color: '#409EFF' },
    { title: '正常运营数', value: 18, color: '#67C23A' },
    { title: '设备正常数', value: 42, color: '#E6A23C' },      // 设备总数维度
    { title: '环境达标数', value: 20, color: '#F56C6C' },
  ],
  // 两个圆环图
  pieData: {
    status: [  // 运营状态占比
      { name: '正常运营', value: 18 },
      { name: '暂停运营', value: 4 },
      { name: '在建中', value: 2 },
    ],
    area: [   // 区域分布占比
      { name: '龙文区', value: 6 },
      { name: '龙海区', value: 5 },
      { name: '芗城区', value: 5 },
      { name: '长泰区', value: 4 },
      { name: '漳浦县', value: 4 },
    ],
  },
  // 基础柱状图：不同转运站日转运量对比
  barData: {
    x: ['龙文站', '龙海站', '芗城站', '长泰站', '漳浦站'],
    series: [120, 95, 110, 85, 70], // 日转运量（吨）
  },
  // 基础折线图：近7日环境指标变化趋势（以异味浓度为例）
  lineData: {
    x: ['02-22', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28'],
    series: [12, 15, 11, 13, 14, 10, 9], // 异味浓度（ppm）
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

    <!-- 运营状态占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="运营状态占比"
      :data="state.pieData.status"
    />

    <!-- 区域分布占比圆环图 -->
    <Pie
      style="flex: 1 !important;"
      title-text="区域分布占比"
      :data="state.pieData.area"
    />

    <!-- 基础柱状图：转运站日转运量对比 -->
    <Bar
      style="flex: 1 !important;"
      title="不同转运站日转运量对比"
      :x-data="state.barData.x"
      :series-data="[{ name: '日转运量(吨)', data: state.barData.series }]"
    />

    <!-- 新增基础折线图：近7日环境指标变化趋势 -->
    <LineChart
      style="flex: 1 !important;"
      title="近7日环境指标变化趋势"
      :x-data="state.lineData.x"
      :series-data="[{ name: '异味浓度(ppm)', data: state.lineData.series }]"
      y-name="ppm"
      :smooth="true"
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
