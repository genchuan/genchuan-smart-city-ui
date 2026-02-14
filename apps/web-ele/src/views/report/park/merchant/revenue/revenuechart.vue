<!-- revenuechart.vue - 商户营收报表图表组件 -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总营收金额', value: '¥3,850,650', color: '#4ECDC4' },
    { title: '商户分成金额', value: '¥2,695,455', color: '#13ce66' },
    { title: '平台分成金额', value: '¥770,130', color: '#E6A23C' },
    { title: '平均到账率', value: '85.2%', color: '#409EFF' },
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
      title-text="营收构成占比"
      :data="[
        { name: '停车费收入', value: 65 },
        { name: '车位租赁', value: 20 },
        { name: '广告收入', value: 8 },
        { name: '充电服务费', value: 5 },
        { name: '增值服务', value: 2 },
      ]"
    />
    <Columnar
      title="各结算周期营收对比"
      :x-data="['1月', '2月第1周', '2月第2周', '2月第3周', '2月第4周', '2月总计']"
      :series-data="[
        { name: '总营收(万元)', data: [320.5, 185.6, 168.3, 175.2, 182.7, 711.8] },
        { name: '商户分成(万元)', data: [224.4, 129.9, 117.8, 122.6, 127.9, 498.2] },
        { name: '平台分成(万元)', data: [64.1, 37.1, 33.7, 35.0, 36.5, 142.3] },
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
