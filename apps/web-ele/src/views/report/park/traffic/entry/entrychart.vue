<!-- entrychart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '今日总入场车次', value: '5,280', color: '#4ECDC4' },
    { title: '早高峰(7-9点)入场数', value: '1,250', color: '#FF6B6B' },
    { title: '晚高峰(17-19点)入场数', value: '1,100', color: '#FFD166' },
    { title: '平峰时段入场数', value: '2,930', color: '#06D6A0' },
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
      title-text="车型入场占比"
      :data="[
          { name: '小型车', value: 65 },
          { name: '中型车', value: 20 },
          { name: '大型车', value: 10 },
          { name: '新能源车', value: 5 },
        ]"
    />
    <Columnar
      title="当日入场车流时段分布"
      :x-data="['早高峰(7-9点)', '午间平峰(10-16点)', '晚高峰(17-19点)', '夜间平峰(20-6点)']"
      :series-data="[
          { name: '入场车流', data: [1250, 1850, 1100, 1080] },
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
