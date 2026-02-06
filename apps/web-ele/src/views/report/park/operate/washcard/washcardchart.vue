<!-- washcard/washcardchart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '洗车卡发放总数', value: '8,520', color: '#4ECDC4' },
    { title: '洗车卡使用次数', value: '7,280', color: '#13ce66' },
    { title: '洗车卡兑换率', value: '85.4%', color: '#E6A23C' },
    { title: '已过期洗车卡数', value: 250, color: '#909399' },
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
      title-text="洗车卡状态占比"
      :data="[
          { name: '正常', value: 78 },
          { name: '已过期', value: 15 },
          { name: '已停用', value: 5 },
          { name: '未激活', value: 2 },
        ]"
    />
    <Columnar
      title="各区域洗车卡使用次数对比"
      :x-data="['天河区', '越秀区', '海珠区', '白云区', '黄埔区', '荔湾区', '番禺区']"
      :series-data="[
          { name: '使用次数', data: [980, 720, 550, 750, 620, 650, 780] },
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
