<!-- equipmentchart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
// import LineChart from '#/components/stats/line.vue';

const state = reactive({
  cardList: [
    { title: '总设备数', value: '3,240', color: '#4ECDC4' },
    { title: '在线设备数', value: '3,040', color: '#06D6A0' },
    { title: '故障设备数', value: '65', color: '#FF6B6B' },
    { title: '平均在线率', value: '93.8%', color: '#FFD166' },
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
      title-text="设备运行状态占比"
      :data="[
          { name: '在线', value: 93.8 },
          { name: '离线', value: 3.5 },
          { name: '故障', value: 2.0 },
          { name: '维护中', value: 0.7 },
        ]"
    />
    <Circle
      title-text="设备类型占比"
      :data="[
          { name: '摄像头', value: 35 },
          { name: '道闸', value: 25 },
          { name: '地磁', value: 20 },
          { name: '充电桩', value: 12 },
          { name: '显示屏', value: 8 },
        ]"
    />
<!--    <LineChart-->
<!--      title="近7天设备在线率趋势"-->
<!--      :x-data="['02-01', '02-02', '02-03', '02-04', '02-05', '02-06', '02-07']"-->
<!--      :series-data="[-->
<!--          { name: '在线率', data: [93.5, 93.8, 93.2, 93.6, 94.0, 93.7, 93.9] },-->
<!--        ]"-->
<!--    />-->
    <Columnar
      title="各区域设备在线率对比"
      :x-data="['天河区', '越秀区', '海珠区', '白云区', '黄埔区', '荔湾区', '番禺区']"
      :series-data="[
          { name: '在线率', data: [93.3, 92.9, 94.1, 93.8, 94.4, 93.2, 94.6] },
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
