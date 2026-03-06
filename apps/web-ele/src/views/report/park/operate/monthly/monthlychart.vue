<!-- monthlychart.vue - 修改为月度图表 -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '月度总入场车次', value: '158,400', color: '#4ECDC4' },
    { title: '月度总收费金额', value: '¥3,639,900', color: '#13ce66' },
    { title: '月均泊位利用率', value: '76.8%', color: '#E6A23C' },
    { title: '故障处置率', value: '92.5%', color: '#FF6B8B' },
  ],
});
</script>

<template>
  <div class="park-chart-box park-district-chart">
    <div class="chart-box-left">
      <Card
        class="left-card"
        v-for="item in state.cardList"
        :key="item.title"
        v-bind="item"
      />
    </div>
      <Circle
        title-text="各区域收入占比"
        :data="[
          { name: '天河区', value: 32 },
          { name: '越秀区', value: 18 },
          { name: '海珠区', value: 22 },
          { name: '白云区', value: 12 },
          { name: '黄埔区', value: 10 },
          { name: '其他区域', value: 6 },
        ]"
      />
      <Columnar
        title="近6个月总收费金额趋势(万元)"
        :x-data="['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02']"
        :series-data="[
          { name: '收费金额', data: [28.3, 32.5, 30.8, 35.2, 33.7, 36.4] },
        ]"
        :y-name="'金额(万元)'"
      />
    </div>
</template>

<style lang="scss">
.park-district-chart {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;

  .chart-box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    max-width: 100%;
    height: 100%;

    .left-card {
      height: 159px !important;
    }
  }
}
</style>
