<!-- vacancychart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总空置泊位数', value: '620', color: '#FF6B6B' },
    { title: '故障空置泊位', value: '185', color: '#FFD166' },
    { title: '长期空置泊位', value: '105', color: '#06D6A0' },
    { title: '平均空置率', value: '16.8%', color: '#4ECDC4' },
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
      title-text="空置原因占比"
      :data="[
          { name: '维护保养', value: 35 },
          { name: '设备故障', value: 25 },
          { name: '车场改造', value: 20 },
          { name: '临时关闭', value: 15 },
          { name: '正常轮换', value: 5 },
        ]"
    />
    <Columnar
      title="各区域空置泊位数对比"
      :x-data="['天河区', '越秀区', '海珠区', '白云区', '黄埔区', '荔湾区', '番禺区']"
      :series-data="[
          { name: '空置泊位数', data: [85, 42, 68, 52, 28, 35, 46] },
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
