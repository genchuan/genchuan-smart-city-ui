<!-- escapechart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '今日逃费订单数', value: '3', color: '#FF6B6B' },
    { title: '累计逃费金额', value: '¥360.50', color: '#F56C6C' },
    { title: '待追缴订单数', value: '4', color: '#E6A23C' },
    { title: '已追缴金额', value: '¥380.00', color: '#67C23A' },
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
      title-text="逃费等级占比"
      :data="[
          { name: '一级逃费', value: 40 },
          { name: '二级逃费', value: 35 },
          { name: '三级逃费', value: 25 },
        ]"
    />
    <Columnar
      title="各区域逃费金额对比"
      :x-data="['天河区', '越秀区', '海珠区', '白云区', '黄埔区', '荔湾区', '番禺区']"
      :series-data="[
          { name: '逃费金额', data: [325.5, 265.5, 270, 135, 95.5, 75, 200] },
        ]"
    />
  </div>
</template>
<style lang="scss">
.park-district-chart {
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
  .district-columnar {
    min-width: 200px !important;
  }
}
</style>
