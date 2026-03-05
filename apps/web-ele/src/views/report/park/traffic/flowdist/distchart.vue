<!-- entrychart.vue  -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '今日总车流量', value: '6,200', color: '#4ECDC4' },
    { title: '热点区域数量', value: '8个', color: '#FF6B6B' },
    { title: '平均车流量', value: '515', color: '#FFD166' },
    { title: '高峰期占比', value: '45%', color: '#06D6A0' },
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
      title-text="车场类型车流占比"
      :data="[
          { name: '商业停车场', value: 52 },
          { name: '路侧停车', value: 28 },
          { name: '小区停车场', value: 15 },
          { name: '景区停车场', value: 5 },
        ]"
    />
    <Columnar
      title="各区域车流量对比"
      :x-data="['天河区', '越秀区', '海珠区', '白云区', '黄埔区', '荔湾区', '番禺区']"
      :series-data="[
          { name: '总车流量', data: [1250, 980, 1100, 850, 920, 890, 780] },
          { name: '平均车流量', data: [625, 490, 550, 425, 460, 445, 390] },
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
