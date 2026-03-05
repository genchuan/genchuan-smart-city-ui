<!-- usageratechart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
// import LineChart from '#/components/stats/line.vue';

const state = reactive({
  cardList: [
    { title: '平均利用率', value: '73.5%', color: '#4ECDC4' },
    { title: '高峰时段利用率', value: '86.8%', color: '#FF6B6B' },
    { title: '总可用时长', value: '28,560h', color: '#06D6A0' },
    { title: '总占用时长', value: '20,920h', color: '#FFD166' },
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
      title-text="泊位类型利用率占比"
      :data="[
          { name: '标准泊位', value: 65 },
          { name: '临时泊位', value: 20 },
          { name: '充电泊位', value: 10 },
          { name: '无障碍泊位', value: 5 },
        ]"
    />
<!--    <LineChart-->
<!--      title="近7日利用率趋势"-->
<!--      :x-data="['02-01', '02-02', '02-03', '02-04', '02-05', '02-06', '02-07']"-->
<!--      :series-data="[-->
<!--          { name: '利用率', data: [72.5, 74.2, 73.8, 71.9, 73.5, 72.8, 73.2] },-->
<!--        ]"-->
<!--    />-->
    <Columnar
      title="各区域利用率对比"
      :x-data="['天河区', '越秀区', '海珠区', '白云区', '黄埔区', '荔湾区', '番禺区']"
      :series-data="[
          { name: '利用率', data: [71.1, 75.0, 76.3, 75.0, 75.0, 75.0, 75.0] },
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
