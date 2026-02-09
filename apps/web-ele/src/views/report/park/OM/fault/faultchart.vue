<!-- entrychart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '总故障次数', value: '156', color: '#FF6B6B' },
    { title: '重复故障数', value: '28', color: '#FFD166' },
    { title: '平均处置时长', value: '5.8小时', color: '#4ECDC4' },
    { title: '平均处置率', value: '95.2%', color: '#06D6A0' },
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
      title-text="故障类型占比"
      :data="[
          { name: '网络故障', value: 35 },
          { name: '机械故障', value: 25 },
          { name: '通信故障', value: 15 },
          { name: '电源故障', value: 12 },
          { name: '显示故障', value: 8 },
          { name: '其他故障', value: 5 },
        ]"
    />
    <Circle
      title-text="故障等级占比"
      :data="[
          { name: '一级故障', value: 25 },
          { name: '二级故障', value: 40 },
          { name: '三级故障', value: 30 },
          { name: '四级故障', value: 5 },
        ]"
    />
    <Columnar
      title="各设备类型故障次数对比"
      :x-data="['摄像头', '道闸', '地磁', '充电桩', '显示屏', '监控主机']"
      :series-data="[
          { name: '故障次数', data: [85, 75, 25, 26, 20, 15] },
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
