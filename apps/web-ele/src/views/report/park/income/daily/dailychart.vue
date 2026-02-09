<!-- entrychart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '今日总收费金额', value: '¥428,200', color: '#4ECDC4' },
    { title: '今日订单总数', value: '5,280', color: '#FF6B6B' },
    { title: '平均客单价', value: '¥81.11', color: '#FFD166' },
    { title: '线上支付占比', value: '85.4%', color: '#06D6A0' },
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
      title-text="支付方式占比"
      :data="[
          { name: '微信支付', value: 45 },
          { name: '支付宝', value: 30 },
          { name: '现金支付', value: 15 },
          { name: 'ETC支付', value: 8 },
          { name: '银行卡', value: 2 },
        ]"
    />
    <Columnar
      title="各区域日收入对比"
      :x-data="['天河区', '越秀区', '海珠区', '白云区', '黄埔区', '荔湾区', '番禺区']"
      :series-data="[
          { name: '日收入(元)', data: [125800, 78400, 110000, 51000, 92000, 53400, 62400] },
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
