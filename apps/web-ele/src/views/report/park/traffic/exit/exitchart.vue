<!-- exitchart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '今日总出场车次', value: '5,180', color: '#4ECDC4' },
    { title: '早高峰(7-9点)出场数', value: '1,200', color: '#FF6B6B' },
    { title: '晚高峰(17-19点)出场数', value: '1,050', color: '#FFD166' },
    { title: '平峰时段出场数', value: '2,930', color: '#06D6A0' },
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
      title-text="停留时长占比"
      :data="[
          { name: '1小时内', value: 40 },
          { name: '1-3小时', value: 25 },
          { name: '3-6小时', value: 15 },
          { name: '6-12小时', value: 10 },
          { name: '12小时以上', value: 10 },
        ]"
    />
    <Columnar
      title="当日出场车流时段分布"
      :x-data="['早高峰(7-9点)', '午间平峰(10-16点)', '晚高峰(17-19点)', '夜间平峰(20-6点)']"
      :series-data="[
          { name: '出场车流', data: [1200, 1850, 1050, 1080] },
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
