<!-- exitchart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import Line from '#/components/stats/line.vue';

const state = reactive({
  cardList: [
    { title: '今日总出场车次', value: '5,160', color: '#4ECDC4' },
    { title: '早高峰(7-9点)出场数', value: '1,180', color: '#FF6B6B' },
    { title: '晚高峰(17-19点)出场数', value: '1,060', color: '#FFD166' },
    { title: '平均周转率', value: '78.5%', color: '#06D6A0' },
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
          { name: '0.5-1小时', value: 25 },
          { name: '1-2小时', value: 35 },
          { name: '2-4小时', value: 20 },
          { name: '4-8小时', value: 15 },
          { name: '8小时以上', value: 5 },
        ]"
    />
    <Columnar
      title="当日出场车流时段分布"
      :x-data="['早高峰(7-9点)', '午间平峰(10-16点)', '晚高峰(17-19点)', '夜间平峰(20-6点)']"
      :series-data="[
          { name: '出场车流', data: [1180, 1750, 1060, 1170] },
        ]"
    />
    <Line
      title="近7天车流周转率趋势"
      :x-data="['02-01', '02-02', '02-03', '02-04', '02-05', '02-06', '02-07']"
      :series-data="[
          {
            name: '周转率',
            data: [78, 82, 79, 85, 81, 83, 80],
            type: 'line',
            smooth: true
          },
        ]"
      :y-axis-formatter="'{value}%'"
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
