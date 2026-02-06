<!-- dailychart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '今日总入场车次', value: '5,280', color: '#4ECDC4' },
    { title: '今日总收费金额', value: '¥121,330', color: '#13ce66' },
    { title: '预警总数', value: 68, color: '#E6A23C' },
    { title: '故障设备数', value: 15, color: '#909399' },
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
        title-text="车场类型入场车次占比"
        :data="[
          { name: '商业停车场', value: 45 },
          { name: '路侧停车', value: 30 },
          { name: '小区停车场', value: 15 },
          { name: '景区停车场', value: 8 },
          { name: '其他类型', value: 2 },
        ]"
      />
      <Columnar
        title="各区域总收费金额对比"
        :x-data="['天河区', '越秀区', '海珠区', '白云区', '黄埔区', '荔湾区', '番禺区']"
        :series-data="[
          { name: '收费金额(万元)', data: [28.75, 15.68, 25.3, 10.2, 21.16, 14.24, 9.36] },
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
