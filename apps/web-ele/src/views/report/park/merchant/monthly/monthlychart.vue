<!-- monthlychart.vue - 修改为商户月度图表 -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '月度总营收', value: '¥3,639,900', color: '#13ce66' },
    { title: '月度总订单数', value: '158,400', color: '#4ECDC4' },
    { title: '月均利用率', value: '76.8%', color: '#E6A23C' },
    { title: '环比增长率', value: '4.3%', color: '#FF6B8B' },
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
        title-text="各车场营收占比"
        :data="[
          { name: '天河商贸停车场', value: 32 },
          { name: '海珠购物中心停车场', value: 22 },
          { name: '越秀路侧停车区', value: 18 },
          { name: '黄埔商业停车场', value: 10 },
          { name: '白云小区停车场', value: 8 },
          { name: '其他车场', value: 10 },
        ]"
      />
      <Columnar
        title="近6个月商户营收趋势(万元)"
        :x-data="['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02']"
        :series-data="[
          { name: '营收金额', data: [28.3, 32.5, 30.8, 35.2, 33.7, 36.4] },
        ]"
        :y-name="'金额(万元)'"
      />
  </div>
</template>

<style lang="scss">
.park-district-chart {
  .chart-box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr); /* 每行2列，每列宽度均分 */
    gap: 16px; /* 卡片之间的间距（水平+垂直），可自定义 */
    max-width: 100%; /* 防止溢出 */
    height: 100%;
    .left-card {
      height: 159px !important;
    }
  }
  .district-columnar {
    min-width: 200px !important;
  }
}
</style>
