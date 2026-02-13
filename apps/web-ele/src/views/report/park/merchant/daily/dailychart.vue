<!-- dailychart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '今日入场车流量', value: '5,280', color: '#4ECDC4' },
    { title: '今日营收总额', value: '¥121,330', color: '#13ce66' },
    { title: '今日订单数', value: '5,245', color: '#E6A23C' },
    { title: '平均利用率', value: '78.5%', color: '#409EFF' },
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
      title-text="各商户营收占比"
      :data="[
        { name: '万达广场停车场', value: 28 },
        { name: '越秀商厦停车场', value: 15 },
        { name: '海珠城停车场', value: 25 },
        { name: '黄埔商业中心', value: 21 },
        { name: '其他商户', value: 11 },
      ]"
    />
    <Columnar
      title="各商户营收对比(万元)"
      :x-data="[
        '万达广场',
        '海珠城',
        '黄埔商业中心',
        '越秀商厦',
        '白云小区',
        '荔湾路边',
        '番禺小区',
      ]"
      :series-data="[
        {
          name: '营收金额(万元)',
          data: [28.75, 25.3, 21.16, 15.68, 10.2, 14.24, 9.36],
        },
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
