<!-- occupancychart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总泊位数', value: '2,850', color: '#4ECDC4' },
    { title: '占用泊位数', value: '2,120', color: '#FF6B6B' },
    { title: '空闲泊位数', value: '730', color: '#06D6A0' },
    { title: '超时长占用数', value: '165', color: '#FFD166' },
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
      title-text="泊位类型占比"
      :data="[
          { name: '标准泊位', value: 60 },
          { name: '临时泊位', value: 20 },
          { name: '充电泊位', value: 12 },
          { name: '无障碍泊位', value: 5 },
          { name: '货车泊位', value: 3 },
        ]"
    />
    <Columnar
      title="近24小时泊位占用率趋势"
      :x-data="['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']"
      :series-data="[
          { name: '占用率', data: [45, 38, 85, 70, 90, 65] },
        ]"
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
