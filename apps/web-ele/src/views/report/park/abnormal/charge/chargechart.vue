<!-- chargechart.vue -->
<script setup>
import { reactive } from 'vue';

import Card from '#/components/stats/card.vue';
import Circle from '#/components/stats/circle.vue';
import Columnar from '#/components/stats/columnar.vue';

const state = reactive({
  cardList: [
    { title: '今日异常数', value: '3', color: '#FF6B6B' },
    { title: '异常处置完成率', value: '85.2%', color: '#4ECDC4' },
    { title: '纠错成功率', value: '92.3%', color: '#06D6A0' },
    { title: '待处理异常', value: '4', color: '#E6A23C' },
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
        title-text="异常类型占比"
        :data="[
          { name: '重复收费', value: 33 },
          { name: '少收费', value: 25 },
          { name: '多收费', value: 25 },
          { name: '未收费', value: 17 },
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
      title="各区域收费异常数对比"
      :x-data="['天河区', '越秀区', '海珠区', '白云区', '黄埔区', '荔湾区', '番禺区']"
      :series-data="[
        { name: '异常数', data: [3, 2, 2, 2, 1, 1, 1] },
      ]"
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
