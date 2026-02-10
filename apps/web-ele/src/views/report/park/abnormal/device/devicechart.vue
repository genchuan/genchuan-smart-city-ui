<!-- faultchart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';
import LineChart from '#/components/stats/line.vue';

const state = reactive({
  cardList: [
    { title: '今日故障数', value: '3', color: '#FF6B6B' },
    { title: '待处理故障', value: '4', color: '#E6A23C' },
    { title: '处理中故障', value: '3', color: '#4ECDC4' },
    { title: '故障处理率', value: '41.7%', color: '#06D6A0' },
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
    <div class="chart-row">
      <Circle
        title-text="故障类型占比"
        :data="[
          { name: '硬件故障', value: 33 },
          { name: '软件故障', value: 25 },
          { name: '网络故障', value: 25 },
          { name: '电源故障', value: 17 },
        ]"
        class="chart-item"
      />
      <Circle
        title-text="处置状态占比"
        :data="[
          { name: '待处理', value: 33 },
          { name: '处理中', value: 25 },
          { name: '已处理', value: 42 },
        ]"
        class="chart-item"
      />
    </div>
      <Columnar
        title="各区域故障设备数对比"
        :x-data="['天河区', '越秀区', '海珠区', '白云区', '黄埔区', '荔湾区', '番禺区']"
        :series-data="[
          { name: '故障数', data: [3, 2, 2, 2, 1, 1, 1] },
        ]"
        class="chart-item"
      />
    <LineChart
      title="近30天故障发生趋势"
      :x-data="['01-30', '01-31', '02-01', '02-02', '02-03', '02-04', '02-05']"
      :series-data="[
        { name: '故障数', data: [1, 1, 1, 1, 1, 2, 3] },
      ]"
    />
      <Columnar
        title="各设备类型故障次数对比"
        :x-data="['入口道闸', '出口道闸', '车位相机', '监控摄像头', '支付终端', 'LED显示屏']"
        :series-data="[
          { name: '故障次数', data: [3, 2, 2, 2, 2, 1] },
        ]"
        class="chart-item"
      />

  </div>
</template>

<style lang="scss">
.park-district-chart {
  .chart-box-left {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    max-width: 100%;
    height: 100%;
    .left-card {
      height: 159px !important;
    }
  }

  .chart-row {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 16px;
    margin-bottom: 16px;

    .chart-item {
      min-width: 200px !important;
      height: 300px;
    }
  }

  .district-columnar {
    min-width: 200px !important;
  }
}
</style>
