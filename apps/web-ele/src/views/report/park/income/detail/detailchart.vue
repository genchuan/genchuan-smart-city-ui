<!-- detailchart.vue - 收入明细图表版本 -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总订单笔数', value: '8', color: '#4ECDC4' },
    { title: '总实收金额', value: '¥365', color: '#FF6B6B' },
    { title: '平均订单金额', value: '¥45.63', color: '#FFD166' },
    { title: '总优惠金额', value: '¥65', color: '#06D6A0' },
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
          { name: '微信支付', value: 37.5 },
          { name: '支付宝', value: 37.5 },
          { name: '银联支付', value: 12.5 },
          { name: '现金支付', value: 12.5 },
        ]"
    />
    <Circle
      title-text="优惠类型占比"
      :data="[
          { name: '满减优惠', value: 40 },
          { name: '时段优惠', value: 30 },
          { name: '会员折扣', value: 20 },
          { name: '无优惠', value: 10 },
        ]"
    />
    <Columnar
      title="各车场收入对比"
      :x-data="['天河城停车场', '正佳广场停车场', '体育中心停车场', '越秀公园停车场', '海珠广场停车场']"
      :series-data="[
          { name: '实收金额', data: [130, 130, 30, 55, 20] },
        ]"
      height="300px"
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
